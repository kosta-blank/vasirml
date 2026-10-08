# Extracting Skills from Agent Context

Read this when converting a root contract, `AGENTS.md`/`CLAUDE.md` doctrine, runbooks, or any large agent-context file into skills. The prize is a leaner always-loaded contract and expertise that loads only when triggered. The trap is copying — extraction that duplicates the source creates the exact split-brain this whole system exists to prevent.

**Contents:** 1. The Extraction Boundary · 2. The Distillation Table · 3. Proposing the Skill Split · 4. Re-Grounding Imported Material · 5. The One-Way Rule · 6. Output Shape

---

## 1. The Extraction Boundary

For each candidate block in the source, ask two questions in order:

**Q1 — Does it govern *every* run, or a *task class*?**
Authority, custody, safety, approval protocol, halt behavior, model routing, repo-wide precedence — these govern every run and **stay in the root contract**. A skill cannot own them: skills load conditionally, and a law that must always bind cannot live behind a trigger.

**Q2 — For task-class material: is it expertise, or is it inferable?**
Judgment, tradeoffs, scars, hidden constraints, local ontology → **skill candidate**. Facts inferable from code, docs, linters, or normal exploration → **omit from the new skill**; propose source cleanup only within the authorized edit scope. Apply the root manifest's "Scope and Neighbor" preservation boundary before classifying an accepted policy as removable.

User-required vocabulary and construction bans and distinctive writing reasoning carry intent even when they are lengthy or stylistic. Preserve their effective behavior and owner. If unclear, retain the rule and record the question; compression is not authority to relax it.

| Source content | Destination |
|---|---|
| Approval / halt / custody / safety protocol | Stays in root contract |
| Repo-wide precedence and model routing | Stays in root contract |
| Repeated task-class judgment (how to test, review, migrate…) | Skill |
| Domain scars and tradeoff boundaries | Skill |
| Per-directory narrowing of a root law | Nearer `AGENTS.md`, cited against root |
| Facts inferable from the repo | Omit from skill; scoped source-cleanup proposal |
| Established user decisions | Preserve behavior and owner; move only within authorized scope |
| Detail needed by a minority of that skill's runs | The skill's `references/` |

## 2. The Distillation Table

Work block-by-block through the source and record every decision — the table *is* the extraction, and it doubles as the audit trail for what was deliberately left behind:

| Source (section / lines) | Expertise type | Bad default it overrides | Destination | Form it takes there |
|---|---|---|---|---|
| §Testing, "no sleeps…" | Hidden constraint | Model adds `sleep(2)` to flaky tests | `testing-strategy` skill | Determinism rule + anti-pattern |
| §Testing, "run one file at a time" | Local convention | Model runs the full suite | Stays in root (governs every run) | Cited by the skill |
| §Style, "prefer const" | Inferable (linter enforces; no user-required retention) | — | Omit from skill | Source cleanup proposed if in scope |

An empty "bad default it overrides" cell means the row does not yet justify a skill rule. Clarify its rationale or retain it as an unresolved source decision; it does not justify deleting accepted policy.

## 3. Proposing the Skill Split

Cluster the skill-destined rows by **routing cluster** (what user intent loads them together), not by source section — source structure reflects how the doctrine accreted, not how it triggers. Then apply the Granularity Law from the root manifest: one cluster + one prior-rewrite family + one artifact class per skill; different tool authority or risk level splits a cluster; adjacent angles on one artifact become siblings with explicit boundaries. For each proposed skill, emit: name, genus, one-line description draft, the distillation rows it absorbs, the siblings it borders, and the root sections it will cite.

## 4. Re-Grounding Imported Material

Source doctrine often arrived from an earlier system or another company. Tells: runtime or infra the repo doesn't use, a rival vocabulary for concepts the root already names, output formats no consumer reads, references to teams, tools, or platforms that don't exist here. For each tell: keep the expertise (the scar is usually real), drop the scaffolding, rename to the local ontology, and re-point every law at this system's root sections. An imported rule that contradicts a local law is a finding to surface, not a conflict to silently resolve.

## 5. The One-Way Rule

For maintained, editable sources, extraction should leave one authoritative owner: move task-class guidance and replace its source block with a pointer when both files are in the authorized scope. Authority that must bind every run stays in governing instructions.

When the source is immutable, outside scope, or reserved for another owner, produce the draft and a proposed source diff. Do not alter baselines, installations, shared decisions, or sibling files to complete the move. Identify unresolved ownership and any duplicate wording; the draft remains reviewable, while activation follows the actual governing process. A cleanup proposal is not an applied deletion.

## 6. Output Shape

Use the root manifest's "Workflow and Result" extraction mode. The distillation table records what stays, moves, is omitted, or remains unresolved, with source locations and Q1/Q2 decisions. Include the proposed split and highest-value draft or patch; label each source change as applied within scope or proposed for its owner. Cite real governing sections and available siblings. Do not repeat these decisions in a separate Skill Result.
