# Skill Template — the Full Create/Rewrite Arc

Read this when producing a complete new skill or a substantial rewrite. For targeted authoring fixes, trigger debugging, or metadata answers, the root manifest usually suffices.

**Contents:** 1. The Eight Passes · 2. Mechanism Matrix · 3. Component Selection Matrix · 4. Annotated SKILL.md Skeleton · 5. Per-Genus Blocks · 6. Drafting Rules

---

## 1. The Eight Passes

Use these passes where they change the design. They describe reasoning dependencies, not a required series of visible maps or report sections. The root manifest's "Workflow and Result" owns output requirements.

### Pass 0 — Mode, runtime, and fit
Pick the smallest useful mode from the root manifest. Use a skill for repeated workflows, stable judgment, hidden constraints, or value tradeoffs that materially change behavior. Do not create one for one-off tasks, fast-changing facts, or rules deterministic tooling enforces better. Runtime unknown → portable frontmatter (`name`, `description`); add other fields only after confirming support and applicable instructions.

### Pass 0.5 — Map the system
Identify actual governing instructions, available siblings, genus, and provenance (root manifest, "Map the System Before Authoring"). Explain owns / cites / borders when those boundaries affect the design; do not invent missing contracts or edit siblings outside the requested scope.

### Pass 1 — Extract the expertise payload

```text
Repeated task class:
Expertise payload:
Hard-won insight:
Values/tradeoffs:
Non-obvious constraints:
Failure scars:
What not to encode:
```

A thin map means the right artifact is a template, checklist, or doc — not a skill.

### Pass 2 — Build the prior-rewrite map
One row per major rule, using the root manifest's chain:

```text
Scar/value:
Bad default prior:
Why it fails:
Replacement instinct:
Manifest anchor:
Boundary / exception:
```

Resolve unclear decisions or leave them pending; apply the root manifest's preservation boundary before proposing cuts.

### Pass 3 — Choose mechanism and components
Pick the primary mechanism (§2) and only the components that carry it (§3). Every selected component must name the cognitive failure it prevents; never fill sections by habit.

### Pass 4 — Design routing
Classifier grammar, name rule, and routing deliverables per the root manifest. Write the positive/negative/borderline trigger lists before the description — the description is their compression.

### Pass 5 — Draft the manifest as a memory object
Drafting rules in §6. Draft the core principle and anti-patterns first (they carry the prior rewrite), the workflow last (it is the cheapest part to get right).

### Pass 6 — Eval cases
Select proportionate coverage using [eval-case-library.md](eval-case-library.md). Write expected behavior before any requested trial. Record cases as designed, run, or deferred; drafting a case does not establish that it passed.

### Pass 7 — Emit the smallest complete artifact
Return the mode's artifact and checks per the root manifest's "Workflow and Result," without a second close-out checklist. Governing instructions own approval and halt behavior; this skill owns the design artifact.

---

## 2. Mechanism Matrix

Classify how the skill changes behavior; the primary mechanism determines manifest shape. Most serious skills are hybrids — one mechanism must still be primary.

| Mechanism | What it changes | Manifest emphasizes | Avoid |
|---|---|---|---|
| **Routing** | Whether the skill loads | Trigger grammar, exclusions, collisions | Long workflow doctrine |
| **Workflow** | Order of operations | Passes, gates, halt conditions | Taste essays |
| **Judgment** | Tradeoffs and taste | Persona lenses, contrastive examples, quality bars | Rigid scripts |
| **Constraint injection** | Hidden invariants | Non-obvious rules, authority labels, failure cases | Generic style guides |
| **Artifact shaping** | Output structure | Templates, schemas, examples | Broad domain theory |
| **Tool-use** | Tool choice and safety | Tool boundaries, preflight, failure behavior | Tool menus |
| **Extraction** | Raw context → reusable behavior | Distillation pipeline, placement rules | Copying source docs |
| **Audit** | Finding defects in an artifact | Diagnostic ladder, ranked fixes, patch shapes | Full rewrites by default |

---

## 3. Component Selection Matrix

| Component | Use when | Cut when | Cognitive job |
|---|---|---|---|
| **Core Principle** | One sentence prevents the dominant failure | It repeats the title | Survives attention drift |
| **Persona lenses** | Quality depends on competing concerns | The task is procedural | Forces multi-axis reasoning |
| **Workflow** | Step order matters | Any order works | Prevents skipping fundamentals |
| **Quick Reference** | Decisions compress into defaults | It repeats prose | Mid-task lookup |
| **Values/tradeoffs** | Good goals genuinely conflict | No meaningful conflict | Encodes what wins |
| **Anti-Patterns** | Strong bad defaults exist | No likely bad default | Rewrites priors |
| **Contrastive examples** | Pattern beats abstraction | Examples would be fake or narrow | Anchors the replacement |
| **Checklist** | Completion quality is forgettable | It becomes generic QA | Final attention pass |
| **References** | Detail matters only sometimes | Detail is core to every trigger | Saves root context |
| **Automation** | Repeated brittle machine-checkable error | It only checks obvious syntax | Removes brittle decisions |

---

## 4. Annotated SKILL.md Skeleton

```markdown
---
name: activity-first-lowercase-name          # ≤64 chars, no helper/utils sludge
description: >-                               # illustrative shape; follow supported runtime conventions
  One line: what the skill does and the artifact/domain it applies to.
  Trigger: contexts, intents, phrases it loads on; exclusions if overtrigger risk is real.
# optional runtime fields only when supported and permitted by governing instructions
---

# Title                                       # names the activity, not the aspiration

[Identity: 2–4 sentences — the expertise capsule and the prior it rewrites.]
[Place in the system: what it owns, actual governing sections and available siblings it cites, its genus.]

## Core Principle                             # the one sentence that prevents the dominant failure

## [Domain sections]                          # only components that passed §3, each law stated once,
                                              # root laws cited never cloned, contrastive pairs at the
                                              # highest-risk behaviors

## Anti-Patterns                              # bad default → why wrong → replacement; drift-surviving anchors

## [Result / close-out]                       # required elements, any readable shape — no XML ceremony

## References                                 # each with when-to-read; one level deep
```

---

## 5. Per-Genus Blocks

Insert the block matching the skill's genus (root manifest, "Map the System").

**Artifact skill** — after identity:
```markdown
**Artifact home.** [path/pattern]. The artifact is durable — chat is not memory.
[Schema / required sections — one authoritative schema; version only if a real process requires it.]
```

**Lens / auditor** — use a character sheet or lens set with grounded expertise and calibrated uncertainty; `prompt-writing-persona` may help if available. When independent review or a durable report is required, adapt this block to the actual workflow:
```markdown
## Review Inputs and Report
Inputs: [materials under audit and task context]. For independent review, exclude the
author's reasoning trajectory; flag supplied context that compromises independence.
Target access is read-only. If a report file is required, write only to [authorized report
destination]; cite the actual governing section if applicable.
Return [report shape and evidence] with a recommendation for [the decision-maker].
Flag out-of-scope hazards without expanding the assignment. Naming a lens is not evidence
that its review ran.
```

**Protocol / front-end** — after identity:
```markdown
**Place in the system.** [Actual governing instructions] own authority; [the artifact skills] own the artifacts. This
protocol owns [the decision] and feeds its outputs into them — it never spawns a rival artifact.
```

**Domain orchestrator** — near the top:
```markdown
Specialist skills are tools. Loading them is not progress — a phase helped only if it changed
[the outcome the family exists for]. [Two-way routing: what this coordinates; what each
specialist owns; the specialist owns its domain judgment.]
```

---

## 6. Drafting Rules

- Apply the root manifest's "The Core Operation" and preservation boundary to each proposed rule.
- The dominant expertise → prior rewrite goes in the core principle; value hierarchies and defaults go in tables.
- Anti-patterns as `bad default → why wrong → replacement`; contrastive examples at the highest-risk behaviors.
- Cite actual governing sections and available sibling owners; propose reverse references outside the edit scope.
- References one level deep; over 100 lines needs a TOC; each linked from root with when-to-read.
- Automation is a rare exception, never furniture.
- Write in solo context: the finished skill reads as if it always existed — no justification of changes, no references to prior versions or the session that produced it.

