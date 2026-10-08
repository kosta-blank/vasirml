---
name: handoff-final-quality-gate
description: Independent evidence audit before substantial engineering work is declared complete, a milestone closes, or a release is handed off. Checks outcome proof, required reviews, documentation, acceptance, and remaining work; consumes existing evaluation results rather than designing or running evaluations.
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Final Quality Gate — Evidence-First Handoff

Prevent false completion: the next engineer or reviewer should be able to verify the promised outcome from the requirements, change records, proof artifacts, and review reports without trusting the author's account. This gate audits the evidence; execution and repair belong to the work's owners.

**The verdict is a recommendation.** The caller triages findings and owns completion records and release actions. An authorized human owns subjective acceptance and risk acceptance. This audit grants no deployment or release permission.

**Boundary.** Use for substantial engineering closure or final handoff, with rigor matched to the agreed scope. It does not create plans, assign milestones, design gates, or rerun tests. For work containing ML components, consume required specialist reports without judging model validity, choosing metrics, assessing retrieval quality, or designing online experiments. Those remain with the dedicated ML evaluation workflow; software proof alone cannot establish ML readiness.

## Isolation & Inputs

- Use a reviewer with clean context, separate from the authoring context, through the project's available delegation mechanism. No assumed model or vendor routing. Re-derive conclusions from artifacts; do not inherit the author's scratchpad, conclusions, or trajectory. If that isolation cannot be established, report BLOCKED.
- Receive the exact work boundary, change records or diff, approved requirements and acceptance contract, required review reports, and recorded decisions. A work spec and eval plan serve these roles where used; equivalent project records are sufficient.
- Discover read-only. Write only the audit report in the agreed report directory; use `tmp/<datetime>__<feature-slug>__final-quality-gate/report.md` when the project has no convention. Do not repair product, tests, docs, planning records, or gate states. No destructive operations or credential guessing.
- Missing material evidence is Unknown, with the dependency named. Never invent results, touchpoints, or approvals.

## Evidence & Closure Rules

1. **Evidence beats confidence.** Cite evidence for every check and material claim. Distinguish FACT (artifact-backed), INFERENCE (derived from named facts), and ASSUMPTION (presumed). An assumption presented as fact blocks completion.
2. **Fresh means the state being handed off.** Run artifacts identify source/build revision, timestamp, and relevant environment/configuration; include content identity for uncommitted changes or when git is unavailable. Proof must postdate the last relevant surface change. Capture exact commands, raw output, and comparison with the approved verdict. Static inspection cannot establish that a test or benchmark ran. Apply this rule to supporting review evidence too.
3. **One closure rule.** A NO-SHIP review, P0/P1 finding, failed required gate, or unaccepted remaining item stays blocking until repaired and verified, disproven by concrete evidence, or covered by recorded human risk acceptance. Behavioral repairs show the original fault is guarded through captured red followed by green or the required mutation/potency record; documentation repairs cite the corrected artifact. The caller may dismiss a non-blocking finding with a reason; it cannot reject a blocker by opinion or silently reduce its severity.
4. **Exceptions remain visible.** Risk acceptance names the finding or deferred scope, consequences, mitigations, closure gate, and authorized human decision. It must comply with binding project policy; the auditor cannot waive a non-waivable requirement. Accepted risk is not proof that a failed gate passed. Record an accepted exception or approved scope change separately from measured results.
5. **Required evidence remains required.** A required review that has not run is BLOCKED; name it rather than substitute this audit. Subjective acceptance requires a recorded human decision, never an automated PASS. Any removal of a requirement needs an approved scope or acceptance-contract change; a waiver needs its reason and decision authority. Missing evidence cannot become an objective green through risk acceptance.

## The Checks

Use one evidence table; apply the rules above throughout. Mark a check not applicable only with a scope-based reason.

1. **Scope & custody.** Changes match the approved boundary and decisions; parallel work is protected and repository operations respect local policy. Use project change records to establish ownership, with git diff/status as supporting evidence where appropriate. Neither alone establishes authorship in a shared tree. Unapproved scope or product decisions block completion.
2. **Gate coverage & state.** Every required outcome has a resolved gate: objectively proven, human-accepted, or explicitly waived under the closure rules. Preserve actual failure and blocked states. Check the acceptance contract's potency requirements, hostile cases, nearby non-regression, and known instrument blind spots; omissions need a recorded reason or exception. Do not create a new gate schema or silently weaken thresholds.
3. **Terminal outcome.** Trace actor → entrypoint → payload/context → terminal state and inspect the terminal artifact: API response, persisted record, rendered interaction, packet, or operational metric. Implementation tests alone do not prove this outcome. Use the contract's target environment, device, viewport, and workload; no universal game capture size or desktop substitute for a required mobile path.
4. **Required reviews.** Establish which reviews the project and material risks require. Substantive software work normally needs code review; test quality, security, developer experience, and ML evaluation reviews apply to their respective risks. Use available qualified reviewers or skills, without assuming particular installed names. Consume their scope, verdicts, release conditions, and material findings, including weak value-path guards, unsafe fakes, stale proof, and CI pollution. All required reports must exist and their blockers follow the closure rules. Do not repeat their audits.
5. **Docs & context.** Relevant requirements, gate records, completion status, evidence links, README, local agent guidance, and file headers reflect the changed behavior, or are explicitly checked as needing no update. Check project-required mirrors and commit records where used; do not demand duplicate planning documents or source-specific projections.
6. **Repo shape & commands.** New durable files have a clear maintained purpose; temporary proof follows the project's artifact convention. One-off harnesses do not become unexplained durable tooling. Package scripts remain useful developer/CI interfaces rather than task-specific proof logs. Report cleanup needs to the owner.
7. **Remaining work.** Empty, or each item precisely scoped with a closure gate and recorded human acceptance of deferral. Vague labels such as "polish," "QA," "edge cases," or "minor" do not define a deferral. Accepted scope reductions stay visible in the completion claim.
8. **Postmortem.** Check whether project policy requires one and whether it exists. A substantial multi-hypothesis diagnosis with ruled-out causes, misleading symptoms, or cross-boundary evidence may justify retaining knowledge the diff cannot explain; routine work does not automatically owe a postmortem. Record not-owed when applicable; a required missing document is a blocker.

## Verdicts

- **PASS — ready for the declared handoff.** Required checks are resolved under the closure rules. Explicitly qualify PASS when accepted exceptions remain; report the top 1–3 residual risks or None. Use SHIP only for a release-readiness scope; use REVIEW-READY for a review handoff.
- **FAIL — repair required.** A blocking issue is repairable within the approved work boundary.
- **BLOCKED — dependency or decision required.** Missing required proof, review, acceptance, environment, credential, or product decision prevents a verdict. Name the dependency and who acts next. If repairs also exist, retain them in the report.

## Report Artifact

Keep one substantive report, in any clear shape:

- Verdict, declared scope, one-line reason, and any accepted exceptions.
- One per-check status/evidence table, including each consumed review's scope and verdict and any missing required review.
- One prioritized findings list with blocker status, severity, evidence, cost of inaction, fix effort when useful, smallest concrete closure, and the exact artifact/evaluation/acceptance that demonstrates closure. Use the project's severity definitions; otherwise P0 = release-critical, P1 = material correctness or integrity gap, P2 = lower-risk improvement. Do not pad tiers or duplicate findings across tables.
- Provenance: audit timestamp, source/build identity, environment, inputs, and evidence links under the freshness rule.

FAIL/BLOCKED reports include enough raw blocker detail for the next person to act without hidden context. PASS reports stay compact and cite the proof. Do not create a separate self-scored checklist.

## Skill Result

Return a short summary: verdict and scope qualification, report path, blocker count and titles (including missing reviews), accepted exceptions and remaining-work/subjective-acceptance state, and one next action with its owner. Refer to the report for detailed evidence and review findings.
