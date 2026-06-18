# AGENTS_CODE_REFERENCE-core.md

> **Approximate locations only** — no exact line numbers. Code moves; use section names and relative position within `app.js` (~5200 lines).

Core logic: food definitions, matching, highlighting orchestration, dashboard totals, micro % DV, longevity panel, definition modals, localStorage.

Parent overview: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Module responsibility

| Concern | Primary symbols |
|---------|-----------------|
| In-memory state | `keywords[]`, `demographic`, `microRequirementsOpen`, `microViewDaily`, `showMicroDailyDv`, `longevityPanelOpen`, `weekTotalOpen`, `keywordReorderOpen`, `activeMicroId`, `activeLongevityId`, `activeImportId/Index`, `activePositionId/Index`, `activeMicroDefKey`, `activeLongevityDefKey` |
| IDs | `makeId()`, `findIndex(id)` |
| Table UI | `renderKeywords`, `syncFieldFromDom`, `moveKeyword`, `removeKeyword`, `addKeyword`, reorder toggle (`loadKeywordReorderOpen`), move-to-position modal |
| Matching | `countKeyword`, `keywordNames`, `buildHighlightRegex`, `keywordMatchPattern`, `escapeRegex` |
| Macro totals | `totalsFromText`, `addTotals`, `renderDashboard`, `renderWeekSummary`, `setWeekTotalOpen` |
| Micro totals / DV | `microTotalsFromText`, `weekMicroTotals`, `renderMicroRequirements`, `renderMicroDailyGrid`, `setMicroViewDaily`, `dailyDv` |
| Longevity | `longevityTotalsFromText`, `renderLongevityPanel`, `renderLongevityGiBuckets`, `setLongevityPanelOpen`, blank/normalize/merge helpers (below) |
| Definition modals | `openMicroDefModal`, `renderMicroDefBody`, `openLongevityDefModal`, `renderLongevityDefBody`, `setMicroDefFullscreen`, `loadMicroDefinitions`, `loadLongevityDefinitions` |
| % DV tiers | `loadAppConfig`, `tierForMicroPct`, `tierForLongevityPct`, `tierForPctInList`, `pctInlineStyle` |
| Demographic | `loadDemographic`, `saveDemographic`, `setDemographic`, `renderDemographicUi`; targets in `demographic-dv.js` |
| Highlights | `updateDayHighlights`, `highlightedHtml`, `refreshAll`, `syncScroll` |
| Food-name suggestions | `updateDaySuggest`, `foodSuggestMatches`, `applyDayFoodSuggest`, `hideDaySuggest`, `DAY_SUGGEST_MAX` |
| Day editor height | `loadDayEditorHeight`, `saveDayEditorHeight`, `applyDayEditorHeight`, `bindDayEditorResize`, `clampDayEditorHeight` |
| Persistence | `saveFoodDefinitions`, `loadFoodDefinitions`, `saveDayNotes`, `loadDayNotes` |
| Day meals | `exportAllDayMeals`, `applyImportAllDayMealsReplace`, `getImportAllMealsMissingMode` (`empty` \| `keep`), `clearDayNotes`, `clearAllDayNotes`, `anyDayHasNotes` |

## Data lifecycle

```text
loadFoodDefinitions()  → keywords[]
        ↓
renderKeywords()       → DOM table rows (innerHTML per row)
        ↓
user edit / import / micros modal / longevity modal
        ↓
saveFoodDefinitions()  → localStorage
        ↓
refreshAll()           → highlights + dashboard (macros, micros, longevity)
```

## Food definition CRUD

**Render** — `renderKeywords` in the **lower-middle** of `app.js`:

- Clears `#keywords-list`, builds one `<tr data-id="…">` per item.
- Columns: reorder (↑↓, shown when reorder toggle open), name, protein/carbs/fats inputs, micros button (`microsButtonHtml`), longevity button (`longevityButtonHtml`), actions (Import, Delete).
- Row actions use `data-action`: `up` | `down` | `delete` | `micros` | `longevity` | `import` | `position` (move-to-position modal).

**Inline edit** — delegated `input` on `#keywords-list`:

- `syncFieldFromDom(row)` reads `data-field` inputs into `keywords[i]`.
- Macros use `parseMacro` on input (empty → stored as `""`).

**Reorder/delete/add** — `moveKeyword`, `removeKeyword`, `addKeyword`; each saves and calls `renderKeywords` + `refreshAll`. Closing modals if the active row is removed/moved. The reorder column visibility is a persisted UI flag (`keywordReorderOpen`, `STORAGE_KEY_REORDER`).

## Matching & counting

**Whole-word regex** per food name (via `keywordMatchPattern(escapeRegex(name))`):

```javascript
new RegExp("\\b" + escapeRegex(name) + "\\b", "gi")
```

**`totalsFromText(text)`** (middle of `app.js`):

- Dedupes by lowercase name (first definition wins if duplicates).
- `hits = countKeyword(text, name)` — each match adds `hits ×` macro grams.
- Returns `{ protein, carbs, fats, proteinCal, carbsCal, fatsCal, totalCal }`.

**Highlight word list** — `keywordNames()` unique non-empty names (first wins per lowercase key).

**Combined regex** — `buildHighlightRegex`: alternation sorted longest-first to reduce partial overlap issues.

## Dashboard rendering

**`renderDashboard`**:

- Loops `DAYS`, reads `document.getElementById(day.id).value`.
- Accumulates `week` via `addTotals`; caches `lastWeekTotals`.
- Sets `#dashboard-grid` HTML from `dashboardCardHtml` (per-macro g + cal, total cal).
- **`#week-summary`** hidden by default; **Week total** toggle (`#dashboard-week-toggle`, `setWeekTotalOpen`) shows bar with `renderWeekSummary(week)` when open.
- If **Micro requirements** is open (`#dashboard-micro-toggle`), `renderMicroRequirements` (or `renderMicroDailyGrid` in daily view) fills the micro panel.
- If **Longevity** is open (`#dashboard-longevity-toggle`), `renderLongevityPanel` fills `#dashboard-longevity-content`.
- **Print** (`#dashboard-print`) opens a print-styled view.

## Micro requirements

`microTotalsFromText` mirrors macro matching (hits × per-food micros).

- **Weekly average view** (default): average daily amount = week sum ÷ `DAYS.length` (7). **% DV** = `(avgDaily / dailyDv(key)) × 100` where `dailyDv` calls `NutrientsDemographicDv.getDailyMicroDv(demographic, key)` from `demographic-dv.js` (e.g. female iron 18 mg, male 8 mg). Rendered by `renderMicroRequirements` into `#dashboard-micro-list`.
- **Each-day view** (`setMicroViewDaily(true)`): `renderMicroDailyGrid` builds a per-day grid into `#dashboard-micro-daily-grid`.
- **Show DV targets** (`showMicroDailyDv`, `#dashboard-micro-dv-toggle`): appends the daily requirement text (`microDailyDvText`).
- **% DV color/weight** from `config.json` `microDvStatus.tiers` via `tierForMicroPct` / `microPctInlineStyle`.
- **Learn more:** each nutrient row carries `data-micro-def`; click opens `openMicroDefModal`.

Toggle/view state is session-only; demographic choice is persisted.

## Longevity panel

`longevityTotalsFromText` mirrors matching for `LONGEVITY_FIELDS` (and the micro keys reused via `LONGEVITY_FROM_MICRO` / `LONGEVITY_COMPOUNDS_FROM_MICRO`).

**`renderLongevityPanel`** builds sections from `LONGEVITY_GROUPS` plus derived blocks:

- **Fats & cholesterol**, **Omega fatty acids**, **Longevity & inflammation compounds**, **Carb quality & glycemic** (the `group` field on each `LONGEVITY_FIELDS` entry).
- **Micronutrients from food** — repeats calcium/magnesium/vitamin D (and iodine/fiber for compounds) from the micro entries so users reason in one place.
- **TMAO balance** — precursors (`LONGEVITY_TMAO_PRECURSOR_KEYS`: choline, carnitine, betaine) vs lowering factors (`LONGEVITY_TMAO_LOWERING_FROM_MICRO`, `LONGEVITY_TMAO_LOWERING_LONGEVITY`).
- **Derived scores** (`LONGEVITY_DERIVED_DEFS`): omega-6:omega-3 ratio, saturated:unsaturated ratio, EPA+DHA, glycemic load.
- **Glycemic load & GI distribution** — `renderLongevityGiBuckets`.

**% DV** uses `NutrientsLongevityDv.getDailyLongevityDv(key)` from `longevity-dv.js`. **`limiting: true`** fields (e.g. saturated fat, omega-6, added sugar, sodium via `LONGEVITY_MICRO_LIMITING_KEYS`) use the inverted `longevityStatus.limitingTiers` so a high % is red, not green. Coloring via `tierForLongevityPct` / `longevityPctInlineStyle`. Section + nutrient headings carry `data-longevity-def` / `data-micro-def` for the explain modals.

**Calorie constants** — `CAL_PROTEIN`, `CAL_CARBS`, `CAL_FATS` at file top.

## Micros & longevity modals (per food)

- **`MICRO_FIELDS`** / **`LONGEVITY_FIELDS`** — near top of `app.js`; single source of truth for keys/units/codes/groups.
- **`initMicroForm`** / **`initLongevityForm`** — build `#micro-form` / `#longevity-form` inputs once at boot (`data-micro-key` / `data-longevity-key`).
- **`openMicroModal` / `saveMicrosFromForm` / `closeMicroModal`** and **`openLongevityModal` / `saveLongevityFromForm` / `closeLongevityModal`** — debounced save on `input` (`scheduleMicroSave` / `scheduleLongevitySave`).
- **Button labels** — `filledMicroCodes` / `filledLongevityCodes` → comma-separated `code`s; filled state class; tooltip via `data-tooltip` ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- `blankMicros` / `normalizeMicros`, `blankLongevity` / `normalizeLongevity`, `mergeCarbQualityIntoLongevity` keep stored shapes consistent.

Micros/longevity are **not** in macro `totalsFromText`; use `microTotalsFromText` / `longevityTotalsFromText` for their panels.

## Definition modals (explanatory text)

Read-only “learn more” content, loaded from JSON at boot:

- **`loadMicroDefinitions`** → `definitions-micronutrients.json` → `microDefinitions`; **`loadLongevityDefinitions`** → `definitions-longevity.json` → `longevityDefinitions`. Both fall back to `{}` on fetch error.
- **`openMicroDefModal(key)` / `renderMicroDefBody`** — general paragraphs (`tooLow` / `enough` / `tooHigh`), `foodSources`, then sex-specific (`male` / `female`) notes.
- **`openLongevityDefModal(key)` / `renderLongevityDefBody`** — handles `LONGEVITY_FIELDS` keys, derived keys (`LONGEVITY_DERIVED_DEFS`), and section keys (`LONGEVITY_SECTION_DEFS`).
- Both render into the shared `#micro-def-modal`; `setMicroDefFullscreen` toggles a fullscreen reading layout.

## localStorage

| Key | Content |
|-----|---------|
| `nutrients-food-definitions` | `JSON.stringify(keywords)` (includes `micros` + `longevity`) |
| `nutrients-demographic` | `"male"` or `"female"` (default `male` if missing) |
| `nutrients-day-notes` | `{ mon … sun }` string values per day id |
| `nutrients-day-editor-height` | Pixel height string for all `.day__editor` boxes (clamped 6rem–80vh) |
| `nutrients-keywords-reorder-open` | `"1"` / `"0"` reorder column visibility |
| `nutrients-keywords` (legacy) | Migrated once on load, then removed |

**Load** — `loadFoodDefinitions`: maps array, `normalizeMicros(item.micros)` + `normalizeLongevity(item.longevity)`, bumps `nextId` from existing ids.

**Save triggers** — day textarea `input`, row input, add/delete/reorder, micros save, longevity save, import apply, demographic change, `beforeunload` (definitions + demographic + day notes).

## Config (`config.json`)

Fetched by `loadAppConfig` at boot (before definitions). Shapes:

- `microDvStatus.tiers` — `[{ id, minPercent, color, fontWeight }]` (descending `minPercent`); higher % = greener.
- `longevityStatus.normalTiers` — same idea for “aim” nutrients.
- `longevityStatus.limitingTiers` — inverted scale for `limiting` nutrients (high % = red).
- `longevityStatus.transFatMaxGPerDay`, `omega6To3IdealMax` — thresholds for specific derived metrics.

On fetch failure, `DEFAULT_MICRO_DV_STATUS` / `DEFAULT_LONGEVITY_STATUS` are used.

## Highlighting (logic side)

**`updateDayHighlights(textarea)`**:

- Finds `.day__backdrop` in same `.day__editor`.
- Sets `backdrop.innerHTML = highlightedHtml(text, regex)`.
- `syncScroll` copies scroll position from textarea.

**`highlightedHtml`** — walks regex matches, wraps in `<mark class="hl">`; escapes all text.

UI mirror pattern: [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)

## Food-name suggestions (day autocomplete)

While typing on the **current line** of a day textarea, a popover suggests matching food-definition names (up to `DAY_SUGGEST_MAX` = 8).

**Show/hide** — `updateDaySuggest(textarea)` (called from `bindDay` on `input` / `keyup` / `click`, plus a document `selectionchange` handler when a day textarea is focused):

- Hidden when the line is empty, already matches a full food name, or has no fuzzy/prefix matches.
- Hidden on `blur`; dismissed per line via **Dismiss** or **Escape** (`_daySuggestDismissedLine` tracks the line start offset).

**Matching** — `foodSuggestMatches(query)` against `keywordNames()`:

- Prefix match (score 0), fuzzy prefix via Levenshtein on the first `query.length` chars (score 1+), or word-boundary substring (score 2).
- Highlight range from `foodSuggestHighlightRange` → `daySuggestItemHtml`.

**DOM** — `ensureDaySuggestEl` appends `.day__suggest` (`role="listbox"`) inside `.day__editor`:

- **Dismiss** button (`.day__suggest-dismiss`) stays above a scrollable `.day__suggest-list` of pill buttons (`.day__suggest-item`, `data-food-name`).
- Clicking a pill runs `applyDayFoodSuggest` (replaces text from line start to line end with the food name).
- `mousedown` on the popover is `preventDefault` so the textarea keeps focus; wheel events on the list do not scroll the textarea behind it.

Only one popover is visible at a time (`hideAllDaySuggests` before show).

## Day editor height (shared resize)

All seven `.day__editor` boxes share one height.

**CSS** — `resize: vertical` on `.day__editor` (not `.day__input`); default `height: calc(45vh - 2.5rem)`; `min-height: 6rem`, `max-height: 80vh`. `.week__grid` uses `min-height` only (no fixed `45vh`).

**Interaction** — `bindDayEditorResize` (wired when `.week__grid` exists):

- `pointerdown` on the editor’s bottom-right resize grip (~24px) sets `dayEditorResizeTarget`.
- `pointerup` reads that editor’s `offsetHeight`, runs `applyDayEditorHeight` on **all** editors, then `saveDayEditorHeight`.

**Boot** — `loadDayEditorHeight()` restores the saved px height from `nutrients-day-editor-height`.

## Internal naming vs UI

- Code still uses `keywords`, `addKeyword`, `#keywords-list`, `blankKeyword` — **UI strings say “Food definitions”**. Prefer extending existing names unless doing a deliberate rename pass.

## Extension points

| Goal | Where to edit |
|------|----------------|
| Sum micros into per-day cards | `dashboardCardHtml` + `microTotalsFromText` per day |
| Change micro DV profile | `demographic-dv.js` → `DAILY_MICRO_DV`; keys must match `MICRO_FIELDS` |
| Change longevity DV targets | `longevity-dv.js` → `DAILY_LONGEVITY_DV`; keys must match `LONGEVITY_FIELDS` |
| New demographic option | `META`, `DAILY_MICRO_DV`, HTML options, `normalizeDemographic` in `demographic-dv.js` |
| Edit % DV colors | `config.json` (`microDvStatus`, `longevityStatus`) |
| Add longevity section | `LONGEVITY_GROUPS` / `LONGEVITY_SECTION_DEFS` + `renderLongevityPanel` |
| Add explanatory text | key entry in `definitions-micronutrients.json` / `definitions-longevity.json` |
| Change day clear copy | `confirmClearDay`, `confirmClearAllDays` |
| Tune food suggestions | `DAY_SUGGEST_MAX`, `foodSuggestMatches`, `levenshtein` thresholds |
| Change shared editor height limits | `clampDayEditorHeight`, `.day__editor` min/max in CSS |
| Eighth column | extend `DAYS`, HTML, CSS `repeat(n)` for dashboard + week grid |
| Stricter matching | `countKeyword` / regex builder |

## Event binding & boot (end of `app.js`)

Listeners are attached in the **last ~20%** of the file: keywords table click/input, per-day `bindDay` loop, `bindDayEditorResize`, dashboard toggles (week/micro/longevity/print + micro view/DV), micros + longevity modals, definition modals (`data-micro-def` / `data-longevity-def`), demographic options, phosphorus/caffeine tip modals, and import/sample modals — see [import doc](./AGENTS_CODE_REFERENCE-import.md).

Boot sequence (very end):

```javascript
loadAppConfig(function () {
  var pending = 2;
  function definitionsReady() { if (--pending === 0) boot(); }
  loadMicroDefinitions(definitionsReady);
  loadLongevityDefinitions(definitionsReady);
});
// boot(): loadFoodDefinitions → loadKeywordReorderOpen → loadDayNotes →
//         loadDayEditorHeight → loadDemographic → renderDemographicUi →
//         renderKeywords → refreshAll
```
