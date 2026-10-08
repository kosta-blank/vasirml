# Token Recipe and Layout Patterns

Use this recipe when introducing a foundation. Reuse existing project tokens during maintenance, and include only values the implementation needs. The values below are complete starting choices for a restrained, diagrammatic interface; change the palette and typography to serve the brief.

The spacing scale retains a 4px rhythm at a 16px root size. Typography uses an approximately 1.25 ratio. Load the named fonts through the project's font pipeline when they are selected; these declarations provide fallbacks without starting a network request.

## Complete starting values

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  --border-hairline: 1px;
  --focus-width: 2px;
  --focus-offset: 2px;

  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;

  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  --color-surface: #f7f5f0;
  --color-surface-alt: #eeeae2;
  --color-surface-raised: #ffffff;
  --color-text-primary: #202329;
  --color-text-secondary: #4c515a;
  --color-text-muted: #62666d;
  --color-accent: #075baf;
  --color-accent-hover: #034584;
  --color-focus: #075baf;
  --color-danger: #aa2030;
  --color-border: #92969e;

  --font-display: 'DM Mono', 'Courier New', monospace;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --text-xs: 0.64rem;
  --text-sm: 0.8rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5625rem;
  --text-2xl: 1.953125rem;
  --text-3xl: 2.44140625rem;
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}

:root[data-theme='dark'] {
  --color-surface: #0a0a0b;
  --color-surface-alt: #111114;
  --color-surface-raised: #18181a;
  --color-text-primary: #e8e4de;
  --color-text-secondary: #b0aca6;
  --color-text-muted: #a19d97;
  --color-accent: #82baff;
  --color-accent-hover: #b0d3ff;
  --color-focus: #82baff;
  --color-danger: #f87171;
  --color-border: #777780;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-surface: #0a0a0b;
    --color-surface-alt: #111114;
    --color-surface-raised: #18181a;
    --color-text-primary: #e8e4de;
    --color-text-secondary: #b0aca6;
    --color-text-muted: #a19d97;
    --color-accent: #82baff;
    --color-accent-hover: #b0d3ff;
    --color-focus: #82baff;
    --color-danger: #f87171;
    --color-border: #777780;
  }
}
```

Choose `data-theme="light"` or `data-theme="dark"` on the document root for an explicit preference. Omit it to follow the operating system. Define an explicit light override too if the project makes dark its default. Apply the corresponding elevation aliases from [shadows.md](shadows.md) whenever shadows are used; theme changes can affect shadow structure as well as colors.

## Layout primitives

Each primitive has one layout responsibility. Keep component appearance in its own block. Customize a primitive through a documented custom property on a named class or modifier, rather than inventing property classes or putting inline visual values into markup.

```css
.layout-stack {
  display: flex;
  flex-direction: column;
}

/* Vertical rhythm remains explicit and inspectable. */
.layout-stack > * + * {
  margin-block-start: var(--stack-space, var(--space-4));
}

.layout-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cluster-space, var(--space-3));
  align-items: center;
}
```

Define `layout-sidebar` or `layout-grid` only when the actual content needs it. Document its columns, wrapping, and minimum sizes instead of creating a large unused layout catalog. Nest layout primitives when their roles differ; the surface exception is specific to `ui-surface` composition.

## Token ownership

- Root/theme tokens establish the visual vocabulary. Component tokens adapt it to a particular primitive.
- A component modifier can set a token inherited by its own BEM elements. This preserves the block's ownership without allowing arbitrary ancestor styling.
- Use named z-index layers; check the relevant stacking contexts when a layer fails to appear above another.
- Structural constants such as `0`, `100%`, `auto`, and `1fr` remain direct CSS values. Annotate a necessary visual literal outside the token layer, such as a pixel-aligned border.
- Do not add the entire recipe to a one-component edit. Keep existing aliases and extend the vocabulary where needed.
