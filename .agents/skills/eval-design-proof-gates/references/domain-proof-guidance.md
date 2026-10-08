# Domain-Specific Proof Design

Read the sections that match the current software value path. These refine the canonical gate cards in `../SKILL.md`; they introduce no separate schema.

## Browser and Canvas Surfaces

- Name the concrete driver and invocation in `loop`: a discovered Playwright project, headless-Chromium script, or existing capture harness. When specifying a missing browser instrument, prefer Playwright if the repository supports it and no existing instrument covers the surface. Record the choice in `extends`; discovery remains read-only.
- Bind waits to user-visible state or exact network/frame events. Arbitrary sleeps create flakiness.
- Require zero console/page errors unless the card explicitly records a justified waiver. When transport matters, assert method/path or websocket frame type and critical payload fields.
- For canvas and game surfaces, prove a nonblank, correctly framed, interacting surface. A loaded page alone cannot establish the experience.
- A fast simulation harness can supply an iteration loop while `authority` remains the browser. Final proof must run in that authority environment.

## Game and Mobile Viewports

Derive the target device, orientation, and viewport from the current brief or repository configuration. For a mobile-native portrait claim, include fresh evidence at that target viewport using the existing browser instrument's configuration. Desktop or landscape evidence can supplement the portrait proof.

The original examples assumed **390×844** portrait. Use that size only when sourced by the current target or explicitly labeled as an assumption; clarify an unresolved target that would change acceptance. Game work does not by itself establish a mobile target.

## Deterministic Replay, Snapshot, and Restore

Assert equality at the restore boundary **and** at a later checkpoint or final hash. Final-state-only equality can hide drift that later reconverges. Use the repository's canonical state, clock, replay, and hashing instruments; name the checkpoints and evidence in the card.
