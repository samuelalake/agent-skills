# Lucide design rules (measurable)

Distilled from `docs/contribute/icon-design-guide.md` in the repo. That file is the source of truth — read it if this disagrees.

## Canvas and stroke

| Rule | Value |
| --- | --- |
| Canvas | 24 × 24 |
| Minimum padding | 1px (most icons use 2px) |
| Stroke width | 2px, centred |
| Line caps | round |
| Line joins | round |
| Precision | 3 decimal points max |

## Corner radius

- **2px** for shapes **≥ 8px**
- **1px** for shapes **< 8px**

The ubiquitous 7×7 block therefore takes `rx="1"`. A 7×18 panel also takes `rx="1"` — `layout-panel-left` sets that precedent, so read the neighbours rather than reasoning from the "≥8px" wording alone.

## Spacing — the one people get wrong

Distinct elements need **2px between each other**. This is measured at the **closest approach**, which for diagonal neighbours is not the orthogonal gap.

For two rounded rects passing diagonally:

```
gap = distance(cornerArcCentreA, cornerArcCentreB) − rA − rB − 1 − 1
                                                    │    │    └── stroke half-widths
                                                    └────┴─────── corner radii
```

Worked example — 7×7 `rx=1` rects at (14,5) and (5,14):
- A spans x14–21, y5–12; its bottom-left arc centre is (15, 11)
- B spans x5–12, y14–21; its top-right arc centre is (11, 15)
- distance = √(4² + 4²) = 5.657
- 5.657 − 1 − 1 − 1 − 1 = **1.657px** → violates the rule

…even though the same pair sits a legal 2px apart measured orthogonally. Always compute the diagonal.

## Pixel perfection

A 2px stroke centred on an integer has its edges on integers → renders sharp at low DPI. Centred on `x.5` → edges on half-pixels → blurs.

Consequence: a cell spanning 14→21 has centre 17.5, so a symmetric glyph cannot be both centred in it *and* sharp. Choose sharp and follow the placement convention.

## Optical rules (judgement, not arithmetic)

- Similar optical volume to `circle` and `square`. Blur test: your icon shouldn't read darker than the base shape.
- Visually centred by centre of gravity; symmetrical icons always geometrically centred.
- Similar visual density and level of detail — abstract dense elements away.
- Continuous curves join smoothly (arcs or quadratics; mirrored control points on cubics).

## Shared shapes (rule 14)

> "You should try to create consistent groups and variants, reuse and try to create uniformity."

This ranks *below* the measurable rules but explains most rejections. Reusing an existing icon's exact geometry is a feature, not plagiarism — if your two blocks are byte-identical to `layout-list`'s, that's the library working as intended. Never treat shape reuse as a problem to solve.

## Naming

1. lower-kebab-case
2. International English (`color`, not `colour`)
3. Named for what it **depicts**, not its use case (`floppy-disk` not `save`; `circle-slash` not `ban`)
4. Group members are `<group>-<variant>` — the group must exist as a real icon
5. Alternates describe what makes them unique, never numbered (`send-horizontal`, not `send-2`)
6. No numerals unless the number is depicted
7. Multiple elements of different sizes: **decreasing size order** (`circle-person` if the circle is bigger)
8. Roughly equal sizes: front-to-back, else English reading order (top→bottom, left→right)
9. Variation of an element: `[element]-[modifier]` (`circle-dashed`, not `dashed-circle`)

Note the tension: rule 3 says name what you depict, yet the whole `align-horizontal-justify-start` / `stretch-horizontal` family is named in CSS vocabulary. Precedent within a family can outweigh the general rule — but flag the ambiguity in the PR and invite a rename rather than quietly hoping.

## Allowed elements

`path d` · `line x1 x2` · `polygon points` · `polyline points` · `circle cx cy r` · `ellipse cx cy rx ry` · `rect x y width height rx`

No transforms, filters, fills, explicit strokes. Never `<use>` — element IDs can't be guaranteed unique once embedded in a host document.
