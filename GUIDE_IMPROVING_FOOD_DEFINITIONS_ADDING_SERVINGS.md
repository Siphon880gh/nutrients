# Improving Food Definitions in `definitions-food.json`

Use this guide when you are **fixing or upgrading** an existing entry in `samples/definitions-food.json` — not when you are adding a brand-new food from scratch. For brand-new foods, start with `GUIDE_ADDING_FOOD.md`.

The app has **no separate serving field**. Every number on a food object is per whatever portion is written into `name`. Improving a definition usually means making that portion obvious, then making the nutrient numbers match it.

---

## 1. What “improved” means

An improved food entry should:

1. **Name the serving in `name`** — e.g. `1 cup`, `1 tbsp`, `1 oz`, `1 stalk`, `1 bar`, `12 fl oz`.
2. **Keep every nutrient amount scaled to that same serving**.
3. **Omit guesses** — leave a key out (or leave a whole `micros` / `longevity` / `carbQuality` object out) if you cannot source it.
4. **Follow the shared-key rule** — numeric amount in `micros`, matching key set to `true` in `longevity` when both panels share it (see `GUIDE_ADDING_FOOD.md` §4).

Good names:

- `"Parsley 1 cup chopped"`
- `"Macadamia nuts 1 oz (about 10-12 nuts)"`
- `"Celery stalk"` → better as `"Celery 1 stalk"` if that is what the numbers assume

Bad names (portion unclear):

- `"Guacamole"` — is that 2 tbsp? ¼ cup? a whole container?
- `"Cereal - Raisin Bran"` — how many cups / grams?
- `"Premier Protein Shake"` — whole bottle? how many fl oz?

---

## 2. Serving-size checklist

When you open an entry to improve it, ask:

| Question | If no… |
| -------- | ------ |
| Does `name` include a measurable unit or count? | Rename to bake the unit in |
| Would a stranger know what the numbers mean? | Add the unit (and a parenthetical if helpful) |
| Do the macros/micros already match that unit? | Rescale from a trusted source for the new portion |
| Is the portion something you actually log? | Prefer a real-world serving over a lab-only amount |

Common units to prefer:

- Volume: `cup`, `tbsp`, `tsp`, `fl oz`
- Weight: `oz`, `g`
- Count: `1 stalk`, `1 medium`, `1 bar`, `1 can`, `2 bites`
- Labeled product: use the label serving (`1 bottle (11.5 fl oz)`, `1 bar (50 g)`)

Size words like `sm` / `md` / `lg` / `whole` / `half` count as servings when they clearly mean one item (fruit, potato, smoothie size). Still prefer an explicit unit when you can (`Apple 1 medium`, `Avocado half`).

---

## 3. How to improve one food (workflow)

1. Find the object in `samples/definitions-food.json` by its current `name`.
2. Decide the serving you want (realistic, easy to measure).
3. Rename to `Food … <serving>` — keep any useful disambiguator (`with skin`, brand, flavor).
4. Refresh `protein` / `carbs` / `fats` / `micros` / `longevity` / `carbQuality` for **that** serving only.
5. Validate JSON:

```bash
node -e "JSON.parse(require('fs').readFileSync('samples/definitions-food.json','utf8')); console.log('valid JSON')"
```

### Cursor / agent prompt

```
[FOOD IMPROVE] - <current name> - Rename so the serving unit is in the name (e.g. 1 cup / 1 tbsp / 1 oz), and rescale all nutrients to that one serving. Follow GUIDE_ADDING_FOOD.md for units and shared micros/longevity keys.
```

Example:

```
[FOOD IMPROVE] - Guacamole - Rename to include the serving (use 2 tbsp if that matches the current numbers, otherwise rescale), keep one clear unit in the name.
```

---

## 4. Foods currently missing a clear serving unit

These names do **not** spell out a measurable portion (no `1 cup`, `1 oz`, count, bottle size, etc.). Mention them here so they can be fixed one at a time — do not invent a unit without checking what the existing numbers assume.

| Current `name` | Likely fix direction |
| -------------- | -------------------- |
| `Trifecta plant based burrito` | Add `1 burrito` (or labeled weight) |
| `Trifecta Brisket Burrito` | Add `1 burrito` |
| `Trifecta Turkey Taco Bowl` | Add `1 bowl` / labeled weight |
| `Trifecta Salmon Rice and Green Beans` | Add `1 meal` / labeled weight |
| `Trifecta salmon` | Add weight or `1 serving` from label |
| `Fruit - Kiwi Green with skin` / `without skin` | Add `1 medium` (or grams) |
| `Fruit - Kiwi Golden with skin` / `without skin` | Add `1 medium` (or grams) |
| `Fruit - Banana with skin` / `without skin` | Add `1 medium` (or grams) |
| `Fruit - Peach with skin` / `without skin` | Add `1 medium` (or grams) |
| `Fruit - Plum with skin` / `without skin` | Add `1 medium` (or grams) |
| `Cereal -  Raisin Bran` | Add cup or grams (label serving) |
| `Cereal -  Grape-Nuts` | Add cup or grams (label serving) |
| `Shredded Wheat` | Add biscuits / grams |
| `Chicken Steak - Asian` | Add oz or grams |
| `AM Shot - Avocado Oil` | Add tbsp / tsp / ml |
| `AM Shot - Apple Cider Vinegar` | Add tbsp / tsp / ml |
| `AM Shot - Coconut Oil` | Add tbsp / tsp / ml |
| `Guacamole` | Add tbsp or cup |
| `Celery stalk` | Prefer `Celery 1 stalk` |
| `Pure Protein Bar` | Add `1 bar` (+ grams if known) |
| `Premier Protein Shake` | Add fl oz / `1 bottle` |
| `Quest Protein Bar` | Add `1 bar` (+ grams if known) |
| `Junk Food - Nongshim Shin Ramyun Ramen` | Add `1 package` (cooked or dry — say which) |
| `Junk Food - Dave's Double` | Add `1 burger` |
| `Junk Food - Dave's Triple` | Add `1 burger` |
| `Junk Food - Carrot Cake Slice` | Add `1 slice` (+ grams if known) |
| `Energy Drink - Celsius` | Add fl oz / `1 can` |
| `Energy Drink - Alani` | Add fl oz / `1 can` |
| `Energy Drink - Monster` | Add fl oz / `1 can` |
| `Energy Drink - Red Bull` | Add fl oz / `1 can` |

When you fix one, remove it from this table (or mark it done) so the list stays a live backlog.

---

## 5. Worked example — Parsley (already has a serving)

**Status:** already present — no new entry needed.

```json
"name": "Parsley 1 cup chopped"
```

One serving is baked into the name as **1 cup chopped** (USDA-style chopped parsley). Macros and micros on that object are for that cup. Related UI copy lives under the Parsley note in `definitions-food-notes.json`.

If you later want a smaller culinary garnish (e.g. `Parsley 1 tbsp chopped`), add a **second** object scaled to that amount — do not overwrite the cup entry unless you intend to replace it.

### Prompt used for “add one serving” herbs

```
[FOOD] - Parsley - Please add the units for one serving (whatever unit fits — cup, tbsp, oz, or g). Put the unit in the name.
```

---

## 6. After you improve an entry

- Keep **valid JSON** (tabs, no trailing comma on the last array item).
- Prefer renaming in place over duplicating the same food twice with ambiguous names.
- If QA status exists in `samples/definitions-food-qa-checked.json`, update keys that embed the old food name when you rename.
- Re-run JSON parse validation (section 3) before you stop.
