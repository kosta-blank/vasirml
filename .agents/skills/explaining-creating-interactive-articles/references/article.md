---
name: article
description: HTML scaffold, selectable delivery modes, article layout patterns, state coordination, responsive rendering, and delivery QA for explanations
---

# Article Structure

Choose the artifact and delivery environment from the reader's needs and the user's request. A self-contained local HTML file is a useful default for a portable explanation. An existing repository, framework, hosted page, or other reader artifact may be the right destination; follow its conventions. Offline delivery is a selectable requirement, not a universal constraint.

## Tech Stack

For a portable HTML explanation, HTML, CSS, JavaScript, SVG, and Canvas often suffice. Use the chosen repository's framework and build tools when working there. Do not introduce a framework just for a small standalone article.

D3 v7 is useful for scales, axes, keyed joins, interaction, generators, and layouts. Choose it when those capabilities help the explanation; plain SVG, Canvas, HTML, or an existing chart library may be simpler. Keep framework and D3 ownership of elements separate if both are used.

When D3 is chosen for offline delivery, bundle it by either:

- inlining D3 into `index.html`, or
- loading `./lib/d3.v7.min.js` from the packaged project directory.

For hosted or repository delivery, use the established dependency and data-loading conventions. For offline delivery, every dependency must be included; see the rules below.

## Output Location

Suggested layout when no output location or repository convention was supplied:

```text
tmp/explaining-creating-interactive-articles/project-name/
  index.html          # standalone article, all CSS/JS/data inline by default
```

Optional directory layout for an offline article with separate dependencies:

```text
tmp/explaining-creating-interactive-articles/project-name/
  index.html
  lib/d3.v7.min.js    # only if D3 was chosen; include the actual file
  data/source.csv     # optional; verify loading in the chosen reader environment
```

For an offline series:

```text
tmp/explaining-creating-interactive-articles/project-name/
  index.html          # series index, itself an article
  01-first-concept.html
  02-second-concept.html
  lib/d3.v7.min.js    # optional shared dependency if D3 was chosen
  data/               # optional local shared datasets
```

For portable delivery, prefer one HTML file when practical. Package a complete directory as a zip when the reader needs a downloadable bundle. For repository or hosted delivery, provide the requested artifact and its normal run or preview instructions instead.

## Offline Delivery Rules

Apply these rules strictly when offline delivery was requested or selected. The delivered reader artifact must open from disk without runtime network requests, including loopback requests. It may not depend at runtime on:

- CDN scripts or styles.
- Remote fonts.
- Remote images or iframes.
- Runtime API calls.
- Remote datasets.
- Browser extensions.
- A build step that the reader must run to read a promised ready-to-open artifact.

Use system fonts or included font files. Inline or bundle D3, KaTeX, TopoJSON, d3-sankey, or any other chosen dependency, including required assets and licenses. Build tools may produce the offline artifact, but the reader must receive its complete output. If a needed dependency cannot be included, implement an adequate alternative or disclose the delivery limitation; a missing library placeholder is not a complete deliverable.

An artifact described as self-contained must remain readable and interactive after download and disconnection. Verify the promised opening method: `file://` can restrict `fetch()` and module imports even for local files. Inline data and scripts where needed; a relative path alone does not prove offline operation. If the user chooses a served or integrated artifact, follow that separate delivery mode and state its opening method instead of promising disk-open, zero-network operation.

## HTML Scaffold

Use this dependency-free scaffold when a standalone HTML file fits the task. Adapt its layout, typography, state coordination, and accessibility patterns to the chosen environment. The parameter figure demonstrates wiring only: replace its text, model, and drawing with the actual explanation before delivery. Do not deliver blank figures or scaffold placeholders.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Explanation Title</title>
<!-- Add dependencies only when chosen and available in the delivery environment. -->
<style>
*, *::before, *::after { box-sizing: border-box; }
html { color-scheme: light; }
body { margin: 0; }

:root {
  --article-width: 740px;
  --wide-width: 980px;
  --body-font: "Source Serif 4", "Iowan Old Style", "Charter", Georgia, serif;
  --heading-font: "Source Sans 3", "Avenir Next", "Segoe UI", Arial, sans-serif;
  --mono-font: "Source Code Pro", "SFMono-Regular", Consolas, monospace;
  --body-size: 1.125rem;
  --line-height: 1.6;
  --text: #1a1a2e;
  --text-2: #4d4d66;
  --muted: #73738a;
  --bg: #fbfaf7;
  --fig-bg: #ffffff;
  --border: #dedbd2;
  --accent: #8a4f2a;
  --accent-2: #2f6f73;
  --soft: #f1eee7;
  --danger: #8f2d2d;
}

body {
  font-family: var(--body-font);
  font-size: var(--body-size);
  line-height: var(--line-height);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.article {
  max-width: var(--article-width);
  margin: 0 auto;
  padding: 2.25rem 1.25rem 6rem;
}

header { margin-bottom: 2.5rem; }
h1, h2, h3 {
  font-family: var(--heading-font);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.01em;
}
h1 { font-size: clamp(2rem, 6vw, 3rem); margin: 0 0 0.75rem; }
h2 { font-size: 1.55rem; margin: 3.25rem 0 1rem; }
h3 { font-size: 1.15rem; margin: 2rem 0 0.75rem; }
p { margin: 0 0 1rem; }
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }

.deck {
  font-family: var(--heading-font);
  font-size: 1.2rem;
  line-height: 1.45;
  color: var(--text-2);
  max-width: 42rem;
}

.figure {
  margin: 2rem 0;
  padding: 1.25rem;
  background: var(--fig-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.figure-wide {
  width: min(var(--wide-width), calc(100vw - 2rem));
  margin-left: 50%;
  transform: translateX(-50%);
}

.figure-title {
  font-family: var(--heading-font);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.figure-caption {
  font-family: var(--heading-font);
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--text-2);
  margin-top: 0.9rem;
}
.figure-label { font-weight: 700; color: var(--text); }

.margin-note,
.model-note {
  font-family: var(--heading-font);
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--text-2);
  border-left: 2px solid var(--border);
  padding-left: 0.8rem;
  margin: 1.25rem 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem 1rem;
  flex-wrap: wrap;
  margin: 0 0 1rem;
  font-family: var(--heading-font);
  font-size: 0.9rem;
  color: var(--text-2);
}
.controls label { display: inline-flex; align-items: center; gap: 0.5rem; }
.controls input[type="range"] { width: 12rem; accent-color: var(--accent); }
.controls button {
  font: inherit;
  color: var(--text);
  background: var(--soft);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
}
.controls button:focus-visible,
.controls input:focus-visible,
.interactive:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent), transparent 60%);
  outline-offset: 2px;
}

.value-readout {
  font-family: var(--mono-font);
  min-width: 5ch;
  display: inline-block;
  color: var(--text);
}

.assessment {
  font-family: var(--heading-font);
  margin: 1rem 0;
  padding: 0.9rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.assessment p { margin-bottom: 0.6rem; }
.assessment .answer { display: none; color: var(--text-2); }
.assessment.revealed .answer { display: block; }

.tip {
  position: fixed;
  z-index: 10;
  max-width: 18rem;
  padding: 0.45rem 0.6rem;
  font-family: var(--heading-font);
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--text);
  background: var(--fig-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 4px 18px rgb(0 0 0 / 0.08);
  pointer-events: none;
  opacity: 0;
}

svg { max-width: 100%; height: auto; display: block; }
svg text { font-family: var(--heading-font); }
svg .axis text { font-size: 11px; fill: var(--text-2); }
svg .axis line, svg .axis path { stroke: var(--border); }

.visually-hidden {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  font-family: var(--heading-font);
  font-size: 0.875rem;
  color: var(--text-2);
}

@media (max-width: 640px) {
  :root { --body-size: 1.05rem; }
  .article { padding-inline: 1rem; }
  .figure { padding: 1rem; }
  .controls { align-items: stretch; flex-direction: column; }
  .controls input[type="range"] { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
</style>
</head>
<body>
<main class="article">
  <header>
    <h1>Title</h1>
    <p class="deck">A plain sentence describing what the reader will be able to understand or predict.</p>
  </header>

  <section aria-labelledby="section-1-title">
    <h2 id="section-1-title">Section title</h2>
    <p>Prose introduces the idea before the figure asks the reader to act.</p>

    <figure class="figure" id="fig-1" aria-labelledby="fig-1-title" aria-describedby="fig-1-caption fig-1-desc">
      <div class="figure-title" id="fig-1-title">Figure title</div>
      <div class="controls">
        <label for="param-slider">Parameter <span class="value-readout" id="param-value">0.50</span></label>
        <input id="param-slider" type="range" min="0" max="1" step="0.01" value="0.5">
      </div>
      <div class="visually-hidden" id="fig-1-desc">Accessible description of the visual model and what changes with interaction.</div>
      <svg id="fig-1-svg" role="img" aria-labelledby="fig-1-title fig-1-caption" viewBox="0 0 600 80">
        <line x1="30" y1="40" x2="570" y2="40" stroke="var(--border)"></line>
        <circle id="param-mark" cx="300" cy="40" r="8" fill="var(--accent)"></circle>
      </svg>
      <figcaption class="figure-caption" id="fig-1-caption">
        <span class="figure-label">Figure 1.</span> Caption tells the reader what to notice, not just what is drawn.
      </figcaption>
    </figure>
  </section>

  <footer>
    <p>Sources, data provenance, simplifications, and credits.</p>
  </footer>
</main>

<script>
(() => {
  "use strict";

  const state = {
    param: 0.5,
    selected: new Set(),
    hovered: null,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function createStore(initial) {
    let current = { ...initial };
    const bus = new EventTarget();
    return {
      get: () => current,
      set(update, source = "unknown") {
        current = { ...current, ...update };
        bus.dispatchEvent(new CustomEvent("change", { detail: { state: current, source } }));
      },
      subscribe(fn) {
        const handler = e => fn(e.detail.state, e.detail.source);
        bus.addEventListener("change", handler);
        return () => bus.removeEventListener("change", handler);
      }
    };
  }

  const store = createStore(state);

  const slider = document.getElementById("param-slider");
  function render(current) {
    const param = clamp(current.param, 0, 1);
    document.getElementById("param-value").textContent = param.toFixed(2);
    document.getElementById("param-mark").setAttribute("cx", 30 + param * 540);
  }
  store.subscribe(render);
  slider.addEventListener("input", () => store.set({ param: +slider.value }, "param-slider"));
  render(store.get());

  // Replace this demonstration with the concept's model and figure.
  // Keep state changes explicit; use source strings to prevent linked-view feedback loops.
})();
</script>
</body>
</html>
```

If choosing D3, add its actual dependency before any D3 code. For offline directory delivery, include `lib/d3.v7.min.js` and load that file; for single-file delivery, inline the actual library. Omit D3 entirely when it is unused. The optional D3 recipes below assume the dependency is available.

## CSS Foundation

Use CSS custom properties throughout, including SVG styles regardless of renderer. The scaffold supplies readable defaults; retain the chosen environment's design system where applicable.

Typography:

- Body: serif stack for long reading.
- Heading/UI/SVG text: sans stack.
- Monospace: equations, values, short pseudocode.
- For offline delivery, use system fonts or bundled font files.

Color:

- Start with the scaffold palette, then adapt it to the concept.
- Color must have semantic purpose.
- Never use color as the only channel for meaning.
- Avoid default AI palettes unless the concept specifically supports them.
- Use the same variable colors across prose, equations, and figures.

Containers:

- A `.figure` container is appropriate because an interactive figure is an object in the article.
- Do not box every section or paragraph.
- Avoid generic callout boxes. Use `.margin-note` or `.model-note` for necessary secondary context.

Dark mode may be added when appropriate, but light mode is the stable default. If added, verify all chart colors, text, axes, focus outlines, and tooltip backgrounds in both modes.

## Article Anatomy

Every article should contain:

1. **Title and deck:** what the reader will understand or predict.
2. **Concrete opening:** a small example, not a broad thesis.
3. **Progressive sections:** each section advances one mental-model step.
4. **Figures with captions:** captions direct attention.
5. **Assessment moment:** prediction, self-explanation, or reveal.
6. **Limitations:** what the simplified model leaves out.
7. **Footer:** sources, data provenance, simplifications, credits.

## Figure Captions

Format:

```html
<figcaption class="figure-caption" id="fig-n-caption">
  <span class="figure-label">Figure N.</span>
  What the reader should notice, including the relevant condition or exception.
</figcaption>
```

Good caption:

> Figure 2. When the step size crosses the basin, the path does not merely move faster. It starts alternating sides because each update is computed from the local slope.

Weak caption:

> Figure 2. Gradient descent with learning rate slider.

The caption is editorial glue. It tells the reader what to notice, especially after interaction changes the figure.

## Assessment Moments

Every article should include at least one low-friction assessment-like moment. It should feel like active reading, not a school quiz.

Patterns:

- **Prediction reveal:** “Before changing the slider, where do you expect the next point to land?” Button reveals answer.
- **Mismatch prompt:** “Try the largest value. What changed that the original metaphor did not predict?”
- **Self-explanation:** “In one sentence, explain why the curve bends here.”
- **Compare views:** “Select the same case in both charts. What stays constant?”

Example HTML:

```html
<div class="assessment" id="check-1">
  <p><strong>Try to predict:</strong> if the parameter doubles, does the next step double too?</p>
  <button type="button" id="reveal-check-1">Reveal</button>
  <p class="answer">Not always. In this model, the local slope changes after the first move, so the second step is computed from a different position.</p>
</div>
<script>
(() => {
  const box = document.getElementById("check-1");
  document.getElementById("reveal-check-1").addEventListener("click", () => box.classList.add("revealed"));
})();
</script>
```

## Margin and Model Notes

Use margin/model notes for necessary secondary information that would interrupt the main path.

Good uses:

- Source note.
- Simplifying assumption.
- Boundary condition.
- Definition already known to some readers.

Bad uses:

- Generic “insight.”
- Motivational copy.
- Key idea that belongs in the main prose.

## Wide Figures

Use `.figure-wide` only when width improves comprehension: dense timelines, large matrices, linked views, or side-by-side representations. Do not use wide figures for generic drama.

## Scroll-Driven Layout

Use scroll-driven narrative only when sequence matters. The figure should change because the reader has advanced to a new conceptual step, not because scroll effects look polished.

```css
.scroll-container { display: grid; grid-template-columns: minmax(0, 1fr) minmax(18rem, 24rem); gap: 2rem; align-items: start; }
.scroll-figure { position: sticky; top: 1.5rem; }
.step { min-height: 60vh; padding: 2rem 0; }
@media (max-width: 760px) {
  .scroll-container { display: block; }
  .scroll-figure { position: static; }
  .step { min-height: auto; padding: 1.25rem 0; }
}
```

Implementation rule: `goToStep(i)` must be idempotent. Scrolling backward should produce the correct state from any current state.

## Equations and Pseudocode

Prefer MathML or plain HTML for simple equations. Use KaTeX when it improves the notation, following the chosen environment's dependency conventions. Offline delivery requires its scripts, styles, and required fonts to be included.

When pairing an equation with pseudocode:

- Stack vertically, equation above pseudocode.
- Keep pseudocode minimal.
- Color-code variables consistently across prose, equation, and figure.
- Reserve fixed height for dynamic values to avoid layout jitter.
- Use a light code background when color-coded variables need to remain readable.

## Hover Cross-References

When a term or variable in prose maps to a visual element, allow hover/focus highlighting in both directions.

Use `data-ref` attributes:

```html
<span data-ref="gradient" tabindex="0">gradient</span>
```

The corresponding figure element uses the same `data-ref`. Hover, focus, and pointer interactions should dispatch the same highlight event. This is a D3 example; native events or the environment's state mechanism can do the same job.

```js
const dispatch = d3.dispatch("hover");

d3.selectAll("[data-ref]")
  .on("pointerenter focus", function () { dispatch.call("hover", this, this.dataset.ref); })
  .on("pointerleave blur", function () { dispatch.call("hover", this, null); });

dispatch.on("hover.refs", ref => {
  d3.selectAll("[data-ref]").classed("is-highlighted", function () {
    return ref && this.dataset.ref === ref;
  });
});
```

## State Coordination

For standalone HTML, a shared state object and native events are often enough. Use the existing state conventions in a framework or repository. State updates must preserve object identity and avoid cycles across linked views.

When D3 is chosen, `d3.dispatch` is one option for simple linked views:

```js
const dispatch = d3.dispatch("select", "hover", "filter");
const state = { selected: new Set(), hovered: null, param: 0.5 };

// Chart A listens.
dispatch.on("select.chartA", keys => {
  state.selected = new Set(keys);
  renderChartA();
});

// Chart B emits.
brushGroup.on("brush end", event => {
  if (!event.sourceEvent) return; // Ignore programmatic brush moves during synchronization.
  if (!event.selection) {
    dispatch.call("select", null, []);
    return;
  }
  const keys = data.filter(d => inBrush(d, event.selection)).map(d => d.id);
  dispatch.call("select", null, keys);
});
```

For deeper state, use a tiny store:

```js
function createStore(initial) {
  let state = { ...initial };
  const bus = new EventTarget();
  return {
    get: () => state,
    set(update, source = "unknown") {
      state = { ...state, ...update };
      bus.dispatchEvent(new CustomEvent("change", { detail: { state, source } }));
    },
    subscribe(fn) {
      const handler = e => fn(e.detail.state, e.detail.source);
      bus.addEventListener("change", handler);
      return () => bus.removeEventListener("change", handler);
    }
  };
}
```

Avoid feedback loops by passing a `source` string and skipping updates that originated from the current chart. Programmatic brush restoration must not emit a fresh user selection; use an explicit guard or inspect `event.sourceEvent` as above. Unsubscribe handlers and disconnect observers when the host environment removes a figure.

## Responsive Rendering

Observe the figure container, not the window. Redraw charts with readable text at the new width. Do not rely only on `viewBox` for text-heavy charts, because it shrinks text.

```js
const container = document.getElementById("fig-1");
const ro = new ResizeObserver(([entry]) => {
  const width = Math.floor(entry.contentRect.width);
  if (width > 0) render(width);
});
ro.observe(container);
```

Prevent ResizeObserver loops by observing a wrapper with CSS-determined width and by clearing/redrawing inside a fixed drawing area.

Touch: use pointer events (`pointerenter`, `pointermove`, `pointerleave`, `pointerdown`) rather than mouse-only events.

## Viewport-Aware Simulation

Long-running simulations should run only while visible.

```js
let running = false;
const observer = new IntersectionObserver(entries => {
  running = entries.some(e => e.isIntersecting);
  if (running) tick();
}, { threshold: 0.2 });
observer.observe(document.getElementById("fig-1"));
```

Respect reduced motion. If `prefers-reduced-motion` is true, use stepped updates, still frames, or manual controls instead of continuous animation.

## Article Series

Use a series only when one article would overload the reader. Each article must stand alone.

Index page requirements:

- Introductory prose that frames the series.
- Small concept-specific visual element, such as a sparkline, matrix silhouette, timeline, force-layout thumbnail, or simplified figure.
- Article links with one-sentence learning outcomes.
- No generic card grid unless the cards are the navigation object. Keep cards restrained.

Individual article footers should include back/next links and sources.

## Delivery QA

Before delivery, verify or disclose the artifact-level checks below. Use `visuals.md`'s Final Visual Review for figure-level checks; the core requirements remain captions, accessible descriptions, keyboard controls, readable labels, non-color encodings, and a reduced-motion path.

```text
Delivery: requested artifact/environment, complete dependencies, usable opening instructions
Offline, if selected: opens from disk disconnected, no runtime network requests
Runtime: promised opening method works without console errors or placeholder figures
Responsive: desktop and narrow reader widths checked; chart text remains readable
Learning: at least one prediction/self-explanation/reveal moment
Truth: sources, assumptions, simplifications, and limitations stated
```
