import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

import { createTemporaryDirectory, runCommand } from "./helpers/command-fixtures.js";

const CLI_PATH = fileURLToPath(new URL("../bin/vasir.js", import.meta.url));

function invokeJsonCommand(testContext, argumentsList) {
  const homeDirectory = createTemporaryDirectory(testContext, "vasir-json-home-");
  const projectDirectory = createTemporaryDirectory(testContext, "vasir-json-project-");
  return runCommand(process.execPath, [CLI_PATH, ...argumentsList], projectDirectory, {
    HOME: homeDirectory,
    USERPROFILE: homeDirectory,
    NO_COLOR: "1"
  });
}

test("real CLI JSON success keeps stdout parseable and stderr empty", (testContext) => {
  const result = invokeJsonCommand(testContext, ["groups", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.command, "groups");
  assert.equal(payload.status, "success");
  assert.deepEqual(payload.selectedGroups, ["base", "frontend"]);
  assert.equal(payload.skillCount, 16);
  assert.equal(result.stderr, "");
});

test("real CLI JSON failure keeps stderr parseable and stdout empty", (testContext) => {
  const result = invokeJsonCommand(testContext, ["add", "--group", "--json"]);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  const payload = JSON.parse(result.stderr);
  assert.equal(payload.command, "add");
  assert.equal(payload.status, "error");
  assert.equal(payload.code, "GROUP_FLAG_VALUE_REQUIRED");
  assert.match(payload.suggestion, /vasir groups/);
});
