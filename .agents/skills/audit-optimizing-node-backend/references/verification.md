# Backend Verification

Use the smallest measurement that can distinguish the proposed mechanism from plausible alternatives.

| Claim | Evidence that can establish it |
|---|---|
| CPU or allocation cost | Runtime-appropriate profile and controlled local benchmark; separate setup, warm-up/JIT, and steady-state work. |
| Tail latency or throughput | Request/job traces plus representative load; split queue wait, execution, and dependency time. |
| Data-access amplification | Query plan, rows/items examined versus returned, request/page counts, lock wait, storage latency, and consumed resources. |
| Pool or executor saturation | Active workers/connections, queue depth and wait, timeouts, and utilization under increasing offered load. |
| Leak or retention growth | Memory/resource trends after warm-up, allocation or retention profiles, repeated lifecycle cycles, and cleanup evidence. |
| Retries or duplicate work | Attempts per operation, dependency errors, queue lag, replay tests, and invariant checks after ambiguous success. |
| Startup overhead | Cold/warm split, initialization profiles, deployment/runtime configuration, and connection setup time. |

A local microbenchmark establishes local cost. End-to-end claims need system evidence, including dependency behavior and queuing. A faster helper may leave the bottleneck unchanged.

For a concrete plan specify the claim, baseline, representative inputs/load, measurement, expected direction or justified threshold, and correctness/resource guardrails. Include bursts, large tenants, or degraded dependencies when those conditions drive the finding.

Control environment, versions, warm-up, input distribution, caching, and run-to-run variation. Record offered and achieved throughput, errors, and timed-out work. A load generator that slows with responses can hide overload by reducing arrivals; choose an arrival model that matches the workload. Avoid averaging away tails or treating a single run as a stable result.

Use existing SLOs and budgets for pass criteria. If none exist, report the measured tradeoff and remaining uncertainty. For resource-cost claims, compare cost per successful request/job and capacity headroom; per-instance utilization alone is insufficient.

Keep correctness checks alongside performance comparisons: result completeness, ordering, isolation, stale-read tolerance, replay safety, and dependency load. Propose experiments within the authorized environment; this audit does not itself authorize production load or failure injection.