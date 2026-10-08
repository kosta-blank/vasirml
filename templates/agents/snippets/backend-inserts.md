# Backend Inserts

<!-- vasir:purpose:start -->
**Purpose:** [Describe this backend repository in 2-3 repo-specific sentences. State its consumers, core service or data contracts, and the outcomes that matter.]
<!-- vasir:purpose:end -->

<!-- vasir:routing:start -->
- **Services and data:** Before changing an API, persistence boundary, or worker, inspect its nearest instructions, implementation, contract documentation, and tests. Follow paths that exist in this repository.
- **Infrastructure:** For deployment, permissions, secrets, or service wiring, inspect the existing infrastructure and local-development documentation before editing.
<!-- vasir:routing:end -->

<!-- vasir:engineering-doctrine-inserts:start -->
## Backend Guidance

### Existing stack and boundaries

Follow the repository's runtime, language, module system, dependencies, and test runner. Read its actual start and test commands; do not impose Node, JavaScript, Mocha, or a container policy on another stack.

Extend existing configuration, authentication, key-building, persistence, and external-service boundaries instead of creating competing clients or conventions. Keep configuration reads in the established boundary. A new abstraction should solve a demonstrated ownership or behavior problem.

### Contracts and performance

Design APIs around consumer tasks with clear authorization, errors, and consistency. Aggregate related data when that simplifies a task within its latency and payload budget; split requests for pagination, ownership, authorization, or other meaningful boundaries.

Use documented traffic units, workloads, SLOs, and measured bottlenecks. When targets conflict or are missing, expose that uncertainty. For material performance changes, identify affected calls, allocations, fanout, payload sizes, and relevant latency or throughput measurements. Bound growing collections, scans, queues, and retries. Avoid per-item logging and expensive repeated work on hot paths.

### Persistence, caches, and migration

Choose serving paths from the repository's correctness and workload requirements. For a new cache or projection, name its authoritative source, cardinality and payload bounds, staleness tolerance, expiration, fill/miss behavior, repair strategy, and owner. Verify authorization on private data.

For Redis/Valkey, avoid blocking full-keyspace operations on serving paths. Bound collection reads and cleanup. If cluster deployment applies, verify slot compatibility and key distribution; colocate only keys that need atomic operations and avoid concentrating unrelated hot traffic in one slot.

Use explicit schema or protocol versions when compatibility, persisted data, or simultaneous clients require them. Use migrations when consumers can move together. Temporary dual reads/writes need a reconciliation strategy, rollback plan, owner, and retirement condition. Do not impose either permanent versioning or blanket migration on every system.

### Workers and infrastructure

Document actual delivery and ordering guarantees. Make side effects idempotent where duplicates, retries, or replays can occur. Give network calls deadlines and retries a bound. Define shutdown, cancellation, checkpointing, and recovery behavior for long-lived work.

Ship necessary startup, deployment, permission, environment, and local-development wiring with the feature. Validate the relevant infrastructure contract. Describe where a local substitute cannot establish production readiness and name any remaining deployment check.

### Verification and operations

Run focused checks using the established runner. Use integration tests for behavior that depends on real service semantics, with isolated test data and cleanup. Mocks remain useful for focused contracts and controlled failures; report what they do not establish. Do not force a test runner to exit to conceal leaked resources.

Use the established logger with bounded, redacted diagnostics and correlation identifiers. Never log credentials, tokens, or sensitive payloads. Handle expected errors explicitly and preserve unexpected failures at the responsible boundary without duplicate logging.

Track processes started for the task, their expected duration, and useful progress. Investigate stalls and stop only task-owned processes when appropriate. Do not terminate an established long-lived service merely because it is quiet.
<!-- vasir:engineering-doctrine-inserts:end -->
