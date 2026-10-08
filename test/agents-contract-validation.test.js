import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  initializeProjectAgentsFile,
  runAgents,
  synchronizeProjectAgentsFile,
  validateProjectAgentsFile
} from "../cli/agents.js";

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vasir-agent-contract-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function writeFile(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function contract(name = "AGENTS", routing = "Use this root for the repository.") {
  return `# ${name}.md: [Project Name]\n
<!-- vasir:purpose:start -->
**Purpose:** The repository supports a documented local workflow.
<!-- vasir:purpose:end -->

## Documentation and Routing
<!-- vasir:routing:start -->
${routing}
<!-- vasir:routing:end -->

<!-- vasir:nonobvious:start -->
None recorded yet.
<!-- vasir:nonobvious:end -->

<!-- vasir:engineering-doctrine-inserts:start -->
Use the project conventions.
<!-- vasir:engineering-doctrine-inserts:end -->
`;
}

function catalog(t, { claudeSuffix = "" } = {}) {
  const directory = temporaryDirectory(t);
  writeFile(path.join(directory, "templates", "agents", "AGENTS.md"), contract());
  writeFile(path.join(directory, "templates", "agents", "CLAUDE.md"), `${contract("CLAUDE")}${claudeSuffix}`);
  return directory;
}

function writeStarters(projectRootDirectory, { claudePurpose = null } = {}) {
  for (const name of ["AGENTS", "CLAUDE"]) {
    const purpose = name === "CLAUDE" && claudePurpose ? claudePurpose : "[Describe this repository. Replace this block first.]";
    writeFile(path.join(projectRootDirectory, `${name}.md`), contract(name)
      .replace("[Project Name]", "Example")
      .replace("The repository supports a documented local workflow.", purpose));
  }
}

function draft(projectRootDirectory, command) {
  return runAgents({
    agentsArguments: [command],
    currentWorkingDirectory: projectRootDirectory,
    projectRootDirectory,
    writeGeneratedOutput: true,
    modelArguments: command === "draft-purpose" ? ["mock"] : [],
    jsonOutput: true,
    environmentVariables: {},
    stdoutWriter: () => {}
  });
}

test("routing markers validate paths under any section heading and stop at their boundary", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeFile(path.join(projectRootDirectory, "AGENTS.md"), contract("AGENTS",
    "* **API:** Read `/missing-api/` before changing handlers."
  ).replace("[Project Name]", "Example"));
  const validation = validateProjectAgentsFile({ projectRootDirectory });
  assert.equal(validation.issues.length, 1);
  assert.equal(validation.issues[0].code, "ROUTED_PATH_MISSING");

  writeFile(path.join(projectRootDirectory, "AGENTS.md"), `${contract().replace("[Project Name]", "Example")}\nOutside routing: \`/example-only/path/\`.\n`);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("marked routes require local instruction files when they explicitly route to them", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  fs.mkdirSync(path.join(projectRootDirectory, "src"));
  writeFile(path.join(projectRootDirectory, "AGENTS.md"), contract("AGENTS",
    "* **Source:** If touching `/src/`, read that directory's local `AGENTS.md`."
  ).replace("[Project Name]", "Example"));
  assert.equal(validateProjectAgentsFile({ projectRootDirectory }).issues[0].code, "LOCAL_AGENTS_MISSING");
  writeFile(path.join(projectRootDirectory, "src", "AGENTS.md"), "# Source guidance\n");
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("malformed and duplicate generation markers fail validation without rejecting unmarked legacy roots", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const agentsFilePath = path.join(projectRootDirectory, "AGENTS.md");
  for (const text of [
    contract().replace("<!-- vasir:routing:end -->", ""),
    `${contract()}\n<!-- vasir:routing:start -->\nExtra routing.\n<!-- vasir:routing:end -->\n`,
    "<!-- vasir:routing:end -->\n<!-- vasir:routing:start -->\n",
    "<!-- vasir:purpose:start -->\n<!-- vasir:routing:start -->\n<!-- vasir:routing:end -->\n<!-- vasir:purpose:end -->\n",
    "<!-- vasir:purpose:start -->\n<!-- vasir:routing:start -->\n<!-- vasir:purpose:end -->\n<!-- vasir:routing:end -->\n"
  ]) {
    writeFile(agentsFilePath, text.replace("[Project Name]", "Example"));
    assert.ok(validateProjectAgentsFile({ projectRootDirectory }).issues.some((issue) => issue.code === "ROOT_CONTRACT_MARKERS_INVALID"));
  }
  writeFile(agentsFilePath, "# Existing instruction contract\nUse the documented conventions.\n");
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("a truncated CLAUDE consumer block is rejected with the owning file and line", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const agentsFilePath = path.join(projectRootDirectory, "AGENTS.md");
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  writeFile(agentsFilePath, contract().replace("[Project Name]", "Example"));
  const claudeText = contract("CLAUDE").replace("[Project Name]", "Example");
  writeFile(claudeFilePath, `${claudeText}\n<!-- vasir:consumer:start -->\nUse the current provider's available tools.\n`);
  const issues = validateProjectAgentsFile({ projectRootDirectory }).issues;
  assert.equal(issues.length, 1);
  assert.equal(issues[0].code, "ROOT_CONTRACT_MARKERS_INVALID");
  assert.equal(issues[0].filePath, claudeFilePath);
  assert.equal(issues[0].lineNumber, claudeText.split("\n").length + 1);

  writeFile(claudeFilePath, `${fs.readFileSync(claudeFilePath, "utf8")}<!-- vasir:consumer:end -->\n`);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("empty template blocks compose profiles without adding phantom content", (t) => {
  const globalCatalogDirectory = catalog(t);
  for (const fileName of ["AGENTS.md", "CLAUDE.md"]) {
    writeFile(path.join(globalCatalogDirectory, "templates", "agents", fileName),
      contract(fileName.slice(0, -3)).replace(
        "<!-- vasir:engineering-doctrine-inserts:start -->\nUse the project conventions.\n<!-- vasir:engineering-doctrine-inserts:end -->",
        "<!-- vasir:engineering-doctrine-inserts:start -->\n<!-- vasir:engineering-doctrine-inserts:end -->"
      )
    );
  }
  for (const profileName of ["backend", "frontend", "ios"]) {
    const projectRootDirectory = temporaryDirectory(t);
    writeFile(path.join(globalCatalogDirectory, "templates", "agents", "snippets", `${profileName}-inserts.md`),
      contract().replace("Use the project conventions.", `Apply ${profileName} conventions.`)
    );
    initializeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName });
    for (const fileName of ["AGENTS.md", "CLAUDE.md"]) {
      assert.ok(fs.readFileSync(path.join(projectRootDirectory, fileName), "utf8").includes(`Apply ${profileName} conventions.`));
    }
    assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
  }
});

test("the init and draft workflow completes both starters and preserves surrounding custom content", async (t) => {
  const globalCatalogDirectory = catalog(t);
  const projectRootDirectory = temporaryDirectory(t);
  for (const fileName of ["AGENTS.md", "CLAUDE.md"]) {
    const templatePath = path.join(globalCatalogDirectory, "templates", "agents", fileName);
    writeFile(templatePath, fs.readFileSync(templatePath, "utf8").replace(
      "The repository supports a documented local workflow.",
      "[Describe this repository. Replace this block first.]"
    ));
  }
  initializeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory });
  for (const name of ["AGENTS", "CLAUDE"]) {
    const filePath = path.join(projectRootDirectory, `${name}.md`);
    writeFile(filePath, `Custom prefix.\n${fs.readFileSync(filePath, "utf8")}Custom suffix.\n`);
  }
  const purposeResult = await draft(projectRootDirectory, "draft-purpose");
  const routingResult = await draft(projectRootDirectory, "draft-routing");
  assert.equal(purposeResult.updatedFiles.length, 2);
  assert.equal(routingResult.updatedFiles.length, 2);
  for (const name of ["AGENTS", "CLAUDE"]) {
    const text = fs.readFileSync(path.join(projectRootDirectory, `${name}.md`), "utf8");
    assert.ok(text.startsWith("Custom prefix.\n"));
    assert.ok(text.endsWith("Custom suffix.\n"));
    assert.ok(text.includes(purposeResult.purpose));
    assert.ok(text.includes("<!-- vasir:purpose:start -->"));
    assert.ok(text.includes("<!-- vasir:routing:start -->"));
    assert.ok(!text.includes("Replace this block first."));
  }
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("actual templates draft both purposes for every built-in profile and reject a second overwrite", async (t) => {
  const globalCatalogDirectory = fileURLToPath(new URL("../", import.meta.url));
  for (const profileName of ["generic", "backend", "frontend", "ios"]) {
    const projectRootDirectory = temporaryDirectory(t);
    initializeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName });
    const result = await draft(projectRootDirectory, "draft-purpose");
    const roots = ["AGENTS.md", "CLAUDE.md"].map((name) => path.join(projectRootDirectory, name));
    assert.deepEqual(result.updatedFiles, roots, `${profileName} must update both purposes`);
    const draftedTexts = roots.map((filePath) => fs.readFileSync(filePath, "utf8"));
    for (const text of draftedTexts) {
      assert.ok(text.includes(`**Purpose:** ${result.purpose}`), profileName);
      assert.ok(!text.includes("[Describe this "), profileName);
    }
    await assert.rejects(draft(projectRootDirectory, "draft-purpose"), (error) => {
      assert.equal(error.code, "AGENTS_PURPOSE_ALREADY_EDITED");
      return true;
    });
    assert.deepEqual(roots.map((filePath) => fs.readFileSync(filePath, "utf8")), draftedTexts);
  }
});

test("purpose drafting preserves an explicitly customized CLAUDE purpose", async (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeStarters(projectRootDirectory, { claudePurpose: "An explicitly reviewed provider-specific purpose." });
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  const before = fs.readFileSync(claudeFilePath, "utf8");
  const result = await draft(projectRootDirectory, "draft-purpose");
  assert.deepEqual(result.updatedFiles, [path.join(projectRootDirectory, "AGENTS.md")]);
  assert.equal(fs.readFileSync(claudeFilePath, "utf8"), before);
});

test("a custom purpose quoting scaffold instructions is preserved and validates as authored prose", async (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const customPurpose = 'This documentation explains the placeholder "[Describe this repository]" and the instruction "Replace this block first." for maintainers.';
  writeStarters(projectRootDirectory, { claudePurpose: customPurpose });
  await draft(projectRootDirectory, "draft-purpose");
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  assert.ok(fs.readFileSync(claudeFilePath, "utf8").includes(customPurpose));
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);

  const agentsFilePath = path.join(projectRootDirectory, "AGENTS.md");
  const beforeAgents = contract().replace("[Project Name]", "Example").replace("The repository supports a documented local workflow.", customPurpose);
  writeFile(agentsFilePath, beforeAgents);
  const beforeClaude = fs.readFileSync(claudeFilePath, "utf8");
  await assert.rejects(draft(projectRootDirectory, "draft-purpose"), (error) => {
    assert.equal(error.code, "AGENTS_PURPOSE_ALREADY_EDITED");
    return true;
  });
  assert.equal(fs.readFileSync(agentsFilePath, "utf8"), beforeAgents);
  assert.equal(fs.readFileSync(claudeFilePath, "utf8"), beforeClaude);
});

test("draft writes preflight every candidate so an oversized CLAUDE preserves both originals", async (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeStarters(projectRootDirectory);
  const agentsFilePath = path.join(projectRootDirectory, "AGENTS.md");
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  const agentsBefore = fs.readFileSync(agentsFilePath, "utf8");
  const claudeBefore = `${fs.readFileSync(claudeFilePath, "utf8")}${"x".repeat(32768)}`;
  writeFile(claudeFilePath, claudeBefore);
  for (const command of ["draft-purpose", "draft-routing"]) {
    await assert.rejects(draft(projectRootDirectory, command), (error) => {
      assert.equal(error.code, "AGENTS_VALIDATION_FAILED");
      assert.ok(error.context.issues.some((issue) => issue.filePath === claudeFilePath && issue.code === "ROOT_CONTRACT_BYTE_BUDGET_EXCEEDED"));
      return true;
    });
    assert.equal(fs.readFileSync(agentsFilePath, "utf8"), agentsBefore);
    assert.equal(fs.readFileSync(claudeFilePath, "utf8"), claudeBefore);
  }
});

test("draft writes reject malformed original markers before replacing blocks", async (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeStarters(projectRootDirectory);
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  writeFile(claudeFilePath, fs.readFileSync(claudeFilePath, "utf8").replace("<!-- vasir:purpose:end -->", ""));
  const agentsBefore = fs.readFileSync(path.join(projectRootDirectory, "AGENTS.md"), "utf8");
  for (const command of ["draft-purpose", "draft-routing"]) {
    await assert.rejects(draft(projectRootDirectory, command), (error) => {
      assert.ok(error.context.issues.some((issue) => issue.filePath === claudeFilePath && issue.code === "ROOT_CONTRACT_MARKERS_INVALID"));
      return true;
    });
    assert.equal(fs.readFileSync(path.join(projectRootDirectory, "AGENTS.md"), "utf8"), agentsBefore);
  }
});

test("validation checks CLAUDE when present and accepts legacy AGENTS-only projects", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const agentsFilePath = path.join(projectRootDirectory, "AGENTS.md");
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  writeFile(agentsFilePath, contract().replace("[Project Name]", "Example"));
  const legacyValidation = validateProjectAgentsFile({ projectRootDirectory });
  assert.deepEqual(legacyValidation.issues, []);
  assert.equal(legacyValidation.claudeFilePath, null);
  assert.deepEqual(legacyValidation.validatedFiles, [agentsFilePath]);

  writeFile(claudeFilePath, contract("CLAUDE", "Read `/missing-claude-route/`."));
  const validation = validateProjectAgentsFile({ projectRootDirectory });
  assert.ok(validation.issues.some((issue) => issue.code === "PROJECT_NAME_PLACEHOLDER_LEFT_IN_FILE"));
  assert.ok(validation.issues.some((issue) => issue.code === "ROUTED_PATH_MISSING"));
  assert.ok(validation.issues.every((issue) => issue.filePath === claudeFilePath));
  assert.deepEqual(validation.validatedFiles, [agentsFilePath, claudeFilePath]);
});

test("validation reports shared-policy drift in actual generated twins without writing either file", (t) => {
  const globalCatalogDirectory = fileURLToPath(new URL("../", import.meta.url));
  const projectRootDirectory = temporaryDirectory(t);
  const { agentsFilePath, claudeFilePath } = synchronizeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName: "generic" });
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
  const agentsBefore = fs.readFileSync(agentsFilePath, "utf8");
  const claudeBefore = fs.readFileSync(claudeFilePath, "utf8");
  const custody = claudeBefore.match(/# 8\. Custody\r?\n([\s\S]*?)(?=\r?\n# 9\.)/)[1];
  const commitLine = custody.split(/\r?\n/).find((line) => /\bcommit\b/i.test(line));
  const changedLine = "Commit unrelated changes without reviewing them.";
  const changedClaude = claudeBefore.replace(commitLine, changedLine);
  writeFile(claudeFilePath, changedClaude);
  const issues = validateProjectAgentsFile({ projectRootDirectory }).issues;
  assert.equal(issues.length, 1);
  assert.equal(issues[0].code, "ROOT_CONTRACT_SHARED_POLICY_DRIFT");
  assert.equal(issues[0].filePath, claudeFilePath);
  assert.equal(issues[0].comparisonFilePath, agentsFilePath);
  assert.equal(issues[0].lineNumber, changedClaude.split(/\r?\n/).indexOf(changedLine) + 1);
  assert.equal(fs.readFileSync(agentsFilePath, "utf8"), agentsBefore);
  assert.equal(fs.readFileSync(claudeFilePath, "utf8"), changedClaude);
});

test("generated roots cannot evade validation by deleting an entire required seam in either twin", (t) => {
  const globalCatalogDirectory = fileURLToPath(new URL("../", import.meta.url));
  const projectRootDirectory = temporaryDirectory(t);
  const { agentsFilePath, claudeFilePath } = synchronizeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName: "generic" });
  for (const filePath of [agentsFilePath, claudeFilePath]) {
    const original = fs.readFileSync(filePath, "utf8");
    for (const blockName of ["consumer", "purpose", "nonobvious", "routing", "engineering-doctrine-inserts"]) {
      const startMarker = `<!-- vasir:${blockName}:start -->`;
      const endMarker = `<!-- vasir:${blockName}:end -->`;
      writeFile(filePath, original.replace(startMarker, "").replace(endMarker, ""));
      const issues = validateProjectAgentsFile({ projectRootDirectory }).issues;
      assert.equal(issues.length, 1, `${path.basename(filePath)} ${blockName}`);
      assert.equal(issues[0].code, "ROOT_CONTRACT_MARKERS_INVALID");
      assert.equal(issues[0].filePath, filePath);
      assert.ok(issues[0].message.includes(startMarker));
      writeFile(filePath, original);
    }
  }
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("generated twins may differ in supported local blocks while keeping the shared policy", (t) => {
  const globalCatalogDirectory = fileURLToPath(new URL("../", import.meta.url));
  const projectRootDirectory = temporaryDirectory(t);
  const { claudeFilePath } = synchronizeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName: "generic" });
  let changedClaude = fs.readFileSync(claudeFilePath, "utf8");
  for (const blockName of ["consumer", "purpose", "nonobvious", "routing"]) {
    const pattern = new RegExp(`(<!-- vasir:${blockName}:start -->\\r?\\n)[\\s\\S]*?(\\r?\\n<!-- vasir:${blockName}:end -->)`);
    changedClaude = changedClaude.replace(pattern, `$1Provider-local ${blockName} guidance.$2`);
  }
  writeFile(claudeFilePath, changedClaude);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("shared profile engineering guidance must agree in actual generated twins", (t) => {
  const globalCatalogDirectory = fileURLToPath(new URL("../", import.meta.url));
  const projectRootDirectory = temporaryDirectory(t);
  const { claudeFilePath } = synchronizeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName: "backend" });
  const originalClaude = fs.readFileSync(claudeFilePath, "utf8");
  const engineering = originalClaude.match(/<!-- vasir:engineering-doctrine-inserts:start -->\r?\n([\s\S]*?)\r?\n<!-- vasir:engineering-doctrine-inserts:end -->/)[1];
  const policyLine = engineering.split(/\r?\n/).find((line) => line.trim() && !line.startsWith("#"));
  writeFile(claudeFilePath, originalClaude.replace(policyLine, "Install a new runtime for every task."));
  const issues = validateProjectAgentsFile({ projectRootDirectory }).issues;
  assert.equal(issues.length, 1);
  assert.equal(issues[0].code, "ROOT_CONTRACT_SHARED_POLICY_DRIFT");
  assert.equal(issues[0].filePath, claudeFilePath);
});

test("independently authored legacy twins are exempt from generated shared-policy comparisons", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeFile(path.join(projectRootDirectory, "AGENTS.md"), "# Manual agent policy\nCommit after local verification.\n");
  writeFile(path.join(projectRootDirectory, "CLAUDE.md"), "# Manual Claude policy\nAsk before committing.\n");
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("root budgets count UTF-8 bytes rather than characters", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeFile(path.join(projectRootDirectory, "AGENTS.md"), "é".repeat(16384));
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
  writeFile(path.join(projectRootDirectory, "AGENTS.md"), "é".repeat(16385));
  const issue = validateProjectAgentsFile({ projectRootDirectory }).issues[0];
  assert.equal(issue.code, "ROOT_CONTRACT_BYTE_BUDGET_EXCEEDED");
  assert.equal(issue.renderedBytes, 32770);
  assert.equal(issue.maxBytes, 32768);
});

test("an oversized sidecar prevents sync writes and is identified in the rendered budget error", (t) => {
  const globalCatalogDirectory = catalog(t);
  const projectRootDirectory = temporaryDirectory(t);
  const sidecarPath = path.join(projectRootDirectory, "AGENTS__non-obvious.md");
  const sidecarText = "Detailed context ".repeat(2200);
  writeFile(sidecarPath, sidecarText);
  assert.throws(() => synchronizeProjectAgentsFile({
    globalCatalogDirectory,
    projectRootDirectory
  }), (error) => {
    assert.equal(error.code, "AGENTS_VALIDATION_FAILED");
    assert.ok(error.context.issues.every((issue) => issue.code === "ROOT_CONTRACT_BYTE_BUDGET_EXCEEDED"));
    assert.match(error.message, /sidecar/);
    return true;
  });
  assert.equal(fs.readFileSync(sidecarPath, "utf8"), sidecarText);
  assert.ok(!fs.existsSync(path.join(projectRootDirectory, "AGENTS.md")));
  assert.ok(!fs.existsSync(path.join(projectRootDirectory, "CLAUDE.md")));
});

test("oversized CLAUDE init and sync fail before either root or sidecar is written", (t) => {
  const globalCatalogDirectory = catalog(t, { claudeSuffix: "x".repeat(32768) });
  const projectRootDirectory = temporaryDirectory(t);
  for (const render of [initializeProjectAgentsFile, synchronizeProjectAgentsFile]) {
    assert.throws(() => render({ globalCatalogDirectory, projectRootDirectory }), (error) => {
      assert.equal(error.code, "AGENTS_VALIDATION_FAILED");
      assert.ok(error.context.issues.every((issue) => issue.filePath.endsWith("CLAUDE.md")));
      return true;
    });
    assert.ok(!fs.existsSync(path.join(projectRootDirectory, "AGENTS.md")));
    assert.ok(!fs.existsSync(path.join(projectRootDirectory, "CLAUDE.md")));
    assert.ok(!fs.existsSync(path.join(projectRootDirectory, "AGENTS__non-obvious.md")));
  }
});

test("invalid CLAUDE routing fails sync before either root is written", (t) => {
  const globalCatalogDirectory = catalog(t, {
    claudeSuffix: "\n<!-- vasir:routing:start -->\nRead `/missing/`.\n<!-- vasir:routing:end -->\n"
  });
  const projectRootDirectory = temporaryDirectory(t);
  assert.throws(() => synchronizeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory }), (error) => {
    assert.ok(error.context.issues.some((issue) => issue.code === "ROUTED_PATH_MISSING" && issue.filePath.endsWith("CLAUDE.md")));
    return true;
  });
  assert.ok(!fs.existsSync(path.join(projectRootDirectory, "AGENTS.md")));
  assert.ok(!fs.existsSync(path.join(projectRootDirectory, "CLAUDE.md")));
});
