---
name: plan-question-spec-architecture
description: Review a proposed system architecture for component necessity, ownership, interface and dependency risks, and recovery or migration costs. Use before adding a service, queue, cache, database, or subsystem, or when redesigning an ML or engineering system. Detailed infrastructure primitive selection, ML evaluation, and milestone planning remain separate tasks.
allowed-tools: Read, Grep, Glob
---

# Question the Spec — Architecture Angle

## Purpose and boundaries

Challenge whether the proposed components should exist and whether their boundaries form the simplest viable design. Adding a component needs a stated constraint that a simpler option cannot meet. Separation can earn its cost through isolation, independent scaling, security, consistency, or clearer ownership.

The related approach review challenges the intended outcome; infrastructure review compares primitives for the workloads that survive this review. When available, these are `$plan-question-spec` and `$plan-question-spec-infra`. Use their existing findings as context; request the relevant follow-up without requiring a full sequence of skill invocations.

This is a read-only design review. Analyze supplied evidence, propose changes, and identify measurements needed. Implementation, benchmarks, and spec edits are separate work. ML data and model dependencies, serving, and batch execution belong in the architecture review; metric selection, model validity, retrieval quality, and online experiments belong to ML evaluation. Software checks belong to software verification. Staffing commitments, ownership assignments, and milestone scheduling belong to planning.

## Ground first

Use the available proposal or spec, diagrams or dataflow, relevant repository contracts, constraints, and existing operational evidence. A formal eval plan or particular repository template is not a prerequisite. Identify consequential missing inputs and continue the review where the evidence permits.

Separate supplied facts, inferences, assumptions, and proposed decisions. Cite the artifact or source behind a finding. Load, latency, capacity, and cost figures need a source with its scope and date, or an assumption with a way to check it. Use rough calculations where they could change the recommendation, showing inputs and uncertainty; avoid invented precision. An unverified assumption remains open.

## Review the shape

Use the following lenses in proportion to the proposed change. Consolidate overlapping concerns; a small design does not need a section for every lens.

### 1. Workloads and constraints

Trace the user journey or engineering outcome through the proposed dataflow. Separate reads, writes, scans, fanout, streams, serving, and batch jobs where their needs differ. Identify volume and growth, latency, freshness, consistency, durability, privacy, and resource constraints that affect the shape. Distinguish required constraints from preferences.

### 2. Component necessity

For each consequential service, queue, store, cache, index, or abstraction, identify its responsibility, the constraint it satisfies, and the simplest alternative. Explain what fails if it is removed or folded into an existing component. Flag premature distribution, duplicated responsibilities, and caches that hide an unresolved dataflow or ownership problem. When adding infrastructure, state what it replaces or why the additional operating burden is justified.

### 3. Ownership, interfaces, and dependencies

Identify authoritative state, allowed writers, derived state, and the owner of refresh or repair. Inspect interface contracts, dependency direction, version compatibility, and coupling that forces coordinated changes or releases. Flag conflicting write authorities and circular dependencies. For ML systems, include data, feature, model, and artifact versions where compatibility affects execution or recovery. Report missing responsibility owners without assigning people.

### 4. Bounds, failure, and recovery

Check bounds on state, scans, payloads, fanout, queue depth, concurrency, and resource consumption. Reason through spikes, slow or unavailable dependencies, retries, duplicate delivery, stale data, and restart where relevant. Name backpressure, overload behavior, recovery ownership, and the signals needed to diagnose failure. For degraded service, preserve the agreed product guarantees and identify any behavior requiring a product decision.

Use existing evidence to assess these scenarios. A demonstrated violation of a required constraint is a blocker; an unresolved consequential scenario creates an evidence request.

### 5. Alternatives and full costs

Compare the proposed shape with a simpler viable alternative against the stated constraints. Workload separation can improve latency, scale, and cost together; the result depends on demand, consistency, resource use, and operating conditions. Include recurring infrastructure and resource cost, on-call and maintenance effort, migration cost, and additional failure modes. For ML serving or batch paths, consider sustained versus spiky demand and shared versus isolated resources.

Estimate at expected demand and a plausible growth or spike scenario when scale affects the choice. Explain any chosen multiplier. Count retries and hot-path operations where they materially change the estimate. Keep detailed provider pricing and primitive comparisons in the infrastructure review. State the evidence or threshold that would change the recommendation.

### 6. Migration and reversibility

Describe how the design can be introduced, rolled back, repaired, or replaced. Check data and contract compatibility, cutover ownership, rebuild needs, and irreversible steps. Temporary parallel paths need a clear authority and removal condition. Identify the smallest useful change that can be extended safely, and the decisions that would be expensive to undo.

## Calibration example

A proposal puts online inference and a nightly artifact rebuild behind the same worker service. Separation may be justified if measured batch contention violates the serving latency budget. A bounded scheduler or concurrency limit may be sufficient if existing capacity can meet both contracts. Compare the alternatives using demand, resource contention, freshness requirements, operating effort, and cutover cost. Specify model/artifact version compatibility and rollback behavior. Request missing contention evidence through software performance verification; assess model quality through ML evaluation. The architecture recommendation depends on those constraints and evidence.

## Recommendation and decision record

Lead with **Implement as written / Implement with changes / Fix design first**, scoped to the available evidence. For each consequential finding, provide **Pass / Needs Work / Blocker**, its evidence and consequence, and the smallest concrete fix. Give up to three required changes and the biggest remaining risk; do not invent findings to fill the count.

Include a compact record of the design reviewed, recommendation, accepted or rejected decisions with reasons, unresolved assumptions, and evidence or follow-up needed. Label recommendations as proposals until an authorized decision is made. Revisit settled decisions when constraints or evidence change.

Deliver the review in chat unless a saved report is requested or required by an established project convention. Follow the project's existing decision-record format when one exists. Accepted spec changes can use `$plan-maintain-work-spec`; software evidence requests can use `$eval-design-proof-gates` when available. Otherwise describe the owning task directly. ML evaluation and planning retain their separate responsibilities.
