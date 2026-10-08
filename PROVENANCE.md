# Provenance

Derived from [Vasir](https://github.com/erikhazzard/vasir), copyright (c) 2026 Erik Hazzard, MIT. The original [LICENSE](LICENSE) is preserved. The derived source repository is [kosta-blank/vasirml](https://github.com/kosta-blank/vasirml); the upstream link records origin rather than the current reviewed catalog.

The original 66-skill catalog was narrowed to 38 active reviewed skills. There were 39 completed reviews of selected sources and imports, including the custom project planner; the approved consolidation of two frontend skills into one produced the final 38. Accepted skill bytes come from the reviewed portable export. Original skill attribution is retained. Canonical hyphenated identifiers are used for directories and CLI selection; prior underscore identifiers record provenance and are not CLI aliases.

The public [review evidence guide](docs/review/README.md) and [change tracker](docs/review/change-tracker.json) record the review history and final checked-in skill hashes. Recommendation tiers are separate from the `base` and `frontend` installation groups. The external release build manifest remains local historical evidence of source and transformation hashes.

The CLI, AGENTS/CLAUDE generation, persistent model routing, documentation, tests, and development workflows retain the upstream implementation plus the derived repository changes. Historical model-routing evidence is preserved in [the implementation work spec](docs/work/agents/project-model-routing/work-spec.md); its verification describes the earlier source snapshot, not the current release checks.

The private package `vasir-slim` version `0.1.0-slim.2` is distributed by packed archive. Its unchanged production dependency, `cli-spinners` 3.4.0, is bundled with its own MIT license. Named installation groups select catalog members without altering accepted skill content.
