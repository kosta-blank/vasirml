# Remove Vasir from projects

Status: Complete

Outcome: one command removes project-local Vasir installations from an explicit list of project directories. The user chose complete project removal rather than reinstalling defaults. No real project targets have been supplied; implementation and isolated verification are authorized.

Contract: `vasir uninstall [project-path...] [--repo-root path] [--dry-run] [--json]`. Resolve and preflight all targets before mutation; reject conflicting or nested target paths. Use install-state ownership for skills, identify generated contracts, and remove only aliases targeting the project's skill tree. A tracked skill directory is the removal unit: edits and added files inside that bundle move together to backup. Preserve unrelated files elsewhere and separate untracked skill directories. Move owned content into a timestamped `.vasir-backups` directory and record a manifest before removing live paths. Do not alter the global CLI or global catalog. A dry run writes nothing. A repeated uninstall is a no-op; ambiguous legacy ownership fails with guidance.

Risks: Windows junctions and linked ancestors must never redirect removals outside the selected root. Reject invalid state paths. A failed batch may have completed earlier projects, so evidence must identify each completed backup; do not promise batch atomicity across filesystem failures.

Acceptance: real CLI proof of single and multiple projects, no-mutation preview, all-target preflight, edited managed content recovery, unrelated-content preservation, alias safety, malformed/traversing state rejection, and repeated execution. Run repository regression checks and an independent review before delivery.

Evidence: all 223 repository tests passed on Windows, including 14 focused uninstall/state/style checks. The final packed archive passed 22 checks across 54 CLI commands, including batch preview, removal, edited skill backup, custom skill preservation, and no-op repeat. Agent/registry/review projections and whitespace checks passed. An independent review found no remaining material blocker after fixes for explicit-target parsing, alias equivalence, Windows case collisions, partial-removal ordering, legacy contracts, and evaluation-history backup. Case-sensitive NTFS was not provisioned for direct verification. Path checks assume no adversarial ancestor swap between validation and mutation. No actual user projects were uninstalled. User will run the command; publication to Git is explicitly requested.
