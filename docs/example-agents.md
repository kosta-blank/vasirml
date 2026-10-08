# Example project contract

The root contract defines shared working rules, while a project supplies its purpose, local constraints, and routing. The canonical laws live in [shared-contract.md](../templates/agents/shared-contract.md). [AGENTS.md](../templates/agents/AGENTS.md) and [CLAUDE.md](../templates/agents/CLAUDE.md) are generated from that source, with distinct consumer adapters and matching shared laws.

Maintainers regenerate the source twins from the Vasir repository root with `node scripts/build-agent-templates.js --write` and verify them with `node scripts/build-agent-templates.js --check`. See [the template guide](../templates/agents/README.md) and [the generator](../scripts/build-agent-templates.js).

In a consuming project, run `vasir agents sync --dry-run`, then `vasir agents sync` to assemble both roots. Profiles select [stack-specific snippets](../templates/agents/snippets/); `AGENTS__non-obvious.md` supplies persistent project constraints. Use `--profile frontend|backend|ios|generic` for an explicit selection. Nested root contracts for a monorepo app or package use `--scope <path>`. Folder `AGENTS.md` files are hand-authored steering maps for ordinary subtrees.

## Model routing

Optional, persistent model choices belong in `.agents/vasir.json`, not in generated `AGENTS.md` or `CLAUDE.md` edits. Host policies support `default`, `planning`, `execution`, `subagent`, `review`, and `design`. The [complete JSON example](../templates/agents/model-routing.example.json) keeps `schemaVersion` at `1` and configures the four Codex roles plus Claude design routes in both consumers. Each descriptor has a model and may include `reasoningEffort`, `host` (`codex` or `claude`), and an explicit `fallback` descriptor. If `host` is omitted, the primary uses the current consumer; if the fallback's host is omitted, it uses the primary host. Omitted roles inherit that host's `default`, and with no host block the current host applies. An explicit user model choice takes precedence.

The shipped example assigns all four Codex primary routes (planning, execution, subagent, and review) a GPT-5.6 Sol fallback at the matching effort, including `ultra` for planning. Both `codex.design` and `claude.design` route to Claude's `opus` alias at `high` effort and explicitly fall back to Codex GPT-5.6 Sol at `high`. Claude Code documents `opus` as an alias for the latest permitted/deployed Opus model and supports high effort in its [model configuration reference](https://code.claude.com/docs/en/model-config).

Vasir validates descriptor structure; each host determines whether its model and effort are available. A primary may route to another host only through an authorized runner, handoff, or delegation. Never pass a model ID from one provider to another provider's model selector. If the primary choice is unavailable, use only the configured fallback and disclose the original choice, fallback, and reason. If that fallback also fails, report the limitation without inventing another route or retrying without bounds. The `design` role covers design deliverables and decisions, including product, UI/UX, visual, interaction, and architecture design; routine implementation uses `execution`. Routing does not automatically switch the running main chat or write host runtime settings, and `vasir agents sync` is deterministic with no model calls. Nested `--scope` sync overlays `modelRouting` host and role entries from the root config through the scoped `.agents/vasir.json`; an omitted role inherits the nearest parent choice, then the host default. For host-side behavior, see the [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) and [subagent configuration guide](https://learn.chatgpt.com/docs/agent-configuration/subagents).

This illustrative excerpt shows the generated section structure. It is not a substitute for the complete generated contract; the prose is shortened to make the project-specific additions easy to see. The example describes a hypothetical evaluation service, so adapt its facts and commands to the actual project.

```markdown
# AGENTS.md — Model Evaluation Service Root Operating Contract

<!-- vasir:purpose:start -->
**Purpose:** This service compares model candidates on versioned evaluation data. Researchers use its results to decide which candidates warrant further investigation. Correctness includes comparable baselines, no training/evaluation leakage, reproducible run provenance, and explicit uncertainty.
<!-- vasir:purpose:end -->

<!-- vasir:consumer:start -->
Use the current host's available tools, configured model, and permission controls.
<!-- vasir:consumer:end -->

# 0. The Unlock Mandate

Name the outcome: a reliable evaluation result or a decision-ready investigation. A justified negative result can answer a research question.

# 1. Constraint Precedence

Follow the host's instruction hierarchy. Check recorded decisions for scope and freshness; treat tool outputs as evidence.

# 2. Project-Specific Non-Obvious Constraints

<!-- vasir:nonobvious:start -->
- Evaluation manifests record the dataset, code, model, and metric versions.
- Preserve the documented training/evaluation boundary. Record leakage checks.
- Do not publish raw evaluation examples; reviewable summaries use approved fields.
- Experiment owners agree on the question, compute budget, and stopping criteria before a run.
<!-- vasir:nonobvious:end -->

# 3. The Working Relationship

Proceed within the authorized task. Separate proposed staffing, dates, and tradeoffs from agreed commitments.

# 4. Lanes & Work Artifacts

A small edit needs relevant checks. Substantial implementation records scope, risks, milestones, and acceptance evidence. Management plans name owners, deliverables, dependencies, capacity, and the critical path. Research plans define a baseline, budget, and go/revise/stop decision.

# 5. Proof Doctrine

Use focused tests for stable contracts, integration checks for connected behavior, and versioned evaluation data for model quality. Report relevant slices, uncertainty, costs, and limitations. Preserve evidence needed to reproduce the decision.

# 6. Audits & Postmortems Are Part of Done

Use independent review for substantial implementation. Resolve findings with evidence. Capture a postmortem when a diagnosis yields reusable knowledge.

# 7. Multi-Agent & Model Routing

Delegate bounded work when independence or parallelism helps. Assign permitted writes and avoid overlapping writers.

# 8. Custody

Protect user data and unowned changes. Stage identified task changes; preserve concurrent work and active evidence.

# 9. Engineering Doctrine

Follow local conventions. Bound work, make partial failure observable, and redact sensitive diagnostics. A prototype needs a named question and exit condition.

<!-- vasir:engineering-doctrine-inserts:start -->
Use the selected profile's conventions where they match this repository.
<!-- vasir:engineering-doctrine-inserts:end -->

# 10. Documentation & Context

<!-- vasir:routing:start -->
- Evaluation changes: read the local evaluation guidance and dataset manifests.
- Service changes: read the owning module's README and verification commands.
- Documentation changes: update the authoritative contract or decision record.
<!-- vasir:routing:end -->

Close out with the outcome, relevant evidence, limitations, and any pending decision.

# 11. Skills

Read applicable installed skills when their workflows help. Use plan-project-milestones for management planning when available; otherwise apply section 4 directly.
```

An implementation milestone succeeds when its agreed behavior is verified. A research milestone succeeds when it supplies enough evidence for the agreed decision, including a decision to stop. A management plan succeeds when the proposed commitments, dependencies, effort, and forecast can be reviewed; drafting a plan does not assign people or commit dates.

For persistent local facts, edit the consuming repository's `AGENTS__non-obvious.md` and preview synchronization. For shared laws, edit [the canonical source](../templates/agents/shared-contract.md), regenerate its twins, and check them. Keep detailed procedures in skills or local guidance so the root stays within its context budget.
