---
name: plan-question-spec
description: Challenge a project idea or proposed approach through an adaptive interview or a drafted-spec review. Use when the user asks to be grilled, interviewed, or challenged on a rough idea, or wants to review a design before implementation. Probe outcome fit, assumptions, alternatives, scope, failure modes, and evidence.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Question the Spec — Challenge Before Implementation

## Choose the mode

Use **idea interview** when the user asks to be grilled, wants help thinking through an idea, or requests questions before a recommendation. A drafted specification and evaluation plan are not prerequisites. Use **drafted-spec review** for a requested critique of an existing proposal; ask questions only where the answers could materially change the verdict. Follow the user's requested mode, and use supplied context before asking for more.

## Idea interview

Help the user clarify the problem and test the assumptions that could change the proposed approach. Challenge claims with concrete reasons; do not manufacture objections to sustain an adversarial tone.

- Ask **one consequential question at a time**, then wait for the user's answer. Use a small batch only when requested. Briefly explain why the question matters when that would help; do not dump the review dimensions as a questionnaire or produce a full plan before hearing the answers.
- Select the next question from the most consequential unresolved issue. Probe the intended user and outcome, why the problem matters, the smallest useful scope, current assets, simpler alternatives, evidence of success, and constraints that could invalidate the approach. Use these as lenses, not a checklist every idea must complete.
- For ML or agentic ideas, consider available data and its suitability, the simplest baseline, evidence that a model adds value, expensive or uncertain assumptions, and go/revise/stop criteria. Probe staffing, availability, dependencies, and deadlines when they could change feasibility. Detailed ML evaluation design and milestone planning remain separate tasks.
- Let each answer determine the follow-up. Point out consequential contradictions or unsupported claims and ask for the missing reasoning or evidence. Keep supplied facts, hypotheses, proposed decisions, and unknowns distinct. Do not repeat settled questions without new contradictory evidence.
- Accept "I don't know" or "skip." Keep the issue open, offer a clearly labeled assumption, or suggest the smallest useful investigation. When progress requires data rather than another opinion, identify that evidence instead of continuing to interrogate.
- Stop when there is enough context to state the intended outcome, a plausible simplest approach, the principal assumptions and risks, and the next decision or experiment. Also stop when the user asks for synthesis or action; carry unresolved uncertainties into the result rather than demanding exhaustive answers.

Finish with a concise synthesis of the clarified idea, decisions and rationale, unresolved assumptions, and the smallest useful next experiment or action. If the user requests planning, carry the clarified context into that task instead of restarting intake. Proposals do not assign work or create commitments.

## Drafted-spec review

Challenge whether the proposal solves the intended problem with a credible, suitably simple approach. Deliver a read-only critique. Carry accepted changes into the user's existing specification or evaluation workflow when requested. A focused architecture or infrastructure review can deepen a consequential component or primitive decision; companion reviews are optional.

Milestone planning, detailed ML evaluation (metric selection, model validity, retrieval quality, and online experiments), and software verification remain separate tasks. Flag missing evidence or verification work without designing or running those workflows here.

### Ground in supplied context

Use the supplied proposal, intended outcome, constraints, and available evidence. Accept informal proposals and incomplete evaluation plans; ask for missing information only where it could materially change the recommendation. Re-derive the problem rather than adopting the author's framing. Keep supplied facts, assumptions, proposed decisions, and unknowns distinct. Check prior decisions and revisit settled concerns only when new evidence or changed constraints warrant it.

Consult external sources when they could resolve a consequential uncertainty. Name an external pattern only when you can substantiate what it prescribes and explain its concrete application here. An unsupported pattern is a research suggestion, not a finding. Reference counts and prestige do not establish a deficiency.

### Review lenses

Use these lenses to find consequential issues, with depth proportional to the proposal's risk. Consolidate overlapping findings. Focus on value, correctness, evidence, and solution shape; leave milestone sequencing and document conformance to their own tasks.

- **Outcome fit:** Does the approach improve the intended user journey or engineering outcome? Are requirements tied to observable value, or do they mostly describe implementation activity?
- **Scope discipline:** Is this the smallest responsible change that delivers value while including necessary work?
- **Simplicity and alternatives:** Compare the chosen approach with a plausible simpler alternative against stated constraints. Identify unnecessary architecture, process, or abstraction. A missing alternatives section alone is not a defect.
- **Requirement quality:** Identify vague, redundant, contradictory, or unjustified requirements that could change implementation or acceptance. Fewer milestones or shorter documents do not automatically improve the approach.
- **Correctness and failure modes:** Examine source-of-truth, state transitions, edge cases, hostile paths, and recovery. Where relevant, reason through load spikes and backpressure, cost growth, partial failure and duplicate delivery, operational debuggability, and reversibility. A demonstrated failure of a required safety or correctness constraint blocks implementation until resolved; an untested assumption is an evidence request, not an established failure.
- **Evidence and regret:** Would the proposed evidence distinguish success from activity and catch consequential regressions? What would make us regret shipping this approach? For ML or agentic proposals, challenge data suitability, the simplest baseline, and the evidence that a model adds value; carry detailed evaluation questions into the dedicated ML evaluation workflow.
- **Consistent authority:** Are ownership and canonical behavior clear across state, overlapping implementations, and decisions? Identify competing sources of truth or conflicting paths that could produce inconsistent behavior.

### Recommendation

Lead with **Implement as written / Implement with changes / Fix proposal first**, or explain that consequential missing evidence prevents a recommendation. Report material findings in priority order, each with its concern, supporting evidence or explicit assumption, consequence, and smallest concrete fix. Distinguish blockers from useful improvements.

Report as many findings as the evidence warrants, including zero required changes. Clean lenses do not require separate sections or invented concerns. State the review's scope, any material remaining uncertainty, and the next decision or investigation where useful.

### Decision continuity

Include a concise carry-forward summary of the recommendation, user-accepted or rejected concerns and rationale, unresolved assumptions, and needed evidence. Distinguish review proposals from authorized decisions. When a durable record is requested, use the user's existing specification or decision log and its format so later sessions inherit the reasoning without repeating the review.
