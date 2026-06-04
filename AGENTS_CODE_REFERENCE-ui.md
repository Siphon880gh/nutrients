# AGENTS_CODE_REFERENCE-ui.md

> **Approximate locations only** — use class names and file regions in `index.html` (~157 lines) and `styles.css` (~869 lines).

Markup structure, layout, modals, and the **highlight mirror** pattern.

Parent: [AGENTS_CODE_REFERENCE.md](./AGENTS_CODE_REFERENCE.md)

## Page layout (vertical)

```text
.week (main, max-width ~1400px)
├── .week__header
├── .dashboard
│   ├── #dashboard-grid           (6 cards, JS)
│   ├── #week-summary             (full-width week calories, JS)
│   └── #dashboard-micro-panel    (hidden until toggle; % DV list, JS)
├── .week__grid             (6 columns Mon–Sat, 45vh height desktop)
│   └── .day × 6
│       ├── .day__label
│       └── .day__editor
│           ├── .day__backdrop   (highlight layer)
│           └── textarea.day__input (transparent text)
├── .keywords               (food definitions table)
└── .demographic            (collapsed `<details>`; ♂/♀ badge on summary)
```

Modals are **siblings** of `main`, not inside it.

## Day editor: highlight mirror

Native `<textarea>` cannot color individual words. Pattern:

| Layer | Class | Behavior |
|-------|--------|----------|
| Back | `.day__backdrop` | `innerHTML` with text + `<mark class="hl">` |
| Front | `.day__input` | `color: transparent`, `caret-color` visible, `background: transparent` |

**CSS** — mid `styles.css`, block starting `.day__editor`:

- Editor: bordered box, `position: relative`, flex child in `.day`.
- Backdrop: `position: absolute; inset: 0`, `pointer-events: none`, `pre-wrap`.
- `.hl` — amber highlight (`#ffd966`).
- Selection on textarea uses semi-transparent overlay so selection stays visible.

**Scroll** — JS `syncScroll` copies `scrollTop` / `scrollLeft` (see core doc).

## Dashboard & week bar

**`.dashboard__grid`** — 6 equal columns; cards `.dashboard__card` with rows for P/C/F g·cal and total.

**`.week-summary`** — below grid, full width, distinct background; week total calories prominent.

**Micro requirements** — `#dashboard-micro-toggle` in `.dashboard__header-row`; panel `.dashboard__micro-panel` with responsive grid `.dashboard__micro-list`. **% DV** text color and `font-weight` are inline from `config.json` tiers (`data-dv-tier` on row).

**Responsive** (bottom of `styles.css`):

- ≤900px: dashboard + week grid → 3 columns; week summary spans full width.
- ≤520px: 1–2 column stacks; day editors `min-height` instead of 45vh grid height.

## Food definitions table

**`.keywords__panel`** — white panel, table inside.

Notable columns:

- **Micros** — `.keywords__micros` button; filled state `.keywords__micros--filled`; scrollable text + `data-tooltip` black hover (pseudo-elements `::after` / `::before`).
- **Actions** — `.keywords__import`, `.keywords__delete` flex row.

Horizontal scroll on narrow screens: `.keywords__panel { overflow-x: auto }`, `min-width` on table.

## Demographic panel

**`.demographic__details`** — native `<details>`; **closed by default** (no `open` attribute).

**Summary** — `.demographic__summary` with title + `#demographic-badge` (♂/♀) in the corner.

**Body** — radio-style `.demographic__option` buttons; selected `.demographic__option--selected`.

Placed **below** `.keywords` in `index.html`.

## Modals (shared)

**`.modal`** — fixed fullscreen flex center; `[hidden]` → `display: none`.

**`.modal__panel`** — column flex, `overflow: hidden`; body scrolls, footer `flex-shrink: 0` (prevents footer overlapping textarea — import fix).

Variants:

- `.modal__panel--wide` — import modal (~36rem).
- `.modal__footer--split` — Cancel left, primary right.

**Micro modal** — `#micro-form.micro-form` 2-column grid of fields; built at runtime.

**Import modal** — `.import-modal__body` scrollable; AI panel `.import-ai-panel`; JSON `.import-modal__json` with shorter max-height when `.import-json-wrap--ai`.

## Z-index & stacking

- Modals `z-index: 100`.
- Micros tooltip on button `z-index: 60` (within table; may clip if ancestor has `overflow: hidden` — cell uses `overflow: visible`).

## CSS naming convention

BEM-like blocks: `.week__`, `.day__`, `.dashboard__`, `.keywords__`, `.import-ai-`, `.modal__`.

JS does not depend on BEM beyond stable IDs (`#mon`, `#keywords-list`, etc.).

## HTML IDs relied on by JS

Critical hooks (do not rename without updating `app.js` top):

- Day: `mon` … `sat`
- `dashboard-grid`, `week-summary`, `dashboard-micro-toggle`, `dashboard-micro-panel`, `dashboard-micro-list`
- `demographic-panel`, `demographic-badge`, `demographic-options`
- `keywords-list`, `keywords-empty`, `add-keyword`
- `import-modal`, `import-json`, `import-ai-*`, `micro-modal`, `micro-form`

## Visual tokens (informal)

- Page bg `#f4f4f2`, cards white, accent blue `#3d6b9e`, success green on micros-filled, error red on delete/import error.

## Safe UI changes

- Changing grid column count: update **both** `index.html` day columns **and** `.week__grid` / `.dashboard__grid` in CSS.
- Do not remove backdrop layer if highlights remain a feature.
- New modal: copy `.modal` + `hidden` + backdrop `data-action` close pattern from existing modals.

## File size hint

| File | ~Lines | Load when |
|------|--------|-----------|
| `index.html` | 157 | Structure / new regions |
| `styles.css` | 869 | Visual/layout only |
| `app.js` | 1066 | Behavior (other docs) |
