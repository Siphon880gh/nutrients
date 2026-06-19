# AGENTS_CODE_REFERENCE-ui.md

> **Approximate locations only** — use class names and file regions in `index.html` (~920 lines) and `styles.css` (~4300 lines).

Markup structure, layout, modals, and the **highlight mirror** pattern.

Parent: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Page layout (vertical)

```text
.week (main, max-width ~1400px)
├── .week__header
│   └── #settings-open (.week__settings — sex icon + “Settings”)
├── .dashboard
│   ├── .dashboard__header
│   │   ├── .dashboard__toggles  (Print, Week total, Micro requirements, Longevity)
│   │   └── .dashboard__hint
│   ├── #dashboard-grid            (7 cards with macro % toggle, JS)
│   ├── #dashboard-micro-panel     (hidden until toggle)
│   │   ├── condition focus dropdown (#dashboard-micro-condition-*)
│   │   ├── view segments (weekly avg / each day) + Show DV targets
│   │   ├── Ask AI to help fill gaps
│   │   ├── caffeine tip aside
│   │   ├── #dashboard-micro-list        (% DV list + “my food” icons, JS)
│   │   └── #dashboard-micro-daily-grid  (each-day grid, JS)
│   ├── #dashboard-longevity-panel (hidden until toggle)
│   │   ├── intro, disclaimer, processed-food note (Yuka / Bobby links)
│   │   ├── #dashboard-longevity-nav (sticky section prev/next + All topics)
│   │   └── #dashboard-longevity-content (JS — % DV bars, explain + my-food links)
│   └── #week-summary              (hidden by default; week total, day avg, TDEE, macro split)
├── .week__days-toolbar     (hint + export/import all meals + clear all)
├── .week__grid             (7 columns Mon–Sun; min-height only — grows with editor height)
│   └── .day × 7
│       ├── .day__head (label + Clear)
│       └── .day__editor (vertically resizable; shared height across all days)
│           ├── .day__backdrop   (highlight layer)
│           ├── textarea.day__input (transparent text; resize: none)
│           └── .day__suggest (optional food-name popover; hidden by default)
│               ├── .day__suggest-dismiss
│               └── .day__suggest-list (scrollable pill buttons)
├── .keywords               (food definitions table — optional cal column)
└── (no bottom demographic panel — sex/TDEE in #settings-modal)
```

Modals are **siblings** of `main`, not inside it.

## Day editor: highlight mirror

Native `<textarea>` cannot color individual words. Pattern:

| Layer | Class | Behavior |
|-------|--------|----------|
| Back | `.day__backdrop` | `innerHTML` with text + `<mark class="hl">` |
| Front | `.day__input` | `color: transparent`, `caret-color` visible, `background: transparent` |

**CSS** — block starting `.day__editor`:

- Editor: bordered box, `position: relative`, `flex: 0 0 auto`, `resize: vertical`, default `height: calc(45vh - 2.5rem)`, `min-height: 6rem`, `max-height: 80vh`, `overflow: hidden`.
- Backdrop: `position: absolute; inset: 0`, `pointer-events: none`, `pre-wrap`, `overflow: auto`.
- Textarea: `height: 100%`, `resize: none` (resize grip is on the editor, not the textarea).
- `.hl` — amber highlight (`#ffd966`).
- Selection on textarea uses semi-transparent overlay so selection stays visible.

**Food-name popover** — `.day__suggest`:

- `position: absolute; right/bottom` inside `.day__editor`, `z-index: 2`, `max-height: calc(100% - 0.9rem)`.
- `.day__suggest-list` — `overflow-y: auto`, `overscroll-behavior: contain`, `scrollbar-width: thin`; pill items `.day__suggest-item` with match highlight `.day__suggest-match`.
- Hidden in print / print-preview.

**Shared resize** — drag the bottom-right grip on any `.day__editor`; on release JS sets the same pixel height on all seven editors and saves to `localStorage` (see core doc).

**Scroll** — JS `syncScroll` copies `scrollTop` / `scrollLeft` between textarea and backdrop (see core doc).

## Dashboard, micro & longevity panels

**`.dashboard__grid`** — equal columns of `.dashboard__card` with rows for P/C/F g·cal (or **%** when toggled) and total cal; each card head has `.dashboard__card-toggle` (`data-action="toggle-dashboard-macro-view"`); collapses on narrow screens.

**`.dashboard__toggles`** — `Print` (`#dashboard-print`), `Week total` (`#dashboard-week-toggle`), `Micro requirements` (`#dashboard-micro-toggle`), `Longevity` (`#dashboard-longevity-toggle`); shared `.dashboard__toggle` / `--open`.

**`.week-summary`** — below grid, full width; hidden until **Week total** toggle. Blocks: **Week total**, **Day average**, **Deficit/Surplus vs TDEE** (or prompt to set TDEE), **Macro split (week avg)** with explain links.

**Micro panel** — `.dashboard__micro-panel`:
- `.dashboard__micro-condition-wrap` — focus dropdown (coffee/tea, ADHD, anemia) + clear ×.
- `.dashboard__micro-segmented` segments (`#dashboard-micro-view-weekly` / `-daily`) + solo `#dashboard-micro-dv-toggle` (Show DV targets).
- `.dashboard__micro-list` (weekly avg list) and `.dashboard__micro-daily-grid` (each-day grid).
- **% DV** text color / `font-weight` from `config.json` `microDvStatus` tiers. Nutrient rows carry `data-micro-def` (click → micro definition modal) and `.dashboard__micro-sources-btn` (ranked foods modal).
- `.dashboard__micro-tip` — caffeine absorption note → `#caffeine-tip-modal`.

**Longevity panel** — `.dashboard__longevity-panel`:
- Intro, disclaimer, `.dashboard__longevity-processed-note` (advisory, external Yuka/Bobby links).
- `.dashboard__longevity-nav` — sticky topic carousel + `#dashboard-longevity-nav-all-list`.
- `#dashboard-longevity-content` — grouped sections with % DV **Level** bars; inline color from `config.json` `longevityStatus`. Headings carry `data-longevity-def` / `data-micro-def`; rows may include `.dashboard__micro-sources-btn` and tip links (eggs → `#fats-cholesterol-tip-modal`, TMAO → `#tmao-protectors-tip-modal`).

**Responsive / print** (lower `styles.css`): grid column counts shrink at breakpoints; on narrow screens `.week__grid` is `height: auto` with single column; day editors keep `resize: vertical` unless print/print-preview (`resize: none`).

## Food definitions table

**`.keywords__panel`** — white panel, table `#keywords-table` inside; body `#keywords-list`.

Notable columns:

- **Order** — `.keywords__th-order`; reorder controls revealed by `#keywords-reorder-toggle` (persisted open state).
- **Macros** — `.keywords__macro-toggle` on Prot/Carbs/Fats headers toggles **(g)** ↔ **(cal)** for all three + shows **Total (cal)** (`.keywords__th-total--cal`, persisted via `STORAGE_KEY_CALORIES`).
- **Micros** — `.keywords__micros` button; filled state class; scrollable text + `data-tooltip` hover.
- **Longevity** — `.keywords__longevity` button (mirrors micros button pattern).
- **Actions** — Import, Delete (+ **Move** to position via `#keyword-position-modal`).

**Footer** — `.keywords__footer`: `#add-keyword` plus `.keywords__bulk` (`#export-all-foods`, `#import-all-foods`, `#import-sample-foods`).

Horizontal scroll on narrow screens: `.keywords__panel { overflow-x: auto }`, `min-width` on table.

## Settings modal (demographic + TDEE)

**`#settings-modal`** — opened from `#settings-open` in header.

- **Sex** — `#demographic-options` with `.demographic__option` radios (same as former bottom panel); `#settings-demographic-icon` in header reflects selection.
- **TDEE** — `#settings-tdee` number input + `#settings-tdee-calc-open` → `#tdee-calculator-modal`.
- Explainer copy references `demographic-dv.js` calorie baselines (informative; week calories still from food matches).

Scripts **`demographic-dv.js`** and **`longevity-dv.js`** must load before `app.js`.

## Modals (shared)

**`.modal`** — fixed fullscreen flex center; `[hidden]` → `display: none`.

**`.modal__panel`** — column flex, `overflow: hidden`; body scrolls, footer `flex-shrink: 0`.

Variants & instances:

- `.modal__panel--wide` — import, import-all, import-all-meals, micro-gaps, micro-def, longevity modals (~36rem).
- `.modal__footer--split` — Cancel left, primary right.
- **Micro modal** (`#micro-modal`) — `#micro-form` 2-column grid; built at runtime by `initMicroForm`.
- **Longevity modal** (`#longevity-modal`) — `#longevity-form`; built by `initLongevityForm`.
- **Definition modal** (`#micro-def-modal`) — shared by micro + longevity “explain”; `.modal__header--with-tools` with `#micro-def-fullscreen-toggle`; `#micro-def-modal-back` (**← My food**, hidden unless opened from sources modal); body `.micro-def__body`.
- **Micro sources modal** (`#micro-sources-modal`) — ranked foods + calculations; `#micro-sources-scope`, `#micro-sources-body`, fullscreen toggle.
- **Longevity sources modal** (`#longevity-sources-modal`) — same layout pattern for longevity metrics / GL.
- **Settings modal** (`#settings-modal`) — sex + TDEE.
- **TDEE calculator** (`#tdee-calculator-modal`) — Mifflin–St Jeor inputs, resistance/cardio activity, `#tdee-calc-result`, Apply/Cancel.
- **TDEE hint** (`#tdee-hint-modal`) — deficit/surplus / 3500 kcal rule.
- **Macro split hint** (`#macro-split-hint-modal`) — `#macro-split-carousel` body-type guidance.
- **Micro-gaps modal** (`#micro-gaps-modal`) — preference select + free-text + prompt preview / copy / open.
- **Phosphorus binder modal** (`#phosphorus-binder-modal`) — educational calcium-acetate / phosphate content; opened from longevity calcification tip link (`data-action="open-phosphorus-binder-modal"`).
- **Caffeine tip modal** (`#caffeine-tip-modal`) — gum/patches vs coffee/tea mineral absorption; opened from micro panel tip (`data-action="open-caffeine-tip-modal"`).
- **Fats/cholesterol tip modal** (`#fats-cholesterol-tip-modal`) — eggs & heart health; opened from longevity panel (`data-action="open-fats-cholesterol-tip-modal"`).
- **TMAO protectors tip modal** (`#tmao-protectors-tip-modal`) — diet strategies beyond cutting precursors (`data-action="open-tmao-protectors-tip-modal"`).
- **Import modal** (`#import-modal`) — `.import-modal__body` scrollable; AI panel `.import-ai-panel`; JSON `.import-modal__json` (shorter when `.import-json-wrap--ai`).
- **Move-to-position modal** (`#keyword-position-modal`) — `#keyword-position-select`; primary button label **Move**.

## Z-index & stacking

- Modals `z-index: 100`.
- Micros / longevity tooltip on button is above the row (cells use `overflow: visible` so it isn’t clipped).

## CSS naming convention

BEM-like blocks: `.week__`, `.day__`, `.dashboard__`, `.keywords__`, `.settings-modal__`, `.tdee-calc__`, `.macro-split-carousel`, `.micro-sources-modal__`, `.import-ai-`, `.micro-gaps-modal__`, `.micro-def__`, `.micro-tip-modal__`, `.longevity-form`, `.modal__`.

JS does not depend on BEM beyond stable IDs (`#mon`, `#keywords-list`, etc.).

## HTML IDs relied on by JS

Critical hooks (do not rename without updating the element lookups near the top of `app.js`):

- Header/settings: `settings-open`, `settings-demographic-icon`, `settings-modal`, `settings-modal-done`, `settings-tdee`, `settings-tdee-calc-open`, `demographic-options`
- TDEE: `tdee-calculator-modal`, `tdee-calculator-apply`, `tdee-calculator-cancel`, `tdee-calc-*`, `tdee-hint-modal`, `tdee-hint-modal-done`
- Macro split: `macro-split-hint-modal`, `macro-split-carousel`, `macro-split-carousel-prev`, `macro-split-carousel-next`, `macro-split-carousel-indicator`, `macro-split-carousel-card`, `macro-split-hint-modal-done`
- Sources: `micro-sources-modal`, `micro-sources-modal-title`, `micro-sources-body`, `micro-sources-scope`, `micro-sources-modal-done`, `micro-sources-fullscreen-toggle`, `longevity-sources-modal`, `longevity-sources-modal-title`, `longevity-sources-body`, `longevity-sources-modal-done`, `longevity-sources-fullscreen-toggle`
- Day: `mon` … `sun`, `export-all-meals`, `import-all-meals`, `import-all-meals-modal`, `clear-all-days`
- Dashboard: `dashboard-grid`, `dashboard-print`, `week-summary`, `dashboard-week-toggle`, `dashboard-micro-toggle`, `dashboard-micro-panel`, `dashboard-micro-list`, `dashboard-micro-daily-grid`, `dashboard-micro-view-weekly`, `dashboard-micro-view-daily`, `dashboard-micro-dv-toggle`, `dashboard-micro-hint`, `dashboard-micro-hint-text`, `dashboard-micro-condition-toggle`, `dashboard-micro-condition-list`, `dashboard-micro-condition-label`, `dashboard-micro-condition-clear`
- Longevity: `dashboard-longevity-toggle`, `dashboard-longevity-panel`, `dashboard-longevity-content`, `dashboard-longevity-nav`, `dashboard-longevity-nav-prev`, `dashboard-longevity-nav-next`, `dashboard-longevity-nav-current-title`, `dashboard-longevity-nav-all-toggle`, `dashboard-longevity-nav-all-list`, `longevity-modal`, `longevity-form`, `longevity-modal-food`, `longevity-modal-done`
- Micro gaps: `micro-gaps-ai-open`, `micro-gaps-modal`, `micro-gaps-preference`, `micro-gaps-additional`, `micro-gaps-ai-preview`, `micro-gaps-ai-copy`, `micro-gaps-open-chatgpt`, `micro-gaps-open-claude`, `micro-gaps-modal-done`
- Tip modals: `phosphorus-binder-modal`, `phosphorus-binder-modal-done`, `caffeine-tip-modal`, `caffeine-tip-modal-done`, `fats-cholesterol-tip-modal`, `fats-cholesterol-tip-modal-done`, `tmao-protectors-tip-modal`, `tmao-protectors-tip-modal-done`
- Definitions: `micro-def-modal`, `micro-def-modal-title`, `micro-def-body`, `micro-def-modal-done`, `micro-def-modal-back`, `micro-def-fullscreen-toggle`
- Table: `keywords-table`, `keywords-list`, `keywords-empty`, `keywords-reorder-toggle`, `add-keyword`, `export-all-foods`, `import-all-foods`, `import-sample-foods`, `keyword-position-modal` (+ `-food`/`-select`/`-error`/`-apply`/`-cancel`)
- Import: `import-modal`, `import-json`, `import-ai-*`, `import-all-modal`, `import-all-json`, `micro-modal`, `micro-form`

## Visual tokens (informal)

- Page bg `#f4f4f2`, cards white, accent blue `#3d6b9e`, success green / amber / red from `config.json` % DV tiers, error red on delete/import error, amber highlight `#ffd966`.

## Safe UI changes

- Changing grid column count: update **both** `index.html` day columns **and** `.week__grid` / `.dashboard__grid` in CSS.
- Do not remove backdrop layer if highlights remain a feature.
- Day suggest popover is injected by JS inside `.day__editor`; keep `overflow: hidden` on the editor and scroll on `.day__suggest-list` if adding more suggestion UI.
- Shared editor resize: change `.day__editor` sizing in CSS **and** `clampDayEditorHeight` / `STORAGE_KEY_DAY_EDITOR_HEIGHT` in JS together.
- New modal: copy `.modal` + `hidden` + backdrop `data-action` close pattern from existing modals; wire close in the global Escape handler.

## File size hint

| File | ~Lines | Load when |
|------|--------|-----------|
| `index.html` | 920 | Structure / new regions |
| `styles.css` | 4300 | Visual/layout only |
| `app.js` | 8100 | Behavior (other docs) |
