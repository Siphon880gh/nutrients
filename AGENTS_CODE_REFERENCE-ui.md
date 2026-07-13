# AGENTS_CODE_REFERENCE-ui.md

> **Approximate locations only** — use class names and file regions in `index.html` (~2,070 lines) and `styles.css` (~7,800 lines).

Markup structure, layout, auth header/modals, Favorites sidebar, mobile days carousel, and the **highlight mirror** pattern.

Parent: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Page layout (vertical)

```text
.week (main, max-width ~1400px)
├── .week__header
│   └── .week__header-actions
│       ├── #auth-logged-out / #auth-logged-in (.week__auth — Sign up / Log in / email / Log out)
│       └── #settings-open (.week__settings — sex icon + “Settings”)
├── .dashboard
│   ├── .dashboard__header
│   │   ├── .dashboard__toggles  (Print, Week total, Micro requirements, Longevity)
│   │   └── .dashboard__hint
│   ├── #dashboard-grid            (7 cards; .dashboard__date; today’s weekday .dashboard__card--today when on this week)
│   ├── #dashboard-micro-panel     (hidden until toggle)
│   │   ├── #dashboard-micro-sticky (title, View, Daily Targets, Highlight/Filter/
│   │   │     By Nutrients / daily-intake/acute disclosures, #dashboard-micro-close)
│   │   ├── intro + Ask AI + condition focus dropdown (Nutrition Intake group)
│   │   ├── tip asides (#micro-tip-*)
│   │   ├── #dashboard-micro-list / #dashboard-micro-daily-grid
│   │   └── More nutrients
│   ├── #micro-daily-intake-popover / #micro-acute-toxicity-popover / #target-ref-popover
│   ├── #dashboard-longevity-panel (hidden until toggle)
│   │   ├── #dashboard-longevity-nav (title, close, sticky icon options + By Nutrients, section nav)
│   │   └── #dashboard-longevity-content (JS — sections + % DV bars + 100% notch)
│   └── #week-summary              (hidden by default)
├── .week__nav              (Previous/Next week, range, This week, Favorites)
├── .week__days-toolbar     (* N hint + Export / Import / Import sample / Clear)
│   └── .week__days-actions
├── .week__highlight-bar    (pen + food notes)
│   ├── #day-highlights-toggle
│   └── #day-food-notes
├── #day-unmatched-lines    (collapsible Unmatched carousel; JS)
├── .week__days
│   ├── .week__days-favorite-week (#week-nav-favorite)
│   ├── .week__days-carousel-nav
│   └── .week__grid         (7 columns; .day--today / .day--favorite-day when applicable)
│       └── .day × 7
│           ├── .day__head (.day__head-text: label + .day__date; .day__head-actions: Copy + Favorite + Clear)
│           └── .day__editor (editing/viewing/plain; shared height)
│           ├── .day__backdrop
│           ├── textarea.day__input
│           └── .day__suggest (optional; may use .day__suggest--above)
├── .keywords               (food definitions table)
└── (sex/TDEE/weight in #settings-modal)
```

Modals are **siblings** of `main`, not inside it. Auth modals (`#auth-signup-modal`, `#auth-login-modal`), **`#starter-guide`**, and `#favorites-sidebar` are also siblings — starter guide is a fixed-position beginner popover (not a blocking modal).

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
- `positionDaySuggest` places the panel below the caret, or with `.day__suggest--above` pinned to the editor top when the caret is in the lower half (so typing near the bottom is not covered).
- `.day__suggest-list` — `overflow-y: auto`, `overscroll-behavior: contain`, `scrollbar-width: thin`; pill items `.day__suggest-item` with match highlight `.day__suggest-match`.
- Hidden in print / print-preview.

**Shared resize** — drag the bottom-right grip on any `.day__editor`; on release JS sets the same pixel height on all seven editors and saves via `NutrientsPersist` settings (`dayEditorHeight`; see [AGENTS-data-persistence.md](./AGENTS-data-persistence.md)).

**Scroll** — JS `syncScroll` copies `scrollTop` / `scrollLeft` between textarea and backdrop (see core doc).

## Days toolbar, highlight bar & food notes

**`.week__days-toolbar`** — `display: flex; justify-content: space-between`; the hint mentions the `* N` serving multiplier; right side holds Export all / Import all / **Import sample** (`#import-sample-meals`) / Clear all days (viewed week).

**`.week__nav`** — sits directly above the days toolbar (not above the dashboard). Labeled **Previous week** / **Next week** buttons, clickable range `#week-nav-label` (opens `#week-jump-modal` calendar + typed date → jump to that week), **This week** (`#week-nav-this`), and **Favorites** (`#favorites-open` → right slide-in `#favorites-sidebar`). Prev disables at the earliest diary week (Mon–Sun containing `2026-05-01`). Hidden in print / print-preview.

**Diary favorites** — **Favorite week** (`#week-nav-favorite`) sits above the Mon–Sun day grid (`.week__days-favorite-week`). Per-day Favorite uses `data-action="favorite-day"`; disabled when that day has no notes (same as Clear/Copy). Add/edit uses `#favorite-edit-modal` (`#favorite-edit-name`, `#favorite-edit-description`, `#favorite-edit-modal-hint`, `#favorite-edit-error`). `#favorites-sidebar` is a fixed right slide-in (not a `.modal`): backdrop + `.favorites-sidebar__panel`, class `favorites-sidebar--open`, `inert` when closed. Browse list `#favorites-list`; **Manage** (`#favorites-manage-toggle`) swaps to `#favorites-manage-list` (↑↓ / Edit / Delete). Empty copy `#favorites-empty`; hint `#favorites-sidebar-hint`. Persisted in `nutrients_favorites` (per `userId`). Jumping to a favorite **day** sets session `activeFavoriteDayKey` and applies `.day--favorite-day` (teal `#1f5c53` / `#2a7a6e` / `#eef7f5`, distinct from `.day--today` blue); choosing another favorite day clears the previous highlight first; jumping to a favorite **week** clears the day highlight. When both today and favorite apply, `.day--today.day--favorite-day` keeps the teal favorite styling.

**`.week__highlight-bar`** — separate row below the toolbar (`position: relative; z-index: 10` so popovers stack above `.week__grid`): the `#day-highlights-toggle` pen (`.week__highlight-toggle`, persisted on/off) and `#day-food-notes`.

**`#day-unmatched-lines`** (`.week__unmatched-lines`, `role="status"`) — sibling below the highlight bar; `[hidden]` only when there are zero unmatched lines. JS injects:

- `.week__unmatched-toggle` — **Unmatched (N)** expand/collapse (`data-unmatched-action="toggle"`)
- `.week__unmatched-carousel` — prev/next (`.week__unmatched-carousel-adj`), indicator, and `.week__unmatched-carousel-card` (**Go to line**, `data-unmatched-action="jump"`)

**Today’s weekday** — `markTodayDay()` adds `.day--today` on the matching `.day` only when the viewed week contains today (underlined `.day__label`, blue-tinted `.day__editor` border/background). Macro and micro day cards use `.dashboard__card--today` the same way. No size change — color/underline only. Favorite-day jump highlight uses `.day--favorite-day` (teal) via `markFavoriteDay()` / `activeFavoriteDayKey`; see Diary favorites above for combined today+favorite.

**Mobile days carousel** — at `max-width: 520px`, `.week__days-carousel-nav` is shown and `.week__grid` becomes a horizontal flex strip with `scroll-snap-type: x mandatory` (one `.day` ≈ full viewport width). Prev/next use `data-days-carousel`; `#days-carousel-current` shows `Mon · M/D/YY`. Desktop keeps seven equal columns; carousel nav is `display: none` above the breakpoint. Hidden in print / print-preview.

**Day dates + Copy menu** — `.day__date` under each weekday label shows `M/D/YY`. **Favorite** (`.day__favorite`, `data-action="favorite-day"`) opens `#favorite-edit-modal`. **Copy** (`.day__copy-toggle`) opens a menu: copy this week to this week, copy to custom week, copy this date to custom day / today / yesterday / tomorrow. Custom targets use `#copy-date-modal`.

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
  - **Filter** (`#micro-filter-options-panel`) — checkboxes for daily / S/E / A/E; clear × (`data-sticky-filter-clear`); nested **By Nutrients** (`.dashboard__nutrient-filter`):
    - Disclosure `[data-nutrient-filter-disclosure]` → `#micro-nutrient-filter-panel`
    - Presets `[data-nutrient-filter-preset="common-deficiencies"|"fat-soluble"]`
    - Combobox `#micro-nutrient-filter-input` + `#micro-nutrient-filter-suggest`
    - Chips `[data-nutrient-filter-chips]`
  - Same Filter / By Nutrients markup is mirrored under `#dashboard-longevity-nav` (`#longevity-nutrient-filter-panel`, `#longevity-nutrient-filter-input`, …) and shares `filterStickyNutrientKeys` state.
  - **Poor storage / daily intake** — Show icons toggle (`data-daily-intake-icons-toggle`).
  - **One-day excess consumption** — S/E and A/E show toggles (`data-acute-kind`).
- `.dashboard__micro-condition-wrap` — focus dropdown grouped into **Nutrition Intake** (well/poorly absorbed, **American Common Deficiencies**, **Fat-soluble vitamins**) and **Conditions** (ADHD, anemia, anti-aging, bowel movements, cataracts, coffee/tea, hair loss) + clear ×.
- `.dashboard__micro-list` (weekly avg list) and `.dashboard__micro-daily-grid` (each-day grid; today column uses `.dashboard__card--today`). Each-day grid has a **More nutrients** control for extended fields + condition-linked longevity rows.
- **% target** text color / `font-weight` from `config.json` `microDvStatus` tiers. Nutrient rows carry `data-micro-def`, `.dashboard__micro-sources-btn`, a `.dashboard__target-ref` badge, optionally `.dashboard__micro-daily-intake-btn`, and optionally `.dashboard__micro-acute-btn--side` / `--adverse` (S/E · A/E badges).
- Icon visibility/highlight is CSS-gated by body classes: `show-daily-intake-icons`, `show-acute-side-effects`, `show-acute-adverse-effects`, `highlight-daily-intake-icons`, `highlight-side-effects`, `highlight-adverse-effects` (Highlight forces red styling and visibility).
- `#micro-tip-hair-loss` — shown when **Hair loss** condition filter is active.
- `#micro-tip-common-deficiencies` — stays visible for **American Common Deficiencies** (and when no condition filter is active); points users at Filter → By Nutrients → Common Deficiencies preset.
- `#micro-tip-fat-soluble` — stays visible for **Fat-soluble vitamins** condition focus.
- `#micro-daily-intake-popover` / `#micro-acute-toxicity-popover` / `#target-ref-popover` — fixed tooltip siblings.

**Longevity panel** — `.dashboard__longevity-panel`:
- **`#dashboard-longevity-nav`** — sticky: `.dashboard__longevity-nav-title` (**Longevity**), `#dashboard-longevity-close`, mirrored Highlight/Filter (incl. By Nutrients)/daily/acute option panels, topic carousel + All topics list.
- Intro / disclaimer / processed-food note (Yuka / Bobby links) live in content area as applicable.
- `#dashboard-longevity-content` — grouped sections with % DV **Level** bars inside `.dashboard__longevity-bar-wrap` (fill + optional `.dashboard__longevity-bar-notch` at 100%). Notable section keys: `sectionUpperGiMotility`, `sectionThyroid`, `sectionLiver`, `sectionKidney`, `sectionGrayHair`, `sectionAches` (includes omega-6:3 row), `sectionBrainLongevity` (brain + astrocytes), `sectionVascularBloodPressure` (FDA/WHO/AHA sodium limit rows), visceral fat, fats & cholesterol, TMAO, etc. Headings carry `data-longevity-def` / `data-micro-def`; rows may include sources / daily-intake / acute icons.

**Responsive / print** (lower `styles.css`): dashboard/table column counts shrink at breakpoints. At `max-width: 520px`, the Mon–Sun **day editors** use a horizontal scroll-snap carousel (not a stacked single-column grid) — see **Mobile days carousel** above. Day editors keep `resize: vertical` unless print/print-preview (`resize: none`). Icon buttons, week nav, Favorite week, Favorites sidebar, unmatched UI, and day Copy/Favorite/Clear are hidden in print / print-preview.

## Food definitions table

**`.keywords__toolbar`** — top action bar above the table: hint + `.keywords__toolbar-actions` with duplicate bulk buttons using `-top` id suffixes (`#sort-foods-alphabetically-top`, `#export-all-foods-top`, `#import-all-foods-top`, `#import-sample-foods-top`).

**`.keywords__filter`** — search box `#keywords-search` (`type="search"`) + `#keywords-search-clear` (×, hidden when empty); filters by food-name substring. **Categories** button `#keywords-category-open` opens `#keywords-category-modal`; active category shows `#keywords-category-chip` + `#keywords-category-clear` (× exits category filter).

**`.keywords__panel`** — white panel, table `#keywords-table` inside; body `#keywords-list` (renders only the current page).

**`.keywords__pagination`** (`#keywords-pagination`, `[hidden]` when no foods) — `#keywords-page-size` select (10/25/50/100/All) + `.keywords__pagination-nav` with First/Prev/Next/Last (`#keywords-page-*`) and `#keywords-page-status` (`aria-live="polite"`).

**`#keywords-filter-empty`** — “No foods match your search.” (shown when filtered to zero; the table itself is hidden). **`#keywords-empty`** — shown when the table has no rows at all; includes recommended copy and `.keywords__empty-link` button (`data-action="import-sample-from-empty"`) that triggers sample import.

Notable columns:

- **Order** — `.keywords__th-order`; reorder controls revealed by `#keywords-reorder-toggle` (persisted open state).
- **Macros** — `.keywords__macro-toggle` on Prot/Carbs/Fats headers toggles **(g)** ↔ **(cal)** for all three + shows **Total (cal)** (`.keywords__th-total--cal`, persisted via settings `keywordsCaloriesOpen`).
- **Micros** — `.keywords__micros` button; filled state class; scrollable text + `data-tooltip` hover.
- **Longevity** — `.keywords__longevity` button (mirrors micros button pattern).
- **Actions** — Import, Delete (+ **Move** to position via `#keyword-position-modal`).

**Footer** — `.keywords__footer`: `#add-keyword` plus `.keywords__bulk` (`#sort-foods-alphabetically`, `#export-all-foods`, `#import-all-foods`, `#import-sample-foods`).

Horizontal scroll on narrow screens: `.keywords__panel { overflow-x: auto }`, `min-width` on table.

## Auth header & modals

**Header** — `.week__header-actions` (top-right): `#auth-logged-out` shows **Log in** (`#auth-login-open`) + **Sign up** (`#auth-signup-open`); `#auth-logged-in` shows `#auth-user-email` + **Log out** (`#auth-logout`). `syncAuthUi` toggles which block is visible.

**`#auth-signup-modal` / `#auth-login-modal`** — standard `.modal` pattern; email + password fields (`#auth-signup-email` / `#auth-signup-password`, `#auth-login-email` / `#auth-login-password`); error paragraphs `#auth-signup-error` / `#auth-login-error`; submit via `#auth-signup-submit` / `#auth-login-submit`. CSS: `.week__auth`, `.week__auth-btn`, `.week__auth-btn--primary`, `.week__auth-email`. Passwords are plaintext local-testing accounts only ([AGENTS-data-persistence.md](./AGENTS-data-persistence.md)).

Scripts **`demographic-dv.js`**, **`longevity-dv.js`**, and **`persist.js`** must load before `app.js`.

## Settings modal (demographic + TDEE)

**`#settings-modal`** — opened from `#settings-open` in header.

- **Sex** — `#demographic-options` with `.demographic__option` radios (same as former bottom panel); `#settings-demographic-icon` in header reflects selection.
- **Weight** — `#settings-weight` number input + kg/lb unit toggle (`#settings-weight-kg` / `#settings-weight-lb`, `.tdee-calc__unit-btn`); used for IOM bw min amino-acid targets. Stored as kg.
- **TDEE** — `#settings-tdee` number input + `#settings-tdee-calc-open` → `#tdee-calculator-modal`.
- Explainer copy references `demographic-dv.js` calorie baselines (informative; week calories still from food matches).

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
- **Sign up / Log in** (`#auth-signup-modal`, `#auth-login-modal`) — local multi-user accounts; see Auth header & modals.
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
- **DASH diet tip modal** (`#dash-diet-tip-modal`) — DASH diet & calcium; opened from Kidney / related longevity tips (`data-action="open-dash-diet-tip-modal"`).
- **Import modal** (`#import-modal`) — `.import-modal__body` scrollable; AI panel `.import-ai-panel`; JSON `.import-modal__json` (shorter when `.import-json-wrap--ai`).
- **Move-to-position modal** (`#keyword-position-modal`) — `#keyword-position-select`; primary button label **Move**.
- **Category filter modal** (`#keywords-category-modal`) — `#keywords-category-list` (category buttons with counts), uncategorized count `#keywords-category-uncategorized-reveal` (expands `#keywords-category-uncategorized-list`) + `#keywords-category-uncategorized-filter`, Clear filter / Done.
- **Week jump** (`#week-jump-modal`) — calendar `#week-jump-date` + typed `#week-jump-typed`; live preview `#week-jump-preview`; error `#week-jump-error`; Apply `#week-jump-apply` / Cancel `#week-jump-cancel`. Jumps to the Mon–Sun week containing the chosen date (clamped by `EARLIEST_DIARY_DATE`).
- **Copy date** (`#copy-date-modal`) — destination `#copy-date-input`; dynamic `#copy-date-modal-title` / `#copy-date-modal-hint` / `#copy-date-modal-error` from pending copy action; Apply `#copy-date-apply` / Cancel `#copy-date-cancel`. Used for custom week or custom day copy targets from `.day__copy-menu`.
- **Favorite edit** (`#favorite-edit-modal`) — name + why fields; Save `#favorite-edit-save` / Cancel `#favorite-edit-cancel`.
- **Favorites sidebar** (`#favorites-sidebar`) — not a `.modal`; right slide-in with `favorites-sidebar--open` (see Diary favorites). Still participates in `updateBodyModalOpen` / Escape-to-close.
- **Starter guide** (`#starter-guide`) — fixed popover above import button or week grid; `#starter-guide-text`, `#starter-guide-dismiss` (**Got it**); `.starter-guide__arrow` with `data-placement`; hidden in print / print-preview.

## Z-index & stacking

- Modals `z-index: 100`.
- Favorites sidebar `z-index: 80` (below modals so `#favorite-edit-modal` can stack above it).
- Starter guide `.starter-guide` `z-index: 120` (above modals).
- Daily intake / acute toxicity / target-ref popovers `z-index: 120` (fixed tooltips, not modals).
- Micros / longevity tooltip on button is above the row (cells use `overflow: visible` so it isn’t clipped).

## CSS naming convention

BEM-like blocks: `.week__`, `.week__auth*`, `.day__`, `.dashboard__`, `.dashboard__nutrient-filter*`, `.keywords__`, `.settings-modal__`, `.tdee-calc__`, `.macro-split-carousel`, `.micro-sources-modal__`, `.import-ai-`, `.micro-gaps-modal__`, `.micro-def__`, `.micro-tip-modal__`, `.longevity-form`, `.starter-guide__`, `.favorites-sidebar__`, `.favorites-manage-*`, `.modal__`. Longevity Level bars: `.dashboard__longevity-bar-wrap`, `.dashboard__longevity-bar-notch`, `.dashboard__longevity-bar-notch-popover`.

JS does not depend on BEM beyond stable IDs (`#mon`, `#keywords-list`, etc.).

## HTML IDs relied on by JS

Critical hooks (do not rename without updating the element lookups near the top of `app.js`):

- Auth: `auth-logged-out`, `auth-logged-in`, `auth-user-email`, `auth-login-open`, `auth-signup-open`, `auth-logout`, `auth-signup-modal`, `auth-signup-email`, `auth-signup-password`, `auth-signup-error`, `auth-signup-cancel`, `auth-signup-submit`, `auth-login-modal`, `auth-login-email`, `auth-login-password`, `auth-login-error`, `auth-login-cancel`, `auth-login-submit`
- Header/settings: `settings-open`, `settings-demographic-icon`, `settings-modal`, `settings-modal-done`, `settings-tdee`, `settings-tdee-calc-open`, `settings-weight`, `settings-weight-kg`, `settings-weight-lb`, `demographic-options`
- TDEE: `tdee-calculator-modal`, `tdee-calculator-apply`, `tdee-calculator-cancel`, `tdee-calc-*`, `tdee-hint-modal`, `tdee-hint-modal-done`
- Macro split: `macro-split-hint-modal`, `macro-split-carousel`, `macro-split-carousel-prev`, `macro-split-carousel-next`, `macro-split-carousel-indicator`, `macro-split-carousel-card`, `macro-split-hint-modal-done`
- Sources: `micro-sources-modal`, `micro-sources-modal-title`, `micro-sources-body`, `micro-sources-scope`, `micro-sources-modal-done`, `micro-sources-fullscreen-toggle`, `longevity-sources-modal`, `longevity-sources-modal-title`, `longevity-sources-body`, `longevity-sources-modal-done`, `longevity-sources-fullscreen-toggle`
- Day / week / favorites: `mon` … `sun`, `week-nav-prev`, `week-nav-next`, `week-nav-label`, `week-nav-label-text`, `week-nav-this`, `week-nav-favorite`, `favorites-open`, `favorites-sidebar`, `favorites-sidebar-title`, `favorites-sidebar-hint`, `favorites-list`, `favorites-manage-toggle`, `favorites-manage-list`, `favorites-empty`, `favorite-edit-modal`, `favorite-edit-modal-title`, `favorite-edit-modal-hint`, `favorite-edit-name`, `favorite-edit-description`, `favorite-edit-error`, `favorite-edit-save`, `favorite-edit-cancel`, `days-carousel-current`, `week-jump-modal`, `week-jump-date`, `week-jump-typed`, `week-jump-preview`, `week-jump-error`, `week-jump-apply`, `week-jump-cancel`, `copy-date-modal`, `copy-date-modal-title`, `copy-date-modal-hint`, `copy-date-input`, `copy-date-modal-error`, `copy-date-apply`, `copy-date-cancel`, `day-highlights-toggle`, `day-food-notes`, `day-food-notes-labels`, `day-food-notes-popover`, `day-unmatched-lines`, `export-all-meals`, `import-all-meals`, `import-all-meals-modal`, `clear-all-days`
- Dashboard: `dashboard-grid`, `dashboard-print`, `week-summary`, `dashboard-week-toggle`, `dashboard-micro-toggle`, `dashboard-micro-panel`, `dashboard-micro-list`, `dashboard-micro-daily-grid`, `micro-daily-intake-popover`, `target-ref-popover`, `target-ref-popover-text`, `dashboard-micro-view-weekly`, `dashboard-micro-view-daily`, `dashboard-micro-dv-toggle`, `dashboard-micro-hint`, `dashboard-micro-hint-text`, `micro-tip-caffeine`, `micro-tip-cataracts`, `micro-tip-hair-loss`, `micro-tip-common-deficiencies`, `micro-tip-fat-soluble`, `dashboard-micro-condition-toggle`, `dashboard-micro-condition-list`, `dashboard-micro-condition-label`, `dashboard-micro-condition-clear`, `micro-nutrient-filter-panel`, `micro-nutrient-filter-input`, `micro-nutrient-filter-suggest`, `longevity-nutrient-filter-panel`, `longevity-nutrient-filter-input`, `longevity-nutrient-filter-suggest`, `micro-gaps-ai-open`, `health-timeline-ai-open`
- Longevity: `dashboard-longevity-toggle`, `dashboard-longevity-panel`, `dashboard-longevity-content`, `dashboard-longevity-nav`, `dashboard-longevity-nav-prev`, `dashboard-longevity-nav-next`, `dashboard-longevity-nav-current-title`, `dashboard-longevity-nav-all-toggle`, `dashboard-longevity-nav-all-list`, `longevity-modal`, `longevity-form`, `longevity-modal-food`, `longevity-modal-done`
- Micro gaps: `micro-gaps-modal`, `micro-gaps-preference`, `micro-gaps-additional`, `micro-gaps-ai-preview`, `micro-gaps-ai-copy`, `micro-gaps-open-chatgpt`, `micro-gaps-open-claude`, `micro-gaps-modal-done`
- Health timeline: `health-timeline-modal`, `health-timeline-ai-preview`, `health-timeline-ai-copy`, `health-timeline-open-chatgpt`, `health-timeline-open-claude`, `health-timeline-modal-done`
- Tip modals: `phosphorus-binder-modal`, `phosphorus-binder-modal-done`, `caffeine-tip-modal`, `caffeine-tip-modal-done`, `fats-cholesterol-tip-modal`, `fats-cholesterol-tip-modal-done`, `tmao-protectors-tip-modal`, `tmao-protectors-tip-modal-done`, `dash-diet-tip-modal`, `dash-diet-tip-modal-done`
- Definitions: `micro-def-modal`, `micro-def-modal-title`, `micro-def-body`, `micro-def-modal-done`, `micro-def-modal-back`, `micro-def-fullscreen-toggle`
- Food note: `food-note-modal`, `food-note-modal-title`, `food-note-modal-body`, `food-note-modal-done`
- Table: `keywords-table`, `keywords-list`, `keywords-empty`, `keywords-filter-empty`, `keywords-reorder-toggle`, `keywords-search`, `keywords-search-clear`, `keywords-category-open`, `keywords-category-chip`, `keywords-category-chip-label`, `keywords-category-clear`, `keywords-category-modal`, `keywords-category-list`, `keywords-category-uncategorized-reveal`, `keywords-category-uncategorized-count`, `keywords-category-uncategorized-filter`, `keywords-category-uncategorized-list`, `keywords-category-modal-clear`, `keywords-category-modal-done`, `keywords-pagination`, `keywords-pagination-nav`, `keywords-page-size`, `keywords-page-status`, `keywords-page-first`, `keywords-page-prev`, `keywords-page-next`, `keywords-page-last`, `add-keyword`, `sort-foods-alphabetically`(+`-top`), `export-all-foods`(+`-top`), `import-all-foods`(+`-top`), `import-sample-foods`(+`-top`), `keyword-position-modal` (+ `-food`/`-select`/`-error`/`-apply`/`-cancel`)
- Starter guide: `starter-guide`, `starter-guide-text`, `starter-guide-dismiss`
- Import: `import-modal`, `import-json`, `import-ai-*`, `import-all-modal`, `import-all-json`, `micro-modal`, `micro-form`

## Visual tokens (informal)

- Page bg `#f4f4f2`, cards white, accent blue `#3d6b9e` (today), favorite teal `#1f5c53` / `#2a7a6e`, success green / amber / red from `config.json` % DV tiers, error red on delete/import error, amber highlight `#ffd966`.

## Safe UI changes

- Changing grid column count: update **both** `index.html` day columns **and** `.week__grid` / `.dashboard__grid` in CSS; keep the ≤520px carousel scroll-snap rules in sync.
- Do not remove backdrop layer if highlights remain a feature.
- Day suggest popover is injected by JS inside `.day__editor`; keep `overflow: hidden` on the editor and scroll on `.day__suggest-list` if adding more suggestion UI. Prefer `positionDaySuggest` / `.day__suggest--above` over hard-coding bottom placement so bottom-of-box typing stays visible.
- Don’t assume the textarea always overlays the backdrop — the editor swaps `--editing` / `--viewing` / `--plain` visibility; style the shown layer per mode and preserve the viewing-mode backdrop click target.
- Shared editor resize: change `.day__editor` sizing in CSS **and** `clampDayEditorHeight` / settings `dayEditorHeight` in JS together.
- New modal: copy `.modal` + `hidden` + backdrop `data-action` close pattern from existing modals; wire close in the global Escape handler. Favorites sidebar is class-toggled (`favorites-sidebar--open`), not `hidden`-based.
- Auth + password fields on the same page can cause Chrome to autofill saved usernames into other text/search inputs (e.g. `#keywords-search`); keep `autocomplete="off"` on search filters and prefer non-username-like `name`/`id` when adding new free-text fields.
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
| `index.html` | 2,070 | Structure / new regions |
| `styles.css` | 7,800 | Visual/layout only |
| `persist.js` | 960 | Auth + repository only |
| `app.js` | 19,800 | Behavior (other docs) |
