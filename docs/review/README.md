# Skill catalog and review status

The active catalog contains 67 canonical skills and 225 files: 38 reviewed skills and 29 restored source imports pending content review. 39 source reviews were completed; two reviewed frontend source bundles were replaced by the approved frontend foundation. The custom milestone planner and consolidated foundation retain their provenance.

Browse the [interactive map](skill-map.html), [catalog metadata](catalog.json), or [change tracker](change-tracker.json). Skill links point to the current repository files. The HTML map is a standalone read-only page; open it in a browser after cloning or downloading the repository.

Selection tiers contain 13 Core, 39 Optional, and 15 Outside pack skills. These are recommendations for an ML/engineering management workflow, with 7 explicitly recorded Optional selections; remaining tiers come from the shortlist or coordinator recommendation. All 67 skills remain available. These tiers differ from the install groups in [skill-groups.json](../../skill-groups.json), which contain 11 base, 5 frontend, 29 gamedev, 22 miscellaneous skills. The gamedev group includes all 29 previously excluded game and social-loop skills; it does not add dependencies automatically. Tiers select neither installations nor AGENTS profiles. Software proof does not establish ML model quality.

Public curation lives in [registry/review-metadata.json](../../registry/review-metadata.json). Update its labels, summaries, grouping, or tier basis when agreed decisions change. The generator reads the current skill descriptions, text, file inventories, and hashes directly from the repository. It needs no external review workspace, transcript archive, installed skill copies, or provider calls.

After changing skills or curation, run:

```sh
node scripts/build-review-catalog.js --write
node scripts/build-review-catalog.js --check
```

Generation is deterministic. The tracker distinguishes historical source/import hashes from current canonical bundle hashes; consolidation has no invented baseline. The files distinguish completed reviews and accepted changes from source imports whose content review is pending. Import transformations and missing source references are recorded in [registry/gamedev-imports.json](../../registry/gamedev-imports.json). They omit original audit proposals, private review conversations, and deferred trial instructions. They describe content review and catalog integrity, not measured behavioral skill performance.
