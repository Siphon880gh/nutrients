/**
 * Food-text migration checks. Uses a fake localStorage, not the browser profile.
 *
 * Usage: node test/food-text-migrations.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OLD =
  "Hong Kong Cafe Style - Chicken Steak 1 piece (about 5 oz cooked, palm-sized)";
const NEXT =
  "Hong Kong Cafe Style - Chicken Steak 1 piece with skin (about 5 oz cooked, palm-sized)";
const WITHOUT =
  "Hong Kong Cafe Style - Chicken Steak 1 piece without skin (about 5 oz cooked, palm-sized)";

let failed = 0;

function assert(cond, message) {
  if (cond) {
    console.log("ok  " + message);
    return;
  }
  failed += 1;
  console.error("FAIL " + message);
}

function createStorage(seed) {
  const data = new Map();
  if (seed) {
    Object.keys(seed).forEach(function (key) {
      data.set(key, seed[key]);
    });
  }
  return {
    get length() {
      return data.size;
    },
    key(index) {
      return Array.from(data.keys())[index] || null;
    },
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(String(key), String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

function loadApp(storage) {
  const context = { localStorage: storage, console: console };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "persist.js"), "utf8"), context);
  return context;
}

function rulesFile() {
  return JSON.parse(fs.readFileSync(path.join(root, "migrations", "food-text.json"), "utf8"));
}

const sample = fs.readFileSync(path.join(root, "samples", "definitions-food.json"), "utf8");
assert(!sample.includes(OLD), "sample JSON no longer uses the old chicken steak name");
assert(sample.includes(NEXT), "sample JSON uses the with-skin chicken steak name");
assert(sample.includes(WITHOUT), "sample JSON keeps the without-skin chicken steak name");

const normalized = loadApp(createStorage()).NutrientsPersist.normalizeFoodTextMigrations(
  rulesFile()
);
assert(normalized.length === 1 && normalized[0].from === OLD && normalized[0].to === NEXT, "rules file normalizes to the chicken steak rename");

const storage = createStorage({
  nutrients_users: JSON.stringify([
    {
      id: "user-a",
      email: "a@example.com",
      password: OLD,
      createdAt: "2020-01-01T00:00:00.000Z",
    },
  ]),
  nutrients_session: JSON.stringify({ userId: "user-a", email: "a@example.com" }),
  nutrients_food_definitions: JSON.stringify([
    {
      userId: "user-a",
      id: "kw-1",
      name: OLD,
      protein: 33,
      carbs: 0,
      fats: 20.9,
    },
    {
      userId: "user-b",
      id: "kw-2",
      name: WITHOUT,
      protein: 35.1,
      carbs: 0,
      fats: 11.6,
    },
  ]),
  nutrients_day_meals: JSON.stringify([
    {
      userId: "user-a",
      version: 2,
      days: {
        "2020-05-05":
          "Oatmeal 1 cup *2\n" +
          OLD +
          " *2\n" +
          OLD +
          "*2\n" +
          WITHOUT +
          " *2\n" +
          OLD +
          " * 2/3",
        "2024-01-02": "// " + OLD,
      },
      ignoredDays: { "2024-01-02": true },
    },
    {
      userId: "user-b",
      version: 2,
      days: {
        "2019-03-03": OLD + " * 2",
      },
      ignoredDays: {},
    },
  ]),
  nutrients_meals: JSON.stringify([
    {
      userId: "user-a",
      id: "meal-1",
      name: "Cafe lunch",
      foods: [{ keywordId: "kw-1", name: OLD, servings: 2 }],
    },
  ]),
  nutrients_settings: JSON.stringify([
    {
      userId: "user-a",
      version: 2,
      demographic: "male",
      quizFavoriteFoods: [
        {
          id: "q1",
          keywordId: "kw-1",
          name: OLD,
          servings: 2,
          protein: 33,
          carbs: 0,
          fats: 20.9,
        },
      ],
    },
  ]),
  nutrients_orphan_legacy: JSON.stringify({
    dayMeals: {
      version: 2,
      days: { "2018-01-01": OLD + "*2" },
    },
  }),
  "nutrients-day-notes": JSON.stringify({
    version: 2,
    days: { "2017-01-01": OLD + " *2" },
  }),
});

const app = loadApp(storage);
const result = app.NutrientsPersist.applyFoodTextMigrations(rulesFile());
assert(result.applied === 1, "one rule applied");
assert(result.changedKeys.indexOf("nutrients_day_meals") !== -1, "day meals key rewritten");
assert(result.changedKeys.indexOf("nutrients_users") === -1, "accounts key left alone");
assert(result.changedKeys.indexOf("nutrients_session") === -1, "session key left alone");

const users = JSON.parse(storage.getItem("nutrients_users"));
assert(users[0].password === OLD, "account password is not treated as food text");

const foods = JSON.parse(storage.getItem("nutrients_food_definitions"));
assert(foods[0].name === NEXT, "stored food definition name renamed");
assert(foods[0].protein === 33 && foods[0].fats === 20.9, "food numbers stay with the renamed definition");
assert(foods[1].name === WITHOUT, "without-skin definition is not renamed");

const days = JSON.parse(storage.getItem("nutrients_day_meals"));
const dayA = days[0].days["2020-05-05"];
assert(
  dayA ===
    "Oatmeal 1 cup *2\n" +
      NEXT +
      " *2\n" +
      NEXT +
      "*2\n" +
      WITHOUT +
      " *2\n" +
      NEXT +
      " * 2/3",
  "day lines keep *2, *2/3, and the without-skin food"
);
assert(days[0].days["2024-01-02"] === "// " + NEXT, "commented food name is renamed");
assert(days[0].ignoredDays["2024-01-02"] === true, "ignored day flag stays");
assert(days[1].days["2019-03-03"] === NEXT + " * 2", "another user's older day is renamed");

const meals = JSON.parse(storage.getItem("nutrients_meals"));
assert(meals[0].foods[0].name === NEXT, "saved meal food name renamed");
assert(meals[0].foods[0].servings === 2, "saved meal servings stay a number");

const settings = JSON.parse(storage.getItem("nutrients_settings"));
assert(settings[0].quizFavoriteFoods[0].name === NEXT, "quiz favorite name renamed");
assert(settings[0].quizFavoriteFoods[0].servings === 2, "quiz favorite servings stay");

const orphan = JSON.parse(storage.getItem("nutrients_orphan_legacy"));
assert(orphan.dayMeals.days["2018-01-01"] === NEXT + "*2", "orphan legacy day text renamed");

assert(storage.getItem("nutrients-day-notes") == null, "hyphen legacy day key is folded away");
const orphanAfterLegacy = JSON.parse(storage.getItem("nutrients_orphan_legacy"));
assert(
  orphanAfterLegacy.dayMeals.days["2018-01-01"] === NEXT + "*2",
  "existing orphan text stays renamed"
);

const again = app.NutrientsPersist.applyFoodTextMigrations(rulesFile());
assert(again.changedKeys.length === 0, "second load does not write again");

const prefixStorage = createStorage({
  nutrients_day_meals: JSON.stringify([
    {
      userId: "user-a",
      version: 2,
      days: { "2021-01-01": "Apple *2" },
      ignoredDays: {},
    },
  ]),
});
const prefixApp = loadApp(prefixStorage);
prefixApp.NutrientsPersist.applyFoodTextMigrations([
  { from: "Apple", to: "Apple with skin" },
]);
prefixApp.NutrientsPersist.applyFoodTextMigrations([
  { from: "Apple", to: "Apple with skin" },
]);
const prefixDays = JSON.parse(prefixStorage.getItem("nutrients_day_meals"));
assert(
  prefixDays[0].days["2021-01-01"] === "Apple with skin *2",
  "prefix rename keeps the operator and does not repeat"
);

const loginApp = loadApp(
  createStorage({
    nutrients_users: JSON.stringify([
      {
        id: "user-a",
        email: "a@example.com",
        password: "secret",
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ]),
    nutrients_session: JSON.stringify({ userId: "user-a", email: "a@example.com" }),
    nutrients_settings: JSON.stringify([
      {
        userId: "user-a",
        version: 2,
        demographic: "male",
        quizFavoriteFoods: [{ id: "q1", keywordId: "kw-1", name: OLD, servings: 1 }],
      },
    ]),
  })
);
loginApp.NutrientsAuth.login("a@example.com", "secret");
assert(loginApp.NutrientsPersist.loadSettings().quizFavoriteFoods[0].name === OLD, "settings cache sees the old name first");
loginApp.NutrientsPersist.applyFoodTextMigrations(rulesFile());
assert(
  loginApp.NutrientsPersist.loadSettings().quizFavoriteFoods[0].name === NEXT,
  "settings cache refreshes after the rename"
);

const legacyOnly = createStorage({
  "nutrients-day-notes": JSON.stringify({
    version: 2,
    days: { "2017-01-01": OLD + " *2" },
  }),
});
loadApp(legacyOnly).NutrientsPersist.applyFoodTextMigrations(rulesFile());
assert(legacyOnly.getItem("nutrients-day-notes") == null, "legacy-only day key is removed");
const legacyOrphan = JSON.parse(legacyOnly.getItem("nutrients_orphan_legacy"));
assert(
  legacyOrphan.dayMeals.days["2017-01-01"] === NEXT + " *2",
  "legacy-only day text is renamed in the orphan payload"
);

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("all food text migration checks passed");
