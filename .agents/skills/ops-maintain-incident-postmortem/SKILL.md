---
name: ops-maintain-incident-postmortem
description: 'Preserve difficult operational incident diagnoses as durable postmortems: causal evidence, ruled-out hypotheses, misleading signals, and a first discriminator. Create when the diagnostic search has reusable value; routine obvious bugs return not owed. Update existing postmortems for new evidence, corrective-action progress, or closure.'
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Incident Postmortem: Preserve the Diagnosis

A fix diff rarely preserves why competing explanations failed. Retain what broke for the user or operator, the evidence for the mechanism, ruled-out hypotheses, misleading signals, and the discriminator a future responder should run first. The record should make a recurring pattern recognizable and identify the missing defense and concrete recurrence actions. Explain decisions using the information responders had at the time.

**Create or update.** Create a postmortem when the diagnosis itself was the work: several ruled-out causes, misleading symptoms, or evidence across services, networking, persistence, or infrastructure that future responders would otherwise re-derive. Routine changes whose diff explains the failure return `not owed` with one line. Updates to an existing postmortem use its identity and stable IDs; new evidence, action progress, and closure do not need to meet the creation bar again. Preserve prior evidence and record corrections or changed conclusions explicitly.

**Inputs.** Prefer a compact diagnosis brief containing ruled-out hypotheses, misleading signals, evidence paths, the first discriminator, mechanism and confidence, and the fix pointer. Corroborate it with the smallest useful evidence set. If the brief is absent or thin, draft from available evidence and mark material gaps `[UNKNOWN]`; its absence alone is not a blocker. Report a blocker only when missing evidence or access prevents the requested outcome. The current agent can author directly or delegate when useful; no fixed topology or model is required.

**Ownership & routing.** Own `postmortem.md`, sanitized evidence excerpts created for it, and its status, confidence, pattern, and corrective-action record. Product fixes, harnesses, system docs, and planning remain with their workflows. Substantial corrective work routes to the team's work specification or equivalent planning artifact; software prevention checks route to `$eval-design-proof-gates` or an acceptance contract when available. Flag supported process, testing, or policy contributors for `$prompt-perform-root-cause-analysis` or equivalent analysis. For ML incidents, retain supplied evaluation evidence and engineering contributors; metric selection, model validity, retrieval quality, and online experiments belong to dedicated ML evaluation. Software verification does not establish model quality. Keep action pointers here rather than implementing the downstream work.

**Storage.** Default to `docs/incidents/<semantic-domain>/<YYYY-MM-DD>__<incident-slug>/postmortem.md`, honoring an established incident location. Domain names the product/system area (`payments`, `realtime-netcode`, `agent-tools`, `infra`, `auth`); date is the incident start in the canonical timezone when known; slug describes the symptom or mechanism in kebab-case. Severity and status stay out of the path because they change. Sanitized excerpts live in `evidence/` beside it. Never copy secrets, tokens, private user data, or unredacted production records into the repo; link or describe the source.

---

## Laws

1. **Evidence-led.** `[FACT]` requires a source (`SRC-###`, file:line where possible); `[INFERENCE]` names its supporting F-IDs and its `Disprove if:`; `[RULED OUT]` names the killing fact; `[UNKNOWN]` marks material uncertainty honestly. IDs (`SRC/F/I/R/CA-###`) are stable and append-only. "Root cause" is earned: **High** = mechanism directly proven and at least one plausible alternative ruled out; **Medium** = strong support, one discriminator or repro missing; **Low** = plausible but circumstantial. Below sufficiency use *suspected mechanism*; correlation does not earn a root-cause claim.
2. **User impact first, compact.** Lead with what failed for the user or operator. Aim for one to two pages, with raw evidence in an appendix when needed. Implementation detail appears only where it explains mechanism, resolution, rollback, or prevention; avoid a file-by-file changelog.
3. **Confusion is signal.** Capture why responders chased wrong ideas, what they believed at key moments, what collapsed the search space, and which logs, metrics, or dashboards misled. The missing discriminator, named explicitly, is the most valuable line in the document.
4. **Commands are evidence only if they ran.** Captured or source-summarized output qualifies; anything else is a *proposed* discriminator in Fast Path, labeled as such. Discovery is read-only; nothing mutating, credentialed, or production-affecting.
5. **Corrective actions land somewhere real.** Every CA carries type (`Prevent | Detect | Mitigate`), priority, accountable person or team, target date, state (`Proposed | Open | Verified | Deferred`), enforcement artifact, lands-as pointer, and exact testable verification ("alert fires when reconnect replay lag exceeds 2s for 3 consecutive minutes"). The enforcement artifact is the gate, `C-###` contract, alert, instruction, or runbook that holds the line; human accountability remains separate. Use supplied owners and dates; label proposed assignments and dates, or `[UNKNOWN]` when unresolved. `Verified` requires completion evidence; `Deferred` requires a rationale. Link implementation, verification evidence, and deferral rationale without copying the downstream plan or harness.
6. **Severity humility.** `Sev-N (proposed)` unless the team declared it. No invented severities, windows, or timestamps; use `TBD` and `[UNKNOWN]` when unresolved.

## Status

`Draft` (evidence, timeline, impact, or cause incomplete) → `Resolved` (user impact ended; mechanism established to stated confidence; review-ready) → `Actions open` (accepted; CAs pending) → `Closed`. Closed requires window and impact stated, confidence stated, remaining uncertainty explicit, a concrete Fast Path discriminator, and every CA `Verified` with evidence or `Deferred` with rationale. If no actions are owed, state why. Refer to each CA's recorded state rather than inferring completion from a fix or closed ticket.

## Workflow

1. **Select create or update** using the eligibility rule above. For an update, read the existing record and preserve its identity and IDs.
2. **Resolve identity:** domain, start date, slug, path, incident class, higher-order pattern, why-it-recurs, severity.
3. **Ingest:** use the brief when available, incident notes, the introducing/mitigating diff or PR, logs/traces/dashboard snapshots, repro tests, and relevant prior incidents. Focus an update on evidence needed for the requested change.
4. **Build the causal frame before narrative:** symptom → affected user/operator flow → trigger → mechanism → missing defense → resolution → recurrence guardrail. Name plausible wrong hypotheses and what ruled them out where evidence exists.
5. **Write or update** per the template, then run the conformance check without storing its checklist in the document.
6. **Return the Skill Result** with action routing under Ownership & routing and any justified RCA follow-up. The authoring agent or caller provides the human-facing close-out.

---

## Template

````markdown
# INCIDENT POSTMORTEM: <clear-incident-title>
**Human Read:** <symptom and established or suspected mechanism, with High/Medium/Low confidence>; <mitigation/fix and impact status, or unknown>. If this symptom appears again, run <first discriminator> first. Status: <status>; corrective actions: <counts by state / none owed>.

**Incident ID:** `<semantic-domain>/<YYYY-MM-DD>__<incident-slug>`
**Incident window:** YYYY-MM-DD HH:MM TZ → YYYY-MM-DD HH:MM TZ
**Severity:** Sev-0..4 (proposed | declared) | TBD
**Status:** Draft | Resolved | Actions open | Closed
**Incident class:** <concrete operational bucket>
**Higher-order pattern:** <cross-domain reusable pattern>
**Why this class recurs:** <the system pressure, one sentence>
**Mechanism confidence:** High | Medium | Low
**Canonical system doc:** <docs/... | Missing; CA-###>
**Related incidents:** <links | none>

## Doc Conventions (Do Not Delete)
- Schema: `ops-maintain-incident-postmortem`, Laws and Status. Sections 1–8 are stable; an inactive section holds one honest line.
- Preserve append-only `SRC/F/I/R/CA-###` IDs. The evidence entries below distinguish facts, inferences, ruled-out hypotheses, and unknowns.

## 1) User Journey & Impact
Actor · entry point · expected flow (3–5 steps) · what broke · user-visible impact · operator/internal impact · systems affected · scope/volume · detection time · recovery time · success criterion after fix.
> The user just <prior action>, expects to <immediate goal>, and will next <downstream step>. This incident broke <prior action> → <immediate goal>.

## 2) Fast Path Next Time
If you see this symptom again · first discriminator to run · what that rules out · most likely next boundary to inspect · the one command/probe/dashboard to check first. Label its execution state per Law 4.

## 3) What Proved It
- [FACT F-001] <evidence-backed fact> (SRC-001)
- [INFERENCE I-001] <causal interpretation>; supported by F-___; Disprove if: <one-liner>
- [RULED OUT R-001] <hypothesis>; ruled out by F-___
- [UNKNOWN] <remaining uncertainty | none known>

## 4) Timeline
| Time | Signal / observation | Decision / action | Who / system |
| --- | --- | --- | --- |

## 5) The Hunt
Trigger · why it was confusing · what responders believed at key moments · what collapsed the search space · which signals helped · which logs/metrics/dashboards were missing or misleading · the missing discriminator, named.

## 6) Mechanism & Missing Defenses
Primary mechanism (shortest technically accurate explanation) · contributing causes · failed or missing defenses (tests, review, observability, contracts, rollout checks) · why it reached production. Distinguish the mechanism from its enabling conditions.

## 7) Resolution
Immediate mitigation · durable fix (commit/PR pointer) · why this path over the alternatives · rollback shape if the fix had to be reversed.

## 8) Recurrence & Corrective Actions
Similar incidents · shared failure pattern · why prior guardrails didn't prevent this one · the cheapest prevention that would have caught it earlier.

| ID | Action / type | Accountable owner | Priority / target date / state | Enforcement artifact | Lands as | Verification / evidence |
| --- | --- | --- | --- | --- | --- | --- |
| CA-001 | <specific action; Prevent / Detect / Mitigate> | <person/team; proposed or unknown if unresolved> | <priority; target date; Proposed / Open / Verified / Deferred> | <gate/contract/alert/doc/test> | <implementation or follow-up pointer> | <exact testable condition; evidence pointer or deferral rationale> |

## Appendix: Sources & Evidence
- SRC-001: <path file:line / command + captured output / dashboard / PR / log excerpt>; <what it proves>; captured YYYY-MM-DD
````

---

## Calibration

- **Incident class** (concrete, operational): `stale-cache-read` · `duplicate-webhook-processing` · `websocket-reconnect-state-loss` · `missing-auth-boundary` · `unbounded-fanout` · `silent-partial-failure` · `rollout-config-drift`.
- **Higher-order pattern** (reusable across domains): `authority split without freshness contract` · `context lost across async boundary` · `idempotency missing at retry boundary` · `observability gap hid the first failing boundary` · `client-visible state diverged from backend authority`.
- **Why-it-recurs names the pressure:** "This recurs because two systems can both appear authoritative unless freshness and ordering are explicit."

## Conformance Check (after drafting; never stored)

- Create/update eligibility honored; path, title, and Incident ID agree; Human Read accurately summarizes the current record, including partial resolution or uncertainty.
- Apply Laws 1–6 and Storage to the draft; retain the useful diagnostic search history and check every CA field against Law 5.
- Status meets its stated criteria; downstream pointers follow Ownership & routing. Missing evidence or access is reported only when it prevents the requested outcome.

## Skill Result (required elements, any shape)

- Verdict: authored | updated | not owed; <one line>
- Postmortem path · Incident ID · Status · Severity
- Incident class · Higher-order pattern · Mechanism confidence
- Evidence state: sufficient | partial; <gaps> | blocked; <evidence/access that prevents the requested outcome>
- Corrective actions: IDs + action/routing state and unresolved ownership or dates | none owed
- RCA follow-up: yes; <supported contributor> | no
- Open blockers · Recommended next action (one)
