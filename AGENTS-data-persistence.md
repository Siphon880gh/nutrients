# Data Persistence Architecture

## Overview

Nutrients uses a **repository module** ([`persist.js`](./persist.js)) so UI/domain code in `app.js` never touches `localStorage` directly for app data. Storage is organized as four table-like keys (food definitions, day meals, favorites, settings).

```
┌─────────────────────────────────────────────────────────┐
│                     UI / domain                          │
│  (app.js — editors, dashboard, favorites, settings)     │
└─────────────────────┬───────────────────────────────────┘
                      │ calls helpers that wrap:
                      │ - saveFoodDefinitions() / loadFoodDefinitions()
                      │ - saveDayNotes() / loadDayNotes()
                      │ - saveFavorites() / loadFavorites()
                      │ - saveDemographic(), saveTdee(), …
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 NutrientsPersist                         │
│  (persist.js — public repository API)                   │
│                                                          │
│  Tables:                                                 │
│  - load/saveFoodDefinitions()                           │
│  - load/saveDayMeals()                                  │
│  - load/saveFavorites()                                 │
│  - load/save/patchSettings(), get/setSetting()          │
│  - migrate()                                            │
└─────────────────────┬───────────────────────────────────┘
                      │ JSON read/write + legacy migrate
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     localStorage                         │
│  nutrients_food_definitions                              │
│  nutrients_day_meals                                     │
│  nutrients_favorites                                     │
│  nutrients_settings                                      │
└─────────────────────────────────────────────────────────┘
```

Script order in [`index.html`](./index.html): `demographic-dv.js` → `longevity-dv.js` → **`persist.js`** → `app.js`.

Spec for shapes and migration: [`specs-data-persistence.md`](./specs-data-persistence.md).

## NutrientsPersist API

| Method | Description |
|--------|-------------|
| `migrate()` | One-shot copy from legacy hyphenated keys into the four tables; removes legacy keys. Safe to call repeatedly. |
| `loadFoodDefinitions()` | Returns `FoodDefinition[]` or `null` |
| `saveFoodDefinitions(rows)` | Writes the food definitions table |
| `loadDayMeals()` | Returns day-meals payload object or `null` |
| `saveDayMeals(payload)` | Writes `{ version: 2, days: {…} }` |
| `loadFavorites()` | Returns `Favorite[]` or `null` |
| `saveFavorites(rows)` | Writes the favorites table |
| `loadSettings()` | Returns full settings object (defaults merged) |
| `saveSettings(settings)` | Replaces settings row |
| `patchSettings(partial)` | Merges keys into settings and saves |
| `getSetting(key)` / `setSetting(key, value)` | Single-field helpers |
| `defaultSettings()` | Canonical defaults (`version: 1`, …) |
| `KEYS` | Table key name constants |

## Data Flow Example

### Editing a food definition

```javascript
// app.js
function saveFoodDefinitions() {
  if (!persist) return;
  persist.saveFoodDefinitions(keywords);
}
```

### Toggling a sticky filter

```javascript
function saveStickyIconFilters() {
  if (!persist) return;
  persist.patchSettings({
    filterDailyIntake: !!filterStickyDailyIntake,
    filterSideEffects: !!filterStickySideEffects,
    filterAdverseEffects: !!filterStickyAdverseEffects,
    filterNutrients: filterStickyNutrientKeys.slice(),
  });
}
```

### Boot

```javascript
function boot() {
  if (persist) persist.migrate();
  loadFoodDefinitions();
  loadDayNotes();
  loadFavorites();
  // … then load settings-backed prefs …
}
```

## Settings Cache

`loadSettings()` keeps an in-memory cache inside `persist.js` so repeated `getSetting` / `patchSettings` calls during boot do not re-parse JSON every time. Cache is updated on every successful settings write.

## Error Handling

All localStorage access in `persist.js` is wrapped in try/catch. Failures (quota, private mode) return `false` / `null` / defaults instead of throwing into the UI.

## Migration & Backward Compatibility

| Legacy key(s) | New location |
|---------------|--------------|
| `nutrients-food-definitions`, `nutrients-keywords` | `nutrients_food_definitions` |
| `nutrients-day-notes` | `nutrients_day_meals` |
| `nutrients-favorites` | `nutrients_favorites` |
| `nutrients-demographic`, `nutrients-tdee`, `nutrients-body-weight-kg`, `nutrients-viewed-week-start`, day editor height, highlight/filter/show toggles, keywords UI prefs, … | Fields on `nutrients_settings` |

`Settings.version` and day-meals `version` allow future schema bumps without scattering new keys.

## Non-Persisted State

Session-only (examples): `activeFavoriteDayKey`, open modals, carousel indices, derived match/highlight caches. See the “Data NOT Persisted” section in [`specs-data-persistence.md`](./specs-data-persistence.md).

## Key Design Decisions

1. **Table keys, not preference sprawl** — one settings document instead of ~20 boolean/string keys.
2. **Repository boundary** — only `persist.js` talks to `localStorage` for app data.
3. **Vanilla IIFE** — matches the rest of the static app; global `NutrientsPersist` (same style as `NutrientsDemographicDv`).
4. **Migrate then delete** — legacy hyphenated keys are copied once, then removed so DevTools stays readable.
5. **Domain validation stays in `app.js`** — e.g. favorite normalization, food micro normalization, legacy week→date meal migration.

## Agent Notes

- When adding a new durable preference: extend `defaultSettings()` in `persist.js`, document it in `specs-data-persistence.md`, and read/write via `getSetting` / `setSetting` / `patchSettings` from `app.js`.
- Do not reintroduce `nutrients-*` hyphenated keys.
- Export/import JSON for meals and food definitions remains separate from this repository (file download/upload); those flows still mutate in-memory state and then call the same save helpers.
