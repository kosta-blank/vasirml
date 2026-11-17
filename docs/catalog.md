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

Fresh `vasir init` installs the 20 Tier A skills. Use `vasir add --tier A`, `vasir add --tier B`, or `vasir add --tier C` to select a priority tier directly; add `--replace` when its skills are already installed. Groups organize domains; tiers express frequency of use. Each non-game group includes its Tier A and Tier B members. Tier C is the unchanged game catalog. Shared skills have one canonical file and install once. Software development is the union of frontend and backend.

| Group | Skills | Install |
| --- | ---: | --- |
| `software-development` | 18 | `vasir add --group software-development --replace` |
| `frontend` | 15 | `vasir add --group frontend --replace` |
| `backend` | 12 | `vasir add --group backend --replace` |
| `specs-and-documentation` | 12 | `vasir add --group specs-and-documentation --replace` |
| `design` | 7 | `vasir add --group design --replace` |
| `llm-tools` | 8 | `vasir add --group llm-tools --replace` |
| `gamedev` | 29 | `vasir add --group gamedev --replace` |

Use `--replace` when expanding an existing install: unchanged tracked files can be refreshed, while local edits block replacement. On a fresh project, `vasir add --group <name>` selects only that group without first installing Tier A.

### software-development (18 skills)

Shared engineering plus the combined frontend and backend catalog. Overlapping groups reference the same canonical skill.

- `code-auditing`
- `code-fixing-bugs`
- `code-crafting-dev-ux`
- `code-enforcing-principles`
- `plan-question-spec-architecture`
- `security-auditing-code`
- `testing-auditing`
- `testing-enforcing-mandate`
- `prompt-perform-root-cause-analysis`
- `design-frontend-foundations`
- `design-building-frontend-interfaces`
- `design-designing-typography`
- `design-animating-interfaces`
- `design-visualizing-data`
- `explaining-creating-interactive-articles`
- `audit-optimizing-node-backend`
- `plan-question-spec-infra`
- `ops-maintain-incident-postmortem`

### frontend (15 skills)

Web interface implementation and shared engineering review. Security review applies when the work crosses backend or privileged boundaries.

- `code-auditing`
- `code-fixing-bugs`
- `code-crafting-dev-ux`
- `code-enforcing-principles`
- `plan-question-spec-architecture`
- `security-auditing-code`
- `testing-auditing`
- `testing-enforcing-mandate`
- `prompt-perform-root-cause-analysis`
- `design-frontend-foundations`
- `design-building-frontend-interfaces`
- `design-designing-typography`
- `design-animating-interfaces`
- `design-visualizing-data`
- `explaining-creating-interactive-articles`

### backend (12 skills)

Service architecture, APIs, performance, infrastructure, security, verification, and diagnosis.

- `code-auditing`
- `code-fixing-bugs`
- `code-crafting-dev-ux`
- `code-enforcing-principles`
- `plan-question-spec-architecture`
- `security-auditing-code`
- `testing-auditing`
- `testing-enforcing-mandate`
- `prompt-perform-root-cause-analysis`
- `audit-optimizing-node-backend`
- `plan-question-spec-infra`
- `ops-maintain-incident-postmortem`

### specs-and-documentation (12 skills)

Clarify work, keep specs and plans current, define and implement software proof gates, audit handoffs, and document the system and its evidence.

- `plan-question-spec`
- `plan-maintain-work-spec`
- `plan-project-milestones`
- `plan-prepare-goal`
- `plan-prepare-summary`
- `eval-design-proof-gates`
- `eval-implement-proof-gate`
- `handoff-final-quality-gate`
- `documentation-writing`
- `doc-guard-drift`
- `writing-response-quality-style-guide`
- `ops-maintain-incident-postmortem`

### design (7 skills)

Visual foundations, interface design, typography, motion, data evidence, interactive explanations, and terminal interfaces. Web design skills also belong to frontend.

- `design-frontend-foundations`
- `design-building-frontend-interfaces`
- `design-designing-typography`
- `design-animating-interfaces`
- `design-visualizing-data`
- `explaining-creating-interactive-articles`
- `design-designing-cli`

### llm-tools (8 skills)

Analyze and write prompts, select expert framing, author and review reusable skills, and maintain folder guidance for agents.

- `prompt-create-analysis`
- `prompt-improving-rewriting`
- `prompt-reverse-engineering`
- `prompt-writing-persona`
- `persona-selecting`
- `skills-create-analysis`
- `skills-create-skill`
- `agents-creating-folder-agents`

### gamedev (29 skills)

Game design, playable builds, systems, AI, art, onboarding, QA, performance, MMO analysis, and social loops.

- `game-directing`
- `game-genre-routing`
- `game-orchestrating-playable-build`
- `game-creation-writing-game-spec`
- `game-creation-selecting-initial-template`
- `game-design-ensuring-design-coherence`
- `whitepaper-analyze-mmo-whitepaper`
- `game-building-core-loop`
- `game-designing-systems`
- `game-building-combat-damage`
- `game-building-inventory-system`
- `game-building-loot-systems`
- `game-generating-procedural-content`
- `game-tuning-economy-progression`
- `game-ai-architecting-ai`
- `physics-creating-interaction-system`
- `art-direction-defining-game-art`
- `game-art-directing`
- `game-assets-generating-images`
- `game-adding-juice`
- `design-designing-game-ui-for-idavoll`
- `ui-revamping-game-shell-ui`
- `design-designing-end-screen`
- `game-onboarding-designing-game-onboarding`
- `game-proof-auditing-first-playable-comprehension`
- `game-qa`
- `code-threejs-rapier-performance`
- `threejs-improve-performance`
- `product-designing-viral-social-loops`
