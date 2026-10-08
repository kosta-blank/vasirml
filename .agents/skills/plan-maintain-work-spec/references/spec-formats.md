# Specification formats and POC guidance

Use the brief or fuller format according to the work's coordination and reasoning needs. Read the relevant POC section when selecting or expanding that deliverable. Headings, field names, and tables are suggestions; preserve established project formats and omit empty scaffolding.

## Brief spec

~~~markdown
# <Work name>
<Concrete outcome, why it matters, and current focus.>

**Deliverable:** <architecture/documentation, application POC, both, or ongoing work>
**Scope:** <included work and explicit exclusions>
**Acceptance:** <observable conditions appropriate to this deliverable>
**Current state and evidence:** <what is proposed, verified, or unresolved; source links>
**Decisions and assumptions:** <material choices, rationale, and remaining uncertainty>
**Next action:** <action, responsible person if supplied, and condition for moving forward>
~~~

Add an owner, external prerequisite, risk, or source reference where it changes the decision or ability to proceed. Use a coverage list for several user requests; a separate ledger is optional. Keep this format brief by linking existing decisions and results rather than copying them.

## Fuller living spec

### Purpose and scope

Describe the intended user, developer, or operational outcome; why it matters; deliverable type; entry point; observable success; and what the user will try next. Name a missing next step as a gap. Record explicit exclusions and the intended operating environment. Add product, design, or experience detail where it affects execution.

### Current state

Record the current focus, status, material blockers, and next action. Separate observed facts, unverified assumptions, inferences, and intended changes. Keep active context here; link older facts and history. State dependencies and supplied owners without recreating an external coordination plan.

### Requirements and contracts

Give each consequential requirement an observable meaning. A contract can use "If <condition>, then <result>; failure means <consequence>." Cluster contracts only where needed:

- Product behavior and meaningful success or failure.
- Privacy, permissions, and sensitive-data handling.
- Interface inputs, outputs, limits, error semantics, and observability.
- Data bounds, ordering, pagination, truncation, idempotency, and distinctions between empty, missing, and failed results.
- Material performance or resource budgets, with assumptions behind cost estimates.
- Retries, partial failure, degradation, rollback, and recovery.

Use relevant dimensions without imposing cost worksheets, hot-path analysis, or safety sections on every task. Keep the complete contract text here; other sections cite it.

### Active work and milestone references

When a milestone plan exists, link its authoritative milestone and record enough local detail to execute it. Otherwise describe the next useful increment locally. Size complexity, risk, performance impact, and cost only where those dimensions help; use project scales and actual assumptions rather than fixed dollar bands.

An active work packet supplies:

- The outcome enabled, actor, entry point, key flow, observable success, and expected next action.
- Design intent, affected systems and interfaces, boundaries, applicable contract references, and explicit exclusions.
- Consequential user assumptions mapped to implementation needs or verification, or an explicit defer with a resolution condition.
- Material failure modes and an appropriate path to recovery.
- Acceptance conditions, evidence or pending checks, and the next decision or execution step.

For experience-sensitive work, add the relevant reference, desired change in feel or usability, unwanted effects, and concrete rejection criteria. A general design bar does not replace details needed for the current work. Record human acceptance when the project requires it.

Collapse completed packets to the enabled outcome, evidence summary and limitations, source pointers, and any relevant commit or release. Preserve consequential decisions and referenced history.

### Evidence and acceptance

Link checks in the verification plan when one exists. A small evidence table can record criterion or check, related requirement, current result, conditions, artifact, and limitation. Pending or unimplemented checks stay visible. A check without the necessary harness or observation is a missing piece, not a pass.

Use evidence suited to the criterion. For interactive application behavior, capture the actual route and scenario when useful, including the viewport and console or network observations that affect the result. For a canvas or game criterion, show meaningful content and interaction. A startup or page-load check supports only what it observes.

### Decisions, questions, and history

Retain important decisions with rationale, alternatives, consequences, and evidence that could reverse them. Open questions state why they matter, what would resolve them, and a recommendation where supported. Keep resolved questions out of the active list while retaining their resolution. Add source indexes or appendices only when they make the document easier to maintain.

## POC architecture and documentation

Record the question the architecture should answer and the smallest proposed demonstration that could answer it. Describe components, responsibility boundaries, data or control flow, interfaces, external prerequisites, material alternatives, and why the proposed design fits the constraints. Use diagrams where they clarify these relationships.

Distinguish current system facts from proposed architecture. Identify which dependencies or assumptions have evidence and which require a spike, implementation, or external decision. Describe the operating environment and representative scenarios without claiming they already work.

Acceptance can concern a documented design: a reviewer can trace the intended flow, consequential interfaces and failure modes have definitions, important tradeoffs are explicit, and an implementer can identify the first useful slice. State the decisions resolved and the uncertainty remaining. A design review establishes only its documented conclusions; runtime feasibility remains unverified until appropriate evidence exists. Building the POC requires authorization within the request's scope.

## Application POC and foundation

Define the smallest runnable flow and the foundation it needs: entry points, supporting components, persistence or data lifecycle, interfaces, startup and configuration, and the stated operating environment. Distinguish an isolated demo, a limited pilot, and a foundation intended for later production work. Record what will be reused, replaced, or decided later rather than assuming every POC component is permanent.

Where the application uses a controlled environment or external services, specify the access and connectivity conditions that affect the demonstration: permitted users, inbound or outbound access, service dependencies, and behavior when connectivity or a service is unavailable. Apply only the boundaries relevant to the application; internet access is not a prerequisite for this mode.

Separate real integrations from mocks, fixtures, and manual setup. Acceptance exercises the claimed application behavior under stated conditions and preserves the results and limitations. Keep important failure or recovery checks proportional to the claims. Name the gap between the POC and any broader operational readiness, rather than treating a successful demo as release evidence.

For combined architecture and application work, link the implementation to the design decisions it tests. Preserve independent design-review and runtime results. Record an untested design assumption, a failed implementation check, or a pending ML evaluation as its own unresolved item so one successful result does not hide another.
