#!/usr/bin/env node
/**
 * Zero-quantity food lines: * 0 in advanced text, 0 in basic servings.
 * Exit 0 = pass, 1 = fail.
 */
import { readFileSync } from "fs";
import vm from "vm";
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

function assert(cond, message) {
  if (!cond) fail(message);
}

function extractFunction(src, name) {
  const marker = "function " + name + "(";
  const start = src.indexOf(marker);
  if (start < 0) throw new Error("missing function " + name);
  let i = src.indexOf("{", start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error("unclosed function " + name);
}

function extractVarBlock(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  const end = src.indexOf(endMarker, start);
  if (start < 0 || end < 0) {
    throw new Error("missing block " + startMarker);
  }
  return src.slice(start, end);
}

const appJs = read("app.js");
const stylesCss = read("styles.css");

const servingCode = [
  extractVarBlock(appJs, "var SERVING_AMOUNT_RE_SRC", "function makeId("),
  extractFunction(appJs, "visibleDayLineText"),
  extractFunction(appJs, "formatDayFoodLine"),
  extractFunction(appJs, "dayMealLineServings"),
  extractFunction(appJs, "formatGuidedServingsValue"),
].join("\n");

const context = vm.createContext({});
vm.runInContext(servingCode, context);

const parseServingMultiplierAmount = context.parseServingMultiplierAmount;
const keywordServingMultiplier = context.keywordServingMultiplier;
const formatDayFoodLine = context.formatDayFoodLine;
const dayMealLineServings = context.dayMealLineServings;
const formatGuidedServingsValue = context.formatGuidedServingsValue;
const stripKeywordServingMultiplier = context.stripKeywordServingMultiplier;

assert(
  parseServingMultiplierAmount("0") === 0,
  "parseServingMultiplierAmount('0') is 0"
);
assert(
  parseServingMultiplierAmount("0.0") === 0,
  "parseServingMultiplierAmount('0.0') is 0"
);
assert(
  parseServingMultiplierAmount("2") === 2,
  "parseServingMultiplierAmount('2') stays 2"
);
assert(
  Number.isNaN(parseServingMultiplierAmount("-1")),
  "parseServingMultiplierAmount rejects negatives"
);

assert(
  keywordServingMultiplier("Eggs * 0", "Eggs".length) === 0,
  "keywordServingMultiplier treats '* 0' as 0 servings"
);
assert(
  keywordServingMultiplier("Eggs * 2", "Eggs".length) === 2,
  "keywordServingMultiplier still applies '* 2'"
);
assert(
  keywordServingMultiplier("Eggs", "Eggs".length) === 1,
  "keywordServingMultiplier defaults to 1 when no multiplier"
);

assert(
  formatDayFoodLine("Eggs", 0) === "Eggs * 0",
  "formatDayFoodLine writes '* 0' for zero servings"
);
assert(
  formatDayFoodLine("Eggs", 1) === "Eggs",
  "formatDayFoodLine still omits '* 1'"
);
assert(
  formatDayFoodLine("Eggs", 2) === "Eggs * 2",
  "formatDayFoodLine still writes '* 2'"
);

assert(
  dayMealLineServings("Eggs * 0") === 0,
  "dayMealLineServings reads '* 0' as 0"
);
assert(
  dayMealLineServings("Eggs") === 1,
  "dayMealLineServings defaults to 1"
);
assert(
  stripKeywordServingMultiplier("Eggs * 0") === "Eggs",
  "stripKeywordServingMultiplier removes '* 0'"
);

assert(
  formatGuidedServingsValue(0) === "0",
  "formatGuidedServingsValue shows 0"
);
assert(
  formatGuidedServingsValue(1) === "1",
  "formatGuidedServingsValue still shows 1"
);

const setGuided = extractFunction(appJs, "setGuidedServingsFromInput");
assert(
  /if\s*\(\s*!isFinite\(n\)\s*\|\|\s*n\s*<\s*0\s*\)/.test(setGuided),
  "setGuidedServingsFromInput keeps 0 (rejects only negative/NaN)"
);
assert(
  !/if\s*\(\s*!isFinite\(n\)\s*\|\|\s*n\s*<=\s*0\s*\)\s*n\s*=\s*1/.test(
    setGuided
  ),
  "setGuidedServingsFromInput does not coerce 0 to 1"
);

assert(
  appJs.includes(
    '<input type="number" class="day__food-item-servings-input" min="0" step="0.25"'
  ),
  "basic-mode servings input min is 0"
);
assert(
  appJs.includes("day__food-item--zero-servings"),
  "basic-mode zero-quantity row class"
);
assert(
  /day__food-item--zero-servings[\s\S]{0,400}text-decoration:\s*line-through/.test(
    stylesCss
  ),
  "zero-quantity rows are crossed out"
);
assert(
  /day__food-item--zero-servings[\s\S]{0,400}color:\s*#9a9a96/.test(stylesCss) ||
    /day__food-item--zero-servings[\s\S]{0,400}color:\s*#[89a-fA-F][0-9a-fA-F]{5}/.test(
      stylesCss
    ),
  "zero-quantity rows use gray text"
);

if (failures.length) {
  console.error(
    "Zero-servings verification FAILED:\n" +
      failures.map(function (f) {
        return "  • " + f;
      }).join("\n")
  );
  process.exit(1);
}

console.log("Zero-servings verification passed.");
process.exit(0);
