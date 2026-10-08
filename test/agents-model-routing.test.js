import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  initializeProjectAgentsFile,
  runAgents,
  synchronizeProjectAgentsFile,
  validateProjectAgentsFile
} from "../cli/agents.js";

const globalCatalogDirectory = fileURLToPath(new URL("../", import.meta.url));
const startMarker = "<!-- vasir:model-routing:start -->";
const endMarker = "<!-- vasir:model-routing:end -->";
const tracking = { mode: "selected", skillNames: ["planning", "testing"] };

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vasir-model-routing-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function writeFile(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function configuredRouting() {
  return {
    codex: {
      planning: { model: "gpt-6.1-sol", reasoningEffort: "ultra" },
      execution: { model: "gpt-6.1-sol", reasoningEffort: "high" },
      subagent: { model: "gpt-6-luna", reasoningEffort: "high" },
      review: {
        model: "gpt-6.1-sol",
        reasoningEffort: "xhigh",
        fallback: { model: "gpt-6-sol", reasoningEffort: "high" }
      },
      design: { host: "claude", model: "opus", reasoningEffort: "high", fallback: { host: "codex", model: "gpt-5.6-sol", reasoningEffort: "high" } }
    },
    claude: {
      default: { model: "claude-sonnet-4-6", reasoningEffort: "high" },
      planning: { model: "claude-opus-4-7", reasoningEffort: "max" },
      design: { host: "claude", model: "opus", reasoningEffort: "high", fallback: { host: "codex", model: "gpt-5.6-sol", reasoningEffort: "high" } }
    }
  };
}

function writeConfig(projectRootDirectory, modelRouting, profile = "generic") {
  const config = { schemaVersion: 1, tracking, agents: { profile } };
  if (modelRouting !== undefined) config.agents.modelRouting = modelRouting;
  writeFile(path.join(projectRootDirectory, ".agents", "vasir.json"), `${JSON.stringify(config, null, 2)}\n`);
  return config;
}

function readConfig(projectRootDirectory) {
  return JSON.parse(fs.readFileSync(path.join(projectRootDirectory, ".agents", "vasir.json"), "utf8"));
}

function synchronize(projectRootDirectory, options = {}) {
  return synchronizeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, ...options });
}

function readRoot(projectRootDirectory, fileName = "AGENTS.md") {
  return fs.readFileSync(path.join(projectRootDirectory, fileName), "utf8");
}

function routingBlock(text) {
  assert.equal(text.split(startMarker).length, 2, "one model-routing start marker");
  assert.equal(text.split(endMarker).length, 2, "one model-routing end marker");
  return text.slice(text.indexOf(startMarker) + startMarker.length, text.indexOf(endMarker)).trim();
}

function routingRows(text) {
  return routingBlock(text).split(/\r?\n/).filter((line) => /^\| (Planning|Execution|Routine subagents|Independent review|Design) \|/.test(line));
}

function snapshot(directory) {
  const files = {};
  function visit(currentDirectory, prefix = "") {
    for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
      const relativePath = `${prefix}${entry.name}`;
      const absolutePath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) visit(absolutePath, `${relativePath}/`);
      else files[relativePath] = fs.readFileSync(absolutePath).toString("base64");
    }
  }
  visit(directory);
  return files;
}

test("sync renders exact host-specific rows and cross-host design routes in both roots", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeConfig(projectRootDirectory, configuredRouting());
  synchronize(projectRootDirectory, { profileName: "generic" });
  const agents = readRoot(projectRootDirectory);
  const claude = readRoot(projectRootDirectory, "CLAUDE.md");
  assert.deepEqual(routingRows(agents), [
    "| Planning | `gpt-6.1-sol` | `ultra` | Report limitation |",
    "| Execution | `gpt-6.1-sol` | `high` | Report limitation |",
    "| Routine subagents | `gpt-6-luna` | `high` | Report limitation |",
    "| Independent review | `gpt-6.1-sol` | `xhigh` | `gpt-6-sol` (effort: `high`) |",
    "| Design | Claude: `opus` | `high` | `gpt-5.6-sol` (effort: `high`) |"
  ]);
  assert.deepEqual(routingRows(claude), [
    "| Planning | `claude-opus-4-7` | `max` | Report limitation |",
    "| Execution | `claude-sonnet-4-6` | `high` | Report limitation |",
    "| Routine subagents | `claude-sonnet-4-6` | `high` | Report limitation |",
    "| Independent review | `claude-sonnet-4-6` | `high` | Report limitation |",
    "| Design | `opus` | `high` | Codex: `gpt-5.6-sol` (effort: `high`) |"
  ]);
  assert.doesNotMatch(agents, /claude-(?:opus|sonnet)/);
  assert.doesNotMatch(claude, /gpt-6/);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
});

test("init uses configured routes and preserves routing and tracking when it writes the profile", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const modelRouting = configuredRouting();
  writeConfig(projectRootDirectory, modelRouting, "backend");
  initializeProjectAgentsFile({ globalCatalogDirectory, projectRootDirectory, profileName: "frontend" });
  assert.ok(routingRows(readRoot(projectRootDirectory)).includes("| Planning | `gpt-6.1-sol` | `ultra` | Report limitation |"));
  assert.ok(routingRows(readRoot(projectRootDirectory, "CLAUDE.md")).includes("| Planning | `claude-opus-4-7` | `max` | Report limitation |"));
  assert.deepEqual(readConfig(projectRootDirectory), {
    schemaVersion: 1, tracking, agents: { profile: "frontend", modelRouting }
  });
});

test("routing sync is idempotent and profile changes preserve routes and tracking", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const modelRouting = configuredRouting();
  writeConfig(projectRootDirectory, modelRouting);
  synchronize(projectRootDirectory, { persistProfileConfig: true });
  const before = snapshot(projectRootDirectory);
  const second = synchronize(projectRootDirectory, { persistProfileConfig: true });
  assert.equal(second.changed, false);
  assert.equal(second.wroteAgentsFile, false);
  assert.equal(second.wroteClaudeFile, false);
  assert.deepEqual(snapshot(projectRootDirectory), before);
  const changed = synchronize(projectRootDirectory, { profileName: "backend", persistProfileConfig: true });
  assert.equal(changed.wroteProjectConfigProfile, true);
  assert.deepEqual(readConfig(projectRootDirectory), {
    schemaVersion: 1, tracking, agents: { profile: "backend", modelRouting }
  });
  assert.deepEqual(routingRows(readRoot(projectRootDirectory)), routingRows(Buffer.from(before["AGENTS.md"], "base64").toString()));
});

test("editing a configured route updates only the appropriate provider policy on the next sync", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const modelRouting = configuredRouting();
  writeConfig(projectRootDirectory, modelRouting);
  synchronize(projectRootDirectory, { profileName: "generic" });
  const claudeBefore = readRoot(projectRootDirectory, "CLAUDE.md");
  modelRouting.codex.planning = { model: "gpt-6-sol", reasoningEffort: "max" };
  writeConfig(projectRootDirectory, modelRouting);
  const result = synchronize(projectRootDirectory, { profileName: "generic" });
  assert.equal(result.wroteAgentsFile, true);
  assert.equal(result.wroteClaudeFile, false);
  assert.equal(readRoot(projectRootDirectory, "CLAUDE.md"), claudeBefore);
  assert.ok(routingRows(readRoot(projectRootDirectory)).includes("| Planning | `gpt-6-sol` | `max` | Report limitation |"));
});

test("dry-run preserves every existing root, sidecar and config while previewing routing and profile changes", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const modelRouting = configuredRouting();
  writeConfig(projectRootDirectory, modelRouting);
  synchronize(projectRootDirectory, { profileName: "generic" });
  modelRouting.codex.planning.model = "gpt-6-sol";
  writeConfig(projectRootDirectory, modelRouting);
  const before = snapshot(projectRootDirectory);
  const result = synchronize(projectRootDirectory, { profileName: "backend", persistProfileConfig: true, dryRun: true });
  assert.equal(result.changed, true);
  assert.equal(result.wroteAgentsFile, false);
  assert.equal(result.wroteClaudeFile, false);
  assert.equal(result.wroteProjectConfigProfile, false);
  assert.deepEqual(snapshot(projectRootDirectory), before);
});

test("dry-run with configured routing creates no roots or non-obvious sidecar", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeConfig(projectRootDirectory, configuredRouting());
  const before = snapshot(projectRootDirectory);
  synchronize(projectRootDirectory, { profileName: "backend", persistProfileConfig: true, dryRun: true });
  assert.deepEqual(snapshot(projectRootDirectory), before);
});

test("invalid model routing rejects init and sync before writing roots, config or migrating sidecars", (t) => {
  const invalidRouting = [
    { codex: { planning: { model: "gpt-6.1-sol", reasoningEffort: "extreme" } } },
    { codex: { execution: { model: "bad\nmodel" } } },
    { codex: { review: { model: "gpt-6.1-sol", fallback: { model: "gpt-6-sol", fallback: { model: "gpt-6-luna" } } } } },
    { codex: { design: { host: "other", model: "opus" } } },
    { codex: { design: { host: "claude", model: "opus", fallback: { host: "other", model: "gpt-5.6-sol" } } } },
    { claude: { design: { host: "codex", model: "gpt-5.6-sol", fallback: { host: "claude" } } } },
    { codex: { design: { host: "claude", model: "opus", fallback: { host: "codex", model: "gpt-5.6-sol", fallback: { model: "third-model" } } } } },
    { unknownHost: { planning: { model: "gpt-6.1-sol" } } }
  ];
  for (const modelRouting of invalidRouting) {
    for (const render of [initializeProjectAgentsFile, synchronizeProjectAgentsFile]) {
      const projectRootDirectory = temporaryDirectory(t);
      writeConfig(projectRootDirectory, modelRouting);
      writeFile(path.join(projectRootDirectory, ".agents", "non-obvious.md"), "Preserve legacy context.\n");
      const before = snapshot(projectRootDirectory);
      assert.throws(() => render({ globalCatalogDirectory, projectRootDirectory, profileName: "backend", persistProfileConfig: true }), { code: "INVALID_PROJECT_CONFIG" });
      assert.deepEqual(snapshot(projectRootDirectory), before);
    }
  }
});

test("unspecified policy inherits host settings without pinning a global model", (t) => {
  for (const render of [initializeProjectAgentsFile, synchronizeProjectAgentsFile]) {
    const projectRootDirectory = temporaryDirectory(t);
    render({ globalCatalogDirectory, projectRootDirectory, profileName: "generic" });
    for (const fileName of ["AGENTS.md", "CLAUDE.md"]) {
      const block = routingBlock(readRoot(projectRootDirectory, fileName));
      assert.match(block, /Inherit the host's model and reasoning settings/);
      assert.match(block, /explicit user choices prevail/);
      assert.doesNotMatch(block, /gpt-\d|claude-(?:opus|sonnet|haiku)/);
    }
  }
});

test("provider-specific model-routing changes are allowed but changes to shared policy still fail", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeConfig(projectRootDirectory, configuredRouting());
  synchronize(projectRootDirectory, { profileName: "generic" });
  const claudeFilePath = path.join(projectRootDirectory, "CLAUDE.md");
  const original = readRoot(projectRootDirectory, "CLAUDE.md");
  const changedRouting = original.replace(routingBlock(original), "Provider-local model choices and effort settings.");
  writeFile(claudeFilePath, changedRouting);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
  const custody = changedRouting.match(/# 8\. Custody\r?\n([\s\S]*?)(?=\r?\n# 9\.)/)[1];
  const commitLine = custody.split(/\r?\n/).find((line) => /\bcommit\b/i.test(line));
  assert.ok(commitLine);
  writeFile(claudeFilePath, changedRouting.replace(commitLine, "Commit unrelated changes without reviewing them."));
  assert.ok(validateProjectAgentsFile({ projectRootDirectory }).issues.some((issue) => issue.code === "ROOT_CONTRACT_SHARED_POLICY_DRIFT"));
});

test("missing, duplicate and nested model-routing markers remain invalid", (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  writeConfig(projectRootDirectory, configuredRouting());
  synchronize(projectRootDirectory, { profileName: "generic" });
  for (const fileName of ["AGENTS.md", "CLAUDE.md"]) {
    const filePath = path.join(projectRootDirectory, fileName);
    const original = readRoot(projectRootDirectory, fileName);
    for (const malformed of [
      original.replace(endMarker, ""),
      original.replace(startMarker, `prefix ${startMarker}`).replace(endMarker, `prefix ${endMarker}`),
      `${original}\nprefix ${startMarker}\n`,
      `${original}\n${startMarker}\nDuplicate routing.\n${endMarker}\n`,
      original.replace(startMarker, `${startMarker}\n${startMarker}`).replace(endMarker, `${endMarker}\n${endMarker}`)
    ]) {
      writeFile(filePath, malformed);
      assert.ok(validateProjectAgentsFile({ projectRootDirectory }).issues.some((issue) => issue.code === "ROOT_CONTRACT_MARKERS_INVALID" && issue.filePath === filePath));
    }
    writeFile(filePath, original);
  }
});

test("scoped sync inherits per-host root routes and applies child role overrides without changing either config", async (t) => {
  const projectRootDirectory = temporaryDirectory(t);
  const childDirectory = path.join(projectRootDirectory, "packages", "web");
  writeConfig(projectRootDirectory, configuredRouting(), "backend");
  writeConfig(childDirectory, {
    codex: {
      execution: { model: "gpt-6-luna", reasoningEffort: "medium" },
      design: { host: "claude", model: "sonnet", reasoningEffort: "medium", fallback: { model: "opus", reasoningEffort: "low" } }
    }
  }, "frontend");
  const rootConfigBefore = fs.readFileSync(path.join(projectRootDirectory, ".agents", "vasir.json"), "utf8");
  const childConfigBefore = fs.readFileSync(path.join(childDirectory, ".agents", "vasir.json"), "utf8");
  await runAgents({
    agentsArguments: ["sync"], agentsScopePath: "packages/web", agentsSyncProfileName: "frontend",
    currentWorkingDirectory: projectRootDirectory, projectRootDirectory,
    repositoryUrl: pathToFileURL(globalCatalogDirectory).href, jsonOutput: true, stdoutWriter: () => {}
  });
  const agentsRows = routingRows(readRoot(childDirectory));
  assert.ok(agentsRows.includes("| Planning | `gpt-6.1-sol` | `ultra` | Report limitation |"));
  assert.ok(agentsRows.includes("| Execution | `gpt-6-luna` | `medium` | Report limitation |"));
  assert.ok(agentsRows.includes("| Routine subagents | `gpt-6-luna` | `high` | Report limitation |"));
  assert.ok(agentsRows.includes("| Design | Claude: `sonnet` | `medium` | Claude: `opus` (effort: `low`) |"));
  const claudeRows = routingRows(readRoot(childDirectory, "CLAUDE.md"));
  assert.ok(claudeRows.includes("| Planning | `claude-opus-4-7` | `max` | Report limitation |"));
  assert.ok(claudeRows.includes("| Design | `opus` | `high` | Codex: `gpt-5.6-sol` (effort: `high`) |"));
  assert.equal(fs.readFileSync(path.join(projectRootDirectory, ".agents", "vasir.json"), "utf8"), rootConfigBefore);
  assert.equal(fs.readFileSync(path.join(childDirectory, ".agents", "vasir.json"), "utf8"), childConfigBefore);
  assert.equal(fs.existsSync(path.join(projectRootDirectory, "AGENTS.md")), false);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory: childDirectory }).issues, []);
});

test("malformed nested model routing rejects scoped sync without changing any project file", async (t) => {
  for (const modelRouting of [
    { codex: { execution: { model: "gpt-6-luna", reasoningEffort: "invalid" } } },
    { codex: { design: { host: "unsupported", model: "opus" } } },
    { codex: { design: { host: "claude", model: "opus", fallback: { host: "codex" } } } }
  ]) {
    const projectRootDirectory = temporaryDirectory(t);
    const childDirectory = path.join(projectRootDirectory, "packages", "web");
    writeConfig(projectRootDirectory, configuredRouting(), "backend");
    writeConfig(childDirectory, modelRouting, "frontend");
    writeFile(path.join(childDirectory, ".agents", "non-obvious.md"), "Preserve nested context.\n");
    const before = snapshot(projectRootDirectory);
    await assert.rejects(runAgents({
      agentsArguments: ["sync"], agentsScopePath: "packages/web", agentsSyncProfileName: "frontend",
      currentWorkingDirectory: projectRootDirectory, projectRootDirectory,
      repositoryUrl: pathToFileURL(globalCatalogDirectory).href, jsonOutput: true, stdoutWriter: () => {}
    }), { code: "INVALID_PROJECT_CONFIG" });
    assert.deepEqual(snapshot(projectRootDirectory), before);
  }
});

test("shipped example synchronizes approved OpenAI fallbacks and Claude design in both roots", (t) => {
  const example = JSON.parse(fs.readFileSync(path.join(globalCatalogDirectory, "templates", "agents", "model-routing.example.json"), "utf8"));
  const efforts = { planning: "ultra", execution: "high", subagent: "high", review: "xhigh" };
  for (const [role, reasoningEffort] of Object.entries(efforts)) {
    assert.deepEqual(example.agents.modelRouting.codex[role].fallback, { model: "gpt-5.6-sol", reasoningEffort }, `${role} has the approved fallback and effort`);
  }
  const design = { host: "claude", model: "opus", reasoningEffort: "high", fallback: { host: "codex", model: "gpt-5.6-sol", reasoningEffort: "high" } };
  assert.deepEqual(example.agents.modelRouting.codex.design, design);
  assert.deepEqual({ host: "claude", ...example.agents.modelRouting.claude.design }, design);
  const projectRootDirectory = temporaryDirectory(t);
  writeFile(path.join(projectRootDirectory, ".agents", "vasir.json"), `${JSON.stringify(example, null, 2)}\n`);
  synchronize(projectRootDirectory, { profileName: "generic" });
  assert.deepEqual(routingRows(readRoot(projectRootDirectory)), [
    "| Planning | `gpt-6.1-sol` | `ultra` | `gpt-5.6-sol` (effort: `ultra`) |",
    "| Execution | `gpt-6.1-sol` | `high` | `gpt-5.6-sol` (effort: `high`) |",
    "| Routine subagents | `gpt-6-luna` | `high` | `gpt-5.6-sol` (effort: `high`) |",
    "| Independent review | `gpt-6.1-sol` | `xhigh` | `gpt-5.6-sol` (effort: `xhigh`) |",
    "| Design | Claude: `opus` | `high` | `gpt-5.6-sol` (effort: `high`) |"
  ]);
  assert.ok(routingRows(readRoot(projectRootDirectory, "CLAUDE.md")).includes("| Design | `opus` | `high` | Codex: `gpt-5.6-sol` (effort: `high`) |"));
  assert.deepEqual(readConfig(projectRootDirectory), example);
  assert.deepEqual(validateProjectAgentsFile({ projectRootDirectory }).issues, []);
  const before = snapshot(projectRootDirectory);
  assert.equal(synchronize(projectRootDirectory, { profileName: "generic" }).changed, false);
  assert.deepEqual(snapshot(projectRootDirectory), before);
});
