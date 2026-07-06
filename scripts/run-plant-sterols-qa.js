#!/usr/bin/env node
/**
 * QA pass: plant sterols & stanols (longevity.plantSterols) in samples/definitions-food.json
 * Follows .agents/skills/qa-definitions-food.json workflow (longevity scope).
 */
const fs = require("fs");
const path = require("path");

const samplePath = path.join(__dirname, "../samples/definitions-food.json");
const checkedPath = path.join(__dirname, "../samples/definitions-food-qa-checked.json");
const NUTRIENT_KEY = "plantSterols";

/** Per-food overrides (grams plant sterols + stanols per portion in name). */
const FOOD_PATCHES = {
  "First Street Trail Mix 6 tablespoons": 0.12,
  "First Street Trail Mix 10 tablespoons": 0.2,
  "Peanuts 1 cup": 0.28,
  "Macadamia nuts 1 oz (28g, about 10-12 nuts)": 0.09,
  "Brazil Nut 1 piece": 0.01,
  "Peanut Butter 1 tablespoon": 0.04,
  "Peanut Butter 2 tablespoons": 0.08,
  "Avocado whole": 0.16,
  "Avocado half": 0.08,
  "Guacamole": 0.06,
  "Health Drink - Avocado Smoothie 1 cup": 0.07,
  "AM Shot - Avocado Oil": 0.02,
  "Extra Virgin Olive Oil 1 tablespoon": 0.03,
  "Bread, Whole Wheat": 0.04,
  "Bread, Whole Grain - Western Hearth 12 grain - 1 slice": 0.06,
  "Bread, Whole Grain - Simple Truth Organic Thin Sliced 21 Grains - 1 slice": 0.05,
  "Bread, Sourdough": 0.03,
  "Cereals Cheerios": 0.05,
  "Cereals Raisin Bran": 0.05,
  "Cereals Grape-Nuts": 0.08,
  "Shredded Wheat": 0.06,
  "Wheat Thins Reduced Fat Whole Grain Wheat Crackers 8 pieces": 0.03,
  "Wheat Thins Reduced Fat Whole Grain Wheat Crackers 12 pieces": 0.04,
  "Wheat Thins Reduced Fat Whole Grain Wheat Crackers 14 pieces": 0.05,
  "Wheat Thins Reduced Fat Whole Grain Wheat Crackers 16 pieces": 0.06,
  "Quinoa 1 cup": 0.06,
  "Rice - Brown 1 cup cooked": 0.04,
  "Rice - White 1 cup cooked": 0.02,
  "Hummus 2 tablespoons": 0.02,
  "Chopped Salad Kit with Dressing - Trader Joe's Peanut and Crispy Noodle Salad 1.75 cups": 0.04,
  "Chopped Salad Kit with Dressing - Taylor Farms Maple Bourbon Bacon 1.75 cups": 0.02,
  "Chopped Salad Kit with Dressing - Kroger Southwest Style 1.75 cups": 0.02,
  "Chopped Salad Kit with Dressing - Trader Joe's Southwestern 1.75 cups": 0.02,
  "Butter Salted 1 tablespoon (14.2g)": 0.02,
  "Cheese provolone 1 slice (28g)": 0.01,
  "Cheese American 1 slice (21g)": 0.01,
  "Cheese cheddar 1 slice (28g)": 0.01,
  "Mayo 1 tablespoon": 0.02,
  "Popcorn - LesserEvil Himalayan Salt Organic 2 cups (2 Handfuls)": 0.02,
  "Popcorn - LesserEvil Himalayan Salt Organic 1 cup (1 Handful)": 0.01,
  "Frozen Peas 1 cup (134g)": 0.02,
  "Beet md": 0.01,
  "Sweet Potato Baked with Skin md": 0.02,
  "Sweet Potato Baked without Skin md": 0.02,
  "Russet Potato Baked with Skin md": 0.01,
  "Red Potato Boiled with Skin md": 0.01,
  "Yukon Gold Potato Baked with Skin md": 0.01,
  "Trifecta plant based burrito": 0.03,
  "Leaf Wrapped Sticky Rice - Zongzi - Cantonese Styled Pork and Duck Egg md": 0.02,
};

function categorize(name) {
  if (/Trail Mix|Peanuts|Peanut Butter|Macadamia|Brazil Nut/i.test(name)) return "nut";
  if (/Avocado|Guacamole/i.test(name)) return "avocado";
  if (/Olive Oil|Avocado Oil/i.test(name)) return "oil";
  if (/Bread|Cereal|Cheerios|Raisin Bran|Grape-Nuts|Shredded Wheat|Wheat Thins/i.test(name)) return "grain";
  if (/Quinoa|Brown 1 cup/i.test(name)) return "legume_grain";
  if (/Rice - White/i.test(name)) return "grain_light";
  if (/Hummus/i.test(name)) return "legume";
  if (/Butter|Cheese|Mayo/i.test(name)) return "dairy_fat";
  if (/Potato|Sweet Potato|Peas|Beet/i.test(name)) return "veg_starch";
  if (/Popcorn/i.test(name)) return "grain_light";
  if (/Salad Kit/i.test(name)) return "salad";
  if (/Table Salt|Tajin|Energy Drink|Supplement|Multivitamin|Fish Oil|Algae Oil|Coenzyme|Metamucil|vinegar|Mustard|A1|Ranch|Salt|Celsius|Alani|Monster|Red Bull/i.test(name)) {
    return "none";
  }
  if (/Egg|Chicken|Turkey|Beef|Lamb|Liver|Cod|salmon|Shrimp|Ham|Bacon|Steak|Brisket|Rotisserie|Dave's|Wendy|AMC|Protein|Orgain|Premier|Quest|Isopure|Yogurt|Milk|Jamba|Smoothie|Juice|Tea|Red Bean|Carrot|Celery|Cucumber|Eggplant|Kiwi|Apple|Banana|Orange|Peach|Pear|Plum|Cherry|Parsley|Fries|Ramen|Cake|Zongzi|Lo Mai|burrito|Taco|Salmon Rice/i.test(name)) {
    return "animal_plant_low";
  }
  return "other_low";
}

const CATEGORY_DEFAULTS = {
  nut: 0.1,
  avocado: 0.08,
  oil: 0.02,
  grain: 0.04,
  legume_grain: 0.05,
  grain_light: 0.02,
  legume: 0.02,
  dairy_fat: 0.01,
  veg_starch: 0.01,
  salad: 0.02,
  none: 0,
  animal_plant_low: 0,
  other_low: 0,
};

function roundG(n) {
  if (n === 0) return 0;
  if (n < 0.01) return 0;
  return Math.round(n * 100) / 100;
}

function needsCheck(longevity, key) {
  const v = longevity?.[key];
  return v == null || v === "" || v === 0;
}

function estimatePlantSterols(food) {
  if (FOOD_PATCHES[food.name] != null) {
    const v = roundG(FOOD_PATCHES[food.name]);
    return {
      value: v,
      verdict: v === 0 ? "confirmed_zero" : "updated",
      note: "food patch",
    };
  }
  const cat = categorize(food.name);
  const v = roundG(CATEGORY_DEFAULTS[cat] ?? 0);
  return {
    value: v,
    verdict: v === 0 ? "confirmed_zero" : "updated",
    note: cat,
  };
}

const foods = JSON.parse(fs.readFileSync(samplePath, "utf8"));
const checkedData = fs.existsSync(checkedPath)
  ? JSON.parse(fs.readFileSync(checkedPath, "utf8"))
  : { checked: {} };
if (!checkedData.checked) checkedData.checked = {};

let patched = 0;
let confirmed = 0;
let skipped = 0;
const updatedFoods = [];

for (const food of foods) {
  if (!food.longevity) food.longevity = {};
  const hashKey = `${NUTRIENT_KEY}|${food.name}`;
  if (checkedData.checked[hashKey] && !needsCheck(food.longevity, NUTRIENT_KEY)) {
    skipped++;
    continue;
  }
  if (!needsCheck(food.longevity, NUTRIENT_KEY)) {
    checkedData.checked[hashKey] = "skipped";
    skipped++;
    continue;
  }

  const result = estimatePlantSterols(food);
  food.longevity[NUTRIENT_KEY] = result.value;
  checkedData.checked[hashKey] = result.verdict;
  if (result.verdict === "updated") {
    patched++;
    updatedFoods.push({ name: food.name, value: result.value, note: result.note });
  } else {
    confirmed++;
  }
}

fs.writeFileSync(samplePath, JSON.stringify(foods, null, "\t") + "\n");
fs.writeFileSync(checkedPath, JSON.stringify(checkedData, null, 2) + "\n");

const pending = foods.filter((f) => needsCheck(f.longevity, NUTRIENT_KEY)).length;

console.log("Plant sterols QA complete (samples/definitions-food.json)");
console.log("  updated:", patched);
console.log("  confirmed_zero:", confirmed);
console.log("  skipped (already checked):", skipped);
console.log("  remaining missing/zero:", pending);
console.log("\nFoods with non-zero plantSterols:");
updatedFoods
  .filter((f) => f.value > 0)
  .sort((a, b) => b.value - a.value)
  .forEach((f) => console.log(`  ${f.value} g — ${f.name}`));
