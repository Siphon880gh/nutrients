(function () {
  var DAYS = ["mon", "tue", "wed", "thu", "fri", "sat"];
  var STORAGE_KEY = "nutrients-keywords";
  var nextId = 1;

  var keywords = [];
  var keywordsListEl = document.getElementById("keywords-list");
  var keywordsEmptyEl = document.getElementById("keywords-empty");
  var addKeywordBtn = document.getElementById("add-keyword");

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

  function blankKeyword() {
    return {
      id: makeId(),
      name: "",
      protein: "",
      carbs: "",
      fats: "",
    };
  }

  function parseMacro(value) {
    if (value === "" || value == null) return "";
    var n = parseFloat(value);
    return isNaN(n) ? "" : n;
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

  function updateAllHighlights() {
    DAYS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) updateDayHighlights(el);
    });
  }

  function saveKeywords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
    } catch (e) {
      /* ignore */
    }
  }

  function loadKeywords() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
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

  function moveKeyword(id, delta) {
    var i = findIndex(id);
    var j = i + delta;
    if (i < 0 || j < 0 || j >= keywords.length) return;
    var tmp = keywords[i];
    keywords[i] = keywords[j];
    keywords[j] = tmp;
    saveKeywords();
    renderKeywords();
    updateAllHighlights();
  }

  function removeKeyword(id) {
    var i = findIndex(id);
    if (i < 0) return;
    keywords.splice(i, 1);
    saveKeywords();
    renderKeywords();
    updateAllHighlights();
  }

  function addKeyword() {
    keywords.push(blankKeyword());
    saveKeywords();
    renderKeywords();
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
        '<td class="keywords__actions">' +
        '<button type="button" class="keywords__delete" data-action="delete" aria-label="Delete keyword">Delete</button>' +
        "</td>";

      keywordsListEl.appendChild(tr);
    });

    if (keywordsEmptyEl) {
      keywordsEmptyEl.hidden = keywords.length > 0;
    }
  }

  function bindDay(textarea) {
    var backdrop = textarea.closest(".day__editor").querySelector(".day__backdrop");

    textarea.addEventListener("input", function () {
      updateDayHighlights(textarea);
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
      saveKeywords();
      updateAllHighlights();
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
    });
  }

  if (addKeywordBtn) {
    addKeywordBtn.addEventListener("click", addKeyword);
  }

  DAYS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) bindDay(el);
  });

  loadKeywords();
  renderKeywords();
  updateAllHighlights();
})();
