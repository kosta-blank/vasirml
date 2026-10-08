---
name: plan-maintain-work-spec
description: Create or maintain a living work specification when goals, scope, requirements, decisions, acceptance criteria, or progress must survive across sessions. Supports POC architecture and documentation, runnable application POCs and their foundations, and substantial ongoing work. Separate from project scheduling, implementation, and detailed ML evaluation.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Living work specification

Preserve the context needed to decide and continue work: the intended outcome, requirements, scope, constraints, decisions, current state, acceptance criteria, and what the evidence establishes. Keep active work detailed enough for another contributor to proceed without the author's conversation history. Keep summaries and completed history compact.

## Identify the deliverable, then choose the depth

A POC's purpose determines its specification. A small architecture POC can need substantial design reasoning; a small application POC can need only a brief specification. Choose the deliverable separately from document length.

| Deliverable | What the spec describes | Acceptance concerns |
| --- | --- | --- |
| POC architecture and documentation | What the proposed POC should demonstrate, its system boundaries, components, data or control flow, interfaces, alternatives, and unresolved assumptions. | The design answers the stated question and gives an implementer sufficient direction. Distinguish reviewed design from behavior requiring implementation evidence. |
| Application POC and foundation | The actual application flow, minimum runnable slice, supporting systems, operating environment, and the foundation intended for reuse. | The flow works under stated conditions, with appropriate software evidence. Identify simulations, external dependencies, and limits on broader readiness. |

Use both when the request spans design and implementation. Identify the architectural decision and executable result separately, link their requirements, and track their acceptance independently. Do not silently expand a documentation request into building or deploying an application.

Use a **brief spec** for bounded work with few consequential decisions: purpose, deliverable, scope, acceptance checks, material assumptions, and next action. Use a **fuller living spec** when several contributors, interfaces, dependencies, risks, or sessions make durable detail useful. Existing product or engineering work uses the same guidance; it need not be labeled a POC.

For creation or a substantial restructure, read the relevant format and deliverable guidance in [spec formats](references/spec-formats.md). For a small update, preserve the established format and change only what is affected. Add depth where an implementer or decision-maker would otherwise need to guess.

## Ownership and portability

- Use the user's existing document, repository, wiki, or agreed destination. If none exists and a saved artifact is requested, choose a descriptive location consistent with the project. No fixed path, folder prefix, mandatory file pairing, model tier, or commit cadence applies.
- The spec owns task requirements, scope, contracts, decisions, acceptance criteria, and current state. A project milestone plan owns cross-team decomposition, assignments, capacity, estimates, dependencies, sequencing, and forecasts. Cite that plan and record supplied constraints; keep task-local execution detail here without reproducing the coordination plan. Work without a separate plan remains supported.
- Software verification owns the design and execution of checks. When a verification plan exists, cite its checks and results; it owns their mechanics and reported state. Preserve observed evidence and flag contradictions instead of silently choosing a convenient status. A brief spec can carry its own acceptance checks without requiring a companion skill or file.
- Dedicated ML evaluation owns metric selection, evaluation methods, model and data validity, retrieval quality, and online experiments. Carry supplied criteria and results with provenance, conditions, limits, and unresolved questions. Record evaluation as a dependency when needed. Working software alone establishes no ML quality conclusion.
- Follow applicable project instructions and session authorization. Record an approval or required human acceptance only when it exists; a saved spec grants no additional execution permission. Use available specialist workflows when the task warrants them, without making their invocation a prerequisite to maintaining this document.

## Durable conventions

Include the conventions that matter in the resulting document so future editors can preserve it without loading this skill. A brief spec may need only a short note; a shared spec can use a conventions block.

- **Requests remain traceable.** Preserve separate items from multi-item intake before synthesizing them. Record their wording or a faithful summary, disposition, destination, and reason for merging, deferring, excluding, or leaving a question open. Use a list or coverage table as complexity warrants. Requests express requirements or intent, not observed facts.
- **Separate evidence from judgment.** Source consequential factual claims, using file and line, commit, command, report, or other precise reference where available. Mark unsourced claims as unverified or assumptions. Distinguish inference from evidence and plans from established behavior. Important inferences include what would disprove them. Existing truth labels and source IDs can serve this purpose; a new annotation grammar is optional.
- **Keep one authoritative copy.** State each testable contract once and reference it elsewhere. Cite applicable project policies instead of copying them into local contracts. Clearly identify where authoritative milestone, verification, and ML evaluation records live.
- **Preserve stable references.** Keep existing IDs and links valid. When replacing a referenced decision, requirement, or section, retain a replacement pointer. New IDs are useful when cross-document references need them; a prescribed milestone namespace is unnecessary. Resolve ambiguous references before making consequential changes.
- **Synchronize summaries.** Update the overview, current-work summary, milestone references, and evidence summary together when their underlying state changes. Summaries point to detailed records; they do not independently redefine scope, decisions, or check results.
- **Evidence must survive.** Record important artifacts with a concise summary of the result, conditions, limitations, and how to regenerate or recover it. Temporary paths can expire. Preserve the important figures and outcome in the spec while linking full reports where appropriate. Plans for evidence remain visibly pending.
- **Protect concurrent decisions.** Re-read immediately before editing, incorporate intervening changes, and preserve other contributors' recorded decisions. Accepted decisions remain binding until explicitly revised with rationale; newly discovered contradictions belong in open questions.
- **Keep history useful.** Retain important decisions, rationale, alternatives, consequences, and reversal conditions. Move resolved questions and superseded detail into linked history as needed. Keep next actions and recent changes short; archive volume should not displace the active work.

## Lifecycle and update workflow

Create the spec when durable context is needed. Before implementation, record the intended outcome, scope, acceptance criteria, and biggest material uncertainty. Before substantial continuation work, load the current spec and the authoritative records it cites.

1. Re-read the latest document and ingest the new requests, decisions, changes, or evidence. Preserve intake coverage before combining requirements.
2. Identify the current deliverable or milestone, its state, blockers, next useful check or decision, and the condition for moving forward. Use the project's status vocabulary; simple descriptive states work when no vocabulary exists.
3. Update affected requirements, decisions, assumptions, and active work. Keep architecture proposals distinct from implemented behavior. Preserve enough intent, interfaces, constraints, and acceptance detail for the next contributor.
4. Synchronize affected summaries and links. Record material changes briefly and retain the evidence summary. If an existing structure obscures the current work, reorganize only what improves clarity while preserving referenced content and history.
5. When work is blocked or deliberately paused, name the reason and resume condition. Mark it complete only against its stated deliverable and acceptance criteria, with evidence and any required acceptance recorded. Link a commit or release when relevant; completion does not require either by default.

## Human read

Open with a short paragraph explaining the concrete outcome, why it matters at the next level, the current focus, next check, material risk, and any decision needed. Use only the fields that help this reader. An architecture spec names the design decision; an application spec names the behavior being demonstrated.

For example: "We are defining an incident-console POC so the team can decide whether a shared incident view could reduce uncertainty during live response. The current focus is event ingestion and deduplication. Next we will review how delayed events affect the displayed state. The main risk is showing stale information as current; the decision needed is which source controls incident status."

Keep this paragraph consistent with the detailed records. Connect completed work to the outcome it enabled, rather than listing implementation activity alone.

## Conformance check

Review before saving; do not add a self-awarded health scorecard.

- Does the document identify the actual deliverable, appropriate depth, outcome, boundary, and observable acceptance?
- Can a new contributor continue the active work without reconstructing missing decisions or guessing which requirements apply?
- Are requests covered, consequential claims sourced or qualified, and unresolved contradictions visible?
- Do contracts, decisions, milestone references, and check results have clear authoritative sources and consistent summaries?
- Do evidence summaries retain meaningful results and limits, with architecture review, software behavior, ML evaluation, and required human acceptance distinguished?

## Result

Return the spec location or updated content, what changed, the current focus and status, unresolved blockers or decisions, and the recommended next action. Mention linked planning or evidence records when they matter. Report completion only within the stated deliverable's scope.
