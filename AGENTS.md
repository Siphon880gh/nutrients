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

## Scope

Change only what the prompt asks for.

- Do not remove a feature, control, copy path, data field, or behavior the prompt did not ask to remove.
- Do not optimize, refactor, restyle, or “improve” a feature the prompt did not ask to touch.
- When a requested change must pass through nearby code, keep that edit as small as the request requires and leave the rest as it is.

## Missing controls

If the user says a control is missing from the screen they are looking at, they are right about that screen. Stop the back-and-forth. Do not answer that it exists in the markup, on another panel, or behind a dialog. Fix the screen they showed.

## Verify each implementation

Every implementation is checked before it is called done. Use one of these:

1. **Tests** — test-driven development and test coverage. Add or run a check that fails without the change and passes with it.
2. **The page** — open the app in the browser, use the feature, take a screenshot, and use that screenshot to judge whether the feature is actually there and does what was asked. A control counts as present only when the screenshot shows it.

## App shape

- Static client-only app: `index.html`, `styles.css`, `persist.js`, `app.js` (IIFE).
- No bundler, no backend. Open via a static file server so `fetch` of JSON works.
- Food definitions, day meals, saved meals, favorites, and settings persist in `localStorage` via `NutrientsAuth` + `NutrientsPersist` (users/session + per-`userId` entity tables); sample data lives under `samples/`.
- Header auth: Sign up / Log in / Log out (local accounts for multi-user testing).
- Persistence test harness: [`test/index.html`](./test/index.html) (open `/test/` on the static server).
- Category filter map: `definitions-food-categories.json`.

## Skills

Follow [SKILLS.md](./SKILLS.md) whenever the user asks what skills are available, wants to run a project skill, or the task matches a skill description.

Project skills live under `.agents/skills/` (JSON workflows and `*/SKILL.md` folders). Also scan other project skill roots listed in SKILLS.md when present.
