# AGENTS_CODE_REFERENCE-core.md

> **Approximate locations only** — no exact line numbers. Code moves; use section names and relative position within `app.js` (~14,200 lines).

Core logic: food definitions, matching, highlighting orchestration, dashboard totals, micro % DV, longevity panel, definition modals, localStorage.

Parent overview: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Module responsibility

| Concern | Primary symbols |
|---------|-----------------|
| In-memory state | `keywords[]`, `demographic`, `userTdee`, `userBodyWeightKg`, `settingsWeightUnit`, `dayHighlightsEnabled`, `microRequirementsOpen`, `microViewDaily`, `showMicroDailyDv`, `microConditionFocus`, `longevityPanelOpen`, `weekTotalOpen`, `keywordReorderOpen`, `keywordCaloriesOpen`, `keywordsPageIndex`, `keywordsPageSize`, `keywordsFilterQuery`, `dashboardMacroPctView`, `lastWeekTotals`, `activeMicroId`, `activeLongevityId`, `activeImportId/Index`, `activePositionId/Index`, `activeMicroDefKey`, `activeLongevityDefKey`, `activeMicroSourcesKey/Scope`, `activeLongevitySourcesKey/Kind`, `defModalReturnSources`, `longevityNavActiveIndex`, `targetRefPopoverAnchor` |
| IDs | `makeId()`, `findIndex(id)` |
| Table UI | `renderKeywords` (renders current filtered page only), `syncFieldFromDom`, `syncAllFieldsFromDom`, `moveKeyword`, `removeKeyword`, `addKeyword`, `sortKeywordsAlphabetically`, reorder toggle (`loadKeywordReorderOpen`), move-to-position modal |
| Table search / pagination | `keywordMatchesFilter`, `keywordsFilteredIndices`, `setKeywordsFilterQuery`, `clearKeywordsFilter`, `keywordsPageCount`, `clampKeywordsPageIndex`, `keywordsPageBounds`, `goKeywordsPage`, `changeKeywordsPageSize`, `updateKeywordsPaginationUi`, `updateKeywordsSearchUi`, `loadKeywordsPageSize`, `saveKeywordsPageSize` |
| Matching | `countKeyword` (applies `keywordServingMultiplier`), `keywordNames`, `buildHighlightRegex`, `keywordMatchPattern`, `escapeRegex`, `keywordServingMultiplier`, `stripKeywordServingMultiplier`, `lineMatchesFoodDefinition` |
| Macro totals | `totalsFromText`, `addTotals`, `renderDashboard`, `dashboardCardHtml`, `dashboardMacroPctView`, `macroPctFromTotals`, `renderWeekSummary`, `setWeekTotalOpen` |
| Micro totals / target | `microTotalsFromText`, `weekMicroTotals`, `applyFiberTotalToMicroTotals`, `renderMicroRequirements`, `renderMicroWeeklyList`, `renderMicroDailyGrid`, `setMicroViewDaily`, `loadMicroViewDaily`, `saveMicroViewDaily`, `setShowMicroDailyDv`, `loadShowMicroDailyDv`, `saveShowMicroDailyDv`, `syncMicroViewToggleUi`, `syncMicroDailyDvToggleUi`, `microBaseDisplayFields`, `microConditionDisplayFields`, `dailyDv`, `microNutrientTargetPct` (FDA DV → IOM bw min → study max → none), `microTargetReqAmountText`, `iomBwMinDaily`/`iomBwMinPct`, `studyMaxMicroRef`, `microHasNoStandaloneRef`, `microRequiresDailyIntake`, `microConditionDisplayFields`, `setMicroConditionFocus`, `microBaseDisplayFields` (core + extended + condition longevity keys when More nutrients open) |
| Derived micro metrics | `MICRO_DERIVED_DEFS`, `insolubleToSolubleFiberRatio`, `insolubleToSolubleFiberTargetPct`, `microDerivedRowTargetDisplay`, `microDerivedAmtText`, `microDerivedDefByKey`, `microDisplayFieldByKey` |
| Fiber split | `solubleFiberRatioForFoodName`, `splitTotalFiber`, `fiberTotalFromParts` |
| Target-ref badges | `showTargetRefPopover`, `toggleTargetRefPopover`, `positionTargetRefPopover`, `hideTargetRefPopover`, `bindTargetRefPopover`, `initTargetRefPopoverEvents`, `targetRefKindKey`, `targetRefDetailHtml` |
| Longevity | `longevityTotalsFromText`, `renderLongevityPanel`, `renderLongevityGiBuckets`, `setLongevityPanelOpen`, `longevityBarHtml`, `longevityBarShowsRefNotch`, `longevityBarRefPopoverLabel`, `resolveLongevityValue` (carotenoids ← vitamin A fallback), longevity nav (`buildLongevityNavAllList`, `scrollLongevityNavToSection`, `applyInitialLongevityHash`, `longevitySectionFromHash`), blank/normalize/merge helpers (below) |
| Ranked food sources | `microContributionsFromText`, `microContributionsForScope`, `longevityContributionsFromWeek`, `glycemicLoadContributionsFromWeek`, `nutrientSourcesListHtml`, `openMicroSourcesModal`, `openLongevitySourcesModal`, `microSourcesIconHtml`, `longevitySourcesIconHtml`, `microDailyIntakeIconHtml`, `appendMicroDailyIntakeIconHtml`, `showMicroDailyIntakePopover`, `hideMicroDailyIntakePopover`, `handleMicroDailyIntakeClick`, `microSourcesRequirementsHtml` (FDA/IOM/study reference block) |
| Settings / TDEE / weight | `openSettingsModal`, `loadTdee`, `saveTdee`, `getTdee`, `getTdeeBaseline`, `loadBodyWeight`, `saveBodyWeight`, `getBodyWeightKg`, `settingsWeightKgFromInput`, `syncSettingsWeightInput`, `setSettingsWeightUnit`, `readSettingsWeightFromInput`, `openTdeeCalculatorModal`, `calcMifflinStJeor`, `openTdeeHintModal`, `openMacroSplitHintModal`, `renderMacroSplitCarousel`, `MACRO_BODY_TYPES` |
| Definition modals | `openMicroDefModal`, `renderMicroDefBody`, `openLongevityDefModal`, `renderLongevityDefBody`, `setMicroDefFullscreen`, `setDefModalReturnSources`, `returnFromDefModalToSources`, `microDefConditionSectionHtml`, `vitaminKKeyDifferencesHtml`, `fiberBulkingTypeHtml`, `insolubleToSolubleFiberCompareHtml`, `loadMicroDefinitions`, `loadLongevityDefinitions`; long food-note reader `openFoodNoteModal` / `closeFoodNoteModal` / `foodNoteBodyHtml` |
| % target tiers | `loadAppConfig`, `tierForMicroPct`, `tierForLongevityPct`, `tierForPctInList`, `pctInlineStyle` |
| Demographic | `loadDemographic`, `saveDemographic`, `setDemographic`, `renderDemographicUi` (updates `#settings-demographic-icon`); targets in `demographic-dv.js` (`DAILY_MICRO_DV`, `CALORIE_BASELINE`, `DAILY_INTAKE_MICRO_KEYS`, `requiresDailyIntake`, `IOM_BW_MIN_MG_PER_KG`, `getIomBwMinDaily`, `FIBER_COMPONENT_DV_RATIO`) |
| Highlights / editor modes | `updateDayHighlights`, `highlightedHtml`, `highlightedDayHtml`, `highlightServingMultipliersHtml`, `setDayEditorMode`, `updateDayEditorMode`, `backdropCaretRect`, `caretIndexFromBackdropPoint`, `setDayInputSelection`, `dayHighlightsEnabled` + `loadDayHighlightsPreference`/`saveDayHighlightsPreference`/`setDayHighlightsEnabled`/`syncDayHighlightsToggleUi`, `refreshAll`, `syncScroll` |
| Unmatched lines | `unmatchedDayLines`, `allUnmatchedDayLines`, `weekUnmatchedLinesHtml`, `updateWeekUnmatchedLines`, `anyDayTextareaFocused` |
| Food-name suggestions | `updateDaySuggest`, `foodSuggestMatches`, `applyDayFoodSuggest`, `hideDaySuggest`, `DAY_SUGGEST_MAX`; per-item fit/scroll: `fitDaySuggestItemLabel`, `updateDaySuggestItemHover`, `bindDaySuggestHover`, `bindDaySuggestResize`, `daySuggestItemScrollTo`, `daySuggestItemUpdateChevrons` |
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

- Renders **only the current filtered page** (`keywordsPageBounds().indices`), not all rows.
- Builds one `<tr data-id="…">` per visible item.
- Columns: reorder (↑↓, shown when reorder toggle open), name, protein/carbs/fats inputs, micros button (`microsButtonHtml`), longevity button (`longevityButtonHtml`), actions (Import, Delete).
- Row actions use `data-action`: `up` | `down` | `delete` | `micros` | `longevity` | `import` | `position` (move-to-position modal).
- After building rows: toggles `#keywords-empty` (no foods at all), `#keywords-filter-empty` + hides `#keywords-table` (filtered to zero), then `updateKeywordReorderUi` / `updateKeywordCaloriesUi` / `updateKeywordsPaginationUi`.

**Search / pagination** — the toolbar `#keywords-search` (+ `#keywords-search-clear`) sets `keywordsFilterQuery` via `setKeywordsFilterQuery` (case-insensitive substring on name; resets to page 0). `#keywords-page-size` (10/25/50/100/All) persists to `STORAGE_KEY_KEYWORDS_PAGE_SIZE`; First/Prev/Next/Last (`#keywords-page-*`) call `goKeywordsPage`. `keywordsFilteredIndices` maps visible rows back to real `keywords[]` indices, so editing/import/position operations always use the true index.

**Sort A–Z** — `sortKeywordsAlphabetically` (bound to `#sort-foods-alphabetically` and `#sort-foods-alphabetically-top`): `syncAllFieldsFromDom` first (don’t lose in-progress edits), sort by lowercased trimmed name (blanks last), reset to page 0, save + re-render.

**Inline edit** — delegated `input` on `#keywords-list`:

- `syncFieldFromDom(row)` reads `data-field` inputs into `keywords[i]`; `syncAllFieldsFromDom` flushes every rendered row before actions that re-render or reorder.
- Macros use `parseMacro` on input (empty → stored as `""`).

**Reorder/delete/add** — `moveKeyword`, `removeKeyword`, `addKeyword`; each saves and calls `renderKeywords` + `refreshAll`. `addKeyword` jumps to the last page so the new row is visible. Closing modals if the active row is removed/moved. The reorder column visibility is a persisted UI flag (`keywordReorderOpen`, `STORAGE_KEY_REORDER`).

## Matching & counting

**Whole-word regex** per food name (via `keywordMatchPattern(escapeRegex(name))`):

```javascript
new RegExp("\\b" + escapeRegex(name) + "\\b", "gi")
```

**`totalsFromText(text)`** (middle of `app.js`):

- Dedupes by lowercase name (first definition wins if duplicates).
- `hits = countKeyword(text, name)` — each match adds `hits ×` macro grams.
- Returns `{ protein, carbs, fats, proteinCal, carbsCal, fatsCal, totalCal }`.

**Serving multiplier** — a food line may end with `* N` (e.g. `oatmeal * 2`). `countKeyword` calls `keywordServingMultiplier(text, afterMatchIndex)` (regex `KEYWORD_SERVING_MULTIPLIER_RE`) so each match contributes `N` instead of `1`; `stripKeywordServingMultiplier` removes the suffix for exact line-match checks (`lineMatchesFoodDefinition`). The multiplier text is highlighted separately as `.hl.hl--multiplier` via `highlightServingMultipliersHtml` (wrapped by `highlightedDayHtml`).

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

`microTotalsFromText` mirrors macro matching (hits × per-food micros). Panel rows span `MICRO_FIELDS`, `MICRO_EXTENDED_FIELDS`, and derived `MICRO_DERIVED_DEFS`.

- **Weekly average view** (default): average daily amount = week sum ÷ `DAYS.length` (7). **% target** comes from `microNutrientTargetPct(key, avgDaily)`, which picks the first available reference: **FDA % DV** (`dailyDv` → `getDailyMicroDv`, e.g. female iron 18 mg, male 8 mg), else **IOM body-weight minimum** (`iomBwMinPct`, amino acids; needs body weight set), else **study max** (`STUDY_MAX_MICRO_REFS`; `limiting: true` so high = red), else unscored (`NO_STANDALONE_REF_MICRO_KEYS`). Rendered by `renderMicroWeeklyList` into `#dashboard-micro-list`.
- **Target-ref badge** — each row shows a `.dashboard__target-ref` badge (`data-target-ref` = `dv` | `iom` | `studyMax` | `none`) whose click toggles `#target-ref-popover` explaining which reference and amount is used (`showTargetRefPopover` / `targetRefDetailHtml`). Bound once via `initTargetRefPopoverEvents` on the micro list, daily grid, and longevity content.
- **Condition focus / intake filter** (`MICRO_CONDITION_FOCUS` + `MICRO_INTAKE_FILTER`, `#dashboard-micro-condition-toggle`): filters rows to condition-relevant micros (+ optional `longevityNutrients` such as `creatine`, `saturatedFat`, `glycemicIndex` for **Hair loss**), or to poorly-/well-absorbed sets (`poorlyAbsorbed` uses `microRequiresDailyIntake`). Adds a **Focus:** section at top of explain modals when JSON has matching condition key. Session-only condition id (not persisted); **weekly/daily view** and **Show targets** are persisted (`STORAGE_KEY_MICRO_VIEW_DAILY`, `STORAGE_KEY_MICRO_SHOW_DV`). Condition-specific tip asides: `#micro-tip-caffeine` (hidden when any filter active), `#micro-tip-cataracts`, `#micro-tip-hair-loss`.
- **My food** bar-chart button on each row (`microSourcesIconHtml`, `data-micro-sources`) opens `#micro-sources-modal` — ranked matched foods with per-hit calculations; scope select (week or single day). Requirements block (`microSourcesRequirementsHtml`) lists FDA daily/weekly, IOM bw min (daily/weekly when weight set), and study-max references.
- **Daily intake icon** — pill button (`.dashboard__micro-daily-intake-btn`, `data-micro-daily-intake`) appears next to **My food** when `NutrientsDemographicDv.requiresDailyIntake(key)` is true (keys listed in `DAILY_INTAKE_MICRO_KEYS` in `demographic-dv.js` — fiber + soluble/insoluble fiber, water-soluble vitamins except B12, steady electrolytes/minerals, choline, essential amino acids, ALA). Click toggles `#micro-daily-intake-popover` (fixed tooltip) explaining that poor body storage makes weekly ÷7 averaging misleading; does not open the sources modal. Hidden on re-render, outside click, and scroll (`hideMicroDailyIntakePopover`).
- **Each-day view** (`setMicroViewDaily(true)`, persisted): `renderMicroDailyGrid` builds a per-day grid into `#dashboard-micro-daily-grid`; a **More nutrients** control reveals the `MICRO_EXTENDED_FIELDS` rows plus longevity keys referenced by any `MICRO_CONDITION_FOCUS.longevityNutrients`.
- **Show targets** (`showMicroDailyDv`, `#dashboard-micro-dv-toggle`, label “Show targets”, persisted): appends the daily requirement text (`microTargetReqText` / `microTargetReqAmountText`).
- **% color/weight** from `config.json` `microDvStatus.tiers` via `tierForMicroPct` / `microPctInlineStyle`; limiting refs (study max) use the inverted scale.
- **Learn more:** each nutrient row carries `data-micro-def`; click opens `openMicroDefModal`.

**Derived rows** — `MICRO_DERIVED_DEFS.insolubleToSolubleFiber` renders after `insolubleFiber`: `microDerivedAmtText` shows the average `insoluble:soluble` ratio and `microDerivedRowTargetDisplay` → `insolubleToSolubleFiberTargetPct` scores closeness to the 3:1 ideal (100% at exactly 3:1, falling off either side).

Toggle/view state for weekly vs each-day and Show targets is **persisted**; demographic + body weight are persisted separately.

**Vitamin K breakdown** — total `vitaminK` keeps FDA % DV (120 mcg male / 90 female). Optional subforms `vitaminK1`, `vitaminK2`, `vitaminK2MK4`, `vitaminK2MK7` live in `micros`, bridge to longevity (`longevity: true`), and are listed in `NO_STANDALONE_REF_MICRO_KEYS` (tracked, not independently scored). `vitaminK2MK4` is in `DAILY_INTAKE_MICRO_KEYS` (short half-life). Explain modals append `vitaminKKeyDifferencesHtml` for K1/K2; calcification section adds K2/MK-4/MK-7 tip asides.

## Longevity panel

`longevityTotalsFromText` mirrors matching for `LONGEVITY_FIELDS` (and the micro keys reused via `LONGEVITY_FROM_MICRO` / `LONGEVITY_COMPOUNDS_FROM_MICRO`).

**`renderLongevityPanel`** builds sections from `LONGEVITY_GROUPS` plus derived blocks (see `LONGEVITY_SECTION_DEFS` — includes bone density, calcification, TMAO, glycemic):

- Groups from `LONGEVITY_GROUPS` (the `group` field on each `LONGEVITY_FIELDS` entry): **Fats & cholesterol** (includes `plantSterols`, 2 g/day DV; also lists micro-sourced LDL helpers via `LONGEVITY_FATS_AIM_FROM_MICRO` and omega triglyceride rows via `LONGEVITY_FATS_AIM_FROM_LONGEVITY` + derived EPA+DHA), **Omega fatty acids**, **Glutathione support**, **DNA repair support**, **Longevity & inflammation compounds** (includes limiting `creatine`), **Carb quality**. (The micros modal `initLongevityForm` skips the `glutathione` group since those come from micro entries.)
- **Female hormones** nav sections (`FEMALE_HORMONE_NAV_SECTIONS`) surface only for the female demographic.
- **Micronutrients from food**, **Bone density**, **Calcification & vascular balance** — repeat micro/longevity entries so users reason in one place (calcification lists K total + K1/K2/MK-4/MK-7 separately; K2 subform tips via `calcificationVitaminK2TipHtml` / `calcificationVitaminK2SubformsTipHtml`).
- **Visceral fat** (`sectionVisceralFat`) — antioxidant rows from micro (`LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_MICRO`) and longevity compounds including **carotenoids** (`LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_LONGEVITY`); tips via `visceralFatBuildupTipHtml` / `visceralFatMobilizationTipHtml` / `visceralFatGlpTipHtml`.
- **TMAO balance** — precursors vs lowering factors; inline tips link to `#tmao-protectors-tip-modal`.
- **Derived scores** (`LONGEVITY_DERIVED_DEFS`): omega-6:omega-3 ratio, saturated:unsaturated ratio, EPA+DHA, glycemic load.
- **Glycemic load & GI distribution** — `renderLongevityGiBuckets`; GL rows use color by GI tier.
- **Section nav** — sticky `#dashboard-longevity-nav` (prev/next + “All topics”) scroll-spies `#dashboard-longevity-content` sections; URL hash `#longevity/{sectionDefKey}` deep-links (`applyInitialLongevityHash` at boot, `setLongevityNavHash` on nav).
- **Level bars** — `longevityBarHtml` wraps fill + optional **100% reference notch** (`.dashboard__longevity-bar-notch`): shown when the row has a scored reference (`longevityBarShowsRefNotch`); hover/focus popover displays the daily reference amount (`longevityBarRefPopoverLabel`).
- **My food** icons on rows (`longevitySourcesIconHtml`, `data-longevity-sources`) open `#longevity-sources-modal` with ranked contributions; glycemic load uses special GL-per-serving ranking. Rows whose `sourcesKey` is in `DAILY_INTAKE_MICRO_KEYS` also get the daily-intake pill icon (same popover as the micro panel).

**Carotenoids** — stored under `longevity.carotenoids` (mg); DV 15 mg/day. When not set on a food, `resolveLongevityValue` estimates mg from `micros.vitaminA` when vit A > 50 mcg (÷ 100). Ranked sources and panel totals use `resolveLongevityValue`, not raw `kw.longevity.carotenoids`.

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
- **`openMicroDefModal(key)` / `renderMicroDefBody`** — optional **Focus:** section from `microDefConditionSectionHtml`; soluble/insoluble fiber rows append `fiberBulkingTypeHtml`; K1/K2 append `vitaminKKeyDifferencesHtml`; general paragraphs (`tooLow` / `enough` / `tooHigh`), `foodSources`, then sex-specific (`male` / `female`) notes. Second arg `returnTo` sets `defModalReturnSources` for **← My food** back nav.
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

Demographic + TDEE + body weight live in **`#settings-modal`** (header `#settings-open`), not a bottom panel.

- **Sex** — same `setDemographic` / `#demographic-options` radios; updates `#settings-demographic-icon` and micro % target immediately.
- **Body weight** — `#settings-weight` number input + kg/lb unit toggle (`#settings-weight-kg` / `#settings-weight-lb`, default lb). Stored internally as kg (`userBodyWeightKg`, persisted `STORAGE_KEY_BODY_WEIGHT_KG`) via `readSettingsWeightFromInput` / `settingsWeightKgFromInput`; used only for **IOM bw min** amino-acid targets (`getBodyWeightKg` → `iomBwMinDaily`). No weight = amino-acid IOM rows show “set weight”.
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
| `nutrients-body-weight-kg` | Optional positive number string; kg, converted from lb on input; used for IOM bw min |
| `nutrients-day-notes` | `{ mon … sun }` string values per day id |
| `nutrients-day-editor-height` | Pixel height string for all `.day__editor` boxes (clamped 6rem–80vh) |
| `nutrients-day-highlights` | `"on"` / `"off"` — food highlighting pen toggle (default on) |
| `nutrients-micro-view-daily` | `"true"` / `"false"` — micro panel each-day grid vs weekly average list |
| `nutrients-micro-show-dv` | `"true"` / `"false"` — micro panel **Show targets** (requirement text on rows) |
| `nutrients-keywords-reorder-open` | `"true"` / `"false"` reorder column visibility |
| `nutrients-keywords-calories-open` | `"true"` / `"false"` food table g ↔ cal column mode |
| `nutrients-keywords-page-size` | `"10"`/`"25"`/`"50"`/`"100"`/`"0"` (All); default 25 |
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

## Highlighting & editor modes (logic side)

Each `.day__editor` is in one of three modes (set via `setDayEditorMode` → class `day__editor--editing|viewing|plain`), chosen by `updateDayEditorMode(textarea)`:

- **editing** — the textarea is focused: show the plain textarea (no overlay drift), so typing lands exactly where the caret is.
- **viewing** — blurred with highlights on: show the `.day__backdrop` (highlighted, escaped HTML) over a hidden textarea; a `mousedown` on the backdrop maps the click to a caret index (`caretIndexFromBackdropPoint` using `backdropCaretRect`), switches to editing, and restores the selection (`setDayInputSelection`).
- **plain** — highlights disabled (`dayHighlightsEnabled` false): backdrop cleared, textarea shown.

**`updateDayHighlights(textarea)`** (called in editing/refresh): sets `backdrop.innerHTML = highlightedDayHtml(value, regex)`; when the value is empty it shows the placeholder as `.day__backdrop-placeholder`; `syncScroll` copies scroll position.

**`highlightedHtml`** — walks regex matches, wraps in `<mark class="hl">`; escapes all text. **`highlightedDayHtml`** additionally wraps `* N` multipliers in `.hl--multiplier`.

**Highlights toggle** — the pen `#day-highlights-toggle` calls `setDayHighlightsEnabled`, persisted to `STORAGE_KEY_DAY_HIGHLIGHTS`; `loadDayHighlightsPreference` at boot, `syncDayHighlightsToggleUi` reflects state and re-applies editor modes.

UI mirror pattern: [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)

## Unmatched day-meal lines

Below the week toolbar, `#day-unmatched-lines` (`.week__unmatched-lines`) lists non-empty day-meal lines that don’t exactly match a food definition, so users can spot typos or missing definitions.

- **Detect** — `unmatchedDayLines(text)` splits on `\n`, skips blank lines, keeps lines where `lineMatchesFoodDefinition(line)` is false (the check strips any `* N` multiplier first). `allUnmatchedDayLines` walks all seven days, tagging `dayLabel` + `lineNum`.
- **Render** — `updateWeekUnmatchedLines` (from `refreshAll` and `applyDayNoteChange`) builds `weekUnmatchedLinesHtml`; hidden entirely when highlights are off or any day textarea is focused (`anyDayTextareaFocused`).

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
- **Long names** — each item carries a `title` tooltip and its label auto-shrinks to fit on hover (`fitDaySuggestItemLabel` / `daySuggestItemLabelWidth`, wired by `bindDaySuggestHover`); items that still overflow expose left/right chevrons (`data-action="scroll-suggest-left|right"`, `daySuggestItemScrollTo` / `daySuggestItemUpdateChevrons`).
- The popover is user-resizable (`bindDaySuggestResize`).
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
| Change micro DV profile | `demographic-dv.js` → `DAILY_MICRO_DV`; keys must match `MICRO_FIELDS` / `MICRO_EXTENDED_FIELDS` |
| Add trace mineral / amino acid | `MICRO_EXTENDED_FIELDS` (amino acids use `group: "amino"`); micro form separators + daily-grid **More nutrients** follow |
| Add amino-acid IOM target | `demographic-dv.js` → `IOM_BW_MIN_MG_PER_KG`; requires body weight to score |
| Add study-only reference | `STUDY_MAX_MICRO_REFS` (ceiling) or `NO_STANDALONE_REF_MICRO_KEYS` (unscored breakdown, e.g. K1/K2/MK-4/MK-7); surfaced by `microNutrientTargetPct` |
| Add vitamin K subform | `MICRO_FIELDS` keys + optional `longevity: true` bridge; `NO_STANDALONE_REF_MICRO_KEYS`; explain copy in `vitaminKKeyDifferencesHtml` |
| Add plant sterols / creatine | `LONGEVITY_FIELDS` + `DAILY_LONGEVITY_DV` (plantSterols 2 g); creatine is `limiting: true`, no DV |
| Carotenoids without explicit food value | `resolveLongevityValue` vitamin-A fallback; set `carotenoids: 15` in `longevity-dv.js` |
| Longevity 100% bar notch | `longevityBarHtml`, `longevityBarShowsRefNotch`, CSS `.dashboard__longevity-bar-notch` |
| Persist micro panel toggles | `STORAGE_KEY_MICRO_VIEW_DAILY`, `STORAGE_KEY_MICRO_SHOW_DV`, load/save in `boot()` |
| Condition longevity rows in micro panel | `MICRO_CONDITION_FOCUS.*.longevityNutrients` + `microConditionDisplayFields` |
| Add derived micro metric | `MICRO_DERIVED_DEFS` + `microDerivedRowTargetDisplay` / `microDerivedAmtText` |
| Change fiber soluble/insoluble split | `solubleFiberRatioForFoodName` (name heuristics) + `FIBER_COMPONENT_DV_RATIO` in `demographic-dv.js` |
| Change food-table page sizes | `keywordsPageSize` options in HTML + `loadKeywordsPageSize` allowlist |
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

Listeners are attached in the **last ~20%** of the file: keywords table click/input, table search + pagination + sort buttons, per-day `bindDay` loop (focus/blur editor modes, backdrop click-to-caret), `bindDayEditorResize`, dashboard toggles (week/micro/longevity/print + micro view/targets), condition/filter dropdown, target-ref popover (`initTargetRefPopoverEvents`), micros + longevity modals, definition modals (`data-micro-def` / `data-longevity-def`), long food-note modal, demographic options + body-weight input/unit, phosphorus/caffeine tip modals, starter guide dismiss + empty-state sample link, and import/sample modals — see [import doc](./AGENTS_CODE_REFERENCE-import.md).

Boot sequence (very end):

```javascript
loadAppConfig(function () {
  var pending = 3;
  function definitionsReady() { if (--pending === 0) boot(); }
  loadMicroDefinitions(definitionsReady);
  loadLongevityDefinitions(definitionsReady);
  loadFoodNotesDefinitions(definitionsReady);
});
// boot(): loadFoodDefinitions → loadKeywordReorderOpen → loadKeywordCaloriesOpen →
//         loadKeywordsPageSize → loadDayNotes → loadDayHighlightsPreference →
//         loadDayEditorHeight → loadMicroViewDaily → loadShowMicroDailyDv →
//         syncMicroDailyDvToggleUi / syncMicroViewToggleUi →
//         loadDemographic → loadTdee → loadBodyWeight →
//         renderDemographicUi → syncSettingsTdeeInput / syncSettingsWeightInput →
//         renderKeywords → initLongevityNav → initTargetRefPopoverEvents →
//         refreshAll → applyInitialLongevityHash → maybeShowStarterGuideImportStep
```
