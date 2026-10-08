---
name: testing-enforcing-mandate
description: Choose and implement proportionate software verification for changed behavior, APIs, data pipelines, services, and POC interactions. Use for test strategy, test selection, or writing useful checks; model quality and ML evaluation remain separate.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Proportionate Software Verification

Protect the affected user or downstream system outcome with the smallest credible verification. Reuse sufficient existing checks, strengthen weak assertions, and add tests where a plausible failure remains exposed.

## Scope and ownership

This skill chooses test boundaries and sizes, then writes or tightens software checks. It applies to serving APIs, ingestion and transformation pipelines, persistence, workflow orchestration, and POC interactions. Passing these checks establishes only the software behavior exercised. Model validity, metric selection, retrieval quality, and online experiments belong to ML evaluation; workstreams, owners, dependencies, and milestones belong to planning.

A test-suite audit assesses existing evidence; a bug-fixing workflow owns reproduction, diagnosis, and repair. When already available and in use, `$testing-auditing`, `$code-fixing-bugs`, and `$eval-design-proof-gates` can supply those workflows or durable software proof records. They are optional collaborators. Use the project's existing artifacts and schemas when applicable; this skill works without a root policy document, lane system, or another skill installation.

## Choose the verification

Inspect the relevant implementation, tests, scripts, configuration, and applicable repository instructions. Cite the evidence for existing behavior and coverage; distinguish observed results, static inference, assumptions, and unknowns. Follow the actual instruction hierarchy rather than treating the strictest quoted rule as authority. For a consequential choice, consider the strongest credible alternative and explain the tradeoff.

1. **Name the outcome and failure.** Identify the actor or consumer, entrypoint, expected result, and harm if it breaks. For example: an ingestion retry preserves one persisted record, or an API consumer can read both old and new schema versions. Identify the critical step and any directly affected next operation whose failure could invalidate that result; keep unrelated gaps outside the change.
2. **Inspect existing guards.** Check whether their setup, observations, assertions, and dependency behavior cover the changed risk. Reuse or tighten a sufficient check. Adding a new test needs a reason beyond test count, line coverage, or a preference for a particular harness.
3. **Choose a stable observable boundary.** Drive the public API, worker entrypoint, CLI, message port, adapter, or domain interface that includes the failure mechanism. A browser is useful when rendering, interaction, or UI wiring is the risk. The highest stable seam is the boundary that captures the outcome and relevant orchestration; choose a larger harness only if it adds needed evidence. Avoid private helpers and internal call counts as default oracles.
4. **Choose the smallest credible size and form.** Small checks run in process with controlled state; medium checks include local services or realistic adapters; large checks span processes or browser flows. These describe execution cost and dependencies, not guaranteed confidence. Use integration checks for actual boundary orchestration, contract checks for public or wire compatibility, property checks for classes of states, and smaller behavior checks for stable domain interfaces. Browser viewports and target environments come from the product contract or inspected repository guidance.
5. **Cover the relevant failure classes.** Select from the cases below according to the change. An existing check may satisfy the obligation. There is no minimum test count or blanket requirement for a new browser or integration test.

| Changed risk | Useful verification |
|---|---|
| External API or schema | Contract checks of emitted shapes, required fields, error semantics, and relevant producer/consumer compatibility; sandbox or recorded fixtures where useful. |
| Concurrency, ordering, retries, duplicates, pagination, normalization, state machines | Invariants or property checks with bounded cases and reproducible seeds; actual state or side-effect assertions. |
| Authorization, privacy, bounds, TTL | Checks at the enforcing boundary for allowed behavior, rejected behavior, and the affected state. |
| Migration or compatibility | Relevant old/new write and read combinations, including persisted states; explicit unsupported combinations and rollout prevention. |
| Replay or deterministic state restoration | Same seed and input sequence across restore, followed by a later checkpoint or hash comparison. Final-state equality alone may hide an intermediate divergence. |
| Hot path or performance contract | Measurement with a sourced budget, representative workload, and explicit failure criterion. |
| Legacy code with no useful seam | Characterize behavior at a reachable boundary, introduce the smallest needed seam, then refactor behind that guard. |

Do not shrink a test until it bypasses the actual failure mechanism. A larger check is useful only when its additional reality protects a relevant outcome.

## Dependency fidelity and test form

An integration check exercises production modules across the risk boundary with the relevant serialization, asynchronous/error paths, configuration shape, and state transitions. Prefer a hermetic environment suitable for repeatable CI; production services are unnecessary. State behavior that the environment cannot reproduce.

Choose dependencies according to where the risk lives:

- Use real local services when constraints, transactions, concurrency, delivery, or other dependency semantics are under test. A duplicate-write check needs the real uniqueness behavior.
- Use a verified, contract-preserving fake when omitted internals cannot hide the claimed failure. An in-memory queue is sufficient only if differences in ordering, delivery, acknowledgment, and failure handling are irrelevant to that claim.
- Use mocks or stubs outside the risk boundary or to force otherwise impractical failure modes without replacing the mechanism being checked.

For a meaningful substitution, state why it is used, its material limits, and what evidence validates the relevant real behavior elsewhere. Missing fidelity evidence remains a gap. Use the repository's established adapter/configuration seam when one exists, preserving production wiring relevant to the risk.

Contract, snapshot, visual, and behavior checks are forms independent of dependency fidelity. Use snapshots when serialized output is the contract, and review updates for changed guarantees. Use visual checks when visual state is the contract; visual evidence does not establish persistence or authorization. Third-party recordings need provenance, refresh guidance, and appropriate sensitive-data handling. Keep routine CI free of live external-service dependencies; contract refreshes or sandbox runs can be separate, explicit activities.

## Meaningful assertions

Assert observable output, public reads, persisted effects, or the enforcing boundary's behavior. Interaction assertions are valid when the interaction is the contract, such as the required shape of a queue message, an exactly-once webhook effect, or a provider request.

Tests should explain the feature, its important guarantees, and its edges while surviving internal refactors. For each added check, identify the real risk it catches and the confidence lost if it were removed. Delete or revise obsolete tests around the surviving or replacement behavior.

Do not write tombstone tests whose main oracle is that removed UI, API, data, configuration, or implementation artifacts stay absent. Source text, AST shape, private names, imports, or internal call patterns rarely establish a user outcome. Absence assertions remain useful when they protect an approved positive contract:

- unauthorized or destructive actions are blocked;
- secrets or personal data are not exposed;
- duplicate events, jobs, or writes are prevented;
- a retired public endpoint returns the specified 404/410 behavior;
- deprecated input is rejected at the public compatibility boundary.

Name the guarantee and harm prevented by a negative assertion. Retain the assertion only when it protects that contract.

## Determinism, isolation, and data

- Control clocks, randomness, and relevant environment inputs. Use bounded condition-based waits; avoid arbitrary sleeps, busy waits, and unbounded polling.
- Bound retries, streams, scans, pagination, generators, and property-test case count, depth, and size. Print the seed on a randomized failure.
- Isolate mutable state per case and namespace data for parallel execution. Use minimal explicit fixtures or domain builders; avoid hidden shared state.
- Clean up timers, sockets, servers, browser contexts, clients, and stored state. Await asynchronous test work; treat unhandled rejections as failures.
- Keep fixtures bounded and inspectable. Do not use secrets, personal data, or production dumps.

Treat flakiness as a defect in the evidence. Investigate the cause rather than accepting retries as proof of correctness.

## Proportionate implementation

For a localized change, a short outcome/risk statement and the relevant existing checks may suffice. Unclear behavior, new boundaries, consequential compatibility changes, or high-impact failure modes need more analysis before implementation. Resolve material ambiguities and follow applicable approval requirements; risk alone creates no extra approval gate. Continue within the user's existing authorization.

Prefer short vertical slices for behavior changes. For a production bug, capture a failing reproduction at the boundary where it escaped before applying the fix, then demonstrate it passes. For new behavior, write or tighten a meaningful failing check when feasible, implement the behavior, and refactor while green. Capture failure for the relevant reason; missing scaffolding alone does not demonstrate the behavior was detected. If reproduction is constrained, state the limitation and the resulting evidence gap.

Already guarded behavior and behavior-neutral changes do not require an invented red run or a redundant new test. Run the relevant existing checks, or use diff inspection and applicable build/lint checks when those address the entire affected risk. Rerun affected checks after material refactoring. Keep characterization and boundary coverage in place before broad legacy rewrites.

Completion requires evidence that addresses the changed outcome and consequential failure modes. Report unavailable checks and exposed risks honestly; an unrun command or proposed test supplies no observed pass. When a software proof plan already exists, keep evidence consistent with its applicable conventions without creating a parallel checklist.

## Performance, operability, and coverage

For hot-path changes, consider affected round trips, command count, allocations, serialization, per-message CPU, and memory bounds. Where relevant, batch work, avoid serialized N-by-await loops, and limit object churn. A wall-clock budget needs controlled measurement with its workload and environment recorded; avoid fragile routine-CI timing assertions. Use an existing software proof record when available, or include the measurement and its limits in the verification evidence.

For changes affecting production operation, identify healthy and broken signals plus recovery or rollback effects on data and in-flight work. Avoid per-message log spam on hot paths and secrets or personal data in logs. For temporary migration flags or dual paths, name why they exist, how relevant paths are checked, who removes them, and the removal condition. Intentional durable product modes follow their explicit contract rather than a fictional removal deadline.

Use coverage as a diagnostic when it helps find unguarded critical paths, risky branches, or refactor blind spots. Percentage increases and raw test counts do not establish assertion strength or software safety.

## Report the result

Use the existing project format or a concise explanation that covers:

- **Outcome and decision:** what changed, the relevant risk, and why existing or added verification is sufficient.
- **Evidence:** checks reused, tightened, added, or replaced; what they establish; reproducible commands and actual results. Cite the relevant files rather than listing every opened file.
- **Remaining gaps:** checks not run with reasons, assumptions, exposed risks, and relevant performance or recovery limits.

For consequential changes, expand the analysis and test strategy with boundary/fidelity choices and tradeoffs. Omit irrelevant sections and avoid duplicating facts already recorded in the project's artifacts.
