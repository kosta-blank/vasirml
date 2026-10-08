---
name: code-enforcing-principles
description: Classify concrete repository changes by risk, identify the boundary that could fail, and derive contract, verification, migration, and rollout obligations. Use before implementing or reviewing a proposed software change, especially retries, interfaces, persistence, dependencies, and deployments. Planning and model-quality evaluation remain separate.
---

# Production Code Change Protocol

Connect a proposed change to the problem it solves, the boundary it could break, and the evidence needed to review it. Keep the diff and documentation proportional to risk.

## Scope & Ownership

Use for concrete repository changes. For abstract strategy or discussion without a proposed edit, discuss the question without starting this protocol.

Read applicable repository guidance and the relevant existing specification, tests, and deployment procedures. This skill does not assume a particular root `AGENTS.md`, section numbering, language, runtime, or project family. Apply domain constraints such as deterministic replay only when the repository or task establishes them.

This protocol owns risk classification, affected contract descriptions, failure scenarios, and the resulting software verification obligations. Reuse the existing work specification for scope, contracts, and decisions; reuse its verification plan for checks and results. If `plan-maintain-work-spec` or `eval-design-proof-gates` is available and already used by the project, follow its artifact schema. Otherwise, put these outputs in the project's existing artifacts or a concise review note. Create durable documentation only when the change needs it; do not create a second plan for the same work.

Project planning owns requirements, owners, dependencies, and milestones. ML evaluation owns model validity, metric selection, retrieval quality, and online experiments. Software checks here may establish pipeline or serving behavior; they do not establish model quality.

## Problem & Repository Evidence

- Establish that the problem exists or the requested behavior is explicitly desired. If the repository already solves it, the request conflicts with an explicit invariant, or proceeding requires inventing contract behavior, report the evidence and the minimum decision or proof needed. If docs, config, or operator workflow solves it more safely, explain that option before expanding the code change.
- Cite inspected files, tests, configs, and adjacent precedent. Do not invent repository standards or justify safety from a small diff alone. Explicit safety and contract invariants take precedence over legacy practice.
- Mark missing facts as `Unknown` and assumptions as `Tentative`; qualify conclusions that depend on them.
- Keep one implementation path. Remove the old path in the change, or name the compatibility window and removal condition. Do not refactor, rename, reformat, or modernize unrelated code.

Inspect only what the affected boundary needs: symbols and callers, emitted/generated shapes, boundary tests, config/build scripts, logs and metrics, rollout patterns, dependency files, and relevant decisions.

Name the exact failure boundary, for example:

- `Risk boundary: event ingestion → queue enqueue; replayed requests can create duplicate processing jobs.`
- `Risk boundary: serving response → deployed consumer; an unknown field can break an older parser.`
- `Risk boundary: request serialization; added allocations can increase tail latency.`
- `Risk boundary: backfill writing persisted feature rows.`
- `Risk boundary: none found; private rename with no runtime, emitted, or build effect.`

## Risk Classification → Obligations

Assign every applicable tag. Tags identify obligations; they do not prescribe document length. Existing checks may satisfy an obligation when evidence shows they exercise the affected boundary and remain applicable to the changed behavior. A passing suite without that connection is insufficient.

| Tag | Affected surface | Verification obligation | Contract details when touched |
| --- | --- | --- | --- |
| C0 Non-meaningful | Comments, formatting, mechanical rename/move with no runtime, emitted, build, test, or contract effect | Inspect the diff to establish no effect; run an existing relevant check only where inspection leaves uncertainty or repository policy requires it | None |
| C1 Local logic | Internal refactor with unchanged behavior and no external state, security, capacity, or rollout effect | Focused existing or new check at the local boundary | None |
| C2 Behavior | User/operator-visible behavior within the current interface | Check the changed behavior at its visible boundary | Expected behavior and error handling |
| C3 Interface/Contract | API, schema, CLI, config, storage, event, analytics, file format, public function, generated code | Check the actual affected public, serialized, or generated shape | Schema, versioning, empty/missing/error semantics |
| C4 State/Semantics | Retries, ordering, dedupe, concurrency, persistence, offline sync, state machines, cache, time authority | Exercise relevant replay, duplicates, ordering, partial failure, and concurrency scenarios | Delivery semantics, ordering, idempotency, retry/timeout owners |
| C5 Hot path/Capacity | Latency, throughput, allocations, parsing, serialization, queueing, logging, rendering, storage, network, event-loop cost | Measure the affected path against a sourced budget and a failure criterion; state load shape and environment | Performance budget and limits |
| C6 Security/Privacy/Abuse | Authentication/authorization, secrets, PII, trust boundaries, rate limits, replay, abuse, safety-sensitive behavior | Check authorization/privacy invariants and fail-closed denial behavior | Trusted authority, data class, redaction |
| C7 Rollout/Migration/Skew | Flags, canaries, backfills, irreversible data changes, version coexistence | Check old, new, and coexistence behavior | Compatibility window and removal condition |
| C8 Dependency/Build/Tooling | Dependencies/lockfiles, runtime/compiler versions, CI/deploy tooling, generated-code pipelines, build flags | For dependency updates, read relevant changelogs/advisories and explain the lockfile diff; run affected build/tests and name rollback for the changed tooling or dependency | Source of generated artifacts and runtime assumptions when affected |

Optional surface labels help name ownership: backend/pipeline, frontend, client/runtime, infrastructure/operations, data/analytics, or cross-service/repository. Record the actual components and consumers rather than assuming a project topology.

## Work Sizing

- **Quick change:** known boundary, limited and reversible effects, no unresolved compatibility or coordination issue, and relevant verification available. A concise inline note can cover even a narrow C3–C8 change when these conditions hold. State why existing evidence is sufficient; keep every applicable obligation.
- **Substantial change:** uncertain boundary or authority, irreversible effects, significant blast radius, new coexistence/migration work, or coordination across owners. Use the existing specification and verification plan, or the repository's equivalent durable artifacts. Escalate when inspection invalidates the quick-change assumptions. Applicable repository policy may require more documentation.
- **Hotfix:** for active or imminent harm, state the signal proving harm, make the smallest reversible patch, avoid irreversible migrations and unrelated redesign, and verify the specific failure. Name rollback, deferred proof, and follow-up regression/design work.

## Contract Vocabulary

For affected contracts, state authority/write owner; delivery semantics (`at-most-once`, `at-least-once`, `effectively-once`); ordering and key; idempotency key and dedupe scope; retry owner at one exclusive layer; timeout/deadline owner; time authority; replay behavior; read visibility/consistency; conflict resolution; schema/versioning; and generated-code source of truth. Include overflow/backpressure behavior when capacity is affected. State the guarantees that make an `effectively-once` claim valid.

Record only the fields the change touches or depends on. Example: the queue worker owns retries, the API handler does not retry, and the persisted uniqueness constraint owns dedupe for the job key.

## Failure Pre-Mortem

For substantial or risky changes, capture up to three consequential failures as:

`Outcome → Invariant → Guard → Deterministic check → Operational signal`

Consider data corruption, duplicate effects, stale state, authorization/privacy failures, unbounded queues, backpressure collapse, retry storms, tail latency, version skew, bad migrations, and generated-artifact drift where relevant.

Example: duplicate job effect → one accepted write per job key → persisted unique constraint → replay integration check → duplicate rejection metric. If a signal or deterministic check is unavailable, state the gap instead of implying it exists.

## Conditional Engineering Detail

Read only the reference needed for the affected risk:

- For C7 or deployment decisions, [Migration & Rollout](references/migration-rollout.md) covers coexistence, feature flags, backfills, and rollback.
- For telemetry changes or operational failure signals, [Observability](references/observability.md) covers telemetry types, cardinality, sensitive data, and actionable alerts.
- For integration checks or choosing dependencies/doubles, [Boundary Verification](references/boundary-verification.md) separates dependency fidelity from contract, snapshot, and visual test forms.
- For changes to module or public interface design, [Design Review](references/design-review.md) retains the Ousterhout design questions.

Authorization belongs at the server or other trusted boundary; client checks serve UX. Security-sensitive errors must not expose privileged details. Admin/tooling scripts are production attack surface. Destructive or stateful scripts need dry-run support and an explicit blast-radius bound.

## Review Note & Close-Out

A quick note contains classification, risk boundary, problem evidence, scoped diff, relevant verification, reviewer focus, and material unknowns. A substantial change records these in its existing artifacts.

At close-out, state what changed, what verification actually ran and established, relevant checks not run with reasons, remaining risks, rollout/rollback when affected, and the place a reviewer should examine most closely. Do not claim a pass from a proposed check or call rollback an ordinary redeploy when data, caches, queues, clients, flags, or generated artifacts require recovery.

If implementation cannot safely proceed, report the evidence, specific risk, safer option, and minimum decision or proof needed. Keep this report proportional to the problem.

For meaningful changes, consider whether an existing check enforces the affected invariant. Suggest missing automation as a follow-up unless it belongs to the approved scope. Report stale or conflicting rules with evidence; keep unrelated rule cleanup out of the change. Record durable decisions in the project's existing decision log.
