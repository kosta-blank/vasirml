import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Exercise the delivered tarball, its installed entrypoint and real project files.
// All package-manager state, home aliases and projects stay in one fresh evidence tree.
const root = fileURLToPath(new URL("../", import.meta.url));
const evidence = path.join(root, "tmp", "package-verification");
fs.mkdirSync(evidence, { recursive: true });
const sandbox = fs.mkdtempSync(path.join(evidence, "smoke-"));
const taskHome = path.join(sandbox, "home");
const installRoot = path.join(sandbox, "installation");
const allProject = path.join(sandbox, "all-project");
const coreProject = path.join(sandbox, "core-project");
const groupProject = path.join(sandbox, "group-project");
const gamedevProject = path.join(sandbox, "gamedev-project");
const combinedGroupProject = path.join(sandbox, "combined-group-project");
const rejectedGroupProject = path.join(sandbox, "rejected-group-project");
for (const directory of [taskHome, installRoot, allProject, coreProject, groupProject, gamedevProject, combinedGroupProject, rejectedGroupProject]) {
  fs.mkdirSync(directory, { recursive: true });
}
const npmPath = process.env.VASIR_TEST_NPM_CLI || process.env.npm_execpath;
assert.ok(npmPath && fs.existsSync(npmPath) && /\.(?:c?js|mjs)$/i.test(npmPath), "Run through npm run check:package, or set VASIR_TEST_NPM_CLI to npm-cli.js.");
const sourceTree = root;
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"));
const coreNames = JSON.parse(fs.readFileSync(path.join(root, "registry", "review-metadata.json"), "utf8")).skills
  .filter((entry) => entry.tier === "Core").map((entry) => entry.canonicalId);
const release = JSON.parse(fs.readFileSync(path.join(sourceTree, "package.json"), "utf8"));
const archive = path.resolve(process.argv[2] || path.join(root, `${release.name}-${release.version}.tgz`));
const groupDefinitions = JSON.parse(fs.readFileSync(path.join(sourceTree, "skill-groups.json"), "utf8"));
const groupNames = Object.keys(groupDefinitions.groups);
const combinedGroupSkills = [...new Set(groupNames.flatMap((name) => groupDefinitions.groups[name].skills))];
const baseFrontendSkills = [...new Set(["base", "frontend"].flatMap((name) => groupDefinitions.groups[name].skills))];
const gamedevSkills = groupDefinitions.groups.gamedev.skills;
const expectedNames = registry.skills.map((entry) => entry.name).sort();
assert.equal(expectedNames.length, 67);
assert.equal(gamedevSkills.length, 29);
assert.equal(combinedGroupSkills.length, expectedNames.length);
assert.equal(groupDefinitions.groups.miscellaneous.skills.length, 22);
assert.ok(fs.existsSync(archive));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const archiveBefore = hash(archive);
const env = {
  ...process.env,
  USERPROFILE: taskHome,
  APPDATA: path.join(taskHome, "AppData", "Roaming"),
  LOCALAPPDATA: path.join(taskHome, "AppData", "Local"),
  XDG_CACHE_HOME: path.join(taskHome, ".cache"),
  npm_config_cache: path.join(sandbox, "npm-cache"),
  PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH || ""}`,
  CI: "true",
  NO_COLOR: "1",
  npm_config_update_notifier: "false",
};
// Windows os.homedir uses USERPROFILE; Unix requires a child-only HOME override.
if (process.platform !== "win32") env.HOME = taskHome;
delete env.VASIR_REPOSITORY_URL;
const checks = [];
let commandIndex = 0;
const saveJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
function run(label, executable, args, cwd, expectedExit = 0) {
  const result = spawnSync(executable, args, {
    cwd, env, encoding: "utf8", timeout: 120_000, maxBuffer: 10_000_000,
    // cmd /s /c expects its command string verbatim, including the outer quotes.
    windowsVerbatimArguments: process.platform === "win32" && executable === "cmd.exe",
  });
  const stem = String(++commandIndex).padStart(2, "0") + "-" + label;
  saveJson(path.join(sandbox, stem + ".json"), {
    label, executable, args, cwd, exitCode: result.status,
    error: result.error?.message, stdout: result.stdout, stderr: result.stderr,
  });
  assert.ifError(result.error);
  assert.equal(result.status, expectedExit, `${label}\n${result.stdout}\n${result.stderr}`);
  return result;
}
function check(label, action) {
  action();
  checks.push({ label, status: "passed" });
  console.log("PASS " + label);
}
function ordinaryFiles(directory, prefix = "") {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink(), "Unexpected linked skill file: " + entry.name);
    const relative = prefix + entry.name;
    if (entry.isDirectory()) result.push(...ordinaryFiles(path.join(directory, entry.name), relative + "/"));
    else if (entry.isFile()) result.push(relative);
  }
  return result.sort();
}
function verifySkills(project, names) {
  const skills = path.join(project, ".agents", "skills");
  assert.deepEqual(fs.readdirSync(skills).sort(), [...names].sort());
  for (const name of names) {
    const source = path.join(sourceTree, ".agents", "skills", name);
    const installed = path.join(skills, name);
    const files = ordinaryFiles(source);
    assert.deepEqual(ordinaryFiles(installed), files);
    for (const file of files) assert.equal(hash(path.join(installed, file)), hash(path.join(source, file)), name + "/" + file);
  }
}
function verifyGamedevAssets(project) {
  const whitepaper = "whitepaper-analyze-mmo-whitepaper";
  const genre = registry.skills.find((skill) => skill.name === "game-genre-routing");
  const art = registry.skills.find((skill) => skill.name === "art-direction-defining-game-art");
  const nestedWhitepaper = "references/whitepaper-analyze-mmo-whitepaper/SKILL.md";
  assert.ok(expectedNames.includes(whitepaper));
  assert.ok(genre.files.includes(nestedWhitepaper));
  const nestedArtReferences = art.files.filter((file) => /^[^/]+\/references\/[^/]+\.md$/.test(file));
  assert.ok(nestedArtReferences.length > 0);
  for (const [name, file] of [[whitepaper, "SKILL.md"], [genre.name, nestedWhitepaper], ...nestedArtReferences.map((file) => [art.name, file])]) {
    assert.equal(hash(path.join(project, ".agents", "skills", name, file)), hash(path.join(sourceTree, ".agents", "skills", name, file)), name + "/" + file);
  }
}
const binary = path.join(installRoot, "node_modules", "vasir-slim", "bin", "vasir.js");
function cli(label, args, cwd = allProject, expectedExit = 0) {
  return run(label, process.execPath, [binary, ...args], cwd, expectedExit);
}
function cliJson(label, args, cwd = allProject, expectedExit = 0) {
  const output = cli(label, [...args, "--json"], cwd, expectedExit);
  return JSON.parse(expectedExit === 0 ? output.stdout : output.stderr);
}
function seedProject(directory, name) {
  fs.mkdirSync(path.join(directory, ".git"));
  fs.mkdirSync(path.join(directory, "src"));
  saveJson(path.join(directory, "package.json"), {
    name, version: "1.0.0", private: true,
    description: "An isolated local project for verifying reviewed skill installation and agent contract synchronization.",
  });
  fs.writeFileSync(path.join(directory, "src", "index.js"), "export const ready = true;\n");
}
function report(status, error = null) {
  saveJson(path.join(sandbox, "results.json"), {
    status, error, node: process.version, platform: process.platform, packageManager: "npm",
    package: { name: release.name, version: release.version, archiveSha256: archiveBefore },
    sandbox, commandsRun: commandIndex, checks,
    scope: "Offline package installation and deterministic CLI behavior; no skill trials or external model calls.",
  });
}
try {
  check("child home isolation", () => {
    const result = run("home-isolation", process.execPath, ["--input-type=module", "-e", 'import os from "node:os"; console.log(os.homedir());'], sandbox);
    assert.equal(path.resolve(result.stdout.trim()), path.resolve(taskHome));
    assert.notEqual(path.resolve(taskHome), path.resolve(os.homedir()));
  });
  check("offline tarball installation", () => {
    saveJson(path.join(installRoot, "package.json"), { name: "vasir-slim-install-check", private: true });
    run("npm-install", process.execPath, [npmPath, "install", archive, "--offline", "--ignore-scripts", "--no-audit", "--no-fund", "--cache", env.npm_config_cache], installRoot);
    assert.ok(fs.existsSync(binary));
  });
  check("installed command shim and version", () => {
    const shim = path.join(installRoot, "node_modules", ".bin", process.platform === "win32" ? "vasir.cmd" : "vasir");
    assert.ok(fs.existsSync(shim));
    const result = process.platform === "win32"
      ? run("installed-shim-version", "cmd.exe", ["/d", "/s", "/c", `""${shim}" --version"`], installRoot)
      : run("installed-shim-version", shim, ["--version"], installRoot);
    assert.equal(result.stdout.trim(), `${release.name} ${release.displayVersion ?? release.version}`);
    const version = cliJson("installed-version-json", ["--version"], installRoot);
    assert.equal(version.version, release.version);
    assert.equal(version.displayVersion, release.displayVersion ?? release.version);
  });
  seedProject(allProject, "all-reviewed-skills-check");
  seedProject(coreProject, "core-reviewed-skills-check");
  seedProject(groupProject, "group-reviewed-skills-check");
  seedProject(gamedevProject, "gamedev-pending-skills-check");
  seedProject(combinedGroupProject, "combined-group-skills-check");
  seedProject(rejectedGroupProject, "rejected-group-skills-check");
  check("short skill discovery is read-only and includes every group", () => {
    const listed = cliJson("skills-list", ["skills"], rejectedGroupProject);
    assert.deepEqual(listed.skills.map((skill) => skill.name).sort(), expectedNames);
    assert.equal(listed.skillCount, expectedNames.length);
    for (const skill of listed.skills) {
      assert.ok(skill.description.length > 0 && skill.description.length <= 160);
      assert.equal(skill.groups.length, 1);
    }
    const misc = cliJson("skills-miscellaneous", ["skills", "miscellaneous"], rejectedGroupProject);
    assert.deepEqual(misc.skills.map((skill) => skill.name).sort(), [...groupDefinitions.groups.miscellaneous.skills].sort());
    assert.match(cli("skills-readable", ["skills", "base"], rejectedGroupProject).stdout, /vasir add --group/);
    assert.equal(cliJson("skills-unknown-group", ["skills", "unknown"], rejectedGroupProject, 1).code, "UNKNOWN_SKILL_GROUP");
    assert.equal(fs.existsSync(path.join(taskHome, ".agents", "vasir")), false);
    assert.equal(fs.existsSync(path.join(rejectedGroupProject, ".agents")), false);
  });
  check("group discovery is read-only and matches packaged definitions", () => {
    assert.equal(hash(path.join(installRoot, "node_modules", "vasir-slim", "skill-groups.json")), hash(path.join(sourceTree, "skill-groups.json")));
    assert.equal(fs.existsSync(path.join(taskHome, ".agents", "vasir")), false);
    const listed = cliJson("groups-list", ["groups"], groupProject);
    assert.deepEqual(listed.selectedGroups, groupNames);
    assert.deepEqual(listed.skills, combinedGroupSkills);
    assert.equal(listed.skillCount, combinedGroupSkills.length);
    for (const group of listed.groups) {
      assert.deepEqual(group.skills, groupDefinitions.groups[group.name].skills);
      assert.equal(group.description, groupDefinitions.groups[group.name].description);
      assert.equal(group.skillCount, group.skills.length);
    }
    const frontend = cliJson("groups-frontend", ["groups", "frontend"], groupProject);
    assert.deepEqual(frontend.skills, groupDefinitions.groups.frontend.skills);
    const text = cli("groups-readable", ["groups"], groupProject).stdout;
    for (const name of combinedGroupSkills) assert.ok(text.includes(name), name);
    assert.equal(fs.existsSync(path.join(taskHome, ".agents", "vasir")), false);
    assert.equal(fs.existsSync(path.join(groupProject, ".agents")), false);
  });
  check("invalid group requests fail before project changes", () => {
    const rejected = cliJson("unknown-group", ["add", "--group", "nonexistent"], rejectedGroupProject, 1);
    assert.equal(rejected.code, "UNKNOWN_SKILL_GROUP");
    const conflict = cliJson("group-all-conflict", ["add", "all", "--group", "base"], rejectedGroupProject, 1);
    assert.equal(conflict.code, "ALL_SKILLS_REQUEST_CONFLICT");
    assert.equal(fs.existsSync(path.join(rejectedGroupProject, ".agents")), false);
    assert.equal(fs.existsSync(path.join(rejectedGroupProject, "AGENTS.md")), false);
  });
  check("base plus frontend installs exact reviewed union and selected tracking", () => {
    const installed = cliJson("add-base-frontend", ["add", "--group", "base", "--group", "frontend", "--group", "base", "code-auditing", "--agents-profile", "frontend"], groupProject);
    assert.deepEqual(installed.selectedGroups, ["base", "frontend"]);
    assert.deepEqual([...installed.installedSkills].sort(), [...baseFrontendSkills].sort());
    verifySkills(groupProject, baseFrontendSkills);
    const config = JSON.parse(fs.readFileSync(path.join(groupProject, ".agents", "vasir.json"), "utf8"));
    assert.equal(config.tracking.mode, "selected");
    assert.deepEqual([...config.tracking.skillNames].sort(), [...baseFrontendSkills].sort());
    assert.equal(config.agents.profile, "frontend");
    for (const host of [".codex", ".claude"]) assert.equal(fs.realpathSync(path.join(groupProject, host, "skills")), fs.realpathSync(path.join(groupProject, ".agents", "skills")));
  });
  check("gamedev installs all pending bundles including whitepaper and nested references", () => {
    const installed = cliJson("add-gamedev", ["add", "--group", "gamedev"], gamedevProject);
    assert.deepEqual(installed.selectedGroups, ["gamedev"]);
    assert.deepEqual(installed.installedSkills, gamedevSkills);
    verifySkills(gamedevProject, gamedevSkills);
    verifyGamedevAssets(gamedevProject);
    const config = JSON.parse(fs.readFileSync(path.join(gamedevProject, ".agents", "vasir.json"), "utf8"));
    assert.equal(config.tracking.mode, "selected");
    assert.deepEqual([...config.tracking.skillNames].sort(), [...gamedevSkills].sort());
    const updated = cliJson("gamedev-selected-update", ["update"], gamedevProject);
    assert.equal(updated.unchangedSkills.length, gamedevSkills.length);
    verifySkills(gamedevProject, gamedevSkills);
  });
  check("all four groups install the exact deduplicated catalog union", () => {
    const installed = cliJson("add-all-groups", ["add", ...groupNames.flatMap((name) => ["--group", name]), "--group", "gamedev", "whitepaper-analyze-mmo-whitepaper"], combinedGroupProject);
    assert.deepEqual(installed.selectedGroups, groupNames);
    assert.deepEqual(installed.installedSkills, combinedGroupSkills);
    verifySkills(combinedGroupProject, combinedGroupSkills);
    verifyGamedevAssets(combinedGroupProject);
    const config = JSON.parse(fs.readFileSync(path.join(combinedGroupProject, ".agents", "vasir.json"), "utf8"));
    assert.equal(config.tracking.mode, "selected");
    assert.deepEqual([...config.tracking.skillNames].sort(), [...combinedGroupSkills].sort());
  });
  check("group refresh respects existing files and model routing", () => {
    const configFile = path.join(groupProject, ".agents", "vasir.json");
    const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
    config.agents.modelRouting = JSON.parse(fs.readFileSync(path.join(sourceTree, ".agents", "vasir.json"), "utf8")).agents.modelRouting;
    saveJson(configFile, config);
    const configBefore = hash(configFile);
    const rootBefore = [hash(path.join(groupProject, "AGENTS.md")), hash(path.join(groupProject, "CLAUDE.md"))];
    const duplicate = cliJson("group-repeat-needs-replace", ["add", "--group", "base", "--group", "frontend"], groupProject, 1);
    assert.equal(duplicate.code, "PROJECT_SKILL_EXISTS");
    assert.equal(hash(configFile), configBefore);
    cliJson("group-safe-refresh", ["add", "--group", "base", "--group", "frontend", "--replace"], groupProject);
    assert.deepEqual(JSON.parse(fs.readFileSync(configFile, "utf8")).agents.modelRouting, config.agents.modelRouting);
    assert.deepEqual([hash(path.join(groupProject, "AGENTS.md")), hash(path.join(groupProject, "CLAUDE.md"))], rootBefore);
    const updated = cliJson("group-selected-update", ["update"], groupProject);
    assert.equal(updated.unchangedSkills.length, baseFrontendSkills.length);
    verifySkills(groupProject, baseFrontendSkills);
  });
  check("modified group members remain protected", () => {
    const file = path.join(groupProject, ".agents", "skills", "design-frontend-foundations", "SKILL.md");
    const original = fs.readFileSync(file);
    try {
      fs.appendFileSync(file, "\nLocal group journey customization.\n");
      const modifiedHash = hash(file);
      const rejected = cliJson("group-modified-refresh-rejected", ["add", "--group", "base", "--group", "frontend", "--replace"], groupProject, 1);
      assert.equal(rejected.code, "PROJECT_SKILL_MODIFIED");
      assert.equal(hash(file), modifiedHash);
    } finally {
      fs.writeFileSync(file, original);
    }
    verifySkills(groupProject, baseFrontendSkills);
  });
  check("group members can be removed individually without re-enrollment", () => {
    const removedName = "design-animating-interfaces";
    cliJson("remove-group-member", ["remove", removedName], groupProject);
    const remaining = baseFrontendSkills.filter((name) => name !== removedName);
    verifySkills(groupProject, remaining);
    const updated = cliJson("update-after-group-member-removal", ["update"], groupProject);
    assert.equal(updated.unchangedSkills.length, remaining.length);
    verifySkills(groupProject, remaining);
  });
  check("help and exact complete catalog", () => {
    assert.match(cli("help", ["--help"]).stdout, /vasir agents sync/);
    const listed = cliJson("list", ["list"]);
    assert.deepEqual(listed.skills.map((skill) => skill.name).sort(), expectedNames);
    assert.ok(path.resolve(listed.globalCatalogDirectory).startsWith(path.resolve(taskHome) + path.sep));
    for (const skill of listed.skills) {
      const expected = registry.skills.find((entry) => entry.name === skill.name);
      assert.equal(skill.description, expected.description);
    }
  });
  check("init installs only base and supports explicit expansion to all 67", () => {
    const initialized = cliJson("init", ["init"]);
    assert.equal(initialized.trackingMode, "selected");
    verifySkills(allProject, groupDefinitions.groups.base.skills);
    assert.equal(cliJson("base-update", ["update"]).unchangedSkills.length, groupDefinitions.groups.base.skills.length);
    assert.equal(cliJson("base-reinit", ["init"]).unchangedSkills.length, groupDefinitions.groups.base.skills.length);
    verifySkills(allProject, groupDefinitions.groups.base.skills);
    cliJson("expand-frontend", ["add", "--group", "frontend"]);
    verifySkills(allProject, baseFrontendSkills);
    assert.equal(cliJson("expanded-selected-reinit", ["init"]).trackingMode, "selected");
    verifySkills(allProject, baseFrontendSkills);
    cliJson("explicit-add-all", ["add", "all", "--replace"]);
    assert.equal(JSON.parse(fs.readFileSync(path.join(allProject, ".agents", "vasir.json"), "utf8")).tracking.mode, "all");
    verifySkills(allProject, expectedNames);
    assert.equal(cliJson("all-reinit", ["init"]).trackingMode, "all");
    for (const host of [".codex", ".claude"]) {
      assert.equal(fs.realpathSync(path.join(allProject, host, "skills")), fs.realpathSync(path.join(allProject, ".agents", "skills")));
    }
  });
  check("updated routing survives contract synchronization", () => {
    const projectConfigPath = path.join(allProject, ".agents", "vasir.json");
    const config = JSON.parse(fs.readFileSync(projectConfigPath, "utf8"));
    const routing = JSON.parse(fs.readFileSync(path.join(sourceTree, ".agents", "vasir.json"), "utf8")).agents.modelRouting;
    assert.ok(routing?.codex?.planning?.fallback);
    config.agents = { ...config.agents, modelRouting: routing };
    saveJson(projectConfigPath, config);
    cliJson("agents-sync", ["agents", "sync"]);
    const validated = cliJson("agents-validate", ["agents", "validate"]);
    assert.equal(validated.status, "success");
    cliJson("agents-sync-frontend", ["agents", "sync", "--profile", "frontend"]);
    assert.deepEqual(JSON.parse(fs.readFileSync(projectConfigPath, "utf8")).agents.modelRouting, routing);
    for (const filename of ["AGENTS.md", "CLAUDE.md"]) {
      const text = fs.readFileSync(path.join(allProject, filename), "utf8");
      assert.match(text, /gpt-5\.6-sol/);
      assert.match(text, /opus/);
      assert.match(text, /plan-maintain-work-spec/);
      assert.doesNotMatch(text, /plan__maintain-work-spec/);
    }
    cliJson("agents-validate-frontend", ["agents", "validate"]);
    const first = [hash(path.join(allProject, "AGENTS.md")), hash(path.join(allProject, "CLAUDE.md"))];
    const dry = cliJson("agents-sync-idempotent", ["agents", "sync", "--dry-run"]);
    assert.equal(dry.changed, false);
    assert.deepEqual([hash(path.join(allProject, "AGENTS.md")), hash(path.join(allProject, "CLAUDE.md"))], first);
  });
  check("status doctor context and clean diff", () => {
    assert.equal(cliJson("status", ["status"]).overallStatus, "healthy");
    assert.equal(cliJson("doctor", ["doctor"]).overallStatus, "healthy");
    const context = cliJson("context", ["context", "--debug"]);
    assert.equal(context.execution.usesModel, false);
    assert.equal(context.execution.usesNetwork, false);
    const diff = cliJson("clean-diff", ["diff", "--exit-code"]);
    assert.equal(diff.overallStatus, "current");
  });
  check("dry-run and real update retain catalog bytes", () => {
    const dry = cliJson("update-dry-run", ["update", "--dry-run"]);
    assert.deepEqual(dry.updatedSkills, []);
    assert.deepEqual(dry.blockedSkills, []);
    const updated = cliJson("update", ["update"]);
    assert.equal(updated.unchangedSkills.length, expectedNames.length);
    verifySkills(allProject, expectedNames);
  });
  check("local modifications are protected", () => {
    const file = path.join(allProject, ".agents", "skills", "code-fixing-bugs", "SKILL.md");
    const bytes = fs.readFileSync(file);
    try {
      fs.appendFileSync(file, "\nLocal smoke-check customization.\n");
      const modifiedHash = hash(file);
      const dry = cliJson("modified-update-dry-run", ["update", "--dry-run"]);
      assert.ok(dry.blockedSkills.some((skill) => skill.skillName === "code-fixing-bugs" && skill.code === "PROJECT_SKILL_MODIFIED"));
      const rejected = cliJson("modified-update-rejected", ["update"], allProject, 1);
      assert.equal(rejected.code, "PROJECT_SKILL_MODIFIED");
      assert.equal(hash(file), modifiedHash);
    } finally {
      fs.writeFileSync(file, bytes);
    }
    verifySkills(allProject, expectedNames);
  });
  check("selected Core install and merged skill add/remove", () => {
    const core = coreNames;
    assert.equal(core.length, 13);
    cliJson("add-core", ["add", ...core], coreProject);
    verifySkills(coreProject, core);
    const added = cliJson("add-foundations", ["add", "design-frontend-foundations"], coreProject);
    assert.deepEqual(added.installedSkills, ["design-frontend-foundations"]);
    verifySkills(coreProject, [...core, "design-frontend-foundations"]);
    cliJson("remove-foundations", ["remove", "design-frontend-foundations"], coreProject);
    verifySkills(coreProject, core);
    const config = JSON.parse(fs.readFileSync(path.join(coreProject, ".agents", "vasir.json"), "utf8"));
    assert.equal(config.tracking.mode, "selected");
    assert.deepEqual([...config.tracking.skillNames].sort(), [...core].sort());
  });
  check("unknown skills cannot be installed", () => {
    const unknown = "nonexistent-catalog-skill";
    assert.ok(!expectedNames.includes(unknown));
    const rejected = cliJson("unknown-skill", ["add", unknown], coreProject, 1);
    assert.equal(rejected.code, "UNKNOWN_SKILL");
    verifySkills(coreProject, coreNames);
  });
  check("delivered archive remains unchanged", () => assert.equal(hash(archive), archiveBefore));
  report("passed");
  console.log(JSON.stringify({ status: "passed", checks: checks.length, commands: commandIndex, evidence: path.join(sandbox, "results.json") }));
} catch (error) {
  report("failed", error.stack);
  console.error(error.stack);
  console.error("Evidence: " + path.join(sandbox, "results.json"));
  process.exitCode = 1;
}
