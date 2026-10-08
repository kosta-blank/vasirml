# Reviewed skills and CLI groups

**State:** Complete

**Outcome:** Integrate the completed local Vasir Slim release into `kosta-blank/vasirml` and open a reviewable pull request so the owner can install the maintained CLI and reviewed collection from Git.

## Scope and decisions

- Ship exactly 38 active reviewed canonical skills and their 81 accepted files, including the approved frontend consolidation and custom milestone planner.
- Carry the completed shared AGENTS/CLAUDE templates, scoped model routing with configured fallbacks, root-contract validation, and documented regeneration workflow.
- Ship explicit `base` (11) and `frontend` (5) group selection, individual-skill mixing, deduplication, fail-before-write validation, and tracked snapshot behavior.
- Retain the Windows nested-file inventory fix and its four regression cases.
- Preserve repository history, upstream tooling, branding, license, and meaningful regression coverage. Adapt obsolete catalog assumptions to the reviewed collection without weakening runtime contracts.
- The package remains private `vasir-slim` version `0.1.0-slim.2`; its repository now points to this maintained fork. Downloadable archives replace npm publication in the release workflow.
- Old double-underscore names are provenance identifiers, not runtime aliases. There is no automatic migration or deletion of existing consumer skill trees; document a safe migration preserving edits.
- Track portable review metadata without publishing workstation paths or private review-chat transcripts.

## Boundaries

No merge, npm publication, tag creation, global installation, behavioral skill trials, live provider calls, or deferred trial reminders. Existing source and local release archives stay unchanged. GitHub branch publication and PR creation are explicitly requested by the owner.

## Acceptance evidence

1. The 38-skill/81-file tree matches the accepted local release byte-for-byte; no unreviewed catalog entries ship.
2. The full maintained regression suite passes through `npm test`; package installation and Windows shim execution use actual npm and deterministic fixture evals.
3. Template and registry projections pass their generators' check modes; root AGENTS validation passes.
4. An actual npm-packed archive supports the reviewed catalog, base/frontend install, update, modified-file refusal, and per-skill removal through installed CLI entrypoints.
5. An independent reviewer inspects the combined diff in clean context and resolves actionable findings before publication.
6. A branch is pushed without rewriting shared history; the PR targets `kosta-blank/vasirml:main` and is attached to this chat.

## Risks and limits

The reviewed-only catalog and canonical IDs are an intentional compatibility change. Local checks cover Windows with Node 18.20.0, 20.10.0, and 24.19.0; Linux/macOS CI results are separate. The map's generator and deterministic interactions pass; rendered browser QA was unavailable. Skill review acceptance is not a model-quality benchmark or live model-failover test.

## Progress

- Fresh clone based on `7b75caa29f2ff5165aa445282caada233b07f611`; isolated branch `reviewed-skills-and-groups`.
- Accepted release integrated while preserving upstream infrastructure and all existing test files.
- GitHub access verified using existing configured credentials without displaying or storing secrets.
- Full `npm test`: 206 tests passed on each of the three Windows runtimes. Agent, registry, and public review projections pass their check modes; root contracts validate.
- The same npm-packed archive passes 35 installed CLI commands and 18 offline checks on each runtime. Its 38-skill/81-file tree matches the accepted release exactly.
- Git blob verification preserves all 81 accepted skill files and all 90 catalog/template files. Four previous local archives remain unchanged.
- Resolved review finding: preserve accepted CRLF snapshots through Git rather than normalizing their bytes. Resolved runtime regression: avoid experimental JSON-module warnings contaminating error JSON on supported Node lower bounds; two real-process regression tests reproduce the prior failure and pass after repair.
- Independent review is clear with no remaining actionable findings. See [verification.json](verification.json) for the durable evidence summary.
- Branch published and [PR #1](https://github.com/kosta-blank/vasirml/pull/1) opened against `main` and attached to the requesting chat. No merge or npm publication occurred. Linux/macOS CI is recorded separately from the completed local checks.
