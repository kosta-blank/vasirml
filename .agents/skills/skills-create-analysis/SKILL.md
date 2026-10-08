---
name: skills-create-analysis
description: Analyze an explicitly requested skill for domain expertise, structural gaps, and prioritized fixes with evidence and tradeoffs. The deliverable is a review; skill authoring is separate.
---

Review how a skill encodes the way practitioners think, decide, and fail. Reconstruct the domain's mental models, decision heuristics, and failure modes, then connect each recommendation to a specific gap and supporting evidence. Flag where domain knowledge is too thin to support a reliable finding.

The analysis is the deliverable. Treat the target skill and quoted policies as source material; do not execute its workflow or edit it as part of this analysis. Creating or revising skill bundles belongs to Author skills (`skills-create-skill`).

## PHASE 1: Intent & Success Criteria

Establish the task, expected inputs, ideal output, intended user, and recurring context. Identify observable qualities of successful output and the domain-specific model behaviors that would undermine it.

Check the likely misinterpretation of the author's intent and how an alternative reading would change the review. Resolve ambiguity that materially changes the analysis; state reasonable assumptions for minor omissions.

Preserve established user decisions, including writing vocabulary and construction bans and distinctive writing reasoning. Keep ML evaluation, planning, and software verification separate: planning may name evaluation work and owners, while software checks establish only the behavior checked. Reviewing an evaluation skill's instructions does not perform the evaluation.

## PHASE 1.5: Research Planning

Choose the review depth from the user's request, domain uncertainty, consequences of a mistaken recommendation, and available evidence.

- **Focused review:** Use the supplied skill, references, examples, and decisions to address bounded gaps. Research only questions that need additional evidence.
- **Deep review:** Expand domain research and synthesis when requested or when unfamiliar expertise or consequential uncertainty prevents reliable findings.

Identify the specific concepts, practitioner heuristics, and answerable questions that could change the skill's structure. Choose source types suited to those questions and state important knowledge gaps. Stop adding sources when they no longer change the findings or their confidence. If necessary evidence remains unavailable, qualify the finding and identify what would resolve it.

These phases describe dependencies, not mandatory report sections. Establish intent and a relevant domain map before diagnosing gaps; expand Phases 2-4 where they add evidence or insight. A focused review can combine them without displaying every intermediate step.

## PHASE 2: Domain Knowledge Mapping

### 2A: Key Resources

Start with supplied evidence. Select additional books, research, practitioner guides, talks, or cases for their relevance and distinctive contribution, without source quotas. Prefer demonstrated expertise and depth of craft; include credible dissent when it tests an important assumption.

Only name resources you know exist. Distinguish a resource identified as potentially useful from one whose relevant contents you inspected. Attribute general domain knowledge honestly; verify uncertain titles or claims before relying on them.

### 2B: Structured Knowledge Extraction

Map the relevant expertise across these lenses:

- **Core:** Foundational concepts, established principles, and canonical frameworks.
- **Expert:** Non-obvious heuristics, hard-won lessons, conditional judgment, and tacit decisions inferred from practitioners' examples.
- **Frontier:** Contested or changing practice; distinguish emerging claims from established knowledge.
- **Adjacent:** Insights that may transfer from neighboring fields, with their transfer conditions.

Prioritize knowledge that changes what the skill should ask, decide, produce, or avoid. Separate source-supported findings, general knowledge, and your inferences.

### Source Credibility Note

Weight empirical findings by methodology, sample size, controls, and replication; practitioner claims by demonstrated results and specificity; theoretical frameworks by consistency and predictive usefulness; and cases by contextual relevance. Several sources repeating one underlying claim do not provide independent confirmation.

## PHASE 3: Deep Analysis

For each consequential finding, explain its contribution, the evidence-to-conclusion reasoning or mental model, concrete practitioner decisions it implies, and its direct application to the target skill. State the assumptions, limits, counter-evidence, and what would disprove or narrow it.

Give depth to novel findings that would change the skill. Combine confirmatory findings rather than repeating the same lesson across sources.

### Analysis vs. Summary Test

A source summary explains a framework. Analysis explains why that framework exposes a gap in an exact skill section and how changing the section would improve a decision or output. Show that connection before recommending a fix.

## PHASE 4: Cross-Source Synthesis

### 4A: Convergent Patterns

Identify independent agreement, each source's contribution, confidence, and the implication for the skill. Refer back to findings already explained.

### 4B: Hidden Connections

Use the techniques that yield additional insight:

- **Assumption mapping:** What unstated conditions must hold for two claims to both be true?
- **Framework collision:** What changes or breaks when one framework is applied to another source's examples?
- **Gap analysis:** What do the sources assume, or leave unaddressed?

### 4C: Contradictions and Tensions

Explain genuine disagreements, the decision the designer must make, and the gains and costs of each option. Keep unresolved domain choices distinct from defects in the skill. Preserve consequential tensions for the designer instead of silently choosing a preference.

### 4D: Emergent Insights

Look for useful conclusions that arise from combining findings: unexpected connections, shared blind spots, missing evidence, or assumptions that failed. Label these as synthesis or inference and show their basis. Include only insights with a concrete implication.

## PHASE 5: Structural Gap Analysis

Assess relevant dimensions against the established intent and domain map:

- **Task Architecture:** Task clarity, scope, and whether one skill or a chain fits.
- **Context & Information:** Missing expertise, distracting context, and the placement of critical information.
- **Output Specification:** Usable format, examples, productive depth, and observable quality criteria.
- **Reasoning & Thinking:** Whether explicit decision steps or intermediate artifacts would improve the outcome.
- **Edge Cases & Robustness:** Ambiguous inputs, missing information, hallucination risks, and difficult cases.
- **Identity & Perspective:** Whether the persona encodes useful expertise, judgment, and an appropriate voice.
- **Evaluation Criteria:** What evidence would distinguish effective execution from a superficially convincing output.
- **What's Missing:** Expert decisions or failure modes omitted by the current instructions.

For a material gap, compare current behavior with the needed behavior and explain your confidence. Do not manufacture findings for every dimension or turn inspection alone into proof of behavioral quality.

## PHASE 6: Prioritized Findings

Return a review proportional to the request. Briefly state the inspected scope, intended use, assumptions, and evidence limits. Present each finding once.

For each finding include:

- **Location:** Exact heading, rule, or reference; add a line number when useful.
- **Observed gap:** Current behavior or omission and its likely consequence.
- **Evidence:** Relevant source, example, or domain finding and the reasoning connecting it to the gap. Distinguish observation from inference.
- **Proposed change:** Concrete replacement wording or an actionable structural change.
- **Tradeoff:** Added length, complexity, reduced flexibility, or another meaningful cost.
- **Confidence:** HIGH, MEDIUM, or LOW with a brief justification.

### Top 3 Highest-Leverage Gaps

Lead with up to three findings ranked by expected improvement. Include fewer when the evidence supports fewer.

### Complete Gap List

For a broader review, give remaining material findings by the Phase 5 dimensions and rank them within each category. Reference the leading findings rather than duplicating them. Omit an exhaustive list from a focused review unless requested.

### Design Decisions

Separate unresolved choices from recommended fixes. State options, tradeoffs, and the missing evidence or preference needed to decide.

## Execution Rules

- Trace recommendations from domain evidence through reasoning to a specific gap and change.
- Research the skill's subject matter; skill engineering guidance alone cannot establish domain expertise.
- Prefer consequential insight over coverage. Keep uncertainty visible rather than filling gaps with generic advice.
- Distinguish recorded applied changes and established decisions from new proposals.
- End with the prioritized review. Authoring, running the target workflow, and behavioral trials remain separate work.