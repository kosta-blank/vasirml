# Persistent project model routing

Author optional model choices in `.agents/vasir.json` under `agents.modelRouting`, then run `vasir agents sync`. The configuration is persistent project policy; generated `AGENTS.md` and `CLAUDE.md` are projections. Skill selection and AGENTS stack profiles are independent of model routing. Neither installing a named skill group nor changing a profile selects a model.

Use the [complete configuration example](../templates/agents/model-routing.example.json) as an editable starting point, merging the `agents.modelRouting` field into an existing project config rather than replacing its tracking settings. The source repository's configured choices are examples and are not automatically installed in consuming projects.

## Configuration contract

- `schemaVersion` remains `1`; configurations without model routing remain valid.
- Policies are keyed by consumer host, `codex` or `claude`.
- Each policy supports `default`, `planning`, `execution`, `subagent`, `review`, and `design`.
- A role descriptor requires `model` and may contain `reasoningEffort`, `host`, and one explicit `fallback` descriptor. A fallback cannot contain another fallback.
- A primary descriptor without `host` uses the current consumer; a fallback without `host` uses its primary descriptor's host.
- An omitted role inherits the configured host default, otherwise the host's current settings. No fallback is inferred.

For nested app or package root contracts, `vasir agents sync --scope <path>` overlays host and role entries from ancestor configs through the scoped `.agents/vasir.json`. The nearest explicit role wins. A scope replaces the entire role descriptor, including effort, host, and fallback, so a child model does not accidentally retain a parent fallback. Scoped sync leaves ancestor config untouched.

Profile and skill-tracking updates preserve configured routes. Synchronization is deterministic and makes no model calls. Invalid config and dry-run synchronization do not write generated roots, sidecars, or config. Both generated roots must still satisfy contract validation and their 32 KiB limits; consumer routing blocks may differ while universal policy agrees.

## Host execution contract

An explicit user model or effort choice takes precedence. Vasir validates descriptor structure; the executing host validates model availability and supported effort. Configuration text does not switch a running main chat's model, write host runtime settings, change permissions, or authorize additional actions.

Cross-host routes require an available, authorized runner, handoff, or delegation. Use the model selector belonging to the selected host. If a host, model, or effort is unavailable, use only its configured fallback and disclose the original choice, selected fallback, and reason. If no fallback exists or it is also unavailable, report the limitation. Do not invent another route or retry indefinitely.

The `design` role covers design deliverables and decisions, including product, UI/UX, visual, interaction, and architecture design. Routine implementation uses `execution`. Independent review should use clean context separate from the implementation conversation.

## Inspect and verify

```sh
vasir agents sync --dry-run
vasir agents sync
vasir agents validate --json
vasir agents sync --scope apps/web --dry-run
```

See the [CLI reference](cli-reference.md#agents-sync), [consumer example](example-agents.md#model-routing), and [historical implementation evidence](work/agents/project-model-routing/work-spec.md). Historical checks cover schema, rendering, preservation, and scoped inheritance; live model availability and runtime failover require host-level verification.
