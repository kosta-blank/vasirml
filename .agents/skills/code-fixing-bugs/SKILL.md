---
name: code-fixing-bugs
description: Reproduce, diagnose, repair, and verify software or POC defects with regression evidence. Use for code failures, regressions, flaky behavior, concurrency faults, performance regressions, and replay divergence. Model quality, metric selection, and experimental validity belong to ML evaluation.
---

# Reproduce and Fix Bugs

Name the broken outcome, reproduce it on unpatched code, locate the cause with evidence, make the smallest repair, and retain a regression check that protects the outcome.

**Place in the system.** Keep the bug contract, diagnosis, and verification evidence in the existing issue, PR, work specification, or a compact inline note. Use the repository's established records when present. This skill requires no lane states, separate evaluation plan, or new planning artifact. Software checks establish the behavior they exercised; model quality, metric selection, and experimental validity remain with ML evaluation.

Companion risk, proof-design, root-cause, or postmortem workflows are optional when available and useful for the task. Broader contract, state, security, performance, or migration risk warrants proportionate verification and rollout reasoning.

## Define the Bug Contract

Before repair, record the following at the level the evidence supports:

- **Actor + Goal:** who or what consumes the behavior; which outcome is broken.
- **Boundary:** the relevant interface the reproduction drives, such as a public module function, API route, message topic, SDK method, CLI/job, or UI action.
- **Trigger → Expected → Actual:** inputs and conditions, the supported expected behavior, and the observed failure.
- **Disallowed outcomes:** relevant harms beyond the symptom, such as data loss, duplicate effects, stale state, or silent corruption.
- **Proof points:** assertions that demonstrate the repair; telemetry that would detect recurrence when operationally relevant.

For a pipeline, queue, or stateful flow, name only the guarantees implicated by the bug: delivery, idempotency, ordering, atomicity/ack ordering, isolation, recovery, or time bounds. Omit irrelevant fields rather than scaffolding with N/A. Mark unknown behavior and obtain evidence before inventing a contract.

A hypothetical preprocessing bug may need only a unit test: pass rows containing a missing value into the public transform and assert that feature rows remain aligned with record IDs. If the failure occurs during serialization between a worker and a service, reproduce that handoff as well.

## Select the Smallest Faithful Test

Choose the scope that reproduces the breach and asserts its outcome and relevant invariants:

- **Unit:** a public module function or component interface contains the defect and its consequences.
- **Contract or service integration:** the defect concerns serialization, dependency semantics, persisted state, or a provider/consumer interface.
- **Workflow integration:** interactions among components cause the failure; include the minimum necessary components.
- **UI or end-to-end:** rendering, interaction, or the full user surface is necessary to observe the breach.

Exercise production logic at the chosen boundary. A narrow passing test cannot establish a broader behavior it never exercises. Add wider verification when the defect or affected callers cross that boundary. Reuse relevant tests and harnesses before building new ones.

## Hard Rules

1. **Capture failure before repair by default.** Run the reproduction on unpatched code and confirm it fails for the reported reason. A missing API, broken fixture, or unavailable service proves a different failure. Save the failing evidence before patching; exceptions follow **Incomplete Reproduction and Urgent Mitigation** below.
2. **Assert observable contracts.** Check function results, responses, rendered state, persisted data, emitted events, or queue outcomes. Incidental internal calls, log lines, and timing quirks cannot establish the repair. Never certify behavior the production path cannot exhibit.
3. **Preserve dependency fidelity.** Use real local dependencies when their semantics are at risk. A hermetic fake is acceptable only when it preserves the tested contract and the defect is outside that dependency. Mocks belong outside the affected boundary: mocking a unique constraint cannot prove duplicate suppression. Use established repository configuration and dependency seams. For an unavailable third party, test the nearest controlled interface and state which semantics remain unverified.
4. **Control nondeterminism.** Use bounded polling with explicit deadlines instead of sleeps. Seed randomness, control time, and use barriers/latches for concurrency. Isolate state with unique IDs or namespaces; teardown always runs.
5. **Keep the repair minimal.** Keep one implementation for the repaired behavior; any temporary compatibility path needs a removal condition. Widen timeouts or add retries only when the contract requires them and evidence supports them. Refactor after the behavior passes, only where it strengthens the same repair; avoid unrelated cleanup.

## Diagnose with Evidence

- Attribute the failure before fixing: distinguish product behavior from environment, configuration, fixtures, and test-instrument faults.
- Separate verified facts from hypotheses. Give each hypothesis a falsifier: an observation that would disprove it. Name the difference between working and failing cases.
- Confirm preconditions and postconditions at boundaries; rule out alternatives with evidence.
- Minimize after reproducing the failure: shrink payloads, setup, and steps. Reduce concurrency to the smallest failing pattern, or establish why the race is required.
- For a difficult hunt, retain ruled-out causes, misleading signals, evidence paths, and the fastest diagnostic path for a future responder. Use an existing incident or root-cause process when applicable.

## Special Bug Classes

- **Concurrency / distributed / async:** reproduce the race or fault, such as parallel calls, concurrent messages, worker restart, duplicate delivery, or a crash mid-flight. Coordinate deterministically; assert no duplicates, early acknowledgement, or partial commit as relevant.
- **Performance regressions:** prefer structural cost invariants, such as bounded query counts, allocations, or payload sizes. For an elapsed-time contract, measure a baseline under a controlled workload, include warmup and a statistical threshold, and use a separate benchmark job when noise makes default CI unsuitable. A single fragile timing is insufficient.
- **Replay / state divergence:** record seeds, configuration, ordered inputs or events, and checkpoints through the relevant replay or state-machine harness. Assert at restoration and a later checkpoint or final hash; checking final state alone can miss drift that later reconverges. Preserve the required determinism and use available diagnostic signals to locate divergence.
- **Intermittent failures / heisenbugs:** seed randomness, control time, coordinate concurrency, and minimize. If the failure remains unavailable, follow the incomplete-reproduction route.

## Incomplete Reproduction and Urgent Mitigation

When reproduction is incomplete, report the supported contract, observed facts, unresolved hypotheses, and exact missing inputs: payloads, concurrent call/message sequence, environment/configuration, versions or commits, correlated logs/traces, fixtures, or timing constraints. Select a bounded next investigation or targeted instrumentation with a stopping condition and the observation it should capture. If that attempt provides insufficient evidence, report the blocked repair and the next required input. Do not patch a guessed cause. An instrumentation change does not establish a fix.

When evidence establishes active harm, a full reproduction may be deferred for the smallest reversible mitigation supported by that evidence. Stay within the task's authorization. Record the harm signal, containment scope, available verification, monitored outcome, rollback action and trigger, and deferred regression proof with an owner or explicit unassigned follow-up. Avoid irreversible migrations and unrelated redesign. Describe the result as mitigation with verification limits; claim a verified fix only after reproduction and repair evidence are complete.

## Guardrails After the Repair

Cover nearby failure modes of the same contract with additional assertions or a tightly related test. Name one adjacent behavior that must remain intact and whether it was tested, inspected, inferred, or left unverified. Name tests for the behavior they protect, for example:

- `does_not_acknowledge_message_until_side_effects_committed`
- `delivers_purchase_receipt_once_for_idempotency_key`
- `rejects_invalid_payload_without_poisoning_queue`
- `replays_identically_across_restore_boundary_and_final_hash`

## Verification and Close-Out

For a verified fix, retain failing evidence from unpatched code and passing evidence after repair. Map the relevant invariants to assertions, keep regression checks deterministic, isolated, and bounded for CI, and run the focused test plus the affected suite appropriate to the change.

Use one compact evidence record in the existing destination:

- Outcome and cause, with observed facts distinguished from inference.
- Repair and affected boundary.
- Exact commands, results, and evidence references; code revision and environment details when they affect reproduction.
- Nearby non-regression coverage, commands not run and why, deferred semantics, and remaining uncertainty.
- Reviewer focus; rollback and follow-up when mitigation or rollout risk requires them.

Report incomplete verification or mitigation with its limits. Do not claim completion from a narrower check or an unexecuted command.
