---
name: lucide-icon-contribution
description: Prepare and submit icons to the lucide-icons/lucide open-source repo — convert raw SVGs (Figma/Illustrator exports) into Lucide's house form, hunt near-duplicates and prior art, verify geometry against the design guidelines, lint in Lucide Studio, and open well-argued draft PRs. Use this whenever the user wants to contribute, submit, or prepare icons for Lucide, has SVGs they want to get into Lucide, is working inside a lucide checkout, or asks about Lucide's icon guidelines, naming, spacing, stroke, sub-icon or PR conventions — even if they never say the word "contribute".
---

# Contributing icons to Lucide

Lucide is a curated set, not a dumping ground. Maintainers reject on **duplication**, **inconsistency with existing icons**, and **guideline violations** — in that order. Most of the work is therefore research and argument, not drawing. An icon that reuses the library's own shapes and cites the right precedent gets merged; a beautiful original that ignores them does not.

`references/design-rules.md` holds the measurable rules that rarely drift (canvas, stroke, spacing math, allowed elements). `references/conventions.md` is **referential, not a rulebook**: conventions drift, so it teaches how to *find* the current decision by reading the newest merged icons and open PRs and weighting by recency — never trust a remembered placement or count. Read both before touching geometry, and re-verify any specific value against the repo.

## Before anything: get the repo

Work in a checkout of `lucide-icons/lucide`. The published docs are a summary; the repo is the source of truth. Prefer these over the website:

- `docs/contribute/icon-design-guide.md` — the real design rules
- `.github/pull_request_template.md` — the checklist you must fill
- `icon.schema.json` — what the metadata JSON must contain
- `icons/*.svg` — **the most valuable reference in the project.** When in doubt about any convention, read three merged icons that do the same thing.

## Step 1 — Understand what the icon depicts

Ask the user what each icon *means* in their product, not what it looks like. This single answer drives naming, grouping, and the PR argument. "It's the Figma auto-layout direction control" told us the icons were `flex-direction`, which led to the issue that justified the whole PR.

Naming follows what the icon **depicts**, not its use case (`floppy-disk`, not `save`). Variants are `<group>-<variant>` against a base that **actually exists** — check `ls icons/` before naming. `layout-panel-check` is wrong because there is no `layout-panel`; `layout-panel-left-check` is right because `layout-panel-left` exists.

## Step 2 — Convert to Lucide form

Every icon is exactly this envelope:

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- elements -->
</svg>
```

Design-tool exports need real conversion, not just a header swap:

- **`stroke="black"` on each element → `stroke="currentColor"` on the root.** Per-element strokes are forbidden.
- **Rounded-rect paths → `<rect rx>`.** A Figma export writes `M9 3H4C3.44772 3 3 3.44772 3 4V9…` — that `3.44772` is a bezier *approximation* of a 1px corner. `<rect width="7" height="7" x="3" y="3" rx="1" />` is exact, shorter, and lets a reviewer verify the grid at a glance. Since your PR argument is usually "these sit on the shared grid", making that legible is doing the reviewer's job for them.
- Allowed elements only, with no attributes beyond sizing/spacing: `path d`, `line x1 x2`, `polygon points`, `polyline points`, `circle cx cy r`, `ellipse cx cy rx ry`, `rect x y width height rx`. **No transforms, filters, fills, explicit strokes, or `<use>`.**

Use a shape primitive when the shape *is* a primitive; use `path` for everything else. There's no tradeoff to weigh — transforms are the only thing `path` buys you, and transforms are banned.

## Step 3 — Prior art (do this before drawing anything)

Skipping this wastes all downstream work. Three searches, all of which have changed real decisions:

```bash
ls icons/ lab/ | grep -i <concept>                              # near-duplicates (search lab/ too — it holds experimental icons; a match there means your PR is a promotion, not a new icon)
gh search issues --repo lucide-icons/lucide "<concept>" --limit 10
gh search prs --repo lucide-icons/lucide "<concept>" --state open --limit 10
```

Read the **actual SVG geometry** of anything close — filenames lie. Ask: would a maintainer call this a duplicate? Different element *count* and silhouette usually means no; a 1–2px nudge of an existing icon means yes.

**If your icon is a novel *combination* of shapes** (not a variant of one base), find a real application or notation that uses it before proposing — maintainers challenge unrecognised combinations on meaning, not geometry (this sank `diamond-circle`: no established meaning for a circle-in-a-diamond). Name the app that uses it, or expect to defend it as pure family-completion. A closed issue can be your best asset. One where a maintainer says a category is *missing* is a direct mandate — cite it verbatim.

Check **open PRs** with particular care. One may be actively redefining the convention you're about to follow; another may already place a similar glyph differently, so that if both land they'll disagree. Both have happened. Read them before committing to geometry, and raise the conflict in your PR rather than picking silently.

## Step 4 — Geometry

Rules are in `references/design-rules.md`. The two that catch people:

**Pixel alignment.** A 2px stroke centred on an integer puts its edges on integers and renders sharp. Centred on `x.5`, it straddles pixels and blurs. So rails and glyph centres belong on integers. A 7px-wide cell (14→21) has its centre at 17.5, so a symmetric glyph *cannot* be both cell-centred and sharp — pick sharp, and follow the convention for where it sits.

**2px between distinct elements** is measured at the *closest approach*, which is often a diagonal, not the orthogonal gap. Two 7×7 rects offset diagonally can sit 2px apart horizontally and vertically while their rounded corners pass within 1.66px. Compute it: distance between corner arc centres, minus both radii, minus both stroke half-widths.

`scripts/lucide-check.mjs` does this for you — run it on any icon before you argue about it:

```bash
node scripts/lucide-check.mjs path/to/icon.svg
```

It reports the bounding box, padding, non-integer coordinates, and pairwise gaps between rects. It doesn't replace Studio.

## Step 5 — Render it and look at it

Do this before the linter, and never skip it because the numbers came out clean. Geometry that satisfies every rule can still fail to *read*, and that failure is invisible in path data.

Render the icon at **24px and 16px** next to the icons it will sit beside, and look:

- **Does it read as the thing it depicts?** Strokes converging in a small cell merge into shapes you didn't draw. An arrow can collapse into a checkmark; a chevron plus a hook can fuse into a solid wedge. At 16px there is very little room for an idea.
- **Does it collide with an existing icon's read?** Not "is it a duplicate" — does it *look like* one at a glance? Squares plus a downward tick reads as `grid-2x2-check` no matter what you meant.
- **Blur test** (the guide's own): blur your icon and `square`/`circle` together. Yours shouldn't read darker or busier.

If the icon doesn't survive this, no amount of grid alignment saves it — rework the gesture, and prefer a gesture the library already uses (`text-wrap`'s wrap arrow, `decimals-arrow-right`'s chevron) over inventing one.

Rendering is cheap: an HTML page with the SVG inlined at several sizes, opened in a browser. Do it for every icon.

## Step 6 — Lint in Lucide Studio (required)

Studio has a linter that exists nowhere else — not in the repo scripts, not in the render API. It has caught things pure geometry checks miss. Run **every** icon through it.

Load the icon straight from a URL — no typing, no file dialogs:

```
https://studio.lucide.dev/edit?value=<encodeURIComponent(svg)>&name=<icon-name>
```

Then read the annotations out of the DOM rather than squinting at a screenshot:

```js
Array.from(document.querySelectorAll('text, title'))
  .map(e => e.textContent.trim()).filter(Boolean).join(' | ')
```

Two signals matter:

- **Text hints** like `small check (consider increasing the size to 12x10)`. Neutral labels (`plus 10x10`, `check 12x10`) mean it recognised a standard sub-icon and is happy.
- **Red diagonal hatching** = two elements closer than the guideline. The hatch `<pattern>` is *defined in every X-ray*, including compliant merged icons — so grepping the SVG for `stroke="red"` proves nothing. It only **renders** where there's a real violation. Look at the picture.

Treat hints as informative, not binding — they can be context-blind. Studio flags the 10×8 corner check as "small", but 10×8 is correct in a corner (see `references/conventions.md`). When you override a hint, say so in the PR and explain why; that reads as diligence, not defiance.

If Chrome isn't available, say the lint pass was skipped rather than pretending it passed.

## Step 7 — Validate in the repo

```bash
node ./scripts/optimizeStagedSvgs.mts   # after git add — canonicalises staged SVGs only
pnpm lint:json:icons                     # ajv against icon.schema.json
node ./scripts/checkIconsAndCategories.mts
```

If the optimizer leaves your SVG byte-identical, it's already canonical — that's the signal you want.

**Never run `pnpm optimize`.** It rewrites *every* icon, and on any SVGO/Node version drift it silently reformats hundreds of unrelated files into your diff. `optimizeStagedSvgs.mts` touches only what you staged. If you already ran it, revert the collateral before committing.

## Step 8 — Metadata

Every `icons/foo.svg` needs `icons/foo.json`. `$schema`, `contributors`, `categories`, `tags`, `use-cases` are all required; `ajv` rejects unknown keys and invalid categories.

```json
{
  "$schema": "../icon.schema.json",
  "contributors": ["github-username"],
  "use-cases": [],
  "tags": ["foo", "bar"],
  "categories": ["layout"]
}
```

Tags are search terms — include what users would type, not just what the icon depicts.

## Step 9 — Group into PRs

CONTRIBUTING is explicit: *"don't submit multiple icons in one PR that have nothing to do with each other."* One coherent group per PR.

Grouping also manages risk. A strong icon bundled with a speculative one can stall behind it. If one icon in a set is materially weaker, split it out so a debate about it can't block the rest — and cross-reference the PRs so reviewers see the whole picture.

## Step 10 — Write the PR

Fill `.github/pull_request_template.md` properly. Title is semantic-lint'd and **requires a scope**: `feat(icons): add foo and bar`.

- **Use cases**: at least two per icon, real and concrete. The template explicitly rejects *"it's a car icon"*.
- **Author/credits**: pick one box honestly. Rebuilding from Lucide's own shapes after looking at another product's icon is your own creation; tracing someone's vector data is not, and needs a source and license. Never tick this on the user's behalf without asking — it's their attestation.
- **Alternatives**: this section is leverage. If you rejected a design on a rule, show it and say so. Inviting a maintainer into a real tradeoff reads far better than silently shipping the safe option.
- Don't hand-screenshot the submitted icons — CI auto-posts rendered previews.

Embed live, clickable-into-Studio previews with `scripts/studio-embed.mjs` (this is Studio's Share output, reproduced exactly — no browser needed):

```bash
node scripts/studio-embed.mjs icons/foo.svg                    # from a file
node scripts/studio-embed.mjs --name alt-a --svg "<svg…>"      # from a literal, for alternatives
```

A comparison table of embeds is the best way to present alternatives: each cell renders Lucide's own X-ray and links into Studio, so a maintainer can open a variant and edit it. That beats a flat screenshot, and beats uploading images.

Keep the prose tight. State the tradeoff and stop; don't argue the same point three ways.

## Step 11 — Open as draft

```bash
gh repo fork lucide-icons/lucide --clone=false
git push fork <branch>
gh pr create --repo lucide-icons/lucide --draft --base main \
  --head <user>:<branch> --title "feat(icons): …" --body-file body.md
```

**Always `--draft`, and always ask before `gh pr ready`.** These are public, under the user's name, and ping maintainers. Opening a draft is recoverable; marking it ready is a judgment call that belongs to the user.

If PRs cross-reference each other, open them in dependency order and patch the numbers in afterwards with `gh pr edit`.

## Traps

- `pnpm optimize` → hundreds of unrelated files reformatted. Use `optimizeStagedSvgs.mts`.
- `pnpm install --ignore-scripts` skips husky, so commits fail on a missing hook. Run the checks yourself and use `--no-verify` rather than fighting it.
- Half-pixel coordinates blur 2px strokes. Never ship `x.5` on a stroke centre.
- `grep -c` on a one-line SVG counts *lines*, not occurrences — it returns 1 for everything. Use `grep -o … | wc -l`.
- Don't infer meaning from a rendered image and then reason about it via `grep`. If it's visual, look at it. Reasoning about the red hatch from grep produced two confidently wrong conclusions in a row.
