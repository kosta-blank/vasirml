import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createTemporaryDirectory, runCommand, writeEvalFixture } from "./helpers/command-fixtures.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function createWrapperFixture(testContext) {
  const repositoryDirectory = createTemporaryDirectory(testContext, "vasir-npm-script-");
  fs.mkdirSync(path.join(repositoryDirectory, ".git"));
  // Exercise the real wrapper and runtime without attaching suites or eval
  // history to the released skills. This fixture only proves command plumbing.
  for (const directoryName of ["cli", "templates", "scripts", "registry"]) {
    fs.cpSync(path.join(REPO_ROOT, directoryName), path.join(repositoryDirectory, directoryName), { recursive: true });
  }
  fs.cpSync(path.join(REPO_ROOT, "node_modules", "cli-spinners"), path.join(repositoryDirectory, "node_modules", "cli-spinners"), { recursive: true });
  const packageDefinition = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
  fs.writeFileSync(path.join(repositoryDirectory, "package.json"), JSON.stringify({
    name: "vasir-eval-test-fixture",
    private: true,
    type: "module",
    scripts: { eval: packageDefinition.scripts.eval }
  }));
  const skillDirectory = writeEvalFixture(repositoryDirectory);
  const homeDirectory = path.join(repositoryDirectory, "home");
  fs.mkdirSync(homeDirectory);
  return { repositoryDirectory, skillDirectory, environment: { HOME: homeDirectory, USERPROFILE: homeDirectory, NO_COLOR: "1" } };
}

test("npm run eval accepts a positional skill name without requiring --", (testContext) => {
  const { repositoryDirectory, environment } = createWrapperFixture(testContext);
  const commandResult = runCommand("npm", ["run", "eval", "fixture-eval", "mock"], repositoryDirectory, environment);
  assert.equal(commandResult.status, 0, commandResult.stderr);
  assert.match(commandResult.stdout, /Starting Eval fixture-eval/i);
  assert.match(commandResult.stdout, /Preparing Eval fixture-eval/i);
  assert.match(commandResult.stdout, /0\/6/i);
  assert.match(commandResult.stdout, /6\/6 mock:skill-aware .*trial-3 .*treatment/i);
  assert.match(commandResult.stdout, /Summary/i);
  assert.match(commandResult.stdout, /summary via:\s+mock:skill-aware/i);
  assert.match(commandResult.stdout, /Inspect/i);
});

test("npm run eval infers the skill from INIT_CWD and accepts a positional model selector", (testContext) => {
  const { skillDirectory, environment } = createWrapperFixture(testContext);
  const commandResult = runCommand("npm", ["run", "eval", "mock"], skillDirectory, environment);
  assert.equal(commandResult.status, 0, commandResult.stderr);
  assert.match(commandResult.stdout, /Starting Eval fixture-eval/i);
  assert.match(commandResult.stdout, /Eval fixture-eval/);
  assert.match(commandResult.stdout, /Summary/i);
});

test("repo eval wrapper reports that all catalog skills lack built-in suites", (testContext) => {
  const homeDirectory = createTemporaryDirectory(testContext, "vasir-eval-home-");
  const commandResult = runCommand(process.execPath, ["./cli/eval.js"], REPO_ROOT, {
    HOME: homeDirectory, USERPROFILE: homeDirectory, INIT_CWD: REPO_ROOT, NO_COLOR: "1"
  });
  assert.equal(commandResult.status, 1);
  assert.match(commandResult.stderr, /Eval-Ready Skills \(0\/67\)/i);
  assert.match(commandResult.stderr, /Missing Built-In Evals \(67\/67\)/i);
  assert.match(commandResult.stderr, /agents-creating-folder-agents/i);
  assert.match(commandResult.stderr, /code-fixing-bugs/i);
});

test("repo eval wrapper infers a non-eval skill from INIT_CWD before treating a positional model as the target", (testContext) => {
  const homeDirectory = createTemporaryDirectory(testContext, "vasir-eval-home-");
  const commandResult = runCommand(process.execPath, ["./cli/eval.js", "mock", "--json"], REPO_ROOT, {
    HOME: homeDirectory,
    USERPROFILE: homeDirectory,
    INIT_CWD: path.join(REPO_ROOT, ".agents", "skills", "code-fixing-bugs"),
    NO_COLOR: "1"
  });
  assert.equal(commandResult.status, 1);
  const parsedError = JSON.parse(commandResult.stderr);
  assert.equal(parsedError.code, "EVAL_SUITE_NOT_FOUND");
  assert.match(parsedError.message, /code-fixing-bugs/i);
});
