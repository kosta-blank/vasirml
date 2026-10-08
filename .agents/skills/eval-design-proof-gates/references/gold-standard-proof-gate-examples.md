# Gold-Standard Proof Gate Examples

These examples show the specificity bar for `$eval-design-proof-gates`.

They are **calibration examples** using the canonical fields in [SKILL.md](../SKILL.md#template). Do not copy their IDs, paths, commands, thresholds, or domain nouns into a real eval plan unless repo discovery or the current user request makes them true. In a real repo, replace every threshold with a sourced value, an explicit user requirement, or a named assumption/blocker.

A mutation example specifies the behavioral break; using it in a real plan still requires a discovered target and explicit permitted edit scope. These scenarios grant no authorization. Missing instruments and prerequisites are shown as blocked, and no example claims an executed run.

A gold-standard gate does five things:

1. proves the terminal value path, not implementation trivia;
2. names the weak proof that could lie;
3. binds setup, action, observation, verdict, target environment, artifact, and stop condition;
4. uses same-run orchestration when the claim is compound;
5. admits missing harnesses honestly instead of inventing commands.

---

## Example 1 — MMORPG Netcode: 100 Concurrent Live Players

### Scenario

We are building toward a multiplayer world where a player can join a live shard and trust that other players are really present, moving, disconnecting, reconnecting, and synchronized through the same transport path the real client uses.

### Proof-of-Value State

A live world session reaches 100 simultaneous server-recognized player sessions, keeps authoritative movement propagation inside budget while players move and a bounded reconnect churn runs, and a real browser observer sees the corresponding remote characters moving with websocket/frame evidence tied to the same run.

### Weak proof that is not enough

- A server-only load script reaches 100 socket connections but sends no realistic movement.
- A Playwright browser shows characters moving from local fixtures, not live netcode.
- Websocket payload shape is valid in isolation, but the browser freezes under load.
- A load test and browser test pass in separate runs with different seeds/session IDs.

### Gate Class Synthesis

| Required truth | Plausible lie prevented | Class | Gate | Reason |
|---|---|---|---|---|
| The server accepts and tracks 100 concurrent player sessions in one world. | A synthetic script opens sockets but the game session never has 100 authoritative players. | Scale/performance | MMORPG-NETCODE__M1__G1 | The claim explicitly includes 100 live concurrent players. |
| Movement propagates from bots through the real transport path to a real observer. | Server state changes, but the client transport/render path is broken. | Realtime/convergence + Network/packet | MMORPG-NETCODE__M1__G1 | Netcode value is propagation, not only connection count. |
| A player can visually observe the live world under load. | Metrics pass while the actual browser is frozen, empty, or rendering stale characters. | Browser/render | MMORPG-NETCODE__M1__G1 | The user-facing proof is visible remote movement. |
| Load, browser, and packet evidence are from the same run. | Separate tests pass independently while the combined live experience fails. | Orchestrated compound | MMORPG-NETCODE__M1__G1 | The claim depends on concurrent conditions. |
| Reconnect churn does not corrupt presence or movement. | The happy path works, but normal disconnect/reconnect breaks identity or state convergence. | Failure/hostile | MMORPG-NETCODE__M1__G1 | Online worlds must survive expected churn. |
| Movement feels good. | Objective sync is correct but motion is visually jittery or uncomfortable. | Subjective human | Excluded | Outside this example’s objective claim; add a subjective card if the current acceptance criteria include feel. |
| Payment/security proof exists. | Irrelevant proof distracts from netcode value. | Security/privacy/auth | Excluded | Excluded unless this milestone changes auth, identity ACL, or privacy boundaries. |

After the harness exists: Local eval. Human feel requires a separate subjective card only when included in the current acceptance criteria.

### Gate Card

```yaml
id: "MMORPG-NETCODE__M1__G1"
kind: "milestone"
class: "Orchestrated compound"
claim: "A live world session supports 100 concurrent moving players with authoritative state propagated to a real browser observer through the real realtime transport path."
lie: "A socket-only load test, fixture-only browser test, or isolated websocket schema test passes while the combined live player experience fails."
blind_spot: "This workload does not establish gameplay feel, security boundaries, other shard topologies, or behavior beyond its recorded load shape."
setup: "Create one isolated world/session with deterministic seed `netcode-100-concurrent-seed`, one observer account, 100 bot player identities, and per-run `runId` propagated through server logs, bot telemetry, browser trace, and websocket/frame capture."
action: "Start one coordinator that ramps 100 bot clients into the world, moves them along bounded randomized paths, starts one Playwright observer in the same world, runs a bounded reconnect churn phase, captures browser/network/server/bot artifacts, and shuts down cleanly."
observation: "Server session metrics, bot telemetry, observer browser video/trace/screenshot, console/page-error log, websocket frame capture or repo-owned transport tap, and coordinator summary all tied to the same `runId` and steady-state time window."
verdict: "Pass only if all of these hold in the same run: server recognizes 100 simultaneous player sessions for the required steady-state window; observer sees at least 99 remote player entities excluding itself; sampled remote entities receive fresh movement updates within the sourced propagation budget; reconnect churn restores affected identities without duplicates or ghost avatars; websocket/frame samples contain the expected movement/snapshot fields under size ceilings; browser console/page errors are zero; coordinator exits nonzero on any observer failure. If any required observer is missing, blocked, or from a different runId, fail."
loop: "missing harness: mmorpg-netcode-100-concurrent-observer-eval"
authority: "Closest local or staging world runtime that exercises the real server, realtime transport, and browser client path."
artifact: "tmp/<datetime>__mmorpg-netcode-100-concurrent-observer/{summary.json,server.log,bots.ndjson,playwright-trace.zip,observer-video.webm,observer-screenshot.png,ws-frames.ndjson}"
potency: "mutation — within an explicitly permitted temporary edit scope in the isolated runtime, suppress authoritative movement propagation for one sampled moving entity while leaving sessions and transport healthy; this gate must fail its stale-update verdict; restore exactly before a green rerun."
run_policy: "Blocked"
stop: "Responsible harness implementer builds the required harness before product code. After harness exists, executor repairs once within the authorized scope from the trace, reruns this gate, then stops on repeated similar failure."
state: "Blocked — harness"
last_run: none
refs:
  - "User requirement: 100 concurrent netcode proof with bots, reconnect churn, Playwright observer, and websocket/devtools evidence."
orchestration:
  coordinator: "missing harness: mmorpg-netcode-100-concurrent-observer-eval"
  run_id: "Generated once by coordinator and injected into world/session metadata, bot telemetry, browser URL/session state, websocket/frame tap, and server log context. Every artifact must share this runId and overlapping steady-state timestamps; a mismatch or missing runId fails."
  actors:
    - "bot clients — 100 identities — connect to the same world, spawn once, move on bounded randomized paths, and report authoritative acknowledgements and observed-state timestamps."
    - "observer browser — 1 — join the same world through Playwright, record video/trace/screenshot and console errors, and capture websocket frames through CDP or a repo-owned transport tap."
    - "server/world runtime — 1 isolated session/shard — publish per-run connection count, tick/update rate, outbound messages, entity count, and invariant logs."
  scale_target: "100 simultaneous server-recognized player sessions, measured by authoritative server session metrics for the steady-state window."
  duration: "Assumption unless sourced: 30s ramp-up + 120s steady state + 30s churn/recovery."
  churn_fault_model: "Assumption unless sourced: randomly disconnect/reconnect 10 bot identities during churn; pass requires no duplicate identities or ghost avatars and recovery to 100 recognized sessions inside the sourced recovery budget."
  observers:
    - "server metrics/logs with runId"
    - "bot telemetry with connection, movement, and acknowledgement timestamps"
    - "Playwright trace/video/screenshot/console-error log"
    - "websocket frame capture, Chromium CDP network events, or repo-owned realtime transport tap"
  aggregate_verdict: "Gate passes only if scale, convergence, browser render, websocket/frame evidence, churn recovery, and error policy all pass in the same run."
```


### Missing Harness Spec

```yaml
harness: "mmorpg-netcode-100-concurrent-observer-eval"
proves: ["MMORPG-NETCODE__M1__G1"]
envelope: "repo-specific eval/tool domain, e.g. games/<gameId>/tests/netcode/<stable-name>.js or scripts/evals/netcode/<stable-name>.js; exact path must come from scoped AGENTS and repo discovery."
artifact: "tmp/<datetime>__mmorpg-netcode-100-concurrent-observer/"
payload: "world seed, runId, bot identity pool, observer auth/session state, movement script, churn model, propagation/size/error budgets"
verdict: "Exactly the verdict field from MMORPG-NETCODE__M1__G1; the harness must fail closed if any observer is missing or uncorrelated."
extends: "Extend a discovered shared netcode/browser instrument; if none can coordinate live bots, real browser rendering, frame evidence, churn, and server metrics under one runId, record why a new instrument is needed."
required_before_product_code: "yes — the declared milestone requires live concurrent netcode proof."
route: "Responsible harness implementer; $eval-implement-proof-gate when available."
```

### Why this is strong proof

- It proves the combined user experience, not just socket count.
- It cannot pass with disconnected artifacts from different runs.
- It names what the missing harness must do without inventing a runnable command.
- It separates sourced requirements from assumptions.
- It provides enough detail for an implementation agent to build the eval harness without guessing actors, observers, payload, verdict, or artifacts.

---

## Example 2 — Checkout: Payment Creates Exactly One Order

### Scenario

We are building toward a checkout path where a buyer pays once, gets a confirmed order, and backend state remains correct even if the payment provider retries webhooks.

### Proof-of-Value State

A buyer completes checkout through the real browser flow against a sandbox payment provider; the app shows confirmation; exactly one durable order exists; duplicate webhook delivery does not create a second order; the operator can trace the payment-to-order link.

### Weak proof that is not enough

- A unit test verifies `createOrder()` with mocked payment data.
- A browser test reaches a “Thank you” page without verifying durable order state.
- A webhook handler test runs once but never replays the same webhook.
- Payment sandbox succeeds, but the app loses the provider event ID needed for support.

### Gate Class Synthesis

| Required truth | Plausible lie prevented | Class | Gate | Reason |
|---|---|---|---|---|
| Buyer can complete the real checkout journey. | Backend unit tests pass while browser checkout is broken. | Terminal value-path + Browser/render | CHECKOUT-PAYMENTS__M1__G1 | The buyer-facing journey is the product value. |
| Payment provider success creates durable order state. | UI says paid, but no canonical order exists. | Persistence | CHECKOUT-PAYMENTS__M1__G1 | Money-adjacent flows require durable state proof. |
| Duplicate provider callbacks are idempotent. | Happy path works once but retry creates duplicate orders. | Idempotency/retry + Failure/hostile | CHECKOUT-PAYMENTS__M1__G1 | Payment providers retry webhooks by design. |
| Operator can trace payment to order. | Support cannot debug paid-but-missing-order incidents. | Observability/operator | CHECKOUT-PAYMENTS__M1__G1 | Operational trust is part of the unlock. |
| 10k RPS checkout load works. | Irrelevant performance gate bloats this milestone. | Scale/performance | Excluded | Excluded unless the current requirements declare a load target. |

After the sandbox credentials, test path, and harness exist: Local eval.

### Gate Card

```yaml
id: "CHECKOUT-PAYMENTS__M1__G1"
kind: "milestone"
class: "Terminal value-path"
claim: "A buyer can pay through the real checkout flow and receive exactly one durable order even when the payment provider retries the success webhook."
lie: "A mocked unit test or browser-only success page passes while durable order creation, idempotency, or operator traceability is broken."
blind_spot: "Sandbox evidence does not establish production-provider behavior, outage recovery, or an undeclared throughput target."
setup: "Seed one test buyer, one cart with a known SKU and price, sandbox payment provider credentials from the repo-approved config path, and a test webhook event with stable provider event ID."
action: "Playwright completes checkout through the real browser route and sandbox payment UI, waits for confirmation, then replays the same provider success webhook once through the approved sandbox/test webhook path."
observation: "Browser confirmation state, order query result, payment/event audit record, webhook handler response/status, and logs/trace IDs for both initial and duplicate webhook deliveries."
verdict: "Pass only if the browser shows the confirmed order ID; exactly one order row/record exists for the payment provider event ID; duplicate webhook replay is acknowledged or safely ignored without a second order or second fulfillment; logs/audit link buyer ID, order ID, provider event ID, and trace/run ID; no checkout console/page errors occur."
loop: "missing harness: checkout-sandbox-idempotent-order-eval"
authority: "Local or staging app wired to the real sandbox payment provider and test database path."
artifact: "tmp/<datetime>__checkout-sandbox-idempotent-order/{summary.json,playwright-trace.zip,screenshot.png,order-query.json,webhook-replay.log,audit-log.ndjson}"
potency: "mutation — within an explicitly permitted temporary sandbox edit scope, bypass deduplication for the fixture provider event ID; replay must create a duplicate order or fulfillment and turn this gate red for that reason; restore exactly before a green rerun."
run_policy: "Blocked"
stop: "Halt for missing credential/environment. After sandbox config exists, responsible harness implementer builds the required harness before product code if no harness exists."
state: "Blocked — environment/credential and harness"
last_run: none
refs:
  - "Work spec C-### payment/order/idempotency contracts when available"
```

### Missing Harness Spec

```yaml
harness: "checkout-sandbox-idempotent-order-eval"
proves: ["CHECKOUT-PAYMENTS__M1__G1"]
extends: "Extend a discovered browser/payment integration instrument; if none spans sandbox checkout, durable order queries, duplicate callbacks, and audit correlation, record that gap before creating a new one."
envelope: "Discovered checkout/payment integration-test or eval-tool directory; identify the exact file envelope before implementation."
payload: "buyer fixture, cart fixture, SKU/price fixture, sandbox payment session, provider event ID, duplicate webhook payload"
verdict: "Exactly the verdict in CHECKOUT-PAYMENTS__M1__G1; fail closed if any required observation is missing."
artifact: "tmp/<datetime>__checkout-sandbox-idempotent-order/"
required_before_product_code: "yes — payment correctness and idempotency define this milestone value."
route: "Responsible harness implementer; $eval-implement-proof-gate when available."
```

### Why this is strong proof

- It crosses browser, sandbox payment, webhook, persistence, and operator audit in one value path.
- It includes the hostile retry case that commonly breaks money flows.
- It does not claim proof if sandbox credentials or a real test webhook path are missing.
- It prevents a fake green result from a browser-only confirmation page.

---

## Example 3 — Agent Tool Workflow: Safe Calendar Scheduling

### Scenario

We are building toward an agent workflow where a user asks the assistant to schedule a meeting, and the system chooses the correct tool sequence without double-booking, leaking private context, or mutating calendar state before the user-approved point.

### Proof-of-Value State

Given a recorded user request and fixture calendars, the agent proposes the right slot, calls only allowed tools with valid bounded payloads, creates exactly one event after approval, and emits an audit trace showing no forbidden mutation happened before approval.

### Weak proof that is not enough

- A prompt snapshot says the assistant “should ask for approval.”
- A unit test validates the calendar payload schema but not the tool sequence.
- A golden transcript checks text output but not actual tool calls.
- Tool calls happen, but the audit trace cannot prove whether the event was created before approval.

### Gate Class Synthesis

| Required truth | Plausible lie prevented | Class | Gate | Reason |
|---|---|---|---|---|
| Agent chooses the right sequence of search, proposal, approval, creation. | Text transcript looks good while the tool sequence is unsafe. | Contract/API | AGENT-CALENDAR-SCHEDULING__M1__G1 | Sequencing is the core workflow guarantee. |
| Calendar write happens only after approval. | The agent mutates state early but later text claims it waited. | Security/privacy/auth + Failure/hostile | AGENT-CALENDAR-SCHEDULING__M1__G1 | Tool mutation boundary is safety-critical. |
| Created event is correct and singular. | Tool schema passes but wrong time/attendees or duplicate event created. | Contract/API + Idempotency/retry | AGENT-CALENDAR-SCHEDULING__M1__G1 | User trust depends on exact calendar state. |
| Audit trace can prove what happened. | Humans cannot debug or verify agent/tool behavior. | Observability/operator | AGENT-CALENDAR-SCHEDULING__M1__G1 | Agent workflows need inspectable trace. |
| Browser visual test is required. | Irrelevant for a backend/tool workflow. | Browser/render | Excluded | Excluded unless the workflow includes a UI surface. |

After the harness exists: Default CI only when the fixture is reproducible and the acceptance contract applies to current behavior. Keep future known-red gates milestone-gated.

### Gate Card

```yaml
id: "AGENT-CALENDAR-SCHEDULING__M1__G1"
kind: "milestone"
class: "Contract/API"
claim: "The agent schedules one correct calendar event only after approval, using the allowed tool sequence and leaving an audit trace."
lie: "A transcript-only test passes while forbidden early mutation, wrong attendee/time, duplicate event creation, or missing audit evidence remains possible."
blind_spot: "One recorded request proves its tool-contract and mutation boundary only; it does not establish model validity or scheduling quality across a population of requests."
setup: "Golden user request, fixture calendar availability for user and attendees, allowed-tool policy, approval-turn fixture, and isolated calendar sandbox or deterministic fake backend that records canonical tool calls."
action: "Replay the user request through the agent harness, deny mutation before approval, inject explicit approval, then allow the create-event tool call and capture the full tool/audit trace."
observation: "Golden transcript diff, ordered tool-call trace, calendar sandbox state, audit log, and policy assertion output."
verdict: "Pass only if pre-approval tool calls are read-only; exactly one post-approval create-event call occurs; event time, duration, attendees, title, and timezone match expected fixture; no duplicate event exists after replay; audit trace records request ID, approval boundary, tool names, payload hashes, and final event ID; forbidden tools are not called."
loop: "missing harness: agent-calendar-approval-boundary-eval"
authority: "Repo-owned agent/tool sandbox or deterministic integration harness that exercises the real tool policy layer and calendar adapter boundary."
artifact: "tmp/<datetime>__agent-calendar-approval-boundary/{summary.json,transcript.md,tool-trace.json,audit-log.ndjson,calendar-state.json}"
potency: "mutation — within an explicitly permitted temporary sandbox policy edit scope, permit and exercise one pre-approval create-event call; this gate must fail from the ordered trace and actual early calendar mutation; restore exactly before a green rerun."
run_policy: "Blocked"
stop: "Responsible harness implementer builds the required harness before product code if the harness does not exist; executor repairs once within the authorized scope from the trace, reruns on failure, then stops on repeated similar failure."
state: "Blocked — harness"
last_run: none
refs:
  - "Work spec C-### tool authority/approval/audit contracts when available"
```

### Missing Harness Spec

```yaml
harness: "agent-calendar-approval-boundary-eval"
proves: ["AGENT-CALENDAR-SCHEDULING__M1__G1"]
extends: "Extend a discovered agent/tool sandbox with canonical policy and adapter tracing; if no existing instrument observes ordered calls and actual calendar state, record that gap."
envelope: "Discovered agent/tool integration-test or eval-tool directory; identify the exact file envelope before implementation."
payload: "user request transcript, attendee availability fixtures, approval fixture, allowed/forbidden tool policy, expected event payload"
verdict: "Exactly the verdict in AGENT-CALENDAR-SCHEDULING__M1__G1; fail closed if any required observation is missing."
artifact: "tmp/<datetime>__agent-calendar-approval-boundary/"
required_before_product_code: "yes — the milestone depends on its declared tool-authority boundary."
route: "Responsible harness implementer; $eval-implement-proof-gate when available."
```

### Why this is strong proof

- It tests tool authority, not just assistant prose.
- It includes the forbidden-action boundary and exact mutation point.
- It leaves machine-readable audit evidence a human can inspect.
- It is deterministic enough for default CI if the repo has a sandbox/fake backend that preserves the real tool-policy boundary.

---

## Example 4 — Schema Migration: Backward-Compatible Replay Event Reads

### Scenario

We are evolving a persisted replay event schema, and existing replays must continue to load while new replays use the new shape.

### Proof-of-Value State

Old replay fixtures and new replay fixtures both read through the canonical replay loader; old records are not corrupted; new writes use the new schema; rollback/read compatibility is explicitly proven or blocked.

### Weak proof that is not enough

- Typecheck passes after changing the schema type.
- New fixture reads work, but old production-shaped records fail.
- A migration script runs once without verifying rollback or read-after-migration.
- Code handles both shapes but writes ambiguous mixed records.

### Gate Class Synthesis

| Required truth | Plausible lie prevented | Class | Gate | Reason |
|---|---|---|---|---|
| Old persisted records still load. | New code silently breaks existing user data. | Migration/compatibility | REPLAY-SCHEMA-MIGRATION__M1__G1 | Existing durable data is part of the product. |
| New writes use the intended schema. | Compatibility code works but new records keep old/ambiguous shape. | Persistence + Contract/API | REPLAY-SCHEMA-MIGRATION__M1__G1 | Migration value includes forward schema correctness. |
| Rollback/read strategy is safe. | One-way migration creates unrecoverable data risk. | Failure/hostile | REPLAY-SCHEMA-MIGRATION__M1__G1 | Data integrity requires reversibility or explicit no-rollback decision. |
| UI visual quality is proven. | Not relevant unless the migration changes visible playback. | Browser/render | Excluded | Excluded for pure loader/storage migration. |

After the harness exists: Default CI for reproducible compatibility fixtures required by current behavior. A required but unproven rollback/read strategy remains Blocked.

### Gate Card

```yaml
id: "REPLAY-SCHEMA-MIGRATION__M1__G1"
kind: "milestone"
class: "Migration/compatibility"
claim: "The replay loader can read old and new persisted event records, while new writes use the new schema without corrupting existing replay data."
lie: "Typecheck or new-fixture-only tests pass while old durable replay records fail or new writes remain ambiguous."
blind_spot: "The fixture matrix does not establish every historic data shape, production-volume migration behavior, or an unexercised deployment rollback procedure."
setup: "Immutable old-schema replay fixture from production-shaped data, new-schema replay fixture, isolated test store, canonical replay loader/writer entrypoints, and expected normalized event output."
action: "Load old fixture through canonical loader, load new fixture through canonical loader, write a new replay through canonical writer, then query raw stored event shape and normalized loader output."
observation: "Normalized loader outputs for old/new fixtures, raw write query output, migration/compatibility logs, and rollback/read strategy result."
verdict: "Pass only if old fixture loads to expected normalized events; new fixture loads to expected normalized events; new write stores only the new schemaVersion/encoding shape; no old fixture is mutated during read; malformed mixed-version records fail closed with a validation error; required rollback/read compatibility is proven by a reverse/read fixture; an approved no-rollback decision is recorded as an explicit exclusion with its data risk. Required rollback proof that is missing remains Blocked."
loop: "missing harness: replay-schema-compatibility-eval"
authority: "Local integration test environment using the canonical persistence adapter or a repo-approved recorded fixture store."
artifact: "tmp/<datetime>__replay-schema-compatibility/{summary.json,old-normalized.json,new-normalized.json,new-raw-write.json,malformed-result.json}"
potency: "mutation — within an explicitly permitted temporary loader edit scope, reject the supported old-schema fixture while leaving the loader callable; this gate must fail backward-compatible normalized output, then restore exactly before a green rerun."
run_policy: "Blocked"
stop: "Invoke the responsible harness implementer before product code; if rollback/read compatibility cannot be proven inside scope, return the required scope or data-risk decision to the responsible owner."
state: "Blocked — harness"
last_run: none
refs:
  - "Work spec C-### schema/persistence/rollback contracts when available"
```

### Missing Harness Spec

```yaml
harness: "replay-schema-compatibility-eval"
proves: ["REPLAY-SCHEMA-MIGRATION__M1__G1"]
extends: "Extend a discovered canonical loader/writer fixture instrument; if none covers historic reads, raw new writes, malformed records, and the required rollback/read strategy, record that gap."
envelope: "Discovered persistence/replay integration-test or eval-tool directory; identify the exact file envelope before implementation."
payload: "old-schema replay fixture, new-schema replay fixture, malformed mixed-version fixture, expected normalized event JSON"
verdict: "Exactly the verdict in REPLAY-SCHEMA-MIGRATION__M1__G1; fail closed if any required observation is missing."
artifact: "tmp/<datetime>__replay-schema-compatibility/"
required_before_product_code: "yes — durable-data compatibility is a required precondition for the migration."
route: "Responsible harness implementer; $eval-implement-proof-gate when available."
```

### Why this is strong proof

- It uses old and new durable fixtures, not just compile-time types.
- It checks reads, writes, malformed data, and rollback/read strategy.
- It treats existing data as user value, not implementation baggage.

---

## How to Generate New Examples at This Bar

When asked for examples for a new feature, do not start by naming tests. Start with the lies weak tests would allow.

Use this pattern:

1. **Name the value claim.** What would the user/operator/system now be able to do?
2. **List 3-7 required truths.** What must be true for that claim to be real?
3. **For each truth, name the plausible lie.** What weak proof could pass while value is broken?
4. **Choose gate classes.** Include the smallest set that kills those lies.
5. **Make compound claims same-run.** If conditions must hold together, one coordinator must run actors and observers concurrently.
6. **Write a gate card.** Include setup, action, observation, verdict, authority, artifact, potency, loop, run policy, state, last-run identity, and stop condition.
7. **Admit missing harnesses.** Use `missing harness: <stable-name>` with a spec detailed enough to implement.
8. **Separate objective from subjective.** If human taste/feel/readability matters, require an artifact-backed human question.

A new example is complete only when an implementation agent could build the missing harness from the spec without guessing the actors, observers, payload, verdict, or artifact bundle.
