#!/usr/bin/env node
/**
 * List food names that match no category in definitions-food-categories.json.
 *
 * Usage:
 *   node scripts/list-uncategorized-foods.js
 *   node scripts/list-uncategorized-foods.js samples/definitions-food.json
 *   node scripts/list-uncategorized-foods.js ~/Downloads/nutrients-food-definitions.json
 *   node scripts/list-uncategorized-foods.js --json samples/definitions-food.json
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const categoriesPath = path.join(root, "definitions-food-categories.json");
const defaultFoodsPath = path.join(root, "samples", "definitions-food.json");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function compileCategories(data) {
  const list = data && Array.isArray(data.categories) ? data.categories : [];
  const out = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const id = raw.id != null ? String(raw.id).trim() : "";
    const label = raw.label != null ? String(raw.label).trim() : "";
    if (!id || !label) continue;
    const patterns = [];
    const rawPatterns = Array.isArray(raw.patterns) ? raw.patterns : [];
    for (const patternText of rawPatterns) {
      if (patternText == null || String(patternText) === "") continue;
      try {
        patterns.push(new RegExp(String(patternText), "i"));
      } catch (e) {
        /* skip invalid */
      }
    }
    if (!patterns.length) continue;
    out.push({ id, label, patterns });
  }
  return out;
}

function categoryIdForName(name, categories) {
  const text = name != null ? String(name) : "";
  for (const cat of categories) {
    for (const re of cat.patterns) {
      if (re.test(text)) return cat.id;
    }
  }
  return null;
}

function normalizeFoods(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.foods)) return data.foods;
  throw new Error("Food file must be a JSON array of food objects (or { foods: [...] })");
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const fileArgs = args.filter((a) => a !== "--json");
  const foodsPath = path.resolve(fileArgs[0] || defaultFoodsPath);

  const categories = compileCategories(loadJson(categoriesPath));
  const foods = normalizeFoods(loadJson(foodsPath));

  const counts = {};
  for (const cat of categories) counts[cat.id] = 0;

  const uncategorized = [];
  for (const food of foods) {
    const name = food && food.name != null ? String(food.name) : "";
    const id = categoryIdForName(name, categories);
    if (!id) {
      uncategorized.push(name.trim() || "(unnamed)");
    } else if (counts[id] != null) {
      counts[id] += 1;
    }
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          foodsPath,
          categoriesPath,
          totalFoods: foods.length,
          categoryCounts: counts,
          uncategorizedCount: uncategorized.length,
          uncategorized,
          categories: categories.map((c) => ({ id: c.id, label: c.label })),
        },
        null,
        2
      )
    );
    return;
  }

  console.log("Foods:", foodsPath);
  console.log("Categories:", categoriesPath);
  console.log("Total foods:", foods.length);
  console.log("Uncategorized:", uncategorized.length);
  console.log("");
  if (!uncategorized.length) {
    console.log("All foods match a category.");
    return;
  }
  for (const name of uncategorized) {
    console.log(" -", name);
  }
  console.log("");
  console.log("Existing categories:");
  for (const cat of categories) {
    console.log(" -", cat.id + ":", cat.label, "(" + counts[cat.id] + ")");
  }
}

main();
