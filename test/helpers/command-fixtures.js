import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function createTemporaryDirectory(testContext, prefix) {
  const directoryPath = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  testContext.after(() => {
    if (path.dirname(directoryPath) !== path.resolve(os.tmpdir())) {
      throw new Error("Temporary cleanup must stay in the created directory.");
    }
    fs.rmSync(directoryPath, { recursive: true, force: true });
  });
  return directoryPath;
}

export function runCommand(commandName, argumentList, currentWorkingDirectory, environmentVariables = {}) {
  let executable = commandName;
  let commandArguments = argumentList;
  if (commandName === "npm") {
    const npmCliPath = process.env.VASIR_TEST_NPM_CLI || process.env.npm_execpath;
    if (npmCliPath && /\.(?:c?js|mjs)$/i.test(npmCliPath)) {
      executable = process.execPath;
      commandArguments = [npmCliPath, ...argumentList];
    } else if (process.platform === "win32") {
      executable = "npm.cmd";
    }
  }

  const options = {
    cwd: currentWorkingDirectory,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      ...environmentVariables,
      PATH: `${path.dirname(process.execPath)}${path.delimiter}${environmentVariables.PATH || process.env.PATH || ""}`
    }
  };
  // Windows npm-generated .cmd shims require cmd.exe. All arguments here are
  // bounded test inputs; quote them before asking the shell to launch the shim.
  if (process.platform === "win32" && /\.cmd$/i.test(executable)) {
    const quote = (value) => {
      if (/["\r\n%]/.test(value)) {
        throw new Error("Unsupported shell metacharacter in a test command.");
      }
      return `"${value}"`;
    };
    executable = [executable, ...commandArguments].map(quote).join(" ");
    commandArguments = [];
    options.shell = true;
  }
  const commandResult = childProcess.spawnSync(executable, commandArguments, options);
  if (commandResult.error) {
    throw commandResult.error;
  }
  return commandResult;
}

export function writeEvalFixture(repositoryDirectory, skillName = "fixture-eval") {
  const skillDirectory = path.join(repositoryDirectory, ".agents", "skills", skillName);
  fs.mkdirSync(path.join(skillDirectory, "evals"), { recursive: true });
  fs.writeFileSync(path.join(skillDirectory, "SKILL.md"), `---
name: ${skillName}
description: Deterministic test fixture for the eval command plumbing.
---

Make the implementation explicit.
`);
  fs.writeFileSync(path.join(skillDirectory, "evals", "suite.json"), `${JSON.stringify({
    id: "fixture-command-plumbing",
    cases: [{
      id: "explicit-guidance",
      task: "Describe a bounded implementation.",
      requiredSubstrings: ["implementation"],
      forbiddenSubstrings: ["secret"]
    }]
  }, null, 2)}\n`);
  return skillDirectory;
}
