# Nutrients

Client-only nutrition tracker for weekly meals and reusable food definitions.

The app runs from static files: `index.html`, `styles.css`, and `app.js`. Food definitions provide macros, micros, longevity nutrients, and carb-quality values used to calculate daily and weekly nutrition totals. Sample food data lives in `samples/definitions-food.json`.

## App Data

- `samples/definitions-food.json` contains bundled food definitions for import.
- `definitions-micronutrients.json` and `definitions-longevity.json` contain nutrient explanation copy.
- `demographic-dv.js` and `longevity-dv.js` provide daily value targets.
- Browser `localStorage` stores user food definitions, meal notes, settings, and UI state.

## QA Food Definitions Tool

Use `.agents/skills/qa-definitions-food.json` to audit food definition nutrients with AI.

The tool explains its purpose when invoked, asks which sample file to QA, asks whether to use the default nutrient set or a custom list, then rotates through nutrient-food pairs that still need review.

Example prompt to invoke tool: "Let's QA the food definitions at samples/" 

Default audit nutrients:
- Magnesium
- Potassium
- Calcium
- Zinc
- Vitamin D
- Vitamin A
- Vitamin C
- Fiber

The QA flow only asks AI about foods where the selected nutrient is `0` or missing. Reviewed pairs are tracked by hash key:

```text
{nutrientKey}|{foodName}
```

The default progress file is `samples/definitions-food-qa-checked.json`.

Example prompt with the definitions file opened:
```
Use qa skill that's found locally and make sure the food definitions have Manganese amounts if a food has it.
```