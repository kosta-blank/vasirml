# Performance and Debugging

## Performance

### Prefer Transform and Opacity

Prefer `transform` and `opacity` for motion. Other properties need an implementation-specific cost check. Filters and `backdrop-filter` can be expensive; their presence does not guarantee compositor-only work. Profile layout, paint, and dropped frames when investigating a real performance issue. [web.dev: high-performance CSS animations](https://web.dev/articles/animations-guide)

Direct changes to width, height, spacing, position, borders, or font size can affect layout. FLIP measures the changed layout and animates transforms; a library's `layout` feature still needs measurement. A grid accordion also changes layout each frame. Its value is handling intrinsic content size, and it requires a measured exception for small collapsibles rather than a claim of compositor safety.

A single hover color transition is a limited paint exception. Clipping and loading effects need the same cost judgment; keep continuous work small. Avoid promising fixed layout or paint costs in milliseconds. At 60Hz the entire frame has about 16.7ms; refresh rate and other work change the available budget.

### FLIP Technique

For a reorder of the same, currently visible elements, capture both geometry sets before any per-element writes. This excerpt uses WAAPI so it does not depend on a CSS flush between inverse and final transforms. Give the motion wrapper ownership of its transform; nested wrappers can preserve an existing transform.

```js
const reorderAnimations = new WeakMap();

function animateReorder(items, reorderItems, inputOrigin = 'system') {
  const first = items.map(el => el.getBoundingClientRect());
  items.forEach(el => {
    reorderAnimations.get(el)?.cancel();
    reorderAnimations.delete(el);
  });

  reorderItems();
  const last = items.map(el => el.getBoundingClientRect());
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || inputOrigin === 'keyboard') return [];

  const animations = items.map((el, i) => {
    const dx = first[i].left - last[i].left;
    const dy = first[i].top - last[i].top;
    return el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
      { duration: 250, easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }
    );
  });
  animations.forEach((animation, i) => reorderAnimations.set(items[i], animation));

  const onPreferenceChange = event => {
    if (event.matches) animations.forEach(animation => animation.cancel());
  };
  preference.addEventListener('change', onPreferenceChange);
  Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
    preference.removeEventListener('change', onPreferenceChange);
    animations.forEach((animation, i) => {
      if (reorderAnimations.get(items[i]) === animation) reorderAnimations.delete(items[i]);
    });
  });
  return animations;
}
```

The first read batch records the current visual positions, including any interrupted animation. After cancellation and the DOM update, the second read batch records final geometry. Only then start animations. This avoids interleaving new geometry reads with per-element transform writes. The new DOM layout remains the settled state on completion or cancellation. Ensure `reorderItems` applies its DOM update synchronously; a framework may require its own layout lifecycle instead.

### will-change

```css
.will-animate { will-change: transform; }
```

Use `will-change` only for an observed issue where layer preparation helps. Apply shortly before motion and remove after it ends. It can consume memory, change stacking, and affect fixed descendants. Avoid blanket application to many elements.

### blur Performance

The original 20px blur limit is a starting heuristic, not a cross-device budget. Keep blur area and radius small and measure on target devices. For large fixed blur, consider a pre-blurred image. `backdrop-filter` also needs measurement and is not an automatic performance improvement.

### React Performance

- Never `setState` on every animation frame : use refs to update styles directly
- Check the installed animation library's acceleration path and profile the affected behavior rather than assuming `transform` or `x` syntax guarantees hardware acceleration
- Use `motion` values and `useTransform` for derived animations without re-renders

## Diagnostic Protocol

When something "feels off," work through these in order:

1. **Animating layout properties?** Check for `width`, `height`, `padding`, `margin`, `top`, `left`, and grid sizing. Prefer transforms or FLIP. Keep a grid accordion only when intrinsic-size behavior justifies its measured layout cost.

2. **Wrong easing?** Entry using `ease-in`? → `ease-out`. On-screen movement using `ease-out`? → `ease-in-out`. Hover using a strong curve? → `ease`.

3. **Wrong duration?** Feels sluggish → subtract 50–100ms. Feels abrupt → add 50ms. Feels "floaty" → stronger curve (quart instead of quad).

4. **Transform ordering wrong?** `translate() rotate()` ≠ `rotate() translate()`. Transforms apply right-to-left. Consider individual `translate`, `rotate`, and `scale` properties when supported by the project's target browsers.

5. **GPU handoff glitch?** A 1px shift at the start or end can merit testing a temporary `will-change: transform`. Check stacking and memory effects; remove it if it does not help.

6. **Wrong transform-origin?** Popover scales from center instead of trigger → set `transform-origin` to trigger's position.

7. **`animation-fill-mode` conflict?** `forwards` retains the animation's final values, which can mask ordinary style declarations. Commit the settled state in ordinary styles and remove the animation's influence; for WAAPI, cancel after applying that state. Check actual cascade and ownership before assigning the cause.

8. **`transition: all` side effects?** Animating unintended properties (`z-index`, `color`, inherited values). → Specify exact properties.

9. **Competing animations?** Multiple things moving with no hierarchy → stagger, group related elements, remove secondary animations.

10. **Hover flicker?** Hover animation moves element, cursor leaves, reverses, repeat → animate a child element, not the hover target.

11. **Interruption jank?** Check rapid toggling, timeline cancellation, stale completion handlers, and transform ownership. CSS transitions can reverse; a physics spring can preserve velocity. The interaction determines whether a spring adds useful control.

12. **Still off?** Record the animation, play at 0.25×. Chrome DevTools > Animations panel can slow all animations globally.
