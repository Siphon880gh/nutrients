# Adding a Multivitamin to `definitions-food.json`

A multivitamin is just another food object in `samples/definitions-food.json` (a JSON array of food objects). What makes it different is **how you pick the numbers**: you do **not** copy the amounts printed on the Supplement Facts label. You estimate what your body actually **absorbs** from one tablet.

If you haven't read it yet, `GUIDE_ADDING_FOOD.md` covers the object shape, the per-key units, and the "number in `micros` / `true` in `longevity`" rule. Everything there applies here — this guide only adds the absorption layer on top.

---

## 1. Why not just use the label?

The label lists what's **in the pill**, not what you **get from the pill**. You never absorb 100% of a tablet:

- **Water-soluble vitamins** (C and the B vitamins) — excess is absorbed inefficiently at one time and the surplus is flushed out in urine.
- **Bulky minerals** (calcium, iron, magnesium, zinc) — absorption is a fraction of the dose, and it drops as the dose gets larger.
- **Vitamin B12** — limited by intrinsic factor, so only a small percentage of a large pill dose is taken up.
- **Fat-soluble vitamins** (A, D, E, K) — need dietary fat to be absorbed at all.

So the values in a multivitamin entry are **absorption-adjusted estimates**, not label values. This is what makes the entry realistic when the app sums up your day.

---

## 2. The prompt to use in Cursor

Open `samples/definitions-food.json` in Cursor and prompt the agent directly. Fill in the product you want:

```
In @samples/definitions-food.json, add [MULTIVITAMIN PRODUCT, eg. Centrum Men]

Don't just list the label DV. Adjust both the DV and actual values for typical absorption, since we don't absorb 100% of a pill for every vitamin.
If there is fat soluble vitamins: Assume enough fats were eaten to absorb the fat-soluble vitamins (A, D, E, K).
```

Why this wording matters:

- **"Don't just list the label DV"** — stops the agent from copy-pasting the Supplement Facts panel. It forces the absorption adjustment described in section 1.
- **"Adjust both the DV and actual values"** — the amount (`mcg`/`mg`) is what the app stores; adjusting it down is the whole point.
- **"Assume enough fats were eaten..."** — without this, an honest estimate of A/D/E/K on an empty stomach would be near zero. The assumption lets you keep meaningful fat-soluble values, on the condition that you take the pill **with a meal that has fat**.

---

## 3. Name the entry so it reads as adjusted

Bake the product, the serving (1 tablet), and the fact that it's adjusted into `name`:

- Good: `"Multivitamin - Centrum, Men 1 tablet (Adjusted)"`
- Good: `"Multivitamin - One A Day Men's 1 tablet (Adjusted)"`
- Bad: `"Centrum"` (no serving, and it looks like raw label values)

The `(Adjusted)` tag also matches the app's Multivitamin note (pattern `\bmultivitamin\b`), which explains the absorption caveat to anyone viewing the food.

---

## 4. Macros are zero

A tablet has no meaningful macros:

```json
"protein": 0,
"carbs": 0,
"fats": 0
```

The vitamins/minerals go in `micros`; the fat-soluble ones (`vitaminE`, `vitaminK`, plus `selenium`, `copper`) also get a `true` flag in `longevity` per the shared-key rule from `GUIDE_ADDING_FOOD.md`.

---

## 5. Worked example — Centrum Men, 1 tablet (absorption-adjusted)

These are estimates of typical adult absorption from one tablet **taken with a meal containing fat** — not the label amounts. Units follow `GUIDE_ADDING_FOOD.md` (`vitaminA`/`vitaminD`/`vitaminK`/`selenium`/`copper`/`chromium`/`iodine`/`molybdenum`/`biotin`/`folate`/`vitaminB12` in `mcg`; everything else here in `mg`).

```json
{
  "name": "Multivitamin - Centrum, Men 1 tablet (Adjusted)",
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "micros": {
    "vitaminA": 675,
    "vitaminC": 68,
    "vitaminD": 17.5,
    "vitaminE": 7.5,
    "vitaminK": 36,
    "thiamin": 0.84,
    "riboflavin": 0.85,
    "niacin": 12.8,
    "vitaminB6": 1.5,
    "pantothenicAcid": 2.5,
    "folate": 340,
    "vitaminB12": 2.5,
    "biotin": 20,
    "calcium": 59,
    "iron": 0,
    "magnesium": 17.5,
    "zinc": 3.3,
    "selenium": 48,
    "copper": 450,
    "manganese": 0.35,
    "chromium": 0.7,
    "iodine": 138,
    "molybdenum": 38
  },
  "longevity": {
    "vitaminE": true,
    "vitaminK": true,
    "selenium": true,
    "copper": true
  },
  "carbQuality": {
    "glycemicIndex": 0,
    "addedSugar": 0,
    "refinedCarbs": 0,
    "netCarbs": 0
  }
}
```

Notice how the numbers are scaled down from a typical label — e.g. calcium and magnesium are only a fraction of the printed dose, because that's roughly what a tablet delivers.

---

## 6. Before you save

- Add a **comma** after the previous object's closing `}` when appending, and make sure the last object has **no trailing comma**.
- Keep it **valid JSON** — no comments, no `//`, double-quoted keys and strings.
- The file is indented with **tabs** (match the surrounding style).
- Numbers only for amounts (no `"36mcg"` strings); the unit is implied by the key.

Quick validation from the repo root:

```bash
node -e "JSON.parse(require('fs').readFileSync('samples/definitions-food.json','utf8')); console.log('valid JSON')"
```

---

## 7. Reminder for whoever eats it

Because the fat-soluble values assume dietary fat was present, the entry is only accurate if you **take the tablet with a meal that has enough fat**. On an empty stomach or a very low-fat meal, your real intake of A, D, E, and K will be lower than the entry shows. The app surfaces this in the Multivitamin note automatically.
