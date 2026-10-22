#!/usr/bin/env node
/**
 * Apply migrations/food-text.json to repo JSON files in place.
 * Replaces the text only. Does not reformat the files.
 *
 * Usage:
 *   node scripts/apply-food-text-migrations.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const rulesPath = path.join(root, "migrations", "food-text.json");
const files = [
  "samples/definitions-food.json",
  "samples/day-meals.json",
  "samples/definitions-food-qa-checked.json",
  "definitions-food-sources.json",
  "definitions-food-notes.json",
  "definitions-food-categories.json",
];

function loadPersist() {
  const context = { console: console };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "persist.js"), "utf8"), context);
  return context.NutrientsPersist;
}

function ruleIsRawSafe(rule) {
  return !/["\\\u0000-\u001f]/.test(rule.from) && !/["\\\u0000-\u001f]/.test(rule.to);
}

const persist = loadPersist();
const data = JSON.parse(fs.readFileSync(rulesPath, "utf8"));
const rules = persist.normalizeFoodTextMigrations(data);
const unsafe = rules.filter(function (rule) {
  return !ruleIsRawSafe(rule);
});
if (unsafe.length) {
  console.error(
    "A rule contains a quote, backslash, or line break. Edit those JSON files by hand so the file is not corrupted."
  );
  process.exit(1);
}

let changed = 0;
files.forEach(function (rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, "utf8");
  const next = persist.applyFoodTextRulesToString(raw, rules);
  if (next === raw) return;
  fs.writeFileSync(file, next);
  changed += 1;
  console.log("updated " + rel);
});

console.log(changed ? "Updated " + changed + " file(s)." : "No JSON file changes.");
