# AGENTS_CODE_REFERENCE.md

> **Note for AI tools:** This documentation uses **approximate code locations** (e.g. “near the top of `app.js`”, “in the event-binding block at the end”) — **not exact line numbers**. Line numbers drift with edits; approximate cues are intentional for safe navigation.

AI-oriented codebase map for safe modification, feature tracing, and implementation planning.

## Purpose

**Week meals + food definitions** — a client-only nutrition tracker. Users type foods in Mon–Sun notes; **food definitions** supply macros / micros / longevity nutrients per match; a **dashboard** totals grams and calories, shows **micro % DV** vs a demographic profile, and a **longevity panel** for fats, omegas, compounds, carb quality, TMAO balance, and glycemic load; a **week bar** shows total calories.

No backend, no bundler, no framework.

## Companion files

| File | Scope |
|------|--------|
| [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) | Data model, localStorage, matching, dashboard math, micro % DV, longevity panel, definitions modals, highlights, food-definition table |
| [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) | Single + bulk JSON import, sample import, AI prompt panels (import + micro gaps), ChatGPT/Claude links |
| [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md) | `index.html` regions, `styles.css` layout, modals, highlight overlay |

When context is tight: read **this file** first, then open the one feature file you need. Full logic lives in `app.js` (~4500 lines) — load it whole only when editing behavior, otherwise navigate by the function names listed in the companion docs.

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Static HTML5 |
| Style | Plain CSS (`styles.css`, ~2500 lines) |
| Logic | Single IIFE in `app.js` (~4500 lines) |
| Data files | `config.json` (% DV tiers), `definitions-micronutrients.json`, `definitions-longevity.json`, `samples/definitions-food.json` (all `fetch`ed at boot / on demand) |
| Reference values | `demographic-dv.js` (micro DV), `longevity-dv.js` (longevity DV) — globals, loaded before `app.js` |
| Persistence | `localStorage` for **food definitions**, **day meals**, **demographic**, **reorder toggle** |
| Run | Open `index.html` via a static file server (boot `fetch`es JSON, so `file://` will fall back to defaults) |

## Architecture (high level)

```text
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                              │
│   ├─ per-day cards (macros + calories)                  │
│   ├─ week total bar (toggle)                            │
│   ├─ Micro requirements panel (% DV; weekly avg / daily)│
│   └─ Longevity panel (fats, omega, compounds, carb,     │
│      TMAO balance, glycemic load, derived ratios)       │
│  ← computed from day text × food-definition nutrients   │
├─────────────────────────────────────────────────────────┤
│  Mon–Sun textareas (mirror backdrop = highlights)       │
├─────────────────────────────────────────────────────────┤
│  Food definitions table (CRUD, micros + longevity       │
│  modals, single/bulk/sample import, reorder)            │
│  ← persisted: localStorage `nutrients-food-definitions` │
│  Demographic panel (male/female DV profile, collapsed)  │
│  ← persisted: localStorage `nutrients-demographic`      │
└─────────────────────────────────────────────────────────┘
```

**Persisted:** day meals (`nutrients-day-notes`), food definitions (`nutrients-food-definitions`), demographic (`nutrients-demographic`), reorder-open flag (`nutrients-keywords-reorder-open`). Bulk export/import for meals and foods; sample import from `samples/definitions-food.json`; clear per day with `confirm`.

## File tree

```text
nutrients/
├── index.html                      (~444 lines)  Page structure, modals, static day editors
├── styles.css                      (~2500 lines) Layout, dashboard, table, modals, responsive, print
├── app.js                          (~4500 lines) All application logic (IIFE)
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

1. **Boot** (end of `app.js`): `loadAppConfig()` → in parallel `loadMicroDefinitions()` + `loadLongevityDefinitions()` → `boot()`: `loadFoodDefinitions()` → `loadKeywordReorderOpen()` → `loadDayNotes()` → `loadDemographic()` → `renderDemographicUi()` → `renderKeywords()` → `refreshAll()`. Listeners are bound earlier in the same closure.
2. **User types in a day note** → `updateDayHighlights` + `renderDashboard` (each `input` on day textareas).
3. **User edits food row / micros modal / longevity modal** → sync to `keywords[]` → `saveFoodDefinitions()` → `refreshAll()`.
4. **Match rule:** whole-word, case-insensitive `\b(name)\b`; each occurrence adds that definition’s macros/micros/longevity once.
5. **Calories:** protein×4 + carbs×4 + fats×9 per day; week bar sums seven days.
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
- `MICRO_FIELDS` — `{ key, label, unit, code }` for 14 micros; `code` drives button label (`f`, `na`, `b12`, …).
- `LONGEVITY_FIELDS` — `{ key, label, unit, code, group, limiting? }` for the longevity nutrients (fats, omega, compounds, carb). `group` ∈ `LONGEVITY_GROUPS` ids; `limiting: true` flips the % DV color scale (high = bad).
- `CARB_QUALITY_KEYS` — subset of longevity keys (`glycemicIndex`, `addedSugar`, `refinedCarbs`, `netCarbs`) surfaced as `carbQuality` on import/export.
- `LONGEVITY_GROUPS`, `LONGEVITY_FROM_MICRO`, `LONGEVITY_COMPOUNDS_FROM_MICRO`, `LONGEVITY_TMAO_*`, `LONGEVITY_DERIVED_DEFS`, `LONGEVITY_SECTION_DEFS` — drive longevity panel sections, TMAO balance, and derived scores.
- `STORAGE_KEY` — `nutrients-food-definitions`; migrates from `STORAGE_KEY_LEGACY` (`nutrients-keywords`).
- `STORAGE_KEY_DEMOGRAPHIC` — `nutrients-demographic`; `male` | `female`, default `male`.
- `STORAGE_KEY_DAYS` — `nutrients-day-notes`. `STORAGE_KEY_REORDER` — `nutrients-keywords-reorder-open`.
- `demographicDv` / `longevityDv` — references to `window.NutrientsDemographicDv` / `window.NutrientsLongevityDv` (must load before `app.js`).
- `CAL_PROTEIN|CARBS|FATS` — 4, 4, 9.
- `CHATGPT_URL`, `CLAUDE_URL`, `IMPORT_SAMPLE_FOODS_URL` (`samples/definitions-food.json`).

## UI regions (`index.html`)

Top to bottom inside `<main class="week">`:

1. Header
2. `.dashboard` — `#dashboard-grid`; toggles `#dashboard-print`, `#dashboard-week-toggle` (`#week-summary`), `#dashboard-micro-toggle` (`#dashboard-micro-panel`), `#dashboard-longevity-toggle` (`#dashboard-longevity-panel`)
   - Micro panel: weekly/daily view segments, **Show DV targets** toggle, **Ask AI to help fill gaps**, `#dashboard-micro-list` + `#dashboard-micro-daily-grid`
   - Longevity panel: `#dashboard-longevity-content` + processed-food note
3. `.week__days-toolbar` — export/import all meals, clear all days
4. `.week__grid` — seven `.day__editor` (backdrop + transparent textarea)
5. `.keywords` — food definitions table (`#keywords-table`, body `#keywords-list`, reorder toggle, add + bulk + sample import)
6. `.demographic` — collapsible `#demographic-panel`; badge `#demographic-badge`

Outside main (modal siblings): `#import-all-meals-modal`, `#import-all-modal`, `#keyword-position-modal`, `#import-modal`, `#micro-gaps-modal`, `#micro-def-modal`, `#longevity-modal`, `#micro-modal`.

## Safe-change checklist for AI

- **New micronutrient:** add to `MICRO_FIELDS` in `app.js`; `initMicroForm` / `normalizeMicros` / import-export follow automatically; add DV in `demographic-dv.js` (`DAILY_MICRO_DV`, both sexes); optionally add explanatory text under the key in `definitions-micronutrients.json` ([import doc](./AGENTS_CODE_REFERENCE-import.md)).
- **New longevity nutrient:** add to `LONGEVITY_FIELDS` (with `group`, `limiting?`); add DV in `longevity-dv.js` (`DAILY_LONGEVITY_DV`); `initLongevityForm` / `normalizeLongevity` follow; optional text in `definitions-longevity.json`. If it is a carb-quality field, also add to `CARB_QUALITY_KEYS`.
- **New persisted field:** extend `blankKeyword`, `loadFoodDefinitions` map, `renderKeywords` row HTML, `syncFieldFromDom`, `exportFoodObject` / `applyImportItemToKeyword`.
- **Dashboard metric:** extend `totalsFromText` / `dashboardCardHtml` / `renderWeekSummary`; micro % DV uses `microTotalsFromText` / `renderMicroRequirements` / `renderMicroDailyGrid`; longevity uses `longevityTotalsFromText` / `renderLongevityPanel` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Demographic / DV:** extend `DAILY_MICRO_DV` in `demographic-dv.js` and `loadDemographic` / `setDemographic` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Day meals:** `loadDayNotes` / `saveDayNotes`; bulk `exportAllDayMeals` / `applyImportAllDayMealsReplace` (missing days: empty out or leave alone); clear via `clearDayNotes` / `clearAllDayNotes` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
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
