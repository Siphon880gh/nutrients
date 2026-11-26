#!/usr/bin/env node
/**
 * Check that every Food Sources row opens a food with stored nutrients.
 *
 * Mirrors app.js: clicking a food in the Food Sources modal looks up
 * row.food by exact, case-insensitive name (foodSourcesCatalogEntryByName).
 * Without an exact entry the detail view falls back to that food's own rows,
 * and shows "No nutrient amounts stored" when none has an amount.
 *
 *   node scripts/build-food-sources.js && node scripts/check-food-sources.js
 *
 * Exit code 1 when any row is a gap. --verbose lists every gap.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MIN_NUTRIENTS = 5;
const SKIP = { solubleFiber: true, insolubleFiber: true };

function nutrientCount(food) {
  const seen = {};
  const micros = food.micros || {};
  Object.keys(micros).forEach((k) => {
    if (SKIP[k]) return;
    const n = parseFloat(micros[k]);
    if (isFinite(n) && n > 0) seen[k] = true;
  });
  const fiber =
    (parseFloat(micros.solubleFiber) || 0) + (parseFloat(micros.insolubleFiber) || 0);
  if (fiber > 0) seen.fiber = true;
  [food.longevity || {}, food.carbQuality || {}].forEach((obj) => {
    Object.keys(obj).forEach((k) => {
      if (obj[k] === true) return;
      const n = parseFloat(obj[k]);
      if (isFinite(n) && n > 0) seen[k] = true;
    });
  });
  return Object.keys(seen).length;
}

function main() {
  const verbose = process.argv.includes("--verbose");
  const foods = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data-food/definitions-food.json"), "utf8")
  );
  const sources = JSON.parse(
    fs.readFileSync(path.join(ROOT, "definitions-food-sources.json"), "utf8")
  );
  const byName = {};
  foods.forEach((f) => {
    if (!f || typeof f.name !== "string") return;
    const key = f.name.trim().toLowerCase();
    if (!byName[key]) byName[key] = f;
  });

  const foodsSeen = {};
  const rowsByFood = {};
  sources.rows.forEach((row) => {
    (rowsByFood[row.food] = rowsByFood[row.food] || []).push(row);
  });

  const result = { full: [], thin: [], fallback: [], empty: [] };
  Object.keys(rowsByFood).forEach((foodName) => {
    if (foodsSeen[foodName]) return;
    foodsSeen[foodName] = true;
    const rows = rowsByFood[foodName];
    const labels = rows.map((r) => r.sourceLabel + " [" + r.nutrientKey + "]");
    const entry = byName[foodName.trim().toLowerCase()];
    if (entry) {
      const n = nutrientCount(entry);
      if (n >= MIN_NUTRIENTS) result.full.push({ foodName, n, labels });
      else result.thin.push({ foodName, n, labels });
      return;
    }
    const withAmount = rows.filter((r) => r.amount > 0).length;
    if (withAmount) result.fallback.push({ foodName, n: withAmount, labels });
    else result.empty.push({ foodName, n: 0, labels });
  });

  const total = Object.keys(foodsSeen).length;
  console.log("Food Sources rows: %d, distinct foods: %d", sources.rows.length, total);
  console.log("  matched with full nutrients (>= %d): %d", MIN_NUTRIENTS, result.full.length);
  console.log("  matched but thin nutrients:          %d", result.thin.length);
  console.log("  not found, partial fallback only:    %d", result.fallback.length);
  console.log("  not found, no nutrient info:         %d", result.empty.length);
  const gaps = result.thin.concat(result.fallback, result.empty);
  if (verbose || gaps.length) {
    ["thin", "fallback", "empty"].forEach((kind) => {
      result[kind].forEach((g) => {
        console.log("%s\t%s\t(%d)\t%s", kind, g.foodName, g.n, g.labels.join("; "));
      });
    });
  }
  process.exitCode = gaps.length ? 1 : 0;
}

main();
