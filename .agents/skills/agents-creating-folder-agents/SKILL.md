---
name: agents-creating-folder-agents
description: Creates, rewrites, audits, or declines folder AGENTS.md files as local steering maps for one subtree. Use when a folder needs durable agent orientation, local instructions, and folder-specific non-obvious constraints; not for repo-root AGENTS, nested app/package root generation, generic coding standards, ordinary API reference, or one-off task plans.
allowed-tools: Read, Grep, Glob, Edit, Write
---

This skill creates and updates folder `AGENTS.md` files as local steering maps.

## Core Principle

Folder AGENTS combine context, instructions, and non-obvious constraints for one subtree. Use the steering-fact checklist in step 4 to decide what belongs in the map.

If a line would not change what an agent reads, modifies, avoids, or proves, delete it.

## Taxonomy

- Root `AGENTS.md`: repo-wide operating contract.
- Nested root `AGENTS.md`: app/package root contract maintained through the repository's root-guidance workflow or documented generator.
- Folder `AGENTS.md`: hand-authored steering map for one subtree, using the repository's established folder-guidance conventions.

Use this skill only for folder AGENTS. Verify the repository's supported filename, sidecar, template, and generation conventions before editing. Do not apply a root template or generator to a hand-authored folder map, or invent a generator when none is documented.

## Use This Skill When

- The user asks to create, update, audit, or rewrite `AGENTS.md` for a specific folder or subsystem.
- The folder has durable local facts an agent cannot infer cheaply from filenames.
- The folder has local entrypoints, invariants, proof commands, generated artifacts, dangerous defaults, or failure modes.
- Existing folder guidance is stale, generic, duplicated from root, or written as explanation instead of steering.
- The user asks whether a folder AGENTS should exist.

## Do Not Use This Skill For

- Repo-root AGENTS authoring.
- Nested app/package root contracts maintained through a separate root-guidance workflow or generator.
- Generic coding standards, style guides, ordinary API reference, or broad architecture explanation.
- Thin folders that have no local ownership, commands, invariants, proof path, or non-obvious risk.
- One-off task plans. Put those in the current plan, not durable folder guidance.

## Required Workflow

### 1. Resolve The Folder

Identify:

- Target subtree path.
- Nearest parent/root `AGENTS.md`.
- Existing folder `AGENTS.md`, if present.
- Deeper `AGENTS.md` files that take over for narrower paths.

If the target path is unclear, infer the smallest coherent subtree from the request and repo structure. If that is still ambiguous, return a blocker instead of guessing.

Ask the user only when the target path or authority boundary is genuinely blocked.

### 2. Run The Qualification Gate

Create or keep a folder `AGENTS.md` only if at least one of these is true:

1. The folder owns a real value path, boundary, domain, subsystem, generated artifact source, or proof harness.
2. The folder has local instructions or non-obvious constraints that prevent plausible wrong edits.
3. The folder has proof commands, runtime checks, or artifacts agents repeatedly need.
4. The folder has deeper maps that need routing from this level.

Do not create one for generic buckets like `utils/`, `shared/`, `components/`, `lib/`, or `scripts/` unless the bucket has real local steering facts.

If the gate fails, do not manufacture authority. Return `No folder map needed`.

### 3. Read Evidence Before Writing

Read only enough repo context to prove the steering map:

- Parent/root `AGENTS.md`.
- Existing folder `AGENTS.md`, if present.
- Files in the subtree that prove ownership, entrypoints, invariants, generated-file rules, or proof commands.
- Public entrypoints, exported APIs, handlers, jobs, screens, reducers, hooks, commands, schemas, or test harnesses.
- Adjacent callers or dependencies when needed to understand boundary rules.

Verify commands, ownership, invariants, dependencies, and generated-file rules from source evidence rather than naming alone. Do not invent missing facts. If an exact command cannot be proven, say the command is unknown.

### 4. Extract Steering Facts

Capture only local facts that steer behavior:

- **Owns**: decisions, value paths, state transitions, rendering, data transforms, jobs, boundaries, or proof harnesses owned here.
- **Read First**: files that give the fastest trustworthy orientation.
- **Entry Points**: handlers, routes, commands, screens, jobs, exported modules, reducers, hooks, schemas, or generators.
- **Non-Obvious Constraints**: invariants, prohibited local moves, unexpected local patterns, local defaults that override generic behavior, performance/order/cost constraints, and security or fail-closed behavior. For generated or vendored artifacts, identify source ownership, output ownership, or off-limits status; record the source path and verified regeneration command when applicable.
- **Proof Commands**: exact commands, harnesses, artifacts, screenshots, traces, snapshots, fixtures, or manual checks needed to prove changes here. Keep fast local checks, checks of the affected behavior, and applicable generation checks distinguishable. Route to existing ML evaluation instructions where relevant; metric selection and model validity remain with the dedicated ML evaluation workflow.
- **Deeper Maps**: child folders whose `AGENTS.md` files take precedence and the paths each governs. Route to their rules instead of duplicating them.

Prefer fewer, sharper rules over exhaustive prose. A good folder AGENTS changes agent behavior; it does not summarize the folder.

### 5. Write The Folder AGENTS

Follow the repository's established guidance format. Include the exact subtree and nearest inherited instruction file, then organize the verified facts from step 4. Use this compact shape only when no established format applies; omit empty sections and replace all placeholders with local facts.

```markdown
# AGENTS.md: <Folder / Domain>

**Applies To:** `<exact subtree path or glob>`
**Inherits From:** `<nearest parent/root AGENTS.md>`

## Read First

- `<path>`: <orientation reason>

## Owns and Entry Points

- <verified ownership and entry or exit path>

## Non-Obvious Constraints

- <verified local rule and the edit it steers>

## Proof

- <check purpose>: `<exact command, artifact, or manual check; unknown if unverified>`

## Deeper Maps

- `<child AGENTS.md path>`: read before touching `<governed subtree>`.
```

Preserve true existing local rules. Remove stale rules, generic advice, duplicated parent policy, and vague explanation. Use exact paths and commands, with unverified commands explicitly marked unknown. Keep the map small enough to read before editing; size any purpose statement to the actual ownership rather than a fixed sentence count.

## Self-Audit

Compare the finished map with the qualification gate, evidence read, and step 4 checklist. Confirm it retains relevant local rules, leaves parent policy in its source, and contains no placeholders, stale aliases, or unsupported claims. Read it as an agent about to edit the subtree: does it identify the relevant boundary, likely wrong edits, and how to check the affected behavior?

## Output Contract

Return a compact result suited to the request. State the outcome (created, updated, no folder map needed, or blocked), path and scope, inherited guidance, supporting evidence, consequential changes or omissions, and unresolved blockers. Add a next action when one is needed. No fixed wrapper or field labels are required.

For an audit or recommendation, provide the findings without editing files. For a section draft, return the requested draft and any consequential caveats without applying it.
