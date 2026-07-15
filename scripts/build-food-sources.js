#!/usr/bin/env node
/**
 * Precompute Food Sources modal rows from micronutrient + longevity
 * definitions and samples/definitions-food.json.
 *
 * Run after changing foodSources labels, sample foods, or matching logic:
 *   node scripts/build-food-sources.js
 *
 * Keep matching helpers in sync with app.js foodSources* functions.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_PATH = path.join(ROOT, "definitions-food-sources.json");

const FOOD_SOURCE_TOKEN_ALIASES = {
  mayonnaise: ["mayo"],
  mayo: ["mayonnaise"],
  "bell peppers": ["bell pepper", "pepper"],
  "bell pepper": ["pepper"],
  "red bell pepper": ["bell pepper", "pepper"],
  eggs: ["egg"],
  egg: ["eggs"],
  tomatoes: ["tomato"],
  tomato: ["tomatoes"],
  potatoes: ["potato"],
  potato: ["potatoes"],
  berries: ["berry"],
  berry: ["berries"],
  oats: ["oat"],
  beans: ["bean"],
  lentils: ["lentil"],
  carrots: ["carrot"],
  carrot: ["carrots"],
  flaxseed: ["flax", "flaxseeds"],
  flax: ["flaxseed", "flaxseeds"],
  "flax oil": ["flaxseed oil"],
  "flaxseed oil": ["flax oil"],
  walnuts: ["walnut"],
  walnut: ["walnuts"],
  shrimp: ["shellfish", "prawns", "prawn"],
  shellfish: ["shrimp", "prawns", "prawn"],
  beets: ["beet"],
  beet: ["beets"],
  soybeans: ["soybean", "soy"],
  soybean: ["soybeans", "soy"],
  pistachios: ["pistachio"],
  pistachio: ["pistachios"],
  sardines: ["sardine"],
  sardine: ["sardines"],
  "hemp seeds": ["hemp seed", "hemp"],
  "hemp seed": ["hemp seeds", "hemp"],
  hemp: ["hemp seed", "hemp seeds"],
  "perilla oil": ["perilla"],
  "organ meats": ["liver", "organ meat"],
  "organ meat": ["liver", "organ meats"],
  "dairy fat": ["milk", "butter", "cheese"],
  "whole milk": ["milk whole"],
  "milk whole": ["whole milk"],
};

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isGenericSupplementFoodSource(label) {
  return /^supplements?\b/i.test(String(label || "").trim());
}

/** Map unicode vulgar fractions to words so ½ survives token cleanup. */
function normalizeFoodSourceFractions(text) {
  return String(text || "")
    .replace(/1½/g, "1 half")
    .replace(/⅜/g, "three eighths")
    .replace(/¾/g, "three quarters")
    .replace(/⅓/g, "one third")
    .replace(/⅔/g, "two thirds")
    .replace(/¼/g, "one quarter")
    .replace(/½/g, "half");
}

function foodSourceMatchTokens(sourceLabel) {
  const extras = [];
  let raw = normalizeFoodSourceFractions(sourceLabel || "");
  raw = raw.replace(/\(([^)]*)\)/g, (_match, inner) => {
    String(inner || "")
      .split(/\s*(?:&|\/|,|\band\b|\bor\b)\s*/i)
      .forEach((part) => extras.push(part));
    return " ";
  });
  return raw
    .split(/\s*(?:&|\/|,|\band\b|\bor\b)\s*/i)
    .concat(extras)
    .map((part) =>
      normalizeFoodSourceFractions(part)
        .replace(/[^a-z0-9\s'-]/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
    )
    .filter((token) => token.length >= 3);
}

function expandFoodSourceTokenCandidates(token) {
  const out = [];
  const seen = {};
  function add(value) {
    const v = String(value || "")
      .trim()
      .toLowerCase();
    if (!v || seen[v]) return;
    seen[v] = true;
    out.push(v);
  }
  add(token);
  const aliases = FOOD_SOURCE_TOKEN_ALIASES[token];
  if (aliases) aliases.forEach(add);
  if (token.endsWith("ies") && token.length > 4) {
    add(token.slice(0, -3) + "y");
  } else if (token.endsWith("es") && token.length > 4) {
    add(token.slice(0, -2));
  } else if (token.endsWith("s") && token.length > 3) {
    add(token.slice(0, -1));
  } else {
    add(token + "s");
  }
  return out;
}

function foodNameHasServing(name) {
  const n = normalizeFoodSourceFractions(name || "");
  if (
    /\b\d+([./]\d+)?\s*(cups?|tbsp|tsp|tablespoons?|teaspoons?|oz|g|kg|ml|l|lbs?|pieces?|slices?|softgels?|bites?|handfuls?|servings?)\b/i.test(
      n
    )
  ) {
    return true;
  }
  if (
    /\b(half|one quarter|three quarters|three eighths|one third|two thirds)\s*(cups?|tbsp|tsp|tablespoons?|teaspoons?|oz|g|kg|ml|l|lbs?|pieces?|slices?|softgels?|bites?|handfuls?|servings?)\b/i.test(
      n
    )
  ) {
    return true;
  }
  if (/\b(x\s*\d+|medium|med|\bmd\b|large|\blg\b|small|\bsm\b)\b/i.test(n)) {
    return true;
  }
  return false;
}

function suggestedServingSuffix(sourceLabel) {
  const t = String(sourceLabel || "").toLowerCase();
  if (!t.trim()) return "1 serving";
  if (/\b(oil|mayo|mayonnaise|dressing|butter|sauce)\b/.test(t)) {
    return "1 tablespoon";
  }
  if (/\b(egg|eggs)\b/.test(t)) return "1 medium";
  if (
    /\b(apple|orange|banana|mango|peach|pear|kiwi|plum|avocado|cantaloupe|watermelon|papaya|grapefruit)\b/.test(
      t
    )
  ) {
    return "1 medium";
  }
  if (
    /\b(spinach|kale|broccoli|carrot|pepper|tomato|lettuce|greens|cabbage|beans|lentils|berries|oats|rice|pasta|yogurt|milk)\b/.test(
      t
    )
  ) {
    return "1 cup";
  }
  if (/\b(nuts?|seeds?|chia|flax|almonds?|walnuts?|pistachios?)\b/.test(t)) {
    return "1 oz";
  }
  if (
    /\b(fish|salmon|chicken|beef|liver|turkey|tuna|sardines?|meat)\b/.test(t)
  ) {
    return "3 oz";
  }
  if (/\b(bread|toast|slice)\b/.test(t)) return "1 slice";
  return "1 serving";
}

function withSuggestedFoodServing(foodName, sourceLabel) {
  const name = String(foodName || sourceLabel || "").trim();
  if (!name || foodNameHasServing(name)) return name;
  return name + " " + suggestedServingSuffix(sourceLabel || name);
}

function scoreFoodNameAgainstToken(foodName, token) {
  const name = normalizeFoodSourceFractions(foodName || "").toLowerCase();
  if (!name || !token) return 0;
  const candidates = expandFoodSourceTokenCandidates(token);
  let best = 0;
  candidates.forEach((candidate) => {
    if (!candidate || name.indexOf(candidate) === -1) return;
    const stripped = name.replace(/^[a-z0-9][a-z0-9\s/&]*\s-\s/, "");
    function startsAsWholeToken(haystack) {
      if (haystack.indexOf(candidate) !== 0) return false;
      const after = haystack.charAt(candidate.length);
      return !after || /[^a-z0-9]/.test(after);
    }
    if (startsAsWholeToken(stripped) || startsAsWholeToken(name)) {
      best = Math.max(best, 100 + candidate.length);
      return;
    }
    const boundary = new RegExp(
      "(^|[^a-z0-9])" + escapeRegex(candidate) + "([^a-z0-9]|$)"
    );
    if (boundary.test(name)) {
      best = Math.max(best, 50 + candidate.length);
      return;
    }
    best = Math.max(best, 10 + candidate.length);
  });
  return best;
}

function foodSourcesMatchPenalty(foodName, score, sourceLabel) {
  const n = String(foodName || "").toLowerCase();
  const label = String(sourceLabel || "").toLowerCase();
  let penalty = 0;
  if (
    /^(trifecta|jamba juice|supplement|junk food|starbucks|leaf wrapped|am shot)\b/.test(
      n
    )
  ) {
    penalty += score >= 100 ? 35 : 45;
  }
  if (
    /\b(liver|gizzard|heart|kidney|offal)\b/.test(n) &&
    label &&
    !/\b(liver|organ|offal|gizzard|heart|kidney)\b/.test(label)
  ) {
    penalty += 50;
  }
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length >= 6) penalty += 25;
  return penalty;
}

function fiberTotalFromParts(micros) {
  if (!micros) return 0;
  let soluble = parseFloat(micros.solubleFiber);
  let insoluble = parseFloat(micros.insolubleFiber);
  soluble = isNaN(soluble) ? 0 : soluble;
  insoluble = isNaN(insoluble) ? 0 : insoluble;
  if (soluble > 0 || insoluble > 0) return soluble + insoluble;
  const legacy = parseFloat(micros.fiber);
  return isNaN(legacy) ? 0 : legacy;
}

function resolveLongevityValue(kw, key) {
  const longevity = kw.longevity || {};
  const micros = kw.micros || {};
  const v = longevity[key];
  if (v === true || v === "" || v == null) {
    if (v === true || micros[key] != null) {
      const mv = micros[key];
      if (mv === "" || mv == null) return "";
      const n = parseFloat(mv);
      return isNaN(n) ? "" : n;
    }
  }
  if (key === "carotenoids") {
    if (v !== "" && v != null) {
      const stored = parseFloat(v);
      if (!isNaN(stored) && stored > 0) return stored;
    }
    const betaCarotene = parseFloat(micros.vitaminABetaCarotene);
    if (!isNaN(betaCarotene) && betaCarotene > 0) {
      return Math.round((betaCarotene / 1000) * 10) / 10;
    }
    const vitA = parseFloat(micros.vitaminA);
    if (!isNaN(vitA) && vitA > 50) {
      return Math.round(vitA * 0.01 * 10) / 10;
    }
    return v === "" || v == null ? "" : v;
  }
  return v;
}

function nutrientAmountFromKeyword(kw, key) {
  if (!kw) return null;
  if (key === "fiber") {
    const fiber = fiberTotalFromParts(kw.micros);
    return fiber > 0 ? fiber : null;
  }
  if (kw.micros && kw.micros[key] !== "" && kw.micros[key] != null) {
    const microVal = parseFloat(kw.micros[key]);
    if (!isNaN(microVal) && microVal > 0) return microVal;
  }
  const longevityVal = resolveLongevityValue(kw, key);
  if (longevityVal === "" || longevityVal == null || longevityVal === true) {
    return null;
  }
  const n = parseFloat(longevityVal);
  return isNaN(n) || n <= 0 ? null : n;
}

function findFoodDefinitionForSourcePass(catalog, sourceLabel, nutrientKey, requireAmount) {
  const tokens = foodSourceMatchTokens(sourceLabel);
  if (!tokens.length) return null;
  let best = null;
  const minScore = requireAmount ? 40 : 50;

  catalog.forEach((kw) => {
    const name = (kw.name || "").trim();
    if (!name) return;
    let score = 0;
    tokens.forEach((token) => {
      score = Math.max(score, scoreFoodNameAgainstToken(name, token));
    });
    const adjusted = score - foodSourcesMatchPenalty(name, score, sourceLabel);
    if (adjusted < minScore) return;
    const amount = nutrientAmountFromKeyword(kw, nutrientKey);
    const amountNum = amount == null ? -1 : amount;
    const hasAmount = amountNum > 0 ? 1 : 0;
    if (requireAmount && !hasAmount) return;
    const hasServing = foodNameHasServing(name) ? 1 : 0;
    const multiplierPenalty = /\bx\s*\d+\b/i.test(name) ? 1 : 0;
    if (
      !best ||
      hasAmount > best.hasAmount ||
      (hasAmount === best.hasAmount && adjusted > best.score) ||
      (hasAmount === best.hasAmount &&
        adjusted === best.score &&
        hasServing > best.hasServing) ||
      (hasAmount === best.hasAmount &&
        adjusted === best.score &&
        hasServing === best.hasServing &&
        multiplierPenalty < best.multiplierPenalty) ||
      (hasAmount === best.hasAmount &&
        adjusted === best.score &&
        hasServing === best.hasServing &&
        multiplierPenalty === best.multiplierPenalty &&
        amountNum > best.amount)
    ) {
      best = {
        name,
        amount: amountNum,
        score: adjusted,
        hasAmount,
        hasServing,
        multiplierPenalty,
      };
    }
  });
  return best;
}

function findFoodDefinitionForSource(catalog, sourceLabel, nutrientKey) {
  const withAmount = findFoodDefinitionForSourcePass(
    catalog,
    sourceLabel,
    nutrientKey,
    true
  );
  if (withAmount) return withAmount;
  return findFoodDefinitionForSourcePass(catalog, sourceLabel, nutrientKey, false);
}

function collectDefinitionFoodSourceLabels(def) {
  const labels = [];
  if (!def) return labels;
  if (Array.isArray(def.foodSourceGroups) && def.foodSourceGroups.length) {
    def.foodSourceGroups.forEach((group) => {
      (group.items || []).forEach((item) => {
        if (item && !isGenericSupplementFoodSource(item)) labels.push(item);
      });
    });
  } else if (Array.isArray(def.foodSources)) {
    def.foodSources.forEach((item) => {
      if (item && !isGenericSupplementFoodSource(item)) labels.push(item);
    });
  }
  return labels;
}

function extractFieldMeta(appJs) {
  const byKey = {};
  const re =
    /\{\s*key:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*,\s*unit:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(appJs))) {
    byKey[m[1]] = { key: m[1], label: m[2], unit: m[3] };
  }
  // Derived fiber ratio defs (label only; no unit in object literal above)
  byKey.insolubleToSolubleFiber2To1 = {
    key: "insolubleToSolubleFiber2To1",
    label: "Insoluble : soluble fiber (2:1)",
    unit: "",
  };
  byKey.insolubleToSolubleFiber = {
    key: "insolubleToSolubleFiber",
    label: "Insoluble : soluble fiber (3:1)",
    unit: "",
  };
  return byKey;
}

function longevityDefLabel(key) {
  return String(key || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function fmtFoodSourcesAmount(n) {
  const x = Number(n);
  if (!isFinite(x)) return "";
  const abs = Math.abs(x);
  if (abs === 0) return "0";
  if (abs >= 1) {
    const rounded = Math.round(x * 10) / 10;
    return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
  }
  const two = Math.round(x * 100) / 100;
  if (two === 0) return String(Math.round(x * 1000) / 1000);
  return two % 1 === 0
    ? String(two)
    : two.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
}

function main() {
  const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const fieldMeta = extractFieldMeta(appJs);
  const nutrientKeys = new Set(Object.keys(fieldMeta));

  const micro = JSON.parse(
    fs.readFileSync(path.join(ROOT, "definitions-micronutrients.json"), "utf8")
  );
  const longevity = JSON.parse(
    fs.readFileSync(path.join(ROOT, "definitions-longevity.json"), "utf8")
  );
  const foods = JSON.parse(
    fs.readFileSync(path.join(ROOT, "samples/definitions-food.json"), "utf8")
  );

  const catalog = foods
    .filter((f) => f && typeof f.name === "string" && f.name.trim())
    .map((f) => ({
      name: f.name.trim(),
      micros: f.micros || {},
      longevity: f.longevity || {},
    }));

  const rows = [];
  const seen = {};

  function addRowsForKey(key, def) {
    if (!nutrientKeys.has(key)) return;
    const meta = fieldMeta[key] || {
      key,
      label: longevityDefLabel(key),
      unit: "",
    };
    collectDefinitionFoodSourceLabels(def).forEach((sourceLabel) => {
      const dedupeKey = key + "\0" + sourceLabel.toLowerCase();
      if (seen[dedupeKey]) return;
      seen[dedupeKey] = true;
      const match = findFoodDefinitionForSource(catalog, sourceLabel, key);
      let foodName = match && match.name ? match.name : sourceLabel;
      let amount =
        match && match.amount != null && match.amount > 0 ? match.amount : null;

      if (meta.label && !foodNameHasServing(foodName)) {
        foodName = withSuggestedFoodServing(foodName, sourceLabel);
      }

      let nutrientText = meta.label;
      if (amount != null && meta.unit) {
        nutrientText += " " + fmtFoodSourcesAmount(amount) + " " + meta.unit;
      } else if (amount != null) {
        nutrientText += " " + fmtFoodSourcesAmount(amount);
      }

      rows.push({
        food: foodName,
        sourceLabel,
        nutrientKey: key,
        nutrientLabel: meta.label,
        nutrientText,
        amount,
        unit: meta.unit || "",
        matched: !!(match && match.name),
      });
    });
  }

  Object.keys(micro).forEach((key) => addRowsForKey(key, micro[key]));
  Object.keys(longevity).forEach((key) => addRowsForKey(key, longevity[key]));

  const payload = {
    generatedAt: new Date().toISOString(),
    sampleFoods: catalog.length,
    rowCount: rows.length,
    rows,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");
  const matched = rows.filter((r) => r.amount != null).length;
  console.log(
    "Wrote %s (%d rows, %d with amounts, %d sample foods)",
    path.relative(ROOT, OUT_PATH),
    rows.length,
    matched,
    catalog.length
  );
}

main();
