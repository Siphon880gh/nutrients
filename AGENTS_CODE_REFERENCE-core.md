# AGENTS_CODE_REFERENCE-core.md

> **Approximate locations only** — no exact line numbers. Code moves; use section names and relative position within `app.js` (~8200 lines).

Core logic: food definitions, matching, highlighting orchestration, dashboard totals, micro % DV, longevity panel, definition modals, localStorage.

Parent overview: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Module responsibility

| Concern | Primary symbols |
|---------|-----------------|
| In-memory state | `keywords[]`, `demographic`, `userTdee`, `microRequirementsOpen`, `microViewDaily`, `showMicroDailyDv`, `microConditionFocus`, `longevityPanelOpen`, `weekTotalOpen`, `keywordReorderOpen`, `keywordCaloriesOpen`, `dashboardMacroPctView`, `lastWeekTotals`, `activeMicroId`, `activeLongevityId`, `activeImportId/Index`, `activePositionId/Index`, `activeMicroDefKey`, `activeLongevityDefKey`, `activeMicroSourcesKey/Scope`, `activeLongevitySourcesKey/Kind`, `defModalReturnSources`, `longevityNavActiveIndex` |
| IDs | `makeId()`, `findIndex(id)` |
| Table UI | `renderKeywords`, `syncFieldFromDom`, `moveKeyword`, `removeKeyword`, `addKeyword`, reorder toggle (`loadKeywordReorderOpen`), move-to-position modal |
| Matching | `countKeyword`, `keywordNames`, `buildHighlightRegex`, `keywordMatchPattern`, `escapeRegex` |
| Macro totals | `totalsFromText`, `addTotals`, `renderDashboard`, `dashboardCardHtml`, `dashboardMacroPctView`, `macroPctFromTotals`, `renderWeekSummary`, `setWeekTotalOpen` |
| Micro totals / DV | `microTotalsFromText`, `weekMicroTotals`, `renderMicroRequirements`, `renderMicroWeeklyList`, `renderMicroDailyGrid`, `setMicroViewDaily`, `dailyDv`, `microRequiresDailyIntake`, `microConditionDisplayFields`, `setMicroConditionFocus` |
| Longevity | `longevityTotalsFromText`, `renderLongevityPanel`, `renderLongevityGiBuckets`, `setLongevityPanelOpen`, longevity nav (`buildLongevityNavAllList`, `scrollLongevityNavToSection`), blank/normalize/merge helpers (below) |
| Ranked food sources | `microContributionsFromText`, `microContributionsForScope`, `longevityContributionsFromWeek`, `glycemicLoadContributionsFromWeek`, `nutrientSourcesListHtml`, `openMicroSourcesModal`, `openLongevitySourcesModal`, `microSourcesIconHtml`, `longevitySourcesIconHtml`, `microDailyIntakeIconHtml`, `appendMicroDailyIntakeIconHtml`, `showMicroDailyIntakePopover`, `hideMicroDailyIntakePopover`, `handleMicroDailyIntakeClick` |
| Settings / TDEE | `openSettingsModal`, `loadTdee`, `saveTdee`, `getTdee`, `getTdeeBaseline`, `openTdeeCalculatorModal`, `calcMifflinStJeor`, `openTdeeHintModal`, `openMacroSplitHintModal`, `renderMacroSplitCarousel`, `MACRO_BODY_TYPES` |
| Definition modals | `openMicroDefModal`, `renderMicroDefBody`, `openLongevityDefModal`, `renderLongevityDefBody`, `setMicroDefFullscreen`, `setDefModalReturnSources`, `returnFromDefModalToSources`, `microDefConditionSectionHtml`, `loadMicroDefinitions`, `loadLongevityDefinitions` |
| % DV tiers | `loadAppConfig`, `tierForMicroPct`, `tierForLongevityPct`, `tierForPctInList`, `pctInlineStyle` |
| Demographic | `loadDemographic`, `saveDemographic`, `setDemographic`, `renderDemographicUi` (updates `#settings-demographic-icon`); targets in `demographic-dv.js` (`DAILY_MICRO_DV`, `CALORIE_BASELINE`, `DAILY_INTAKE_MICRO_KEYS`, `requiresDailyIntake`) |
| Highlights | `updateDayHighlights`, `highlightedHtml`, `refreshAll`, `syncScroll` |
| Food-name suggestions | `updateDaySuggest`, `foodSuggestMatches`, `applyDayFoodSuggest`, `hideDaySuggest`, `DAY_SUGGEST_MAX` |
| Food notes (toolbar) | `loadFoodNotesDefinitions`, `normalizeFoodNotesDefinitions`, `detectedFoodNotes`, `updateDayFoodNotesUi`, `dayFoodNotesLabelsHtml`, `showDayFoodNotesPopoverForIndex`, `initDayFoodNotesEvents`, `foodNotesDefinitions`, `FOOD_NOTES_URL` |
| Starter guide | `maybeShowStarterGuideImportStep`, `advanceStarterGuideAfterImport`, `showStarterGuideStep`, `repositionStarterGuide`, `dismissStarterGuide`, `hideStarterGuide`, `starterGuideEligible`, `starterGuideStep` |
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
- **`#week-summary`** hidden by default; **Week total** toggle (`#dashboard-week-toggle`, `setWeekTotalOpen`) shows `renderWeekSummary(week)` when open — **week total**, **day average**, **TDEE deficit/surplus** (or “Set TDEE in Settings”), **macro split (week avg)** with explain links to `#tdee-hint-modal` / `#macro-split-hint-modal`.
- Per-day cards: `dashboardCardHtml` — default shows g·cal rows; `#dashboard-grid` toggle (`dashboardMacroPctView`, `data-action="toggle-dashboard-macro-view"`) switches all cards to macro **percentages**.
- If **Micro requirements** is open (`#dashboard-micro-toggle`), `renderMicroRequirements` (or `renderMicroDailyGrid` in daily view) fills the micro panel.
- If **Longevity** is open (`#dashboard-longevity-toggle`), `renderLongevityPanel` fills `#dashboard-longevity-content`.
- **Print** (`#dashboard-print`) opens a print-styled view.

## Micro requirements

`microTotalsFromText` mirrors macro matching (hits × per-food micros).

- **Weekly average view** (default): average daily amount = week sum ÷ `DAYS.length` (7). **% DV** = `(avgDaily / dailyDv(key)) × 100` where `dailyDv` calls `NutrientsDemographicDv.getDailyMicroDv(demographic, key)` from `demographic-dv.js` (e.g. female iron 18 mg, male 8 mg). Rendered by `renderMicroWeeklyList` into `#dashboard-micro-list`.
- **Condition focus** (`MICRO_CONDITION_FOCUS`, `#dashboard-micro-condition-toggle`): filters rows to condition-relevant micros (+ optional longevity keys for ADHD); adds a **Focus:** section at top of explain modals when JSON has matching condition key. Session-only (not persisted).
- **My food** bar-chart button on each row (`microSourcesIconHtml`, `data-micro-sources`) opens `#micro-sources-modal` — ranked matched foods with per-hit calculations; scope select (week or single day).
- **Daily intake icon** — pill button (`.dashboard__micro-daily-intake-btn`, `data-micro-daily-intake`) appears next to **My food** when `NutrientsDemographicDv.requiresDailyIntake(key)` is true (keys listed in `DAILY_INTAKE_MICRO_KEYS` in `demographic-dv.js` — water-soluble vitamins except B12, steady electrolytes/minerals, fiber, choline, essential amino acids, ALA). Click toggles `#micro-daily-intake-popover` (fixed tooltip) explaining that poor body storage makes weekly ÷7 averaging misleading; does not open the sources modal. Hidden on re-render, outside click, and scroll (`hideMicroDailyIntakePopover`).
- **Each-day view** (`setMicroViewDaily(true)`): `renderMicroDailyGrid` builds a per-day grid into `#dashboard-micro-daily-grid`.
- **Show DV targets** (`showMicroDailyDv`, `#dashboard-micro-dv-toggle`): appends the daily requirement text (`microDailyDvText`).
- **% DV color/weight** from `config.json` `microDvStatus.tiers` via `tierForMicroPct` / `microPctInlineStyle`.
- **Learn more:** each nutrient row carries `data-micro-def`; click opens `openMicroDefModal`.

Toggle/view state is session-only; demographic choice is persisted.

## Longevity panel

`longevityTotalsFromText` mirrors matching for `LONGEVITY_FIELDS` (and the micro keys reused via `LONGEVITY_FROM_MICRO` / `LONGEVITY_COMPOUNDS_FROM_MICRO`).

**`renderLongevityPanel`** builds sections from `LONGEVITY_GROUPS` plus derived blocks (see `LONGEVITY_SECTION_DEFS` — includes bone density, calcification, TMAO, glycemic):

- **Fats & cholesterol**, **Omega fatty acids**, **Longevity & inflammation compounds**, **Carb quality & glycemic** (the `group` field on each `LONGEVITY_FIELDS` entry).
- **Micronutrients from food**, **Bone density**, **Calcification & vascular balance** — repeat micro/longevity entries so users reason in one place.
- **TMAO balance** — precursors vs lowering factors; inline tips link to `#tmao-protectors-tip-modal`.
- **Derived scores** (`LONGEVITY_DERIVED_DEFS`): omega-6:omega-3 ratio, saturated:unsaturated ratio, EPA+DHA, glycemic load.
- **Glycemic load & GI distribution** — `renderLongevityGiBuckets`; GL rows use color by GI tier.
- **Section nav** — sticky `#dashboard-longevity-nav` (prev/next + “All topics”) scroll-spies `#dashboard-longevity-content` sections.
- **My food** icons on rows (`longevitySourcesIconHtml`, `data-longevity-sources`) open `#longevity-sources-modal` with ranked contributions; glycemic load uses special GL-per-serving ranking. Rows whose `sourcesKey` is in `DAILY_INTAKE_MICRO_KEYS` also get the daily-intake pill icon (same popover as the micro panel).

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
- **`openMicroDefModal(key)` / `renderMicroDefBody`** — optional **Focus:** section from `microDefConditionSectionHtml`; general paragraphs (`tooLow` / `enough` / `tooHigh`), `foodSources`, then sex-specific (`male` / `female`) notes. Second arg `returnTo` sets `defModalReturnSources` for **← My food** back nav.
- **`openLongevityDefModal(key)` / `renderLongevityDefBody`** — handles `LONGEVITY_FIELDS` keys, derived keys (`LONGEVITY_DERIVED_DEFS`), and section keys (`LONGEVITY_SECTION_DEFS`); limiting nutrients swap heading order.
- Both render into the shared `#micro-def-modal`; `setMicroDefFullscreen` toggles a fullscreen reading layout. Title links inside sources modals call these with a return stack so **Done** or **← My food** restores the ranking modal.

## Ranked food-source modals

**Micro** — `#micro-sources-modal`:

- Opened from dashboard micro rows (`openMicroSourcesModal(key, scope)`); scope `week` or a day id via `#micro-sources-scope`.
- **`microContributionsForScope`** / **`microContributionsFromText`**: for each matched food, `hits × micro value`; sorted descending.
- **`nutrientSourcesListHtml`**: ranked list with rank #, food name, per-serving amount, × hits, row total; footer **Total**.
- Requirements block: daily + weekly DV (sex grid when micro has demographic DV).
- Title nutrient name is a link (`data-micro-def`) → explain modal with return to this sources modal.
- Fullscreen: `#micro-sources-fullscreen-toggle`.

**Longevity** — `#longevity-sources-modal`:

- Opened from longevity panel rows (`openLongevitySourcesModal(key, kind)`); `kind` ∈ `micro` | `longevity` | `glycemicLoad`.
- **`longevityContributionsFromWeek`** / **`glycemicLoadContributionsFromWeek`**: same hit×value pattern; GL ranks by GL per serving (GI × carbs ÷ 100), color by GI tier.
- Glycemic load view adds tier comparison bars (`micro-sources-modal__gl-tier`).
- Title link → longevity/micro explain modal with return stack.

**Shared:** `closeOtherModalsForSources` closes competing modals; `handleSourcesModalTitleDefClick` wires title → explain → back.

## Settings & TDEE

Demographic + TDEE live in **`#settings-modal`** (header `#settings-open`), not a bottom panel.

- **Sex** — same `setDemographic` / `#demographic-options` radios; updates `#settings-demographic-icon` and micro % DV immediately.
- **TDEE** — `#settings-tdee` input; persisted `STORAGE_KEY_TDEE` (`userTdee`). Placeholder from `getTdeeBaseline()` → `demographic-dv.js` `CALORIE_BASELINE`.
- **TDEE calculator** — `#tdee-calculator-modal`: Mifflin–St Jeor BMR × activity factor; resistance (days/week or weekly heavy/light sets) + optional cardio; **Use this value** writes settings input.
- **Week summary compare** — `renderWeekSummary` uses `getTdee()` × 7 vs week total; deficit/surplus label, cal/week delta, ~lb/week (`3500` rule). Explain: `#tdee-hint-modal`.
- **Macro split guidance** — week avg P/C/F % in summary; explain opens `#macro-split-hint-modal` with `MACRO_BODY_TYPES` carousel (`renderMacroSplitCarousel`).

## Food table calories column

- **`keywordCaloriesOpen`** — persisted `STORAGE_KEY_CALORIES`.
- Header `.keywords__macro-toggle` (`data-action="toggle-calories"`) switches Prot/Carbs/Fats columns between **(g)** and **(cal)**; reveals **Total (cal)** column.
- `renderKeywords` writes cal or g values per row when open.

## localStorage

| Key | Content |
|-----|---------|
| `nutrients-food-definitions` | `JSON.stringify(keywords)` (includes `micros` + `longevity`) |
| `nutrients-demographic` | `"male"` or `"female"` (default `male` if missing) |
| `nutrients-tdee` | Optional positive number string (user maintenance calories/day) |
| `nutrients-day-notes` | `{ mon … sun }` string values per day id |
| `nutrients-day-editor-height` | Pixel height string for all `.day__editor` boxes (clamped 6rem–80vh) |
| `nutrients-keywords-reorder-open` | `"true"` / `"false"` reorder column visibility |
| `nutrients-keywords-calories-open` | `"true"` / `"false"` food table g ↔ cal column mode |
| `nutrients-keywords` (legacy) | Migrated once on load, then removed |

**Load** — `loadFoodDefinitions`: maps array, `normalizeMicros(item.micros)` + `normalizeLongevity(item.longevity)`, bumps `nextId` from existing ids.

**Save triggers** — day textarea `input`, row input, add/delete/reorder, micros save, longevity save, import apply, demographic change, TDEE input blur, calories toggle, `beforeunload` (definitions + demographic + day notes).

## Config (`config.json`)

Fetched by `loadAppConfig` at boot (before definitions). Shapes:

- `microDvStatus.tiers` — `[{ id, minPercent, color, fontWeight }]` (descending `minPercent`); higher % = greener.
- `longevityStatus.normalTiers` — same idea for “aim” nutrients.
- `longevityStatus.limitingTiers` — inverted scale for `limiting` nutrients (high % = red).
- `longevityStatus.transFatMaxGPerDay`, `omega6To3IdealMax` — thresholds for specific derived metrics.

On fetch failure, `DEFAULT_MICRO_DV_STATUS` / `DEFAULT_LONGEVITY_STATUS` are used.

## Food notes (`definitions-food-notes.json`)

Fetched at boot by `loadFoodNotesDefinitions` (parallel with micro/longevity defs). **Not persisted** — rules live in the JSON file only.

**Config shape:**

```json
{
  "notes": [
    {
      "label": "Egg",
      "pattern": "\\beggs?\\b",
      "note": "Plain-text hint shown in the toolbar popover."
    }
  ]
}
```

| Field | Role |
|-------|------|
| `label` | Shown in toolbar as an underlined link (`Notes available for: Egg, …`) |
| `pattern` | Regex tested against **all day meal text** (Mon–Sun joined); compiled with `"i"` flag |
| `note` | Popover body (escaped via `escapeHtml`) |

**Normalize** — `normalizeFoodNotesDefinitions`: accepts `{ notes: [...] }` or a bare array; drops entries missing `label` / `pattern` / `note` or with invalid regex.

**Detect** — `detectedFoodNotes()` → `allDayMealsText()` then `foodNotesDefinitions.filter(defn => new RegExp(defn.pattern, "i").test(text))`. Order follows config file order.

**Render** — `updateDayFoodNotesUi()` (called from `refreshAll` and `applyDayNoteChange`):

- No matches → `#day-food-notes` gets `hidden`, popover cleared.
- Matches → `#day-food-notes-labels` innerHTML from `dayFoodNotesLabelsHtml` (one `.week__food-notes-label` button per match; comma separators via `.week__food-notes-sep`).
- Popover `#day-food-notes-popover` shows a single note for the hovered or pinned label.

**Interaction** — `initDayFoodNotesEvents` (once at bind time):

- `mouseenter` on a label → `showDayFoodNotesPopoverForIndex` (positions popover under that label via `positionDayFoodNotesPopover`).
- `click` on a label → toggle pin (`dayFoodNotesPinned`); click outside or second click unpins.
- `mouseleave` on `#day-food-notes` / popover → `scheduleDayFoodNotesHide` (120 ms delay so the cursor can move into the popover).
- `window.resize` → repositions popover if open.

**State** — `dayFoodNotesMatches`, `dayFoodNotesActiveIndex`, `dayFoodNotesPinned`, `dayFoodNotesHideTimer`.

UI markup + CSS: [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)

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

## Starter guide (beginner popover)

Two-step, session-only onboarding when the food list is empty on first load.

**Eligibility** — `maybeShowStarterGuideImportStep()` runs at end of `boot()` when `keywords.length === 0`; sets `starterGuideEligible = true` and, after a double `requestAnimationFrame`, shows step **`import`** if the list is still empty.

**Step `import`** — anchored to `#import-sample-foods` or `#food-definitions-heading`; copy prompts sample import. Scrolls `.keywords` into view. Also reachable from `#keywords-empty` inline link (`data-action="import-sample-from-empty"` → `importSampleFoods()`).

**Step `meals`** — after successful sample import (`advanceStarterGuideAfterImport()` from `importSampleFoods` replace path), anchored to `.week__grid`; copy prompts Mon–Wed meal entry and mentions food-name suggestions.

**Dismiss** — `#starter-guide-dismiss` (**Got it**): on **`meals`** step sets `starterGuideEligible = false` (won’t re-show); on **`import`** step only hides (eligible until meals dismissed or foods added).

**Positioning** — `#starter-guide` is `position: fixed`; `repositionStarterGuide` reads target `getBoundingClientRect`, clamps horizontal center, places panel above target (`data-placement="bottom"` arrow). `bindStarterGuideScrollResize` listens to scroll (capture) + resize while visible.

Not persisted; not closed by the global Escape modal stack.

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
| Mark micro as daily-intake-only | `demographic-dv.js` → `DAILY_INTAKE_MICRO_KEYS` (+ `requiresDailyIntake`); dashboard adds pill icon via `appendMicroDailyIntakeIconHtml` |
| Change longevity DV targets | `longevity-dv.js` → `DAILY_LONGEVITY_DV`; keys must match `LONGEVITY_FIELDS` |
| New demographic option | `META`, `DAILY_MICRO_DV`, HTML options, `normalizeDemographic` in `demographic-dv.js` |
| Edit % DV colors | `config.json` (`microDvStatus`, `longevityStatus`) |
| Add condition focus | `MICRO_CONDITION_FOCUS` + HTML options + JSON condition keys on nutrient defs |
| Add ranked source metric | contribution builder + `nutrientSourcesListHtml` + panel row `sourcesIconHtml` |
| Change TDEE / body-type copy | settings modal HTML + `MACRO_BODY_TYPES` + hint modals |
| Toggle food table cal column | `keywordCaloriesOpen`, `updateKeywordCaloriesUi`, `STORAGE_KEY_CALORIES` |
| Add longevity section | `LONGEVITY_GROUPS` / `LONGEVITY_SECTION_DEFS` + `renderLongevityPanel` + nav list |
| Add explanatory text | key entry in `definitions-micronutrients.json` / `definitions-longevity.json` |
| Change day clear copy | `confirmClearDay`, `confirmClearAllDays` |
| Tune food suggestions | `DAY_SUGGEST_MAX`, `foodSuggestMatches`, `levenshtein` thresholds |
| Tune starter guide copy/steps | `maybeShowStarterGuideImportStep`, `advanceStarterGuideAfterImport`, `showStarterGuideStep`, `starterGuideTargetForStep` |
| Change shared editor height limits | `clampDayEditorHeight`, `.day__editor` min/max in CSS |
| Eighth column | extend `DAYS`, HTML, CSS `repeat(n)` for dashboard + week grid |
| Stricter matching | `countKeyword` / regex builder |

## Event binding & boot (end of `app.js`)

Listeners are attached in the **last ~20%** of the file: keywords table click/input, per-day `bindDay` loop, `bindDayEditorResize`, dashboard toggles (week/micro/longevity/print + micro view/DV), micros + longevity modals, definition modals (`data-micro-def` / `data-longevity-def`), demographic options, phosphorus/caffeine tip modals, starter guide dismiss + empty-state sample link, and import/sample modals — see [import doc](./AGENTS_CODE_REFERENCE-import.md).

Boot sequence (very end):

```javascript
loadAppConfig(function () {
  var pending = 2;
  function definitionsReady() { if (--pending === 0) boot(); }
  loadMicroDefinitions(definitionsReady);
  loadLongevityDefinitions(definitionsReady);
});
// boot(): loadFoodDefinitions → loadKeywordReorderOpen → loadKeywordCaloriesOpen →
//         loadDayNotes → loadDayEditorHeight → loadDemographic → loadTdee →
//         renderDemographicUi → syncSettingsTdeeInput → renderKeywords → refreshAll →
//         maybeShowStarterGuideImportStep
```
