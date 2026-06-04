# AGENTS_CODE_REFERENCE-import.md

> **Approximate locations only** — navigate by function name and region within `app.js` / `index.html`, not line numbers.

JSON import modal and AI-assisted prompt flow for a **single** food definition row, plus **bulk** export/import for the full list.

Parent: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md) · Table/macros: [AGENTS_CODE_REFERENCE-core.md](./AGENTS_CODE_REFERENCE-core.md)

## UI (`index.html`)

`#import-modal` — near **end of file**, before `#micro-modal`:

| Element | Role |
|---------|------|
| `#import-modal-food` | Subtitle: current food name |
| `#import-ai-toggle` | “Have AI help me” / “Hide AI help” |
| `#import-ai-panel` | Portion field, preview, copy, external links |
| `#import-ai-portion` | Single serving+food field; placeholder `1 cup of peanuts` |
| `#import-ai-preview` | Live `<pre>` prompt preview |
| `#import-ai-copy` | Clipboard |
| `#import-open-chatgpt` / `#import-open-claude` | Copy then `window.open` |
| `#import-json` | Paste JSON to apply |
| `#import-error` | Validation messages |
| `#import-apply` / `#import-cancel` | Footer actions |

## State

- `activeImportId` — which row’s `id` is being imported.
- Only one of `activeImportId` / `activeMicroId` should be open; opening one closes the other (with micro save if needed).

## Export JSON (prepopulate)

**`exportFoodJson(kw)`** — early-middle `app.js`:

- Always includes `name`.
- Adds `protein` / `carbs` / `fats` only if non-empty.
- Adds `micros` object only with keys that have values.

Used when opening import with AI panel **closed** (`setImportAiPanelOpen(false)` restores exported JSON into textarea).

## Import apply

**`applyImportJson(id, raw)`**:

1. `JSON.parse` — errors surface as “Invalid JSON”.
2. Requires `data.name` non-empty trim.
3. Updates `keywords[i]`:
   - `name` always set.
   - Macros only if key **present** (`"protein" in data`, etc.) → `storedMacroValue`.
   - `micros`: only keys listed in `data.micros` are updated; omitted micro keys **unchanged**.
4. `saveFoodDefinitions()`.

**`runImport`** — calls apply, closes modal, `renderKeywords()`, `refreshAll()`.

## AI help panel

**Toggle** — `setImportAiPanelOpen(open)`:

| AI open | AI closed |
|---------|-----------|
| JSON label “Paste AI response (JSON)” | Label “JSON” |
| Textarea cleared + example placeholder | Textarea = `exportFoodJson(kw)` |
| Class `import-json-wrap--ai` on wrap | Removed |
| `syncImportAiInputs()` + focus portion | — |

**Portion → prompt** — `buildAiPromptFromPortion(portion)`:

- Opening line: `Please fill in the nutrient data for {portion|___}.`
- Instructions: JSON only, no fences; example name uses **`1 cup of peanuts`** when portion empty (`jsonSchemaExample`, `nameExample`).
- Appends full schema sample + `nutrientListForPrompt()` (lists all `MICRO_FIELDS` keys).

**Preview** — `renderImportAiPreview` sets `#import-ai-preview` text on portion `input`.

**Copy / open external** — `copyAiPromptToClipboard`; `openAiService(url)` copies then opens `CHATGPT_URL` or `CLAUDE_URL`.

**Prefill** — `syncImportAiInputs`: if portion empty and row has `name`, sets portion input to name (user can edit to e.g. `1 cup of peanuts`).

## Bulk export / import (all foods)

**UI** — `#export-all-foods` / `#import-all-foods` in `.keywords__footer` under the table; modal `#import-all-modal`.

| Function | Role |
|----------|------|
| `exportFoodObject` / `exportAllFoodJson` | Array of per-food objects (same shape as single export) |
| `exportAllFoods` | Download `nutrients-food-definitions.json` |
| `openImportAllModal` | Prefills textarea with `exportAllFoodJson()` |
| `getImportAllMode` | Radio `import-all-mode`: `amend` (default) or `replace` |
| `applyImportAllJson(raw, mode)` | Dispatches to amend or replace |
| `applyImportAllAmend` | Match by lowercase name; `applyImportItemToKeyword` on hit, else append |
| `applyImportAllReplace` | Rebuild `keywords[]` from import (prior behavior) |
| `applyImportItemToKeyword` | Merge one import object into an existing row (omitted fields unchanged on amend) |
| `keywordFromImportItem` | New row: `blankKeyword()` + `applyImportItemToKeyword` |

**Amend** — confirm summarizes how many updated vs added. **Replace** — confirm replaces entire list. Empty array errors on amend; replace with confirm can clear all.

## Open / close

**`openImportModal(id)`** — closes micro modal if open; sets JSON from export; AI panel closed by default.

**`closeImportModal`** — clears `activeImportId`, hides modal, resets AI panel, clears error.

**Escape** — global keydown at end of `app.js`: import-all, then single import, then micro.

## Example JSON (for AI / users)

```json
{
  "name": "1 cup of peanuts",
  "protein": 38,
  "carbs": 16,
  "fats": 72,
  "micros": {
    "fiber": 10,
    "sodium": 5
  }
}
```

Omitted `micros` keys on import → leave existing values untouched.

Bulk array example:

```json
[
  { "name": "egg", "protein": 6, "fats": 5 },
  { "name": "1 cup rice", "carbs": 45 }
]
```

## Safe-change notes

- Keep **merge semantics** for optional fields unless product asks for full replace.
- AI schema example must stay aligned with `MICRO_FIELDS` keys (`jsonSchemaExample`, `nutrientListForPrompt`).
- External links are not prompt-in-URL APIs — always **copy-first**, then open tab.
- New AI provider: add link in HTML + listener beside ChatGPT/Claude block at end of `app.js`.

## Related CSS

Import/AI styles in `styles.css` — search `.import-modal`, `.import-ai-panel`, `.modal__panel--wide` (see [ui doc](./AGENTS_CODE_REFERENCE-ui.md)).
