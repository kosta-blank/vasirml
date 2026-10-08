import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
// Also allow direct testing of the durable overlay before release generation.
const catalogRoot = fs.existsSync(path.join(packageRoot, "registry.json"))
  ? packageRoot : path.resolve(packageRoot, "../../output/vasir-slim");
const canonicalGroups = JSON.parse(fs.readFileSync(path.join(packageRoot, "skill-groups.json"), "utf8"));

function snapshot(directory) {
  const files = {};
  function visit(current, relative = "") {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const name = path.join(relative, entry.name);
      const absolute = path.join(current, entry.name);
      if (entry.isSymbolicLink()) files[name] = `link:${fs.readlinkSync(absolute)}`;
      else if (entry.isDirectory()) { files[name] = "directory"; visit(absolute, name); }
      else files[name] = fs.readFileSync(absolute).toString("base64");
    }
  }
  visit(directory);
  return files;
}

async function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vasir-skill-groups-"));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    assert.match(path.basename(directory), /^vasir-skill-groups-/);
    assert.equal(fs.lstatSync(directory).isSymbolicLink(), false);
    fs.rmSync(directory, { recursive: true, force: true });
  });
  const bundle = path.join(directory, "bundle");
  fs.mkdirSync(bundle);
  for (const relative of ["cli", "templates", ".agents/skills", "registry.json", "package.json", "node_modules"]) {
    const source = path.join(catalogRoot, relative);
    if (fs.existsSync(source)) fs.cpSync(source, path.join(bundle, relative), { recursive: true });
  }
  for (const relative of ["cli/command-runner.js", "cli/skill-groups.js", "skill-groups.json"]) {
    fs.copyFileSync(path.join(packageRoot, relative), path.join(bundle, relative));
  }
  const project = path.join(directory, "project");
  const home = path.join(directory, "home");
  fs.mkdirSync(project);
  fs.mkdirSync(home);
  const { runCommandLine } = await import(pathToFileURL(path.join(bundle, "cli/command-runner.js")));
  const registry = JSON.parse(fs.readFileSync(path.join(bundle, "registry.json"), "utf8"));
  const writeGroups = (groups) => fs.writeFileSync(path.join(bundle, "skill-groups.json"), JSON.stringify(groups));
  async function invoke(args, options = {}) {
    let stdout = "";
    let stderr = "";
    const exitCode = await runCommandLine(["node", "vasir", ...args], {
      homeDirectory: home,
      currentWorkingDirectory: project,
      inputStream: { isTTY: false },
      outputStream: { isTTY: false },
      errorStream: { isTTY: false },
      environmentVariables: {},
      fetchImplementation: () => { throw new Error("Tests must never use the network or a model."); },
      spawnSyncImplementation: () => { throw new Error("Tests must never spawn a model or network command."); },
      stdoutWriter: (message) => { stdout += message; },
      stderrWriter: (message) => { stderr += message; },
      ...options
    });
    const payload = args.includes("--json") ? JSON.parse(exitCode === 0 ? stdout : stderr) : null;
    return { exitCode, stdout, stderr, payload };
  }
  return { directory, bundle, project, home, registry, invoke, writeGroups };
}

function expectedUnion(...names) {
  return [...new Set(names.flatMap((name) => canonicalGroups.groups[name].skills))];
}

function assertInstalledBytes(f, names) {
  assert.deepEqual(fs.readdirSync(path.join(f.project, ".agents/skills")).sort(), [...names].sort());
  for (const name of names) {
    const entry = f.registry.skills.find((skill) => skill.name === name);
    assert.deepEqual(snapshot(path.join(f.project, ".agents/skills", name)), snapshot(path.join(f.bundle, entry.path)), name);
  }
}

function assertGamedevAssets(f) {
  const whitepaper = "whitepaper-analyze-mmo-whitepaper";
  const nestedWhitepaper = "references/whitepaper-analyze-mmo-whitepaper/SKILL.md";
  const genre = f.registry.skills.find((skill) => skill.name === "game-genre-routing");
  const art = f.registry.skills.find((skill) => skill.name === "art-direction-defining-game-art");
  assert.ok(f.registry.skills.some((skill) => skill.name === whitepaper), "whitepaper is independently installable");
  assert.ok(genre.files.includes(nestedWhitepaper), "genre bundle retains its nested whitepaper reference");
  const nestedArtReferences = art.files.filter((file) => /^[^/]+\/references\/[^/]+\.md$/.test(file));
  assert.ok(nestedArtReferences.length > 0, "art direction retains nested reference libraries");
  for (const [name, file] of [[whitepaper, "SKILL.md"], [genre.name, nestedWhitepaper], ...nestedArtReferences.map((file) => [art.name, file])]) {
    assert.deepEqual(
      fs.readFileSync(path.join(f.project, ".agents/skills", name, file)),
      fs.readFileSync(path.join(f.bundle, ".agents/skills", name, file)),
      `${name}/${file}`
    );
  }
}

test("groups lists definitions and unions read-only, independent of cwd", async (t) => {
  const f = await fixture(t);
  const beforeHome = snapshot(f.home);
  const beforeProject = snapshot(f.project);
  const listed = await f.invoke(["groups", "--json"]);
  assert.equal(listed.exitCode, 0, listed.stderr);
  const configuredGroupNames = Object.keys(canonicalGroups.groups);
  assert.deepEqual(listed.payload.selectedGroups, configuredGroupNames);
  assert.deepEqual(listed.payload.skills, expectedUnion(...configuredGroupNames));
  assert.equal(listed.payload.skillCount, expectedUnion(...configuredGroupNames).length);
  for (const group of listed.payload.groups) {
    assert.equal(group.description, canonicalGroups.groups[group.name].description);
    assert.deepEqual(group.skills, canonicalGroups.groups[group.name].skills);
    assert.equal(group.skillCount, group.skills.length);
  }
  const detailed = await f.invoke(["groups", "frontend", "base", "frontend", "--json"]);
  assert.equal(detailed.exitCode, 0, detailed.stderr);
  assert.deepEqual(detailed.payload.selectedGroups, ["frontend", "base"]);
  assert.deepEqual(detailed.payload.skills, expectedUnion("frontend", "base"));
  const text = await f.invoke(["groups", "base"]);
  assert.equal(text.exitCode, 0, text.stderr);
  assert.ok(text.stdout.includes(`base (${canonicalGroups.groups.base.skills.length} skills)`));
  for (const name of expectedUnion("base")) assert.ok(text.stdout.includes(name));
  const unsupported = await f.invoke(["groups", "--repo-root", path.join(f.directory, "absent"), "--json"]);
  assert.equal(unsupported.payload.code, "INVALID_COMMAND_FLAG");
  assert.equal(fs.existsSync(path.join(f.directory, "absent")), false);
  assert.deepEqual(snapshot(f.home), beforeHome);
  assert.deepEqual(snapshot(f.project), beforeProject);
});

test("base plus frontend installs the exact byte-preserving union and tracks a concrete snapshot", async (t) => {
  const f = await fixture(t);
  const result = await f.invoke(["add", "--group", "base", "--group", "frontend", "--agents-profile", "frontend", "--json"]);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.deepEqual(result.payload.selectedGroups, ["base", "frontend"]);
  assert.deepEqual(result.payload.installedSkills, expectedUnion("base", "frontend"));
  assert.equal(result.payload.agentsProfile, "frontend");
  assert.equal(result.payload.agentsProfileSource, "flag");
  assert.equal(result.payload.wroteAgentsFile, true);
  assert.equal(result.payload.wroteClaudeFile, true);
  assertInstalledBytes(f, expectedUnion("base", "frontend"));
  const config = JSON.parse(fs.readFileSync(path.join(f.project, ".agents/vasir.json")));
  assert.equal(config.tracking.mode, "selected");
  assert.deepEqual(config.tracking.skillNames, expectedUnion("base", "frontend").sort((a, b) => a.localeCompare(b)));
  assert.equal("groups" in config.tracking, false);
});

test("gamedev installs all 29 pending bundles including whitepaper and nested reference bytes", async (t) => {
  const f = await fixture(t);
  const names = expectedUnion("gamedev");
  const metadata = JSON.parse(fs.readFileSync(path.join(packageRoot, "registry/review-metadata.json"), "utf8"));
  assert.equal(names.length, 29);
  assert.deepEqual([...names].sort(), metadata.skills.filter((skill) => skill.reviewStatus === "pending").map((skill) => skill.canonicalId).sort());
  const result = await f.invoke(["add", "--group", "gamedev", "--json"]);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.deepEqual(result.payload.selectedGroups, ["gamedev"]);
  assert.deepEqual(result.payload.installedSkills, names);
  assertInstalledBytes(f, names);
  assertGamedevAssets(f);
  const config = JSON.parse(fs.readFileSync(path.join(f.project, ".agents/vasir.json")));
  assert.equal(config.tracking.mode, "selected");
  assert.deepEqual(config.tracking.skillNames, [...names].sort((a, b) => a.localeCompare(b)));
  const updated = await f.invoke(["update", "--json"]);
  assert.equal(updated.exitCode, 0, updated.stderr);
  assert.equal(updated.payload.unchangedSkills.length, names.length);
  assertInstalledBytes(f, names);
});

test("base frontend and gamedev install the exact deduplicated union with preserved bundle bytes", async (t) => {
  const f = await fixture(t);
  const names = expectedUnion("base", "frontend", "gamedev");
  const result = await f.invoke(["add", "--group", "base", "--group", "frontend", "--group", "gamedev", "--group", "gamedev", "whitepaper-analyze-mmo-whitepaper", "--json"]);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.deepEqual(result.payload.selectedGroups, ["base", "frontend", "gamedev"]);
  assert.deepEqual(result.payload.installedSkills, names);
  assert.equal(names.length, 45);
  assertInstalledBytes(f, names);
  assertGamedevAssets(f);
  const config = JSON.parse(fs.readFileSync(path.join(f.project, ".agents/vasir.json")));
  assert.equal(config.tracking.mode, "selected");
  assert.deepEqual(config.tracking.skillNames, [...names].sort((a, b) => a.localeCompare(b)));
});

test("overlap, repeated groups, and interleaved individual skills deduplicate in argument order", async (t) => {
  const f = await fixture(t);
  const [a, b, c] = f.registry.skills.map((entry) => entry.name);
  f.writeGroups({ schemaVersion: 1, groups: {
    base: { description: "Base", skills: [a, b] },
    frontend: { description: "Frontend", skills: [b, c] }
  } });
  const listed = await f.invoke(["groups", "--json"]);
  assert.deepEqual(listed.payload.skills, [a, b, c]);
  assert.equal(listed.payload.groups[0].skillCount, 2);
  const result = await f.invoke(["add", c, "--group", "base", a, "--group", "frontend", "--group", "base", "--json"]);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.deepEqual(result.payload.selectedGroups, ["base", "frontend"]);
  assert.deepEqual(result.payload.installedSkills, [c, a, b]);
  assertInstalledBytes(f, [a, b, c]);
});

for (const [args, code] of [
  [["add", "--group"], "GROUP_FLAG_VALUE_REQUIRED"],
  [["add", "--group", "--json"], "GROUP_FLAG_VALUE_REQUIRED"],
  [["add", "--group", "missing"], "UNKNOWN_SKILL_GROUP"],
  [["groups", "missing"], "UNKNOWN_SKILL_GROUP"],
  [["add", "--group", "base,frontend"], "UNKNOWN_SKILL_GROUP"],
  [["add", "--group", "Base"], "UNKNOWN_SKILL_GROUP"],
  [["add", "--group", "base", "missing-skill"], "UNKNOWN_SKILL"],
  [["add", "all", "--group", "base"], "ALL_SKILLS_REQUEST_CONFLICT"],
  [["remove", "--group", "base"], "INVALID_COMMAND_FLAG"],
  [["init", "--group", "base"], "INVALID_COMMAND_FLAG"],
  [["groups", "--group", "base"], "INVALID_COMMAND_FLAG"],
  [["add", "--group=base"], "UNKNOWN_FLAG"]
]) {
  test(`invalid selection ${args.join(" ")} fails before mutation`, async (t) => {
    const f = await fixture(t);
    const result = await f.invoke([...args.filter((arg) => arg !== "--json"), "--json"]);
    assert.equal(result.exitCode, 1);
    assert.equal(result.payload.code, code, result.stderr);
    assert.ok(result.payload.suggestion);
    assert.deepEqual(snapshot(f.project), {});
    assert.deepEqual(snapshot(f.home), {});
  });
}

test("malformed group files and unknown registry references fail read-only", async (t) => {
  const f = await fixture(t);
  for (const invalid of [null, { schemaVersion: 2, groups: {} }, { schemaVersion: 1, groups: [] },
    { schemaVersion: 1, groups: {} },
    { schemaVersion: 1, groups: { Base: { description: "bad name", skills: [f.registry.skills[0].name] } } },
    { schemaVersion: 1, groups: { base: { description: "", skills: [f.registry.skills[0].name] } } },
    { schemaVersion: 1, groups: { base: { description: "Empty", skills: [] } } },
    { schemaVersion: 1, groups: { base: { description: "Wrong type", skills: [12] } } },
    { schemaVersion: 1, groups: { base: { description: "Unknown", skills: ["missing-skill"] } } },
    { schemaVersion: 1, unexpected: true, groups: canonicalGroups.groups },
    { schemaVersion: 1, groups: { all: { description: "Reserved", skills: [f.registry.skills[0].name] } } },
    { schemaVersion: 1, groups: { base: { description: "Extra field", skills: [f.registry.skills[0].name], unexpected: true } } },
    { schemaVersion: 1, groups: { base: { description: "Duplicate", skills: [f.registry.skills[0].name, f.registry.skills[0].name] } } }
  ]) {
    f.writeGroups(invalid);
    for (const args of [["groups", "--json"], ["add", "--group", "base", "--json"]]) {
      const result = await f.invoke(args);
      assert.equal(result.payload.code, "INVALID_SKILL_GROUPS", result.stderr);
    }
  }
  fs.writeFileSync(path.join(f.bundle, "skill-groups.json"), "{broken");
  assert.equal((await f.invoke(["groups", "--json"])).payload.code, "INVALID_SKILL_GROUPS");
  fs.unlinkSync(path.join(f.bundle, "skill-groups.json"));
  assert.equal((await f.invoke(["groups", "--json"])).payload.code, "INVALID_SKILL_GROUPS");
  assert.deepEqual(snapshot(f.project), {});
  assert.deepEqual(snapshot(f.home), {});
});

test("group definitions validate against the effective local catalog override", async (t) => {
  const f = await fixture(t);
  const override = path.join(f.directory, "override");
  fs.mkdirSync(override);
  fs.mkdirSync(path.join(override, "templates"));
  fs.mkdirSync(path.join(override, ".agents/skills"), { recursive: true });
  fs.writeFileSync(path.join(override, "registry.json"), JSON.stringify({ ...f.registry, skills: [] }));
  for (const args of [["groups", "--json"], ["add", "--group", "base", "--json"]]) {
    const result = await f.invoke(args, { repositoryUrl: pathToFileURL(override).href });
    assert.equal(result.payload.code, "INVALID_SKILL_GROUPS", result.stderr);
    assert.match(result.payload.message, /effective catalog/);
  }
  assert.deepEqual(snapshot(f.project), {});
  assert.deepEqual(snapshot(f.home), {});
});

test("plain individual add and add all retain installation and tracking behavior", async (t) => {
  const f = await fixture(t);
  const name = f.registry.skills[0].name;
  const individual = await f.invoke(["add", name, "--json"]);
  assert.equal(individual.exitCode, 0, individual.stderr);
  assert.deepEqual(individual.payload.installedSkills, [name]);
  assert.deepEqual(individual.payload.selectedGroups, []);
  const duplicates = await f.invoke(["add", name, name, "--replace", "--json"]);
  assert.equal(duplicates.payload.code, "DUPLICATE_SKILL_REQUEST");
  const all = await f.invoke(["add", "all", "--replace", "--json"]);
  assert.equal(all.exitCode, 0, all.stderr);
  assert.deepEqual(all.payload.installedSkills, f.registry.skills.map((entry) => entry.name));
  const config = JSON.parse(fs.readFileSync(path.join(f.project, ".agents/vasir.json")));
  assert.equal(config.tracking.mode, "all");
  assertInstalledBytes(f, f.registry.skills.map((entry) => entry.name));
});

test("repeated group add preserves safeguards and safe refresh preserves AGENTS and model choices", async (t) => {
  const f = await fixture(t);
  assert.equal((await f.invoke(["add", "--group", "base", "--json"])).exitCode, 0);
  const configPath = path.join(f.project, ".agents/vasir.json");
  const config = JSON.parse(fs.readFileSync(configPath));
  config.agents = { ...config.agents, modelRouting: { codex: { execution: { model: "gpt-6.1-sol", reasoningEffort: "high" } } } };
  // Use the established model-routing shape as normalized by the implementation.
  const { readProjectConfig } = await import(pathToFileURL(path.join(f.bundle, "cli/project-config.js")));
  const { buildProjectPaths } = await import(pathToFileURL(path.join(f.bundle, "cli/path-layout.js")));
  fs.writeFileSync(configPath, JSON.stringify(config));
  const expectedConfig = readProjectConfig({ projectPaths: buildProjectPaths({ currentWorkingDirectory: f.project }) });
  const agentsBytes = fs.readFileSync(path.join(f.project, "AGENTS.md"));
  const before = snapshot(f.project);
  const repeated = await f.invoke(["add", "--group", "base", "--json"]);
  assert.equal(repeated.payload.code, "PROJECT_SKILL_EXISTS");
  assert.deepEqual(snapshot(f.project), before);
  const replaced = await f.invoke(["add", "--group", "base", "--replace", "--json"]);
  assert.equal(replaced.exitCode, 0, replaced.stderr);
  assert.deepEqual(replaced.payload.replacedSkills, expectedUnion("base"));
  assert.deepEqual(fs.readFileSync(path.join(f.project, "AGENTS.md")), agentsBytes);
  assert.deepEqual(JSON.parse(fs.readFileSync(configPath)).agents, expectedConfig.agents);
  const target = path.join(f.project, ".agents/skills", expectedUnion("base")[0], "SKILL.md");
  fs.appendFileSync(target, "\nLocal customization\n");
  const modified = snapshot(f.project);
  const blocked = await f.invoke(["add", "--group", "base", "--replace", "--json"]);
  assert.equal(blocked.payload.code, "PROJECT_SKILL_MODIFIED");
  assert.deepEqual(snapshot(f.project), modified);
});

test("update honors the group snapshot and refuses modified skills", async (t) => {
  const f = await fixture(t);
  const names = expectedUnion("base");
  assert.equal((await f.invoke(["add", "--group", "base", "--json"])).exitCode, 0);
  const extra = f.registry.skills.find((entry) => !names.includes(entry.name)).name;
  const expanded = structuredClone(canonicalGroups);
  expanded.groups.base.skills.push(extra);
  f.writeGroups(expanded);
  const sourceSkill = path.join(f.bundle, ".agents/skills", names[0], "SKILL.md");
  fs.appendFileSync(sourceSkill, "\nUpdated managed fixture content\n");
  const result = await f.invoke(["update", "--json"]);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.equal(result.payload.trackingMode, "selected");
  assert.ok(result.payload.updatedSkills.includes(names[0]));
  assert.equal(fs.existsSync(path.join(f.project, ".agents/skills", extra)), false);
  assertInstalledBytes(f, names);
  const target = path.join(f.project, ".agents/skills", names[0], "SKILL.md");
  fs.appendFileSync(target, "\nLocal user edit\n");
  const before = snapshot(f.project);
  const dryRun = await f.invoke(["update", "--dry-run", "--json"]);
  assert.equal(dryRun.exitCode, 0, dryRun.stderr);
  assert.ok(dryRun.payload.blockedSkills.some((skill) => skill.code === "PROJECT_SKILL_MODIFIED"));
  const blocked = await f.invoke(["update", "--json"]);
  assert.equal(blocked.payload.code, "PROJECT_SKILL_MODIFIED");
  assert.deepEqual(snapshot(f.project), before);
});
