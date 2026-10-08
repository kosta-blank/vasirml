# Frontend Inserts

<!-- vasir:purpose:start -->
**Purpose:** [Describe this frontend repository in 2-3 repo-specific sentences. State its users, main experience, and what useful and accessible behavior means here.]
<!-- vasir:purpose:end -->

<!-- vasir:routing:start -->
- **UI and navigation:** Before changing a screen, component, route, or loader, inspect the nearest instructions, existing patterns, and relevant tests in this repository.
- **Styling and state:** Locate the actual design-system, styling, and state-management guidance before adding primitives or changing shared behavior.
<!-- vasir:routing:end -->

<!-- vasir:engineering-doctrine-inserts:start -->
## Frontend Guidance

### Existing stack and structure

Follow the repository's framework, dependency versions, language, module system, styling approach, state library, and test runner. Use established component and file organization. Do not impose React, JavaScript, Zustand, BEM, or a new toolchain on every frontend.

Reuse existing accessible primitives, tokens, and shared components before adding alternatives. In a BEM project, follow its block and stylesheet conventions; in another system, follow that system's conventions. Prefer meaningful, searchable names and explicit data shapes over clever abbreviations.

### User experience and accessibility

Make current state, available actions, and consequences clear. Use hierarchy, spacing, labels, contrast, and feedback appropriate to the task's complexity and attention needs. Give important actions visual priority without hiding context needed for an informed decision.

Use semantic HTML and native controls where applicable. Verify keyboard access, focus, accessible names, and loading, empty, error, disabled, and success states. Do not convey meaning through color or motion alone; respect reduced-motion preferences.

Carry useful context across navigation. Explain destructive consequences at the point of action, and follow the product's established confirmation or undo policy. Use existing confirmation components where required; do not invent a global modal requirement for every mutation.

### State and effects

Keep state ownership clear and subscriptions as narrow as the existing library supports. Avoid unnecessary derived state, broad subscriptions, and repeated renders on hot interactions.

For asynchronous work, consider cancellation, stale responses, retry behavior, and component teardown. Effects must have appropriate dependencies and cleanup; check that an error transition cannot repeatedly trigger the initiating request. In React, prefer event handlers for user actions and the established loading approach for data; use effects when synchronization requires them.

Use the established logger with bounded, redacted diagnostics. Keep credentials, tokens, and sensitive user data out of console, network traces, and screenshots saved as evidence.

### Verification

For material interaction, navigation, or client/server changes, exercise the affected journey in a rendered browser using the existing harness. Identify the actor, entrypoint, seed/auth state, actions, expected side effects, and final visible state. Check relevant target viewports and capture enough fresh evidence to assess the claim.

Use focused unit and component tests for stable boundaries and controlled failure cases; add integration or browser tests where those layers establish behavior the change depends on. Follow the repository's test locations and tools.

For a small presentation change, a focused rendered check can be sufficient. Inspect for layout overlap, missing content, console errors, and relevant request failures. If the application or journey cannot run, report the reason and the verification level achieved; a build alone does not establish rendered behavior.
<!-- vasir:engineering-doctrine-inserts:end -->
