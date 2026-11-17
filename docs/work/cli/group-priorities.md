# Domain groups and install priorities

Status: Complete

Outcome: install the agreed overlapping domain groups and start new projects with 20 frequent skills. Scope: metadata, CLI defaults/help, docs, packaging and proof. Existing selections and all skill content are preserved; game membership is unchanged. No publication or global CLI replacement.

Contract: seven groups cover 67 canonical skills with shared IDs; Tier A20/B18/C29 partition the catalog. Fresh init chooses A, reruns preserve selection, group add deduplicates members. Retired base/misc names require updated commands, not skill-file migration.

Acceptance: validate metadata; test fresh and existing init, overlap and edited-file protection; verify the packed archive; independent review; generated checks.

Evidence: all 214 tests passed on Windows. Final archive verification passed 21 checks across 49 commands, including isolated offline install, fresh Tier A init, overlap, tracking, and modified-file protection. Agent/registry/review generated checks and diff whitespace checks passed. Independent static review found two documentation/help issues, both corrected: post-init replacement guidance and reduced-catalog priority overrides. Sandbox junction restrictions required running fixture tests outside the sandbox; no global CLI was replaced.
