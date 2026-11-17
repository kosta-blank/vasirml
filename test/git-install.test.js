import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

import { createTemporaryDirectory, runCommand } from "./helpers/command-fixtures.js";

const root = fileURLToPath(new URL("../", import.meta.url));

test("fresh Git installation starts and initializes Tier A without source node_modules", (t) => {
  // Outside the worktree: Node must not find missing dependencies in ancestors.
  const base = createTemporaryDirectory(t, "vasir-git-install-");
  const source = path.join(base, "source");
  const install = path.join(base, "install");
  const project = path.join(base, "project");
  const home = path.join(base, "home");
  for (const directory of [source, install, project, home]) fs.mkdirSync(directory);
  for (const name of ["bin", "cli", "templates", ".agents/skills", ".agents/vasir.json",
    "registry.json", ".vasir-catalog-manifest.json", "skill-groups.json", "skill-priorities.json",
    "package.json", "package-lock.json"]) {
    fs.mkdirSync(path.dirname(path.join(source, name)), { recursive: true });
    fs.cpSync(path.join(root, name), path.join(source, name), { recursive: true });
  }
  const gitConfig = path.join(base, "gitconfig");
  fs.writeFileSync(gitConfig, "[core]\n  autocrlf = false\n");
  const env = {
    HOME: home, USERPROFILE: home, APPDATA: path.join(home, "AppData", "Roaming"),
    LOCALAPPDATA: path.join(home, "AppData", "Local"), NODE_PATH: "",
    GIT_CONFIG_GLOBAL: gitConfig, GIT_CONFIG_NOSYSTEM: "1",
    VASIR_REPOSITORY_URL: "", NO_COLOR: "1"
  };
  const run = (command, args, cwd) => {
    const result = runCommand(command, args, cwd, env);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result.stdout;
  };
  run("git", ["init", "--template="], source);
  run("git", ["add", "."], source);
  run("git", ["-c", "user.name=Vasir test", "-c", "user.email=vasir-test@example.invalid",
    "-c", "commit.gpgsign=false", "commit", "-m", "Git install fixture"], source);
  run("npm", ["install", "--global", "--offline", "--no-audit", "--no-fund",
    "--cache", path.join(base, "npm-cache"), "--prefix", install,
    "git+" + pathToFileURL(source).href], base);
  const shim = process.platform === "win32" ? path.join(install, "vasir.cmd") : path.join(install, "bin", "vasir");
  assert.match(run(shim, ["--version"], project), /vasir-slim/);
  const result = JSON.parse(run(shim, ["init", "--repo-root", project, "--json"], project));
  assert.equal(result.status, "success");
  const expected = JSON.parse(fs.readFileSync(path.join(root, "skill-priorities.json"), "utf8")).tiers.A;
  assert.deepEqual(fs.readdirSync(path.join(project, ".agents", "skills")).sort(), [...expected].sort());
  assert.ok(fs.existsSync(path.join(project, ".agents", "vasir.json")));
  assert.ok(fs.existsSync(path.join(project, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(project, "CLAUDE.md")));
  const tierB = JSON.parse(run(shim, ["add", "--tier", "b", "--replace", "--repo-root", project, "--json"], project));
  assert.deepEqual(tierB.selectedTiers, ["B"]);
  const priorities = JSON.parse(fs.readFileSync(path.join(root, "skill-priorities.json"), "utf8")).tiers;
  assert.deepEqual(fs.readdirSync(path.join(project, ".agents", "skills")).sort(), [...priorities.A, ...priorities.B].sort());
});
