# AGENTS_CODE_REFERENCE-core.md

> **Approximate locations only** — no exact line numbers. Code moves; use section names and relative position within `app.js` (~19,800 lines).

Core logic: food definitions, matching, highlighting orchestration, dashboard totals, micro % DV, sticky icon show/filter/highlight + By Nutrients filter, acute toxicity, longevity panel, definition modals, multi-week diary, diary favorites, mobile days carousel, multi-user auth + `NutrientsPersist` localStorage.

Parent overview: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Module responsibility

| Concern | Primary symbols |
|---------|-----------------|
| In-memory state | `keywords[]`, `demographic`, `userTdee`, `userBodyWeightKg`, `settingsWeightUnit`, `dayHighlightsEnabled`, `dayMealsByDate`, `viewedWeekStart`, `diaryFavorites`, `activeFavoriteDayKey`, `favoriteEditPending`, `microRequirementsOpen`, `microViewDaily`, `showMicroDailyDv`, `showAcuteSideEffects`, `showAcuteAdverseEffects`, `showDailyIntakeIcons`, `filterStickyDailyIntake` / `filterStickySideEffects` / `filterStickyAdverseEffects`, `filterStickyNutrientKeys`, `highlightStickyDailyIntake` / `highlightStickySideEffects` / `highlightStickyAdverseEffects`, `microConditionFocus`, `longevityPanelOpen`, `weekTotalOpen`, `keywordReorderOpen`, `keywordCaloriesOpen`, `keywordsPageIndex`, `keywordsPageSize`, `keywordsFilterQuery`, `keywordsCategoryFilter`, `foodCategories`, `dashboardMacroPctView`, `lastWeekTotals`, `unmatchedCarouselOpen` / `unmatchedCarouselIndex` / `unmatchedCarouselItems`, `activeMicroId`, `activeLongevityId`, `activeImportId/Index`, `activePositionId/Index`, `activeMicroDefKey`, `activeLongevityDefKey`, `activeMicroSourcesKey/Scope`, `activeLongevitySourcesKey/Kind`, `defModalReturnSources`, `longevityNavActiveIndex`, `targetRefPopoverAnchor`, `microAcuteToxicityPopoverAnchor` |
| IDs | `makeId()`, `findIndex(id)` |
| Table UI | `renderKeywords` (renders current filtered page only), `syncFieldFromDom`, `syncAllFieldsFromDom`, `moveKeyword`, `removeKeyword`, `addKeyword`, `sortKeywordsAlphabetically`, reorder toggle (`loadKeywordReorderOpen`), move-to-position modal |
| Table search / pagination | `keywordMatchesFilter`, `keywordMatchesCategory`, `keywordsFilteredIndices`, `keywordsHasActiveFilter`, `setKeywordsFilterQuery`, `clearKeywordsFilter`, `setKeywordsCategoryFilter`, `clearKeywordsCategoryFilter`, `openKeywordsCategoryModal`, `keywordsCategoryCounts`, `foodCategoryIdForName`, `loadFoodCategoriesDefinitions`, `keywordsPageCount`, `clampKeywordsPageIndex`, `keywordsPageBounds`, `goKeywordsPage`, `changeKeywordsPageSize`, `updateKeywordsPaginationUi`, `updateKeywordsSearchUi`, `loadKeywordsPageSize`, `saveKeywordsPageSize` |
| Matching | `countKeyword` (applies `keywordServingMultiplier`), `keywordNames`, `buildHighlightRegex`, `keywordMatchPattern`, `escapeRegex`, `keywordServingMultiplier`, `stripKeywordServingMultiplier`, `lineMatchesFoodDefinition` |
| Macro totals | `totalsFromText`, `addTotals`, `renderDashboard`, `dashboardCardHtml` (`.dashboard__card--today` via `activeTodayDayId`; `.dashboard__date`), `dashboardMacroPctView`, `macroPctFromTotals`, `renderWeekSummary`, `setWeekTotalOpen` |
| Micro totals / target | `microTotalsFromText`, `weekMicroTotals`, `applyFiberTotalToMicroTotals`, `renderMicroRequirements`, `renderMicroWeeklyList`, `renderMicroDailyGrid`, `microDayCardHtml` (today card via `activeTodayDayId` + date label), `setMicroViewDaily`, `loadMicroViewDaily`, `saveMicroViewDaily`, `setShowMicroDailyDv`, `loadShowMicroDailyDv`, `saveShowMicroDailyDv`, `syncMicroViewToggleUi`, `syncMicroDailyDvToggleUi`, `microBaseDisplayFields`, `microConditionDisplayFields`, `dailyDv`, `microNutrientTargetPct` (FDA DV → IOM bw min → study min → study max → none), `microTargetReqAmountText`, `iomBwMinDaily`/`iomBwMinPct`, `studyMinMicroRef`, `studyMaxMicroRef`, `microHasNoStandaloneRef`, `microRequiresDailyIntake`, `setMicroConditionFocus` |
| Sticky icon UX | `loadShowAcuteToxicityIcons` / `setShowAcuteToxicityIcons` / `syncAcuteToxicityToggleUi`, `loadShowDailyIntakeIcons` / `setShowDailyIntakeIcons` / `syncDailyIntakeIconsToggleUi`, `microStickyFilterActive` / `microStickyIconFilterActive` / `microKeyMatchesStickyFilter` / `setStickyIconFilter` / `clearStickyIconFilters` / `loadStickyIconFilters` / `saveStickyIconFilters`, `filterStickyNutrientKeys` / `normalizeFilterStickyNutrientKeys` / `applyNutrientFilterPreset` / `addStickyNutrientFilter` / `removeStickyNutrientFilter` / `syncNutrientFilterUi` / `nutrientFilterSuggestMatches`, `microStickyHighlightActive` / `setStickyIconHighlight` / `clearStickyIconHighlights` / `loadStickyIconHighlights`, `refreshStickyIconFilterViews`, `clearMicroConditionFocusForStickyFilter` |
| Acute toxicity | `ACUTE_TOXICITY_BY_MICRO`, `microAcuteToxicityEntry`, `microAcuteToxicityEffects`, `microAcuteToxicityIconHtml`, `microAcuteToxicityIconsHtml`, `showMicroAcuteToxicityPopover`, `hideMicroAcuteToxicityPopover`, `handleMicroAcuteToxicityClick` |
| Derived micro metrics | `MICRO_DERIVED_DEFS` (`insolubleToSolubleFiber2To1` ideal 2, `insolubleToSolubleFiber` ideal 3), `insolubleToSolubleFiberRatio`, `insolubleToSolubleFiberTargetPct`, `microDerivedRowTargetDisplay`, `microDerivedAmtText`, `microDerivedDefByKey`, `microDisplayFieldByKey` |
| Fiber split | `solubleFiberRatioForFoodName`, `splitTotalFiber`, `fiberTotalFromParts` |
| Target-ref badges | `showTargetRefPopover`, `toggleTargetRefPopover`, `positionTargetRefPopover`, `hideTargetRefPopover`, `bindTargetRefPopover`, `initTargetRefPopoverEvents`, `targetRefKindKey`, `targetRefDetailHtml` |
| Longevity | `longevityTotalsFromText`, `renderLongevityPanel`, `renderLongevityGiBuckets`, `setLongevityPanelOpen`, `longevityBarHtml`, `longevityBarShowsRefNotch`, `longevityBarRefPopoverLabel`, `resolveLongevityValue` (carotenoids ← vitamin A fallback), longevity nav (`buildLongevityNavAllList`, `scrollLongevityNavToSection`, `applyInitialLongevityHash`, `longevitySectionFromHash`), section maps (`LONGEVITY_UPPER_GI_*`, `LONGEVITY_LIVER_*`, `LONGEVITY_KIDNEY_*`, `LONGEVITY_GRAY_HAIR_*`, `LONGEVITY_ACHES_*`, `LONGEVITY_BRAIN_*`, `LONGEVITY_BRAIN_ASTROCYTE_*`), `VASCULAR_SODIUM_LIMIT_REFS` / `longevityRowFromMicroLimit` / `vascularSodiumLimitRowsHtml`, blank/normalize/merge helpers (below) |
| Ranked food sources | `microContributionsFromText`, `microContributionsForScope`, `longevityContributionsFromWeek`, `glycemicLoadContributionsFromWeek`, `nutrientSourcesListHtml`, `openMicroSourcesModal`, `openLongevitySourcesModal`, `microSourcesIconHtml`, `longevitySourcesIconHtml`, `microDailyIntakeIconHtml`, `appendMicroDailyIntakeIconHtml` (also appends acute icons), `showMicroDailyIntakePopover`, `hideMicroDailyIntakePopover`, `handleMicroDailyIntakeClick`, `microSourcesRequirementsHtml` (FDA/IOM/study reference block) |
| Settings / TDEE / weight | `openSettingsModal`, `loadTdee`, `saveTdee`, `getTdee`, `getTdeeBaseline`, `loadBodyWeight`, `saveBodyWeight`, `getBodyWeightKg`, `settingsWeightKgFromInput`, `syncSettingsWeightInput`, `setSettingsWeightUnit`, `readSettingsWeightFromInput`, `openTdeeCalculatorModal`, `calcMifflinStJeor`, `openTdeeHintModal`, `openMacroSplitHintModal`, `renderMacroSplitCarousel`, `MACRO_BODY_TYPES` |
| Definition modals | `openMicroDefModal`, `renderMicroDefBody`, `openLongevityDefModal`, `renderLongevityDefBody`, `setMicroDefFullscreen`, `setDefModalReturnSources`, `returnFromDefModalToSources`, `microDefConditionSectionHtml`, `vitaminKKeyDifferencesHtml`, `fiberBulkingTypeHtml`, `insolubleToSolubleFiberCompareHtml`, `loadMicroDefinitions`, `loadLongevityDefinitions`; long food-note reader `openFoodNoteModal` / `closeFoodNoteModal` / `foodNoteBodyHtml` |
| % target tiers | `loadAppConfig`, `tierForMicroPct`, `tierForLongevityPct`, `tierForPctInList`, `pctInlineStyle` |
| Demographic | `loadDemographic`, `saveDemographic`, `setDemographic`, `renderDemographicUi` (updates `#settings-demographic-icon`); targets in `demographic-dv.js` (`DAILY_MICRO_DV`, `CALORIE_BASELINE`, `DAILY_INTAKE_MICRO_KEYS`, `requiresDailyIntake`, `IOM_BW_MIN_MG_PER_KG`, `getIomBwMinDaily`, `FIBER_COMPONENT_DV_RATIO`) |
| Highlights / editor modes | `updateDayHighlights`, `highlightedHtml`, `highlightedDayHtml`, `highlightServingMultipliersHtml`, `setDayEditorMode`, `updateDayEditorMode`, `backdropCaretRect`, `caretIndexFromBackdropPoint`, `setDayInputSelection`, `dayHighlightsEnabled` + `loadDayHighlightsPreference`/`saveDayHighlightsPreference`/`setDayHighlightsEnabled`/`syncDayHighlightsToggleUi`, `refreshAll`, `syncScroll` |
| Today weekday | `todayDayId`, `activeTodayDayId` (null when not viewing this week), `markTodayDay` (`.day--today` + `aria-current="date"`; also calls `markFavoriteDay`) |
| Diary favorites | `diaryFavorites[]`, `activeFavoriteDayKey` (session-only highlight), `favoritesManaging`, table `nutrients_favorites` → `{id,type:"day"|"week",dateKey,name,description}`, `makeFavoriteId` / `normalizeFavoriteEntry` / `findFavoriteIndexById` / `findFavoriteByTypeAndKey`, `loadFavorites` / `saveFavorites`, `favoriteTargetLabel` / `defaultFavoriteName` / `dayIdForDateKey`, `openFavoriteDayEditor` / `openFavoriteWeekEditor` / `openFavoriteEditById` / `openFavoriteEditModal` / `runFavoriteEditSave` / `#favorite-edit-modal`, `openFavoritesSidebar` / `closeFavoritesSidebar` / `toggleFavoritesSidebar` / `isFavoritesSidebarOpen` / `#favorites-sidebar` + `#favorites-open`, `setFavoritesManaging` / `syncFavoritesSidebarMode` / `#favorites-manage-toggle`, `renderFavoritesBrowseList` / `renderFavoritesManageList` / `deleteFavoriteById` / `moveFavoriteById`, `goToFavoriteById` (week clears day highlight; day sets `activeFavoriteDayKey` then `setViewedWeekStart` + `setDaysCarouselDayId`), `markFavoriteDay` (`.day--favorite-day`), `setActiveFavoriteDayHighlight` / `clearActiveFavoriteDayHighlight`, `syncDayFavoriteButtons` / `syncWeekFavoriteButton` |
| Mobile days carousel | `daysCarouselIndex`, `daysCarouselMq` (`max-width: 520px`), `isDaysCarouselActive`, `initDaysCarousel`, `scrollDaysCarouselToIndex`, `setDaysCarouselDayId`, `stepDaysCarousel`, `syncDaysCarouselNav`, `syncDaysCarouselFromScroll`, `.week__days-carousel-nav` / `#days-carousel-current` / `data-days-carousel="prev\|next"`; used by `focusDayLine` and `goToFavoriteById` when active |
| Multi-week diary | `dayMealsByDate`, `viewedWeekStart`, `EARLIEST_DIARY_DATE` (`2026-05-01`) / `earliestWeekMondayKey` / `clampWeekMondayKey`, `toDateKey` / `parseDateKey` / `parseTypedDate` / `mondayOf` / `addDays` / `weekDateKeys` / `formatDayDateLabel` / `formatWeekRangeLabel`, `flushEditorsToDayMeals` / `loadEditorsFromDayMeals`, `setViewedWeekStart` / `stepViewedWeek` / `goToThisWeek` / `openWeekJumpModal` / `#week-jump-modal` / `updateWeekNavUi` / `updateDayDateLabels`, `copyDayToDateKey` / `copyWeekToMondayKey` / `copyDayToToday` / `copyDayToYesterday` / `copyDayToTomorrow` / `copyViewedWeekToThisWeek` / `#copy-date-modal` / `handleDayCopyAction` / `updateCopyActionButtons`, `viewedWeekStart` (settings) |
| Unmatched lines | `unmatchedDayLines`, `allUnmatchedDayLines`, `weekUnmatchedLinesHtml`, `weekUnmatchedCarouselHtml`, `renderWeekUnmatchedLines`, `updateWeekUnmatchedLines`, `stepUnmatchedCarousel`, `toggleUnmatchedCarousel`, `focusDayLine` |
| Food-name suggestions | `updateDaySuggest`, `positionDaySuggest`, `foodSuggestMatches`, `applyDayFoodSuggest`, `hideDaySuggest`, `hideAllDaySuggests`, `DAY_SUGGEST_MAX`; per-item fit/scroll: `fitDaySuggestItemLabel`, `updateDaySuggestItemHover`, `bindDaySuggestHover`, `bindDaySuggestResize`, `daySuggestItemScrollTo`, `daySuggestItemUpdateChevrons` |
| Food notes (toolbar) | `loadFoodNotesDefinitions`, `normalizeFoodNotesDefinitions`, `detectedFoodNotes`, `updateDayFoodNotesUi`, `dayFoodNotesLabelsHtml`, `showDayFoodNotesPopoverForIndex`, `initDayFoodNotesEvents`, `foodNotesDefinitions`, `FOOD_NOTES_URL` |
| Food categories (table filter) | `loadFoodCategoriesDefinitions`, `normalizeFoodCategories`, `foodCategoryIdForName`, `keywordsCategoryCounts`, `foodCategories`, `FOOD_CATEGORIES_URL` |
| Starter guide | `maybeShowStarterGuideImportStep`, `advanceStarterGuideAfterImport`, `showStarterGuideStep`, `repositionStarterGuide`, `dismissStarterGuide`, `hideStarterGuide`, `starterGuideEligible`, `starterGuideStep` |
| Day editor height | `loadDayEditorHeight`, `saveDayEditorHeight`, `applyDayEditorHeight`, `bindDayEditorResize`, `clampDayEditorHeight` |
| Persistence | `saveFoodDefinitions`, `loadFoodDefinitions`, `saveDayNotes`, `loadDayNotes` (v2 migrate from legacy mon–sun) |
| Day meals | `exportAllDayMeals` (full v2 history), `applyImportAllDayMealsReplace` (legacy week → viewed week, or v2 diary), `applySampleDayMealsData`, `applyImportV2DayMealsData`, `getImportAllMealsMissingMode` (`empty` \| `keep`), `importSampleMeals`, `confirmImportSampleMealsReplace`, `clearDayNotes`, `clearAllDayNotes` (viewed week), `anyDayHasNotes`, `anyStoredDayHasNotes` |

## Data lifecycle

```text
loadFoodDefinitions()  → keywords[]
        ↓
renderKeywords()       → DOM table rows (innerHTML per row)
        ↓
user edit / import / micros modal / longevity modal
        ↓
saveFoodDefinitions()  → NutrientsPersist (nutrients_food_definitions)
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

**Search / category / pagination** — the toolbar `#keywords-search` (+ `#keywords-search-clear`) sets `keywordsFilterQuery` via `setKeywordsFilterQuery` (case-insensitive substring on name; resets to page 0). **Categories** (`#keywords-category-open` → `#keywords-category-modal`) sets `keywordsCategoryFilter` via `setKeywordsCategoryFilter` from `definitions-food-categories.json` (first matching regex pattern wins; sentinel `__uncategorized__` for unmatched names). Active category shows `#keywords-category-chip` with clear (×); modal Clear filter / chip clear exits category filter view. Modal lists each category with a count; **Uncategorized** shows its count (click reveal expands the unmatched food names; **Filter** applies the uncategorized view). `#keywords-page-size` (10/25/50/100/All) persists to settings `keywordsPageSize`; First/Prev/Next/Last (`#keywords-page-*`) call `goKeywordsPage`. `keywordsFilteredIndices` maps visible rows back to real `keywords[]` indices, so editing/import/position operations always use the true index.

**Sort A–Z** — `sortKeywordsAlphabetically` (bound to `#sort-foods-alphabetically` and `#sort-foods-alphabetically-top`): `syncAllFieldsFromDom` first (don’t lose in-progress edits), sort by lowercased trimmed name (blanks last), reset to page 0, save + re-render.

**Inline edit** — delegated `input` on `#keywords-list`:

- `syncFieldFromDom(row)` reads `data-field` inputs into `keywords[i]`; `syncAllFieldsFromDom` flushes every rendered row before actions that re-render or reorder.
- Macros use `parseMacro` on input (empty → stored as `""`).

**Reorder/delete/add** — `moveKeyword`, `removeKeyword`, `addKeyword`; each saves and calls `renderKeywords` + `refreshAll`. `addKeyword` jumps to the last page so the new row is visible. Closing modals if the active row is removed/moved. The reorder column visibility is a persisted UI flag (`keywordReorderOpen`, settings `keywordsReorderOpen`).

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

- **Weekly average view** (default): average daily amount = week sum ÷ `DAYS.length` (7). **% target** comes from `microNutrientTargetPct(key, avgDaily)`, which picks the first available reference: **FDA % DV** (`dailyDv` → `getDailyMicroDv`, e.g. female iron 18 mg, male 8 mg), else **IOM body-weight minimum** (`iomBwMinPct`, amino acids; needs body weight set), else **study min** (`STUDY_MIN_MICRO_REFS`; `limiting: false`, higher % = better — e.g. glycine 10 g/day for collagen synthesis), else **study max** (`STUDY_MAX_MICRO_REFS`; `limiting: true` so high = red), else unscored (`NO_STANDALONE_REF_MICRO_KEYS`). Rendered by `renderMicroWeeklyList` into `#dashboard-micro-list`.
- **Target-ref badge** — each row shows a `.dashboard__target-ref` badge (`data-target-ref` = `dv` | `iom` | `studyMin` | `studyMax` | `none`) whose click toggles `#target-ref-popover` explaining which reference and amount is used (`showTargetRefPopover` / `targetRefDetailHtml`). Bound once via `initTargetRefPopoverEvents` on the micro list, daily grid, and longevity content.
- **Condition focus / intake filter** (`MICRO_CONDITION_FOCUS` + `MICRO_INTAKE_FILTER`, `#dashboard-micro-condition-toggle`): filters rows to condition-relevant micros (+ optional `longevityNutrients` such as `creatine`, `saturatedFat`, `glycemicIndex` for **Hair loss**), or to poorly-/well-absorbed sets (`poorlyAbsorbed` uses `microRequiresDailyIntake`). **Nutrition Intake** group also includes **American Common Deficiencies** (`americanCommonDeficiencies`: A, D, Ca, Mg, iodine) and **Fat-soluble vitamins** (`fatSolubleVitamins`: A, D, E, K). Adds a **Focus:** section at top of explain modals when JSON has matching condition key. Session-only condition id (not persisted); **weekly/daily view** and **Daily Targets** are persisted (settings `microViewDaily` / `microShowDv`). Condition-specific tip asides: `#micro-tip-caffeine` (hidden when any filter active), `#micro-tip-cataracts`, `#micro-tip-hair-loss`, `#micro-tip-common-deficiencies` (stays for American Common Deficiencies), `#micro-tip-fat-soluble` (stays for Fat-soluble vitamins). Choosing a condition focus clears sticky Filter (incl. By Nutrients); choosing sticky Filter clears condition focus.
- **Sticky chrome** (`#dashboard-micro-sticky`): title **Micro Requirements**, view segments, **Daily Targets** toggle, disclosures for **Highlight** / **Filter** / **Poor storage / daily intake** / **One-day excess consumption**, and `#dashboard-micro-close` (closes the panel). Same Highlight/Filter/daily/acute option panels are mirrored on `#dashboard-longevity-nav` and share state.
- **Sticky Filter** (`filterStickyDailyIntake` / `filterStickySideEffects` / `filterStickyAdverseEffects` / `filterStickyNutrientKeys`, persisted): when any are on, `microKeyMatchesStickyFilter` keeps rows that (1) pass the **By Nutrients** chip list when `filterStickyNutrientKeys` is non-empty (AND), then (2) match at least one selected icon criterion when any of daily / S/E / A/E are on (OR). Clear × via `clearStickyIconFilters` (also clears nutrient chips). Re-renders micro + longevity via `refreshStickyIconFilterViews`.
- **By Nutrients** (nested under Filter on both sticky bars): disclosure `.dashboard__nutrient-filter`; presets `NUTRIENT_FILTER_PRESETS` (`common-deficiencies`, `fat-soluble`) via `applyNutrientFilterPreset`; typeahead combobox (`[data-nutrient-filter-input]` / `nutrientFilterSuggestMatches`) adds via `addStickyNutrientFilter`; chips remove via `removeStickyNutrientFilter`. Keys limited to `MICRO_ALL_FIELDS` (`normalizeFilterStickyNutrientKeys`). Persisted as JSON array under settings `filterNutrients`.
- **Sticky Highlight** (`highlightSticky*`, persisted): OR-combine free toggles; `syncStickyIconHighlightUi` sets body classes `highlight-daily-intake-icons` / `highlight-side-effects` / `highlight-adverse-effects` so matching icons render in red (Highlight also forces those icon types visible). Clear × via `clearStickyIconHighlights`.
- **Icon show toggles:** **Poor storage / daily intake** → `showDailyIntakeIcons` (default on, body `show-daily-intake-icons`); **One-day excess** → `showAcuteSideEffects` / `showAcuteAdverseEffects` (body `show-acute-side-effects` / `show-acute-adverse-effects`). Acute icons are `display: none` until their show or highlight class is on.
- **My food** bar-chart button on each row (`microSourcesIconHtml`, `data-micro-sources`) opens `#micro-sources-modal` — ranked matched foods with per-hit calculations; scope select (week or single day). Requirements block (`microSourcesRequirementsHtml`) lists FDA daily/weekly, IOM bw min (daily/weekly when weight set), and study-max references.
- **Daily intake icon** — pill button (`.dashboard__micro-daily-intake-btn`, `data-micro-daily-intake`) appears next to **My food** when `NutrientsDemographicDv.requiresDailyIntake(key)` is true (keys in `DAILY_INTAKE_MICRO_KEYS`) **and** `showDailyIntakeIcons` is on. Click toggles `#micro-daily-intake-popover`. Hidden on re-render, outside click, and scroll (`hideMicroDailyIntakePopover`).
- **Acute toxicity icons** — `appendMicroDailyIntakeIconHtml` also appends S/E and/or A/E warning buttons from `ACUTE_TOXICITY_BY_MICRO` (`microAcuteToxicityIconsHtml`). Click opens `#micro-acute-toxicity-popover` listing effect strings. `sideEffects` = uncomfortable reactions; `adverseEffects` = serious medical outcomes.
- **Each-day view** (`setMicroViewDaily(true)`, persisted): `renderMicroDailyGrid` builds a per-day grid into `#dashboard-micro-daily-grid`; today’s column uses `.dashboard__card--today` via `todayDayId()`. A **More nutrients** control reveals the `MICRO_EXTENDED_FIELDS` rows plus longevity keys referenced by any `MICRO_CONDITION_FOCUS.longevityNutrients`.
- **Daily Targets** (`showMicroDailyDv`, `#dashboard-micro-dv-toggle`, label group **Daily Targets** / button “Show daily targets”, persisted): appends the daily requirement text (`microTargetReqText` / `microTargetReqAmountText`).
- **% color/weight** from `config.json` `microDvStatus.tiers` via `tierForMicroPct` / `microPctInlineStyle`; limiting refs (study max) use the inverted scale.
- **Learn more:** each nutrient row carries `data-micro-def`; click opens `openMicroDefModal`.

**Derived rows** — `MICRO_DERIVED_DEFS` includes `insolubleToSolubleFiber2To1` (`idealRatio: 2`) and `insolubleToSolubleFiber` (`idealRatio: 3`) after the fiber fields: `microDerivedAmtText` shows the average `insoluble:soluble` ratio and `microDerivedRowTargetDisplay` → `insolubleToSolubleFiberTargetPct` scores closeness to that ideal (100% at exact match, falling off either side).

Toggle/view state for weekly vs each-day, Daily Targets, icon show/filter/highlight is **persisted**; demographic + body weight are persisted separately.

**Vitamin K breakdown** — total `vitaminK` keeps FDA % DV (120 mcg male / 90 female). Optional subforms `vitaminK1`, `vitaminK2`, `vitaminK2MK4`, `vitaminK2MK7` live in `micros`, bridge to longevity (`longevity: true`), and are listed in `NO_STANDALONE_REF_MICRO_KEYS` (tracked, not independently scored). `vitaminK2MK4` is in `DAILY_INTAKE_MICRO_KEYS` (short half-life). Explain modals append `vitaminKKeyDifferencesHtml` for K1/K2; calcification section adds K2/MK-4/MK-7 tip asides.

## Longevity panel

`longevityTotalsFromText` mirrors matching for `LONGEVITY_FIELDS` (and the micro keys reused via `LONGEVITY_FROM_MICRO` / `LONGEVITY_COMPOUNDS_FROM_MICRO`).

**`renderLongevityPanel`** builds sections from `LONGEVITY_GROUPS` plus derived blocks (see `LONGEVITY_SECTION_DEFS` / `LONGEVITY_NAV_SECTIONS_CORE` — includes fiber/colon, Upper GI, Thyroid, Liver, Kidney, bone density, calcification, TMAO, glycemic, Gray hair, Aches, Brain):

- Groups from `LONGEVITY_GROUPS` (the `group` field on each `LONGEVITY_FIELDS` entry): **Fats & cholesterol** (includes `plantSterols`, 2 g/day DV; also lists micro-sourced LDL helpers via `LONGEVITY_FATS_AIM_FROM_MICRO` and omega triglyceride rows via `LONGEVITY_FATS_AIM_FROM_LONGEVITY` + derived EPA+DHA), **Omega fatty acids**, **Glutathione support**, **DNA repair support**, **Longevity & inflammation compounds** (includes limiting `creatine`, plus `alphaLipoicAcid` / `glutathione` used heavily by Liver), **Carb quality**. (The micros modal `initLongevityForm` skips the `glutathione` group since those come from micro entries.)
- **Female / male hormones** nav sections (`FEMALE_HORMONE_NAV_SECTIONS` / `MALE_HORMONE_NAV_SECTIONS` via `getLongevityHormoneNavSections`) surface for the matching demographic.
- **Micronutrients from food**, **Bone density**, **Calcification & vascular balance** — repeat micro/longevity entries so users reason in one place (calcification lists K total + K1/K2/MK-4/MK-7 separately; K2 subform tips via `calcificationVitaminK2TipHtml` / `calcificationVitaminK2SubformsTipHtml`).
- **Upper GI Motility** (`sectionUpperGiMotility`, after Fiber & colon) — general motility micros (`LONGEVITY_UPPER_GI_FROM_MICRO`: D, B12, iron), bile-production micros (`LONGEVITY_UPPER_GI_BILE_PRODUCTION_FROM_MICRO`), LES watch longevity rows (`LONGEVITY_UPPER_GI_LES_WATCH_FROM_LONGEVITY`); tip helpers `upperGiWhatIsTipHtml` / `upperGiBile*` / `upperGiLes*` / `upperGiBileHerbsTipHtml` (herbs/habits not tracked from food).
- **Thyroid health** (`sectionThyroid`) — iodine-priority tip asides (`thyroidHealthTipHtml` / `thyroidOmega3TipHtml` / `thyroidVitaminATipHtml`) plus tracked nutrient rows for thyroid support.
- **Liver health** (`sectionLiver`) — protective longevity compounds (`LONGEVITY_LIVER_PROTECTIVE_FROM_LONGEVITY`: ALA, glutathione), precursor / choline-methyl / antioxidant / metabolic / watch maps (`LONGEVITY_LIVER_*`); tip asides `liverHealthTipHtml` / `liverSupplementsTipHtml` (milk thistle, NAC, dandelion tea, etc. as **not tracked from food**).
- **Kidney health** (`sectionKidney`) — electrolyte watch/aim, BP, glucose, weight/cholesterol, and micronutrient maps (`LONGEVITY_KIDNEY_*`); herb tip helpers (`kidneyHerbsDirectTipHtml` / `kidneyHerbsBloodPressureTipHtml` / `kidneyHerbsBloodGlucoseTipHtml` / `kidneyHerbsWeightTipHtml`) are also reused from related longevity sections (e.g. vascular / glycemic / visceral fat). DASH calcium tip opens `#dash-diet-tip-modal`.
- **Gray hair** (`sectionGrayHair`) — deficiency micros (`LONGEVITY_GRAY_HAIR_DEFICIENCY_FROM_MICRO`), thyroid-related micros (`LONGEVITY_GRAY_HAIR_THYROID_FROM_MICRO`), plus jumps/reuses of Stress resilience nutrient sets; tip `grayHairTipHtml`.
- **Aches** (`sectionAches`) — vitamin D status, anti-inflammatory (micro + longevity), **Omega-6 : Omega-3** derived ratio row, joint lubrication, age-related subgroups (`LONGEVITY_ACHES_*`); tips `achesVitaminDTipHtml` / `achesAntiInflammatoryTipHtml` / etc.
- **Staying sharp & lowering dementia risk** (`sectionBrainLongevity`) — brain micros/longevity (`LONGEVITY_BRAIN_FROM_MICRO` / `_FROM_LONGEVITY`) plus **Astrocyte support** subgroups (`LONGEVITY_BRAIN_ASTROCYTE_*`); tips `brainLongevityTipHtml` / `brainAstrocyteSupportTipHtml`.
- **Visceral fat** (`sectionVisceralFat`) — antioxidant rows from micro (`LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_MICRO`) and longevity compounds including **carotenoids** (`LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_LONGEVITY`); tips via `visceralFatBuildupTipHtml` / `visceralFatMobilizationTipHtml` / `visceralFatGlpTipHtml`.
- **Vascular - Blood Pressure** (`sectionVascularBloodPressure`) — sodium scored against **three** limiting ceilings via `VASCULAR_SODIUM_LIMIT_REFS` / `vascularSodiumLimitRowsHtml` (FDA &lt;2,300 mg, WHO &lt;2,000 mg, AHA ideal &lt;1,500 mg) using `longevityRowFromMicroLimit`; potassium and DASH-related aim/watch rows; tip `vascularSodiumPotassiumTipHtml`. Cerebral BP section jumps back to this set.
- **TMAO balance** — precursors vs lowering factors; inline tips link to `#tmao-protectors-tip-modal`.
- **Derived scores** (`LONGEVITY_DERIVED_DEFS`): omega-6:omega-3 ratio, saturated:unsaturated ratio, EPA+DHA, glycemic load.
- **Glycemic load & GI distribution** — `renderLongevityGiBuckets`; GL rows use color by GI tier.
- **Section nav** — sticky `#dashboard-longevity-nav` (title **Longevity**, `#dashboard-longevity-close`, shared sticky icon options incl. By Nutrients, prev/next + “All topics”) scroll-spies `#dashboard-longevity-content` sections; URL hash `#longevity/{sectionDefKey}` deep-links (`applyInitialLongevityHash` at boot, `setLongevityNavHash` on nav). All-topics button colors come from `config.json` → `longevityNavTopicColors` (keyed by `sectionDefKey`).
- **Level bars** — `longevityBarHtml` wraps fill + optional **100% reference notch** (`.dashboard__longevity-bar-notch`): shown when the row has a scored reference (`longevityBarShowsRefNotch`); hover/focus popover displays the daily reference amount (`longevityBarRefPopoverLabel`).
- **My food** icons on rows (`longevitySourcesIconHtml`, `data-longevity-sources`) open `#longevity-sources-modal` with ranked contributions; glycemic load uses special GL-per-serving ranking. Rows whose `sourcesKey` is in `DAILY_INTAKE_MICRO_KEYS` also get the daily-intake pill icon (and acute icons via the same append helper as the micro panel). Sticky Filter (icons + By Nutrients) also applies to longevity rows that have a micro/acute key.

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
- **Body weight** — `#settings-weight` number input + kg/lb unit toggle (`#settings-weight-kg` / `#settings-weight-lb`, default lb). Stored internally as kg (`userBodyWeightKg`, persisted settings `bodyWeightKg`) via `readSettingsWeightFromInput` / `settingsWeightKgFromInput`; used only for **IOM bw min** amino-acid targets (`getBodyWeightKg` → `iomBwMinDaily`). No weight = amino-acid IOM rows show “set weight”.
- **TDEE** — `#settings-tdee` input; persisted settings `tdee` (`userTdee`). Placeholder from `getTdeeBaseline()` → `demographic-dv.js` `CALORIE_BASELINE`.
- **TDEE calculator** — `#tdee-calculator-modal`: Mifflin–St Jeor BMR × activity factor; resistance (days/week or weekly heavy/light sets) + optional cardio; **Use this value** writes settings input.
- **Week summary compare** — `renderWeekSummary` uses `getTdee()` × 7 vs week total; deficit/surplus label, cal/week delta, ~lb/week (`3500` rule). Explain: `#tdee-hint-modal`.
- **Macro split guidance** — week avg P/C/F % in summary; explain opens `#macro-split-hint-modal` with `MACRO_BODY_TYPES` carousel (`renderMacroSplitCarousel`).

## Food table calories column

- **`keywordCaloriesOpen`** — persisted settings `keywordsCaloriesOpen`.
- Header `.keywords__macro-toggle` (`data-action="toggle-calories"`) switches Prot/Carbs/Fats columns between **(g)** and **(cal)**; reveals **Total (cal)** column.
- `renderKeywords` writes cal or g values per row when open.

## localStorage

Persistence lives in [`persist.js`](./persist.js) (`NutrientsAuth` + `NutrientsPersist`). Full shapes and migration: [`specs-data-persistence.md`](./specs-data-persistence.md), agent guide: [`AGENTS-data-persistence.md`](./AGENTS-data-persistence.md).

| Key | Content |
|-----|---------|
| `nutrients_users` | `User[]` `{ id, email, password, createdAt }` |
| `nutrients_session` | `{ userId, email }` or absent when logged out |
| `nutrients_food_definitions` | `FoodDefinition[]` with `userId` (includes `micros` + `longevity`) |
| `nutrients_day_meals` | `DayMealsRow[]` `{ userId, version: 2, days: { "YYYY-MM-DD": "…" } }` |
| `nutrients_favorites` | `Favorite[]` with `userId` |
| `nutrients_settings` | `SettingsRow[]` with `userId` (demographic, TDEE, UI prefs, …) |
| `nutrients_orphan_legacy` | Temporary pre–multi-user blob; removed after first Sign up claims it |

Pre–multi-user single-user payloads move to `nutrients_orphan_legacy` and are claimed by the **first Sign up**. Logged-out sessions do not persist entity data (loads empty/defaults; saves no-op).

**Auth UI / session reload** — header `#auth-logged-out` / `#auth-logged-in`; modals `#auth-signup-modal` / `#auth-login-modal`. `syncAuthUi` reflects session. `submitAuthSignup` / `submitAuthLogin` / `submitAuthLogout` call `afterAuthSessionChange()` → `loadPersistedAppState()` + `applyLoadedAppStateToUi()`.

**Load helpers** — `loadPersistedAppState`: `persist.migrate()` then foods / keyword UI prefs / day meals / favorites / day highlights / editor height / micro+sticky prefs / demographic / TDEE / body weight. `loadFoodDefinitions` maps **current user’s** rows, `normalizeMicros` + `normalizeLongevity`, bumps `nextId`.

**Apply helpers** — `applyLoadedAppStateToUi`: today + favorite button sync, sticky toggle UIs (opens By Nutrients disclosure when chips persist), demographic/TDEE/weight UI, `renderKeywords` / `refreshAll`, `syncAuthUi`.

**Save triggers** — day textarea `input`, row input, add/delete/reorder, micros/longevity save, import apply, demographic/TDEE/weight, calories/reorder toggles, favorites CRUD, `beforeunload` — all via repository helpers; no-op when logged out.

## Config (`config.json`)

Fetched by `loadAppConfig` at boot (before definitions). Shapes:

- `microDvStatus.tiers` — `[{ id, minPercent, color, fontWeight }]` (descending `minPercent`); higher % = greener.
- `longevityStatus.normalTiers` — same idea for “aim” nutrients.
- `longevityStatus.limitingTiers` — inverted scale for `limiting` nutrients (high % = red).
- `longevityNavTopicColors` — map of `sectionDefKey` → hex color for All-topics / nav chips (e.g. `sectionUpperGiMotility`, `sectionLiver`, `sectionKidney`).
- `longevityStatus.transFatMaxGPerDay`, `omega6To3IdealMax` — thresholds for specific derived metrics.

On fetch failure, `DEFAULT_MICRO_DV_STATUS` / `DEFAULT_LONGEVITY_STATUS` are used.

## Food categories (`definitions-food-categories.json`)

Fetched at boot by `loadFoodCategoriesDefinitions` (parallel with micro/longevity/food-notes defs). **Not persisted** — rules live in the JSON file only. Powers the food-definitions table category filter (`keywordsCategoryFilter`).

**Config shape:**

```json
{
  "categories": [
    {
      "id": "cereal",
      "label": "Cereal",
      "patterns": ["^Cereal\\s*-", "^Shredded Wheat"]
    }
  ]
}
```

| Field | Role |
|-------|------|
| `id` | Stable filter key stored in `keywordsCategoryFilter` |
| `label` | Shown in the modal list and active chip |
| `patterns` | Case-insensitive regex strings; **first matching category wins** |

Foods that match no pattern are **Uncategorized** (filter sentinel `KEYWORDS_CATEGORY_UNCATEGORIZED` / `__uncategorized__`). Modal shows the uncategorized count; reveal expands names; Filter applies that view.

**Agent audit** — `.agents/skills/categorize-food-definitions.json` + `node scripts/list-uncategorized-foods.js [--json] [foods.json]` finds unmatched names and guides assigning them to an existing or new category.

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

**Highlights toggle** — the pen `#day-highlights-toggle` calls `setDayHighlightsEnabled`, persisted as settings `dayHighlights`; `loadDayHighlightsPreference` at boot, `syncDayHighlightsToggleUi` reflects state and re-applies editor modes.

UI mirror pattern: [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)

## Unmatched day-meal lines

`#day-unmatched-lines` (`.week__unmatched-lines`, `role="status"`) sits below the highlight bar. It surfaces non-empty day-meal lines that don’t exactly match a food definition.

- **Detect** — `unmatchedDayLines(text)` splits on `\n`, skips blank lines, keeps lines where `lineMatchesFoodDefinition(line)` is false (the check strips any `* N` multiplier first). `allUnmatchedDayLines` walks all seven days, tagging `dayId`, `dayLabel`, `lineNum`, `text`.
- **Render** — `updateWeekUnmatchedLines` refreshes `unmatchedCarouselItems` then `renderWeekUnmatchedLines`. Collapsed: **Unmatched (N)** toggle button. Expanded: `weekUnmatchedCarouselHtml` with prev/next, `index / total`, and a **Go to line** card.
- **Navigate** — `data-unmatched-action`: `toggle` / `prev` / `next` / `jump`. Jump calls `focusDayLine(dayId, lineNum)` (selects that line in the day textarea). When the mobile days carousel is active (`isDaysCarouselActive`), `focusDayLine` uses `setDaysCarouselDayId` instead of `scrollIntoView`. `focusUnmatchedCarouselItem` delegates to `focusDayLine`. State: `unmatchedCarouselOpen`, `unmatchedCarouselIndex` (session-only).
- **Visibility** — shown whenever any unmatched lines exist (not gated on the pen/highlight mode). Hidden only when the list is empty.

## Diary favorites

Named bookmarks for a **day** (`dateKey` = that calendar day) or **week** (`dateKey` = Monday of the week). Persisted in `nutrients_favorites`; UI lives in week nav + day heads + `#favorites-sidebar`.

- **Add / edit** — `#week-nav-favorite` (above Mon–Sun grid) or per-day `.day__favorite` (`data-action="favorite-day"`) opens `#favorite-edit-modal` (name + why). Re-favoriting an existing day/week opens edit for that entry. `runFavoriteEditSave` upserts by id (or by type+dateKey duplicate). `syncDayFavoriteButtons` disables the day Favorite button when that day has no notes (same empty-day rule as Clear/Copy) and sets `aria-pressed` / label **Favorited** when an entry exists.
- **Browse / jump** — `#favorites-open` opens right slide-in `#favorites-sidebar` (`favorites-sidebar--open`, `inert` when closed; counted in `updateBodyModalOpen`). Browse list (`#favorites-list`) uses `data-action="go-favorite"`.
- **Manage** — `#favorites-manage-toggle` flips `favoritesManaging`: shows `#favorites-manage-list` with ↑↓ (`favorite-move-up` / `favorite-move-down`), Edit, Delete; **Done** returns to browse. `syncFavoritesSidebarMode` keeps title/hint/lists in sync.
- **Navigate** — `goToFavoriteById`: **week** → `clearActiveFavoriteDayHighlight` + `setViewedWeekStart`; **day** → `setActiveFavoriteDayHighlight(dateKey)` (clears prior highlight first) + jump to that week’s Monday + `setDaysCarouselDayId` + focus textarea. `activeFavoriteDayKey` is **session-only** (not in localStorage); `markFavoriteDay` applies `.day--favorite-day` only when that date is in the viewed week.

## Mobile days carousel

At `max-width: 520px`, Mon–Sun editors become a horizontal one-day-at-a-time strip (CSS scroll-snap on `.week__grid`). Desktop keeps the 7-column grid; `.week__days-carousel-nav` is `display: none` until that breakpoint.

- **State** — `daysCarouselIndex`, `daysCarouselMq` (`matchMedia("(max-width: 520px)")`), `isDaysCarouselActive()`.
- **API** — `initDaysCarousel` (boot; prefers today’s weekday index), `scrollDaysCarouselToIndex`, `setDaysCarouselDayId`, `stepDaysCarousel`, `syncDaysCarouselNav` (label `#days-carousel-current` = `Mon · M/D/YY`), `syncDaysCarouselFromScroll` (debounced on `.week__grid` scroll).
- **Controls** — `.week__days-carousel-adj` with `data-days-carousel="prev|next"`.
- **Integrations** — `focusDayLine` and `goToFavoriteById` call `setDaysCarouselDayId` when the carousel is active; `markTodayDay` refreshes the carousel label via `syncDaysCarouselNav`.

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
- **Placement** — `positionDaySuggest` uses the caret rect from the backdrop mirror: when the caret is in the **lower half** of the editor, adds `.day__suggest--above` and pins the panel to the editor top (max-height down to the caret) so suggestions do not cover the line being typed; otherwise places the panel below the caret.
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

**Boot** — `loadDayEditorHeight()` restores the saved px height from settings `dayEditorHeight` (via `NutrientsPersist`).

## Internal naming vs UI

- Code still uses `keywords`, `addKeyword`, `#keywords-list`, `blankKeyword` — **UI strings say “Food definitions”**. Prefer extending existing names unless doing a deliberate rename pass.

## Extension points

| Goal | Where to edit |
|------|----------------|
| Sum micros into per-day cards | `dashboardCardHtml` + `microTotalsFromText` per day |
| Change micro DV profile | `demographic-dv.js` → `DAILY_MICRO_DV`; keys must match `MICRO_FIELDS` / `MICRO_EXTENDED_FIELDS` |
| Add trace mineral / amino acid | `MICRO_EXTENDED_FIELDS` (amino acids use `group: "amino"`); micro form separators + daily-grid **More nutrients** follow |
| Add amino-acid IOM target | `demographic-dv.js` → `IOM_BW_MIN_MG_PER_KG`; requires body weight to score |
| Add study-only reference | `STUDY_MIN_MICRO_REFS` (aim target, `limiting: false`) or `STUDY_MAX_MICRO_REFS` (ceiling, `limiting: true`) + `TARGET_REF_POPOVER_DETAILS` citation; or `NO_STANDALONE_REF_MICRO_KEYS` (unscored breakdown, e.g. K1/K2/MK-4/MK-7, or bundled like cysteine); surfaced by `microNutrientTargetPct` (priority: FDA DV → IOM bw min → study min → study max → no ref) |
| Add vitamin K subform | `MICRO_FIELDS` keys + optional `longevity: true` bridge; `NO_STANDALONE_REF_MICRO_KEYS`; explain copy in `vitaminKKeyDifferencesHtml` |
| Add plant sterols / creatine | `LONGEVITY_FIELDS` + `DAILY_LONGEVITY_DV` (plantSterols 2 g); creatine is `limiting: true`, no DV |
| Carotenoids without explicit food value | `resolveLongevityValue` vitamin-A fallback; set `carotenoids: 15` in `longevity-dv.js` |
| Longevity 100% bar notch | `longevityBarHtml`, `longevityBarShowsRefNotch`, CSS `.dashboard__longevity-bar-notch` |
| Auth / multi-user tables | `NutrientsAuth` / `NutrientsPersist` in `persist.js`; `syncAuthUi` / `afterAuthSessionChange` / `loadPersistedAppState` / `applyLoadedAppStateToUi`; see [AGENTS-data-persistence.md](./AGENTS-data-persistence.md) |
| Persist micro panel toggles | settings `microViewDaily` / `microShowDv`, acute/daily-intake show keys, sticky Filter/Highlight keys + settings `filterNutrients`; loaded via `loadPersistedAppState` |
| Condition longevity rows in micro panel | `MICRO_CONDITION_FOCUS.*.longevityNutrients` + `microConditionDisplayFields` |
| Add derived micro metric | `MICRO_DERIVED_DEFS` (see 2:1 and 3:1 fiber ratios) + `microDerivedRowTargetDisplay` / `microDerivedAmtText` |
| Change fiber soluble/insoluble split | `solubleFiberRatioForFoodName` (name heuristics) + `FIBER_COMPONENT_DV_RATIO` in `demographic-dv.js` |
| Change food-table page sizes | `keywordsPageSize` options in HTML + `loadKeywordsPageSize` allowlist |
| Add/change food categories | `definitions-food-categories.json` patterns + `loadFoodCategoriesDefinitions` |
| Mark micro as daily-intake-only | `demographic-dv.js` → `DAILY_INTAKE_MICRO_KEYS` (+ `requiresDailyIntake`); dashboard adds pill icon via `appendMicroDailyIntakeIconHtml` |
| Add acute one-day excess effects | `ACUTE_TOXICITY_BY_MICRO` entry (`sideEffects` / `adverseEffects`) |
| Change longevity DV targets | `longevity-dv.js` → `DAILY_LONGEVITY_DV`; keys must match `LONGEVITY_FIELDS` |
| New demographic option | `META`, `DAILY_MICRO_DV`, HTML options, `normalizeDemographic` in `demographic-dv.js` |
| Edit % DV colors | `config.json` (`microDvStatus`, `longevityStatus`); All-topics colors in `longevityNavTopicColors` |
| Add condition focus | `MICRO_CONDITION_FOCUS` + HTML options (incl. Nutrition Intake group) + tip aside + JSON condition keys on nutrient defs |
| Add By Nutrients preset | `COMMON_DEFICIENCY_NUTRIENT_KEYS` / `FAT_SOLUBLE_NUTRIENT_KEYS` pattern → `NUTRIENT_FILTER_PRESETS` + preset button in both sticky Filter panels |
| Multi-ceiling sodium (or similar) limits | `VASCULAR_SODIUM_LIMIT_REFS` + `longevityRowFromMicroLimit` / `vascularSodiumLimitRowsHtml` |
| Add ranked source metric | contribution builder + `nutrientSourcesListHtml` + panel row `sourcesIconHtml` |
| Change TDEE / body-type copy | settings modal HTML + `MACRO_BODY_TYPES` + hint modals |
| Toggle food table cal column | `keywordCaloriesOpen`, `updateKeywordCaloriesUi`, settings `keywordsCaloriesOpen` |
| Add longevity section | `LONGEVITY_NAV_SECTIONS_CORE` / `LONGEVITY_SECTION_DEFS` + row maps + `renderLongevityPanel` + tip HTML + `definitions-longevity.json` + `longevityNavTopicColors` |
| Emphasize today’s weekday | `activeTodayDayId` / `markTodayDay`; CSS `.day--today` / `.dashboard__card--today` (only on current week) |
| Diary favorites (day/week) | `diaryFavorites` / `goToFavoriteById` / `markFavoriteDay` / `syncDayFavoriteButtons`; CSS `.day--favorite-day`; `#favorites-sidebar` + `#favorite-edit-modal`; persist `nutrients_favorites` |
| Mobile days carousel | `initDaysCarousel` / `setDaysCarouselDayId`; CSS `@media (max-width: 520px)` scroll-snap on `.week__grid` |
| Multi-week nav / copy | `setViewedWeekStart` / `copyDayToToday` / `copyViewedWeekToThisWeek`; `.week__nav`, `.day__date`, `.day__copy-menu` actions (`copy-week-to-this-week`, `copy-week-to-custom`, `copy-day-to-*`) + `#copy-date-modal` |
| Sample day meals | `IMPORT_SAMPLE_MEALS_URL` + `importSampleMeals` + `samples/day-meals.json` (applies to viewed week) |
| Add explanatory text | key entry in `definitions-micronutrients.json` / `definitions-longevity.json` |
| Change day clear copy | `confirmClearDay`, `confirmClearAllDays` (viewed week) |
| Tune food suggestions | `DAY_SUGGEST_MAX`, `foodSuggestMatches`, `positionDaySuggest`, `levenshtein` thresholds |
| Tune starter guide copy/steps | `maybeShowStarterGuideImportStep`, `advanceStarterGuideAfterImport`, `showStarterGuideStep`, `starterGuideTargetForStep` |
| Change shared editor height limits | `clampDayEditorHeight`, `.day__editor` min/max in CSS |
| Eighth column | extend `DAYS`, HTML, CSS `repeat(n)` for dashboard + week grid |
| Stricter matching | `countKeyword` / regex builder |

## Event binding & boot (end of `app.js`)

Listeners are attached in the **last ~20%** of the file: auth header/modals (`#auth-login-open` / `#auth-signup-open` / `#auth-logout` + signup/login submit), keywords table click/input, table search + pagination + sort buttons, per-day `bindDay` loop (focus/blur editor modes, backdrop click-to-caret), `bindDayEditorResize`, week nav (`#week-nav-prev` / `#week-nav-next` / `#week-nav-this` / `#favorites-open`) + Favorite week (`#week-nav-favorite` above day grid) + `#favorites-sidebar` (browse/manage actions) + `#favorite-edit-modal` + per-day Copy menu / `handleDayCopyAction`, mobile days carousel (`data-days-carousel` + grid scroll), dashboard toggles (week/micro/longevity/print + micro view/targets), sticky option disclosures (Highlight/Filter/By Nutrients/daily/acute) + panel close buttons, unmatched carousel actions, condition/filter dropdown, target-ref + acute + daily-intake popovers (`initTargetRefPopoverEvents`), micros + longevity modals, definition modals (`data-micro-def` / `data-longevity-def`), long food-note modal, demographic options + body-weight input/unit, phosphorus/caffeine/DASH tip modals, starter guide dismiss + empty-state sample link, and import/sample food + sample meals modals — see [import doc](./AGENTS_CODE_REFERENCE-import.md).

Boot sequence (very end):

```javascript
loadAppConfig(function () {
  var pending = 4;
  function definitionsReady() { if (--pending === 0) boot(); }
  loadMicroDefinitions(definitionsReady);
  loadLongevityDefinitions(definitionsReady);
  loadFoodNotesDefinitions(definitionsReady);
  loadFoodCategoriesDefinitions(definitionsReady);
});
// boot():
//   loadPersistedAppState()  // persist.migrate + foods/meals/favorites/settings prefs
//   initDaysCarousel → initLongevityNav → initTargetRefPopoverEvents
//   applyLoadedAppStateToUi()  // today/favorites sync, sticky UIs, renderKeywords/refreshAll, syncAuthUi
//   applyInitialLongevityHash → maybeShowStarterGuideImportStep
// afterAuthSessionChange() (signup/login/logout) = loadPersistedAppState + applyLoadedAppStateToUi
```
