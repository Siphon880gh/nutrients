# AGENTS_CODE_REFERENCE-core.md

> **Approximate locations only** — no exact line numbers. Code moves; use section names and relative position within `app.js` (~1066 lines).

Core logic: food definitions, matching, highlighting orchestration, dashboard totals, localStorage.

Parent overview: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Module responsibility

| Concern | Primary symbols |
|---------|-----------------|
| In-memory state | `keywords[]`, `demographic`, `microRequirementsOpen`, `activeMicroId`, `activeImportId` |
| IDs | `makeId()`, `findIndex(id)` |
| Table UI | `renderKeywords`, `syncFieldFromDom`, `moveKeyword`, `removeKeyword`, `addKeyword` |
| Matching | `countKeyword`, `keywordNames`, `buildHighlightRegex` |
| Totals | `totalsFromText`, `addTotals`, `renderDashboard`, `renderWeekSummary` |
| Micro totals / DV | `microTotalsFromText`, `weekMicroTotals`, `renderMicroRequirements`, `setMicroRequirementsOpen` |
| Demographic | `loadDemographic`, `saveDemographic`, `setDemographic`, `renderDemographicUi`, `DV_BY_DEMOGRAPHIC` |
| Highlights | `updateDayHighlights`, `highlightedHtml`, `refreshAll` |
| Persistence | `saveFoodDefinitions`, `loadFoodDefinitions` |

## Data lifecycle

```text
loadFoodDefinitions()  → keywords[]
        ↓
renderKeywords()       → DOM table rows (innerHTML per row)
        ↓
user edit / import / micros modal
        ↓
saveFoodDefinitions()  → localStorage
        ↓
refreshAll()           → highlights + dashboard
```

## Food definition CRUD

**Render** — `renderKeywords` in the **lower half** of `app.js`:

- Clears `#keywords-list`, builds one `<tr data-id="…">` per item.
- Columns: reorder (↑↓), name, protein/carbs/fats inputs, micros button (`microsButtonHtml`), Import, Delete.
- Row actions use `data-action`: `up` | `down` | `delete` | `micros` | `import`.

**Inline edit** — delegated `input` on `#keywords-list`:

- `syncFieldFromDom(row)` reads `data-field` inputs into `keywords[i]`.
- Macros use `parseMacro` on input (empty → stored as `""` via branch in sync).

**Reorder/delete/add** — `moveKeyword`, `removeKeyword`, `addKeyword`; each saves and calls `renderKeywords` + `refreshAll`. Closing modals if the active row is removed/moved.

## Matching & counting

**Whole-word regex** per food name:

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
- Accumulates `week` via `addTotals`.
- Sets `#dashboard-grid` HTML from `dashboardCardHtml` (per-macro g + cal, total cal).
- Calls `renderWeekSummary(week)` → `#week-summary` shows **Week total** + `data-week-extras` (empty hook for future EOW stats).
- If **Micro requirements** is expanded (`#dashboard-micro-toggle`), `renderMicroRequirements` fills `#dashboard-micro-list`.

**Micro requirements** — `microTotalsFromText` mirrors macro matching (hits × per-food micros). Week sum ÷ `MICRO_AVG_DAYS` (6) vs `dailyDv(key)` from `DV_BY_DEMOGRAPHIC[demographic]` → average daily **% DV**. **% DV color/weight** comes from `config.json` → `microDvStatus.tiers` (loaded by `loadAppConfig`; fallback `DEFAULT_MICRO_DV_STATUS` in `app.js`). `tierForMicroPct` picks the tier with the highest `minPercent` still ≤ value. Toggle state is session-only; demographic is persisted.

**Calorie constants** — `CAL_PROTEIN`, `CAL_CARBS`, `CAL_FATS` at file top.

## Highlighting (logic side)

**`updateDayHighlights(textarea)`**:

- Finds `.day__backdrop` in same `.day__editor`.
- Sets `backdrop.innerHTML = highlightedHtml(text, regex)`.
- `syncScroll` copies scroll position from textarea.

**`highlightedHtml`** — walks regex matches, wraps in `<mark class="hl">`; escapes all text.

UI mirror pattern: [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md)

## Micronutrients modal (core touchpoints)

- **`MICRO_FIELDS`** — near top of `app.js`; single source of truth for keys/units/codes.
- **`initMicroForm`** — builds `#micro-form` inputs once at boot (`data-micro-key`).
- **`openMicroModal` / `saveMicrosFromForm` / `closeMicroModal`** — mid-file; debounced save on `input` (`scheduleMicroSave`, 250ms).
- **Button label** — `filledMicroCodes` → comma-separated `code`s; `keywords__micros--filled` class; tooltip `data-tooltip` on hover ([ui doc](./AGENTS_CODE_REFERENCE-ui.md)).

Micros are **not** in macro `totalsFromText`; use `microTotalsFromText` / `weekMicroTotals` for the micro panel.

## localStorage

| Key | Content |
|-----|---------|
| `nutrients-food-definitions` | `JSON.stringify(keywords)` |
| `nutrients-demographic` | `"male"` or `"female"` (default `male` if missing) |
| `nutrients-keywords` (legacy) | Migrated once on load, then removed |

**Load** — `loadFoodDefinitions`: maps array, `normalizeMicros(item.micros)`, bumps `nextId` from existing ids.

**Save triggers** — row input, add/delete/reorder, micros save, import apply, demographic change, `beforeunload` (definitions + demographic).

## Internal naming vs UI

- Code still uses `keywords`, `addKeyword`, `#keywords-list`, `blankKeyword` — **UI strings say “Food definitions”**. Prefer extending existing names unless doing a deliberate rename pass.

## Extension points

| Goal | Where to edit |
|------|----------------|
| Sum micros into per-day cards | `dashboardCardHtml` + `microTotalsFromText` per day |
| Change DV profile | `DV_BY_DEMOGRAPHIC`, `MICRO_FIELDS` keys must align |
| New demographic option | `DEMOGRAPHIC_META`, HTML options, `normalizeDemographic`, DV table |
| Persist day notes | New `STORAGE_KEY`, load/save in `bindDay`, boot |
| Sunday column | `DAYS`, HTML day column, CSS grid columns |
| Stricter matching | `countKeyword` / regex builder |
| Partial-word match | Conflicts with whole-word design — change both match and highlight |

## Event binding (end of `app.js`)

Roughly **last 15% of file**:

- `keywordsListEl` click/input (table).
- Per-day `bindDay` loop over `DAYS`.
- `addKeywordBtn`, `beforeunload`, modals (import/micro) — see [import doc](./AGENTS_CODE_REFERENCE-import.md).

Boot calls: `loadFoodDefinitions(); renderKeywords(); refreshAll();` immediately before IIFE closes.
