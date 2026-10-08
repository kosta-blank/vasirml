---
name: security-auditing-code
description: Static security review of backend APIs, privileged or economic mutations, and ML services. Trace exploit paths through authorization, trust boundaries, state transitions, retries, and storage controls; report evidence, coverage limits, and concrete fixes. Use for a requested security audit or a material security risk requiring focused review. Model quality and experimental validity belong to ML evaluation.
allowed-tools: Read, Grep, Glob, Write
---

# Security review

Review supplied code, schemas, policies, and configuration for exploitable failures. Prioritize handwritten routes, serializers, workers, mutations, and enforcement boundaries; inspect generated code when it carries security semantics. Include adjacent migrations, OpenAPI, middleware, IaC, gateway settings, feature flags, repair scripts, and runbooks when they materially affect the audited scope.

The useful result is an evidence-backed account of how a system can be abused, the controls that actually close those paths, and the smallest independently shippable fixes. Focus on privileged state, sensitive data, and business invariants rather than generic issue lists.

## Scope, independence, and report artifact

- Establish the audited surface and supplied materials. For a partial or large repository, follow the highest-risk flows first and state what was examined and what remains uncovered. Ordinary implementation work does not automatically require this audit at every milestone.
- Derive conclusions from artifacts. Author explanations can identify hypotheses or missing context, but cannot substitute for observed controls. If independent review is requested or available, give the reviewer the scope and relevant artifacts; disclose a material isolation limitation without treating author context itself as a vulnerability.
- Keep audited source, schema, policy, configuration, and tests read-only. `Write` is permitted only to create or update the audit report, not to implement remediation. Do not rewrite code or emit implementation patches.
- Return the report in chat unless an artifact is requested or needed by an established review workflow. Use its agreed destination; otherwise use `tmp/<datetime>__<slug>__security-audit/report.md`. A saved report is evidence of review, not proof that a deployed system is secure.
- Release recommendations support the designated decision-maker. A final handoff skill may consume the report when that workflow is in use; neither it nor an author's root policy is required to complete this review. Apply project policies only when supplied and applicable to the actual task.

## Evidence and uncertainty

Label material claims:

- **FACT**: directly supported by observed code, configuration, schema, documentation, or supplied results. Distinguish a documented claim from implementation evidence.
- **INFERENCE**: an exploit consequence derived from those facts.
- **ASSUMPTION**: a prerequisite or behavior not established by the materials.
- **UNKNOWN**: a relevant control or artifact that was not observed.

For each important control, name its provenance: `app`, `middleware`, `schema`, `gateway`, `infra`, or `unknown`. Cite the file/symbol and enforcement boundary; document a policy claim separately when its implementation is unobserved.

“Not observed” does not mean “absent.” Do not lower the severity of a supported exploit because a hypothetical control might exist elsewhere; only an observed control at the correct boundary may lower it. Keep severity and confidence separate. Missing evidence alone does not prove an exploit or establish release readiness.

This is a static review. Inspect tests and supplied execution results where relevant, but do not run code, scanners, tests, traffic replay, DAST, or live probes under this skill. Never imply that inspecting a test proves it passed. Quote evidence snippets of at most ten lines when helpful; avoid large code blocks and proof-of-concept code.

Work under explicit assumptions first. Ask up to three targeted validators at the end only when answers would materially change severity or remediation order.

## Threat model and domain modes

Assume reachable routes will be discovered, client fields can be tampered with, and retries, timeouts, parallel requests, duplicate deliveries, dead-letter replays, and repair jobs are normal. Frontend validation, hidden URLs, and “internal-only” comments are not authorization controls. Logs, WAFs, rate limits, and manual response cannot repair a broken mutation invariant.

Always inspect the core enforcement boundaries. Activate only modes materially present in the scope and name them in the coverage statement.

### Economic assets

Use for payments, pricing, refunds, wallets, inventory, rewards, credits, or entitlements.

- Require conservation, authoritative provenance, and reconciliation appropriate to the asset. Distinguish grant, spend, refund, reversal, mint, and burn from generic signed mutations.
- Inspect sign, zero, fractional values, bounds, overflow/underflow, precision, units, NaN, and resulting balances or counts. Identify legitimate debt or negative-balance rules explicitly.
- Trace server-derived price, tax, discount, conversion, reward, entitlement, and target account. Ensure discrete inventory has bounded counts and atomic grant/spend; boolean or time-bound entitlements need explicit grant/revoke and claim-once semantics.
- Check refund/capture binding and amount bounds, privileged auditable repair/reversal paths, and closure evidence for duplicate, concurrent, out-of-order, cross-account, retry, and repair cases.

### Event-driven integrations

Use for webhooks, queues, workers, cron, partner APIs, callbacks, outbox/inbox, compensation, or replay jobs.

- Identify delivery semantics, operation identity, parameter binding, dedupe scope/window, ordering key, retry owner, and timeout/deadline owner. State these contracts directly; a sibling principles skill is optional context.
- Check webhook authenticity before side effects, including signature validation, replay limits, and whether the verified payload is the one used for execution.
- Follow duplicate publication, consumer redelivery, timeout/500 after a committed effect, external effects, compensation, and manual/DLQ replay. Inspect status lookup and reconciliation for indeterminate outcomes.
- Do not accept “exactly once” as a prose guarantee. Show the storage and consumer controls that make repeated operations safe.

### Multi-tenant authorization

Use for organizations, workspaces, projects, sharing, invitations, roles, delegated access, or support/admin impersonation.

- Trace `subject -> action -> object -> field`; inspect object, property, and function authorization.
- Follow tenant lineage through nested and shared resources, invitations, query filters, caches, and asynchronous actors. A role check alone does not establish object ownership or tenant isolation.
- Inspect DTO binding, PATCH/update helpers, spreads/merges, serializers, and ORM writes for attacker-controlled owner, tenant, role, or permission fields.
- Require explicit, narrow, auditable impersonation and repair privileges. Check whether cached policy or a stale query scope can silently widen access.

### ML services and agent tools

Use for training/data pipelines, retrieval, inference endpoints, model-serving infrastructure, or agents with data access and tools.

- Trace who can read datasets, indexes, prompts, retrieved content, model artifacts, outputs, and logs. Check tenant/record permissions at retrieval, caching, output, export, and asynchronous processing boundaries; do not assume upstream filtering survives every path.
- Treat prompts, retrieved documents, external content, and model outputs as untrusted inputs. Inspect whether they can select privileged actions, redirect tool arguments, trigger network/file/code access, or expose credentials. Permissions, actor binding, validation, and any required human approval must be enforced outside model-generated text.
- Inspect credential scope and storage, secret/PII redaction, egress and SSRF controls, artifact provenance, and unsafe loading or deserialization. Distinguish a named provenance check from evidence that it is enforced.
- Inspect inference and training resource abuse: caller identity, quotas, payload/context/batch limits, timeout/cancellation, concurrency, and accounting. Rate limits address resource abuse; they do not close authorization or data-access failures.
- Describe security consequences at these boundaries. Model quality, metric selection, dataset representativeness, retrieval relevance, general robustness scoring, and experimental validity remain with ML evaluation. This skill may recommend targeted security closure checks without designing that evaluation program.

### Gameplay and realtime authority

For gameplay-derived value, results, progression, sockets, prediction, reconnect, or resync, read [Game authority security checks](references/game-authority.md). Apply it only to that scope; a deterministic game kernel is not a prerequisite for a general backend or ML service audit.

## Audit method

Follow a sensitive operation from reachable input to terminal effect. Start with scope and entry points; use the steps below to reconstruct controls and exploitability rather than to fill a fixed set of tables.

### 1. Inventory evidence and high-risk flows

Inventory present and materially missing code, routes/OpenAPI, middleware, serializers, schema/migrations, workers, policies, infrastructure, gateway controls, and runbooks.

Enumerate reachable or privileged routes, resolvers, message handlers, callbacks, workers, cron, admin/support/debug/repair surfaces, uploads/storage, service-to-service entry points, and outbound integrations that cause internal effects. A server-reachable route discovered through the frontend is exposed to discovery.

Prioritize flows involving money, inventory, entitlements, permissions, sensitive data, uploads/presigned URLs, cross-account/tenant operations, and external or asynchronous side effects. Search by domain symbols as well as common route, policy, mutation, replay, storage, and configuration terms. A quick search with no matches is not evidence of safety.

### 2. Reconstruct state and mutation boundaries

For each material flow, identify states, allowed and forbidden transitions, terminal/cancel/reversal/repair states, repeatability limits, and asynchronous effects. Bind the actor, target, amount, resource, and other security-relevant parameters between authorization and execution. Look for skipped, repeated, out-of-order, and post-authorization changes.

Trace the entry point, actor/target, attacker-controlled and server-derived fields, authentication, authorization, validation, storage transaction/lock/CAS/constraints, operation identity and dedupe, queue/external effects, audit trail, and reconciliation/repair. Note provenance at each boundary and explicit handling of timeout-after-commit or partial failure.

Write critical invariants explicitly and locate every enforcement path, including alternative entry points and repairs. Examples include caller ownership, server-derived entitlement, bounded inventory, refunds tied to original captures, and `same(operationId, actor, paramsHash) => same outcome with no additional effects`. Identify schema enforcement and behavior on violation; happy-path checks alone are insufficient.

### 3. Hunt exploits and recurring defects

Apply the relevant domain checks. Inspect authorization, parameter pollution/mass assignment, numeric semantics, replay/token or signed-URL reuse, TOCTOU/check-then-write races, non-atomic debit/grant, unsafe repair, secret exposure, verbose errors, and insecure defaults.

Where relevant, inspect SQL/NoSQL/template/command injection, path traversal, unsafe parsing/deserialization, SSRF, uploads/storage access, and unsafe trust of partner responses or webhook data. Cover both read access and mutation consequences.

Compose the smallest plausible exploit chain from observed weaknesses. State actor capability, entry point, controlled fields, prerequisites, failed boundary, resulting effect, and blast radius. Label unobserved prerequisites as assumptions; do not invent additional weaknesses to make a chain work.

If a defect appears, inspect sibling paths using the same concept, helper, serializer, policy, or replay mechanism. Report recurrence and fix boundaries rather than only the first local example.

### 4. Assess containment, closure, and coverage

Assess self-only, cross-account, cross-tenant, or systemic impact; abuse speed; quotas/clamps; detection delay; kill switches/deny rules; auditability; reconciliation; and safe recovery. Containment reduces harm but does not substitute for invariant enforcement.

For each supported finding, identify the smallest fix at the policy, validation, state, storage, or asynchronous boundary and evidence that would demonstrate closure. Tests, constraints, consumer/dedupe evidence, reconciliation, alerts, or rollout controls serve different purposes; logs and alerts alone cannot prove a broken authorization or mutation path is fixed.

Cross-check relevant authentication, authorization, state, replay/concurrency, storage, sensitive data/configuration, injection, integration, audit, and recovery areas. Use relevant OWASP/API/business-logic guidance as a sanity check. Report actual coverage, evidence gaps, and what evidence would change the assessment.

## Severity and release recommendations

- **Critical**: a supported direct path to catastrophic impact, such as arbitrary cross-tenant effects, account takeover, unauthorized high-impact value/privilege mutation, or secrets enabling a serious pivot.
- **High**: a meaningful exploitable authorization, ownership, replay, race, unsafe privileged-surface, or sensitive-data failure.
- **Medium**: a weakness requiring additional conditions, missing defense on a sensitive path, or an audit/recovery gap that materially worsens response.
- **Low**: limited standalone exploitability.
- **Info**: a hardening observation or evidence gap without an established exploit.

Confidence is **High** when the relevant boundary and exploit prerequisites are directly observed, **Medium** when a plausible path depends on an unobserved detail, and **Low** when materially assumption-sensitive. Do not substitute grades or confidence for impact analysis.

When a release recommendation is requested, use:

- **NO-SHIP** for an observed material path to unauthorized sensitive data access, account/tenant escape, untrusted control of privileged mutations, duplicate sensitive effects, value/privilege without authoritative provenance, or catastrophic exposure of a privileged surface. An observed end-to-end control may close the path; obscurity, logging, generic rate limits, and hypothetical controls do not.
- **INSUFFICIENT EVIDENCE** when release-relevant boundaries cannot be assessed from the materials. Explain what is needed; a missing artifact alone is not a proven vulnerability.
- **SHIP for audited scope** only when coverage supports that limited recommendation and no unresolved blocker is observed. State residual risk and unexamined surfaces. A static review cannot certify whole-system security.

## Report

Keep one concise account of each finding; add a state, mutation, authorization, or provenance table only when it helps explain a material risk.

1. **Assessment and scope:** summarize the security conclusion, audited materials and surfaces, active modes, important assumptions, coverage limits, and release recommendation when requested.
2. **Supported findings:** order by real risk. For each give severity/confidence, evidence and control provenance, exploit prerequisites and steps, consequence/blast radius, root cause or broken invariant, the smallest fix, and concrete closure evidence. Briefly compare inaction cost with fix effort, runtime overhead, and migration/rollout risk when it changes prioritization. Report zero findings when warranted; never invent or pad findings to reach a count.
3. **Evidence gaps:** distinguish missing artifacts, unobserved controls, and assumption-sensitive conclusions. Name what would change the assessment. Include up to three material assumption validators if needed.
4. **Plan of action:** include only supported work: `P0` for exploit closure/containment, `P1` for structural recurrence prevention, and `P2` for detection/reconciliation/repairability or lower-priority hardening. Give scope, success evidence, and effort when estimable; do not manufacture owners, estimates, or filled tiers. For a blocker, close the exploit, enforce the invariant across paths and storage, then establish closure checks and needed detection/recovery. Do not duplicate the findings in a second scorecard.

Use blunt, specific, evidence-driven prose. Every critique must name a concrete boundary and evidence location. Acknowledge controls only when they materially reduce exploitability or blast radius and explain how.
