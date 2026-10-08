---
name: plan-question-spec-infra
description: Review infrastructure proposals or costly and slow services through workload decomposition, primitive fit, bounds, and grounded latency and cost estimates. Use for material storage, queue, cache, or compute choices in software and ML systems. Produces a design critique; measurement execution, implementation, ML evaluation, and milestone planning are separate tasks.
allowed-tools: Read, Grep, Glob
---

# Infrastructure review

Look for structural changes that improve latency, capacity, and cost together: separate workloads, match access patterns to primitives, and remove unnecessary work. Treat those gains as a hypothesis. Consistency, durability, distance, retention, security, reliability, and operating capacity can justify tradeoffs. Compare the full cost of the alternatives before recommending a swap.

## Scope and inputs

Review the supplied proposal or current design, relevant repository constraints, and available load, latency, and cost evidence. A formal work spec or verification plan is useful when available. Ask for missing information only when it could change the recommendation; otherwise expose the uncertainty.

This review is read-only. Independently assess the design without editing implementation or running benchmarks. For an unknown that needs measurement, state the workload, decisive observation, and acceptance boundary for subsequent software verification. ML metric selection, model validity, retrieval quality, and online experiment design remain with the ML evaluation workflow. Planning owns staffing, milestones, and delivery commitments.

Accepted design changes belong in the team's proposal or decision record; implementation and verification are separate follow-ups. Existing review findings can be reused with their evidence. No sibling review or particular model routing is required.

## Decompose the workload

Per user operation or job, separate reads, writes, scans, fanout, and streams; hot, warm, and cold data; shared and per-user access; bounded and growing state. Identify canonical truth and any serving projections. Different classes may share a primitive when it meets their constraints; decomposition does not require additional services.

Record the relevant arrival rate and time window, peak concurrency, payload size, retention, locality, consistency, and latency or throughput requirement. For ML systems, separate online inference from batch inference, training, feature refresh, and embedding generation where those workloads exist. Consider model residency, accelerator memory and utilization, batching delay, token volume, cold starts, and replica count when they drive capacity or cost.

## Fit primitives to access patterns

Use this table as selection guidance. Actual constraints, measurements, and total cost determine the choice.

| Primitive | Useful fit | Check before choosing |
| --- | --- | --- |
| Valkey/Redis | Bounded hot lookups, counters, sorted or hashed fragments | RAM cost, cardinality, hot keys, shard distribution, staleness, and rebuildability; a projection needs explicit source/version, dirty, and unavailable states |
| Durable KV, such as DynamoDB | Key-shaped reads and writes, canonical truth, idempotency, audit | Access and index fit, consistency, throttling, scans, and per-operation cost; direct serving can be sufficient |
| Relational or analytical store | Transactions and joins, or large aggregates with a suitable query engine | Query/index fit, scan cost, and interference between analytical work and latency-sensitive requests |
| Object storage, such as S3 | Large blobs, immutable artifacts, checkpoints | Request cost, transfer cost, latency, and using object listing as a query |
| Queues and streams | Decoupling, spike absorption, replay, asynchronous fanout | Delivery/order semantics, duplicate handling, depth/age bounds, backpressure, and added delay in a synchronous operation |
| CDN/shared cache | Reusable responses with compatible visibility and freshness | Authorization, private payloads, cache keys, invalidation, and write visibility |
| Long-lived compute | Sustained work that uses reserved capacity | Idle cost, headroom, scaling delay, and operational effort |
| Per-invoke compute | Intermittent or parallel work | Invocation volume, cold starts, runtime limits, and break-even utilization |
| Accelerator compute | Inference or training with demonstrated hardware need | Memory fit, utilization, batching, startup/loading time, transfer overhead, and provisioned idle cost |
| In-process memory | Small working sets and instance-local state | Durability, cross-instance coherence, growth limits, and recovery |

For each material class, identify the chosen primitive, access pattern, dominant cost driver, and a credible simpler alternative or swap. Explain why the alternative wins or why the current choice holds.

## Challenge costs, bounds, and failure behavior

Use these lenses where they affect the decision; report each finding once.

- **Structural fit:** Challenge an asserted speed/scale/cost tradeoff with a workload decomposition or simpler path. Compare a direct truth-store read with a repairable projection when repeated reads justify it. A cache can add storage, invalidation, and recovery work while leaving the underlying access mismatch intact. A queue and workers need a constraint that one process cannot satisfy.
- **Bounds and growth:** Check key cardinality, bytes per key, scans, fanout, payloads, retention, and queue depth/age. Name limits, TTLs, eviction, or pagination where appropriate. Deferring bounds can create a migration. Estimate at the target load and a credible growth or stress scenario; use 10x when it informs the actual decision.
- **Economics:** Ground material cost and latency claims in rough calculations. For example: requests per period × operations per request × unit price, plus capacity, storage, transfer, and operating costs. Identify sequential round trips, command counts, serialization, allocations, and queueing on repeated paths. Include migration/rebuild cost, support burden, and break-even conditions for a proposed swap.
- **Failure and recovery:** Consider spikes, retry amplification, duplicate delivery, partial failure, idempotency, timeouts, backpressure, and load shedding. A projection needs bounded rebuild and recovery behavior. Degradation must preserve the promised user outcome; for shared-presence systems, reduced detail may preserve participation better than silently hiding people. Include diagnosis, ownership, rollback, and recovery cost. A demonstrated failure of a stated requirement needs a fix or explicit mitigation before recommending implementation.
- **Simplicity:** Identify what added infrastructure removes or enables. Multiple serving paths need a reason, clear authority, and consistency/recovery rules. A migration path needs a removal condition. Compare these costs with keeping the existing design.

**Number honesty:** Cite each material figure's source and context, or label it an assumption and name evidence that would invalidate it. Use units, time windows, and ranges that reflect uncertainty. Distinguish measured results from estimates; avoid unsupported precision or universal latency and price claims. When estimation is not credible, state the missing evidence.

## Calibration example

Hypothetical case: repeated reads of a small shared fragment dominate database request cost. A bounded Valkey projection may improve latency and cost if freshness permits reuse and rebuilding is feasible. Compare measured database reads with cache hits/misses, update volume, RAM, replicas, transfer, rebuild work, and operating effort. Preserve canonical truth and explicit projection state. With low reuse or stringent freshness, direct database serving may remain the simplest sufficient choice.

## Recommendation and record

Lead with implement as written, implement with changes, fix the proposal first, or insufficient evidence. Qualify the recommendation by the reviewed scope and evidence.

Use one compact findings table or list: evidence/assumption, consequence, smallest concrete change, and closure evidence. Order material findings by impact; distinguish required fixes from optional improvements and measurement questions. Include calculations where credible, the largest remaining risk, and the next decision. Zero required changes is a valid result; omit empty dimensions and a full primitive inventory for a narrow review.

Return the review in chat unless a saved artifact is requested or required by the repository. Recommend recording accepted and rejected concerns with their rationale in the team's existing decision record. Revisit settled concerns when requirements or evidence change.
