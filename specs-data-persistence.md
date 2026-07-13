# Nutrients Data Persistence Specification

## Storage Overview

**Storage Mechanism:** Browser LocalStorage  
**Format:** JSON strings  
**Scope:** Multi-user, device/browser-specific (no cloud sync)  
**Repository modules:** [`persist.js`](./persist.js) — `NutrientsAuth` + `NutrientsPersist`

App data is organized as a small set of **tables** (one localStorage key each). Entity rows carry a `userId` so each tester’s data stays isolated.

### Storage Keys (Database-like Organization)

| Key | Purpose | Structure |
|-----|---------|-----------|
| `nutrients_users` | Users table (accounts) | `User[]` |
| `nutrients_session` | Current logged-in session | `Session \| null` |
| `nutrients_food_definitions` | Food definitions table | `FoodDefinition[]` (+ `userId`) |
| `nutrients_day_meals` | Day meals / diary table | `DayMealsRow[]` (+ `userId`) |
| `nutrients_favorites` | Diary favorites table | `Favorite[]` (+ `userId`) |
| `nutrients_settings` | Settings rows | `SettingsRow[]` (+ `userId`) |
| `nutrients_orphan_legacy` | Temporary hold for pre–multi-user data | Orphan blob (removed after first signup claims it) |

---

## Persisted Data Structures

### Users Table (`nutrients_users`)

```javascript
[
  {
    id: string,        // "user-{timestamp}-{random}"
    email: string,     // normalized lowercase
    password: string,  // plaintext (local testing only)
    createdAt: string  // ISO 8601
  }
]
```

### Session (`nutrients_session`)

```javascript
{
  userId: string,
  email: string
}
// or absent / null when logged out
```

### Food Definitions Table (`nutrients_food_definitions`)

```javascript
[
  {
    userId: string,
    id: string,
    name: string,
    protein: number | "",
    carbs: number | "",
    fats: number | "",
    micros: object,
    longevity: object
  }
]
```

Repository load/save for the UI strips/adds `userId` and only returns the current user’s rows.

### Day Meals Table (`nutrients_day_meals`)

```javascript
[
  {
    userId: string,
    version: 2,
    days: {
      "YYYY-MM-DD": string
    }
  }
]
```

One row per user. Empty day strings are omitted when saving. Legacy single-week `{ mon…sun }` payloads may arrive via orphan claim as `_legacyWeek` and are migrated in `app.js` on load.

### Favorites Table (`nutrients_favorites`)

```javascript
[
  {
    userId: string,
    id: string,
    type: "day" | "week",
    dateKey: string,
    name: string,
    description: string
  }
]
```

### Settings (`nutrients_settings`)

One settings row per user:

```javascript
{
  userId: string,
  version: 2,
  demographic: "male" | "female",
  tdee: number | null,
  bodyWeightKg: number | null,
  viewedWeekStart: string | null,
  dayEditorHeight: number | null,
  dayHighlights: boolean,
  microViewDaily: boolean,
  microShowDv: boolean,
  showAcuteSideEffects: boolean,
  showAcuteAdverseEffects: boolean,
  showDailyIntakeIcons: boolean,
  filterDailyIntake: boolean,
  filterSideEffects: boolean,
  filterAdverseEffects: boolean,
  filterNutrients: string[],
  highlightDailyIntake: boolean,
  highlightSideEffects: boolean,
  highlightAdverseEffects: boolean,
  keywordsReorderOpen: boolean,
  keywordsCaloriesOpen: boolean,
  keywordsPageSize: 0 | 10 | 25 | 50 | 100
}
```

---

## Authentication Operations

| Operation | Storage change |
|-----------|----------------|
| Signup | Append `User` to `nutrients_users`; write `nutrients_session`; first signup claims `nutrients_orphan_legacy` if present |
| Login | Write `nutrients_session` |
| Logout | Remove `nutrients_session`; clear settings cache |

**Email:** trimmed + lowercased. **Passwords:** plaintext for local in-person testing only.

When logged out, entity loaders return empty/defaults and saves no-op (no guest persistence).

---

## Multi-User Isolation

1. App reads `nutrients_session` for `userId`
2. Loads only rows where `userId` matches
3. Saves replace that user’s rows inside each entity table (other users’ rows untouched)

---

## Data NOT Persisted

| State | Reason |
|-------|--------|
| `activeFavoriteDayKey` | Session-only teal day highlight |
| Modal open / carousel indices | UI-only |
| In-memory match caches | Derived |
| Category / micro / longevity definition JSON | Fetched from repo files |

---

## Migration Handling

1. Hyphenated single-key prefs → table keys (unchanged from prior migration)
2. Single-user table payloads (no `userId`) → `nutrients_orphan_legacy`, tables reset to `[]`
3. First successful **Sign up** claims the orphan into that user’s rows and deletes the orphan key

---

## Save / Load Flow

UI talks only to `NutrientsAuth` / `NutrientsPersist`. `app.js` reloads in-memory state after signup, login, and logout via `afterAuthSessionChange()`.

---

## Future Persistence Considerations

| Feature | Notes |
|---------|--------|
| Backend / cloud sync | Replace localStorage adapters; keep repository APIs |
| Password hashing | Replace plaintext before any non-local use |
| Account deletion | Remove user + all rows with that `userId` |
