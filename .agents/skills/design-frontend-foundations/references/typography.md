# Typography choices and implementation

Read when choosing a font, defining type tokens, or reviewing hierarchy. Use the product's established typography when appropriate. For a new identity, make a deliberate choice that fits the voice and reading task; system fonts can meet operational or performance needs.

## Choose for voice and actual use

| Voice | Candidate direction | Examples from the original guide |
|---|---|---|
| Institutional | Transitional serif or sturdy sans | Freight, Söhne, Graphik |
| Warm | Humanist or rounded sans | GT Walsheim, Nunito, Source Sans |
| Technical | Precise sans or monospace accents | JetBrains Mono, IBM Plex, Geist |
| Editorial | Serif with distinct forms | Lora, Spectral, Newsreader |
| Playful or bold | Display face | Bricolage Grotesque, Fraunces, Archivo Black |

Check the weights needed by the actual hierarchy, language and symbol coverage, and rendering at the intended sizes. Regular and Bold are a useful starting pair; additional weights should serve a role. Review real labels, long names, numerals, and body text instead of only a specimen headline.

Keep display faces for display roles, often above 24px; test before using them for small or continuous text. A readable body face must handle longer passages and dense controls. Make hierarchy visible through size, weight, spacing, and role. Dramatic Bold/Light contrast is an option when legible, not a requirement for every dashboard.

### Optional font and pairing examples

These retain the original selection ideas as candidates, without requiring a new download or asserting that every family has the same license.

| Role | Candidates |
|---|---|
| Sans | Geist, Bricolage Grotesque, Instrument Sans, Satoshi, General Sans, Plus Jakarta Sans, Outfit |
| Serif | Fraunces, Lora, Spectral, Newsreader, Libre Baskerville |
| Monospace | JetBrains Mono, Geist Mono, IBM Plex Mono, Fira Code |
| Display/accent | Playfair Display, Archivo Black, DM Serif Display, Bebas Neue |

For pairing, seek meaningful contrast, such as serif/sans or geometric/humanist, and compatible x-heights. Two similar sans families can add loading cost without improving hierarchy. A single family can use size, weight, and case to separate roles.

| Display | Body | Direction |
|---|---|---|
| Fraunces | Outfit | Editorial with a contemporary body |
| Playfair Display | Source Sans 3 | Classic editorial |
| Bricolage Grotesque | Instrument Sans | Expressive heading, restrained body |
| DM Serif Display | DM Sans | Related serif/sans |
| Bebas Neue | Plus Jakarta Sans | Strong display contrast |
| Geist | Geist | Single-family technical interface |
| Space Grotesk | Space Mono | Sans with monospace accents |

Possible sources include [Google Fonts](https://fonts.google.com), [Fontsource](https://fontsource.org), [Bunny Fonts](https://fonts.bunny.net), and [Font Squirrel](https://www.fontsquirrel.com). Check the chosen family's license and delivery requirements. Use local or existing assets when they already meet the task.

## Scale, line height, and measure

Choose a ratio suited to density, then map steps to semantic roles. Skip steps when stronger hierarchy is needed. The original contrast example, 16 → 20 → 31 → 49, selects wider intervals from an approximately 1.25 scale. A scale does not make every generated small size appropriate for readable UI.

| Ratio | Conventional name | Useful starting context |
|---|---|---|
| 1.125 | Major second | Dense interfaces |
| 1.200 | Minor third | Moderate hierarchy |
| 1.250 | Major third | General-purpose hierarchy |
| 1.333 | Perfect fourth | Editorial contrast |
| 1.500 | Perfect fifth | Display-heavy contrast |
| 1.618 | Golden ratio | Large contrasts used selectively |

```css
:root {
  --font-size-base: 1rem;
  --type-ratio: 1.25;
  --font-size-body: var(--font-size-base);
  --font-size-section: calc(var(--font-size-base) * var(--type-ratio));
  --font-size-title: calc(var(--font-size-section) * var(--type-ratio) * var(--type-ratio));
  --font-size-hero: clamp(2.5rem, 5vw + 1rem, 5rem);
  --line-height-heading: 1.1;
  --line-height-body: 1.6;
  --line-height-control: 1.25;
  --measure-reading: 65ch;
  --paragraph-gap: 1.5em;
  --tracking-display: -0.02em;
  --tracking-caps: 0.05em;
  --tracking-small: 0.01em;
}

.report-prose {
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  max-inline-size: var(--measure-reading);
}

.report-prose__paragraph + .report-prose__paragraph {
  margin-block-start: var(--paragraph-gap);
}
```

Starting line-height ranges: headings 1.0–1.2, body 1.5–1.7, controls 1.2–1.4. Larger text can often be tighter; smaller text usually needs more space. Check wrapping, localization, and zoom before retaining a tight value.

For sustained reading, start with a 45–75-character measure and review the actual text. `ch` measures the font's zero glyph width, so it approximates character count. Keep numeric tables and short operational labels sized for their own roles.

Large display text may benefit from slightly tighter tracking; capitals or small labels may benefit from slightly looser tracking. The tokens above are starting values to validate with the chosen font. Use one deliberate paragraph-spacing rule so the last paragraph does not add unwanted trailing space.

## Font delivery and numerals

Load the weights and glyphs needed. A variable font can cover multiple weights in one resource; use a subset when appropriate. Review font swap, layout movement, and fallback metrics alongside loading cost.

```css
@font-face {
  font-family: 'Product Sans';
  src: url('/fonts/product-sans.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-family-body: 'Product Sans', 'Segoe UI', Arial, sans-serif;
  --font-family-code: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

.experiment-table__value {
  font-variant-numeric: tabular-nums lining-nums;
}
```

The face example assumes a supplied variable font with that weight range. Match a static face's declared weight to its actual file. Use fallbacks with compatible metrics and character: geometric sans may suit Helvetica/Arial fallbacks; humanist sans may suit Segoe UI; serif may suit Georgia; monospace may suit Consolas. The primary family remains a context-specific choice.

For comparing aligned metrics, tabular lining numerals prevent digit widths from shifting columns. Use old-style numerals for prose only when appropriate, and genuine small caps when the font supports them. Kerning, ligatures, and contextual alternates can help supported fonts; inspect real output before overriding defaults through `font-feature-settings`.

## Review the hierarchy

Check the chosen font in the actual context, scale and line-height roles, controlled reading measure, fallback behavior, and number alignment. If everything is bold, decide which roles need emphasis and reduce the competition. If neighboring roles look alike, increase the relevant size/weight/spacing distinction. Keep expressive display lettering away from long body passages. The result should show intentional choices while supporting reading and comparison.
