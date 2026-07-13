# AGENTS.md

Instructions for AI agents working in this **nutrients** app.

## First reads

| Doc | When |
|-----|------|
| [SKILLS.md](./SKILLS.md) | Discover and summarize available agent skills (project-local first, then optional global) |
| [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md) | Codebase map — start here before editing `app.js` / UI / data files |
| [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md) | Food table, matching, dashboard, micros, longevity, categories |
| [AGENTS_CODE_REFERENCE-import.md](./AGENTS_CODE_REFERENCE-import.md) | Import / export / sample foods & meals |
| [AGENTS_CODE_REFERENCE-ui.md](./AGENTS_CODE_REFERENCE-ui.md) | Markup, CSS, modals, highlight overlay |
| [AGENTS-data-persistence.md](./AGENTS-data-persistence.md) | localStorage tables + `NutrientsAuth` / `NutrientsPersist` (multi-user) |
| [specs-data-persistence.md](./specs-data-persistence.md) | Persistence data shapes, migration, save/load rules |

Authoring guides (human + agent): `GUIDE_ADDING_FOOD.md`, `GUIDE_IMPROVING_FOOD.md`, `GUIDE_ADDING_MULTIVITAMIN.md`.

## App shape

- Static client-only app: `index.html`, `styles.css`, `persist.js`, `app.js` (IIFE).
- No bundler, no backend. Open via a static file server so `fetch` of JSON works.
- Food definitions, day meals, favorites, and settings persist in `localStorage` via `NutrientsAuth` + `NutrientsPersist` (users/session + per-`userId` entity tables); sample data lives under `samples/`.
- Header auth: Sign up / Log in / Log out (local accounts for multi-user testing).
- Category filter map: `definitions-food-categories.json`.

## Skills

Follow [SKILLS.md](./SKILLS.md) whenever the user asks what skills are available, wants to run a project skill, or the task matches a skill description.

Project skills live under `.agents/skills/` (JSON workflows). Also scan other project skill roots listed in SKILLS.md when present.
