# Project model routing

Status: Complete (historical source implementation)

This document preserves the earlier source implementation evidence. Test counts and environment limits below describe that source snapshot; they are not current reviewed-release validation results. See [persistent routing contracts](../../../project-model-routing.md) for the public contract.

## Outcome and scope

Projects select the models and reasoning effort used for planning, execution,
routine subagents, and independent review. Vasir preserves those choices in
`.agents/vasir.json` and renders the corresponding consumer policy into generated
`AGENTS.md` and `CLAUDE.md` roots. The project example uses the
Codex choices below:

| Role | Model | Reasoning effort |
| --- | --- | --- |
| Planning | gpt-6.1-sol | ultra |
| Execution | gpt-6.1-sol | high |
| Routine subagents | gpt-6-luna | high |
| Independent review | gpt-6.1-sol | xhigh |

The shared template remains independent of concrete model IDs. This change does
not write native runtime settings or switch a running main conversation's model.
Distinct main models require a supported host handoff or configured delegates.

## Contracts and risks

- Optional `agents.modelRouting` supports separate `codex` and `claude` policies.
  Each policy may define a default and any of the four roles. Each route has a
  model, optional reasoning effort, and optional single fallback.
- Configurations without routes keep their existing shape and host inheritance.
- Profile and skill-tracking updates must preserve routes and existing tracking.
- Scoped synchronization overlays ancestor-to-scope host/role entries without
  mutating parent configuration. A missing role uses an ancestor choice, then the
  consumer default, then host settings.
- Model IDs and effort values are validated structurally; model availability and
  effort support remain the host's responsibility. Only an explicitly configured
  fallback may substitute for an unavailable selection.
- Both generated roots share universal policy while their model-routing blocks
  may differ. Invalid markers, shared-policy drift, and byte budgets still fail.
- Invalid config and dry runs must not mutate roots, sidecars, or config.

## Acceptance evidence

1. Config tests cover backwards compatibility, invalid entries, preservation,
   partial defaults, fallbacks, and consumer separation.
2. Integration tests cover initialization, repeated sync, config/profile changes,
   scoped inheritance, dry runs, and rejection before writes.
3. Existing relevant CLI/contract tests pass; generated templates match their
   source and obey the source/composed byte budgets.
4. A reviewer using fresh context checks the changed artifacts and evidence;
   significant findings are resolved before completion.

## Decisions

The existing schema version stays at 1 because model routing is optional and old
configs remain valid. Ordinary sync remains deterministic and makes no model
calls. The Codex profile is provided as an editable example and used in
this repository's own project configuration. Claude design routing was added in
the extension below.

## Verification and review

- The focused config, contract, CLI behavior, install-flow, and source-style
  checks passed: 116 tests. After the final marker repair, the config/contract
  subset passed again: 43 tests, including all 21 new routing tests.
- The final full suite passed 167 of 175 tests. The remaining eight failures are
  unrelated to model routing: three require unavailable npm tooling, one eval
  wrapper attempts a sandbox-restricted global `.agents` write, and four expose
  existing skill-name/layout/registry or missing eval-suite issues in this
  workspace snapshot. Those environment and catalog paths remain unverified.
- Source templates regenerate without drift. All built-in profiles compose both
  roots within their budgets with valid, separate provider model-routing seams.
- The source project config contains the four example choices. Its generated
  roots validate, and a repeated dry-run synchronization reports no changes.
- A fresh-context independent reviewer found a malformed marker pair that
  escaped validation. The validator now rejects prefixed and inline routing
  markers; regression cases pass, and the reviewer independently confirmed the
  repair without further findings.

Runtime model availability and effort support are intentionally host-enforced
and were not exercised by these deterministic checks.

## Fallback and design extension

The extension adds explicit fallbacks for each OpenAI role, using `gpt-5.6-sol`
as the first alternative, and Claude as the preferred option for design tasks.
The existing primary models and efforts remain. Each of the four OpenAI roles
uses `gpt-5.6-sol` at the same effort as its primary selection, including `ultra`
for planning. This Codex host advertises Ultra support for that model; an API
integration must validate its own supported efforts rather than reuse Codex
levels blindly.

Design uses Claude Code's `opus` alias at `high`, with Codex `gpt-5.6-sol` at
`high` as the fallback. Opus is the configured example design route.
Both consumer policies include
the design choice so either host can identify the preferred route.

The optional `host` descriptor field selects `codex` or `claude`. When omitted,
the primary host is the current consumer and the fallback host is the primary
host. This preserves existing configs and keeps cross-host fallbacks explicit.
Scopes replace an entire role descriptor, including host and fallback, rather
than mixing a child's model with a parent's fallback.

Cross-host selection requires an available, authorized runner, handoff, or
delegation. These instructions never authorize sending Claude IDs to a Codex
model selector. The host still executes the selection; ordinary synchronization
only renders policy and makes no model calls. On unavailable host/model/effort,
use the configured fallback and state the original selection, fallback, and
reason. If that fallback is unavailable too, report the limitation; no additional
route is invented and no unbounded retry is permitted.

Acceptance covers schema validation, host/fallback inheritance, rendering in both
roots, shipped example contents, config preservation, scoped overrides,
idempotent sync, invalid-config rejection before writes, focused regression
checks, and an independent review. Runtime failover is not a new CLI feature and
is not claimed as tested by deterministic rendering tests.

Extension verification is complete:

- Config/routing, contract-validation, and source-style tests passed: 48/48,
  including all 26 routing tests after the extension.
- Seven relevant template/layout/docs checks passed, including every built-in
  profile's composition budget and local Markdown links. The template generator
  reports no drift.
- Both actual project roots were synchronized, validate with no issues, and are
  unchanged on repeated dry-run sync.
- A reviewer using fresh context independently confirmed schema/rendering,
  inheritance, preservation, preflight rejection, generated roots, and repeat
  sync. A minor example-description mismatch was corrected and verified; no
  actionable findings remain.

The broader suite was not repeated for this extension; the earlier unrelated
environment/catalog failures above are still outside its verification. Live
availability, outages, and cross-host failover were not exercised.
