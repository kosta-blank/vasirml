# Writing Style for Interactive Explanations

Give the reader a useful distinction under case pressure and a handle they can use afterward. A handle may be a canonical technical term, mechanism, variable relationship, visual convention, misconception, or boundary. Coin a term only when it clarifies more than the established term.

This guide is self-contained. A shared writing guide may assist when available, but it must preserve these bans and their underlying reasoning; it cannot replace them with looser defaults.

## Priorities and fit

Use this order when demands compete:

1. Truthful grounding and fit for the reader's task.
2. Conceptual rigor: a useful distinction tested against cases.
3. Reader comprehension: old-to-new flow, clear emphasis, coherent progression.
4. Plain force: concrete language, active mechanisms, omitted padding.
5. Controlled weirdness: an earned frame, coined term, or canon reference.

Gopen supplies the reader-path discipline: meaning arrives through structure, sequence, topic position, and stress position, rather than the writer's intention. Strunk/White supplies plain force: concrete language, active verbs, positive statements, unity, omitted padding, and emphasis placed where syntax can carry it. The bans below target prose machinery that manufactures depth without doing the reasoning. Compliance alone can still produce dead prose. If reader discipline kills the thought, revive the thought; if weirdness obscures it, cut the weirdness; if style hides weak reasoning, repair the reasoning.

For a technical explanation, follow the learning dependencies: concrete case, visible mechanism, formal abstraction, application, limitation. Do not impose an essay mode, compulsory contradiction, coined term, cross-domain frame, or spiral on that progression. Start inside the subject. Captions tell readers what to notice; prediction prompts name a specific outcome to predict. End sections on an implication, boundary, pressure, or next dependency instead of a grand summary.

## Ground the material

Distinguish supplied observation, checkable public fact, interpretation, labeled hypothetical, simplification, analogy, and speculation. An analogy compares structures; a hypothetical illustrates a possibility. Neither supplies evidence. Separate observation from interpretation inside sentences and keep judgment out of factual claims.

Never invent lived experience, concrete details, data, quotes, source claims, or certainty. “I noticed this in a meeting last week” is usable only if the user supplied that meeting. First person may express a reasoning stance: “my current model,” “the weaker claim I'd defend,” or “I do not yet trust this pattern.”

If input is abstract, ask for a concrete case only when needed, use a labeled hypothetical, or use sourced public examples. Source load-bearing statistics, quotations, historical, legal, scientific, and current claims or explicitly mark uncertainty. Prefer primary sources; disclose reliance on secondary sources or avoid leaning on them. For specific current, high-stakes, technical, scientific, legal, medical, financial, or political claims, research when tools are available. Otherwise stay conceptual and state limits. A speculative frame should feel useful rather than proven. A strong causal claim needs an internal falsifier.

For example, “Three of the four launches stalled after procurement approved the tool” is an observation only if supplied or sourced. “My current model is that procurement approval created a false sense of adoption” is an interpretation needing support. In “The team failed to ship the obvious solution,” the word “obvious” smuggles judgment into the fact pattern. Separate the proposed solution's shipping status from the argument for it.

Writing describes supplied ML findings with their conditions and limits. Selecting evaluation metrics, designing experiments, and establishing model validity belong to ML evaluation. A software or simulation check supports only the behavior it checked. Planning owns workstreams, assignments, dependencies, and milestones.

## Develop and test the explanation

Use these checks privately and proportionally. They are reasoning aids, not compulsory output sections or a scripted sequence.

- **Notice a specific pattern.** Find the behavior or relationship the reader should explain or predict. In organizational cases, compare official purpose with operational behavior when that gap matters. A puzzle earns attention through a real tension or misconception.
- **Explain the mechanism.** Identify actor or entity, condition, behavior, cause, and consequence. For organizational recommendations, account for incentives, resource constraints, beneficiaries, switching costs, feedback that stabilizes the situation, and likely adaptation after intervention.
- **Give the reader a portable handle.** Show the pattern before naming it. A useful name compresses it, travels beyond the opening case, establishes a boundary, and shortens later explanation. Prefer one load-bearing distinction to many labels that merely rename examples. Define a coined term with a specific behavior, condition, and mechanism; use italics at definition, rather than definition-by-negation.
- **Apply case pressure.** Check the opening example, an adjacent case when generalizing, and a boundary or countercase. Ask what evidence would weaken or embarrass the model. If none could, narrow the claim. Let a countercase change the explanation or proposed action.
- **Consider the strongest alternative.** In critique or disputed claims, represent the opposing view fairly, explain what it sees and misses, then take a supported position. Tone cannot supply the argument. Avoid symmetric hedging that evades the real disagreement.

A cross-domain frame is optional. Use it only when ordinary prose would miss something structural. Identify source and target domains, two or three mapped features, what the frame reveals, what it hides, and where it breaks. Cut it if the hidden features or boundary cannot be named. An irrigation frame for a roadmap might map water to attention, channels to commitments, weather to changing conditions, and sediment to old promises; its boundary is that plants cannot lobby for water while customers can lobby for attention. This is a hypothetical analogy, not evidence about roadmaps.

A typology or 2x2 needs independent axes, meaningful behavioral dimensions, cases that fit without forcing, and a consequence for understanding or judgment. It should expose an empty or unstable category, missing actor, transition, impossible combination, or hidden tradeoff. Name the axes, place cases, inspect the consequential quadrant, ask what would have to be true to occupy it, and name the risk the map hides. Cut a map that only repeats the prose.

Canon references such as legibility, OODA, slack, optionality, antifragility, cargo culting, attractors, basins, requisite variety, load-bearing fiction, map-territory mismatch, niches, clades, or evolutionary stable strategies must change the analysis. They should classify a case, expose a failure mode, explain a backfire, clarify a boundary, or sharpen the close. Give a named frame at least two sentences of analytical work and one limitation; otherwise cut it.

Controlled weirdness may sharpen the model. Keep coined terms, surprising frames, and load-bearing asides few and earned. Cut decorative metaphor, name-dropping, and phrases that feel strange without adding precision. Repair dead compliance with an accurate supplied detail, sharper actor-level mechanism, real countercase, boundary, or honest uncertainty. Add pressure rather than ornament; do not force surprise into a simple explanation.

## Guide the reader

Each sentence, paragraph, section, and piece needs a job. Give paragraphs unity and forward movement. Ask what the reader expects the sentence to be about, what its structure emphasizes, and whether the next sentence fulfills that expectation. Repair local logic the reader would otherwise have to reconstruct.

Put the continuing actor, object, concept, or pattern in topic position. Use known information to link backward before adding new demands. Give enough context to receive a new term. Place the important new concept, causal turn, or detail near the end, where the reader expects emphasis. Keep subject and verb close; keep modifiers, objects, and causes beside what they modify. Put action in verbs rather than nominalizations.

Prefer active voice. Passive voice can serve the object's story, an unknown or irrelevant actor, topic continuity, or a controlled delayed reveal. Long sentences may accumulate meaning; split trailing modifiers that only create drift. Delayed subjects, fragments, and broken expectations need a deliberate effect that serves the reader. Give competing emphases a split or explicit hierarchy. Parallel form is useful only for genuinely parallel ideas.

State what happens in positive, definite, concrete language. Use observed actors, objects, and behavior before abstraction. Antithesis requires a real contrast and must also satisfy the negation-pivot rule below. Repair a missing causal or logical link instead of adding a transition word. Remove throat-clearing, repeated claims, decorative adjectives, abstract noun fog, generic praise, meta commentary, filler caveats, and sentences the reader has already earned. Preserve meaningful uncertainty and disagreement. End on the point, term, actor, image, boundary, or unresolved pressure.

## Authoritative language and construction bans

Apply these constraints throughout authored prose, headings, captions, annotations, prediction prompts, UI labels, notes, examples, and delivery summaries. Listed wording may appear when quoting or explicitly critiquing it. That exception never permits em dash punctuation. Contextual allowances below remain narrow.

### Eleven construction families

1. **Em dashes:** use zero U+2014 characters, even in quotations, examples, headings, captions, or delivery notes. There is no rare-use allowance. Use the smallest honest syntax: period for independent clauses, comma for a light aside, colon for specification, semicolon for closely related independent clauses, parentheses for subordinate material, or a shorter sentence when punctuation hides weak structure.
2. **Negation pivots:** ban “It is not X. It is Y.”, “This is not about X; it is about Y.”, “The question is not A; the question is B.”, and “The tool is not merely X, but Y.” Use the shape only to correct a real false premise supplied by the user or present in source material. State mechanisms directly; do not invent a straw premise for drama.
3. **False elevation:** ban “More than just X…”, “This is more than a tool…”, and “Beyond being X…”. Name the specific additional function or changed behavior.
4. **Grand openers:** ban “In today’s fast-paced world…”, “In an ever-evolving landscape…”, “In the realm of…”, and “As technology continues to reshape…”. Begin with the actual subject, concrete detail, supplied observation, public fact, or labeled hypothetical.
5. **Depth-signaling verbs:** avoid the depth vocabulary below unless quoting or explicitly critiquing. Name the operation: separate, test, trace, compare, name, classify, falsify, map, compress, distinguish, or pressure-test.
6. **Triadic adjective stacks:** ban “clear, concise, and compelling”, “robust, scalable, and intuitive”, and “powerful, flexible, and easy to use”. If three interchangeable adjectives leave the meaning unchanged, supply actual requirements or failure modes. Parallel facts remain allowed.
7. **Hollow hype:** avoid the hype vocabulary below unless quoting or explicitly critiquing, preserving its mechanism and bottleneck qualifiers. Replace hype with the changed behavior, cause, and limit.
8. **Dramatic reveal punctuation:** ban “X [em dash] and that changes everything.”, “The real issue: Y.”, “The result? Z.”, and “One thing is clear: Y.” Punctuation serves syntax, compression, or a genuine aside; it cannot supply a drumroll. The em dash ban is absolute.
9. **Universal audience openers:** ban “Whether you’re a beginner or a seasoned expert…”, “For founders, engineers, and leaders alike…”, and “No matter who you are…”. Address the actual reader.
10. **Meta signposting:** ban “In this essay…”, “This article will…”, “We’ll explore…”, “Let’s dive in.”, “Here are the key takeaways.”, “Happy coding.”, and “Hope this helps.” Start inside the subject and let structure show the progression.
11. **Aphoristic mirror sentences:** avoid or heavily ration “X is the artifact; Y is the product.”, “X is the surface; Y is the substrate.”, “X is the map; Y is the territory.”, “X is theater; Y is reality.”, and “The form is X; the function is Y.” Most pieces should use zero. An allowance requires concrete casework first and an explanation of mechanism afterward. Symmetry alone supplies no insight.

### Vocabulary and phrases

Avoid the following unless quoting or explicitly critiquing. Preserve each contextual qualifier.

- **Depth:** delve; dive into; deep dive; unpack; navigate; explore the nuances; examine the complexities; shed light on; take a closer look; leverage as a verb.
- **Decorative language:** tapestry; landscape as decorative metaphor; realm; journey; ecosystem as decorative metaphor.
- **Hype:** unlock; empower; supercharge; elevate; revolutionize; transform without mechanism; accelerate without bottleneck; streamline without bottleneck; holistic; seamless; robust as generic praise; scalable as generic praise; intuitive as generic praise; paradigm shift; game-changer; next-generation; world-class; cutting-edge.
- **Empty authority or abstraction:** actionable insights; key takeaways; best practices; this raises important questions without asking a specific question; nuanced as a substitute for naming the tension; multifaceted as a substitute for naming the facets; complex as a substitute for explaining the mechanism.
- **Openings and filler:** in today’s fast-paced world; in an ever-evolving landscape; it’s worth noting that; it’s important to remember; whether you’re a beginner or a seasoned expert. Never start with “Today I want to discuss…” or “X is complex and multifaceted…”.
- **Evasion and summary crutches:** on one hand / on the other hand when used to dodge a position; in conclusion; to summarize; in summary; ultimately as a summary crutch; “The key takeaway…” as a summary ending.
- **Canned endings:** I hope this helps; hope this helps; let’s dive in; happy coding; “This raises important questions…” as a closing.
- **Output prefaces:** avoid “Here is” unless needed for clarity. Do not explain that you followed this guide.
- **Sentence-ending filler:** do not end with basically; in a sense; overall; as such; at the end of the day; moving forward.

Generic transitions are suspect: Furthermore, Moreover, Additionally, In addition. Usually rewrite the join to express its actual logical relationship. Use parallel sentence pairs only for a real distinction and rhetorical questions only when the piece can sustain them. Treat “Some might argue…”, “Perhaps, in some cases…”, and “It could be said…” as weak hedges; name the uncertainty.

## Repair claims before polishing words

When a sentence feels like AI prose, rebuild the claim rather than swapping synonyms. A private diagnostic scaffold is:

> Under [condition], [actor] does [behavior] because [mechanism]. The pattern breaks when [boundary].

Keep the improved claim and remove the scaffold from finished prose. The examples below are hypothetical illustrations, not evidence about real teams.

**Mechanism repair.** Replace “The tool unlocks collaboration.” with “The tool moves handoff decisions from private DMs into a shared queue. That helps only if someone owns the queue when it jams.” The condition and owner matter more than promotional wording.

**Case pressure and a portable handle.** A hypothetical rollout goes from demo to pilot to testimonial, then work returns to old channels. *Demo conversion* names the temporary belief that a tool has entered operational use because it impressed people under staged conditions. Check the distinction against a copilot, dashboard, or knowledge base. Workflow lock-in can break this account; sustained voluntary use in difficult work after the demo period would weaken it. Use this pattern only where supplied evidence supports it, or keep it hypothetical.

**Reader repair.** A draft says: “Because leadership, after three months of unclear goals and several conflicting requests from sales, product, and platform, wanted alignment, a new planning process was created.” Its subject and verb drift, the actor disappears, and emphasis lands on a vague process. Repair: “Leadership wanted alignment after three months of conflicting requests from sales, product, and platform. It created a planning process that forced those conflicts into the roadmap.” If the paragraph instead follows the process, begin with that continuing subject.

**Dead-compliance repair.** A bland draft says: “The team used the roadmap to manage priorities. The roadmap created shared visibility. Over time, visibility helped leadership identify tradeoffs.” A sharper hypothesis says: “The roadmap made priorities visible, then quietly made them harder to challenge. Once a commitment appeared in the shared artifact, killing it required more political energy than letting it drift for another quarter.” Use that causal claim only with supporting material or a clear hypothesis label. Clean syntax cannot substitute for pressure on the model.

For technical captions, keep the repair direct: replace “The slider crosses the threshold [em dash] and everything changes” with “The slider crosses the threshold. The stable point disappears.” The figure and model must support that claimed behavior.

## Shape and delivery

Choose the form for the task and hold it. Technical explanations use dependency order; short explanations compress the same logic. A critique gives the strongest target claim, what it sees, what it misses, cases, and a better supported model. A strategy memo may use an operational read, causal diagnosis, concrete verb-led moves, and adaptation risk. An essay may return to a central puzzle under changed conditions; every digression must change understanding of that center. A spiral is optional and cannot override explanatory prerequisites.

Length is earned by cases, history, and breakage points. Do not inflate a short idea into a long essay or force a restated thesis ending. Use bullets for parallel information and actions, prose for reasoning. Headers should identify meaningful section jobs. Avoid generic “Introduction”, “Background”, “Analysis”, “Recommendations”, and “Conclusion” headings. End on a specific implication, sharper question, boundary, next dependency, or practical uncertainty. Do not summarize unless the user requests it.

Return the finished piece unless the user asks for analysis or process. In an audit or requested analysis, show concise findings, evidence, and fixes; do not expose private chain-of-thought or a visible workbench. The article workflow owns its learning contract, figure plan, build, and verification.

## Final pass

Check grounding, reader fit, mechanism, portable handle, cases, boundary, falsifier where needed, and any earned frame's mapping and limits. Check topic continuity, old-to-new links, stress position, close subjects and verbs, paragraph unity, positive concrete statements, and actual logical joins. Apply the complete bans above without weakening them. Cut duplication, unsupported abstractions, decorative analogy, contrast addiction, and summary endings.

If the concept fails, rewrite the reasoning. If the prose obeys every rule yet carries no useful distinction, repair it with evidence, case pressure, a sharper mechanism, or honest uncertainty. The reader should know what to think, notice, predict, decide, or do next, and sentence structure should make the important idea hard to miss.
