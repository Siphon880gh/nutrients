# Nutrients — ICPs, jobs & user flows

Derived from what the app actually ships: week meal diary × food definitions → macros, Micro Requirements (condition focus, % targets), and Longevity topic sections — plus TDEE/macros, Favorites, and AI prompt helpers. Client-only; persistence needs login.

| Signal | Value |
|--------|-------|
| Primary ICPs | 5 |
| Jobs per ICP | 4+ |
| Longevity topics | ~30 |
| Condition focuses | 8 |
| Storage | Local multi-user |

**Product thesis:** This is not a casual calorie logger. Ideal customers already care about nutrient quality and systems health, and will maintain a personal food library so day-meal lines can score against FDA/IOM/study and longevity references.

---

## Food entry modes (Basic vs Advanced)

Day meals persist as newline text either way. The UI has two modes, controlled by the **Advanced** toggle (`#day-entry-advanced-toggle`). Preference is stored as `dayEntryAdvanced` (default `false` = Basic).

### Basic (default) — guided list

Body class: `day-entry-guided`.

MyFitnessPal-style list per day (`.day__guided`):

1. **Add food** — opens `#add-food-modal`: search or A–Z browse food definitions, pick servings, **Add to day**.
2. **Add Others** — insert `//` / `#` comments or `---` dividers without free-text typing.
3. **Rearrange** — drag handles to reorder lines; remove confirms before delete.
4. Servings / multipliers are set in the modal (and editable on the line), not by typing `* N` in a blank textarea.

Starter guide (after sample foods) points people at **Add food** and mentions Advanced only as an alternative.

### Advanced — free-text editors

Body class: `day-entry-advanced`.

1. Turn on **Advanced** in the week toolbar.
2. Day editors become textareas; food-name suggestion popover appears while typing (prefix / fuzzy / multi-word).
3. Type food names ± `* N` multipliers; `//` or `#` comments; `---` dividers.
4. Highlight / word-wrap toggles (`.week__advanced-only`) appear only in this mode.
5. Unmatched lines still surface in the unmatched carousel when a typed name does not resolve.

### When flows say “log meals”

Unless a flow explicitly needs free-text (bulk paste, custom comment layout, power typing), assume **Basic**: **Add food** from definitions. Switch to **Advanced** only when the flow says so, or when the user prefers typing.

---

## Shared foundation flow (all ICPs)

Every job below assumes this spine. Longevity / condition / hormone ICPs diverge after step 5; recomp leans on Week total earlier; curator invests more in step 2.

1. Create account (Sign up) — logged-out edits are not persisted
2. Import or build food definitions so day lines can match
3. Set Settings: sex, weight, optional TDEE / body type / goal
4. Log Mon–Sun meals for a calendar week — **Basic:** **Add food** (+ **Add Others** / **Rearrange** as needed); **Advanced:** free-text with multipliers, comments, dividers
5. Read Dashboard macros → open Micro Requirements and/or Longevity for the job
6. Use My food sources, filters, Favorites, and AI prompt panels to close the loop

---

## 1. Longevity Optimizer

**Short:** Healthy aging & systems health

### Who

Adults (often 35–65+) who already eat with intention and want food to support long-term systems health—brain, vessels, mitochondria, liver/kidney—not just calories.

### Core motivation

See whether this week’s real meals cover longevity-relevant nutrients, spot chronic gaps, and decide what to eat more of before problems show up.

### Success looks like

Can open Longevity, jump to a topic (e.g. Brain or Vascular), see % of reference with ranked food sources, then change next week’s meals and re-check.

### Pains

- Generic trackers stop at macros / a few vitamins
- Hard to connect meals to organ-system topics (brain, vascular, thyroid)
- Weekly averages hide day-to-day gaps for poorly stored nutrients
- Doesn’t know which foods in their pantry actually move the needle

### App capabilities they lean on

- Longevity panel + All topics nav + deep-link hashes
- Condition focus: Anti-aging & longevity
- Run Analysis / Ask AI: health timeline
- Sticky Highlight / Filter + By Nutrients
- Ranked My food source modals
- Day entry: Basic **Add food** (default) or Advanced free-text

### Jobs to be done

- Audit this week against longevity topics I care about
- Find which logged foods drive (or starve) a nutrient
- Project what happens if I keep eating like this
- Close gaps without abandoning foods I already like

### User stories

- As **a longevity-minded eater**, I want to open Longevity → Staying sharp & lowering dementia risk after logging the week, so that I know if EPA/DHA and related brain nutrients are short before I shop.
- As **someone watching blood pressure**, I want to compare sodium against FDA / WHO / AHA ceilings in Vascular - Blood Pressure, so that I can decide whether to cut salty foods this week.
- As **a planner who thinks in weeks**, I want to Ask AI: health timeline from my weekly intake pattern, so that I get a narrative of risks if nothing changes.
- As **someone who already has a food list**, I want to open My food on a red longevity row and see ranked contributions, so that I know whether to eat more of an existing food or add a new definition.

### User flows

#### Audit longevity topics for the current week

1. Sign up / Log in (persistence requires a session)
2. Settings → set sex + body weight (IOM / some targets need weight)
3. Import sample foods (or load your own definitions)
4. Enter Mon–Sun meals — **Basic:** per day **Add food** (search definitions, set servings); use **Add Others** for comments/dividers; raise servings or re-add with a higher amount as needed. Or **Import sample meals**. (**Advanced** optional for free-text + `* N`)
5. Dashboard → Longevity (shortcut L)
6. All topics → pick a section (Brain, Vascular, Mitochondrial, etc.)
7. Scan % bars vs 100% notch; filter By nutrient or status if noisy
8. Click My food on a shortfall row → ranked sources → plan next meals

#### Project long-term impact of this eating pattern

1. Complete a representative week of day meals (Basic **Add food** unless you prefer Advanced)
2. Open Micro Requirements or Longevity
3. Ask AI: health timeline → copy / open ChatGPT or Claude
4. Optionally Run Analysis for structured gap review
5. Favorite a good week/day for reuse when rebuilding meals

#### Close a specific longevity gap using foods I already track

1. Longevity → section with the red/low row
2. My food sources modal → note top contributors already in library
3. Edit that day — **Basic:** **Add food** for the contributor (or bump servings on an existing line); **Advanced:** add a food line or raise `* N`
4. Re-check bar; if unmatched lines appear (Advanced typing, or a missing definition), fix name or add definition
5. Micro gaps AI (reeat foods) if you prefer LLM meal suggestions from your library

---

## 2. Body Recomp Tracker

**Short:** Calories, macros, cut / bulk

### Who

People actively cutting, bulking, or recomposing who want week-level calorie and macro truth plus enough micro coverage that the diet doesn’t fall apart.

### Core motivation

Hit a planned deficit or surplus and a body-type-aware macro split while still seeing whether micros are collapsing under the cut.

### Success looks like

Week summary shows intake vs TDEE×7, macro split matches Settings goal, and Micro Requirements stays mostly green on key nutrients.

### Pains

- Apps show daily calories but weak week average vs TDEE
- Macro advice ignores body type / goal context
- Cutting quietly wrecks micronutrient coverage
- Hard to reuse a good training-week meal pattern

### App capabilities they lean on

- Settings: TDEE calculator, body type, goal, weight
- Week total toggle → deficit/surplus + macro split
- Per-day macro cards + macro % toggle
- Diary Favorites for repeatable weeks/days
- Daily Targets on micros during a cut
- Day entry: Basic guided list for fast logging from the library; Advanced for paste / power edit

### Jobs to be done

- Set maintenance calories and a cut/bulk target
- Log training weeks and see week avg vs TDEE
- Steer protein/carb/fat share toward a body-type goal
- Reuse a favorite high-protein week while adjusting volume

### User stories

- As **someone cutting fat**, I want to set TDEE in Settings and open Week total, so that I can see weekly deficit without spreadsheet math.
- As **a lifter picking macros**, I want to choose body type + goal and read Macro split & body type guidance, so that my P/C/F targets match how I train.
- As **someone on a repeatable meal plan**, I want to Favorite a day/week and jump back from the Favorites sidebar, so that I can clone a week that already hit protein.
- As **a cutter worried about micros**, I want to filter Micro Requirements by American Common Deficiencies + red/zero status, so that I catch D, Mg, Ca gaps while calories stay low.

### User flows

#### Configure calorie and macro targets

1. Log in → Settings
2. Open TDEE calculator (Mifflin–St Jeor) or enter known TDEE
3. Set sex, weight, body type, and goal (lose / gain / recomp / endurance)
4. Save — dashboard macro-need guidance uses this split vs calorie budget

#### Log a training week and judge cut/bulk progress

1. Week nav → current week (This week)
2. Log foods per day — **Basic:** **Add food** from definitions and set servings; **Rearrange** if meal order matters. **Advanced:** type foods; use `* N` for servings; `//` comments if needed
3. Watch per-day P/C/F + calories on dashboard cards
4. Toggle Week total → week total, day average, TDEE deficit/surplus
5. Open Macro split explain if share is off goal
6. Adjust next days’ meals; Favorite the week if it worked

#### Protect micros while in a deficit

1. Open Micro Requirements
2. Nutrition intake → American Common Deficiencies (or Poorly absorbed / take daily)
3. Status filter → red or zero
4. My food on shortfalls → **Add food** (Basic) or edit Advanced lines for dense foods without blowing calories
5. Optional: Ask AI micro gaps with preference for low-calorie options

---

## 3. Condition Investigator

**Short:** Symptom- or condition-led nutrients

### Who

People managing a named concern (ADHD, anemia, hair loss, gut changes, heavy coffee/tea use, eye health) who want food intake filtered to the nutrients that matter for that focus—not a wall of every micro.

### Core motivation

Answer: given what I ate this week, am I covering the nutrients linked to my condition focus, and which foods would help?

### Success looks like

Condition filter shows a focused list; red/zero items have clear food sources; meals are adjusted and the same filter turns greener next week.

### Pains

- Full nutrient lists are overwhelming when only a subset matters
- Doesn’t know which micros are condition-relevant
- Needs day-level view for poorly absorbed / daily-intake nutrients
- Wants AI help that starts from foods they already eat

### App capabilities they lean on

- Conditions dropdown (ADHD, Anemia, Hair loss, Bowel, Cataracts, Coffee/tea…)
- Nutrition intake filters (common deficiencies, B vitamins, fat-soluble, daily intake)
- Weekly vs Each-day micro view + Daily Targets
- Sticky daily-intake / acute excess icons
- Micro gaps AI (any foods / re-eat library foods)
- Day entry Basic/Advanced (same diary both modes write)

### Jobs to be done

- Focus micros on one condition
- See whether shortfalls are weekly averages or missing on individual days
- Find foods (existing or new) that cover the gap
- Ask AI for meal ideas constrained to my food library

### User stories

- As **someone with hair-loss concerns**, I want to set Condition → Hair loss and scan iron, zinc, biotin, D, etc., so that I only act on the nutrients tied to that focus.
- As **a heavy coffee drinker**, I want to use Chronic coffee / tea / energy drink user focus, so that I watch minerals that caffeine timing can interfere with.
- As **someone fixing anemia-related intake**, I want to switch to Each-day view for iron-related nutrients, so that I see if one strong day is masking empty days.
- As **a planner who prefers familiar foods**, I want to open Micro gaps AI → re-eat panel with my library selected, so that suggestions reuse foods I already defined.

### User flows

#### Investigate one condition against this week’s meals

1. Log representative Mon–Sun meals — **Basic:** **Add food** so every line is a known definition; **Advanced** only if you need free-text (then clear unmatched)
2. Dashboard → Micro Requirements
3. Conditions → pick focus (e.g. Anemia, ADHD, Hair loss)
4. Optional Status → red or zero to shrink the list
5. Read explain modal Focus: section for context on a nutrient
6. My food → ranked sources → edit that day via **Add food** / servings (Basic) or textarea (Advanced)
7. Clear condition filter when done comparing to full list

#### Catch poorly stored nutrients that need daily coverage

1. Nutrition intake → Poorly absorbed / take daily
2. Enable Poor storage / daily intake icons (Highlight or Filter)
3. Switch to Each-day view + Daily Targets
4. Fix empty weekdays with **Add food** on those days; don’t rely only on weekly average

#### Get AI meal ideas from my own foods

1. Ask AI: micro gaps
2. Choose re-eat vs any-foods panel; set preference / weeks lookback
3. Select library foods to include
4. Copy prompt → ChatGPT/Claude → bring ideas back as day-meal lines (**Basic:** **Add food** for each suggestion that exists in the library; **Advanced:** paste/type lines; add missing foods via Food definitions first)
5. Add any new foods via Food definitions Import / AI import if needed

---

## 4. Hormone & Life-Stage Manager

**Short:** Sex-specific longevity sections

### Who

Adults whose nutrition questions are tied to menstrual cycle, iron loss, estrogen metabolism, post-menopause, testosterone support, prostate health, or male estrogen/belly-fat balance.

### Core motivation

Use the sex set in Settings so Longevity shows the matching hormone topic set, then adjust meals around that life stage—not a unisex generic checklist.

### Pains

- Most trackers ignore cycle / menopause / prostate nutrition frames
- Iron and related micros need sex-aware % DV
- Hormone topics are scattered across articles, not tied to logged food
- Wants one place to review hormones alongside vascular / bone / sleep

### Success looks like

Demographic sex flips the correct Female or Male Hormones nav; relevant micros (e.g. iron for menstruation) are on target; related sections (Bone, Sleep, Stress) stay in the same Longevity workflow.

### App capabilities they lean on

- Settings demographic: female / male (DV + hormone nav)
- Female Hormones: PMS, Iron & menstruation, Estrogen, Post-menopause
- Male Hormones: Testosterone, Prostate, Estrogen balance (belly fat)
- Linked longevity: Bone density, Sleep, Stress resilience, Visceral fat
- FDA % DV differences by sex (e.g. iron)
- Day entry Basic/Advanced

### Jobs to be done

- Set demographic so targets and hormone topics match me
- Review the hormone section for my life stage
- Connect hormone goals to iron / bone / body-fat sections
- Adjust weekly meals and re-score

### User stories

- As **someone tracking heavy periods**, I want Settings → female, then Longevity → Female Hormones - Iron & menstruation, so that iron % DV and related nutrients reflect my sex and concern.
- As **someone post-menopause**, I want to open Female Hormones - Post-menopause plus Bone density, so that I can align meals with that life stage in one session.
- As **a man focused on testosterone support**, I want to use Male Hormones - Testosterone support after logging the week, so that I see which micros/compounds from food are low.
- As **someone reducing belly fat with hormone context**, I want to combine Male Hormones - Estrogen balance with Visceral fat, so that calorie strategy and nutrient strategy sit side by side.

### User flows

#### Align the app to sex and open the right hormone topics

1. Settings → set Female or Male (+ weight for IOM amino acids etc.)
2. Log week meals — **Basic:** **Add food** per day; **Advanced** if preferred
3. Longevity → All topics → Female or Male Hormones subsections
4. Scan bars; open explain tips on section headings
5. Jump to related topics (Bone, Sleep, Visceral fat) via All topics

#### Fix iron/menstruation coverage across the week

1. Confirm demographic female (iron DV)
2. Micro Requirements → Anemia or By nutrient chips for iron/B12/folate
3. Each-day view to avoid one iron-rich day masking empties
4. **Add food** (Basic) or Advanced lines for iron-containing foods / higher servings; watch acute excess icons if stacking
5. Re-open Female Hormones - Iron & menstruation to confirm

#### Life-stage check (menopause / prostate / belly fat)

1. Open the matching hormone subsection
2. Note limiting vs aim nutrients (e.g. watch rows)
3. My food on weak rows → edit definitions if a staple is missing micros; then **Add food** that staple on thin days
4. Favorite a day that hit the pattern for the next cycle/week

---

## 5. Food Library Curator

**Short:** Definitions, imports, multi-user data

### Who

Power users (sometimes the same person as another ICP) who treat the food table as a personal nutrient database—custom meals, multivitamins, AI-assisted imports—and may keep separate accounts for household members.

### Core motivation

Make matching reliable so dashboards tell the truth: every line in day meals resolves to a rich definition with macros, micros, and longevity fields.

### Pains

- Unmatched lines break totals silently until noticed
- Building micros/longevity by hand is tedious
- Needs bulk import / export and sample bootstrap
- Household members need separate persisted libraries

### Success looks like

Food table is searchable/categorized; **Add food** search hits; Advanced autocomplete hits; unmatched carousel stays empty; each user account has its own definitions and diary.

### App capabilities they lean on

- Food definitions CRUD, micros/longevity modals, categories
- Import sample / single / bulk JSON + AI import prompts
- Unmatched lines carousel + Advanced food-name suggest
- Basic guided **Add food** modal (definitions-only pick)
- Guides: adding food, improving food, multivitamin
- Sign up / Log in / Log out per-user localStorage tables

### Jobs to be done

- Bootstrap a usable food library
- Add or improve a food (including multivitamins)
- Clear unmatched day-meal lines
- Keep separate profiles for different people

### User stories

- As **a new user**, I want to follow the starter guide and Import sample foods + meals, so that I can see dashboards work before building my own library.
- As **someone who eats a brand multivitamin**, I want to add it via the multivitamin guide pattern in Food definitions, so that daily supplement lines count toward micros.
- As **a meticulous logger**, I want to walk the unmatched carousel and fix names or add rows, so that week totals aren’t missing foods.
- As **a household sharing one browser**, I want to Sign up separate users and Log out between people, so that each person’s meals and foods stay scoped by userId.

### User flows

#### First-run: get sample data working

1. Sign up
2. Starter guide / empty state → Import sample foods
3. Day meals → Import sample (or **Add food** on each day after samples land)
4. Confirm dashboard macros + optional Micro / Longevity populate
5. Dismiss starter guide when ready to replace samples
6. Stay on **Basic** unless you want free-text; Advanced is optional

#### Add a real food I eat

1. Food definitions → Add (or Import JSON / AI import prompt)
2. Enter macros; open Micros modal; open Longevity modal
3. Save; search/filter table to confirm category
4. In a day — **Basic:** **Add food** → search the new name → set servings → **Add to day**. **Advanced:** type the name (autocomplete) ± `* N`
5. If unmatched carousel lists it (usually Advanced typos or rename drift), fix spelling or definition name

#### Maintain library quality over time

1. Export foods JSON as backup
2. Improve sparse micros (GUIDE_IMPROVING_FOOD / QA skill workflows)
3. Categorize uncategorized names via category map
4. Clear or replace a week; Favorite gold-standard days
5. Log out / Log in to switch household profiles

#### Exercise both entry modes against the library

1. With **Advanced** off, open a day → **Add food** → confirm search/browse only lists definitions; **Add Others** for comments/dividers; **Rearrange** to reorder
2. Turn **Advanced** on → type a partial name → accept a suggestion → add `* N` / comments as needed
3. Toggle back to Basic → guided list shows the same persisted lines
4. Walk unmatched carousel after deliberate misspellings in Advanced; fix until empty

---

## Capability → ICP map

| Capability in app | Primary ICP | Also serves |
|-------------------|-------------|-------------|
| Longevity All topics (brain, vascular, mito, liver…) | Longevity Optimizer | Hormone, Condition |
| TDEE + Week total deficit/surplus + body-type macros | Body Recomp Tracker | Longevity (energy balance) |
| Conditions / Nutrition intake filters | Condition Investigator | Longevity, Hormone |
| Female / Male Hormones nav (from Settings sex) | Hormone & Life-Stage | Longevity |
| Food definitions + unmatched carousel + AI import | Food Library Curator | All (prerequisite) |
| Day entry Basic (**Add food**) vs Advanced (free-text) | Food Library Curator / all loggers | All ICPs |
| Favorites sidebar / Favorite day\|week | Body Recomp Tracker | All repeat planners |
| Ask AI: health timeline / micro gaps / Run Analysis | Longevity Optimizer | Condition Investigator |
| Multi-user Sign up / Log in | Food Library Curator | Household of any ICP |

---

## ICP priority (product signal)

Depth of Longevity sections, condition focuses, ranked sources, and explain modals outweighs a pure calorie product. Treat **Longevity Optimizer** as the lead ICP, **Condition Investigator** and **Hormone & Life-Stage** as high-intent segments that reuse the same diary, and **Body Recomp Tracker** as the entry wedge for people who arrive for macros then graduate into micros. **Food Library Curator** is a necessary power role—without definitions, no ICP can finish their job. Day logging defaults to **Basic** guided **Add food** so matching stays reliable; **Advanced** free-text is the power path.

---

*Source: app surface area in README, index.html, and AGENTS_CODE_REFERENCE (micro condition focus, longevity nav, TDEE, persistence, guided vs advanced day entry). Not survey data.*
