# AGENTS_CODE_REFERENCE.md

> **Note for AI tools:** This documentation uses **approximate code locations** (e.g. “near the top of `app.js`”, “in the event-binding block at the end”) — **not exact line numbers**. Line numbers drift with edits; approximate cues are intentional for safe navigation.

AI-oriented codebase map for safe modification, feature tracing, and implementation planning.

## Purpose

**Week notes + food definitions** — a client-only nutrition tracker. Users type foods in Mon–Sun notes; **food definitions** supply macros/micros per match; a **dashboard** totals grams and calories; a **week bar** shows total calories.

No backend, no bundler, no framework.

## Companion files

| File | Scope |
|------|--------|
| [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) | Data model, localStorage, matching, dashboard math, highlights, food-definition table |
| [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) | JSON import modal, AI prompt panel, ChatGPT/Claude links |
| [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md) | `index.html` regions, `styles.css` layout, highlight overlay |

When context is tight: read **this file** first, then open the one feature file you need. Full logic lives in `app.js` (~1066 lines) — load it whole only when editing behavior.

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Static HTML5 |
| Style | Plain CSS (`styles.css`, ~869 lines) |
| Logic | Single IIFE in `app.js` (~1066 lines) |
| Persistence | `localStorage` for **food definitions**, **day notes**, and **demographic** |
| Run | Open `index.html` or any static file server |

## Architecture (high level)

```text
┌─────────────────────────────────────────────────────────┐
│  Dashboard (per-day cards + week total bar)             │
│  ← computed from day text × food-definition macros      │
├─────────────────────────────────────────────────────────┤
│  Mon–Sun textareas (mirror backdrop = highlights)       │
├─────────────────────────────────────────────────────────┤
│  Food definitions table (CRUD, micros modal, import)    │
│  ← persisted: localStorage `nutrients-food-definitions` │
│  Demographic panel (male/female DV profile, collapsed)  │
│  ← persisted: localStorage `nutrients-demographic`      │
└─────────────────────────────────────────────────────────┘
```

**Persisted:** day notes (`nutrients-day-notes`), food definitions, demographic. Clear per day or all days (with `confirm`).

## File tree

```text
nutrients/
├── index.html          (~157 lines)  Page structure, modals, static day editors
├── styles.css          (~869 lines)  Layout, dashboard, table, modals, responsive
├── app.js              All application logic (IIFE)
├── config.json         Micro % DV tier colors & font weights (fetched at boot)
├── demographic-dv.js   Gender-specific daily micro targets (% DV denominators)
└── AGENTS_CODE_REFERENCE*.md         AI docs (this set)
```

## Code flow

1. **Boot** (end of `app.js`): `loadFoodDefinitions()` → `renderKeywords()` → `initMicroForm()` → `refreshAll()` → bind listeners.
2. **User types in a day note** → `updateDayHighlights` + `renderDashboard` (each `input` on day textareas).
3. **User edits food row** → sync row to `keywords[]` → `saveFoodDefinitions()` → `refreshAll()`.
4. **Match rule:** whole-word, case-insensitive `\b(name)\b`; each occurrence adds that definition’s protein/carbs/fats once.
5. **Calories:** protein×4 + carbs×4 + fats×9 per day; week bar sums seven days.

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
  }
}
```

Micronutrients affect **storage and UI** (micros button codes, import JSON) and **dashboard micro requirements** (% DV vs demographic daily values). Macros-only cards still omit micros; expand **Micro requirements** on the dashboard for average daily % DV (Mon–Sun).

## Key constants (near top of `app.js`)

- `DAYS` — seven entries `{ id, label }` (`mon`…`sun`).
- `MICRO_FIELDS` — `{ key, label, unit, code }` for 12 micros; `code` drives button label (`f`, `na`, `b12`, …).
- `STORAGE_KEY` — `nutrients-food-definitions`; migrates from `nutrients-keywords`.
- `STORAGE_KEY_DEMOGRAPHIC` — `nutrients-demographic`; `male` | `female`, default `male`.
- `demographic-dv.js` — `NutrientsDemographicDv.getDailyMicroDv(demographic, microKey)` for % DV denominators (must load before `app.js`).
- `CAL_PROTEIN|CARBS|FATS` — 4, 4, 9.

## UI regions (`index.html`)

Top to bottom inside `<main class="week">`:

1. Header  
2. `.dashboard` — `#dashboard-grid`; optional `#week-summary` (`#dashboard-week-toggle`) and `#dashboard-micro-panel` (`#dashboard-micro-toggle`)  
3. `.week__grid` — seven `.day__editor` (backdrop + transparent textarea)  
4. `.keywords` — food definitions table; `#keywords-list` body rendered in JS  
5. `.demographic` — collapsible `#demographic-panel` below food definitions; badge `#demographic-badge`  

Outside main: `#import-modal`, `#micro-modal`.

## Safe-change checklist for AI

- **New micronutrient:** add to `MICRO_FIELDS` in `app.js`; `initMicroForm` / `normalizeMicros` / import export follow automatically; update AI prompt helpers if needed ([import doc](./AGENTS_CODE_REFERENCE-import.md)).
- **New persisted field:** extend `blankKeyword`, `loadFoodDefinitions` map, `renderKeywords` row HTML, `syncFieldFromDom`, `exportFoodJson` / `applyImportJson`.
- **Dashboard metric:** extend `totalsFromText` / `dashboardCardHtml` / `renderWeekSummary`; micro % DV uses `microTotalsFromText` / `renderMicroRequirements` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Demographic / DV:** extend `DV_BY_DEMOGRAPHIC` and `loadDemographic` / `setDemographic` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Day notes:** `loadDayNotes` / `saveDayNotes`; clear via `clearDayNotes` / `clearAllDayNotes` ([core doc](./AGENTS_CODE_REFERENCE-core.md)).
- **Highlighting** requires mirror DOM; do not style matches only in textarea ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
- Preserve HTML-escape paths: `escapeHtml`, `escapeAttr` for injected strings.

## Recent git history (themes)

| Commit (approx.) | Theme |
|------------------|--------|
| `1335763` Initial | Mon–Sat layout, plain HTML/CSS/JS |
| `9e07974` Added calculations | Dashboard, week calorie bar, keyword matching |
| `3ac61f1` Added import | JSON import modal, food definitions |
| `19544af` Added AI hint | AI prompt panel, portion field, ChatGPT/Claude, micros codes |

## Snippet: refresh pipeline

Located in the **middle third** of `app.js`, function `refreshAll`:

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
