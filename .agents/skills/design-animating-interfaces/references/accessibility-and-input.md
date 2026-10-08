# Accessibility and Input

Use this reference when generating animation code. Keep the component's existing semantics, focus behavior, and keyboard interactions while changing its visual motion.

## Reduced Motion

Remove parallax, zoom, rotation, shake, bounce, and moving loading effects under `prefers-reduced-motion: reduce`. Keep the state change visible through an immediate update or a short opacity transition, usually 100-150ms. Scale is spatial motion too; a small scale is not a universal accessibility exemption. The preference can change while the page is open. These choices follow the preference's purpose of reducing nonessential motion. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

An accordion or tab indicator should reach its new layout immediately. Shortening the same spatial animation leaves that motion in place. Static loading text or a static skeleton must still convey that work is pending.

Match the specificity of every state rule, including open, closed, active, and library data attributes. Check individual `translate`, `rotate`, and `scale` properties as well as `transform` when the component uses them. CSS media rules cannot override a JavaScript timeline or inline motion-library styles by themselves.

```css
.surface {
  transform: scale(0.95);
  opacity: 0;
  transition: transform 200ms cubic-bezier(0.215, 0.61, 0.355, 1),
              opacity 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transform-origin: var(--trigger-position, center);
}
.surface[data-state="open"] { transform: scale(1); opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .surface,
  .surface[data-state="open"] {
    transform: none;
    transition: opacity 150ms ease;
  }
}
```

For CSS keyframes, define the settled state in ordinary styles so `animation: none` leaves the correct state visible. For JavaScript or WAAPI, consult `matchMedia('(prefers-reduced-motion: reduce)')` before starting, and handle its `change` event to finish or cancel active spatial motion into the intended state. Use the framework's preference hook when available.

## Keyboard and Assistive Activation

Keyboard-triggered focus, selection, menus, and action feedback use zero animation time. Detect input at the action or use the component library's interaction state. `:focus-visible` describes focus styling and a sibling combinator depends on DOM arrangement; together they do not reliably classify the action.

For a component with CSS transitions, this helper records input before its state handlers run. Put `motion-scope` on the affected scope and `data-motion` on its animated elements. Use a separate motion scope for portaled content. Bind to the trigger's scope so an unrelated keyboard action elsewhere cannot alter the component's animation policy.

```js
function bindMotionInput(triggerScope, motionScope = triggerScope) {
  const setInput = input => { motionScope.dataset.input = input; };
  const onKeyDown = () => setInput('keyboard');
  const onPointerDown = () => setInput('pointer');
  const onClick = event => {
    // Zero-detail clicks include keyboard and assistive activation.
    setInput(event.detail === 0 ? 'keyboard' : 'pointer');
  };

  triggerScope.addEventListener('keydown', onKeyDown, true);
  triggerScope.addEventListener('pointerdown', onPointerDown, true);
  triggerScope.addEventListener('click', onClick, true);

  return () => {
    triggerScope.removeEventListener('keydown', onKeyDown, true);
    triggerScope.removeEventListener('pointerdown', onPointerDown, true);
    triggerScope.removeEventListener('click', onClick, true);
  };
}
```

Include this rule after the component's motion rules. Both selectors cover a scope that is itself animated and animated descendants.

```css
.motion-scope[data-input="keyboard"][data-motion],
.motion-scope[data-input="keyboard"] [data-motion] {
  transition: none;
  animation: none;
}
```

Programmatic changes caused by the same keyboard action should retain its input origin. For a later independent system update, set the origin to `system`; for a global shortcut outside the trigger scope, pass its input origin directly to the component. Verify real pointer, Enter/Space, arrow, and assistive activation paths because synthetic event conventions vary. Call the returned cleanup function when unmounting.

For JS libraries, pass input origin to the animation options directly. CSS `transition: none` does not cancel a WAAPI animation or a library-managed transform. Focus, semantics, and action completion happen immediately; animation never delays them.

## Motion / Framer Motion

Preserve the project's installed import path. The following uses the current `motion/react` package; an existing `framer-motion` project should use its own exports. Supply `inputOrigin` from the actual action rather than inferring it from focus.

```jsx
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

function AnimatedSurface({ isOpen, inputOrigin, children }) {
  const reduced = useReducedMotion();
  const instant = inputOrigin === 'keyboard';
  const spatial = !reduced && !instant;
  const transition = instant
    ? { type: 'tween', duration: 0 }
    : reduced
      ? { type: 'tween', duration: 0.15, ease: 'easeOut', scale: { type: 'tween', duration: 0 } }
      : { type: 'tween', duration: 0.25, ease: [0.215, 0.61, 0.355, 1] };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={instant ? false : spatial ? { opacity: 0, scale: 0.95 } : { opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={spatial ? { opacity: 0, scale: 0.95 } : { opacity: 0 }}
          transition={transition}
          style={{ transformOrigin: 'var(--trigger-position, center)' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

This is a visual surface excerpt for an accessible component. Retain the component library's focus and presence lifecycle; use its cancellation behavior for rapid reopening. When a preference changes during a spatial animation, stop that motion and apply the final state rather than adding another spatial transition to reset it.

## Touch and Targets

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: scale(1.02); }
}
@media (prefers-reduced-motion: reduce) {
  .card:hover { transform: none; }
}
```

Retain a comfortable 44px hit-area design target. Use real padding or a larger wrapper where possible. If a pseudo-element extends a small control's hit area, position the control and check overlaps with adjacent controls:

```css
.small-button { position: relative; }
.small-button::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px; min-height: 44px;
}
```

Opacity alone does not remove a surface from focus or hit testing. Keep hidden, closing, and removed content consistent with the accessible component's state. Test the affected open/close, rapid reversal, keyboard, touch, and reduced-motion paths proportionately, and distinguish runtime observations from code inspection.
