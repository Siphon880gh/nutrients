# AGENTS_CODE_REFERENCE-import.md

> **Approximate locations only** — navigate by function name and region within `app.js` / `index.html`, not line numbers.

JSON import for a **single** food definition row (with AI prompt help), **bulk** export/import for the full list, **sample food** import from a bundled file, **sample day meals** import, and the **micro-gaps** AI prompt builder.

Parent: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md) · Table/macros: [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md)

## Single import modal (`#import-modal`, `index.html`)

| Element | Role |
|---------|------|
| `#import-modal-food` | Subtitle: current food name |
| `#import-ai-toggle` | “Have AI help me” / “Hide AI help” |
| `#import-ai-panel` | Portion field, preview, copy, external links |
| `#import-ai-portion` | Single serving+food field; placeholder `1 cup of peanuts` |
| `#import-ai-preview` | Live `<pre>` prompt preview |
| `#import-ai-copy` | Clipboard |
| `#import-open-chatgpt` / `#import-open-claude` | Copy then `window.open` |
| `#import-json` (`#import-json-wrap` / `#import-json-label`) | Paste JSON to apply |
| `#import-error` | Validation messages |
| `#import-apply` / `#import-cancel` | Footer actions |

> Single-row import is **override** semantics (see modal hint): any field, `micros`, `longevity`, or `carbQuality` key **not listed is cleared** on that row. Bulk **amend** mode is the merge-preserving path.

## State

- `activeImportId` / `activeImportIndex` — which row is being imported.
- Only one of import / micro / longevity modals should be open; opening one closes the others (saving micro/longevity edits first where relevant).

## Export JSON (prepopulate)

**`exportFoodObject(kw)` / `exportFoodJson(kw)`** — early `app.js`:

- Always includes `name`.
- Adds `protein` / `carbs` / `fats` only if non-empty.
- Adds `micros` object only with keys that have values.
- Splits longevity values: `CARB_QUALITY_KEYS` go under a `carbQuality` object, the rest under `longevity`. Each object is included only if it has keys.

Used when opening import with AI panel **closed** (`setImportAiPanelOpen(false)` restores exported JSON into textarea).

## Import apply (single)

**`applyImportJson(index, raw)`**:

1. `JSON.parse` — errors surface as “Invalid JSON”.
2. Requires `data.name` non-empty trim.
3. Calls `applyImportItemToKeyword(kw, data)`:
   - `name` always set.
   - Macros only if key **present** (`"protein" in data`, etc.) → `storedMacroValue`.
   - `micros`: only keys present in `data.micros` are written.
   - **Longevity / carbQuality**: `applyLongevityImportToKeyword` reads both `data.longevity` and `data.carbQuality`, then `mergeCarbQualityIntoLongevity` folds `carbQuality` into the single `longevity` store.
4. `saveFoodDefinitions()`.

**`runImport`** — calls apply, closes modal, `renderKeywords()`, `refreshAll()`.

## AI help panel

**Toggle** — `setImportAiPanelOpen(open)`:

| AI open | AI closed |
|---------|-----------|
| JSON label “Paste AI response (JSON)” | Label “JSON” |
| Textarea cleared + example placeholder | Textarea = `exportFoodJson(kw)` |
| Class `import-json-wrap--ai` on wrap | Removed |
| `syncImportAiInputs()` + focus portion | — |

**Portion → prompt** — `buildAiPromptFromPortion(portion)`:

- Opening line: `Please fill in the nutrient data for {portion|___}.`
- Instructions: JSON only, no fences; example name uses **`1 cup of peanuts`** when portion empty (`jsonSchemaExample`, `nameExample`).
- Serving-name rule: if serving info is missing, invent a typical one-sitting unit and append it to the food name.
- Micro↔longevity bridge rule: amounts for the micro panel belong in `micros`; when the same key also appears in longevity, store the number in `micros` only and set `longevity[key]` to `true`.
- Multivitamin / vitamin absorption rule: do not paste label %DV alone — adjust both DV and actual values for typical absorption (pills are not 100% absorbed); for fat-soluble vitamins (A, D, E, K), assume enough dietary fat was eaten for absorption.
- Appends full schema sample + `nutrientListForPrompt()` (lists all `MICRO_ALL_FIELDS` — core + extended trace minerals + amino acids — **and** `LONGEVITY_FIELDS` keys with units, including `alphaLipoicAcid` / `glutathione`).

**Preview** — `renderImportAiPreview` sets `#import-ai-preview` text on portion `input`.

**Copy / open external** — `copyAiPromptToClipboard`; `openAiService(url)` copies then opens `CHATGPT_URL` (`https://chatgpt.com/`) or `CLAUDE_URL` (`https://claude.ai/new`). The ChatGPT/Claude buttons carry brand icons (both here and in the micro-gaps panel).

**Prefill** — `syncImportAiInputs`: if portion empty and row has `name`, sets portion input to name.

## Bulk export / import (all foods)

**UI** — `#export-all-foods` / `#import-all-foods` / `#import-sample-foods` in `.keywords__bulk` under the table; modal `#import-all-modal`.

| Function | Role |
|----------|------|
| `exportFoodObject` / `exportAllFoodJson` | Array of per-food objects (same shape as single export, with `micros` / `longevity` / `carbQuality`) |
| `exportAllFoods` | Download `nutrients-food-definitions.json` |
| `openImportAllModal` | Prefills textarea with `exportAllFoodJson()` |
| `parseImportAllItems` | Parse + validate the pasted array |
| `getImportAllMode` | Radio `import-all-mode`: `amend` (default) or `replace` |
| `applyImportAllJson(raw, mode)` | Dispatches to amend or replace |
| `applyImportAllAmend` | Match by lowercase name (`findKeywordIndexByName`); `applyImportItemToKeyword` on hit, else append |
| `applyImportAllReplace` | Rebuild `keywords[]` from import |
| `planImportAllAmend` / `confirmImportAllAmend` / `confirmImportAllReplace` | Confirm summaries (updated vs added; full replace) |
| `keywordFromImportItem` | New row: `blankKeyword()` + `applyImportItemToKeyword` |
| `runImportAll` | Apply, close modal, re-render |

**Amend** — confirm summarizes how many updated vs added; omitted fields on a match are left unchanged. **Replace** — confirm replaces entire list. Empty array errors on amend; replace with confirm can clear all.

## Sample import

**`importSampleFoods`** — fetches `IMPORT_SAMPLE_FOODS_URL` (`samples/definitions-food.json`), then `confirmImportSampleReplace(count)` and applies via the replace path. On success calls `advanceStarterGuideAfterImport()` (meals step of starter guide when eligible). The sample file is an array of food objects using the same `name` / `protein` / `carbs` / `fats` / `micros` / `longevity` / `carbQuality` shape.

Empty table copy in `#keywords-empty` also links to sample import via `data-action="import-sample-from-empty"` (delegated click on `#keywords-empty`).

Human/agent authoring guides (not loaded by the app): `GUIDE_ADDING_FOOD.md`, `GUIDE_IMPROVING_FOOD.md`, `GUIDE_ADDING_MULTIVITAMIN.md`. QA helpers: `scripts/run-micro-qa.js`, `scripts/run-plant-sterols-qa.js`, `scripts/list-uncategorized-foods.js`; `.agents/skills/qa-definitions-food.json` (writes `samples/definitions-food-qa-checked.json`), `.agents/skills/categorize-food-definitions.json` (updates `definitions-food-categories.json`).

## Day meals import (`#import-all-meals-modal`)

- `exportAllDayMeals` → `nutrients-day-meals.json`; `openImportAllMealsModal` prefills `exportAllDayMealsJson()`.
- `parseImportAllDayMealsObject` requires an **object** keyed by day ids (`mon`…`sun`).
- `getImportAllMealsMissingMode` — radio `import-all-meals-missing`: `empty` (default, clears days not listed) or `keep`.
- `applyImportAllDayMealsReplace` writes values, confirms via `confirmImportAllDayMealsApply`, then `saveDayNotes`.

## Sample day meals (`#import-sample-meals`)

**`importSampleMeals`** — fetches `IMPORT_SAMPLE_MEALS_URL` (`samples/day-meals.json`), parses with `parseImportAllDayMealsObject`, confirms via `confirmImportSampleMealsReplace` when any day already has notes, then `applySampleDayMealsData(data, true)` (missing days cleared) + `refreshAll`.

Sample shape:

```json
{
  "mon": "…",
  "tue": "…",
  "wed": "…",
  "thu": "…",
  "fri": "…",
  "sat": "…",
  "sun": "…"
}
```

Button lives in `.week__days-actions` beside Import all / Clear all days.

## Micro-gaps AI prompt (`#micro-gaps-modal`)

Triggered by **Ask AI to help fill gaps** (`#micro-gaps-ai-open`) inside the micro panel.

| Function | Role |
|----------|------|
| `openMicroGapsModal` | Open modal, build preview |
| `microGapsPreferenceText` | Reads `#micro-gaps-preference` select (vegan, gluten-free, …) |
| `buildMicroGapsSnapshotLines` | Current week micro averages + % DV per nutrient |
| `buildMicroGapsAiPrompt` | Full prompt incl. demographic, preferences, `#micro-gaps-additional` free text |
| `renderMicroGapsAiPreview` | Live `<pre>` preview |
| `copyMicroGapsPromptToClipboard` / `openMicroGapsAiService` | Copy then open ChatGPT/Claude |
| `closeMicroGapsModal` | — |

## Health timeline AI prompt (`#health-timeline-modal`)

Triggered by **Ask AI: health timeline** (`#health-timeline-ai-open`) beside the micro-gaps button.

| Function | Role |
|----------|------|
| `openHealthTimelineModal` | Open modal, build preview |
| `buildHealthTimelineAiPrompt` | Prompt from current week nutrient snapshot (what happens if intake continues) |
| `renderHealthTimelineAiPreview` | Live `<pre>` preview |
| `copyHealthTimelinePromptToClipboard` / open ChatGPT/Claude links | Copy-first then open tab |
| `closeHealthTimelineModal` | — |

Same ChatGPT/Claude brand-icon pattern as import and micro-gaps panels.

## Open / close

- **`openImportModalByIndex(i)`** — closes other modals; sets JSON from export; AI panel closed by default.
- **`closeImportModal`** — clears `activeImportId`, hides modal, resets AI panel, clears error.
- **`updateBodyModalOpen`** — toggles a body class while any modal is open (scroll lock).
- **Escape** — global keydown at end of `app.js` closes the topmost open modal (import, sources, settings, TDEE, tips, def modals, etc.).

## Example JSON (for AI / users)

```json
{
  "name": "1 cup of peanuts",
  "protein": 38,
  "carbs": 16,
  "fats": 72,
  "micros": {
    "fiber": 10,
    "solubleFiber": 3,
    "insolubleFiber": 7,
    "sodium": 5,
    "vitaminK": 25,
    "vitaminK1": 20,
    "vitaminK2MK7": 5,
    "leucine": 2500
  },
  "longevity": {
    "saturatedFat": 10,
    "monounsaturatedFat": 36,
    "omega6": 22,
    "plantSterols": 0.5,
    "carotenoids": 1.2
  },
  "carbQuality": {
    "glycemicIndex": 14,
    "netCarbs": 6
  }
}
```

On **single** import, omitted keys are cleared on that row. On **bulk amend**, omitted keys are left untouched. `carbQuality` keys are merged into `longevity` internally.

Bulk array example:

```json
[
  { "name": "egg", "protein": 6, "fats": 5 },
  { "name": "1 cup rice", "carbs": 45 }
]
```

## Safe-change notes

- Keep **amend merge semantics** for optional fields unless product asks for full replace.
- AI schema example must stay aligned with `MICRO_ALL_FIELDS` (core + extended + amino acids, including vitamin K subforms `vitaminK1` / `vitaminK2` / `vitaminK2MK4` / `vitaminK2MK7`) + `LONGEVITY_FIELDS` keys (`plantSterols`, `creatine`, `carotenoids`, `alphaLipoicAcid`, `glutathione`, …) (`jsonSchemaExample`, `nutrientListForPrompt`). Multivitamin absorption + fat-soluble fat-assumption rules live in `buildAiPromptFromPortion`.
- `fiber` is derived from `solubleFiber` + `insolubleFiber` when those are present (`fiberTotalFromParts`); the micros modal auto-splits a typed total via `splitTotalFiber`. Import/export skip the derived `fiber` key when parts exist.
- External links are not prompt-in-URL APIs — always **copy-first**, then open tab.
- New AI provider: add link in HTML + listener beside ChatGPT/Claude block at end of `app.js` (both import and micro-gaps panels).
- `carbQuality` is an import/export alias only; do not add a separate in-memory `carbQuality` store — fold into `longevity` via `mergeCarbQualityIntoLongevity`.
- **K breakdown import:** log total `vitaminK` for FDA-scored rows; optional K1/K2/MK-4/MK-7 in `micros` with matching `longevity: true` markers when bridged. Subforms are in `NO_STANDALONE_REF_MICRO_KEYS` (tracked, not independently scored).
- **Carotenoids:** may be omitted when `vitaminA` is present — dashboard estimates mg via `resolveLongevityValue`; explicit `longevity.carotenoids` (mg) overrides.
- **Condition notes in JSON:** `definitions-micronutrients.json` / `definitions-longevity.json` entries may include keys matching `MICRO_CONDITION_FOCUS` ids (`coffeeTeaUser`, `adhd`, `anemia`, `hairLoss`, `americanCommonDeficiencies`, `fatSolubleVitamins`, …) — string arrays shown in explain modals when that condition is focused ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food notes JSON:** `definitions-food-notes.json` — `{ notes: [{ label, pattern, note }] }`; regex matched against all day-meal text; not imported/exported with meals ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food categories JSON:** `definitions-food-categories.json` — `{ categories: [{ id, label, patterns }] }`; first matching regex categorizes a food-definition name for the table filter; not imported/exported with foods ([core doc](./AGENTS_CODE_REFERENCE-core.md)).

## Related CSS

Import/AI styles in `styles.css` — search `.import-modal`, `.import-ai-panel`, `.micro-gaps-modal`, `.modal__panel--wide` (see [ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
