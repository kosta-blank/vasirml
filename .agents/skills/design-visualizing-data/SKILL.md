---
name: design-visualizing-data
description: Designs, audits, and implements charts, tables, and evidence presentations across web, slides, print, and technical reports. Use for supplied model results, experiment comparisons, trends, uncertainty, chart selection, or visualization reviews needing defensible framing and explicit statistical assumptions.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Charts and evidence presentation

Turn quantitative evidence into a defensible visual argument for the audience, medium, and decision. Choose a chart, table, sentence, or mixed artifact according to the reader's task. Work as an evidence editor, skeptical analyst, audience advocate, and accessibility reviewer.

Optimize for insight at a glance, evidence on inspection, and nuance on study. Preserve human significance, perceptual accuracy, and trust. Choose the question, comparison, normalization, and encoding before polishing the design or writing implementation code.

## Scope and statistical responsibility

Present supplied ML evaluation results with their metric definitions, protocol, conditions, and limits. ML metric selection, evaluation design, validation strategy, acceptance thresholds, and model-validity conclusions belong to the dedicated ML evaluation workflow. Planning owns workstreams and milestones; software verification establishes tested implementation behavior.

This skill checks whether the displayed analysis supports the interpretation. It may calculate transparent descriptive summaries, inspect supplied diagnostics, and flag statistically inappropriate methods. Before adding fitted curves, intervals, tests, forecasts, or causal language, inspect the relevant assumptions and uncertainty method. If a substantive statistical analysis is requested, make the method and diagnostics explicit and involve the appropriate analytical workflow where needed. Never let a presentation task silently become a new ML evaluation.

Missing analytical evidence limits the claim. Show descriptive observations when useful, identify the unresolved assumption and its consequence, and request the specific analytical check needed. Record important assumptions as **supported**, **violated**, or **unknown**, with the evidence available; a diagnostic plot alone cannot prove validity.

## Core Doctrine

1. **Story before style.** Fix the question, comparison, normalization, and encoding before decoration.
2. **Analysis before explanation.** Distinguish exploration, communication of a chosen claim, and implementation.
3. **Text and marks are one system.** Titles, captions, labels, annotations, source notes, uncertainty notes, and marks must agree.
4. **One protagonist for narrative graphics.** Give supporting variables a clear role. Monitoring dashboards and technical figures may serve several recurring comparisons.
5. **Persuasion must remain inspectable.** Expose denominator choices, uncertainty, omitted context, and editorial emphasis.
6. **Chart literacy matters.** Use forms the audience can read, with familiar baselines or tables when useful.
7. **A weak thesis stays weak.** Return exploratory findings or a narrower claim when the evidence cannot support more.

## Priority Order and Rule Strength

Resolve conflicts in this order:

1. truthfulness, statistical integrity, and provenance
2. audience task and decision context
3. perceptual accuracy
4. accessibility and literacy
5. narrative force and memorability
6. aesthetic identity and house style

Rules carry different weight: **[Empirical]** denotes research support, **[Consensus]** practitioner agreement, **[Historical]** enduring exemplars, and **[House]** a flexible style default. Prefer breaking house defaults before consensus guidance, and consensus before empirical guidance. Truthfulness and accessibility take priority, including over an annotation limit or preferred style.

## High-Value Rules

- **[Empirical]** Prefer position on a common scale for precise comparison. Aligned position and length usually serve comparison better than angle, slope, area, color, or volume. Encoding accuracy depends on the task.
- **[Empirical]** Use sequential color for ordered magnitude, diverging color for a meaningful midpoint, and categorical color for nominal groups.
- **[Empirical]** Area, bubbles, treemaps, and heatmaps serve overview better than precise lookup.
- **[Empirical]** Show raw points, distributions, or clearly defined intervals when sample size or variation matters. Distinguish observed variation from inferential uncertainty.
- **[Consensus]** Use a supported finding as a narrative chart's title. Technical figures may use neutral titles; dashboards may identify the recurring question.
- **[Consensus]** Direct-label when feasible. Use one highlight color against muted context unless several groups are equally primary.
- **[Consensus]** Split overloaded views into coordinated panels, small multiples, or a chart with a table. Use a table when exact lookup is the task.
- **[Historical]** Minard: one protagonist, one plot, linked supporting context. Du Bois: bold geometry and graphic identity can convey consequence while preserving evidence, clarity, and dignity.
- **[House]** Check whether the main claim reads in about three seconds. Prefer at most three major callouts in a static view unless the format or evidence requires more.

## Task Classification and Inputs

Choose exploratory analysis, explanatory storytelling, or a hybrid. For hybrids, keep the analysis that finds the story distinguishable from the presentation that communicates it. Decide whether navigation is author-driven, reader-driven, or mixed.

Identify the intended artifact:

| Artifact | Design priority |
|---|---|
| Annotated chart | One supported claim, one dominant pattern, direct labels, few callouts. |
| Dashboard | Stable layout, consistent scales, recurring comparisons, small multiples, sparse narrative. |
| Scrollytelling, slideshow, or data comic | One job per scene: baseline, shift, supported context, implication. |
| Infographic or poster | Self-contained context and memorable graphic identity with truthful geometry. |
| Social card or short video | One claim and one dominant pattern readable under compression. |
| Technical figure | Method, uncertainty, and supporting context visible; neutral tone unless requested otherwise. |

Expect relevant inputs when available:

- dataset or schema; units, timeframe, grain, entity definitions, and provenance
- metric definitions, numerator and denominator, cohort, baseline, and evaluation protocol for supplied ML results
- sampling or assignment design, observation unit, repeated measures, clustering, time ordering, and missingness
- supplied analytical method, diagnostics, transformations, interval type and calculation, and known limitations
- audience, medium, desired response, supplied question or thesis, and delivery constraints
- existing tools or project stack, performance, brand, accessibility, responsiveness, and export needs

Proceed with the smallest safe presentation assumptions and disclose material ones. Statistical assumptions about independence, representativeness, causal identification, or interval validity require evidence; leave them unknown when it is unavailable. Ask for missing information when it changes the validity of the interpretation.

## Workflow

Use these as decision checks, scaling depth to the task. A small chart correction needs the affected checks; a new consequential evidence presentation needs the full review. These checks do not require separate report sections.

### 1. Editorial Diagnosis and Statistical Foundation

Identify the decision or open question, audience, medium, intended response, advocacy posture, and provenance quality. Choose neutral explanation, decision support, or evidence-led advocacy. Consider source quality, missingness, uncertainty, and transformation risk.

Before interpreting a statistical result, check:

- **Claim:** descriptive, associational, predictive, or causal; quantity, population, comparison, and time horizon.
- **Data structure:** outcome type, observation unit, denominator, sampling, repeated measures, clusters, and time dependence.
- **Assumptions:** method-specific distribution, link or mean relationship, dependence handling, and relevant diagnostics.
- **Uncertainty:** interval type, level, calculation, scope, and treatment of dependence; row count does not automatically equal independent sample size.
- **Selection:** searched comparisons, chosen subgroups or time windows, multiple testing, and whether the finding remains exploratory.

Read [Statistical foundations](references/statistical-foundations.md) when the presentation uses analytical overlays, inferential comparisons, forecasts, causal claims, or dependent data, or when a supplied method appears inappropriate. It gives the time-series regression example and targeted safeguards. Match scrutiny to the actual claim; a descriptive table does not need an unrelated model audit.

Choose chart, table, text, chart with table, or mixed artifact. Exact quarterly lookup may favor a table; a pattern plus precise values may need both.

### 2. Candidate Stories and Comparison

If a thesis is missing, weak, or contradicted, consider two to four candidates when that comparison helps. Assess evidence strength, novelty, consequence, audience fit, and overclaiming risk. Select a supported claim or report that no strong thesis exists. A topic such as "Revenue by quarter" supplies less direction than a supported finding such as "Q3 reversed the decline." Keep exploratory discoveries labeled as such.

Choose the comparison: magnitude, change over time, ranking, part-to-whole, relationship, distribution, spatial pattern, flow, connection, or composition over time.

Choose raw values, rates, per-capita values, indexes, baseline-relative change, cumulative values, or another justified normalization. Distinguish percentage-point change from percent change. State the reason when the basis materially affects interpretation; disclose when normalization changes the story. Profit versus target may need both absolute values and deviation from target.

For multivariate narrative graphics, identify the protagonist variable, what happens to it, and supporting context. Link extra panels, sparklines, timelines, maps, or notes where needed. Split competing variables into coordinated views.

### 3. Encoding and Structure

Use the most accurate encoding the task supports:

| Comparison | Starting choices |
|---|---|
| Magnitude or ranking | Sorted bars or dot plots. |
| Change over time | Lines, slope charts, or sparklines; preserve meaningful time spacing. |
| Part-to-whole | Stacked bars or waffles; treemaps when hierarchy matters. |
| Relationship | Scatter plots; connected scatter only with clear time logic. |
| Distribution | Histograms, density plots, box plots, beeswarms, or strips. |
| Spatial | Choropleths for rates or proportions; dot maps or proportional symbols for counts. |
| Flow | Sankey or alluvial only at a readable node and link count. |
| Connection | Networks when topology carries the finding. |

Avoid 3D charts, rainbow scales for ordered data, raw-count choropleths, dual axes, overloaded networks or Sankeys, and pies with many slices unless the specific tradeoff is justified. A pie can work for a small number of shares or one dominant share.

Specify scales, domains, baselines, aspect ratio, labels, ordering, color, annotations, and any reference line or supporting table. Bars normally start at zero; justify exceptions. Keep line slopes readable without exaggeration. Share scales across small multiples when panel comparison matters. Account for geographic area bias in maps.

### 4. Narrative, Overload, and Framing Audit

For narrative graphics, choose a supported headline, contextual subtitle, evidential callouts, targets or reference bands, emphasis, and a caption or scene sequence when useful. Provide a plain-language summary for complex views. Every caption and annotation must agree with the plotted quantity, interval, and visual salience. Causal wording requires the relevant identification evidence.

Check whether too many variables or channels compete for attention. Simplify or split the artifact before polishing.

Audit visual exaggeration, baselines, denominators, normalization, outliers, raw counts versus rates, omissions, and transformations such as smoothing, aggregation, filtering, winsorizing, or clipping. Identify who is counted, excluded, or likely to misread the framing, and the strongest reasonable skeptical interpretation. Statistical limitations discovered in step 1 must constrain the headline and annotations.

For a consequential or disputed claim, make the **Story proof** inspectable:

- **Claim**
- **Key evidence**
- **Not claimed / uncertainty**
- **Why this framing is defensible**

Weaken an unsupported headline, change the view, or use a descriptive presentation. Graphics cannot establish missing assumptions.

### 5. Accessibility and Literacy

Across media, require color-independent encoding, readable text and contrast, grayscale legibility, suitable palette logic, clear labels, and access to underlying values or a data-table alternative when the task needs it. Supply a meaningful summary or long description for complex charts in a form supported by the destination. Check print/export readability, slide projection, and mobile layout as relevant.

For web graphics, use appropriate accessible naming and semantics, including `role="img"` and SVG `<title>` / `<desc>` where suitable. Interactive elements need keyboard access, visible focus, focus-accessible tooltips, sufficient touch targets, and reduced-motion support.

Check whether the audience can decode the chart form. Familiar forms, direct labels, a baseline view, or a table may improve comprehension. Assess the likely immediate takeaway and what closer inspection reveals; distinguish a predicted reader response from observed comprehension testing.

### 6. Implementation Decision

Choose tools for the destination and existing project. A static report figure, slide, spreadsheet chart, or web component should use the appropriate available plotting or artifact tools. React, D3, and SVG are options for web graphics. Canvas can serve dense marks or performance-sensitive animation, with accessible alternatives.

For large datasets, bin, aggregate, sample transparently, or load progressively, disclosing effects on interpretation. Keep data, scales, marks, annotations, and interaction concerns separate. Use explicit layout constants, stable layout, and responsive sizing appropriate to the medium; web SVG may use a responsive `viewBox`.

Maintain typography hierarchy, tabular numerals for aligned labels, and annotations or tooltips that avoid covering evidence. Use motion to explain change or preserve object constancy. Use interaction when inspection or reader control improves understanding. Comment on non-obvious editorial or engineering decisions.

Implement when requested or clearly implied. Otherwise provide the relevant design or review. If implementation is blocked by missing fields, offer a precise spec or useful scaffold with the missing inputs identified. Verification should target rendered values, transforms, labels, scales, responsiveness, and relevant interaction or export behavior.

## Output Format

Lead with the artifact, recommended design, or actionable review finding. Include only what the task needs:

- the supported finding or descriptive question and material limitations
- consequential encoding, normalization, and statistical assumptions
- source and interval definitions in the artifact or its accompanying notes
- actionable framing or accessibility findings when auditing
- implementation details or code when requested

Use the Story proof for consequential claims. Add candidate comparisons, an encoding table, narrative plan, or detailed implementation spec when they help review a substantive choice. Discuss a rejected alternative when it explains a real tradeoff.

A brief chart correction can return the correction and its reason. A complex evidence presentation can include a compact design rationale and statistical assumption record. No fixed section order or obligatory ending is required.

## Edge Cases and Final Check

- **Small samples or noisy data:** show raw points or defined uncertainty; avoid unsupported precision.
- **Many categories or nodes:** group, filter transparently, use small multiples, or abandon an unreadable form.
- **Conflicting audiences:** serve the main audience and place expert detail in an appendix, table, or accessible supplemental view.
- **High-stakes public claims:** increase provenance, denominator, omission, and uncertainty transparency.
- **Mixed-method evidence:** use necessary timeline events, sourced quotes, images, or notes alongside the quantitative view.

Before delivery, check the immediate pattern, inspectable evidence, and deeper caveat; reader and skeptical interpretations; and the form's fit to the task. Preserve statistical integrity through implementation and presentation.
