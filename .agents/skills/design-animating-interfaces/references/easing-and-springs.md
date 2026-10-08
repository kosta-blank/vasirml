# Easing and Springs

## Easing Reference

Each category lists options from subtle to aggressive. **The bolded entry is the default : use it unless you have a specific reason for another.**

### ease-out (Default for most UI)

```css
--ease-out-quad:  cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* subtle */
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);     /* ← DEFAULT. Balanced. Use this. */
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);      /* punchy : use for snappy UIs (Linear, Raycast style) */
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);          /* snappy */
--ease-out-expo:  cubic-bezier(0.19, 1, 0.22, 1);          /* aggressive */
```

**Default: `ease-out-cubic`.** Use `ease-out-quart` only when the design explicitly calls for a snappy, punchy feel.

### ease-in-out (On-screen movement)

```css
--ease-in-out-quad:  cubic-bezier(0.455, 0.03, 0.515, 0.955);  /* gentle */
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);     /* ← DEFAULT. Use this. */
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);          /* dramatic */
```

**Default: `ease-in-out-cubic`.**

### ease-in (Permanent exits only)

```css
--ease-in-quad:  cubic-bezier(0.55, 0.085, 0.68, 0.53);
--ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);   /* ← DEFAULT for exits. */
```

**Default: `ease-in-cubic`.** Only use for elements being dismissed, deleted, or sent away.

### ease (Hover and color)

```css
transition: background-color 150ms ease;
```

Use the `ease` keyword. No cubic-bezier needed.

### linear (Rare)

Use `linear` when constant speed communicates the behavior: truthful progress interpolation, a ticker, marquee, or hold-to-confirm indicator. Keep progress targets tied to actual data. `ease-in-out` is a design starting point for indeterminate loading; no percentage improvement in perceived wait is assumed.

### Paired Elements Rule

Elements that animate as a unit share easing and duration. Modal + overlay. Tooltip + arrow. Drawer + backdrop.

```css
.modal   { transition: transform 200ms var(--ease-default); }
.overlay { transition: opacity 200ms var(--ease-default); }
```

## Spring Animations

Physics springs can preserve velocity during interruption. Duration-based spring presets serve timing-oriented motion and may have different interruption behavior. Use springs when:
- Animation responds to gestures (drag, swipe, throw)
- Animation might be interrupted mid-motion
- You need momentum preservation
- You want organic, "alive" feeling

### Configuration

For Motion / Framer Motion, these existing duration-and-bounce presets are candidate configurations in seconds. They are not universal values for other libraries. Keep visible state feedback within the main timing guidance; a 0.5s modal or 0.35s menu preset may need shortening. Use a physics configuration when preserving incoming velocity matters. [Motion: transitions](https://motion.dev/docs/react-transitions)

| Component | duration | bounce | Notes |
|---|---|---|---|
| **Modal present/dismiss** | 0.5 | 0 | No bounce : UI state changes must be clean |
| **Navigation push/pop** | 0.5 | 0 | No bounce |
| **Dropdown / popover** | 0.35 | 0 | Fast, no bounce |
| **Gesture completion** (drag release, swipe snap) | 0.4 | 0.15 | Subtle bounce feels physical |
| **Rubber-banding** (overscroll, elastic edge) | 0.3 | 0.2 | Playful bounce is appropriate |
| **Onboarding / marketing** | 0.6 | 0.25 | More personality allowed |
| **Game UI / achievement** | 0.5 | 0.3 | Playful, attention-grabbing |

```js
// Motion / Framer Motion configuration fragment for a productivity surface.
// Feed these booleans from the live preference and triggering action.
const transition = keyboard
  ? { type: 'tween', duration: 0 }
  : reducedMotion
    ? { type: 'tween', duration: 0.15, ease: 'easeOut', scale: { duration: 0 } }
    : { type: 'spring', visualDuration: 0.25, bounce: 0 };

// React Spring uses its own physics configuration.
useSpring({
  opacity: isOpen ? 1 : 0,
  transform: isOpen || reducedMotion ? 'scale(1)' : 'scale(0.95)',
  immediate: reducedMotion || keyboard,
  config: { tension: 170, friction: 26, clamp: true }
});
```

**Rule: bounce: 0 for all productivity UI state changes.** Bounce > 0 only for gestures, onboarding, or game UI.

Motion's `visualDuration` describes the bulk of visible motion, while settling can continue. Explicit stiffness, damping, or mass change how duration/bounce settings apply. React Spring has different configuration semantics; its duration mode is time-based, and physics tuning uses tension/friction or its supported equivalents. Check the installed version before supplying code. [React Spring: spring configs](https://www.react-spring.dev/docs/advanced/config)

Pair these configuration fragments with an explicit origin for scaled surfaces and the lifecycle handling in [accessibility and input](accessibility-and-input.md). Reset active spatial motion immediately when reduced motion becomes enabled.

### When to Switch from CSS to Springs

- You need the library's presence lifecycle for exits; that need alone does not require a spring
- Gesture or interruption behavior needs velocity preservation beyond CSS transition reversal
- You need gesture-driven motion with momentum
- You're in React and need `AnimatePresence`
