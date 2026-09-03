# agent-skills

Reusable Claude Code / agent skills, kept in version control so any session —
local, cloud, or cowork — can pull them, and so they survive a machine.

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

## Install

Copy or symlink a skill into your Claude skills directory:

```bash
# symlink (edits here take effect live)
ln -s "$PWD/verified-delivery" ~/.claude/skills/verified-delivery

# or copy
cp -R verified-delivery ~/.claude/skills/
```

Then invoke it in Claude Code as `/verified-delivery`.
