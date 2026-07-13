# Nutrients

By Weng (Weng Fei Fung).

![Last Commit](https://img.shields.io/github/last-commit/Siphon880gh/nutrients/main)
<a target="_blank" href="https://github.com/Siphon880gh" rel="nofollow"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" alt="Github" data-canonical-src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" style="max-width:8.5ch;"></a>
<a target="_blank" href="https://www.linkedin.com/in/weng-fung/" rel="nofollow"><img src="https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin&labelColor=blue" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/LinkedIn-blue?style=flat&amp;logo=linkedin&amp;labelColor=blue" style="max-width:10ch;"></a>
<a target="_blank" href="https://www.youtube.com/@WayneTeachesCode/" rel="nofollow"><img src="https://img.shields.io/badge/Youtube-red?style=flat&logo=youtube&labelColor=red" alt="Youtube" data-canonical-src="https://img.shields.io/badge/Youtube-red?style=flat&amp;logo=youtube&amp;labelColor=red" style="max-width:10ch;"></a>

You log the foods you ate for each day of the week. Each line is matched to a **food definition** that stores that food’s macros and nutrients. Those values roll up into the dashboards: daily/weekly macros and calories, **micronutrients** vs daily targets, and **longevity** nutrients by section. Your **TDEE**, **body weight**, and **gender** shape nutrient targets and macro and calorie goals.

Client-only nutrition tracker for weekly meals and reusable food definitions. The app runs from static files: `index.html`, `styles.css`, and `app.js`. Sample food data lives in `samples/definitions-food.json`.

## App Data

- `samples/definitions-food.json` contains bundled food definitions for import.
- `definitions-micronutrients.json` and `definitions-longevity.json` contain nutrient explanation copy.
- `demographic-dv.js` and `longevity-dv.js` provide daily value targets.
- Browser `localStorage` (via `persist.js` / `NutrientsPersist`) stores food definitions, day meals, favorites, and settings across sessions. See `specs-data-persistence.md`.

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

## Categorize Food Definitions Tool

Use `.agents/skills/categorize-food-definitions.json` to find food names that match no category in `definitions-food-categories.json`, then assign them to an existing category (extend patterns) or a new category.

Helper: `node scripts/list-uncategorized-foods.js [--json] [foods.json]`

Example prompt: "Categorize any uncategorized foods"
