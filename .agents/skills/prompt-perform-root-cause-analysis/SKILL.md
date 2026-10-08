---
name: prompt-perform-root-cause-analysis
description: Analyze consequential or recurring engineering failures and difficult investigations to identify causes and proportionate prevention. Use after significant regressions or incidents, or for an explicit root-cause request. Routine bug fixes do not require a full analysis.
---

# Learn from difficult failures

## Scope and approach

Explain how the failure arose and which defenses could reduce recurrence. Analyze resolved failures or unresolved investigations; state the fix status and keep unproven mechanisms provisional.

Use a systems reliability lens: map evidence to causal chains, distinguish the technical mechanism from contributing conditions and systemic pressures, and ask what made the actions reasonable with the information available at the time. Use control, constraint, and feedback reasoning from STAMP/STPA where useful. Ask which defense could have caught the failure even if someone made the same local mistake.

Bug fixing owns remediation; software verification establishes behavior. Incident postmortems retain timelines and incident knowledge when needed. This analysis can supply findings and proposed actions without requiring an incident document for every bug. Planning owns scope, assignments, and milestones. For ML failures, use supplied evaluation evidence and identify engineering contributors; leave metric selection, model validity, retrieval quality, and online experiments to ML evaluation. Software checks do not establish model quality.

## Inputs

Use available artifacts; accept unknowns rather than requiring a completed form:

- Observed and expected behavior, impact, timeline, and reproduction steps.
- Logs, stack traces, tests, CI output, metrics, alerts, and relevant environment or runtime versions.
- Fix diff or exact change summary, verification results, and unresolved symptoms; a fix may be absent or partial.
- Relevant instructions or prompt excerpts when an agent contributed, plus known time, performance, compatibility, and ownership constraints.

## Evidence standards

Anchor each causal claim to an artifact, or label it as inference and give a falsification plan. Confidence labels alone are insufficient. Keep observed facts, hypotheses, and recommendations distinct; a passing check or successful patch does not by itself prove the causal account.

Challenge hindsight bias with plausible competing explanations and the fastest discriminating checks. Do not invent alternatives, causes, or organizational pressures to fill quotas. A primary mechanism can be established while broader contributors remain unknown.

## Analysis output

Adapt the depth to impact, recurrence, and evidence. Use the following structure where helpful; combine short sections and omit unsupported categories. Keep evidence and hypotheses in one place, and avoid repeating the report in a final summary.

### Findings

Lead with the mechanism in one or two sentences: trigger, violated invariant or assumption, and symptom. State what remains uncertain, then identify the most useful prevention action or next evidence check. An unresolved investigation should lead with what the evidence establishes and what would distinguish the remaining explanations.

### Evidence and competing explanations

Link artifacts to what they show. For each material assumption or competing explanation, record why it is plausible, evidence against it or still missing, and the fastest discriminating test. Prioritize missing evidence by its ability to change a decision. Explain when the available evidence rules out alternatives instead of manufacturing more.

### Causes and failed defenses

Give each finding a stable ID and reusable failure-pattern label, such as an implicit invariant, hidden coupling, ambiguous contract, or inconsistent error handling. For each finding, include its evidence anchor or inference and falsification plan, its failed or missing defense, and a counterfactual explaining where a proposed defense would interrupt the causal chain.

Distinguish engineering, design, or process contributors from systemic drivers such as ownership gaps, delivery pressures, or fragmented knowledge. Tie a systemic driver to a specific contributor, explain the pressure and how it manifested here, and propose a concrete counter-pressure. Avoid attributing motives or inevitability without evidence.

When an agent contributed, examine instruction conflicts, context limits, incentives, and tooling gaps on the same evidence terms. Include supported contributors or clearly testable hypotheses; agent involvement alone does not establish an agent-policy defect.

### Prevention and follow-up

Choose actions with benefits justified by the failure and their cost. Map each to a cause ID, or to an unresolved hypothesis when the action gathers evidence:

| Action | Prevent / Detect / Mitigate / Investigate | Finding ID | Accountable human owner or role | Priority / effort | Verification and completion criterion | Expected benefit |
| --- | --- | --- | --- | --- | --- | --- |

Use supplied owners; otherwise label proposed roles and unresolved ownership. CI, monitoring, and agents can execute checks but do not replace accountable human ownership. Mark actions and checks as proposed, completed, or unverified according to available evidence.

For a material, reproducible software defect, prefer a regression test demonstrated to fail before the fix and pass after it when feasible. If reproduction is unsafe or unavailable, propose the best available check and state its limits. Consider types, schemas, static rules, runtime invariants, API contracts, code seams, review checks, monitoring, or release gates when they address an exposed risk. Do not require an extra defense solely to meet a minimum. Aim for layered risk reduction; avoid promises that recurrence is impossible.

### Conditional agent policy changes

Propose a policy change only when evidence supports an agent contribution and the rule addresses it. A suspected contribution remains an investigation item until supported. Reuse an existing rule where possible and avoid duplicating the prevention plan.

For each justified rule, specify its concrete trigger, required behavior, mapped cause ID, compliance evidence, and an escape hatch with compensating proof. Keep rules limited to the relevant failure pattern. Analysis recommends changes; implementing fixes, checks, or policy edits depends on the requested scope.
