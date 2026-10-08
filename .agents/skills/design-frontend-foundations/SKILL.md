---
name: design-frontend-foundations
description: Establish a frontend visual foundation or implement and maintain semantic HTML/CSS within a chosen design system. Use for visual direction, component naming, tokens, layout, themes, and styling; broader user-flow and interaction-quality reviews use interface-engineering guidance when available.
---

# Frontend visual foundations and HTML/CSS

Create a visual system engineers can find, understand, and extend. Connect intentional aesthetics with semantic component names, reusable primitives, explicit property ownership, and usable HTML/CSS.

## Scope and mode

Inspect the relevant framework, styling approach, components, vocabulary, tokens, brand rules, device mix, and accessibility constraints. User instructions and established project conventions govern. The house BEM contract below applies to new foundations and components already using that contract. An existing styling architecture does not require migration to BEM for a local edit; propose architectural changes separately.

| Mode | Use when | Work |
|---|---|---|
| Establish or redesign | No relevant foundation exists, or the user requests changing it | Establish the needed purpose, audience, environment, visual direction, component boundaries, and tokens. Reuse a supplied brief. |
| Extend or repair | A relevant foundation exists, including a new page or component within that product | Inherit its direction, framework, naming, token structure, layout, and component conventions. State only affected decisions. |

Use `design-building-frontend-interfaces`, when available and relevant, for model-demo, comparison, and workflow-prototype journeys, component behavior, recovery states, accessibility/usability reviews, and visual polish within the chosen direction. Preserve its supplied-data provenance and truthful inference-state requirements. This skill owns the foundation and its HTML/CSS naming, selector, token, composition, and detailed motion contract. Implement a bounded request directly when those companion concerns are already clear.

Charts and evidence presentation use visualization guidance. ML metric selection, experiment design, acceptance thresholds, and model-validity conclusions remain with ML evaluation; planning and UI software verification retain their own responsibilities. A polished model demo presents supplied results without establishing model validity.

## Establish the needed direction

Identify purpose, audience, environment, frequency of use, and consequential constraints. Infer low-impact omissions and state useful assumptions briefly. Ask when a missing choice would materially change the result.

Choose typography roles, surfaces and accent/status colors, density and spatial logic, and whether motion clarifies feedback or continuity. Match complexity to the task: precise spacing and type support restrained tools; richer identities may benefit from deliberate layering, texture, a distinctive grid, or an expressive interaction. Status meanings stay consistent.

For new identity work, choose a memorable hook when it serves the brief. Existing brands, operational tools, and frequent actions may call for restraint and immediate state changes. Established and system fonts are valid for readability, performance, brand consistency, and familiarity. Avoid repeatedly defaulting to generic hero/card layouts, the same palette, or recycled font choices without examining the context. Use hierarchy appropriate to the actual content.

Read [typography](references/typography.md) when selecting fonts or defining type roles. Read [component architecture](references/component-architecture.md) when a boundary or public API needs closer judgment.

## Shared component contract

Declare only introduced or changed blocks, modifiers, and states. Reuse existing primitives and choose canonical vocabulary for concepts such as dialog/modal and toast/notification.

| Tier | Example | Ownership |
|---|---|---|
| Product or feature | `checkout-summary`, `experiment-browser` | Feature structure, copy, layout, and behavior |
| Shared UI | `ui-button`, `ui-field`, `ui-surface` | Reusable behavior and presentation |
| Layout | `layout-stack`, `layout-cluster`, `layout-grid` | One documented layout pattern, composed by nesting |

Choose a consistent shared prefix for a new system; preserve an established `ui-`, `ds-`, or `c-` prefix. The references use `ui-` and `layout-`; adapt examples consistently. Product blocks depend on shared UI; shared UI stays independent of product blocks. Layout primitives are peers of shared UI.

Names include a domain noun or an intentional shared role. Avoid vague feature identities such as `card`, `menu`, `wrapper`, or `content`. Apply the search, prediction, read-aloud, and deletion tests: names reveal purpose, locate relevant markup/styles, and let a feature disappear without breaking unrelated components.

Use kebab-case BEM: block `checkout-summary`, element `checkout-summary__total`, modifier `checkout-summary--compact`, state `is-loading`. Modifiers describe variants; states describe changing behavior. Put a state on the element that changes. Match user-facing states to native or ARIA semantics where relevant. Animation lifecycle classes such as `is-entering` need no invented ARIA attributes.

Normally use one canonical identity, one needed modifier, and one state, for three classes. A fourth primary class needs a concrete independent dimension and a boundary review. Separate unrelated identities with a named wrapper; the parent can own placement while a shared button owns presentation.

**Surface exception:** a product block or BEM element may also compose `ui-surface` and one `ui-surface--elevation-*` or `ui-surface--sunken` modifier. These add at most two classes, for a maximum of five when the primary identity also needs its modifier and state. Each class must have a distinct documented responsibility. This exception does not permit arbitrary component or utility stacking.

```html
<section class="checkout-summary checkout-summary--floating ui-surface ui-surface--elevation-4">
  <!-- Product owns feature layout; surface owns material and elevation. -->
</section>
```

The surface owns material, radius, elevation, and its focus treatment. The product owns feature layout, spacing, and children. For composed positioning, set `--ui-surface-position`, defaulting to `relative`, instead of competing `position` declarations. Customize the owning primitive through its documented token or modifier; avoid overlapping property ownership.

## HTML/CSS execution

- Keep component selectors named and scoped, with at most two nesting levels and three compound selector parts. Give styled parts explicit BEM names. Avoid ID and type-qualified selectors, `@extend`, and unrelated-ancestor styling such as `.sidebar .ui-button`.
- Permit owned block-to-part and documented structural layout rules. A block modifier may target its own BEM elements or set a custom property inherited by them. Base/reset rules may use type/universal selectors for defaults and normalization.
- Avoid arbitrary attribute styling. Permit `[data-theme]` only on the document root to select theme tokens; native state pseudo-classes remain appropriate. Preserve library behavior/accessibility attributes and map owned styling states to `is-*` classes where needed.
- Use `!important` only in an existing sanctioned reset. Reduced-motion overrides follow the replaced rules with matching specificity.
- Within this house contract, use semantic BEM instead of Tailwind, atomic frameworks, utility stacks, or property classes such as `gap-2`. CSS-in-JS requires explicit approval for the affected component.
- Reuse CSS custom properties for colors, spacing, radii, typography, shadows, z-index, duration, and easing. Introduce only needed tokens. Keep literal visual values in the token layer or annotate a genuine component constraint. Structural values such as `0`, `auto`, percentages, and grid fractions can remain direct values.
- Prefer intrinsic sizing and wrapping layouts. Use container queries for component adaptation and media queries for layout or preferences. Use cascade layers, native nesting, `color-mix()`, and `:has()` when their support and ownership fit the project; preserve a usable fallback where needed.
- Let third-party libraries own their internal naming and state selectors. Namespace integration wrappers and preserve the project's dependency, reset, and theme boundaries.

Read [tokens and layout patterns](references/tokens.md) when introducing a foundation or layout primitive. Read [elevation and focus](references/shadows.md) when implementing shadows. Its house scale is optional for an existing tokenized system; retain the distinct light diffusion, dark catch-light, and independent focus reasoning when adopting it. Theme aliases may change color and elevation structure together.

## Interaction and motion baselines

Choose semantic HTML and native controls first. Supply labels, keyboard behavior, visible focus, and meaningful announcements; communicate status beyond color. Core functionality works with touch and keyboard. Gate hover enhancements on fine-pointer/hover support. Preserve the house 44px tap-target convention while checking hit-area overlap and clipping.

Use motion when its continuity or feedback benefits the task. Keep keyboard navigation and frequent actions immediate. Read [motion](references/motion.md) for purpose-based timing, easing, interruption, CSS/JS techniques, and diagnosis. Prefer transform and opacity for movement; profile expensive effects. Use `will-change` for a demonstrated issue, a specific property, and the period needed.

Provide a reduced-motion path for each animated component without waiting for a request. Disable nonessential movement and transitions, show usable states, and preserve lifecycle completion when animation is absent. Cover JavaScript and springs as well as CSS; give nonessential autoplay media appropriate controls. Keep focus identifiable under forced colors and when shadows disappear.

## Deliver and verify

Deliver the requested direction, implementation, or repair at the needed depth. A direction-only request needs reviewable choices; an implementation request needs working markup/styles and the requested interaction wiring. For a full surface, use the project's file structure and dependency order: tokens/base, layout and shared primitives, then product blocks. Add extension notes when useful.

The [toast example](references/toast-example.md) is an explicitly labeled styling recipe with separate controller requirements. Keep that distinction when using any example.

Check affected naming, selectors, property ownership, tokens, variants/states, keyboard/focus, realistic long content, narrow layouts, themes, reduced motion, and forced colors. Distinguish owned styling classes from behavior hooks and library classes before removing rules. Use source inspection for a bounded selector edit and browser inspection for changed layout or interaction. Fix observed failures and report checks actually performed and material unverified behavior. Use proportional UI software verification without treating it as ML evaluation.
