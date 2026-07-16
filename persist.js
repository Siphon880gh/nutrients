/**
 * NutrientsAuth + NutrientsPersist — multi-user localStorage repositories.
 * UI must not call localStorage directly for app data.
 *
 * Tables:
 *   nutrients_users              User[]
 *   nutrients_session            Session | null
 *   nutrients_food_definitions   FoodDefinition[]  (+ userId)
 *   nutrients_day_meals          DayMealsRow[]     (+ userId)
 *   nutrients_favorites          Favorite[]        (+ userId)
 *   nutrients_settings           SettingsRow[]     (+ userId)
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
    FAVORITES: "nutrients_favorites",
    SETTINGS: "nutrients_settings",
    ORPHAN_LEGACY: "nutrients_orphan_legacy",
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
      macroSplit: null,
      bodyWeightKg: null,
      viewedWeekStart: null,
      dayEditorHeight: null,
      dayHighlights: true,
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

  return {
    KEYS: KEYS,
    SCHEMA_VERSION: SCHEMA_VERSION,
    defaultSettings: defaultSettings,
    migrate: migrateIfNeeded,
    clearCache: clearCache,
    claimOrphanForUser: claimOrphanForUser,
    isLoggedIn: isLoggedIn,
    loadFoodDefinitions: loadFoodDefinitions,
    saveFoodDefinitions: saveFoodDefinitions,
    loadDayMeals: loadDayMeals,
    saveDayMeals: saveDayMeals,
    loadFavorites: loadFavorites,
    saveFavorites: saveFavorites,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    patchSettings: patchSettings,
    getSetting: getSetting,
    setSetting: setSetting,
  };
})();
