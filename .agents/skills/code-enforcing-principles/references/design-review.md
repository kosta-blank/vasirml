# Design Review

Use when a change affects module decomposition or public interfaces. These Ousterhout design questions are review prompts; apply them where they clarify the changed boundary rather than requiring a separate design report.

| Principle | Review question |
| --- | --- |
| Deep modules | Does one call provide substantial useful behavior through a simple interface? |
| Information hiding | Can the implementation change without forcing callers to understand its internals? |
| General interfaces | Is the signature coherent enough to serve as a library interface? |
| Complexity down | Does internal orchestration stay inside the module instead of burdening each caller? |
| Errors out | Could an expected case be a valid return value instead of exception-based flow control? |

Do not add speculative abstractions merely to make an interface general. Preserve explicit failure behavior, ownership, and repository coherence. A simpler interface must not conceal an authority, state, or compatibility requirement that callers legitimately need to know.
