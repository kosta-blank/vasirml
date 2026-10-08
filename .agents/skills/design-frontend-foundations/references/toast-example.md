# Worked Example: Diagrammatic Toast

This is a markup and styling recipe. An interactive request also needs event
wiring, dismissal, announcement, and entry/exit lifecycle code; none is supplied
here. The two static examples are visible together to compare tones.

## Direction and contract

**Hook:** diagrammatic labels, thin borders, a muted surface, and a status stripe.
**Typography:** locally available DM Mono labels and DM Sans body text, with full
fallback stacks. A 1.25 ratio supplies the 13 / 16 / 20 scale when needed.
**Color:** near-black surface, warm gray text, semantic green/amber/red tones.
**Motion:** horizontal fade-in at 300ms ease-out; downward fade-out at 200ms
ease-in-out. Reduced motion removes transitions and movement.

| Block | Modifiers | States |
|---|---|---|
| `ui-toast-stack` | None | None |
| `ui-toast` | `--tone-success`, `--tone-warning`, `--tone-danger` | `is-entering`, `is-exiting` |

Elements belong to `ui-toast`: `__stripe`, `__content`, `__title`, `__message`,
and `__dismiss`. A toast uses at most three classes: block, tone, and one transient
motion state. These motion states need no invented ARIA attribute. Semantic
states such as disabled or busy still require the matching native/ARIA state.

## Markup and CSS

Reuse the project's existing tokens and fonts when integrating this recipe.
These complete values make the example independently readable; no font download
is required. Its border treatment needs no shadow or extra surface identity.

```html
<style>
  :root {
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --radius-md: 0.5rem;
    --border-thin: 0.0625rem;
    --z-toast: 500;
    --duration-enter: 300ms;
    --duration-exit: 200ms;
    --ease-enter: cubic-bezier(0.215, 0.61, 0.355, 1);
    --ease-exit: cubic-bezier(0.77, 0, 0.175, 1);

    --color-surface-raised: #18181a;
    --color-text-primary: #e8e4de;
    --color-text-secondary: #b0aca6;
    --color-border: #5b5b62;
    --color-success: #34d399;
    --color-warning: #fbbf24;
    --color-danger: #f87171;
    --color-focus: #e8e4de;
    --font-display: 'DM Mono', 'SFMono-Regular', Consolas,
      'Liberation Mono', monospace;
    --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont,
      'Segoe UI', sans-serif;
    --text-sm: 0.8125rem;
    --text-base: 1rem;
    --text-lg: 1.25rem;
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --tracking-label: 0.02em;
    --focus-width: 0.125rem;
    --focus-offset-inset: -0.1875rem;
    --toast-max-inline-size: 26.25rem;
    --toast-stripe-width: 0.25rem;
    --toast-dismiss-size: 2.75rem;
  }

  .ui-toast-stack {
    position: fixed;
    inset-block-end: var(--space-4);
    inset-inline-end: var(--space-4);
    z-index: var(--z-toast);
    display: grid;
    gap: var(--space-3);
    /* Viewport percentages and 2 are structural sizing factors. */
    inline-size: calc(100% - 2 * var(--space-4));
    max-inline-size: var(--toast-max-inline-size);
    max-block-size: calc(100svh - 2 * var(--space-4));
    overflow-y: auto;
  }

  .ui-toast {
    box-sizing: border-box;
    display: grid;
    /* 0 prevents intrinsic overflow; 1fr shares the remaining space. */
    grid-template-columns: var(--toast-stripe-width) minmax(0, 1fr) auto;
    background: var(--color-surface-raised);
    border: var(--border-thin) solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    font-family: var(--font-body);
    /* Neutral opacity/transform endpoints are structural exceptions. */
    opacity: 1;
    transform: none;
    transition:
      opacity var(--duration-enter) var(--ease-enter),
      transform var(--duration-enter) var(--ease-enter);
  }

  .ui-toast--tone-success { --toast-tone: var(--color-success); }
  .ui-toast--tone-warning { --toast-tone: var(--color-warning); }
  .ui-toast--tone-danger { --toast-tone: var(--color-danger); }

  .ui-toast.is-entering {
    opacity: 0; /* Hidden lifecycle endpoint. */
    transform: translateX(var(--space-4));
  }

  .ui-toast.is-exiting {
    opacity: 0; /* Hidden lifecycle endpoint. */
    transform: translateY(var(--space-2));
    transition-duration: var(--duration-exit);
    transition-timing-function: var(--ease-exit);
  }

  .ui-toast__stripe {
    background: var(--toast-tone, var(--color-success));
  }

  .ui-toast__content {
    min-inline-size: 0; /* Allow long content to wrap inside the grid. */
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-3) var(--space-4);
    overflow-wrap: anywhere;
  }

  .ui-toast__title {
    margin: 0; /* Component-owned paragraph reset. */
    font-family: var(--font-display);
    font-size: var(--text-sm);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-label);
    color: var(--color-text-primary);
    text-transform: uppercase;
  }

  .ui-toast__message {
    margin: 0; /* Component-owned paragraph reset. */
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-secondary);
  }

  .ui-toast__dismiss {
    appearance: none;
    background: none;
    border: none;
    align-self: start;
    inline-size: var(--toast-dismiss-size);
    block-size: var(--toast-dismiss-size);
    margin: var(--space-1);
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    cursor: pointer;
  }

  /* Hover color changes immediately; movement animates opacity/transform only. */
  .ui-toast__dismiss:hover { color: var(--color-text-primary); }
  .ui-toast__dismiss:focus-visible {
    outline: var(--focus-width) solid var(--color-focus);
    outline-offset: var(--focus-offset-inset);
  }

  @media (prefers-reduced-motion: reduce) {
    .ui-toast,
    .ui-toast.is-entering,
    .ui-toast.is-exiting {
      transition: none;
      transform: none;
    }

    .ui-toast.is-entering {
      opacity: 1;
    }
  }
</style>

<div class="ui-toast-stack">
  <div class="ui-toast ui-toast--tone-success" role="status"
    aria-live="polite" aria-atomic="true">
    <div class="ui-toast__stripe" aria-hidden="true"></div>
    <div class="ui-toast__content">
      <p class="ui-toast__title">Deployed</p>
      <p class="ui-toast__message">Build #4217 is live in production.</p>
    </div>
    <button class="ui-toast__dismiss" type="button"
      aria-label="Dismiss deployment toast">×</button>
  </div>

  <div class="ui-toast ui-toast--tone-danger" role="alert"
    aria-live="assertive" aria-atomic="true">
    <div class="ui-toast__stripe" aria-hidden="true"></div>
    <div class="ui-toast__content">
      <p class="ui-toast__title">Pipeline failed</p>
      <p class="ui-toast__message">Integration tests timed out after 120 seconds.</p>
    </div>
    <button class="ui-toast__dismiss" type="button"
      aria-label="Dismiss pipeline failure toast">×</button>
  </div>
</div>
```

## Lifecycle and extension

For entry, mount with `is-entering`, establish that style, then remove the class
on a subsequent frame. For exit, add `is-exiting` and remove the toast after the
transition; include a fallback completion path and remove immediately under
reduced motion. Never apply both motion states together. A controller must also
wire dismissal and mount or update live regions so announcements actually occur.
Reserve assertive alerts for urgent errors; routine warnings use polite status.

The [status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role) supplies polite, atomic announcements. Keep the chosen live-region behavior consistent with the message's urgency, and verify it with the actual controller when delivering an interactive component.

The stripe gives status a clear location; title text conveys meaning without
relying on color. A flexible middle column, wrapping text, and viewport-relative
stack width handle narrow screens and long messages. Inset focus avoids clipping.
Tone modifiers set a component-owned token inherited by its own BEM elements;
they do not style unrelated blocks. Add an info tone with a semantic color token,
or a `ui-toast__action` for a real action, preserving keyboard access and lifecycle.
