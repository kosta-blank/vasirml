import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { normalizeModelRouting, renderModelRoutingPolicy } from "../cli/model-routing.js";
import {
  createEmptyProjectConfig,
  createProjectConfigWithAgentsProfile,
  createTrackingProjectConfig,
  readProjectConfig,
  writeProjectConfig
} from "../cli/project-config.js";

function projectPaths(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vasir-model-routing-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return { agentsDirectory: path.join(directory, ".agents") };
}

const routing = {
  codex: {
    default: { model: "future-codex", reasoningEffort: "medium" },
    planning: { model: "future-codex-planner", reasoningEffort: "ultra", fallback: { model: "future-codex-fallback", reasoningEffort: "low" } },
    review: { model: "future-codex-review" }
  },
  claude: {
    execution: { model: "future-claude-executor", reasoningEffort: "high" }
  }
};

const crossHostRouting = {
  codex: {
    design: { host: "claude", model: "opus", reasoningEffort: "high", fallback: { host: "codex", model: "gpt-5.6-sol", reasoningEffort: "high" } }
  },
  claude: {
    design: { host: "claude", model: "opus", reasoningEffort: "high", fallback: { host: "codex", model: "gpt-5.6-sol", reasoningEffort: "high" } }
  }
};

test("model routing accepts partial policies and safe future host model IDs without a catalog", () => {
  assert.equal(normalizeModelRouting(), null);
  assert.equal(normalizeModelRouting(null), null);
  assert.deepEqual(normalizeModelRouting({}), {});
  assert.deepEqual(normalizeModelRouting({ claude: {} }), { claude: {} });
  const partial = { codex: { subagent: { model: "provider/future-model.v2:latest", fallback: { model: "future-alternative" } } } };
  assert.deepEqual(normalizeModelRouting(partial), partial);
  assert.deepEqual(normalizeModelRouting(routing), routing);
  assert.notEqual(normalizeModelRouting(routing).codex.planning, routing.codex.planning);
  for (const reasoningEffort of ["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"]) {
    assert.equal(normalizeModelRouting({ codex: { default: { model: "future-model", reasoningEffort } } }).codex.default.reasoningEffort, reasoningEffort);
  }
});

test("model routing rejects malformed hosts, roles, routes, recursive fallbacks, and unknown fields", () => {
  for (const malformed of [
    false, "codex", [], 42,
    { other: {} }, { codex: null }, { claude: [] }, { codex: "future-model" },
    { codex: { agent: { model: "future-model" } } },
    { codex: { planning: null } }, { codex: { planning: [] } },
    { codex: { planning: "future-model" } }, { codex: { planning: {} } },
    { codex: { planning: { model: 123 } } },
    { codex: { planning: { model: "future-model", unknown: true } } },
    { codex: { planning: { model: "future-model", fallback: null } } },
    { codex: { planning: { model: "future-model", fallback: "future-alternative" } } },
    { codex: { planning: { model: "future-model", fallback: { model: "future-alternative", unknown: true } } } },
    { codex: { planning: { model: "future-model", fallback: { model: "future-alternative", fallback: { model: "third-model" } } } } }
  ]) {
    assert.throws(() => normalizeModelRouting(malformed), Error, JSON.stringify(malformed));
  }
});

test("design routes and optional primary and fallback hosts normalize without changing their meaning", () => {
  assert.deepEqual(normalizeModelRouting(crossHostRouting), crossHostRouting);
  for (const consumer of ["codex", "claude"]) {
    for (const host of ["codex", "claude"]) {
      const modelRouting = { [consumer]: { design: { host, model: "future-primary", fallback: { host, model: "future-fallback" } } } };
      assert.deepEqual(normalizeModelRouting(modelRouting), modelRouting);
    }
  }
  const inherited = { codex: { design: { host: "claude", model: "opus", fallback: { model: "sonnet" } } } };
  assert.deepEqual(normalizeModelRouting(inherited), inherited, "absent fallback host remains implicit in stored config");
});

test("primary and fallback host selectors reject unsupported names and unsafe shapes", () => {
  for (const host of ["", "other", "Codex", "CLAUDE", "claude ", "claude|cell", null, false, 1, {}, []]) {
    assert.throws(() => normalizeModelRouting({ codex: { design: { host, model: "opus" } } }), /host/i);
    assert.throws(() => normalizeModelRouting({ claude: { design: { model: "opus", fallback: { host, model: "gpt-5.6-sol" } } } }), /host/i);
  }
  for (const design of [
    { host: "claude" },
    { host: "claude", model: "opus", fallback: { host: "codex" } },
    { host: "claude", model: "opus", fallback: { host: "codex", model: "gpt-5.6-sol", fallback: { model: "third-model" } } }
  ]) {
    assert.throws(() => normalizeModelRouting({ codex: { design } }), Error);
  }
});

test("model IDs cannot inject Markdown or control characters and effort must be known", () => {
  for (const model of ["", " ", " leading", "trailing ", "line\n", "line\r", "line\t", "control\u0000", "two words", "`code`", "table|cell", "[link](url)", "<script>", "star*", "back\\slash", "hash#", "-option"]) {
    assert.throws(() => normalizeModelRouting({ codex: { default: { model } } }), /model/);
    assert.throws(() => normalizeModelRouting({ claude: { review: { model: "future-model", fallback: { model } } } }), /model/);
  }
  for (const reasoningEffort of ["", "unexpected", "HIGH", null, false, 1, {}, []]) {
    assert.throws(() => normalizeModelRouting({ codex: { default: { model: "future-model", reasoningEffort } } }), /reasoningEffort/);
    assert.throws(() => normalizeModelRouting({ codex: { default: { model: "future-model", fallback: { model: "alternative", reasoningEffort } } } }), /reasoningEffort/);
  }
});

test("rendering resolves each host's default and keeps host-specific model choices separate", () => {
  const codex = renderModelRoutingPolicy({ modelRouting: routing, consumer: "codex" });
  assert.ok(codex.includes("| Planning | `future-codex-planner` | `ultra` | `future-codex-fallback` (effort: `low`) |"));
  assert.ok(codex.includes("| Execution | `future-codex` | `medium` | Report limitation |"));
  assert.ok(codex.includes("| Routine subagents | `future-codex` | `medium` | Report limitation |"));
  assert.ok(codex.includes("| Independent review | `future-codex-review` | Host default | Report limitation |"));
  assert.ok(codex.includes("| Design | `future-codex` | `medium` | Report limitation |"));
  assert.ok(!codex.includes("future-claude"));

  const claude = renderModelRoutingPolicy({ modelRouting: routing, consumer: "claude" });
  assert.ok(claude.includes("| Planning | Inherit host | Inherit host | Report limitation |"));
  assert.ok(claude.includes("| Execution | `future-claude-executor` | `high` | Report limitation |"));
  assert.ok(claude.includes("| Design | Inherit host | Inherit host | Report limitation |"));
  assert.ok(!claude.includes("future-codex"));
  assert.equal(claude.split("\n").filter((line) => /^\| (Planning|Execution|Routine subagents|Independent review|Design) \|/.test(line)).length, 5);
});

test("cross-host design labels identify only targets outside the current consumer", () => {
  const codex = renderModelRoutingPolicy({ modelRouting: crossHostRouting, consumer: "codex" });
  const claude = renderModelRoutingPolicy({ modelRouting: crossHostRouting, consumer: "claude" });
  assert.ok(codex.includes("| Design | Claude: `opus` | `high` | `gpt-5.6-sol` (effort: `high`) |"));
  assert.ok(claude.includes("| Design | `opus` | `high` | Codex: `gpt-5.6-sol` (effort: `high`) |"));
});

test("omitted primary hosts inherit the consumer and omitted fallback hosts inherit the selected primary", () => {
  for (const consumer of ["codex", "claude"]) {
    const otherHost = consumer === "codex" ? "claude" : "codex";
    const otherName = otherHost === "codex" ? "Codex" : "Claude";
    for (const host of [undefined, consumer, otherHost]) {
      for (const fallbackHost of [undefined, consumer, otherHost]) {
        const design = {
          ...(host ? { host } : {}), model: "primary",
          fallback: { ...(fallbackHost ? { host: fallbackHost } : {}), model: "alternative" }
        };
        const primaryPrefix = host === otherHost ? `${otherName}: ` : "";
        const selectedFallbackHost = fallbackHost ?? host ?? consumer;
        const fallbackPrefix = selectedFallbackHost === otherHost ? `${otherName}: ` : "";
        const text = renderModelRoutingPolicy({ consumer, modelRouting: { [consumer]: { design } } });
        assert.ok(text.includes(`| Design | ${primaryPrefix}\`primary\` | Host default | ${fallbackPrefix}\`alternative\` (host default effort) |`), JSON.stringify({ consumer, design }));
      }
    }
  }
});

test("routing rendering covers fallback effort inheritance and host control limitations", () => {
  const text = renderModelRoutingPolicy({ consumer: "codex", modelRouting: { codex: { default: { model: "primary", fallback: { model: "alternative" } } } } });
  assert.ok(text.includes("`alternative` (host default effort)"));
  for (const phrase of ["Explicit user model and effort choices prevail", "only host-supported", "host validates availability", "does not change the main model", "explicit host handoff", "configured planner/executor delegation", "clean context", "does not change permissions"]) {
    assert.ok(text.includes(phrase), phrase);
  }
  assert.match(text, /never silently substitute|do not invent another route/i);
  assert.match(text, /(?:state|report)[^.\n]*(?:reason|why)[^.\n]*fallback|(?:state|report)[^.\n]*fallback[^.\n]*(?:reason|why)/i);
  assert.match(text, /fallback[^.\n]*unavailable[^.\n]*(?:stop|report)|(?:stop|report)[^.\n]*fallback[^.\n]*unavailable/i);
  for (const modelRouting of [null, {}, { codex: {} }, { claude: routing.claude }]) {
    const inherited = renderModelRoutingPolicy({ modelRouting, consumer: "codex" });
    assert.ok(inherited.includes("Inherit the host's model and reasoning settings"));
    assert.ok(inherited.includes("explicit user choices prevail"));
    assert.ok(!inherited.includes("| Role |"));
  }
  assert.throws(() => renderModelRoutingPolicy({ modelRouting: routing, consumer: "other" }), /Unsupported/);
  assert.throws(() => renderModelRoutingPolicy({ modelRouting: { codex: { default: { model: "invalid|model" } } }, consumer: "codex" }), /model/);
});

test("schema version 1 routing policies round-trip with or without an agents profile", (t) => {
  const paths = projectPaths(t);
  for (const agents of [{ profile: "BACKEND", modelRouting: routing }, { modelRouting: routing }, { profile: "BACKEND", modelRouting: crossHostRouting }, { modelRouting: crossHostRouting }]) {
    const original = { schemaVersion: 1, tracking: { mode: "all", skillNames: [] }, agents };
    writeProjectConfig({ projectPaths: paths, projectConfig: original });
    const expected = { ...original, agents: { ...agents, ...(agents.profile ? { profile: "backend" } : {}) } };
    assert.deepEqual(readProjectConfig({ projectPaths: paths }), expected);
  }
});

test("profile and tracking builders preserve routing through profile changes and removal", () => {
  for (const modelRouting of [routing, crossHostRouting]) {
    const original = { schemaVersion: 1, tracking: { mode: "all", skillNames: [] }, agents: { profile: "backend", modelRouting } };
    for (const profile of ["frontend", "generic", null, ""]) {
      const profileConfig = createProjectConfigWithAgentsProfile({ projectConfig: original, agentsProfileName: profile });
      assert.deepEqual(profileConfig.agents.modelRouting, modelRouting);
      assert.deepEqual(profileConfig.tracking, original.tracking);
      assert.equal(profileConfig.agents.profile, profile || undefined);
      const tracked = createTrackingProjectConfig({ trackingMode: "selected", selectedSkillNames: ["b", "a", "b"], existingProjectConfig: original, agentsProfileName: profile });
      assert.deepEqual(tracked.agents.modelRouting, modelRouting);
      assert.equal(tracked.agents.profile, profile || undefined);
      assert.deepEqual(tracked.tracking, { mode: "selected", skillNames: ["a", "b"] });
    }
    const routingOnly = { ...original, agents: { modelRouting } };
    assert.deepEqual(createTrackingProjectConfig({ trackingMode: "all", existingProjectConfig: routingOnly }).agents, routingOnly.agents);
    assert.deepEqual(createProjectConfigWithAgentsProfile({ projectConfig: routingOnly, agentsProfileName: "ios" }).agents, { profile: "ios", modelRouting });
    assert.equal(original.agents.profile, "backend");
  }
});

test("legacy configs retain their original agents shape when routing is absent", (t) => {
  const paths = projectPaths(t);
  assert.deepEqual(createEmptyProjectConfig(), { schemaVersion: 1, tracking: null, agents: null });
  for (const agents of [null, {}, { profile: "" }, { profile: "GENERIC" }]) {
    writeProjectConfig({ projectPaths: paths, projectConfig: { schemaVersion: 1, tracking: null, agents } });
    assert.deepEqual(readProjectConfig({ projectPaths: paths }).agents, agents?.profile ? { profile: "generic" } : null);
  }
  assert.deepEqual(createProjectConfigWithAgentsProfile({ agentsProfileName: "backend" }), { schemaVersion: 1, tracking: null, agents: { profile: "backend" } });
  assert.deepEqual(createTrackingProjectConfig({ trackingMode: "all", agentsProfileName: "backend" }).agents, { profile: "backend" });
  assert.equal(createTrackingProjectConfig({ trackingMode: "all" }).agents, null);
});

test("invalid routing in a routing-only config reports the existing project config error", (t) => {
  const paths = projectPaths(t);
  for (const agents of [
    { modelRouting: { codex: { planning: { model: "unsafe|model" } } } },
    { profile: "", modelRouting: { unexpected: {} } },
    { profile: "backend", modelRouting: { claude: { review: { model: "future-model", reasoningEffort: "typo" } } } }
  ]) {
    writeProjectConfig({ projectPaths: paths, projectConfig: { schemaVersion: 1, tracking: null, agents } });
    assert.throws(() => readProjectConfig({ projectPaths: paths }), (error) => {
      assert.equal(error.code, "INVALID_PROJECT_CONFIG");
      assert.match(error.message, /vasir.json/);
      return true;
    });
  }
});
