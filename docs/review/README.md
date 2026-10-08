# Reviewed skill catalog

The active catalog contains 38 canonical skills and 81 files. 39 source reviews were completed; two reviewed frontend source bundles were replaced by the approved frontend foundation. The custom milestone planner and consolidated foundation retain their provenance.

Browse the [interactive map](skill-map.html), [catalog metadata](catalog.json), or [accepted change tracker](change-tracker.json). Skill links point to the current repository files. The HTML map is a standalone read-only page; open it in a browser after cloning or downloading the repository.

Selection tiers contain 13 Core, 10 Optional, and 15 Outside pack skills. These are recommendations for an ML/engineering management workflow, with 7 explicitly recorded Optional selections; remaining tiers come from the shortlist or coordinator recommendation. All 38 skills remain available. These tiers differ from the install groups in [skill-groups.json](../../skill-groups.json), which contain 11 base and 5 frontend skills. Tiers select neither installations nor AGENTS profiles. Software proof does not establish ML model quality.

Public curation lives in [registry/review-metadata.json](../../registry/review-metadata.json). Update its labels, summaries, grouping, or tier basis when agreed decisions change. The generator reads the current skill descriptions, text, file inventories, and hashes directly from the repository. It needs no external review workspace, transcript archive, installed skill copies, or provider calls.

After changing skills or curation, run:

```sh
node scripts/build-review-catalog.js --write
node scripts/build-review-catalog.js --check
```

Generation is deterministic. The tracker distinguishes historical source/import hashes from current canonical bundle hashes; consolidation has no invented baseline. The files record accepted content changes and review completion, without original audit proposals, private review conversations, or deferred trial instructions. They describe content review and catalog integrity, not measured behavioral skill performance.
