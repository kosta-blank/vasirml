# API contracts and integration

Use for an API reference or a practical integration path. Start from the designated contract and version, such as a supplied interface schema or repository definitions. Mark unresolved contract/implementation discrepancies and use the documentation drift workflow for a detailed audit when needed.

## Interface reference

Use the API schema example in [documentation patterns](documentation-patterns.md#reference) as an adaptable scaffold. Make authentication, request/response types, required and optional fields, defaults, errors, examples, limits, and supported versions easy to locate where applicable.

Describe compatibility and failure behavior that affect integration: documented retry safety, idempotency, pagination, streaming, or asynchronous job states. Include only supported features and guarantees. Scope performance claims to the source conditions; flag unverified examples.

## Integration guide

Give the intended consumer a path from prerequisites and authentication through a minimal request to interpreting the response and handling likely failures. Link to the full contract. Include the documented verification signal so readers can recognize a successful integration. Preserve branches that materially change the consumer's actions.

For example, an inference integration guide can connect a minimal request, its response fields, and a documented error/retry case. Use actual supplied endpoints and payloads; mark unavailable details rather than inventing them.

## ML interface details

When relevant and supported by sources, explain preprocessing and input constraints, model/version selection, output meaning, documented variability and its controls, and latency or asynchronous behavior. Define score, probability, or confidence fields according to the supplied contract; flag unknown semantics. Keep API guarantees and reported model-quality evidence distinguishable, and link to the evaluation summary when it serves the reader.
