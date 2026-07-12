# SKILLS.md

How agents discover and present skills for this repo.

## Purpose

When the user asks about skills, wants a skill inventory, or a task may match a skill:

1. Read **project-local** skill locations first.
2. Summarize what is available there (name + short description).
3. Offer to also list **global / home** skills — those may require permission to read outside the workspace.

Do not dump full skill bodies unless the user picks one to run or asks for detail.

## Project-local roots (always check)

Scan each path that exists under the repo root. Order matters: prefer project skills over global ones with the same name.

| Path | Typical format |
|------|----------------|
| `.agents/skills/` | `*.json` skill files and/or `*/SKILL.md` folders |
| `.cursor/skills/` | `*/SKILL.md` folders |
| `.claude/skills/` | `*/SKILL.md` folders |
| `.codex/skills/` | `*/SKILL.md` folders (if present) |
| `skills/` | Legacy / alternate project skills (if present) |

### How to summarize a skill

For each entry found:

1. **JSON skill** (e.g. `.agents/skills/my-workflow.json`):
   - Use `name` and `description` (fallback: `purpose` if description missing).
2. **Folder skill** (e.g. `.cursor/skills/foo/SKILL.md`):
   - Read YAML frontmatter `name` and `description` from `SKILL.md`.
3. Skip junk: `.DS_Store`, README-only stubs, or files that only say skills were moved elsewhere.

Present a compact list:

```text
Project skills
- name — one-line description
- …
```

If a directory is missing, skip it silently (do not error).

## After the local summary

Ask the user whether they also want a **global** inventory. Example prompt:

> Want me to also list global skills under `~/.agents/skills/`, `~/.cursor/skills/`, `~/.claude/skills/`, etc.? That reads files outside this project and may need your permission.

Only proceed to global roots if they say yes.

## Global roots (optional — ask first)

When approved, scan home-level skill roots that exist:

| Path | Notes |
|------|--------|
| `~/.agents/skills/` | Agnostic / shared agent skills (`*/SKILL.md`) |
| `~/.cursor/skills/` | Cursor user skills |
| `~/.claude/skills/` | Claude Code user skills |
| `~/.codex/skills/` | Codex user skills (if present) |

Also note Cursor’s built-in skill cache may live under `~/.cursor/skills-cursor/` — treat that as **tooling-owned**, not project skills; only mention it if the user asks about built-in Cursor skills.

Summarize the same way (name + description). If permission is denied or a path is unreadable, say so and continue with what you could read.

## When to load a full skill

- User names a skill, or
- The task clearly matches a skill `description`, or
- User asks to run / follow a skill after seeing the summary.

Then open that skill’s file (JSON or `SKILL.md`) and follow its workflow.

## Conflict / precedence

1. Project `.agents/skills/` and other project roots above.
2. Explicitly user-selected global skill.
3. Otherwise prefer the project skill when names collide.
