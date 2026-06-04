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
  var demographicDv =
    typeof NutrientsDemographicDv !== "undefined" ? NutrientsDemographicDv : null;
  var DEFAULT_DEMOGRAPHIC = demographicDv
    ? demographicDv.DEFAULT_DEMOGRAPHIC
    : "male";
  var CAL_PROTEIN = 4;
  var CAL_CARBS = 4;
  var CAL_FATS = 9;
  var nextId = 1;

  var keywords = [];
  var keywordsListEl = document.getElementById("keywords-list");
  var keywordsEmptyEl = document.getElementById("keywords-empty");
  var addKeywordBtn = document.getElementById("add-keyword");
  var dashboardGridEl = document.getElementById("dashboard-grid");
  var weekSummaryEl = document.getElementById("week-summary");
  var dashboardWeekToggleEl = document.getElementById("dashboard-week-toggle");
  var dashboardMicroToggleEl = document.getElementById("dashboard-micro-toggle");
  var dashboardMicroPanelEl = document.getElementById("dashboard-micro-panel");
  var dashboardMicroListEl = document.getElementById("dashboard-micro-list");
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
  var activeMicroId = null;
  var activeImportId = null;
  var microSaveTimer;
  var demographic = DEFAULT_DEMOGRAPHIC;
  var weekTotalOpen = false;
  var microRequirementsOpen = false;
  var lastWeekTotals = null;

  var MICRO_FIELDS = [
    { key: "fiber", label: "Fiber", unit: "g", code: "f" },
    { key: "sodium", label: "Sodium", unit: "mg", code: "na" },
    { key: "potassium", label: "Potassium", unit: "mg", code: "k" },
    { key: "calcium", label: "Calcium", unit: "mg", code: "ca" },
    { key: "iron", label: "Iron", unit: "mg", code: "fe" },
    { key: "magnesium", label: "Magnesium", unit: "mg", code: "mg" },
    { key: "zinc", label: "Zinc", unit: "mg", code: "zn" },
    { key: "vitaminA", label: "Vitamin A", unit: "mcg", code: "a" },
    { key: "vitaminD", label: "Vitamin D", unit: "mcg", code: "d" },
    { key: "vitaminB12", label: "Vitamin B12", unit: "mcg", code: "b12" },
    { key: "vitaminC", label: "Vitamin C", unit: "mg", code: "c" },
    { key: "folate", label: "Folate", unit: "mcg", code: "fol" },
  ];

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

  function blankKeyword() {
    return {
      id: makeId(),
      name: "",
      protein: "",
      carbs: "",
      fats: "",
      micros: blankMicros(),
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

  function applyImportAllReplace(items) {
    if (!confirmImportAllReplace(items.length)) {
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
    return JSON.stringify(
      {
        name: "1 cup of peanuts",
        protein: 0,
        carbs: 0,
        fats: 0,
        micros: micros,
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
      lines.push("  - " + field.key + ": " + field.label + " (" + field.unit + ")");
    });
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
    if (!activeImportId || !importAiPortionEl) return;
    var i = findIndex(activeImportId);
    if (i < 0) return;
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

  function setImportAiPanelOpen(open) {
    if (!importAiPanelEl || !importAiToggleBtn) return;
    importAiPanelEl.hidden = !open;
    importAiToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    importAiToggleBtn.textContent = open ? "Hide AI help" : "Have AI help me";

    if (importJsonLabelEl) {
      importJsonLabelEl.textContent = open
        ? "Paste AI response (JSON)"
        : "JSON";
    }

    if (importJsonWrapEl) {
      importJsonWrapEl.classList.toggle("import-json-wrap--ai", open);
    }

    if (importJsonEl && activeImportId) {
      var i = findIndex(activeImportId);
      if (i >= 0) {
        if (open) {
          importJsonEl.value = "";
          importJsonEl.placeholder =
            '{\n  "name": "1 cup of peanuts",\n  "protein": 0\n}';
        } else {
          importJsonEl.placeholder = "";
          importJsonEl.value = exportFoodJson(keywords[i]);
        }
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
    if (!activeImportId && !activeMicroId) {
      document.body.classList.remove("modal-open");
    }
  }

  function openImportAllModal() {
    if (!importAllModalEl || !importAllJsonEl) return;

    if (activeImportId) closeImportModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }

    importAllJsonEl.value = exportAllFoodJson();
    showImportAllError("");
    importAllModalEl.hidden = false;
    document.body.classList.add("modal-open");
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
    importModalEl.hidden = true;
    showImportError("");
    setImportAiPanelOpen(false);
    if (!activeMicroId && (!importAllModalEl || importAllModalEl.hidden)) {
      document.body.classList.remove("modal-open");
    }
  }

  function applyImportJson(id, raw) {
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

    var i = findIndex(id);
    if (i < 0) {
      throw new Error("Food definition not found");
    }

    keywords[i].name = String(data.name).trim();

    if ("protein" in data) {
      keywords[i].protein = storedMacroValue(data.protein);
    }
    if ("carbs" in data) {
      keywords[i].carbs = storedMacroValue(data.carbs);
    }
    if ("fats" in data) {
      keywords[i].fats = storedMacroValue(data.fats);
    }

    if (
      data.micros &&
      typeof data.micros === "object" &&
      !Array.isArray(data.micros)
    ) {
      MICRO_FIELDS.forEach(function (field) {
        if (field.key in data.micros) {
          keywords[i].micros[field.key] = storedMacroValue(
            data.micros[field.key]
          );
        }
      });
    }

    saveFoodDefinitions();
  }

  function runImport() {
    if (!activeImportId || !importJsonEl) return;
    try {
      applyImportJson(activeImportId, importJsonEl.value);
      closeImportModal();
      renderKeywords();
      refreshAll();
    } catch (e) {
      showImportError(e.message || "Import failed");
    }
  }

  function openImportModal(id) {
    if (!importModalEl || !importJsonEl) return;
    var i = findIndex(id);
    if (i < 0) return;

    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }

    activeImportId = id;
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

    importModalEl.hidden = false;
    document.body.classList.add("modal-open");
    importJsonEl.focus();
    importJsonEl.select();
  }

  function fmtNum(n) {
    var rounded = Math.round(n * 10) / 10;
    return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
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
    return new RegExp("\\b(" + body + ")\\b", "gi");
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
    var re = new RegExp("\\b" + escapeRegex(name) + "\\b", "gi");
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

  function dailyDv(key) {
    if (demographicDv && demographicDv.getDailyMicroDv) {
      return demographicDv.getDailyMicroDv(demographic, key);
    }
    return 0;
  }

  function avgDailyMicroPct(key, weekTotal) {
    var dv = dailyDv(key);
    if (!dv) return null;
    var avgDaily = weekTotal / DAYS.length;
    return (avgDaily / dv) * 100;
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
        done();
      })
      .catch(function () {
        microDvStatus = DEFAULT_MICRO_DV_STATUS;
        done();
      });
  }

  function tierForMicroPct(pct) {
    if (pct == null || isNaN(pct)) return null;
    var tiers = microDvStatus.tiers;
    for (var i = 0; i < tiers.length; i++) {
      if (pct >= tiers[i].minPercent) return tiers[i];
    }
    return tiers[tiers.length - 1] || null;
  }

  function microPctInlineStyle(pct) {
    var tier = tierForMicroPct(pct);
    if (!tier) return "";
    return (
      ' style="color:' +
      escapeAttr(tier.color) +
      ";font-weight:" +
      tier.fontWeight +
      ';"'
    );
  }

  function renderMicroRequirements() {
    if (!dashboardMicroListEl) return;

    var week = weekMicroTotals();
    var html = "";

    MICRO_FIELDS.forEach(function (field) {
      var total = week[field.key];
      var pct = avgDailyMicroPct(field.key, total);
      var pctText =
        pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "% DV";
      var amtText =
        total > 0 ? fmtNum(total / DAYS.length) + " " + field.unit + "/day avg" : "—";
      var tier = tierForMicroPct(pct);
      var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";

      html +=
        '<div class="dashboard__micro-row"' +
        tierAttr +
        ' role="listitem">' +
        '<span class="dashboard__micro-name">' +
        escapeHtml(field.label) +
        "</span>" +
        '<span class="dashboard__micro-amt">' +
        escapeHtml(amtText) +
        "</span>" +
        '<span class="dashboard__micro-pct"' +
        microPctInlineStyle(pct) +
        ">" +
        escapeHtml(pctText) +
        "</span>" +
        "</div>";
    });

    dashboardMicroListEl.innerHTML = html;
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
      fmtNum(week.totalCal) +
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
      keywords = data.map(function (item) {
        return {
          id: item.id || makeId(),
          name: typeof item.name === "string" ? item.name : "",
          protein: item.protein === "" || item.protein == null ? "" : item.protein,
          carbs: item.carbs === "" || item.carbs == null ? "" : item.carbs,
          fats: item.fats === "" || item.fats == null ? "" : item.fats,
          micros: normalizeMicros(item.micros),
        };
      });
      data.forEach(function (item) {
        if (item.id && String(item.id).match(/\d+/)) {
          var n = parseInt(String(item.id).replace(/\D/g, ""), 10);
          if (!isNaN(n) && n >= nextId) nextId = n + 1;
        }
      });
    } catch (e) {
      keywords = [];
    }
  }

  function findIndex(id) {
    for (var i = 0; i < keywords.length; i++) {
      if (keywords[i].id === id) return i;
    }
    return -1;
  }

  function closeMicroModal() {
    if (!microModalEl) return;
    activeMicroId = null;
    microModalEl.hidden = true;
    if (
      !activeImportId &&
      (!importAllModalEl || importAllModalEl.hidden)
    ) {
      document.body.classList.remove("modal-open");
    }
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
    microModalEl.hidden = false;
    document.body.classList.add("modal-open");

    var first = microFormEl.querySelector("input");
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

  function scheduleMicroSave() {
    clearTimeout(microSaveTimer);
    microSaveTimer = setTimeout(saveMicrosFromForm, 250);
  }

  function moveKeyword(id, delta) {
    var i = findIndex(id);
    var j = i + delta;
    if (i < 0 || j < 0 || j >= keywords.length) return;
    if (activeMicroId === id) closeMicroModal();
    if (activeImportId === id) closeImportModal();
    var tmp = keywords[i];
    keywords[i] = keywords[j];
    keywords[j] = tmp;
    saveFoodDefinitions();
    renderKeywords();
    refreshAll();
  }

  function removeKeyword(id) {
    var i = findIndex(id);
    if (i < 0) return;
    if (activeMicroId === id) closeMicroModal();
    if (activeImportId === id) closeImportModal();
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
    var id = row.getAttribute("data-id");
    var i = findIndex(id);
    if (i < 0) return;

    var nameEl = row.querySelector('[data-field="name"]');
    var proteinEl = row.querySelector('[data-field="protein"]');
    var carbsEl = row.querySelector('[data-field="carbs"]');
    var fatsEl = row.querySelector('[data-field="fats"]');

    keywords[i].name = nameEl ? nameEl.value : "";
    keywords[i].protein = proteinEl ? parseMacro(proteinEl.value) : "";
    keywords[i].carbs = carbsEl ? parseMacro(carbsEl.value) : "";
    keywords[i].fats = fatsEl ? parseMacro(fatsEl.value) : "";
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
        '<div class="keywords__order-btns">' +
        '<button type="button" class="keywords__move" data-action="up" aria-label="Move up"' +
        (index === 0 ? " disabled" : "") +
        ">↑</button>" +
        '<button type="button" class="keywords__move" data-action="down" aria-label="Move down"' +
        (index === keywords.length - 1 ? " disabled" : "") +
        ">↓</button>" +
        "</div></td>" +
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
        '<td class="keywords__actions">' +
        '<button type="button" class="keywords__import" data-action="import" aria-label="Import food definition as JSON">Import</button>' +
        '<button type="button" class="keywords__delete" data-action="delete" aria-label="Delete food definition">Delete</button>' +
        "</td>";

      keywordsListEl.appendChild(tr);
    });

    if (keywordsEmptyEl) {
      keywordsEmptyEl.hidden = keywords.length > 0;
    }
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
      "Clear all notes for " +
        label +
        "? This cannot be undone."
    );
  }

  function confirmClearAllDays() {
    return window.confirm(
      "Clear notes for all " +
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

  if (keywordsListEl) {
    keywordsListEl.addEventListener("input", function (e) {
      var row = e.target.closest(".keywords__row");
      if (!row) return;
      syncFieldFromDom(row);
      saveFoodDefinitions();
      refreshAll();
    });

    keywordsListEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn || btn.disabled) return;
      var row = btn.closest(".keywords__row");
      if (!row) return;
      var id = row.getAttribute("data-id");
      var action = btn.getAttribute("data-action");

      if (action === "up") moveKeyword(id, -1);
      else if (action === "down") moveKeyword(id, 1);
      else if (action === "delete") removeKeyword(id);
      else if (action === "micros") openMicroModal(id);
      else if (action === "import") openImportModal(id);
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

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
      return;
    }
    if (activeImportId) {
      closeImportModal();
      return;
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
  });

  initMicroForm();

  if (addKeywordBtn) {
    addKeywordBtn.addEventListener("click", addKeyword);
  }

  if (exportAllFoodsBtn) {
    exportAllFoodsBtn.addEventListener("click", exportAllFoods);
  }

  if (importAllFoodsBtn) {
    importAllFoodsBtn.addEventListener("click", openImportAllModal);
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

  window.addEventListener("beforeunload", function () {
    saveFoodDefinitions();
    saveDemographic();
    saveDayNotes();
  });

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

  if (demographicOptionsEl) {
    demographicOptionsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-demographic]");
      if (!btn) return;
      setDemographic(btn.getAttribute("data-demographic"));
    });
  }

  function boot() {
    loadFoodDefinitions();
    loadDayNotes();
    loadDemographic();
    renderDemographicUi();
    renderKeywords();
    refreshAll();
  }

  loadAppConfig(boot);
})();
