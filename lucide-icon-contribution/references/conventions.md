# Discovering Lucide's conventions (don't trust remembered values)

Conventions drift. Specific glyph placements, which idiom is "preferred", even naming patterns change as the library grows and maintainers refactor. **Anything in this file is a dated hypothesis, not a rule** — verify it against the current repo before relying on it, and weight recent additions more than old ones.

The method matters more than any single fact below:

1. **Find the real decision, don't recall it.** To learn how something is done, read the 3–5 most-recently-*added* icons that do the same thing (`git log --diff-filter=A --format='%ad %s' --date=short -- icons/<pattern>*.svg | head`), plus any open PR touching that area. What shipped last month beats what a doc says.
2. **Weight by recency.** If old and new icons disagree, the newer ones are the live convention — a maintainer chose them more recently. A "dominant" count across all history can be misleading if the trend has moved.
3. **Search by shape, not spelling.** Grep for the geometry, case-insensitively (`grep -il`). A case-sensitive search for `H.01` misses the 135 icons that write `h.01`; searching the wrong spelling produces a confident, wrong "no precedent."
4. **Verify geometry by rendering, then looking.** Arithmetic and greps on the X-ray have both misled here. When a gap is tight, render it and compare against a known-good and known-bad case. Trust the picture.
5. **Search `lab/` as well as `icons/`.** The lab holds experimental icons. A "new" icon may already exist there (this happened: `square-text` == `lab/text-square`). If it does, the PR is a promotion (remove from lab, merge metadata, credit the lab author).
6. **For a novel shape *combination*, find a real application first.** Reusing shapes is encouraged, but a combination no established tool uses ("what does a circle-in-a-diamond mean?") will be challenged on grounds of meaning, not geometry. Name the app/notation that uses it before proposing, or expect to justify it as pure family-completion.

## Lookup recipes (with last-known findings, dated)

Treat the findings as a starting point — re-run the lookup.

**Corner sub-icons (`-plus` / `-check` / `-x`).** Lookup: read the newest few `*-plus.svg` by add-date and compare glyph centres.
- Last checked ~2026-07: two placements both shipped — (19,19) running the bbox out to 22 (`mail-plus`, `grid-2x2-plus`, `calendar-plus`, `save-plus`), and (18,18) staying inside 3–21 with even padding (`sticky-note-*`, `house-plus`). I once called (19,19) "settled" and was wrong — `sticky-note-plus` disproves it. Decide by what the *newest* siblings and the base icon's own geometry do, and offer the alternative rather than asserting one.

**Which family a variant joins.** Lookup: `ls icons/ | grep -i <concept>` and read geometry. Two incompatible `-plus` families have existed (inner-glyph like `square-plus`; corner sub-icon like `calendar-plus`). Check which one the base icon's neighbours use; the corner form has been the direction of travel, but confirm.

**Dots.** Lookup: `grep -il 'h\.01' icons/*.svg | wc -l` vs `grep -il 'r="1"' icons/*.svg | wc -l`, and check the newest of each.
- Last checked: `M12 12h.01` (zero-length line, 2px dot, ~135 icons, Studio-clean) is the common one; `<circle r="1">` (4px dot, ~33 icons) trips a Studio hint the library itself ignores (`dot.svg` is that circle). `r="1"` is the only way to get a *solid* disc; larger radii ring.

**Frame + dots = `dice`.** An 18×18 `rx=2` frame with `h.01` dots on `{8,12,16}` is the dice family. Check `dice-1..6` before proposing any framed-dot icon; say so in the PR if you reuse the vocabulary.

**Sub-glyph sizing.** Lookup: compare your glyph's unit-size to the same glyph in recent siblings; Studio labels it (`plus 10x10`, `check 12x10`). Roles differ — a check as a container's main element vs a corner sub-icon have shipped at different sizes. Verify against role-matched neighbours, not a remembered number.

## Stable-ish references (still verify, but these move slowly)

- **X-ray render API**: `https://lucide.dev/api/gh-icon/<name>/<base64-of-svg>.svg`; also `/stroke-width/{1,2,3}/…`, `/dpi/<name>/{16,24,32,48}/…`, `/diff/…`, `/symmetry/…`. Encodes any SVG in the URL — not just committed ones. The API does **not** carry Studio's lint hints (those are client-side JS; linting needs a browser).
- **Studio**: preload with `?value=<encodeURIComponent(svg)>&name=<n>`. Share → "Copy preview embed code" gives the canonical embed (`scripts/studio-embed.mjs` reproduces it offline). Red diagonal hatch in the X-ray = elements under the gap minimum; the hatch `<pattern>` is *defined* in every X-ray, so only a *rendered* hatch counts — look, don't grep. Textual `warn` being empty does NOT prove a gap is legal (it missed a real circle/diamond violation); confirm tight gaps visually against a known-bad render.
- **CI**: a bot auto-posts rendered previews on icon PRs (don't hand-screenshot the added icons; do embed *alternatives*). PR titles are semantic-linted with a required scope (`feat(icons): …`). A separate bot suggests tags/categories/use-cases as `suggestion` blocks — curate, don't blind-accept, but do fill empty use-cases (maintainers ask for them).
- **Co-author / credit**: `Co-Authored-By: Name <ID+username@users.noreply.github.com>` — the numeric GitHub ID prefix is required or it won't link. Also add the person to the icon JSON `contributors` array (Lucide's own credit, shown on lucide.dev). When promoting a lab icon, credit the original lab author.
- **People**: maintainer reviews mostly come from **@karsa-mistmere** (built Lucide Studio); also active **@ericfennis**, **@jguddas**, **@danielbayley**. Respond fast, apply exact suggestions, own mistakes, and drop gracefully when they're right — that's what turned reviews collaborative here.

## Meta-lessons (what actually cost time)

- Dismissing correct arithmetic because a low-res render "looked clean" — wrong twice on circle/diamond spacing. Look properly, at zoom, against a known-bad.
- A case-sensitive grep producing a false "no precedent."
- Asserting a placement was "settled" from an all-history count instead of checking the newest siblings.
- Not searching `lab/` for an existing version.
- Proposing a shape combination with no real-world meaning and inventing use-cases for it.
