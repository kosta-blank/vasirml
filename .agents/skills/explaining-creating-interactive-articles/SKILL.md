---
name: explaining-creating-interactive-articles
description: Create, revise, outline, or audit interactive technical explanations and focused teaching prototypes that help readers predict a mechanism. Use for explorable articles and training material; ordinary documents, operational dashboards, and production ML evaluation use their own workflows.
---
# Interactive Technical Explanations

Help a reader build a correct mental model and predict behavior they could not predict before. Prose and figures develop the explanation together; interaction earns its place by exposing a mechanism, comparison, or misconception.

## Scope and Responsibility

An explanatory article is the usual artifact, but respect the user's requested format and existing environment. A focused figure or teaching prototype can be enough. If the user requests operational monitoring, a dashboard, a slide deck, or an ordinary document, use the appropriate workflow; do not substitute an article. Apply teaching judgment to a requested artifact only where it helps.

Prefer equations, diagrams, state machines, timelines, and examples over reader-facing implementation code. When code itself creates the phenomenon, show the smallest useful fragment and pair it with an explanation. Internal chart code is a separate implementation choice.

Grounding an educational model checks the fidelity of the explanation. It does not establish production model quality. ML metric selection, evaluation protocols, retrieval-quality conclusions, acceptance thresholds, and online experiments belong to ML evaluation. Planning owns workstreams and milestones; software verification establishes only the runtime behavior tested. Use supplied evidence with its conditions and limits.

## References and Shared Guidance

Read only the material needed for the task:

- [references/writing-style.md](references/writing-style.md): the complete writing-ban contract, reader structure, grounding, and technical-explainer reasoning. Use while drafting or editing prose, captions, prompts, labels, or delivery notes.
- [references/article.md](references/article.md): an optional HTML scaffold, article layout, assessment moments, linked state, responsive rendering, and delivery patterns. Use when building or restructuring a web explanation.
- [references/visuals.md](references/visuals.md): interaction recipes, chart and rendering decisions, D3 patterns, accessibility, data provenance, and simulation validation. Use the relevant sections for a figure or visual audit.
- [lib/README.md](lib/README.md): local dependency packaging when selecting offline delivery.

When available, shared writing, visualization, and frontend skills can supply their general expertise. Reuse compatible guidance and components rather than repeating their workflows. These local references remain sufficient when those skills are unavailable. Preserve the complete vocabulary and construction bans and the underlying writing reasoning; general reuse does not weaken them. The technical-explainer adaptations below govern essay-specific choices.

## Align to the Request

Classify the task internally: **Build**, **Outline**, **Prototype**, **Revise**, or **Audit**. Default to Build for a new-article request. A small edit does not require restarting the creation process.

Identify the reader and prerequisites, core learning target, misconception or failure mode, governing sources and simplifications, and useful reader action. Use the context already supplied. For a brief request, reasonable defaults are a technically curious reader new to this particular concept, one core insight, a guided explanation followed by a small sandbox when useful, and a self-contained HTML file when no destination was specified.

Ask only about missing information that materially changes scope, correctness, or the teaching approach. Give a concept-specific recommendation or a short option set so the user can respond easily. There is no fixed question count or mandatory intake-only turn. Infer routine choices, state consequential assumptions briefly, and proceed. Pause the dependent part only when an unresolved fact prevents a truthful or appropriately scoped explanation; continue independent work. An unanswered question does not establish a required fact or authorization.

## Teaching Contract

Every substantive explanation should meet these standards:

- **Truthful model:** source-grounded claims, equations, data, and update rules; visible simplification boundaries.
- **Learning progression:** a path through dependencies, usually concrete case, visible mechanism, abstraction, application, and limitation.
- **Interaction with a job:** prediction, manipulation, comparison, inspection, linking, or reflection. Use a static figure when it teaches enough.
- **Informative defaults:** each figure shows the phenomenon before the reader touches anything.
- **Accessible understanding:** labels, captions, keyboard paths, redundant encodings, and alternatives to essential motion or pointer interaction.
- **Useful prose:** mechanisms and portable handles, with the full writing contract preserved.

## Create or Revise the Explanation

Scale the following work to the request. Keep planning artifacts compact and internal unless the user requested an outline or collaboration. Audits inspect the existing explanation against the relevant contract; mechanical edits need only checks of affected behavior.

### 1. Ground the Concept

Before designing figures, establish what is true, simplified, and unknown. Prefer user-supplied papers, documentation, specifications, textbooks, primary datasets, or official references. Research uncertain or current technical claims when needed; do not rely on commentary when the underlying source is available.

Build a compact concept model: core claim; mechanism; variables, parameters, states, or entities; equations and invariants; edge cases; misconceptions; simplifications; and source/data provenance. Never invent technical behavior for a simulation. If the source cannot be established, ask for the missing material or label the model provisional and narrow the claims.

For dense source material, find the mechanism that makes the rest understandable instead of visualizing every detail. If interpretations conflict, explain the stable core and put the disagreement in a limitation or compare the models when that disagreement is the learning target.

### 2. Define the Learning Contract

Specify prerequisites, a small set of behavioral outcomes, misconceptions to repair, non-goals, and at least one prediction, self-explanation, or try-and-compare moment for a substantive interactive explanation. These are teaching devices; do not report learner comprehension as measured without learner evidence.

Weak outcome: "Reader understands gradient descent."
Useful outcome: "Reader can predict when a larger learning rate will overshoot and explain why smaller is not always better."

### 3. Plan the Reader Path and Figures

Give each section a job in the progression. Use a guided path for prerequisite-heavy concepts, a guided path plus sandbox as a useful default, and open exploration for expert or reference audiences. A reader should know what to notice before reaching a sandbox.

For each substantive figure, record a compact spec:

- **Learning job:** purpose, claim, intended insight, and misconception addressed.
- **Model and representation:** visual encodings; real, synthetic, illustrative, or simulated data; provenance and assumptions.
- **Experience:** informative default, reader action, system response and why it changes, and interaction type.
- **Static gate and implementation:** why interaction is necessary, or choose static; technology fitted to the destination.
- **Access and validation:** caption, description, keyboard/text/model fallback, sanity checks, and expected extreme states.

Example: a learning-rate path uses a stated synthetic convex function, a visible gradient, and update positions. The default converges. The reader predicts the next position and varies step size to reveal overshoot. A keyboard control and text state summary expose the same relationship. Check that zero step size stalls and that the chosen function's known stable and unstable parameter regimes behave as expected.

### 4. Build in the Chosen Environment

Complete the requested artifact once the necessary facts are available. Build the central figure first, check its model and default state, then connect the remaining prose and figures.

Choose implementation and delivery by fit:

- **Simple explanation:** HTML/CSS, native controls, or static SVG can be sufficient. Avoid adding a library solely to satisfy a skill default.
- **Chart-heavy explanation:** D3 v7 is a useful option for scales, axes, layouts, keyed joins, brushes, drag, Delaunay hover, generators, and linked dispatch. Read the applicable recipes in `references/visuals.md`; preserve object identity and readable responsive labels whatever the implementation.
- **Existing project:** follow its framework, components, tokens, and dependency conventions. Define clear ownership of chart DOM and state if D3 is used with a framework.
- **No specified destination:** a standalone `index.html` with inline CSS, code, and small data is a practical starting point. Use an appropriate artifact directory and provide its actual path.
- **Offline delivery selected or requested:** inline or locally bundle every required script, style, font, image, dataset, and model. No CDN or runtime network dependency. Verify opening from disk disconnected. Package the whole directory when separate files are necessary; a zip is useful only for that delivery.
- **Hosted or integrated delivery:** follow the target's dependency and asset practices, with explicit provenance and no misleading offline claim. An explanation-building request alone does not authorize publication.

Do not deliver missing-library placeholders as complete artifacts. If a preferred library is unavailable, use a sound available alternative, obtain the dependency within the authorized scope, or report the remaining blocker. Library choice must preserve the explanation's technical and interaction quality.

Keep generated data deterministic with a seeded generator and label it synthetic or illustrative. For real data, record sources and transformations, including sampling or filtering. A simplified simulation must expose its assumptions, update rule, hidden parameters, boundary behavior, and relevant invariants. Sampling a large dataset for explanation supplies no independent evidence of model validity.

Write prose and figures together. Run the local writing contract while drafting; truth and comprehension outrank stylistic invention.

### 5. Verify the Affected Artifact

Check three kinds of evidence separately:

- **Truth and learning:** source-supported claims, stated simulation assumptions, correct edge cases, figure claims and captions, informative defaults, addressed misconceptions, and a useful prediction or reflection moment. Verify that controls reveal the claimed mechanism rather than merely changing graphics.
- **Article quality:** dependency order, concept-specific visual choices, consistent variable/color/shape conventions, interpretable captions, and reader-facing prose that stays with the concept. A named mechanism, variable relationship, visual convention, or boundary should travel beyond the example.
- **Runtime and access:** required assets load in the selected delivery mode; no console errors; readable desktop and narrow layouts; labeled keyboard controls; touch/pointer paths where relevant; adequate contrast and non-color-only meaning; reduced-motion alternatives; clean reset; and robust extremes, rapid input, and resize. Offline mode also requires a disconnected test without runtime network requests.

Use the references for detailed implementation checks rather than rerunning duplicate checklists. Preview the built artifact in a browser when available. If runtime checks cannot be performed, inspect it statically and disclose exactly what remains unverified. Model checks, code inspection, runtime tests, and learner observations support different conclusions.

## Technical Writing Adaptations

Apply the full contract in `references/writing-style.md` across prose, headings, captions, annotations, prompts, notes, and delivery summaries.

- A portable handle may be a canonical technical term, mechanism, variable relationship, visual convention, misconception, or boundary. Coin a term only when it clarifies more than the established vocabulary.
- Cross-domain frames are optional. A useful frame maps structurally, explains the mechanism, and names what it hides or where it breaks.
- Start inside the subject. Use concrete actors, states, and causal steps; give context before introducing terms and link known information to new information.
- Preserve the vocabulary and construction bans, including zero em dash punctuation. Prefer a direct mechanism over contrast; a correction must address a real false premise or documented misconception.
- Captions tell the reader what to notice. Prediction prompts name the action and expected relationship, such as "Before moving the slider, predict whether the path will overshoot."
- Separate fact, interpretation, simplification, analogy, speculation, and labeled hypothetical examples. Never fabricate data, quotations, source claims, or lived observations.
- End a section with its implication, boundary, or next dependency. Retain case pressure, falsifiers for strong empirical claims, and controlled surprise; avoid forcing an essay spiral or coined framework into a straightforward mechanism.

## Pedagogy in Interaction

Disclosed exaggeration can make a phenomenon visible, but must preserve the causal rule. Slow motion enough to follow cause and effect; keep variable identities consistent across prose, equation, and figure. Ask for prediction before revealing a misconception when useful, support self-explanation, and provide a clean reset. Motion and controls serve the teaching job.

Choose concept-specific visual objects. Memory-block cells may warrant boxes because the blocks are the content; generic metric cards or an "Insight" box need an explanatory rationale. One parameter that exposes the misconception often teaches more than a panel of every internal variable.

## Output

Return the requested result without compulsory process sections:

- **Completed artifact:** what it teaches, a link/path to the actual artifact, a package only when useful, and a short verification note with material limitations.
- **Outline:** concept model, learning contract, section path, figure specs, and unresolved source needs.
- **Prototype or revision:** the requested figure or changes, with checks of affected learning and runtime behavior.
- **Audit:** consequential issues first, evidence from the artifact, concrete fixes, and the relevant correctness, pedagogy, accessibility, runtime, or visual-specificity risk.

Ask a focused question only when a remaining dependency blocks the requested result; provide completed independent work alongside it when useful.
