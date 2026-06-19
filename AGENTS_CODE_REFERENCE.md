# AGENTS_CODE_REFERENCE.md

> **Note for AI tools:** This documentation uses **approximate code locations** (e.g. “near the top of `app.js`”, “in the event-binding block at the end”) — **not exact line numbers**. Line numbers drift with edits; approximate cues are intentional for safe navigation.

AI-oriented codebase map for safe modification, feature tracing, and implementation planning.

## Purpose

**Week meals + food definitions** — a client-only nutrition tracker. Users type foods in Mon–Sun notes; **food definitions** supply macros / micros / longevity nutrients per match; a **dashboard** totals grams and calories (toggleable **macro %** per day), shows **micro % DV** vs a demographic profile (optional **condition focus**), and a **longevity panel** with section nav, % DV bars, and **ranked food-source modals**; a **week summary** shows week total, **daily average calories**, **TDEE deficit/surplus**, and **macro split** with body-type guidance.

No backend, no bundler, no framework.

## Companion files

| File | Scope |
|------|--------|
| [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) | Data model, localStorage, matching, dashboard math, micro % DV, condition focus, ranked source modals, TDEE/settings, longevity panel + nav, definition modals, highlights, starter guide, food-definition table |
| [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) | Single + bulk JSON import, sample import, AI prompt panels (import + micro gaps), ChatGPT/Claude links |
| [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md) | `index.html` regions, `styles.css` layout, settings/TDEE modals, sources modals, starter guide popover, highlight overlay |

When context is tight: read **this file** first, then open the one feature file you need. Full logic lives in `app.js` (~8200 lines) — load it whole only when editing behavior, otherwise navigate by the function names listed in the companion docs.

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Static HTML5 |
| Style | Plain CSS (`styles.css`, ~4400 lines) |
| Logic | Single IIFE in `app.js` (~8200 lines) |
| Data files | `config.json` (% DV tiers), `definitions-micronutrients.json`, `definitions-longevity.json`, `samples/definitions-food.json` (all `fetch`ed at boot / on demand) |
| Reference values | `demographic-dv.js` (micro DV), `longevity-dv.js` (longevity DV) — globals, loaded before `app.js` |
| Persistence | `localStorage` for **food definitions**, **day meals**, **demographic**, **TDEE**, **day editor height**, **reorder toggle**, **calories-column toggle** |
| Run | Open `index.html` via a static file server (boot `fetch`es JSON, so `file://` will fall back to defaults) |

## Architecture (high level)

```text
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                              │
│   ├─ per-day cards (macros + calories; toggle macro %)  │
│   ├─ week summary (week total, day avg, TDEE vs intake,│
│   │   macro split + body-type guidance)                 │
│   ├─ Micro requirements panel (% DV; condition focus;    │
│   │   weekly avg / daily; “my food” ranked sources)     │
│   └─ Longevity panel (section nav, % DV bars, TMAO,     │
│      glycemic load, ranked food sources)                │
│  ← computed from day text × food-definition nutrients   │
├─────────────────────────────────────────────────────────┤
│  Mon–Sun textareas (mirror backdrop = highlights; food-name │
│  suggest popover; shared vertical resize on .day__editor)     │
├─────────────────────────────────────────────────────────┤
│  Food definitions table (CRUD, optional cal column,      │
│  micros + longevity modals, single/bulk/sample import,  │
│  reorder, move-to-position; empty-state sample link)    │
│  ← persisted: localStorage `nutrients-food-definitions` │
│  Settings (header): sex / micro DV profile + TDEE       │
│  ← persisted: `nutrients-demographic`, `nutrients-tdee` │
└─────────────────────────────────────────────────────────┘
```

**Persisted:** day meals (`nutrients-day-notes`), food definitions (`nutrients-food-definitions`), demographic (`nutrients-demographic`), TDEE (`nutrients-tdee`), day editor height (`nutrients-day-editor-height`), reorder-open flag (`nutrients-keywords-reorder-open`), food-table calories column (`nutrients-keywords-calories-open`). Bulk export/import for meals and foods; sample import from `samples/definitions-food.json`; clear per day with `confirm`.

## File tree

```text
nutrients/
├── index.html                      (~930 lines)  Page structure, modals, starter guide, static day editors
├── styles.css                      (~4400 lines) Layout, dashboard, table, modals, starter guide, responsive, print
├── app.js                          (~8200 lines) All application logic (IIFE)
├── config.json                     Micro + longevity % DV tier colors / font weights (fetched at boot)
├── demographic-dv.js               window.NutrientsDemographicDv — gender micro DV targets
├── longevity-dv.js                 window.NutrientsLongevityDv — longevity nutrient DV targets
├── definitions-micronutrients.json Per-micro explanatory text (tooLow/enough/tooHigh/foodSources/male/female)
├── definitions-longevity.json      Per-longevity-nutrient explanatory text
├── samples/
│   └── definitions-food.json       Sample food list (Import sample button)
└── AGENTS_CODE_REFERENCE*.md        AI docs (this set)
```

## Code flow

1. **Boot** (end of `app.js`): `loadAppConfig()` → in parallel `loadMicroDefinitions()` + `loadLongevityDefinitions()` → `boot()`: `loadFoodDefinitions()` → `loadKeywordReorderOpen()` → `loadKeywordCaloriesOpen()` → `loadDayNotes()` → `loadDayEditorHeight()` → `loadDemographic()` → `loadTdee()` → `renderDemographicUi()` → `syncSettingsTdeeInput()` → `renderKeywords()` → `refreshAll()` → `maybeShowStarterGuideImportStep()` (empty food list only). Listeners are bound earlier in the same closure (`bindDay` per textarea, `bindDayEditorResize` on the week grid).
2. **User types in a day note** → `updateDayHighlights` + `renderDashboard` + `updateDaySuggest` (food-name autocomplete on the current line).
3. **User edits food row / micros modal / longevity modal** → sync to `keywords[]` → `saveFoodDefinitions()` → `refreshAll()`.
4. **Match rule:** whole-word, case-insensitive `\b(name)\b`; each occurrence adds that definition’s macros/micros/longevity once.
5. **Calories:** protein×4 + carbs×4 + fats×9 per day; week summary sums seven days and compares to TDEE×7 when set.
6. **% DV / longevity coloring:** tiers from `config.json` (`microDvStatus`, `longevityStatus.normalTiers` / `limitingTiers`); denominators from `demographic-dv.js` and `longevity-dv.js`.

## Domain model (food definition)

In-memory array `keywords` (legacy name; UI label is **Food definitions**). Each item:

```javascript
{
  id: "kw-…",      // stable string from makeId()
  name: "",        // match token in day notes
  protein: "",     // grams; number or ""
  carbs: "",
  fats: "",
  micros: {        // keys from MICRO_FIELDS; only some may be set
    fiber: "", sodium: "", /* … */
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
- `MICRO_FIELDS` — `{ key, label, unit, code }` for 20 micros; `code` drives button label (`f`, `na`, `b12`, `b1`, …).
- `MICRO_CONDITION_FOCUS` — condition ids (`coffeeTeaUser`, `adhd`, `anemia`) → nutrient key lists (+ optional `longevityNutrients`); filters micro panel rows and adds condition notes in def modals.
- `MACRO_BODY_TYPES` — ectomorph / mesomorph / endomorph mixes with per-goal macro % ranges; rendered in `#macro-split-hint-modal` carousel.
- `LONGEVITY_FIELDS` — `{ key, label, unit, code, group, limiting? }` for the longevity nutrients (fats, omega, compounds, carb). `group` ∈ `LONGEVITY_GROUPS` ids; `limiting: true` flips the % DV color scale (high = bad).
- `CARB_QUALITY_KEYS` — subset of longevity keys (`glycemicIndex`, `addedSugar`, `refinedCarbs`, `netCarbs`) surfaced as `carbQuality` on import/export.
- `LONGEVITY_GROUPS`, `LONGEVITY_FROM_MICRO`, `LONGEVITY_COMPOUNDS_FROM_MICRO`, `LONGEVITY_TMAO_*`, `LONGEVITY_DERIVED_DEFS`, `LONGEVITY_SECTION_DEFS` — drive longevity panel sections, TMAO balance, and derived scores.
- `STORAGE_KEY` — `nutrients-food-definitions`; migrates from `STORAGE_KEY_LEGACY` (`nutrients-keywords`).
- `STORAGE_KEY_DEMOGRAPHIC` — `nutrients-demographic`; `male` | `female`, default `male`.
- `STORAGE_KEY_DAYS` — `nutrients-day-notes`. `STORAGE_KEY_DAY_EDITOR_HEIGHT` — `nutrients-day-editor-height` (shared px height for all `.day__editor`). `STORAGE_KEY_REORDER` — `nutrients-keywords-reorder-open`. `STORAGE_KEY_TDEE` — `nutrients-tdee` (optional user TDEE number). `STORAGE_KEY_CALORIES` — `nutrients-keywords-calories-open` (food table shows cal instead of g).
- `demographicDv` / `longevityDv` — references to `window.NutrientsDemographicDv` / `window.NutrientsLongevityDv` (must load before `app.js`).
- `CAL_PROTEIN|CARBS|FATS` — 4, 4, 9.
- `CHATGPT_URL`, `CLAUDE_URL`, `IMPORT_SAMPLE_FOODS_URL` (`samples/definitions-food.json`).

## UI regions (`index.html`)

Top to bottom inside `<main class="week">`:

1. Header — `#settings-open` (sex icon + Settings; opens `#settings-modal`)
2. `.dashboard` — `#dashboard-grid`; toggles `#dashboard-print`, `#dashboard-week-toggle` (`#week-summary`), `#dashboard-micro-toggle` (`#dashboard-micro-panel`), `#dashboard-longevity-toggle` (`#dashboard-longevity-panel`)
   - Micro panel: condition focus dropdown, weekly/daily view segments, **Show DV targets**, **Ask AI to help fill gaps**, `#dashboard-micro-list` + `#dashboard-micro-daily-grid`; **My food** icons open `#micro-sources-modal`
   - Longevity panel: intro/disclaimer, sticky `#dashboard-longevity-nav`, `#dashboard-longevity-content` (+ **My food** icons → `#longevity-sources-modal`)
3. `.week__days-toolbar` — export/import all meals, clear all days
4. `.week__grid` — seven `.day__editor` (backdrop + transparent textarea + optional `.day__suggest` popover). Editors are vertically resizable (`resize: vertical` on `.day__editor`); releasing the drag syncs height to all seven and persists.
5. `.keywords` — food definitions table (`#keywords-table`, body `#keywords-list`, `#keywords-empty` with inline **Import our sample** link, reorder toggle, macro cal/g toggle, add + bulk + sample import)

Outside main (modal / overlay siblings): `#settings-modal`, `#tdee-calculator-modal`, `#tdee-hint-modal`, `#macro-split-hint-modal`, `#micro-sources-modal`, `#longevity-sources-modal`, `#import-all-meals-modal`, `#import-all-modal`, `#keyword-position-modal`, `#import-modal`, `#micro-gaps-modal`, `#micro-def-modal`, `#longevity-modal`, `#micro-modal`, `#phosphorus-binder-modal`, `#caffeine-tip-modal`, `#fats-cholesterol-tip-modal`, `#tmao-protectors-tip-modal`, `#starter-guide` (fixed beginner popover; not a blocking modal).

## Safe-change checklist for AI

- **New micronutrient:** add to `MICRO_FIELDS` in `app.js`; `initMicroForm` / `normalizeMicros` / import-export follow automatically; add DV in `demographic-dv.js` (`DAILY_MICRO_DV`, both sexes); optionally add explanatory text under the key in `definitions-micronutrients.json` ([import doc](./AGENTS_CODE_REFERENCE-import.md)). Optional condition notes: add a key matching `MICRO_CONDITION_FOCUS` id on that nutrient’s JSON entry.
- **New condition focus:** extend `MICRO_CONDITION_FOCUS` + HTML list in `#dashboard-micro-condition-list`; add condition paragraph arrays on relevant keys in `definitions-micronutrients.json` / `definitions-longevity.json`.
- **New longevity nutrient:** add to `LONGEVITY_FIELDS` (with `group`, `limiting?`); add DV in `longevity-dv.js` (`DAILY_LONGEVITY_DV`); `initLongevityForm` / `normalizeLongevity` follow; optional text in `definitions-longevity.json`. If it is a carb-quality field, also add to `CARB_QUALITY_KEYS`.
- **New persisted field:** extend `blankKeyword`, `loadFoodDefinitions` map, `renderKeywords` row HTML, `syncFieldFromDom`, `exportFoodObject` / `applyImportItemToKeyword`.
- **Dashboard metric:** extend `totalsFromText` / `dashboardCardHtml` / `renderWeekSummary`; micro % DV uses `microTotalsFromText` / `renderMicroRequirements` / `renderMicroDailyGrid`; longevity uses `longevityTotalsFromText` / `renderLongevityPanel`; ranked sources use `microContributionsFromText` / `openMicroSourcesModal` / `openLongevitySourcesModal` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Demographic / TDEE:** extend `DAILY_MICRO_DV` / `CALORIE_BASELINE` in `demographic-dv.js`; `loadDemographic` / `setDemographic` / `loadTdee` / `saveTdee` / TDEE calculator in settings ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Day meals:** `loadDayNotes` / `saveDayNotes`; bulk `exportAllDayMeals` / `applyImportAllDayMealsReplace` (missing days: empty out or leave alone); clear via `clearDayNotes` / `clearAllDayNotes` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
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
    if (el) updateDayHighlights(el);
  });
  renderDashboard();
}
```

Called after food-definition changes; day `input` calls highlight + dashboard directly.

## Snippet: storage save

Near **`saveFoodDefinitions`** in `app.js`:

```javascript
localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
```

Also on `beforeunload`.

---

**Next:** [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) · [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) · [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)
