# AGENTS_CODE_REFERENCE.md

> **Note for AI tools:** This documentation uses **approximate code locations** (e.g. “near the top of `app.js`”, “in the event-binding block at the end”) — **not exact line numbers**. Line numbers drift with edits; approximate cues are intentional for safe navigation.

AI-oriented codebase map for safe modification, feature tracing, and implementation planning.

## Purpose

**Week meals + food definitions** — a client-only nutrition tracker. Users type foods in Mon–Sun notes (optionally with a `* N` serving multiplier per line); **food definitions** supply macros / micros / longevity nutrients per match; a **dashboard** totals grams and calories (toggleable **macro %** per day), shows **micro % target** vs a demographic profile (FDA %DV, or **IOM body-weight minimum** / **study max** for nutrients with no FDA DV; optional **condition focus** + poorly-absorbed filter; persisted weekly/daily view and Show targets), and a **longevity panel** with section nav, % DV bars (100% reference notch), K1/K2/MK-4/MK-7 breakdown, plant sterols, visceral-fat section, and **ranked food-source modals**; a **week summary** shows week total, **daily average calories**, **TDEE deficit/surplus**, and **macro split** with body-type guidance. Unmatched day-meal lines are surfaced below the editors.

No backend, no bundler, no framework.

## Companion files

| File | Scope |
|------|--------|
| [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) | Data model, localStorage, matching, dashboard math, micro % DV, condition focus, ranked source modals, TDEE/settings, longevity panel + nav, definition modals, highlights, food notes, starter guide, food-definition table |
| [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) | Single + bulk JSON import, sample import, AI prompt panels (import + micro gaps), ChatGPT/Claude links |
| [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md) | `index.html` regions, `styles.css` layout, settings/TDEE modals, sources modals, food-notes toolbar popover, starter guide popover, highlight overlay |

When context is tight: read **this file** first, then open the one feature file you need. Full logic lives in `app.js` (~14,200 lines) — load it whole only when editing behavior, otherwise navigate by the function names listed in the companion docs.

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Static HTML5 |
| Style | Plain CSS (`styles.css`, ~5,580 lines) |
| Logic | Single IIFE in `app.js` (~14,200 lines) |
| Data files | `config.json` (% DV tiers), `definitions-micronutrients.json`, `definitions-longevity.json`, `definitions-food-notes.json`, `samples/definitions-food.json` (all `fetch`ed at boot / on demand) |
| Reference values | `demographic-dv.js` (micro DV, IOM amino-acid bw minimums, fiber component ratio), `longevity-dv.js` (longevity DV) — globals, loaded before `app.js` |
| Persistence | `localStorage` for **food definitions**, **day meals**, **demographic**, **TDEE**, **body weight**, **day editor height**, **highlights on/off**, **micro panel view** (weekly vs each-day), **Show targets**, **reorder toggle**, **calories-column toggle**, **table page size** |
| Run | Open `index.html` via a static file server (boot `fetch`es JSON, so `file://` will fall back to defaults) |

## Architecture (high level)

```text
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                              │
│   ├─ per-day cards (macros + calories; toggle macro %)  │
│   ├─ week summary (week total, day avg, TDEE vs intake,│
│   │   macro split + body-type guidance)                 │
│   ├─ Micro requirements panel (% target; condition focus │
│   │   + poorly-absorbed filter; weekly avg / daily +     │
│   │   more-nutrients; target-ref badges; ranked sources; │
│   │   condition longevity rows e.g. creatine for hair)  │
│   └─ Longevity panel (section nav, % DV bars w/ 100%    │
│      reference notch, TMAO, visceral fat, plant sterols,│
│      glycemic load, fiber ratio, ranked food sources)   │
│  ← computed from day text × food-definition nutrients   │
├─────────────────────────────────────────────────────────┤
│  Mon–Sun textareas (editing/viewing/plain modes; viewing │
│  shows highlight backdrop; food-name suggest popover;     │
│  shared vertical resize; unmatched-lines report below)    │
├─────────────────────────────────────────────────────────┤
│  Food definitions table (CRUD, search/filter, pagination,│
│  sort A–Z, optional cal column, micros + longevity       │
│  modals, single/bulk/sample import, reorder,             │
│  move-to-position; empty-state sample link)              │
│  ← persisted: localStorage `nutrients-food-definitions` │
│  Settings (header): sex / micro DV profile + TDEE + weight│
│  ← persisted: `nutrients-demographic`, `nutrients-tdee`, │
│    `nutrients-body-weight-kg`                             │
└─────────────────────────────────────────────────────────┘
```

**Persisted:** day meals (`nutrients-day-notes`), food definitions (`nutrients-food-definitions`), demographic (`nutrients-demographic`), TDEE (`nutrients-tdee`), body weight kg (`nutrients-body-weight-kg`), day editor height (`nutrients-day-editor-height`), highlights on/off (`nutrients-day-highlights`), micro panel weekly-vs-daily view (`nutrients-micro-view-daily`), micro **Show targets** toggle (`nutrients-micro-show-dv`), reorder-open flag (`nutrients-keywords-reorder-open`), food-table calories column (`nutrients-keywords-calories-open`), food-table page size (`nutrients-keywords-page-size`). Bulk export/import for meals and foods; sample import from `samples/definitions-food.json`; clear per day with `confirm`.

## File tree

```text
nutrients/
├── index.html                      (~1,525 lines) Page structure, modals, starter guide, static day editors
├── styles.css                      (~5,580 lines) Layout, dashboard, table, modals, starter guide, responsive, print
├── app.js                          (~14,200 lines) All application logic (IIFE)
├── config.json                     Micro + longevity % DV tier colors / font weights (fetched at boot)
├── demographic-dv.js               window.NutrientsDemographicDv — gender micro DV targets, daily-intake key list, IOM amino-acid bw minimums, fiber component ratio
├── longevity-dv.js                 window.NutrientsLongevityDv — longevity nutrient DV targets
├── definitions-micronutrients.json Per-micro explanatory text (tooLow/enough/tooHigh/foodSources/male/female)
├── definitions-longevity.json      Per-longevity-nutrient explanatory text
├── definitions-food-notes.json     Day-meal food notes (regex match → contextual hints in toolbar)
├── samples/
│   └── definitions-food.json       Sample food list (Import sample button)
└── AGENTS_CODE_REFERENCE*.md        AI docs (this set)
```

## Code flow

1. **Boot** (end of `app.js`): `loadAppConfig()` → in parallel `loadMicroDefinitions()` + `loadLongevityDefinitions()` + `loadFoodNotesDefinitions()` (pending = 3) → `boot()`: `loadFoodDefinitions()` → `loadKeywordReorderOpen()` → `loadKeywordCaloriesOpen()` → `loadKeywordsPageSize()` → `loadDayNotes()` → `loadDayHighlightsPreference()` → `loadDayEditorHeight()` → `loadMicroViewDaily()` → `loadShowMicroDailyDv()` → `syncMicroDailyDvToggleUi()` / `syncMicroViewToggleUi()` → `loadDemographic()` → `loadTdee()` → `loadBodyWeight()` → `renderDemographicUi()` → `syncSettingsTdeeInput()` / `syncSettingsWeightInput()` → `renderKeywords()` → `initLongevityNav()` → `initTargetRefPopoverEvents()` → `refreshAll()` → `applyInitialLongevityHash()` → `maybeShowStarterGuideImportStep()` (empty food list only). Listeners are bound earlier in the same closure (`bindDay` per textarea, `bindDayEditorResize` on the week grid, `initDayFoodNotesEvents` once).
2. **User types in a day note** → `applyDayNoteChange` (highlights via editor mode) + `renderDashboard` + `updateDayFoodNotesUi` + `updateWeekUnmatchedLines` + `updateDaySuggest` (food-name autocomplete on the current line).
3. **User edits food row / micros modal / longevity modal** → sync to `keywords[]` → `saveFoodDefinitions()` → `refreshAll()`.
4. **Match rule:** whole-word, case-insensitive `\b(name)\b`; each occurrence adds that definition’s macros/micros/longevity once, times the line’s optional `* N` serving multiplier (`keywordServingMultiplier`).
5. **Calories:** protein×4 + carbs×4 + fats×9 per day; week summary sums seven days and compares to TDEE×7 when set.
6. **% target / longevity coloring:** tiers from `config.json` (`microDvStatus`, `longevityStatus.normalTiers` / `limitingTiers`); denominators from `demographic-dv.js` (FDA DV, IOM bw min) and `longevity-dv.js`, or `STUDY_MAX_MICRO_REFS` for study-only nutrients.

## Domain model (food definition)

In-memory array `keywords` (legacy name; UI label is **Food definitions**). Each item:

```javascript
{
  id: "kw-…",      // stable string from makeId()
  name: "",        // match token in day notes
  protein: "",     // grams; number or ""
  carbs: "",
  fats: "",
  micros: {        // keys from MICRO_FIELDS + MICRO_EXTENDED_FIELDS; only some set
    fiber: "", solubleFiber: "", insolubleFiber: "", sodium: "", /* … amino acids … */
  },
  longevity: {     // keys from LONGEVITY_FIELDS (includes the CARB_QUALITY_KEYS)
    saturatedFat: "", omega3: "", glycemicIndex: "", /* … */
  }
}
```

Micros and longevity nutrients affect **storage and UI** (button codes, import JSON) and **dashboard panels** (micro % DV vs demographic, longevity % DV vs longevity targets). Macros-only cards still omit micros/longevity; expand **Micro requirements** or **Longevity** on the dashboard for average daily values (Mon–Sun ÷ 7).

> **Import note:** the `carbQuality` import key is a presentation alias — `applyLongevityImportToKeyword` merges its values back into `longevity` (the `CARB_QUALITY_KEYS` subset). There is no separate `carbQuality` property on the in-memory keyword.

## Key constants (near top of `app.js`)

- `DAYS` — seven entries `{ id, label }` (`mon`…`sun`).
- `MICRO_FIELDS` — `{ key, label, unit, code }` for the core micros (includes `fiber`, `solubleFiber` (`sf`), `insolubleFiber` (`if`)); vitamin K breakdown: total `vitaminK` (`vk`) plus optional `vitaminK1` (`k1`), `vitaminK2` (`k2`), `vitaminK2MK4` (`mk4`), `vitaminK2MK7` (`mk7`); `code` drives button label (`f`, `na`, `b12`, `b1`, …).
- `MICRO_EXTENDED_FIELDS` — extra trace minerals (`phosphorus`, `choline`, `molybdenum`, `chloride`) and amino acids (`group: "amino"`: histidine…valine, arginine, glutamine, glycine, proline, tyrosine, taurine, cysteine). `MICRO_ALL_FIELDS = MICRO_FIELDS.concat(MICRO_EXTENDED_FIELDS)`. Extended rows appear under **More nutrients** in the micro panel and separators in the micros modal.
- `MICRO_DERIVED_DEFS` — computed pseudo-nutrients not stored per food; currently `insolubleToSolubleFiber` (`idealRatio: 3`, rendered after `insolubleFiber`), scored on closeness to the 3:1 target.
- `MICRO_CONDITION_FOCUS` — condition ids (`adhd`, `anemia`, `antiAging`, `bowelMovementsAltered`, `cataractsPrevention`, `coffeeTeaUser`, `hairLoss`) → nutrient key lists (+ optional `longevityNutrients`); filters micro panel rows and adds condition notes in def modals.
- `MICRO_INTAKE_FILTER` — non-condition filter groups (`wellAbsorbed`, `poorlyAbsorbed`) shown in the same focus dropdown; `poorlyAbsorbed` filters rows by `microRequiresDailyIntake`.
- `STUDY_MAX_MICRO_REFS` — study-derived ceilings (`arginine`, `glutamine`, `taurine`) for nutrients with no FDA/IOM daily value. `NO_STANDALONE_REF_MICRO_KEYS` — nutrients tracked but not independently scored (`vitaminK1`, `vitaminK2`, `vitaminK2MK4`, `vitaminK2MK7`, `cysteine`, `glycine`, `proline`); log alongside total `vitaminK` when you have a breakdown.
- `KEYWORD_SERVING_MULTIPLIER_RE` — matches a trailing `* N` on a food line; `keywordServingMultiplier` / `stripKeywordServingMultiplier` power the multiplier feature.
- `MACRO_BODY_TYPES` — ectomorph / mesomorph / endomorph mixes with per-goal macro % ranges; rendered in `#macro-split-hint-modal` carousel.
- `LONGEVITY_FIELDS` — `{ key, label, unit, code, group, limiting? }` for the longevity nutrients (fats incl. `plantSterols`, omega, compounds incl. `creatine`, carb). `group` ∈ `LONGEVITY_GROUPS` ids; `limiting: true` flips the % DV color scale (high = bad).
- `CARB_QUALITY_KEYS` — subset of longevity keys (`glycemicIndex`, `addedSugar`, `refinedCarbs`, `netCarbs`) surfaced as `carbQuality` on import/export.
- `LONGEVITY_GROUPS`, `LONGEVITY_FROM_MICRO`, `LONGEVITY_COMPOUNDS_FROM_MICRO`, `LONGEVITY_TMAO_*`, `LONGEVITY_DERIVED_DEFS`, `LONGEVITY_SECTION_DEFS` — drive longevity panel sections, TMAO balance, and derived scores.
- `STORAGE_KEY` — `nutrients-food-definitions`; migrates from `STORAGE_KEY_LEGACY` (`nutrients-keywords`).
- `STORAGE_KEY_DEMOGRAPHIC` — `nutrients-demographic`; `male` | `female`, default `male`.
- `STORAGE_KEY_DAYS` — `nutrients-day-notes`. `STORAGE_KEY_DAY_EDITOR_HEIGHT` — `nutrients-day-editor-height` (shared px height for all `.day__editor`). `STORAGE_KEY_DAY_HIGHLIGHTS` — `nutrients-day-highlights` (`on`/`off` pen toggle). `STORAGE_KEY_MICRO_VIEW_DAILY` — `nutrients-micro-view-daily` (`true` = each-day micro grid). `STORAGE_KEY_MICRO_SHOW_DV` — `nutrients-micro-show-dv` (`true` = Show targets on). `STORAGE_KEY_REORDER` — `nutrients-keywords-reorder-open`. `STORAGE_KEY_TDEE` — `nutrients-tdee` (optional user TDEE number). `STORAGE_KEY_BODY_WEIGHT_KG` — `nutrients-body-weight-kg` (for IOM bw min). `STORAGE_KEY_CALORIES` — `nutrients-keywords-calories-open` (food table shows cal instead of g). `STORAGE_KEY_KEYWORDS_PAGE_SIZE` — `nutrients-keywords-page-size` (10/25/50/100/0=all, default `KEYWORDS_DEFAULT_PAGE_SIZE` = 25).
- `demographicDv` / `longevityDv` — references to `window.NutrientsDemographicDv` / `window.NutrientsLongevityDv` (must load before `app.js`). `demographicDv` also exposes `IOM_BW_MIN_MG_PER_KG`, `getIomBwMinDaily`, `FIBER_COMPONENT_DV_RATIO`.
- `CAL_PROTEIN|CARBS|FATS` — 4, 4, 9.
- `CHATGPT_URL`, `CLAUDE_URL`, `IMPORT_SAMPLE_FOODS_URL` (`samples/definitions-food.json`), `FOOD_NOTES_URL` (`definitions-food-notes.json`).

## UI regions (`index.html`)

Top to bottom inside `<main class="week">`:

1. Header — `#settings-open` (sex icon + Settings; opens `#settings-modal`)
2. `.dashboard` — `#dashboard-grid`; toggles `#dashboard-print`, `#dashboard-week-toggle` (`#week-summary`), `#dashboard-micro-toggle` (`#dashboard-micro-panel`), `#dashboard-longevity-toggle` (`#dashboard-longevity-panel`)
   - Micro panel: condition/filter focus dropdown (includes **Hair loss** tip `#micro-tip-hair-loss`), weekly/daily view segments (persisted), **Show targets** (`#dashboard-micro-dv-toggle`, persisted), **Ask AI to help fill gaps**, `#dashboard-micro-list` + `#dashboard-micro-daily-grid`; condition focus can surface **longevity** rows (e.g. `creatine`, `saturatedFat`, `glycemicIndex` for hair loss); **My food** icons open `#micro-sources-modal`; **daily intake** pill icons (poor storage) toggle `#micro-daily-intake-popover`; **target-ref** badges (`.dashboard__target-ref`) toggle `#target-ref-popover` (which reference: FDA DV / IOM bw min / study max)
   - Longevity panel: intro/disclaimer, sticky `#dashboard-longevity-nav`, `#dashboard-longevity-content` with **100% reference notch** on Level bars (hover shows daily reference amount); sections include **Visceral fat**, enriched **Fats & cholesterol** (plant sterols, micro-sourced fiber/niacin/vitamins, triglyceride omegas); **My food** icons → `#longevity-sources-modal`
3. `.week__days-toolbar` — hint mentioning the `* N` multiplier, export/import all meals, clear all days
4. `.week__highlight-bar` — `#day-highlights-toggle` (pen, persisted on/off), `#day-food-notes` (regex-driven notes + popover), `#day-unmatched-lines` (report of day-meal lines with no food definition)
5. `.week__grid` — seven `.day__editor` (backdrop + textarea + optional `.day__suggest` popover). Editors switch between **editing** (focused, plain textarea) / **viewing** (blurred, highlight backdrop, click-to-caret) / **plain** (highlights off) modes; vertically resizable (`resize: vertical` on `.day__editor`); releasing the drag syncs height to all seven and persists.
6. `.keywords` — food definitions table with top `.keywords__toolbar` (duplicate bulk buttons, `-top` ids), `.keywords__filter` search (`#keywords-search`), `#keywords-table` (body `#keywords-list`), `#keywords-pagination`, `#keywords-filter-empty`, `#keywords-empty` with inline **Import our sample** link, reorder toggle, macro cal/g toggle, **Sort alphabetically**, add + bulk + sample import

Outside main (modal / overlay siblings): `#settings-modal`, `#tdee-calculator-modal`, `#tdee-hint-modal`, `#macro-split-hint-modal`, `#micro-sources-modal`, `#longevity-sources-modal`, `#import-all-meals-modal`, `#import-all-modal`, `#keyword-position-modal`, `#import-modal`, `#micro-gaps-modal`, `#micro-def-modal`, `#longevity-modal`, `#micro-modal`, `#food-note-modal` (long food-note reader), `#phosphorus-binder-modal`, `#caffeine-tip-modal`, `#fats-cholesterol-tip-modal`, `#tmao-protectors-tip-modal`, `#starter-guide` (fixed beginner popover; not a blocking modal). Fixed popover siblings of the micro panel: `#micro-daily-intake-popover`, `#target-ref-popover`.

## Safe-change checklist for AI

- **New micronutrient:** add to `MICRO_FIELDS` (core) or `MICRO_EXTENDED_FIELDS` (trace mineral / amino acid, use `group: "amino"`) in `app.js`; `initMicroForm` / `normalizeMicros` / import-export follow automatically; add DV in `demographic-dv.js` (`DAILY_MICRO_DV`, both sexes) — or, if no FDA DV, add an IOM bw min (`IOM_BW_MIN_MG_PER_KG`), a `STUDY_MAX_MICRO_REFS` entry, or `NO_STANDALONE_REF_MICRO_KEYS` (breakdown fields like K1/K2/MK-4/MK-7); optionally add explanatory text under the key in `definitions-micronutrients.json` ([import doc](./AGENTS_CODE_REFERENCE-import.md)). Optional condition notes: add a key matching `MICRO_CONDITION_FOCUS` id on that nutrient’s JSON entry.
- **Vitamin K breakdown:** keep total `vitaminK` for FDA % DV; optional `vitaminK1` / `vitaminK2` / `vitaminK2MK4` / `vitaminK2MK7` in `micros`; bridge to longevity via `longevity: true`; `vitaminKKeyDifferencesHtml` in explain modals; `vitaminK2MK4` in `DAILY_INTAKE_MICRO_KEYS` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Micro panel view persistence:** `loadMicroViewDaily` / `saveMicroViewDaily` / `setMicroViewDaily`; `loadShowMicroDailyDv` / `saveShowMicroDailyDv` / `setShowMicroDailyDv` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Condition longevity rows in micro panel:** add keys to `MICRO_CONDITION_FOCUS.*.longevityNutrients`; `microConditionDisplayFields` renders them when that condition is focused; **More nutrients** also merges all conditions’ longevity keys ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **New derived micro metric:** add to `MICRO_DERIVED_DEFS` + `microDerivedRowTargetDisplay` / `microDerivedAmtText`; explanatory text keyed by the derived key in `definitions-micronutrients.json` (may use `warning` / `dashboardTracking` arrays).
- **New condition focus / filter group:** extend `MICRO_CONDITION_FOCUS` (or `MICRO_INTAKE_FILTER`) + HTML list in `#dashboard-micro-condition-list`; add condition paragraph arrays on relevant keys in `definitions-micronutrients.json` / `definitions-longevity.json`.
- **New alternate target reference:** wire it into `microNutrientTargetPct` (FDA DV → IOM bw min → study max → none); add a `data-target-ref` badge kind and popover copy in `showTargetRefPopover` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **New longevity nutrient:** add to `LONGEVITY_FIELDS` (with `group`, `limiting?`); add DV in `longevity-dv.js` (`DAILY_LONGEVITY_DV`); `initLongevityForm` / `normalizeLongevity` follow; optional text in `definitions-longevity.json`. If it is a carb-quality field, also add to `CARB_QUALITY_KEYS`. **Carotenoids:** when not stored explicitly, `resolveLongevityValue` estimates mg from `micros.vitaminA` (mcg ÷ 100 when vit A > 50).
- **Longevity bar 100% notch:** `longevityBarHtml` / `longevityBarShowsRefNotch` / `.dashboard__longevity-bar-notch` — fixed mark at 100% with popover showing reference amount ([core doc](./AGENTS_CODE_REFERENCE-core.md), [ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Plant sterols / enriched fats section:** `plantSterols` in `LONGEVITY_FIELDS` + `DAILY_LONGEVITY_DV` (2 g/day); fats group also pulls `LONGEVITY_FATS_AIM_FROM_MICRO` / `LONGEVITY_FATS_AIM_FROM_LONGEVITY` rows and expanded tip asides ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **New persisted field:** extend `blankKeyword`, `loadFoodDefinitions` map, `renderKeywords` row HTML, `syncFieldFromDom`, `exportFoodObject` / `applyImportItemToKeyword`.
- **Dashboard metric:** extend `totalsFromText` / `dashboardCardHtml` / `renderWeekSummary`; micro % DV uses `microTotalsFromText` / `renderMicroRequirements` / `renderMicroDailyGrid`; longevity uses `longevityTotalsFromText` / `renderLongevityPanel`; ranked sources use `microContributionsFromText` / `openMicroSourcesModal` / `openLongevitySourcesModal` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Demographic / TDEE / body weight:** extend `DAILY_MICRO_DV` / `CALORIE_BASELINE` in `demographic-dv.js`; `loadDemographic` / `setDemographic` / `loadTdee` / `saveTdee` / TDEE calculator + body-weight kg/lb input (`loadBodyWeight` / `saveBodyWeight` / `getBodyWeightKg`) in settings ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Serving multiplier:** `KEYWORD_SERVING_MULTIPLIER_RE` / `keywordServingMultiplier` (counting) + `highlightServingMultipliersHtml` (highlight as `.hl--multiplier`); `stripKeywordServingMultiplier` for line-match checks ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Unmatched-lines report:** `unmatchedDayLines` / `allUnmatchedDayLines` / `updateWeekUnmatchedLines` → `#day-unmatched-lines`; hidden while a day textarea is focused or highlights are off ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food-table search / pagination / sort:** `keywordsFilterQuery` + `setKeywordsFilterQuery`, `keywordsPageSize` / `keywordsPageIndex` + `keywordsPageBounds` / `goKeywordsPage` / `changeKeywordsPageSize`, `sortKeywordsAlphabetically`; `renderKeywords` only renders the current filtered page ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Fiber component ratio:** `solubleFiber` / `insolubleFiber` micros, `splitTotalFiber` / `solubleFiberRatioForFoodName` (auto-split by food name), `fiberTotalFromParts`; `FIBER_COMPONENT_DV_RATIO` in `demographic-dv.js` derives their DV from total fiber ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Daily intake icon:** add/remove micro keys in `DAILY_INTAKE_MICRO_KEYS` in `demographic-dv.js` when a nutrient has poor body storage and weekly averaging is misleading ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Day meals:** `loadDayNotes` / `saveDayNotes`; bulk `exportAllDayMeals` / `applyImportAllDayMealsReplace` (missing days: empty out or leave alone); clear via `clearDayNotes` / `clearAllDayNotes` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food notes (day meals toolbar):** add entries to `definitions-food-notes.json` (`label`, `pattern`, `note`); `loadFoodNotesDefinitions` / `detectedFoodNotes` / `updateDayFoodNotesUi` ([core doc](./AGENTS_CODE_REFERENCE-core.md)); toolbar markup + popover CSS ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Day editor height:** `loadDayEditorHeight` / `saveDayEditorHeight` / `applyDayEditorHeight` / `bindDayEditorResize`; CSS default `calc(45vh - 2.5rem)` until user resizes ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Food-name suggestions:** `updateDaySuggest` / `foodSuggestMatches` / `DAY_SUGGEST_MAX`; scrollable `.day__suggest-list`; per-line dismiss via Escape or Dismiss ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Starter guide (empty state):** `maybeShowStarterGuideImportStep` / `advanceStarterGuideAfterImport` / `showStarterGuideStep` / `dismissStarterGuide`; `#keywords-empty` inline sample link (`data-action="import-sample-from-empty"`); session-only `starterGuideEligible` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food table calories column:** `keywordCaloriesOpen` / `toggleKeywordCaloriesOpen` / `STORAGE_KEY_CALORIES`; header `.keywords__macro-toggle` switches g ↔ cal ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Def modal ↔ sources modal:** `defModalReturnSources` + `#micro-def-modal-back` (`data-action="return-to-sources-modal"`); title links in sources modals open explain modal with return stack ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **% DV / longevity colors:** edit tiers in `config.json` (`microDvStatus`, `longevityStatus`); read by `tierForMicroPct` / `tierForLongevityPct`.
- **Highlighting** requires mirror DOM; do not style matches only in textarea ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- Preserve HTML-escape paths: `escapeHtml`, `escapeAttr` for injected strings.

## Snippet: refresh pipeline

In `app.js`, function `refreshAll`:

```javascript
function refreshAll() {
  DAYS.forEach(function (day) {
    var el = document.getElementById(day.id);
    if (!el) return;
    if (document.activeElement === el) updateDayHighlights(el);
    else updateDayEditorMode(el);          // editing / viewing / plain
  });
  updateWeekUnmatchedLines();
  renderDashboard();
  updateDayClearButtons();
  updateDayFoodNotesUi();
}
```

Called after food-definition changes; day `input` calls highlight + dashboard + food notes + unmatched-lines directly via `applyDayNoteChange`.

## Snippet: storage save

Near **`saveFoodDefinitions`** in `app.js`:

```javascript
localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
```

Also on `beforeunload`.

---

**Next:** [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) · [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) · [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)
