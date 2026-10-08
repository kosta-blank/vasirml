---
name: documentation-writing
description: Write, review, and organize documentation for ML and engineering systems around reader tasks using Diátaxis. Use for ML system overviews, supplied evaluation evidence summaries, API docs, architecture explanations, onboarding, reference pages, and documentation sets.
allowed-tools: Read, Grep, Glob, Edit, Write
---

## When to use

Use this skill when a user needs to:
- build or improve API docs, quickstarts, installation guides, troubleshooting content, or landing/readme docs
- document ML systems, model/data references, or supplied evaluation evidence for engineers, ML practitioners, and managers
- explain an established design or system behavior
- review reader fit, coverage, navigation, or the organization of a documentation set

Creating requirements, selecting a design, assigning owners, and committing milestones belong to planning. Preserve supplied decisions and distinguish current behavior from a documented proposal. Detailed verification of claims against repository evidence belongs to the documentation drift workflow when that audit is requested or needed. Prose reasoning and polish follow the writing skill and the user's established vocabulary and construction bans.

## Operating principles

- First determine the job:
  1. create or revise a page
  2. audit or reclassify existing docs
  3. plan or restructure a documentation set

- Ask clarifying questions only when critical information is missing and would materially change the output:
  - product or system being documented
  - audience and prior knowledge
  - desired outcome
  - available source material
  - version, environment, or scope

- Never invent technical facts, API behavior, parameters, defaults, outputs, prerequisites, or version details.
  - If information is missing, mark it as unknown, TODO, or assumption.
  - For reference documentation especially, prefer omission over fabrication.

- Use Diátaxis to serve the reader's task. Preserve a requested mixed document when its sections support a coherent task or decision. Split or link companion pages when doing so improves navigation, reuse, or comprehension; classification alone is not a reason to split.

## Subject guidance

Read only the subject references useful to the requested artifact. Combine their guidance when a document spans subjects; omit irrelevant fields and companion artifacts.

| Subject | Read when the document needs |
|---|---|
| [ML systems and evidence](references/ml-documentation.md) | An ML system overview, model/data reference, or summary of supplied evaluation findings. Prioritize overviews and evidence summaries for managerial review. |
| [APIs](references/api-documentation.md) | An interface reference or integration guide, including documented ML-specific response semantics. |
| [Larger systems](references/system-documentation.md) | An architecture overview, interface map, or operational guide. |

For managers, make system context, dependencies, documented ownership, and evidence limitations easy to find. Link to engineering detail where readers need it; adjust depth to the actual audience.

---

## Step 1: Identify the reader need using the Diátaxis compass

Classify the request by answering two questions:

1. Does the content primarily guide **action** or inform **understanding/cognition**?
2. Is the user trying to **acquire** skill/knowledge or **apply** existing skill/knowledge?

Use the result:

| Action/Cognition | Acquire | Apply |
|---|---|---|
| **Action** | **Tutorial** | **How-to guide** |
| **Cognition** | **Explanation** | **Reference** |

### Common mappings for ambiguous requests

- **Quickstart / getting started**
  - Usually a **tutorial** for beginners
  - Sometimes an onboarding **how-to** for domain experts who want the fastest path to first success

- **Installation guide**
  - Usually a procedural **how-to** with setup, verification, and troubleshooting

- **Troubleshooting**
  - Usually a problem-focused **how-to**
  - May include reference-like symptom, error, or diagnostic facts

- **API documentation**
  - Usually **reference** for endpoints, methods, fields, errors, and schemas
  - Often needs companion **tutorials**, **how-tos**, and **explanations**

- **README / landing page / user guide**
  - Usually not a single Diátaxis type
  - Treat as a navigation or overview layer that routes users to the right tutorial, how-to, reference, or explanation pages

- **Release notes / changelog**
  - Not a core Diátaxis type
  - Treat as change communication support content

If uncertain, identify the dominant user need and choose the corresponding type. Use the classification internally; explain it when it helps resolve an ambiguity or justify a structural recommendation.

---

## Step 2: Apply type-specific guidance

### Tutorials (learning-oriented, action + acquisition)

Provide a successful learning experience. Show the outcome and prerequisites, choose a safe, reliable path, and use small steps with visible results. Tell the learner what to notice. Keep options and explanation to what the learning task needs; link to deeper material.

Check that a reader with the stated prerequisites can complete the sequence, recognize progress, and reach the promised outcome. Flag unverified or fragile steps.

### How-to guides (problem-oriented, action + application)

Help a reader who is already at work complete a specific task. Assume baseline competence, give the recommended path, and include relevant branches, decision points, and likely pitfalls. Include alternatives only when materially useful; link to conceptual background instead of digressing.

Check that the guide addresses a real user goal and lets the reader complete and verify it with minimal confusion or backtracking.

### Reference (information-oriented, cognition + application)

Provide facts readers consult while working. Use a consistent schema that mirrors the API, command, configuration, or other documented object. Keep entries descriptive, neutral, precise, and easy to scan. Include relevant requirements, warnings, limits, examples, and version or environment scope.

Check that readers can locate a needed field, default, error, or other fact directly through predictable headings or navigation, without reading unrelated explanation. Keep known facts and unknowns distinguishable across entries.

### Explanation (understanding-oriented, cognition + acquisition)

Help the reader understand mechanisms and rationale. Connect concepts, explain context and constraints, and discuss relevant alternatives, limits, and tradeoffs. Label perspective or opinion as interpretation. Keep execution steps and requirement-setting in the appropriate companion material.

Check that the reader can explain the concept, why it works this way, and the conditions that limit the explanation.

For title examples and detailed page scaffolds, read [documentation patterns](references/documentation-patterns.md) only when those examples help the requested artifact. Adapt the structures to the audience and task; they are not required section lists.

## Step 3: Review and restructure documentation

If the user gives existing documentation or asks to reorganize docs:

1. Inventory the pages or sections
2. Identify the reader task and dominant type for each page or useful section. Classify quickstarts and troubleshooting by the mappings above; treat navigation pages and release notes as support content where appropriate
3. Flag mixing when it causes reader confusion, duplicated material, or difficult lookup
4. Identify missing content based on audience needs and user tasks
5. Recommend retaining, splitting, or merging material according to reader benefit and the requested document format
6. Recommend navigation, cross-links, and priority order

When prioritizing, prefer:
- high-frequency or high-friction user tasks
- onboarding paths
- core reference gaps
- pages whose mixed types are causing confusion

---

## Step 4: Connect the documentation set

- Cross-link companion pages:
  - tutorials → reference + explanation
  - how-tos → reference + explanation
  - reference → related how-tos and tutorials
  - explanation → relevant how-tos and reference
- Use consistent terminology, headings, and naming across the doc set
- Prefer plain language and accessible structure
- Put prerequisite knowledge near the start when it matters
- Landing pages and READMEs may summarize and route to deeper material; a small or requested self-contained document can keep useful sections together

---

## Step 5: Check accuracy and reader fit

Check both functional quality and reader fit.

### Functional quality
- accurate
- precise
- internally consistent
- complete enough for its purpose
- current in scope/version where relevant
- explicit about unknowns
- examples align with stated behavior
- reported evidence retains its source, scope, and limitations. Attribute supplied ML evaluation conclusions; metric selection, experiments, acceptance thresholds, and independent judgments of model validity or deployment readiness belong to ML evaluation. Software verification establishes its own behavior checks and does not establish model quality

### Reader-fit quality
- matches the audience’s prior knowledge
- anticipates confusion
- preserves flow
- supports the reader’s actual task or question
- sections let readers find the action, fact, or explanation they need without sorting through unrelated material

---

## Response behavior

When responding:
1. Deliver the documentation, review, or restructuring recommendation in the requested format
2. Include material assumptions, unknowns, or unverified steps where readers need them
3. Recommend companion pages when the reader benefit justifies them
