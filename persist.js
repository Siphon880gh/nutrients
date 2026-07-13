/**
 * NutrientsPersist — localStorage repository (table-like keys).
 * App UI code should use this API; do not call localStorage directly for app data.
 */
var NutrientsPersist = (function () {
  var SCHEMA_VERSION = 1;

  var KEYS = {
    FOOD_DEFINITIONS: "nutrients_food_definitions",
    DAY_MEALS: "nutrients_day_meals",
    FAVORITES: "nutrients_favorites",
    SETTINGS: "nutrients_settings",
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
  var migrated = false;

  function defaultSettings() {
    return {
      version: SCHEMA_VERSION,
      demographic: "male",
      tdee: null,
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

  function removeLegacyKeys() {
    Object.keys(LEGACY).forEach(function (name) {
      safeRemove(LEGACY[name]);
    });
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

    var anyLegacy =
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

    if (anyLegacy) removeLegacyKeys();
  }

  function loadFoodDefinitions() {
    migrateIfNeeded();
    var data = loadJson(KEYS.FOOD_DEFINITIONS);
    return Array.isArray(data) ? data : null;
  }

  function saveFoodDefinitions(rows) {
    migrateIfNeeded();
    if (!Array.isArray(rows)) return false;
    return saveJson(KEYS.FOOD_DEFINITIONS, rows);
  }

  function loadDayMeals() {
    migrateIfNeeded();
    return loadJson(KEYS.DAY_MEALS);
  }

  function saveDayMeals(payload) {
    migrateIfNeeded();
    if (!payload || typeof payload !== "object") return false;
    return saveJson(KEYS.DAY_MEALS, payload);
  }

  function loadFavorites() {
    migrateIfNeeded();
    var data = loadJson(KEYS.FAVORITES);
    return Array.isArray(data) ? data : null;
  }

  function saveFavorites(rows) {
    migrateIfNeeded();
    if (!Array.isArray(rows)) return false;
    return saveJson(KEYS.FAVORITES, rows);
  }

  function loadSettings() {
    migrateIfNeeded();
    if (settingsCache) return Object.assign({}, settingsCache);
    var loaded = loadJson(KEYS.SETTINGS);
    settingsCache = Object.assign(defaultSettings(), loaded || {});
    if (!Array.isArray(settingsCache.filterNutrients)) {
      settingsCache.filterNutrients = [];
    }
    settingsCache.version = SCHEMA_VERSION;
    return Object.assign({}, settingsCache);
  }

  function saveSettings(settings) {
    migrateIfNeeded();
    if (!settings || typeof settings !== "object") return false;
    settingsCache = Object.assign(defaultSettings(), settings);
    settingsCache.version = SCHEMA_VERSION;
    if (!Array.isArray(settingsCache.filterNutrients)) {
      settingsCache.filterNutrients = [];
    }
    return saveJson(KEYS.SETTINGS, settingsCache);
  }

  function patchSettings(partial) {
    var current = loadSettings();
    if (!partial || typeof partial !== "object") return current;
    Object.keys(partial).forEach(function (key) {
      current[key] = partial[key];
    });
    saveSettings(current);
    return Object.assign({}, settingsCache);
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
