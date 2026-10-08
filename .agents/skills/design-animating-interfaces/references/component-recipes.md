# Component Recipes and Exits

Use these visual excerpts within the project's existing accessible components. Preserve semantics, focus management, and hidden-state hit testing. For keyboard actions, mark animated elements with `data-motion` and integrate the scoped input handling in [accessibility and input](accessibility-and-input.md); use explicit input origin for JavaScript timelines. Component-specific reduced-motion rules are included below.

## Exit Animations

CSS cannot continue animating an element after it has been removed. Animate a retained surface, defer removal with explicit cancellation, or use the component library's presence lifecycle. Choose the simplest option compatible with the existing component and target browsers.

### 1. CSS `@starting-style` + `allow-discrete` (simplest, modern browsers)

```css
.element {
  transition: opacity 200ms cubic-bezier(0.215, 0.61, 0.355, 1),
              display 200ms cubic-bezier(0.215, 0.61, 0.355, 1) allow-discrete;
  opacity: 1;
}
.element.hidden { opacity: 0; display: none; }
@starting-style { .element { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .element,
  .element.hidden { transition: none; }
}
```

This transitions `display: none` on a retained element. It does not defer `el.remove()`. The discrete `display` transition keeps the surface rendered during the fade; it is an explicit lifecycle exception. Check support in the project's target browsers and keep immediate visibility changes as the fallback. [MDN: transition-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-behavior)

### 2. Web Animations API (vanilla JS, no library)

```js
const exitAnimations = new WeakMap();

function cancelExit(el) {
  const animation = exitAnimations.get(el);
  exitAnimations.delete(el);
  animation?.cancel();
}

async function removeWithFade(el, inputOrigin = 'system') {
  cancelExit(el);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || inputOrigin === 'keyboard') {
    el.remove();
    return true;
  }

  const animation = el.animate(
    [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }],
    { duration: 200, easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', fill: 'forwards' }
  );
  exitAnimations.set(el, animation);
  const onPreferenceChange = event => {
    if (event.matches) animation.finish();
  };
  preference.addEventListener('change', onPreferenceChange);
  try {
    await animation.finished;
    if (exitAnimations.get(el) !== animation) return false;
    el.remove();
    return true;
  } catch (error) {
    if (error.name === 'AbortError') return false;
    throw error;
  } finally {
    preference.removeEventListener('change', onPreferenceChange);
    if (exitAnimations.get(el) === animation) exitAnimations.delete(el);
    animation.cancel();
  }
}
```

Call `cancelExit(el)` before reopening the same surface. The ownership check prevents an old completion from removing a newer state. Cancellation rejects `animation.finished`, so handle it. [MDN: Animation.finished](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished)

### 3. Motion / Framer Motion `AnimatePresence` (React)

Wrap the conditional child in `AnimatePresence` and define its explicit `exit` state. Use the complete preference-aware `AnimatedSurface` example in [accessibility and input](accessibility-and-input.md), then retain the component library's focus and presence lifecycle.

### 4. View Transitions API (page/route transitions)

```js
// The caller supplies the origin of this state change.
function updateWithTransition(updateContent, inputOrigin = 'system') {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!document.startViewTransition || preference.matches || inputOrigin === 'keyboard') {
    updateContent();
    return;
  }
  const transition = document.startViewTransition(updateContent);
  const onPreferenceChange = event => {
    if (event.matches) transition.skipTransition();
  };
  preference.addEventListener('change', onPreferenceChange);
  const cleanup = () => preference.removeEventListener('change', onPreferenceChange);
  transition.finished.then(cleanup, cleanup);
  return transition;
}
```

```css
::view-transition-old(root) { animation: fade-out 200ms ease-in forwards; }
::view-transition-new(root) { animation: fade-in 200ms ease-out forwards; }
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

For shared-element transitions, name elements with `view-transition-name`:
```css
.thumbnail { view-transition-name: hero-image; }
.full-image { view-transition-name: hero-image; }
```

Name only the participating element in each snapshot; duplicate names within one snapshot break the intended correspondence. The pseudo-element rules above cover root fades. For named shared elements, disable their transitions under reduced motion too. Cross-document transitions have a separate opt-in and lifecycle; confirm support for the project's routing model instead of relying on a static browser-version list.

## Component Recipes

Apply the main checklist and the input helper to the relevant visual elements. The default timings here preserve the existing component recommendations.

### Modal / Dialog

```css
.modal {
  transition: transform 250ms cubic-bezier(0.215, 0.61, 0.355, 1),
              opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: scale(0.95); opacity: 0;
  transform-origin: var(--trigger-position, center);
}
.modal[open] { transform: scale(1); opacity: 1; }
.modal-overlay {
  transition: opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

@media (prefers-reduced-motion: reduce) {
  .modal,
  .modal[open] {
    transition: opacity 150ms ease;
    transform: none;
  }
  .modal-overlay { transition: opacity 150ms ease; }
}
```

Scale from 0.95, never from 0. Modal and overlay share timing.

### Toast / Notification

```css
.toast {
  transition: transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1),
              opacity 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(8px); opacity: 0;
}
.toast.visible { transform: translateY(0); opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .toast,
  .toast.visible {
    transition: opacity 150ms ease;
    transform: none;
  }
}
```

`ease-out-quart` : toasts feel snappy and urgent. 8px travel. Stacking toasts push with `ease-in-out-cubic` at 200ms.

### Dropdown / Select

```css
.dropdown {
  transition: transform 150ms cubic-bezier(0.215, 0.61, 0.355, 1),
              opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: scale(0.95); opacity: 0;
  transform-origin: var(--trigger-position, top left);
}
.dropdown.open { transform: scale(1); opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .dropdown,
  .dropdown.open {
    transition: opacity 150ms ease;
    transform: none;
  }
}
```

150ms : dropdowns must be fast. Radix: `transform-origin: var(--radix-dropdown-menu-content-transform-origin)`.

### Tooltip

```css
.tooltip {
  transition: transform 125ms cubic-bezier(0.215, 0.61, 0.355, 1),
              opacity 125ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: scale(0.97); opacity: 0;
  transform-origin: var(--transform-origin, center);
}
.tooltip.open { transform: scale(1); opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .tooltip,
  .tooltip.open {
    transition: opacity 100ms ease;
    transform: none;
  }
}
.tooltip[data-instant] { transition: none; }
```

First tooltip gets delay + animation. Sequential tooltips (while any is open) are instant.

### Accordion / Collapsible

```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.accordion-content.open { grid-template-rows: 1fr; }
.accordion-content > div { min-height: 0; overflow: hidden; }

@media (prefers-reduced-motion: reduce) {
  .accordion-content { transition: none; }
}
```

The grid interpolation handles intrinsic content size but still performs layout. Use it as a measured exception for a small collapsible; choose an immediate layout change when the cost is visible. Retain the accessible component's hidden-state handling so collapsed content cannot receive focus.

### Skeleton → Content

```css
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e0e0e0;
}
.skeleton::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, #f0f0f0, transparent);
  animation: shimmer 1.5s linear infinite;
}
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}
.content { opacity: 1; animation: fade-in 150ms cubic-bezier(0.215, 0.61, 0.355, 1); }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .skeleton::before { animation: none; display: none; }
  .content { animation: fade-in 100ms ease; }
}
```

### Tabs

```css
.tab-indicator {
  width: 1px;
  height: 2px;
  transform-origin: left center;
  transform: translateX(var(--tab-x, 0px)) scaleX(var(--tab-width, 0));
  transition: transform 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.tab-content {
  transition: opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
@media (prefers-reduced-motion: reduce) {
  .tab-indicator { transition: none; }
  .tab-content { transition: opacity 100ms ease; }
}
```

Indicator uses `ease-in-out`; content crossfades with opacity. Set `--tab-x` to the selected tab's horizontal offset and `--tab-width` to its measured pixel width as a unitless scale factor for the 1px indicator. Batch those reads before writes, and update when selection or relevant geometry changes. The input helper makes both indicator and content updates immediate for keyboard actions without depending on sibling placement.

### Button Feedback

```css
.button {
  transform: scale(1);
  transition: transform 100ms cubic-bezier(0.215, 0.61, 0.355, 1),
              background-color 150ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background-color: var(--hover-color);
  }
}
.button:active {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .button,
  .button:active { transform: none; transition: background-color 150ms ease; }
}
```

### Clip-Path Reveal

```css
.reveal {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 250ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.reveal.visible { clip-path: inset(0 0 0 0); }

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal.visible {
    clip-path: none;
    transition: opacity 150ms ease;
  }
  .reveal { opacity: 0; }
  .reveal.visible { opacity: 1; }
}
```

Clip-path is a conditional performance exception. Measure the affected element and prefer an opacity reveal when the clipping adds no needed information.

## Multi-State Transitions

```
idle ←→ loading ←→ success
                ←→ error
```

- **Into loading:** Instant or 100ms opacity. Don't make users wait for a loading animation to start.
- **Loading → success:** Feedback at 100-150ms; a result-panel transition that preserves continuity can use 200ms.
- **Loading → error:** 150ms. Errors surface quickly.
- **Success/error → idle:** Up to 300ms for a purposeful continuity transition. Message dwell and auto-dismiss are separate product decisions; motion should not hide an error before the user can act.

```jsx
function stateVariants(reducedMotion, inputOrigin) {
  const instant = inputOrigin === 'keyboard';
  const spatial = !reducedMotion && !instant;
  const transition = {
    type: 'tween', duration: instant ? 0 : 0.15,
    ease: [0.215, 0.61, 0.355, 1],
    ...(!spatial ? { x: { type: 'tween', duration: 0 }, scale: { type: 'tween', duration: 0 } } : {})
  };
  return {
    idle: { opacity: 1, scale: 1, x: 0, transition },
    loading: { opacity: 1, scale: 1, x: 0, transition },
    success: { opacity: 1, scale: spatial ? [1, 1.05, 1] : 1, x: 0, transition },
    error: { opacity: 1, scale: 1, x: spatial ? [0, -4, 4, -4, 4, 0] : 0, transition }
  };
}
```

Use pulse or shake only when it adds useful feedback. Retain a visible success/error message for the reduced-motion counterpart; the state information must also appear without spatial movement. Read live preference changes through the framework hook and settle any active spatial animation immediately.

## Scroll-Driven Animations

```css
@supports (animation-timeline: scroll()) {
  .parallax-element {
    animation: parallax linear;
    animation-timeline: scroll();
    animation-range: 0% 100%;
  }
}
@keyframes parallax {
  from { transform: translateY(0); }
  to   { transform: translateY(-50px); }
}

/* MANDATORY : parallax is a vestibular trigger */
@media (prefers-reduced-motion: reduce) {
  .parallax-element { animation: none; }
}
```

Scroll position supplies progress instead of a fixed time duration. Check support for the project's target browsers; the fallback keeps the content still. Disable scroll-driven parallax and zoom under reduced motion, and retain access to all content when the effect is absent.
