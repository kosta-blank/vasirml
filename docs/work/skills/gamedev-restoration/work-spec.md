# Restore the excluded game-development skills

Status: Objectively Green

## Outcome and scope

Make all 29 skills excluded from the focused ML/engineering review available through the existing CLI in a `gamedev` installation group. Users can inspect that group, install it alone, or compose it with `base` and `frontend`. The catalog grows from 38 to 67 canonical skills; the three-group union contains 45 skills.

This is PR2, based on PR1's `reviewed-skills-and-groups` branch while PR1 remains open. The existing 38 reviewed bundles must retain their exact bytes. There are still 39 completed source/import reviews. The restored skills have pending content review; restoration does not establish behavioral quality or introduce completed review decisions.

## Source and transformations

The original inventory contains 66 top-level skills and one nested MMO whitepaper skill. Comparing it with the 38 selected original skills yields 28 game-related skills and one social-loop skill. All 29 belong to `gamedev` under the requested scope.

Copy the complete inventoried bundles. Normalize source skill identifiers to canonical hyphenated identifiers, update identifier references, translate `tools` frontmatter to `allowed-tools`, and remove host-specific model pins from frontmatter. Keep original IDs, metadata, file hashes, and transformations in `registry/gamedev-imports.json`. Expose the nested whitepaper as a top-level selectable skill and retain its reference copy inside genre routing.

Correct four unambiguous reference filename mismatches to existing bundled files. Six game-QA reference documents are absent from the original tree, source archive, and original tracked source. Preserve and record those missing references; their content is unavailable for restoration.

## Acceptance evidence

- `vasir groups gamedev` lists exactly the 29 restored skills; existing group membership stays unchanged.
- `vasir add --group gamedev` installs the complete 29-bundle snapshot, including nested references and the standalone whitepaper.
- Composing `base`, `frontend`, and `gamedev` installs their 45-skill union without duplicates and retains existing update/replace protections.
- All 81 files in the existing 38 bundles match PR1; imported files match their recorded transformation hashes.
- Generated registry, catalog manifest, and review projections are current. The map and tracker distinguish 38 reviewed entries from 29 pending imports.
- The regression suite and offline packed-archive CLI journeys pass. An independent review covers the combined diff and evidence before publication.

README, provenance, and catalog documentation describe the restored scope and installation commands. No new dependencies or automatic AGENTS profile selection are needed.

## Verification

All 210 regression tests pass on Windows with Node 18.20.0 and Node 24.19.0. The final reference-only fixes also pass the 16 catalog/layout/renderer tests. An offline packed archive passes 20 checks through 38 real installed CLI commands, including the 29-skill gamedev install and 45-skill group union. Registry, template, and public review projections are current.

Raw Git blob comparisons against PR1 confirm all 81 reviewed files are unchanged. Original source hashes and transformed destination hashes verify all 144 imported files. Independent review identified two legacy skill references; their canonical replacements and path correction are recorded in the import manifest and verified after repair. No behavioral game-building trials or live provider calls ran. The missing game-QA source references and inherited Studio-specific assumptions remain pending content-review limitations. Linux/macOS checks run in CI.
