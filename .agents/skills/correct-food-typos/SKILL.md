---
name: correct-food-typos
description: >-
  Rewrite rough or mistyped food lines into exact names from
  samples/definitions-food.json so they can be pasted into a day food column.
  Use when the user asks to fix typos, correct food names, clean up a meal
  log, or turn shorthand like "2 cups white rice" or "Doritos md bag" into
  food-column lines.
---

# Correct food typos

Turn shorthand into lines that match a food `name` in `samples/definitions-food.json`.

## Before rewriting

1. Read [MEMORY.md](MEMORY.md). Apply those defaults when the user names a food without a count or size.
2. Look up the exact `name` strings. Do not invent a name that is not in the file.

## Rewrite rules

- One food per line. Split "shrimp and eggs" into two lines.
- Keep the definition's wording. Put the user's extra amount in a trailing multiplier: `* 2`, `* 3`, `* 1/2`.
- If a definition already is that portion (`Lamb 1/2 cup …`), use that name. Do not also add `* 1/2`.
- If the definition is one unit (`Rice - White 1 cup cooked`) and they asked for two, write `Rice - White 1 cup cooked * 2`.
- `md` is medium, `sm` is small, `lg` is large.
- Omit `* 1`.
- Bare "shrimp" is `Shrimp sm x 1 * 8`. The `* 8` is the multiplier. Do not look for an 8-piece shrimp name.
- A `*` or `**` at the end of a food name is part of that name. Keep it. Bare "milk" is `Lactaid whole milk ¾ cup**`. Bare "cereas" or "Cheerios" is `Cereal - Cheerios 1½ cups**`.

## Reply

Return a fenced block of lines they can paste. After the block, one short note only when a line was split or a MEMORY.md default was used.

## When they state a new usual serving

If they say that a bare word usually means a specific food ("if I just say eggs, it's usually …"), add that line to MEMORY.md. Keep their wording. Also write the exact `name` (and `* N` if needed) to paste.
