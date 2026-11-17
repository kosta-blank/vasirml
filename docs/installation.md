# Installation and defaults

This behavior belongs to the revised source/archive. An older installed CLI still uses its bundled groups and init default. Build and install this archive before using the new names; `vasir update` alone does not upgrade the CLI executable.

## Install the revised CLI

From this source checkout, after dependencies are installed:

```sh
npm run build:agents
npm run build:registry
npm run build:review
npm pack
npm install -g --offline --no-audit --no-fund ./vasir-slim-0.1.0-ml.tgz
vasir groups
```

The archive also supports project-local installation; see the README. Installing the CLI does not enroll a project.

## Start a project

Run inside the target Git repository, or pass `--repo-root /path/to/project`:

```sh
vasir init
vasir status
```

Fresh init prepares the global catalog cache, installs and tracks Tier A under `.agents/skills/`, creates `.codex/skills` and `.claude/skills` aliases, writes project config/install state, and seeds missing root contracts. Outside a repository without an explicit root, init only prepares the global cache. Rerunning init in an existing managed project preserves its selected or full-catalog tracking. It does not switch an existing project to Tier A.

## Install groups

Fresh `vasir init` installs the 20 Tier A skills. Groups organize domains; tiers express frequency of use. Each non-game group includes its Tier A and Tier B members. Tier C is the unchanged game catalog. Shared skills have one canonical file and install once. Software development is the union of frontend and backend.

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

Combine groups and inspect their contents:

```sh
vasir add --group backend --group frontend --replace
vasir groups backend
vasir skills backend
```

Inspect `vasir diff` and reconcile edited skills before retrying a blocked replacement. Groups expand to an installed snapshot; `vasir update` refreshes selected skills, and adding a group again enrolls its current members. `base` and `miscellaneous` are retired selection names; existing tracked skill IDs remain valid.

Profiles are separate from groups. `frontend`, `backend`, `ios`, and `generic` profiles shape root AGENTS/CLAUDE contracts. There is no dedicated iOS skill group in this catalog. `vasir agents sync --profile ios` selects the iOS contract profile.

## What init installs: Tier A (20)

- `code-auditing`
- `code-crafting-dev-ux`
- `code-enforcing-principles`
- `code-fixing-bugs`
- `design-building-frontend-interfaces`
- `design-frontend-foundations`
- `design-visualizing-data`
- `doc-guard-drift`
- `documentation-writing`
- `eval-design-proof-gates`
- `eval-implement-proof-gate`
- `explaining-creating-interactive-articles`
- `handoff-final-quality-gate`
- `plan-maintain-work-spec`
- `plan-prepare-goal`
- `plan-prepare-summary`
- `plan-project-milestones`
- `plan-question-spec`
- `plan-question-spec-architecture`
- `testing-enforcing-mandate`

Tier B contains 18 occasional skills, including security review. Select them individually or through a domain group. Tier C contains the 29 game skills, available through `gamedev`. Tiers are defined in `skill-priorities.json` and are not `--group` aliases.

## Add Tier A to an existing project

Init preserves an existing selection. To add the current Tier A snapshot explicitly:

```sh
vasir add code-auditing code-crafting-dev-ux code-enforcing-principles code-fixing-bugs design-building-frontend-interfaces design-frontend-foundations design-visualizing-data doc-guard-drift documentation-writing eval-design-proof-gates eval-implement-proof-gate explaining-creating-interactive-articles handoff-final-quality-gate plan-maintain-work-spec plan-prepare-goal plan-prepare-summary plan-project-milestones plan-question-spec plan-question-spec-architecture testing-enforcing-mandate --replace
```

This retains other installed skills. Use `vasir remove <skill>` for deliberate removal, or `vasir add all --replace` to opt into the entire catalog.
