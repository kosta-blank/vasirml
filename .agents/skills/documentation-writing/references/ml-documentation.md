# ML systems and evaluation evidence

Use for ML system overviews, model/data references, and summaries of supplied evaluation findings. Start with the reader's question and available sources. Prioritize the overview and evidence summary for cross-team managerial review; add a reference when readers need repeated factual lookup. The coverage below is optional and task-dependent.

## ML system overview

Explain the problem the system serves, its intended users and uses, and how its outputs affect downstream behavior. Document known limitations and unsupported uses when sources establish them.

A useful progression is purpose, system flow, dependencies and ownership, then limitations and links to evidence:

- Trace data through relevant training and inference paths, including preprocessing, model execution, and consumers. Keep offline and production contexts distinguishable.
- Identify relevant data sources, transformations, model artifacts, versions, and configuration. For retrieval or LLM systems, include corpus/index and prompt versions when they affect documented behavior.
- Explain input constraints and output meaning, dependencies, fallback behavior, and failure boundaries. Link to interface detail rather than repeating its schema.
- Record established owners, operational responsibilities, and escalation paths. Mark missing ownership as unknown; assignment belongs to planning.

An illustrative retrieval-service overview might trace ingestion, indexing, retrieval, generation, and the consuming feature, then identify where stale data or a dependency failure changes the result. Use only stages and failure behavior supported by the supplied system material.

## Evaluation evidence summary

Help the reader understand what was examined, what was reported, and what remains unresolved. Link to the original report or artifact. A compact summary can cover:

- **Question and scope:** the evaluated question, model/configuration versions, dataset and slice scope, and relevant offline or online conditions.
- **Reported results:** supplied metric definitions, values, units, denominators, and comparison baselines where available. Preserve source qualifications; keep results from differing conditions distinguishable.
- **Limits:** reported uncertainty, failure cases, exclusions, and limits on generalization. Missing context remains explicit.
- **Interpretation:** distinguish reported findings, attributed conclusions, the document author's qualified interpretation, and open questions. Tie each substantive claim to its source.

Carry a supplied readiness decision with its attribution and conditions. Choosing metrics, running evaluations, setting acceptance thresholds, or independently deciding model validity or deployment readiness belongs to ML evaluation. Keep software behavior checks distinguishable from model-quality evidence.

For example, summarize a supplied retrieval report with the evaluated index/model versions, query-set scope, reported results, known failure slices, and caveats. Leave absent fields unknown; create no replacement results or readiness verdict.

## Model/data reference

Use a consistent factual schema for applicable model or data objects: identifier and version; source or lineage; population/time scope; transformations; input and output semantics; constraints; documented owners; and related source artifacts. Include only relevant, supported fields. Cross-link the overview and evaluation report rather than copying changing results into each entry.
