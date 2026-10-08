# Canonical skill catalog

There are 67 active skills. The existing reviewed set has 38 skills; the 29 restored source imports are pending review. Use these canonical identifiers with `vasir add`.

## all active skills (67)

- `agents-creating-folder-agents`
- `art-direction-defining-game-art`
- `audit-optimizing-node-backend`
- `code-auditing`
- `code-crafting-dev-ux`
- `code-enforcing-principles`
- `code-fixing-bugs`
- `code-threejs-rapier-performance`
- `design-animating-interfaces`
- `design-building-frontend-interfaces`
- `design-designing-cli`
- `design-designing-end-screen`
- `design-designing-game-ui-for-idavoll`
- `design-designing-typography`
- `design-frontend-foundations`
- `design-visualizing-data`
- `doc-guard-drift`
- `documentation-writing`
- `eval-design-proof-gates`
- `eval-implement-proof-gate`
- `explaining-creating-interactive-articles`
- `game-adding-juice`
- `game-ai-architecting-ai`
- `game-art-directing`
- `game-assets-generating-images`
- `game-building-combat-damage`
- `game-building-core-loop`
- `game-building-inventory-system`
- `game-building-loot-systems`
- `game-creation-selecting-initial-template`
- `game-creation-writing-game-spec`
- `game-design-ensuring-design-coherence`
- `game-designing-systems`
- `game-directing`
- `game-generating-procedural-content`
- `game-genre-routing`
- `game-onboarding-designing-game-onboarding`
- `game-orchestrating-playable-build`
- `game-proof-auditing-first-playable-comprehension`
- `game-qa`
- `game-tuning-economy-progression`
- `handoff-final-quality-gate`
- `ops-maintain-incident-postmortem`
- `persona-selecting`
- `physics-creating-interaction-system`
- `plan-maintain-work-spec`
- `plan-prepare-goal`
- `plan-prepare-summary`
- `plan-project-milestones`
- `plan-question-spec`
- `plan-question-spec-architecture`
- `plan-question-spec-infra`
- `prompt-create-analysis`
- `product-designing-viral-social-loops`
- `prompt-improving-rewriting`
- `prompt-perform-root-cause-analysis`
- `prompt-reverse-engineering`
- `prompt-writing-persona`
- `security-auditing-code`
- `skills-create-analysis`
- `skills-create-skill`
- `testing-auditing`
- `testing-enforcing-mandate`
- `threejs-improve-performance`
- `ui-revamping-game-shell-ui`
- `whitepaper-analyze-mmo-whitepaper`
- `writing-response-quality-style-guide`

### Source imports pending review (29)

These imported skills are available for installation and are pending review. Their source content is preserved; the canonical IDs normalize source separators for directory and CLI use.

- `art-direction-defining-game-art`
- `code-threejs-rapier-performance`
- `design-designing-end-screen`
- `design-designing-game-ui-for-idavoll`
- `game-adding-juice`
- `game-ai-architecting-ai`
- `game-art-directing`
- `game-assets-generating-images`
- `game-building-combat-damage`
- `game-building-core-loop`
- `game-building-inventory-system`
- `game-building-loot-systems`
- `game-creation-selecting-initial-template`
- `game-creation-writing-game-spec`
- `game-design-ensuring-design-coherence`
- `game-designing-systems`
- `game-directing`
- `game-generating-procedural-content`
- `game-genre-routing`
- `game-onboarding-designing-game-onboarding`
- `game-orchestrating-playable-build`
- `game-proof-auditing-first-playable-comprehension`
- `game-qa`
- `game-tuning-economy-progression`
- `physics-creating-interaction-system`
- `product-designing-viral-social-loops`
- `threejs-improve-performance`
- `ui-revamping-game-shell-ui`
- `whitepaper-analyze-mmo-whitepaper`

## core

- `code-auditing`
- `code-fixing-bugs`
- `design-building-frontend-interfaces`
- `design-visualizing-data`
- `doc-guard-drift`
- `documentation-writing`
- `eval-design-proof-gates`
- `plan-maintain-work-spec`
- `plan-project-milestones`
- `plan-question-spec`
- `prompt-perform-root-cause-analysis`
- `testing-auditing`
- `writing-response-quality-style-guide`

## core-and-optional

- `code-auditing`
- `code-crafting-dev-ux`
- `code-fixing-bugs`
- `design-animating-interfaces`
- `design-building-frontend-interfaces`
- `design-designing-cli`
- `design-frontend-foundations`
- `design-visualizing-data`
- `doc-guard-drift`
- `documentation-writing`
- `eval-design-proof-gates`
- `explaining-creating-interactive-articles`
- `ops-maintain-incident-postmortem`
- `plan-maintain-work-spec`
- `plan-project-milestones`
- `plan-question-spec`
- `prompt-create-analysis`
- `prompt-improving-rewriting`
- `prompt-perform-root-cause-analysis`
- `security-auditing-code`
- `testing-auditing`
- `testing-enforcing-mandate`
- `writing-response-quality-style-guide`

## Named installation groups

Use `vasir groups gamedev` to inspect the game group, and `vasir add --group gamedev` to install it. Repeated group flags combine into a deduplicated union: `base`, `frontend`, and `gamedev` contain 11, 5, and 29 skills, with 45 unique skills in their union. Group selection and AGENTS profiles are independent. See [group usage and editing](../README.md#named-skill-groups).

### base (11 skills)

General planning, documentation, debugging, review, and proof skills for any engineering project.

- `documentation-writing`
- `doc-guard-drift`
- `writing-response-quality-style-guide`
- `code-fixing-bugs`
- `code-auditing`
- `plan-maintain-work-spec`
- `plan-question-spec`
- `eval-design-proof-gates`
- `testing-auditing`
- `prompt-perform-root-cause-analysis`
- `plan-project-milestones`

### frontend (5 skills)

Frontend foundations, interface implementation, data visualization, typography, and animation.

- `design-frontend-foundations`
- `design-building-frontend-interfaces`
- `design-visualizing-data`
- `design-designing-typography`
- `design-animating-interfaces`

### gamedev (29 skills)

This group contains 28 game-related imports and `product-designing-viral-social-loops`. All 29 are pending review.

- `art-direction-defining-game-art`
- `code-threejs-rapier-performance`
- `design-designing-end-screen`
- `design-designing-game-ui-for-idavoll`
- `game-adding-juice`
- `game-ai-architecting-ai`
- `game-art-directing`
- `game-assets-generating-images`
- `game-building-combat-damage`
- `game-building-core-loop`
- `game-building-inventory-system`
- `game-building-loot-systems`
- `game-creation-selecting-initial-template`
- `game-creation-writing-game-spec`
- `game-design-ensuring-design-coherence`
- `game-designing-systems`
- `game-directing`
- `game-generating-procedural-content`
- `game-genre-routing`
- `game-onboarding-designing-game-onboarding`
- `game-orchestrating-playable-build`
- `game-proof-auditing-first-playable-comprehension`
- `game-qa`
- `game-tuning-economy-progression`
- `physics-creating-interaction-system`
- `product-designing-viral-social-loops`
- `threejs-improve-performance`
- `ui-revamping-game-shell-ui`
- `whitepaper-analyze-mmo-whitepaper`
