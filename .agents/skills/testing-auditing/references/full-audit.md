# Full Test Audit Reference

Use this reference when a broad review or a material risk needs more detail than the focused review. Extend the same guarantee/evidence table from `SKILL.md`; select the relevant checks below. The headings and templates are prompts, not mandatory report sections.

## Surface Inventory Prompts

Identify the guarantees within the declared scope before reading tests. Assign stable IDs when needed to connect findings and proposed tests. Combine overlapping guarantees rather than counting the same outcome under several headings.

- **Value paths:** success, partial success, failure, retries, no-op, duplicates; request handling, user-visible errors, state changes, emitted events, side effects, and forbidden side effects.
- **Input partitions and boundaries:** nominal, empty, one, zero, negative, maximum, just-under/over maximum, missing, malformed, wrong type, encoding/Unicode, duplicate, adversarial/injection-adjacent, permission and context differences.
- **State and preconditions:** empty, existing, already processed, stale, mid-operation, post-failure recovery, corrupt, or legacy data.
- **Failure modes:** dependency errors, timeouts, partial writes, exhausted retries, cancellation, resource exhaustion, validation failures, schema mismatch, incompatible versions, corrupt internal state.
- **Integration contracts:** services, queues, databases, files, caches, clocks, randomness, auth systems, browsers/devices, schemas, serialization, and protocols.
- **Ordering, idempotency, and concurrency:** duplicate events, out-of-order delivery, replay safety, concurrent readers/writers, contention, race windows, retry semantics.
- **Operational surfaces, when touched:** migrations/backfills/schema evolution; deployment configuration and flags; performance/load limits; timeout/cancellation/backoff; logging/metrics/audit; rollback/recovery/resume; backward compatibility/version skew/serialization drift; locale/timezone/clock; security validation and authorization.

For each guarantee, establish the primary oracle, hidden outcomes, and minimum acceptable evidence. Oracles can include returned values, persisted state, invariants, emitted events, serialized contracts, audit logs, metrics, absence of duplicate effects, timeout/cancellation effects, or rollback state. An indirect oracle may conceal a high-risk failure; name that limit or an observability gap. There is no test-count floor.

## Detailed Gap Proposals

Each exposed or weakly protected guarantee should have an actionable recommendation. Keep a single finding per guarantee or connected failure, cross-reference its evidence-table IDs, and avoid repeating the full finding in the closing action list. A useful proposal contains:

```text
TEST: behavior-headline name
COVERS: guarantee ID(s)
RISK: P0 / P1 / P2 and consequence
USER/SYSTEM GUARANTEE: what must remain trustworthy
SHAPE: unit / integration / contract / property / E2E as appropriate
ORACLE: observable proof that would expose the failure
BOUNDARY FIDELITY: real dependency / verified fake / contract-tested stub / mock-only / not applicable
SETUP: minimum relevant state, partitions, and failure injection
ASSERTIONS: durable outcomes, invariants, and forbidden side effects
```

Add effort estimates only when useful and supportable. Findings that are scope-limited require the missing evidence or scope decision, rather than assuming a test is absent.

## Boundary Fidelity & Contract Check

For relevant external boundaries, record:

```text
BOUNDARY: service / database / queue / file / cache / schema / etc.
CURRENT PROOF: what the tests actually run
CONTRACT ASSUMED: request / response / schema / ordering / idempotency / etc.
HOW VERIFIED: real local dependency / contract test / tested fake / unverified
DRIFT RISK: what could change silently
MISSING PROOF: the evidence needed at this boundary
```

Choose evidence that preserves the failure mechanism. A replay bug involving a unique constraint needs that constraint or verified equivalent behavior; a mocked deduplication store does not establish it. Wire shape, schema, or producer/consumer compatibility needs serialized contract evidence. A hermetic fake can be sufficient when the risk is outside the dependency and fidelity is verified. Snapshots can protect a serialized contract when narrow and stable; mock calls alone do not prove the resulting state.

## Hermeticity & Flake Check

Separate observed flakiness supported by CI/run history from static risks found through inspection. For each material risk, cite the test, the uncontrolled dependency, and the likely failure mechanism. Check:

- sleeps or timing used as synchronization;
- uncontrolled clocks, timezones, locales, or randomness;
- uncontrolled network/filesystem/environment dependence;
- shared mutable fixtures, order dependence, parallel hazards;
- resource collisions and interference across test runs.

When the repo requires deterministic replay or restore, check restoration boundaries and a later checkpoint rather than final state alone. Check that harnesses preserve the repo's randomness controls. Apply this specialized check only to relevant replay/restore behavior.

## Confidence & Surviving-Fault Check

Use code and assertions to identify plausible faults that could survive: flipped conditionals, removed rollback, missing retry, swapped returns, skipped events, stale contracts, or duplicate effects. Link each inference to the guarantee and missing oracle. Distinguish a hypothetical surviving fault from an executed mutation result; do not assign percentage bands without measurements.

Ask which guarantee could silently break, where the largest uncovered consequence lies, and where the suite gives confidence it has not earned. For supplied mutation results, record the command/tool, audited scope and revision when available, measured result, and limitations such as equivalent mutants or excluded code. Report missing provenance rather than inventing it.

## Test Smell Check

Report concrete smells when they weaken proof or maintainability, citing the test and consequence. Prompts: implementation coupling; assertion-free or semantically empty checks; kitchen-sink/eager tests; sleep-based synchronization; shared state; over-mocking; copy-paste cases suited to parameterization; mystery guests; general fixtures; assertion roulette; resource optimism; fragile snapshots or sensitive equality; hidden test data; test-run interference; conditional test logic.

Prioritize correctness, fidelity, and determinism over naming or stylistic preferences. A smell is a reason to examine evidence, not an automatic finding based on a label.

## Operational Risk Check

For touched operational surfaces from the inventory prompts, record **Covered**, **Weak**, **Missing**, or **Unclear** with the supporting evidence. Include migration/backfill recovery, rollback/resume, failure limits, and version compatibility where relevant. Do not demand unrelated operational tests.

## Software Verification Gate Cross-Check

Use only when the repo supplies a software verification plan or gate cards. Do not create a plan or require the original author's vocabulary. These checks assess implementation proof; they do not audit model validity or ML experiments.

- **Claim honesty:** does the cited test exist and assert the gate's claimed guarantee? Cite the gate ID and test.
- **Evidence freshness:** does the recorded run cover the current affected implementation/test revision? A green result predating relevant changes does not establish current protection.
- **Proof provenance:** if a gate claims a watched failure or mutation potency, is the supporting failure artifact present? Use local terms such as `Objectively Green`, `last_run`, `watched-red`, or `mutation` only when that schema exists.
- **Unregistered proof:** if strong tests protect P0/P1 guarantees that the supplied plan omits, recommend linking them. The review never registers tests or edits gate state.

Send these findings to the user or orchestrator through the review report. Reference existing code-review findings where the underlying defect is already described and explain the additional proof gap.

## Optional Scorecard

Use only when requested. Grade meaningful dimensions supported by evidence, omitting irrelevant categories:

- **Coverage:** value paths, input partitions, state/preconditions, failure modes, integration/contracts, touched operational risks.
- **Test quality:** oracle/assertion strength, isolation/hermeticity/determinism, readability as a specification, naming when material.
- **Architecture:** shape portfolio, double fidelity, setup hygiene, valid compression, risk-weighted sufficiency.

A compact format is `Dimension | Grade | Evidence | Consequence | Most useful improvement`. Grades are qualitative summaries, not numerical coverage or mutation estimates:

- **S:** critical guarantees have strong oracles, realistic boundary proof, deterministic tests, and low residual risk; tests communicate the guarantees clearly.
- **A:** strong protection with minor edge or operational gaps and no major blind spots.
- **B:** core flows protected, with meaningful boundary, failure, or fidelity gaps.
- **C:** significant gaps or weak oracles create more confidence than the evidence supports.
- **D:** token tests, mock-heavy proof, or major blind spots around high-risk behavior.
- **F:** no meaningful protection, or evidenced instability/unrealistic checks make pass/fail status untrustworthy.

A grade does not replace exposed guarantees, scope limits, or a release recommendation. Close with the prioritized actions described in `SKILL.md`, referencing earlier findings rather than duplicating them.
