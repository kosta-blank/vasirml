# iOS Inserts

<!-- vasir:purpose:start -->
**Purpose:** [Describe this iOS repository in 2-3 repo-specific sentences. State its users, main experience, supported environments, and what correctness means here.]
<!-- vasir:purpose:end -->

<!-- vasir:routing:start -->
- **Lifecycle and synchronization:** Before changing startup, backgrounding, networking, or persistence, inspect the nearest instructions and actual lifecycle/sync documentation.
- **UI and platform:** Before changing screens, navigation, accessibility, signing, or deployment, inspect the existing platform configuration, UI patterns, and relevant tests.
<!-- vasir:routing:end -->

<!-- vasir:engineering-doctrine-inserts:start -->
## iOS Guidance

### Existing platform

Follow the repository's supported OS versions, language, UI framework, concurrency model, dependency policy, and build/test commands. Use existing modules and design-system components. Read the actual project or package configuration before changing targets, entitlements, signing, or startup.

### Lifecycle and resources

Keep blocking parsing, disk, and network work off the main thread, and update UI through the framework's required execution context. Make actor/thread ownership clear when sharing mutable state.

Treat foreground/background transitions, suspension, cancellation, and process termination as expected conditions. Define persistence and recovery for interrupted work. Do not assume completion handlers, timers, or background execution will run indefinitely.

Respect memory, battery, thermal, and launch budgets. Measure material changes to scrolling, animation, decoding, or startup. Avoid large transient copies and unnecessary hot-path allocations. Verify the original failure mode before removing a platform workaround.

### Connectivity and data

Specify offline, reconnect, resume, and retry behavior. Do not use device clocks, push arrival, or connectivity signals as reliable ordering guarantees. Bound retries and make repeatable side effects safe.

Follow existing secure-storage and privacy practices. Keep credentials and sensitive data out of logs and evidence. When adding a capability or SDK, identify required permissions, data collection, ownership, and lifecycle behavior under the repository's dependency policy.

### Verification

Use focused logic tests for stable contracts and simulator/device checks for changed platform behavior. Exercise relevant lifecycle, denied-permission, offline, and recovery cases when the change depends on them.

For material UI changes, render the affected screen or journey and check layout, keyboard, accessibility, and supported device sizes as relevant. Preserve useful evidence of the result. Identify what was checked on a simulator and what still requires a physical device, entitlement, credential, or deployment environment. Report unavailable verification explicitly.
<!-- vasir:engineering-doctrine-inserts:end -->
