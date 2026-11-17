# Install priority tiers

Status: Complete

Outcome: select the agreed A/B/C skill sets with `vasir add --tier` rather than enumerating IDs. User requested implementation, documentation, and publication to Git.

Contract: read the same validated priority metadata as fresh init; A20/B18/C29 unchanged. Accept repeated case-insensitive tier flags, mixed groups and IDs, preserving argument order and deduplicating. Reject malformed selections, all-selector conflicts, and invalid definitions before mutation. Empty custom tier unions must not activate interactive selection or imply all. Use existing add tracking and replacement safeguards: tier adds produce selected snapshots, including switching a prior full-catalog tracker to selected while retaining installed IDs. Expose selectedTiers in JSON.

Acceptance: real CLI tier/mixed-selection installs, no-mutation errors, source overrides, edited-file protection, fresh Git-install proof, packed artifact verification, docs and independent review. Global CLI may be updated after proof; no user project selections are changed.

Evidence: all 230 repository tests passed on Windows, including 34 focused selector/CLI tests and a fresh global Git installation that adds Tier B after init. Archive verification passed 23 checks across 59 commands, including exact A/B/C bundles, mixed selectors, and invalid selection handling. Generated agent/registry/review checks and whitespace checks passed. Independent review found no release blockers; its documentation corrections for re-enrolling full-catalog tracking were applied. Tests requiring Windows directory links ran outside the sandbox in isolated fixtures. No real project skill selection was changed.
