#!/usr/bin/env node
/**
 * Label-gap QA (second pass after run-micro-qa.js).
 * Follows .agents/skills/qa-definitions-food-label-gaps.json.
 *
 * Nutrition Facts labels don't have to list most vitamins and minerals, so a
 * missing or 0 value on a branded or restaurant food usually means "not on the
 * label", not "none in the food". This script lists, for the 23 label-gap
 * nutrients, every food/nutrient pair that is still missing or is 0 without a
 * documented reason in the food's notes. It does not change any data.
 *
 * Usage:
 *   node scripts/run-label-gap-qa.js                 summary + pending list
 *   node scripts/run-label-gap-qa.js --food "Doritos" only foods whose name contains the text
 *   node scripts/run-label-gap-qa.js --nutrient chromium
 *   node scripts/run-label-gap-qa.js --json          machine-readable output
 *   node scripts/run-label-gap-qa.js --strict        exit 1 if anything is pending
 *   node scripts/run-label-gap-qa.js --write-checked rebuild the progress hash table from the notes
 *   node scripts/run-label-gap-qa.js --file path/to/definitions-food.json
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const LABEL_GAP_NUTRIENTS = [
  ["vitaminA", "vitamin A", "mcg"], ["vitaminC", "vitamin C", "mg"], ["vitaminE", "vitamin E", "mg"],
  ["vitaminK", "vitamin K", "mcg"], ["thiamin", "thiamin", "mg"], ["riboflavin", "riboflavin", "mg"],
  ["niacin", "niacin", "mg"], ["pantothenicAcid", "pantothenic acid", "mg"], ["vitaminB6", "B6", "mg"],
  ["biotin", "biotin", "mcg"], ["folate", "folate", "mcg"], ["vitaminB12", "B12", "mcg"],
  ["phosphorus", "phosphorus", "mg"], ["iodine", "iodine", "mcg"], ["magnesium", "magnesium", "mg"],
  ["zinc", "zinc", "mg"], ["selenium", "selenium", "mcg"], ["copper", "copper", "mcg"],
  ["manganese", "manganese", "mg"], ["chromium", "chromium", "mcg"], ["molybdenum", "molybdenum", "mcg"],
  ["chloride", "chloride", "mg"], ["choline", "choline", "mg"],
];
const KEYS = LABEL_GAP_NUTRIENTS.map((n) => n[0]);
const KEY_BY_LABEL = new Map(LABEL_GAP_NUTRIENTS.map(([k, label]) => [label.toLowerCase(), k]));

// Sentences written by the label-gap pass (see the skill's notesConventions).
const NOTE_LISTS = [
  ["verified_zero", /Verified zero on [^(]*\(composition data, not the label\): ([^.]*)\./g],
  ["supplement_zero", /\(Supplement Facts rule, not a measured value\): ([^.]*)\./g],
  ["trace_zero", /rounds to 0 at this portion size: ([^.]*)\./g],
  ["not_reported", /Not reported in the composition data, so left as is: ([^.]*)\./g],
  ["estimated", /From (?:that record|those records): ([^.]*)\./g],
  ["estimated", /From typical amounts per [^:]*\): ([^.]*)\./g],
];

function args() {
  const a = process.argv.slice(2);
  const get = (flag) => {
    const i = a.indexOf(flag);
    return i >= 0 ? a[i + 1] : null;
  };
  return {
    file: get("--file") || path.join(ROOT, "data-food/definitions-food.json"),
    food: get("--food"),
    nutrient: get("--nutrient"),
    json: a.includes("--json"),
    strict: a.includes("--strict"),
    writeChecked: a.includes("--write-checked"),
  };
}

function labelsToKeys(list) {
  return list
    .split(",")
    .map((s) => KEY_BY_LABEL.get(s.trim().toLowerCase()))
    .filter(Boolean);
}

/** key -> verdict, read from the food's notes. Later, stronger verdicts win. */
function verdictsFromNotes(notes) {
  const out = {};
  if (!notes || !/Label-gap check on /.test(notes)) return out;
  for (const [verdict, re] of NOTE_LISTS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(notes))) {
      for (const k of labelsToKeys(m[1])) if (!out[k] || verdict !== "estimated") out[k] = verdict;
    }
  }
  if (/Chloride: /.test(notes) && !out.chloride) out.chloride = "estimated";
  return out;
}

function isMissing(v) {
  return v === undefined || v === null || v === "";
}

function audit(foods, opts) {
  const pending = [];
  const notReported = [];
  const checked = {};
  const perKey = Object.fromEntries(KEYS.map((k) => [k, { missing: 0, unexplainedZero: 0, notReported: 0 }]));
  let neverChecked = 0;
  for (const food of foods) {
    const name = food.name || "";
    if (opts.food && !name.toLowerCase().includes(opts.food.toLowerCase())) continue;
    const micros = food.micros || {};
    const verdicts = verdictsFromNotes(food.notes || "");
    const wasChecked = /Label-gap check on /.test(food.notes || "");
    let foodHasGap = false;
    for (const key of KEYS) {
      if (opts.nutrient && key !== opts.nutrient) continue;
      const v = micros[key];
      const verdict = verdicts[key];
      if (wasChecked) checked[`${key}|${name}`] = verdict || (isMissing(v) ? "pending" : v === 0 ? "pending" : "label_or_prior");
      if ((isMissing(v) || v === 0) && verdict === "not_reported") {
        perKey[key].notReported++;
        notReported.push({ name, key, value: isMissing(v) ? null : 0 });
        continue;
      }
      if (isMissing(v)) {
        perKey[key].missing++;
        pending.push({ name, key, value: null, reason: "missing" });
        foodHasGap = true;
      } else if (v === 0 && !["verified_zero", "supplement_zero", "trace_zero"].includes(verdict)) {
        perKey[key].unexplainedZero++;
        pending.push({ name, key, value: 0, reason: "zero without a verified-zero note" });
        foodHasGap = true;
      }
    }
    if (foodHasGap && !wasChecked) neverChecked++;
  }
  return { pending, notReported, perKey, checked, neverChecked };
}

function main() {
  const opts = args();
  const foods = JSON.parse(fs.readFileSync(opts.file, "utf8"));
  const res = audit(foods, opts);

  if (opts.writeChecked) {
    const checkedPath = opts.file.replace(/\.json$/, "-label-gap-checked.json");
    const prev = fs.existsSync(checkedPath) ? JSON.parse(fs.readFileSync(checkedPath, "utf8")).checked || {} : {};
    const merged = { ...prev, ...res.checked };
    const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
    fs.writeFileSync(checkedPath, JSON.stringify({ checked: sorted }, null, 2) + "\n");
    console.error(`Wrote ${path.relative(ROOT, checkedPath)} (${Object.keys(sorted).length} pairs)`);
  }

  if (opts.json) {
    console.log(JSON.stringify({ pending: res.pending, notReported: res.notReported, perKey: res.perKey }, null, 2));
  } else {
    const byFood = new Map();
    for (const p of res.pending) {
      if (!byFood.has(p.name)) byFood.set(p.name, []);
      byFood.get(p.name).push(p.value === 0 ? `${p.key}=0` : p.key);
    }
    console.log(`Label-gap QA: ${foods.length} foods, ${KEYS.length} nutrients`);
    console.log("nutrient          missing  zero-unexplained  not-in-composition-data");
    for (const k of KEYS) {
      if (opts.nutrient && k !== opts.nutrient) continue;
      const c = res.perKey[k];
      console.log(`${k.padEnd(17)} ${String(c.missing).padStart(7)}  ${String(c.unexplainedZero).padStart(16)}  ${String(c.notReported).padStart(23)}`);
    }
    console.log(`\nPending pairs: ${res.pending.length} in ${byFood.size} foods (${res.neverChecked} foods have no label-gap note yet)`);
    for (const [name, keys] of byFood) console.log(`- ${name} :: ${keys.join(", ")}`);
    const nrByFood = new Map();
    for (const p of res.notReported) {
      if (!nrByFood.has(p.name)) nrByFood.set(p.name, []);
      nrByFood.get(p.name).push(p.value === 0 ? `${p.key}=0` : p.key);
    }
    console.log(`\nNot in the composition data used (left as is; check another source): ${res.notReported.length} pairs in ${nrByFood.size} foods`);
    for (const [name, keys] of nrByFood) console.log(`- ${name} :: ${keys.join(", ")}`);
  }
  if (opts.strict && res.pending.length) process.exit(1);
}

if (require.main === module) main();
module.exports = { LABEL_GAP_NUTRIENTS, verdictsFromNotes, audit };
