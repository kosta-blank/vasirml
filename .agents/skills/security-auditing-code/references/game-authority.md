# Game authority security checks

Read this reference only when the audited scope includes gameplay-derived rewards, progression, match results, realtime sessions, prediction, or resynchronization. Combine it with the economic and event-driven checks in the main skill where relevant.

## Authority and provenance

- Treat client-reported scores, results, drops, rewards, cooldowns, and progression as proposals. Trace the server-side decision that authorizes each resulting mutation.
- Identify the actual authority architecture. If a deterministic simulation kernel supplies authority, inspect validation or reconstruction from seed plus intents, authoritative randomness and time, and evidence of determinism violations. Do not require that architecture for every game; document how another design establishes authoritative results and mutation provenance.
- Bind reward claims to the authenticated actor, match/result identity, rule version, and permitted reward. A signed result still needs correct issuer, recipient, expiry, and claim-once enforcement.

## Replay, correction, and recovery

- Inspect repeated claims, delayed or reordered messages, reconnects, restore boundaries, and manual replays. Reconstructible results must not cause the same reward or entitlement to be granted twice.
- Check that correction, prediction, resync, rollback, and recovery paths cannot mint value, bypass cooldowns, widen permissions, or re-grant settled rewards.
- Inspect server enforcement of cooldowns, replay windows, terminal result states, inventory bounds, and atomic grant/spend operations. Apply the same invariants to admin and repair paths.
- Recommend closure evidence that exercises duplicate claims, replay after restore, concurrent settlement, forged results, and correction/resync. Distinguish inspected test definitions from execution results supplied by the user.

Report an observed authority or invariant failure with its exploit path and evidence. Missing simulation or deployment artifacts limit confidence; they do not by themselves prove that authority is absent.
