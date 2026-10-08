---
name: code-crafting-dev-ux
description: Design or review developer-facing APIs, SDKs, configuration, errors, events, and CLIs for shared libraries and internal tools. Use when creating or changing how colleagues or coding agents find, use, debug, and upgrade these surfaces. Owns interface ergonomics; ML evaluation and project planning remain separate workflows.
---

# Dev UX Skill

## Mission

Create a **Pit of Success**: correct usage is the default path; misuse requires deliberate effort; semantics are explicit; upgrades are survivable. Humans and LLMs should select the right surface and generate correct usage from its types, documentation, and examples.

**Dev UX = Surface + System.** An API also needs a clear path to discovery, first success, diagnosis, and evolution.

### Four green tests

1. **Role-expressiveness:** from signature/types and a common-case example, a consumer can infer the call, result shape, and likely failures.
2. **Findability:** stable entrypoints and search-friendly names make the correct capability easy to locate.
3. **First success:** a runnable quickstart states prerequisites and expected output.
4. **Debug story:** failure context leads to an actionable cause; distributed work exposes identifiers linking errors to logs/traces.

For an ordinary local setup, aim for finding the entrypoint within two minutes and first success within five. State prerequisites and setup constraints; report measured timings only when observed.

**Pit scale:** 🟢 obvious and safe · 🟡 usable with sharp edges · 🔴 confusing · ⛔ the easy path is wrong. Use evidence for grades; mark unassessed journeys explicitly. Redesign an easy path that produces incorrect or unsafe behavior before shipping; prioritize other gaps by consumer impact.

## 0) Scope & Output Mode

Identify the affected consumers and public surface before choosing a mode.

**Change class:**
- `NEW_BOUNDARY`: a new module, SDK, CLI, API, or event family.
- `NEW_PUBLIC_SURFACE`: a new export, schema, or command.
- `MODIFY_PUBLIC_SURFACE`: changed behavior, semantics, options, errors, or compatibility.
- `MECHANICAL_CHANGE`: verified absence of externally observable behavior or compatibility changes.
- `HOT_PATH_TWEAK`: performance, allocation, or logging-sensitive work; state whether it also changes public semantics.

A public rename, type change, or refactor can break consumers. Classify it by its actual effect, including imports, serialization, exceptions, and documented behavior.

**Modes:**
- `FULL`: new surfaces or semantic/compatibility changes. Cover the relevant design decisions; depth follows risk and uncertainty.
- `LIGHT`: mechanical changes, or hot-path work with demonstrated unchanged semantics and compatibility. Cover compatibility, example drift, and focused verification; include performance evidence for hot paths.
- `AUDIT`: requested review of existing surfaces. Assess what exists and recommend fixes without modifying it.

State class and mode briefly. Unresolved semantics or compatibility calls for FULL; the mode does not impose a report length.

## 0.5) Audit Mode

Take the perspective of a consumer unfamiliar with the implementation. Re-derive claims from the scoped code, types, examples, and applicable repository contracts; distinguish author claims from evidence.

- Review the affected surfaces against the four green tests, §2, and applicable §3 rows.
- Each actionable finding names the consumer journey, evidence (symbol and file:line where available), consequence, smallest useful fix, and evidence needed to close it.
- An easy path producing incorrect or unsafe behavior is a blocker for that journey. Set other severities by likelihood and blast radius; color alone does not establish P0/P1.
- Keep recommendations separate from observed behavior. Explain checks not run and limits of the assessment.
- Leave audited surfaces unchanged. Use chat or an existing review artifact; write a separate report only when requested or required by the repository's established review workflow.

Independent review can help for high-risk changes when authorized. This skill does not require delegation, a particular report directory, or a separate release-gate skill. A verdict is a recommendation based on the inspected scope.

## 1) Consumer Walkthrough & Design Brief

For FULL design work, build one consumer walkthrough before implementation. Reuse it as the design brief, examples, and verification input instead of repeating it in separate reports. State consequential assumptions; consult the existing contract or owner where missing information changes the design.

Cover what matters to the surface:

- **Purpose and consumers:** outcome, human skill level, coding-agent use, boundary type, common use case, and likely misuse.
- **Find and start:** canonical import/command, search terms, related capabilities and anti-goals where useful, prerequisites, runnable common case, and expected result.
- **Continue:** next operation, advanced options where needed, resource ownership, and cleanup/shutdown.
- **Fail and recover:** likely mistake, actual error contract, next action, and diagnostic context.
- **Semantics and constraints:** relevant §7 contracts, defaults/validation, performance and security constraints, compatibility, and cross-runtime parity.
- **Maintain:** concepts added/removed, owner/stability, proportionate enforcement, verification evidence, and useful feedback signals.

Omit inapplicable items. A small surface may fit in a few paragraphs plus an example. AUDIT uses §0.5; LIGHT needs only evidence for its limited scope.

## 2) Interface Invariants

1. **Progressive disclosure:** keep the common call simple; expose options and composable primitives as complexity warrants.
2. **Structural misuse prevention:** constrain invalid states with types, enums, and schemas before relying on prose.
3. **Defaults are policy:** use safe defaults; make additional risk or cost explicit.
4. **Errors support recovery:** stable codes, meaningful context, a concrete next action, and safe redaction.
5. **Boundary validation:** fail early with actionable errors; validated internals need not repeat checks (hot paths: §9).
6. **Stable public entrypoints:** callers should not need deep imports or internal implementation knowledge.
7. **Findability:** predictable domain names and a small capability index for non-trivial domains.
8. **First success:** runnable examples with expected results and explicit prerequisites.
9. **Debuggability:** diagnostic context appropriate to the failure; correlation identifiers for distributed or asynchronous work.
10. **Evolution:** prefer additive changes; breaking changes need the migration support in §12.
11. **Ecosystem consistency:** preserve established naming, return shapes, error codes, and lifecycle patterns.
12. **Truth maintenance:** check examples and schemas against reality with appropriate executable checks (§15).
13. **Enforceability:** use existing lint, templates, or CI hooks for consequential standards.
14. **LLM usability:** public types and examples expose provenance, return shape, and errors without tribal knowledge (§11).

## 3) Minimum DX Stack by Interface Type

Apply the relevant row using the repository's language and conventions. Combine rows when a surface crosses boundaries.

| Interface | Relevant requirements |
|---|---|
| Public function/method | Precise types, simple common call, boundary validation where needed, explicit effects/results/failures, runnable example and misuse recovery |
| Module / SDK / shared library | Canonical entrypoint, public/internal distinction, quickstart, consistent results and lifecycle, related capabilities and capability index when useful |
| Config/options | Defaults, precedence, schema and unknown-field policy, units, fix suggestions, secret sourcing, example config, evolution |
| Error model | Stable taxonomy, human message, safe structured context, recovery guidance, retry safety, boundary mapping, diagnostic identifiers where available |
| Event/message | Envelope/version, schema and example payload, delivery/ordering semantics, evolution, consumer validation hooks |
| Network API | OpenAPI or equivalent contract, pagination/filter conventions, Problem Details errors where applicable, auth, idempotency/timeouts/retries, migration |
| CLI | Common case with minimal required input, help, documented exit codes, structured output for automation, config precedence, dry-run/explain for risky actions, doctor/validate where useful |

Reproducibility-sensitive experiment or data tools should expose relevant seed, clock, source-version, and ordering choices in their contract. Do not infer model quality or experimental validity from interface determinism.

## 4) Progressive Disclosure

Call-site complexity should follow use-case complexity:

- **Level 1:** minimal inputs and safe defaults.
- **Level 2:** named options for additional control.
- **Level 3:** intentionally exported building blocks using the same concepts, when consumers need composition.

The original 80% common / 15% advanced / 5% expert split is a design heuristic, not a quota. Python keyword-only arguments or a configuration object can serve Level 2; avoid telescoping positional parameters. Do not require inputs the system can reliably derive. Add a level only when it solves a real use case, and keep advanced paths discoverable.

## 5) Discoverability & Navigation

Use one obvious public import path or command per capability. Prefer domain-specific names over generic `process`, `handle`, or `data`; use consistent terminology within a bounded context.

Make public exports intentional (`__init__.py`, `index.ts`, package exports, or the ecosystem equivalent). Keep internals out of ordinary consumer instructions. In larger domains, a small searchable capability index can map tasks to entrypoints, symbols, and keywords.

The first screen of a module's documentation should orient a consumer: use when, start here, common flow, related capabilities, anti-goals, and diagnostics. Use the existing repository layout; subsystem orientation docs explain the system without inventing operating policy.

## 6) First Success & Workflow Ergonomics

The walkthrough in §1 should show an expected result and the next useful operation. Document installation, credentials, sample data, and local run commands when needed.

Offer inspection affordances where useful: SDK `health()`, `validate()`, or `explain()`; CLI structured output and relevant diagnostic flags. Keep normal output useful for its consumer. For dangerous or irreversible actions, provide a meaningful dry-run/explain path where feasible and make side effects explicit.

## 7) Contracts & Semantics

Use established repository contracts when available; otherwise state the chosen answers directly. This skill owns making them visible at the surface, not redefining the system architecture.

When relevant, specify:
- Side effects, durability, and what successful completion establishes.
- Partial failure and consistency expectations.
- Delivery semantics and ordering guarantees/keys.
- Idempotency key, deduplication scope, and replay behavior.
- Retry safety and which layer owns retries/backoff.
- Timeouts/deadlines, their owner, and cancellation behavior.
- Resource ownership, initialization, shutdown, and disposal.
- Backpressure, limits, drop policy, and slow-consumer behavior.
- Reproducibility: configured or injected time/randomness, source versions, and replay limits where the capability requires them.

Avoid hidden global state, import-order dependencies, or undisclosed environment requirements. If semantics cannot be stated cleanly, resolve them before implementation.

## 8) Defaults, Config, Validation

Give optional inputs explicit safe defaults. Put units in names or types (`timeout_ms`, `max_bytes`). Prefer enums over ambiguous booleans for multiple states.

Choose and document validation strictness (strict, tolerant, or compatibility-preserving) and unknown-field behavior. State actual config precedence; a common pattern is defaults < file < environment < flags, but follow repository conventions.

Source secrets from the established environment or secret manager. Do not require code literals or expose secrets/PII in validation errors. Record authn/authz assumptions and least-privilege behavior for relevant boundaries.

## 9) Errors & Diagnostics

Use the ecosystem's exception/result conventions with this recovery information:
- Stable machine-readable `code` and human-readable `message`.
- Structured, redaction-safe `context`; useful invalid values may be truncated.
- Concrete `suggestion` and stable documentation reference.
- Retry safety: no, safe, or unsafe; include retry-after information when useful.
- Optional cause, correlation/trace identifiers, parameter/limit metadata.

Say what failed and what the consumer can do next. A local validation error may need a parameter and fix; remote/async failures need identifiers that connect to diagnostic evidence.

On hot paths, validate at ingress, keep inner-loop allocation/logging minimal, and enrich errors at the reporting boundary. Map the same semantics to HTTP Problem Details, CLI messages/exit codes and structured output, or language-specific exceptions.

## 10) Naming, Results, and Concept Budget

Use verbs for operations, noun phrases for data, predicates for booleans, and explicit states for lifecycle. Distinguish identifiers from full objects through names/types, following the language's conventions.

Choose the existing ecosystem's return pattern and use it consistently. Named envelopes, typed objects, or ordinary values can work; do not introduce a wrapper solely to impose a foreign standard.

For meaningful new concepts, identify what they add or replace. Justify added types, terms, or modes through reduced caller complexity or improved safety. Do not add abstraction layers unless they benefit consumers.

## 11) LLM Consumers

Make public interfaces usable without private implementation context:
- Types constrain meaningful states and value shapes.
- Document parameter provenance, such as an ID returned by a listing operation.
- State return shape and thrown/returned errors, including error codes.
- Provide a runnable common case; add an advanced example only when it clarifies a distinct supported use.
- Use machine-verifiable contracts for boundary crossings (OpenAPI, JSON Schema, proto, or equivalent).

Keep module navigation predictable. In Python, combine type hints with docstrings documenting provenance, effects, results, and exceptions. In JS/TS, `@param`, `@example`, and `@throws` can carry the same information. The Appendix illustrates the Python pattern.

## 12) Evolution, Compatibility, and Migration Kits

Prefer additive changes. Never silently alter documented semantics under the same name. State versioning/evolution rules for persisted config and events using the ecosystem's existing scheme.

Breaking changes require migration support proportional to affected consumers:
- Old-to-new usage and changed behavior.
- Supported coexistence/shim path where feasible.
- Deprecation warning and removal timeline.
- Codemod where useful and feasible.
- Rollout, rollback limits, and a clear breakage budget.

Check runtime behavior, imports/types, serialization, error taxonomy, defaults, and documented usage. A renamed symbol is breaking unless compatibility is maintained.

## 13) Parity

For the same capability across languages/runtimes, preserve error codes, defaults, and semantics unless divergence is explicit. Allow idiomatic mechanisms (keyword arguments, options objects, cancellation tokens) without silently changing behavior.

## 14) Governance & Enforcement

Identify the owner and stability of shared surfaces. Use the repository's actual review process; propose additional review only when new boundaries, breaking changes, or new concepts warrant it.

Choose enforcement that catches consequential drift: public export/import checks, schema validation, error-code collisions, runnable examples, or module templates. Reuse existing checks and contracts; do not create governance machinery for a trivial change.

## 15) Documentation Truth Maintenance

Keep schemas/types as the contract source and verify docs/examples against them. Use relevant compile checks, doctests, snippet runs, or schema checks. Give diagnostic documentation stable anchors.

Distinguish runnable examples from illustrative fragments and actual verification from a proposed check. A passing snippet establishes the exercised software behavior; it does not establish model validity, retrieval quality, metric adequacy, or online experiment conclusions.

## 16) Measurement & Feedback

For non-trivial surfaces, choose useful DX signals for the actual problem:
- Misuse/confusion: recurring validation codes, unknown fields, support questions.
- Adoption: active consumers or usage of intended entrypoints.
- First success: observed onboarding outcomes or quickstart execution.
- Migration: remaining old call sites, consumer versions, deprecation warnings.

Use findings to improve defaults, types, errors, recipes, or migration tools. Avoid mandatory telemetry categories when they add no decision value; a quickstart in CI checks operability rather than measuring human onboarding time.

## Output & Optional Integrations

Use a format appropriate to the request; no exact headings or fixed section count is required.

- **FULL:** present the consumer walkthrough and relevant decisions from §1, with proposed interface, runnable examples, compatibility/migration, and focused software verification. Refer to an existing artifact instead of repeating it.
- **LIGHT:** summarize the change, evidence for unchanged compatibility/semantics, example drift, and relevant checks. Include performance evidence for hot-path work.
- **AUDIT:** give a recommendation, evidence-backed findings and severity, smallest fixes, and closure checks. Include a scorecard when it helps compare multiple surfaces. Distinguish assessed behavior from unknowns.

Reuse an existing work spec or design document for durable decisions when the project's workflow calls for one. Available planning, code-audit, and software proof-gate skills can consume the interface decisions and checks when already in use; they are optional integrations. Do not require their presence, identifiers, section numbering, or report directories.

Project planning owns owners, milestones, and dependencies. Software verification checks API behavior, examples, compatibility, and performance. Dedicated ML evaluation owns metrics, model validity, retrieval quality, and online experiments.

## Edge Cases & Guardrails

State consequential assumptions and tradeoffs. Prefer established ecosystem patterns; document a deliberate divergence and its migration implications. Keep safe defaults and an explicit advanced path when needed.

Use the actual repository and supplied references as evidence. Do not invent standards, references, or measured consumer outcomes. Keep changes scoped to the requested interface work.

# Appendix: Compact Python Consumer Example

This standalone fixture illustrates typed results, keyword-only options, parameter provenance, and recovery errors. It constructs an in-memory run description; it performs no training, evaluation, persistence, or network requests. Save as `experiment_tools.py` and run `python experiment_tools.py`. In a real package, expose these operations through its canonical public entrypoint.

```python
from dataclasses import dataclass
from typing import Literal

DatasetId = Literal["demo_v1"]


class DatasetNotFoundError(ValueError):
    code = "DATASET_NOT_FOUND"
    retryable = "no"
    docs_ref = "experiment_tools#plan_run"

    def __init__(self, dataset_id: str) -> None:
        super().__init__(f"Unknown dataset: {dataset_id!r}")
        self.context = {"dataset_id": dataset_id}
        self.suggestion = "Choose a dataset_id from list_datasets()."


@dataclass(frozen=True)
class RunPlan:
    dataset_id: DatasetId
    seed: int


def list_datasets() -> tuple[DatasetId, ...]:
    return ("demo_v1",)


def plan_run(dataset_id: DatasetId, *, seed: int = 0) -> RunPlan:
    """Describe a run without executing it or creating resources.

    dataset_id comes from list_datasets(); seed is recorded in the plan.
    Returns a RunPlan with dataset_id and seed.
    Raises DatasetNotFoundError (DATASET_NOT_FOUND) for an unknown ID.
    """
    if dataset_id not in list_datasets():
        raise DatasetNotFoundError(dataset_id)
    return RunPlan(dataset_id=dataset_id, seed=seed)


if __name__ == "__main__":
    dataset_id = list_datasets()[0]
    print(plan_run(dataset_id))
    # RunPlan(dataset_id='demo_v1', seed=0)
    print(plan_run(dataset_id, seed=42))
    # RunPlan(dataset_id='demo_v1', seed=42)
    try:
        plan_run("missing")  # Deliberate misuse; a type checker also rejects it.
    except DatasetNotFoundError as error:
        print(error.code, error.suggestion)
        # DATASET_NOT_FOUND Choose a dataset_id from list_datasets().
```
