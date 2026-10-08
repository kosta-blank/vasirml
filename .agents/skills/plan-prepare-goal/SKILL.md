---
name: plan-prepare-goal
description: Launch or resume implementation of an approved work spec with durable milestone state, proportionate software verification, and explicit human acceptance boundaries. Use when asked to execute a grounded spec; milestone planning and ML evaluation remain separate.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---
# Launch or Resume Implementation

Execute within session authorization and recorded decisions. This skill supplies guidance; approval comes from the user.

**Entry requirement.** Before implementation, establish **Grounded — launch** from current sources using `$plan-prepare-summary` when available or the Goal check below. Route **Spec gap — stop** decisions to their owner.

## The Grant and Its Boundaries

- Continue through approved milestones and contracts without requesting the same approval again. Subjective gates close only on recorded human acceptance; set **Waiting Human** when that acceptance is pending.
- Halt and report at the **first Waiting Human or Blocked boundary**, or when authorization or a material scope decision is unresolved.
- Flag findings outside scope for their owner. Access and edit files and repos required by the approved work, within available permissions; protect parallel edits and re-read shared state before updating it.
- Follow applicable repository instructions, including `AGENTS.md`. Delegation follows the session's routing policy: assign bounded evidence collection or independent audits where useful, and retain responsibility for implementation judgment and final verdicts.

## Execution Law

- **Milestone by milestone, in spec order.** Update states as work proceeds, using the spec's vocabulary. Keep the active milestone, evidence, decisions, and dependent status summaries synchronized so a fresh session can resume from the spec.
- **The verification plan travels with the spec.** Gates define each milestone's acceptance; claim **Objectively Green** only after relevant checks run against current code and produce inspected evidence. Record artifact paths plus a surviving summary and regeneration command when raw artifacts may expire. ML metric selection, model validity, retrieval quality, and online experiments belong to the dedicated ML evaluation workflow; software checks establish their own claims.
- **Before code, assess changed behavior and risks.** Reuse sufficient checks, scale proof to risk, and reassess when new risks emerge. `$code-enforcing-principles` can assist when available.
- **Audit when the changed surface or risk warrants it.** Use `$code-auditing` or `$testing-auditing` when available and relevant. Record the actual report and triage its recommendations; naming a lens alone supplies no audit evidence.
- **Bugs found during execution:** capture a failing reproduction through the affected public boundary before fixing existing behavior. `$code-fixing-bugs` can supply the detailed workflow when available.
- Code files stay focused: ≤ 1k LOC, semantically coherent, testable, well organized and named.

## Close

End at the terminal state or the first human or blocked boundary, with spec statuses and evidence current. Report the outcome, relevant proof, remaining gaps, and the next required decision. Claim **Complete** only when objective gates pass and required human acceptance is recorded. Before claiming release readiness, use `$handoff-final-quality-gate` when available or the applicable repository release checklist.

## Goal

At every launch or resume, read the current spec, verification plan, recorded authorization, and active milestone. Re-derive preflight from milestone bodies and contracts; verify summaries and pasted preflight output against current sources.

Confirm the goal, unlocked engineering or system capability, enabled user or downstream journey, and concrete outcome and completion gates. Check that the implementation approach serves them within the contracts. End **Grounded — launch** when supported and consistent; otherwise end **Spec gap — stop** and name the missing or conflicting decision. Resume at the first approved unfinished milestone, retaining evidence and decisions.
