# Skill Maintenance Scenarios

Optional checks for revisions to this backend-audit skill. Load only for skill maintenance. These assess audit behavior; they do not define ML model evaluation or mandate a service test suite.

## Scope and Portability

- A Python API slows under burst traffic, a Java worker exhausts its connection pool, and a Node service has expensive serialization: use each runtime's execution model and evidence without recommending a language or database migration by default.
- A user asks to explain code or assess model prediction quality: route to the appropriate task.
- A performance audit request produces findings and directions. A later explicit fix request begins a separate implementation task.

## Mechanism and Evidence

Give a request path with input-sized fan-out, per-item downstream calls, incomplete pagination, and retries after caller timeout. Supply code plus incomplete workload data.

Expected: locate the mechanisms, distinguish facts from assumptions, calibrate priority/confidence, preserve caller completeness and replay safety, and give a falsifier plus verification signal for each material finding. Missing telemetry produces provisional risks, not invented measurements.

## False Positives and Tradeoffs

- Three fixed independent calls versus an input-sized task list: distinguish bounded concurrency from potential saturation; inspect downstream capacity.
- Required sequential state transitions versus independent reads: preserve ordering and transaction guarantees.
- Isolated checkpointed maintenance scan versus shared request-path scan: assess bounds, blast radius, and underlying work.
- Durable state with lifecycle ownership versus unbounded ephemeral cache: avoid blanket expiry advice; inspect invalidation and eviction consequences.
- Framework-managed pooling or compilation versus per-request setup: verify lifecycle before flagging it.
- Memory rising during warm-up then stabilizing versus retained resources across completed jobs: distinguish expected growth from a leak.
- Batched writes versus an atomic invariant; an expired lease versus stale-owner rejection: distinguish performance mechanics from correctness guarantees.

## Measurement and Delivery

- A local transformation benchmark and an endpoint p99 claim require different evidence. Reject inference of end-to-end gains from the local comparison alone.
- A load test reports higher throughput but excludes timeouts or changes arrival rate: surface the comparison limitation.
- A one-handler review should be concise. A broad service audit may include coverage; neither should invent findings to fill sections.
- A code smell with unknown production bounds remains an investigation item when the missing facts determine impact.