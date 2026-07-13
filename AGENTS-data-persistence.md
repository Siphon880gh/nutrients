# Data Persistence Architecture

## Overview

Nutrients uses **repository modules** in [`persist.js`](./persist.js) so UI/domain code in `app.js` never touches `localStorage` directly. Auth and app data are multi-user: a users table + session, and entity tables where each record includes `userId`.

```
┌─────────────────────────────────────────────────────────┐
│                     UI / domain                          │
│  (app.js — auth header, editors, dashboard, settings)   │
└─────────────────────┬───────────────────────────────────┘
                      │ NutrientsAuth.signup/login/logout
                      │ NutrientsPersist load/save*
                      ▼
┌─────────────────────────────────────────────────────────┐
│              NutrientsAuth + NutrientsPersist            │
│  (persist.js — only layer that uses localStorage)       │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│  nutrients_users / nutrients_session                      │
│  nutrients_food_definitions (+ userId)                   │
│  nutrients_day_meals (+ userId)                          │
│  nutrients_favorites (+ userId)                          │
│  nutrients_settings (+ userId)                            │
└─────────────────────────────────────────────────────────┘
```

Script order: `demographic-dv.js` → `longevity-dv.js` → **`persist.js`** → `app.js`.

Spec: [`specs-data-persistence.md`](./specs-data-persistence.md).

## NutrientsAuth API

| Method | Description |
|--------|-------------|
| `signup(email, password)` | Create user + session; first user claims orphan legacy data |
| `login(email, password)` | Set session |
| `logout()` | Clear session + persist settings cache |
| `getSession()` / `getCurrentUser()` / `getCurrentUserId()` / `isLoggedIn()` | Session helpers |

## NutrientsPersist API

| Method | Description |
|--------|-------------|
| `migrate()` | Hyphen legacy → tables; single-user payloads → orphan; ensure multi-user array shapes |
| `claimOrphanForUser(userId, isFirstUser)` | Used by signup for the first account |
| `clearCache()` | Drop settings cache (logout) |
| `isLoggedIn()` | Proxy to auth |
| `load/saveFoodDefinitions` | Current user’s food rows |
| `load/saveDayMeals` | Current user’s day-meals row |
| `load/saveFavorites` | Current user’s favorites |
| `load/save/patchSettings`, `get/setSetting` | Current user’s settings row |

When logged out: loads return `null` / defaults; saves return `false`.

## Auth UI (`app.js` + header)

Top-right (`.week__header-actions`): **Log in** / **Sign up** when logged out; email + **Log out** when logged in. Modals: `#auth-signup-modal`, `#auth-login-modal`. After session change, `afterAuthSessionChange()` reloads repository data into memory and refreshes the UI.

## Test harness

Browser-only UI at [`test/index.html`](./test/index.html) (visit `/test/` on the same origin as the app).

**Features:**
- Live display of `nutrients_users`, `nutrients_session`, food / day-meals / favorites / settings tables, and orphan key
- Manual Sign up / Log in / Log out for User A and User B
- Seed buttons that save foods, day meals, favorites, and settings through `NutrientsPersist` (validates per-user isolation)
- **Run all tests** suite for signup, login, logout, logged-out no-op saves, per-user entity isolation, persistence across re-login, email normalization
- Action log + clear nutrients_* keys

Loads `../persist.js` so it exercises the real repositories (shared `localStorage` with the main app).

## Key Design Decisions

1. **Few localStorage keys** — tables, not per-preference keys.
2. **`userId` on entity rows** — MySQL/Mongo-style association, not one nested blob per user.
3. **Repository boundary** — UI never calls `localStorage` for app data.
4. **Orphan claim** — existing single-user data attaches to the first signup so the developer’s diary is not lost during the upgrade.
5. **No guest persistence** — logged-out edits are not saved (in-person testing expects accounts).

## Agent Notes

- New durable preference: add field to `defaultSettings()`, document in `specs-data-persistence.md`, read/write via settings helpers.
- Do not add new hyphenated `nutrients-*` keys or bypass the repositories.
- Passwords are plaintext for local testing only.
