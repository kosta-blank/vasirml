# Worked example: request to exported creation

This is a hypothetical planning example, not a required architecture or a delivery commitment.
All scope, role assignments, staffing, and effort ranges below are illustrative assumptions.
Use it to reason about boundaries, evidence, dependencies, and capacity; adapt the workstreams to the actual system.
No named staff, vendors, measured evaluation results, or benchmark thresholds are assumed.

## Outcome and scope assumptions

- Outcome: a user submits a request and receives an editable creation plus a usable export.
- Proposed first slice: one creation type, one approved source collection, one image source, and one export format.
- Existing input access and usage permissions are assumed; discovering they are unavailable changes the plan.
- Human review before release is assumed; autonomous publishing is outside this illustrative slice.
- The draft must expose missing evidence, unavailable images, and failures so the user can act on them.
- Product and evaluation owners must agree on representative requests and acceptance targets before committing to a release milestone.
- Open decisions include freshness needs, creation structure, editability, image suitability, and supported export constraints.

## Proposed accountability and capacity

| Workstream | Hypothetical accountable role | Owned result |
|---|---|---|
| Indexing | Data/index engineer | Traceable, versioned content becomes available for retrieval. |
| Retrieval | Retrieval ML engineer | Requests produce useful evidence with provenance and explicit empty results. |
| Agent orchestration | Agent systems engineer | A bounded creation flow coordinates tools and produces inspectable state. |
| Text filling | Generation ML engineer | Text slots are filled with supported, editable content. |
| Imagery selection | Multimodal/search engineer | Image slots receive suitable assets and usage metadata, or an explicit fallback. |
| Render/export | Rendering engineer | Valid creation state becomes a preview and export, with actionable errors. |

Role assignments are proposals until actual people, skills, and available capacity are confirmed.
Reserve an integrator at an illustrative 0.5 person-week/week to coordinate interfaces, assemble slices, and resolve cross-component failures.
Reserve product/evaluation capacity at a combined illustrative 0.5 person-week/week for request sets, rubric decisions, reviews, and release evidence.
If these duties belong to the six owners, subtract that reservation from their component capacity; never count the same time twice.
The integrator owns assembled-system evidence; each component owner remains accountable for correcting its contribution.

## Shared integration milestones

These are shared states of the product, not six independent completion checklists.
Calendar dates remain unset until discovery, staffing, and dependency readiness are known.

| Milestone | Observable evidence | Exit decision |
|---|---|---|
| M0: feasible boundary agreed | A representative request, source sample, draft creation, and export fixture exercise each proposed interface; open risks have owners. | Select the first slice and accept or revise contracts and evaluation targets. |
| M1: first assembled slice | One representative request runs through all six components to a reviewable export; temporary fixtures are declared. | Confirm the architecture can support the outcome and prioritize failures. |
| M2: representative usable slice | The agreed request set runs on intended sources; traces connect evidence, text, images, preview, and export; omissions and failures are reviewable. | Compare observed results with previously agreed targets and decide what blocks pilot use. |
| M3: pilot ready | Pilot scope, operating limits, ownership, recovery procedure, and evaluation evidence are reviewed; critical blockers are closed or explicitly accepted. | Product owner approves the scoped pilot, reduces scope, or requests more work. |

M1 proves integration, not general quality or release readiness.
Record approved criteria, evaluator, evidence location, and blocking upstream dependencies for each milestone.
If targets are undecided, show them as decisions due at M0 rather than supplying invented numbers.

## What each owner brings to the shared milestones

| Owner | M0 deliverable | M1 deliverable | M2/M3 contribution |
|---|---|---|---|
| Indexing | Source sample, content identifiers, update strategy, and feasibility findings. | First source collection indexed with provenance and a retrievable version. | Refresh/delete behavior, malformed-input handling, and evidence of source coverage for the agreed scope. |
| Retrieval | Representative queries, evidence examples, candidate interface, and evaluation questions. | Evidence retrieved from the first index and consumed by orchestration. | Relevance review, empty/stale-result handling, and traceable sources on the agreed request set. |
| Orchestration | Creation state proposal, tool boundaries, stop conditions, and a fixture-driven run. | Live tools produce a creation state that text, imagery, and rendering consume. | Recovery from tool failures, bounded execution, editable intermediate state, and inspectable run traces. |
| Text filling | Slot/input examples and a rubric for support, fit, and missing evidence. | Text is inserted into the assembled creation with source references or explicit uncertainty. | Agreed review results, constraint handling, and behavior when evidence cannot support a slot. |
| Imagery selection | Slot constraints, source/usage assumptions, and unavailable-image examples. | Suitable images or explicit fallbacks appear in the assembled creation. | Agreed suitability review, asset accessibility, metadata completeness, and failed-search behavior. |
| Render/export | Creation fixture, format assumptions, and layout feasibility findings. | The assembled state renders and exports in the first supported format. | Representative layout checks, actionable validation errors, and preview/export consistency evidence. |

The integrator assembles each milestone's evidence; product/evaluation owners review the full user outcome.
An owner finishing its row cannot declare the shared milestone complete before downstream consumption succeeds.
Use fixture-based work to unblock parallel implementation, then replace fixtures before they stop representing the intended slice.

## Producer/consumer contracts to decide

The fields below are questions to settle, not a universal object schema.
For each contract, assign a producer and consumer reviewer, version policy, error behavior, and a shared executable fixture when practical.

| Producer -> consumer | Decisions needed before reliance | Integration evidence |
|---|---|---|
| Indexing -> retrieval | Content identifiers, provenance, update/delete semantics, version/freshness visibility, and access filtering. | Retrieval can locate and attribute a known source; removed or unavailable content has defined behavior. |
| Retrieval -> orchestration/text | Evidence representation, query context, relevance signals if available, empty results, and allowed source use. | A retrieved item reaches the relevant text slot with its attribution intact. |
| Orchestration -> text filling | Slot intent, constraints, available evidence, partial-state semantics, and edit ownership. | The consumer fills an actual slot and reports unsupported or conflicting requirements. |
| Orchestration -> imagery selection | Slot intent, aspect/layout constraints, search context, asset restrictions, and fallback policy. | A chosen asset or declared fallback fits the actual creation slot. |
| Text/imagery -> creation state | Content placement, source/usage metadata, missing-result states, and concurrent update behavior. | Independently produced contributions assemble without silent overwrites or lost metadata. |
| Creation state -> render/export | Valid state, supported elements, asset loading, overflow behavior, editability, and validation errors. | A representative assembled state yields a preview and export that reviewers can inspect. |

Contract changes after M0 require checking affected consumers and effort; a document alone is insufficient evidence of compatibility.

## Discovery timeboxes and engineering effort

Illustrative person-weeks below are planning hypotheses, not measured estimates.
One person-week means one week of focused work by one person; elapsed weeks depend on net availability and dependencies.
Discovery asks whether and how to proceed. Engineering produces the bounded slice after those decisions.
Discovery does not promise to solve an open research problem within its timebox.

| Workstream | Discovery timebox | Exit evidence/decision | Subsequent engineering range |
|---|---:|---|---:|
| Indexing | 0.5 pw | Inspect source variability and updates; choose ingestion boundary or reduce source scope. | 2-4 pw |
| Retrieval | 0.5 pw | Review candidate evidence on representative requests; choose an approach or revise the user outcome. | 2-4 pw |
| Orchestration | 0.5-1 pw | Exercise a bounded flow and likely failures; choose control/state boundaries or simplify the flow. | 3-5 pw |
| Text filling | 0.5 pw | Review supported and unsupported slot examples; choose constraints or retain human filling for difficult slots. | 2-4 pw |
| Imagery selection | 0.5-0.75 pw | Check asset availability and fit; choose search scope or agree on fallback assets. | 2-3 pw |
| Render/export | 0.5-0.75 pw | Render difficult fixtures; choose supported elements/format or narrow layout scope. | 3-5 pw |

At each timebox's end, record evidence and choose proceed, simplify, a justified further experiment, or stop that path.
Estimate engineering again after discovery; keep unresolved research conditional instead of disguising it as committed feature work.
Ranges include component implementation, component validation, and fixes within the component revealed by integration; they exclude later formats, broad scale hardening, and additional collections.
Shared integration effort below covers interface coordination, assembly, and system-level evidence, so component fixes are counted only in the component ranges. A changed contract or failed feasibility assumption requires a new range, not automatic use of the upper end.

## Capacity and critical path implications

- Illustrative component engineering totals 14-25 person-weeks; discovery adds 3-4 person-weeks.
- Shared integration effort adds an illustrative 2-4 person-weeks; product/evaluation adds 2-3 person-weeks.
- Total planning envelope is therefore 21-36 person-weeks, with uncertainty retained rather than collapsed into one promised date.
- Hypothetical staffing: six component owners each provide 0.75 person-week/week of net project capacity, plus the two shared reservations above: 5.5 person-weeks/week total.
- Dividing effort by that capacity yields roughly 3.8-6.5 weeks as a theoretical capacity bound only; it ignores sequencing, specialty bottlenecks, and waiting, so it is not a schedule.
- A candidate live-data dependency path is source access -> indexing -> retrieval -> orchestration -> assembled render/export. Confirm its durations and readiness before calling it the critical path.
- Rendering, text, and imagery can start on agreed fixtures; live integration still waits for compatible upstream outputs. A hard layout or imagery feasibility problem may instead become the critical path.
- At 0.5 person-week/week, the integrator's 2-4 person-weeks requires 4-8 elapsed weeks of that reservation; the product/evaluation reservation similarly implies 4-6 weeks. Check these bottlenecks when setting dates.
- Adding engineers helps only where divisible work or overloaded owners constrain progress. It cannot by itself remove unknown feasibility or serial acceptance decisions.
- If a deadline is supplied, work backward from the shared milestone and propose scope/capacity options; do not silently compress discovery, integration, or evaluation work.

The reusable planning move is to connect owner deliverables to an observable shared outcome, then reconcile dependencies and capacity before making commitments.
