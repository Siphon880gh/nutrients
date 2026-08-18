#!/usr/bin/env node
/**
 * Static verification for TODO-UX loop items.
 * Exit 0 = pass, 1 = fail.
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");
const failures = [];

function read(name) {
  return readFileSync(join(root, name), "utf8");
}

function fail(msg) {
  failures.push(msg);
}

function mustInclude(haystack, needle, label) {
  if (!haystack.includes(needle)) fail(`${label}: missing "${needle}"`);
}

function mustNotMatch(haystack, re, label) {
  if (re.test(haystack)) fail(`${label}: matched ${re}`);
}

const indexHtml = read("index.html");
const appJs = read("app.js");
const stylesCss = read("styles.css");
const todoUx = read("TODO-UX.md");

// P0 — logged-out banner
mustInclude(indexHtml, 'id="logged-out-banner"', "P0 logged-out banner");
mustInclude(appJs, "syncLoggedOutBanner", "P0 syncLoggedOutBanner");
mustInclude(appJs, "requireLoggedInForPersist", "P0 persist guard");

// P0 — empty library in-modal (no alert dead-end)
mustInclude(indexHtml, 'id="add-food-empty-library"', "P0 add-food empty library");
mustNotMatch(
  appJs,
  /function openAddFoodModal[\s\S]{0,400}window\.alert/,
  "P0 openAddFoodModal alert"
);

// P1 — food entry landing
mustInclude(appJs, "maybeScrollToFoodEntryOnBoot", "P1 boot scroll to entry");

// P1 — undo toast
mustInclude(indexHtml, 'id="undo-toast"', "P1 undo toast");
mustInclude(appJs, "captureUndoSnapshot", "P1 undo snapshot");
mustInclude(appJs, "showUndoToast", "P1 showUndoToast");

// P1 — copy menu clarity
mustInclude(appJs, "initCopyMenuLabels", "P1 copy menu labels");
mustInclude(appJs, "This day", "P1 copy menu This day group");

// P1 — create food from Add food
mustInclude(appJs, "create-food-from-search", "P1 create food action");

// P1 — hover-widen intent delay
mustInclude(appJs, "weekGridHoverTimer", "P1 hover intent timer");

// P1 — micro first-open preset
mustInclude(appJs, "maybeApplyMicroFirstOpenPreset", "P1 micro first-open");

// P2 — app confirm modal (replacing native confirms in key paths)
mustInclude(indexHtml, 'id="app-confirm-modal"', "P2 app confirm modal");
mustInclude(appJs, "showAppConfirm", "P2 showAppConfirm");

// P2 — save status
mustInclude(indexHtml, 'id="week-save-status"', "P2 week save status");
mustInclude(appJs, "syncWeekSaveStatus", "P2 syncWeekSaveStatus");

// P2 — meals toolbar More
mustInclude(indexHtml, 'id="week-meals-more-toggle"', "P2 meals More menu");

// P2 — settings demographic status
mustInclude(indexHtml, 'id="settings-demographic-status"', "P2 settings status");
mustInclude(appJs, "settingsDemographicStatusEl", "P2 settings status JS");

// P2 — help / starter guide
mustInclude(indexHtml, 'id="help-open"', "P2 help button");

// P2 — always-visible servings
mustInclude(stylesCss, "day__food-item-servings-input--visible", "P2 servings visible class");

// P2 — selectAddFood no deselect on click
mustInclude(
  appJs,
  "Only remove via",
  "P2 add-food selected click no-op comment or logic"
);

// P3 — title + hint
mustInclude(indexHtml, "Nutrients — Week meals", "P3 document title");
mustNotMatch(
  indexHtml,
  /multiple lines per day/,
  "P3 outdated week hint"
);

// P3 — add food submit count
mustInclude(appJs, "syncAddFoodSubmitLabel", "P3 add food submit label");

// Touch — 44px day actions
mustInclude(stylesCss, "min-width: 2.75rem", "P1/P2 44px day actions");

// Shortcut badges hidden until modifier (already in CSS)
mustInclude(stylesCss, ".app-nav__shortcut", "P2 shortcut badges");
mustInclude(stylesCss, "display: none !important", "P2 shortcuts hidden idle");

if (strict) {
  mustInclude(appJs, "longevityEmptyWeekHint", "P1 longevity empty week");
}

const unchecked = (todoUx.match(/^- \[ \]/gm) || []).length;
const checked = (todoUx.match(/^- \[x\]/gm) || []).length;
console.log(`TODO-UX: ${checked} done, ${unchecked} remaining`);

if (failures.length) {
  console.error("UX loop verification FAILED:\n" + failures.map((f) => "  • " + f).join("\n"));
  process.exit(1);
}

console.log("UX loop verification passed.");
process.exit(0);
