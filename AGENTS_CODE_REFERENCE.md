# AGENTS_CODE_REFERENCE.md

> **Note for AI tools:** This documentation uses **approximate code locations** (e.g. “near the top of `app.js`”, “in the event-binding block at the end”) — **not exact line numbers**. Line numbers drift with edits; approximate cues are intentional for safe navigation.

AI-oriented codebase map for safe modification, feature tracing, and implementation planning.

**Agent entry:** [AGENTS.md](./AGENTS.md) · skills discovery: [SKILLS.md](./SKILLS.md)

## Purpose

**Week meals + food definitions** — a client-only nutrition tracker. Users type foods in Mon–Sun notes (optionally with a `* N` serving multiplier per line); **food definitions** supply macros / micros / longevity nutrients per match; a **dashboard** totals grams and calories (toggleable **macro %** per day), shows **micro % target** vs a demographic profile (FDA %DV, or **IOM body-weight minimum** / **study min** / **study max** for nutrients with no FDA DV; optional **condition focus** incl. **American Common Deficiencies** / **Fat-soluble vitamins**; sticky **Highlight** / **Filter** for daily-intake and acute S/E·A/E icons plus **By Nutrients** chip filter with autocomplete + presets; persisted weekly/daily view and **Daily Targets**), and a **longevity panel** with sticky title + close, section nav, % DV bars (100% reference notch), sections including **Upper GI Motility**, **Thyroid**, **Liver**, **Kidney**, **Gray hair**, **Aches** (incl. omega-6:3 ratio), **Brain** / astrocyte support, **Vascular - Blood Pressure** (FDA/WHO/AHA sodium ceilings), K1/K2/MK-4/MK-7 breakdown, plant sterols, visceral-fat, and **ranked food-source modals**; a **week summary** shows week total, **daily average calories**, **TDEE deficit/surplus**, and **macro split** with body-type guidance. **Today’s weekday** is visually emphasized on day cards and day editors. Unmatched day-meal lines use a collapsible **carousel** (always available when any exist); **Import sample** loads bundled day meals as well as foods.

No backend, no bundler, no framework.

## Companion files

| File | Scope |
|------|--------|
| [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) | Data model, localStorage, matching, dashboard math, micro % DV, condition focus, sticky icon show/filter/highlight + By Nutrients filter, acute toxicity, ranked source modals, TDEE/settings, longevity panel + nav (Upper GI / Thyroid / Liver / Kidney / Gray hair / Aches / Brain; multi-ceiling sodium), definition modals, highlights, food notes, unmatched carousel, starter guide, food-definition table |
| [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) | Single + bulk JSON import, sample food + sample day-meals import, AI prompt panels (import + micro gaps), ChatGPT/Claude links |
| [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md) | `index.html` regions, `styles.css` layout, sticky panel chrome, settings/TDEE modals, sources modals, food-notes toolbar popover, unmatched carousel, today styling, starter guide popover, highlight overlay |

When context is tight: read **this file** first, then open the one feature file you need. Full logic lives in `app.js` (~18,160 lines) — load it whole only when editing behavior, otherwise navigate by the function names listed in the companion docs.

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Static HTML5 |
| Style | Plain CSS (`styles.css`, ~7,060 lines) |
| Logic | Single IIFE in `app.js` (~18,160 lines) |
| Data files | `config.json` (% DV tiers), `definitions-micronutrients.json`, `definitions-longevity.json`, `definitions-food-notes.json`, `definitions-food-categories.json`, `samples/definitions-food.json`, `samples/day-meals.json` (all `fetch`ed at boot / on demand) |
| Reference values | `demographic-dv.js` (micro DV, IOM amino-acid bw minimums, fiber component ratio), `longevity-dv.js` (longevity DV) — globals, loaded before `app.js` |
| Persistence | `localStorage` for **food definitions**, **day meals**, **demographic**, **TDEE**, **body weight**, **day editor height**, **highlights on/off**, **micro panel view** (weekly vs each-day), **Daily Targets**, **acute S/E·A/E icon visibility**, **daily-intake icon visibility**, **sticky Filter / Highlight** (daily / side / adverse), **By Nutrients filter keys**, **reorder toggle**, **calories-column toggle**, **table page size** |
| Guides / QA | `GUIDE_ADDING_FOOD.md`, `GUIDE_IMPROVING_FOOD.md`, `GUIDE_ADDING_MULTIVITAMIN.md`; `scripts/run-micro-qa.js`, `scripts/run-plant-sterols-qa.js`, `scripts/list-uncategorized-foods.js`; `.agents/skills/qa-definitions-food.json`, `.agents/skills/categorize-food-definitions.json` |
| Run | Open `index.html` via a static file server (boot `fetch`es JSON, so `file://` will fall back to defaults) |

## Architecture (high level)

```text
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                              │
│   ├─ per-day cards (macros + calories; toggle macro %;  │
│   │   today’s weekday emphasized)                       │
│   ├─ week summary (week total, day avg, TDEE vs intake,│
│   │   macro split + body-type guidance)                 │
│   ├─ Micro requirements (sticky title + close; % target;│
│   │   condition focus; Highlight/Filter for daily+S/E+ │
│   │   A/E icons + By Nutrients; weekly/daily + Daily    │
│   │   Targets; ranked sources; acute toxicity popovers) │
│   └─ Longevity (sticky title + close + shared icon      │
│      options; section nav; Upper GI / Thyroid / Liver / │
│      Kidney / Gray hair / Aches / Brain; multi-ceiling  │
│      sodium; % DV bars w/ 100% notch; ranked sources)   │
│  ← computed from day text × food-definition nutrients   │
├─────────────────────────────────────────────────────────┤
│  Mon–Sun textareas (editing/viewing/plain; today styled;│
│  food-name suggest; shared resize; Import sample meals; │
│  unmatched carousel below highlight bar)                │
├─────────────────────────────────────────────────────────┤
│  Food definitions table (CRUD, search/category filter, pagination,│
│  sort A–Z, optional cal column, micros + longevity       │
│  modals, single/bulk/sample import, reorder,             │
│  move-to-position; empty-state sample link)              │
│  ← persisted: localStorage `nutrients-food-definitions` │
│  Settings (header): sex / micro DV profile + TDEE + weight│
│  ← persisted: `nutrients-demographic`, `nutrients-tdee`, │
│    `nutrients-body-weight-kg`                             │
└─────────────────────────────────────────────────────────┘
```

**Persisted:** day meals (`nutrients-day-notes`), food definitions (`nutrients-food-definitions`), demographic (`nutrients-demographic`), TDEE (`nutrients-tdee`), body weight kg (`nutrients-body-weight-kg`), day editor height (`nutrients-day-editor-height`), highlights on/off (`nutrients-day-highlights`), micro panel weekly-vs-daily view (`nutrients-micro-view-daily`), micro **Daily Targets** toggle (`nutrients-micro-show-dv`), acute S/E / A/E icon show (`nutrients-show-acute-side-effects`, `nutrients-show-acute-adverse-effects`), daily-intake icon show (`nutrients-show-daily-intake-icons`, default on), sticky Filter (`nutrients-filter-daily-intake` / `-side-effects` / `-adverse-effects`), sticky **By Nutrients** keys (`nutrients-filter-nutrients`, JSON array), sticky Highlight (`nutrients-highlight-daily-intake` / `-side-effects` / `-adverse-effects`), reorder-open flag (`nutrients-keywords-reorder-open`), food-table calories column (`nutrients-keywords-calories-open`), food-table page size (`nutrients-keywords-page-size`). Bulk export/import for meals and foods; sample foods from `samples/definitions-food.json`; sample meals from `samples/day-meals.json`; clear per day with `confirm`.

## File tree

```text
nutrients/
├── index.html                      (~1,760 lines) Page structure, sticky panel chrome, modals, starter guide, day editors
├── styles.css                      (~7,060 lines) Layout, dashboard, sticky options, nutrient filter, today styling, table, modals, print
├── app.js                          (~18,160 lines) All application logic (IIFE)
├── config.json                     Micro + longevity % DV tier colors / font weights (fetched at boot)
├── demographic-dv.js               window.NutrientsDemographicDv — gender micro DV targets, daily-intake key list, IOM amino-acid bw minimums, fiber component ratio
├── longevity-dv.js                 window.NutrientsLongevityDv — longevity nutrient DV targets
├── definitions-micronutrients.json Per-micro explanatory text (tooLow/enough/tooHigh/foodSources/male/female)
├── definitions-longevity.json      Per-longevity-nutrient + section explanatory text
├── definitions-food-notes.json     Day-meal food notes (regex match → contextual hints in toolbar)
├── definitions-food-categories.json  Food-table category filter map (id/label/patterns)
├── GUIDE_ADDING_FOOD.md            Human/agent guide for new sample foods
├── GUIDE_IMPROVING_FOOD.md         Guide for upgrading existing sample foods
├── GUIDE_ADDING_MULTIVITAMIN.md    Guide for multivitamin-style definitions
├── samples/
│   ├── definitions-food.json       Sample food list (Import sample foods)
│   ├── day-meals.json              Sample Mon–Sun meals (Import sample meals)
│   └── definitions-food-qa-checked.json  QA working copy for micro fill scripts
├── scripts/
│   ├── run-micro-qa.js             Fill missing micros in sample foods
│   └── run-plant-sterols-qa.js     Plant-sterols QA helper
├── .agents/skills/
│   ├── qa-definitions-food.json           Skill workflow for food nutrient QA
│   └── categorize-food-definitions.json   Skill workflow for food category map gaps
└── AGENTS_CODE_REFERENCE*.md        AI docs (this set)
```

## Code flow

1. **Boot** (end of `app.js`): `loadAppConfig()` → in parallel `loadMicroDefinitions()` + `loadLongevityDefinitions()` + `loadFoodNotesDefinitions()` (pending = 3) → `boot()`: `loadFoodDefinitions()` → `loadKeywordReorderOpen()` → `loadKeywordCaloriesOpen()` → `loadKeywordsPageSize()` → `loadDayNotes()` → `loadDayHighlightsPreference()` → `loadDayEditorHeight()` → `markTodayDay()` → `loadMicroViewDaily()` → `loadShowMicroDailyDv()` → `loadShowAcuteToxicityIcons()` → `loadShowDailyIntakeIcons()` → `loadStickyIconFilters()` → `loadStickyIconHighlights()` → sync toggle UIs → `loadDemographic()` → `loadTdee()` → `loadBodyWeight()` → `renderDemographicUi()` → `syncSettingsTdeeInput()` / `syncSettingsWeightInput()` → `renderKeywords()` → `initLongevityNav()` → `initTargetRefPopoverEvents()` → `refreshAll()` → `applyInitialLongevityHash()` → `maybeShowStarterGuideImportStep()` (empty food list only). Listeners are bound earlier in the same closure (`bindDay` per textarea, `bindDayEditorResize` on the week grid, `initDayFoodNotesEvents` once).
2. **User types in a day note** → `applyDayNoteChange` (highlights via editor mode) + `renderDashboard` + `updateDayFoodNotesUi` + `updateWeekUnmatchedLines` + `updateDaySuggest` (food-name autocomplete on the current line).
3. **User edits food row / micros modal / longevity modal** → sync to `keywords[]` → `saveFoodDefinitions()` → `refreshAll()`.
4. **Match rule:** whole-word, case-insensitive `\b(name)\b`; each occurrence adds that definition’s macros/micros/longevity once, times the line’s optional `* N` serving multiplier (`keywordServingMultiplier`).
5. **Calories:** protein×4 + carbs×4 + fats×9 per day; week summary sums seven days and compares to TDEE×7 when set.
6. **% target / longevity coloring:** tiers from `config.json` (`microDvStatus`, `longevityStatus.normalTiers` / `limitingTiers`); denominators from `demographic-dv.js` (FDA DV, IOM bw min) and `longevity-dv.js`, or `STUDY_MIN_MICRO_REFS` (aim targets) / `STUDY_MAX_MICRO_REFS` (ceilings) for study-only nutrients.

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
- `MICRO_DERIVED_DEFS` — computed pseudo-nutrients not stored per food; `insolubleToSolubleFiber2To1` (`idealRatio: 2`) and `insolubleToSolubleFiber` (`idealRatio: 3`), both scored on closeness to their ideal ratio.
- `MICRO_CONDITION_FOCUS` — condition ids (`adhd`, `americanCommonDeficiencies`, `fatSolubleVitamins`, `anemia`, `antiAging`, `bowelMovementsAltered`, `cataractsPrevention`, `coffeeTeaUser`, `hairLoss`) → nutrient key lists (+ optional `longevityNutrients`); filters micro panel rows and adds condition notes in def modals. **American Common Deficiencies** and **Fat-soluble vitamins** sit under the **Nutrition Intake** group in the condition dropdown; tips `#micro-tip-common-deficiencies` / `#micro-tip-fat-soluble` stay visible for those focuses.
- `MICRO_INTAKE_FILTER` — non-condition filter groups (`wellAbsorbed`, `poorlyAbsorbed`) shown in the same focus dropdown; `poorlyAbsorbed` filters rows by `microRequiresDailyIntake`.
- `COMMON_DEFICIENCY_NUTRIENT_KEYS` / `FAT_SOLUBLE_NUTRIENT_KEYS` / `NUTRIENT_FILTER_PRESETS` — preset chip sets for sticky **By Nutrients** (`common-deficiencies`, `fat-soluble`); same A/D/Ca/Mg/iodine and A/D/E/K key lists as the matching condition focuses.
- `ACUTE_TOXICITY_BY_MICRO` — per-micro `{ sideEffects[], adverseEffects?[] }` for one-day excess icons (S/E · A/E); drives `#micro-acute-toxicity-popover`.
- `STUDY_MIN_MICRO_REFS` — study-derived **minimum** intake targets (`glycine` 10 g/day, `proline` 5 g/day) for nutrients with no FDA/IOM daily value but research-backed intake levels; `limiting: false` (higher % = better). `STUDY_MAX_MICRO_REFS` — study-derived **ceiling** references (`arginine`, `glutamine`, `taurine`) for nutrients with no FDA/IOM daily value; `limiting: true` (lower % = safer). `NO_STANDALONE_REF_MICRO_KEYS` — nutrients tracked but not independently scored (`vitaminK1`, `vitaminK2`, `vitaminK2MK4`, `vitaminK2MK7`, `cysteine`); log alongside total `vitaminK` when you have a breakdown. `TARGET_REF_POPOVER_DETAILS` — per-key `{ text, url }` objects for the **target-ref popover** that explains the citation behind each study min/max reference (e.g. Shao & Hathcock 2008 for taurine OSL, Meléndez-Hevia et al. 2009 for glycine collagen deficit).
- `KEYWORD_SERVING_MULTIPLIER_RE` — matches a trailing `* N` on a food line; `keywordServingMultiplier` / `stripKeywordServingMultiplier` power the multiplier feature.
- `MACRO_BODY_TYPES` — ectomorph / mesomorph / endomorph mixes with per-goal macro % ranges; rendered in `#macro-split-hint-modal` carousel.
- `LONGEVITY_FIELDS` — `{ key, label, unit, code, group, limiting? }` for the longevity nutrients (fats incl. `plantSterols`, omega, compounds incl. `creatine`, `alphaLipoicAcid`, `glutathione`, carb). `group` ∈ `LONGEVITY_GROUPS` ids; `limiting: true` flips the % DV color scale (high = bad).
- `CARB_QUALITY_KEYS` — subset of longevity keys (`glycemicIndex`, `addedSugar`, `refinedCarbs`, `netCarbs`) surfaced as `carbQuality` on import/export.
- `LONGEVITY_GROUPS`, `LONGEVITY_FROM_MICRO`, `LONGEVITY_COMPOUNDS_FROM_MICRO`, `LONGEVITY_TMAO_*`, `LONGEVITY_DERIVED_DEFS`, `LONGEVITY_SECTION_DEFS`, `LONGEVITY_NAV_SECTIONS_CORE` — drive longevity panel sections (incl. **Upper GI Motility**, **Thyroid**, **Liver**, **Kidney**, **Gray hair**, **Aches**, **Staying sharp & lowering dementia risk** / astrocytes), TMAO balance, and derived scores. Section row maps: `LONGEVITY_UPPER_GI_*`, `LONGEVITY_LIVER_*`, `LONGEVITY_KIDNEY_*`, `LONGEVITY_GRAY_HAIR_*`, `LONGEVITY_ACHES_*`, `LONGEVITY_BRAIN_*`, `LONGEVITY_BRAIN_ASTROCYTE_*`.
- `VASCULAR_SODIUM_LIMIT_REFS` — alternate sodium ceilings for **Vascular - Blood Pressure** (FDA 2,300 mg / WHO 2,000 mg / AHA 1,500 mg); same intake scored via `longevityRowFromMicroLimit` / `vascularSodiumLimitRowsHtml` (limiting: lower % is better).
- `STORAGE_KEY` — `nutrients-food-definitions`; migrates from `STORAGE_KEY_LEGACY` (`nutrients-keywords`).
- `STORAGE_KEY_DEMOGRAPHIC` — `nutrients-demographic`; `male` | `female`, default `male`.
- `STORAGE_KEY_DAYS` — `nutrients-day-notes`. `STORAGE_KEY_DAY_EDITOR_HEIGHT` — `nutrients-day-editor-height` (shared px height for all `.day__editor`). `STORAGE_KEY_DAY_HIGHLIGHTS` — `nutrients-day-highlights` (`on`/`off` pen toggle). `STORAGE_KEY_MICRO_VIEW_DAILY` — `nutrients-micro-view-daily` (`true` = each-day micro grid). `STORAGE_KEY_MICRO_SHOW_DV` — `nutrients-micro-show-dv` (`true` = Daily Targets on). `STORAGE_KEY_SHOW_ACUTE_SIDE_EFFECTS` / `STORAGE_KEY_SHOW_ACUTE_ADVERSE_EFFECTS` — body classes that reveal S/E · A/E icons. `STORAGE_KEY_SHOW_DAILY_INTAKE_ICONS` — daily-intake icon visibility (default on). `STORAGE_KEY_FILTER_*` / `STORAGE_KEY_HIGHLIGHT_*` — sticky Filter / Highlight for `daily-intake`, `side-effects`, `adverse-effects`. `STORAGE_KEY_FILTER_NUTRIENTS` — `nutrients-filter-nutrients` (JSON array of micro keys for **By Nutrients**). `STORAGE_KEY_REORDER` — `nutrients-keywords-reorder-open`. `STORAGE_KEY_TDEE` — `nutrients-tdee` (optional user TDEE number). `STORAGE_KEY_BODY_WEIGHT_KG` — `nutrients-body-weight-kg` (for IOM bw min). `STORAGE_KEY_CALORIES` — `nutrients-keywords-calories-open` (food table shows cal instead of g). `STORAGE_KEY_KEYWORDS_PAGE_SIZE` — `nutrients-keywords-page-size` (10/25/50/100/0=all, default `KEYWORDS_DEFAULT_PAGE_SIZE` = 25).
- `demographicDv` / `longevityDv` — references to `window.NutrientsDemographicDv` / `window.NutrientsLongevityDv` (must load before `app.js`). `demographicDv` also exposes `IOM_BW_MIN_MG_PER_KG`, `getIomBwMinDaily`, `FIBER_COMPONENT_DV_RATIO`.
- `CAL_PROTEIN|CARBS|FATS` — 4, 4, 9.
- `CHATGPT_URL`, `CLAUDE_URL`, `IMPORT_SAMPLE_FOODS_URL` (`samples/definitions-food.json`), `IMPORT_SAMPLE_MEALS_URL` (`samples/day-meals.json`), `FOOD_NOTES_URL` (`definitions-food-notes.json`), `FOOD_CATEGORIES_URL` (`definitions-food-categories.json`).

## UI regions (`index.html`)

Top to bottom inside `<main class="week">`:

1. Header — `#settings-open` (sex icon + Settings; opens `#settings-modal`)
2. `.dashboard` — `#dashboard-grid` (today’s card gets `.dashboard__card--today`); toggles `#dashboard-print`, `#dashboard-week-toggle` (`#week-summary`), `#dashboard-micro-toggle` (`#dashboard-micro-panel`), `#dashboard-longevity-toggle` (`#dashboard-longevity-panel`)
   - Micro panel: sticky `#dashboard-micro-sticky` (title **Micro Requirements**, view segments, **Daily Targets** `#dashboard-micro-dv-toggle`, **Highlight** / **Filter** (icon criteria + nested **By Nutrients** disclosure with presets/combobox/chips) / **Poor storage / daily intake** / **One-day excess consumption** disclosures, `#dashboard-micro-close`); condition focus dropdown (**Nutrition Intake** group includes **American Common Deficiencies** + **Fat-soluble vitamins**; tips `#micro-tip-common-deficiencies` / `#micro-tip-fat-soluble` / `#micro-tip-hair-loss`); **Ask AI** buttons; `#dashboard-micro-list` + `#dashboard-micro-daily-grid`; **My food** → `#micro-sources-modal`; daily-intake icons → `#micro-daily-intake-popover`; acute S/E·A/E icons → `#micro-acute-toxicity-popover`; **target-ref** badges → `#target-ref-popover`
   - Longevity panel: sticky `#dashboard-longevity-nav` (title **Longevity**, same Highlight/Filter/By Nutrients/daily/acute option panels, `#dashboard-longevity-close`, section prev/next + All topics); `#dashboard-longevity-content` with **100% reference notch**; sections include **Upper GI Motility**, **Thyroid**, **Liver**, **Kidney**, **Gray hair**, **Aches** (incl. omega-6:3), **Staying sharp & lowering dementia risk** (brain + astrocytes), **Vascular - Blood Pressure** (FDA/WHO/AHA sodium rows), **Visceral fat**, enriched **Fats & cholesterol**; **My food** → `#longevity-sources-modal`
3. `.week__days-toolbar` — hint mentioning the `* N` multiplier; Export all / Import all / **Import sample** (`#import-sample-meals`) / Clear all days
4. `.week__highlight-bar` — `#day-highlights-toggle` (pen, persisted on/off), `#day-food-notes` (regex-driven notes + popover)
5. `#day-unmatched-lines` — collapsible **Unmatched (N)** carousel (`data-unmatched-action`: toggle / prev / next / jump → `focusDayLine`); shown whenever unmatched lines exist (not gated on highlight mode)
6. `.week__grid` — seven `.day` columns; today’s column gets `.day--today`. Each `.day__editor` (backdrop + textarea + optional `.day__suggest`). Modes: **editing** / **viewing** / **plain**; shared vertical resize.
7. `.keywords` — food definitions table with top `.keywords__toolbar` (duplicate bulk buttons, `-top` ids), `.keywords__filter` search (`#keywords-search`) + category filter (`#keywords-category-open` / `#keywords-category-modal`), `#keywords-table` (body `#keywords-list`), `#keywords-pagination`, `#keywords-filter-empty`, `#keywords-empty` with inline **Import our sample** link, reorder toggle, macro cal/g toggle, **Sort alphabetically**, add + bulk + sample import

Outside main (modal / overlay siblings): `#settings-modal`, `#tdee-calculator-modal`, `#tdee-hint-modal`, `#macro-split-hint-modal`, `#micro-sources-modal`, `#longevity-sources-modal`, `#import-all-meals-modal`, `#import-all-modal`, `#keyword-position-modal`, `#import-modal`, `#micro-gaps-modal`, `#health-timeline-modal`, `#micro-def-modal`, `#longevity-modal`, `#micro-modal`, `#food-note-modal` (long food-note reader), `#phosphorus-binder-modal`, `#caffeine-tip-modal`, `#fats-cholesterol-tip-modal`, `#tmao-protectors-tip-modal`, `#dash-diet-tip-modal`, `#starter-guide` (fixed beginner popover; not a blocking modal). Fixed popover siblings: `#micro-daily-intake-popover`, `#micro-acute-toxicity-popover`, `#target-ref-popover`.

## Safe-change checklist for AI

- **New micronutrient:** add to `MICRO_FIELDS` (core) or `MICRO_EXTENDED_FIELDS` (trace mineral / amino acid, use `group: "amino"`) in `app.js`; `initMicroForm` / `normalizeMicros` / import-export follow automatically; add DV in `demographic-dv.js` (`DAILY_MICRO_DV`, both sexes) — or, if no FDA DV, choose a reference tier: `STUDY_MIN_MICRO_REFS` (study-based aim target, `limiting: false`), `STUDY_MAX_MICRO_REFS` (study-based ceiling, `limiting: true`), an IOM bw min (`IOM_BW_MIN_MG_PER_KG`), or `NO_STANDALONE_REF_MICRO_KEYS` (breakdown fields like K1/K2/MK-4/MK-7, or bundled requirements like cysteine whose IOM EAR is combined with methionine). For any study ref, also add a `TARGET_REF_POPOVER_DETAILS` entry (`{ text, url }`) with citation text and a PubMed/PMC URL. Optionally add explanatory text under the key in `definitions-micronutrients.json` ([import doc](./AGENTS_CODE_REFERENCE-import.md)). Optional condition notes: add a key matching `MICRO_CONDITION_FOCUS` id on that nutrient’s JSON entry.
- **Vitamin K breakdown:** keep total `vitaminK` for FDA % DV; optional `vitaminK1` / `vitaminK2` / `vitaminK2MK4` / `vitaminK2MK7` in `micros`; bridge to longevity via `longevity: true`; `vitaminKKeyDifferencesHtml` in explain modals; `vitaminK2MK4` in `DAILY_INTAKE_MICRO_KEYS` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Micro panel view persistence:** `loadMicroViewDaily` / `saveMicroViewDaily` / `setMicroViewDaily`; `loadShowMicroDailyDv` / `saveShowMicroDailyDv` / `setShowMicroDailyDv` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Condition longevity rows in micro panel:** add keys to `MICRO_CONDITION_FOCUS.*.longevityNutrients`; `microConditionDisplayFields` renders them when that condition is focused; **More nutrients** also merges all conditions’ longevity keys ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **New derived micro metric:** add to `MICRO_DERIVED_DEFS` + `microDerivedRowTargetDisplay` / `microDerivedAmtText`; explanatory text keyed by the derived key in `definitions-micronutrients.json` (may use `warning` / `dashboardTracking` arrays). Fiber ratios: both `insolubleToSolubleFiber2To1` (ideal 2) and `insolubleToSolubleFiber` (ideal 3).
- **New condition focus / filter group:** extend `MICRO_CONDITION_FOCUS` (or `MICRO_INTAKE_FILTER`) + HTML list in `#dashboard-micro-condition-list` (group labels like **Nutrition Intake**); add condition paragraph arrays on relevant keys in `definitions-micronutrients.json` / `definitions-longevity.json`. Tip asides: wire `#micro-tip-*` visibility in `syncMicroConditionUi`.
- **Sticky icon Filter / Highlight / show toggles:** Filter (`setStickyIconFilter` / `microKeyMatchesStickyFilter`) and Highlight (`setStickyIconHighlight` → body classes `highlight-daily-intake-icons` / `highlight-side-effects` / `highlight-adverse-effects`) share state across micro + longevity sticky bars; acute icon visibility via `setShowAcuteToxicityIcons` (body `show-acute-side-effects` / `show-acute-adverse-effects`); daily-intake icons via `setShowDailyIntakeIcons` (body `show-daily-intake-icons`). Persist with matching `STORAGE_KEY_*` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **By Nutrients sticky filter:** `filterStickyNutrientKeys` + `STORAGE_KEY_FILTER_NUTRIENTS`; UI under Filter → **By Nutrients** (mirrored on micro + longevity sticky bars); presets via `NUTRIENT_FILTER_PRESETS` / `applyNutrientFilterPreset`; typeahead via `nutrientFilterSuggestMatches`; AND with icon Filter criteria inside `microKeyMatchesStickyFilter`. Selecting sticky filters clears condition focus (and vice versa).
- **Acute toxicity (one-day excess):** add/edit keys in `ACUTE_TOXICITY_BY_MICRO` (`sideEffects` / `adverseEffects`); icons via `microAcuteToxicityIconsHtml` → `#micro-acute-toxicity-popover` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **New alternate target reference:** wire it into `microNutrientTargetPct` (FDA DV → IOM bw min → study min → study max → none); add a `data-target-ref` badge kind and popover copy in `showTargetRefPopover` ([core doc](./AGENTS_CODE_REFERENCE-core.md)). Study min (`STUDY_MIN_MICRO_REFS`) = aim higher; study max (`STUDY_MAX_MICRO_REFS`) = limiting/ceiling. Both need a `TARGET_REF_POPOVER_DETAILS` entry with citation `text` and PubMed `url`.
- **New longevity nutrient:** add to `LONGEVITY_FIELDS` (with `group`, `limiting?`); add DV in `longevity-dv.js` (`DAILY_LONGEVITY_DV`); `initLongevityForm` / `normalizeLongevity` follow; optional text in `definitions-longevity.json`. If it is a carb-quality field, also add to `CARB_QUALITY_KEYS`. **Carotenoids:** when not stored explicitly, `resolveLongevityValue` estimates mg from `micros.vitaminA` (mcg ÷ 100 when vit A > 50). Liver-tracked compounds currently include `alphaLipoicAcid` and `glutathione` (DV may be `0` = unscored amount display).
- **New longevity section:** add `sectionDefKey` to `LONGEVITY_NAV_SECTIONS_CORE` / `LONGEVITY_SECTION_DEFS`, row maps (`LONGEVITY_*_FROM_MICRO` / `_FROM_LONGEVITY`), HTML in `renderLongevityPanel`, tip helpers, section copy in `definitions-longevity.json`, and a color in `config.json` → `longevityNavTopicColors` (e.g. Upper GI / Thyroid / Liver / Kidney / Gray hair / Aches / Brain pattern).
- **Multi-ceiling micro limits in longevity:** add entries to a `*_LIMIT_REFS` array (see `VASCULAR_SODIUM_LIMIT_REFS`) and render with `longevityRowFromMicroLimit` so one intake is scored against several guideline amounts.
- **Longevity bar 100% notch:** `longevityBarHtml` / `longevityBarShowsRefNotch` / `.dashboard__longevity-bar-notch` — fixed mark at 100% with popover showing reference amount ([core doc](./AGENTS_CODE_REFERENCE-core.md), [ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Plant sterols / enriched fats section:** `plantSterols` in `LONGEVITY_FIELDS` + `DAILY_LONGEVITY_DV` (2 g/day); fats group also pulls `LONGEVITY_FATS_AIM_FROM_MICRO` / `LONGEVITY_FATS_AIM_FROM_LONGEVITY` rows and expanded tip asides ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **New persisted field:** extend `blankKeyword`, `loadFoodDefinitions` map, `renderKeywords` row HTML, `syncFieldFromDom`, `exportFoodObject` / `applyImportItemToKeyword`.
- **Dashboard metric:** extend `totalsFromText` / `dashboardCardHtml` / `renderWeekSummary`; micro % DV uses `microTotalsFromText` / `renderMicroRequirements` / `renderMicroDailyGrid`; longevity uses `longevityTotalsFromText` / `renderLongevityPanel`; ranked sources use `microContributionsFromText` / `openMicroSourcesModal` / `openLongevitySourcesModal` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Demographic / TDEE / body weight:** extend `DAILY_MICRO_DV` / `CALORIE_BASELINE` in `demographic-dv.js`; `loadDemographic` / `setDemographic` / `loadTdee` / `saveTdee` / TDEE calculator + body-weight kg/lb input (`loadBodyWeight` / `saveBodyWeight` / `getBodyWeightKg`) in settings ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Serving multiplier:** `KEYWORD_SERVING_MULTIPLIER_RE` / `keywordServingMultiplier` (counting) + `highlightServingMultipliersHtml` (highlight as `.hl--multiplier`); `stripKeywordServingMultiplier` for line-match checks ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Unmatched-lines carousel:** `unmatchedDayLines` / `allUnmatchedDayLines` / `weekUnmatchedLinesHtml` / `weekUnmatchedCarouselHtml` / `updateWeekUnmatchedLines` / `focusDayLine` → `#day-unmatched-lines`; always shown when items exist; jump focuses the day line ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Today emphasis:** `todayDayId` / `markTodayDay` → `.day--today` on week grid + `.dashboard__card--today` on macro/micro day cards ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Sample day meals:** `importSampleMeals` fetches `IMPORT_SAMPLE_MEALS_URL` (`samples/day-meals.json`); confirm replace when any day has notes ([import doc](./AGENTS_CODE_REFERENCE-import.md)).
- **Food-table search / category / pagination / sort:** `keywordsFilterQuery` + `setKeywordsFilterQuery`, `keywordsCategoryFilter` + `setKeywordsCategoryFilter` / `#keywords-category-modal`, `keywordsPageSize` / `keywordsPageIndex` + `keywordsPageBounds` / `goKeywordsPage` / `changeKeywordsPageSize`, `sortKeywordsAlphabetically`; `renderKeywords` only renders the current filtered page ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food category map:** add/adjust entries in `definitions-food-categories.json` (`id`, `label`, `patterns`); first matching pattern wins; unmatched foods are **Uncategorized**. Agent workflow: `.agents/skills/categorize-food-definitions.json` + `scripts/list-uncategorized-foods.js` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Fiber component ratio:** `solubleFiber` / `insolubleFiber` micros, `splitTotalFiber` / `solubleFiberRatioForFoodName` (auto-split by food name), `fiberTotalFromParts`; `FIBER_COMPONENT_DV_RATIO` in `demographic-dv.js` derives their DV from total fiber ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Daily intake icon:** add/remove micro keys in `DAILY_INTAKE_MICRO_KEYS` in `demographic-dv.js` when a nutrient has poor body storage and weekly averaging is misleading; visibility toggled by sticky **Poor storage / daily intake** ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Day meals:** `loadDayNotes` / `saveDayNotes`; bulk `exportAllDayMeals` / `applyImportAllDayMealsReplace` (missing days: empty out or leave alone); clear via `clearDayNotes` / `clearAllDayNotes` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food notes (day meals toolbar):** add entries to `definitions-food-notes.json` (`label`, `pattern`, `note`); `loadFoodNotesDefinitions` / `detectedFoodNotes` / `updateDayFoodNotesUi` ([core doc](./AGENTS_CODE_REFERENCE-core.md)); toolbar markup + popover CSS ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Day editor height:** `loadDayEditorHeight` / `saveDayEditorHeight` / `applyDayEditorHeight` / `bindDayEditorResize`; CSS default `calc(45vh - 2.5rem)` until user resizes ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- **Food-name suggestions:** `updateDaySuggest` / `positionDaySuggest` / `foodSuggestMatches` / `DAY_SUGGEST_MAX`; places `.day__suggest` below the caret, or `.day__suggest--above` (pinned to editor top) when the caret is in the lower half so the popover does not cover typing ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Starter guide (empty state):** `maybeShowStarterGuideImportStep` / `advanceStarterGuideAfterImport` / `showStarterGuideStep` / `dismissStarterGuide`; `#keywords-empty` inline sample link (`data-action="import-sample-from-empty"`); session-only `starterGuideEligible` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Food table calories column:** `keywordCaloriesOpen` / `toggleKeywordCaloriesOpen` / `STORAGE_KEY_CALORIES`; header `.keywords__macro-toggle` switches g ↔ cal ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Def modal ↔ sources modal:** `defModalReturnSources` + `#micro-def-modal-back` (`data-action="return-to-sources-modal"`); title links in sources modals open explain modal with return stack ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **% DV / longevity colors:** edit tiers in `config.json` (`microDvStatus`, `longevityStatus`); All-topics button colors in `longevityNavTopicColors`. Read by `tierForMicroPct` / `tierForLongevityPct`.
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
