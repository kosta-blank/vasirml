# Base initialization and skill discovery

New projects should start with the base skills and let users choose additional workflows by group or canonical skill ID.

**Status:** Complete. User authorized implementation on 2026-10-10.

**Scope and acceptance:**

- Fresh repo `vasir init` installs the exact `base` group and tracks a selected snapshot. Repeated initialization preserves existing selected or full-catalog tracking and user edits remain protected.
- `miscellaneous` contains the 22 skills outside base, frontend, and gamedev. The four groups cover all 67 catalog skills without duplicates.
- `vasir skills [group...] [--json]` lists canonical IDs, group memberships, and whitespace-normalized descriptions of at most 160 characters. It reads the effective catalog without creating cache or project files. Unknown groups fail clearly.
- `vasir add --group <name>` remains the way to expand a project; `vasir add all --replace` explicitly selects the full catalog after init while retaining edit safeguards.
- CLI help, setup guidance, catalog docs, package smoke checks, and focused regression tests agree with the new behavior.

**Decisions:** Keep `vasir list` and its complete metadata unchanged. The new short-description command uses existing skill descriptions with word-boundary truncation. Existing projects are not pruned. Effective local catalog overrides may supply their own group definitions.

**Evidence:** On Windows / Node 24.19.0, focused tests passed 100/100 and the full regression suite passed 213/213. Run the full suite with `VASIR_TEST_NPM_CLI` pointing at an available `npm-cli.js`, then `node scripts/run-tests.js`. Generated agent-template, registry, and review-catalog checks pass. Final offline archive verification passed 21 checks across 48 commands, including base-only init, group expansion, expanded selected-policy re-init, explicit all selection, read-only skill discovery, and local-edit protection (`tmp/base-init-package-check.txt`; regenerate with `node scripts/verify-package.js` and the npm CLI variable). Independent static review found no material defects; its suggested expanded-selection re-init regression is included and passes.

The global CLI was upgraded offline from the verified archive, with lifecycle scripts disabled. The actual global shim reports `vasir-slim 0.1.0-slim.3`; `groups --json` reports 11 base, 5 frontend, 29 gamedev, and 22 miscellaneous skills, and `skills base` renders concise descriptions. Source checkout: `skill-review/pr-vasirml` (started from installed 0.1.0-slim.2 source). Archive: `vasir-slim-0.1.0-slim.3.tgz`; SHA-256 `BF9A8F6E926122EDC3CC8942A9138053618F262CF9EF7E4C4679F3D69595BA13`.

**Delivery:** Changes are ready for use through the upgraded global CLI. Existing projects retain their selections. No repository push or external publication was requested.
