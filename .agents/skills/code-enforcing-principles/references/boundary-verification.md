# Boundary Verification

Use when choosing integration checks, dependencies, or doubles. Keep verification design in the project's existing plan when one exists. Select checks that expose the actual failure mechanism.

## Integration Boundary

An integration check exercises production modules across the risk boundary with the relevant real serialization, asynchronous/error paths, configuration shape, and state transitions. Prefer a hermetic environment suitable for repeatable CI runs; production services are not required. State any boundary behavior the environment cannot reproduce.

Do not mock away the mechanism under test. A duplicate-write risk needs the real uniqueness or transaction behavior; a schema risk needs emitted output rather than only the mapper's unit test. An in-memory queue is sufficient only when its differences in delivery, ordering, acknowledgement, or failure behavior cannot hide the claimed fault.

## Dependency Fidelity

Choose the dependency according to where the risk lives:

- Use a real local dependency when the risk involves its semantics, such as database constraints, transactions, or concurrency.
- Use a hermetic fake when it preserves the relevant contract and the risk is outside its omitted internals. State material differences and blind spots.
- Use mocks outside the risk boundary when they isolate unrelated behavior without assuming the guarantee being checked.

Record the choice and its limits. Higher fidelity is useful only if it preserves the relevant behavior; environmental nondeterminism can obscure failures. When determinism is an explicit domain contract, verify its replay/restore boundaries and later state under the repository's requirements.

## Test Form

Contract, snapshot, and visual checks are test forms, independent of whether dependencies are real or doubled:

- **Contract:** check the public/wire/schema/generated contract and relevant producer/consumer compatibility using actual emitted shapes.
- **Snapshot:** useful when the serialized output is the contract; inspect updates and ensure they cannot silently approve a changed guarantee.
- **Visual:** useful when visual state is the contract; rendering evidence does not substitute for persistence, authorization, or delivery checks.
- **Behavior/journey:** drive the affected operation and observe the relevant user/operator outcome or persisted effect.

Combine forms only when each resolves a distinct risk. Existing checks can be sufficient; show that their setup, observation, and assertions cover the changed boundary. Report checks not run and unavailable mechanisms honestly. These checks verify software behavior, not model quality.
