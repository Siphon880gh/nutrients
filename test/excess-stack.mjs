#!/usr/bin/env node
/**
 * Excess toggle: black stacked-bar segment for nutrients over 100%.
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
const persistJs = read("persist.js");
const stylesCss = read("styles.css");
const indexHtml = read("index.html");

mustInclude(
  indexHtml,
  'data-nutrient-excess-toggle',
  "requirements modal Excess toggle"
);
mustInclude(
  indexHtml,
  '<span class="analysis-nonstored-toggle__label">Excess</span>',
  "requirements modal Excess label"
);
mustInclude(
  indexHtml,
  'id="dashboard-micro-excess-toggle"',
  "requirements modal Excess id"
);
mustInclude(
  indexHtml,
  'id="dashboard-micro-excess-toggle" class="analysis-nonstored-toggle" data-nutrient-excess-toggle aria-pressed="false"',
  "requirements modal Excess defaults off"
);

mustInclude(appJs, "var nutrientExcessOn = false", "Excess defaults off");
mustInclude(appJs, "data-nutrient-excess-toggle", "generated Excess toggle");
mustInclude(appJs, "function analysisAimStackBands(", "aim stack band list");
mustInclude(appJs, "ANALYSIS_EXCESS_AIM_BAND", "excess band constant");
mustInclude(appJs, 'id: "over-100"', "over-100 band id");
mustInclude(appJs, 'stack: "black"', "excess stack is black");
mustInclude(appJs, "function toggleNutrientExcess(", "Excess toggle handler");
mustInclude(
  appJs,
  "analysisNutrientExcessEntries(bySection)",
  "stack counts excess nutrients"
);
mustInclude(
  appJs,
  'if (bandId === "over-100")',
  "coverage popover uses excess entries"
);
mustInclude(
  appJs,
  "analysisAimStackBands()",
  "diary bars use excess-aware bands"
);

mustInclude(persistJs, "GUEST_NUTRIENT_EXCESS", "guest Excess persist key");
mustInclude(persistJs, "nutrientExcess: false", "settings default Excess off");
mustInclude(persistJs, "function getNutrientExcess(", "get Excess preference");
mustInclude(persistJs, "function setNutrientExcess(", "set Excess preference");
mustInclude(persistJs, "getNutrientExcess: getNutrientExcess", "export get Excess");
mustInclude(persistJs, "setNutrientExcess: setNutrientExcess", "export set Excess");

mustInclude(
  stylesCss,
  ".longevity-analysis-report__stack-seg--black",
  "black stack segment"
);
mustInclude(
  stylesCss,
  ".diary-coverage-popover__swatch--black",
  "black coverage popover swatch"
);

if (!/stack-seg--black\s*\{[^}]*background:\s*#1a1a1a/.test(stylesCss)) {
  fail("black stack segment uses #1a1a1a");
}

if (failures.length) {
  console.error(
    "Excess-stack verification FAILED:\n" +
      failures.map(function (f) {
        return "  • " + f;
      }).join("\n")
  );
  process.exit(1);
}

console.log("Excess-stack verification passed.");
process.exit(0);
