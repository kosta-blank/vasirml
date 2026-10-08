# Component architecture

Read when deciding a component boundary or public interface. These questions retain the original Ousterhout-inspired appendix as an optional design lens.

| Principle | Question for a frontend component |
|---|---|
| Deep modules | Does a small interface provide substantial useful behavior? |
| Information hiding | Can the implementation change without changing callers? |
| General interfaces | Does the interface express a reusable capability instead of a single caller's internal steps? |
| Complexity down | Does the component own orchestration that would otherwise burden every caller? |
| Errors out | Can an expected condition be a valid state or result instead of an exception? |

Apply these where they clarify an actual boundary. Keep domain-specific components when they express the product's meaning, and avoid creating abstractions solely to satisfy the table.
