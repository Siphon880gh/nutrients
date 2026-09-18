#!/usr/bin/env node
/**
 * Static verification for Rearrange footer / Duplicate / popover-exit / cross-column move.
 * Exit 0 = pass, 1 = fail.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
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

const appJs = read("app.js");
const stylesCss = read("styles.css");

mustInclude(appJs, "syncDayGuidedFooterPrimaryAction", "footer sync helper");
mustInclude(appJs, "duplicate-guided-selected", "Duplicate action");
mustInclude(appJs, "duplicateGuidedSelectedLines", "Duplicate helper");
mustInclude(
  appJs,
  "setDayTextareaLines(textarea, next);\n    setGuidedRearrangeEnabled(dayId, false);",
  "Duplicate exits Rearrange"
);
mustInclude(appJs, "scrollDayGuidedItemsIntoView", "Duplicate scrolls new food into view");
mustInclude(appJs, "moveGuidedEntriesToDay", "cross-column move helper");
mustInclude(appJs, "guidedElFromEventTarget", "drop host helper");
mustInclude(appJs, "dropDayId", "drag state drop day");
mustInclude(
  appJs,
  "Select foods to duplicate, or turn off Rearrange to add food",
  "disabled Add food title"
);
mustInclude(appJs, "if (dayId && isGuidedRearrangeEnabled(dayId)) return;", "block Add food while rearranging");
mustInclude(appJs, "setGuidedRearrangeEnabled(dayId, false);", "popover exits rearrange");
mustInclude(appJs, "dayFoodItemPopoverBlockedTarget", "popover allows drag-handle target");
mustInclude(stylesCss, "day__duplicate-food", "Duplicate button style");
mustInclude(stylesCss, ".day__add-food:disabled", "grayed Add food");
mustInclude(stylesCss, ".day__add-food[hidden]", "Add food hidden when Duplicate shows");
mustInclude(stylesCss, "day__guided--drop-target", "cross-column drop target");

if (failures.length) {
  console.error(
    "Guided rearrange verification FAILED:\n" +
      failures.map((f) => "  • " + f).join("\n")
  );
  process.exit(1);
}

console.log("Guided rearrange verification passed.");
process.exit(0);
