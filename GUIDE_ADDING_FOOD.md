# Adding a Food to `definitions-food.json`

Food definitions live in `samples/definitions-food.json`. The file is a **JSON array** of food objects. To add a food, append one more object to the array.

If you want to simplify things, you can have a value that is for **one serving** — but it also helps to name the units like 1 cup or 1 handful. Always bake the portion (and its unit) into the name, e.g. `"Macadamia nuts 1 oz"`, `"Peanuts 1 cup"`, `"First Street Trail Mix 6 tablespoons"`.

---

## 1. Object shape

```json
{
  "name": "Macadamia nuts 1 oz (about 10-12 nuts)",
  "protein": 2.2,
  "carbs": 3.9,
  "fats": 21.5,
  "micros": { },
  "longevity": { },
  "carbQuality": { }
}
```

| Field         | Required | Type   | Meaning                                  |
| ------------- | -------- | ------ | ---------------------------------------- |
| `name`        | Yes      | string | Food **plus the serving size and unit**  |
| `protein`     | Yes      | number | grams per serving                        |
| `carbs`       | Yes      | number | grams per serving                        |
| `fats`        | Yes      | number | grams per serving                        |
| `micros`      | No       | object | micronutrient amounts (see units below)  |
| `longevity`   | No       | object | longevity/fat/compound values            |
| `carbQuality` | No       | object | glycemic index, added sugar, refined carb |

Omit any nutrient key you can't estimate — don't guess. Leave the whole `micros`/`longevity`/`carbQuality` object out if you have nothing for it.

---

## 2. The serving-size rule (this is the important one)

The app has **no separate serving field** — the serving size is part of `name`, and *every number in the object is per that serving*.

- Good: `"Macadamia nuts 1 oz"`, `"Macadamia nuts 1/4 cup"`, `"Macadamia nuts 10 nuts"`
- Bad: `"Macadamia nuts"` (no portion — readers can't tell what the numbers mean)

Pick a realistic, easy-to-measure portion and state its unit (oz, g, cup, tbsp, piece, etc.).

---

## 3. Units per field

### `micros` — units are fixed per key

`g` = grams, `mg` = milligrams, `mcg` = micrograms.

| Key (`mg`)                                                                                                                                                 | Key (`mcg`)                                                                                     | Key (`g`)                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `sodium`, `potassium`, `calcium`, `iron`, `magnesium`, `zinc`, `manganese`, `vitaminE`, `thiamin`, `riboflavin`, `niacin`, `pantothenicAcid`, `vitaminB6`, `vitaminC`, `phosphorus`, `choline`, `chloride` | `copper`, `selenium`, `chromium`, `iodine`, `vitaminA`, `vitaminD`, `vitaminK`, `biotin`, `folate`, `vitaminB12`, `molybdenum` | `fiber`, `solubleFiber`, `insolubleFiber`     |

Amino acids (all in **mg**): `histidine`, `isoleucine`, `leucine`, `lysine`, `methionine`, `phenylalanine`, `threonine`, `tryptophan`, `valine`, `arginine`, `cysteine`, `glutamine`, `glycine`, `proline`, `tyrosine`, `taurine`.

**Fiber:** prefer `solubleFiber` + `insolubleFiber` (the app adds them for the total). A plain `fiber` value is accepted as a fallback.

### `longevity` — units per key

- Grams (`g`): `saturatedFat`, `monounsaturatedFat`, `polyunsaturatedFat`, `transFat`, `omega3`, `omega6`, `omega9`, `ala`, `epa`, `dha`, `linoleicAcid`, `arachidonicAcid`, `oleicAcid`, `palmitoleicAcid`, `methionine`
- Milligrams (`mg`): `cholesterol`, `polyphenols`, `nitrate`, `flavonoids`, `carotenoids`, `lutein`, `curcumin`, `resveratrol`, `coq10`, `sulforaphane`, `phosphorus`, `choline`, `carnitine`, `betaine`, `taurine`
- Micrograms (`mcg`): `vitaminK`, `vitaminK1`, `vitaminK2`, `selenium`, `copper`

### `carbQuality`

- `glycemicIndex`: the food's GI, `0–100+` (not grams)
- `addedSugar`: grams
- `refinedCarbs`: grams
- `netCarbs`: grams (optional; carbs minus fiber)

---

## 4. Shared keys: number in `micros`, `true` in `longevity`

A few nutrients appear in **both** panels: `vitaminE`, `vitaminK`, `selenium`, `copper`, `methionine`, `phosphorus`, `choline`, `taurine`.

Rule: put the **numeric amount in `micros`**, and set the same key in `longevity` to `true`. The app reads the number from `micros` and uses `true` as a "look it up over there" flag.

```json
"micros":    { "copper": 214, "selenium": 1, "vitaminE": 0.15 },
"longevity": { "copper": true, "selenium": true, "vitaminE": true }
```

(`methionine` is the exception on units: `mg` in `micros`, but `g` if you ever store it numerically in `longevity`. Keep it in `micros` as `mg` and use `true` in `longevity`.)

---

## 5. Full worked example — Macadamia nuts, 1 oz

Values below are illustrative estimates for a **1 oz (28 g)** serving. Replace with sourced values; omit anything you can't verify.

```json
{
  "name": "Macadamia nuts 1 oz (about 10-12 nuts)",
  "protein": 2.2,
  "carbs": 3.9,
  "fats": 21.5,
  "micros": {
    "sodium": 1,
    "potassium": 104,
    "calcium": 24,
    "iron": 1.05,
    "magnesium": 37,
    "zinc": 0.37,
    "copper": 214,
    "manganese": 1.17,
    "selenium": 1,
    "thiamin": 0.34,
    "riboflavin": 0.05,
    "niacin": 0.71,
    "vitaminB6": 0.08,
    "folate": 3,
    "vitaminC": 0.3,
    "solubleFiber": 0.6,
    "insolubleFiber": 1.8
  },
  "longevity": {
    "saturatedFat": 3.4,
    "monounsaturatedFat": 16.7,
    "polyunsaturatedFat": 0.4,
    "transFat": 0,
    "cholesterol": 0,
    "omega3": 0.06,
    "omega6": 0.36,
    "oleicAcid": 16.5,
    "copper": true,
    "selenium": true
  },
  "carbQuality": {
    "glycemicIndex": 10,
    "addedSugar": 0,
    "refinedCarbs": 0,
    "netCarbs": 1.5
  }
}
```

---

## 6. Before you save

- Add a **comma** after the previous object's closing `}` when appending, and make sure the last object has **no trailing comma**.
- Keep it **valid JSON** — no comments, no `//`, double-quoted keys and strings.
- The file is indented with **tabs** (match the surrounding style).
- Numbers only for amounts (no `"21.5g"` strings); the unit is implied by the key.

Quick validation from the repo root:

```bash
node -e "JSON.parse(require('fs').readFileSync('samples/definitions-food.json','utf8')); console.log('valid JSON')"
```

---

## 7. Three ways to add a food

You can add a food in three main ways. They all produce the same object shape described above — pick whichever fits your workflow.

### Way 1 — Do the research yourself (manual)

Build the object by hand using your own research, a nutrition database, or an AI chat (e.g. [chatgpt.com](https://chatgpt.com)). When it's ready, append it as a new entry in `samples/definitions-food.json`. This is the most hands-on option, but you're in full control of every value.

### Way 2 — Use the app's "Have AI help me" prompt

The app has a built-in AI flow that writes the prompt for you:

1. In the app, type the food name / portion (e.g. `1 oz of macadamia nuts`).
2. Click **Import**, then **✨ Have AI help me**.
3. Copy the generated prompt and paste it into ChatGPT (or another AI chat).
4. Paste the JSON that the AI returns back into the app.

What the app generates is the exact schema and unit list from this doc — the JSON structure, the per-key units, and the "number in `micros` / `true` in `longevity`" rule, all filled in automatically. See `jsonSchemaExample()` / `nutrientListForPrompt()` in `app.js` for the source of truth on keys and units.

Note: food you import this way is saved to your **local browser storage**, not to the codebase. If you want it to be a permanent, shared entry (when user clicks "Import Sample"), take the object the AI generated and append it into `samples/definitions-food.json` as a new array entry (see section 6).

### Way 3 — Ask your coding agent to add it

Open `samples/definitions-food.json` in your favorite coding harness (e.g. Cursor) and prompt it directly, for example:

```
[FOOD] - Butter - Please add the units for one serving
```

The agent researches the values, follows the schema in this doc, and appends the new object to the file for you.
