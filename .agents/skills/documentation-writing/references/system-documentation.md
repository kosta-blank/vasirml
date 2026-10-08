# Architecture and operational documentation

Use for a larger-system overview, interface map, or operational task guide. Explain the established system and supplied decisions. Distinguish implemented behavior, accepted but unimplemented decisions, and proposals; carry their source and version/environment scope where relevant.

## Architecture overview

Give the reader the system purpose and boundary, component responsibilities, major data flows, dependencies, and consequential failure boundaries. Explain accepted rationale and tradeoffs from supplied decision records. Record established ownership and escalation paths; keep missing decisions or owners explicit.

A useful overview follows one important request or data path, showing where control, data, or responsibility crosses a component boundary. Include a diagram when it clarifies those relationships, with links to interface and operational detail. Match its labels and arrows to the documented sources.

## Interface map

For important boundaries, a table can identify producer, consumer, exchanged data or operation, synchronous/asynchronous behavior, constraints, failure handling, owner, and source link. Choose fields that help the audience reason about integration or dependencies. Link to the [API guidance](api-documentation.md) and canonical contracts instead of copying their schemas.

## Operational task guide

Document one reader task, such as investigating a failed pipeline or following an established release procedure. Include applicability, prerequisites, sourced steps and decision points, success signals, and supported recovery or escalation paths. Link to the rationale and interface facts that readers need.

For example, a pipeline-failure guide can connect the documented failure signal to the affected dependency, existing diagnostic procedure, and established owner. Flag unavailable or unverified steps; preserve supplied recovery behavior.

Architecture selection, new requirements, owner assignment, and milestone commitments belong to planning. Implementation testing belongs to software verification. Documentation can expose a gap and identify what information is needed without creating those decisions.
