/**
 * NutrientsAuth + NutrientsPersist — multi-user localStorage repositories.
 * UI must not call localStorage directly for app data.
 *
 * Tables:
 *   nutrients_users              User[]
 *   nutrients_session            Session | null
 *   nutrients_food_definitions   FoodDefinition[]  (+ userId)
 *   nutrients_day_meals          DayMealsRow[]     (+ userId)
 *   nutrients_meals              SavedMeal[]       (+ userId)
 *   nutrients_exercise_definitions UserExercise[]  (+ userId; built-ins ship in data-exercises/)
 *   nutrients_day_exercises      { date, entries[] }[] (+ userId; Food Entry exercise layer)
 *   nutrients_favorites          Favorite[]        (+ userId)
 *   nutrients_settings           SettingsRow[]     (+ userId)
 *
 * Food-name renames live in migrations/food-text.json. applyFoodTextMigrations()
 * rewrites matching text in every nutrients localStorage value except accounts
 * and the session. A trailing serving operator such as " *2" stays put.
 */
var NutrientsAuth = (function () {
  var KEYS = {
    USERS: "nutrients_users",
    SESSION: "nutrients_session",
  };

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      /* ignore */
    }
  }

  function loadJson(key) {
    var raw = safeGet(key);
    if (raw == null || raw === "") return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveJson(key, value) {
    try {
      return safeSet(key, JSON.stringify(value));
    } catch (e) {
      return false;
    }
  }

  function normalizeEmail(email) {
    return String(email || "")
      .trim()
      .toLowerCase();
  }

  function loadUsers() {
    var data = loadJson(KEYS.USERS);
    return Array.isArray(data) ? data : [];
  }

  function saveUsers(users) {
    return saveJson(KEYS.USERS, Array.isArray(users) ? users : []);
  }

  function makeUserId() {
    return (
      "user-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 11)
    );
  }

  function getSession() {
    var session = loadJson(KEYS.SESSION);
    if (!session || typeof session !== "object") return null;
    if (!session.userId || !session.email) return null;
    return {
      userId: String(session.userId),
      email: normalizeEmail(session.email),
    };
  }

  function setSession(session) {
    if (!session) {
      safeRemove(KEYS.SESSION);
      return true;
    }
    return saveJson(KEYS.SESSION, {
      userId: String(session.userId),
      email: normalizeEmail(session.email),
    });
  }

  function findUserByEmail(email) {
    var needle = normalizeEmail(email);
    var users = loadUsers();
    for (var i = 0; i < users.length; i++) {
      if (normalizeEmail(users[i].email) === needle) return users[i];
    }
    return null;
  }

  function findUserById(userId) {
    var users = loadUsers();
    for (var i = 0; i < users.length; i++) {
      if (String(users[i].id) === String(userId)) return users[i];
    }
    return null;
  }

  function signup(email, password) {
    var normalized = normalizeEmail(email);
    var pass = String(password || "");
    if (!normalized || normalized.indexOf("@") < 1) {
      return { ok: false, error: "Enter a valid email." };
    }
    if (!pass) {
      return { ok: false, error: "Enter a password." };
    }
    if (findUserByEmail(normalized)) {
      return { ok: false, error: "An account with that email already exists." };
    }
    var user = {
      id: makeUserId(),
      email: normalized,
      password: pass,
      createdAt: new Date().toISOString(),
    };
    var users = loadUsers();
    var isFirstUser = users.length === 0;
    users.push(user);
    saveUsers(users);
    setSession({ userId: user.id, email: user.email });
    if (
      typeof NutrientsPersist !== "undefined" &&
      NutrientsPersist.claimOrphanForUser
    ) {
      NutrientsPersist.claimOrphanForUser(user.id, isFirstUser);
    }
    return {
      ok: true,
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    };
  }

  function login(email, password) {
    var normalized = normalizeEmail(email);
    var pass = String(password || "");
    var user = findUserByEmail(normalized);
    if (!user || String(user.password) !== pass) {
      return { ok: false, error: "Invalid email or password." };
    }
    setSession({ userId: user.id, email: user.email });
    return {
      ok: true,
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    };
  }

  function logout() {
    setSession(null);
    if (typeof NutrientsPersist !== "undefined" && NutrientsPersist.clearCache) {
      NutrientsPersist.clearCache();
    }
  }

  function getCurrentUserId() {
    var session = getSession();
    return session ? session.userId : null;
  }

  function isLoggedIn() {
    return !!getCurrentUserId();
  }

  function getCurrentUser() {
    var session = getSession();
    if (!session) return null;
    var user = findUserById(session.userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  return {
    KEYS: KEYS,
    signup: signup,
    login: login,
    logout: logout,
    getSession: getSession,
    getCurrentUserId: getCurrentUserId,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
  };
})();

var NutrientsPersist = (function () {
  var SCHEMA_VERSION = 2;

  var KEYS = {
    FOOD_DEFINITIONS: "nutrients_food_definitions",
    DAY_MEALS: "nutrients_day_meals",
    MEALS: "nutrients_meals",
    FAVORITES: "nutrients_favorites",
    SETTINGS: "nutrients_settings",
    GUEST_STARTER_GUIDE_SEEN: "nutrients_guest_starter_guide_seen",
    GUEST_DIARY_COVERAGE: "nutrients_guest_diary_coverage",
    GUEST_MISC_DEFICIENCIES: "nutrients_guest_misc_deficiencies",
    GUEST_COVERAGE_CLICK_ACTION: "nutrients_guest_coverage_click_action",
    ORPHAN_LEGACY: "nutrients_orphan_legacy",
    EXERCISE_DEFINITIONS: "nutrients_exercise_definitions",
    DAY_EXERCISES: "nutrients_day_exercises",
  };

  var LEGACY = {
    FOOD_DEFINITIONS: "nutrients-food-definitions",
    FOOD_DEFINITIONS_OLDER: "nutrients-keywords",
    DAY_MEALS: "nutrients-day-notes",
    FAVORITES: "nutrients-favorites",
    DEMOGRAPHIC: "nutrients-demographic",
    BODY_WEIGHT_KG: "nutrients-body-weight-kg",
    TDEE: "nutrients-tdee",
    VIEWED_WEEK: "nutrients-viewed-week-start",
    DAY_EDITOR_HEIGHT: "nutrients-day-editor-height",
    DAY_HIGHLIGHTS: "nutrients-day-highlights",
    REORDER: "nutrients-keywords-reorder-open",
    CALORIES: "nutrients-keywords-calories-open",
    KEYWORDS_PAGE_SIZE: "nutrients-keywords-page-size",
    MICRO_VIEW_DAILY: "nutrients-micro-view-daily",
    MICRO_SHOW_DV: "nutrients-micro-show-dv",
    SHOW_ACUTE_SIDE_EFFECTS: "nutrients-show-acute-side-effects",
    SHOW_ACUTE_ADVERSE_EFFECTS: "nutrients-show-acute-adverse-effects",
    SHOW_DAILY_INTAKE_ICONS: "nutrients-show-daily-intake-icons",
    FILTER_DAILY_INTAKE: "nutrients-filter-daily-intake",
    FILTER_SIDE_EFFECTS: "nutrients-filter-side-effects",
    FILTER_ADVERSE_EFFECTS: "nutrients-filter-adverse-effects",
    FILTER_NUTRIENTS: "nutrients-filter-nutrients",
    HIGHLIGHT_DAILY_INTAKE: "nutrients-highlight-daily-intake",
    HIGHLIGHT_SIDE_EFFECTS: "nutrients-highlight-side-effects",
    HIGHLIGHT_ADVERSE_EFFECTS: "nutrients-highlight-adverse-effects",
  };

  var settingsCache = null;
  var settingsCacheUserId = null;
  var migrated = false;

  function defaultSettings() {
    return {
      version: SCHEMA_VERSION,
      demographic: "male",
      tdee: null,
      tdeeCalc: null,
      macroSplit: null,
      bodyWeightKg: null,
      weightTrend: {
        abandonedWeeks: [],
        entries: [],
      },
      viewedWeekStart: null,
      dayEditorHeight: null,
      dayHighlights: true,
      diaryCoverageMute: { days: false, week: false },
      miscDeficiencies: true,
      coverageClickAction: "jump",
      dayWordWrap: true,
      dayEntryAdvanced: false,
      starterGuideSeen: false,
      quizFavoriteFoods: [],
      microViewDaily: false,
      microShowDv: false,
      showAcuteSideEffects: false,
      showAcuteAdverseEffects: false,
      showDailyIntakeIcons: true,
      filterDailyIntake: false,
      filterSideEffects: false,
      filterAdverseEffects: false,
      filterNutrients: [],
      highlightDailyIntake: false,
      highlightSideEffects: false,
      highlightAdverseEffects: false,
      keywordsReorderOpen: false,
      keywordsCaloriesOpen: false,
      keywordsPageSize: 25,
      experimentalWeek: null,
      breakfastFoods: [],
      breakfastMissingBelowPct: null,
    };
  }

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      /* ignore */
    }
  }

  function loadJson(key) {
    var raw = safeGet(key);
    if (raw == null || raw === "") return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveJson(key, value) {
    try {
      return safeSet(key, JSON.stringify(value));
    } catch (e) {
      return false;
    }
  }

  function currentUserId() {
    return typeof NutrientsAuth !== "undefined"
      ? NutrientsAuth.getCurrentUserId()
      : null;
  }

  function isLoggedIn() {
    return !!currentUserId();
  }

  function clearCache() {
    settingsCache = null;
    settingsCacheUserId = null;
  }

  function stripUserId(row) {
    if (!row || typeof row !== "object") return row;
    var copy = Object.assign({}, row);
    delete copy.userId;
    return copy;
  }

  function withUserId(row, userId) {
    var copy = Object.assign({}, row);
    copy.userId = userId;
    return copy;
  }

  function replaceUserRows(allRows, userId, nextRows) {
    var others = (Array.isArray(allRows) ? allRows : []).filter(function (row) {
      return row && String(row.userId) !== String(userId);
    });
    return others.concat(nextRows);
  }

  function rowsForUser(allRows, userId) {
    if (!Array.isArray(allRows) || !userId) return [];
    return allRows.filter(function (row) {
      return row && String(row.userId) === String(userId);
    });
  }

  function legacyBoolTrue(key) {
    return safeGet(key) === "true";
  }

  function legacyBoolNotFalse(key) {
    return safeGet(key) !== "false";
  }

  function legacyPositiveNumber(key) {
    var raw = safeGet(key);
    if (raw == null || raw === "") return null;
    var n = parseFloat(raw);
    return !isNaN(n) && n > 0 ? n : null;
  }

  function legacyPositiveInt(key) {
    var raw = safeGet(key);
    if (raw == null || raw === "") return null;
    var n = parseInt(raw, 10);
    return !isNaN(n) && n > 0 ? n : null;
  }

  function migrateSettingsFromLegacy() {
    var settings = defaultSettings();
    var hasAny = false;

    var demo = safeGet(LEGACY.DEMOGRAPHIC);
    if (demo === "male" || demo === "female") {
      settings.demographic = demo;
      hasAny = true;
    }

    var tdee = legacyPositiveNumber(LEGACY.TDEE);
    if (tdee != null) {
      settings.tdee = tdee;
      hasAny = true;
    }

    var bw = legacyPositiveNumber(LEGACY.BODY_WEIGHT_KG);
    if (bw != null) {
      settings.bodyWeightKg = bw;
      hasAny = true;
    }

    var week = safeGet(LEGACY.VIEWED_WEEK);
    if (week) {
      settings.viewedWeekStart = week;
      hasAny = true;
    }

    var height = legacyPositiveInt(LEGACY.DAY_EDITOR_HEIGHT);
    if (height != null) {
      settings.dayEditorHeight = height;
      hasAny = true;
    }

    if (safeGet(LEGACY.DAY_HIGHLIGHTS) != null) {
      settings.dayHighlights = safeGet(LEGACY.DAY_HIGHLIGHTS) !== "off";
      hasAny = true;
    }

    if (safeGet(LEGACY.MICRO_VIEW_DAILY) != null) {
      settings.microViewDaily = legacyBoolTrue(LEGACY.MICRO_VIEW_DAILY);
      hasAny = true;
    }
    if (safeGet(LEGACY.MICRO_SHOW_DV) != null) {
      settings.microShowDv = legacyBoolTrue(LEGACY.MICRO_SHOW_DV);
      hasAny = true;
    }
    if (safeGet(LEGACY.SHOW_ACUTE_SIDE_EFFECTS) != null) {
      settings.showAcuteSideEffects = legacyBoolTrue(
        LEGACY.SHOW_ACUTE_SIDE_EFFECTS
      );
      hasAny = true;
    }
    if (safeGet(LEGACY.SHOW_ACUTE_ADVERSE_EFFECTS) != null) {
      settings.showAcuteAdverseEffects = legacyBoolTrue(
        LEGACY.SHOW_ACUTE_ADVERSE_EFFECTS
      );
      hasAny = true;
    }
    if (safeGet(LEGACY.SHOW_DAILY_INTAKE_ICONS) != null) {
      settings.showDailyIntakeIcons = legacyBoolNotFalse(
        LEGACY.SHOW_DAILY_INTAKE_ICONS
      );
      hasAny = true;
    }

    if (safeGet(LEGACY.FILTER_DAILY_INTAKE) != null) {
      settings.filterDailyIntake = legacyBoolTrue(LEGACY.FILTER_DAILY_INTAKE);
      hasAny = true;
    }
    if (safeGet(LEGACY.FILTER_SIDE_EFFECTS) != null) {
      settings.filterSideEffects = legacyBoolTrue(LEGACY.FILTER_SIDE_EFFECTS);
      hasAny = true;
    }
    if (safeGet(LEGACY.FILTER_ADVERSE_EFFECTS) != null) {
      settings.filterAdverseEffects = legacyBoolTrue(
        LEGACY.FILTER_ADVERSE_EFFECTS
      );
      hasAny = true;
    }
    var rawNutrients = safeGet(LEGACY.FILTER_NUTRIENTS);
    if (rawNutrients) {
      try {
        var parsed = JSON.parse(rawNutrients);
        if (Array.isArray(parsed)) {
          settings.filterNutrients = parsed.filter(function (k) {
            return typeof k === "string";
          });
          hasAny = true;
        }
      } catch (e) {
        /* ignore */
      }
    }

    if (safeGet(LEGACY.HIGHLIGHT_DAILY_INTAKE) != null) {
      settings.highlightDailyIntake = legacyBoolTrue(
        LEGACY.HIGHLIGHT_DAILY_INTAKE
      );
      hasAny = true;
    }
    if (safeGet(LEGACY.HIGHLIGHT_SIDE_EFFECTS) != null) {
      settings.highlightSideEffects = legacyBoolTrue(
        LEGACY.HIGHLIGHT_SIDE_EFFECTS
      );
      hasAny = true;
    }
    if (safeGet(LEGACY.HIGHLIGHT_ADVERSE_EFFECTS) != null) {
      settings.highlightAdverseEffects = legacyBoolTrue(
        LEGACY.HIGHLIGHT_ADVERSE_EFFECTS
      );
      hasAny = true;
    }

    if (safeGet(LEGACY.REORDER) != null) {
      settings.keywordsReorderOpen = legacyBoolTrue(LEGACY.REORDER);
      hasAny = true;
    }
    if (safeGet(LEGACY.CALORIES) != null) {
      settings.keywordsCaloriesOpen = legacyBoolTrue(LEGACY.CALORIES);
      hasAny = true;
    }
    var pageSizeRaw = safeGet(LEGACY.KEYWORDS_PAGE_SIZE);
    if (pageSizeRaw != null && pageSizeRaw !== "") {
      var pageSize = parseInt(pageSizeRaw, 10);
      if (
        pageSize === 0 ||
        pageSize === 10 ||
        pageSize === 25 ||
        pageSize === 50 ||
        pageSize === 100
      ) {
        settings.keywordsPageSize = pageSize;
        hasAny = true;
      }
    }

    return hasAny ? settings : null;
  }

  function removeHyphenLegacyKeys() {
    Object.keys(LEGACY).forEach(function (name) {
      safeRemove(LEGACY[name]);
    });
  }

  function isSingleUserFoodTable(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every(function (row) {
      return row && typeof row === "object" && row.userId == null;
    });
  }

  function isSingleUserDayMeals(data) {
    return !!(
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      (data.version != null || data.days != null || data.mon != null)
    );
  }

  function isSingleUserFavorites(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every(function (row) {
      return row && typeof row === "object" && row.userId == null;
    });
  }

  function isSingleUserSettings(data) {
    return !!(
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      (data.demographic != null ||
        data.version != null ||
        data.keywordsPageSize != null)
    );
  }

  function isMultiUserFoodTable(data) {
    return (
      Array.isArray(data) &&
      (data.length === 0 ||
        data.every(function (row) {
          return row && row.userId != null;
        }))
    );
  }

  function isMultiUserDayMeals(data) {
    return Array.isArray(data);
  }

  function isMultiUserFavorites(data) {
    return (
      Array.isArray(data) &&
      (data.length === 0 ||
        data.every(function (row) {
          return row && row.userId != null;
        }))
    );
  }

  function isMultiUserSavedMeals(data) {
    return isMultiUserFavorites(data);
  }

  function isMultiUserSettings(data) {
    return Array.isArray(data);
  }

  function captureOrphanFromSingleUserTables() {
    if (safeGet(KEYS.ORPHAN_LEGACY)) return;

    var foods = loadJson(KEYS.FOOD_DEFINITIONS);
    var meals = loadJson(KEYS.DAY_MEALS);
    var favs = loadJson(KEYS.FAVORITES);
    var settings = loadJson(KEYS.SETTINGS);

    var orphan = {
      foodDefinitions: null,
      dayMeals: null,
      favorites: null,
      settings: null,
    };
    var hasAny = false;

    if (isSingleUserFoodTable(foods)) {
      orphan.foodDefinitions = foods;
      hasAny = true;
      saveJson(KEYS.FOOD_DEFINITIONS, []);
    } else if (!isMultiUserFoodTable(foods) && foods != null) {
      saveJson(KEYS.FOOD_DEFINITIONS, []);
    }

    if (isSingleUserDayMeals(meals)) {
      orphan.dayMeals = meals;
      hasAny = true;
      saveJson(KEYS.DAY_MEALS, []);
    } else if (!isMultiUserDayMeals(meals) && meals != null) {
      saveJson(KEYS.DAY_MEALS, []);
    }

    if (isSingleUserFavorites(favs)) {
      orphan.favorites = favs;
      hasAny = true;
      saveJson(KEYS.FAVORITES, []);
    } else if (!isMultiUserFavorites(favs) && favs != null) {
      saveJson(KEYS.FAVORITES, []);
    }

    if (isSingleUserSettings(settings)) {
      orphan.settings = settings;
      hasAny = true;
      saveJson(KEYS.SETTINGS, []);
    } else if (!isMultiUserSettings(settings) && settings != null) {
      saveJson(KEYS.SETTINGS, []);
    }

    if (hasAny) saveJson(KEYS.ORPHAN_LEGACY, orphan);
  }

  function ensureMultiUserTableShapes() {
    if (!isMultiUserFoodTable(loadJson(KEYS.FOOD_DEFINITIONS))) {
      if (safeGet(KEYS.FOOD_DEFINITIONS) == null) {
        saveJson(KEYS.FOOD_DEFINITIONS, []);
      }
    }
    if (!isMultiUserDayMeals(loadJson(KEYS.DAY_MEALS))) {
      if (safeGet(KEYS.DAY_MEALS) == null) {
        saveJson(KEYS.DAY_MEALS, []);
      }
    }
    if (!isMultiUserFavorites(loadJson(KEYS.FAVORITES))) {
      if (safeGet(KEYS.FAVORITES) == null) {
        saveJson(KEYS.FAVORITES, []);
      }
    }
    if (!isMultiUserSavedMeals(loadJson(KEYS.MEALS))) {
      if (safeGet(KEYS.MEALS) == null) {
        saveJson(KEYS.MEALS, []);
      }
    }
    if (!isMultiUserSettings(loadJson(KEYS.SETTINGS))) {
      if (safeGet(KEYS.SETTINGS) == null) {
        saveJson(KEYS.SETTINGS, []);
      }
    }
  }

  function migrateIfNeeded() {
    if (migrated) return;
    migrated = true;

    var hasNewFood = safeGet(KEYS.FOOD_DEFINITIONS) != null;
    var hasNewMeals = safeGet(KEYS.DAY_MEALS) != null;
    var hasNewFavorites = safeGet(KEYS.FAVORITES) != null;
    var hasNewSettings = safeGet(KEYS.SETTINGS) != null;

    if (!hasNewFood) {
      var foodRaw =
        safeGet(LEGACY.FOOD_DEFINITIONS) ||
        safeGet(LEGACY.FOOD_DEFINITIONS_OLDER);
      if (foodRaw) safeSet(KEYS.FOOD_DEFINITIONS, foodRaw);
    }

    if (!hasNewMeals) {
      var mealsRaw = safeGet(LEGACY.DAY_MEALS);
      if (mealsRaw) safeSet(KEYS.DAY_MEALS, mealsRaw);
    }

    if (!hasNewFavorites) {
      var favRaw = safeGet(LEGACY.FAVORITES);
      if (favRaw) safeSet(KEYS.FAVORITES, favRaw);
    }

    if (!hasNewSettings) {
      var fromLegacy = migrateSettingsFromLegacy();
      if (fromLegacy) saveJson(KEYS.SETTINGS, fromLegacy);
    }

    var anyHyphenLegacy =
      safeGet(LEGACY.FOOD_DEFINITIONS) != null ||
      safeGet(LEGACY.FOOD_DEFINITIONS_OLDER) != null ||
      safeGet(LEGACY.DAY_MEALS) != null ||
      safeGet(LEGACY.FAVORITES) != null ||
      safeGet(LEGACY.DEMOGRAPHIC) != null ||
      safeGet(LEGACY.TDEE) != null ||
      safeGet(LEGACY.BODY_WEIGHT_KG) != null ||
      safeGet(LEGACY.VIEWED_WEEK) != null ||
      safeGet(LEGACY.DAY_EDITOR_HEIGHT) != null ||
      safeGet(LEGACY.DAY_HIGHLIGHTS) != null ||
      safeGet(LEGACY.REORDER) != null ||
      safeGet(LEGACY.CALORIES) != null ||
      safeGet(LEGACY.KEYWORDS_PAGE_SIZE) != null ||
      safeGet(LEGACY.MICRO_VIEW_DAILY) != null ||
      safeGet(LEGACY.MICRO_SHOW_DV) != null ||
      safeGet(LEGACY.SHOW_ACUTE_SIDE_EFFECTS) != null ||
      safeGet(LEGACY.SHOW_ACUTE_ADVERSE_EFFECTS) != null ||
      safeGet(LEGACY.SHOW_DAILY_INTAKE_ICONS) != null ||
      safeGet(LEGACY.FILTER_DAILY_INTAKE) != null ||
      safeGet(LEGACY.FILTER_SIDE_EFFECTS) != null ||
      safeGet(LEGACY.FILTER_ADVERSE_EFFECTS) != null ||
      safeGet(LEGACY.FILTER_NUTRIENTS) != null ||
      safeGet(LEGACY.HIGHLIGHT_DAILY_INTAKE) != null ||
      safeGet(LEGACY.HIGHLIGHT_SIDE_EFFECTS) != null ||
      safeGet(LEGACY.HIGHLIGHT_ADVERSE_EFFECTS) != null;

    if (anyHyphenLegacy) removeHyphenLegacyKeys();

    captureOrphanFromSingleUserTables();
    ensureMultiUserTableShapes();
  }

  function claimOrphanForUser(userId, isFirstUser) {
    migrateIfNeeded();
    if (!userId || !isFirstUser) return false;
    var orphan = loadJson(KEYS.ORPHAN_LEGACY);
    if (!orphan || typeof orphan !== "object") return false;

    if (Array.isArray(orphan.foodDefinitions) && orphan.foodDefinitions.length) {
      var foodRows = orphan.foodDefinitions.map(function (row) {
        return withUserId(stripUserId(row), userId);
      });
      saveJson(
        KEYS.FOOD_DEFINITIONS,
        replaceUserRows(loadJson(KEYS.FOOD_DEFINITIONS), userId, foodRows)
      );
    }

    if (orphan.dayMeals && typeof orphan.dayMeals === "object") {
      var mealRow;
      if (
        orphan.dayMeals.version === 2 &&
        orphan.dayMeals.days &&
        typeof orphan.dayMeals.days === "object" &&
        !Array.isArray(orphan.dayMeals.days)
      ) {
        mealRow = withUserId(
          {
            version: 2,
            days: Object.assign({}, orphan.dayMeals.days),
            ignoredDays: normalizeIgnoredDays(orphan.dayMeals.ignoredDays),
          },
          userId
        );
      } else {
        mealRow = withUserId(
          {
            version: 2,
            days: {},
            _legacyWeek: orphan.dayMeals,
          },
          userId
        );
      }
      saveJson(
        KEYS.DAY_MEALS,
        replaceUserRows(loadJson(KEYS.DAY_MEALS), userId, [mealRow])
      );
    }

    if (Array.isArray(orphan.favorites) && orphan.favorites.length) {
      var favRows = orphan.favorites.map(function (row) {
        return withUserId(stripUserId(row), userId);
      });
      saveJson(
        KEYS.FAVORITES,
        replaceUserRows(loadJson(KEYS.FAVORITES), userId, favRows)
      );
    }

    if (orphan.settings && typeof orphan.settings === "object") {
      var settingsRow = withUserId(
        Object.assign(defaultSettings(), stripUserId(orphan.settings)),
        userId
      );
      settingsRow.version = SCHEMA_VERSION;
      saveJson(
        KEYS.SETTINGS,
        replaceUserRows(loadJson(KEYS.SETTINGS), userId, [settingsRow])
      );
    }

    safeRemove(KEYS.ORPHAN_LEGACY);
    clearCache();
    return true;
  }

  function loadFoodDefinitions() {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId) return null;
    return rowsForUser(loadJson(KEYS.FOOD_DEFINITIONS), userId).map(stripUserId);
  }

  function saveFoodDefinitions(rows) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId || !Array.isArray(rows)) return false;
    var next = rows.map(function (row) {
      return withUserId(stripUserId(row), userId);
    });
    return saveJson(
      KEYS.FOOD_DEFINITIONS,
      replaceUserRows(loadJson(KEYS.FOOD_DEFINITIONS), userId, next)
    );
  }

  function normalizeIgnoredDays(raw) {
    var out = {};
    if (!raw) return out;
    if (Array.isArray(raw)) {
      raw.forEach(function (key) {
        if (typeof key === "string" && key) out[key] = true;
      });
      return out;
    }
    if (typeof raw !== "object") return out;
    Object.keys(raw).forEach(function (key) {
      if (raw[key]) out[key] = true;
    });
    return out;
  }

  function loadDayMeals() {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId) return null;
    var rows = rowsForUser(loadJson(KEYS.DAY_MEALS), userId);
    if (!rows.length) return null;
    var row = stripUserId(rows[0]);
    if (row._legacyWeek) {
      return row._legacyWeek;
    }
    return {
      version: row.version || 2,
      days: row.days && typeof row.days === "object" ? row.days : {},
      ignoredDays: normalizeIgnoredDays(row.ignoredDays),
    };
  }

  function saveDayMeals(payload) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId || !payload || typeof payload !== "object") return false;
    var row = withUserId(
      {
        version: payload.version || 2,
        days:
          payload.days && typeof payload.days === "object" ? payload.days : {},
        ignoredDays: normalizeIgnoredDays(payload.ignoredDays),
      },
      userId
    );
    return saveJson(
      KEYS.DAY_MEALS,
      replaceUserRows(loadJson(KEYS.DAY_MEALS), userId, [row])
    );
  }

  function loadFavorites() {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId) return null;
    return rowsForUser(loadJson(KEYS.FAVORITES), userId).map(stripUserId);
  }

  function saveFavorites(rows) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId || !Array.isArray(rows)) return false;
    var next = rows.map(function (row) {
      return withUserId(stripUserId(row), userId);
    });
    return saveJson(
      KEYS.FAVORITES,
      replaceUserRows(loadJson(KEYS.FAVORITES), userId, next)
    );
  }

  function loadMeals() {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId) return null;
    return rowsForUser(loadJson(KEYS.MEALS), userId).map(stripUserId);
  }

  function saveMeals(rows) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId || !Array.isArray(rows)) return false;
    var next = rows.map(function (row) {
      return withUserId(stripUserId(row), userId);
    });
    return saveJson(
      KEYS.MEALS,
      replaceUserRows(loadJson(KEYS.MEALS), userId, next)
    );
  }

  function loadUserRowsForKey(key) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId) return null;
    return rowsForUser(loadJson(key), userId).map(stripUserId);
  }

  function saveUserRowsForKey(key, rows) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId || !Array.isArray(rows)) return false;
    var next = rows.map(function (row) {
      return withUserId(stripUserId(row), userId);
    });
    return saveJson(key, replaceUserRows(loadJson(key), userId, next));
  }

  /** User-added exercise definitions (built-ins load from data-exercises/). */
  function loadExerciseDefinitions() {
    return loadUserRowsForKey(KEYS.EXERCISE_DEFINITIONS);
  }

  function saveExerciseDefinitions(rows) {
    return saveUserRowsForKey(KEYS.EXERCISE_DEFINITIONS, rows);
  }

  /** Per-date exercise entries: [{ date: "YYYY-MM-DD", entries: [...] }]. */
  function loadDayExercises() {
    return loadUserRowsForKey(KEYS.DAY_EXERCISES);
  }

  function saveDayExercises(rows) {
    return saveUserRowsForKey(KEYS.DAY_EXERCISES, rows);
  }

  function loadSettings() {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId) {
      clearCache();
      return Object.assign({}, defaultSettings());
    }
    if (settingsCache && settingsCacheUserId === userId) {
      return Object.assign({}, settingsCache);
    }
    var rows = rowsForUser(loadJson(KEYS.SETTINGS), userId);
    var loaded = rows.length ? stripUserId(rows[0]) : null;
    settingsCache = Object.assign(defaultSettings(), loaded || {});
    settingsCacheUserId = userId;
    if (!Array.isArray(settingsCache.filterNutrients)) {
      settingsCache.filterNutrients = [];
    }
    settingsCache.version = SCHEMA_VERSION;
    return Object.assign({}, settingsCache);
  }

  function saveSettings(settings) {
    migrateIfNeeded();
    var userId = currentUserId();
    if (!userId || !settings || typeof settings !== "object") return false;
    settingsCache = Object.assign(defaultSettings(), stripUserId(settings));
    settingsCache.version = SCHEMA_VERSION;
    if (!Array.isArray(settingsCache.filterNutrients)) {
      settingsCache.filterNutrients = [];
    }
    settingsCacheUserId = userId;
    var row = withUserId(settingsCache, userId);
    return saveJson(
      KEYS.SETTINGS,
      replaceUserRows(loadJson(KEYS.SETTINGS), userId, [row])
    );
  }

  function patchSettings(partial) {
    var current = loadSettings();
    if (!currentUserId()) return current;
    if (!partial || typeof partial !== "object") return current;
    Object.keys(partial).forEach(function (key) {
      current[key] = partial[key];
    });
    saveSettings(current);
    return Object.assign({}, settingsCache || current);
  }

  function getSetting(key) {
    return loadSettings()[key];
  }

  function setSetting(key, value) {
    var partial = {};
    partial[key] = value;
    return patchSettings(partial);
  }

  function normalizeDiaryCoverageMute(value) {
    return {
      days: !!(value && value.days),
      week: !!(value && value.week),
    };
  }

  function getDiaryCoverageMute() {
    if (currentUserId()) {
      return normalizeDiaryCoverageMute(getSetting("diaryCoverageMute"));
    }
    var raw = safeGet(KEYS.GUEST_DIARY_COVERAGE);
    if (!raw) return { days: false, week: false };
    try {
      return normalizeDiaryCoverageMute(JSON.parse(raw));
    } catch (e) {
      return { days: false, week: false };
    }
  }

  function setDiaryCoverageMute(value) {
    var next = normalizeDiaryCoverageMute(value);
    if (currentUserId()) return setSetting("diaryCoverageMute", next);
    return safeSet(KEYS.GUEST_DIARY_COVERAGE, JSON.stringify(next));
  }

  // Default on when unset, so existing users keep the current shortfall set.
  function normalizeMiscDeficiencies(value) {
    if (value === false || value === "false" || value === 0 || value === "0") {
      return false;
    }
    return true;
  }

  function getMiscDeficiencies() {
    if (currentUserId()) {
      return normalizeMiscDeficiencies(getSetting("miscDeficiencies"));
    }
    var raw = safeGet(KEYS.GUEST_MISC_DEFICIENCIES);
    if (raw == null || raw === "") return true;
    try {
      return normalizeMiscDeficiencies(JSON.parse(raw));
    } catch (e) {
      return normalizeMiscDeficiencies(raw);
    }
  }

  function setMiscDeficiencies(value) {
    var next = normalizeMiscDeficiencies(value);
    if (currentUserId()) return setSetting("miscDeficiencies", next);
    return safeSet(KEYS.GUEST_MISC_DEFICIENCIES, JSON.stringify(next));
  }

  var COVERAGE_CLICK_ACTIONS = { jump: true, yours: true, other: true, info: true };

  function normalizeCoverageClickAction(value) {
    var key = value == null ? "" : String(value);
    return COVERAGE_CLICK_ACTIONS[key] ? key : "jump";
  }

  function getCoverageClickAction() {
    if (currentUserId()) {
      return normalizeCoverageClickAction(getSetting("coverageClickAction"));
    }
    var raw = safeGet(KEYS.GUEST_COVERAGE_CLICK_ACTION);
    if (raw == null || raw === "") return "jump";
    try {
      return normalizeCoverageClickAction(JSON.parse(raw));
    } catch (e) {
      return normalizeCoverageClickAction(raw);
    }
  }

  function setCoverageClickAction(value) {
    var next = normalizeCoverageClickAction(value);
    if (currentUserId()) return setSetting("coverageClickAction", next);
    return safeSet(KEYS.GUEST_COVERAGE_CLICK_ACTION, JSON.stringify(next));
  }

  function hasSeenStarterGuide() {
    return currentUserId()
      ? getSetting("starterGuideSeen") === true
      : safeGet(KEYS.GUEST_STARTER_GUIDE_SEEN) === "true";
  }

  function markStarterGuideSeen() {
    if (hasSeenStarterGuide()) return;
    if (currentUserId()) {
      setSetting("starterGuideSeen", true);
    } else {
      safeSet(KEYS.GUEST_STARTER_GUIDE_SEEN, "true");
    }
  }

  var SKIP_TEXT_MIGRATION_KEYS = {
    nutrients_users: true,
    nutrients_session: true,
  };

  function normalizeFoodTextMigrations(data) {
    var list = data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      list = data.rules;
    }
    if (!Array.isArray(list)) return [];
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var rule = list[i];
      if (!rule || typeof rule.from !== "string" || typeof rule.to !== "string") {
        continue;
      }
      if (!rule.from || rule.from === rule.to) continue;
      out.push({ from: rule.from, to: rule.to });
    }
    return out;
  }

  /**
   * Replace `from` with `to`. When `to` already contains `from` (a prefix
   * rename such as "Apple" → "Apple with skin"), an existing `to` is left
   * alone so a later load does not keep inserting the phrase.
   * Characters after the match — including " *2" or "* 2/3" — stay in place.
   */
  function replaceFoodText(text, from, to) {
    if (typeof text !== "string" || typeof from !== "string" || typeof to !== "string") {
      return text;
    }
    if (!from || from === to || text.indexOf(from) === -1) return text;
    if (to.indexOf(from) === -1) return text.split(from).join(to);

    var fromInTo = to.indexOf(from);
    var out = "";
    var i = 0;
    while (i < text.length) {
      var at = text.indexOf(from, i);
      if (at === -1) {
        out += text.slice(i);
        break;
      }
      var start = at - fromInTo;
      if (start >= 0 && text.slice(start, start + to.length) === to) {
        var end = start + to.length;
        out += text.slice(i, end);
        i = end;
        continue;
      }
      out += text.slice(i, at);
      out += to;
      i = at + from.length;
    }
    return out;
  }

  function applyFoodTextRulesToString(text, rulesOrData) {
    var rules = normalizeFoodTextMigrations(rulesOrData);
    if (typeof text !== "string" || !rules.length) return text;
    var next = text;
    for (var i = 0; i < rules.length; i++) {
      next = replaceFoodText(next, rules[i].from, rules[i].to);
    }
    return next;
  }

  function mapFoodText(node, rules) {
    if (typeof node === "string") {
      var replaced = applyFoodTextRulesToString(node, rules);
      return replaced === node ? node : replaced;
    }
    if (Array.isArray(node)) {
      var arrChanged = false;
      var arr = new Array(node.length);
      for (var i = 0; i < node.length; i++) {
        var mappedItem = mapFoodText(node[i], rules);
        if (mappedItem !== node[i]) arrChanged = true;
        arr[i] = mappedItem;
      }
      return arrChanged ? arr : node;
    }
    if (node && typeof node === "object") {
      var keys = Object.keys(node);
      var objChanged = false;
      var out = {};
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        var nextKey = applyFoodTextRulesToString(key, rules);
        if (nextKey !== key) objChanged = true;
        var mapped = mapFoodText(node[key], rules);
        if (mapped !== node[key]) objChanged = true;
        out[nextKey] = mapped;
      }
      return objChanged ? out : node;
    }
    return node;
  }

  function localStorageKeys() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key) keys.push(key);
      }
    } catch (e) {
      return [];
    }
    return keys;
  }

  function isFoodTextStorageKey(key) {
    if (!key || SKIP_TEXT_MIGRATION_KEYS[key]) return false;
    return key.indexOf("nutrients_") === 0 || key.indexOf("nutrients-") === 0;
  }

  /**
   * Apply food-text renames to stored nutrients data for every user.
   * `data` is migrations/food-text.json (`{ rules: [...] }`) or a rules array.
   * Call this on load, before entity rows are copied into memory.
   */
  function applyFoodTextMigrations(data) {
    migrateIfNeeded();
    var rules = normalizeFoodTextMigrations(data);
    var changedKeys = [];
    if (!rules.length) {
      return { applied: 0, changedKeys: changedKeys };
    }

    var keys = localStorageKeys();
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!isFoodTextStorageKey(key)) continue;
      var raw = safeGet(key);
      if (typeof raw !== "string" || !raw) continue;
      var mentions = false;
      for (var r = 0; r < rules.length; r++) {
        if (raw.indexOf(rules[r].from) !== -1) {
          mentions = true;
          break;
        }
      }
      if (!mentions) continue;

      var parsed;
      var isJson = false;
      try {
        parsed = JSON.parse(raw);
        isJson = true;
      } catch (e) {
        parsed = raw;
      }
      var next = mapFoodText(parsed, rules);
      if (next === parsed) continue;
      var saved = isJson ? saveJson(key, next) : safeSet(key, next);
      if (!saved) continue;
      changedKeys.push(key);
      if (key === KEYS.SETTINGS) clearCache();
    }

    return { applied: rules.length, changedKeys: changedKeys };
  }

  return {
    KEYS: KEYS,
    SCHEMA_VERSION: SCHEMA_VERSION,
    defaultSettings: defaultSettings,
    migrate: migrateIfNeeded,
    normalizeFoodTextMigrations: normalizeFoodTextMigrations,
    applyFoodTextRulesToString: applyFoodTextRulesToString,
    applyFoodTextMigrations: applyFoodTextMigrations,
    clearCache: clearCache,
    claimOrphanForUser: claimOrphanForUser,
    isLoggedIn: isLoggedIn,
    loadFoodDefinitions: loadFoodDefinitions,
    saveFoodDefinitions: saveFoodDefinitions,
    loadDayMeals: loadDayMeals,
    saveDayMeals: saveDayMeals,
    loadFavorites: loadFavorites,
    saveFavorites: saveFavorites,
    loadMeals: loadMeals,
    saveMeals: saveMeals,
    loadExerciseDefinitions: loadExerciseDefinitions,
    saveExerciseDefinitions: saveExerciseDefinitions,
    loadDayExercises: loadDayExercises,
    saveDayExercises: saveDayExercises,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    patchSettings: patchSettings,
    getSetting: getSetting,
    setSetting: setSetting,
    getDiaryCoverageMute: getDiaryCoverageMute,
    setDiaryCoverageMute: setDiaryCoverageMute,
    getMiscDeficiencies: getMiscDeficiencies,
    setMiscDeficiencies: setMiscDeficiencies,
    getCoverageClickAction: getCoverageClickAction,
    setCoverageClickAction: setCoverageClickAction,
    hasSeenStarterGuide: hasSeenStarterGuide,
    markStarterGuideSeen: markStarterGuideSeen,
  };
})();
