(function () {
  var DAYS = [
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "sat", label: "Sat" },
    { id: "sun", label: "Sun" },
  ];
  var STORAGE_KEY = "nutrients-food-definitions";
  var STORAGE_KEY_LEGACY = "nutrients-keywords";
  var STORAGE_KEY_DEMOGRAPHIC = "nutrients-demographic";
  var STORAGE_KEY_DAYS = "nutrients-day-notes";
  var STORAGE_KEY_REORDER = "nutrients-keywords-reorder-open";
  var demographicDv =
    typeof NutrientsDemographicDv !== "undefined" ? NutrientsDemographicDv : null;
  var longevityDv =
    typeof NutrientsLongevityDv !== "undefined" ? NutrientsLongevityDv : null;
  var DEFAULT_DEMOGRAPHIC = demographicDv
    ? demographicDv.DEFAULT_DEMOGRAPHIC
    : "male";
  var CAL_PROTEIN = 4;
  var CAL_CARBS = 4;
  var CAL_FATS = 9;
  var nextId = 1;

  var keywords = [];
  var keywordsListEl = document.getElementById("keywords-list");
  var keywordsTableEl = document.getElementById("keywords-table");
  var keywordsReorderToggleEl = document.getElementById("keywords-reorder-toggle");
  var keywordsEmptyEl = document.getElementById("keywords-empty");
  var keywordReorderOpen = false;
  var addKeywordBtn = document.getElementById("add-keyword");
  var dashboardGridEl = document.getElementById("dashboard-grid");
  var weekSummaryEl = document.getElementById("week-summary");
  var dashboardPrintBtn = document.getElementById("dashboard-print");
  var dashboardWeekToggleEl = document.getElementById("dashboard-week-toggle");
  var dashboardMicroToggleEl = document.getElementById("dashboard-micro-toggle");
  var dashboardMicroPanelEl = document.getElementById("dashboard-micro-panel");
  var dashboardMicroListEl = document.getElementById("dashboard-micro-list");
  var dashboardMicroDailyGridEl = document.getElementById("dashboard-micro-daily-grid");
  var dashboardMicroHintEl = document.getElementById("dashboard-micro-hint");
  var dashboardMicroViewWeeklyEl = document.getElementById("dashboard-micro-view-weekly");
  var dashboardMicroViewDailyEl = document.getElementById("dashboard-micro-view-daily");
  var dashboardMicroDvToggleEl = document.getElementById("dashboard-micro-dv-toggle");
  var dashboardLongevityToggleEl = document.getElementById("dashboard-longevity-toggle");
  var dashboardLongevityPanelEl = document.getElementById("dashboard-longevity-panel");
  var dashboardLongevityContentEl = document.getElementById("dashboard-longevity-content");
  var longevityModalEl = document.getElementById("longevity-modal");
  var longevityFormEl = document.getElementById("longevity-form");
  var longevityModalFoodEl = document.getElementById("longevity-modal-food");
  var longevityModalDoneBtn = document.getElementById("longevity-modal-done");
  var microGapsAiOpenBtn = document.getElementById("micro-gaps-ai-open");
  var microGapsModalEl = document.getElementById("micro-gaps-modal");
  var microGapsPreferenceEl = document.getElementById("micro-gaps-preference");
  var microGapsAdditionalEl = document.getElementById("micro-gaps-additional");
  var microGapsAiPreviewEl = document.getElementById("micro-gaps-ai-preview");
  var microGapsAiCopyBtn = document.getElementById("micro-gaps-ai-copy");
  var microGapsOpenChatgptEl = document.getElementById("micro-gaps-open-chatgpt");
  var microGapsOpenClaudeEl = document.getElementById("micro-gaps-open-claude");
  var microGapsModalDoneBtn = document.getElementById("micro-gaps-modal-done");
  var microDefModalEl = document.getElementById("micro-def-modal");
  var microDefModalTitleEl = document.getElementById("micro-def-modal-title");
  var microDefBodyEl = document.getElementById("micro-def-body");
  var microDefModalDoneBtn = document.getElementById("micro-def-modal-done");
  var microDefFullscreenToggleBtn = document.getElementById(
    "micro-def-fullscreen-toggle"
  );
  var microDefFullscreen = false;
  var demographicBadgeEl = document.getElementById("demographic-badge");
  var demographicOptionsEl = document.getElementById("demographic-options");
  var microModalEl = document.getElementById("micro-modal");
  var microFormEl = document.getElementById("micro-form");
  var microModalFoodEl = document.getElementById("micro-modal-food");
  var microModalDoneBtn = document.getElementById("micro-modal-done");
  var importModalEl = document.getElementById("import-modal");
  var importModalFoodEl = document.getElementById("import-modal-food");
  var importJsonEl = document.getElementById("import-json");
  var importErrorEl = document.getElementById("import-error");
  var importApplyBtn = document.getElementById("import-apply");
  var importCancelBtn = document.getElementById("import-cancel");
  var importAiToggleBtn = document.getElementById("import-ai-toggle");
  var importAiPanelEl = document.getElementById("import-ai-panel");
  var importAiPortionEl = document.getElementById("import-ai-portion");
  var importAiPreviewEl = document.getElementById("import-ai-preview");
  var importAiCopyBtn = document.getElementById("import-ai-copy");
  var importOpenChatgptEl = document.getElementById("import-open-chatgpt");
  var importOpenClaudeEl = document.getElementById("import-open-claude");
  var CHATGPT_URL = "https://chatgpt.com/";
  var CLAUDE_URL = "https://claude.ai/new";
  var importJsonWrapEl = document.getElementById("import-json-wrap");
  var importJsonLabelEl = document.getElementById("import-json-label");
  var importAllModalEl = document.getElementById("import-all-modal");
  var importAllJsonEl = document.getElementById("import-all-json");
  var importAllErrorEl = document.getElementById("import-all-error");
  var importAllApplyBtn = document.getElementById("import-all-apply");
  var importAllCancelBtn = document.getElementById("import-all-cancel");
  var exportAllFoodsBtn = document.getElementById("export-all-foods");
  var importAllFoodsBtn = document.getElementById("import-all-foods");
  var importSampleFoodsBtn = document.getElementById("import-sample-foods");
  var IMPORT_SAMPLE_FOODS_URL = "samples/definitions-food.json";
  var importAllMealsModalEl = document.getElementById("import-all-meals-modal");
  var importAllMealsJsonEl = document.getElementById("import-all-meals-json");
  var importAllMealsErrorEl = document.getElementById("import-all-meals-error");
  var importAllMealsApplyBtn = document.getElementById("import-all-meals-apply");
  var importAllMealsCancelBtn = document.getElementById("import-all-meals-cancel");
  var exportAllMealsBtn = document.getElementById("export-all-meals");
  var importAllMealsBtn = document.getElementById("import-all-meals");
  var activeMicroId = null;
  var activeImportId = null;
  var activeImportIndex = -1;
  var activePositionId = null;
  var activePositionIndex = -1;
  var keywordPositionModalEl = document.getElementById("keyword-position-modal");
  var keywordPositionFoodEl = document.getElementById("keyword-position-food");
  var keywordPositionSelectEl = document.getElementById("keyword-position-select");
  var keywordPositionErrorEl = document.getElementById("keyword-position-error");
  var keywordPositionApplyBtn = document.getElementById("keyword-position-apply");
  var keywordPositionCancelBtn = document.getElementById("keyword-position-cancel");
  var microSaveTimer;
  var demographic = DEFAULT_DEMOGRAPHIC;
  var weekTotalOpen = false;
  var microRequirementsOpen = false;
  var showMicroDailyDv = false;
  var microViewDaily = false;
  var longevityPanelOpen = false;
  var activeLongevityId = null;
  var longevitySaveTimer;
  var lastWeekTotals = null;
  var microDefinitions = {};
  var longevityDefinitions = {};
  var activeMicroDefKey = null;
  var activeLongevityDefKey = null;

  var LONGEVITY_DERIVED_DEFS = {
    omega6To3: { label: "Omega-6 : Omega-3 ratio", limiting: true },
    satToUnsat: { label: "Saturated : unsaturated fat ratio", limiting: true },
    epaPlusDha: { label: "EPA + DHA", limiting: false },
    glycemicLoad: { label: "Glycemic load (daily avg)", limiting: true },
  };

  var LONGEVITY_SECTION_DEFS = {
    sectionFats: { label: "Fats & cholesterol" },
    sectionOmega: { label: "Omega fatty acids" },
    sectionCompounds: { label: "Longevity & inflammation compounds" },
    sectionCarb: { label: "Carb quality & glycemic" },
    sectionMicronutrients: { label: "Micronutrients from food" },
    sectionCalcification: { label: "Calcification & vascular balance" },
    sectionDerived: { label: "Derived scores" },
    sectionTmao: { label: "TMAO balance" },
    sectionGlycemic: { label: "Glycemic load & GI distribution" },
  };

  var MICRO_FIELDS = [
    { key: "fiber", label: "Fiber", unit: "g", code: "f" },
    { key: "sodium", label: "Sodium", unit: "mg", code: "na" },
    { key: "potassium", label: "Potassium", unit: "mg", code: "k" },
    { key: "calcium", label: "Calcium", unit: "mg", code: "ca" },
    { key: "iron", label: "Iron", unit: "mg", code: "fe" },
    { key: "magnesium", label: "Magnesium", unit: "mg", code: "mg" },
    { key: "zinc", label: "Zinc", unit: "mg", code: "zn" },
    { key: "iodine", label: "Iodine", unit: "mcg", code: "i" },
    { key: "vitaminA", label: "Vitamin A", unit: "mcg", code: "a" },
    { key: "vitaminD", label: "Vitamin D", unit: "mcg", code: "d" },
    { key: "vitaminB12", label: "Vitamin B12", unit: "mcg", code: "b12" },
    { key: "vitaminB6", label: "Vitamin B6", unit: "mg", code: "b6" },
    { key: "vitaminC", label: "Vitamin C", unit: "mg", code: "c" },
    { key: "folate", label: "Folate", unit: "mcg", code: "fol" },
  ];

  var LONGEVITY_GROUPS = [
    { id: "fats", label: "Fats & cholesterol", sectionDefKey: "sectionFats" },
    { id: "omega", label: "Omega fatty acids", sectionDefKey: "sectionOmega" },
    {
      id: "compounds",
      label: "Longevity & inflammation compounds",
      sectionDefKey: "sectionCompounds",
    },
    { id: "carb", label: "Carb quality & glycemic", sectionDefKey: "sectionCarb" },
  ];

  var LONGEVITY_FROM_MICRO = [
    { microKey: "calcium", label: "Calcium", limiting: true },
    { microKey: "magnesium", label: "Magnesium", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
  ];

  var LONGEVITY_COMPOUNDS_FROM_MICRO = [
    { microKey: "iodine", label: "Iodine", limiting: false },
    { microKey: "fiber", label: "Fiber (prebiotic)", limiting: false },
  ];

  var LONGEVITY_TMAO_PRECURSOR_KEYS = ["choline", "carnitine", "betaine"];

  var LONGEVITY_TMAO_LOWERING_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber (prebiotic)" },
    { microKey: "vitaminD", label: "Vitamin D" },
    { microKey: "folate", label: "Folate (B9)" },
    { microKey: "vitaminB12", label: "Vitamin B12" },
    { microKey: "vitaminB6", label: "Vitamin B6" },
  ];

  var LONGEVITY_TMAO_LOWERING_LONGEVITY = [
    { key: "monounsaturatedFat", label: "Monounsaturated fat (olive oil)" },
    { key: "polyphenols", label: "Polyphenols" },
  ];

  /** Micro keys where high % DV is undesirable on the longevity panel */
  var LONGEVITY_MICRO_LIMITING_KEYS = {
    sodium: true,
  };

  var LONGEVITY_FIELDS = [
    {
      key: "saturatedFat",
      label: "Saturated fat",
      unit: "g",
      code: "sat",
      group: "fats",
      limiting: true,
    },
    {
      key: "monounsaturatedFat",
      label: "Monounsaturated fat",
      unit: "g",
      code: "mufa",
      group: "fats",
    },
    {
      key: "polyunsaturatedFat",
      label: "Polyunsaturated fat",
      unit: "g",
      code: "pufa",
      group: "fats",
    },
    {
      key: "transFat",
      label: "Trans fat",
      unit: "g",
      code: "trans",
      group: "fats",
      limiting: true,
    },
    {
      key: "cholesterol",
      label: "Cholesterol",
      unit: "mg",
      code: "chol",
      group: "fats",
      limiting: true,
    },
    { key: "omega3", label: "Omega-3 (total)", unit: "g", code: "o3", group: "omega" },
    {
      key: "omega6",
      label: "Omega-6 (total)",
      unit: "g",
      code: "o6",
      group: "omega",
      limiting: true,
    },
    { key: "omega9", label: "Omega-9", unit: "g", code: "o9", group: "omega" },
    { key: "ala", label: "ALA", unit: "g", code: "ala", group: "omega" },
    { key: "epa", label: "EPA", unit: "g", code: "epa", group: "omega" },
    { key: "dha", label: "DHA", unit: "g", code: "dha", group: "omega" },
    {
      key: "linoleicAcid",
      label: "Linoleic acid",
      unit: "g",
      code: "la",
      group: "omega",
      limiting: true,
    },
    {
      key: "arachidonicAcid",
      label: "Arachidonic acid",
      unit: "g",
      code: "aa",
      group: "omega",
      limiting: true,
    },
    { key: "oleicAcid", label: "Oleic acid", unit: "g", code: "ol", group: "omega" },
    {
      key: "palmitoleicAcid",
      label: "Palmitoleic acid (ω-7)",
      unit: "g",
      code: "po",
      group: "omega",
    },
    { key: "vitaminE", label: "Vitamin E", unit: "mg", code: "e", group: "compounds" },
    { key: "vitaminK", label: "Vitamin K", unit: "mcg", code: "k", group: "compounds" },
    { key: "vitaminK1", label: "Vitamin K1", unit: "mcg", code: "k1", group: "compounds" },
    { key: "vitaminK2", label: "Vitamin K2", unit: "mcg", code: "k2", group: "compounds" },
    { key: "selenium", label: "Selenium", unit: "mcg", code: "se", group: "compounds" },
    { key: "copper", label: "Copper", unit: "mcg", code: "cu", group: "compounds" },
    {
      key: "polyphenols",
      label: "Polyphenols",
      unit: "mg",
      code: "poly",
      group: "compounds",
    },
    { key: "flavonoids", label: "Flavonoids", unit: "mg", code: "flav", group: "compounds" },
    { key: "carotenoids", label: "Carotenoids", unit: "mg", code: "car", group: "compounds" },
    { key: "curcumin", label: "Curcumin", unit: "mg", code: "cur", group: "compounds" },
    {
      key: "resveratrol",
      label: "Resveratrol",
      unit: "mg",
      code: "res",
      group: "compounds",
    },
    { key: "coq10", label: "Coenzyme Q10", unit: "mg", code: "coq", group: "compounds" },
    {
      key: "sulforaphane",
      label: "Sulforaphane",
      unit: "mg",
      code: "sul",
      group: "compounds",
    },
    {
      key: "phosphorus",
      label: "Phosphorus",
      unit: "mg",
      code: "p",
      group: "compounds",
      limiting: true,
    },
    {
      key: "choline",
      label: "Choline",
      unit: "mg",
      code: "ch",
      group: "compounds",
      limiting: true,
    },
    {
      key: "carnitine",
      label: "L-Carnitine",
      unit: "mg",
      code: "carn",
      group: "compounds",
      limiting: true,
    },
    {
      key: "betaine",
      label: "Betaine",
      unit: "mg",
      code: "bet",
      group: "compounds",
      limiting: true,
    },
    { key: "glycemicIndex", label: "Glycemic index", unit: "GI", code: "gi", group: "carb" },
    {
      key: "addedSugar",
      label: "Added sugar",
      unit: "g",
      code: "sug",
      group: "carb",
      limiting: true,
    },
    {
      key: "refinedCarbs",
      label: "Refined carbohydrates",
      unit: "g",
      code: "ref",
      group: "carb",
      limiting: true,
    },
    {
      key: "netCarbs",
      label: "Net carbohydrates",
      unit: "g",
      code: "net",
      group: "carb",
      limiting: true,
    },
  ];

  var CARB_QUALITY_KEYS = ["glycemicIndex", "addedSugar", "refinedCarbs", "netCarbs"];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, "&quot;");
  }

  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /** Whole-phrase boundaries; \\b fails when the name starts/ends with punctuation e.g. (a). */
  var KEYWORD_BOUNDARY_BEFORE = "(?<![A-Za-z0-9_])";
  var KEYWORD_BOUNDARY_AFTER = "(?![A-Za-z0-9_])";

  function keywordMatchPattern(escapedName) {
    return KEYWORD_BOUNDARY_BEFORE + escapedName + KEYWORD_BOUNDARY_AFTER;
  }

  function makeId() {
    return "kw-" + nextId++ + "-" + Date.now();
  }

  function blankMicros() {
    var micros = {};
    MICRO_FIELDS.forEach(function (field) {
      micros[field.key] = "";
    });
    return micros;
  }

  function normalizeMicros(raw) {
    var micros = blankMicros();
    if (!raw || typeof raw !== "object") return micros;
    MICRO_FIELDS.forEach(function (field) {
      var v = raw[field.key];
      if (v === "" || v == null) {
        micros[field.key] = "";
      } else {
        var n = parseFloat(v);
        micros[field.key] = isNaN(n) ? "" : n;
      }
    });
    return micros;
  }

  function hasMicrosFilled(micros) {
    if (!micros) return false;
    return MICRO_FIELDS.some(function (field) {
      var v = micros[field.key];
      return v !== "" && v != null;
    });
  }

  function blankLongevity() {
    var longevity = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      longevity[field.key] = "";
    });
    return longevity;
  }

  function normalizeLongevity(raw) {
    var longevity = blankLongevity();
    if (!raw || typeof raw !== "object") return longevity;
    LONGEVITY_FIELDS.forEach(function (field) {
      var v = raw[field.key];
      if (v === "" || v == null) {
        longevity[field.key] = "";
      } else {
        var n = parseFloat(v);
        longevity[field.key] = isNaN(n) ? "" : n;
      }
    });
    return longevity;
  }

  function mergeCarbQualityIntoLongevity(longevity, carbQuality) {
    if (!carbQuality || typeof carbQuality !== "object" || Array.isArray(carbQuality)) {
      return longevity;
    }
    CARB_QUALITY_KEYS.forEach(function (key) {
      if (key in carbQuality) {
        var n = parseFloat(carbQuality[key]);
        longevity[key] = isNaN(n) ? "" : n;
      }
    });
    return longevity;
  }

  function applyLongevityImportToKeyword(kw, data) {
    if (data.longevity && typeof data.longevity === "object" && !Array.isArray(data.longevity)) {
      var merged = normalizeLongevity(kw.longevity);
      LONGEVITY_FIELDS.forEach(function (field) {
        if (field.key in data.longevity) {
          var n = parseFloat(data.longevity[field.key]);
          merged[field.key] = isNaN(n) ? "" : n;
        }
      });
      kw.longevity = merged;
    }
    if (
      data.carbQuality &&
      typeof data.carbQuality === "object" &&
      !Array.isArray(data.carbQuality)
    ) {
      kw.longevity = mergeCarbQualityIntoLongevity(kw.longevity, data.carbQuality);
    }
  }

  function hasLongevityFilled(longevity) {
    if (!longevity) return false;
    return LONGEVITY_FIELDS.some(function (field) {
      var v = longevity[field.key];
      return v !== "" && v != null;
    });
  }

  function longevityFieldByKey(key) {
    for (var i = 0; i < LONGEVITY_FIELDS.length; i++) {
      if (LONGEVITY_FIELDS[i].key === key) return LONGEVITY_FIELDS[i];
    }
    return null;
  }

  function filledLongevityCodes(longevity) {
    var codes = [];
    LONGEVITY_FIELDS.forEach(function (field) {
      var v = longevity[field.key];
      if (v !== "" && v != null) {
        codes.push(field.code);
      }
    });
    return codes;
  }

  function longevityButtonText(kw) {
    var codes = filledLongevityCodes(kw.longevity);
    return codes.length ? codes.join(",") : "Longevity";
  }

  function longevityButtonAria(kw) {
    var codes = filledLongevityCodes(kw.longevity);
    if (!codes.length) return "Add longevity nutrients";
    return "Edit longevity nutrients: " + codes.join(", ");
  }

  function longevityButtonHtml(kw) {
    var filled = hasLongevityFilled(kw.longevity);
    var cls =
      "keywords__longevity" + (filled ? " keywords__longevity--filled" : "");
    var text = longevityButtonText(kw);
    var tooltipAttr = filled ? ' data-tooltip="' + escapeAttr(text) + '"' : "";
    return (
      '<button type="button" class="' +
      cls +
      '" data-action="longevity"' +
      tooltipAttr +
      ' aria-label="' +
      escapeAttr(longevityButtonAria(kw)) +
      '"><span class="keywords__longevity-text">' +
      escapeHtml(text) +
      "</span></button>"
    );
  }

  function blankKeyword() {
    return {
      id: makeId(),
      name: "",
      protein: "",
      carbs: "",
      fats: "",
      micros: blankMicros(),
      longevity: blankLongevity(),
    };
  }

  function microInputValue(value) {
    return value === "" || value == null ? "" : value;
  }

  function filledMicroCodes(micros) {
    var codes = [];
    MICRO_FIELDS.forEach(function (field) {
      var v = micros[field.key];
      if (v !== "" && v != null) {
        codes.push(field.code);
      }
    });
    return codes;
  }

  function microsButtonText(kw) {
    var codes = filledMicroCodes(kw.micros);
    return codes.length ? codes.join(",") : "Micros";
  }

  function microsButtonAria(kw) {
    var codes = filledMicroCodes(kw.micros);
    if (!codes.length) return "Add micronutrients";
    return "Edit micronutrients: " + codes.join(", ");
  }

  function applyMicroButtonContent(btn, kw) {
    var filled = hasMicrosFilled(kw.micros);
    var text = microsButtonText(kw);
    btn.classList.toggle("keywords__micros--filled", filled);
    btn.setAttribute("aria-label", microsButtonAria(kw));
    if (filled) {
      btn.setAttribute("data-tooltip", text);
    } else {
      btn.removeAttribute("data-tooltip");
    }
    btn.innerHTML =
      '<span class="keywords__micros-text">' + escapeHtml(text) + "</span>";
  }

  function microsButtonHtml(kw) {
    var filled = hasMicrosFilled(kw.micros);
    var cls = "keywords__micros" + (filled ? " keywords__micros--filled" : "");
    var text = microsButtonText(kw);
    var tooltipAttr = filled ? ' data-tooltip="' + escapeAttr(text) + '"' : "";
    return (
      '<button type="button" class="' +
      cls +
      '" data-action="micros"' +
      tooltipAttr +
      ' aria-label="' +
      escapeAttr(microsButtonAria(kw)) +
      '"><span class="keywords__micros-text">' +
      escapeHtml(text) +
      "</span></button>"
    );
  }

  function parseMacro(value) {
    if (value === "" || value == null) return 0;
    var n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }

  function storedMacroValue(val) {
    if (val === "" || val == null) return "";
    var n = parseFloat(val);
    return isNaN(n) ? "" : n;
  }

  function exportFoodObject(kw) {
    var obj = { name: kw.name };
    if (kw.protein !== "" && kw.protein != null) obj.protein = kw.protein;
    if (kw.carbs !== "" && kw.carbs != null) obj.carbs = kw.carbs;
    if (kw.fats !== "" && kw.fats != null) obj.fats = kw.fats;

    var micros = {};
    MICRO_FIELDS.forEach(function (field) {
      var v = kw.micros[field.key];
      if (v !== "" && v != null) {
        micros[field.key] = v;
      }
    });
    if (Object.keys(micros).length > 0) {
      obj.micros = micros;
    }

    var longevity = {};
    var carbQuality = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      var v = kw.longevity[field.key];
      if (v === "" || v == null) return;
      if (CARB_QUALITY_KEYS.indexOf(field.key) >= 0) {
        carbQuality[field.key] = v;
      } else {
        longevity[field.key] = v;
      }
    });
    if (Object.keys(longevity).length > 0) {
      obj.longevity = longevity;
    }
    if (Object.keys(carbQuality).length > 0) {
      obj.carbQuality = carbQuality;
    }

    return obj;
  }

  function exportFoodJson(kw) {
    return JSON.stringify(exportFoodObject(kw), null, 2);
  }

  function exportAllFoodJson() {
    return JSON.stringify(
      keywords.map(function (kw) {
        return exportFoodObject(kw);
      }),
      null,
      2
    );
  }

  function exportAllFoods() {
    var json = exportAllFoodJson();
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "nutrients-food-definitions.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function keywordFromImportItem(data, index) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Item " + (index + 1) + " must be an object");
    }
    if (data.name == null || String(data.name).trim() === "") {
      throw new Error("Item " + (index + 1) + " is missing a name");
    }

    var kw = blankKeyword();
    applyImportItemToKeyword(kw, data);
    return kw;
  }

  function applyImportItemToKeyword(kw, data) {
    kw.name = String(data.name).trim();

    if ("protein" in data) {
      kw.protein = storedMacroValue(data.protein);
    }
    if ("carbs" in data) {
      kw.carbs = storedMacroValue(data.carbs);
    }
    if ("fats" in data) {
      kw.fats = storedMacroValue(data.fats);
    }

    if (
      data.micros &&
      typeof data.micros === "object" &&
      !Array.isArray(data.micros)
    ) {
      MICRO_FIELDS.forEach(function (field) {
        if (field.key in data.micros) {
          kw.micros[field.key] = storedMacroValue(data.micros[field.key]);
        }
      });
    }

    applyLongevityImportToKeyword(kw, data);
  }

  function findKeywordIndexByName(name) {
    var key = String(name).trim().toLowerCase();
    if (!key) return -1;
    for (var i = 0; i < keywords.length; i++) {
      if (keywords[i].name.trim().toLowerCase() === key) return i;
    }
    return -1;
  }

  function parseImportAllItems(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Invalid JSON");
    }

    var items;
    if (Array.isArray(data)) {
      items = data;
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray(data.foods)
    ) {
      items = data.foods;
    } else {
      throw new Error("JSON must be an array of food definitions");
    }

    return items;
  }

  function getImportAllMode() {
    var checked = document.querySelector(
      'input[name="import-all-mode"]:checked'
    );
    return checked && checked.value === "replace" ? "replace" : "amend";
  }

  function confirmImportAllReplace(importCount) {
    if (keywords.length === 0) return true;
    return window.confirm(
      "Replace all " +
        keywords.length +
        " food definition(s) with " +
        importCount +
        " from the import? This cannot be undone."
    );
  }

  function confirmImportAllAmend(plan) {
    if (plan.updated === 0 && plan.added === 0) {
      throw new Error("Import array is empty");
    }
    if (keywords.length === 0) return true;
    var parts = [];
    if (plan.updated > 0) {
      parts.push(
        plan.updated +
          " existing food(s) will be updated (matched by name, case-insensitive)"
      );
    }
    if (plan.added > 0) {
      parts.push(plan.added + " new food(s) will be added");
    }
    return window.confirm("Amend food definitions? " + parts.join("; ") + ".");
  }

  function planImportAllAmend(items) {
    var plan = { updated: 0, added: 0 };
    for (var i = 0; i < items.length; i++) {
      var name = String(items[i].name).trim();
      if (findKeywordIndexByName(name) >= 0) {
        plan.updated += 1;
      } else {
        plan.added += 1;
      }
    }
    return plan;
  }

  function applyImportAllReplace(items, skipConfirm) {
    if (!skipConfirm && !confirmImportAllReplace(items.length)) {
      throw new Error("cancelled");
    }

    var next = [];
    for (var i = 0; i < items.length; i++) {
      next.push(keywordFromImportItem(items[i], i));
    }
    keywords = next;
    saveFoodDefinitions();
  }

  function applyImportAllAmend(items) {
    var plan = planImportAllAmend(items);
    if (!confirmImportAllAmend(plan)) {
      throw new Error("cancelled");
    }

    for (var i = 0; i < items.length; i++) {
      var idx = findKeywordIndexByName(items[i].name);
      if (idx >= 0) {
        applyImportItemToKeyword(keywords[idx], items[i]);
      } else {
        keywords.push(keywordFromImportItem(items[i], i));
      }
    }
    saveFoodDefinitions();
  }

  function applyImportAllJson(raw, mode) {
    var items = parseImportAllItems(raw);
    if (mode === "replace") {
      applyImportAllReplace(items);
    } else {
      applyImportAllAmend(items);
    }
  }

  function jsonSchemaExample() {
    var micros = {};
    MICRO_FIELDS.forEach(function (field) {
      micros[field.key] = 0;
    });
    var longevity = {};
    var carbQuality = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      if (CARB_QUALITY_KEYS.indexOf(field.key) >= 0) {
        carbQuality[field.key] = 0;
      } else {
        longevity[field.key] = 0;
      }
    });
    return JSON.stringify(
      {
        name: "1 cup of peanuts",
        protein: 0,
        carbs: 0,
        fats: 0,
        micros: micros,
        longevity: longevity,
        carbQuality: carbQuality,
      },
      null,
      2
    );
  }

  function nutrientListForPrompt() {
    var lines = [
      "Macronutrients (grams): protein, carbs, fats",
      "Micronutrients — include only those you can estimate; omit unknown keys:",
    ];
    MICRO_FIELDS.forEach(function (field) {
      lines.push("  - micros." + field.key + ": " + field.label + " (" + field.unit + ")");
    });
    lines.push(
      "Longevity / fats / omegas / compounds — omit unknown keys; use longevity object:"
    );
    LONGEVITY_FIELDS.forEach(function (field) {
      if (CARB_QUALITY_KEYS.indexOf(field.key) >= 0) return;
      lines.push(
        "  - longevity." + field.key + ": " + field.label + " (" + field.unit + ")"
      );
    });
    lines.push("Carb quality — use carbQuality object (glycemic load uses GI × carbs / 100):");
    CARB_QUALITY_KEYS.forEach(function (key) {
      var field = longevityFieldByKey(key);
      if (field) {
        lines.push(
          "  - carbQuality." + field.key + ": " + field.label + " (" + field.unit + ")"
        );
      }
    });
    lines.push("Estimation hints — omit any key you cannot estimate:");
    lines.push(
      "  - micros.iodine: iodized table salt ~45 mcg/g salt; also fish, dairy, eggs"
    );
    lines.push(
      "  - micros.vitaminB6: poultry, fish, chickpeas, potatoes, bananas"
    );
    lines.push(
      "  - longevity.copper: shellfish, nuts, liver, dark chocolate (mcg)"
    );
    lines.push(
      "  - longevity.choline: egg yolks, liver, meat, fish (mg; high in eggs)"
    );
    lines.push(
      "  - longevity.carnitine: highest in beef/lamb; moderate in pork/chicken; very low in plants (mg)"
    );
    lines.push(
      "  - longevity.betaine: wheat bran, beets, spinach; some supplements (mg)"
    );
    lines.push(
      "  - longevity.phosphorus: whole foods are fine; do not inflate — processed foods may have phosphate additives"
    );
    lines.push(
      "  - longevity EPA/DHA/ALA: fatty fish for EPA & DHA; flax/chia/walnuts for ALA"
    );
    lines.push(
      "  - carbQuality: glycemicIndex is per food (0–100+); addedSugar and refinedCarbs in grams"
    );
    lines.push(
      "General: prefer unsaturated over saturated/trans fats; use realistic portions in name"
    );
    return lines.join("\n");
  }

  function portionFromField(portion) {
    var p = portion.trim();
    return p || "___";
  }

  function buildAiPromptFromPortion(portion) {
    var phrase = portionFromField(portion);
    var nameExample = phrase === "___" ? "1 cup of peanuts" : phrase;
    return (
      "Please fill in the nutrient data for " +
      phrase +
      ".\n\n" +
      "Return only valid JSON (no markdown fences or commentary) matching this structure. " +
      'Use the portion in the name field (e.g. "' +
      nameExample +
      '"). Omit any nutrient keys you cannot estimate.\n\n' +
      jsonSchemaExample() +
      "\n\n" +
      nutrientListForPrompt()
    );
  }

  function getImportPortionValue() {
    return importAiPortionEl ? importAiPortionEl.value : "";
  }

  function renderImportAiPreview() {
    if (!importAiPreviewEl) return;
    importAiPreviewEl.textContent = buildAiPromptFromPortion(
      getImportPortionValue()
    );
  }

  function syncImportAiInputs() {
    if (activeImportIndex < 0 || !importAiPortionEl) return;
    var i = activeImportIndex;
    if (i >= keywords.length) return;
    var name = keywords[i].name.trim();
    if (name && !importAiPortionEl.value.trim()) {
      importAiPortionEl.value = name;
    }
    renderImportAiPreview();
  }

  function copyAiPromptToClipboard(done) {
    var text = buildAiPromptFromPortion(getImportPortionValue());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else if (done) {
      done();
    }
  }

  function openAiService(url) {
    copyAiPromptToClipboard(function () {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  var MICRO_GAPS_PREF_LABELS = {
    none: "No preferences",
    gluten_free: "Gluten free",
    dairy_free: "Free of dairy ingredients",
    nut_free: "Free of nuts",
    vegan: "Vegan",
    infrequent: "Only a few times per week at most",
    easy_prep: "Easy to prepare",
    portable: "Portable finger food I can bring to work",
  };

  function demographicLabelForPrompt() {
    var metaMap = demographicDv ? demographicDv.META : {};
    var meta = metaMap[demographic] || metaMap[DEFAULT_DEMOGRAPHIC];
    return meta ? meta.label : demographic;
  }

  function microGapsPreferenceText() {
    if (!microGapsPreferenceEl) return MICRO_GAPS_PREF_LABELS.none;
    var id = microGapsPreferenceEl.value;
    return MICRO_GAPS_PREF_LABELS[id] || MICRO_GAPS_PREF_LABELS.none;
  }

  function buildMicroGapsSnapshotLines() {
    var week = weekMicroTotals();
    var lines = [];
    var deficiencies = [];

    MICRO_FIELDS.forEach(function (field) {
      var total = week[field.key];
      var pct = avgDailyMicroPct(field.key, total);
      var avgDaily = total / DAYS.length;
      var amtText =
        total > 0
          ? fmtNum(avgDaily) + " " + field.unit + "/day avg"
          : "0 " + field.unit + "/day avg";
      var pctText =
        pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "% DV";

      lines.push(field.label);
      lines.push(amtText);
      lines.push(pctText);

      if (pct != null && !isNaN(pct) && pct < 100) {
        deficiencies.push(field.label + " (" + fmtNum(pct) + "% DV)");
      }
    });

    return { lines: lines, deficiencies: deficiencies };
  }

  function buildMicroGapsAiPrompt() {
    var snapshot = buildMicroGapsSnapshotLines();
    var pref = microGapsPreferenceText();
    var additional =
      microGapsAdditionalEl && microGapsAdditionalEl.value.trim();
    var demo = demographicLabelForPrompt();

    var parts = [
      "I track meals Mon–Sun in a weekly log. The numbers below are my average daily intake compared to daily values for a " +
        demo +
        " profile.",
      "",
      "Average daily intake vs demographic daily values (Mon–Sun):",
      "",
      snapshot.lines.join("\n"),
      "",
    ];

    if (snapshot.deficiencies.length) {
      parts.push(
        "Nutrients below 100% DV (focus suggestions here): " +
          snapshot.deficiencies.join(", ") +
          "."
      );
      parts.push("");
    }

    parts.push(
      "How can I meet these gaps? This is the average over the week, not a single day. Suggest specific foods I can add to my week. For each food, include how many times per week, a typical serving size, and which nutrients it mainly helps. Keep suggestions practical for my preferences."
    );
    parts.push("");
    parts.push("Dietary preferences: " + pref + ".");
    if (additional) {
      parts.push(additional);
    }
    parts.push("");
    parts.push(
      "Reply in plain language (no JSON). Use short sections or a simple list."
    );

    return parts.join("\n");
  }

  function renderMicroGapsAiPreview() {
    if (!microGapsAiPreviewEl) return;
    microGapsAiPreviewEl.textContent = buildMicroGapsAiPrompt();
  }

  function copyMicroGapsPromptToClipboard(done) {
    var text = buildMicroGapsAiPrompt();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else if (done) {
      done();
    }
  }

  function openMicroGapsAiService(url) {
    copyMicroGapsPromptToClipboard(function () {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  function closeMicroGapsModal() {
    if (!microGapsModalEl) return;
    microGapsModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function stringArray(val) {
    if (!Array.isArray(val)) return [];
    return val.filter(function (s) {
      return typeof s === "string" && s.trim();
    });
  }

  function normalizeMicroDefinitions(data) {
    var out = {};
    if (!data || typeof data !== "object") return out;
    MICRO_FIELDS.forEach(function (field) {
      var raw = data[field.key];
      if (!raw || typeof raw !== "object") return;
      var entry = {
        tooLow: stringArray(raw.tooLow),
        tooHigh: stringArray(raw.tooHigh),
        enough: stringArray(raw.enough),
        foodSources: stringArray(raw.foodSources),
        male: stringArray(raw.male),
        female: stringArray(raw.female),
      };
      if (
        entry.tooLow.length ||
        entry.tooHigh.length ||
        entry.enough.length ||
        entry.foodSources.length ||
        entry.male.length ||
        entry.female.length
      ) {
        out[field.key] = entry;
      }
    });
    return out;
  }

  function loadMicroDefinitions(done) {
    fetch("definitions-micronutrients.json")
      .then(function (res) {
        if (!res.ok) throw new Error("definitions fetch failed");
        return res.json();
      })
      .then(function (data) {
        microDefinitions = normalizeMicroDefinitions(data);
        if (done) done();
      })
      .catch(function () {
        microDefinitions = {};
        if (done) done();
      });
  }

  function longevityDefKeyList() {
    var keys = LONGEVITY_FIELDS.map(function (field) {
      return field.key;
    });
    Object.keys(LONGEVITY_DERIVED_DEFS).forEach(function (key) {
      keys.push(key);
    });
    Object.keys(LONGEVITY_SECTION_DEFS).forEach(function (key) {
      keys.push(key);
    });
    return keys;
  }

  function longevityDefLabel(key) {
    var field = longevityFieldByKey(key);
    if (field) return field.label;
    var derived = LONGEVITY_DERIVED_DEFS[key];
    if (derived) return derived.label;
    var section = LONGEVITY_SECTION_DEFS[key];
    return section ? section.label : key;
  }

  function isLongevityLimitingDefKey(key) {
    if (LONGEVITY_SECTION_DEFS[key]) return false;
    var field = longevityFieldByKey(key);
    if (field) return !!field.limiting;
    var derived = LONGEVITY_DERIVED_DEFS[key];
    return derived ? !!derived.limiting : false;
  }

  function longevitySectionTitleHtml(title, sectionDefKey) {
    var link = sectionDefKey
      ? ' <button type="button" class="dashboard__longevity-section-link" data-longevity-def="' +
        escapeAttr(sectionDefKey) +
        '" aria-haspopup="dialog">explain</button>'
      : "";
    return (
      '<h3 class="dashboard__longevity-section-title">' +
      escapeHtml(title) +
      link +
      "</h3>"
    );
  }

  function normalizeLongevityDefinitions(data) {
    var out = {};
    if (!data || typeof data !== "object") return out;
    longevityDefKeyList().forEach(function (key) {
      var raw = data[key];
      if (!raw || typeof raw !== "object") return;
      var entry = {
        tooLow: stringArray(raw.tooLow),
        tooHigh: stringArray(raw.tooHigh),
        enough: stringArray(raw.enough),
        foodSources: stringArray(raw.foodSources),
      };
      if (
        entry.tooLow.length ||
        entry.tooHigh.length ||
        entry.enough.length ||
        entry.foodSources.length
      ) {
        out[key] = entry;
      }
    });
    return out;
  }

  function loadLongevityDefinitions(done) {
    fetch("definitions-longevity.json")
      .then(function (res) {
        if (!res.ok) throw new Error("longevity definitions fetch failed");
        return res.json();
      })
      .then(function (data) {
        longevityDefinitions = normalizeLongevityDefinitions(data);
        if (done) done();
      })
      .catch(function () {
        longevityDefinitions = {};
        if (done) done();
      });
  }

  function microFieldByKey(key) {
    for (var i = 0; i < MICRO_FIELDS.length; i++) {
      if (MICRO_FIELDS[i].key === key) return MICRO_FIELDS[i];
    }
    return null;
  }

  function microDefParagraphsHtml(paragraphs) {
    return paragraphs
      .map(function (p) {
        return '<p class="micro-def__p">' + escapeHtml(p) + "</p>";
      })
      .join("");
  }

  function microDefSexMeta(sexId) {
    var metaMap = demographicDv ? demographicDv.META : {};
    var fallback =
      sexId === "female"
        ? { icon: "♀", label: "Female" }
        : { icon: "♂", label: "Male" };
    return metaMap[sexId] || fallback;
  }

  function microDefFoodSourcesHtml(sources) {
    if (!sources.length) return "";
    return (
      '<section class="micro-def__sources">' +
      '<h4 class="micro-def__sources-heading">Food sources</h4>' +
      '<ul class="micro-def__sources-list">' +
      sources
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>" +
      "</section>"
    );
  }

  function microDefListHtml(items, sexId) {
    if (!items.length) return "";
    var meta = microDefSexMeta(sexId);
    return (
      '<p class="micro-def__sex-label">' +
      '<span class="micro-def__sex-icon" aria-hidden="true">' +
      escapeHtml(meta.icon) +
      "</span>" +
      '<span class="micro-def__sex-text">' +
      escapeHtml(meta.label) +
      "</span>" +
      "</p>" +
      '<ul class="micro-def__list">' +
      items
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function renderMicroDefBody(key) {
    if (!microDefBodyEl) return;
    var field = microFieldByKey(key);
    var def = microDefinitions[key];
    if (!def) {
      microDefBodyEl.innerHTML =
        '<p class="micro-def__empty">No description is available for ' +
        escapeHtml(field ? field.label : key) +
        " yet.</p>";
      return;
    }

    var html = "";

    if (def.tooLow.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too low</h4>' +
        microDefParagraphsHtml(def.tooLow) +
        "</section>";
    }

    if (def.enough.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">When you get enough</h4>' +
        microDefParagraphsHtml(def.enough) +
        "</section>";
    }

    if (def.tooHigh.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too high</h4>' +
        microDefParagraphsHtml(def.tooHigh) +
        "</section>";
    }

    if (def.male.length || def.female.length) {
      html += '<section class="micro-def__section">';
      html += '<h4 class="micro-def__heading">Sex-specific benefits</h4>';
      if (def.male.length) {
        html += microDefListHtml(def.male, "male");
      }
      if (def.female.length) {
        html += microDefListHtml(def.female, "female");
      }
      html += "</section>";
    }

    if (def.foodSources.length) {
      html += microDefFoodSourcesHtml(def.foodSources);
    }

    microDefBodyEl.innerHTML =
      html || '<p class="micro-def__empty">No description content yet.</p>';
  }

  function renderLongevityDefBody(key) {
    if (!microDefBodyEl) return;
    var def = longevityDefinitions[key];
    var label = longevityDefLabel(key);
    if (!def) {
      microDefBodyEl.innerHTML =
        '<p class="micro-def__empty">No description is available for ' +
        escapeHtml(label) +
        " yet.</p>";
      return;
    }

    var limiting = isLongevityLimitingDefKey(key);
    var html = "";

    if (!limiting && def.tooLow.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too low</h4>' +
        microDefParagraphsHtml(def.tooLow) +
        "</section>";
    }

    if (limiting && def.tooHigh.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too high</h4>' +
        microDefParagraphsHtml(def.tooHigh) +
        "</section>";
    }

    if (def.enough.length) {
      var enoughHeading = LONGEVITY_SECTION_DEFS[key]
        ? "Why it matters"
        : limiting
          ? "Keeping intake in a healthy range"
          : "When you get enough";
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">' +
        enoughHeading +
        "</h4>" +
        microDefParagraphsHtml(def.enough) +
        "</section>";
    }

    if (!limiting && def.tooHigh.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too high</h4>' +
        microDefParagraphsHtml(def.tooHigh) +
        "</section>";
    }

    if (def.foodSources.length) {
      html += microDefFoodSourcesHtml(def.foodSources);
    }

    microDefBodyEl.innerHTML =
      html || '<p class="micro-def__empty">No description content yet.</p>';
  }

  function setMicroDefFullscreen(on) {
    microDefFullscreen = !!on;
    if (microDefModalEl) {
      microDefModalEl.classList.toggle("modal--fullscreen", microDefFullscreen);
    }
    if (microDefFullscreenToggleBtn) {
      microDefFullscreenToggleBtn.setAttribute(
        "aria-pressed",
        microDefFullscreen ? "true" : "false"
      );
      microDefFullscreenToggleBtn.textContent = microDefFullscreen
        ? "Exit full screen"
        : "Full screen";
      microDefFullscreenToggleBtn.setAttribute(
        "aria-label",
        microDefFullscreen ? "Exit full screen" : "Read in full screen"
      );
    }
  }

  function closeMicroDefModal() {
    if (!microDefModalEl) return;
    activeMicroDefKey = null;
    activeLongevityDefKey = null;
    setMicroDefFullscreen(false);
    microDefModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openLongevityDefModal(key) {
    if (!microDefModalEl || !key) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    activeMicroDefKey = null;
    activeLongevityDefKey = key;
    setMicroDefFullscreen(false);
    if (microDefModalTitleEl) {
      microDefModalTitleEl.textContent = longevityDefLabel(key);
    }
    renderLongevityDefBody(key);
    microDefModalEl.hidden = false;
    updateBodyModalOpen();
    if (microDefModalDoneBtn) microDefModalDoneBtn.focus();
  }

  function openMicroDefModal(key) {
    if (!microDefModalEl || !key) return;
    var field = microFieldByKey(key);
    if (!field) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    activeLongevityDefKey = null;
    activeMicroDefKey = key;
    setMicroDefFullscreen(false);
    if (microDefModalTitleEl) {
      microDefModalTitleEl.textContent = field.label;
    }
    renderMicroDefBody(key);
    microDefModalEl.hidden = false;
    updateBodyModalOpen();
    if (microDefModalDoneBtn) microDefModalDoneBtn.focus();
  }

  function openMicroGapsModal() {
    if (!microGapsModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    renderMicroGapsAiPreview();
    microGapsModalEl.hidden = false;
    updateBodyModalOpen();
    if (microGapsPreferenceEl) {
      microGapsPreferenceEl.focus();
    }
  }

  function setImportAiPanelOpen(open) {
    if (!importAiPanelEl || !importAiToggleBtn) return;
    importAiPanelEl.hidden = !open;
    importAiToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    importAiToggleBtn.textContent = open ? "✨ Hide AI help" : "✨ Have AI help me";

    if (importJsonLabelEl) {
      importJsonLabelEl.textContent = open
        ? "Paste AI response (JSON)"
        : "JSON";
    }

    if (importJsonWrapEl) {
      importJsonWrapEl.classList.toggle("import-json-wrap--ai", open);
    }

    if (importJsonEl && activeImportIndex >= 0 && activeImportIndex < keywords.length) {
      var i = activeImportIndex;
      if (open) {
        importJsonEl.value = "";
        importJsonEl.placeholder =
          '{\n  "name": "1 cup of peanuts",\n  "protein": 0\n}';
      } else {
        importJsonEl.placeholder = "";
        importJsonEl.value = exportFoodJson(keywords[i]);
      }
    }

    if (open) {
      syncImportAiInputs();
      if (importAiPortionEl) importAiPortionEl.focus();
    }
  }

  function showImportError(message) {
    if (!importErrorEl) return;
    if (!message) {
      importErrorEl.hidden = true;
      importErrorEl.textContent = "";
      return;
    }
    importErrorEl.hidden = false;
    importErrorEl.textContent = message;
  }

  function updateBodyModalOpen() {
    var open =
      (importAllMealsModalEl && !importAllMealsModalEl.hidden) ||
      (importAllModalEl && !importAllModalEl.hidden) ||
      (microGapsModalEl && !microGapsModalEl.hidden) ||
      (microDefModalEl && !microDefModalEl.hidden) ||
      (keywordPositionModalEl && !keywordPositionModalEl.hidden) ||
      !!activeImportId ||
      !!activeMicroId ||
      !!activeLongevityId ||
      !!activeMicroDefKey ||
      !!activeLongevityDefKey;
    document.body.classList.toggle("modal-open", open);
  }

  function showImportAllError(message) {
    if (!importAllErrorEl) return;
    if (!message) {
      importAllErrorEl.hidden = true;
      importAllErrorEl.textContent = "";
      return;
    }
    importAllErrorEl.hidden = false;
    importAllErrorEl.textContent = message;
  }

  function closeImportAllModal() {
    if (!importAllModalEl) return;
    importAllModalEl.hidden = true;
    showImportAllError("");
    updateBodyModalOpen();
  }

  function confirmImportSampleReplace(importCount) {
    if (keywords.length === 0) return true;
    return window.confirm(
      "Replace all " +
        keywords.length +
        " food definition(s) with " +
        importCount +
        " from the sample? This cannot be undone."
    );
  }

  function importSampleFoods() {
    if (activeImportId) closeImportModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();

    fetch(IMPORT_SAMPLE_FOODS_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Could not load sample food definitions");
        return res.text();
      })
      .then(function (raw) {
        var items = parseImportAllItems(raw);
        if (!confirmImportSampleReplace(items.length)) return;
        applyImportAllReplace(items, true);
        renderKeywords();
        refreshAll();
      })
      .catch(function (e) {
        if (e.message === "cancelled") return;
        window.alert(e.message || "Import sample failed");
      });
  }

  function openImportAllModal() {
    if (!importAllModalEl || !importAllJsonEl) return;

    if (activeImportId) closeImportModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }

    importAllJsonEl.value = exportAllFoodJson();
    showImportAllError("");
    importAllModalEl.hidden = false;
    updateBodyModalOpen();
    importAllJsonEl.focus();
    importAllJsonEl.select();
  }

  function runImportAll() {
    if (!importAllJsonEl) return;
    try {
      applyImportAllJson(importAllJsonEl.value, getImportAllMode());
      closeImportAllModal();
      renderKeywords();
      refreshAll();
    } catch (e) {
      if (e.message === "cancelled") return;
      showImportAllError(e.message || "Import failed");
    }
  }

  function closeImportModal() {
    if (!importModalEl) return;
    activeImportId = null;
    activeImportIndex = -1;
    importModalEl.hidden = true;
    showImportError("");
    setImportAiPanelOpen(false);
    updateBodyModalOpen();
  }

  function applyImportJson(index, raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Invalid JSON");
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("JSON must be an object");
    }

    if (data.name == null || String(data.name).trim() === "") {
      throw new Error("Name is required");
    }

    if (index < 0 || index >= keywords.length) {
      throw new Error("Food definition not found");
    }

    var fresh = blankKeyword();
    fresh.id = keywords[index].id;
    applyImportItemToKeyword(fresh, data);
    keywords[index] = fresh;

    saveFoodDefinitions();
  }

  function runImport() {
    if (activeImportIndex < 0 || !importJsonEl) return;
    try {
      applyImportJson(activeImportIndex, importJsonEl.value);
      closeImportModal();
      renderKeywords();
      refreshAll();
    } catch (e) {
      showImportError(e.message || "Import failed");
    }
  }

  function openImportModalByIndex(i) {
    if (!importModalEl || !importJsonEl) return;
    if (i < 0 || i >= keywords.length) return;

    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }
    if (activePositionId) closeKeywordPositionModal();

    activeImportIndex = i;
    activeImportId = keywords[i].id;
    var kw = keywords[i];

    if (importModalFoodEl) {
      importModalFoodEl.textContent = kw.name.trim()
        ? kw.name.trim()
        : "Untitled food";
    }

    importJsonEl.value = exportFoodJson(kw);
    showImportError("");
    setImportAiPanelOpen(false);
    syncImportAiInputs();
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
    }
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }

    importModalEl.hidden = false;
    updateBodyModalOpen();
    importJsonEl.focus();
    importJsonEl.select();
  }

  function fmtNum(n) {
    var rounded = Math.round(n * 10) / 10;
    return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
  }

  function fmtNumGrouped(n) {
    var s = fmtNum(n);
    var dot = s.indexOf(".");
    var whole = dot === -1 ? s : s.slice(0, dot);
    var frac = dot === -1 ? "" : s.slice(dot);
    return Number(whole).toLocaleString("en-US") + frac;
  }

  function keywordNames() {
    var seen = {};
    var names = [];
    keywords.forEach(function (kw) {
      var name = kw.name.trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      names.push(name);
    });
    return names;
  }

  function buildHighlightRegex(words) {
    if (!words.length) return null;
    var sorted = words.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var body = sorted.map(escapeRegex).join("|");
    return new RegExp(
      KEYWORD_BOUNDARY_BEFORE + "(" + body + ")" + KEYWORD_BOUNDARY_AFTER,
      "gi"
    );
  }

  function highlightedHtml(text, regex) {
    if (!regex) return escapeHtml(text);

    var html = "";
    var last = 0;
    var match;

    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      html += escapeHtml(text.slice(last, match.index));
      html += '<mark class="hl">' + escapeHtml(match[0]) + "</mark>";
      last = match.index + match[0].length;
      if (match[0].length === 0) {
        regex.lastIndex += 1;
      }
    }
    html += escapeHtml(text.slice(last));
    return html;
  }

  function countKeyword(text, name) {
    var re = new RegExp(keywordMatchPattern(escapeRegex(name)), "gi");
    var count = 0;
    var match;
    while ((match = re.exec(text)) !== null) {
      count += 1;
      if (match[0].length === 0) {
        re.lastIndex += 1;
      }
    }
    return count;
  }

  function totalsFromText(text) {
    var protein = 0;
    var carbs = 0;
    var fats = 0;
    var seen = {};

    keywords.forEach(function (kw) {
      var name = kw.name.trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;

      var hits = countKeyword(text, name);
      if (!hits) return;

      protein += hits * parseMacro(kw.protein);
      carbs += hits * parseMacro(kw.carbs);
      fats += hits * parseMacro(kw.fats);
    });

    var proteinCal = protein * CAL_PROTEIN;
    var carbsCal = carbs * CAL_CARBS;
    var fatsCal = fats * CAL_FATS;

    return {
      protein: protein,
      carbs: carbs,
      fats: fats,
      proteinCal: proteinCal,
      carbsCal: carbsCal,
      fatsCal: fatsCal,
      totalCal: proteinCal + carbsCal + fatsCal,
    };
  }

  function emptyMicroTotals() {
    var totals = {};
    MICRO_FIELDS.forEach(function (field) {
      totals[field.key] = 0;
    });
    return totals;
  }

  function microTotalsFromText(text) {
    var totals = emptyMicroTotals();
    var seen = {};

    keywords.forEach(function (kw) {
      var name = kw.name.trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;

      var hits = countKeyword(text, name);
      if (!hits) return;

      MICRO_FIELDS.forEach(function (field) {
        var v = kw.micros[field.key];
        if (v === "" || v == null) return;
        totals[field.key] += hits * parseFloat(v);
      });
    });

    return totals;
  }

  function addMicroTotals(a, b) {
    var out = emptyMicroTotals();
    MICRO_FIELDS.forEach(function (field) {
      out[field.key] = a[field.key] + b[field.key];
    });
    return out;
  }

  function weekMicroTotals() {
    var week = emptyMicroTotals();
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      week = addMicroTotals(week, microTotalsFromText(text));
    });
    return week;
  }

  function emptyLongevityTotals() {
    var totals = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      totals[field.key] = 0;
    });
    return totals;
  }

  function longevityTotalsFromText(text) {
    var totals = emptyLongevityTotals();
    var seen = {};

    keywords.forEach(function (kw) {
      var name = kw.name.trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;

      var hits = countKeyword(text, name);
      if (!hits) return;

      LONGEVITY_FIELDS.forEach(function (field) {
        var v = kw.longevity[field.key];
        if (v === "" || v == null) return;
        totals[field.key] += hits * parseFloat(v);
      });
    });

    return totals;
  }

  function addLongevityTotals(a, b) {
    var out = emptyLongevityTotals();
    LONGEVITY_FIELDS.forEach(function (field) {
      out[field.key] = a[field.key] + b[field.key];
    });
    return out;
  }

  function weekLongevityTotals() {
    var week = emptyLongevityTotals();
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      week = addLongevityTotals(week, longevityTotalsFromText(text));
    });
    return week;
  }

  function giBucketsFromWeek() {
    var low = 0;
    var med = 0;
    var high = 0;

    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      var seen = {};
      keywords.forEach(function (kw) {
        var name = kw.name.trim();
        if (!name) return;
        var key = name.toLowerCase();
        if (seen[key]) return;
        seen[key] = true;

        var gi = parseFloat(kw.longevity.glycemicIndex);
        if (isNaN(gi) || gi <= 0) return;

        var carbs = parseMacro(kw.carbs);
        if (!carbs) return;

        var hits = countKeyword(text, name);
        if (!hits) return;

        var weight = hits * carbs;
        if (gi <= 55) low += weight;
        else if (gi <= 69) med += weight;
        else high += weight;
      });
    });

    return { low: low, med: med, high: high };
  }

  function weekGlycemicLoadTotal() {
    var total = 0;

    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      var seen = {};
      keywords.forEach(function (kw) {
        var name = kw.name.trim();
        if (!name) return;
        var key = name.toLowerCase();
        if (seen[key]) return;
        seen[key] = true;

        var gi = parseFloat(kw.longevity.glycemicIndex);
        if (isNaN(gi) || gi <= 0) return;

        var carbs = parseMacro(kw.carbs);
        if (!carbs) return;

        var hits = countKeyword(text, name);
        if (!hits) return;

        total += hits * ((gi * carbs) / 100);
      });
    });

    return total;
  }

  function dailyLongevityDv(key) {
    if (longevityDv && longevityDv.getDailyLongevityDv) {
      return longevityDv.getDailyLongevityDv(key);
    }
    return 0;
  }

  function avgDailyLongevity(key, weekTotal) {
    return weekTotal / DAYS.length;
  }

  function avgDailyLongevityPct(key, weekTotal) {
    var dv = dailyLongevityDv(key);
    if (!dv) return null;
    return (avgDailyLongevity(key, weekTotal) / dv) * 100;
  }

  function computeLongevityDerived(weekLongevity, weekMicro) {
    var avg = function (k) {
      return avgDailyLongevity(k, weekLongevity[k] || 0);
    };
    var o6 = avg("omega6");
    var o3 = avg("omega3");
    var sat = avg("saturatedFat");
    var unsat = avg("monounsaturatedFat") + avg("polyunsaturatedFat");
    var ratioO6O3 = o3 > 0 ? o6 / o3 : null;
    var ratioSatUnsat = unsat > 0 ? sat / unsat : null;
    return {
      omega6To3: ratioO6O3,
      satToUnsat: ratioSatUnsat,
      epaPlusDha: avg("epa") + avg("dha"),
      transFatG: avg("transFat"),
      weekGl: weekGlycemicLoadTotal() / DAYS.length,
      giBuckets: giBucketsFromWeek(),
    };
  }

  function dailyDv(key) {
    if (demographicDv && demographicDv.getDailyMicroDv) {
      return demographicDv.getDailyMicroDv(demographic, key);
    }
    return 0;
  }

  function dailyMicroPct(key, amount) {
    var dv = dailyDv(key);
    if (!dv) return null;
    return (amount / dv) * 100;
  }

  function avgDailyMicroPct(key, weekTotal) {
    return dailyMicroPct(key, weekTotal / DAYS.length);
  }

  var DEFAULT_MICRO_DV_STATUS = {
    tiers: [
      { id: "green", minPercent: 100, color: "#1a7a36", fontWeight: 400 },
      { id: "blue", minPercent: 70, color: "#2a5f9e", fontWeight: 600 },
      { id: "orange", minPercent: 40, color: "#c45c00", fontWeight: 800 },
      { id: "red", minPercent: 0, color: "#b42318", fontWeight: 800 },
    ],
  };

  var microDvStatus = DEFAULT_MICRO_DV_STATUS;

  var DEFAULT_LIMITING_TIERS = [
    { id: "red", minPercent: 100, color: "#b42318", fontWeight: 800 },
    { id: "orange", minPercent: 70, color: "#c45c00", fontWeight: 800 },
    { id: "blue", minPercent: 40, color: "#2a5f9e", fontWeight: 600 },
    { id: "green", minPercent: 0, color: "#1a7a36", fontWeight: 400 },
  ];

  var DEFAULT_LONGEVITY_STATUS = {
    normalTiers: DEFAULT_MICRO_DV_STATUS.tiers,
    limitingTiers: DEFAULT_LIMITING_TIERS,
    transFatMaxGPerDay: 0.5,
    omega6To3IdealMax: 4,
  };

  var longevityDvStatus = DEFAULT_LONGEVITY_STATUS;

  function normalizeTierArray(rawTiers, fallbackTiers) {
    if (!rawTiers) return fallbackTiers.slice();
    var list = Array.isArray(rawTiers) ? rawTiers : [];
    var tiers = list
      .map(function (tier) {
        var minPercent = parseFloat(tier.minPercent);
        if (isNaN(minPercent)) return null;
        var fontWeight = parseInt(tier.fontWeight, 10);
        return {
          id: typeof tier.id === "string" ? tier.id : "",
          minPercent: minPercent,
          color: typeof tier.color === "string" ? tier.color : "#1a1a1a",
          fontWeight: isNaN(fontWeight) ? 400 : fontWeight,
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.minPercent - a.minPercent;
      });
    return tiers.length ? tiers : fallbackTiers.slice();
  }

  function normalizeLongevityStatus(raw) {
    if (!raw || typeof raw !== "object") return DEFAULT_LONGEVITY_STATUS;
    var legacyTiers = raw.tiers;
    return {
      normalTiers: normalizeTierArray(
        raw.normalTiers || legacyTiers,
        DEFAULT_LONGEVITY_STATUS.normalTiers
      ),
      limitingTiers: normalizeTierArray(
        raw.limitingTiers,
        DEFAULT_LONGEVITY_STATUS.limitingTiers
      ),
      transFatMaxGPerDay:
        parseFloat(raw.transFatMaxGPerDay) ||
        DEFAULT_LONGEVITY_STATUS.transFatMaxGPerDay,
      omega6To3IdealMax:
        parseFloat(raw.omega6To3IdealMax) ||
        DEFAULT_LONGEVITY_STATUS.omega6To3IdealMax,
    };
  }

  function normalizeMicroDvTiers(raw) {
    if (!raw || !Array.isArray(raw.tiers)) return DEFAULT_MICRO_DV_STATUS;
    var tiers = raw.tiers
      .map(function (tier) {
        var minPercent = parseFloat(tier.minPercent);
        if (isNaN(minPercent)) return null;
        var fontWeight = parseInt(tier.fontWeight, 10);
        return {
          id: typeof tier.id === "string" ? tier.id : "",
          minPercent: minPercent,
          color: typeof tier.color === "string" ? tier.color : "#1a1a1a",
          fontWeight: isNaN(fontWeight) ? 400 : fontWeight,
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.minPercent - a.minPercent;
      });
    if (!tiers.length) return DEFAULT_MICRO_DV_STATUS;
    return { tiers: tiers };
  }

  function loadAppConfig(done) {
    fetch("config.json")
      .then(function (res) {
        if (!res.ok) throw new Error("config fetch failed");
        return res.json();
      })
      .then(function (data) {
        microDvStatus = normalizeMicroDvTiers(data.microDvStatus);
        if (data.longevityStatus) {
          longevityDvStatus = normalizeLongevityStatus(data.longevityStatus);
        }
        done();
      })
      .catch(function () {
        microDvStatus = DEFAULT_MICRO_DV_STATUS;
        longevityDvStatus = DEFAULT_LONGEVITY_STATUS;
        done();
      });
  }

  function tierForPctInList(pct, tiers) {
    if (pct == null || isNaN(pct) || !tiers || !tiers.length) return null;
    for (var i = 0; i < tiers.length; i++) {
      if (pct >= tiers[i].minPercent) return tiers[i];
    }
    return tiers[tiers.length - 1] || null;
  }

  function tierForMicroPct(pct) {
    return tierForPctInList(pct, microDvStatus.tiers);
  }

  function tierForLongevityPct(pct, limiting) {
    var tiers = limiting
      ? longevityDvStatus.limitingTiers
      : longevityDvStatus.normalTiers;
    return tierForPctInList(pct, tiers);
  }

  function pctInlineStyle(pct, tier) {
    if (!tier) return "";
    return (
      ' style="color:' +
      escapeAttr(tier.color) +
      ";font-weight:" +
      tier.fontWeight +
      ';"'
    );
  }

  function microPctInlineStyle(pct) {
    return pctInlineStyle(pct, tierForMicroPct(pct));
  }

  function longevityPctInlineStyle(pct, limiting) {
    return pctInlineStyle(pct, tierForLongevityPct(pct, limiting));
  }

  function microDailyDvText(field) {
    var dv = dailyDv(field.key);
    if (!dv) return "—";
    return fmtNum(dv) + " " + field.unit + "/day req";
  }

  function syncMicroDailyDvToggleUi() {
    if (!dashboardMicroDvToggleEl) return;
    dashboardMicroDvToggleEl.setAttribute(
      "aria-pressed",
      showMicroDailyDv ? "true" : "false"
    );
    dashboardMicroDvToggleEl.textContent = showMicroDailyDv
      ? "Hide DV targets"
      : "Show DV targets";
  }

  function syncMicroViewToggleUi() {
    if (dashboardMicroViewWeeklyEl) {
      dashboardMicroViewWeeklyEl.setAttribute(
        "aria-pressed",
        microViewDaily ? "false" : "true"
      );
    }
    if (dashboardMicroViewDailyEl) {
      dashboardMicroViewDailyEl.setAttribute(
        "aria-pressed",
        microViewDaily ? "true" : "false"
      );
    }
  }

  function setMicroViewDaily(daily) {
    microViewDaily = !!daily;
    if (microRequirementsOpen) {
      renderMicroRequirements();
    } else {
      syncMicroViewToggleUi();
      syncMicroHintText();
    }
  }

  function syncMicroHintText() {
    if (!dashboardMicroHintEl) return;
    dashboardMicroHintEl.textContent = microViewDaily
      ? "Per-day intake vs your demographic daily values (Mon–Sun). Click a nutrient to learn more."
      : "Average daily intake vs your demographic daily values (Mon–Sun). DV's will be low if you dont fill up all days. Click a nutrient to learn more.";
  }

  function microWeeklyRowHtml(field, total) {
    var pct = avgDailyMicroPct(field.key, total);
    var pctText = pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "% DV";
    var amtText =
      total > 0 ? fmtNum(total / DAYS.length) + " " + field.unit + "/day avg" : "—";
    var tier = tierForMicroPct(pct);
    var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
    var rowCls =
      "dashboard__micro-row dashboard__micro-row--clickable" +
      (showMicroDailyDv ? " dashboard__micro-row--show-dv" : "");

    var html =
      '<div class="' +
      rowCls +
      '"' +
      tierAttr +
      ' role="listitem">' +
      '<button type="button" class="dashboard__micro-name" data-micro-def="' +
      escapeAttr(field.key) +
      '" aria-haspopup="dialog">' +
      escapeHtml(field.label) +
      "</button>" +
      '<span class="dashboard__micro-amt">' +
      escapeHtml(amtText) +
      "</span>";
    if (showMicroDailyDv) {
      html +=
        '<span class="dashboard__micro-dv-req">' +
        escapeHtml(microDailyDvText(field)) +
        "</span>";
    }
    html +=
      '<span class="dashboard__micro-pct"' +
      microPctInlineStyle(pct) +
      ">" +
      escapeHtml(pctText) +
      "</span>" +
      "</div>";
    return html;
  }

  function microDayCardHtml(dayLabel, totals) {
    var rows = "";
    MICRO_FIELDS.forEach(function (field) {
      var total = totals[field.key];
      var pct = dailyMicroPct(field.key, total);
      var pctText = pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "% DV";
      var amtText = total > 0 ? fmtNum(total) + " " + field.unit : "—";
      var tier = tierForMicroPct(pct);
      var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
      var rowCls = "dashboard__micro-day-row dashboard__micro-day-row--clickable";

      rows +=
        '<div class="' +
        rowCls +
        '"' +
        tierAttr +
        ">" +
        '<button type="button" class="dashboard__micro-day-name" data-micro-def="' +
        escapeAttr(field.key) +
        '" aria-haspopup="dialog">' +
        escapeHtml(field.label) +
        "</button>" +
        '<div class="dashboard__micro-day-meta">' +
        '<span class="dashboard__micro-day-pct"' +
        microPctInlineStyle(pct) +
        ">" +
        escapeHtml(pctText) +
        "</span>" +
        '<span class="dashboard__micro-day-amt">' +
        escapeHtml(amtText) +
        "</span>";
      if (showMicroDailyDv) {
        rows +=
          '<span class="dashboard__micro-day-dv-req">' +
          escapeHtml(microDailyDvText(field)) +
          "</span>";
      }
      rows += "</div></div>";
    });

    return (
      '<article class="dashboard__card dashboard__micro-day-card">' +
      '<span class="dashboard__label">' +
      escapeHtml(dayLabel) +
      "</span>" +
      '<div class="dashboard__micro-day-rows">' +
      rows +
      "</div></article>"
    );
  }

  function renderMicroWeeklyList() {
    if (!dashboardMicroListEl) return;

    var week = weekMicroTotals();
    var html = "";
    MICRO_FIELDS.forEach(function (field) {
      html += microWeeklyRowHtml(field, week[field.key]);
    });
    dashboardMicroListEl.innerHTML = html;
  }

  function renderMicroDailyGrid() {
    if (!dashboardMicroDailyGridEl) return;

    var html = "";
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      html += microDayCardHtml(day.label, microTotalsFromText(text));
    });
    dashboardMicroDailyGridEl.innerHTML = html;
  }

  function renderMicroRequirements() {
    if (!dashboardMicroListEl) return;

    syncMicroDailyDvToggleUi();
    syncMicroViewToggleUi();
    syncMicroHintText();

    if (dashboardMicroListEl) {
      dashboardMicroListEl.hidden = microViewDaily;
    }
    if (dashboardMicroDailyGridEl) {
      dashboardMicroDailyGridEl.hidden = !microViewDaily;
    }

    if (microViewDaily) {
      renderMicroDailyGrid();
    } else {
      renderMicroWeeklyList();
    }

    if (microGapsModalEl && !microGapsModalEl.hidden) {
      renderMicroGapsAiPreview();
    }
  }

  function longevityBarHtml(pct, limiting) {
    if (pct == null || isNaN(pct)) {
      return (
        '<div class="dashboard__longevity-bar dashboard__longevity-bar--empty" aria-hidden="true"></div>'
      );
    }
    var tier = tierForLongevityPct(pct, !!limiting);
    var width = Math.min(100, Math.max(4, pct));
    var color = tier ? tier.color : "#c8c8c4";
    return (
      '<div class="dashboard__longevity-bar" role="presentation" title="' +
      escapeAttr(fmtNum(pct) + "% of daily reference") +
      '"><div class="dashboard__longevity-bar-fill" style="width:' +
      escapeAttr(String(width)) +
      "%;background:" +
      escapeAttr(color) +
      '"></div></div>'
    );
  }

  function longevityListOpen() {
    return (
      '<div class="dashboard__longevity-table">' +
      '<div class="dashboard__longevity-thead" aria-hidden="true">' +
      "<span>Nutrient</span>" +
      "<span>Daily avg</span>" +
      "<span>% DV</span>" +
      "<span>Level</span>" +
      "</div>" +
      '<div class="dashboard__longevity-tbody" role="list">'
    );
  }

  function longevityListClose() {
    return "</div></div>";
  }

  function longevitySubgroupHtml(label, kind) {
    return (
      '<p class="dashboard__longevity-subgroup dashboard__longevity-subgroup--' +
      escapeAttr(kind || "neutral") +
      '">' +
      escapeHtml(label) +
      "</p>"
    );
  }

  function longevitySectionWrap(title, sectionDefKey, noteHtml, bodyHtml) {
    return (
      '<section class="dashboard__longevity-section">' +
      longevitySectionTitleHtml(title, sectionDefKey) +
      (noteHtml || "") +
      bodyHtml +
      "</section>"
    );
  }

  function longevityLegendHtml() {
    return (
      '<div class="dashboard__longevity-legend" role="note">' +
      '<span class="dashboard__longevity-legend-item dashboard__longevity-legend-item--aim">Aim ↑ higher % DV</span>' +
      '<span class="dashboard__longevity-legend-item dashboard__longevity-legend-item--limit">Limit ↓ lower % DV</span>' +
      '<span class="dashboard__longevity-legend-item dashboard__longevity-legend-item--micro">Dashed = from micro entries</span>' +
      "</div>"
    );
  }

  function longevityRowHtml(
    label,
    amtText,
    pctText,
    pct,
    extraClass,
    limiting,
    defKey,
    useMicroDef
  ) {
    var tier = tierForLongevityPct(pct, !!limiting);
    var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
    var rowCls = "dashboard__longevity-row" + (extraClass ? " " + extraClass : "");
    if (limiting) rowCls += " dashboard__longevity-row--limiting";
    var nameHtml;
    if (defKey) {
      rowCls += " dashboard__longevity-row--clickable";
      var defAttr = useMicroDef ? "data-micro-def" : "data-longevity-def";
      nameHtml =
        '<button type="button" class="dashboard__longevity-name" ' +
        defAttr +
        '="' +
        escapeAttr(defKey) +
        '" aria-haspopup="dialog">' +
        escapeHtml(label) +
        "</button>";
    } else {
      nameHtml =
        '<span class="dashboard__longevity-name">' + escapeHtml(label) + "</span>";
    }
    return (
      '<div class="' +
      rowCls +
      '"' +
      tierAttr +
      ' role="listitem">' +
      nameHtml +
      '<span class="dashboard__longevity-amt">' +
      escapeHtml(amtText) +
      "</span>" +
      '<span class="dashboard__longevity-pct"' +
      longevityPctInlineStyle(pct, !!limiting) +
      ">" +
      escapeHtml(pctText) +
      "</span>" +
      longevityBarHtml(pct, !!limiting) +
      "</div>"
    );
  }

  function longevityRowFromLongevityField(field, weekLongevity) {
    var total = weekLongevity[field.key];
    var pct = avgDailyLongevityPct(field.key, total);
    var pctText = pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "%";
    var amtText =
      total > 0
        ? fmtNum(avgDailyLongevity(field.key, total)) + " " + field.unit
        : "—";
    if (field.key === "glycemicIndex") {
      pctText = "per food";
      amtText = total > 0 ? "see GL" : "—";
    }
    return longevityRowHtml(
      field.label,
      amtText,
      pctText,
      pct,
      "",
      !!field.limiting,
      field.key,
      false
    );
  }

  function longevityRowFromMicroKey(microKey, label, limiting, weekMicro) {
    var field = microFieldByKey(microKey);
    var unit = field ? field.unit : "";
    var total = weekMicro[microKey] || 0;
    var pct = avgDailyMicroPct(microKey, total);
    var pctText = pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "%";
    var amtText = total > 0 ? fmtNum(total / DAYS.length) + " " + unit : "—";
    return longevityRowHtml(
      label || (field ? field.label : microKey),
      amtText,
      pctText,
      pct,
      "dashboard__longevity-row--from-micro",
      !!limiting,
      microKey,
      true
    );
  }

  function longevityRowsGroupedByLimit(fields, weekLongevity) {
    var watch = [];
    var aim = [];
    fields.forEach(function (field) {
      if (field.limiting) watch.push(field);
      else aim.push(field);
    });
    var html = "";
    if (watch.length) {
      html += longevitySubgroupHtml("Watch — lower % DV is better", "limit");
      watch.forEach(function (field) {
        html += longevityRowFromLongevityField(field, weekLongevity);
      });
    }
    if (aim.length) {
      html += longevitySubgroupHtml("Aim — higher % DV is better", "aim");
      aim.forEach(function (field) {
        html += longevityRowFromLongevityField(field, weekLongevity);
      });
    }
    return html;
  }

  function renderLongevityGiBuckets(buckets) {
    var sum = buckets.low + buckets.med + buckets.high;
    if (sum <= 0) {
      return '<p class="dashboard__longevity-note dashboard__longevity-note--gi">No GI data yet — add glycemic index and carbs on matched foods.</p>';
    }
    var pct = function (v) {
      return Math.round((v / sum) * 100);
    };
    var barMaxPx = 56;
    var bucket = function (val, cls, label) {
      var p = pct(val);
      var height = Math.max(4, Math.round((p / 100) * barMaxPx));
      return {
        bar:
          '<div class="dashboard__gi-bar-slot">' +
          '<div class="dashboard__gi-bucket-bar dashboard__gi-bucket-bar--' +
          cls +
          '" style="height:' +
          height +
          'px" title="' +
          escapeAttr(fmtNum(val) + " g carb-weighted") +
          '"></div></div>',
        label:
          '<span class="dashboard__gi-bucket-label">' +
          escapeHtml(label + " " + p + "%") +
          "</span>",
      };
    };
    var low = bucket(buckets.low, "low", "Low GI ≤55");
    var med = bucket(buckets.med, "med", "Med 56–69");
    var high = bucket(buckets.high, "high", "High ≥70");
    return (
      '<div class="dashboard__gi-chart">' +
      '<div class="dashboard__gi-bars">' +
      low.bar +
      med.bar +
      high.bar +
      "</div>" +
      '<div class="dashboard__gi-labels">' +
      low.label +
      med.label +
      high.label +
      "</div></div>"
    );
  }

  function renderLongevityPanel() {
    if (!dashboardLongevityContentEl) return;

    var weekLongevity = weekLongevityTotals();
    var weekMicro = weekMicroTotals();
    var derived = computeLongevityDerived(weekLongevity, weekMicro);
    var html = longevityLegendHtml();

    html += longevitySectionWrap(
      "Micronutrients from food",
      "sectionMicronutrients",
      '<p class="dashboard__longevity-note">Same values as your micro entries—shown here so you can reason about longevity alongside fats, compounds, and carbs. Sodium uses inverted colors (high % DV is a concern).</p>',
      longevityListOpen() +
        longevitySubgroupHtml("Watch — lower % DV is better", "limit") +
        MICRO_FIELDS.filter(function (field) {
          return !!LONGEVITY_MICRO_LIMITING_KEYS[field.key];
        })
          .map(function (field) {
            return longevityRowFromMicroKey(
              field.key,
              field.label,
              true,
              weekMicro
            );
          })
          .join("") +
        longevitySubgroupHtml("Aim — higher % DV is better", "aim") +
        MICRO_FIELDS.filter(function (field) {
          return !LONGEVITY_MICRO_LIMITING_KEYS[field.key];
        })
          .map(function (field) {
            return longevityRowFromMicroKey(
              field.key,
              field.label,
              false,
              weekMicro
            );
          })
          .join("") +
        longevityListClose()
    );

    LONGEVITY_GROUPS.forEach(function (group) {
      var groupFields = LONGEVITY_FIELDS.filter(function (field) {
        return field.group === group.id;
      });
      if (!groupFields.length) return;
      var body = longevityListOpen() + longevityRowsGroupedByLimit(groupFields, weekLongevity);
      if (group.id === "compounds") {
        body += longevitySubgroupHtml("Also from your micro entries", "micro");
        LONGEVITY_COMPOUNDS_FROM_MICRO.forEach(function (item) {
          body += longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        });
      }
      body += longevityListClose();
      html += longevitySectionWrap(group.label, group.sectionDefKey, "", body);
    });

    html += longevitySectionWrap(
      "Calcification & vascular balance",
      "sectionCalcification",
      '<p class="dashboard__longevity-note">Phosphorus is tracked under compounds above. Excess absorbable phosphate from cola and processed foods can pull calcium into arteries.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "TMAO balance",
      "sectionTmao",
      '<p class="dashboard__longevity-note">Gut bacteria turn precursors into TMAO. Compare ↑ precursors vs ↓ protectors—fiber, D and B vitamins, olive oil, fish oil.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("↑ Precursors — lower % DV is better", "limit") +
        LONGEVITY_TMAO_PRECURSOR_KEYS.map(function (key) {
          var field = longevityFieldByKey(key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity);
        }).join("") +
        longevitySubgroupHtml("↓ Protectors — higher % DV is better", "aim") +
        LONGEVITY_TMAO_LOWERING_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            false,
            weekMicro
          );
        }).join("") +
        LONGEVITY_TMAO_LOWERING_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowHtml(
            item.label,
            weekLongevity[item.key] > 0
              ? fmtNum(avgDailyLongevity(item.key, weekLongevity[item.key])) +
                " " +
                field.unit
              : "—",
            (function () {
              var pct = avgDailyLongevityPct(item.key, weekLongevity[item.key] || 0);
              return pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "%";
            })(),
            avgDailyLongevityPct(item.key, weekLongevity[item.key] || 0),
            "",
            false,
            item.key,
            false
          );
        }).join("") +
        longevityRowHtml(
          "EPA + DHA",
          derived.epaPlusDha > 0 ? fmtNum(derived.epaPlusDha) + " g" : "—",
          derived.epaPlusDha > 0 ? "combined" : "—",
          null,
          "dashboard__longevity-row--computed",
          false,
          "epaPlusDha",
          false
        ) +
        longevityListClose()
    );

    var o6o3 = derived.omega6To3;
    var o6o3Text = o6o3 == null || isNaN(o6o3) ? "—" : fmtNum(o6o3) + ":1";
    var o6o3Note =
      o6o3 != null && o6o3 <= longevityDvStatus.omega6To3IdealMax
        ? "≤ " + longevityDvStatus.omega6To3IdealMax + " ideal"
        : "—";
    var satUnsat = derived.satToUnsat;
    var transOk = derived.transFatG <= longevityDvStatus.transFatMaxGPerDay;
    var transPct = avgDailyLongevityPct("transFat", weekLongevity.transFat || 0);

    html += longevitySectionWrap(
      "Derived scores",
      "sectionDerived",
      '<p class="dashboard__longevity-note">Ratios and combined scores—easier to scan than raw grams alone.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("Watch — lower is better", "limit") +
        longevityRowHtml(
          "Omega-6 : Omega-3",
          o6o3Note,
          o6o3Text,
          null,
          "dashboard__longevity-row--computed",
          true,
          "omega6To3",
          false
        ) +
        longevityRowHtml(
          "Saturated : unsaturated",
          satUnsat == null ? "—" : "ratio",
          satUnsat == null || isNaN(satUnsat) ? "—" : fmtNum(satUnsat) + ":1",
          null,
          "dashboard__longevity-row--computed",
          true,
          "satToUnsat",
          false
        ) +
        longevityRowHtml(
          "Trans fat",
          derived.transFatG > 0 ? fmtNum(derived.transFatG) + " g" : "none logged",
          transOk ? "near zero ✓" : "elevated",
          transPct != null && !isNaN(transPct) ? transPct : transOk ? 25 : 110,
          "dashboard__longevity-row--computed",
          true,
          "transFat",
          false
        ) +
        longevitySubgroupHtml("Aim — higher is better", "aim") +
        longevityRowHtml(
          "EPA + DHA",
          derived.epaPlusDha > 0 ? fmtNum(derived.epaPlusDha) + " g" : "—",
          derived.epaPlusDha > 0 ? "combined" : "—",
          null,
          "dashboard__longevity-row--computed",
          false,
          "epaPlusDha",
          false
        ) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Glycemic load & GI distribution",
      "sectionGlycemic",
      '<p class="dashboard__longevity-note">GL = GI × carbs per serving ÷ 100. Portion size matters — prefer tracking GL over GI alone.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("Watch — lower glycemic load is better", "limit") +
        longevityRowHtml(
          "Avg daily glycemic load",
          derived.weekGl > 0 ? "from matched foods" : "—",
          derived.weekGl > 0 ? fmtNum(derived.weekGl) : "—",
          null,
          "dashboard__longevity-row--computed",
          true,
          "glycemicLoad",
          false
        ) +
        longevityListClose() +
        renderLongevityGiBuckets(derived.giBuckets)
    );

    dashboardLongevityContentEl.innerHTML = html;
  }

  function setLongevityPanelOpen(open) {
    longevityPanelOpen = !!open;
    if (dashboardLongevityToggleEl) {
      dashboardLongevityToggleEl.setAttribute(
        "aria-expanded",
        longevityPanelOpen ? "true" : "false"
      );
      dashboardLongevityToggleEl.classList.toggle(
        "dashboard__toggle--open",
        longevityPanelOpen
      );
    }
    if (dashboardLongevityPanelEl) {
      dashboardLongevityPanelEl.hidden = !longevityPanelOpen;
    }
    if (longevityPanelOpen) {
      renderLongevityPanel();
    }
  }

  function setWeekTotalOpen(open) {
    weekTotalOpen = !!open;
    if (dashboardWeekToggleEl) {
      dashboardWeekToggleEl.setAttribute("aria-expanded", weekTotalOpen ? "true" : "false");
      dashboardWeekToggleEl.classList.toggle("dashboard__toggle--open", weekTotalOpen);
    }
    if (weekSummaryEl) {
      weekSummaryEl.hidden = !weekTotalOpen;
    }
    if (weekTotalOpen && lastWeekTotals) {
      renderWeekSummary(lastWeekTotals);
    }
  }

  function setMicroRequirementsOpen(open) {
    microRequirementsOpen = !!open;
    if (dashboardMicroToggleEl) {
      dashboardMicroToggleEl.setAttribute("aria-expanded", microRequirementsOpen ? "true" : "false");
      dashboardMicroToggleEl.classList.toggle("dashboard__toggle--open", microRequirementsOpen);
    }
    if (dashboardMicroPanelEl) {
      dashboardMicroPanelEl.hidden = !microRequirementsOpen;
    }
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
  }

  function normalizeDemographic(value) {
    if (demographicDv && demographicDv.normalizeDemographic) {
      return demographicDv.normalizeDemographic(value);
    }
    return value === "female" ? "female" : "male";
  }

  function saveDemographic() {
    try {
      localStorage.setItem(STORAGE_KEY_DEMOGRAPHIC, demographic);
    } catch (e) {
      /* ignore */
    }
  }

  function loadDemographic() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_DEMOGRAPHIC);
      if (raw) {
        demographic = normalizeDemographic(raw);
      }
    } catch (e) {
      demographic = DEFAULT_DEMOGRAPHIC;
    }
  }

  function renderDemographicUi() {
    var metaMap = demographicDv ? demographicDv.META : {};
    var meta = metaMap[demographic] || metaMap[DEFAULT_DEMOGRAPHIC] || { icon: "♂", label: "Male" };
    if (demographicBadgeEl) {
      demographicBadgeEl.textContent = meta.icon;
      demographicBadgeEl.setAttribute("title", meta.label);
    }
    if (!demographicOptionsEl) return;
    var buttons = demographicOptionsEl.querySelectorAll("[data-demographic]");
    buttons.forEach(function (btn) {
      var id = btn.getAttribute("data-demographic");
      var selected = id === demographic;
      btn.classList.toggle("demographic__option--selected", selected);
      btn.setAttribute("aria-checked", selected ? "true" : "false");
    });
  }

  function setDemographic(id) {
    demographic = normalizeDemographic(id);
    saveDemographic();
    renderDemographicUi();
    renderMicroRequirements();
  }

  function addTotals(a, b) {
    return {
      protein: a.protein + b.protein,
      carbs: a.carbs + b.carbs,
      fats: a.fats + b.fats,
      proteinCal: a.proteinCal + b.proteinCal,
      carbsCal: a.carbsCal + b.carbsCal,
      fatsCal: a.fatsCal + b.fatsCal,
      totalCal: a.totalCal + b.totalCal,
    };
  }

  function emptyTotals() {
    return {
      protein: 0,
      carbs: 0,
      fats: 0,
      proteinCal: 0,
      carbsCal: 0,
      fatsCal: 0,
      totalCal: 0,
    };
  }

  function dashboardCardHtml(label, totals) {
    return (
      '<article class="dashboard__card">' +
      '<span class="dashboard__label">' +
      escapeHtml(label) +
      "</span>" +
      '<div class="dashboard__row"><span class="dashboard__macro">Protein</span><span class="dashboard__val">' +
      fmtNum(totals.protein) +
      "g · " +
      fmtNum(totals.proteinCal) +
      " cal</span></div>" +
      '<div class="dashboard__row"><span class="dashboard__macro">Carbs</span><span class="dashboard__val">' +
      fmtNum(totals.carbs) +
      "g · " +
      fmtNum(totals.carbsCal) +
      " cal</span></div>" +
      '<div class="dashboard__row"><span class="dashboard__macro">Fats</span><span class="dashboard__val">' +
      fmtNum(totals.fats) +
      "g · " +
      fmtNum(totals.fatsCal) +
      " cal</span></div>" +
      '<div class="dashboard__row dashboard__row--total"><span class="dashboard__macro">Total</span><span class="dashboard__val">' +
      fmtNum(totals.totalCal) +
      " cal</span></div>" +
      "</article>"
    );
  }

  function renderWeekSummary(week) {
    if (!weekSummaryEl) return;

    weekSummaryEl.innerHTML =
      '<span class="week-summary__label">Week total</span>' +
      '<span class="week-summary__calories">' +
      fmtNumGrouped(week.totalCal) +
      " cal</span>" +
      '<div class="week-summary__extras" data-week-extras></div>';
  }

  function renderDashboard() {
    if (!dashboardGridEl) return;

    var week = emptyTotals();
    var html = "";

    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      var totals = totalsFromText(text);
      week = addTotals(week, totals);
      html += dashboardCardHtml(day.label, totals);
    });

    dashboardGridEl.innerHTML = html;
    lastWeekTotals = week;
    if (weekTotalOpen) {
      renderWeekSummary(week);
    }
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
    if (longevityPanelOpen) {
      renderLongevityPanel();
    }
  }

  function syncScroll(textarea, backdrop) {
    backdrop.scrollTop = textarea.scrollTop;
    backdrop.scrollLeft = textarea.scrollLeft;
  }

  function updateDayHighlights(textarea) {
    var editor = textarea.closest(".day__editor");
    if (!editor) return;
    var backdrop = editor.querySelector(".day__backdrop");
    if (!backdrop) return;

    var regex = buildHighlightRegex(keywordNames());
    backdrop.innerHTML = highlightedHtml(textarea.value, regex);
    syncScroll(textarea, backdrop);
  }

  function refreshAll() {
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      if (el) updateDayHighlights(el);
    });
    renderDashboard();
    updateDayClearButtons();
  }

  function saveFoodDefinitions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
    } catch (e) {
      /* ignore */
    }
  }

  function loadFoodDefinitions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = localStorage.getItem(STORAGE_KEY_LEGACY);
        if (raw) {
          localStorage.setItem(STORAGE_KEY, raw);
          localStorage.removeItem(STORAGE_KEY_LEGACY);
        }
      }
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return;
      data.forEach(function (item) {
        if (item && item.id && String(item.id).match(/\d+/)) {
          var n = parseInt(String(item.id).replace(/\D/g, ""), 10);
          if (!isNaN(n) && n >= nextId) nextId = n + 1;
        }
      });
      keywords = data.map(function (item) {
        var longevity = normalizeLongevity(item.longevity);
        longevity = mergeCarbQualityIntoLongevity(longevity, item.carbQuality);
        return {
          id:
            item.id != null && item.id !== "" ? String(item.id) : makeId(),
          name: typeof item.name === "string" ? item.name : "",
          protein: item.protein === "" || item.protein == null ? "" : item.protein,
          carbs: item.carbs === "" || item.carbs == null ? "" : item.carbs,
          fats: item.fats === "" || item.fats == null ? "" : item.fats,
          micros: normalizeMicros(item.micros),
          longevity: longevity,
        };
      });
      if (ensureUniqueKeywordIds()) {
        saveFoodDefinitions();
      }
    } catch (e) {
      keywords = [];
    }
  }

  function findIndex(id) {
    var key = String(id);
    for (var i = 0; i < keywords.length; i++) {
      if (String(keywords[i].id) === key) return i;
    }
    return -1;
  }

  function closeMicroModal() {
    if (!microModalEl) return;
    activeMicroId = null;
    microModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function closeLongevityModal() {
    if (!longevityModalEl) return;
    activeLongevityId = null;
    longevityModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function updateMicroButton(id) {
    if (!keywordsListEl) return;
    var i = findIndex(id);
    if (i < 0) return;
    var row = keywordsListEl.querySelector('[data-id="' + id + '"]');
    if (!row) return;
    var btn = row.querySelector('[data-action="micros"]');
    if (!btn) return;
    applyMicroButtonContent(btn, keywords[i]);
  }

  function updateLongevityButton(id) {
    if (!keywordsListEl) return;
    var i = findIndex(id);
    if (i < 0) return;
    var row = keywordsListEl.querySelector('[data-id="' + id + '"]');
    if (!row) return;
    var btn = row.querySelector('[data-action="longevity"]');
    if (!btn) return;
    var kw = keywords[i];
    var filled = hasLongevityFilled(kw.longevity);
    var text = longevityButtonText(kw);
    btn.classList.toggle("keywords__longevity--filled", filled);
    btn.setAttribute("aria-label", longevityButtonAria(kw));
    if (filled) {
      btn.setAttribute("data-tooltip", text);
    } else {
      btn.removeAttribute("data-tooltip");
    }
    btn.innerHTML =
      '<span class="keywords__longevity-text">' + escapeHtml(text) + "</span>";
  }

  function saveMicrosFromForm() {
    if (!activeMicroId || !microFormEl) return;
    var i = findIndex(activeMicroId);
    if (i < 0) return;

    var micros = blankMicros();
    var inputs = microFormEl.querySelectorAll("[data-micro-key]");
    inputs.forEach(function (input) {
      var key = input.getAttribute("data-micro-key");
      micros[key] = parseMacro(input.value);
      if (input.value.trim() === "") {
        micros[key] = "";
      }
    });

    keywords[i].micros = micros;
    saveFoodDefinitions();
    updateMicroButton(activeMicroId);
    refreshAll();
  }

  function saveLongevityFromForm() {
    if (!longevityFormEl || !activeLongevityId) return;
    var i = findIndex(activeLongevityId);
    if (i < 0) return;

    var longevity = blankLongevity();
    LONGEVITY_FIELDS.forEach(function (field) {
      var input = longevityFormEl.querySelector(
        '[data-longevity-key="' + field.key + '"]'
      );
      if (!input) return;
      var v = input.value.trim();
      if (v === "") {
        longevity[field.key] = "";
      } else {
        var n = parseFloat(v);
        longevity[field.key] = isNaN(n) ? "" : n;
      }
    });

    keywords[i].longevity = longevity;
    saveFoodDefinitions();
    updateLongevityButton(activeLongevityId);
    refreshAll();
  }

  function populateMicroForm(kw) {
    if (!microFormEl || !kw) return;
    MICRO_FIELDS.forEach(function (field) {
      var input = microFormEl.querySelector('[data-micro-key="' + field.key + '"]');
      if (input) {
        input.value = microInputValue(kw.micros[field.key]);
      }
    });
  }

  function openMicroModal(id) {
    if (!microModalEl || !microFormEl) return;
    var i = findIndex(id);
    if (i < 0) return;

    if (activeImportId) {
      closeImportModal();
    }
    if (activePositionId) closeKeywordPositionModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();

    if (activeMicroId && activeMicroId !== id) {
      saveMicrosFromForm();
    }

    activeMicroId = id;
    var kw = keywords[i];

    if (microModalFoodEl) {
      microModalFoodEl.textContent = kw.name.trim()
        ? kw.name.trim()
        : "Untitled food";
    }

    populateMicroForm(kw);
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
    }

    microModalEl.hidden = false;
    updateBodyModalOpen();

    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    var first = microFormEl.querySelector("input");
    if (first) first.focus();
  }

  function populateLongevityForm(kw) {
    if (!longevityFormEl || !kw) return;
    LONGEVITY_FIELDS.forEach(function (field) {
      var input = longevityFormEl.querySelector(
        '[data-longevity-key="' + field.key + '"]'
      );
      if (input) {
        input.value = microInputValue(kw.longevity[field.key]);
      }
    });
  }

  function openLongevityModal(id) {
    if (!longevityModalEl || !longevityFormEl) return;
    var i = findIndex(id);
    if (i < 0) return;

    if (activeImportId) closeImportModal();
    if (activePositionId) closeKeywordPositionModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (activeMicroId && activeMicroId !== id) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId && activeLongevityId !== id) {
      saveLongevityFromForm();
    }

    activeLongevityId = id;
    var kw = keywords[i];

    if (longevityModalFoodEl) {
      longevityModalFoodEl.textContent = kw.name.trim()
        ? kw.name.trim()
        : "Untitled food";
    }

    populateLongevityForm(kw);
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
    }

    longevityModalEl.hidden = false;
    updateBodyModalOpen();

    var first = longevityFormEl.querySelector("input");
    if (first) first.focus();
  }

  function initMicroForm() {
    if (!microFormEl) return;

    microFormEl.innerHTML = MICRO_FIELDS.map(function (field) {
      return (
        '<label class="micro-form__field">' +
        '<span class="micro-form__label">' +
        escapeHtml(field.label) +
        " (" +
        escapeHtml(field.code) +
        ')</span><span class="micro-form__unit">' +
        escapeHtml(field.unit) +
        "</span>" +
        '<input type="number" class="micro-form__input" min="0" step="0.1" inputmode="decimal" ' +
        'data-micro-key="' +
        escapeAttr(field.key) +
        '" placeholder="0">' +
        "</label>"
      );
    }).join("");
  }

  function initLongevityForm() {
    if (!longevityFormEl) return;

    longevityFormEl.innerHTML = LONGEVITY_GROUPS.map(function (group) {
      var fields = LONGEVITY_FIELDS.filter(function (f) {
        return f.group === group.id;
      });
      if (!fields.length) return "";
      return (
        '<fieldset class="longevity-form__group">' +
        '<legend class="longevity-form__legend">' +
        escapeHtml(group.label) +
        "</legend>" +
        '<div class="longevity-form__grid">' +
        fields
          .map(function (field) {
            return (
              '<label class="longevity-form__field">' +
              '<span class="longevity-form__label">' +
              escapeHtml(field.label) +
              " (" +
              escapeHtml(field.code) +
              ")</span>" +
              '<span class="longevity-form__unit">' +
              escapeHtml(field.unit) +
              "</span>" +
              '<input type="number" class="longevity-form__input" min="0" step="0.1" inputmode="decimal" ' +
              'data-longevity-key="' +
              escapeAttr(field.key) +
              '" placeholder="0">' +
              "</label>"
            );
          })
          .join("") +
        "</div></fieldset>"
      );
    }).join("");
  }

  function scheduleMicroSave() {
    clearTimeout(microSaveTimer);
    microSaveTimer = setTimeout(saveMicrosFromForm, 250);
  }

  function scheduleLongevitySave() {
    clearTimeout(longevitySaveTimer);
    longevitySaveTimer = setTimeout(saveLongevityFromForm, 250);
  }

  function ensureUniqueKeywordIds() {
    var seen = {};
    var changed = false;
    keywords.forEach(function (kw) {
      var original = kw.id != null ? String(kw.id) : "";
      var id = original;
      if (!id || seen[id]) {
        id = makeId();
      }
      if (id !== original) changed = true;
      seen[id] = true;
      kw.id = id;
    });
    return changed;
  }

  function keywordRowIndex(row) {
    if (!keywordsListEl || !row) return -1;
    return Array.prototype.indexOf.call(keywordsListEl.children, row);
  }

  function syncAllFieldsFromDom() {
    if (!keywordsListEl) return;
    keywordsListEl.querySelectorAll(".keywords__row").forEach(function (row) {
      syncFieldFromDom(row);
    });
  }

  function keywordPositionOptionLabel(index, currentIndex, kw) {
    var name =
      kw && kw.name && kw.name.trim() ? kw.name.trim() : "Untitled food";
    var label = String(index + 1) + " — " + name;
    if (index === currentIndex) label += " (current)";
    return label;
  }

  function showKeywordPositionError(message) {
    if (!keywordPositionErrorEl) return;
    if (!message) {
      keywordPositionErrorEl.hidden = true;
      keywordPositionErrorEl.textContent = "";
      return;
    }
    keywordPositionErrorEl.hidden = false;
    keywordPositionErrorEl.textContent = message;
  }

  function closeKeywordPositionModal() {
    if (!keywordPositionModalEl) return;
    activePositionId = null;
    activePositionIndex = -1;
    keywordPositionModalEl.hidden = true;
    showKeywordPositionError("");
    updateBodyModalOpen();
  }

  function populateKeywordPositionSelect(currentIndex) {
    if (!keywordPositionSelectEl) return;
    var html = "";
    keywords.forEach(function (kw, index) {
      html +=
        '<option value="' +
        (index + 1) +
        '"' +
        (index === currentIndex ? " selected" : "") +
        ">" +
        escapeHtml(keywordPositionOptionLabel(index, currentIndex, kw)) +
        "</option>";
    });
    keywordPositionSelectEl.innerHTML = html;
  }

  function openKeywordPositionModalByIndex(i) {
    if (!keywordPositionModalEl || !keywordPositionSelectEl) return;
    syncAllFieldsFromDom();
    if (i < 0 || i >= keywords.length) return;

    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }
    if (activeImportId) closeImportModal();

    activePositionIndex = i;
    activePositionId = keywords[i].id;
    if (keywordPositionFoodEl) {
      keywordPositionFoodEl.textContent =
        "Moving: " +
        (keywords[i].name.trim() ? keywords[i].name.trim() : "Untitled food");
    }
    populateKeywordPositionSelect(i);
    showKeywordPositionError("");
    keywordPositionModalEl.hidden = false;
    updateBodyModalOpen();
    keywordPositionSelectEl.focus();
  }

  function closeKeywordEditorModalsForId(id) {
    if (activeMicroId === id) closeMicroModal();
    if (activeLongevityId === id) closeLongevityModal();
    if (activeImportId === id) closeImportModal();
    if (
      activePositionIndex >= 0 &&
      keywords[activePositionIndex] &&
      String(keywords[activePositionIndex].id) === String(id)
    ) {
      closeKeywordPositionModal();
    }
  }

  function moveKeywordToPositionByIndex(fromIndex, position) {
    syncAllFieldsFromDom();
    if (fromIndex < 0 || fromIndex >= keywords.length) return;
    var to = position - 1;
    if (to < 0 || to >= keywords.length || fromIndex === to) return;

    closeKeywordEditorModalsForId(keywords[fromIndex].id);

    var item = keywords.splice(fromIndex, 1)[0];
    keywords.splice(to, 0, item);
    saveFoodDefinitions();
    renderKeywords();
    refreshAll();
  }

  function applyKeywordPositionMove() {
    if (activePositionIndex < 0 || !keywordPositionSelectEl) return;
    var position = parseInt(keywordPositionSelectEl.value, 10);
    if (isNaN(position) || position < 1 || position > keywords.length) {
      showKeywordPositionError(
        "Choose a position between 1 and " + keywords.length + "."
      );
      return;
    }
    var fromIndex = activePositionIndex;
    closeKeywordPositionModal();
    moveKeywordToPositionByIndex(fromIndex, position);
  }

  function moveKeywordByIndex(i, delta) {
    syncAllFieldsFromDom();
    var j = i + delta;
    if (i < 0 || i >= keywords.length || j < 0 || j >= keywords.length) return;
    closeKeywordEditorModalsForId(keywords[i].id);
    var tmp = keywords[i];
    keywords[i] = keywords[j];
    keywords[j] = tmp;
    saveFoodDefinitions();
    renderKeywords();
    refreshAll();
  }

  function confirmRemoveKeyword(kw) {
    var name = kw && kw.name ? kw.name.trim() : "";
    var label = name ? '"' + name + '"' : "this untitled food";
    return window.confirm(
      "Delete the food definition " + label + "? This cannot be undone."
    );
  }

  function removeKeywordByIndex(i) {
    syncAllFieldsFromDom();
    if (i < 0 || i >= keywords.length) return;
    if (!confirmRemoveKeyword(keywords[i])) return;
    closeKeywordEditorModalsForId(keywords[i].id);
    keywords.splice(i, 1);
    saveFoodDefinitions();
    renderKeywords();
    refreshAll();
  }

  function addKeyword() {
    keywords.push(blankKeyword());
    saveFoodDefinitions();
    renderKeywords();
    refreshAll();
    var lastRow = keywordsListEl.lastElementChild;
    if (lastRow) {
      var nameInput = lastRow.querySelector('[data-field="name"]');
      if (nameInput) nameInput.focus();
    }
  }

  function syncFieldFromDom(row) {
    var i = keywordRowIndex(row);
    if (i < 0 || i >= keywords.length) return;

    var nameEl = row.querySelector('[data-field="name"]');
    var proteinEl = row.querySelector('[data-field="protein"]');
    var carbsEl = row.querySelector('[data-field="carbs"]');
    var fatsEl = row.querySelector('[data-field="fats"]');

    keywords[i].name = nameEl ? nameEl.value : "";
    keywords[i].protein = proteinEl ? parseMacro(proteinEl.value) : "";
    keywords[i].carbs = carbsEl ? parseMacro(carbsEl.value) : "";
    keywords[i].fats = fatsEl ? parseMacro(fatsEl.value) : "";
  }

  function loadKeywordReorderOpen() {
    try {
      keywordReorderOpen =
        localStorage.getItem(STORAGE_KEY_REORDER) === "true";
    } catch (e) {
      keywordReorderOpen = false;
    }
  }

  function saveKeywordReorderOpen() {
    try {
      localStorage.setItem(
        STORAGE_KEY_REORDER,
        keywordReorderOpen ? "true" : "false"
      );
    } catch (e) {
      /* ignore */
    }
  }

  function updateKeywordReorderUi() {
    if (keywordsTableEl) {
      keywordsTableEl.classList.toggle(
        "keywords__table--reorder-open",
        keywordReorderOpen
      );
    }
    if (keywordsReorderToggleEl) {
      keywordsReorderToggleEl.setAttribute(
        "aria-expanded",
        keywordReorderOpen ? "true" : "false"
      );
      keywordsReorderToggleEl.setAttribute(
        "aria-label",
        keywordReorderOpen ? "Hide reorder controls" : "Show reorder controls"
      );
    }
  }

  function setKeywordReorderOpen(open) {
    keywordReorderOpen = !!open;
    if (!keywordReorderOpen && activePositionId) {
      closeKeywordPositionModal();
    }
    saveKeywordReorderOpen();
    updateKeywordReorderUi();
  }

  function toggleKeywordReorderOpen() {
    setKeywordReorderOpen(!keywordReorderOpen);
  }

  function renderKeywords() {
    if (!keywordsListEl) return;

    keywordsListEl.innerHTML = "";

    keywords.forEach(function (kw, index) {
      var tr = document.createElement("tr");
      tr.className = "keywords__row";
      tr.setAttribute("data-id", kw.id);

      var proteinVal = kw.protein === "" ? "" : kw.protein;
      var carbsVal = kw.carbs === "" ? "" : kw.carbs;
      var fatsVal = kw.fats === "" ? "" : kw.fats;

      tr.innerHTML =
        '<td class="keywords__order">' +
        '<div class="keywords__order-cell">' +
        '<span class="keywords__num" aria-hidden="true">' +
        (index + 1) +
        "</span>" +
        '<div class="keywords__order-controls">' +
        '<div class="keywords__order-steppers">' +
        '<button type="button" class="keywords__move" data-action="up" aria-label="Move up"' +
        (index === 0 ? " disabled" : "") +
        ">↑</button>" +
        '<button type="button" class="keywords__move" data-action="down" aria-label="Move down"' +
        (index === keywords.length - 1 ? " disabled" : "") +
        ">↓</button>" +
        "</div>" +
        '<button type="button" class="keywords__move keywords__move--position" data-action="position" aria-label="Move to position"' +
        (keywords.length === 1 ? " disabled" : "") +
        ">Jump</button>" +
        "</div></div></td>" +
        '<td class="keywords__name">' +
        '<input type="text" class="keywords__input keywords__input--name" data-field="name" value="' +
        escapeAttr(kw.name) +
        '" placeholder="e.g. chicken" spellcheck="false">' +
        "</td>" +
        '<td class="keywords__macro">' +
        '<input type="number" class="keywords__input keywords__input--num" data-field="protein" min="0" step="0.1" inputmode="decimal" placeholder="0" value="' +
        escapeAttr(proteinVal) +
        '">' +
        "</td>" +
        '<td class="keywords__macro">' +
        '<input type="number" class="keywords__input keywords__input--num" data-field="carbs" min="0" step="0.1" inputmode="decimal" placeholder="0" value="' +
        escapeAttr(carbsVal) +
        '">' +
        "</td>" +
        '<td class="keywords__macro">' +
        '<input type="number" class="keywords__input keywords__input--num" data-field="fats" min="0" step="0.1" inputmode="decimal" placeholder="0" value="' +
        escapeAttr(fatsVal) +
        '">' +
        "</td>" +
        '<td class="keywords__micros-cell">' +
        microsButtonHtml(kw) +
        "</td>" +
        '<td class="keywords__longevity-cell">' +
        longevityButtonHtml(kw) +
        "</td>" +
        '<td class="keywords__actions">' +
        '<button type="button" class="keywords__import" data-action="import" aria-label="Import food definition as JSON">Import</button>' +
        '<button type="button" class="keywords__delete" data-action="delete" aria-label="Delete food definition">Delete</button>' +
        "</td>";

      keywordsListEl.appendChild(tr);
    });

    if (keywordsEmptyEl) {
      keywordsEmptyEl.hidden = keywords.length > 0;
    }

    updateKeywordReorderUi();
  }

  function dayById(id) {
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].id === id) return DAYS[i];
    }
    return null;
  }

  function dayNotesPayload() {
    var out = {};
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      out[day.id] = el ? el.value : "";
    });
    return out;
  }

  function saveDayNotes() {
    try {
      localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(dayNotesPayload()));
    } catch (e) {
      /* ignore */
    }
  }

  function loadDayNotes() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_DAYS);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return;
      DAYS.forEach(function (day) {
        var el = document.getElementById(day.id);
        if (el && typeof data[day.id] === "string") {
          el.value = data[day.id];
        }
      });
    } catch (e) {
      /* ignore */
    }
  }

  function exportAllDayMealsJson() {
    return JSON.stringify(dayNotesPayload(), null, 2);
  }

  function exportAllDayMeals() {
    var json = exportAllDayMealsJson();
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "nutrients-day-meals.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function getImportAllMealsMissingMode() {
    var checked = document.querySelector(
      'input[name="import-all-meals-missing"]:checked'
    );
    return checked && checked.value === "keep" ? "keep" : "empty";
  }

  function parseImportAllDayMealsObject(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Invalid JSON");
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error(
        "JSON must be an object with day ids (mon, tue, wed, thu, fri, sat, sun)"
      );
    }

    return data;
  }

  function confirmImportAllDayMealsApply(missingMode) {
    var suffix =
      missingMode === "keep"
        ? " Days not in the JSON will be left unchanged."
        : " Days not in the JSON will be cleared.";
    if (!anyDayHasNotes()) return true;
    return window.confirm(
      "Apply imported day meals? Listed days will be updated." +
        suffix +
        " This cannot be undone."
    );
  }

  function applyImportAllDayMealsReplace(raw) {
    var missingMode = getImportAllMealsMissingMode();
    if (!confirmImportAllDayMealsApply(missingMode)) {
      throw new Error("cancelled");
    }

    var data = parseImportAllDayMealsObject(raw);

    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      if (!el) return;

      if (day.id in data) {
        if (typeof data[day.id] !== "string") {
          throw new Error(day.label + " must be a string");
        }
        el.value = data[day.id];
      } else if (missingMode === "empty") {
        el.value = "";
      }
    });
    saveDayNotes();
  }

  function showImportAllMealsError(message) {
    if (!importAllMealsErrorEl) return;
    if (!message) {
      importAllMealsErrorEl.hidden = true;
      importAllMealsErrorEl.textContent = "";
      return;
    }
    importAllMealsErrorEl.hidden = false;
    importAllMealsErrorEl.textContent = message;
  }

  function closeImportAllMealsModal() {
    if (!importAllMealsModalEl) return;
    importAllMealsModalEl.hidden = true;
    showImportAllMealsError("");
    updateBodyModalOpen();
  }

  function openImportAllMealsModal() {
    if (!importAllMealsModalEl || !importAllMealsJsonEl) return;

    if (activeImportId) closeImportModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
    }

    importAllMealsJsonEl.value = exportAllDayMealsJson();
    showImportAllMealsError("");
    importAllMealsModalEl.hidden = false;
    updateBodyModalOpen();
    importAllMealsJsonEl.focus();
    importAllMealsJsonEl.select();
  }

  function runImportAllMeals() {
    if (!importAllMealsJsonEl) return;
    try {
      applyImportAllDayMealsReplace(importAllMealsJsonEl.value);
      closeImportAllMealsModal();
      refreshAll();
      updateDayClearButtons();
    } catch (e) {
      if (e.message === "cancelled") return;
      showImportAllMealsError(e.message || "Import failed");
    }
  }

  function dayHasNotes(dayId) {
    var el = document.getElementById(dayId);
    return !!(el && el.value.trim());
  }

  function anyDayHasNotes() {
    for (var i = 0; i < DAYS.length; i++) {
      if (dayHasNotes(DAYS[i].id)) return true;
    }
    return false;
  }

  function updateDayClearButtons() {
    DAYS.forEach(function (day) {
      var btn = document.querySelector(
        '[data-action="clear-day"][data-day-id="' + day.id + '"]'
      );
      if (btn) btn.disabled = !dayHasNotes(day.id);
    });
    var clearAllBtn = document.getElementById("clear-all-days");
    if (clearAllBtn) clearAllBtn.disabled = !anyDayHasNotes();
  }

  function applyDayNoteChange(textarea) {
    updateDayHighlights(textarea);
    renderDashboard();
    saveDayNotes();
    updateDayClearButtons();
  }

  function confirmClearDay(dayId) {
    var day = dayById(dayId);
    var label = day ? day.label : dayId;
    return window.confirm(
      "Clear all meals for " +
        label +
        "? This cannot be undone."
    );
  }

  function confirmClearAllDays() {
    return window.confirm(
      "Clear meals for all " +
        DAYS.length +
        " days (Mon–Sun)? This cannot be undone."
    );
  }

  function clearDayNotes(dayId) {
    if (!dayHasNotes(dayId)) return;
    if (!confirmClearDay(dayId)) return;
    var el = document.getElementById(dayId);
    if (!el) return;
    el.value = "";
    saveDayNotes();
    applyDayNoteChange(el);
  }

  function clearAllDayNotes() {
    if (!anyDayHasNotes()) return;
    if (!confirmClearAllDays()) return;
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      if (el) el.value = "";
    });
    saveDayNotes();
    refreshAll();
  }

  function bindDay(textarea) {
    var backdrop = textarea.closest(".day__editor").querySelector(".day__backdrop");

    textarea.addEventListener("input", function () {
      applyDayNoteChange(textarea);
    });
    textarea.addEventListener("scroll", function () {
      syncScroll(textarea, backdrop);
    });
  }

  function onKeywordFieldChange(e) {
    var row = e.target.closest(".keywords__row");
    if (!row) return;
    syncFieldFromDom(row);
    saveFoodDefinitions();
    refreshAll();
  }

  if (keywordsReorderToggleEl) {
    keywordsReorderToggleEl.addEventListener("click", toggleKeywordReorderOpen);
  }

  if (keywordsListEl) {
    keywordsListEl.addEventListener("input", onKeywordFieldChange);
    keywordsListEl.addEventListener("change", onKeywordFieldChange);

    keywordsListEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn || btn.disabled) return;
      var row = btn.closest(".keywords__row");
      if (!row) return;
      var index = keywordRowIndex(row);
      if (index < 0 || index >= keywords.length) return;
      var id = keywords[index].id;
      var action = btn.getAttribute("data-action");

      if (action === "up") moveKeywordByIndex(index, -1);
      else if (action === "down") moveKeywordByIndex(index, 1);
      else if (action === "position") openKeywordPositionModalByIndex(index);
      else if (action === "delete") removeKeywordByIndex(index);
      else if (action === "micros") openMicroModal(id);
      else if (action === "longevity") openLongevityModal(id);
      else if (action === "import") openImportModalByIndex(index);
    });
  }

  if (keywordPositionApplyBtn) {
    keywordPositionApplyBtn.addEventListener("click", applyKeywordPositionMove);
  }

  if (keywordPositionCancelBtn) {
    keywordPositionCancelBtn.addEventListener("click", closeKeywordPositionModal);
  }

  if (keywordPositionModalEl) {
    keywordPositionModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-keyword-position-modal"]')) {
        closeKeywordPositionModal();
      }
    });
  }

  if (keywordPositionSelectEl) {
    keywordPositionSelectEl.addEventListener("change", function () {
      showKeywordPositionError("");
    });
  }

  if (importApplyBtn) {
    importApplyBtn.addEventListener("click", runImport);
  }

  if (importCancelBtn) {
    importCancelBtn.addEventListener("click", closeImportModal);
  }

  if (importModalEl) {
    importModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-import-modal"]')) {
        closeImportModal();
      }
    });
  }

  if (importJsonEl) {
    importJsonEl.addEventListener("input", function () {
      showImportError("");
    });
  }

  if (importAiToggleBtn) {
    importAiToggleBtn.addEventListener("click", function () {
      var open = importAiPanelEl && importAiPanelEl.hidden;
      setImportAiPanelOpen(open);
    });
  }

  if (importAiPortionEl) {
    importAiPortionEl.addEventListener("input", renderImportAiPreview);
  }

  if (importAiCopyBtn) {
    importAiCopyBtn.addEventListener("click", function () {
      copyAiPromptToClipboard(function () {
        var prev = importAiCopyBtn.textContent;
        importAiCopyBtn.textContent = "Copied!";
        setTimeout(function () {
          importAiCopyBtn.textContent = prev;
        }, 1600);
      });
    });
  }

  if (importOpenChatgptEl) {
    importOpenChatgptEl.addEventListener("click", function (e) {
      e.preventDefault();
      openAiService(CHATGPT_URL);
    });
  }

  if (importOpenClaudeEl) {
    importOpenClaudeEl.addEventListener("click", function (e) {
      e.preventDefault();
      openAiService(CLAUDE_URL);
    });
  }

  if (microFormEl) {
    microFormEl.addEventListener("input", scheduleMicroSave);
  }

  if (microModalDoneBtn) {
    microModalDoneBtn.addEventListener("click", function () {
      saveMicrosFromForm();
      closeMicroModal();
    });
  }

  if (microModalEl) {
    microModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-micro-modal"]')) {
        saveMicrosFromForm();
        closeMicroModal();
      }
    });
  }

  if (microGapsAiOpenBtn) {
    microGapsAiOpenBtn.addEventListener("click", openMicroGapsModal);
  }

  if (microGapsModalDoneBtn) {
    microGapsModalDoneBtn.addEventListener("click", closeMicroGapsModal);
  }

  if (microGapsModalEl) {
    microGapsModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-micro-gaps-modal"]')) {
        closeMicroGapsModal();
      }
    });
  }

  if (microGapsPreferenceEl) {
    microGapsPreferenceEl.addEventListener("change", renderMicroGapsAiPreview);
  }

  if (microGapsAdditionalEl) {
    microGapsAdditionalEl.addEventListener("input", renderMicroGapsAiPreview);
  }

  if (microGapsAiCopyBtn) {
    microGapsAiCopyBtn.addEventListener("click", function () {
      copyMicroGapsPromptToClipboard(function () {
        var prev = microGapsAiCopyBtn.textContent;
        microGapsAiCopyBtn.textContent = "Copied!";
        setTimeout(function () {
          microGapsAiCopyBtn.textContent = prev;
        }, 1600);
      });
    });
  }

  if (microGapsOpenChatgptEl) {
    microGapsOpenChatgptEl.addEventListener("click", function (e) {
      e.preventDefault();
      openMicroGapsAiService(CHATGPT_URL);
    });
  }

  if (microGapsOpenClaudeEl) {
    microGapsOpenClaudeEl.addEventListener("click", function (e) {
      e.preventDefault();
      openMicroGapsAiService(CLAUDE_URL);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
      return;
    }
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
      return;
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) {
      closeMicroGapsModal();
      return;
    }
    if (microDefModalEl && !microDefModalEl.hidden) {
      if (microDefFullscreen) {
        setMicroDefFullscreen(false);
        return;
      }
      closeMicroDefModal();
      return;
    }
    if (activeImportId) {
      closeImportModal();
      return;
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
      return;
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
  });

  initMicroForm();
  initLongevityForm();

  if (addKeywordBtn) {
    addKeywordBtn.addEventListener("click", addKeyword);
  }

  if (exportAllFoodsBtn) {
    exportAllFoodsBtn.addEventListener("click", exportAllFoods);
  }

  if (importAllFoodsBtn) {
    importAllFoodsBtn.addEventListener("click", openImportAllModal);
  }

  if (importSampleFoodsBtn) {
    importSampleFoodsBtn.addEventListener("click", importSampleFoods);
  }

  if (importAllApplyBtn) {
    importAllApplyBtn.addEventListener("click", runImportAll);
  }

  if (importAllCancelBtn) {
    importAllCancelBtn.addEventListener("click", closeImportAllModal);
  }

  if (importAllModalEl) {
    importAllModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-import-all-modal"]')) {
        closeImportAllModal();
      }
    });
  }

  if (importAllJsonEl) {
    importAllJsonEl.addEventListener("input", function () {
      showImportAllError("");
    });
  }

  var weekGridEl = document.querySelector(".week__grid");
  var clearAllDaysBtn = document.getElementById("clear-all-days");

  DAYS.forEach(function (day) {
    var el = document.getElementById(day.id);
    if (el) bindDay(el);
  });

  if (weekGridEl) {
    weekGridEl.addEventListener("click", function (e) {
      var btn = e.target.closest('[data-action="clear-day"]');
      if (!btn) return;
      var dayId = btn.getAttribute("data-day-id");
      if (dayId) clearDayNotes(dayId);
    });
  }

  if (clearAllDaysBtn) {
    clearAllDaysBtn.addEventListener("click", clearAllDayNotes);
  }

  if (exportAllMealsBtn) {
    exportAllMealsBtn.addEventListener("click", exportAllDayMeals);
  }

  if (importAllMealsBtn) {
    importAllMealsBtn.addEventListener("click", openImportAllMealsModal);
  }

  if (importAllMealsApplyBtn) {
    importAllMealsApplyBtn.addEventListener("click", runImportAllMeals);
  }

  if (importAllMealsCancelBtn) {
    importAllMealsCancelBtn.addEventListener("click", closeImportAllMealsModal);
  }

  if (importAllMealsModalEl) {
    importAllMealsModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-import-all-meals-modal"]')) {
        closeImportAllMealsModal();
      }
    });
  }

  if (importAllMealsJsonEl) {
    importAllMealsJsonEl.addEventListener("input", function () {
      showImportAllMealsError("");
    });
  }

  window.addEventListener("beforeunload", function () {
    syncAllFieldsFromDom();
    saveFoodDefinitions();
    saveDemographic();
    saveDayNotes();
  });

  function preparePrintLayout() {
    DAYS.forEach(function (day) {
      var ta = document.getElementById(day.id);
      if (ta) {
        updateDayHighlights(ta);
      }
    });
  }

  function printPage() {
    preparePrintLayout();
    document.body.classList.add("print-preview");
    window.print();
  }

  window.addEventListener("afterprint", function () {
    document.body.classList.remove("print-preview");
  });

  if (dashboardPrintBtn) {
    dashboardPrintBtn.addEventListener("click", printPage);
  }

  if (dashboardWeekToggleEl) {
    dashboardWeekToggleEl.addEventListener("click", function () {
      setWeekTotalOpen(!weekTotalOpen);
    });
  }

  if (dashboardMicroToggleEl) {
    dashboardMicroToggleEl.addEventListener("click", function () {
      setMicroRequirementsOpen(!microRequirementsOpen);
    });
  }

  if (dashboardMicroViewWeeklyEl) {
    dashboardMicroViewWeeklyEl.addEventListener("click", function () {
      setMicroViewDaily(false);
    });
  }

  if (dashboardMicroViewDailyEl) {
    dashboardMicroViewDailyEl.addEventListener("click", function () {
      setMicroViewDaily(true);
    });
  }

  if (dashboardMicroDvToggleEl) {
    dashboardMicroDvToggleEl.addEventListener("click", function () {
      showMicroDailyDv = !showMicroDailyDv;
      if (microRequirementsOpen) {
        renderMicroRequirements();
      } else {
        syncMicroDailyDvToggleUi();
      }
    });
  }

  if (dashboardLongevityToggleEl) {
    dashboardLongevityToggleEl.addEventListener("click", function () {
      setLongevityPanelOpen(!longevityPanelOpen);
    });
  }

  if (longevityFormEl) {
    longevityFormEl.addEventListener("input", scheduleLongevitySave);
  }

  if (longevityModalDoneBtn) {
    longevityModalDoneBtn.addEventListener("click", function () {
      saveLongevityFromForm();
      closeLongevityModal();
    });
  }

  if (longevityModalEl) {
    longevityModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-longevity-modal"]')) {
        saveLongevityFromForm();
        closeLongevityModal();
      }
    });
  }

  function handleMicroDefClick(e) {
    var btn = e.target.closest("[data-micro-def]");
    if (!btn) return;
    openMicroDefModal(btn.getAttribute("data-micro-def"));
  }

  if (dashboardMicroListEl) {
    dashboardMicroListEl.addEventListener("click", handleMicroDefClick);
  }

  if (dashboardMicroDailyGridEl) {
    dashboardMicroDailyGridEl.addEventListener("click", handleMicroDefClick);
  }

  if (dashboardLongevityContentEl) {
    dashboardLongevityContentEl.addEventListener("click", function (e) {
      var microBtn = e.target.closest("[data-micro-def]");
      if (microBtn) {
        openMicroDefModal(microBtn.getAttribute("data-micro-def"));
        return;
      }
      var longevityBtn = e.target.closest("[data-longevity-def]");
      if (longevityBtn) {
        openLongevityDefModal(longevityBtn.getAttribute("data-longevity-def"));
      }
    });
  }

  if (microDefModalDoneBtn) {
    microDefModalDoneBtn.addEventListener("click", closeMicroDefModal);
  }

  if (microDefFullscreenToggleBtn) {
    microDefFullscreenToggleBtn.addEventListener("click", function () {
      setMicroDefFullscreen(!microDefFullscreen);
    });
  }

  if (microDefModalEl) {
    microDefModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-micro-def-modal"]')) {
        closeMicroDefModal();
      }
    });
  }

  if (demographicOptionsEl) {
    demographicOptionsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-demographic]");
      if (!btn) return;
      setDemographic(btn.getAttribute("data-demographic"));
    });
  }

  function boot() {
    loadFoodDefinitions();
    loadKeywordReorderOpen();
    loadDayNotes();
    loadDemographic();
    renderDemographicUi();
    renderKeywords();
    refreshAll();
  }

  loadAppConfig(function () {
    var pending = 2;
    function definitionsReady() {
      pending -= 1;
      if (pending === 0) boot();
    }
    loadMicroDefinitions(definitionsReady);
    loadLongevityDefinitions(definitionsReady);
  });
})();
