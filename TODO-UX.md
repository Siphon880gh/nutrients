Status: Done

# TODO-UX

UX critique of the Nutrients week-meals app (17 Aug 2026). Audience: adults 35–65+ who log real meals to audit macros, micros, and longevity — not casual calorie logging. Tone target: intentional, clinical-calm, lab-notebook.

Primary jobs: log this week’s meals quickly, see empty vs filled days, jump into Micro / Longevity.

Scoring uses Nielsen heuristics (0–4 each). Severity: **P0** blocks the job · **P1** causes serious confusion · **P2** workaround exists · **P3** polish.

---

## Design health

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 2 | Logged-out edits vanish with no banner. Autosave has no “saved” cue. Add-food success is just the modal closing. |
| 2 | Match system / real world | 3 | Meal language is solid. “Copy this week to this week” and “Sign up” (browser-local) fight real-world meaning. |
| 3 | User control and freedom | 2 | Modals cancel/Escape well. Clear / import / delete have confirms but **no undo**. |
| 4 | Consistency and standards | 2 | In-app errors vs `window.alert` / `confirm`. Day actions are icon+hover-label; Add food is always a big labeled button. Servings: modal vs hover-to-edit on the line. |
| 5 | Error prevention | 3 | Destructive confirms and definition-only Add food help. Silent logged-out discard is the hole. |
| 6 | Recognition rather than recall | 2 | Copy / Favorite / Ignore / Clear are icon-first. Ignore sits apart at top-right. Micro/Longevity filters assume you already know S/E, A/E, % DV. |
| 7 | Flexibility and efficiency | 3 | Shortcuts (E/M/W/R/L…), Favorites, Copy, multi-select Add food. Missing: undo, “create this food” from Add food, minus steps on servings. |
| 8 | Aesthetic and minimalist design | 2 | One scroll holds dashboard, seven days, and the food table. Density fits a diary; competing primary surfaces do not. |
| 9 | Error recovery | 2 | Unmatched carousel and Find lost meals are strong. Native alerts are vague; work is not restorable after Clear. |
| 10 | Help and documentation | 2 | Starter guide + explain modals exist. Hint copy is long. No way back to help after “Got it”. |
| **Total** | | **23/40** | **Acceptable — significant UX work before the primary jobs feel easy** |

### Anti-patterns (AI slop)

**Pass.** Warm-neutral canvas, blue today / teal favorite, no glow, no purple gradients, no hero-metric chrome. Risk is **tool clutter**, not template aesthetics.

### Cognitive load checklist

Failed items: **6 / 8** (high).

| Item | Result |
|------|--------|
| Single focus | Fail — macros dashboard, week grid, and food table share one page |
| Chunking (≤4 per group) | Fail — Copy menu (6), meals toolbar (5), day icon cluster + Ignore |
| Grouping | Pass — header / nav / dashboard / days / definitions are framed |
| Visual hierarchy | Fail — seven macro cards sit above the logging grid |
| One thing at a time | Fail — Add food mixes search, multi-select, and per-food servings |
| Minimal choices | Fail — app nav is 7 destinations |
| Working memory | Fail — filters/view state live in Micro/Longevity while you edit days far down the page |
| Progressive disclosure | Pass — Advanced, Micro, Longevity, and starter guide stay closed until asked |

### What’s working

- **Basic vs Advanced** — default guided Add food keeps matching reliable; Advanced stays a power path.
- **Today / favorite / ignored** — blue underline, teal favorite, beige ignored are distinct once you know them.
- **Unmatched + Find lost meals** — recovery exists for the two scariest data failures (typo lines, “where did my week go”).

### Biggest opportunity

**Make logging the first confident action, and never let work disappear without saying so.** Dashboard-first layout + silent logged-out saves are the two things that most hurt the stated jobs.

---

## TODO

Checkboxes are work remaining. Do not treat this list as a commitment to ship everything; pick a slice after the questions at the bottom.

### P0 — Blocking

- [x] **Logged-out work is discarded with no warning**
  - Where: `NutrientsPersist` no-op saves; header only shows Log in / Sign up.
  - Why: User can fill Mon–Sun, refresh, and lose the week. Feels broken, not “please sign up.”
  - Fix: Persistent banner while logged out (“Edits won’t be saved”). Block or confirm before Add food / Clear / Import. Optional guest diary later.
  - Skill: `/harden` + `/clarify`

- [x] **Empty library: Add food is a native alert dead-end**
  - Where: `openAddFoodModal` → `window.alert("No food definitions yet…")`.
  - Why: Primary logging control refuses the job and dumps the user out of the day column. Definitions live at the bottom of the page.
  - Fix: In-modal empty state with **Import sample** and **Add food definition**. Do not use `window.alert`.
  - Skill: `/onboard` + `/clarify`

### P1 — Major

- [x] **Dashboard sits above Food Entry on the same page**
  - Where: `index.html` order: header → `#app-nav` → `.dashboard` → week nav → `.week__grid` → `.keywords`.
  - Why: Job #1 is log meals. First paint is seven macro cards (often empty). Entry is a scroll or shortcut **E**.
  - Fix: Default viewport/anchor on Food Entry after login; keep Macros as a jump (**M**). Or collapse dashboard to a one-line strip until meals exist.
  - Skill: `/arrange` + `/distill`

- [x] **No undo after Clear / Clear all / replace import**
  - Where: `confirmClearDay`, `clearAllDayNotes`, import-replace confirms (`This cannot be undone.`).
  - Why: Confirm dialogs are easy to accept. Find lost meals does not cover “I cleared today.”
  - Fix: Keep one snapshot (per day / viewed week) and an **Undo** toast for ~15s. Keep the confirm for Clear all / replace.
  - Skill: `/harden`

- [x] **Day actions are icon-only until hover/focus (weak on touch)**
  - Where: `.day__ignore`, `.day__copy-toggle`, `.day__favorite`, `.day__clear` — 1.45rem (~23px) hit targets; labels `max-width: 0` until hover.
  - Why: Ignore vs Clear vs Copy are easy to mix up. Touch has no hover; 23px is under 24px AA / 44px recommended.
  - Fix: 44×44px tap area (padding ok). On coarse pointer, show labels or a compact overflow menu. Keep Ignore top-right but always show **Ignored** when pressed (already does).
  - Skill: `/adapt` + `/clarify`

- [x] **Copy menu copy is unreadable**
  - Where: “Copy this week to this week” plus custom / today / yesterday / tomorrow.
  - Why: Six similar sentences. The first item sounds like a no-op.
  - Fix: Group **This day** vs **This week**. Rename first item to what it actually does (e.g. “Replace this week with another week’s meals…” / conflict modal title as the label).
  - Skill: `/clarify`

- [x] **Cannot add a missing food from Add food**
  - Where: `#add-food-modal` search; empty = “No matching foods. Add a definition under Food definitions…”
  - Why: Logging stops. Curator job is a long-scroll context switch. Multi-select makes this more common (one unknown name among known ones).
  - Fix: Row action **Create “{query}”** that opens the definition form and returns to the same day/modal with it pre-selected.
  - Skill: `/onboard`

- [x] **Micro / Longevity chrome vs the diary**
  - Where: `#dashboard-micro-sticky`, `#dashboard-longevity-nav` (View, Daily Targets, Filter, Highlight, S/E, A/E, By nutrient, Run Analysis, condition/status).
  - Why: Correct for a longevity ICP **after** meals exist. Overwhelming on first open; status color is easy to treat as the only signal.
  - Fix: First-open preset (“Show gaps only”). Keep advanced filters behind one control. Don’t rely on red/green alone (text % + icon already exist — make the text the primary).
  - Skill: `/distill` + `/onboard`

- [x] **Hover-to-widen day columns while scanning the week**
  - Where: `.week__grid` `pointerover` → `focusWeekDayColumn`.
  - Why: Moving the pointer across Mon–Sun constantly reflows seven columns. Smooth easing still feels like the page is fighting the mouse. Accidental widen when aiming at Ignore / Copy.
  - Fix: Widen on **focus inside the day** or a short hover-intent delay (~250ms). Don’t widen from crossing the header icons.
  - Skill: `/animate` (intent) + `/harden`

### P2 — Minor

- [x] **Add food: servings stepper vs +.5 / +.33 / +.25**
  - Where: per-selected-item number input + nudge buttons.
  - Why: Native spinner + ArrowUp/Down now move by 1 (good). Fraction buttons only increment. Repeating the whole servings block on every selected food is noisy.
  - Fix: Add −.5 / −.33 / −.25 (or a shared stepper that applies to the focused chip). Collapse servings UI when only one food is selected if the extra chrome feels heavy.
  - Skill: `/clarify`

- [x] **Add food: click selected result toggles it off**
  - Where: `selectAddFoodName` toggle.
  - Why: Multi-select lists that uncheck on second click conflict with “I was scanning the list.” × already removes.
  - Fix: Click on a selected result = no-op (or scroll to that chip). Only × removes.
  - Skill: `/harden`

- [x] **Destructive / empty-library dialogs are `window.alert` / `window.confirm`**
  - Where: import sample, delete definition, remove line, Add food empty library, etc.
  - Why: Browser chrome, no styling, easy to miss which day they refer to.
  - Fix: Same modal pattern as copy-conflict / favorite-edit.
  - Skill: `/normalize`

- [x] **Autosave is invisible**
  - Where: `saveDayMealsState` on input; hint “Day meals are saved in this browser.”
  - Why: No last-saved time. Users double-export “just in case.” Logged-in vs logged-out is the same UI.
  - Fix: Quiet “Saved” / “Not saved — log in” next to week range.
  - Skill: `/clarify`

- [x] **Meals toolbar packs five bulk actions**
  - Where: Export all / Import all / Import sample / Find lost meals / Clear all days.
  - Why: Clear all sits beside Import sample. Find lost meals is recovery, not a peer of Export.
  - Fix: Primary: Import sample (empty week) or none. Overflow **More** for export/import/find/clear.
  - Skill: `/distill`

- [x] **Food definitions table is below the fold of a long page**
  - Where: `.keywords` after `.week__days`.
  - Why: Starter guide must scroll the table into view. Adding a food while logging is a round trip.
  - Fix: Keep jump **D**. Consider a compact “library” drawer from Add food rather than another full-page section.
  - Skill: `/arrange`

- [x] **Settings sex control is ♂/M in the header**
  - Where: `#settings-open`.
  - Why: Easy to miss that iron DV and Female/Male Hormones depend on this. Icon+abbr without “sex” in the visible label.
  - Fix: Keep Settings; show “Female · 62 kg” (or similar) as status, not only an icon.
  - Skill: `/clarify`

- [x] **Shortcut glyphs on nav (S D E M W R L) compete with labels**
  - Where: `.app-nav__shortcut`; full hints on modifier hold (`app-nav-shortcuts-visible`).
  - Why: Power-user gold; first-timer noise. Bottom nav on ≤720px is already cramped.
  - Fix: Show letter badges only while a modifier is held (already the expanded mode) — hide idle letters on the main nav.
  - Skill: `/quieter`

- [x] **Servings on the day list appear only on hover / `--active`**
  - Where: `.day__food-item-servings-input` `pointer-events: none` until hover.
  - Why: Scan of `* 2` vs `* 1` is hidden. Touch users must tap the row first.
  - Fix: Always show the number; reveal Edit / Remove on hover or tap as now.
  - Skill: `/adapt`

- [x] **Starter guide is one-shot and not in Help**
  - Where: `#starter-guide`; dismiss on meals step never returns.
  - Why: After “Got it”, Import sample / Add food relationship is gone.
  - Fix: Settings or header **Help** that re-runs the two steps.
  - Skill: `/onboard`

### P3 — Polish

- [x] Document title is **Week meals** — does not mention nutrients / longevity (`<title>`).
- [x] Week hint still says “multiple lines per day” while Basic is a list — Advanced-centric leftover (`h1` + `.week__hint`).
- [x] Favorite **week** (above grid) vs Favorite **day** (icon) vs Favorites **sidebar** — three entry points, same word.
- [x] Add food submit stays “Add to day” for N foods — optional “(3)”.
- [x] Ignore’s slashed-circle vs Clear’s trash is better than before; still no legend for first use.
- [x] Print hides Copy/Favorite/Clear/Ignore (good) but also unmatched/notes — confirm print still shows ignored-day state.
- [x] `aria-hidden="true"` on visible nav labels relies on `aria-label` — fine if labels stay in sync when copy changes.
- [x] Long food names in Add food selected chips wrap under × — check 320px width.

---

## Persona red flags

**Alex (power user)** — Shortcuts and Favorites are real. Frustration: no undo after Clear; Copy menu is six slow reads; cannot spawn a definition without leaving Add food; hover-widen fights fast mouse travel across days.

**Jordan (first-timer)** — Starter guide helps only if the library is empty. Then: dashboard of zeros, Add food alert if they skipped import, icon-only Ignore/Clear, “Sign up” that is local-only (modal hint is easy to skip). Will not discover **E** or **D**.

**Casey (phone, ≤520px)** — Day carousel + bottom nav are the right idea. Failures: ~23px day icons, hover-only labels and servings, Micro sticky filters become a sub-carousel, Add food modal with multi-select + three nudge buttons per food is a lot of vertical chrome. Thumb zone: Add food is good; Ignore is top-right of the column.

**Longevity eater (from Design Context)** — Will live in Longevity after a filled week. Failures: getting a representative week logged (P0/P1 above) before any bar is trustworthy; opening Longevity on an empty week with no “log meals first” empty state.

**Recomp tracker (from Design Context)** — Week total vs TDEE is the payoff. Failures: TDEE lives in Settings with weak status in the header; Week total is another panel under the same dashboard stack.

---

## Suggested command order (after you pick a slice)

Only run what matches the chosen scope.

1. `/harden` — logged-out save warning; undo snapshot for Clear; Add food click-to-deselect
2. `/onboard` — Add food empty state + create-definition return path; Micro/Longevity first-open “gaps only”
3. `/arrange` — Food Entry as the default landing surface
4. `/clarify` — Copy menu labels; save status; Settings sex/weight readout
5. `/adapt` — 44px day actions; always-visible servings; coarse-pointer labels
6. `/distill` — meals toolbar; Micro sticky chrome
7. `/quieter` — idle shortcut badges
8. `/polish` — leftover title/hint/Favorite wording

---

## Questions before implementation

1. **Which slice first?**
   - A. Trust (logged-out banner, undo, no `alert` dead-ends)
   - B. Logging path (page order, Add food → create definition, copy labels)
   - C. Touch/day chrome (hit targets, hover-widen, servings always visible)
   - D. Micro/Longevity first-open (gaps-only, quieter filters)

2. **Keep dashboard above the week grid?** It matches “scan the week then log,” but fights “log first.” Options: keep order / land on Entry / collapse macros until there is food.

3. **Scope?** Top 3 P0+P1 only · all P0–P1 · include P2.

4. **Off-limits?** e.g. leave Micro/Longevity filter density, shortcuts, or one-page layout as-is.
