---
name: eval-implement-proof-gate
description: Builds or repairs a missing or defective harness for an approved objective software gate, runs it, and records evidence and the gate state. Use when an acceptance criterion needs a literal runnable command. Gate design, product implementation, and ML evaluation remain separate.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Build Proof Harnesses for Approved Gates

Turn an approved software gate into a literal runnable command that measures the full value path in its authority environment. Distinguish a product missing the claimed value from a broken harness. A trustworthy red product result is successful harness readiness; hand it back for product implementation.

## Contract and ownership

Use the approved gate card and missing-harness spec in `eval-plan.md` when the repository uses them. Otherwise use an equivalent approved acceptance contract with a stable gate ID. Required inputs are the claim, setup, action, observation, pass/fail verdict, authority environment, evidence artifact, edit envelope, potency, and the instrument to extend or approved location for a new harness. Keep any approved `run_policy`. Missing or ambiguous inputs are a design gap; return them to the gate designer (`$eval-design-proof-gates` when available).

Design owns these inputs. This skill owns harness, fixture, replay, and harness-local diagnostic files within the envelope; execution and evidence; and synchronization of the authoritative contract's `loop`, `state`, `last_run`, and defect/blocker notes. Update an existing work-spec Proof & Eval Summary mirror in the same edit when repository conventions require it. Do not create planning files or duplicate status tables solely for this skill.

Product implementation, runtime hooks, telemetry seams, API or persistence changes, auth behavior, and production config belong to their owning work. The sole exception is a temporary potency mutation explicitly approved in the contract with its target, exact break, and permitted edit scope (Laws 4–5). Existing authorization counts; never infer broader permission from it. New dependencies require approval. Subjective acceptance and rung, milestone, or release completion remain with their owners; final handoff may use `$handoff-final-quality-gate` when available.

This is software verification. Model validity, metric selection, retrieval quality, and online experiments belong to ML evaluation. Planning owns requirements, owners, and milestones.

**Routing.** Follow applicable repository delegation conventions. When using delegates, exact harness assembly and execution may be delegated; the responsible reviewer owns failure diagnosis and gate verdicts. No required topology, model tier, or root-policy file.

## Preconditions

Proceed only when the objective gate is approved, its harness is missing or recorded as defective, and the contract above is concrete. A required product seam, unsafe execution, unsupported authority environment, unavailable credential/tool/fixture/service, conflicting parallel edit, or unexecutable approved potency is a boundary: report the evidence and what is needed. Do not soften the gate or create the missing design.

## Classification = State Transition

Each attempt returns one classification:

- **READY_RED → `Red captured`.** The harness measured the gate and observed the intended missing-value failure after ruling out harness defects. Record this fresh watched-red evidence while it exists. This is successful harness readiness.
- **READY_GREEN → `Objectively Green`.** Only after executed potency and a green rerun following restoration (Law 4).
- **BLOCKED → `Blocked — <what>`.** A missing prerequisite, approval, or safe execution condition prevents proof. No product-gate claim is made.
- **HARNESS_DEFECT → no state transition.** A broken, flaky, misconfigured, or non-discriminating instrument makes no product claim. Record its path, fresh evidence, and a one-line diagnosis; retaining an earlier state does not make the failed attempt fresh proof.

Skill outcome: `PASS` = Red captured or Objectively Green with fresh evidence and synchronized contract; `BLOCKED` = a blocked classification; `FAIL` = HARNESS_DEFECT after one repair or an unresolvable boundary. Report red as harness readiness, never as a failed skill.

## Laws

1. **The contract is the spec.** Implement exactly its setup, action, observation, verdict, and authority, including compound-gate orchestration (coordinator, run ID, actors, duration, churn model, observers, aggregate verdict). Forbidden degradations: real browser → unit test; real packet → mocked event; real persistence → in-memory object; authority runtime → local stub; concurrent workload → sequential loop; hostile condition → happy path; approved threshold → smaller threshold; same-run observers → disconnected tests. An impossible approved target is `Blocked`.
2. **Smallest sufficient, on the named instrument.** Exercise the full required value path with only its fixtures and infrastructure. Extend the named `extends` instrument; if it cannot host the harness, report the design gap rather than building a bespoke sibling. Build a new instrument only when the contract specifies one. The loop must be rerunnable after product fixes unless the approved proof is explicitly one-time.
3. **Diagnose before claiming red.** Rule out broken selectors, missing fixtures, wrong routes, unrelated timeouts, credentials, dependency outages, harness syntax/runtime errors, harness-created races, mock mismatches, and unsupported environments. Allow one harness repair inside the envelope. If the same or similar defect repeats, classify HARNESS_DEFECT and stop. Never repair product behavior as part of this skill.
4. **Potency executes.** An intended red captured from the current run satisfies approved `watched-red` potency. An initially green run requires an approved mutation: apply the exact break, rerun, and this gate must fail for the intended reason; reverse the mutation exactly, rerun green, then write `Objectively Green` with the evidence. Watched-red instructions without a compatible approved mutation are a design gap when the first run is green. Return to design without a green claim; never invent a break for later backfill. A mutation that fails another gate, produces an unrelated error, or leaves this gate green is HARNESS_DEFECT.
5. **Mutation custody.** Inspect affected content before editing and preserve parallel work. Apply only the approved temporary break and reverse it in-session with the exact inverse edit. Verify restoration before any halt or handoff; never commit the mutation or use a broad reset/restore to undo it. If safe restoration is uncertain, do not start the mutation. Permission for potency does not authorize a product seam or feature change.
6. **Honest, bounded fixtures.** Use minimal source-backed or explicitly synthetic fixtures, each naming the real state it represents. Print deterministic seeds for randomized behavior into the artifact. Bound applicable actors, bytes, duration, retries, frames, records, and requests. No private user data, production secrets, or destructive writes.
7. **Preserve evidence.** Cleanup is non-destructive and never removes evidence required by the audit.
8. **Applicable repository constraints.** Follow local harness placement and extension conventions. Apply deterministic math-adapter requirements, including restrictions on native `Math.*`, when the contract or repository defines a deterministic kernel lane. Replay/restore proof retains any required restore boundary and later checkpoint. These constraints come from the approved contract or applicable repository guidance, not an assumed root template.

## Workflow

1. **Load the contract and local context.** Read applicable scoped `AGENTS.md` files, nearby harness conventions, and runner scripts. Discover only the named value path. Resolve literal paths, commands, routes, fixtures, credentials, and runners from the contract or read-only discovery; assess prerequisites before building.
2. **Build and run** per Laws 1–2. Execute the literal command that will become `loop`; capture raw output from the current source.
3. **Diagnose, then prove potency** per Laws 3–5. Capture intended product red, repair a harness defect once, or complete approved mutation/red/restoration/green proof before classifying green.
4. **Write fresh evidence** to the contract's artifact location. If it names no directory convention, use `tmp/<datetime>__<feature-slug>__<gate-id>/eval-trace.md`. Include timestamp; source revision (git ID when available, otherwise a content identifier); relevant environment identity (engine/browser, backend/session, device); gate ID and approved claim; exact command; harness files created/edited; raw output or its file path; produced artifacts; classification; comparison against the approved verdict; potency execution and restoration evidence or the reason it could not run; remaining delta; and next action.
5. **Synchronize** the authoritative contract and any required existing mirror per Contract and ownership. `last_run` records artifact path, source revision, and date, with the attempt's classification visible. Preserve the prior product state for HARNESS_DEFECT. If execution shows a `run_policy` mismatch (slower, flakier, or more credential-bound), propose a correction without changing the approved policy.
6. **Return the Skill Result.** The caller owns the human-facing close-out; use local conventions when present.

## Skill Result

Return these elements in any clear shape:

- Skill outcome: PASS | BLOCKED | FAIL; classification and state transition written, or none.
- Gate ID; harness paths; literal command; fresh artifact path; potency executed (approved mutation applied and reversed, or watched-red captured), or the exact gap.
- Authoritative contract sync; required mirror sync, or not applicable; proposed run-policy correction, if any.
- Remaining delta (exact, or None); one recommended next action, usually implementing the approved behavior until this loop reaches the gate.
