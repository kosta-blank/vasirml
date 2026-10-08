---
name: design-building-frontend-interfaces
description: Build, adapt, or review usable web interfaces for model demos, comparisons, and workflow prototypes. Apply when frontend task flow, interaction states, accessibility, responsiveness, or visual clarity needs work; match polish to the audience and purpose.
---

# Usable POC Interface Engineering

Make the main task obvious, accessible, responsive, and fast. Use deliberate visual judgment: hierarchy, typography, optical alignment, and tactile feedback should help the user complete the task.

Preserve the chosen or established visual foundation while applying the full quality ladder to requested POC interface work. This skill owns demo task flows, component behavior, visual clarity, accessibility, stability, performance, and honest evidence/inference states. When `design-frontend-foundations` is available and used, its contract governs CSS naming, selectors, tokens, composition, and detailed motion implementation. Adapt illustrative reference recipes to that contract; retain this skill's usability and performance checks. Follow the existing project system directly when that foundation skill is unavailable.

Chart encoding, project planning, and software verification strategy have separate workflows. Metric selection, model validity, retrieval quality, and online experiments belong to ML evaluation.

## Operating stance

- Match polish and robustness to the POC's audience and purpose. A walkthrough needs a clear working flow; broader demos may need more state coverage and polish. Add production hardening or decoration when the task calls for it.
- Follow the existing stack, conventions, tokens, and reusable components. Redesign only when a concrete task problem requires it, keeping the repair local where possible.
- Ask only when missing context blocks the work. Otherwise choose the strongest reasonable default.
- Prefer decisive implementation over commentary. Code beats explanation.
- Fix root causes, including component APIs when they cause the problem. Avoid creating a new design system for an isolated fix.
- Check the relevant framework version, browser behavior, and product context before relying on them. State material assumptions that remain unverified.
- Never trade accessibility, task completion, or speed for decoration.

## Quality ladder

Lower rungs never break higher rungs.

1. **Task completion:** the user can do the thing without confusion.
2. **Semantics and access:** native elements, labels, keyboard, focus, names, states, errors.
3. **Stability:** no layout shift, no accidental scroll jumps, no hydration/theme flash, no surprise keyboard popups.
4. **Speed:** fast interaction feedback, no blocking flourish, no expensive animation, no needless re-render storms.
5. **Clarity:** one obvious primary action, user-language copy, visible state, recoverable errors.
6. **System coherence:** tokens, variants, spacing/radius/color rhythm, consistent component contracts.
7. **Taste:** optical alignment, typography, motion choreography, shadow/border subtlety, empty-state craft.
8. **Delight:** rare, earned, interruptible, and never in the way.

## Task routing

Read only the references needed for the affected behavior. A small edit may need no additional reference. Keep implementation recipes in the references and the essential interaction contract here.

- **Components, forms, controls, and async states:** [components-forms.md](components-forms.md). Apply React API guidance only in a compatible React stack.
- **Keyboard, focus, overlays, touch, or accessibility behavior:** [mobile-accessibility.md](mobile-accessibility.md).
- **Visual hierarchy, copy, layout, typography, tokens, or page craft:** [craft-rules.md](craft-rules.md).
- **Animation, loading stability, or a visible performance problem:** [motion-performance.md](motion-performance.md). Add motion where it clarifies feedback or continuity.
- **Review:** use the relevant reference for the problem; return the most consequential fixes unless the user asks for exhaustive review.

## Response contract

### Implementation

Implement in the workspace when available; when supplying code in chat, return the improved code first. Include only essential integration notes, assumptions, tradeoffs, and checks actually performed. Distinguish observed runtime behavior from code inspection and checks not run. Interface checks establish usability and software behavior; they do not establish model quality.

### Review

Do not write a generic checklist. Give the few changes that most improve the interface:

```
[Blocker | High | Polish] Problem → exact fix → why it matters
```

Use “Blocker” only for broken task flow, inaccessible core behavior, data loss, severe layout shift, or unusable mobile behavior.

### Polish pass

Be concrete. Say exactly what to change: spacing, type scale, radius, shadow, color token, transition timing, copy, hierarchy, state treatment. Avoid “make it cleaner.”

### Performance pass

Name the visible symptom, the likely cause, and the smallest fix. Do not recommend memoization, virtualization, `will-change`, or direct DOM animation unless the shape of the problem calls for it.

## Non-negotiables

- Use native semantics before ARIA or custom interaction code. Buttons act; links navigate. Inputs have persistent visible labels, and icon-only controls have accessible action names.
- Keyboard users can reach, operate, escape, and recover from each interactive path. Keep focus visible, trap it only in true modals, and return it to the trigger on close.
- Essential behavior works without hover and remains usable on touch and narrow viewports. Follow the detailed target, input, and overlay guidance when changing those surfaces.
- Reserve space for dynamic content and preserve layout across state changes. Design the loading, empty, success, disabled, error, selected, active, and focus states relevant to the component.
- Use semantic tokens and existing component contracts. Keep visual hierarchy and the primary action clear; separate destructive actions and provide intentional confirmation or undo.
- Motion is fast, purposeful, interruptible, and removable under reduced motion. Use the motion reference for implementation and performance details.
- Label simulated, sample, cached, or live data and outputs where that distinction affects interpretation. Carry supplied evaluation context with displayed model comparisons; leave validity judgments to ML evaluation.
- Long-running inference exposes truthful progress or status, completion, failure, and a recovery action while preserving user input. Prevent duplicate submissions; offer cancellation only when the underlying operation supports it.

## Final sweep before answering

Check the affected task flow against the quality ladder and non-negotiables. Use available runtime checks for the relevant input methods, changed states, and responsive layouts; fix failures within scope. Where runtime checks are unavailable, inspect the implementation and state the verification limit in the response. Runtime claims require observing the affected behavior.
