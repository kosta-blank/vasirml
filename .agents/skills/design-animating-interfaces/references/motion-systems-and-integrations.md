# Motion Systems and Integrations

Use this reference for an app-wide motion system, choreography, library choice, or component-library integration. Preserve the app's existing stack and conventions. Apply the entrypoint's checklist to any resulting code, including the [accessibility and input](accessibility-and-input.md) handling.

## Technology Selection

```
What do you need?
├── Simple enter/exit, hover, state change
│   └── CSS transitions
├── Complex keyframe sequences, scroll-driven animation
│   └── CSS @keyframes; scroll timelines when target browsers support them
├── More control than CSS, no framework dependency
│   └── Web Animations API (vanilla JS)
│       Explicit timing, easing, and cancellation
├── Exit animations, layout animation, gesture-driven
│   └── Existing compatible presence/layout/gesture library
├── Spring physics, interruptible motion
│   └── Motion / Framer Motion or React Spring (React); compatible spring library otherwise
└── Page/route transitions, shared-element animation
    └── View Transitions API
```

For retained CSS surfaces, controlled removal, and route changes, see [component recipes and exits](component-recipes.md). Check the installed API and target browsers before choosing modern features. A state change should still work immediately when the animation feature is unavailable.

## Choreography and Stagger

### Stagger Timing

```css
/* 30ms offset, cap total stagger at 300ms regardless of list length */
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 30ms; }
.item:nth-child(3) { animation-delay: 60ms; }
/* Only stagger first 8-10 visible items */
```

Rules: 20–40ms offset (30ms default). 300ms max total stagger. Same easing and duration for all items.

### Attention Hierarchy (Staging)

Direct the user's eye to the right place. Start from where the user is already looking.

1. **Primary element** animates first (the main content, focal point)
2. **Supporting elements** follow at 30–60ms delay
3. **Decorative elements** animate last or not at all

**Never let secondary animations compete with the primary for attention.** If two animations fight for the eye, remove one.

### Grouped Motion

Elements with parent-child relationships animate as a unit. A card's title, image, and description don't each get their own animation : the card animates and children inherit.

Put the card's content inside one animated wrapper. For example, use the preference-aware `AnimatedSurface` from the accessibility reference and give its title, image, and description no independent animation props. This preserves the relationship without multiplying attention cues or timing policies.

### Animation Budget

Maximum 3–4 distinct animation patterns per view. If every component has its own bespoke animation, the interface feels chaotic. Consistency > variety.

## Animation System Design

### Motion Audit (Do This First)

Before defining tokens, inventory what exists:
1. List every animation in the current app
2. Classify each by function (continuity, feedback, orientation, demonstration, decoration)
3. Note the easing, duration, and properties animated for each
4. Identify inconsistencies and decoration that should be removed

### Easing Tokens

```css
:root {
  --ease-default:  cubic-bezier(0.215, 0.61, 0.355, 1);    /* ease-out-cubic : primary */
  --ease-movement: cubic-bezier(0.645, 0.045, 0.355, 1);   /* ease-in-out-cubic */
  --ease-hover:    ease;
  --ease-exit:     cubic-bezier(0.55, 0.055, 0.675, 0.19);  /* ease-in-cubic */
  --ease-snappy:   cubic-bezier(0.165, 0.84, 0.44, 1);      /* ease-out-quart */
  --ease-dramatic: cubic-bezier(0.77, 0, 0.175, 1);         /* ease-in-out-quart */
}
```

### Duration Tokens

```css
:root {
  --duration-instant: 0ms;
  --duration-quick:   100ms;
  --duration-fast:    150ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-slower:  400ms;
}
```

### Composition Tokens

```css
:root {
  --transition-enter: var(--duration-normal) var(--ease-default);
  --transition-exit:  var(--duration-fast) var(--ease-exit);
  --transition-move:  var(--duration-normal) var(--ease-movement);
  --transition-hover: var(--duration-fast) var(--ease-hover);
  --stagger-offset:   30ms;
}
```

### Usage

Derive component motion from a small token set. For a new value, explain which interaction needs it and whether an existing token would work. Preserve the budget of 3-4 distinct patterns per view. The example distinguishes immediate updates at 0ms from quick motion at 100ms; preserve existing token names in a real app until any naming migration is deliberately handled.

The 125ms tooltip and 250ms modal defaults can be named component tokens derived from the system. Apply frequency and accessibility constraints before using the slower tokens. For spring motion, use the library-specific configuration in [easing and springs](easing-and-springs.md).

## Component Library Integration

### Radix UI

```css
.dropdown-content {
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  transition: transform 150ms var(--ease-default), opacity 150ms var(--ease-default);
}
.dialog-overlay[data-state="open"]   { opacity: 1; }
.dialog-overlay[data-state="closed"] { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .dropdown-content,
  .dropdown-content[data-state="open"],
  .dropdown-content[data-state="closed"] {
    transform: none;
    transition: opacity 150ms ease;
    animation: none;
  }
}
```

### shadcn/ui

For components based on Radix, use their `data-state` attributes and CSS variables. Inspect the installed component implementation and remove conflicting spatial keyframes as well as transitions under reduced motion. Preserve its focus and keyboard lifecycle.

### Headless UI

Use the installed version's transition lifecycle, classes, or state attributes. Enter with ease-out and exit with the easing appropriate to permanent dismissal or expected return. The historical `enter`/`enterFrom`/`leave` prop API is version-dependent; do not assume it exists in the installed version. Use opacity-only styles for reduced motion and zero timing for keyboard activation. Retain the library's accessible component state and focus behavior.
