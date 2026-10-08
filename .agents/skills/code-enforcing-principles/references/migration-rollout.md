# Migration & Rollout

Use when a change affects deployed versions, persisted shapes, flags, backfills, or rollback. Record relevant decisions in the existing specification and verification plan.

## Coexistence

Use **Expand → Migrate → Contract** when old consumers or persisted formats must continue to work:

- Expand: the new shape works while the old shape still works.
- Migrate: move producers, consumers, or data gradually, validating results.
- Contract: remove the old path only after the compatibility window and supporting evidence.

Never rely on immediate consumer/client adoption. Check the four producer/consumer combinations: old→old, old→new, new→old, new→new. Identify unsupported cells explicitly and show how rollout prevents them. Name version constraints, compatibility evidence, and the removal condition.

## Feature Flags

Name the flag, default, owning component, scope, success metric, kill behavior, removal trigger, and checks for both states. Temporary rollout flags must not become permanent alternate implementations. A durable product mode must be an explicit requirement with an owner and contract.

## Backfills

State batch size, checkpoint/resume behavior, idempotency, dry-run, validation query, abort criteria, rate limit, and rollback or compensating action. Name any irreversible step and bound its blast radius. Confirm the actual constraint or transaction that prevents duplicate effects; application-level intent alone is insufficient.

Example: add a nullable field while consumers still accept the old shape; migrate rows in bounded batches with persisted checkpoints; compare expected and written records; stop on a defined mismatch or service-health condition; remove the old reader only after evidence that affected consumers have migrated. Source batch sizes and thresholds from the change's operating constraints.

## Deployment & Recovery

An ordinary direct deploy with redeploy rollback is sufficient only when there is no contract or persisted-shape change, coexistence, remote-behavior change, security change, hot-path uncertainty, or version skew, and no data cleanup is needed. Otherwise describe the appropriate validation, staging/canary, and recovery path under repository policy.

Account for flags, caches, queued work, generated artifacts, and deployed consumers in rollback. Where rollback cannot restore prior state, name the compensating action and the point beyond which recovery differs. Observe the rollout with signals tied to the failure boundary; do not infer compatibility from deployment success.
