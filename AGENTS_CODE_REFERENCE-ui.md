# AGENTS_CODE_REFERENCE-ui.md

> **Approximate locations only** — use class names and file regions in `index.html` (~1,640 lines) and `styles.css` (~6,240 lines).

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
│   ├── #dashboard-grid            (7 cards; today’s weekday .dashboard__card--today)
│   ├── #dashboard-micro-panel     (hidden until toggle)
│   │   ├── #dashboard-micro-sticky (title, View, Daily Targets, Highlight/Filter/
│   │   │     daily-intake/acute disclosures, #dashboard-micro-close)
│   │   ├── intro + Ask AI + condition focus dropdown
│   │   ├── tip asides (#micro-tip-*)
│   │   ├── #dashboard-micro-list / #dashboard-micro-daily-grid
│   │   └── More nutrients
│   ├── #micro-daily-intake-popover / #micro-acute-toxicity-popover / #target-ref-popover
│   ├── #dashboard-longevity-panel (hidden until toggle)
│   │   ├── #dashboard-longevity-nav (title, close, sticky icon options, section nav)
│   │   └── #dashboard-longevity-content (JS — sections + % DV bars + 100% notch)
│   └── #week-summary              (hidden by default)
├── .week__days-toolbar     (* N hint + Export / Import / Import sample / Clear)
│   └── .week__days-actions
├── .week__highlight-bar    (pen + food notes)
│   ├── #day-highlights-toggle
│   └── #day-food-notes
├── #day-unmatched-lines    (collapsible Unmatched carousel; JS)
├── .week__grid             (7 columns; .day--today on current weekday)
│   └── .day × 7
│       ├── .day__head (label + Clear)
│       └── .day__editor (editing/viewing/plain; shared height)
│           ├── .day__backdrop
│           ├── textarea.day__input
│           └── .day__suggest (optional)
├── .keywords               (food definitions table)
└── (sex/TDEE/weight in #settings-modal)
```

Modals are **siblings** of `main`, not inside it. **`#starter-guide`** is also a sibling — fixed-position beginner popover (not a blocking modal).

## Day editor: highlight mirror + modes

Native `<textarea>` cannot color individual words, and overlaying a transparent textarea on a mirror drifts. The editor instead swaps between three modes (classes set by `setDayEditorMode`, see [core doc](./AGENTS_CODE_REFERENCE-core.md)):

| Mode | Class | Shown | Notes |
|------|-------|-------|-------|
| editing | `.day__editor--editing` | textarea (opaque) | focused; typing lands exactly at caret |
| viewing | `.day__editor--viewing` | `.day__backdrop` | blurred + highlights on; click backdrop → caret |
| plain | `.day__editor--plain` | textarea | highlights off (pen toggle) |

| Layer | Class | Behavior |
|-------|--------|----------|
| Back | `.day__backdrop` | `innerHTML` with text + `<mark class="hl">`; empty → `.day__backdrop-placeholder` |
| Front | `.day__input` | textarea; visible/hidden per mode |

**CSS** — block starting `.day__editor`:

- Editor: bordered box, `position: relative`, `flex: 0 0 auto`, `resize: vertical`, default `height: calc(45vh - 2.5rem)`, `min-height: 6rem`, `max-height: 80vh`, `overflow: hidden`.
- Backdrop: `position: absolute; inset: 0`, `pre-wrap`, `overflow: auto`; in viewing mode it receives clicks (mapped to caret via `caretIndexFromBackdropPoint`).
- Textarea: `height: 100%`, `resize: none` (resize grip is on the editor, not the textarea).
- `.hl` — amber highlight (`#ffd966`); `.hl--multiplier` highlights a `* N` serving multiplier distinctly.

**Food-name popover** — `.day__suggest`:

- `position: absolute; right/bottom` inside `.day__editor`, `z-index: 2`, `max-height: calc(100% - 0.9rem)`.
- `.day__suggest-list` — `overflow-y: auto`, `overscroll-behavior: contain`, `scrollbar-width: thin`; pill items `.day__suggest-item` with match highlight `.day__suggest-match`.
- Hidden in print / print-preview.

**Shared resize** — drag the bottom-right grip on any `.day__editor`; on release JS sets the same pixel height on all seven editors and saves to `localStorage` (see core doc).

**Scroll** — JS `syncScroll` copies `scrollTop` / `scrollLeft` between textarea and backdrop (see core doc).

## Days toolbar, highlight bar & food notes

**`.week__days-toolbar`** — `display: flex; justify-content: space-between`; the hint mentions the `* N` serving multiplier; right side holds Export all / Import all / **Import sample** (`#import-sample-meals`) / Clear all days.

**`.week__highlight-bar`** — separate row below the toolbar (`position: relative; z-index: 10` so popovers stack above `.week__grid`): the `#day-highlights-toggle` pen (`.week__highlight-toggle`, persisted on/off) and `#day-food-notes`.

**`#day-unmatched-lines`** (`.week__unmatched-lines`, `role="status"`) — sibling below the highlight bar; `[hidden]` only when there are zero unmatched lines. JS injects:

- `.week__unmatched-toggle` — **Unmatched (N)** expand/collapse (`data-unmatched-action="toggle"`)
- `.week__unmatched-carousel` — prev/next (`.week__unmatched-carousel-adj`), indicator, and `.week__unmatched-carousel-card` (**Go to line**, `data-unmatched-action="jump"`)

**Today’s weekday** — `markTodayDay()` adds `.day--today` on the matching `.day` (underlined `.day__label`, blue-tinted `.day__editor` border/background). Macro and micro day cards use `.dashboard__card--today` the same way. No size change — color/underline only.

**`#day-food-notes`** (`.week__food-notes`) — static shell in HTML; `[hidden]` until JS finds a regex match. When visible:

- `::before` — vertical rule between pen and notes block.
- `.week__food-notes-lead` — “Notes available for:” (not underlined).
- `#day-food-notes-labels` — JS-injected `.week__food-notes-label` buttons (underlined food names); `.week__food-notes-sep` between items (`,&nbsp;`).
- `#day-food-notes-popover` — `.week__food-notes-popover`; `position: absolute` below the active label; single `.week__food-notes-entry-text` paragraph per hover/click.

Pen + notes markup is **static** in `index.html`; only labels and popover **content** are JS-driven ([core doc](./AGENTS_CODE_REFERENCE-core.md)). Long notes overflow into `#food-note-modal` via `openFoodNoteModal`. Hidden in print / print-preview (with `.week__days-actions`).

## Dashboard, micro & longevity panels

**`.dashboard__grid`** — equal columns of `.dashboard__card` with rows for P/C/F g·cal (or **%** when toggled) and total cal; each card head has `.dashboard__card-toggle` (`data-action="toggle-dashboard-macro-view"`); today’s card gets `.dashboard__card--today`; collapses on narrow screens.

**`.dashboard__toggles`** — `Print` (`#dashboard-print`), `Week total` (`#dashboard-week-toggle`), `Micro requirements` (`#dashboard-micro-toggle`), `Longevity` (`#dashboard-longevity-toggle`); shared `.dashboard__toggle` / `--open`.

**`.week-summary`** — below grid, full width; hidden until **Week total** toggle. Blocks: **Week total**, **Day average**, **Deficit/Surplus vs TDEE** (or prompt to set TDEE), **Macro split (week avg)** with explain links.

**Micro panel** — `.dashboard__micro-panel`:
- **`#dashboard-micro-sticky`** (`.dashboard__micro-sticky`) — sticky top chrome: `.dashboard__micro-sticky-title` (**Micro Requirements**), View segmented control, **Daily Targets** group + `#dashboard-micro-dv-toggle` (“Show daily targets”), `.dashboard__sticky-options` disclosures, `#dashboard-micro-close` (`.dashboard__panel-close`).
- **Sticky options** (shared pattern with longevity nav):
  - **Highlight** (`#micro-highlight-options-panel`) — free-combine toggles for Required daily intake / S/E / A/E; clear × (`data-sticky-highlight-clear`).
  - **Filter** (`#micro-filter-options-panel`) — checkboxes for the same three; clear × (`data-sticky-filter-clear`).
  - **Poor storage / daily intake** — Show icons toggle (`data-daily-intake-icons-toggle`).
  - **One-day excess consumption** — S/E and A/E show toggles (`data-acute-kind`).
- `.dashboard__micro-condition-wrap` — focus dropdown grouped into **Nutrition Intake** (well/poorly absorbed) and **Conditions** (ADHD, anemia, anti-aging, bowel movements, cataracts, coffee/tea, hair loss) + clear ×.
- `.dashboard__micro-list` (weekly avg list) and `.dashboard__micro-daily-grid` (each-day grid; today column uses `.dashboard__card--today`). Each-day grid has a **More nutrients** control for extended fields + condition-linked longevity rows.
- **% target** text color / `font-weight` from `config.json` `microDvStatus` tiers. Nutrient rows carry `data-micro-def`, `.dashboard__micro-sources-btn`, a `.dashboard__target-ref` badge, optionally `.dashboard__micro-daily-intake-btn`, and optionally `.dashboard__micro-acute-btn--side` / `--adverse` (S/E · A/E badges).
- Icon visibility/highlight is CSS-gated by body classes: `show-daily-intake-icons`, `show-acute-side-effects`, `show-acute-adverse-effects`, `highlight-daily-intake-icons`, `highlight-side-effects`, `highlight-adverse-effects` (Highlight forces red styling and visibility).
- `#micro-tip-hair-loss` — shown when **Hair loss** condition filter is active.
- `#micro-daily-intake-popover` / `#micro-acute-toxicity-popover` / `#target-ref-popover` — fixed tooltip siblings.

**Longevity panel** — `.dashboard__longevity-panel`:
- **`#dashboard-longevity-nav`** — sticky: `.dashboard__longevity-nav-title` (**Longevity**), `#dashboard-longevity-close`, mirrored Highlight/Filter/daily/acute option panels, topic carousel + All topics list.
- Intro / disclaimer / processed-food note (Yuka / Bobby links) live in content area as applicable.
- `#dashboard-longevity-content` — grouped sections with % DV **Level** bars inside `.dashboard__longevity-bar-wrap` (fill + optional `.dashboard__longevity-bar-notch` at 100%). Notable section keys: `sectionGrayHair`, `sectionAches` (includes omega-6:3 row), `sectionBrainLongevity` (brain + astrocytes), visceral fat, fats & cholesterol, TMAO, etc. Headings carry `data-longevity-def` / `data-micro-def`; rows may include sources / daily-intake / acute icons.

**Responsive / print** (lower `styles.css`): grid column counts shrink at breakpoints; on narrow screens `.week__grid` is `height: auto` with single column; day editors keep `resize: vertical` unless print/print-preview (`resize: none`). Icon buttons and unmatched UI are hidden in print / print-preview.

## Food definitions table

**`.keywords__toolbar`** — top action bar above the table: hint + `.keywords__toolbar-actions` with duplicate bulk buttons using `-top` id suffixes (`#sort-foods-alphabetically-top`, `#export-all-foods-top`, `#import-all-foods-top`, `#import-sample-foods-top`).

**`.keywords__filter`** — search box `#keywords-search` (`type="search"`) + `#keywords-search-clear` (×, hidden when empty); filters by food-name substring. **Categories** button `#keywords-category-open` opens `#keywords-category-modal`; active category shows `#keywords-category-chip` + `#keywords-category-clear` (× exits category filter).

**`.keywords__panel`** — white panel, table `#keywords-table` inside; body `#keywords-list` (renders only the current page).

**`.keywords__pagination`** (`#keywords-pagination`, `[hidden]` when no foods) — `#keywords-page-size` select (10/25/50/100/All) + `.keywords__pagination-nav` with First/Prev/Next/Last (`#keywords-page-*`) and `#keywords-page-status` (`aria-live="polite"`).

**`#keywords-filter-empty`** — “No foods match your search.” (shown when filtered to zero; the table itself is hidden). **`#keywords-empty`** — shown when the table has no rows at all; includes recommended copy and `.keywords__empty-link` button (`data-action="import-sample-from-empty"`) that triggers sample import.

Notable columns:

- **Order** — `.keywords__th-order`; reorder controls revealed by `#keywords-reorder-toggle` (persisted open state).
- **Macros** — `.keywords__macro-toggle` on Prot/Carbs/Fats headers toggles **(g)** ↔ **(cal)** for all three + shows **Total (cal)** (`.keywords__th-total--cal`, persisted via `STORAGE_KEY_CALORIES`).
- **Micros** — `.keywords__micros` button; filled state class; scrollable text + `data-tooltip` hover.
- **Longevity** — `.keywords__longevity` button (mirrors micros button pattern).
- **Actions** — Import, Delete (+ **Move** to position via `#keyword-position-modal`).

**Footer** — `.keywords__footer`: `#add-keyword` plus `.keywords__bulk` (`#sort-foods-alphabetically`, `#export-all-foods`, `#import-all-foods`, `#import-sample-foods`).

Horizontal scroll on narrow screens: `.keywords__panel { overflow-x: auto }`, `min-width` on table.

## Settings modal (demographic + TDEE)

**`#settings-modal`** — opened from `#settings-open` in header.

- **Sex** — `#demographic-options` with `.demographic__option` radios (same as former bottom panel); `#settings-demographic-icon` in header reflects selection.
- **Weight** — `#settings-weight` number input + kg/lb unit toggle (`#settings-weight-kg` / `#settings-weight-lb`, `.tdee-calc__unit-btn`); used for IOM bw min amino-acid targets. Stored as kg.
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
- **Micro-gaps modal** (`#micro-gaps-modal`) — preference select + free-text + prompt preview / copy / open (ChatGPT/Claude buttons carry brand icons).
- **Health timeline modal** (`#health-timeline-modal`) — week-nutrient snapshot prompt for “if you keep eating like this”; same copy / ChatGPT / Claude pattern.
- **Food-note modal** (`#food-note-modal`) — reader for a long day-meal food note; `#food-note-modal-title` + `#food-note-modal-body`; opened when a `#day-food-notes` label’s note is too long for the popover.
- **Phosphorus binder modal** (`#phosphorus-binder-modal`) — educational calcium-acetate / phosphate content; opened from longevity calcification tip link (`data-action="open-phosphorus-binder-modal"`).
- **Caffeine tip modal** (`#caffeine-tip-modal`) — gum/patches vs coffee/tea mineral absorption; opened from micro panel tip (`data-action="open-caffeine-tip-modal"`).
- **Fats/cholesterol tip modal** (`#fats-cholesterol-tip-modal`) — eggs & heart health; opened from longevity panel (`data-action="open-fats-cholesterol-tip-modal"`).
- **TMAO protectors tip modal** (`#tmao-protectors-tip-modal`) — diet strategies beyond cutting precursors (`data-action="open-tmao-protectors-tip-modal"`).
- **Import modal** (`#import-modal`) — `.import-modal__body` scrollable; AI panel `.import-ai-panel`; JSON `.import-modal__json` (shorter when `.import-json-wrap--ai`).
- **Move-to-position modal** (`#keyword-position-modal`) — `#keyword-position-select`; primary button label **Move**.
- **Category filter modal** (`#keywords-category-modal`) — `#keywords-category-list` (category buttons with counts), uncategorized count `#keywords-category-uncategorized-reveal` (expands `#keywords-category-uncategorized-list`) + `#keywords-category-uncategorized-filter`, Clear filter / Done.
- **Starter guide** (`#starter-guide`) — fixed popover above import button or week grid; `#starter-guide-text`, `#starter-guide-dismiss` (**Got it**); `.starter-guide__arrow` with `data-placement`; hidden in print / print-preview.

## Z-index & stacking

- Modals `z-index: 100`.
- Starter guide `.starter-guide` `z-index: 120` (above modals).
- Daily intake / acute toxicity / target-ref popovers `z-index: 120` (fixed tooltips, not modals).
- Micros / longevity tooltip on button is above the row (cells use `overflow: visible` so it isn’t clipped).

## CSS naming convention

BEM-like blocks: `.week__`, `.day__`, `.dashboard__`, `.keywords__`, `.settings-modal__`, `.tdee-calc__`, `.macro-split-carousel`, `.micro-sources-modal__`, `.import-ai-`, `.micro-gaps-modal__`, `.micro-def__`, `.micro-tip-modal__`, `.longevity-form`, `.starter-guide__`, `.modal__`. Longevity Level bars: `.dashboard__longevity-bar-wrap`, `.dashboard__longevity-bar-notch`, `.dashboard__longevity-bar-notch-popover`.

JS does not depend on BEM beyond stable IDs (`#mon`, `#keywords-list`, etc.).

## HTML IDs relied on by JS

Critical hooks (do not rename without updating the element lookups near the top of `app.js`):

- Header/settings: `settings-open`, `settings-demographic-icon`, `settings-modal`, `settings-modal-done`, `settings-tdee`, `settings-tdee-calc-open`, `settings-weight`, `settings-weight-kg`, `settings-weight-lb`, `demographic-options`
- TDEE: `tdee-calculator-modal`, `tdee-calculator-apply`, `tdee-calculator-cancel`, `tdee-calc-*`, `tdee-hint-modal`, `tdee-hint-modal-done`
- Macro split: `macro-split-hint-modal`, `macro-split-carousel`, `macro-split-carousel-prev`, `macro-split-carousel-next`, `macro-split-carousel-indicator`, `macro-split-carousel-card`, `macro-split-hint-modal-done`
- Sources: `micro-sources-modal`, `micro-sources-modal-title`, `micro-sources-body`, `micro-sources-scope`, `micro-sources-modal-done`, `micro-sources-fullscreen-toggle`, `longevity-sources-modal`, `longevity-sources-modal-title`, `longevity-sources-body`, `longevity-sources-modal-done`, `longevity-sources-fullscreen-toggle`
- Day: `mon` … `sun`, `day-highlights-toggle`, `day-food-notes`, `day-food-notes-labels`, `day-food-notes-popover`, `day-unmatched-lines`, `export-all-meals`, `import-all-meals`, `import-all-meals-modal`, `clear-all-days`
- Dashboard: `dashboard-grid`, `dashboard-print`, `week-summary`, `dashboard-week-toggle`, `dashboard-micro-toggle`, `dashboard-micro-panel`, `dashboard-micro-list`, `dashboard-micro-daily-grid`, `micro-daily-intake-popover`, `target-ref-popover`, `target-ref-popover-text`, `dashboard-micro-view-weekly`, `dashboard-micro-view-daily`, `dashboard-micro-dv-toggle`, `dashboard-micro-hint`, `dashboard-micro-hint-text`, `micro-tip-caffeine`, `micro-tip-cataracts`, `micro-tip-hair-loss`, `dashboard-micro-condition-toggle`, `dashboard-micro-condition-list`, `dashboard-micro-condition-label`, `dashboard-micro-condition-clear`
- Longevity: `dashboard-longevity-toggle`, `dashboard-longevity-panel`, `dashboard-longevity-content`, `dashboard-longevity-nav`, `dashboard-longevity-nav-prev`, `dashboard-longevity-nav-next`, `dashboard-longevity-nav-current-title`, `dashboard-longevity-nav-all-toggle`, `dashboard-longevity-nav-all-list`, `longevity-modal`, `longevity-form`, `longevity-modal-food`, `longevity-modal-done`
- Micro gaps: `micro-gaps-ai-open`, `micro-gaps-modal`, `micro-gaps-preference`, `micro-gaps-additional`, `micro-gaps-ai-preview`, `micro-gaps-ai-copy`, `micro-gaps-open-chatgpt`, `micro-gaps-open-claude`, `micro-gaps-modal-done`
- Tip modals: `phosphorus-binder-modal`, `phosphorus-binder-modal-done`, `caffeine-tip-modal`, `caffeine-tip-modal-done`, `fats-cholesterol-tip-modal`, `fats-cholesterol-tip-modal-done`, `tmao-protectors-tip-modal`, `tmao-protectors-tip-modal-done`
- Definitions: `micro-def-modal`, `micro-def-modal-title`, `micro-def-body`, `micro-def-modal-done`, `micro-def-modal-back`, `micro-def-fullscreen-toggle`
- Food note: `food-note-modal`, `food-note-modal-title`, `food-note-modal-body`, `food-note-modal-done`
- Table: `keywords-table`, `keywords-list`, `keywords-empty`, `keywords-filter-empty`, `keywords-reorder-toggle`, `keywords-search`, `keywords-search-clear`, `keywords-category-open`, `keywords-category-chip`, `keywords-category-chip-label`, `keywords-category-clear`, `keywords-category-modal`, `keywords-category-list`, `keywords-category-uncategorized-reveal`, `keywords-category-uncategorized-count`, `keywords-category-uncategorized-filter`, `keywords-category-uncategorized-list`, `keywords-category-modal-clear`, `keywords-category-modal-done`, `keywords-pagination`, `keywords-pagination-nav`, `keywords-page-size`, `keywords-page-status`, `keywords-page-first`, `keywords-page-prev`, `keywords-page-next`, `keywords-page-last`, `add-keyword`, `sort-foods-alphabetically`(+`-top`), `export-all-foods`(+`-top`), `import-all-foods`(+`-top`), `import-sample-foods`(+`-top`), `keyword-position-modal` (+ `-food`/`-select`/`-error`/`-apply`/`-cancel`)
- Starter guide: `starter-guide`, `starter-guide-text`, `starter-guide-dismiss`
- Import: `import-modal`, `import-json`, `import-ai-*`, `import-all-modal`, `import-all-json`, `micro-modal`, `micro-form`

## Visual tokens (informal)

- Page bg `#f4f4f2`, cards white, accent blue `#3d6b9e`, success green / amber / red from `config.json` % DV tiers, error red on delete/import error, amber highlight `#ffd966`.

## Safe UI changes

- Changing grid column count: update **both** `index.html` day columns **and** `.week__grid` / `.dashboard__grid` in CSS.
- Do not remove backdrop layer if highlights remain a feature.
- Day suggest popover is injected by JS inside `.day__editor`; keep `overflow: hidden` on the editor and scroll on `.day__suggest-list` if adding more suggestion UI.
- Don’t assume the textarea always overlays the backdrop — the editor swaps `--editing` / `--viewing` / `--plain` visibility; style the shown layer per mode and preserve the viewing-mode backdrop click target.
- Shared editor resize: change `.day__editor` sizing in CSS **and** `clampDayEditorHeight` / `STORAGE_KEY_DAY_EDITOR_HEIGHT` in JS together.
- New modal: copy `.modal` + `hidden` + backdrop `data-action` close pattern from existing modals; wire close in the global Escape handler.
- Starter guide is not a `.modal`; use fixed positioning + scroll/resize listeners (see core doc). Keep `z-index` above modals if stacking changes.

## Shared longevity ↔ micro nutrients

Bridge keys are derived at runtime: `microPanelLongevityBridgeFields()` intersects `MICRO_ALL_FIELDS` with `LONGEVITY_FIELDS` → `LONGEVITY_KEYS_ALSO_IN_MICRO`. Besides total **vitaminK**, the K breakdown keys **vitaminK1**, **vitaminK2**, **vitaminK2MK4**, **vitaminK2MK7** bridge when present in both field lists. The AI import prompt lists each bridge field with label/unit and `micros → longevity: true`.

**Data convention** — the numeric value lives in `food.micros`; `food.longevity` stores `true` as a reference marker:

```json
{
  "micros": {
    "copper": 450,
    "selenium": 40,
    "vitaminE": 2.5,
    "vitaminK": 5,
    "vitaminK1": 3,
    "vitaminK2MK7": 12,
    "phosphorus": 280,
    "choline": 105
  },
  "longevity": {
    "copper": true,
    "selenium": true,
    "vitaminE": true,
    "vitaminK": true,
    "vitaminK1": true,
    "vitaminK2MK7": true,
    "phosphorus": true,
    "choline": true,
    "plantSterols": 0.4,
    "carotenoids": 2.5
  }
}
```

**Runtime** — `resolveLongevityValue(kw, key)` returns the micro value when `kw.longevity[key] === true`; **carotenoids** falls back to an estimate from `micros.vitaminA` when not explicitly stored. Callers that accumulate or display longevity totals use `resolveLongevityValue`, not raw `kw.longevity[key]`.

**Form save** — `saveLongevityFromForm` writes shared-key values to `kw.micros` and sets `kw.longevity` to `true`. `saveMicrosFromForm` writes directly to `kw.micros`; the longevity `true` marker picks up the new value automatically.

**Export / import** — `exportFoodObject` preserves `true` in the longevity section. `applyLongevityImportToKeyword` accepts `true` or a numeric value; when numeric, it moves the value to micros and sets longevity to `true`. `syncSharedMicroLongevity` runs on load and import to migrate legacy numeric longevity-only values.

**Copper unit** — copper uses **mcg** throughout (`MICRO_FIELDS`, `LONGEVITY_FIELDS`, `DAILY_LONGEVITY_DV: 900`, `DAILY_MICRO_DV: 900`).

## File size hint

| File | ~Lines | Load when |
|------|--------|-----------|
| `index.html` | 1,640 | Structure / new regions |
| `styles.css` | 6,240 | Visual/layout only |
| `app.js` | 15,670 | Behavior (other docs) |
