# agent-skills

Reusable Claude Code / agent skills, kept in version control so any session —
local, cloud, or cowork — can pull them, and so they survive a machine.

> **prodesigneer** — the brand/identity for the operating model these skills
> embody: a human *director* steering an agent that plays product manager,
> designer, and engineer, with delivery held to a human-verifiable bar. It names
> the philosophy, not any one skill file (the mechanism lives in
> `verified-delivery`).

Each top-level folder is one skill (a `SKILL.md` plus optional `references/` and
`scripts/`), mirroring the `~/.claude/skills/` layout.

## Skills

- **verified-delivery** — a repo-agnostic method for turning feedback into
  tracked, verified, shipped software using GitHub as the single system of record:
  a self-maintaining issue hierarchy (root → cores → epics → issues as native
  sub-issues, plus Lane field + label taxonomy) and a capture → triage → delegate
  → verify loop with two gates — an agent drives the real running product and
  captures screenshot evidence, while the human stays a feedback + spot-check gate
  rather than driving every change.
- **lucide-icon-contribution** — prepares icons for the upstream Lucide library:
  research current prior art, convert raw SVGs into Lucide geometry, validate
  spacing and rendering, lint in Lucide Studio, and write reviewable draft PRs.

## Install

Copy or symlink a skill into your Claude skills directory:

```bash
# symlink one skill (edits here take effect live)
ln -s "$PWD/verified-delivery" ~/.claude/skills/verified-delivery
ln -s "$PWD/lucide-icon-contribution" ~/.claude/skills/lucide-icon-contribution

# or copy
cp -R verified-delivery ~/.claude/skills/
```

Then invoke it in Claude Code as `/verified-delivery`.
