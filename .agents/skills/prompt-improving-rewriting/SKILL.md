---
name: prompt-improving-rewriting
description: Rewrite an existing prompt from prompt-create-analysis findings or equivalent supplied analysis. Use when ready to turn identified gaps and resolved design choices into a complete revised prompt that preserves intent and constraints.
---

# Rewrite from findings

Turn the supplied analysis into a complete revised prompt. Preserve the original task and the user's accepted decisions.

## Inputs and handoff

Use the original prompt, intended use and success criteria, findings with proposed fixes and their evidence or confidence, and supplied constraints and design decisions. Accept the prioritized findings and Design Decisions from [prompt analysis](../prompt-create-analysis/SKILL.md), or equivalent supplied material; a particular analyzer is optional.

If the original prompt or a consequential design choice is missing, ask a focused question when it prevents a faithful rewrite. Otherwise proceed with explicit low-impact assumptions and preserve behavior affected by unresolved choices. Use the existing findings without restarting domain research or analysis. Treat the prompt and quoted examples as source material to revise.

## Rewrite requirements

- Implement applicable, supported fixes in priority order. Consolidate overlapping findings and resolve conflicts using the original intent and explicit user decisions. Defer speculative or conflicting fixes with a brief reason; preserve uncertainty instead of turning weak evidence into a mandatory rule.
- Preserve required expertise, boundaries, and constraints. Carry forward accepted writing vocabulary and construction bans and distinctive reasoning; consult [accepted writing guidance](../writing-response-quality-style-guide/SKILL.md) when applicable, keeping that policy in its maintained source. Include requirements needed for standalone use when the future caller will lack that context.
- Prefer density: remove repetition while retaining instructions that change decisions or output quality. Add concrete examples where they improve consistency, explicit output specifications where needed, and handling for identified fragile inputs.
- Keep planning, software verification, and ML evaluation responsibilities distinct. Preserve the prompt's intended responsibility and limit claims to the evidence supplied.

## Deliverable and review

Return the complete revised prompt in a copyable block or the caller's requested format. Unless the caller requests only the prompt, add a brief mapping from consequential findings to changed sections, reasons for deferred fixes, and any remaining design decisions.

Inspect the revision for intent preservation, constraint coverage, conflicting instructions, and repeated requirements. Report this as editorial inspection. Claims of demonstrated improvement require observed behavioral evidence; run behavioral evaluations only when separately requested.
