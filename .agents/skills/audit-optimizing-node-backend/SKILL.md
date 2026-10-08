---
name: audit-optimizing-node-backend
description: Audits backend services in any language for latency, throughput, scalability, resource cost, and concurrency or overload risks. Use for performance reviews, bottleneck analysis, capacity assessment, and optimization decisions grounded in code, workload, or runtime evidence.
---
# Backend Optimization

Find the few backend patterns most likely to cause latency, excessive resource use, or failure under the relevant workload. Explain the mechanism, preserve correctness, and identify evidence that would confirm or disprove each concern.

Work across languages, runtimes, databases, caches, queues, and deployment models. Start with the system in use; recommend a technology change only when evidence shows a material limitation and the migration tradeoff is justified.

## Scope

Use for slow services or jobs, tail latency, throughput limits, memory growth, saturation, resource cost, and risks under growth or partial failure. Design-stage reviews can assess expected access patterns and capacity, with assumptions explicit.

This skill produces an audit and proposed optimization directions. Implement changes in a separate, explicitly requested implementation task. General code explanation, readability, frontend performance, and test-suite quality belong elsewhere unless directly responsible for runtime behavior.

Backend execution around ML services is in scope. Model quality, retrieval relevance, evaluation datasets, and online experiment design belong to ML evaluation. Project ownership and milestones belong to planning.

## Establish the Runtime Path

Trace a representative request or job from entry through computation, storage, dependencies, and completion. Identify where work multiplies, waits, allocates, or outlives its caller.

Extract the facts that affect the conclusion:

- **Workload and target:** latency or throughput objective, traffic shape, concurrency, payload and collection sizes, tenant skew, growth expectation, and cost budget.
- **Execution and state:** language/runtime version, scheduling model, workers or replicas, resource limits, pools, shared state, dependencies, and deployment lifecycle.
- **Evidence:** source/configuration, query plans, traces, profiles, metrics, incidents, or measured comparisons.

Proceed with explicit assumptions when useful evidence exists. If neither an implementation nor a design is available, request the smallest artifact needed to locate the bottleneck. A limit absent from supplied code remains unknown until callers or contracts establish it.

## Inspect the Relevant Patterns

| Area | Patterns and questions that change the assessment |
|---|---|
| Execution and hot path | Repeated initialization, serialization, copying, expensive algorithms, blocking work, N+1 calls, or fan-out growing with input. What saturates the actual executor, interpreter, thread pool, or connection pool? Would concurrency preserve ordering and fit downstream capacity? |
| Data access | Work examined versus results returned; query/index fit; hot partitions or lock contention; pagination and caller completeness; transaction duration; write amplification; partial batch results. Use actual query plans and storage semantics: filtering or pagination may reduce transferred data without reducing underlying work. |
| Caching and retained state | Miss-path cost, stampedes, freshness and invalidation ownership, retention bounds, hot keys, value size, and eviction consequences. Distinguish disposable cache, coordination state, and authoritative data before suggesting expiry, eviction, or replication changes. |
| Memory and resource lifecycle | Retained objects, allocation churn, heap versus process memory, buffered streams, unbounded queues, listeners, descriptors, connections, and cleanup after errors or cancellation. Distinguish expected warm-up from continuing growth. |
| Concurrency and correctness | Read-modify-write races, shared state across workers/replicas, transaction and isolation guarantees, duplicate delivery, idempotency, and lock ownership. Batching does not imply atomicity. Lock expiry alone does not reject stale writers; check conditional writes, fencing, or an authoritative invariant. |
| Overload and partial failure | Caller deadlines, cancellation, timeouts, retry budgets/backoff/jitter, replay safety, pool/queue bounds, backpressure, isolation, and load shedding. Timeout or cancellation can leave remote success unknown. Check whether retries or queued work amplify dependency failure. |

Observability supports each area: connect the user symptom to a cause signal such as queue wait, CPU time, rows examined, allocation rate, pool utilization, or downstream latency. Flag missing telemetry when it materially prevents diagnosis.

## Calibrate Before Recommending

- A fixed small fan-out is bounded; sequential work may preserve ordering, rate limits, or transaction semantics.
- A full scan in an isolated, rate-limited maintenance job has different consequences from the same scan in a shared request path.
- Durable state can have explicit lifecycle ownership without expiry. Cache expiry alone does not establish acceptable freshness.
- Required consistency, isolation, authorization, and idempotency are constraints on optimization.
- Framework-managed compilation, pooling, retries, or timeouts may already satisfy the need. Inspect configuration and runtime behavior before declaring them absent.
- Async execution, threads, extra replicas, batching, and caching can move or amplify the bottleneck. State the resource limit and tradeoff that make the recommendation appropriate.

Assign **impact priority** from consequences, likelihood, workload, and blast radius; report **confidence** separately:

- **Critical:** credible immediate outage, corruption, or uncontrolled resource/cost risk.
- **High:** substantial impact at current or expected load, or a serious contention/failure risk.
- **Medium/Low:** conditional scaling risk or limited improvement; state the condition.
- **Needs context:** missing facts prevent a defensible priority.

A visible pattern can justify a provisional risk; claims of measured impact require runtime evidence. Avoid invented speedups, universal thresholds, and automatic sprint or deployment deadlines.

## Deliver a Proportionate Audit

Open with the main conclusion, scope, evidence reviewed, and material assumptions. Prioritize the findings that could change an engineering decision. A focused review can use a short list; a broad review can add a coverage table. State meaningful evidence gaps and safe patterns without empty severity buckets or repetitive sections.

For each finding include:

- **Location, priority, confidence:** exact code/configuration path, symbol, query, or design assumption.
- **Observation and mechanism:** separate the observed fact from the inferred resource or failure consequence; name the workload where it matters.
- **Direction and tradeoff:** a concrete improvement and its correctness, cost, latency, memory, or operational consequences.
- **Falsifier and verification signal:** what would lower or eliminate the concern, and what symptom/cause measurement should confirm it.

Use short evidence snippets when helpful. For a requested release recommendation, keep the judgment within the reviewed scope and evidence.

Each finding needs a verification signal. Expand into a benchmark or load-test plan when requested or when uncertainty could change the recommendation; read [verification.md](references/verification.md) then. Choose measurement by the claim and runtime, rather than a preferred tool.

Read [evaluation-suite.md](references/evaluation-suite.md) only when maintaining or evaluating this skill. It contains optional behavior scenarios, not a service-audit workflow.
