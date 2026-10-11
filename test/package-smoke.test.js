import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createTemporaryDirectory, runCommand, writeEvalFixture } from "./helpers/command-fixtures.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function writeFile(filePath, fileContents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, fileContents);
}

test("npm pack produces a runnable vasir binary with help and add support", (testContext) => {
  const packDirectory = createTemporaryDirectory(testContext, "vasir-package-");
  const homeDirectory = createTemporaryDirectory(testContext, "vasir-package-");
  const projectDirectory = createTemporaryDirectory(testContext, "vasir-package-");
  const npmCacheDirectory = path.join(packDirectory, "npm-cache");
  const npmEnvironmentVariables = {
    npm_config_cache: npmCacheDirectory,
    HOME: homeDirectory,
    USERPROFILE: homeDirectory,
    NO_COLOR: "1"
  };
  const packResult = runCommand("npm", ["pack", REPO_ROOT], packDirectory, npmEnvironmentVariables);
  assert.equal(packResult.status, 0, packResult.stderr);

  const tarballFileName = packResult.stdout.trim().split("\n").at(-1);
  const installPrefixDirectory = path.join(packDirectory, "prefix");
  const installResult = runCommand(
    "npm",
    ["install", "--offline", "--no-audit", "--no-fund", "--prefix", installPrefixDirectory, path.join(packDirectory, tarballFileName)],
    packDirectory,
    npmEnvironmentVariables
  );
  assert.equal(installResult.status, 0, installResult.stderr);

  const binaryPath = path.join(
    installPrefixDirectory,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "vasir.cmd" : "vasir"
  );
  assert.ok(
    fs.existsSync(path.join(installPrefixDirectory, "node_modules", "vasir-slim", ".vasir-catalog-manifest.json"))
  );

  const helpResult = runCommand(binaryPath, ["--help"], packDirectory, npmEnvironmentVariables);
  assert.equal(helpResult.status, 0, helpResult.stderr);
  assert.match(helpResult.stdout, /vasir status \[--json\]/);
  assert.match(helpResult.stdout, /vasir context \[--json\] \[--debug\] \[--repo-root <path>\]/);
  assert.match(helpResult.stdout, /vasir doctor \[--json\]/);
  assert.match(helpResult.stdout, /vasir repair \[--json\] \[--repo-root <path>\]/);
  assert.match(helpResult.stdout, /vasir diff \[skill\.\.\.\] \[--json\] \[--exit-code\] \[--repo-root <path>\]/);
  assert.match(
    helpResult.stdout,
    /vasir add \[skill\.\.\.\] \[--group <name>\]\.\.\. \[--json\] \[--replace\] \[--agents-profile <name>\]/
  );
  assert.match(helpResult.stdout, /vasir adopt \[--json\]/);
  assert.match(helpResult.stdout, /vasir remove <skill> \[skill...\] \[--json\]/);
  assert.match(helpResult.stdout, /vasir agents sync \[--scope <path>\] \[--profile <name>\] \[--json\] \[--dry-run\]/);
  assert.match(helpResult.stdout, /vasir agents init <profile> \[--json\] \[--replace\]/);
  assert.match(helpResult.stdout, /vasir agents draft-purpose \[--json\] \[--write\] \[--model <name>\]/);
  assert.match(helpResult.stdout, /vasir agents draft-routing \[--json\] \[--write\]/);
  assert.match(helpResult.stdout, /vasir agents validate \[--scope <path>\] \[--json\]/);
  assert.match(helpResult.stdout, /vasir eval run <skill> \[--json\] \[--model <name>\] \[--trials <count>\]/);
  assert.match(helpResult.stdout, /vasir eval inspect <skill> \[run-id\] \[--json\]/);
  assert.match(helpResult.stdout, /vasir eval rescore <skill> \[run-id\] \[--json\]/);
  assert.match(helpResult.stdout, /vasir add all/i);

  const versionResult = runCommand(binaryPath, ["--version"], packDirectory, npmEnvironmentVariables);
  assert.equal(versionResult.status, 0, versionResult.stderr);
  assert.equal(versionResult.stdout.trim(), "vasir-slim 0.1.ml");

  const statusResult = runCommand(binaryPath, [], packDirectory, npmEnvironmentVariables);
  assert.equal(statusResult.status, 0, statusResult.stderr);
  assert.match(statusResult.stdout, /Status/);

  const addEnvironmentVariables = {
    ...npmEnvironmentVariables,
    HOME: homeDirectory,
    USERPROFILE: homeDirectory
  };
  writeFile(
    path.join(projectDirectory, "package.json"),
    `${JSON.stringify({ name: "space-admin-console", dependencies: { react: "^19.0.0" } }, null, 2)}\n`
  );
  writeFile(path.join(projectDirectory, "src", "components", "Button.tsx"), "export function Button() { return null; }\n");
  const addResult = runCommand(
    binaryPath,
    ["add", "design-building-frontend-interfaces"],
    projectDirectory,
    addEnvironmentVariables
  );
  assert.equal(addResult.status, 0, addResult.stderr);
  assert.match(addResult.stdout, /Installed design-building-frontend-interfaces/);
  assert.match(addResult.stdout, /Project skills ready at/);
  assert.match(addResult.stdout, /Repo config ready at/);
  assert.match(addResult.stdout, /AGENTS starter ready at \(frontend, inferred\)/);
  assert.match(addResult.stdout, /CLAUDE starter ready at \(frontend, inferred\)/);
  assert.ok(fs.existsSync(path.join(projectDirectory, ".agents", "skills", "design-building-frontend-interfaces", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(projectDirectory, ".agents", "vasir.json")));
  assert.ok(fs.existsSync(path.join(projectDirectory, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(projectDirectory, "CLAUDE.md")));
  assert.doesNotMatch(fs.readFileSync(path.join(projectDirectory, "AGENTS.md"), "utf8"), /vasir:profile/);
  assert.doesNotMatch(fs.readFileSync(path.join(projectDirectory, "CLAUDE.md"), "utf8"), /vasir:profile/);
  const projectConfig = JSON.parse(fs.readFileSync(path.join(projectDirectory, ".agents", "vasir.json"), "utf8"));
  assert.equal(projectConfig.agents.profile, "frontend");

  const contextResult = runCommand(binaryPath, ["context", "--json", "--debug"], projectDirectory, addEnvironmentVariables);
  assert.equal(contextResult.status, 0, contextResult.stderr);
  const parsedContext = JSON.parse(contextResult.stdout);
  assert.equal(parsedContext.command, "context");
  assert.equal(parsedContext.schemaVersion, 2);
  assert.equal(parsedContext.execution.mode, "local");
  assert.equal(parsedContext.execution.usesModel, false);
  assert.equal(parsedContext.execution.usesNetwork, false);
  assert.equal(parsedContext.repoStatus, "tracked");
  assert.ok(parsedContext.recommendedSkillNames.includes("design-building-frontend-interfaces"));
  assert.ok(parsedContext.recommendedSkills.some((skillRecommendation) => skillRecommendation.skillName === "design-building-frontend-interfaces"));
  assert.equal(parsedContext.debug.kind, "contextDebug");

  const validateResult = runCommand(binaryPath, ["agents", "validate", "--json"], projectDirectory, addEnvironmentVariables);
  assert.equal(validateResult.status, 1);
  assert.match(validateResult.stderr, /AGENTS_VALIDATION_FAILED/);

  const removeResult = runCommand(binaryPath, ["remove", "design-building-frontend-interfaces"], projectDirectory, addEnvironmentVariables);
  assert.equal(removeResult.status, 0, removeResult.stderr);
  assert.match(removeResult.stdout, /Removed design-building-frontend-interfaces/);
  assert.ok(!fs.existsSync(path.join(projectDirectory, ".agents", "skills", "design-building-frontend-interfaces")));

  // Only the command harness is evaluated. The reviewed release catalog
  // deliberately has no behavioral suites; its skill quality is not measured here.
  writeEvalFixture(projectDirectory);
  const evalResult = runCommand(
    binaryPath,
    ["eval", "run", "fixture-eval", "--model", "mock", "--trials", "1", "--json"],
    projectDirectory,
    addEnvironmentVariables
  );
  assert.equal(evalResult.status, 0, evalResult.stderr);
  const parsedEval = JSON.parse(evalResult.stdout);
  assert.equal(parsedEval.skillName, "fixture-eval");
  assert.equal(parsedEval.runStatus, "complete");
  const inspectResult = runCommand(binaryPath, ["eval", "inspect", "fixture-eval", "--json"], projectDirectory, addEnvironmentVariables);
  assert.equal(inspectResult.status, 0, inspectResult.stderr);
  const parsedInspect = JSON.parse(inspectResult.stdout);
  assert.equal(parsedInspect.runId, parsedEval.runId);
  assert.equal(parsedInspect.rows.length, 2);
  assert.equal(parsedInspect.rows.find((row) => row.conditionId === "baseline:none").hardScore.passed, false);
  assert.equal(parsedInspect.rows.find((row) => row.conditionId === "treatment:fixture-eval").hardScore.passed, true);
});
