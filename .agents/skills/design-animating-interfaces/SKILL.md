---
name: design-animating-interfaces
description: Design, implement, review, and debug DOM interface motion for web products and internal tools. Use for component transitions, loading and action feedback, easing and duration choices, animation performance, or motion tokens. Excludes SVG path morphing, canvas/WebGL, React Native, and Lottie implementations.
---

# Web Animation Design

Give concrete easing curves, durations, and code suited to the existing stack. Match depth to the request: a specific timing question needs a value and brief rationale; a motion system needs an inventory, tokens, and usage guidance.

Start with no animation. Add motion when it communicates a state change, relationship, action result, or interaction. Preserve this functional-purpose reasoning when simplifying an existing interface. Playing motion at 5x speed can help question decoration; treat that as a design heuristic.

## Scope and Boundaries

Cover DOM animation through CSS, Web Animations API, and JavaScript libraries such as Motion/Framer Motion, React Spring, and GSAP. Follow existing components and tokens before introducing a library. For SVG morphing, canvas/WebGL, React Native, or Lottie, explain transferable principles and route specific implementation to appropriate expertise.

For model demos and dashboards, animate the supplied interface states honestly. Surface loading and errors promptly; state feedback must not delay operations or imply progress unsupported by actual data. Model validity, metric selection, and experiment design remain with ML evaluation; work planning and general software verification remain separate.

Flag purely decorative motion, latency in frequently used controls, and competing attention. If decoration is the entire purpose, proceed only when the user explicitly wants it; honor authorization already supplied in the session. Offer a transform-based alternative when layout motion would add unnecessary work.

## Response Modes and References

Read only the material needed for the task. The checklist and reasoning below govern examples in every reference.

- **Quick answer:** Give the value, a small applicable snippet, and one sentence explaining its user effect. Apply the checklist to that snippet without printing every item. Consult [easing and springs](references/easing-and-springs.md) for curve variants or spring configuration.
- **Animation review:** Use the Review Format below. Identify relevant issues beyond the user's symptom and explain their effect on the interaction.
- **Design guidance or implementation:** Select a relevant example from [component recipes and exits](references/component-recipes.md). Read [accessibility and input](references/accessibility-and-input.md) when producing code to integrate keyboard, touch, and reduced-motion behavior.
- **Debugging:** Work through the ordered Diagnostic Protocol in [performance and debugging](references/performance-and-debugging.md). Record the affected interaction before assigning a performance cause.
- **System design:** Inventory existing animations before specifying tokens. Use [motion systems and integrations](references/motion-systems-and-integrations.md) for technology selection, choreography, motion budgets, tokens, and component libraries.
- **Incremental improvement:** Remove or repair janky motion, unify tokens, add reduced-motion support, then add missing functional feedback. Ship independent improvements separately.

## Mandatory Checklist

Apply these checks to the affected animation rather than requiring unrelated code in every snippet.

1. **Explicit properties, easing, and timing:** List transitioned properties; avoid `transition: all`. Give explicit duration and easing for time-based animation. Springs need explicit supported configuration and an intended response time; scroll timelines derive progress from scrolling.
2. **Transform origin:** Scaling a popover, dropdown, modal, or tooltip requires an explicit origin corresponding to its trigger when known. Use a stated fallback for system-triggered surfaces.
3. **Performance:** Prefer `transform` and `opacity`. Filters, clipping, color, backgrounds, and layout changes are conditional exceptions whose cost depends on the implementation. A grid accordion still performs layout; FLIP measures layout and animates transforms. Explain the exception and inspect actual performance when jank or risk warrants it. See the performance reference.
4. **Reduced motion:** Include a counterpart that removes spatial motion, bounce, and continuous loading shimmer while retaining state information. A brief opacity change or immediate update is acceptable. Later state rules and inline styles must not restore the removed motion.
5. **Keyboard and assistive activation:** Apply state, focus, and feedback immediately for keyboard-triggered actions. Set the animation timing to zero using the triggering event or the component library's interaction state. A `:focus-visible` sibling selector alone cannot establish how an action was triggered.
6. **Touch-safe hover:** Put hover effects inside `@media (hover: hover) and (pointer: fine)`. Keep the action and feedback available without hover.
7. **Interruption and lifecycle:** Define reversal, cancellation, and removal behavior. An interrupted exit must not remove a reopened element. Motion must preserve the component's existing focus, semantics, and interaction lifecycle.

Default timing is 200ms with `cubic-bezier(0.215, 0.61, 0.355, 1)`. Use opacity alone when spatial continuity is unnecessary; for an appropriate scale entry, start at `scale(0.95)`, then settle at 1. Make deliberate departures using the decision criteria below.

## The Reasoning Chain

Use these steps to choose the animation. Give the user the relevant rationale and tradeoffs, with depth proportional to the request.

### Step 1: What triggers it, and what does it communicate?

Identify the user action or system-initiated change, then classify its function:

- **Continuity:** Show how state A becomes state B. Name the spatial relationship being preserved.
- **Feedback:** Confirm an action registered. Keep pointer feedback at 100-150ms without spring or stagger delays.
- **Orientation:** Show consistent relationships, such as a sidebar entering from the same side.
- **Demonstration:** Teach a first-use interaction; more choreography may serve that purpose.
- **Decoration:** Question the motion's purpose and apply the boundary above.

Continuity often benefits from transforms. For a function that needs no spatial movement, prefer opacity or immediate state feedback.

### Step 2: How often will users see it?

| Frequency | Examples | Guidance |
|---|---|---|
| 100+ times/day | Command palette, menu toggle, shortcuts | Prefer no animation or opacity below 100ms; keyboard-triggered changes are immediate |
| 10-100 times/day | Modal, dropdown, tooltip | Fast, purposeful standard motion |
| 1-10 times/day | Page transition, onboarding | Slightly longer timing can help orientation |
| Rare or first use | Welcome, achievement, teaching | Springs or stagger can serve an explicit purpose |

### Step 3: Choose easing

| Behavior | Easing |
|---|---|
| Entering | ease-out |
| Permanent exit, such as dismiss or delete | ease-in |
| Exit with expected return | ease-out, paired with entry |
| Movement within the view | ease-in-out |
| Hover or color feedback | ease |
| Constant-speed motion or truthful progress interpolation | linear |
| Indeterminate loading | ease-in-out as a design starting point |
| Gesture response or velocity-preserving interruption | spring |

Ease-in starts slowly and can make entries feel delayed. Paired elements, such as modal and overlay, share timing and easing. Keep actual progress tied to real data. Detailed curve values and spring settings are in the easing reference.

### Step 4: Choose duration

Start at 200ms. Small elements usually need 50ms less; large panels may need 50-100ms more. Short travel can reduce timing by 25ms; long travel can add 50ms. For high-frequency controls, subtract 50-100ms or remove motion. Round to sensible values such as 100, 125, 150, 200, 250, or 300ms.

| Context | Range | Ceiling for ordinary time-based UI motion |
|---|---|---|
| Micro-interaction | 100-150ms | 150ms |
| Tooltip or dropdown | 125-200ms | 250ms |
| Modal, drawer, sidebar | 200-300ms | 350ms |
| Page or route transition | 250-350ms | 400ms |

Useful component defaults are tooltip 125ms, dropdown 150ms, and modal 250ms. Sequential tooltips appear immediately. Below 100ms can feel immediate; longer timing becomes more noticeable. These are design starting points, and the actual interaction determines perceived delay. Prefer the faster useful option. Spring settling and continuous loading are different from a fixed transition; keep their visible response fast.

### Step 5: Check performance

Prefer transform and opacity, then assess any exception using the checklist. A library's layout feature does not eliminate layout measurement. For jank, inspect frame time, layout, and paint before choosing the smallest useful correction.

### Step 6: Check accessibility

Keep the same state information available with reduced motion, keyboard, touch, and assistive activation. Use the accessibility reference for input handling and preference changes. Immediate feedback takes priority over animation.

### Step 7: Check interruption

Try the reverse action before completion. CSS transitions can reverse from the current value; a configured physics spring can retain velocity. Explicit JavaScript timelines need cancellation and ownership checks, particularly before removing an element.

## Review Format

Use a table for animation reviews, with each reason tied to the affected user interaction:

| Before | After | Why |
|---|---|---|
| Current behavior or precise code | Specific correction | What changes for the user and why it matters |

Prioritize blocked actions, delayed feedback, reduced-motion failures, and observed jank before stylistic refinements. Distinguish inspection from runtime observations. Verify the affected states and interruption paths proportionately; interface checks do not establish ML model quality.
