# Nutrients Data Persistence Specification

## Storage Overview

**Storage Mechanism:** Browser LocalStorage  
**Format:** JSON strings  
**Scope:** Multi-user, device/browser-specific (no cloud sync)  
**Repository modules:** [`persist.js`](./persist.js) — `NutrientsAuth` + `NutrientsPersist`  
**Test harness:** [`test/index.html`](./test/index.html) (open `/test/` on the same origin)

LocalStorage is organized like a small client-side database:

- One **users** table for accounts/credentials
- One **session** key for who is logged in
- Separate **entity tables** (foods, day meals, favorites, settings), where **each record includes `userId`**

UI code never calls `localStorage` for app data; it uses the repositories only.

### Storage Keys (Database-like Organization)

| Key | Purpose | Structure |
|-----|---------|-----------|
| `nutrients_users` | Users table (accounts) | `User[]` |
| `nutrients_session` | Current logged-in session | `Session \| null` |
| `nutrients_food_definitions` | Food definitions table | rows with `userId` |
| `nutrients_day_meals` | Day meals / diary table | one row per user (`userId` + days map) |
| `nutrients_favorites` | Diary favorites table | rows with `userId` |
| `nutrients_settings` | Settings table | one row per user (`userId` + prefs) |
| `nutrients_orphan_legacy` | Temporary pre–multi-user payload | claimed by first signup, then removed |

---

## Why multi-user

In-person testing needs separate accounts on the same browser. Each person’s foods, diary, favorites, and settings must not leak into another account. Shared tables + `userId` keep key count small (easy to debug in DevTools) while isolating data.

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Stable user id |
| `email` | `string` | Yes | Unique, trimmed + lowercased |
| `password` | `string` | Yes | Plaintext for local testing |
| `createdAt` | `string` | Yes | ISO 8601 |

**Example:**

```javascript
{
  id: "user-1737234567890-abc123def",
  email: "tester@example.com",
  password: "mypassword123",
  createdAt: "2026-07-13T10:00:00.000Z"
}
```

### Session (`nutrients_session`)

```javascript
{
  userId: string,  // references User.id
  email: string
}
// absent / null when logged out
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | Yes | Logged-in `User.id` |
| `email` | `string` | Yes | Display / convenience copy |

### Food Definitions Table (`nutrients_food_definitions`)

All users’ foods live in one array. Each row is owned by a `userId`.

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

`NutrientsPersist.loadFoodDefinitions()` / `saveFoodDefinitions()` filter and rewrite **only the current session’s rows**. The UI never sees other users’ foods; `userId` is stripped on load and re-attached on save.

### Day Meals Table (`nutrients_day_meals`)

```javascript
[
  {
    userId: string,
    version: 2,
    days: {
      "YYYY-MM-DD": string  // meal lines for that calendar day
    }
  }
]
```

**One row per user.** Saves replace that user’s row; other users’ rows stay in the table.

Empty day strings are omitted when saving. Legacy single-week `{ mon…sun }` payloads may appear via orphan claim as `_legacyWeek` and are migrated in `app.js` on load.

### Favorites Table (`nutrients_favorites`)

```javascript
[
  {
    userId: string,
    id: string,
    type: "day" | "week",
    dateKey: string,      // day: YYYY-MM-DD; week: Monday YYYY-MM-DD
    name: string,
    description: string
  }
]
```

Array order within a user’s subset is browse/manage order.

### Settings Table (`nutrients_settings`)

One settings document per user:

```javascript
{
  userId: string,
  version: 2,
  demographic: "male" | "female",
  tdee: number | null,
  macroSplit: null | { bodyType: "ectomorph" | "ecto-mesomorph" | "mesomorph" | "meso-endomorph" | "endomorph" | "ecto-endomorph", goal: "weight-loss" | "bodybuilding" | "maintenance" },
  bodyWeightKg: number | null,
  viewedWeekStart: string | null,   // Monday YYYY-MM-DD
  dayEditorHeight: number | null,
  dayHighlights: boolean,           // default true
  microViewDaily: boolean,
  microShowDv: boolean,
  showAcuteSideEffects: boolean,
  showAcuteAdverseEffects: boolean,
  showDailyIntakeIcons: boolean,    // default true
  filterDailyIntake: boolean,
  filterSideEffects: boolean,
  filterAdverseEffects: boolean,
  filterNutrients: string[],
  highlightDailyIntake: boolean,
  highlightSideEffects: boolean,
  highlightAdverseEffects: boolean,
  keywordsReorderOpen: boolean,
  keywordsCaloriesOpen: boolean,
  keywordsPageSize: 0 | 10 | 25 | 50 | 100  // 0 = All; default 25
}
```

Missing fields merge from `defaultSettings()` so new prefs stay backward-compatible.

---

## Authentication Operations

### Signup

| Step | Action | Storage change |
|------|--------|----------------|
| 1 | Normalize email; reject invalid / duplicate | Read `nutrients_users` |
| 2 | Create `User` with unique id | — |
| 3 | Append to users table | Write `nutrients_users` |
| 4 | Create session | Write `nutrients_session` |
| 5 | If first user ever | Claim `nutrients_orphan_legacy` into that `userId` (if present) |

### Login

| Step | Action | Storage change |
|------|--------|----------------|
| 1 | Find user by email (case-insensitive) | Read `nutrients_users` |
| 2 | Match password | — |
| 3 | Set session | Write `nutrients_session` |

Failure message: invalid email or password (same for unknown email / wrong password).

### Logout

| Step | Action | Storage change |
|------|--------|----------------|
| 1 | Clear session | Remove `nutrients_session` |
| 2 | Clear settings cache | In-memory only |

User rows and entity rows are **kept**; only the session is cleared.

---

## Multi-User Data Isolation

### Access pattern

1. Read `nutrients_session` → current `userId`
2. If no session → empty/default in-memory state; **saves no-op** (no guest persistence)
3. If session exists → load/save only rows where `row.userId === session.userId`

### Example table layout

```javascript
// nutrients_food_definitions
[
  { userId: "user-aaa", id: "1", name: "Egg A", /* … */ },
  { userId: "user-bbb", id: "1", name: "Rice B", /* … */ }
]

// nutrients_settings
[
  { userId: "user-aaa", demographic: "female", tdee: 2100, /* … */ },
  { userId: "user-bbb", demographic: "male", tdee: 2500, /* … */ }
]
```

### Isolation guarantees

- User A cannot load User B’s foods, meals, favorites, or settings through the repository
- Logout → login restores that user’s own rows
- Entity tables may contain many users’ rows at once; DevTools shows one key per table
- Logged out = no durable writes for entity data

---

## Data NOT Persisted

| State | Reason |
|-------|--------|
| `activeFavoriteDayKey` | Session-only teal day highlight |
| Modal open / carousel indices | UI-only |
| In-memory match caches | Derived from definitions + day text |
| Category / micro / longevity definition JSON | Fetched from repo files, not localStorage |

---

## Migration Handling

1. **Hyphenated prefs** (`nutrients-demographic`, …) → collapsed into settings / table keys, then removed  
2. **Single-user table payloads** (arrays/objects without `userId`) → copied to `nutrients_orphan_legacy`; live tables reset to multi-user `[]` shapes  
3. **First Sign up** claims the orphan into that user’s rows and deletes `nutrients_orphan_legacy`  
4. Later signups get empty defaults (no orphan claim)

`Settings.version` / day-meals `version` support future schema bumps.

---

## Save / Load Flow

### Auth (`NutrientsAuth`)

- Signup / login / logout as above  
- Header UI: Sign up / Log in when logged out; email + Log out when logged in  

### Data (`NutrientsPersist`)

| Trigger (when logged in) | Table(s) |
|--------------------------|----------|
| Food row edit / import / micros / longevity | `nutrients_food_definitions` |
| Day textarea / week nav / meal import | `nutrients_day_meals` (+ `viewedWeekStart` in settings) |
| Favorite add / edit / delete / reorder | `nutrients_favorites` |
| Demographic, TDEE, weight, UI toggles, filters, highlights, page size, editor height | `nutrients_settings` |
| `beforeunload` | definitions, demographic, TDEE, day meals, day highlights |

After signup, login, or logout, `app.js` calls `afterAuthSessionChange()` to reload repository data into memory and refresh the UI.

### Implementation rule

UI / domain code in `app.js` must not call `localStorage` for app data. All reads/writes go through `NutrientsAuth` / `NutrientsPersist`.

---

## Validation (local testing)

Use [`test/index.html`](./test/index.html) (`/test/`) to exercise:

- Signup / login / logout and session key contents  
- Per-user foods, day meals, favorites, settings  
- Isolation between User A and User B  
- Persistence across logout → re-login  
- Email case normalization  
- Logged-out load defaults / save no-ops  

---

## Storage Limits

LocalStorage is typically 5–10 MB per origin. Food definitions and multi-week meal text dominate. Multiple testers on one browser share the quota across entity tables. Export/import JSON remains the backup path for large diaries.

---

## Future Persistence Considerations

| Feature | Notes |
|---------|--------|
| Backend / cloud sync | Swap storage adapters; keep repository APIs |
| Password hashing | Required before any non-local deployment |
| Account deletion | Remove user from `nutrients_users` and all rows with that `userId` |
| Guest mode | Not supported today (logged-out edits are discarded) |
