import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const { createProjectSkillInstallStateEntry, inspectProjectSkillReplaceSafety } = await import(
  process.env.VASIR_TEST_INSTALL_STATE_MODULE || new URL("../cli/project-install-state.js", import.meta.url).href
);

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vasir-nested-safety-"));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    assert.match(path.basename(directory), /^vasir-nested-safety-/);
    assert.equal(fs.lstatSync(directory).isSymbolicLink(), false);
    fs.rmSync(directory, { recursive: true, force: true });
  });
  fs.mkdirSync(path.join(directory, "references"));
  fs.writeFileSync(path.join(directory, "SKILL.md"), "# Reviewed test skill\n");
  fs.writeFileSync(path.join(directory, "references", "guide.md"), "Original managed content\n");
  const entry = createProjectSkillInstallStateEntry({
    targetSkillDirectory: directory,
    managedRelativeFilePaths: ["SKILL.md", "references/guide.md"]
  });
  const inspect = () => inspectProjectSkillReplaceSafety({
    projectInstallState: { skills: { "test-skill": entry } },
    skillName: "test-skill",
    targetSkillDirectory: directory
  });
  return { directory, entry, inspect };
}

test("clean tracked nested files can be safely refreshed on the real host filesystem", (t) => {
  const { entry, inspect } = fixture(t);
  assert.equal(inspect().ok, true);
  assert.deepEqual(entry.managedFiles, ["SKILL.md", "references/guide.md"]);
});

test("an edited nested managed file remains blocked by its content hash", (t) => {
  const { directory, inspect } = fixture(t);
  fs.writeFileSync(path.join(directory, "references", "guide.md"), "Local edit\n");
  const result = inspect();
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "PROJECT_SKILL_MODIFIED");
  assert.deepEqual(result.error.context.modifiedRelativeFilePaths, ["references/guide.md"]);
});

test("a missing nested managed file remains blocked by the exact inventory", (t) => {
  const { directory, inspect } = fixture(t);
  fs.unlinkSync(path.join(directory, "references", "guide.md"));
  const result = inspect();
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "PROJECT_SKILL_MODIFIED");
  assert.deepEqual(result.error.context.missingRelativeFilePaths, ["references/guide.md"]);
});

test("an unexpected nested file remains blocked and is left untouched", (t) => {
  const { directory, inspect } = fixture(t);
  const extra = path.join(directory, "references", "local.md");
  fs.writeFileSync(extra, "User-owned extra\n");
  const result = inspect();
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "PROJECT_SKILL_MODIFIED");
  assert.deepEqual(result.error.context.unexpectedRelativeFilePaths, ["references/local.md"]);
  assert.equal(fs.readFileSync(extra, "utf8"), "User-owned extra\n");
});
