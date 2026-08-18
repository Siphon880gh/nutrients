# TODO-UX loop

Dynamic loop: implement the next unchecked item in [TODO-UX.md](../../TODO-UX.md), verify automatically, mark done, continue until blocked.

## Each iteration

1. Read [TODO-UX.md](../../TODO-UX.md) — pick the highest-priority unchecked item (P0 → P1 → P2 → P3).
2. Implement using the skill named in that item when present (`/harden`, `/clarify`, etc.).
3. Run verification: `node test/ux-loop-verify.mjs` from repo root.
4. If verify passes: check the box in TODO-UX.md (`- [ ]` → `- [x]`).
5. If verify fails: fix and re-run (max 3 attempts). On 4th failure, **STOP** — report failure.
6. If implementation needs a product decision or manual browser QA you cannot automate, **STOP** — list what needs human verification.

## Stop conditions (only these)

- Verification fails after 3 fix attempts on the same item.
- Item requires human verification (explicit UX sign-off, ambiguous scope from TODO questions).
- All checkboxes in TODO-UX.md are checked.

## Do not stop for

- Passing verification on an item.
- Running out of items in one session (continue until a stop condition).

## Verification command

```bash
node test/ux-loop-verify.mjs
```

Optional strict DOM pass (static server required):

```bash
node test/ux-loop-verify.mjs --strict
```
