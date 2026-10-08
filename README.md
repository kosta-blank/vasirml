# Vasir — reviewed skills and project contracts

This repository combines Vasir's CLI and generated AGENTS/CLAUDE workflow with exactly 38 reviewed skills. Skill folders and CLI requests use canonical hyphenated identifiers; old collection IDs are provenance only and are not CLI aliases. The package is `vasir-slim` version `0.1.0-slim.2`, marked `private: true`, and distributed as a packed archive rather than published to npm.

Vasir gives each project generated root contracts, an authored source for local constraints, and a managed skill tree:

- `AGENTS__non-obvious.md` holds durable project constraints and local rules.
- `AGENTS.md` and `CLAUDE.md` are generated twin root contracts. Commit them and regenerate them from the sidecar.
- `.agents/skills/` holds copied skills; `.codex/skills` and `.claude/skills` point at the same tree.
- `.agents/vasir.json` records tracking, profile, and optional persistent model routing.

## Build from this repository

Requires Node 18.20 or later within 18.x, or Node 20.10 or newer, and npm installed separately. Clone the [repository](https://github.com/kosta-blank/vasirml). Before the reviewed changes merge into the default branch, use `reviewed-skills-and-groups`:

```sh
git clone --branch reviewed-skills-and-groups https://github.com/kosta-blank/vasirml.git
cd vasirml
npm ci
npm test
npm run check:agents
npm run check:registry
npm pack
```

`npm test` runs the portable `node scripts/run-tests.js` entrypoint. Install dependencies before using the source CLI. The archive bundles the existing MIT-licensed `cli-spinners` 3.4.0 production dependency.

## Local install

Install the generated archive into a chosen local project. Replace the archive path below with the relative path to the archive you built:

```sh
npm install --offline --no-audit --no-fund ../vasirml/vasir-slim-0.1.0-slim.2.tgz
./node_modules/.bin/vasir --version
./node_modules/.bin/vasir context --json --repo-root .
```

With pnpm, use `pnpm add --offline ../vasirml/vasir-slim-0.1.0-slim.2.tgz` and `pnpm exec vasir --version`. The packed archive supports offline installation; building from a fresh source checkout requires installing its declared dependency first.

For subsequent local commands, use `npm exec -- vasir ...`, `pnpm exec vasir ...`, or invoke the installed shim directly. In Windows PowerShell the direct shim is `./node_modules/.bin/vasir.cmd`.

For a global CLI installation:

```sh
npm install -g --offline --no-audit --no-fund ./vasir-slim-0.1.0-slim.2.tgz
vasir --version
```

Installing the global CLI does not automatically install skills or contracts into any project. Run `vasir init` or `vasir add` in each target project. A direct Git installation requires dependency resolution and currently selects the review branch:

```sh
npm install -g "git+https://github.com/kosta-blank/vasirml.git#reviewed-skills-and-groups"
```

## Use

```sh
npm exec -- vasir context --json --repo-root /path/to/project
npm exec -- vasir add plan-maintain-work-spec --repo-root /path/to/project
npm exec -- vasir add all --repo-root /path/to/project
npm exec -- vasir agents sync --dry-run --repo-root /path/to/project
npm exec -- vasir agents sync --repo-root /path/to/project
npm exec -- vasir agents validate --json --repo-root /path/to/project
```

`add` copies requested skills and establishes normal project state. `init` and `update` also maintain the standard user catalog cache under `~/.agents/vasir`; use an isolated home when verifying them. The supplied `.agents/vasir.json` preserves this source project's model routing as an example and is not automatically applied to consumer projects. Consumers choose their own routing.

## Start and maintain a project

Run these commands from a target project root after installing the CLI:

```sh
npm exec -- vasir init
npm exec -- vasir agents sync
```

`init` syncs the bundled catalog into `~/.agents/vasir`, copies the skills into `.agents/skills/`, creates config and install state, creates host skill links, and seeds missing root contracts. `agents sync` selects an inferred or explicit `frontend`, `backend`, `ios`, or `generic` profile, fills purpose and routing from project context, and injects the sidecar into Section 2. It validates both twins and their 32 KiB limits before writing. Edit `AGENTS__non-obvious.md`, then rerun `agents sync`.

```sh
npm exec -- vasir status
npm exec -- vasir context --json
npm exec -- vasir diff
npm exec -- vasir update --dry-run
npm exec -- vasir update
npm exec -- vasir agents sync --dry-run
npm exec -- vasir agents validate
npm exec -- vasir doctor
npm exec -- vasir repair
```

`update` refreshes tracked skills after a CLI upgrade and fails closed on local edits. `adopt` records an existing current-catalog skill tree without copying or overwriting its files. Config and the sidecar are authored; root contracts and `.agents/vasir-install-state.json` are managed. Older sidecar layouts can seed the root sidecar, and dirty global caches are backed up before being rebuilt. See the [CLI reference](docs/cli-reference.md) for exact ownership and repair behavior.

## Root, nested root, and folder contracts

Use root sync for project-wide rules. Use `--scope` only when a subfolder is a nested application or package root:

```sh
npm exec -- vasir agents sync --profile generic
npm exec -- vasir agents sync --scope apps/web --profile frontend
npm exec -- vasir agents sync --scope services/api --profile backend
npm exec -- vasir agents validate --scope apps/web
```

Scoped sync writes a sidecar and generated `AGENTS.md`/`CLAUDE.md` pair inside the selected app or package. Ordinary folder `AGENTS.md` files are authored directly as steering maps: folder ownership, entrypoints, hazards, constraints, proof commands, and deeper maps.

Do not use `vasir agents sync --scope` for ordinary folder steering maps. Use `agents-creating-folder-agents` or edit the folder `AGENTS.md` directly. `--repo-root` instead changes the managed project root, including skills, config, and install state.

## Persistent model routing

Optional role choices belong under `agents.modelRouting` in `.agents/vasir.json`. Codex and Claude policies support `default`, `planning`, `execution`, `subagent`, `review`, and `design`, with optional effort, host, and a single explicit fallback. Sync projects those choices into both root contracts and preserves them across profile and skill-tracking changes. It does not switch a running main chat's model.

The host validates model availability and supported effort, applies explicit user choices first, and executes any authorized delegation or handoff. Use only a configured fallback if a route is unavailable. See [persistent routing contracts](docs/project-model-routing.md), the [project example](docs/example-agents.md#model-routing), and [complete JSON example](templates/agents/model-routing.example.json).

## Named skill groups

Named groups are a shortcut for selecting skills. Repeated `--group` flags combine their members into a deduplicated union, and you can mix individual skill names with groups. Group selection does not select an AGENTS profile or model routing. Use `--agents-profile frontend` explicitly when you want the optional frontend root-contract scaffold.

```sh
npm exec -- vasir groups
npm exec -- vasir groups --json
npm exec -- vasir add --group base --group frontend --repo-root /path/to/project
npm exec -- vasir add code-auditing --group frontend --repo-root /path/to/project
npm exec -- vasir add --group frontend --agents-profile frontend --repo-root /path/to/project
```

Groups expand to tracked individual skill snapshots when you run `add`. Later `update` refreshes the tracked skills; editing a group definition does not automatically install new group members. To select current members when some are already installed, run `npm exec -- vasir add --group <name> --replace --repo-root /path/to/project`. Replacement succeeds for unchanged tracked files; local edits still block replacement. Use `update` for routine refreshes. `remove` remains per-skill. `all` cannot be combined with groups or individual skills.

For a globally installed CLI, use the same commands directly: `vasir groups` and `vasir add --group base --group frontend --repo-root /path/to/project`.

Group definitions live in the repository's root `skill-groups.json`. To add a named group, add a key under `groups` with a `description` and a `skills` array of canonical IDs from the catalog; to edit a group, change those fields. Keep `schemaVersion: 1`, use lowercase hyphenated group names, and list each member once. The CLI validates definitions against the bundled registry before installing. This changes selection metadata without editing any skill content. Install dependencies with `npm ci` first. After editing definitions, update the documented memberships below and in `docs/catalog.md`, rebuild the registry, run `node bin/vasir.js groups` to inspect the result, and use `npm pack` to create an archive with your definitions.


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

## Source and checks

The source repository includes CLI, templates, reviewed skills, documentation, regression tests, group definitions, generators, and a Git ignore file. Install dependencies with `npm ci` before running the CLI or tests. Run `npm test` (or `node scripts/run-tests.js`) for the complete suite; use `node --test test/project-install-state.test.js test/skill-groups.test.js` for focused Windows nested-file safety and named-group checks.

After changing templates, skills, packaged docs, groups, or package metadata, regenerate agent templates before the registry:

```sh
npm run build:agents
npm run build:registry
npm run build:review
npm run check:agents
npm run check:registry
npm run check:review
npm test
npm pack
npm run check:package -- ./vasir-slim-0.1.0-slim.2.tgz
```

`registry.json` inventories local skills and includes the package version in its header. `.vasir-catalog-manifest.json` hashes `registry.json`, `.agents/skills/`, and `templates/`; documentation and group definitions are not catalog hash inputs. `SKILL.md` is the primary skill source; `meta.json` remains a compatibility fallback. CI installs with `npm ci`, checks both projections, tests representative supported Node versions on Linux, Windows, and macOS, and validates package contents. Tag and manual release runs produce a downloadable archive artifact without npm publication.

## Migrating the older catalog

The original 66-skill catalog was narrowed to 38 active reviewed skills. The selected sources and imports received 39 completed reviews, including the custom project planner; consolidating two frontend skills into one produced the final 38. Old underscore-style IDs such as `code__fixing-bugs` are not CLI aliases; use `code-fixing-bugs` and the [reviewed catalog](docs/catalog.md). Removed or merged skills do not imply a one-to-one automatic rename.

The [review evidence guide](docs/review/README.md), [interactive skill map](docs/review/skill-map.html), and [change tracker](docs/review/change-tracker.json) document the review history and final skill hashes. Recommendation tiers in the map and tracker are review metadata; the CLI's actual named installation groups are `base` and `frontend`, defined in root `skill-groups.json`.

Before migrating an existing project, back up edited skills, config, install state, and authored or generated contracts. The safest path is to initialize a separate fresh project tree with this release, select the desired groups or canonical skills, and reconcile local customizations there. For an in-place migration, inspect `vasir status`, `vasir diff`, and `vasir update --dry-run`; explicitly remove obsolete tracked skills using the release that recognizes their old IDs, then select canonical skills with the new CLI. Use `vasir adopt` only when deliberately adopting an existing tree of current-catalog canonical IDs; it records matching files and reports unknown directories as unmanaged.

No automatic destructive cleanup, underscore-ID conversion, or overwrite of locally edited skills is provided. `--replace` does not bypass local-edit protection. Resolve or preserve customizations explicitly before replacement, and update contract routes that reference removed skills.

## Skill evaluations

The CLI retains the eval workflow. Reviewed skill content does not include built-in eval suites; provide a skill-owned `evals/suite.json` in your own project before running an eval. See [skill authoring](docs/writing-skills.md) and the [CLI reference](docs/cli-reference.md#eval).

```sh
npm run eval -- testing-enforcing-mandate mock
npm run eval -- inspect testing-enforcing-mandate
npm run eval -- rescore testing-enforcing-mandate
```

Provider credentials can live in repository-root `keys.json`; start from [keys.json.example](keys.json.example). Mock evaluation needs no provider credentials. Saved runs live in the target project's `.agents/vasir-evals/` tree.

See [CLI reference](docs/cli-reference.md), [troubleshooting](docs/troubleshooting.md), [AGENTS examples](docs/example-agents.md), and [reviewed catalog/profiles](docs/catalog.md). Runtime error documentation links resolve to the installed local documentation. Historical external build manifests remain outside the runtime package; public review evidence lives in `docs/review/`.

See also the [template guide](templates/agents/README.md), [create a skill](docs/create-your-first-skill.md), [skill layout reference](docs/skill-reference.md), and [manifesto](MANIFESTO.md).

Vasir copyright (c) 2026 Erik Hazzard, MIT; see [LICENSE](LICENSE) and [provenance](PROVENANCE.md). Reviewed adaptations and the custom planner retain their original skill attribution. The derived source is maintained at [kosta-blank/vasirml](https://github.com/kosta-blank/vasirml).
