---
name: plan-prepare-summary
description: Prepare a read-only goal and resumption brief from current work commitments, contracts, and completion evidence. Use before launching or resuming implementation, including after compaction or handoff. Detects summary drift and gaps; implementation, gate design, and ML evaluation remain separate.
allowed-tools: Read, Grep, Glob
---
# Goal and Resumption Brief

Re-derive the brief at every launch or resume. Return it without storing it, editing source artifacts, implementing work, or running checks. A saved summary is a projection that can drift. When available, `$plan-prepare-goal` consumes this output as its goal block; findings route to the relevant artifact or decision owner.

## The Re-derivation Law

Read the current work spec, linked verification plan, and recorded decisions and authorization, using supplied paths or the current work's links. If the intended source is ambiguous, name the missing choice. Derive answers from milestone bodies, contracts, gate definitions, and recorded evidence; compare headers, indexes, and saved summaries afterward. Cite source locations for material claims.

Use sections by function rather than requiring a particular schema. The work spec owns scope and milestone commitments; the verification plan owns gate mechanics and recorded gate state. Where available, `$plan-maintain-work-spec` and `$eval-design-proof-gates` maintain those artifacts.

## The Four Questions

1. **What is the goal?** State the intended outcome in 1–2 lines.
2. **What engineering or system capability does this unlock?** State the observable new capability and what it enables next, beyond naming the implementation.
3. **What user or downstream journey does this enable?** Identify who can now do what at a concrete journey moment. For internal work, name the supported downstream implication or state that a direct user change does not apply.
4. **What does completion actually look like?** Name the terminal artifact or outcome a human can inspect, objective gates requiring fresh evidence, subjective gates requiring recorded human acceptance, and the outcome whose absence would mean the work is incomplete even if every check passed.

## Resumption Context

Name the active or next approved unfinished milestone, material changes since the last checkpoint, and the next action. Compare recorded evidence's revision, environment, and guarded surface with current sources; label freshness unverified when it cannot be established. Identify blockers, pending acceptance, or unresolved assumptions and decisions, with their owner; mark an unknown owner explicitly. At an initial launch, state that no previous checkpoint exists.

## The Two Checks

- **Divergence:** flag conflicting source locations when the re-derivation disagrees with a summary or status claim. Never silently adopt either side; route scope or projection fixes to the spec owner and gate-state conflicts to the verification-plan owner.
- **Grounding:** identify concrete conflicts between milestone commitments, agreed scope, contracts, and the intended outcome. Check authority, data model, lifecycle, failure behavior, and proof path where relevant. Name the offending commitment and smallest clarification; broader architecture review belongs to its owner. A limited POC may omit capabilities when agreed limits are explicit and supported paths meet their contracts. A stubbed value path or mocked checks alone cannot prove a promised real outcome.

Report referenced ML evaluation decisions or evidence without selecting metrics, judging model validity or retrieval quality, or designing online experiments; those belong to the dedicated ML evaluation workflow.

## Verdict

Readiness does not establish completion. Open gates can be valid obligations for upcoming work; a blocked next step or acceptance required before that step stops implementation.

End with one verdict:

- **Grounded — launch.** Current sources support consistent answers and an authorized next step within the recorded boundaries. This permits starting or resuming approved work; it supplies no completion claim or additional authorization.
- **Spec gap — stop.** An answer is unsupported, a check failed, or the next step awaits a required decision, acceptance, or unblock. Name the reason, owner, and needed action; distinguish a spec defect from an implementation boundary. Route missing or drifted content to its artifact owner, or a disputed approach to `$plan-question-spec` when available. Never invent an answer to fill a gap.
