---
name: plan-project-milestones
description: Turn vague or evolving ML/AI and engineering system ideas into workstreams, proposed team or person ownership, effort ranges, and milestones that converge into a working system. Use for an ML or engineering manager planning a multi-component project or replanning one with new context. Do not use for simple personal reminders, isolated coding tasks, or status reporting without a planning request.
---

# Project Milestone Planner

Help a manager answer: what work is necessary, who should own it, what evidence will show progress, how much effort it could take, and when the pieces can work together. Component completion is useful only when it enables an agreed downstream capability or reduces a consequential uncertainty.

## Establish the planning basis

Use the user's idea, roster, existing plans, evidence, and constraints. Separate known facts, assumptions, proposed decisions, and open questions. Do not silently turn an example architecture into a requirement.

Extract the intended user journey and final observable outcome; scope and non-goals; current assets and progress; team skills and effective availability; deadline constraints; and meaningful quality, latency, cost, or operational requirements.

Match the depth to the idea's maturity:

- **Unclear idea:** offer a plausible decomposition, the smallest useful system demonstration, and timeboxed investigations of the unknowns that could invalidate the plan. Give conditional effort ranges, not a detailed committed delivery schedule.
- **Defined project:** map owners, contracts, dependencies, measurable milestones, and a capacity-aware forecast.
- **Ongoing project:** reconcile the previous plan with actual evidence, preserve completed work and stable milestone IDs, and explain changes to scope, staffing, sequencing, or forecasts.

Ask a small batch of questions only when answers would materially change the plan, usually about the outcome, available people, and a hard constraint. Continue useful planning with labeled assumptions. If capacity is missing, use required roles and a staffing scenario explicitly marked as hypothetical; do not invent employees, availability, or commitments.

## Decompose work around handoffs

Trace the final outcome back through the system's inputs, transformations, outputs, and user interactions. Identify the workstreams that own useful deliverables, including necessary shared work. Treat the user's component list as a starting point: merge or split it when interfaces, specialization, workload, or independent validation justify doing so.

For each workstream, identify:

- Its responsibility and boundary: what it produces and what remains another owner's responsibility.
- One accountable person or team, plus contributors and downstream consumers. Prefer a person as lead when the roster permits; otherwise mark the role or lead assignment as pending.
- The relevant input/output contract, prerequisites, and what can start with a representative fixture or temporary test stub.
- The uncertainty most likely to change its design, effort, or usefulness.

Match assignments to supplied skills, availability, and work already owned. Flag overload and scarce specialists. A lead spanning several workstreams needs an explicit allocation, not several simultaneous full-time assignments. Team-level ownership still needs an accountable lead or a clearly pending lead decision.

Give cross-team integration an accountable owner and capacity. Include evaluation, data preparation, review, observability, and operational readiness where they matter to the actual delivery. These can be shared responsibilities rather than separate teams, but their effort is not free.

For each important handoff, make clear who produces what, who consumes it, which compatibility or failure behavior matters, and what consumer-side evidence demonstrates that the handoff works. Agree on a representative shared artifact or fixture early. Local validation alone does not establish compatibility.

When the journey requires human review, handoff, or operational acceptance, identify who performs or accepts that work within the supplied roster. If coverage is unknown, give the pending assignment a decision owner and resolution point. Do not infer coverage from the integrator's title or treat quality scoring as staffing for live review. Flag uncertain effort coverage without automatically changing accepted estimates.

## Build milestones that converge

Plan backward from the final system outcome, then bring forward an early useful end-to-end demonstration. This might use a fixed corpus, one template, or a restricted output format. Identify any temporary test stubs and when a real integration replaces them.

Use two connected levels:

1. **Shared system milestones:** capabilities demonstrated across workstreams, each with an accountable integrator, participants, prerequisites, and acceptance evidence.
2. **Owner milestones:** concrete outputs or uncertainty-reducing decisions that enable a named shared milestone or downstream consumer.

At each shared milestone, name the contribution and handoff due from every participating owner. A compact owner-by-milestone matrix can make convergence visible; a single system gate must not hide individual deliverables.

A milestone should say what becomes true, not merely what someone does. "Implement retrieval" is an activity; "the creation loop consumes retrieved candidates with stable IDs and provenance on the agreed request set" is a milestone.

For each milestone, capture enough to manage the work:

- Stable ID, demonstrated outcome, and accountable owner.
- Deliverable or decision artifact, acceptance criteria, and evidence to inspect.
- Dependencies and the shared milestone or consumer it unlocks.
- Effort range, confidence, and the assumptions or risks driving the range.

Do not schedule all integration after component development. Include producer/consumer validation and joint demos as the pieces mature, with capacity to resolve integration failures. Final acceptance should exercise a realistic user request through the complete path and relevant failure paths.

For ML and agentic work, distinguish deterministic contract correctness from uncertain output quality. Plan evaluation owners, capacity, dependencies, and acceptance evidence; leave metric selection, model validity, retrieval-quality methodology, and experiment design to the dedicated ML evaluation workflow. Reuse available baselines and evaluation sets; otherwise plan their creation. Include agreed quality, latency, and cost evidence together when they constrain usefulness. Label suggested numeric thresholds as proposed until established by the user's context; never fabricate measurements or claim an evaluation passed.

Separate research from engineering commitments. A research milestone needs a decision question, experiment or evidence, timebox, decision criteria, and a go/revise/stop outcome. Its success can be learning that an approach is unsuitable. Do not promise a model-quality improvement simply because the implementation tasks are known.

## Estimate effort and calendar time honestly

Estimate the smallest useful deliverables and aggregate non-overlapping work. State units consistently: person-days or person-weeks are labor, while calendar weeks are elapsed time. Identify the scope, reuse, experience, effective availability, and external dependencies assumed by a range.

Include the work needed to satisfy the milestone: implementation, experiments, data and evaluation preparation, review, validation, integration, and reasonable rework. State whether shared work is included in the owner ranges or listed separately; count it once. Use wider ranges or an initial discovery estimate for unvalidated research and poorly specified scope. Explain what evidence would narrow the range.

Estimate effort even for a half-baked idea when useful, but label it as an assumption-based planning range rather than a benchmark or commitment. If the idea is too underspecified for a credible total, estimate the initial shaping work and provide a conditional scope/staffing scenario for the rest.

Translate effort into elapsed time only with explicit staffing and dependencies:

- Show independent work, hard prerequisite chains, and work that can overlap after an interface is agreed.
- Respect capacity reservations and shared specialists. An owner available for half a week per week cannot complete a full person-week in one calendar week.
- Identify the likely critical path and external waits. Total labor divided by total headcount is only a theoretical lower bound, not a delivery forecast.
- Provide relative phases or a conditional elapsed-time range when a start date or availability is missing. Calendar dates require a stated scheduling basis; commitments require actual agreement.

When a deadline or staffing bottleneck drives the forecast, show a compact allocation of the constrained owners' effort across preparation, prerequisite-dependent work, and acceptance. Check it against net capacity and dependencies. If the split is unknown, distinguish the capacity bound from the provisional delivery forecast and name the allocation needed to confirm it. Label any extra elapsed buffer as an assumption and keep its work within the stated effort budget.

If a requested deadline is not credible, show the gap and a concrete tradeoff: narrower capability, more of a specific scarce role, reuse of an existing asset, a changed quality target, or additional time. Adding people only helps work that can be parallelized; show the bottleneck it actually addresses.

## Return a manager-ready plan

Lead with the proposed delivery shape, the main bottleneck or uncertainty, and the effort/forecast status. Use the planning basis, workstream and milestone fields, and forecast guidance above to present the plan. Record shared facts once and refer to them by stable IDs.

A small project may need a single table; a large team may need linked workstream and shared milestone tables. Keep each owner's contribution and the system outcome it enables visible without creating a long ticket backlog unless requested. Include unresolved choices and risks with a decision owner, latest useful resolution point, research timeboxes, and practical scope alternatives.

Make the next action concrete: the first alignment discussion, interface agreement, experiment, or owner decision that unlocks progress. Produce the plan in chat unless another destination is requested. Ownership and dates proposed in the plan do not assign real work or publish commitments.

For replanning, show the material delta and its downstream effects. Preserve completed work, stable milestone IDs, and the evidence supporting prior acceptance. When scope, contracts, or acceptance criteria change, reassess affected milestones and downstream consumers: show which conclusions remain supported and which need renewed evidence before acceptance under the changed plan. Use actual milestone evidence instead of subjective percent-complete claims. Re-estimate remaining work and explain changes to the critical path or forecast.

## Example reference

When a concrete example would help, read [the request-to-creation system example](references/creation-system-example.md). It illustrates indexing, retrieval, agent orchestration, text filling, imagery, and rendering/export with shared integration gates. Its architecture, staffing, numbers, and sequence are hypothetical; adapt the planning reasoning instead of copying them as defaults.
