# Observability

Use when telemetry changes or when the risk boundary needs a production failure signal. Follow the repository's actual logging/configuration boundaries.

## Telemetry Types

- Operational logs serve humans/on-call: stable context, appropriate levels, sampling, and safe fields.
- Event/data logs are structured, versioned, and replayable when that is their contract; do not substitute console-style messages.
- Metrics use bounded label domains.
- Traces propagate context across asynchronous boundaries.
- Alerts require an actionable condition, owner, threshold rationale, and runbook or recovery path. Do not add a page with no action.

## Cardinality & Data Handling

Potential bounded labels include `component`, `result`, `errorClass`, `queueName`, `operation`, `version`, and `region`. These names are safe only when their actual value domains are bounded; arbitrary versions or exception strings can still create unbounded cardinality.

Do not use `userId`, `messageId`, `traceId`, `correlationId`, raw IDs/URLs, emails, device IDs, or free-form strings as metric labels. Correlation identifiers can belong in approved structured logs or traces without becoming metric labels.

Never log secrets, raw PII, tokens, or full URLs with query parameters. Avoid per-message/per-frame info logs on hot paths. Use the repository's logger with stable context such as component and approved correlation, trace, or run identifiers.

## Failure Signals

Tie signals to the invariant at risk: duplicate rejection, backlog, stale data, latency, error rate, or migration mismatch as appropriate. Name the owner and response; distinguish a signal that already exists from one being proposed. Measure telemetry cost when logging or instrumentation changes a capacity-sensitive path.
