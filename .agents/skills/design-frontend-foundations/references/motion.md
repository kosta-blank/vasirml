# Motion decisions and practical techniques

Read when adding animation, selecting timing, or diagnosing an interaction. The main skill owns naming, token, touch, and reduced-motion requirements. The examples here use that contract.

## Choose motion by purpose and frequency

Animate when continuity explains an enter/exit, a state change, a spatial relationship, or direct feedback. Frequent operational actions should feel immediate. Around 100 uses per day is a prompt to remove or greatly reduce motion, rather than a threshold that makes the decision automatically. Keep keyboard list navigation, shortcuts, and focus movement immediate.

Marketing and first-use experiences may justify more choreography. Product interactions should preserve responsiveness. Larger moving surfaces can take longer to settle than small controls; paired elements such as a modal/backdrop or tooltip/arrow should share timing when they move as a unit.

| Situation | Starting duration | Easing |
|---|---|---|
| Small press or hover feedback | 100–150ms | `ease` for color/hover; purposeful movement as below |
| Tooltip or dropdown | 150–250ms | `ease-out` for enter/exit |
| Modal or drawer | 200–300ms | `ease-out` |
| Whole-page transition | 300–400ms when useful | Match the spatial motion |
| On-screen movement or morph | Based on distance and size | `ease-in-out` |
| Constant-speed motion or elapsed-time display | Match the represented process | `linear` |

These are starting ranges. Aim for at most 300ms for ordinary product affordances; the page range is a distinct case, not a blanket rule for controls. Preserve the original requirement to justify and obtain approval for decorative or illustrative transitions above 1000ms. Continuous indicators represent an ongoing process instead of delaying completion by a fixed duration.

`ease-out` starts quickly and settles, helping a user-triggered element feel responsive. `ease-in-out` suits something already visible accelerating and braking. `ease-in` usually delays perceived feedback, so avoid it for routine interaction. Linear timing is useful when constant speed or elapsed time is the meaning.

Use quick `ease-out` departures as a starting choice for tooltips and panels. A short `ease-in-out` exit may suit an already visible surface changing direction; document that choice alongside its entry. The [toast example](toast-example.md) deliberately pairs a 300ms ease-out entry with a 200ms ease-in-out departure. Review the combined lifecycle and repetition cost rather than imposing one easing on every exit.

### Custom easing options

Select one curve per purpose; this table retains the original progression from gentler to stronger curves. Do not load every curve into a small product.

| Curve | `ease-out` cubic-bezier | `ease-in-out` cubic-bezier |
|---|---|---|
| Quad | `(0.25, 0.46, 0.45, 0.94)` | `(0.455, 0.03, 0.515, 0.955)` |
| Cubic | `(0.215, 0.61, 0.355, 1)` | `(0.645, 0.045, 0.355, 1)` |
| Quart | `(0.165, 0.84, 0.44, 1)` | `(0.77, 0, 0.175, 1)` |
| Quint | `(0.23, 1, 0.32, 1)` | `(0.86, 0, 0.07, 1)` |
| Expo | `(0.19, 1, 0.22, 1)` | `(1, 0, 0, 1)` |
| Circ | `(0.075, 0.82, 0.165, 1)` | `(0.785, 0.135, 0.15, 0.86)` |

## Performance and interruptibility

Prefer transform and opacity for moving or revealing surfaces; layout-changing properties such as width, height, margin, and padding can add layout work. Compositing depends on the browser, effect, and scene, so measure rather than promising GPU execution. Scoped CSS custom properties keep per-frame changes away from unrelated descendants.

Use CSS for simple predetermined transitions. Use an existing animation runtime for dynamic gestures, shared choreography, and interruption when it provides a benefit. Avoid React state updates on every animation frame; refs or runtime-owned updates can keep frame work outside ordinary component rendering. Check the chosen runtime's behavior rather than assuming an `x` property or transform string guarantees acceleration.

Springs can preserve continuity during interrupted dragging or momentum. Choose a library's duration/bounce interface or physical parameters such as mass, stiffness, and damping. For a playful gesture, 0.1–0.3 bounce is a starting range; conventional operational UI usually needs little or none. Verify that interruption continues from the current state and velocity. A spring's settling behavior needs its own review rather than an assumed fixed duration.

## Practical techniques

Define the chosen values once in the project's token layer. This example supplies the tokens used below; adjust them for the actual interface.

```css
:root {
  --duration-feedback: 150ms;
  --duration-tooltip: 125ms;
  --duration-panel: 200ms;
  --ease-hover: ease;
  --ease-enter: cubic-bezier(0.215, 0.61, 0.355, 1);
  --press-scale: 0.97;
  --enter-scale: 0.95;
  --hover-lift: -4px;
  --control-hit-size: 44px;
}
```

- **Press feedback:** a subtle `.ui-button:active` scale using `--press-scale` can communicate contact. Keep it optional for frequently repeated actions.
- **Enter from a recognizable shape:** a small scale change with opacity usually preserves spatial continuity better than scaling from zero.
- **Origin-aware popovers:** set a component-scoped transform-origin custom property from the trigger's position. An existing library's origin variable can supply that value without styling its state attributes.
- **Sequential tooltips:** the first may use a short delay; subsequent tooltips while browsing a group should switch immediately. Map any library instant-state attribute to an `is-instant` class.

```css
.review-tooltip {
  opacity: 1;
  transform: scale(1);
  transform-origin: var(--review-tooltip-origin, center);
  transition:
    transform var(--duration-tooltip) var(--ease-enter),
    opacity var(--duration-tooltip) var(--ease-enter);
}

.review-tooltip.is-hidden {
  opacity: 0;
  transform: scale(var(--enter-scale));
}

.review-tooltip.is-instant {
  transition: none;
}
```

Provide `--review-tooltip-origin` from the trigger geometry; the example falls back to center. The component still owns visibility, focus, and accessible tooltip behavior; opacity alone does not hide content from assistive technology or prevent pointer interaction.

### Stable hover area

When a moving hover target leaves the pointer, animation can flicker. Keep the parent hit area stable and move a named child. Add this enhancement only where hover is supported:

```css
.model-card__content {
  transition: transform var(--duration-feedback) var(--ease-hover);
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .model-card:hover .model-card__content {
    transform: translateY(var(--hover-lift));
  }
}
```

For an icon control, prefer `min-inline-size` and `min-block-size` using `--control-hit-size`. When layout requires a smaller visual control, a component-specific pseudo-element can expand its hit area. Check overlap, clipping, stacking, and pointer behavior; a large global z-index is not a default remedy.

### Reduced motion implementation

Keep each component's preference-aware behavior explicit. A shared query can cover multiple components:

```css
@media (prefers-reduced-motion: reduce) {
  .review-tooltip,
  .review-tooltip.is-hidden,
  .model-card__content,
  .ui-button,
  .ui-button:active {
    animation: none;
    transition: none;
    transform: none;
  }
}
```

For JavaScript or spring motion, read the same user preference through the runtime's reduced-motion hook or equivalent. Skip displaced/scaled initial states and set transitions to immediate when reducing motion; changing the initial state alone does not disable later animation. Keep essential state feedback understandable and use a static or user-controlled alternative for nonessential continuous motion.

## Diagnose before adding effects

Record a troublesome transition and inspect it frame by frame. Check timing, transform origin, hover geometry, competing transforms, and layout work first. Revisit the interaction after sustained use; a first impression may miss repetition costs.

If profiling identifies compositing-related jitter, try a narrowly scoped `will-change: transform` while the interaction runs and release it afterward. It is a hint with resource costs, not a universal jitter fix. Blur may serve an intentional visual transition, but it adds rendering work and should not mask an unresolved state or layout defect. Review the effect on the target devices before keeping it.
