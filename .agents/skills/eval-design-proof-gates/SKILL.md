---
name: eval-design-proof-gates
description: Designs falsifiable software and POC proof gates and a durable eval-plan.md, with compact checks on explicit request. Use before substantial implementation, when defining software success, for performance, realtime, or scale claims, or when specifying missing proof harnesses. ML evaluation and milestone planning remain separate.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Eval Plan — Proof-Gate Design

One question, answered before implementation proceeds:

> What would make us honestly admit that the declared unlock does — or does not — work in the environment that matters?

This skill designs falsifiable proof contracts, not comforting test strategies. **Prime rule:** a gate that cannot falsify the value claim in the environment that matters is not a proof gate — move it closer to the value path, spec the missing harness, require an artifact-backed human gate, or mark it blocked. Design only: this skill never executes proof, never claims a pass, never pretends a harness exists, and never converts subjective product judgment into fake automation.

**Ownership boundary.** This skill creates or updates exactly one proof-design artifact: the repository's established `eval-plan.md`; use `docs/work/<semantic-folders>/<feature-slug>/eval-plan.md` when no location is established. The **eval plan owns proof mechanics** — gate design, harnesses, thresholds, adequacy, gate state. An existing **work spec owns scope and requirements** — contracts, milestone state, surviving result summaries. If repository conventions use a Proof & Eval Summary, it mirrors gate state; divergence resolves toward the eval plan for gate state and mechanics, toward the spec for scope. This skill never edits or creates a work spec — sync needs return in the Skill Result.

**Scope.** This is software and POC acceptance design. ML evaluation owns model validity, metric selection, retrieval quality, and online experiments. Consume its agreed outputs as dependencies when software acceptance needs them; leave those decisions with the ML evaluation workflow. Planning owns requirements, owners, dependencies, and milestones. Running software verification and deciding release readiness belong to their execution and handoff workflows.

**Handoffs.** When available, use `$eval-implement-proof-gate` for a missing runnable harness, `$handoff-final-quality-gate` for final feature handoff, and `$code-auditing` for post-code implementation audit. Otherwise return the same concrete task and its inputs to the responsible implementer or reviewer.

**Routing.** The responsible designer owns gate selection and adequacy; the responsible reviewer owns gate verdicts after execution. Follow the caller's configured delegation and model routing. Executors who later run gates update state and last-run identity under the plan's conventions. This skill requires no particular model tier or delegation topology.

---

## Schema Authority

- **The Template section in this file owns both formats** for `eval-plan.md`: Full Plan is the default; Compact Plan follows the selection rule below. [references/eval-plan-template.md](references/eval-plan-template.md) points here. [references/gold-standard-proof-gate-examples.md](references/gold-standard-proof-gate-examples.md) uses full gate cards to calibrate *specificity* — the concreteness bar for setup, action, verdict, artifact, and same-run correlation. That reasoning also applies to compact checks. Its IDs, thresholds, commands, paths, and domain nouns remain illustrative. Structural divergence means the reference is the bug.
- Load the gold-standard examples before designing or materially updating gates; skip them for mechanical or status-only edits.
- Conform a stale plan to the current template when materially updating it; keep one maintained plan. Gate IDs are never renumbered.

---

## Plan Format

Use the **Full Plan by default**. Use the **Compact Plan only on an explicit user request**, for one software or POC workflow that a discovered existing instrument can exercise. Do not infer that a task is routine or switch to compact because it appears small.

Use the full plan for a missing or inadequate harness, concurrent conditions requiring same-run proof from multiple observers, performance or scale claims, migrations, or consequential security or data risks. If discovery exposes one of these conditions after compact was requested, explain the reason and use the full plan.

Compact checks retain the proof requirements in four groups: **Outcome, Method, Evidence, Limits**. Record shared environment, sources, and run policy once; omit formal cards, indexes, and repeated summaries. Durable-plan and quick-change inline rules apply to both formats. Keep existing IDs, evidence, and retired-check pointers when changing format.

---

## Design Laws

These laws specify the design-time requirements. Applicable repository instructions supply local instruments and conventions; the skill's meaning does not depend on an external root-policy file.

1. **Falsifiable anatomy.** An objective gate is valid only if it binds all of: **Claim / Setup / Action / Observation / Verdict / Authority** (the target environment where value actually matters) **/ Artifact / Stop condition**. Any missing element = incomplete gate. Prefer one strong value-path gate over many implementation-trivia units. The gate doubles as the development feedback loop — rerunnable cheaply against the real surface after each repair; if the only available proof is a proxy, name the missing real loop as a missing harness. Subjective gates use Law 6 and the human-acceptance fields for the selected format.
2. **Derive, don't pattern-match.** Decompose the unlock into required truths (workflow step 3); generate candidate classes from the menu; select the smallest sufficient set. Every included gate names the **plausible lie** it kills — if it cannot catch a plausible way the value breaks, cut it. Every excluded *obvious* class (security, persistence, perf, visual, network, replay, failure) records its exclusion reason. Keep this rationale in the output: the full plan's durable synthesis table, or the compact checks' Outcome and Limits groups. It records why these gates were selected.
3. **Potency is designed in.** Every objective gate names how it will be shown to fail *for the right reason*: `watched-red` when changing existing behavior (capture the red against unfixed code — that red exists only before the fix lands); `mutation: <what to hand-break>` for new behavior (the break must turn exactly this gate red). A red that only proves API absence proves nothing about behavior.
4. **Name the blind spot.** Every gate records what its instrument cannot see; subjective cards name the limitations of their supporting evidence in `support` or `boundary`, and compact checks use Limits. Name the axes no check in the plan moves in the full proof stack or compact Limits. A probe that never moves an axis will "prove" designs that fail on that axis.
5. **Compound value = same-run proof.** When the claim needs several truths concurrently (load + realtime sync + rendered experience), design one orchestrated gate: one coordinator, every actor and observer correlated under one run ID, pass only if all required observers pass in the same steady-state window. Disconnected checks that pass independently while the journey fails are the classic lie.
6. **Subjective quality gets human acceptance.** Feel, taste, fun, trust, readability, motion comfort: artifact-backed, one specific acceptance question, an explicit acceptance boundary. Automation supplies evidence and proves the artifact is technically healthy; it never accepts. The gate remains Waiting Human while acceptance is pending; a requested revision keeps acceptance outstanding. Report pending acceptance separately from objective results; it cannot count as completed acceptance.
7. **Hostile + nearby, operationalized.** Non-trivial behavior change: at least one hostile gate or a recorded waiver-with-reason in the plan; one nearby behavior named with status `tested | inspected | inferred | left unverified` plus the risk when unverified.
8. **IDs are namespaced, append-only.** `<FEATURE-SLUG>__GLOBAL-G1`, `<FEATURE-SLUG>__M2__G1`, `<FEATURE-SLUG>__M1__S1`, `<SLUG>__CHANGE-G1` — spec-less quick changes mint a semantic slug. Never a naked `M1-G1`, `CHANGE-G1`, or `Phase 2`, in any file. Retire with a pointer; never renumber.
9. **Stop conditions are exact.** Name the responsible actor and next action. Allowed: executor repairs once within the authorized scope from the trace, then stops on repeated similar failure · responsible implementer builds a required missing harness before product code · halt for missing credential/environment · halt for Waiting Human acceptance · halt and report changed scope or targets, or a value path that cannot be proven deterministically inside scope. Record that exception and its architectural reason in the plan. This designer never executes the repair. Forbidden: "Investigate", "Fix tests", "Manual QA", "Check that it works", or any next action without a who/what.
10. **Design ≠ execution.** Discovery is read-only: inspect scripts, task runners, tests, harnesses, docs; no installs, no services, no snapshot updates, no proof runs. Confirming a command *exists* never claims it proves current behavior. No invented scripts, routes, fixtures, env vars, or paths — undiscovered means `missing harness: <name>`. Thresholds carry a source (spec `C-###`, repo config, benchmark history, user instruction) or an explicit assumption/blocker label — never an unsourced number as fact.
11. **Domain guidance is conditional.** For browser, canvas/game, or deterministic replay/snapshot/restore surfaces, read the applicable section of [references/domain-proof-guidance.md](references/domain-proof-guidance.md). Use the current target environment and discovered instruments. Skip unrelated sections without N/A marking.

---

## Measurement-First Probes

Trigger vocabulary: smooth, live, fast, responsive, low latency, no jank, keeps up, converges, supports N, handles concurrency, scales, bounded fanout, queue drains, join is fast — any claim of speed, latency, smoothness, throughput, capacity, or convergence.

For these claims, design — or explicitly reject, with reason and lowered confidence — a direct programmatic probe **before** any subjective, browser, or manual acceptance:

- **Probe actors:** the minimal pair expressing the value path — writer/reader, sender/receiver, producer/consumer, player A/player B.
- **Correlation:** sequence/operation/run/trace IDs, logical ticks, or timestamp discipline that matches cause to effect — never visual inference.
- **Budget:** sourced threshold or labeled assumption/blocker (Law 10).
- **Workload ladder:** a baseline rung plus the target-load rung minimum; intermediate rungs when the knee of the curve matters.
- **Load shape, decomposed:** connected-idle vs. active work-producing counts, operation cadence, payload size, locality/density, churn/fault model, ramp + steady-state duration, machine/topology. A bare "N users" is not a falsifiable scale claim.
- **Counts are not capacity.** Reaching N proves only "can open N"; capacity gates also measure behavior under load — latency, update gaps, stale age, error rate, queue depth, resource ceilings, authoritative-state correctness.
- **Diagnostic attribution:** stage timings, queue depth, event-loop delay, resource signals — whenever the likely next action depends on knowing where time is spent.
- **Artifact:** raw samples plus summary — never only a screenshot or prose note.
- **Observer overhead:** if the observer materially changes the measurement, find the lower-overhead protocol/API/synthetic probe or record why none exists.

Browser or manual observation of a measurable claim is classified as exactly one of: **integration observer** (proves the product path still works; the probe owns the SLO) · **subjective observer** (proves human feel; requires acceptance) · **primary measurement** (allowed only when the UI/browser is itself the boundary under test — justify why no lower-overhead probe proves the value).

---

## Gate Classes (synthesis menu, not canned tests)

| Class | Falsifies claims about | Canonical evidence |
| --- | --- | --- |
| Terminal value-path | the actual journey completes | final UI/API/persisted state |
| Contract/API | request/response/event/schema semantics | status, payload, error body |
| Persistence | survives reload, restart, retry, later query | read-after-write artifact |
| Realtime/convergence | actors observe consistent state over time | correlated snapshots + divergence budget |
| Orchestrated compound | several truths in the same live run | multi-observer bundle, one run ID |
| Scale/performance | value holds under N, rate, size, duration | benchmark + error budget + resources |
| Browser/render | user-visible state and interaction | Playwright/Chromium trace, video, screenshot, console/network |
| Network/packet | transport, ordering, payload, timing | frame/packet capture |
| Failure/hostile | safe behavior under bad input or failure | rejection/degrade/no-side-effect proof |
| Security/privacy/auth | access, identity, permissions | allow/deny matrix, audit log |
| Idempotency/retry | duplicates, replay, timeout, partial success | stable final state after repeats |
| Migration/compatibility | old, new, mixed, malformed data coexist | fixture matrix + rollback proof |
| Observability/operator | humans can detect healthy vs. broken | metric/log/alert evidence |
| Subjective human | feel, taste, trust, readability | artifact + recorded acceptance |
| Nearby non-regression | adjacent behavior unchanged | targeted proof or recorded status |

---

## Gate States

`Open` (designed; no fresh artifact) → `Red captured` (watched-red exists, pre-fix) → `Objectively Green` (ran in the authority environment against current code; fresh artifact + source identity recorded; no unresolved objective acceptance conditions for this gate) · `Waiting Human` (subjective acceptance pending) · `Blocked — <what>` · `Waived — <reason>` · `Retired — superseded by <ID>`.

Green is a claim about a recorded run: artifact path + source identity + date in `last_run`. Source identity is a Git revision with any uncommitted changes identified, or a content fingerprint when Git is unavailable. No artifact, no green. A gate whose guarded surface has changed since `last_run` is stale — back to `Open`, not Green. Design changes do not establish a pass; execution supplies that evidence.

---

## Workflow

1. **Stabilize the claim:** work size (substantial lane vs. quick change), the unlock, the terminal proof-of-value state, existing work-spec path and milestone IDs if present, target environment, whether subjective quality is part of the value. Select the format under Plan Format. Multiple plausible unlocks that would materially change proof design = product fork: ask the one blocking question or emit a blocked design. A work spec or milestone ladder is not a prerequisite.
2. **Discover read-only:** existing eval plan, relevant requirements and contracts, applicable repository instructions, package/task-runner scripts, tests/evals/harnesses near the domain. Extend a shared instrument before building bespoke; every missing-harness spec says what it extends or why nothing can.
3. **Decompose the unlock into required truths.** Per truth: actor · boundary (where it can break: UI, client, network, server, storage, worker, tool, cache, auth, scheduler, operator) · state required · time (instant / eventual / steady-state / after restart / after reconnect / across versions) · scale · measurement (quantity, budget, window) · observer overhead · failure modes (invalid, missing, duplicate, out-of-order, delayed, partial, unavailable, malicious) · perception (must a human see/feel/trust it?) · authority (canonical evidence source) · plausible lie.
4. **Synthesize and select** the smallest sufficient set (Law 2). Compound claims get the orchestrated gate first; supporting gates only where they isolate a high-risk dependency or make failures diagnosable.
5. **Write full gate cards or compact checks** — states, loops, run policy, stop conditions, potency, blind spots remain concrete in either format.
6. **Inventory harnesses honestly in a full plan;** spec the missing ones. Compact checks name the existing instrument and rerunnable command or route + action in Evidence; a missing or inadequate instrument requires the full plan.
7. **Write or update `eval-plan.md`** using the selected format below. Substantial lanes always get the durable plan. Inline-only design is allowed for a quick change with no active spec and no durable reuse expected — say why. Never create durable eval plans for truly mechanical edits.
8. **Return the Skill Result.** The caller owns the human-facing close-out; no other response ceremony is mandated.

---

## Template

### Full Plan (default)

````markdown
# EVAL PLAN — <FEATURE_NAME>
**Human Read:** This plan can falsify <unlock> in <target environment>. The primary value-path gate is <ID>. Current state: <n green / n open / n blocked / n waiting human>. Biggest unproven risk: <risk>. Next gate to run: <ID> via <loop>.

**Last updated:** YYYY-MM-DD
**Work spec:** <path> | None — <why>
**Feature slug:** <slug>
**Target environment(s):** <runtime(s) where value matters>

---

## Doc Conventions (Do Not Delete)
- **Schema truth:** the `eval-design-proof-gates` skill. Gate IDs are append-only, never renumbered; retired gates keep their card in the Appendix with a pointer to the superseding ID.
- **IDs are fully namespaced** (`<SLUG>__M#__G#`, `<SLUG>__GLOBAL-G1`, `<SLUG>__CHANGE-G#`, `<SLUG>__M#__S#`); a naked ID anywhere is a halt-and-clarify, never a guess.
- **States:** Open | Red captured | Objectively Green | Waiting Human | Blocked — <what> | Waived — <reason> | Retired — <pointer>. Objectively Green requires a fresh artifact from current code in the named authority environment, recorded in `last_run` (artifact path + source identity + date). Identify uncommitted changes alongside the Git revision, or use a content fingerprint without Git. No artifact, no green — this document records proof, it never manufactures it. Guarded surface changed since `last_run` ⇒ state returns to Open.
- **Waiting Human is never auto-claimed** or counted as completed acceptance.
- **Spec mirror, when present:** executors resync the existing work spec's Proof & Eval Summary in the same edit as execution state changes when repository conventions require it. The designer returns sync needs without editing the spec. Divergence: this plan wins gate state and mechanics; the spec wins scope.
- **The synthesis table (§2) is durable:** update it whenever gates are added, waived, or retired — it is the record of why these gates and not others.
- **Future-state gates stay out of default CI** (run policy: Milestone-gated CI) until their milestone; a known-red never poisons the default loop.
- **Thresholds carry a source** (`C-###`, `SRC-###`, benchmark history, user instruction) or an explicit assumption/blocker label.
- **Deterministic-proof exceptions** (a value path that cannot be proven deterministically) are recorded in §6 with the architectural reason — never silently absorbed.

## 1) Unlock & Proof-of-Value State
- **Unlock:** <observable user journey / engineering system outcome>
- **Terminal truth:** <the exact terminal state ending the value path — what a reviewer inspects to falsify the claim>
- **Subjective component:** <what only a human can accept> | None

## 2) Gate Synthesis (durable)
| Required truth | Plausible lie prevented | Class | Gate | Reason |
| --- | --- | --- | --- | --- |
| <truth> | <weak proof that could falsely pass> | <class> | <ID> / Excluded | <why included, or why excluded> |

Obvious classes a reviewer would expect (security, persistence, perf, visual, network, replay, failure) appear here even when excluded.

## 3) Proof Stack
3–7 lines: which gates, and why each proves value rather than mechanism; the orchestrated gate first when the claim is compound. **Stack blind spot:** the axes no gate in this plan moves.

## 4) Gates
### 4.1 Index (projection of the cards)
| Gate | Kind | Class | State | Loop | Last run |
| --- | --- | --- | --- | --- | --- |

### 4.2 Gate cards
```yaml
id: <SLUG>__M1__G1
kind: global | milestone | change | hostile | non-regression
class: <from the synthesis menu>
claim: <value claim this gate can falsify>
lie: <the weak proof that could pass while the value is broken>
blind_spot: <what this instrument cannot see>
setup: <fixture / seed / account / world / request / replay / service state>
action: <exact user / system / browser / worker / tool / network / operator action>
observation: <terminal state / persisted row / packet / metric / trace / log / output inspected>
verdict: <exact pass/fail condition>
authority: <target environment where the value matters>
artifact: <fresh artifact type + discovered evidence path; fallback tmp/<datetime>__<semantic>/>
potency: watched-red — <the red to capture before the fix> | mutation — <what to hand-break; must turn exactly this gate red> | n/a — <reason>
loop: <rerunnable command | route + action | missing harness: <name> | blocked: <reason>>
run_policy: Default CI | Local eval | Milestone-gated CI | Human review | Blocked
stop: <one allowed stop condition — Design Law 9>
state: Open | Red captured | Objectively Green | Waiting Human | Blocked — <what> | Waived — <reason> | Retired — <pointer>
last_run: none | <artifact path> @ <source identity>, YYYY-MM-DD
refs: [<C-###>, <SRC-###>, <rung IDs>]
orchestration:            # compound gates only
  coordinator: <command | missing harness: <name>>
  run_id: <correlation scheme tying every observation to one run>
  actors: [<name — count — behavior>]
  scale_target: <exact load + how it is measured>
  duration: <ramp + steady-state>
  churn_fault_model: <disconnect/reconnect/jitter/loss/late-join model | none — reason>
  observers: [<server metrics>, <browser trace>, <frame capture>, <persistence query>]
  aggregate_verdict: pass only if every required observer passes in the same run
```
```yaml
id: <SLUG>__M1__S1
kind: subjective
artifact: <video / screenshot set / replay / before-after page>
support: <automated evidence proving the artifact is complete and technically healthy>
question: <the one specific acceptance question>
boundary: <what explicit acceptance means; what a rejection must name>
state: Waiting Human
stop: Halt until acceptance or requested revision is recorded.
refs: [<C-###>, <rung IDs>]
```

## 5) Harness Inventory
**Existing:** <command — path — target env — artifact — limitations> (extend before building)
**Missing:**
```yaml
harness: <stable repo-searchable name>
proves: <gate IDs this harness enables>
extends: <existing instrument extended> | nothing — <why no existing instrument can>
envelope: <exact path or narrow creation envelope>
payload: <fixture / seed / replay / world state required>
verdict: <exact pass/fail the harness must decide>
artifact: <repository evidence location; fallback tmp/<datetime>__<semantic>/>
required_before_product_code: yes | no — <reason>
route: $eval-implement-proof-gate when available | <responsible harness implementer>
```

## 6) Run Policy & Exceptions
- Default CI now: <IDs> · Local eval: <IDs> · Milestone-gated: <IDs + milestone> · Human review: <IDs> · Blocked: <IDs + what unblocks each>
- Artifact conventions: <existing repository evidence location, or `tmp/<datetime>__<semantic>/`>; an existing work spec records surviving summaries after runs when repository conventions require it.
- Deterministic-proof exceptions: none | <exception + architectural reason>

## Appendix
Retired gate cards (with superseding pointers) · superseded synthesis rows · run-history notes worth keeping.
````

### Compact Plan (explicit request)

Use only when Plan Format permits it. Each check below has four groups; their labels organize the same proof inputs. Shared context applies to all checks.

```markdown
# EVAL PLAN — <FEATURE_NAME>
**Format:** Compact — requested by user
**Last updated:** YYYY-MM-DD
**Shared context:** <feature slug; work spec path or None; target environment; run policy; requirement/source references>
**Shared limits:** <plan-wide blind spots; relevant excluded classes and reasons; shared hostile proof or waiver; nearby behavior/status and risk if unverified>
**Conventions:** Keep namespaced IDs stable and append-only. Use the skill's Gate States; green requires fresh authority-environment evidence with source identity and date. Changed guarded surfaces return to Open. Human acceptance remains explicit. Retired checks retain a superseding pointer.

## <NAMESPACED-ID> — <check title>
- **Outcome:** <observable claim; required truth; plausible failure caught; why this check was selected>
- **Method:** <setup; action; observation in the shared target environment; exact pass/fail rule; threshold source or labeled assumption/blocker>
- **Evidence:** <discovered instrument and rerunnable command or route + action; required artifact; state; last_run: none or artifact path @ source identity, YYYY-MM-DD>
- **Limits:** <check-specific blind spots and applicable exclusions; watched-red or specified mutation potency; blocker, stop condition, and next responsible actor/action>
```

Repeat the four-group entry for each selected check; together they cover all required truths. Record common limits once in Shared limits. For a subjective check, Outcome names one acceptance question; Method names the acceptance boundary and technical support; Evidence names the supporting artifact and stays Waiting Human while acceptance is pending; Limits names evidence limitations and the responsible human's acceptance or revision action. Retain Law 6.

---

## Conformance Check (before writing — never stored; execution verdicts belong to gate state and last_run)

- Every objective gate binds the full anatomy (claim/setup/action/observation/verdict/authority/artifact/stop) and names its lie, blind spot, and potency.
- Selected format follows Plan Format. Every required truth is covered by the selected checks; the full synthesis table or compact Outcome/Limits and shared context records selection and obvious-class exclusion reasons. Keep the smallest sufficient set — no coverage theater, no mechanism-only gates.
- Compound claims have one same-run orchestrated gate, not disconnected checks.
- Measurable claims have a direct probe (or an explicit rejection) with sourced-or-labeled budgets and decomposed load shape; browser observers of measurable claims are classified.
- Subjective quality has an artifact-backed human gate with one question and a boundary; nothing subjective is auto-accepted.
- Hostile gate present or waived-with-reason; nearby behavior named with status.
- All IDs namespaced; states from the machine; no green without artifact + source identity; future gates out of default CI.
- Harness reporting honest: the full inventory names instruments and missing specs say what they extend; compact Evidence names the existing rerunnable instrument and Limits names its limitations. No invented commands, paths, or thresholds.
- Applicable domain guidance is reflected in the checks; environment and viewport choices are sourced or explicitly labeled assumptions.
- Work-spec sync need identified and returned in the Skill Result — never edited from here.

## Skill Result (return to caller — required elements, any shape)

State the selected format and refer to information already contained in the plan or inline checks when returning these elements; keep compact close-out free of repeated summaries.

- Full | Compact; eval plan path | Inline only — <reason> | Blocked — <reason>
- Work spec path | None; sync needed (yes — <what> | no)
- Feature slug · Rungs covered (full IDs | not milestone-based)
- Primary value-path gate + its loop (existing command | route + action | missing harness)
- Gate IDs (group by kind in a full plan) · Subjective gates + their questions
- Missing harnesses (names; which block product code)
- Run-policy summary · Open blockers
- Recommended next action (one)
