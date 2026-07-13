# Nutrients Data Persistence Specification

## Storage Overview

**Storage Mechanism:** Browser LocalStorage  
**Format:** JSON strings  
**Scope:** Single-user, device/browser-specific (no cloud sync)  
**Repository module:** [`persist.js`](./persist.js) (`NutrientsPersist`)

App data is organized as a small set of **tables** (one localStorage key each), not as dozens of scattered preference keys.

### Storage Keys (Database-like Organization)

| Key | Purpose | Structure |
|-----|---------|-----------|
| `nutrients_food_definitions` | Food definitions table | `FoodDefinition[]` |
| `nutrients_day_meals` | Day meals / diary table | `DayMealsPayload` |
| `nutrients_favorites` | Diary favorites table | `Favorite[]` |
| `nutrients_settings` | Settings / UI preferences row | `Settings` |

---

## Persisted Data Structures

### Food Definitions Table (`nutrients_food_definitions`)

```javascript
[
  {
    id: string,
    name: string,
    protein: number | "",
    carbs: number | "",
    fats: number | "",
    micros: object,      // micronutrient amounts keyed by micro field id
    longevity: object    // longevity nutrient amounts / flags
  }
]
```

Order in the array is the food-table display order.

### Day Meals Table (`nutrients_day_meals`)

```javascript
{
  version: 2,
  days: {
    "YYYY-MM-DD": string  // free-text meal lines for that calendar day
  }
}
```

Empty day strings are omitted when saving. Legacy single-week `{ mon…sun }` payloads are migrated onto the current Mon–Sun week once on load (handled in `app.js`).

### Favorites Table (`nutrients_favorites`)

```javascript
[
  {
    id: string,           // e.g. "fav-{timestamp}-{random}"
    type: "day" | "week",
    dateKey: string,      // day: YYYY-MM-DD; week: Monday YYYY-MM-DD
    name: string,
    description: string
  }
]
```

Array order is browse/manage order.

### Settings (`nutrients_settings`)

One JSON object holding all durable preferences (formerly many separate keys):

```javascript
{
  version: 1,
  demographic: "male" | "female",
  tdee: number | null,
  bodyWeightKg: number | null,
  viewedWeekStart: string | null,   // Monday YYYY-MM-DD
  dayEditorHeight: number | null,   // px
  dayHighlights: boolean,           // default true
  microViewDaily: boolean,
  microShowDv: boolean,
  showAcuteSideEffects: boolean,
  showAcuteAdverseEffects: boolean,
  showDailyIntakeIcons: boolean,    // default true
  filterDailyIntake: boolean,
  filterSideEffects: boolean,
  filterAdverseEffects: boolean,
  filterNutrients: string[],        // micro field keys
  highlightDailyIntake: boolean,
  highlightSideEffects: boolean,
  highlightAdverseEffects: boolean,
  keywordsReorderOpen: boolean,
  keywordsCaloriesOpen: boolean,
  keywordsPageSize: 0 | 10 | 25 | 50 | 100  // 0 = All; default 25
}
```

---

## Entity Definitions

### FoodDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Stable row id |
| `name` | `string` | Yes | Match name for diary lines |
| `protein` / `carbs` / `fats` | `number \| ""` | Yes | Macro grams per serving |
| `micros` | `object` | Yes | Normalized micro amounts |
| `longevity` | `object` | Yes | Normalized longevity amounts |

### Favorite

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique favorite id |
| `type` | `"day" \| "week"` | Yes | Jump target kind |
| `dateKey` | `string` | Yes | Calendar day or week Monday |
| `name` | `string` | Yes | Display name |
| `description` | `string` | No | Optional note |

---

## Data NOT Persisted

| State | Reason |
|-------|--------|
| `activeFavoriteDayKey` | Session-only teal day highlight |
| Modal open / carousel indices | UI-only |
| In-memory match caches | Derived from definitions + day text |
| Category / micro / longevity definition JSON | Loaded from repo files via `fetch`, not localStorage |

---

## Migration Handling

On first access after upgrade, `NutrientsPersist.migrate()`:

1. Copies `nutrients-food-definitions` or legacy `nutrients-keywords` → `nutrients_food_definitions`
2. Copies `nutrients-day-notes` → `nutrients_day_meals`
3. Copies `nutrients-favorites` → `nutrients_favorites`
4. Collapses hyphenated preference keys into `nutrients_settings`
5. Removes the legacy keys once migration succeeds

Missing fields in `nutrients_settings` are filled from `defaultSettings()` so new preference fields stay backward-compatible.

---

## Save / Load Flow

### Save triggers (via `app.js` helpers → `NutrientsPersist`)

| Trigger | Table(s) |
|---------|----------|
| Food row edit / add / delete / reorder / micros / longevity / import | `nutrients_food_definitions` |
| Day textarea input, week nav, clear/import meals | `nutrients_day_meals` (+ `viewedWeekStart` in settings) |
| Favorite add / edit / delete / reorder | `nutrients_favorites` |
| Demographic, TDEE, weight, UI toggles, filters, highlights, page size, editor height | `nutrients_settings` |
| `beforeunload` | definitions, demographic, TDEE, day meals, day highlights |

### Load triggers

- Boot (`boot()`): `persist.migrate()` then load all four tables into in-memory state

### Implementation rule

UI / domain code in `app.js` must not call `localStorage` for app data. All reads/writes go through `NutrientsPersist`.

---

## Storage Limits

LocalStorage is typically 5–10 MB per origin. Food definitions and multi-week meal text dominate size. Favorites and settings are small. Export/import JSON remains the backup path for large diaries.

---

## Future Persistence Considerations

| Feature | Persistence impact |
|---------|-------------------|
| Named profiles / multi-user | Additional user table + scoped keys (see dailytimepoints pattern) |
| Cross-device sync | Would need a backend |
| Quotas / compaction | Drop empty historical days or archive old weeks |
| Schema bumps | Increment `Settings.version` / day-meals `version` and extend `migrate()` |
