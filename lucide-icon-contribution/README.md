# lucide-icon-contribution

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill for contributing icons to [lucide-icons/lucide](https://github.com/lucide-icons/lucide).

Contributing to a curated icon set is mostly research and rationale, not drawing. This skill encodes that: it hunts prior art (including the `lab/` folder and stalled PRs), converts design-tool exports into Lucide's house form, verifies geometry and lints in Lucide Studio, and helps write well-argued PRs.

## What's here

- `SKILL.md` — the workflow, step by step.
- `references/design-rules.md` — the measurable rules that rarely drift (canvas, stroke, spacing math).
- `references/conventions.md` — **referential, not a rulebook.** Conventions drift, so this teaches how to *find* the current decision by reading the newest merged icons and open PRs, weighting by recency. Every specific value is a dated hypothesis you re-verify.
- `scripts/lucide-check.mjs` — geometry sanity checks (bbox, padding, off-grid coords, pairwise gaps).
- `scripts/studio-embed.mjs` — reproduces Lucide Studio's shareable preview embed offline.

## Install

Drop the folder into your Claude Code skills directory:

```bash
git clone https://github.com/samuelalake/lucide-icon-contribution.git ~/.claude/skills/lucide-icon-contribution
```

Then ask Claude Code to contribute an icon to Lucide.

## Provenance

Built while contributing a batch of icons to Lucide. The lessons behind it, and what worked, are written up here: [article link].

Not affiliated with the Lucide project.
