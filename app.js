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
  var persist =
    typeof NutrientsPersist !== "undefined" ? NutrientsPersist : null;
  var auth = typeof NutrientsAuth !== "undefined" ? NutrientsAuth : null;
  var KEYWORDS_DEFAULT_PAGE_SIZE = 25;
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
  var keywordsPaginationEl = document.getElementById("keywords-pagination");
  var keywordsPaginationNavEl = document.getElementById("keywords-pagination-nav");
  var keywordsPageSizeEl = document.getElementById("keywords-page-size");
  var keywordsPageStatusEl = document.getElementById("keywords-page-status");
  var keywordsPageFirstBtn = document.getElementById("keywords-page-first");
  var keywordsPagePrevBtn = document.getElementById("keywords-page-prev");
  var keywordsPageNextBtn = document.getElementById("keywords-page-next");
  var keywordsPageLastBtn = document.getElementById("keywords-page-last");
  var keywordsSearchEl = document.getElementById("keywords-search");
  var keywordsSearchClearBtn = document.getElementById("keywords-search-clear");
  var keywordsFilterEmptyEl = document.getElementById("keywords-filter-empty");
  var keywordsCategoryOpenBtn = document.getElementById("keywords-category-open");
  var keywordsCategoryChipEl = document.getElementById("keywords-category-chip");
  var keywordsCategoryChipLabelEl = document.getElementById(
    "keywords-category-chip-label"
  );
  var keywordsCategoryClearBtn = document.getElementById("keywords-category-clear");
  var keywordsCategoryModalEl = document.getElementById("keywords-category-modal");
  var keywordsCategoryListEl = document.getElementById("keywords-category-list");
  var keywordsCategoryUncategorizedRevealBtn = document.getElementById(
    "keywords-category-uncategorized-reveal"
  );
  var keywordsCategoryUncategorizedCountEl = document.getElementById(
    "keywords-category-uncategorized-count"
  );
  var keywordsCategoryUncategorizedFilterBtn = document.getElementById(
    "keywords-category-uncategorized-filter"
  );
  var keywordsCategoryUncategorizedListEl = document.getElementById(
    "keywords-category-uncategorized-list"
  );
  var keywordsCategoryModalClearBtn = document.getElementById(
    "keywords-category-modal-clear"
  );
  var keywordsCategoryModalDoneBtn = document.getElementById(
    "keywords-category-modal-done"
  );
  var keywordReorderOpen = false;
  var keywordCaloriesOpen = false;
  var keywordsPageIndex = 0;
  var keywordsPageSize = KEYWORDS_DEFAULT_PAGE_SIZE;
  var keywordsFilterQuery = "";
  var keywordsCategoryFilter = "";
  var keywordsCategoryUncategorizedOpen = false;
  var foodCategories = [];
  var FOOD_CATEGORIES_URL = "definitions-food-categories.json";
  var KEYWORDS_CATEGORY_UNCATEGORIZED = "__uncategorized__";
  var keywordsCaloriesToggleEls = document.querySelectorAll(
    ".keywords__macro-toggle[data-action='toggle-calories']"
  );
  var keywordsTotalCalHeaderEl = document.querySelector(".keywords__th-total--cal");
  var addKeywordBtn = document.getElementById("add-keyword");
  var dashboardGridEl = document.getElementById("dashboard-grid");
  var weekSummaryEl = document.getElementById("week-summary");
  var dashboardPrintBtn = document.getElementById("dashboard-print");
  var dashboardWeekToggleEl = document.getElementById("dashboard-week-toggle");
  var dashboardMacrosJumpEl = document.getElementById("dashboard-macros-jump");
  var dashboardFoodDefinitionsJumpEl = document.getElementById(
    "dashboard-food-definitions-jump"
  );
  var dashboardFoodEntryJumpEl = document.getElementById(
    "dashboard-food-entry-jump"
  );
  var dashboardFoodSourcesOpenBtn = document.getElementById(
    "dashboard-food-sources-open"
  );
  var dashboardMicroToggleEl = document.getElementById("dashboard-micro-toggle");
  var dashboardMicroPanelEl = document.getElementById("dashboard-micro-panel");
  var dashboardMicroListEl = document.getElementById("dashboard-micro-list");
  var dashboardMicroDailyGridEl = document.getElementById("dashboard-micro-daily-grid");
  var dashboardMicroHintTextEl = document.getElementById("dashboard-micro-hint-text");
  var dashboardMicroIntakeToggleEl = document.getElementById(
    "dashboard-micro-intake-toggle"
  );
  var dashboardMicroIntakeLabelEl = document.getElementById(
    "dashboard-micro-intake-label"
  );
  var dashboardMicroIntakeClearEl = document.getElementById(
    "dashboard-micro-intake-clear"
  );
  var dashboardMicroIntakeListEl = document.getElementById(
    "dashboard-micro-intake-list"
  );
  var dashboardMicroConditionToggleEl = document.getElementById(
    "dashboard-micro-condition-toggle"
  );
  var dashboardMicroConditionLabelEl = document.getElementById(
    "dashboard-micro-condition-label"
  );
  var dashboardMicroConditionClearEl = document.getElementById(
    "dashboard-micro-condition-clear"
  );
  var dashboardMicroConditionListEl = document.getElementById(
    "dashboard-micro-condition-list"
  );
  var dashboardMicroStatusToggleEl = document.getElementById(
    "dashboard-micro-status-toggle"
  );
  var dashboardMicroStatusLabelEl = document.getElementById(
    "dashboard-micro-status-label"
  );
  var dashboardMicroStatusClearEl = document.getElementById(
    "dashboard-micro-status-clear"
  );
  var dashboardMicroStatusListEl = document.getElementById(
    "dashboard-micro-status-list"
  );
  var dashboardMicroStatusToggleIconEl = dashboardMicroStatusToggleEl
    ? dashboardMicroStatusToggleEl.querySelector(".dashboard__micro-status-toggle-icon use")
    : null;
  var dashboardMicroViewWeeklyEl = document.getElementById("dashboard-micro-view-weekly");
  var dashboardMicroViewDailyEl = document.getElementById("dashboard-micro-view-daily");
  var dashboardMicroDvToggleEl = document.getElementById("dashboard-micro-dv-toggle");
  var dashboardLongevityToggleEl = document.getElementById("dashboard-longevity-toggle");
  var dashboardLongevityPanelEl = document.getElementById("dashboard-longevity-panel");
  var dashboardLongevityNavEl = document.getElementById("dashboard-longevity-nav");
  var dashboardLongevityNavPrevEl = document.getElementById("dashboard-longevity-nav-prev");
  var dashboardLongevityNavPrevTitleEl = document.getElementById(
    "dashboard-longevity-nav-prev-title"
  );
  var dashboardLongevityNavCurrentTitleEl = document.getElementById(
    "dashboard-longevity-nav-current-title"
  );
  var dashboardLongevityNavNextEl = document.getElementById("dashboard-longevity-nav-next");
  var dashboardLongevityNavNextTitleEl = document.getElementById(
    "dashboard-longevity-nav-next-title"
  );
  var dashboardLongevityNavAllToggleEl = document.getElementById(
    "dashboard-longevity-nav-all-toggle"
  );
  var dashboardLongevityNavAllListEl = document.getElementById(
    "dashboard-longevity-nav-all-list"
  );
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
  var healthTimelineAiOpenBtn = document.getElementById("health-timeline-ai-open");
  var healthTimelineModalEl = document.getElementById("health-timeline-modal");
  var healthTimelineAiPreviewEl = document.getElementById("health-timeline-ai-preview");
  var healthTimelineAiCopyBtn = document.getElementById("health-timeline-ai-copy");
  var healthTimelineOpenChatgptEl = document.getElementById("health-timeline-open-chatgpt");
  var healthTimelineOpenClaudeEl = document.getElementById("health-timeline-open-claude");
  var healthTimelineModalDoneBtn = document.getElementById("health-timeline-modal-done");
  var microDefModalEl = document.getElementById("micro-def-modal");
  var microDefModalTitleEl = document.getElementById("micro-def-modal-title");
  var microDefTargetsEl = document.getElementById("micro-def-targets");
  var microDefBodyEl = document.getElementById("micro-def-body");
  var microDefSourcesEl = document.getElementById("micro-def-sources");
  var microDefModalFooterEl = document.getElementById("micro-def-modal-footer");
  var microDefModalBackBtn = document.getElementById("micro-def-modal-back");
  var microDefModalDoneBtn = document.getElementById("micro-def-modal-done");
  var microDefModalSourcesBtn = document.getElementById("micro-def-sources-btn");
  var microDefFullscreenToggleBtn = document.getElementById(
    "micro-def-fullscreen-toggle"
  );
  var phosphorusBinderModalEl = document.getElementById("phosphorus-binder-modal");
  var phosphorusBinderModalDoneBtn = document.getElementById(
    "phosphorus-binder-modal-done"
  );
  var microTipCaffeineEl = document.getElementById("micro-tip-caffeine");
  var microTipCataractsEl = document.getElementById("micro-tip-cataracts");
  var microTipHairLossEl = document.getElementById("micro-tip-hair-loss");
  var microTipHairLossHerbsEl = document.getElementById("micro-tip-hair-loss-herbs");
  var microTipHairLossPrescriptionsEl = document.getElementById(
    "micro-tip-hair-loss-prescriptions"
  );
  var microTipCommonDeficienciesEl = document.getElementById(
    "micro-tip-common-deficiencies"
  );
  var microTipFatSolubleEl = document.getElementById("micro-tip-fat-soluble");
  var caffeineTipModalEl = document.getElementById("caffeine-tip-modal");
  var caffeineTipModalDoneBtn = document.getElementById("caffeine-tip-modal-done");
  var fatsCholesterolTipModalEl = document.getElementById("fats-cholesterol-tip-modal");
  var fatsCholesterolTipModalDoneBtn = document.getElementById(
    "fats-cholesterol-tip-modal-done"
  );
  var tmaoProtectorsTipModalEl = document.getElementById("tmao-protectors-tip-modal");
  var tmaoProtectorsTipModalDoneBtn = document.getElementById(
    "tmao-protectors-tip-modal-done"
  );
  var fiberColonTipModalEl = document.getElementById("fiber-colon-tip-modal");
  var fiberColonTipModalDoneBtn = document.getElementById("fiber-colon-tip-modal-done");
  var berberineTipModalEl = document.getElementById("berberine-tip-modal");
  var berberineTipModalDoneBtn = document.getElementById("berberine-tip-modal-done");
  var pufaAntioxidantTipModalEl = document.getElementById("pufa-antioxidant-tip-modal");
  var pufaAntioxidantTipModalDoneBtn = document.getElementById(
    "pufa-antioxidant-tip-modal-done"
  );
  var histamineTipModalEl = document.getElementById("histamine-tip-modal");
  var histamineTipModalDoneBtn = document.getElementById("histamine-tip-modal-done");
  var dashDietTipModalEl = document.getElementById("dash-diet-tip-modal");
  var dashDietTipModalDoneBtn = document.getElementById("dash-diet-tip-modal-done");
  var foodNoteModalEl = document.getElementById("food-note-modal");
  var foodNoteModalTitleEl = document.getElementById("food-note-modal-title");
  var foodNoteModalBodyEl = document.getElementById("food-note-modal-body");
  var foodNoteModalDoneBtn = document.getElementById("food-note-modal-done");
  var settingsOpenBtn = document.getElementById("settings-open");
  var settingsModalEl = document.getElementById("settings-modal");
  var settingsModalDoneBtn = document.getElementById("settings-modal-done");
  var authLoggedOutEl = document.getElementById("auth-logged-out");
  var authLoggedInEl = document.getElementById("auth-logged-in");
  var authUserEmailEl = document.getElementById("auth-user-email");
  var authLoginOpenBtn = document.getElementById("auth-login-open");
  var authSignupOpenBtn = document.getElementById("auth-signup-open");
  var authLogoutBtn = document.getElementById("auth-logout");
  var authSignupModalEl = document.getElementById("auth-signup-modal");
  var authLoginModalEl = document.getElementById("auth-login-modal");
  var authSignupEmailEl = document.getElementById("auth-signup-email");
  var authSignupPasswordEl = document.getElementById("auth-signup-password");
  var authSignupErrorEl = document.getElementById("auth-signup-error");
  var authSignupCancelBtn = document.getElementById("auth-signup-cancel");
  var authSignupSubmitBtn = document.getElementById("auth-signup-submit");
  var authLoginEmailEl = document.getElementById("auth-login-email");
  var authLoginPasswordEl = document.getElementById("auth-login-password");
  var authLoginErrorEl = document.getElementById("auth-login-error");
  var authLoginCancelBtn = document.getElementById("auth-login-cancel");
  var authLoginSubmitBtn = document.getElementById("auth-login-submit");
  var settingsDemographicIconEl = document.getElementById("settings-demographic-icon");
  var settingsDemographicAbbrEl = document.getElementById("settings-demographic-abbr");
  var settingsTdeeEl = document.getElementById("settings-tdee");
  var settingsMacroBodyTypeEl = document.getElementById("settings-macro-body-type");
  var settingsMacroGoalEl = document.getElementById("settings-macro-goal");
  var settingsMacroSplitPreviewEl = document.getElementById(
    "settings-macro-split-preview"
  );
  var maxHrPopoverEl = document.getElementById("max-hr-popover");
  var maxHrPopoverAnchor = null;
  var maxHrPopoverPinned = false;
  var maxHrPopoverHideTimer = null;
  var settingsWeightEl = document.getElementById("settings-weight");
  var settingsWeightKgBtn = document.getElementById("settings-weight-kg");
  var settingsWeightLbBtn = document.getElementById("settings-weight-lb");
  var settingsTdeeCalcOpenBtn = document.getElementById("settings-tdee-calc-open");
  var tdeeCalculatorModalEl = document.getElementById("tdee-calculator-modal");
  var tdeeCalculatorCancelBtn = document.getElementById("tdee-calculator-cancel");
  var tdeeCalculatorApplyBtn = document.getElementById("tdee-calculator-apply");
  var tdeeCalcSexEl = document.getElementById("tdee-calc-sex");
  var tdeeCalcAgeEl = document.getElementById("tdee-calc-age");
  var tdeeCalcWeightEl = document.getElementById("tdee-calc-weight");
  var tdeeCalcWeightKgBtn = document.getElementById("tdee-calc-weight-kg");
  var tdeeCalcWeightLbBtn = document.getElementById("tdee-calc-weight-lb");
  var tdeeCalcHeightCmWrapEl = document.getElementById("tdee-calc-height-cm-wrap");
  var tdeeCalcHeightFtWrapEl = document.getElementById("tdee-calc-height-ft-wrap");
  var tdeeCalcHeightCmEl = document.getElementById("tdee-calc-height-cm");
  var tdeeCalcHeightFtEl = document.getElementById("tdee-calc-height-ft");
  var tdeeCalcHeightInEl = document.getElementById("tdee-calc-height-in");
  var tdeeCalcHeightCmBtn = document.getElementById("tdee-calc-height-cm-btn");
  var tdeeCalcHeightFtBtn = document.getElementById("tdee-calc-height-ft-btn");
  var tdeeCalcHeightCmBtn2 = document.getElementById("tdee-calc-height-cm-btn-2");
  var tdeeCalcHeightFtBtn2 = document.getElementById("tdee-calc-height-ft-btn-2");
  var tdeeCalcResistanceModeDaysBtn = document.getElementById("tdee-calc-resistance-mode-days");
  var tdeeCalcResistanceModeSetsBtn = document.getElementById("tdee-calc-resistance-mode-sets");
  var tdeeCalcResistanceDaysWrapEl = document.getElementById("tdee-calc-resistance-days-wrap");
  var tdeeCalcResistanceSetsWrapEl = document.getElementById("tdee-calc-resistance-sets-wrap");
  var tdeeCalcResistanceDaysEl = document.getElementById("tdee-calc-resistance-days");
  var tdeeCalcHeavySetsEl = document.getElementById("tdee-calc-heavy-sets");
  var tdeeCalcLightSetsEl = document.getElementById("tdee-calc-light-sets");
  var tdeeCalcCardioEnabledEl = document.getElementById("tdee-calc-cardio-enabled");
  var tdeeCalcCardioWrapEl = document.getElementById("tdee-calc-cardio-wrap");
  var tdeeCalcCardioDaysEl = document.getElementById("tdee-calc-cardio-days");
  var tdeeCalcCardioIntensityEl = document.getElementById("tdee-calc-cardio-intensity");
  var tdeeCalcActivityFactorEl = document.getElementById("tdee-calc-activity-factor");
  var tdeeCalcResultEl = document.getElementById("tdee-calc-result");
  var tdeeHintModalEl = document.getElementById("tdee-hint-modal");
  var tdeeHintModalDoneBtn = document.getElementById("tdee-hint-modal-done");
  var macroSplitHintModalEl = document.getElementById("macro-split-hint-modal");
  var macroSplitHintModalDoneBtn = document.getElementById("macro-split-hint-modal-done");
  var macroSplitCarouselPrevEl = document.getElementById("macro-split-carousel-prev");
  var macroSplitCarouselNextEl = document.getElementById("macro-split-carousel-next");
  var macroSplitCarouselIndicatorEl = document.getElementById("macro-split-carousel-indicator");
  var macroSplitCarouselCardEl = document.getElementById("macro-split-carousel-card");
  var macroSplitCarouselIndex = 0;
  var microDefFullscreen = false;
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
  var sortFoodsAlphabeticallyBtn = document.getElementById("sort-foods-alphabetically");
  var exportAllFoodsTopBtn = document.getElementById("export-all-foods-top");
  var importAllFoodsTopBtn = document.getElementById("import-all-foods-top");
  var importSampleFoodsTopBtn = document.getElementById("import-sample-foods-top");
  var sortFoodsAlphabeticallyTopBtn = document.getElementById("sort-foods-alphabetically-top");
  var starterGuideEl = document.getElementById("starter-guide");
  var starterGuideTextEl = document.getElementById("starter-guide-text");
  var starterGuideDismissEl = document.getElementById("starter-guide-dismiss");
  var starterGuideEligible = false;
  var starterGuideStep = null;
  var starterGuideTarget = null;
  var starterGuideScrollResizeBound = false;
  var IMPORT_SAMPLE_FOODS_URL = "samples/definitions-food.json";
  var IMPORT_SAMPLE_MEALS_URL = "samples/day-meals.json";
  var FOOD_SOURCES_PRECOMPUTED_URL = "definitions-food-sources.json";
  var importAllMealsModalEl = document.getElementById("import-all-meals-modal");
  var importAllMealsJsonEl = document.getElementById("import-all-meals-json");
  var importAllMealsErrorEl = document.getElementById("import-all-meals-error");
  var importAllMealsApplyBtn = document.getElementById("import-all-meals-apply");
  var importAllMealsCancelBtn = document.getElementById("import-all-meals-cancel");
  var exportAllMealsBtn = document.getElementById("export-all-meals");
  var importAllMealsBtn = document.getElementById("import-all-meals");
  var importSampleMealsBtn = document.getElementById("import-sample-meals");
  var copyWeekToThisBtn = document.getElementById("copy-week-to-this");
  var weekNavPrevBtn = document.getElementById("week-nav-prev");
  var weekNavNextBtn = document.getElementById("week-nav-next");
  var weekNavThisBtn = document.getElementById("week-nav-this");
  var weekNavLabelEl = document.getElementById("week-nav-label");
  var weekNavLabelTextEl = document.getElementById("week-nav-label-text");
  var weekNavFavoriteBtn = document.getElementById("week-nav-favorite");
  var favoritesOpenBtn = document.getElementById("favorites-open");
  var favoritesSidebarEl = document.getElementById("favorites-sidebar");
  var favoritesListEl = document.getElementById("favorites-list");
  var favoritesManageToggleBtn = document.getElementById(
    "favorites-manage-toggle"
  );
  var favoriteEditModalEl = document.getElementById("favorite-edit-modal");
  var favoriteEditModalTitleEl = document.getElementById(
    "favorite-edit-modal-title"
  );
  var favoriteEditModalHintEl = document.getElementById(
    "favorite-edit-modal-hint"
  );
  var favoriteEditNameEl = document.getElementById("favorite-edit-name");
  var favoriteEditDescriptionEl = document.getElementById(
    "favorite-edit-description"
  );
  var favoriteEditErrorEl = document.getElementById("favorite-edit-error");
  var favoriteEditSaveBtn = document.getElementById("favorite-edit-save");
  var favoriteEditCancelBtn = document.getElementById("favorite-edit-cancel");
  var favoritesManageListEl = document.getElementById("favorites-manage-list");
  var favoritesEmptyEl = document.getElementById("favorites-empty");
  var favoritesSidebarHintEl = document.getElementById(
    "favorites-sidebar-hint"
  );
  var favoritesSidebarTitleEl = document.getElementById(
    "favorites-sidebar-title"
  );
  var weekJumpModalEl = document.getElementById("week-jump-modal");
  var weekJumpDateEl = document.getElementById("week-jump-date");
  var weekJumpTypedEl = document.getElementById("week-jump-typed");
  var weekJumpPreviewEl = document.getElementById("week-jump-preview");
  var weekJumpErrorEl = document.getElementById("week-jump-error");
  var weekJumpApplyBtn = document.getElementById("week-jump-apply");
  var weekJumpCancelBtn = document.getElementById("week-jump-cancel");
  var copyDateModalEl = document.getElementById("copy-date-modal");
  var copyDateModalTitleEl = document.getElementById("copy-date-modal-title");
  var copyDateModalHintEl = document.getElementById("copy-date-modal-hint");
  var copyDateInputEl = document.getElementById("copy-date-input");
  var copyDateErrorEl = document.getElementById("copy-date-modal-error");
  var copyDateApplyBtn = document.getElementById("copy-date-apply");
  var copyDateCancelBtn = document.getElementById("copy-date-cancel");
  var copyDatePending = null;
  var EARLIEST_DIARY_DATE = "2026-05-01";
  var dayHighlightsToggleBtn = document.getElementById("day-highlights-toggle");
  var dayWordWrapToggleBtn = document.getElementById("day-word-wrap-toggle");
  var dayFoodNotesEl = document.getElementById("day-food-notes");
  var dayFoodNotesLabelsEl = document.getElementById("day-food-notes-labels");
  var dayFoodNotesPopoverEl = document.getElementById("day-food-notes-popover");
  var dayUnmatchedLinesEl = document.getElementById("day-unmatched-lines");
  var unmatchedCarouselOpen = false;
  var unmatchedCarouselIndex = 0;
  var unmatchedCarouselItems = [];
  var dayFoodNotesPinned = false;
  var dayFoodNotesActiveIndex = -1;
  var dayFoodNotesMatches = [];
  var dayFoodNotesHideTimer = null;
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
  var userTdee = null;
  var userMacroSplit = null;
  var userBodyWeightKg = null;
  var settingsWeightUnit = "lb";
  var tdeeCalcSex = DEFAULT_DEMOGRAPHIC;
  var tdeeCalcWeightUnit = "lb";
  var tdeeCalcHeightUnit = "ft";
  var tdeeCalcResistanceMode = "days";
  var tdeeCalcLastResult = null;
  var dayHighlightsEnabled = true;
  var dayWordWrapEnabled = true;
  var dayMealsByDate = {};
  var viewedWeekStart = null;
  var diaryFavorites = [];
  var activeFavoriteDayKey = null;
  var favoriteEditPending = null;
  var favoritesManaging = false;
  var dashboardMacroPctView = false;
  var macroNeedDenomMode = "target";
  var activeMacroRankDayId = null;
  var activeMacroRankTab = "protein";
  var activeMacroRankScope = "daily";
  var activeMacroRankSort = { key: "amount", dir: "desc" };
  var activeMacroRankFilter = "";
  var macroRankModalEl = document.getElementById("macro-rank-modal");
  var macroRankModalTitleEl = document.getElementById("macro-rank-modal-title");
  var macroRankModalSubtitleEl = document.getElementById("macro-rank-modal-subtitle");
  var macroRankTabsEl = document.getElementById("macro-rank-tabs");
  var macroRankScopeDailyBtn = document.getElementById("macro-rank-scope-daily");
  var macroRankScopeWeeklyBtn = document.getElementById("macro-rank-scope-weekly");
  var macroRankScopeInfoBtn = document.getElementById("macro-rank-scope-info");
  var macroRankFilterEl = document.getElementById("macro-rank-filter");
  var macroRankBodyEl = document.getElementById("macro-rank-body");
  var macroRankModalDoneBtn = document.getElementById("macro-rank-modal-done");
  var weekTotalOpen = false;
  var panelDisclaimerDismissed = false;
  var collapsedTipIds = Object.create(null);
  var DISMISSIBLE_TIP_SELECTOR =
    ".dashboard__micro-tip, .dashboard__longevity-processed-note";
  var microRequirementsOpen = false;
  var microFilterMenuOpen = null; // null | "intake" | "conditions" | "status"
  var microConditionFocus = null;
  var MICRO_INTAKE_FILTER_IDS = {
    wellAbsorbed: true,
    poorlyAbsorbed: true,
    fatSolubleVitamins: true,
    americanCommonDeficiencies: true,
  };
  var microStatusFilter = null;
  var MICRO_STATUS_FILTERS = {
    zero: { id: "zero", label: "Zero", icon: "#icon-micro-status-zero" },
    redOrZero: {
      id: "redOrZero",
      label: "Red or zero",
      icon: "#icon-micro-status-red-zero",
    },
    green: { id: "green", label: "Green", icon: "#icon-micro-status-green" },
    excess: { id: "excess", label: "Excess", icon: "#icon-micro-status-excess" },
  };
  var MICRO_STATUS_FILTER_DEFAULT_ICON = "#icon-micro-status-green";
  var showMicroDailyDv = false;
  var showAcuteSideEffects = false;
  var showAcuteAdverseEffects = false;
  var showDailyIntakeIcons = true;
  var filterStickyDailyIntake = false;
  var filterStickySideEffects = false;
  var filterStickyAdverseEffects = false;
  var filterStickyNutrientKeys = [];
  var highlightStickyDailyIntake = false;
  var highlightStickySideEffects = false;
  var highlightStickyAdverseEffects = false;
  var microViewDaily = false;
  var microMoreExpanded = false;
  var longevityPanelOpen = false;
  var longevityNavExpanded = false;
  var longevityNavActiveIndex = 0;
  var longevityNavScrollScheduled = false;
  var longevityNavListBuilt = false;
  var longevityNavSuppressSpy = false;
  var longevityNavScrollSettleTimer = null;
  var longevityNavHashUpdating = false;
  var longevityNavPendingHashSection = null;
  var longevityNavPushDepth = 0;
  var LONGEVITY_HASH_PREFIX = "longevity/";
  var activeLongevityId = null;
  var longevitySaveTimer;
  var lastWeekTotals = null;
  var microDefinitions = {};
  var foodNotesDefinitions = [];
  var FOOD_NOTES_URL = "definitions-food-notes.json";
  var longevityDefinitions = {};
  var activeMicroDefKey = null;
  var activeLongevityDefKey = null;
  var defModalReturnSources = null;
  /** When set, def modal sits above micro/longevity form modal; closing returns focus to that form. */
  var defModalStackedForm = null;
  /** When set, sources modal sits above the nutrient description modal. */
  var sourcesModalStackedOnDef = null;
  /** When set, food sources modal sits under an open nutrient description modal. */
  var foodSourcesStackedOnDef = null;
  /** When set, Food Sources was opened from a nutrient modal food-source chip; back reopens that def modal. */
  var foodSourcesReturnDefModal = null;
  var activeMicroSourcesKey = null;
  var activeMicroSourcesScope = "week";
  var activeMicroSourcesSort = { key: "amount", dir: "desc" };
  var activeMicroSourcesFilter = "";
  var activeLongevitySourcesKey = null;
  var activeLongevitySourcesKind = null;
  var activeLongevitySourcesSort = { key: "amount", dir: "desc" };
  var activeLongevitySourcesFilter = "";
  var microSourcesModalEl = document.getElementById("micro-sources-modal");
  var microSourcesModalTitleEl = document.getElementById("micro-sources-modal-title");
  var microSourcesScopeEl = document.getElementById("micro-sources-scope");
  var microSourcesFilterEl = document.getElementById("micro-sources-filter");
  var microSourcesBodyEl = document.getElementById("micro-sources-body");
  var microSourcesModalDoneBtn = document.getElementById("micro-sources-modal-done");
  var microSourcesFullscreenToggleBtn = document.getElementById(
    "micro-sources-fullscreen-toggle"
  );
  var longevitySourcesModalEl = document.getElementById("longevity-sources-modal");
  var longevitySourcesModalTitleEl = document.getElementById("longevity-sources-modal-title");
  var longevitySourcesModalSubtitleEl = document.getElementById(
    "longevity-sources-modal-subtitle"
  );
  var longevitySourcesFilterEl = document.getElementById("longevity-sources-filter");
  var longevitySourcesBodyEl = document.getElementById("longevity-sources-body");
  var longevitySourcesModalDoneBtn = document.getElementById("longevity-sources-modal-done");
  var longevitySourcesFullscreenToggleBtn = document.getElementById(
    "longevity-sources-fullscreen-toggle"
  );
  var foodSourcesModalEl = document.getElementById("food-sources-modal");
  var foodSourcesBodyEl = document.getElementById("food-sources-body");
  var foodSourcesFilterEl = document.getElementById("food-sources-filter");
  var foodSourcesModalDoneBtn = document.getElementById("food-sources-modal-done");
  var foodSourcesModalBackBtn = document.getElementById("food-sources-modal-back");
  var foodSourcesModalFooterEl = document.getElementById("food-sources-modal-footer");
  var foodSourcesFullscreenToggleBtn = document.getElementById(
    "food-sources-fullscreen-toggle"
  );
  var foodSourcesFullscreen = false;
  var activeFoodSourcesSort = { key: "nutrient", dir: "asc" };
  var activeFoodSourcesFilter = "";
  var foodSourcesRowsCache = null;
  var foodSourcesPrecomputedRows = null;
  var foodSourcesSampleCatalog = null;
  var foodSourcesSampleCatalogPromise = null;
  var microSourcesFullscreen = false;
  var longevitySourcesFullscreen = false;
  var microDailyIntakePopoverEl = document.getElementById("micro-daily-intake-popover");
  var microDailyIntakePopoverAnchor = null;
  var microAcuteToxicityPopoverEl = document.getElementById(
    "micro-acute-toxicity-popover"
  );
  var microAcuteToxicityPopoverTextEl = document.getElementById(
    "micro-acute-toxicity-popover-text"
  );
  var microAcuteToxicityPopoverAnchor = null;
  var targetRefPopoverEl = document.getElementById("target-ref-popover");
  var targetRefPopoverTextEl = document.getElementById("target-ref-popover-text");
  var targetRefPopoverAnchor = null;
  var macroNeedPopoverEl = document.getElementById("macro-need-popover");
  var macroNeedPopoverAnchor = null;
  var macroNeedPopoverPinned = false;
  var macroNeedPopoverHideTimer = null;

  /**
   * Nutrients that can cause harm from a single-day excess (often supplements).
   * sideEffects = uncomfortable GI / sensory reactions; adverseEffects = serious
   * medical outcomes (confusion, organ failure, cardiac events, death).
   */
  var ACUTE_TOXICITY_BY_MICRO = {
    iron: {
      sideEffects: ["Nausea", "Vomiting", "Abdominal pain", "Diarrhea"],
      adverseEffects: ["Metabolic acidosis", "Shock", "Coma", "Death"],
    },
    vitaminA: {
      sideEffects: [
        "Nausea",
        "Vomiting",
        "Headache",
        "Dizziness",
        "Blurred vision",
      ],
      adverseEffects: [
        "Increased intracranial pressure",
        "Liver damage",
        "Confusion",
        "Death",
      ],
    },
    vitaminARetinol: {
      sideEffects: [
        "Nausea",
        "Vomiting",
        "Headache",
        "Dizziness",
        "Blurred vision",
      ],
      adverseEffects: [
        "Increased intracranial pressure",
        "Liver damage",
        "Confusion",
        "Death",
      ],
    },
    vitaminD: {
      sideEffects: ["Nausea", "Vomiting", "Thirst", "Frequent urination"],
      adverseEffects: [
        "Hypercalcemia",
        "Confusion",
        "Heart rhythm problems",
        "Kidney damage",
      ],
    },
    selenium: {
      sideEffects: ["Nausea", "Vomiting", "Diarrhea", "Garlic-like breath"],
      adverseEffects: ["Respiratory distress", "Heart failure", "Death"],
    },
    copper: {
      sideEffects: ["Nausea", "Vomiting", "Abdominal pain"],
      adverseEffects: ["Hemolysis", "Liver failure", "Death"],
    },
    zinc: {
      sideEffects: ["Nausea", "Vomiting", "Stomach cramps", "Metallic taste"],
    },
    potassium: {
      sideEffects: ["Nausea", "Muscle weakness"],
      adverseEffects: ["Heart arrhythmia", "Heart attack", "Death"],
    },
    magnesium: {
      sideEffects: ["Diarrhea", "Nausea", "Abdominal cramping"],
      adverseEffects: ["Low blood pressure", "Confusion", "Cardiac arrest"],
    },
    niacin: {
      sideEffects: ["Flushing", "Itching", "Nausea", "Heartburn"],
    },
    vitaminC: {
      sideEffects: ["Diarrhea", "Nausea", "Stomach cramps"],
    },
    sodium: {
      sideEffects: ["Thirst", "Bloating", "Swelling"],
      adverseEffects: ["Confusion", "Seizures", "Coma"],
    },
    iodine: {
      sideEffects: ["Nausea", "Stomach pain", "Metallic taste", "Diarrhea"],
    },
    choline: {
      sideEffects: [
        "Fishy body odor",
        "Sweating",
        "Salivation",
        "Low blood pressure",
      ],
    },
    calcium: {
      sideEffects: ["Constipation", "Nausea", "Stomach upset"],
    },
  };

  var TARGET_REF_POPOVER_TEXT = {
    fda:
      "FDA Daily Value — the daily reference behind % DV on U.S. nutrition labels for vitamins and minerals. The FDA factors in absorbability: for example, plant vitamin A is expressed as retinol activity equivalents (RAE), which reflects lower absorption from vegetables than from preformed vitamin A in animal foods. This app uses sex-specific targets from Settings where needs differ from a single label number.",
    who:
      "WHO — World Health Organization sodium reduction guidance for adults: less than 2,000 mg sodium per day (about 5 g salt). This is a population ceiling for cardiovascular risk reduction, not an FDA Daily Value.",
    aha:
      "AHA — American Heart Association ideal sodium target of about 1,500 mg/day for optimal cardiovascular health, and the usual clinical goal discussed for people with high blood pressure. Any reduction toward this level helps; your clinician may set a different target.",
    iom_bw:
      "IOM bw min — estimated average requirement from the Institute of Medicine (2005) protein and amino acid report: mg/kg body weight × your weight in Settings. It is a minimum target, not a maximum. This nutrient does not have a FDA % DV. The IOM was reorganized as the Health and Medicine Division (HMD) of the National Academies in 2015.",
    iom_bw_set:
      "Set body weight in Settings to calculate IOM bw min (IOM 2005 EAR × your weight)—a minimum, not a maximum. The Institute of Medicine is now the Health and Medicine Division (HMD) of the National Academies (2015).",
    study_max:
      "Study max — a published human safety review or risk assessment gives an observed safe level, NOAEL, or OSL for supplemental intake. This is not an FDA or IOM/HMD daily value, and it is a ceiling-style reference: lower % is safer as you approach the study level.",
    study_min:
      "Study min — a published human study or review gives a minimum-style intake target. This is not an FDA or IOM/HMD daily value.",
    no_ref:
      "No ref — no standalone FDA Daily Value, IOM/HMD body-weight requirement, or solid human study minimum/maximum was found for this nutrient. Some amino acids are conditionally essential or part of combined pathways, but this app leaves them unscored rather than inventing a target.",
  };

  var TARGET_REF_POPOVER_DETAILS = {
    arginine: {
      text: "Arginine: Shao & Hathcock, Regulatory Toxicology and Pharmacology (2008), “Risk assessment for the amino acids taurine, L-glutamine and L-arginine.” The study used an Observed Safe Level / Highest Observed Intake approach and selected 20 g/day as the OSL for normal healthy adults.",
      url: "https://pubmed.ncbi.nlm.nih.gov/18325648/",
    },
    glutamine: {
      text: "Glutamine: Shao & Hathcock, Regulatory Toxicology and Pharmacology (2008), “Risk assessment for the amino acids taurine, L-glutamine and L-arginine.” The study used an Observed Safe Level / Highest Observed Intake approach and selected 14 g/day as the OSL for normal healthy adults.",
      url: "https://pubmed.ncbi.nlm.nih.gov/18325648/",
    },
    taurine: {
      text: "Taurine: Shao & Hathcock, Regulatory Toxicology and Pharmacology (2008), “Risk assessment for the amino acids taurine, L-glutamine and L-arginine.” The study used an Observed Safe Level / Highest Observed Intake approach and selected 3 g/day as the OSL for normal healthy adults.",
      url: "https://pubmed.ncbi.nlm.nih.gov/18325648/",
    },
    glycine: {
      text: "Glycine: Mel\u00e9ndez-Hevia et al., Journal of Biosciences (2009), showed that endogenous glycine synthesis (~3 g/day) plus typical dietary intake (~2 g/day) falls ~10 g/day short of the amount needed for collagen synthesis and other metabolic uses in a 70 kg human. de Paz-Lugo et al., Amino Acids (2018), confirmed that higher glycine concentrations increase collagen synthesis by articular chondrocytes in vitro, supporting the 10 g/day target for joint and connective tissue health.",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6153947/",
    },
    proline: {
      text: "Proline: Barbul, The Journal of Nutrition (2008), and Albaugh et al., The Journal of Nutrition (2017), reviewed proline as a conditionally essential amino acid for collagen synthesis, noting that typical mixed-diet intake of 2\u20135 g/day supports baseline collagen turnover, while demand rises during wound healing, exercise, and aging. A 5 g/day study-min target reflects adequate intake for sustained collagen and cartilage support in healthy adults.",
      url: "https://pubmed.ncbi.nlm.nih.gov/28978679/",
    },
    vitaminARetinol: {
      text: "Preform vitamin A (retinol): Institute of Medicine (2001) Dietary Reference Intakes set the Tolerable Upper Intake Level (UL) for adults at 3,000 mcg/day of preformed vitamin A (retinol and retinyl esters) from food plus supplements. The UL does not apply to provitamin A carotenoids such as beta-carotene. NIH ODS Vitamin A fact sheet summarizes the same adult UL.",
      url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
    },
  };

  var LONGEVITY_DERIVED_DEFS = {
    omega6To3: { label: "Omega-6 : Omega-3 ratio", limiting: true },
    satToUnsat: { label: "Saturated : unsaturated fat ratio", limiting: true },
    epaPlusDha: { label: "EPA + DHA", limiting: false },
    glycemicLoad: { label: "Glycemic load (daily avg)", limiting: true },
    pufaVitaminEProtection: {
      label: "Vitamin E : PUFA protection",
      limiting: false,
    },
    potassiumToSodium: {
      label: "Potassium : sodium ratio",
      limiting: false,
    },
  };

  var LONGEVITY_SECTION_DEFS = {
    nad: { label: "NAD" },
    urolithinA: { label: "Urolithin A" },
    sectionFats: { label: "Fats & cholesterol" },
    sectionOmega: { label: "Omega fatty acids" },
    sectionGlutathione: { label: "Glutathione support" },
    sectionDnaRepair: { label: "DNA repair support" },
    sectionCompounds: { label: "Longevity & inflammation compounds" },
    sectionCarb: { label: "Carb quality" },
    sectionMicronutrients: { label: "Micronutrients from food" },
    sectionFiber: { label: "Fiber & colon health" },
    sectionUpperGiMotility: { label: "Upper GI Motility" },
    sectionThyroid: { label: "Thyroid health" },
    sectionLiver: { label: "Liver health" },
    sectionKidney: { label: "Kidney health" },
    sectionGrayHair: { label: "Gray hair" },
    sectionBoneDensity: { label: "Bone density" },
    sectionAches: { label: "Aches" },
    sectionStressResilience: { label: "Stress resilience" },
    sectionBrainLongevity: { label: "Staying sharp & lowering dementia risk" },
    sectionSleepHealth: { label: "Sleep health" },
    sectionCalcification: { label: "Calcification & vascular balance" },
    sectionHomocysteine: { label: "Methylation & homocysteine balance" },
    sectionVascularBloodPressure: { label: "Vascular - Blood Pressure" },
    sectionVascularBrain: { label: "Vascular - Cerebral Blood Pressure" },
    sectionDashDiet: { label: "DASH diet" },
    sectionDerived: { label: "Derived scores" },
    sectionTmao: { label: "TMAO balance" },
    sectionHistamine: { label: "Histamine tolerance & quality of life" },
    sectionPufaAntioxidant: { label: "Fat oxidation & antioxidant protection" },
    sectionGlycemic: { label: "Glycemic load & GI distribution" },
    sectionInsulinResistance: { label: "Insulin resistance / sensitivity" },
    sectionVisceralFat: { label: "Visceral fat" },
    sectionFatGain: { label: "Fat gain" },
    sectionMitochondrial: { label: "Mitochondrial health & cellular energy" },
    sectionCellularAging: { label: "Cellular aging & senomorphics" },
    sectionFemaleHormonesPms: { label: "Female Hormones - PMS & cycle balance" },
    sectionFemaleHormonesIron: { label: "Female Hormones - Iron & menstruation" },
    sectionFemaleHormonesEstrogen: { label: "Female Hormones - Estrogen metabolism" },
    sectionFemaleHormonesPostMenopause: { label: "Female Hormones - Post-menopause" },
    sectionMaleHormonesTestosterone: { label: "Male Hormones - Testosterone support" },
    sectionMaleHormonesProstate: { label: "Male Hormones - Prostate health" },
    sectionMaleHormonesEstrogenBalance: { label: "Male Hormones - Estrogen balance (Belly fat)" },
  };

  var MICRO_CONDITION_FOCUS = {
    adhd: {
      label: "ADHD",
      nutrients: [
        "folate",
        "iron",
        "magnesium",
        "zinc",
        "vitaminB6",
        "vitaminD",
        "vitaminC",
        "calcium",
        "vitaminB12",
        "taurine",
      ],
      longevityNutrients: ["epa", "dha"],
    },
    fatSolubleVitamins: {
      label: "Fat-soluble vitamins (A, D, E, K)",
      nutrients: [
        "vitaminA",
        "vitaminARetinol",
        "vitaminABetaCarotene",
        "vitaminD",
        "vitaminE",
        "vitaminK",
      ],
    },
    americanCommonDeficiencies: {
      label: "American Common Deficiencies",
      nutrients: [
        "vitaminA",
        "vitaminD",
        "calcium",
        "magnesium",
        "iodine",
      ],
    },
    anemia: {
      label: "Anemia",
      nutrients: [
        "iron",
        "vitaminB12",
        "folate",
        "vitaminB6",
        "riboflavin",
        "vitaminC",
      ],
    },
    antiAging: {
      label: "Anti-aging & longevity",
      nutrients: [
        "vitaminD",
        "vitaminC",
        "vitaminE",
        "vitaminK",
        "vitaminK1",
        "vitaminK2",
        "vitaminK2MK4",
        "vitaminK2MK7",
        "selenium",
        "copper",
        "magnesium",
        "niacin",
        "riboflavin",
        "pantothenicAcid",
        "thiamin",
        "iron",
        "folate",
        "vitaminB6",
        "vitaminB12",
        "taurine",
      ],
      longevityNutrients: [
        "coq10",
        "epa",
        "dha",
        "polyphenols",
        "flavonoids",
        "quercetin",
        "resveratrol",
        "curcumin",
      ],
    },
    bowelMovementsAltered: {
      label: "Bowel movements altered",
      nutrients: [
        "thiamin",
        "vitaminA",
        "fiber",
        "magnesium",
        "vitaminD",
        "zinc",
        "folate",
        "vitaminB12",
        "potassium",
      ],
    },
    cataractsPrevention: {
      label: "Cataracts prevention",
      nutrients: [
        "vitaminC",
        "vitaminA",
        "vitaminARetinol",
        "vitaminABetaCarotene",
        "zinc",
        "vitaminE",
        "selenium",
      ],
      longevityNutrients: [
        "lutein",
        "carotenoids",
        "epa",
        "dha",
      ],
    },
    coffeeTeaUser: {
      label: "Chronic coffee / tea / energy drink user",
      nutrients: ["iron", "zinc", "calcium", "magnesium", "vitaminC"],
    },
    hairLoss: {
      label: "Hair loss",
      nutrients: [
        "iron",
        "zinc",
        "biotin",
        "vitaminD",
        "vitaminE",
        "selenium",
        "folate",
        "vitaminB12",
        "vitaminC",
        "iodine",
      ],
      longevityNutrients: ["saturatedFat", "glycemicIndex", "creatine"],
    },
  };

  var MICRO_INTAKE_FILTER = {
    wellAbsorbed: {
      label: "Well absorbed / average the week",
    },
    poorlyAbsorbed: {
      label: "Poorly absorbed / take daily",
    },
  };

  var COMMON_DEFICIENCY_NUTRIENT_KEYS = [
    "vitaminA",
    "vitaminD",
    "calcium",
    "magnesium",
    "iodine",
  ];

  var FAT_SOLUBLE_NUTRIENT_KEYS = [
    "vitaminA",
    "vitaminD",
    "vitaminE",
    "vitaminK",
  ];

  var NUTRIENT_FILTER_PRESETS = {
    "common-deficiencies": COMMON_DEFICIENCY_NUTRIENT_KEYS,
    "fat-soluble": FAT_SOLUBLE_NUTRIENT_KEYS,
  };

  var MICRO_FIELDS = [
    { key: "fiber", label: "Fiber (total)", unit: "g", code: "f" },
    { key: "solubleFiber", label: "Soluble fiber", unit: "g", code: "sf" },
    { key: "insolubleFiber", label: "Insoluble fiber", unit: "g", code: "if" },
    { key: "sodium", label: "Sodium", unit: "mg", code: "na" },
    { key: "potassium", label: "Potassium", unit: "mg", code: "k" },
    { key: "calcium", label: "Calcium", unit: "mg", code: "ca" },
    { key: "iron", label: "Iron", unit: "mg", code: "fe" },
    { key: "copper", label: "Copper", unit: "mcg", code: "cu" },
    { key: "magnesium", label: "Magnesium", unit: "mg", code: "mg" },
    { key: "zinc", label: "Zinc", unit: "mg", code: "zn" },
    { key: "selenium", label: "Selenium", unit: "mcg", code: "se" },
    { key: "manganese", label: "Manganese", unit: "mg", code: "mn" },
    { key: "chromium", label: "Chromium", unit: "mcg", code: "cr" },
    { key: "iodine", label: "Iodine", unit: "mcg", code: "i" },
    { key: "vitaminA", label: "Vitamin A", unit: "mcg", code: "a" },
    {
      key: "vitaminARetinol",
      label: "Vitamin A (preform retinol)",
      unit: "mcg",
      code: "ret",
    },
    {
      key: "vitaminABetaCarotene",
      label: "Vitamin A (proform β-carotene)",
      unit: "mcg",
      code: "bc",
    },
    { key: "vitaminD", label: "Vitamin D", unit: "mcg", code: "d" },
    { key: "vitaminE", label: "Vitamin E", unit: "mg", code: "e" },
    { key: "vitaminK", label: "Vitamin K", unit: "mcg", code: "vk" },
    { key: "vitaminK1", label: "Vitamin K1", unit: "mcg", code: "k1" },
    { key: "vitaminK2", label: "Vitamin K2", unit: "mcg", code: "k2" },
    { key: "vitaminK2MK4", label: "MK-4 (Menaquinone-4)", unit: "mcg", code: "mk4" },
    { key: "vitaminK2MK7", label: "MK-7 (Menaquinone-7)", unit: "mcg", code: "mk7" },
    { key: "thiamin", label: "Thiamin (B1)", unit: "mg", code: "b1" },
    { key: "riboflavin", label: "Riboflavin (B2)", unit: "mg", code: "b2" },
    { key: "niacin", label: "Niacin (B3)", unit: "mg", code: "b3" },
    { key: "pantothenicAcid", label: "Pantothenic acid (B5)", unit: "mg", code: "b5" },
    { key: "vitaminB6", label: "Vitamin B6", unit: "mg", code: "b6" },
    { key: "biotin", label: "Biotin (B7)", unit: "mcg", code: "b7" },
    { key: "folate", label: "Folate (B9)", unit: "mcg", code: "fol" },
    { key: "vitaminB12", label: "Vitamin B12", unit: "mcg", code: "b12" },
    { key: "vitaminC", label: "Vitamin C", unit: "mg", code: "c" },
  ];

  var MICRO_EXTENDED_FIELDS = [
    { key: "phosphorus", label: "Phosphorus", unit: "mg", code: "p" },
    { key: "choline", label: "Choline", unit: "mg", code: "ch" },
    { key: "molybdenum", label: "Molybdenum", unit: "mcg", code: "mo" },
    { key: "chloride", label: "Chloride", unit: "mg", code: "cl" },
    { key: "histidine", label: "Histidine", unit: "mg", code: "his", group: "amino" },
    { key: "isoleucine", label: "Isoleucine", unit: "mg", code: "ile", group: "amino" },
    { key: "leucine", label: "Leucine", unit: "mg", code: "leu", group: "amino" },
    { key: "lysine", label: "Lysine", unit: "mg", code: "lys", group: "amino" },
    { key: "methionine", label: "Methionine", unit: "mg", code: "met", group: "amino" },
    { key: "phenylalanine", label: "Phenylalanine", unit: "mg", code: "phe", group: "amino" },
    { key: "threonine", label: "Threonine", unit: "mg", code: "thr", group: "amino" },
    { key: "tryptophan", label: "Tryptophan", unit: "mg", code: "trp", group: "amino" },
    { key: "valine", label: "Valine", unit: "mg", code: "val", group: "amino" },
    { key: "arginine", label: "Arginine", unit: "mg", code: "arg", group: "amino" },
    { key: "cysteine", label: "Cysteine", unit: "mg", code: "cys", group: "amino" },
    { key: "glutamine", label: "Glutamine", unit: "mg", code: "gln", group: "amino" },
    { key: "glycine", label: "Glycine", unit: "mg", code: "gly", group: "amino" },
    { key: "proline", label: "Proline", unit: "mg", code: "pro", group: "amino" },
    { key: "tyrosine", label: "Tyrosine", unit: "mg", code: "tyr", group: "amino" },
    { key: "taurine", label: "Taurine", unit: "mg", code: "tau", group: "amino" },
  ];

  var MICRO_ALL_FIELDS = MICRO_FIELDS.concat(MICRO_EXTENDED_FIELDS);

  var MICRO_DERIVED_DEFS = {
    insolubleToSolubleFiber2To1: {
      label: "Insoluble : soluble fiber (2:1)",
      idealRatio: 2,
      afterKey: "insolubleFiber",
    },
    insolubleToSolubleFiber: {
      label: "Insoluble : soluble fiber (3:1)",
      idealRatio: 3,
      afterKey: "insolubleFiber",
    },
  };

  function isInsolubleToSolubleFiberRatioKey(key) {
    return (
      key === "insolubleToSolubleFiber2To1" || key === "insolubleToSolubleFiber"
    );
  }

  function solubleFiberRatioForFoodName(name) {
    var n = String(name || "").toLowerCase();
    if (
      /oat|barley|hummus|bean|lentil|orgain|quinoa|apple|pear|orange|banana|kiwi|cherr|trail mix|peanut|avocado|guacamole|jamba|plant based|zongzi|sticky rice|leaf wrapped|burrito|turkey taco|pure protein|premier protein|quest protein/.test(
        n
      )
    ) {
      return 0.45;
    }
    if (
      /grape-nuts|raisin bran|shredded wheat|cheerios|bread|ramen|popcorn|rice|potato|celery|cucumber|carrot|beet|cauliflower|whole wheat|sourdough|fries|smashed potato|green beans|salmon rice/.test(
        n
      )
    ) {
      return 0.22;
    }
    return 0.3;
  }

  function splitTotalFiber(total, name) {
    var t = parseFloat(total);
    if (isNaN(t) || t <= 0) return { solubleFiber: 0, insolubleFiber: 0 };
    var ratio = solubleFiberRatioForFoodName(name);
    var soluble = Math.round(t * ratio * 10) / 10;
    var insoluble = Math.round((t - soluble) * 10) / 10;
    return { solubleFiber: soluble, insolubleFiber: insoluble };
  }

  function fiberTotalFromParts(micros) {
    if (!micros) return 0;
    var soluble = parseFloat(micros.solubleFiber);
    var insoluble = parseFloat(micros.insolubleFiber);
    soluble = isNaN(soluble) ? 0 : soluble;
    insoluble = isNaN(insoluble) ? 0 : insoluble;
    if (soluble > 0 || insoluble > 0) return soluble + insoluble;
    var legacy = parseFloat(micros.fiber);
    return isNaN(legacy) ? 0 : legacy;
  }

  function applyFiberTotalToMicroTotals(totals) {
    totals.fiber = fiberTotalFromParts(totals);
    return totals;
  }

  function microDerivedDefByKey(key) {
    return MICRO_DERIVED_DEFS[key] || null;
  }

  function microDisplayFieldByKey(key) {
    var field = microFieldByKey(key);
    if (field) return field;
    var derived = microDerivedDefByKey(key);
    if (!derived) return null;
    return { key: key, label: derived.label, unit: "" };
  }

  function insolubleToSolubleFiberRatio(microTotals, perDay) {
    var divisor = perDay ? 1 : weekAverageDayCount();
    var insoluble = (microTotals.insolubleFiber || 0) / divisor;
    var soluble = (microTotals.solubleFiber || 0) / divisor;
    if (soluble <= 0) return null;
    return insoluble / soluble;
  }

  function insolubleToSolubleFiberTargetPct(ratio, ideal, refKey) {
    if (ratio == null || isNaN(ratio) || ideal <= 0) {
      return {
        pct: null,
        text: "—",
        kindLabel: ideal + ":1 target",
        reqAmount: ideal + ":1",
        limiting: false,
        refKey: refKey,
      };
    }
    var pct = Math.min(100, (Math.min(ratio, ideal) / Math.max(ratio, ideal)) * 100);
    return {
      pct: pct,
      text: formatTargetPctNumber(pct),
      kindLabel: ideal + ":1 target",
      reqAmount: ideal + ":1",
      limiting: false,
      refKey: refKey,
    };
  }

  function microDerivedRowTargetDisplay(key, microTotals, perDay) {
    if (isInsolubleToSolubleFiberRatioKey(key)) {
      var derived = microDerivedDefByKey(key);
      return insolubleToSolubleFiberTargetPct(
        insolubleToSolubleFiberRatio(microTotals, perDay),
        derived ? derived.idealRatio : 3,
        key
      );
    }
    return {
      pct: null,
      text: "—",
      kindLabel: "",
      reqAmount: "",
      limiting: false,
      refKey: key,
    };
  }

  function microDerivedAmtText(key, microTotals, perDay) {
    if (isInsolubleToSolubleFiberRatioKey(key)) {
      var ratio = insolubleToSolubleFiberRatio(microTotals, perDay);
      return ratio == null || isNaN(ratio) ? "—" : fmtNum(ratio) + ":1";
    }
    return "—";
  }

  var LONGEVITY_GROUPS = [
    { id: "fats", label: "Fats & cholesterol", sectionDefKey: "sectionFats" },
    { id: "omega", label: "Omega fatty acids", sectionDefKey: "sectionOmega" },
    { id: "glutathione", label: "Glutathione support", sectionDefKey: "sectionGlutathione" },
    { id: "dnaRepair", label: "DNA repair support", sectionDefKey: "sectionDnaRepair" },
    {
      id: "compounds",
      label: "Longevity & inflammation compounds",
      sectionDefKey: "sectionCompounds",
    },
    { id: "carb", label: "Carb quality", sectionDefKey: "sectionCarb" },
  ];

  var FEMALE_HORMONE_NAV_SECTIONS = [
    {
      label: "Female Hormones - PMS & cycle balance",
      sectionDefKey: "sectionFemaleHormonesPms",
    },
    {
      label: "Female Hormones - Iron & menstruation",
      sectionDefKey: "sectionFemaleHormonesIron",
    },
    {
      label: "Female Hormones - Estrogen metabolism",
      sectionDefKey: "sectionFemaleHormonesEstrogen",
    },
    {
      label: "Female Hormones - Post-menopause",
      sectionDefKey: "sectionFemaleHormonesPostMenopause",
    },
  ];

  var MALE_HORMONE_NAV_SECTIONS = [
    {
      label: "Male Hormones - Testosterone support",
      sectionDefKey: "sectionMaleHormonesTestosterone",
    },
    {
      label: "Male Hormones - Prostate health",
      sectionDefKey: "sectionMaleHormonesProstate",
    },
    {
      label: "Male Hormones - Estrogen balance (Belly fat)",
      sectionDefKey: "sectionMaleHormonesEstrogenBalance",
    },
  ];

  function getLongevityHormoneNavSections() {
    return demographic === "female"
      ? FEMALE_HORMONE_NAV_SECTIONS
      : MALE_HORMONE_NAV_SECTIONS;
  }

  function getLongevityNavSections() {
    return LONGEVITY_NAV_SECTIONS_CORE.concat(getLongevityHormoneNavSections());
  }

  var LONGEVITY_NAV_SECTIONS_CORE = [
    { label: "Micronutrients from food", sectionDefKey: "sectionMicronutrients" },
    { label: "Derived scores", sectionDefKey: "sectionDerived" },
    { label: "Fiber & colon health", sectionDefKey: "sectionFiber" },
    { label: "Upper GI Motility", sectionDefKey: "sectionUpperGiMotility" },
    { label: "Thyroid health", sectionDefKey: "sectionThyroid" },
    { label: "Liver health", sectionDefKey: "sectionLiver" },
    { label: "Kidney health", sectionDefKey: "sectionKidney" },
    { label: "Gray hair", sectionDefKey: "sectionGrayHair" },
    { label: "Bone density", sectionDefKey: "sectionBoneDensity" },
    { label: "Aches", sectionDefKey: "sectionAches" },
    { label: "Stress resilience", sectionDefKey: "sectionStressResilience" },
    {
      label: "Staying sharp & lowering dementia risk",
      sectionDefKey: "sectionBrainLongevity",
    },
    { label: "Sleep health", sectionDefKey: "sectionSleepHealth" },
    {
      label: "Mitochondrial health & cellular energy",
      sectionDefKey: "sectionMitochondrial",
    },
    { label: "Cellular aging & senomorphics", sectionDefKey: "sectionCellularAging" },
    { label: "Carb quality", sectionDefKey: "sectionCarb" },
    { label: "Glycemic load & GI distribution", sectionDefKey: "sectionGlycemic" },
    {
      label: "Insulin resistance / sensitivity",
      sectionDefKey: "sectionInsulinResistance",
    },
    { label: "Visceral fat", sectionDefKey: "sectionVisceralFat" },
    { label: "Fat gain", sectionDefKey: "sectionFatGain" },
  ]
    .concat(
      LONGEVITY_GROUPS.reduce(function (sections, group) {
        if (group.id === "carb") return sections;
        sections.push({ label: group.label, sectionDefKey: group.sectionDefKey });
        if (group.id === "omega") {
          sections.push({
            label: "Fat oxidation & antioxidant protection",
            sectionDefKey: "sectionPufaAntioxidant",
          });
        }
        if (group.id === "compounds") {
          sections.push({
            label: "Histamine tolerance & quality of life",
            sectionDefKey: "sectionHistamine",
          });
        }
        return sections;
      }, [])
    )
    .concat([
      { label: "Calcification & vascular balance", sectionDefKey: "sectionCalcification" },
      { label: "TMAO balance", sectionDefKey: "sectionTmao" },
      {
        label: "Methylation & homocysteine balance",
        sectionDefKey: "sectionHomocysteine",
      },
      {
        label: "Vascular - Blood Pressure",
        sectionDefKey: "sectionVascularBloodPressure",
      },
      {
        label: "Vascular - Cerebral Blood Pressure",
        sectionDefKey: "sectionVascularBrain",
      },
    ]);

  var LONGEVITY_THYROID_FROM_MICRO = [
    { microKey: "iodine", label: "Iodine", limiting: false },
    { microKey: "selenium", label: "Selenium — T4→T3 conversion", limiting: false },
    { microKey: "iron", label: "Iron — thyroid peroxidase", limiting: false },
    { microKey: "zinc", label: "Zinc — T3 production", limiting: false },
    { microKey: "tyrosine", label: "Tyrosine — hormone precursor", limiting: false },
    { microKey: "vitaminA", label: "Vitamin A — T4→T3 & receptor activation", limiting: false },
  ];

  var LONGEVITY_THYROID_FROM_LONGEVITY = [
    { key: "omega3", label: "Omega-3 (total) — inflammation & thyroid protection", limiting: false },
  ];

  var LONGEVITY_THYROID_WATCH_FROM_LONGEVITY = [
    { key: "omega6", label: "Omega-6 (total)", limiting: true },
  ];

  var LONGEVITY_UPPER_GI_FROM_MICRO = [
    {
      microKey: "vitaminD",
      label: "Vitamin D — upper GI motility; deficiency may slow emptying",
      limiting: false,
    },
    {
      microKey: "vitaminB12",
      label: "Vitamin B12 — upper GI motility; deficiency may slow emptying",
      limiting: false,
    },
    {
      microKey: "iron",
      label: "Iron — upper GI motility; deficiency may slow emptying",
      limiting: false,
    },
  ];

  var LONGEVITY_UPPER_GI_BILE_PRODUCTION_FROM_MICRO = [
    {
      microKey: "choline",
      label: "Choline — phosphatidylcholine (main bile component)",
      limiting: false,
    },
    {
      microKey: "taurine",
      label: "Taurine — bile salt conjugation",
      limiting: false,
    },
    {
      microKey: "glycine",
      label: "Glycine — bile salt conjugation",
      limiting: false,
    },
    {
      microKey: "vitaminC",
      label: "Vitamin C — stimulates bile acid synthesis",
      limiting: false,
    },
    {
      microKey: "magnesium",
      label: "Magnesium — relaxes bile ducts to improve flow",
      limiting: false,
    },
  ];

  var LONGEVITY_UPPER_GI_LES_WATCH_FROM_LONGEVITY = [
    {
      key: "saturatedFat",
      label: "Saturated fat — high-fat meals may lower LES & delay emptying",
      limiting: true,
    },
  ];

  var LONGEVITY_LIVER_PROTECTIVE_FROM_LONGEVITY = [
    {
      key: "alphaLipoicAcid",
      label: "Alpha-lipoic acid (ALA) — antioxidant protection & detox support",
      limiting: false,
    },
    {
      key: "glutathione",
      label: "Glutathione — detoxification & antioxidant balance",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_PRECURSORS_FROM_MICRO = [
    {
      microKey: "cysteine",
      label: "Cysteine — glutathione precursor (rate-limiting)",
      limiting: false,
    },
    {
      microKey: "glycine",
      label: "Glycine — glutathione building block",
      limiting: false,
    },
    {
      microKey: "glutamine",
      label: "Glutamine — glutamate/glutathione precursor pool",
      limiting: false,
    },
    {
      microKey: "vitaminC",
      label: "Vitamin C — recycles glutathione & antioxidant defense",
      limiting: false,
    },
    {
      microKey: "riboflavin",
      label: "Riboflavin (B2) — glutathione reductase cofactor",
      limiting: false,
    },
    {
      microKey: "vitaminB6",
      label: "Vitamin B6 — transsulfuration & glutathione pathway",
      limiting: false,
    },
    {
      microKey: "selenium",
      label: "Selenium — glutathione peroxidase cofactor",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_CHOLINE_METHYL_FROM_MICRO = [
    {
      microKey: "choline",
      label: "Choline — VLDL fat export; deficiency drives fatty liver",
      limiting: false,
    },
    {
      microKey: "folate",
      label: "Folate (B9) — methylation & one-carbon metabolism",
      limiting: false,
    },
    {
      microKey: "vitaminB12",
      label: "Vitamin B12 — methylation & methionine cycle",
      limiting: false,
    },
    {
      microKey: "vitaminB6",
      label: "Vitamin B6 — homocysteine & sulfur amino-acid metabolism",
      limiting: false,
    },
    {
      microKey: "methionine",
      label: "Methionine — SAMe / methylation (adequate, not excess)",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_CHOLINE_METHYL_FROM_LONGEVITY = [
    {
      key: "betaine",
      label: "Betaine — methyl donor; studied in NAFLD support",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_ANTIOXIDANT_FROM_MICRO = [
    {
      microKey: "vitaminE",
      label: "Vitamin E — lipid antioxidant; studied in NASH",
      limiting: false,
    },
    {
      microKey: "vitaminC",
      label: "Vitamin C — regenerates vitamin E & glutathione",
      limiting: false,
    },
    {
      microKey: "selenium",
      label: "Selenium — antioxidant enzymes in hepatocytes",
      limiting: false,
    },
    {
      microKey: "zinc",
      label: "Zinc — alcohol dehydrogenase & repair enzymes",
      limiting: false,
    },
    {
      microKey: "magnesium",
      label: "Magnesium — enzyme cofactor & insulin sensitivity",
      limiting: false,
    },
    {
      microKey: "vitaminD",
      label: "Vitamin D — deficiency common with fatty liver",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_ANTIOXIDANT_FROM_LONGEVITY = [
    {
      key: "polyphenols",
      label: "Polyphenols — coffee, tea, plants; fatty-liver associations",
      limiting: false,
    },
    {
      key: "flavonoids",
      label: "Flavonoids — antioxidant & metabolic support",
      limiting: false,
    },
    {
      key: "carotenoids",
      label: "Carotenoids — antioxidant fat-soluble vitamins support",
      limiting: false,
    },
    {
      key: "curcumin",
      label: "Curcumin — anti-inflammatory & liver enzyme support",
      limiting: false,
    },
    {
      key: "sulforaphane",
      label: "Sulforaphane — Nrf2 / phase-II detox induction",
      limiting: false,
    },
    {
      key: "resveratrol",
      label: "Resveratrol — metabolic & antioxidant pathways",
      limiting: false,
    },
    {
      key: "coq10",
      label: "Coenzyme Q10 — mitochondrial antioxidant in hepatocytes",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_METABOLIC_FROM_MICRO = [
    {
      microKey: "fiber",
      label: "Fiber — weight, glucose, and bile-acid binding",
      limiting: false,
    },
    {
      microKey: "chromium",
      label: "Chromium — glucose metabolism support",
      limiting: false,
    },
    {
      microKey: "biotin",
      label: "Biotin (B7) — carboxylase / glucose metabolism",
      limiting: false,
    },
    {
      microKey: "thiamin",
      label: "Thiamin (B1) — carbohydrate → energy in liver",
      limiting: false,
    },
    {
      microKey: "niacin",
      label: "Niacin (B3) — NAD for fuel oxidation (food-level)",
      limiting: false,
    },
    {
      microKey: "taurine",
      label: "Taurine — bile acid conjugation & fat handling",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_METABOLIC_FROM_LONGEVITY = [
    {
      key: "omega3",
      label: "Omega-3 (total) — triglycerides & hepatic fat",
      limiting: false,
    },
    { key: "epa", label: "EPA — triglyceride lowering", limiting: false },
    { key: "dha", label: "DHA — membrane & triglyceride support", limiting: false },
    {
      key: "monounsaturatedFat",
      label: "Monounsaturated fat — Mediterranean / liver-friendly pattern",
      limiting: false,
    },
    {
      key: "carnitine",
      label: "L-Carnitine — fatty-acid shuttle into mitochondria",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_WATCH_FROM_MICRO = [
    {
      microKey: "vitaminA",
      label: "Vitamin A — essential, but excess is hepatotoxic",
      limiting: false,
    },
    {
      microKey: "iron",
      label: "Iron — needed, but overload stresses the liver",
      limiting: false,
    },
    {
      microKey: "copper",
      label: "Copper — essential; excess accumulates in liver disease",
      limiting: false,
    },
  ];

  var LONGEVITY_LIVER_WATCH_FROM_LONGEVITY = [
    { key: "saturatedFat", label: "Saturated fat — fatty-liver & lipid risk", limiting: true },
    { key: "addedSugar", label: "Added sugar — fructose drives hepatic fat", limiting: true },
    {
      key: "refinedCarbs",
      label: "Refined carbohydrates — glycemic & fat-storage load",
      limiting: true,
    },
    { key: "transFat", label: "Trans fat — metabolic & liver burden", limiting: true },
    { key: "cholesterol", label: "Cholesterol — lipid-related vessel & liver load", limiting: true },
  ];

  var LONGEVITY_KIDNEY_ELECTROLYTE_WATCH_FROM_MICRO = [
    {
      microKey: "sodium",
      label: "Sodium — lower is better for blood pressure & kidney load",
      limiting: true,
    },
  ];

  var LONGEVITY_KIDNEY_ELECTROLYTE_AIM_FROM_MICRO = [
    {
      microKey: "potassium",
      label: "Potassium — from food when kidney function is normal",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_BP_FROM_MICRO = [
    {
      microKey: "magnesium",
      label: "Magnesium — modest blood-pressure support",
      limiting: false,
    },
    {
      microKey: "fiber",
      label: "Fiber — DASH / plant pattern for blood pressure",
      limiting: false,
    },
    {
      microKey: "calcium",
      label: "Calcium — DASH diet blood-pressure pattern",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_BP_FROM_LONGEVITY = [
    {
      key: "nitrate",
      label: "Nitrate — nitric oxide widens vessels & lowers BP",
      limiting: false,
    },
    {
      key: "flavonoids",
      label: "Flavonoids — endothelial & blood-pressure support",
      limiting: false,
    },
    {
      key: "polyphenols",
      label: "Polyphenols — vascular support",
      limiting: false,
    },
    {
      key: "omega3",
      label: "Omega-3 (total) — vascular & blood-pressure support",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_GLUCOSE_FROM_MICRO = [
    {
      microKey: "magnesium",
      label: "Magnesium — blood sugar & insulin signaling",
      limiting: false,
    },
    {
      microKey: "fiber",
      label: "Fiber — blunts glucose spikes",
      limiting: false,
    },
    { microKey: "vitaminD", label: "Vitamin D — glucose metabolism when deficient", limiting: false },
    {
      microKey: "chromium",
      label: "Chromium — glucose metabolism support",
      limiting: false,
    },
    {
      microKey: "zinc",
      label: "Zinc — insulin signaling support",
      limiting: false,
    },
    {
      microKey: "biotin",
      label: "Biotin (B7) — glucose metabolism",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_GLUCOSE_FROM_LONGEVITY = [
    { key: "epa", label: "EPA — metabolic & inflammatory support", limiting: false },
    { key: "dha", label: "DHA — metabolic & inflammatory support", limiting: false },
    {
      key: "polyphenols",
      label: "Polyphenols — glucose & vascular support",
      limiting: false,
    },
    {
      key: "flavonoids",
      label: "Flavonoids — glucose & endothelial support",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_GLUCOSE_WATCH_FROM_LONGEVITY = [
    { key: "addedSugar", label: "Added sugar — glycemic load & kidney stress", limiting: true },
    {
      key: "refinedCarbs",
      label: "Refined carbohydrates — glucose spikes",
      limiting: true,
    },
  ];

  var LONGEVITY_KIDNEY_WEIGHT_CHOL_FROM_MICRO = [
    {
      microKey: "fiber",
      label: "Fiber — satiety, LDL, and weight support",
      limiting: false,
    },
    {
      microKey: "solubleFiber",
      label: "Soluble fiber — lowers LDL cholesterol",
      limiting: false,
    },
    {
      microKey: "niacin",
      label: "Niacin (B3) — cholesterol balance (food-level)",
      limiting: false,
    },
    {
      microKey: "vitaminC",
      label: "Vitamin C — LDL antioxidant support",
      limiting: false,
    },
    {
      microKey: "vitaminE",
      label: "Vitamin E — protects LDL from oxidation",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_WEIGHT_CHOL_FROM_LONGEVITY = [
    {
      key: "omega3",
      label: "Omega-3 (total) — triglyceride & lipid support",
      limiting: false,
    },
    { key: "epa", label: "EPA — triglyceride support", limiting: false },
    { key: "dha", label: "DHA — triglyceride support", limiting: false },
    {
      key: "monounsaturatedFat",
      label: "Monounsaturated fat — Mediterranean / lipid pattern",
      limiting: false,
    },
    {
      key: "plantSterols",
      label: "Plant sterols & stanols — LDL support",
      limiting: false,
    },
  ];

  var LONGEVITY_KIDNEY_WEIGHT_WATCH_FROM_LONGEVITY = [
    {
      key: "saturatedFat",
      label: "Saturated fat — lipid & cardiovascular kidney risk",
      limiting: true,
    },
    {
      key: "cholesterol",
      label: "Cholesterol — lipid-related vessel & kidney risk",
      limiting: true,
    },
    { key: "transFat", label: "Trans fat — metabolic & vessel burden", limiting: true },
    {
      key: "addedSugar",
      label: "Added sugar — weight gain & metabolic kidney stress",
      limiting: true,
    },
  ];

  var LONGEVITY_KIDNEY_MICRONUTRIENTS_FROM_MICRO = [
    {
      microKey: "magnesium",
      label: "Magnesium — overall health (do not megadose in CKD)",
      limiting: false,
    },
    {
      microKey: "vitaminD",
      label: "Vitamin D — bone & metabolic health (excess raises calcium risk)",
      limiting: false,
    },
    {
      microKey: "vitaminB12",
      label: "Vitamin B12 — methylation & anemia-related needs",
      limiting: false,
    },
    {
      microKey: "folate",
      label: "Folate (B9) — methylation & homocysteine",
      limiting: false,
    },
    {
      microKey: "zinc",
      label: "Zinc — immune & repair support",
      limiting: false,
    },
    {
      microKey: "vitaminC",
      label: "Vitamin C — antioxidant (food-level preferred)",
      limiting: false,
    },
    {
      microKey: "iron",
      label: "Iron — needed, but overload stresses organs",
      limiting: false,
    },
  ];

  var LONGEVITY_GRAY_HAIR_DEFICIENCY_FROM_MICRO = [
    {
      microKey: "vitaminB12",
      label:
        "Vitamin B12 — can reverse gray hair only if greying was caused by a clinically diagnosed B12 deficiency",
      limiting: false,
    },
    {
      microKey: "folate",
      label:
        "Folate — low serum folate is linked to premature graying; correcting deficiency may help only when folate was the cause",
      limiting: false,
    },
    {
      microKey: "iron",
      label:
        "Iron (ferritin) — low ferritin is tied to premature canities; pigment return reported after correcting iron-deficiency anemia",
      limiting: false,
    },
    {
      microKey: "copper",
      label:
        "Copper — cofactor for tyrosinase/melanin; reversible hypopigmentation is linked to copper deficiency, not typical aging gray",
      limiting: false,
    },
    {
      microKey: "zinc",
      label:
        "Zinc — lower serum zinc appears in some premature-graying studies; repletion helps only when zinc is actually low",
      limiting: false,
    },
    {
      microKey: "vitaminD",
      label:
        "Vitamin D — low 25-OH D is associated with premature graying; raise levels when deficient—not a dye-like fix for genetic gray",
      limiting: false,
    },
  ];

  var LONGEVITY_GRAY_HAIR_THYROID_FROM_MICRO = [
    {
      microKey: "iodine",
      label:
        "Iodine — thyroid disease is a comorbidity of premature graying; steady iodine supports hormone production when thyroid is involved",
      limiting: false,
    },
    {
      microKey: "selenium",
      label:
        "Selenium — helps T4→T3 conversion; useful for gray hair mainly when thyroid dysfunction is driving pigment loss",
      limiting: false,
    },
  ];

  var LONGEVITY_BONE_FROM_MICRO = [
    { microKey: "calcium", label: "Calcium", limiting: false },
    { microKey: "magnesium", label: "Magnesium", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
    { microKey: "vitaminK", label: "Vitamin K — bone matrix mineralization", limiting: false },
    { microKey: "vitaminK1", label: "Vitamin K1 — osteocalcin activation", limiting: false },
    { microKey: "vitaminK2", label: "Vitamin K2 — directs calcium to bone", limiting: false },
    { microKey: "vitaminK2MK4", label: "MK-4 — short-acting K2 from animal foods", limiting: false },
    { microKey: "vitaminK2MK7", label: "MK-7 — long-acting K2 from fermented foods", limiting: false },
  ];

  var LONGEVITY_ACHES_VITAMIN_D_FROM_MICRO = [
    { microKey: "vitaminD", label: "Vitamin D — muscle & joint support", limiting: false },
  ];

  var LONGEVITY_ACHES_ANTI_INFLAMMATORY_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — muscle relaxation & anti-inflammatory", limiting: false },
    { microKey: "vitaminC", label: "Vitamin C — collagen repair & antioxidant", limiting: false },
    { microKey: "vitaminE", label: "Vitamin E — tissue antioxidant protection", limiting: false },
    { microKey: "selenium", label: "Selenium — selenoprotein antioxidant defense", limiting: false },
    { microKey: "zinc", label: "Zinc — immune regulation & tissue repair", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — inflammatory cytokine modulation", limiting: false },
  ];

  var LONGEVITY_ACHES_ANTI_INFLAMMATORY_FROM_LONGEVITY = [
    { key: "epa", label: "EPA — resolvin & anti-inflammatory prostaglandins", limiting: false },
    { key: "dha", label: "DHA — specialized pro-resolving mediators", limiting: false },
    { key: "omega3", label: "Omega-3 (total) — inflammatory tone", limiting: false },
    { key: "curcumin", label: "Curcumin — NF-κB & COX-2 modulation", limiting: false },
    { key: "polyphenols", label: "Polyphenols — broad anti-inflammatory support", limiting: false },
    { key: "flavonoids", label: "Flavonoids — antioxidant & anti-inflammatory", limiting: false },
    { key: "quercetin", label: "Quercetin — COX/LOX & NF-κB anti-inflammatory flavonoid", limiting: false },
    { key: "resveratrol", label: "Resveratrol — SIRT1 activation & inflammatory tone", limiting: false },
    { key: "sulforaphane", label: "Sulforaphane — Nrf2 activation & joint protection", limiting: false },
  ];

  var LONGEVITY_ACHES_JOINT_LUBRICATION_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C — collagen & cartilage synthesis", limiting: false },
    { microKey: "manganese", label: "Manganese — cartilage proteoglycan synthesis", limiting: false },
    { microKey: "copper", label: "Copper — collagen cross-linking (lysyl oxidase)", limiting: false },
    { microKey: "glycine", label: "Glycine — collagen backbone amino acid", limiting: false },
    { microKey: "proline", label: "Proline — collagen structure & cartilage", limiting: false },
    { microKey: "cysteine", label: "Cysteine — connective tissue & glutathione", limiting: false },
  ];

  var LONGEVITY_ACHES_JOINT_LUBRICATION_FROM_LONGEVITY = [
    { key: "omega3", label: "Omega-3 — synovial fluid & joint lubrication", limiting: false },
    { key: "sulforaphane", label: "Sulforaphane — chondroprotective signaling", limiting: false },
  ];

  var LONGEVITY_ACHES_AGE_RELATED_FROM_MICRO = [
    { microKey: "vitaminD", label: "Vitamin D — sarcopenia & osteomalacia prevention", limiting: false },
    { microKey: "magnesium", label: "Magnesium — muscle cramp & spasm prevention", limiting: false },
    { microKey: "calcium", label: "Calcium — bone pain & osteoporotic aches", limiting: false },
    { microKey: "potassium", label: "Potassium — muscle cramping & electrolyte balance", limiting: false },
    { microKey: "vitaminB12", label: "Vitamin B12 — neuropathic pain & tingling", limiting: false },
    { microKey: "iron", label: "Iron — restless legs & muscle fatigue", limiting: false },
    { microKey: "folate", label: "Folate — homocysteine-driven inflammation", limiting: false },
  ];

  var LONGEVITY_ACHES_AGE_RELATED_FROM_LONGEVITY = [
    { key: "coq10", label: "CoQ10 — statin-related myalgia & cellular energy", limiting: false },
    { key: "taurine", label: "Taurine — age-related muscle & joint support", limiting: false },
  ];

  var LONGEVITY_CALCIFICATION_AIM_FROM_MICRO = [
    { microKey: "vitaminK", label: "Vitamin K — calcium routing", limiting: false },
    { microKey: "vitaminK1", label: "Vitamin K1 — clotting & bone proteins", limiting: false },
    { microKey: "vitaminK2", label: "Vitamin K2 (Menaquinone) — arterial calcification guard", limiting: false },
    { microKey: "vitaminK2MK4", label: "MK-4 — animal-source K2 (short half-life)", limiting: false },
    { microKey: "vitaminK2MK7", label: "MK-7 — fermented-food K2 (long half-life)", limiting: false },
  ];

  var LONGEVITY_STRESS_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — HPA-axis & nervous-system calm", limiting: false },
    { microKey: "vitaminC", label: "Vitamin C — adrenal antioxidant support", limiting: false },
    {
      microKey: "pantothenicAcid",
      label: "Pantothenic acid (B5) — coenzyme A & adrenal cofactors",
      limiting: false,
    },
    { microKey: "vitaminB6", label: "Vitamin B6 — neurotransmitter synthesis", limiting: false },
    { microKey: "folate", label: "Folate (B9) — methylation support", limiting: false },
    { microKey: "vitaminB12", label: "Vitamin B12 — methylation support", limiting: false },
    { microKey: "zinc", label: "Zinc — immunity under stress", limiting: false },
    { microKey: "tyrosine", label: "Tyrosine — catecholamine precursor", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
  ];

  var LONGEVITY_STRESS_FROM_LONGEVITY = [
    { key: "polyphenols", label: "Polyphenols — adaptogenic herb support", limiting: false },
    { key: "flavonoids", label: "Flavonoids — adaptogenic herb support", limiting: false },
    { key: "epa", label: "EPA", limiting: false },
    { key: "dha", label: "DHA", limiting: false },
    { key: "coq10", label: "Coenzyme Q10 — cellular energy under load", limiting: false },
  ];

  var LONGEVITY_BRAIN_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — NMDA receptor regulation & glutamate balance", limiting: false },
    { microKey: "potassium", label: "Potassium — ion gradients for astrocyte glutamate transporters", limiting: false },
    { microKey: "glutamine", label: "Glutamine — glutamate–glutamine cycle & astrocyte clearance", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — converts glutamate to GABA", limiting: false },
    { microKey: "folate", label: "Folate (B9) — methylation & homocysteine balance", limiting: false },
    { microKey: "vitaminB12", label: "Vitamin B12 — nerve health & myelin support", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — neuroinflammation & cognitive aging", limiting: false },
    { microKey: "vitaminC", label: "Vitamin C — antioxidant & glutathione recycling", limiting: false },
    { microKey: "zinc", label: "Zinc — synaptic signaling & antioxidant defense", limiting: false },
    { microKey: "fiber", label: "Fiber — gut-brain axis & blood sugar stability", limiting: false },
    { microKey: "glycine", label: "Glycine — calming neurotransmitter & glutathione building block", limiting: false },
    { microKey: "tyrosine", label: "Tyrosine — dopamine & catecholamine precursor", limiting: false },
    { microKey: "tryptophan", label: "Tryptophan — serotonin precursor", limiting: false },
    { microKey: "thiamin", label: "Thiamin (B1) — brain energy metabolism", limiting: false },
    { microKey: "niacin", label: "Niacin (B3) — NAD+ precursor for brain energy", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2) — MTHFR & methylation support", limiting: false },
    { microKey: "selenium", label: "Selenium — glutathione peroxidase in brain tissue", limiting: false },
  ];

  var LONGEVITY_BRAIN_FROM_LONGEVITY = [
    { key: "epa", label: "EPA — neuroinflammation control", limiting: false },
    { key: "dha", label: "DHA — brain structure & membrane fluidity", limiting: false },
    { key: "choline", label: "Choline — acetylcholine & cell membranes", limiting: false },
    { key: "polyphenols", label: "Polyphenols — MIND diet neuroprotection", limiting: false },
    { key: "flavonoids", label: "Flavonoids — neurovascular & endothelial support", limiting: false },
    { key: "quercetin", label: "Quercetin — neuroinflammation & blood-brain-barrier support", limiting: false },
    { key: "creatine", label: "Creatine — brain ATP for glutamate uptake & recycling", limiting: false },
    { key: "coq10", label: "Coenzyme Q10 — mitochondrial brain energy", limiting: false },
    { key: "taurine", label: "Taurine — calms glutamate excitability & astrocyte support", limiting: false },
    { key: "lutein", label: "Lutein — predominant brain carotenoid", limiting: false },
    { key: "curcumin", label: "Curcumin — neuroinflammation modulation", limiting: false },
    { key: "nitrate", label: "Nitrate — cerebral blood flow via nitric oxide", limiting: false },
    { key: "vitaminE", label: "Vitamin E — protects DHA-rich brain membranes", limiting: false },
    { key: "resveratrol", label: "Resveratrol — neuroprotective sirtuin activation", limiting: false },
    { key: "sulforaphane", label: "Sulforaphane — Nrf2 neuronal antioxidant defense", limiting: false },
  ];

  var LONGEVITY_BRAIN_ASTROCYTE_FROM_MICRO = [
    { microKey: "potassium", label: "Potassium — ion gradients for astrocyte glutamate transporters", limiting: false },
    { microKey: "glutamine", label: "Glutamine — glutamate–glutamine cycle & astrocyte clearance", limiting: false },
    { microKey: "magnesium", label: "Magnesium — NMDA receptor regulation & glutamate balance", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — converts glutamate to GABA", limiting: false },
    { microKey: "vitaminC", label: "Vitamin C — astrocyte antioxidant & glutathione recycling", limiting: false },
    { microKey: "zinc", label: "Zinc — synaptic signaling & astrocyte antioxidant defense", limiting: false },
    { microKey: "glycine", label: "Glycine — glutathione building block & calming neurotransmitter", limiting: false },
    { microKey: "thiamin", label: "Thiamin (B1) — brain ATP for glutamate uptake", limiting: false },
    { microKey: "niacin", label: "Niacin (B3) — NAD+ precursor for astrocyte energy", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2) — MTHFR & glutathione recycling support", limiting: false },
    { microKey: "selenium", label: "Selenium — glutathione peroxidase in brain tissue", limiting: false },
  ];

  var LONGEVITY_BRAIN_ASTROCYTE_FROM_LONGEVITY = [
    { key: "creatine", label: "Creatine — brain ATP for glutamate uptake & recycling", limiting: false },
    { key: "dha", label: "DHA — neuronal & astrocyte membrane fluidity", limiting: false },
    { key: "epa", label: "EPA — neuroinflammation control", limiting: false },
    { key: "coq10", label: "Coenzyme Q10 — mitochondrial brain energy", limiting: false },
    { key: "taurine", label: "Taurine — calms glutamate excitability & astrocyte support", limiting: false },
    { key: "vitaminE", label: "Vitamin E — protects DHA-rich brain membranes", limiting: false },
  ];

  var LONGEVITY_SLEEP_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium", limiting: false },
    { microKey: "tryptophan", label: "Tryptophan — serotonin & melatonin precursor", limiting: false },
    { microKey: "glycine", label: "Glycine", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — serotonin synthesis", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
  ];

  var LONGEVITY_INSULIN_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — blood sugar & insulin signaling", limiting: false },
    { microKey: "fiber", label: "Fiber — blunts glucose spikes", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
    { microKey: "chromium", label: "Chromium — glucose metabolism support", limiting: false },
    { microKey: "zinc", label: "Zinc — insulin signaling support", limiting: false },
    { microKey: "biotin", label: "Biotin (B7) — glucose metabolism", limiting: false },
  ];

  var LONGEVITY_INSULIN_AIM_FROM_LONGEVITY = [
    { key: "epa", label: "EPA", limiting: false },
    { key: "dha", label: "DHA", limiting: false },
    { key: "monounsaturatedFat", label: "Monounsaturated fat", limiting: false },
    { key: "polyphenols", label: "Polyphenols", limiting: false },
    { key: "flavonoids", label: "Flavonoids", limiting: false },
  ];

  var LONGEVITY_INSULIN_WATCH_FROM_LONGEVITY = [
    { key: "saturatedFat", label: "Saturated fat", limiting: true },
    { key: "cholesterol", label: "Cholesterol", limiting: true },
    { key: "refinedCarbs", label: "Refined carbohydrates", limiting: true },
    { key: "addedSugar", label: "Added sugar", limiting: true },
    { key: "transFat", label: "Trans fat", limiting: true },
    { key: "omega6", label: "Omega-6 (total)", limiting: true },
  ];

  var LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C — antioxidant defense", limiting: false },
    { microKey: "vitaminE", label: "Vitamin E — lipid antioxidant defense", limiting: false },
    { microKey: "selenium", label: "Selenium — antioxidant enzymes", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_LONGEVITY = [
    { key: "polyphenols", label: "Polyphenols", limiting: false },
    { key: "flavonoids", label: "Flavonoids", limiting: false },
    { key: "carotenoids", label: "Carotenoids", limiting: false },
    { key: "lutein", label: "Lutein", limiting: false },
    { key: "resveratrol", label: "Resveratrol", limiting: false },
    { key: "curcumin", label: "Curcumin", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_REDUCE_BUILDUP_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — glucose & insulin signaling", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — body composition support", limiting: false },
    { microKey: "chromium", label: "Chromium — glucose metabolism support", limiting: false },
    { microKey: "leucine", label: "Leucine — muscle retention", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_REDUCE_BUILDUP_FROM_LONGEVITY = [
    { key: "epa", label: "EPA", limiting: false },
    { key: "dha", label: "DHA", limiting: false },
    { key: "monounsaturatedFat", label: "Monounsaturated fat", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_MOBILIZE_FROM_MICRO = [
    { microKey: "thiamin", label: "Thiamin (B1) — glucose → ATP", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2) — FAD for oxidation", limiting: false },
    { microKey: "niacin", label: "Niacin (B3) — NAD+ for fuel oxidation", limiting: false },
    {
      microKey: "pantothenicAcid",
      label: "Pantothenic acid (B5) — coenzyme A",
      limiting: false,
    },
    { microKey: "biotin", label: "Biotin (B7) — carboxylase cofactor", limiting: false },
    { microKey: "magnesium", label: "Magnesium — ATP stability", limiting: false },
    { microKey: "iron", label: "Iron — cytochrome electron transport", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_MOBILIZE_FROM_LONGEVITY = [
    { key: "carnitine", label: "L-Carnitine — fatty-acid shuttle to mitochondria", limiting: false },
    { key: "coq10", label: "Coenzyme Q10 — mitochondrial electron transport", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_GLP_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber — prebiotic for gut GLP-1 support", limiting: false },
  ];

  var LONGEVITY_VISCERAL_FAT_GLP_FROM_LONGEVITY = [
    { key: "polyphenols", label: "Polyphenols — microbiome & incretin support", limiting: false },
    { key: "flavonoids", label: "Flavonoids — microbiome & incretin support", limiting: false },
    { key: "resveratrol", label: "Resveratrol — gut incretin signaling", limiting: false },
  ];

  var LONGEVITY_FAT_GAIN_AGING_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber — satiety & metabolic support", limiting: false },
    { microKey: "magnesium", label: "Magnesium — glucose & insulin signaling", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — body composition support", limiting: false },
    { microKey: "chromium", label: "Chromium — glucose metabolism support", limiting: false },
    { microKey: "leucine", label: "Leucine — muscle retention with age", limiting: false },
  ];

  var LONGEVITY_FAT_GAIN_AGING_FROM_LONGEVITY = [
    { key: "epa", label: "EPA", limiting: false },
    { key: "dha", label: "DHA", limiting: false },
    { key: "monounsaturatedFat", label: "Monounsaturated fat", limiting: false },
    { key: "polyphenols", label: "Polyphenols", limiting: false },
    { key: "flavonoids", label: "Flavonoids", limiting: false },
  ];

  var LONGEVITY_FAT_GAIN_ENERGY_FROM_MICRO = [
    { microKey: "thiamin", label: "Thiamin (B1) — glucose → ATP", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2) — FAD for oxidation", limiting: false },
    { microKey: "niacin", label: "Niacin (B3) — NAD+ for fuel oxidation", limiting: false },
    {
      microKey: "pantothenicAcid",
      label: "Pantothenic acid (B5) — coenzyme A",
      limiting: false,
    },
    { microKey: "biotin", label: "Biotin (B7) — carboxylase cofactor", limiting: false },
    { microKey: "magnesium", label: "Magnesium — ATP stability", limiting: false },
    { microKey: "iron", label: "Iron — cytochrome electron transport", limiting: false },
    { microKey: "manganese", label: "Manganese — mitochondrial MnSOD", limiting: false },
  ];

  var LONGEVITY_FAT_GAIN_ENERGY_FROM_LONGEVITY = [
    { key: "carnitine", label: "L-Carnitine — fatty-acid shuttle to mitochondria", limiting: false },
    { key: "coq10", label: "Coenzyme Q10 — mitochondrial electron transport", limiting: false },
  ];

  var LONGEVITY_FAT_GAIN_GLP_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber — prebiotic for gut GLP-1 support", limiting: false },
  ];

  var LONGEVITY_FAT_GAIN_GLP_FROM_LONGEVITY = [
    { key: "polyphenols", label: "Polyphenols — microbiome & incretin support", limiting: false },
    { key: "flavonoids", label: "Flavonoids — microbiome & incretin support", limiting: false },
    { key: "resveratrol", label: "Resveratrol — gut incretin signaling", limiting: false },
  ];

  var LONGEVITY_MITO_FROM_MICRO = [
    { microKey: "thiamin", label: "Thiamin (B1)", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2)", limiting: false },
    { microKey: "niacin", label: "Niacin (B3) — NAD precursor", limiting: false },
    {
      microKey: "tryptophan",
      label: "Tryptophan — NAD via de novo pathway",
      limiting: false,
    },
    { microKey: "pantothenicAcid", label: "Pantothenic acid (B5)", limiting: false },
    { microKey: "biotin", label: "Biotin (B7)", limiting: false },
    { microKey: "iron", label: "Iron", limiting: false },
    { microKey: "magnesium", label: "Magnesium", limiting: false },
    { microKey: "manganese", label: "Manganese", limiting: false },
    {
      microKey: "copper",
      label: "Copper — Complex IV (cytochrome c oxidase)",
      limiting: false,
    },
    {
      microKey: "taurine",
      label: "Taurine — mitochondrial antioxidant",
      limiting: false,
    },
    {
      microKey: "selenium",
      label: "Selenium — glutathione peroxidase & mtDNA antioxidant defense",
      limiting: false,
    },
    {
      microKey: "zinc",
      label: "Zinc — CuZn-SOD (SOD1) antioxidant defense",
      limiting: false,
    },
    {
      microKey: "choline",
      label:
        "Choline — phosphatidylcholine (mitochondrial membrane integrity)",
      limiting: false,
    },
  ];

  var LONGEVITY_MITO_FROM_LONGEVITY = [
    { key: "coq10", label: "Coenzyme Q10", limiting: false },
    {
      key: "pqq",
      label: "PQQ — mitochondrial biogenesis (PGC-1α) & antioxidant",
      limiting: false,
    },
    {
      key: "carnitine",
      label: "L-Carnitine — fatty-acid shuttle into mitochondria",
      limiting: false,
    },
    {
      key: "creatine",
      label: "Creatine — phosphocreatine ATP buffer",
      limiting: false,
    },
    {
      key: "nr",
      label: "Nicotinamide riboside (NR) — NAD precursor",
      limiting: false,
    },
    { key: "nmn", label: "NMN — immediate NAD precursor", limiting: false },
    {
      key: "resveratrol",
      label: "Resveratrol — sirtuin activation & NAD preservation",
      limiting: false,
    },
    {
      key: "polyphenols",
      label: "Polyphenols — help preserve NAD",
      limiting: false,
    },
    {
      key: "alphaLipoicAcid",
      label: "Alpha-lipoic acid — PDH/α-KGDH cofactor & antioxidant recycling",
      limiting: false,
    },
    {
      key: "glutathione",
      label: "Glutathione — mitochondrial antioxidant (glutathione peroxidase)",
      limiting: false,
    },
  ];

  /** Both EPA and DHA incorporate into mitochondrial membranes; no fixed EPA:DHA ratio. DHA is often the dominant structural PUFA there. */
  var LONGEVITY_MITO_OMEGA_FROM_LONGEVITY = [
    {
      key: "dha",
      label: "DHA — primary mitochondrial membrane PUFA (fluidity & cardiolipin)",
      limiting: false,
    },
    {
      key: "epa",
      label: "EPA — also incorporates into mitochondrial membranes",
      limiting: false,
    },
  ];

  var LONGEVITY_CELLULAR_AGING_FROM_MICRO = [
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
    { microKey: "vitaminC", label: "Vitamin C", limiting: false },
    {
      microKey: "taurine",
      label: "Taurine — declines with age",
      limiting: false,
    },
  ];

  var LONGEVITY_CELLULAR_AGING_FROM_LONGEVITY = [
    { key: "vitaminE", label: "Vitamin E", limiting: false },
    { key: "selenium", label: "Selenium", limiting: false },
    { key: "polyphenols", label: "Polyphenols", limiting: false },
    { key: "flavonoids", label: "Flavonoids", limiting: false },
    { key: "quercetin", label: "Quercetin — senolytic flavonoid (D+Q protocol)", limiting: false },
    { key: "resveratrol", label: "Resveratrol", limiting: false },
    { key: "curcumin", label: "Curcumin", limiting: false },
    { key: "epa", label: "EPA", limiting: false },
    { key: "dha", label: "DHA", limiting: false },
  ];

  var LONGEVITY_FEMALE_PMS_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — mood & cramping", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — neurotransmitters & PMS", limiting: false },
    { microKey: "calcium", label: "Calcium — luteal-phase mood support", limiting: false },
    { microKey: "vitaminE", label: "Vitamin E — breast tenderness support", limiting: false },
    { microKey: "zinc", label: "Zinc — hormone synthesis & mood", limiting: false },
    { microKey: "tryptophan", label: "Tryptophan — serotonin precursor", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — cycle regulation support", limiting: false },
  ];

  var LONGEVITY_FEMALE_PMS_FROM_LONGEVITY = [
    { key: "epa", label: "EPA — inflammation & mood", limiting: false },
    { key: "dha", label: "DHA — inflammation & mood", limiting: false },
  ];

  var LONGEVITY_FEMALE_IRON_FROM_MICRO = [
    {
      microKey: "iron",
      label: "Iron — menstrual blood loss (18 mg/day DV for women)",
      limiting: false,
    },
    { microKey: "vitaminC", label: "Vitamin C — non-heme iron absorption", limiting: false },
    { microKey: "folate", label: "Folate (B9) — red blood cell production", limiting: false },
    { microKey: "vitaminB12", label: "Vitamin B12 — red blood cell production", limiting: false },
    { microKey: "copper", label: "Copper — iron metabolism cofactor", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2) — iron utilization", limiting: false },
  ];

  var LONGEVITY_FEMALE_ESTROGEN_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber — binds excess estrogen in the gut", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — estrogen metabolism support", limiting: false },
    { microKey: "folate", label: "Folate (B9) — methylation & estrogen clearance", limiting: false },
  ];

  var LONGEVITY_FEMALE_ESTROGEN_FROM_LONGEVITY = [
    {
      key: "sulforaphane",
      label: "Sulforaphane — broccoli & crucifers (Nrf2, estrogen balance)",
      limiting: false,
    },
  ];

  var LONGEVITY_FEMALE_POST_MENO_FROM_MICRO = [
    { microKey: "calcium", label: "Calcium — bone loss after estrogen drop", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — bone & muscle support", limiting: false },
    { microKey: "magnesium", label: "Magnesium — bone & sleep support", limiting: false },
    { microKey: "vitaminK", label: "Vitamin K — bone matrix mineralization", limiting: false },
    { microKey: "vitaminK1", label: "Vitamin K1 — bone matrix support", limiting: false },
    { microKey: "vitaminK2", label: "Vitamin K2 — calcium routing after estrogen drop", limiting: false },
    { microKey: "vitaminK2MK4", label: "MK-4 — spread across meals for steady K2", limiting: false },
    { microKey: "vitaminK2MK7", label: "MK-7 — once-daily K2 from fermentation", limiting: false },
    { microKey: "fiber", label: "Fiber — cardiometabolic support", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — mood & homocysteine support", limiting: false },
    { microKey: "vitaminB12", label: "Vitamin B12 — nerve & blood support", limiting: false },
  ];

  var LONGEVITY_FEMALE_POST_MENO_FROM_LONGEVITY = [
    {
      key: "sulforaphane",
      label: "Sulforaphane — broccoli & crucifers (estrogen metabolism)",
      limiting: false,
    },
    { key: "epa", label: "EPA — heart & inflammation support", limiting: false },
    { key: "dha", label: "DHA — brain & heart support", limiting: false },
    { key: "polyphenols", label: "Polyphenols — vascular & cognitive support", limiting: false },
  ];

  var LONGEVITY_MALE_TESTOSTERONE_FROM_MICRO = [
    { microKey: "zinc", label: "Zinc — testosterone synthesis", limiting: false },
    { microKey: "magnesium", label: "Magnesium — free testosterone support", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — androgen receptor signaling", limiting: false },
    { microKey: "selenium", label: "Selenium — antioxidant support for gonads", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — steroid hormone metabolism", limiting: false },
    { microKey: "iron", label: "Iron — oxygen delivery & energy (avoid excess)", limiting: false },
  ];

  var LONGEVITY_MALE_TESTOSTERONE_FROM_LONGEVITY = [
    { key: "monounsaturatedFat", label: "Monounsaturated fat — healthy androgen pattern", limiting: false },
    { key: "epa", label: "EPA — inflammation control", limiting: false },
    { key: "dha", label: "DHA — inflammation control", limiting: false },
  ];

  var LONGEVITY_MALE_PROSTATE_FROM_MICRO = [
    { microKey: "selenium", label: "Selenium — prostate antioxidant defense", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D — prostate cell regulation", limiting: false },
    { microKey: "zinc", label: "Zinc — prostate tissue concentration", limiting: false },
    { microKey: "vitaminE", label: "Vitamin E — oxidative stress in prostate tissue", limiting: false },
  ];

  var LONGEVITY_MALE_PROSTATE_FROM_LONGEVITY = [
    {
      key: "sulforaphane",
      label: "Sulforaphane — broccoli (prostate cell defense studies)",
      limiting: false,
    },
    { key: "epa", label: "EPA — inflammation modulation", limiting: false },
    { key: "dha", label: "DHA — inflammation modulation", limiting: false },
  ];

  var LONGEVITY_MALE_ESTROGEN_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber — clears estrogen metabolites", limiting: false },
    { microKey: "zinc", label: "Zinc — supports healthy aromatase balance", limiting: false },
  ];

  var LONGEVITY_MALE_ESTROGEN_FROM_LONGEVITY = [
    {
      key: "sulforaphane",
      label: "Sulforaphane — broccoli (blocks excess aromatization)",
      limiting: false,
    },
  ];

  var LONGEVITY_GLUTATHIONE_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2)", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6", limiting: false },
  ];

  var LONGEVITY_GLUTATHIONE_FROM_LONGEVITY = [
    { key: "selenium", label: "Selenium", limiting: false },
    { key: "vitaminE", label: "Vitamin E", limiting: false },
    { key: "sulforaphane", label: "Sulforaphane", limiting: false },
    { key: "polyphenols", label: "Polyphenols", limiting: false },
  ];

  var LONGEVITY_DNA_REPAIR_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C — antioxidant defense", limiting: false },
    { microKey: "riboflavin", label: "Riboflavin (B2) — redox support", limiting: false },
    { microKey: "niacin", label: "Niacin (B3) — NAD for repair enzymes", limiting: false },
    { microKey: "vitaminB6", label: "Vitamin B6 — methylation support", limiting: false },
    { microKey: "folate", label: "Folate (B9) — nucleotide synthesis", limiting: false },
    { microKey: "vitaminB12", label: "Vitamin B12 — methylation support", limiting: false },
    { microKey: "magnesium", label: "Magnesium — DNA polymerase cofactor", limiting: false },
    { microKey: "zinc", label: "Zinc — DNA repair protein cofactor", limiting: false },
  ];

  var LONGEVITY_DNA_REPAIR_FROM_LONGEVITY = [
    { key: "selenium", label: "Selenium — antioxidant enzymes", limiting: false },
    { key: "vitaminE", label: "Vitamin E — lipid antioxidant defense", limiting: false },
    { key: "polyphenols", label: "Polyphenols — oxidative stress support", limiting: false },
    { key: "flavonoids", label: "Flavonoids — antioxidant signaling", limiting: false },
    { key: "carotenoids", label: "Carotenoids — antioxidant support", limiting: false },
  ];

  var LONGEVITY_CALCIFICATION_FIELD_KEYS = ["phosphorus"];

  var LONGEVITY_HOMOCYSTEINE_FROM_MICRO = [
    { microKey: "riboflavin", label: "Riboflavin (B2) — MTHFR/FAD support" },
    { microKey: "vitaminB6", label: "Vitamin B6 — transsulfuration" },
    { microKey: "folate", label: "Folate (B9) — remethylation" },
    { microKey: "vitaminB12", label: "Vitamin B12 — remethylation" },
  ];

  var LONGEVITY_HOMOCYSTEINE_FROM_LONGEVITY = [
    { key: "choline", label: "Choline — alternate methyl donor" },
    { key: "betaine", label: "Betaine — alternate methyl donor" },
  ];

  var LONGEVITY_VASCULAR_WATCH_FROM_LONGEVITY = [
    { key: "cholesterol", label: "Cholesterol — lipid-related vessel risk" },
    { key: "saturatedFat", label: "Saturated fat — lipid-related vessel risk" },
    { key: "transFat", label: "Trans fat — vessel risk" },
  ];

  var LONGEVITY_VASCULAR_AIM_FROM_MICRO = [
    { microKey: "magnesium", label: "Magnesium — modest BP & vessel support" },
    { microKey: "fiber", label: "Fiber — DASH / plant pattern" },
  ];

  var LONGEVITY_VASCULAR_AIM_FROM_LONGEVITY = [
    { key: "nitrate", label: "Nitrate — systemic & brain BP" },
    { key: "flavonoids", label: "Flavonoids — endothelial support" },
    { key: "quercetin", label: "Quercetin — endothelial & blood-pressure support" },
    { key: "polyphenols", label: "Polyphenols — vascular support" },
    { key: "monounsaturatedFat", label: "Monounsaturated fat — olive-oil pattern" },
  ];

  var LONGEVITY_VASCULAR_LOWER_PRIORITY_FROM_MICRO = [
    { microKey: "vitaminD", label: "Vitamin D — observational BP links" },
  ];

  var LONGEVITY_VASCULAR_LOWER_PRIORITY_FROM_LONGEVITY = [
    { key: "vitaminK", label: "Vitamin K — calcium routing" },
    { key: "vitaminK1", label: "Vitamin K1 — clotting & bone proteins" },
    { key: "vitaminK2", label: "Vitamin K2 — arterial calcification" },
    { key: "vitaminK2MK4", label: "MK-4 — animal-source K2" },
    { key: "vitaminK2MK7", label: "MK-7 — fermented-food K2" },
    { key: "coq10", label: "CoQ10 — trial data mostly supplemental" },
  ];

  var LONGEVITY_VASCULAR_GLUTATHIONE_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C — glutathione recycling" },
    { microKey: "riboflavin", label: "Riboflavin (B2) — glutathione reductase cofactor" },
    { microKey: "vitaminB6", label: "Vitamin B6 — transsulfuration pathway" },
  ];

  var LONGEVITY_VASCULAR_GLUTATHIONE_FROM_LONGEVITY = [
    { key: "selenium", label: "Selenium — glutathione peroxidase cofactor" },
    { key: "sulforaphane", label: "Sulforaphane — Nrf2 / glutathione induction" },
  ];

  var LONGEVITY_DASH_AIM_FROM_MICRO = [
    {
      microKey: "calcium",
      label: "Calcium — ~1,250 mg/day DASH target",
      limiting: false,
    },
    {
      microKey: "potassium",
      label: "Potassium — ~4,700 mg/day DASH target",
      limiting: false,
    },
    {
      microKey: "magnesium",
      label: "Magnesium — ~500 mg/day DASH target",
      limiting: false,
    },
    { microKey: "fiber", label: "Fiber — DASH plant pattern", limiting: false },
  ];

  var LONGEVITY_DASH_WATCH_FROM_LONGEVITY = [
    { key: "saturatedFat", label: "Saturated fat — keep moderate on DASH" },
  ];

  var LONGEVITY_COMPOUNDS_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber (prebiotic)", limiting: false },
  ];

  var LONGEVITY_FATS_AIM_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber — LDL & total cholesterol support" },
    { microKey: "solubleFiber", label: "Soluble fiber — lowers LDL" },
    { microKey: "niacin", label: "Niacin (B3) — cholesterol balance" },
    { microKey: "vitaminC", label: "Vitamin C — LDL antioxidant support" },
    { microKey: "vitaminD", label: "Vitamin D — lipid balance when deficient" },
    { microKey: "vitaminE", label: "Vitamin E — protects LDL from oxidation" },
  ];

  var LONGEVITY_FATS_AIM_FROM_LONGEVITY = [
    { key: "omega3", label: "Omega-3 (total) — triglyceride support" },
    { key: "epa", label: "EPA — triglyceride support" },
    { key: "dha", label: "DHA — triglyceride support" },
  ];

  var LONGEVITY_TMAO_PRECURSOR_KEYS = ["choline", "carnitine", "betaine"];

  var LONGEVITY_TMAO_LOWERING_FROM_MICRO = [
    { microKey: "fiber", label: "Fiber (prebiotic)" },
    { microKey: "vitaminD", label: "Vitamin D" },
    { microKey: "vitaminB6", label: "Vitamin B6" },
    { microKey: "folate", label: "Folate (B9)" },
    { microKey: "vitaminB12", label: "Vitamin B12" },
  ];

  var LONGEVITY_TMAO_LOWERING_LONGEVITY = [
    { key: "monounsaturatedFat", label: "Monounsaturated fat (olive oil DMB)" },
    { key: "polyphenols", label: "Polyphenols (microbiome)" },
    { key: "flavonoids", label: "Flavonoids (berries, tea)" },
    { key: "resveratrol", label: "Resveratrol (grapes, berries)" },
  ];

  var LONGEVITY_HISTAMINE_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C — histamine breakdown support" },
    { microKey: "riboflavin", label: "Riboflavin (B2) — methylation cofactor" },
    { microKey: "vitaminB6", label: "Vitamin B6 — histamine enzyme support" },
    { microKey: "folate", label: "Folate (B9) — HNMT methylation support" },
    { microKey: "vitaminB12", label: "Vitamin B12 — SAMe/methylation support" },
    { microKey: "magnesium", label: "Magnesium — nervous-system tolerance" },
    { microKey: "zinc", label: "Zinc — immune and gut barrier support" },
  ];

  var LONGEVITY_HISTAMINE_FROM_LONGEVITY = [
    { key: "copper", label: "Copper — DAO cofactor" },
    { key: "methionine", label: "Methionine — SAMe building block" },
    { key: "polyphenols", label: "Polyphenols — mast-cell support" },
    { key: "flavonoids", label: "Flavonoids — mast-cell support" },
    { key: "quercetin", label: "Quercetin — mast-cell stabilizer & natural antihistamine" },
  ];

  var LONGEVITY_HISTAMINE_EPA_DHA_LABEL =
    "EPA + DHA — inflammatory tone support";

  var LONGEVITY_PUFA_ANTIOXIDANT_SUPPORT_FROM_MICRO = [
    { microKey: "vitaminC", label: "Vitamin C — regenerates vitamin E" },
  ];

  var LONGEVITY_PUFA_ANTIOXIDANT_SUPPORT_FROM_LONGEVITY = [
    { key: "selenium", label: "Selenium — supports glutathione enzymes" },
    {
      key: "polyphenols",
      label: "Polyphenols (berries, tea, cocoa) — reduce oxidation",
    },
    {
      key: "carotenoids",
      label: "Carotenoids (beta-carotene, lycopene) — antioxidant support",
    },
  ];

  function longevitySupportRowFromLongevityKey(key, label, weekLongevity) {
    var field = longevityFieldByKey(key);
    if (!field) return "";
    var value = weekLongevity[key] || 0;
    var daily = avgDailyLongevity(key, value);
    var target = microRowTargetDisplay(field, daily, "longevity", {});
    return longevityRowHtml(
      label,
      value > 0 ? fmtNum(daily) + " " + field.unit : "—",
      target.text,
      target.pct,
      "",
      false,
      key,
      false,
      null,
      key,
      "longevity",
      target.kindLabel,
      target.refKey,
      target.reqAmount
    );
  }

  function vascularRowsFromMicroItems(items, limiting, weekMicro) {
    return items
      .map(function (item) {
        return longevityRowFromMicroKey(
          item.microKey,
          item.label,
          !!limiting,
          weekMicro
        );
      })
      .join("");
  }

  function vascularRowsFromLongevityItems(items, weekLongevity, weekMicro) {
    return items
      .map(function (item) {
        return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
      })
      .join("");
  }

  function vascularEpaDhaRowHtml(derived, label) {
    return longevityRowHtml(
      label || "EPA + DHA — vascular & brain vessel support",
      derived.epaPlusDha > 0 ? fmtNum(derived.epaPlusDha) + " g" : "—",
      derived.epaPlusDha > 0 ? "combined" : "—",
      null,
      "dashboard__longevity-row--computed",
      false,
      "epaPlusDha",
      false
    );
  }

  function vascularPotassiumSodiumRatioRowHtml(derived) {
    var kNa = derived.potassiumToSodium;
    var kNaIdeal =
      longevityDvStatus.potassiumToSodiumIdealMin ||
      DEFAULT_LONGEVITY_STATUS.potassiumToSodiumIdealMin;
    var kNaAmt = kNa == null || isNaN(kNa) ? "—" : fmtNum(kNa) + ":1";
    var kNaStatus =
      kNa == null || isNaN(kNa)
        ? "—"
        : kNa >= kNaIdeal
          ? "At target"
          : "Below " + kNaIdeal + ":1 target";
    var kNaPct =
      kNa != null && !isNaN(kNa) && kNaIdeal > 0
        ? Math.min(100, (kNa / kNaIdeal) * 100)
        : null;
    return longevityRowHtml(
      "Potassium : sodium (sodium reduction matters more in practice)",
      kNaAmt,
      kNaStatus,
      kNaPct,
      "dashboard__longevity-row--computed",
      false,
      "potassiumToSodium",
      false
    );
  }

  function vascularPrimaryAimRowsHtml(weekLongevity, weekMicro, derived, opts) {
    opts = opts || {};
    var html =
      longevityRowFromMicroKey(
        "potassium",
        opts.potassiumLabel || "Potassium",
        false,
        weekMicro
      ) +
      (opts.includePotassiumRatio ? vascularPotassiumSodiumRatioRowHtml(derived) : "") +
      vascularRowsFromMicroItems(LONGEVITY_VASCULAR_AIM_FROM_MICRO, false, weekMicro) +
      vascularRowsFromLongevityItems(
        LONGEVITY_VASCULAR_AIM_FROM_LONGEVITY,
        weekLongevity,
        weekMicro
      ) +
      vascularEpaDhaRowHtml(derived, opts.epaDhaLabel);
    return html;
  }

  function vascularLowerPriorityRowsHtml(weekLongevity, weekMicro) {
    return (
      vascularRowsFromMicroItems(
        LONGEVITY_VASCULAR_LOWER_PRIORITY_FROM_MICRO,
        false,
        weekMicro
      ) +
      vascularRowsFromLongevityItems(
        LONGEVITY_VASCULAR_LOWER_PRIORITY_FROM_LONGEVITY,
        weekLongevity,
        weekMicro
      )
    );
  }

  function dashDietAimRowsHtml(weekMicro) {
    return vascularRowsFromMicroItems(LONGEVITY_DASH_AIM_FROM_MICRO, false, weekMicro);
  }

  function dashDietWatchRowsHtml(weekLongevity, weekMicro) {
    return vascularRowsFromLongevityItems(
      LONGEVITY_DASH_WATCH_FROM_LONGEVITY,
      weekLongevity,
      weekMicro
    );
  }

  function dashDietSubsectionHtml(weekMicro, weekLongevity) {
    return (
      dashDietTipHtml() +
      longevitySubgroupHtml("DASH diet — aim higher % DV is better", "aim") +
      dashDietAimRowsHtml(weekMicro) +
      longevitySubgroupHtml("DASH diet — watch lower % DV is better", "limit") +
      dashDietWatchRowsHtml(weekLongevity, weekMicro)
    );
  }

  /** Micro keys where high % DV is undesirable on the longevity panel */
  var LONGEVITY_MICRO_LIMITING_KEYS = {
    sodium: true,
  };

  /**
   * Alternate sodium upper limits for Vascular - Blood Pressure.
   * Same intake scored against each guideline (limiting: lower % is better).
   */
  var VASCULAR_SODIUM_LIMIT_REFS = [
    {
      amount: 2300,
      label: "Sodium — FDA / Dietary Guidelines (<2,300 mg)",
      kindLabel: "FDA DV",
    },
    {
      amount: 2000,
      label: "Sodium — WHO (<2,000 mg)",
      kindLabel: "WHO",
    },
    {
      amount: 1500,
      label: "Sodium — AHA ideal / high BP (<1,500 mg)",
      kindLabel: "AHA",
    },
  ];

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
    {
      key: "plantSterols",
      label: "Plant sterols & stanols",
      unit: "g",
      code: "ps",
      group: "fats",
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
    { key: "vitaminK2MK4", label: "MK-4 (Menaquinone-4)", unit: "mcg", code: "mk4", group: "compounds" },
    { key: "vitaminK2MK7", label: "MK-7 (Menaquinone-7)", unit: "mcg", code: "mk7", group: "compounds" },
    { key: "selenium", label: "Selenium", unit: "mcg", code: "se", group: "compounds" },
    { key: "copper", label: "Copper", unit: "mcg", code: "cu", group: "compounds" },
    {
      key: "methionine",
      label: "Methionine",
      unit: "g",
      code: "met",
      group: "compounds",
    },
    {
      key: "polyphenols",
      label: "Polyphenols",
      unit: "mg",
      code: "poly",
      group: "compounds",
    },
    {
      key: "nitrate",
      label: "Nitrate",
      unit: "mg",
      code: "no3",
      group: "compounds",
    },
    { key: "flavonoids", label: "Flavonoids", unit: "mg", code: "flav", group: "compounds" },
    { key: "quercetin", label: "Quercetin", unit: "mg", code: "quer", group: "compounds" },
    { key: "carotenoids", label: "Carotenoids", unit: "mg", code: "car", group: "compounds" },
    { key: "lutein", label: "Lutein", unit: "mg", code: "lut", group: "compounds" },
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
      key: "pqq",
      label: "PQQ (pyrroloquinoline quinone)",
      unit: "mcg",
      code: "pqq",
      group: "compounds",
    },
    {
      key: "nr",
      label: "Nicotinamide riboside (NR)",
      unit: "mg",
      code: "nr",
      group: "compounds",
    },
    {
      key: "nmn",
      label: "NMN (nicotinamide mononucleotide)",
      unit: "mg",
      code: "nmn",
      group: "compounds",
    },
    {
      key: "sulforaphane",
      label: "Sulforaphane",
      unit: "mg",
      code: "sul",
      group: "compounds",
    },
    {
      key: "alphaLipoicAcid",
      label: "Alpha-lipoic acid (ALA)",
      unit: "mg",
      code: "alaa",
      group: "compounds",
    },
    {
      key: "glutathione",
      label: "Glutathione",
      unit: "mg",
      code: "gsh",
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
    {
      key: "taurine",
      label: "Taurine",
      unit: "mg",
      code: "tau",
      group: "compounds",
    },
    {
      key: "creatine",
      label: "Creatine",
      unit: "g",
      code: "cre",
      group: "compounds",
      limiting: true,
    },
    { key: "glycemicIndex", label: "Glycemic index", unit: "GI", code: "gi", group: "glycemic" },
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
  ];

  var CARB_QUALITY_KEYS = ["glycemicIndex", "addedSugar", "refinedCarbs"];

  /** Micro-panel fields that also exist in LONGEVITY_FIELDS (micros holds value; longevity uses true). */
  function microPanelLongevityBridgeFields() {
    var longevityKeySet = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      longevityKeySet[field.key] = true;
    });
    return MICRO_ALL_FIELDS.filter(function (field) {
      return longevityKeySet[field.key];
    });
  }

  function longevityKeysAlsoInMicroMap() {
    var map = {};
    microPanelLongevityBridgeFields().forEach(function (field) {
      map[field.key] = true;
    });
    return map;
  }

  var LONGEVITY_KEYS_ALSO_IN_MICRO = longevityKeysAlsoInMicroMap();

  /** longevity field unit → micro field unit (e.g. methionine g → mg). */
  var LONGEVITY_TO_MICRO_SCALE = { methionine: 1000 };

  function syncSharedMicroLongevity(micros, longevity) {
    var changed = false;
    Object.keys(LONGEVITY_KEYS_ALSO_IN_MICRO).forEach(function (key) {
      var lv = longevity[key];
      if (lv === true) return;
      if (lv === "" || lv == null) return;
      var n = parseFloat(lv);
      if (isNaN(n)) {
        longevity[key] = "";
        changed = true;
        return;
      }
      var mv = micros[key];
      if (mv === "" || mv == null) {
        var scale = LONGEVITY_TO_MICRO_SCALE[key] || 1;
        micros[key] = n * scale;
        changed = true;
      }
      longevity[key] = true;
      changed = true;
    });
    return changed;
  }

  function resolveLongevityValue(kw, key) {
    var v = kw.longevity[key];
    if (v === true || (LONGEVITY_KEYS_ALSO_IN_MICRO[key] && (v === "" || v == null))) {
      var mv = kw.micros ? kw.micros[key] : undefined;
      if (mv === "" || mv == null) return "";
      var n = parseFloat(mv);
      return isNaN(n) ? "" : n;
    }
    if (key === "carotenoids") {
      if (v !== "" && v != null) {
        var stored = parseFloat(v);
        if (!isNaN(stored) && stored > 0) return stored;
      }
      var betaCarotene = kw.micros
        ? parseFloat(kw.micros.vitaminABetaCarotene)
        : NaN;
      if (!isNaN(betaCarotene) && betaCarotene > 0) {
        return Math.round((betaCarotene / 1000) * 10) / 10;
      }
      var vitA = kw.micros ? parseFloat(kw.micros.vitaminA) : NaN;
      if (!isNaN(vitA) && vitA > 50) {
        return Math.round(vitA * 0.01 * 10) / 10;
      }
      return v === "" || v == null ? "" : v;
    }
    return v;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, "&quot;");
  }

  /** Vitamin A / K breakdown forms — shown less dominant than parent totals. */
  var MICRO_FORM_SUBTYPE_KEYS = {
    vitaminARetinol: true,
    vitaminABetaCarotene: true,
    vitaminK1: true,
    vitaminK2: true,
    vitaminK2MK4: true,
    vitaminK2MK7: true,
  };

  function isMicroFormSubtypeKey(key) {
    return !!(key && MICRO_FORM_SUBTYPE_KEYS[key]);
  }

  /**
   * Nutrient name HTML: keep the primary name dominant; mute form/type
   * annotations in trailing parentheses and " — …" suffixes
   * (e.g. "Vitamin A (preform retinol)", "MK-4 (Menaquinone-4)").
   */
  function nutrientLabelHtml(label) {
    var s = String(label || "");
    var primary = s;
    var suffix = "";
    var dashIdx = s.indexOf(" — ");
    if (dashIdx > 0) {
      primary = s.slice(0, dashIdx);
      suffix = s.slice(dashIdx);
    }
    var html;
    var paren = primary.match(/^(.*?)(\s+\([^)]+\))$/);
    if (paren && paren[1]) {
      html =
        escapeHtml(paren[1]) +
        '<span class="dashboard__nutrient-form">' +
        escapeHtml(paren[2]) +
        "</span>";
    } else {
      html = escapeHtml(primary);
    }
    if (suffix) {
      html +=
        '<span class="dashboard__nutrient-form">' +
        escapeHtml(suffix) +
        "</span>";
    }
    return html;
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

  var KEYWORD_SERVING_MULTIPLIER_RE = /^\s*\*\s*((?:\d+(?:\.\d+)?)|(?:\.\d+))/;

  function keywordServingMultiplier(text, afterIndex) {
    var m = text.slice(afterIndex).match(KEYWORD_SERVING_MULTIPLIER_RE);
    if (!m) return 1;
    var n = parseFloat(m[1]);
    return n > 0 && isFinite(n) ? n : 1;
  }

  function stripKeywordServingMultiplier(text) {
    return String(text)
      .replace(/\s*\*\s*(?:\d+(?:\.\d+)?|\.\d+)\s*$/, "")
      .trim();
  }

  function makeId() {
    return "kw-" + nextId++ + "-" + Date.now();
  }

  function keywordIdCounter(id) {
    var match = String(id).match(/^kw-(\d+)-/);
    if (!match) return NaN;
    var n = parseInt(match[1], 10);
    return isNaN(n) ? NaN : n;
  }

  function isValidKeywordId(id) {
    return /^kw-\d+-/.test(String(id));
  }

  function syncNextIdFromKeywords() {
    var max = 0;
    keywords.forEach(function (kw) {
      var n = keywordIdCounter(kw.id);
      if (!isNaN(n) && n > max) max = n;
    });
    nextId = max + 1;
  }

  function blankMicros() {
    var micros = {};
    MICRO_ALL_FIELDS.forEach(function (field) {
      micros[field.key] = "";
    });
    return micros;
  }

  function normalizeMicros(raw) {
    var micros = blankMicros();
    if (!raw || typeof raw !== "object") return micros;
    MICRO_ALL_FIELDS.forEach(function (field) {
      var v = raw[field.key];
      if (v === "" || v == null) {
        micros[field.key] = "";
      } else {
        var n = parseFloat(v);
        micros[field.key] = isNaN(n) ? "" : n;
      }
    });
    var legacyFiber = raw.fiber;
    var partsTotal =
      (parseFloat(micros.solubleFiber) || 0) + (parseFloat(micros.insolubleFiber) || 0);
    if (legacyFiber !== "" && legacyFiber != null && partsTotal === 0) {
      var split = splitTotalFiber(legacyFiber, "");
      micros.solubleFiber = split.solubleFiber;
      micros.insolubleFiber = split.insolubleFiber;
    }
    micros.fiber = "";
    return micros;
  }

  function finalizeMicrosFromForm(micros, foodName) {
    if (!micros) return blankMicros();
    var fiberInput = micros.fiber;
    var partsTotal =
      (parseFloat(micros.solubleFiber) || 0) + (parseFloat(micros.insolubleFiber) || 0);
    if (
      fiberInput !== "" &&
      fiberInput != null &&
      !isNaN(parseFloat(fiberInput)) &&
      partsTotal === 0
    ) {
      var splitFromTotal = splitTotalFiber(fiberInput, foodName);
      micros.solubleFiber = splitFromTotal.solubleFiber;
      micros.insolubleFiber = splitFromTotal.insolubleFiber;
    }
    micros.fiber = "";
    return micros;
  }

  function hasMicrosFilled(micros) {
    if (!micros) return false;
    return MICRO_ALL_FIELDS.some(function (field) {
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

  function normalizeLongevity(raw, micros) {
    var longevity = blankLongevity();
    if (!raw || typeof raw !== "object") return longevity;
    LONGEVITY_FIELDS.forEach(function (field) {
      var v = raw[field.key];
      if (v === true && LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
        longevity[field.key] = true;
        return;
      }
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
      var merged = normalizeLongevity(kw.longevity, kw.micros);
      LONGEVITY_FIELDS.forEach(function (field) {
        if (!(field.key in data.longevity)) return;
        var raw = data.longevity[field.key];
        if (raw === true && LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
          merged[field.key] = true;
          return;
        }
        var n = parseFloat(raw);
        if (isNaN(n)) return;
        if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
          var mv = kw.micros[field.key];
          if (mv === "" || mv == null) {
            var scale = LONGEVITY_TO_MICRO_SCALE[field.key] || 1;
            kw.micros[field.key] = n * scale;
          }
          merged[field.key] = true;
        } else {
          merged[field.key] = n;
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
    if (fiberTotalFromParts(micros) > 0) {
      codes.push("f");
    }
    MICRO_ALL_FIELDS.forEach(function (field) {
      if (field.key === "fiber") return;
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

  function macroCalFromGrams(grams, calPerGram) {
    if (grams === "" || grams == null) return "";
    return fmtNum(parseMacro(grams) * calPerGram);
  }

  function keywordMacroCalories(kw) {
    var proteinCal = macroCalFromGrams(kw.protein, CAL_PROTEIN);
    var carbsCal = macroCalFromGrams(kw.carbs, CAL_CARBS);
    var fatsCal = macroCalFromGrams(kw.fats, CAL_FATS);
    var hasAny =
      kw.protein !== "" ||
      kw.carbs !== "" ||
      kw.fats !== "";
    var totalCal = hasAny
      ? fmtNum(
          parseMacro(kw.protein) * CAL_PROTEIN +
            parseMacro(kw.carbs) * CAL_CARBS +
            parseMacro(kw.fats) * CAL_FATS
        )
      : "";
    return {
      proteinCal: proteinCal,
      carbsCal: carbsCal,
      fatsCal: fatsCal,
      totalCal: totalCal,
    };
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
    MICRO_ALL_FIELDS.forEach(function (field) {
      if (field.key === "fiber") return;
      var v = kw.micros[field.key];
      if (v !== "" && v != null) {
        micros[field.key] = v;
      }
    });
    var totalFiber = fiberTotalFromParts(kw.micros);
    if (totalFiber > 0) {
      micros.fiber = Math.round(totalFiber * 10) / 10;
    }
    if (Object.keys(micros).length > 0) {
      obj.micros = micros;
    }

    var longevity = {};
    var carbQuality = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      var v = kw.longevity[field.key];
      if (v === true && LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
        longevity[field.key] = true;
        return;
      }
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
      kw.micros = normalizeMicros(data.micros);
    }

    applyLongevityImportToKeyword(kw, data);
    syncSharedMicroLongevity(kw.micros, kw.longevity);
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
    ensureUniqueKeywordIds();
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
    ensureUniqueKeywordIds();
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
    MICRO_ALL_FIELDS.forEach(function (field) {
      micros[field.key] = 0;
    });
    var longevity = {};
    var carbQuality = {};
    LONGEVITY_FIELDS.forEach(function (field) {
      if (CARB_QUALITY_KEYS.indexOf(field.key) >= 0) {
        carbQuality[field.key] = 0;
      } else if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
        longevity[field.key] = true;
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

  function sharedMicroLongevityKeyList() {
    return microPanelLongevityBridgeFields().map(function (field) {
      return field.key;
    });
  }

  function nutrientListForPrompt() {
    var bridgeFields = microPanelLongevityBridgeFields();
    var lines = [
      "Macronutrients (grams): protein, carbs, fats",
      "Micronutrients (micro requirements panel) — include only those you can estimate; omit unknown keys:",
    ];
    MICRO_ALL_FIELDS.forEach(function (field) {
      lines.push("  - micros." + field.key + ": " + field.label + " (" + field.unit + ")");
    });
    if (bridgeFields.length) {
      lines.push("");
      lines.push(
        "If a nutrient belongs to both .micros and .longevity: Always put the numeric amount in micros first; in longevity set the same key to true only (so we know to look up at micro):"
      );
      bridgeFields.forEach(function (field) {
        lines.push(
          "  - micros." +
            field.key +
            ": " +
            field.label +
            " (" +
            field.unit +
            ") → longevity." +
            field.key +
            ": true"
        );
      });
      lines.push(
        'Example: "micros": {"copper": 450, "choline": 105, "selenium": 40}, "longevity": {"copper": true, "choline": true, "selenium": true}'
      );
    }
    lines.push("");
    lines.push(
      "Longevity-only nutrients — numeric values go in longevity only (omit unknown keys):"
    );
    LONGEVITY_FIELDS.forEach(function (field) {
      if (CARB_QUALITY_KEYS.indexOf(field.key) >= 0) return;
      if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) return;
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
      "  - micros.zinc: oysters, beef, pumpkin seeds, chickpeas, chicken (mg)"
    );
    lines.push(
      "  - micros.selenium: Brazil nuts, tuna, sardines, chicken, eggs (mcg)"
    );
    lines.push(
      "  - micros.copper: shellfish, dark chocolate, cashews, lentils, mushrooms (mcg)"
    );
    lines.push(
      "  - micros.manganese: mussels, pecans, oats, pineapple, spinach (mg)"
    );
    lines.push(
      "  - micros.chromium: broccoli, grape juice, whole grains, brewer's yeast (mcg; often low in foods)"
    );
    lines.push(
      "  - micros.iodine: iodized table salt ~45 mcg/g salt; also fish, dairy, eggs"
    );
    lines.push(
      "  - micros.vitaminE: sunflower seeds, almonds, spinach, avocado, olive oil (mg)"
    );
    lines.push(
      "  - micros.vitaminA: total vitamin A as mcg RAE (retinol + carotenoid contribution — keep alongside retinol/β-carotene when breakdown is known)"
    );
    lines.push(
      "  - micros.vitaminARetinol: liver, eggs, dairy, fortified milk, fish (mcg retinol / retinyl esters — omit if unknown)"
    );
    lines.push(
      "  - micros.vitaminABetaCarotene: carrots, sweet potato, spinach, kale, mango, cantaloupe, red bell pepper (mcg β-carotene mass, not RAE — omit if unknown; 12 mcg dietary β-carotene ≈ 1 mcg RAE)"
    );
    lines.push(
      "  - micros.vitaminK: kale, spinach, broccoli, natto, egg yolks (mcg; total K — keep alongside K1/K2 when breakdown is known)"
    );
    lines.push(
      "  - micros.vitaminK1: leafy greens, broccoli, avocado, plant oils (mcg; phylloquinone — omit if unknown)"
    );
    lines.push(
      "  - micros.vitaminK2: natto, egg yolks, cheese, liver, fermented foods (mcg; menaquinone — omit if unknown)"
    );
    lines.push(
      "  - micros.vitaminK2MK4: egg yolks, meat, liver, butter, dairy (mcg; menaquinone-4 from animal foods — omit if unknown)"
    );
    lines.push(
      "  - micros.vitaminK2MK7: natto, aged cheese, sauerkraut (mcg; menaquinone-7 from fermentation — omit if unknown)"
    );
    lines.push(
      "  - micros.thiamin: pork, fortified grains, legumes, sunflower seeds (mg)"
    );
    lines.push(
      "  - micros.riboflavin: milk, eggs, lean beef, almonds, spinach (mg)"
    );
    lines.push(
      "  - micros.niacin: poultry, tuna, peanuts, mushrooms, fortified grains (mg NE)"
    );
    lines.push(
      "  - micros.pantothenicAcid: chicken, beef, mushrooms, avocado, broccoli (mg)"
    );
    lines.push(
      "  - micros.vitaminB6: poultry, fish, chickpeas, potatoes, bananas"
    );
    lines.push(
      "  - micros.folate: leafy greens, legumes, fortified grains, avocado, eggs"
    );
    lines.push(
      "  - micros.biotin: eggs, salmon, nuts, seeds, sweet potato, liver"
    );
    lines.push(
      "  - micros.methionine: poultry, fish, eggs, beef, pork, dairy, soy, sesame, Brazil nuts (mg; SAMe precursor)",
      "  - micros.taurine: shellfish, dark poultry meat, beef, fish, eggs, dairy (mg; declines with age)"
    );
    lines.push(
      "  - longevity.transFat: 0 for whole/natural foods; fried fast food, movie-theater buttery popcorn, and some pastries may have 0.1–4 g — use label data when available (g)"
    );
    lines.push(
      "  - longevity.carotenoids: carrots, sweet potato, spinach, kale, tomatoes, red bell pepper, mango (mg; fat-soluble—pair with oil for absorption)"
    );
    lines.push(
      "  - longevity.nitrate: spinach, arugula, beet, celery, lettuce, bok choy (~250 mg/100g spinach; ~110 mg/100g celery; mg NO₃)"
    );
    lines.push(
      "  - longevity.lutein: spinach, kale, corn, egg yolks (mg; fat-soluble—better absorbed with oil or egg fat)"
    );
    lines.push(
      "  - micros.phosphorus: dairy, meat, fish, legumes, seeds (mg)"
    );
    lines.push(
      "  - micros.choline: egg yolks, liver, meat, fish (mg; high in eggs)"
    );
    lines.push(
      "  - longevity.carnitine: highest in beef/lamb; moderate in pork/chicken; very low in plants (mg)"
    );
    lines.push(
      "  - longevity.betaine: wheat bran, beets, spinach; some supplements (mg)"
    );
    lines.push(
      "  - longevity.alphaLipoicAcid: organ meats, spinach, broccoli, tomatoes, Brussels sprouts; also supplements (mg; alpha-lipoic acid — not omega-3 ALA)"
    );
    lines.push(
      "  - longevity.glutathione: asparagus, avocado, spinach, okra, whey; food amounts are modest vs supplements (mg)"
    );
    lines.push(
      "  - longevity.nr: milk/dairy, nutritional yeast, sourdough/bread, broccoli, cucumbers, bananas, oranges, edamame; also supplements (mg; food amounts are tiny)"
    );
    lines.push(
      "  - longevity.nmn: cow’s milk, broccoli, cucumbers; also supplements (mg; food amounts are tiny)"
    );
    lines.push(
      "  - longevity EPA/DHA/ALA: fatty fish for EPA & DHA; flax/chia/walnuts for ALA (omega-3 alpha-linolenic acid — not alpha-lipoic acid)"
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
      'Rule: If the food is missing serving information, add one serving whatever units it\'s usually in. If it\'s usually eaten all in one sitting from a container or bag, then name it as container or bag followed by oz etc in parenthesis. Add it to the end of the food name.\n\n' +
      "Rule: Amounts for the micro requirements panel belong in micros. " +
      "When the same nutrient key also appears in longevity, store the number in micros only and set longevity[key] to true.\n\n" +
      "Rule: If the food is a multivitamin or vitamin entry: Don't just list the label DV. " +
      "Adjust both the DV and actual values for typical absorption, since we don't absorb 100% of a pill for every vitamin. " +
      "If there is fat soluble vitamins, assume enough fats were eaten to absorb the fat-soluble vitamins (A, D, E, K).\n\n" +
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

    MICRO_ALL_FIELDS.forEach(function (field) {
      var total = week[field.key];
      if (!total && field.group === "amino") return;
      var avgDaily = total / weekAverageDayCount();
      var target = microNutrientTargetPct(field.key, avgDaily);
      var pct = target.pct;
      var amtText =
        total > 0
          ? fmtNum(avgDaily) + " " + field.unit + "/day avg"
          : "0 " + field.unit + "/day avg";

      lines.push(field.label);
      lines.push(amtText);
      lines.push(
        target.kindLabel ? target.text + " · " + target.kindLabel : target.text
      );

      if (
        pct != null &&
        !isNaN(pct) &&
        ((target.limiting && pct > 100) || (!target.limiting && pct < 100))
      ) {
        var gapLabel = target.kindLabel
          ? fmtNum(pct) + "% " + target.kindLabel
          : fmtNum(pct) + "%";
        deficiencies.push(field.label + " (" + gapLabel + ")");
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

  function buildHealthTimelineLongevityLines() {
    var weekLongevity = weekLongevityTotals();
    var weekMicro = weekMicroTotals();
    var derived = computeLongevityDerived(weekLongevity, weekMicro);
    var lines = [];
    var concerns = [];

    LONGEVITY_FIELDS.forEach(function (field) {
      var total = weekLongevity[field.key];
      if (!total && LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
        total = weekMicro[field.key];
      }
      if (!total) return;
      var avgDaily = total / weekAverageDayCount();
      var pct = avgDailyLongevityPct(field.key, total);
      var pctText =
        pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "% DV";
      lines.push(field.label);
      lines.push(fmtNum(avgDaily) + " " + field.unit + "/day avg");
      lines.push(pctText);

      if (field.limiting && pct != null && !isNaN(pct) && pct >= 100) {
        concerns.push(field.label + " (" + fmtNum(pct) + "% of limit)");
      } else if (!field.limiting && pct != null && !isNaN(pct) && pct < 100) {
        concerns.push(field.label + " (" + fmtNum(pct) + "% DV)");
      }
    });

    if (derived.omega6To3 != null) {
      lines.push("Omega-6 : Omega-3 ratio");
      lines.push(fmtNum(derived.omega6To3) + " : 1");
      lines.push(
        derived.omega6To3 >
          (longevityDvStatus.omega6To3IdealMax || DEFAULT_LONGEVITY_STATUS.omega6To3IdealMax)
          ? "above ideal"
          : "within ideal range"
      );
    }
    if (derived.transFatG > 0) {
      lines.push("Trans fat");
      lines.push(fmtNum(derived.transFatG) + " g/day avg");
      var transMax =
        longevityDvStatus.transFatMaxGPerDay ||
        DEFAULT_LONGEVITY_STATUS.transFatMaxGPerDay;
      lines.push(
        derived.transFatG > transMax ? "above " + transMax + " g/day limit" : "within limit"
      );
    }
    if (derived.weekGl > 0) {
      lines.push("Glycemic load");
      lines.push(fmtNum(derived.weekGl) + "/day avg");
      var glMax =
        longevityDvStatus.glycemicLoadMaxPerDay ||
        DEFAULT_LONGEVITY_STATUS.glycemicLoadMaxPerDay;
      lines.push(
        derived.weekGl > glMax ? "above " + glMax + "/day reference" : "within reference"
      );
    }
    if (derived.epaPlusDha > 0) {
      lines.push("EPA + DHA");
      lines.push(fmtNum(derived.epaPlusDha) + " g/day avg");
    }

    return { lines: lines, concerns: concerns };
  }

  function buildHealthTimelineAiPrompt() {
    var microSnapshot = buildMicroGapsSnapshotLines();
    var longevitySnapshot = buildHealthTimelineLongevityLines();
    var demo = demographicLabelForPrompt();
    var parts = [
      "I track meals Mon–Sun in a weekly log. The numbers below are my average daily intake compared to daily values for a " +
        demo +
        " profile. Assume I keep eating roughly like this every week.",
      "",
    ];

    if (microConditionFocus && MICRO_CONDITION_FOCUS[microConditionFocus]) {
      parts.push(
        "Health focus I care about: " +
          MICRO_CONDITION_FOCUS[microConditionFocus].label +
          "."
      );
      parts.push("");
    }

    parts.push("Micronutrients (average daily vs demographic DV, Mon–Sun):");
    parts.push("");
    parts.push(microSnapshot.lines.join("\n"));
    parts.push("");

    if (longevitySnapshot.lines.length) {
      parts.push("Longevity & wellness nutrients (average daily):");
      parts.push("");
      parts.push(longevitySnapshot.lines.join("\n"));
      parts.push("");
    }

    var riskNotes = [];
    if (microSnapshot.deficiencies.length) {
      riskNotes.push(
        "Below 100% DV: " + microSnapshot.deficiencies.join(", ")
      );
    }
    if (longevitySnapshot.concerns.length) {
      riskNotes.push(
        "Longevity concerns: " + longevitySnapshot.concerns.join(", ")
      );
    }
    if (riskNotes.length) {
      parts.push(riskNotes.join(". ") + ".");
      parts.push("");
    }

    parts.push(
      "If I continue eating like this weekly, what would likely happen to my health over time?"
    );
    parts.push("");
    parts.push(
      "Give me a timeline of health effects from weeks → months → years → decades. Go through body systems one by one (cardiovascular, metabolic/diabetes, brain & cognition, bones & muscles, immune, gut & colon, kidneys, skin & hair, eyes, and any others relevant to my pattern). Focus on bad health outcomes and risks driven by my current nutrient pattern—especially deficiencies, excesses, and unfavorable ratios in the data above."
    );
    parts.push("");
    parts.push(
      "End with two final sections:",
      "1. Nutrients I would not panic about — nutrients that look low or imperfect in my data but are unlikely to cause meaningful harm at my current intake, or where the gap is minor enough not to worry about.",
      "2. Bottom line / Summary — a short plain-language takeaway: overall risk level if I keep this pattern, the 2–3 changes that would matter most, and what is going reasonably well."
    );
    parts.push("");
    parts.push(
      "This is educational—not a diagnosis. Reply in plain language (no JSON). Use clear sections and a simple timeline format."
    );

    return parts.join("\n");
  }

  function renderHealthTimelineAiPreview() {
    if (!healthTimelineAiPreviewEl) return;
    healthTimelineAiPreviewEl.textContent = buildHealthTimelineAiPrompt();
  }

  function copyHealthTimelinePromptToClipboard(done) {
    var text = buildHealthTimelineAiPrompt();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else if (done) {
      done();
    }
  }

  function openHealthTimelineAiService(url) {
    copyHealthTimelinePromptToClipboard(function () {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  function closeHealthTimelineModal() {
    if (!healthTimelineModalEl) return;
    healthTimelineModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openHealthTimelineModal() {
    if (!healthTimelineModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    renderHealthTimelineAiPreview();
    healthTimelineModalEl.hidden = false;
    updateBodyModalOpen();
    if (healthTimelineModalDoneBtn) {
      healthTimelineModalDoneBtn.focus();
    }
  }

  function stringArray(val) {
    if (!Array.isArray(val)) return [];
    return val.filter(function (s) {
      return typeof s === "string" && s.trim();
    });
  }

  function foodSourceGroupsArray(raw) {
    if (!Array.isArray(raw.foodSourceGroups)) return [];
    return raw.foodSourceGroups
      .map(function (group) {
        if (!group || typeof group !== "object") return null;
        var heading =
          typeof group.heading === "string" ? group.heading.trim() : "";
        var items = stringArray(group.items);
        if (!heading || !items.length) return null;
        return { heading: heading, items: items };
      })
      .filter(Boolean);
  }

  function microConditionDefFields(raw) {
    var fields = {};
    Object.keys(MICRO_CONDITION_FOCUS).forEach(function (id) {
      fields[id] = stringArray(raw[id]);
    });
    return fields;
  }

  function microDefEntryHasContent(entry) {
    if (
      entry.warning.length ||
      entry.tooLow.length ||
      entry.tooHigh.length ||
      entry.enough.length ||
      entry.dashboardTracking.length ||
      entry.foodSources.length ||
      entry.foodSourceGroups.length ||
      entry.male.length ||
      entry.female.length ||
      entry.brainLongevity.length
    ) {
      return true;
    }
    return Object.keys(MICRO_CONDITION_FOCUS).some(function (id) {
      return entry[id].length;
    });
  }

  function normalizeMicroDefinitions(data) {
    var out = {};
    if (!data || typeof data !== "object") return out;
    function loadDefEntry(key) {
      var raw = data[key];
      if (!raw || typeof raw !== "object") return;
      var entry = Object.assign(
        {
          warning: stringArray(raw.warning),
          tooLow: stringArray(raw.tooLow),
          tooHigh: stringArray(raw.tooHigh),
          enough: stringArray(raw.enough),
          dashboardTracking: stringArray(raw.dashboardTracking),
          foodSources: stringArray(raw.foodSources),
          foodSourceGroups: foodSourceGroupsArray(raw),
          male: stringArray(raw.male),
          female: stringArray(raw.female),
          brainLongevity: stringArray(raw.brainLongevity),
        },
        microConditionDefFields(raw)
      );
      if (microDefEntryHasContent(entry)) {
        out[key] = entry;
      }
    }
    MICRO_ALL_FIELDS.forEach(function (field) {
      loadDefEntry(field.key);
    });
    Object.keys(MICRO_DERIVED_DEFS).forEach(loadDefEntry);
    return out;
  }

  function loadMicroDefinitions(done) {
    fetch("definitions-micronutrients.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("definitions fetch failed");
        return res.json();
      })
      .then(function (data) {
        microDefinitions = normalizeMicroDefinitions(data);
        invalidateFoodSourcesRowsCache();
        if (done) done();
      })
      .catch(function () {
        microDefinitions = {};
        invalidateFoodSourcesRowsCache();
        if (done) done();
      });
  }

  function normalizeFoodNotesDefinitions(data) {
    var list = Array.isArray(data) ? data : data && data.notes ? data.notes : [];
    var out = [];
    list.forEach(function (item) {
      if (!item || typeof item !== "object") return;
      var label = typeof item.label === "string" ? item.label.trim() : "";
      var pattern = typeof item.pattern === "string" ? item.pattern.trim() : "";
      var note = typeof item.note === "string" ? item.note.trim() : "";
      if (!label || !pattern || !note) return;
      try {
        new RegExp(pattern, "i");
      } catch (e) {
        return;
      }
      out.push({ label: label, pattern: pattern, note: note });
    });
    return out;
  }

  function loadFoodNotesDefinitions(done) {
    fetch(FOOD_NOTES_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("food notes fetch failed");
        return res.json();
      })
      .then(function (data) {
        foodNotesDefinitions = normalizeFoodNotesDefinitions(data);
        if (done) done();
      })
      .catch(function () {
        foodNotesDefinitions = [];
        if (done) done();
      });
  }

  function normalizeFoodCategories(data) {
    var out = [];
    var list = data && Array.isArray(data.categories) ? data.categories : [];
    for (var i = 0; i < list.length; i++) {
      var raw = list[i];
      if (!raw || typeof raw !== "object") continue;
      var id = raw.id != null ? String(raw.id).trim() : "";
      var label = raw.label != null ? String(raw.label).trim() : "";
      if (!id || !label) continue;
      var patterns = [];
      var rawPatterns = Array.isArray(raw.patterns) ? raw.patterns : [];
      for (var pi = 0; pi < rawPatterns.length; pi++) {
        var patternText = rawPatterns[pi] != null ? String(rawPatterns[pi]) : "";
        if (!patternText) continue;
        try {
          patterns.push(new RegExp(patternText, "i"));
        } catch (e) {
          /* skip invalid pattern */
        }
      }
      if (!patterns.length) continue;
      out.push({ id: id, label: label, patterns: patterns });
    }
    return out;
  }

  function loadFoodCategoriesDefinitions(done) {
    fetch(FOOD_CATEGORIES_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("food categories fetch failed");
        return res.json();
      })
      .then(function (data) {
        foodCategories = normalizeFoodCategories(data);
        if (done) done();
      })
      .catch(function () {
        foodCategories = [];
        if (done) done();
      });
  }

  function foodCategoryIdForName(name) {
    var text = name != null ? String(name) : "";
    for (var i = 0; i < foodCategories.length; i++) {
      var cat = foodCategories[i];
      for (var pi = 0; pi < cat.patterns.length; pi++) {
        if (cat.patterns[pi].test(text)) return cat.id;
      }
    }
    return null;
  }

  function foodCategoryById(id) {
    for (var i = 0; i < foodCategories.length; i++) {
      if (foodCategories[i].id === id) return foodCategories[i];
    }
    return null;
  }

  function keywordsCategoryFilterLabel() {
    if (!keywordsCategoryFilter) return "";
    if (keywordsCategoryFilter === KEYWORDS_CATEGORY_UNCATEGORIZED) {
      return "Uncategorized";
    }
    var cat = foodCategoryById(keywordsCategoryFilter);
    return cat ? cat.label : keywordsCategoryFilter;
  }

  function keywordMatchesCategory(kw) {
    if (!keywordsCategoryFilter) return true;
    var name = kw && kw.name ? String(kw.name) : "";
    var categoryId = foodCategoryIdForName(name);
    if (keywordsCategoryFilter === KEYWORDS_CATEGORY_UNCATEGORIZED) {
      return !categoryId;
    }
    return categoryId === keywordsCategoryFilter;
  }

  function keywordsCategoryCounts() {
    var counts = {};
    var uncategorized = [];
    for (var i = 0; i < foodCategories.length; i++) {
      counts[foodCategories[i].id] = 0;
    }
    for (var ki = 0; ki < keywords.length; ki++) {
      var name = keywords[ki] && keywords[ki].name ? String(keywords[ki].name) : "";
      var categoryId = foodCategoryIdForName(name);
      if (!categoryId) {
        uncategorized.push(name.trim() || "(unnamed)");
      } else if (counts[categoryId] != null) {
        counts[categoryId] += 1;
      }
    }
    return { counts: counts, uncategorized: uncategorized };
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

  function longevityDefEntryHasContent(entry) {
    if (
      entry.tooLow.length ||
      entry.tooHigh.length ||
      entry.enough.length ||
      entry.dashboardTracking.length ||
      entry.foodSources.length ||
      entry.foodSourceGroups.length ||
      entry.targetReference.length
    ) {
      return true;
    }
    return Object.keys(MICRO_CONDITION_FOCUS).some(function (id) {
      return entry[id].length;
    }) || entry.brainLongevity.length;
  }

  function normalizeLongevityDefinitions(data) {
    var out = {};
    if (!data || typeof data !== "object") return out;
    longevityDefKeyList().forEach(function (key) {
      var raw = data[key];
      if (!raw || typeof raw !== "object") return;
      var entry = Object.assign(
        {
          tooLow: stringArray(raw.tooLow),
          tooHigh: stringArray(raw.tooHigh),
          enough: stringArray(raw.enough),
          dashboardTracking: stringArray(raw.dashboardTracking),
          foodSources: stringArray(raw.foodSources),
          foodSourceGroups: foodSourceGroupsArray(raw),
          targetReference: stringArray(raw.targetReference),
          brainLongevity: stringArray(raw.brainLongevity),
        },
        microConditionDefFields(raw)
      );
      if (longevityDefEntryHasContent(entry)) {
        out[key] = entry;
      }
    });
    return out;
  }

  function loadLongevityDefinitions(done) {
    fetch("definitions-longevity.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("longevity definitions fetch failed");
        return res.json();
      })
      .then(function (data) {
        longevityDefinitions = normalizeLongevityDefinitions(data);
        invalidateFoodSourcesRowsCache();
        if (done) done();
      })
      .catch(function () {
        longevityDefinitions = {};
        invalidateFoodSourcesRowsCache();
        if (done) done();
      });
  }

  function microFieldByKey(key) {
    for (var i = 0; i < MICRO_ALL_FIELDS.length; i++) {
      if (MICRO_ALL_FIELDS[i].key === key) return MICRO_ALL_FIELDS[i];
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

  function microDefFoodSourcesListHtml(items) {
    return (
      '<ul class="micro-def__sources-list">' +
      items
        .map(function (item) {
          return (
            '<li><button type="button" class="micro-def__source-btn" data-action="open-food-sources-filter" data-food-source-filter="' +
            escapeAttr(item) +
            '" title="Find in Food Sources">' +
            escapeHtml(item) +
            "</button></li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function microDefFoodSourcesHtml(sources, groups) {
    var body = "";
    if (groups && groups.length) {
      body = groups
        .map(function (group) {
          return (
            '<div class="micro-def__sources-group">' +
            '<h5 class="micro-def__sources-subheading">' +
            escapeHtml(group.heading) +
            "</h5>" +
            microDefFoodSourcesListHtml(group.items) +
            "</div>"
          );
        })
        .join("");
    } else if (sources.length) {
      body = microDefFoodSourcesListHtml(sources);
    } else {
      return "";
    }
    return (
      '<details class="micro-def__sources" open>' +
      '<summary class="micro-def__sources-summary">Food sources</summary>' +
      '<div class="micro-def__sources-body">' +
      body +
      "</div>" +
      "</details>"
    );
  }

  function setMicroDefFoodSources(html) {
    if (!microDefSourcesEl) return;
    if (html) {
      microDefSourcesEl.innerHTML = html;
      microDefSourcesEl.hidden = false;
    } else {
      microDefSourcesEl.innerHTML = "";
      microDefSourcesEl.hidden = true;
    }
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

  function microDefWarningSectionHtml(def) {
    if (!def.warning || !def.warning.length) return "";
    return (
      '<section class="micro-def__section micro-def__section--warning" role="note">' +
      '<h4 class="micro-def__heading micro-def__heading--warning">' +
      '<svg class="micro-def__heading--warning-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M8 1.5 1.25 14h13.5L8 1.5zm0 3.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.5A.75.75 0 0 1 8 4.75zM8 12a.875.875 0 1 0 0-1.75A.875.875 0 0 0 8 12z"></path>' +
      "</svg>" +
      "<span>Warning</span></h4>" +
      microDefParagraphsHtml(def.warning) +
      "</section>"
    );
  }

  function microDefBrainLongevitySectionHtml(def) {
    if (!def.brainLongevity || !def.brainLongevity.length) return "";
    return (
      '<section class="micro-def__section">' +
      '<h4 class="micro-def__heading">Brain longevity & astrocyte support</h4>' +
      microDefParagraphsHtml(def.brainLongevity) +
      "</section>"
    );
  }

  function microDefConditionSectionHtml(key, def) {
    if (!microConditionFocus || !key) return "";
    var condMeta = MICRO_CONDITION_FOCUS[microConditionFocus];
    var condNotes = def[microConditionFocus];
    if (!condMeta || !condNotes || !condNotes.length) return "";
    var inMicro = (condMeta.nutrients || []).indexOf(key) !== -1;
    var inLongevity = (condMeta.longevityNutrients || []).indexOf(key) !== -1;
    if (!inMicro && !inLongevity) return "";
    return (
      '<section class="micro-def__section micro-def__section--condition">' +
      '<h4 class="micro-def__heading micro-def__heading--condition">' +
      '<svg class="micro-def__heading--condition-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M8 2.25C4.55 2.25 1.68 4.73 1 8c.68 3.27 3.55 5.75 7 5.75S14.32 11.27 15 8c-.68-3.27-3.45-5.75-7-5.75zm0 9.5A3.75 3.75 0 1 1 8 4.25 3.75 3.75 0 0 1 8 11.75zm0-6A2.25 2.25 0 1 0 5.75 8 2.25 2.25 0 0 0 8 5.75z"></path>' +
      "</svg>" +
      "<span>Focus: " +
      escapeHtml(condMeta.label) +
      "</span></h4>" +
      microDefParagraphsHtml(condNotes) +
      "</section>"
    );
  }

  function renderMicroDefBody(key) {
    if (!microDefBodyEl) return;
    var field = microDisplayFieldByKey(key);
    var def = microDefinitions[key];
    if (!def) {
      microDefBodyEl.innerHTML =
        '<p class="micro-def__empty">No description is available for ' +
        escapeHtml(field ? field.label : key) +
        " yet.</p>";
      setMicroDefFoodSources("");
      return;
    }

    var html = microDefWarningSectionHtml(def) + microDefConditionSectionHtml(key, def);

    if (key === "solubleFiber" || key === "insolubleFiber") {
      html += fiberBulkingTypeHtml(key);
    }

    if (def.dashboardTracking.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">Tracking on this dashboard</h4>' +
        microDefParagraphsHtml(def.dashboardTracking) +
        "</section>";
    }

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
        '<h4 class="micro-def__heading">' +
        (isInsolubleToSolubleFiberRatioKey(key)
          ? "Daily fiber &amp; ratio"
          : "When you get enough") +
        "</h4>" +
        microDefParagraphsHtml(def.enough) +
        "</section>";
    }

    html += microDefBrainLongevitySectionHtml(def);

    if (isInsolubleToSolubleFiberRatioKey(key)) {
      html += insolubleToSolubleFiberCompareHtml();
    }

    if (key === "vitaminK1" || key === "vitaminK2") {
      html += vitaminKKeyDifferencesHtml();
    }

    if (key === "vitaminARetinol" || key === "vitaminABetaCarotene") {
      html += vitaminAKeyDifferencesHtml();
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

    setMicroDefFoodSources(
      def.foodSourceGroups.length || def.foodSources.length
        ? microDefFoodSourcesHtml(def.foodSources, def.foodSourceGroups)
        : ""
    );

    microDefBodyEl.innerHTML =
      html || '<p class="micro-def__empty">No description content yet.</p>';
  }

  function vitaminKKeyDifferencesHtml() {
    return (
      '<section class="micro-def__section">' +
      '<h4 class="micro-def__heading">The Key Differences</h4>' +
      '<p class="micro-def__p"><strong>Vitamin K1 (Phylloquinone):</strong> Found mainly in leafy greens. Used by the liver for healthy blood clotting—not the same calcium-routing role as K2.</p>' +
      '<p class="micro-def__p"><strong>Vitamin K2 (Menaquinone):</strong> Found in fermented foods and animal products. Helps route calcium into bone and teeth and may reduce calcium buildup in arteries and soft tissues.</p>' +
      '<p class="micro-def__p"><strong>The sub-forms of K2:</strong></p>' +
      '<p class="micro-def__p"><strong>MK-4 (Menaquinone-4):</strong> Found in some meats and dairy. Clears from the body within a few hours—you typically need multiple doses through the day to keep levels stable.</p>' +
      '<p class="micro-def__p"><strong>MK-7 (Menaquinone-7):</strong> Sourced from fermented foods like natto. Lasts for days, allowing steady once-daily supplementation. Many commercial natto products have K2 removed—when supplementing, choose the MK-7 form.</p>' +
      "</section>"
    );
  }

  function vitaminAKeyDifferencesHtml() {
    return (
      '<section class="micro-def__section">' +
      '<h4 class="micro-def__heading">The Key Differences</h4>' +
      '<p class="micro-def__p"><strong>Preform vitamin A (retinol):</strong> Active vitamin A from animal foods and fortified products (liver, eggs, dairy, some fish). Directly supports vision (rhodopsin), gene expression, immune barriers, reproduction, and epithelial repair. Excess preformed A is stored and can be toxic—IOM adult UL is 3,000 mcg/day from food plus supplements.</p>' +
      '<p class="micro-def__p"><strong>Proform vitamin A (β-carotene):</strong> Plant carotenoid that acts as an antioxidant (quenches singlet oxygen) and converts to retinol only as needed. Stored as carotenoid pigment, not as free retinol, so food β-carotene does not share the retinol UL. Smokers should avoid high-dose β-carotene supplements (ATBC / CARET trials).</p>' +
      '<p class="micro-def__p"><strong>How totals relate (IOM RAE):</strong> There is no recommended retinol∶β-carotene ratio and no separate FDA Daily Value for either form. Total vitamin A uses retinol activity equivalents: 1 mcg RAE = 1 mcg retinol = 12 mcg dietary β-carotene (or 2 mcg supplemental β-carotene). Keep total <code>vitaminA</code> in mcg RAE; log forms when you know the breakdown.</p>' +
      "</section>"
    );
  }

  function fiberBulkingTypeHtml(key) {
    if (key === "insolubleFiber") {
      return (
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">Bulking type and how it affects transit time</h4>' +
        '<p class="micro-def__p">Insoluble fiber passes through your digestive system largely intact, adding bulk roughage to your stool that triggers the walls and helps food pass more quickly through the stomach and intestines.</p>' +
        "</section>"
      );
    }
    if (key === "solubleFiber") {
      return (
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">Bulking type and how it affects transit time</h4>' +
        '<p class="micro-def__p">Soluble fiber attracts water and forms gel bulk that conforms to the space around it, slowing digestion, helping regulate blood sugar, and lowering cholesterol.</p>' +
        "</section>"
      );
    }
    return "";
  }

  function insolubleToSolubleFiberCompareHtml() {
    return (
      '<section class="micro-def__section">' +
      '<h4 class="micro-def__heading">How they compare</h4>' +
      '<p class="micro-def__p"><strong>Insoluble fiber</strong> passes through your digestive system largely intact, adding bulk roughage to your stool that triggers the walls and helps food pass more quickly.</p>' +
      '<p class="micro-def__p"><strong>Top sources:</strong> Wheat bran, whole-wheat breads, brown rice, nuts, and most vegetables.</p>' +
      '<p class="micro-def__p"><strong>Soluble fiber</strong> attracts water and forms gel bulk that conforms to the space around it, slowing digestion, helping regulate blood sugar, and lowering cholesterol.</p>' +
      '<p class="micro-def__p"><strong>Top sources:</strong> Oats, barley, beans, lentils, peas, and fruits like apples and oranges.</p>' +
      "</section>"
    );
  }

  function pufaVitaminEProtectionCalcHtml() {
    var weekLongevity = weekLongevityTotals();
    var derived = computeLongevityDerived(weekLongevity, weekMicroTotals());
    var vitEMg = derived.vitaminEMg;
    var pufaG = derived.pufaG;
    var target = longevityDvStatus.pufaVitaminEAlphaTocopherolPerGram;
    var ratio = derived.pufaVitaminERatio;
    var protection = derived.pufaVitaminEProtection;

    if (pufaG <= 0) {
      return (
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">Your calculation</h4>' +
        '<p class="micro-def__p">Log some polyunsaturated fat first—there is no daily PUFA average to divide by yet.</p>' +
        "</section>"
      );
    }

    var scoreRatio =
      target > 0 && ratio != null && !isNaN(ratio) ? ratio / target : null;

    return (
      '<section class="micro-def__section">' +
      '<h4 class="micro-def__heading">Your calculation</h4>' +
      '<p class="micro-def__p">Weekly average per day (Mon–Sun):</p>' +
      '<ul class="micro-def__list">' +
      "<li>Vitamin E: " +
      escapeHtml(fmtNum(vitEMg)) +
      " mg/day</li>" +
      "<li>PUFA: " +
      escapeHtml(fmtNum(pufaG)) +
      " g/day</li>" +
      "</ul><br/>" +
      '<p class="micro-def__p"><strong>Actual ratio</strong> = vitamin E ÷ PUFA<br>' +
      "= " +
      escapeHtml(fmtNum(vitEMg)) +
      " mg ÷ " +
      escapeHtml(fmtNum(pufaG)) +
      " g<br>" +
      "= <strong>" +
      escapeHtml(fmtNum(ratio)) +
      " mg/g</strong></p>" +
      '<p class="micro-def__p"><strong>% of target</strong> = ratio ÷ ' +
      escapeHtml(fmtNum(target)) +
      " mg/g target<br>" +
      "= " +
      escapeHtml(fmtNum(ratio)) +
      " ÷ " +
      escapeHtml(fmtNum(target)) +
      "<br>" +
      "= " +
      escapeHtml(fmtNum(scoreRatio)) +
      " → <strong>" +
      escapeHtml(fmtNum(protection)) +
      "% of target</strong></p>" +
      "</section>"
    );
  }

  function pufaVitaminEAntioxidantSupportHtml() {
    return (
      '<section class="micro-def__section">' +
      '<h4 class="micro-def__heading">Fat type → nutrients that help balance or protect</h4>' +
      '<ul class="micro-def__list">' +
      "<li><strong>PUFA (omega-3, omega-6)</strong> → vitamin E (primary)</li>" +
      "<li><strong>Omega-3 fish oils</strong> → vitamin E, selenium</li>" +
      "<li><strong>Monounsaturated fats</strong> (olive oil, avocado) → less need, but vitamin E helps</li>" +
      "<li><strong>Saturated fats</strong> → no specific antioxidant balancing needed</li>" +
      "<li><strong>Trans fats</strong> → no nutrient balances them; best minimized</li>" +
      "</ul>" +
      '<h4 class="micro-def__heading">Approximate vitamin E guidelines</h4>' +
      '<p class="micro-def__p">Use the ratio for PUFA, not total fat: total fat, monounsaturated fat, and saturated fat alone do not add a specific vitamin E requirement.</p>' +
      '<ul class="micro-def__list">' +
      "<li>PUFA overall: ~0.4–0.6 mg/g (this score uses 0.6 mg/g).</li>" +
      "<li>Omega-6 (seed oils, nuts): ~0.5 mg/g · omega-3 (fish oil): ~0.6–1 mg/g.</li>" +
      "<li>Examples: 10 g PUFA → ~4–6 mg E · 20 g → ~8–12 mg · RDA = 15 mg/day.</li>" +
      "</ul>" +
      '<h4 class="micro-def__heading">Other nutrients that support antioxidant recycling</h4>' +
      '<ul class="micro-def__list">' +
      "<li><strong>Vitamin C</strong> → regenerates vitamin E</li>" +
      "<li><strong>Selenium</strong> → supports glutathione enzymes</li>" +
      "<li><strong>Polyphenols</strong> (berries, tea, cocoa) → reduce oxidation</li>" +
      "<li><strong>Carotenoids</strong> (beta-carotene, lycopene) → antioxidant support</li>" +
      "</ul>" +
      '<p class="micro-def__p"><strong>Rule of thumb:</strong> The more PUFA you eat, the more useful adequate vitamin E becomes; vitamin C, selenium, polyphenols, and carotenoids widen cover beyond vitamin E alone. If your diet is heavy in nuts, seeds, seed oils, or fish oil, aim for at least 15 mg/day from food. High-dose vitamin E supplements (&gt;200–400 IU/day) are generally not recommended unless directed by a clinician.</p>' +
      '<p class="micro-def__p">The sections below apply this to the target formula, cooking and storage choices, DNA-risk context, and PUFA + vitamin E food pairings.</p>' +
      "</section>"
    );
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
      setMicroDefFoodSources("");
      return;
    }

    var limiting = isLongevityLimitingDefKey(key);
    var html =
      key === "pufaVitaminEProtection"
        ? pufaVitaminEProtectionCalcHtml() + pufaVitaminEAntioxidantSupportHtml()
        : "";
    html += microDefConditionSectionHtml(key, def);

    if (def.targetReference && def.targetReference.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">Daily target reference</h4>' +
        microDefParagraphsHtml(def.targetReference) +
        "</section>";
    }

    if (def.dashboardTracking.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">Tracking on this dashboard</h4>' +
        microDefParagraphsHtml(def.dashboardTracking) +
        "</section>";
    }

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

    html += microDefBrainLongevitySectionHtml(def);

    if (key === "vitaminK1" || key === "vitaminK2") {
      html += vitaminKKeyDifferencesHtml();
    }

    if (key === "vitaminARetinol" || key === "vitaminABetaCarotene") {
      html += vitaminAKeyDifferencesHtml();
    }

    if (!limiting && def.tooHigh.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too high</h4>' +
        microDefParagraphsHtml(def.tooHigh) +
        "</section>";
    }

    setMicroDefFoodSources(
      def.foodSourceGroups.length || def.foodSources.length
        ? microDefFoodSourcesHtml(def.foodSources, def.foodSourceGroups)
        : ""
    );

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

  function setDefModalReturnSources(returnTo) {
    defModalReturnSources = returnTo || null;
    if (microDefModalBackBtn) {
      microDefModalBackBtn.hidden = !defModalReturnSources;
      if (defModalReturnSources) {
        microDefModalBackBtn.textContent =
          defModalReturnSources.kind === "food" ? "← Food Sources" : "← My food";
      }
    }
    if (microDefModalFooterEl) {
      microDefModalFooterEl.classList.toggle(
        "modal__footer--split",
        !!defModalReturnSources
      );
    }
  }

  function setFoodSourcesStackedOnDef(on) {
    foodSourcesStackedOnDef = on ? true : null;
    if (foodSourcesModalEl) {
      foodSourcesModalEl.classList.toggle("modal--under-def", !!on);
    }
  }

  function setDefModalStackedForm(kind) {
    defModalStackedForm = kind || null;
    if (microDefModalEl) {
      microDefModalEl.classList.toggle("modal--stacked", !!kind);
      microDefModalEl.classList.toggle(
        "modal--stacked-food-sources",
        kind === "foodSources"
      );
    }
    if (kind === "foodSources") {
      setFoodSourcesStackedOnDef(true);
    }
  }

  function defModalTargetInfo(source, key) {
    if (source === "micro") {
      if (microDerivedDefByKey(key)) {
        return microDerivedRowTargetDisplay(key, {}, false);
      }
      if (!microFieldByKey(key)) return null;
      return microNutrientTargetPct(key, 0);
    }

    if (LONGEVITY_SECTION_DEFS[key]) return null;

    if (key === "glycemicLoad") {
      var glMax = longevityDvStatus.glycemicLoadMaxPerDay;
      if (!glMax) return null;
      return {
        kindLabel: "",
        reqAmount: fmtNum(glMax) + " GL/day",
        limiting: true,
        refKey: key,
      };
    }

    if (key === "pufaVitaminEProtection") {
      var alpha =
        longevityDvStatus.pufaVitaminEAlphaTocopherolPerGram ||
        DEFAULT_LONGEVITY_STATUS.pufaVitaminEAlphaTocopherolPerGram;
      return {
        kindLabel: "",
        reqAmount: fmtNum(alpha) + " mg vitamin E per g PUFA (100% target)",
        limiting: false,
        refKey: key,
      };
    }

    if (key === "omega6To3") {
      var idealMax =
        longevityDvStatus.omega6To3IdealMax ||
        DEFAULT_LONGEVITY_STATUS.omega6To3IdealMax;
      return {
        kindLabel: "",
        reqAmount: "≤ " + idealMax + ":1 ideal",
        limiting: true,
        refKey: key,
      };
    }

    if (key === "potassiumToSodium") {
      var idealMin =
        longevityDvStatus.potassiumToSodiumIdealMin ||
        DEFAULT_LONGEVITY_STATUS.potassiumToSodiumIdealMin;
      return {
        kindLabel: "",
        reqAmount: "≥ " + idealMin + ":1 target",
        limiting: false,
        refKey: key,
      };
    }

    if (key === "epaPlusDha") {
      var omega3Field = longevityFieldByKey("omega3");
      if (!omega3Field) return null;
      return microRowTargetDisplay(omega3Field, 0, "longevity", {});
    }

    var longevityField = longevityFieldByKey(key);
    if (longevityField) {
      return microRowTargetDisplay(longevityField, 0, "longevity", {});
    }

    if (microFieldByKey(key)) {
      return microNutrientTargetPct(key, 0);
    }

    return null;
  }

  function clearDefModalTargets() {
    if (!microDefTargetsEl) return;
    microDefTargetsEl.hidden = true;
    microDefTargetsEl.innerHTML = "";
    microDefTargetsEl.classList.remove("micro-def__targets--limiting");
  }

  function renderDefModalTargets(source, key) {
    if (!microDefTargetsEl) return;
    var info = defModalTargetInfo(source, key);
    if (!info || (!info.kindLabel && !info.reqAmount)) {
      clearDefModalTargets();
      return;
    }

    var html =
      '<div class="micro-def__targets-inner">' +
      '<span class="micro-def__targets-label">Daily target</span>';
    if (info.reqAmount) {
      html +=
        '<span class="micro-def__targets-amount">' +
        escapeHtml(info.reqAmount) +
        "</span>";
    }
    if (info.kindLabel) {
      html += targetKindLabelHtml(
        info.kindLabel,
        "micro-def__targets-kind",
        info.refKey || key
      );
    }
    html += "</div>";

    microDefTargetsEl.innerHTML = html;
    microDefTargetsEl.hidden = false;
    microDefTargetsEl.classList.toggle("micro-def__targets--limiting", !!info.limiting);
  }

  function defModalSourcesTarget() {
    if (activeMicroDefKey) {
      if (microDerivedDefByKey(activeMicroDefKey)) return null;
      if (!microDisplayFieldByKey(activeMicroDefKey)) return null;
      return { modal: "micro", key: activeMicroDefKey, scope: "week" };
    }
    if (activeLongevityDefKey) {
      var key = activeLongevityDefKey;
      if (key === "glycemicLoad") {
        return { modal: "longevity", key: key, kind: "glycemicLoad" };
      }
      if (LONGEVITY_DERIVED_DEFS[key] || LONGEVITY_SECTION_DEFS[key]) {
        return null;
      }
      if (longevityFieldByKey(key)) {
        return { modal: "longevity", key: key, kind: "longevity" };
      }
      if (microFieldByKey(key)) {
        return { modal: "micro", key: key, scope: "week" };
      }
      return null;
    }
    return null;
  }

  function syncDefModalSourcesBtn() {
    if (!microDefModalSourcesBtn) return;
    var target = defModalSourcesTarget();
    if (!target) {
      microDefModalSourcesBtn.hidden = true;
      return;
    }
    microDefModalSourcesBtn.hidden = false;
    microDefModalSourcesBtn.setAttribute("data-def-sources-modal", target.modal);
    microDefModalSourcesBtn.setAttribute("data-def-sources-key", target.key);
    if (target.scope) {
      microDefModalSourcesBtn.setAttribute("data-def-sources-scope", target.scope);
    } else {
      microDefModalSourcesBtn.removeAttribute("data-def-sources-scope");
    }
    if (target.kind) {
      microDefModalSourcesBtn.setAttribute("data-def-sources-kind", target.kind);
    } else {
      microDefModalSourcesBtn.removeAttribute("data-def-sources-kind");
    }
  }

  function focusMicroDefModal() {
    if (microDefModalSourcesBtn && !microDefModalSourcesBtn.hidden) {
      microDefModalSourcesBtn.focus();
    } else if (microDefModalDoneBtn) {
      microDefModalDoneBtn.focus();
    }
  }

  function openSourcesFromDefModal() {
    if (!microDefModalSourcesBtn || microDefModalSourcesBtn.hidden) return;
    var modal = microDefModalSourcesBtn.getAttribute("data-def-sources-modal");
    var key = microDefModalSourcesBtn.getAttribute("data-def-sources-key");
    if (!modal || !key) return;
    if (modal === "micro") {
      openMicroSourcesModal(
        key,
        microDefModalSourcesBtn.getAttribute("data-def-sources-scope") || "week",
        true
      );
    } else {
      openLongevitySourcesModal(
        key,
        microDefModalSourcesBtn.getAttribute("data-def-sources-kind") || "longevity",
        true
      );
    }
  }

  function setSourcesModalStackedOnDef(on) {
    sourcesModalStackedOnDef = on ? true : null;
    if (microSourcesModalEl) {
      microSourcesModalEl.classList.toggle("modal--stacked", !!on);
    }
    if (longevitySourcesModalEl) {
      longevitySourcesModalEl.classList.toggle("modal--stacked", !!on);
    }
  }

  function returnFromDefModalToSources() {
    if (!defModalReturnSources) return;
    var returnTo = defModalReturnSources;
    activeMicroDefKey = null;
    activeLongevityDefKey = null;
    setMicroDefFullscreen(false);
    clearDefModalTargets();
    if (microDefModalEl) microDefModalEl.hidden = true;
    setDefModalReturnSources(null);
    setDefModalStackedForm(null);
    if (microDefModalSourcesBtn) microDefModalSourcesBtn.hidden = true;
    updateBodyModalOpen();
    if (returnTo.kind === "food") {
      setFoodSourcesStackedOnDef(false);
      if (foodSourcesModalEl && foodSourcesModalEl.hidden) {
        activeFoodSourcesSort =
          returnTo.sort || defaultFoodSourcesSortForKey("nutrient");
        activeFoodSourcesFilter = returnTo.filter || "";
        setFoodSourcesFullscreen(!!returnTo.fullscreen);
        syncFoodSourcesControls();
        foodSourcesModalEl.hidden = false;
        renderFoodSourcesBody();
        updateBodyModalOpen();
      }
      if (foodSourcesModalDoneBtn) foodSourcesModalDoneBtn.focus();
      return;
    }
    if (returnTo.kind === "micro") {
      openMicroSourcesModal(returnTo.key, returnTo.scope);
    } else {
      openLongevitySourcesModal(returnTo.key, returnTo.sourcesKind);
    }
  }

  function closeMicroDefModal() {
    if (!microDefModalEl) return;
    var stackedForm = defModalStackedForm;
    var stackedKey = activeMicroDefKey || activeLongevityDefKey;
    activeMicroDefKey = null;
    activeLongevityDefKey = null;
    setMicroDefFullscreen(false);
    clearDefModalTargets();
    microDefModalEl.hidden = true;
    setDefModalReturnSources(null);
    setDefModalStackedForm(null);
    if (microDefModalSourcesBtn) microDefModalSourcesBtn.hidden = true;
    updateBodyModalOpen();
    if (stackedForm === "micro" && microFormEl) {
      var microInput = microFormEl.querySelector(
        stackedKey ? '[data-micro-key="' + stackedKey + '"]' : "input"
      );
      if (microInput) microInput.focus();
    } else if (stackedForm === "longevity" && longevityFormEl) {
      var longevityInput = longevityFormEl.querySelector(
        stackedKey ? '[data-longevity-key="' + stackedKey + '"]' : "input"
      );
      if (longevityInput) longevityInput.focus();
    } else if (stackedForm === "foodSources") {
      setFoodSourcesStackedOnDef(false);
      if (foodSourcesModalEl && !foodSourcesModalEl.hidden && foodSourcesModalDoneBtn) {
        foodSourcesModalDoneBtn.focus();
      }
    }
  }

  function updateSourcesFullscreenToggle(btn, on) {
    if (!btn) return;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Exit full screen" : "Full screen";
    btn.setAttribute(
      "aria-label",
      on ? "Exit full screen" : "Read in full screen"
    );
  }

  function setMicroSourcesFullscreen(on) {
    microSourcesFullscreen = !!on;
    if (microSourcesModalEl) {
      microSourcesModalEl.classList.toggle("modal--fullscreen", microSourcesFullscreen);
    }
    updateSourcesFullscreenToggle(microSourcesFullscreenToggleBtn, microSourcesFullscreen);
  }

  function setLongevitySourcesFullscreen(on) {
    longevitySourcesFullscreen = !!on;
    if (longevitySourcesModalEl) {
      longevitySourcesModalEl.classList.toggle(
        "modal--fullscreen",
        longevitySourcesFullscreen
      );
    }
    updateSourcesFullscreenToggle(
      longevitySourcesFullscreenToggleBtn,
      longevitySourcesFullscreen
    );
  }

  function closeOtherModalsForSources(opts) {
    opts = opts || {};
    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (!opts.keepDefModal && microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (microSourcesModalEl && !microSourcesModalEl.hidden) closeMicroSourcesModal();
    if (longevitySourcesModalEl && !longevitySourcesModalEl.hidden) {
      closeLongevitySourcesModal();
    }
    if (macroRankModalEl && !macroRankModalEl.hidden) closeMacroRankModal();
    if (foodSourcesModalEl && !foodSourcesModalEl.hidden) {
      closeFoodSourcesModal();
    }
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (histamineTipModalEl && !histamineTipModalEl.hidden) {
      closeHistamineTipModal();
    }
    if (!opts.keepFormModals) {
      if (activeMicroId) {
        saveMicrosFromForm();
        closeMicroModal();
      }
      if (activeLongevityId) {
        saveLongevityFromForm();
        closeLongevityModal();
      }
    }
  }

  function normalizeSourcesSortKey(key) {
    if (key === "name" || key === "rank" || key === "amount") return key;
    return "amount";
  }

  function defaultSourcesSortForKey(key) {
    var sortKey = normalizeSourcesSortKey(key);
    if (sortKey === "amount") return { key: "amount", dir: "desc" };
    return { key: sortKey, dir: "asc" };
  }

  function nextSourcesSort(current, nextKey) {
    var key = normalizeSourcesSortKey(nextKey);
    if (current && current.key === key) {
      return { key: key, dir: current.dir === "asc" ? "desc" : "asc" };
    }
    return defaultSourcesSortForKey(key);
  }

  function sourcesListSortHeaderHtml(sort) {
    var sortKey = normalizeSourcesSortKey(sort && sort.key);
    var sortDir =
      sortKey === "amount"
        ? sort && sort.dir === "asc"
          ? "asc"
          : "desc"
        : sort && sort.dir === "desc"
          ? "desc"
          : "asc";

    function sortBtn(key, label, extraClass) {
      var active = sortKey === key;
      var arrow = active ? (sortDir === "asc" ? " ↑" : " ↓") : "";
      var title;
      if (key === "name") {
        title = active
          ? sortDir === "asc"
            ? "Sorted A–Z — click for Z–A"
            : "Sorted Z–A — click for A–Z"
          : "Sort by food name";
      } else if (key === "amount") {
        title = active
          ? sortDir === "desc"
            ? "Sorted high→low — click for low→high"
            : "Sorted low→high — click for high→low"
          : "Sort by amount";
      } else {
        title = active
          ? sortDir === "asc"
            ? "Sorted by rank (#1 first) — click to reverse"
            : "Sorted by rank (lowest first) — click to reverse"
          : "Sort by rank";
      }
      return (
        '<button type="button" class="micro-sources-modal__sort-btn ' +
        extraClass +
        (active ? " is-active" : "") +
        '" data-sources-sort="' +
        key +
        '" aria-pressed="' +
        (active ? "true" : "false") +
        '" aria-sort="' +
        (active ? (sortDir === "asc" ? "ascending" : "descending") : "none") +
        '" title="' +
        escapeAttr(title) +
        '">' +
        escapeHtml(label) +
        '<span class="micro-sources-modal__sort-arrow" aria-hidden="true">' +
        escapeHtml(arrow) +
        "</span></button>"
      );
    }

    return (
      '<div class="micro-sources-modal__list-head">' +
      sortBtn("rank", "#", "micro-sources-modal__sort-btn--rank") +
      sortBtn("name", "Food", "micro-sources-modal__sort-btn--name") +
      sortBtn("amount", "Amount", "micro-sources-modal__sort-btn--amount") +
      "</div>"
    );
  }

  function nutrientSourcesListHtml(list, unit, sort) {
    var total = 0;
    var html =
      sourcesListSortHeaderHtml(sort) + '<ol class="micro-sources-modal__list">';
    list.forEach(function (item, idx) {
      total += item.amount;
      var perText = fmtNum(item.perServing) + " " + unit;
      var rowTotalText = fmtNum(item.amount) + " " + unit;
      var calcHtml;
      if (item.hits > 1) {
        calcHtml =
          '<span class="micro-sources-modal__calc">' +
          '<span class="micro-sources-modal__per">' +
          escapeHtml(perText) +
          "</span>" +
          '<span class="micro-sources-modal__times">× ' +
          item.hits +
          "</span>" +
          '<span class="micro-sources-modal__eq">=</span>' +
          '<span class="micro-sources-modal__row-total">' +
          escapeHtml(rowTotalText) +
          "</span></span>";
      } else {
        calcHtml =
          '<span class="micro-sources-modal__calc">' +
          '<span class="micro-sources-modal__row-total">' +
          escapeHtml(rowTotalText) +
          "</span></span>";
      }
      html +=
        '<li class="micro-sources-modal__item">' +
        '<span class="micro-sources-modal__rank">' +
        (item.rank != null ? item.rank : idx + 1) +
        "</span>" +
        '<span class="micro-sources-modal__name">' +
        escapeHtml(item.name) +
        "</span>" +
        calcHtml +
        "</li>";
    });
    html += "</ol>";
    html +=
      '<p class="micro-sources-modal__total">Total: ' +
      escapeHtml(fmtNum(total) + " " + unit) +
      "</p>";
    return html;
  }

  function prepareSourcesList(list, filterText, sort) {
    var ranked = list.map(function (item, idx) {
      var copy = {};
      for (var key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          copy[key] = item[key];
        }
      }
      copy.rank = idx + 1;
      return copy;
    });
    var q = (filterText || "").trim().toLowerCase();
    var filtered = q
      ? ranked.filter(function (item) {
          return String(item.name || "")
            .toLowerCase()
            .indexOf(q) !== -1;
        })
      : ranked;
    var sortKey = normalizeSourcesSortKey(sort && sort.key);
    var sortDir =
      sortKey === "amount"
        ? sort && sort.dir === "asc"
          ? "asc"
          : "desc"
        : sort && sort.dir === "desc"
          ? "desc"
          : "asc";
    return filtered.slice().sort(function (a, b) {
      var cmp;
      if (sortKey === "name") {
        cmp = String(a.name || "").localeCompare(String(b.name || ""), undefined, {
          sensitivity: "base",
        });
      } else if (sortKey === "amount") {
        cmp = (a.amount || 0) - (b.amount || 0);
      } else {
        cmp = (a.rank || 0) - (b.rank || 0);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }

  function sourcesFilterEmptyHtml(filterText) {
    var q = (filterText || "").trim();
    return (
      '<p class="micro-sources-modal__empty">No foods matching "' +
      escapeHtml(q) +
      '".</p>'
    );
  }

  function giTierFromGi(gi) {
    if (gi <= 55) return "low";
    if (gi <= 69) return "med";
    return "high";
  }

  function glycemicLoadContributionsFromWeek() {
    var merged = {};
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      var seen = {};
      keywords.forEach(function (kw) {
        var name = kw.name.trim();
        if (!name) return;
        var nameKey = name.toLowerCase();
        if (seen[nameKey]) return;
        seen[nameKey] = true;

        var gi = parseFloat(kw.longevity.glycemicIndex);
        if (isNaN(gi) || gi <= 0) return;

        var carbs = parseMacro(kw.carbs);
        if (!carbs) return;

        var hits = countKeyword(text, name);
        if (!hits) return;

        var perServingGl = (gi * carbs) / 100;
        if (merged[nameKey]) {
          merged[nameKey].amount += hits * perServingGl;
          merged[nameKey].hits += hits;
        } else {
          merged[nameKey] = {
            name: name,
            gi: gi,
            carbs: carbs,
            perServingGl: perServingGl,
            tier: giTierFromGi(gi),
            hits: hits,
            amount: hits * perServingGl,
          };
        }
      });
    });
    return Object.keys(merged)
      .map(function (k) {
        return merged[k];
      })
      .sort(function (a, b) {
        if (b.perServingGl !== a.perServingGl) return b.perServingGl - a.perServingGl;
        return b.amount - a.amount;
      });
  }

  function glycemicLoadWeekCompareHtml(weekTotal) {
    var dayCount = weekAverageDayCount();
    var favDaily = longevityDvStatus.glycemicLoadMaxPerDay || 100;
    var modDailyMax =
      longevityDvStatus.glycemicLoadModerateMaxPerDay || 120;
    var favWeekMax = favDaily * dayCount;
    var modWeekMax = modDailyMax * dayCount;
    var dailyAvg = weekTotal / dayCount;
    var tier =
      dailyAvg < favDaily
        ? "favorable"
        : dailyAvg <= modDailyMax
          ? "moderate"
          : "high";

    function tierRow(tierKey, label, benchmarkText) {
      var note;
      if (tierKey === "favorable") {
        if (tier === "favorable") {
          note = "yours " + fmtNum(weekTotal) + " GL";
        } else if (weekTotal >= favWeekMax) {
          note =
            fmtNum(weekTotal - favWeekMax) +
            " GL above favorable ceiling";
        }
      } else if (tierKey === "moderate") {
        if (tier === "moderate") {
          note = "yours " + fmtNum(weekTotal) + " GL";
        } else if (weekTotal < favWeekMax) {
          note = fmtNum(favWeekMax - weekTotal) + " GL below band";
        } else if (weekTotal > modWeekMax) {
          note = fmtNum(weekTotal - modWeekMax) + " GL above band";
        }
      } else if (tierKey === "high") {
        if (tier === "high") {
          note = "yours " + fmtNum(weekTotal) + " GL";
        } else if (weekTotal <= modWeekMax) {
          note = fmtNum(modWeekMax - weekTotal) + " GL below threshold";
        }
      }
      return (
        '<div class="micro-sources-modal__req-row micro-sources-modal__gl-tier micro-sources-modal__gl-tier--' +
        tierKey +
        (tier === tierKey ? " micro-sources-modal__gl-tier--active" : "") +
        '">' +
        '<span class="micro-sources-modal__req-label">' +
        escapeHtml(label) +
        "</span>" +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(benchmarkText + (note ? " · " + note : "")) +
        "</span></div>"
      );
    }

    return (
      '<div class="micro-sources-modal__gl-compare">' +
      tierRow(
        "favorable",
        "Favorable week total (<" + fmtNum(favDaily) + " GL/day)",
        "<" + fmtNum(favWeekMax) + " GL"
      ) +
      tierRow(
        "moderate",
        "Moderate week total (" +
          fmtNum(favDaily) +
          "–" +
          fmtNum(modDailyMax) +
          " GL/day)",
        fmtNum(favWeekMax) + "–" + fmtNum(modWeekMax) + " GL"
      ) +
      tierRow(
        "high",
        "High week total (>" + fmtNum(modDailyMax) + " GL/day)",
        ">" + fmtNum(modWeekMax) + " GL"
      ) +
      "</div>"
    );
  }

  function glycemicLoadSourcesListHtml(list, sort) {
    var total = 0;
    var html =
      '<p class="micro-sources-modal__gi-legend" role="note">' +
      '<span class="micro-sources-modal__gi-legend-item micro-sources-modal__gi-legend-item--low">Low GI ≤55</span>' +
      '<span class="micro-sources-modal__gi-legend-item micro-sources-modal__gi-legend-item--med">Med GI 56–69</span>' +
      '<span class="micro-sources-modal__gi-legend-item micro-sources-modal__gi-legend-item--high">High GI ≥70</span>' +
      "</p>" +
      sourcesListSortHeaderHtml(sort) +
      '<ol class="micro-sources-modal__list">';
    list.forEach(function (item, idx) {
      total += item.amount;
      var perText = fmtNum(item.perServingGl) + " GL";
      var rowTotalText = fmtNum(item.amount) + " GL";
      var metaHtml =
        '<span class="micro-sources-modal__gi-meta">' +
        escapeHtml("GI " + fmtNum(item.gi) + " · " + fmtNum(item.carbs) + " g carbs") +
        "</span>";
      var calcHtml;
      if (item.hits > 1) {
        calcHtml =
          '<span class="micro-sources-modal__calc">' +
          '<span class="micro-sources-modal__per">' +
          escapeHtml(perText) +
          "</span>" +
          metaHtml +
          '<span class="micro-sources-modal__times">× ' +
          item.hits +
          "</span>" +
          '<span class="micro-sources-modal__eq">=</span>' +
          '<span class="micro-sources-modal__row-total">' +
          escapeHtml(rowTotalText) +
          "</span></span>";
      } else {
        calcHtml =
          '<span class="micro-sources-modal__calc">' +
          '<span class="micro-sources-modal__row-total">' +
          escapeHtml(perText) +
          "</span>" +
          metaHtml +
          "</span>";
      }
      html +=
        '<li class="micro-sources-modal__item micro-sources-modal__item--gi-' +
        item.tier +
        '">' +
        '<span class="micro-sources-modal__rank">' +
        (item.rank != null ? item.rank : idx + 1) +
        "</span>" +
        '<span class="micro-sources-modal__name">' +
        escapeHtml(item.name) +
        "</span>" +
        calcHtml +
        "</li>";
    });
    html += "</ol>";
    var dailyAvg = total / weekAverageDayCount();
    html +=
      '<p class="micro-sources-modal__total">Week total GL from listed foods: ' +
      escapeHtml(fmtNum(total) + " GL") +
      " (" +
      escapeHtml(fmtNum(dailyAvg) + " GL/day avg") +
      ")</p>";
    html += glycemicLoadWeekCompareHtml(total);
    return html;
  }

  function microDvForDemographic(microKey, demoId) {
    if (demographicDv && demographicDv.getDailyMicroDv) {
      return demographicDv.getDailyMicroDv(demoId, microKey);
    }
    return 0;
  }

  function microDvAmountText(amount, unit) {
    if (!amount) return "—";
    return fmtNum(amount) + " " + unit;
  }

  function microSourcesRequirementsHtml(field) {
    var maleDv = microDvForDemographic(field.key, "male");
    var femaleDv = microDvForDemographic(field.key, "female");
    var weekCount = DAYS.length;
    var sameBySex = maleDv === femaleDv;
    var iomMgPerKg = iomBwMinMgPerKg(field.key);
    var weightKg = getBodyWeightKg();
    var studyMax = studyMaxMicroRef(field.key);
    var noStandaloneRef = microHasNoStandaloneRef(field.key);

    var html = '<div class="micro-sources-modal__reqs">';

    if (!maleDv && !femaleDv && !iomMgPerKg && !studyMax && !noStandaloneRef) {
      html +=
        '<p class="micro-sources-modal__req-note">No daily reference set for this nutrient.</p></div>';
      return html;
    }

    if (sameBySex && (maleDv || femaleDv)) {
      var dv = maleDv || femaleDv;
      html +=
        '<div class="micro-sources-modal__req-row">' +
        '<span class="micro-sources-modal__req-label">Daily requirement (FDA DV)</span>' +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(microDvAmountText(dv, field.unit)) +
        "</span></div>" +
        '<div class="micro-sources-modal__req-row">' +
        '<span class="micro-sources-modal__req-label">Weekly requirement (FDA DV)</span>' +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(microDvAmountText(dv * weekCount, field.unit)) +
        "</span></div>";
    } else if (maleDv || femaleDv) {
      var metaMap = demographicDv ? demographicDv.META : {};
      var maleMeta = metaMap.male || { icon: "♂", label: "Male" };
      var femaleMeta = metaMap.female || { icon: "♀", label: "Female" };
      html += '<div class="micro-sources-modal__req-sex-grid">';
      [
        { id: "male", dv: maleDv, meta: maleMeta },
        { id: "female", dv: femaleDv, meta: femaleMeta },
      ].forEach(function (entry) {
        if (!entry.dv) return;
        var selected = demographic === entry.id;
        html +=
          '<div class="micro-sources-modal__req-sex' +
          (selected ? " micro-sources-modal__req-sex--selected" : "") +
          '">' +
          '<p class="micro-sources-modal__req-sex-title">' +
          escapeHtml(entry.meta.icon + " " + entry.meta.label) +
          (selected ? ' <span class="micro-sources-modal__req-profile">(your profile)</span>' : "") +
          "</p>" +
          '<div class="micro-sources-modal__req-row">' +
          '<span class="micro-sources-modal__req-label">Daily</span>' +
          '<span class="micro-sources-modal__req-val">' +
          escapeHtml(microDvAmountText(entry.dv, field.unit)) +
          "</span></div>" +
          '<div class="micro-sources-modal__req-row">' +
          '<span class="micro-sources-modal__req-label">Weekly</span>' +
          '<span class="micro-sources-modal__req-val">' +
          escapeHtml(microDvAmountText(entry.dv * weekCount, field.unit)) +
          "</span></div></div>";
      });
      html += "</div>";
    }

    if (iomMgPerKg) {
      html +=
        '<p class="micro-sources-modal__req-note">IOM bw min (2005 EAR): ' +
        escapeHtml(fmtNum(iomMgPerKg) + " mg/kg body weight/day") +
        ".</p>";
      if (!weightKg) {
        html +=
          '<p class="micro-sources-modal__req-note">Set body weight in Settings to see your daily IOM bw min.</p>';
      } else {
        var iomDaily = iomBwMinDaily(field.key);
        html +=
          '<div class="micro-sources-modal__req-row">' +
          '<span class="micro-sources-modal__req-label">Daily IOM bw min</span>' +
          '<span class="micro-sources-modal__req-val">' +
          escapeHtml(microDvAmountText(iomDaily, field.unit)) +
          "</span></div>" +
          '<div class="micro-sources-modal__req-row">' +
          '<span class="micro-sources-modal__req-label">Weekly IOM bw min</span>' +
          '<span class="micro-sources-modal__req-val">' +
          escapeHtml(microDvAmountText(iomDaily * weekCount, field.unit)) +
          "</span></div>";
      }
    }

    if (studyMax) {
      html +=
        '<p class="micro-sources-modal__req-note">Study max: ' +
        escapeHtml(studyMax.source) +
        ". This is a study-derived ceiling reference, not an FDA or IOM daily value.</p>" +
        '<div class="micro-sources-modal__req-row">' +
        '<span class="micro-sources-modal__req-label">Daily study max</span>' +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(microDvAmountText(studyMax.amount, field.unit)) +
        "</span></div>";
    }

    if (noStandaloneRef) {
      html +=
        '<p class="micro-sources-modal__req-note">No standalone FDA, IOM/HMD, or human-study daily minimum/maximum is set for this nutrient. It is shown unscored.</p>';
    }

    html += "</div>";
    return html;
  }

  function longevityContributionsFromWeek(nutrientKey, kind) {
    var merged = {};
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      var seen = {};
      keywords.forEach(function (kw) {
        var name = kw.name.trim();
        if (!name) return;
        var nameKey = name.toLowerCase();
        if (seen[nameKey]) return;
        seen[nameKey] = true;

        var hits = countKeyword(text, name);
        if (!hits) return;

        var v =
          kind === "macro"
            ? kw[nutrientKey]
            : kind === "micro"
              ? kw.micros[nutrientKey]
              : resolveLongevityValue(kw, nutrientKey);
        if (v === "" || v == null) return;
        var perServing = parseFloat(v);
        if (isNaN(perServing) || perServing <= 0) return;

        if (merged[nameKey]) {
          merged[nameKey].amount += hits * perServing;
          merged[nameKey].hits += hits;
        } else {
          merged[nameKey] = {
            name: name,
            amount: hits * perServing,
            hits: hits,
            perServing: perServing,
          };
        }
      });
    });
    return Object.keys(merged)
      .map(function (k) {
        return merged[k];
      })
      .sort(function (a, b) {
        return b.amount - a.amount;
      });
  }

  function longevitySourcesRequirementsHtml(nutrientKey, kind) {
    if (kind === "micro") {
      var microField = microFieldByKey(nutrientKey);
      return microField ? microSourcesRequirementsHtml(microField) : "";
    }

    if (kind === "glycemicLoad") {
      var glMax = longevityDvStatus.glycemicLoadMaxPerDay;
      var html = '<div class="micro-sources-modal__reqs">';
      if (!glMax) {
        html +=
          '<p class="micro-sources-modal__req-note">No daily glycemic load reference set.</p></div>';
        return html;
      }
      html +=
        '<div class="micro-sources-modal__req-row">' +
        '<span class="micro-sources-modal__req-label">Daily reference</span>' +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(fmtNum(glMax) + " GL/day") +
        "</span></div>" +
        '<p class="micro-sources-modal__req-note">Ranked by GL per serving (GI × carbs ÷ 100), highest first. Row color follows GI tier.</p></div>';
      return html;
    }

    if (kind === "macro" && nutrientKey === "protein") {
      var proteinTarget = dailyProteinTargetG();
      var weekCount = DAYS.length;
      var proteinNote = getBodyWeightKg()
        ? "0.8 g/kg body weight (IOM estimated average requirement)"
        : "50 g/day FDA Daily Value — set body weight in Settings for a personalized 0.8 g/kg target";
      var proteinHtml = '<div class="micro-sources-modal__reqs">';
      proteinHtml +=
        '<div class="micro-sources-modal__req-row">' +
        '<span class="micro-sources-modal__req-label">Daily requirement</span>' +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(fmtNum(proteinTarget) + " g") +
        "</span></div>" +
        '<div class="micro-sources-modal__req-row">' +
        '<span class="micro-sources-modal__req-label">Weekly requirement</span>' +
        '<span class="micro-sources-modal__req-val">' +
        escapeHtml(fmtNum(proteinTarget * weekCount) + " g") +
        "</span></div>" +
        '<p class="micro-sources-modal__req-note">' +
        escapeHtml(proteinNote) +
        "</p></div>";
      return proteinHtml;
    }

    var field = longevityFieldByKey(nutrientKey);
    if (!field) return "";
    var dv = dailyLongevityDv(nutrientKey);
    var weekCount = DAYS.length;
    var html = '<div class="micro-sources-modal__reqs">';

    if (!dv) {
      html +=
        '<p class="micro-sources-modal__req-note">No daily reference set for this nutrient.</p></div>';
      return html;
    }

    html +=
      '<div class="micro-sources-modal__req-row">' +
      '<span class="micro-sources-modal__req-label">Daily requirement</span>' +
      '<span class="micro-sources-modal__req-val">' +
      escapeHtml(microDvAmountText(dv, field.unit)) +
      "</span></div>" +
      '<div class="micro-sources-modal__req-row">' +
      '<span class="micro-sources-modal__req-label">Weekly requirement</span>' +
      '<span class="micro-sources-modal__req-val">' +
      escapeHtml(microDvAmountText(dv * weekCount, field.unit)) +
      "</span></div></div>";
    return html;
  }

  function hasMicroDef(key) {
    return !!(key && microDefinitions[key]);
  }

  function hasLongevityDef(key) {
    return !!(key && longevityDefinitions[key]);
  }

  function sourcesModalTitleHtml(label, suffix, defKey, useMicroDef) {
    var defExists = useMicroDef ? hasMicroDef(defKey) : hasLongevityDef(defKey);
    var labelPart;
    if (defKey && defExists) {
      var attr = useMicroDef ? "data-micro-def" : "data-longevity-def";
      labelPart =
        '<button type="button" class="modal__title-link" ' +
        attr +
        '="' +
        escapeAttr(defKey) +
        '" aria-haspopup="dialog">' +
        escapeHtml(label) +
        "</button>";
    } else {
      labelPart = escapeHtml(label);
    }
    return labelPart + " — " + escapeHtml(suffix);
  }

  function handleSourcesModalTitleDefClick(e, titleEl, closeModal, getReturnTo) {
    var microBtn = e.target.closest("[data-micro-def]");
    var longevityBtn = e.target.closest("[data-longevity-def]");
    var btn = microBtn || longevityBtn;
    if (!btn || !titleEl || !titleEl.contains(btn)) return false;
    e.preventDefault();
    if (sourcesModalStackedOnDef) {
      closeModal();
      focusMicroDefModal();
      return true;
    }
    var returnTo = getReturnTo ? getReturnTo() : null;
    closeModal();
    if (microBtn) {
      openMicroDefModal(microBtn.getAttribute("data-micro-def"), returnTo);
    } else {
      openLongevityDefModal(longevityBtn.getAttribute("data-longevity-def"), returnTo);
    }
    return true;
  }

  function renderLongevitySourcesBody() {
    if (!longevitySourcesBodyEl || !activeLongevitySourcesKey) return;
    var label;
    var unit;
    if (activeLongevitySourcesKind === "micro") {
      var microField = microFieldByKey(activeLongevitySourcesKey);
      if (!microField) return;
      label = microField.label;
      unit = microField.unit;
    } else if (activeLongevitySourcesKind === "glycemicLoad") {
      label = "Glycemic load";
      unit = "GL";
    } else if (activeLongevitySourcesKind === "macro" && activeLongevitySourcesKey === "protein") {
      label = "Protein";
      unit = "g";
    } else {
      var longevityField = longevityFieldByKey(activeLongevitySourcesKey);
      if (!longevityField) return;
      label = longevityField.label;
      unit = longevityField.unit;
    }

    var html = longevitySourcesRequirementsHtml(
      activeLongevitySourcesKey,
      activeLongevitySourcesKind
    );
    var list;
    if (activeLongevitySourcesKind === "glycemicLoad") {
      list = glycemicLoadContributionsFromWeek();
    } else {
      list = longevityContributionsFromWeek(
        activeLongevitySourcesKey,
        activeLongevitySourcesKind
      );
    }

    if (!list.length) {
      html +=
        '<p class="micro-sources-modal__empty">No matched foods with ' +
        escapeHtml(label) +
        " data for this week.</p>";
      longevitySourcesBodyEl.innerHTML = html;
      return;
    }

    var displayList = prepareSourcesList(
      list,
      activeLongevitySourcesFilter,
      activeLongevitySourcesSort
    );
    if (!displayList.length) {
      html += sourcesFilterEmptyHtml(activeLongevitySourcesFilter);
      longevitySourcesBodyEl.innerHTML = html;
      return;
    }

    if (activeLongevitySourcesKind === "glycemicLoad") {
      html += glycemicLoadSourcesListHtml(displayList, activeLongevitySourcesSort);
    } else {
      html += nutrientSourcesListHtml(displayList, unit, activeLongevitySourcesSort);
    }
    longevitySourcesBodyEl.innerHTML = html;
  }

  function syncLongevitySourcesControls() {
    if (longevitySourcesFilterEl) longevitySourcesFilterEl.value = activeLongevitySourcesFilter;
  }

  function openLongevitySourcesModal(nutrientKey, kind, stackOnDef) {
    if (!longevitySourcesModalEl || !nutrientKey || !kind) return;
    var label;
    if (kind === "micro") {
      var microField = microFieldByKey(nutrientKey);
      if (!microField) return;
      label = microField.label;
    } else if (kind === "glycemicLoad") {
      label = "Avg daily glycemic load";
    } else if (kind === "macro" && nutrientKey === "protein") {
      label = "Protein";
    } else {
      var longevityField = longevityFieldByKey(nutrientKey);
      if (!longevityField) return;
      label = longevityField.label;
    }

    closeOtherModalsForSources({
      keepDefModal: !!stackOnDef,
      keepFormModals: !!stackOnDef && !!defModalStackedForm,
    });
    activeLongevitySourcesKey = nutrientKey;
    activeLongevitySourcesKind = kind;
    activeLongevitySourcesSort = defaultSourcesSortForKey("amount");
    activeLongevitySourcesFilter = "";
    syncLongevitySourcesControls();
    setLongevitySourcesFullscreen(false);
    if (longevitySourcesModalTitleEl) {
      longevitySourcesModalTitleEl.innerHTML = sourcesModalTitleHtml(
        label,
        "my food",
        nutrientKey,
        kind === "micro"
      );
    }
    if (longevitySourcesModalSubtitleEl) {
      longevitySourcesModalSubtitleEl.textContent =
        kind === "glycemicLoad"
          ? "Full week (Mon–Sun) — ranked by GL per serving; color by GI tier"
          : "Full week (Mon–Sun) — matched foods ranked by amount";
    }
    renderLongevitySourcesBody();
    setSourcesModalStackedOnDef(!!stackOnDef);
    longevitySourcesModalEl.hidden = false;
    updateBodyModalOpen();
    if (longevitySourcesModalDoneBtn) longevitySourcesModalDoneBtn.focus();
  }

  function closeLongevitySourcesModal() {
    if (!longevitySourcesModalEl) return;
    var stackedOnDef = sourcesModalStackedOnDef;
    activeLongevitySourcesKey = null;
    activeLongevitySourcesKind = null;
    activeLongevitySourcesSort = defaultSourcesSortForKey("amount");
    activeLongevitySourcesFilter = "";
    syncLongevitySourcesControls();
    setLongevitySourcesFullscreen(false);
    longevitySourcesModalEl.hidden = true;
    setSourcesModalStackedOnDef(false);
    updateBodyModalOpen();
    if (stackedOnDef && microDefModalEl && !microDefModalEl.hidden) {
      focusMicroDefModal();
    }
  }

  function foodSourcesNutrientMeta(key) {
    var micro = microDisplayFieldByKey(key) || microFieldByKey(key);
    if (micro) return { label: micro.label, unit: micro.unit || "" };
    var longevity = longevityFieldByKey(key);
    if (longevity) return { label: longevity.label, unit: longevity.unit || "" };
    return { label: longevityDefLabel(key), unit: "" };
  }

  function nutrientAmountFromKeyword(kw, key) {
    if (!kw) return null;
    if (key === "fiber") {
      var fiber = fiberTotalFromParts(kw.micros);
      return fiber > 0 ? fiber : null;
    }
    if (kw.micros && kw.micros[key] !== "" && kw.micros[key] != null) {
      var microVal = parseFloat(kw.micros[key]);
      if (!isNaN(microVal) && microVal > 0) return microVal;
    }
    var longevityVal = resolveLongevityValue(kw, key);
    if (longevityVal === "" || longevityVal == null || longevityVal === true) {
      return null;
    }
    var n = parseFloat(longevityVal);
    return isNaN(n) || n <= 0 ? null : n;
  }

  function isGenericSupplementFoodSource(label) {
    return /^supplements?\b/i.test(String(label || "").trim());
  }

  function mergeFoodSourcesCatalogEntry(target, source) {
    if (!target || !source) return target;
    if (!target.micros) target.micros = {};
    if (!source.micros) source.micros = {};
    if (!target.longevity) target.longevity = {};
    if (!source.longevity) source.longevity = {};
    Object.keys(source.micros).forEach(function (key) {
      var src = source.micros[key];
      var dst = target.micros[key];
      var srcNum = parseFloat(src);
      var dstNum = parseFloat(dst);
      if (
        src !== "" &&
        src != null &&
        !isNaN(srcNum) &&
        srcNum > 0 &&
        (dst === "" || dst == null || isNaN(dstNum) || dstNum <= 0)
      ) {
        target.micros[key] = src;
      }
    });
    Object.keys(source.longevity).forEach(function (key) {
      var src = source.longevity[key];
      var dst = target.longevity[key];
      if (src === true && (dst === "" || dst == null)) {
        target.longevity[key] = true;
        return;
      }
      var srcNum = parseFloat(src);
      var dstNum = parseFloat(dst);
      if (
        src !== "" &&
        src != null &&
        src !== true &&
        !isNaN(srcNum) &&
        srcNum > 0 &&
        (dst === "" ||
          dst == null ||
          dst === true ||
          isNaN(dstNum) ||
          dstNum <= 0)
      ) {
        target.longevity[key] = src;
      }
    });
    return target;
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
    var raw = normalizeFoodSourceFractions(sourceLabel || "");
    var extras = [];
    raw = raw.replace(/\(([^)]*)\)/g, function (_match, inner) {
      String(inner || "")
        .split(/\s*(?:&|\/|,|\band\b|\bor\b)\s*/i)
        .forEach(function (part) {
          extras.push(part);
        });
      return " ";
    });
    return raw
      .split(/\s*(?:&|\/|,|\band\b|\bor\b)\s*/i)
      .concat(extras)
      .map(function (part) {
        return normalizeFoodSourceFractions(part)
          .replace(/[^a-z0-9\s'-]/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();
      })
      .filter(function (token) {
        return token.length >= 3;
      });
  }

  var FOOD_SOURCE_TOKEN_ALIASES = {
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
    shrimp: ["prawns", "prawn"],
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
    shellfish: ["shrimp", "prawns", "prawn"],
    shrimp: ["shellfish", "prawns", "prawn"],
    "organ meats": ["liver", "organ meat"],
    "organ meat": ["liver", "organ meats"],
    "dairy fat": ["milk", "butter", "cheese"],
    "whole milk": ["milk whole"],
    "milk whole": ["whole milk"],
  };

  function expandFoodSourceTokenCandidates(token) {
    var out = [];
    var seen = {};
    function add(value) {
      var v = String(value || "")
        .trim()
        .toLowerCase();
      if (!v || seen[v]) return;
      seen[v] = true;
      out.push(v);
    }
    add(token);
    var aliases = FOOD_SOURCE_TOKEN_ALIASES[token];
    if (aliases) {
      aliases.forEach(add);
    }
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
    var n = normalizeFoodSourceFractions(name || "");
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
    var t = String(sourceLabel || "").toLowerCase();
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
    if (/\b(fish|salmon|chicken|beef|liver|turkey|tuna|sardines?|meat)\b/.test(t)) {
      return "3 oz";
    }
    if (/\b(bread|toast|slice)\b/.test(t)) return "1 slice";
    return "1 serving";
  }

  function withSuggestedFoodServing(foodName, sourceLabel) {
    var name = String(foodName || sourceLabel || "").trim();
    if (!name || foodNameHasServing(name)) return name;
    return name + " " + suggestedServingSuffix(sourceLabel || name);
  }

  function scoreFoodNameAgainstToken(foodName, token) {
    var name = normalizeFoodSourceFractions(foodName || "").toLowerCase();
    if (!name || !token) return 0;
    var candidates = expandFoodSourceTokenCandidates(token);
    var best = 0;
    candidates.forEach(function (candidate) {
      if (!candidate || name.indexOf(candidate) === -1) return;
      var stripped = name.replace(/^[a-z0-9][a-z0-9\s/&]*\s-\s/, "");
      function startsAsWholeToken(haystack) {
        if (haystack.indexOf(candidate) !== 0) return false;
        var after = haystack.charAt(candidate.length);
        return !after || /[^a-z0-9]/.test(after);
      }
      if (startsAsWholeToken(stripped) || startsAsWholeToken(name)) {
        best = Math.max(best, 100 + candidate.length);
        return;
      }
      var boundary = new RegExp(
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
    var n = String(foodName || "").toLowerCase();
    var label = String(sourceLabel || "").toLowerCase();
    var penalty = 0;
    if (
      /^(trifecta|jamba juice|supplement|junk food|starbucks|leaf wrapped|am shot)\b/.test(
        n
      )
    ) {
      penalty += score >= 100 ? 35 : 45;
    }
    // Keep "Beef & pork" from preferring liver when the source label is not organ meat.
    if (
      /\b(liver|gizzard|heart|kidney|offal)\b/.test(n) &&
      label &&
      !/\b(liver|organ|offal|gizzard|heart|kidney)\b/.test(label)
    ) {
      penalty += 50;
    }
    var words = n.split(/\s+/).filter(Boolean);
    if (words.length >= 6) penalty += 25;
    return penalty;
  }

  function findFoodDefinitionForSourcePass(sourceLabel, nutrientKey, requireAmount) {
    var tokens = foodSourceMatchTokens(sourceLabel);
    if (!tokens.length) return null;
    var catalog = foodSourcesMatchCatalog();
    if (!catalog.length) return null;
    var best = null;
    var minScore = requireAmount ? 40 : 50;

    catalog.forEach(function (kw) {
      var name = (kw.name || "").trim();
      if (!name) return;
      var score = 0;
      tokens.forEach(function (token) {
        score = Math.max(score, scoreFoodNameAgainstToken(name, token));
      });
      var adjusted = score - foodSourcesMatchPenalty(name, score, sourceLabel);
      if (adjusted < minScore) return;
      var amount = nutrientAmountFromKeyword(kw, nutrientKey);
      var amountNum = amount == null ? -1 : amount;
      var hasAmount = amountNum > 0 ? 1 : 0;
      if (requireAmount && !hasAmount) return;
      var hasServing = foodNameHasServing(name) ? 1 : 0;
      var multiplierPenalty = /\bx\s*\d+\b/i.test(name) ? 1 : 0;
      var sourceRank = kw._foodSourcesFromSample ? 1 : 0;
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
          sourceRank < best.sourceRank) ||
        (hasAmount === best.hasAmount &&
          adjusted === best.score &&
          hasServing === best.hasServing &&
          multiplierPenalty === best.multiplierPenalty &&
          sourceRank === best.sourceRank &&
          amountNum > best.amount)
      ) {
        best = {
          name: name,
          amount: amountNum,
          score: adjusted,
          hasAmount: hasAmount,
          hasServing: hasServing,
          multiplierPenalty: multiplierPenalty,
          sourceRank: sourceRank,
        };
      }
    });
    return best;
  }

  function findFoodDefinitionForSource(sourceLabel, nutrientKey) {
    var withAmount = findFoodDefinitionForSourcePass(sourceLabel, nutrientKey, true);
    if (withAmount) return withAmount;
    return findFoodDefinitionForSourcePass(sourceLabel, nutrientKey, false);
  }

  function normalizeFoodSourcesCatalogItem(item, fromSample) {
    if (!item || typeof item !== "object") return null;
    var micros = normalizeMicros(item.micros);
    var longevity = normalizeLongevity(item.longevity, micros);
    longevity = mergeCarbQualityIntoLongevity(longevity, item.carbQuality);
    syncSharedMicroLongevity(micros, longevity);
    return {
      name: typeof item.name === "string" ? item.name : "",
      micros: micros,
      longevity: longevity,
      _foodSourcesFromSample: !!fromSample,
    };
  }

  function foodSourcesMatchCatalog() {
    var byName = {};
    var catalog = [];
    function addItem(kw, fromSample) {
      var name = (kw && kw.name ? String(kw.name) : "").trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (byName[key]) {
        if (fromSample) mergeFoodSourcesCatalogEntry(byName[key], kw);
        return;
      }
      var entry = fromSample
        ? kw
        : {
            name: name,
            micros: Object.assign({}, kw.micros || {}),
            longevity: Object.assign({}, kw.longevity || {}),
            _foodSourcesFromSample: false,
          };
      byName[key] = entry;
      catalog.push(entry);
    }
    keywords.forEach(function (kw) {
      addItem(kw, false);
    });
    (foodSourcesSampleCatalog || []).forEach(function (kw) {
      addItem(kw, true);
    });
    return catalog;
  }

  function ensureFoodSourcesSampleCatalog(done) {
    if (foodSourcesSampleCatalog) {
      if (done) done();
      return;
    }
    if (foodSourcesSampleCatalogPromise) {
      foodSourcesSampleCatalogPromise.then(
        function () {
          if (done) done();
        },
        function () {
          if (done) done();
        }
      );
      return;
    }
    foodSourcesSampleCatalogPromise = fetch(IMPORT_SAMPLE_FOODS_URL, {
      cache: "no-store",
    })
      .then(function (res) {
        if (!res.ok) throw new Error("sample foods fetch failed");
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : [];
        foodSourcesSampleCatalog = list
          .map(function (item) {
            return normalizeFoodSourcesCatalogItem(item, true);
          })
          .filter(function (item) {
            return item && item.name;
          });
        invalidateFoodSourcesRowsCache();
      })
      .catch(function () {
        foodSourcesSampleCatalog = [];
      })
      .then(function () {
        foodSourcesSampleCatalogPromise = null;
        if (done) done();
      });
  }

  function collectDefinitionFoodSourceLabels(def) {
    var labels = [];
    if (!def) return labels;
    if (def.foodSourceGroups && def.foodSourceGroups.length) {
      def.foodSourceGroups.forEach(function (group) {
        (group.items || []).forEach(function (item) {
          if (item && !isGenericSupplementFoodSource(item)) labels.push(item);
        });
      });
    } else if (def.foodSources && def.foodSources.length) {
      def.foodSources.forEach(function (item) {
        if (item && !isGenericSupplementFoodSource(item)) labels.push(item);
      });
    }
    return labels;
  }

  function buildFoodSourcesRows() {
    var rows = [];
    var seen = {};
    var nutrientKeys = {};
    MICRO_ALL_FIELDS.forEach(function (field) {
      nutrientKeys[field.key] = true;
    });
    LONGEVITY_FIELDS.forEach(function (field) {
      nutrientKeys[field.key] = true;
    });

    function addRowsForKey(key, def) {
      if (!nutrientKeys[key]) return;
      var meta = foodSourcesNutrientMeta(key);
      collectDefinitionFoodSourceLabels(def).forEach(function (sourceLabel) {
        var dedupeKey = key + "\0" + sourceLabel.toLowerCase();
        if (seen[dedupeKey]) return;
        seen[dedupeKey] = true;
        var match = findFoodDefinitionForSource(sourceLabel, key);
        var foodName = match && match.name ? match.name : sourceLabel;
        var amount =
          match && match.amount != null && match.amount > 0 ? match.amount : null;

        // Prefer a definition that includes this nutrient's amount whenever one exists.
        if (amount == null) {
          var amountMatch = findFoodDefinitionForSourcePass(
            sourceLabel,
            key,
            true
          );
          if (amountMatch && amountMatch.amount > 0) {
            match = amountMatch;
            foodName = amountMatch.name;
            amount = amountMatch.amount;
          }
        }

        // If still no clear 1-serving label, attach a typical serving.
        if (meta.label && !foodNameHasServing(foodName)) {
          foodName = withSuggestedFoodServing(foodName, sourceLabel);
        }

        var nutrientText = meta.label;
        if (amount != null && meta.unit) {
          nutrientText += " " + fmtFoodSourcesAmount(amount) + " " + meta.unit;
        } else if (amount != null) {
          nutrientText += " " + fmtFoodSourcesAmount(amount);
        }
        rows.push({
          food: foodName,
          sourceLabel: sourceLabel,
          nutrientKey: key,
          nutrientLabel: meta.label,
          nutrientText: nutrientText,
          amount: amount,
          unit: meta.unit || "",
          matched: !!(match && match.name),
        });
      });
    }

    Object.keys(microDefinitions).forEach(function (key) {
      addRowsForKey(key, microDefinitions[key]);
    });
    Object.keys(longevityDefinitions).forEach(function (key) {
      addRowsForKey(key, longevityDefinitions[key]);
    });
    return rows;
  }

  function getFoodSourcesRows() {
    if (!foodSourcesRowsCache) {
      if (foodSourcesPrecomputedRows && foodSourcesPrecomputedRows.length) {
        foodSourcesRowsCache = foodSourcesPrecomputedRows.slice();
      } else {
        foodSourcesRowsCache = buildFoodSourcesRows();
      }
    }
    return foodSourcesRowsCache;
  }

  function invalidateFoodSourcesRowsCache() {
    foodSourcesRowsCache = null;
  }

  function normalizePrecomputedFoodSourcesRows(data) {
    var list = [];
    if (data && Array.isArray(data.rows)) list = data.rows;
    else if (Array.isArray(data)) list = data;
    var out = [];
    list.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var food = typeof row.food === "string" ? row.food.trim() : "";
      var sourceLabel =
        typeof row.sourceLabel === "string" ? row.sourceLabel.trim() : "";
      var nutrientKey =
        typeof row.nutrientKey === "string" ? row.nutrientKey.trim() : "";
      var nutrientLabel =
        typeof row.nutrientLabel === "string" ? row.nutrientLabel.trim() : "";
      if (!food || !nutrientKey) return;
      var amount = null;
      if (row.amount != null && row.amount !== "") {
        var n = parseFloat(row.amount);
        if (!isNaN(n) && n > 0) amount = n;
      }
      var unit = typeof row.unit === "string" ? row.unit : "";
      var nutrientText =
        typeof row.nutrientText === "string" && row.nutrientText.trim()
          ? row.nutrientText.trim()
          : nutrientLabel || nutrientKey;
      out.push({
        food: food,
        sourceLabel: sourceLabel || food,
        nutrientKey: nutrientKey,
        nutrientLabel: nutrientLabel || nutrientKey,
        nutrientText: nutrientText,
        amount: amount,
        unit: unit,
        matched: row.matched !== false && !!food,
      });
    });
    return out;
  }

  function loadFoodSourcesPrecomputed(done) {
    fetch(FOOD_SOURCES_PRECOMPUTED_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("food sources precompute fetch failed");
        return res.json();
      })
      .then(function (data) {
        foodSourcesPrecomputedRows = normalizePrecomputedFoodSourcesRows(data);
        invalidateFoodSourcesRowsCache();
        if (done) done();
      })
      .catch(function () {
        foodSourcesPrecomputedRows = null;
        invalidateFoodSourcesRowsCache();
        if (done) done();
      });
  }

  function normalizeFoodSourcesSortKey(key) {
    if (key === "food" || key === "nutrient" || key === "amount") return key;
    return "nutrient";
  }

  function defaultFoodSourcesSortForKey(key) {
    var sortKey = normalizeFoodSourcesSortKey(key);
    if (sortKey === "amount") return { key: "amount", dir: "desc" };
    return { key: sortKey, dir: "asc" };
  }

  function nextFoodSourcesSort(current, nextKey) {
    var key = normalizeFoodSourcesSortKey(nextKey);
    if (current && current.key === key) {
      return { key: key, dir: current.dir === "asc" ? "desc" : "asc" };
    }
    return defaultFoodSourcesSortForKey(key);
  }

  function compareFoodSourcesRows(a, b, sort) {
    var dir = sort && sort.dir === "desc" ? -1 : 1;
    var key = normalizeFoodSourcesSortKey(sort && sort.key);
    function cmpStr(left, right) {
      return String(left || "").localeCompare(String(right || ""), undefined, {
        sensitivity: "base",
      });
    }
    var primary = 0;
    if (key === "food") {
      primary = cmpStr(a.food, b.food);
    } else if (key === "amount") {
      var aAmt = a.amount == null ? -1 : a.amount;
      var bAmt = b.amount == null ? -1 : b.amount;
      primary = aAmt === bAmt ? 0 : aAmt < bAmt ? -1 : 1;
    } else {
      primary = cmpStr(a.nutrientLabel, b.nutrientLabel);
      if (!primary) {
        var aN = a.amount == null ? -1 : a.amount;
        var bN = b.amount == null ? -1 : b.amount;
        primary = aN === bN ? 0 : aN < bN ? -1 : 1;
      }
    }
    if (primary) return primary * dir;
    var foodTie = cmpStr(a.food, b.food);
    if (foodTie) return foodTie;
    return cmpStr(a.nutrientText, b.nutrientText);
  }

  function foodSourcesNutrientHasDef(key) {
    if (!key) return false;
    if (microDisplayFieldByKey(key)) return true;
    if (longevityDefinitions[key]) return true;
    if (longevityFieldByKey(key)) return true;
    if (LONGEVITY_DERIVED_DEFS[key]) return true;
    if (LONGEVITY_SECTION_DEFS[key]) return true;
    return false;
  }

  function foodSourcesReturnState() {
    return {
      kind: "food",
      sort: activeFoodSourcesSort,
      filter: activeFoodSourcesFilter,
      fullscreen: foodSourcesFullscreen,
    };
  }

  function foodSourcesDefBackLabel(state) {
    if (!state) return "← Nutrient";
    if (state.microKey) {
      var field = microDisplayFieldByKey(state.microKey);
      return "← " + (field ? field.label : "Nutrient");
    }
    if (state.longevityKey) {
      return "← " + longevityDefLabel(state.longevityKey);
    }
    return "← Nutrient";
  }

  function syncFoodSourcesBackBtn() {
    if (!foodSourcesModalBackBtn) return;
    var on = !!foodSourcesReturnDefModal;
    foodSourcesModalBackBtn.hidden = !on;
    if (on) {
      foodSourcesModalBackBtn.textContent = foodSourcesDefBackLabel(
        foodSourcesReturnDefModal
      );
    }
    if (foodSourcesModalFooterEl) {
      foodSourcesModalFooterEl.classList.toggle("modal__footer--split", on);
    }
  }

  function clearFoodSourcesReturnDefModal() {
    foodSourcesReturnDefModal = null;
    syncFoodSourcesBackBtn();
  }

  function returnFromFoodSourcesToDefModal() {
    if (!foodSourcesReturnDefModal) return;
    var state = foodSourcesReturnDefModal;
    clearFoodSourcesReturnDefModal();

    var returnTo = state.returnTo;
    var stackOnForm = state.fromFoodSources ? "foodSources" : null;

    if (state.fromFoodSources && returnTo && returnTo.kind === "food") {
      activeFoodSourcesSort =
        returnTo.sort || defaultFoodSourcesSortForKey("nutrient");
      activeFoodSourcesFilter = returnTo.filter || "";
      setFoodSourcesFullscreen(!!returnTo.fullscreen);
      syncFoodSourcesControls();
      renderFoodSourcesBody();
      if (foodSourcesModalEl && foodSourcesModalEl.hidden) {
        foodSourcesModalEl.hidden = false;
        updateBodyModalOpen();
      }
    } else if (foodSourcesModalEl) {
      foodSourcesModalEl.hidden = true;
      activeFoodSourcesSort = defaultFoodSourcesSortForKey("nutrient");
      activeFoodSourcesFilter = "";
      setFoodSourcesFullscreen(false);
      syncFoodSourcesControls();
      updateBodyModalOpen();
    }

    if (state.microKey) {
      openMicroDefModal(state.microKey, returnTo, stackOnForm);
    } else if (state.longevityKey) {
      openLongevityDefModal(state.longevityKey, returnTo, stackOnForm);
    }
  }

  function foodSourcesDefIconHtml(nutrientKey, nutrientLabel) {
    if (!foodSourcesNutrientHasDef(nutrientKey)) return "";
    var label = nutrientLabel || nutrientKey;
    return (
      '<button type="button" class="food-sources-modal__info-btn" data-food-sources-def="' +
      escapeAttr(nutrientKey) +
      '" aria-label="About ' +
      escapeAttr(label) +
      '" title="About ' +
      escapeAttr(label) +
      '">' +
      '<svg class="food-sources-modal__info-icon" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">' +
      '<circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.2"></circle>' +
      '<path d="M8 7.1v4.4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"></path>' +
      '<circle cx="8" cy="4.75" r="0.7" fill="currentColor"></circle>' +
      "</svg></button>"
    );
  }

  function openFoodSourcesNutrientDef(key) {
    if (!key || !foodSourcesModalEl || foodSourcesModalEl.hidden) return;
    if (!foodSourcesNutrientHasDef(key)) return;
    clearFoodSourcesReturnDefModal();
    if (microDisplayFieldByKey(key)) {
      openMicroDefModal(key, foodSourcesReturnState(), "foodSources");
    } else {
      openLongevityDefModal(key, foodSourcesReturnState(), "foodSources");
    }
  }

  function foodSourcesSortHeaderHtml(sort) {
    function sortBtn(key, label, extraClass) {
      var active = sort && sort.key === key;
      var sortDir = active ? sort.dir : null;
      var arrow = active ? (sortDir === "asc" ? " ▲" : " ▼") : "";
      var title;
      if (key === "food") {
        title = active
          ? sortDir === "asc"
            ? "Sorted A–Z — click for Z–A"
            : "Sorted Z–A — click for A–Z"
          : "Sort by food";
      } else {
        title = active
          ? sortDir === "asc"
            ? "Sorted A–Z — click for Z–A"
            : "Sorted Z–A — click for A–Z"
          : "Sort by nutrient";
      }
      return (
        '<button type="button" class="food-sources-modal__sort-btn ' +
        extraClass +
        (active ? " is-active" : "") +
        '" data-food-sources-sort="' +
        key +
        '" aria-pressed="' +
        (active ? "true" : "false") +
        '" aria-sort="' +
        (active ? (sortDir === "asc" ? "ascending" : "descending") : "none") +
        '" title="' +
        escapeAttr(title) +
        '">' +
        escapeHtml(label) +
        '<span class="food-sources-modal__sort-arrow" aria-hidden="true">' +
        escapeHtml(arrow) +
        "</span></button>"
      );
    }
    return (
      "<thead><tr>" +
      '<th scope="col">' +
      sortBtn("food", "Food (1 serving)", "food-sources-modal__sort-btn--food") +
      "</th>" +
      '<th scope="col">' +
      sortBtn(
        "nutrient",
        "Nutrient",
        "food-sources-modal__sort-btn--nutrient"
      ) +
      "</th>" +
      '<th scope="col" class="food-sources-modal__info-col"><span class="visually-hidden">About nutrient</span></th>' +
      "</tr></thead>"
    );
  }

  function foodSourcesFilterTerms(filterText) {
    var raw = String(filterText || "")
      .trim()
      .toLowerCase();
    if (!raw) return [];
    // "spinach and kale", "spinach & kale", "spinach or kale" → multi-food search
    if (!/\s+(?:and|or)\s+|\s*&\s*/i.test(raw)) return [raw];
    return raw
      .split(/\s+(?:and|or)\s+|\s*&\s*/i)
      .map(function (term) {
        return term.trim();
      })
      .filter(Boolean);
  }

  function foodSourcesRowMatchesFilter(row, terms) {
    if (!terms || !terms.length) return true;
    var haystack =
      String(row.food || "").toLowerCase() +
      "\n" +
      String(row.sourceLabel || "").toLowerCase() +
      "\n" +
      String(row.nutrientText || "").toLowerCase() +
      "\n" +
      String(row.nutrientLabel || "").toLowerCase();
    for (var i = 0; i < terms.length; i++) {
      if (haystack.indexOf(terms[i]) !== -1) return true;
    }
    return false;
  }

  function renderFoodSourcesBody() {
    if (!foodSourcesBodyEl) return;
    var rows = getFoodSourcesRows().slice();
    var filter = String(activeFoodSourcesFilter || "").trim();
    var terms = foodSourcesFilterTerms(filter);
    if (terms.length) {
      rows = rows.filter(function (row) {
        return foodSourcesRowMatchesFilter(row, terms);
      });
    }
    rows.sort(function (a, b) {
      return compareFoodSourcesRows(a, b, activeFoodSourcesSort);
    });

    if (!rows.length) {
      foodSourcesBodyEl.innerHTML =
        '<p class="food-sources-modal__empty">' +
        (filter
          ? 'No foods matching "' + escapeHtml(activeFoodSourcesFilter) + '".'
          : "No food sources found in nutrient modals yet.") +
        "</p>";
      return;
    }

    var html =
      '<table class="food-sources-modal__table">' +
      foodSourcesSortHeaderHtml(activeFoodSourcesSort) +
      "<tbody>";
    rows.forEach(function (row) {
      html +=
        '<tr class="food-sources-modal__row' +
        (row.matched ? "" : " food-sources-modal__row--unmatched") +
        '">' +
        '<td class="food-sources-modal__food">' +
        escapeHtml(row.food) +
        "</td>" +
        '<td class="food-sources-modal__nutrient">' +
        escapeHtml(row.nutrientText) +
        "</td>" +
        '<td class="food-sources-modal__info-col">' +
        foodSourcesDefIconHtml(row.nutrientKey, row.nutrientLabel) +
        "</td>" +
        "</tr>";
    });
    html +=
      "</tbody></table>" +
      '<p class="food-sources-modal__count">' +
      rows.length +
      " source" +
      (rows.length === 1 ? "" : "s") +
      "</p>";
    foodSourcesBodyEl.innerHTML = html;
  }

  function syncFoodSourcesControls() {
    if (foodSourcesFilterEl) foodSourcesFilterEl.value = activeFoodSourcesFilter;
  }

  function setFoodSourcesFullscreen(on) {
    foodSourcesFullscreen = !!on;
    if (foodSourcesModalEl) {
      foodSourcesModalEl.classList.toggle("modal--fullscreen", foodSourcesFullscreen);
    }
    updateSourcesFullscreenToggle(foodSourcesFullscreenToggleBtn, foodSourcesFullscreen);
  }

  function openFoodSourcesModal() {
    if (!foodSourcesModalEl) return;
    closeOtherModalsForSources();
    clearFoodSourcesReturnDefModal();
    activeFoodSourcesSort = defaultFoodSourcesSortForKey("nutrient");
    activeFoodSourcesFilter = "";
    setFoodSourcesFullscreen(false);
    syncFoodSourcesControls();
    foodSourcesModalEl.hidden = false;
    updateBodyModalOpen();
    if (foodSourcesFilterEl) foodSourcesFilterEl.focus();

    // Prefer precomputed grocery list (definitions-food-sources.json) for instant open.
    if (foodSourcesPrecomputedRows && foodSourcesPrecomputedRows.length) {
      renderFoodSourcesBody();
      return;
    }

    // Fallback: live match against sample foods (slower).
    invalidateFoodSourcesRowsCache();
    ensureFoodSourcesSampleCatalog(function () {
      invalidateFoodSourcesRowsCache();
      renderFoodSourcesBody();
    });
    renderFoodSourcesBody();
  }

  function openFoodSourcesFromDefFoodSource(filter) {
    if (!foodSourcesModalEl) return;
    var foodFilter = String(filter || "").trim();
    if (!foodFilter) return;

    var microKey = activeMicroDefKey;
    var longevityKey = activeLongevityDefKey;
    if (!microKey && !longevityKey) return;

    var foodSourcesWasOpen = !foodSourcesModalEl.hidden;
    if (!foodSourcesWasOpen) {
      closeOtherModalsForSources({ keepDefModal: true });
    }

    foodSourcesReturnDefModal = {
      microKey: microKey,
      longevityKey: longevityKey,
      returnTo: defModalReturnSources,
      fromFoodSources: foodSourcesWasOpen,
    };
    syncFoodSourcesBackBtn();

    activeMicroDefKey = null;
    activeLongevityDefKey = null;
    setMicroDefFullscreen(false);
    if (microDefModalEl) microDefModalEl.hidden = true;
    setDefModalReturnSources(null);
    setDefModalStackedForm(null);
    if (microDefModalSourcesBtn) microDefModalSourcesBtn.hidden = true;
    setFoodSourcesStackedOnDef(false);

    activeFoodSourcesFilter = foodFilter;
    syncFoodSourcesControls();

    if (!foodSourcesWasOpen) {
      activeFoodSourcesSort = defaultFoodSourcesSortForKey("nutrient");
      setFoodSourcesFullscreen(false);
      foodSourcesModalEl.hidden = false;
      if (foodSourcesPrecomputedRows && foodSourcesPrecomputedRows.length) {
        renderFoodSourcesBody();
      } else {
        invalidateFoodSourcesRowsCache();
        ensureFoodSourcesSampleCatalog(function () {
          invalidateFoodSourcesRowsCache();
          renderFoodSourcesBody();
        });
        renderFoodSourcesBody();
      }
    } else {
      renderFoodSourcesBody();
    }

    updateBodyModalOpen();
    if (foodSourcesFilterEl) foodSourcesFilterEl.focus();
  }

  function closeFoodSourcesModal() {
    if (!foodSourcesModalEl) return;
    if (foodSourcesStackedOnDef && microDefModalEl && !microDefModalEl.hidden) {
      closeMicroDefModal();
    }
    clearFoodSourcesReturnDefModal();
    setFoodSourcesStackedOnDef(false);
    activeFoodSourcesSort = defaultFoodSourcesSortForKey("nutrient");
    activeFoodSourcesFilter = "";
    syncFoodSourcesControls();
    setFoodSourcesFullscreen(false);
    foodSourcesModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function longevitySourcesIconHtml(nutrientKey, kind) {
    return (
      '<button type="button" class="dashboard__micro-sources-btn" data-longevity-sources="' +
      escapeAttr(nutrientKey) +
      '" data-longevity-sources-kind="' +
      escapeAttr(kind) +
      '" aria-label="Show my food ranked by amount" title="My food">' +
      '<svg class="dashboard__micro-sources-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<rect x="1" y="8" width="3" height="7" rx="0.5"></rect>' +
      '<rect x="6.5" y="4" width="3" height="11" rx="0.5"></rect>' +
      '<rect x="12" y="1" width="3" height="14" rx="0.5"></rect>' +
      "</svg></button>"
    );
  }

  function populateMicroSourcesScopeSelect(selectedScope) {
    if (!microSourcesScopeEl) return;
    var html =
      '<option value="week"' +
      (selectedScope === "week" ? " selected" : "") +
      ">Full week (Mon–Sun)</option>";
    DAYS.forEach(function (day) {
      html +=
        '<option value="' +
        escapeAttr(day.id) +
        '"' +
        (selectedScope === day.id ? " selected" : "") +
        ">" +
        escapeHtml(day.label) +
        "</option>";
    });
    microSourcesScopeEl.innerHTML = html;
  }

  function renderMicroSourcesBody() {
    if (!microSourcesBodyEl || !activeMicroSourcesKey) return;
    var field = microFieldByKey(activeMicroSourcesKey);
    if (!field) return;

    var html = microSourcesRequirementsHtml(field);
    var list = microContributionsForScope(activeMicroSourcesKey, activeMicroSourcesScope);

    if (!list.length) {
      html +=
        '<p class="micro-sources-modal__empty">No matched foods with ' +
        escapeHtml(field.label) +
        " data for this period.</p>";
      microSourcesBodyEl.innerHTML = html;
      return;
    }

    var displayList = prepareSourcesList(
      list,
      activeMicroSourcesFilter,
      activeMicroSourcesSort
    );
    if (!displayList.length) {
      html += sourcesFilterEmptyHtml(activeMicroSourcesFilter);
      microSourcesBodyEl.innerHTML = html;
      return;
    }

    html += nutrientSourcesListHtml(displayList, field.unit, activeMicroSourcesSort);
    microSourcesBodyEl.innerHTML = html;
  }

  function syncMicroSourcesControls() {
    if (microSourcesFilterEl) microSourcesFilterEl.value = activeMicroSourcesFilter;
  }

  function openMicroSourcesModal(microKey, scope, stackOnDef) {
    if (!microSourcesModalEl || !microKey) return;
    var field = microFieldByKey(microKey);
    if (!field) return;

    closeOtherModalsForSources({
      keepDefModal: !!stackOnDef,
      keepFormModals: !!stackOnDef && !!defModalStackedForm,
    });
    activeMicroSourcesKey = microKey;
    activeMicroSourcesScope = scope || "week";
    activeMicroSourcesSort = defaultSourcesSortForKey("amount");
    activeMicroSourcesFilter = "";
    setMicroSourcesFullscreen(false);
    populateMicroSourcesScopeSelect(activeMicroSourcesScope);
    syncMicroSourcesControls();
    if (microSourcesModalTitleEl) {
      microSourcesModalTitleEl.innerHTML = sourcesModalTitleHtml(
        field.label,
        "my food",
        microKey,
        true
      );
    }
    renderMicroSourcesBody();
    setSourcesModalStackedOnDef(!!stackOnDef);
    microSourcesModalEl.hidden = false;
    updateBodyModalOpen();
    if (microSourcesScopeEl) microSourcesScopeEl.focus();
  }

  function closeMicroSourcesModal() {
    if (!microSourcesModalEl) return;
    var stackedOnDef = sourcesModalStackedOnDef;
    activeMicroSourcesKey = null;
    activeMicroSourcesScope = "week";
    activeMicroSourcesSort = defaultSourcesSortForKey("amount");
    activeMicroSourcesFilter = "";
    syncMicroSourcesControls();
    setMicroSourcesFullscreen(false);
    microSourcesModalEl.hidden = true;
    setSourcesModalStackedOnDef(false);
    updateBodyModalOpen();
    if (stackedOnDef && microDefModalEl && !microDefModalEl.hidden) {
      focusMicroDefModal();
    }
  }

  function microSourcesIconHtml(microKey, defaultDayId) {
    var dayAttr = defaultDayId
      ? ' data-micro-sources-day="' + escapeAttr(defaultDayId) + '"'
      : "";
    return (
      '<button type="button" class="dashboard__micro-sources-btn" data-micro-sources="' +
      escapeAttr(microKey) +
      '"' +
      dayAttr +
      ' aria-label="Show my food ranked by amount" title="My food">' +
      '<svg class="dashboard__micro-sources-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<rect x="1" y="8" width="3" height="7" rx="0.5"></rect>' +
      '<rect x="6.5" y="4" width="3" height="11" rx="0.5"></rect>' +
      '<rect x="12" y="1" width="3" height="14" rx="0.5"></rect>' +
      "</svg></button>"
    );
  }

  function microDailyIntakeIconHtml() {
    return (
      '<button type="button" class="dashboard__micro-daily-intake-btn" data-micro-daily-intake="1" ' +
      'aria-label="Requires daily intake" aria-expanded="false" aria-controls="micro-daily-intake-popover">' +
      '<svg class="dashboard__micro-daily-intake-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<rect x="2" y="3.5" width="12" height="10.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"></rect>' +
      '<path d="M2 6.75h12" fill="none" stroke="currentColor" stroke-width="1.4"></path>' +
      '<path d="M5 2.2v2.6M11 2.2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path>' +
      '<rect x="4.25" y="8.5" width="2.5" height="2.5" rx="0.4" fill="currentColor"></rect>' +
      "</svg></button>"
    );
  }

  function appendMicroDailyIntakeIconHtml(html, microKey) {
    if (microRequiresDailyIntake(microKey)) {
      html += microDailyIntakeIconHtml();
    }
    return html + microAcuteToxicityIconsHtml(microKey);
  }

  function microAcuteToxicityEntry(microKey) {
    return ACUTE_TOXICITY_BY_MICRO[microKey] || null;
  }

  function microAcuteToxicityEffects(entry, kind) {
    if (!entry) return [];
    if (kind === "adverse") {
      return Array.isArray(entry.adverseEffects) ? entry.adverseEffects : [];
    }
    return Array.isArray(entry.sideEffects) ? entry.sideEffects : [];
  }

  function microAcuteToxicityIconHtml(microKey, kind) {
    var isAdverse = kind === "adverse";
    var badge = isAdverse ? "A/E" : "S/E";
    var label = isAdverse
      ? "Adverse effects of acute excess"
      : "Side effects of acute excess";
    var kindClass = isAdverse
      ? "dashboard__micro-acute-btn--adverse"
      : "dashboard__micro-acute-btn--side";
    return (
      '<button type="button" class="dashboard__micro-acute-btn ' +
      kindClass +
      '" data-micro-acute="' +
      escapeAttr(kind) +
      '" data-micro-acute-key="' +
      escapeAttr(microKey) +
      '" aria-label="' +
      escapeAttr(label) +
      '" aria-expanded="false" aria-controls="micro-acute-toxicity-popover" title="' +
      escapeAttr(label) +
      '">' +
      '<svg class="dashboard__micro-acute-icon" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M8 1.5 1.25 14h13.5L8 1.5zm0 3.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.5A.75.75 0 0 1 8 4.75zM8 12a.875.875 0 1 0 0-1.75A.875.875 0 0 0 8 12z"></path>' +
      "</svg>" +
      '<span class="dashboard__micro-acute-badge" aria-hidden="true">' +
      badge +
      "</span></button>"
    );
  }

  function microAcuteToxicityIconsHtml(microKey) {
    var entry = microAcuteToxicityEntry(microKey);
    if (!entry) return "";
    var html = "";
    if (microAcuteToxicityEffects(entry, "side").length) {
      html += microAcuteToxicityIconHtml(microKey, "side");
    }
    if (microAcuteToxicityEffects(entry, "adverse").length) {
      html += microAcuteToxicityIconHtml(microKey, "adverse");
    }
    return html;
  }

  function positionFixedPopoverBelow(popoverEl, anchor) {
    if (!popoverEl || !anchor) return;
    var rect = anchor.getBoundingClientRect();
    var margin = 8;
    var width = popoverEl.offsetWidth;
    var left = rect.left;
    if (width > 0) {
      left = Math.min(left, window.innerWidth - width - margin);
    }
    left = Math.max(margin, left);
    popoverEl.style.left = left + "px";
    popoverEl.style.top = rect.bottom + 6 + "px";
  }

  function positionMicroAcuteToxicityPopover(anchor) {
    positionFixedPopoverBelow(microAcuteToxicityPopoverEl, anchor);
  }

  function hideMicroAcuteToxicityPopover() {
    if (!microAcuteToxicityPopoverEl) return;
    microAcuteToxicityPopoverEl.hidden = true;
    if (microAcuteToxicityPopoverAnchor) {
      microAcuteToxicityPopoverAnchor.setAttribute("aria-expanded", "false");
      microAcuteToxicityPopoverAnchor = null;
    }
  }

  function showMicroAcuteToxicityPopover(btn) {
    if (
      !microAcuteToxicityPopoverEl ||
      !microAcuteToxicityPopoverTextEl ||
      !btn
    ) {
      return;
    }
    if (
      microAcuteToxicityPopoverAnchor === btn &&
      !microAcuteToxicityPopoverEl.hidden
    ) {
      hideMicroAcuteToxicityPopover();
      return;
    }
    var kind = btn.getAttribute("data-micro-acute") || "side";
    if (kind === "adverse" && !showAcuteAdverseEffects) return;
    if (kind !== "adverse" && !showAcuteSideEffects) return;
    var microKey = btn.getAttribute("data-micro-acute-key") || "";
    var entry = microAcuteToxicityEntry(microKey);
    var effects = microAcuteToxicityEffects(entry, kind);
    if (!effects.length) return;
    var isAdverse = kind === "adverse";
    var heading = isAdverse ? "Adverse effects" : "Side effects";
    var lead = isAdverse
      ? "Serious outcomes from a single-day excess (often supplements):"
      : "Uncomfortable reactions from a single-day excess (often supplements):";
    hideMicroAcuteToxicityPopover();
    hideMicroDailyIntakePopover();
    microAcuteToxicityPopoverTextEl.innerHTML =
      '<p class="dashboard__micro-acute-popover-heading">' +
      escapeHtml(heading) +
      "</p>" +
      '<p class="dashboard__micro-acute-popover-lead">' +
      escapeHtml(lead) +
      "</p>" +
      '<p class="dashboard__micro-acute-popover-effects">' +
      escapeHtml(effects.join(" · ")) +
      "</p>";
    microAcuteToxicityPopoverAnchor = btn;
    microAcuteToxicityPopoverEl.hidden = false;
    positionMicroAcuteToxicityPopover(btn);
    btn.setAttribute("aria-expanded", "true");
  }

  function handleMicroAcuteToxicityClick(e) {
    var btn = e.target.closest("[data-micro-acute]");
    if (!btn) return false;
    e.preventDefault();
    e.stopPropagation();
    showMicroAcuteToxicityPopover(btn);
    return true;
  }

  function positionMicroDailyIntakePopover(anchor) {
    positionFixedPopoverBelow(microDailyIntakePopoverEl, anchor);
  }

  function hideMicroDailyIntakePopover() {
    if (!microDailyIntakePopoverEl) return;
    microDailyIntakePopoverEl.hidden = true;
    if (microDailyIntakePopoverAnchor) {
      microDailyIntakePopoverAnchor.setAttribute("aria-expanded", "false");
      microDailyIntakePopoverAnchor = null;
    }
  }

  function showMicroDailyIntakePopover(btn) {
    if (!microDailyIntakePopoverEl || !btn) return;
    if (!showDailyIntakeIcons) return;
    if (microDailyIntakePopoverAnchor === btn && !microDailyIntakePopoverEl.hidden) {
      hideMicroDailyIntakePopover();
      return;
    }
    hideMicroDailyIntakePopover();
    hideMicroAcuteToxicityPopover();
    microDailyIntakePopoverAnchor = btn;
    microDailyIntakePopoverEl.hidden = false;
    positionMicroDailyIntakePopover(btn);
    btn.setAttribute("aria-expanded", "true");
  }

  function handleMicroDailyIntakeClick(e) {
    var btn = e.target.closest("[data-micro-daily-intake]");
    if (!btn) return false;
    e.preventDefault();
    e.stopPropagation();
    showMicroDailyIntakePopover(btn);
    return true;
  }

  function targetRefKindKey(kindLabel) {
    if (kindLabel === "FDA DV") return "fda";
    if (kindLabel === "WHO") return "who";
    if (kindLabel === "AHA") return "aha";
    if (kindLabel === "IOM bw min · set weight") return "iom_bw_set";
    if (kindLabel === "IOM bw min") return "iom_bw";
    if (kindLabel === "Study max") return "study_max";
    if (kindLabel === "Study min") return "study_min";
    if (kindLabel === "No ref") return "no_ref";
    return "";
  }

  function targetKindLabelHtml(kindLabel, extraClass, nutrientKey) {
    if (!kindLabel) return "";
    var key = targetRefKindKey(kindLabel);
    if (!key) {
      return (
        '<span class="' + escapeAttr(extraClass) + '">' + escapeHtml(kindLabel) + "</span>"
      );
    }
    return (
      '<button type="button" class="dashboard__target-ref ' +
      escapeAttr(extraClass) +
      '" data-target-ref="' +
      escapeAttr(key) +
      '" data-target-ref-nutrient="' +
      escapeAttr(nutrientKey || "") +
      '" aria-describedby="target-ref-popover">' +
      escapeHtml(kindLabel) +
      "</button>"
    );
  }

  function positionTargetRefPopover(anchor) {
    positionFixedPopoverBelow(targetRefPopoverEl, anchor);
  }

  function hideTargetRefPopover() {
    if (!targetRefPopoverEl) return;
    targetRefPopoverEl.hidden = true;
    targetRefPopoverAnchor = null;
  }

  function targetRefDetailHtml(detail) {
    if (!detail) return "";
    var text = typeof detail === "string" ? detail : detail.text;
    if (!text) return "";
    var html =
      '<p class="dashboard__target-ref-popover-copy dashboard__target-ref-popover-copy--detail">' +
      escapeHtml(text);
    if (detail.url) {
      html +=
        ' <a href="' +
        escapeAttr(detail.url) +
        '" target="_blank" rel="noopener noreferrer">Journal link</a>';
    }
    html += "</p>";
    return html;
  }

  function showTargetRefPopover(btn) {
    if (!targetRefPopoverEl || !targetRefPopoverTextEl || !btn) return;
    var key = btn.getAttribute("data-target-ref");
    var text = key ? TARGET_REF_POPOVER_TEXT[key] : "";
    if (!text) return;
    var nutrientKey = btn.getAttribute("data-target-ref-nutrient") || "";
    var detail = nutrientKey ? TARGET_REF_POPOVER_DETAILS[nutrientKey] : "";
    targetRefPopoverTextEl.innerHTML =
      '<p class="dashboard__target-ref-popover-copy">' +
      escapeHtml(text) +
      "</p>" +
      targetRefDetailHtml(detail);
    targetRefPopoverAnchor = btn;
    targetRefPopoverEl.hidden = false;
    positionTargetRefPopover(btn);
  }

  function toggleTargetRefPopover(btn) {
    if (!btn) return;
    if (
      targetRefPopoverAnchor === btn &&
      targetRefPopoverEl &&
      !targetRefPopoverEl.hidden
    ) {
      hideTargetRefPopover();
      return;
    }
    showTargetRefPopover(btn);
  }

  function bindTargetRefPopover(container) {
    if (!container || container._targetRefBound) return;
    container._targetRefBound = true;

    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".dashboard__target-ref");
      if (!btn || !container.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      toggleTargetRefPopover(btn);
    });
  }

  function initTargetRefPopoverEvents() {
    bindTargetRefPopover(dashboardMicroListEl);
    bindTargetRefPopover(dashboardMicroDailyGridEl);
    bindTargetRefPopover(dashboardLongevityContentEl);
    bindTargetRefPopover(microDefTargetsEl);

    document.addEventListener("click", function (e) {
      if (!targetRefPopoverEl || targetRefPopoverEl.hidden) return;
      if (
        e.target.closest(".dashboard__target-ref") ||
        e.target.closest("#target-ref-popover")
      ) {
        return;
      }
      hideTargetRefPopover();
    });

    window.addEventListener(
      "scroll",
      function () {
        hideTargetRefPopover();
      },
      true
    );

    window.addEventListener("resize", function () {
      if (targetRefPopoverAnchor && !targetRefPopoverEl.hidden) {
        positionTargetRefPopover(targetRefPopoverAnchor);
      }
    });
  }

  function openPhosphorusBinderModal() {
    if (!phosphorusBinderModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    phosphorusBinderModalEl.hidden = false;
    updateBodyModalOpen();
    if (phosphorusBinderModalDoneBtn) phosphorusBinderModalDoneBtn.focus();
  }

  function closePhosphorusBinderModal() {
    if (!phosphorusBinderModalEl) return;
    phosphorusBinderModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openCaffeineTipModal() {
    if (!caffeineTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    caffeineTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (caffeineTipModalDoneBtn) caffeineTipModalDoneBtn.focus();
  }

  function closeCaffeineTipModal() {
    if (!caffeineTipModalEl) return;
    caffeineTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openFoodNoteModal(label, note) {
    if (!foodNoteModalEl || !foodNoteModalTitleEl || !foodNoteModalBodyEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (histamineTipModalEl && !histamineTipModalEl.hidden) closeHistamineTipModal();
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    foodNoteModalTitleEl.textContent = label || "";
    foodNoteModalBodyEl.innerHTML = foodNoteBodyHtml(note);
    foodNoteModalEl.hidden = false;
    updateBodyModalOpen();
    if (foodNoteModalDoneBtn) foodNoteModalDoneBtn.focus();
  }

  function closeFoodNoteModal() {
    if (!foodNoteModalEl) return;
    foodNoteModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openFatsCholesterolTipModal() {
    if (!fatsCholesterolTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    fatsCholesterolTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (fatsCholesterolTipModalDoneBtn) fatsCholesterolTipModalDoneBtn.focus();
  }

  function closeFatsCholesterolTipModal() {
    if (!fatsCholesterolTipModalEl) return;
    fatsCholesterolTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openTmaoProtectorsTipModal() {
    if (!tmaoProtectorsTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    tmaoProtectorsTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (tmaoProtectorsTipModalDoneBtn) tmaoProtectorsTipModalDoneBtn.focus();
  }

  function closeTmaoProtectorsTipModal() {
    if (!tmaoProtectorsTipModalEl) return;
    tmaoProtectorsTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openFiberColonTipModal() {
    if (!fiberColonTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    fiberColonTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (fiberColonTipModalDoneBtn) fiberColonTipModalDoneBtn.focus();
  }

  function closeFiberColonTipModal() {
    if (!fiberColonTipModalEl) return;
    fiberColonTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openBerberineTipModal() {
    if (!berberineTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    berberineTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (berberineTipModalDoneBtn) berberineTipModalDoneBtn.focus();
  }

  function closeBerberineTipModal() {
    if (!berberineTipModalEl) return;
    berberineTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openPufaAntioxidantTipModal() {
    if (!pufaAntioxidantTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    pufaAntioxidantTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (pufaAntioxidantTipModalDoneBtn) pufaAntioxidantTipModalDoneBtn.focus();
  }

  function closePufaAntioxidantTipModal() {
    if (!pufaAntioxidantTipModalEl) return;
    pufaAntioxidantTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openHistamineTipModal() {
    if (!histamineTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    histamineTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (histamineTipModalDoneBtn) histamineTipModalDoneBtn.focus();
  }

  function closeHistamineTipModal() {
    if (!histamineTipModalEl) return;
    histamineTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openDashDietTipModal() {
    if (!dashDietTipModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (histamineTipModalEl && !histamineTipModalEl.hidden) {
      closeHistamineTipModal();
    }
    if (activeMicroId) {
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId) {
      saveLongevityFromForm();
      closeLongevityModal();
    }

    dashDietTipModalEl.hidden = false;
    updateBodyModalOpen();
    if (dashDietTipModalDoneBtn) dashDietTipModalDoneBtn.focus();
  }

  function closeDashDietTipModal() {
    if (!dashDietTipModalEl) return;
    dashDietTipModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function dismissPanelDisclaimer() {
    if (panelDisclaimerDismissed) return;
    panelDisclaimerDismissed = true;
    document.querySelectorAll(".dashboard__panel-disclaimer").forEach(function (el) {
      el.hidden = true;
    });
  }

  function dismissibleTipId(el) {
    if (el.id) return el.id;
    var existing = el.getAttribute("data-tip-id");
    if (existing) return existing;
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    var id = "tip-" + (h >>> 0).toString(36);
    el.setAttribute("data-tip-id", id);
    return id;
  }

  function isMicroTipEl(tipEl) {
    return !!(tipEl && tipEl.classList && tipEl.classList.contains("dashboard__micro-tip"));
  }

  function tipsInSection(sectionEl) {
    if (!sectionEl) return [];
    var tips = [];
    var children = sectionEl.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (
        child.classList &&
        (child.classList.contains("dashboard__micro-tip") ||
          child.classList.contains("dashboard__longevity-processed-note"))
      ) {
        tips.push(child);
      }
    }
    return tips;
  }

  function applyTipCollapsedState(tipEl) {
    var id = dismissibleTipId(tipEl);
    if (!tipEl.getAttribute("title")) {
      tipEl.setAttribute("title", "Click to hide tip");
    }
    if (collapsedTipIds[id]) {
      tipEl.setAttribute("data-tip-collapsed", "1");
    } else {
      tipEl.removeAttribute("data-tip-collapsed");
    }
  }

  function findGroupedTipsReopenButton(sectionEl) {
    var children = sectionEl.children;
    for (var i = 0; i < children.length; i++) {
      if (
        children[i].classList &&
        children[i].classList.contains("dashboard__tips-reopen") &&
        !children[i].getAttribute("data-tip-reopen-for")
      ) {
        return children[i];
      }
    }
    return null;
  }

  function ensureGroupedTipsReopenButton(sectionEl, tips) {
    var btn = findGroupedTipsReopenButton(sectionEl);
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dashboard__tips-reopen";
      btn.setAttribute("data-action", "reopen-tips");
      btn.hidden = true;
      btn.textContent = "Tips (0)";
      if (tips[0]) {
        sectionEl.insertBefore(btn, tips[0]);
      } else {
        sectionEl.appendChild(btn);
      }
    }
    return btn;
  }

  function syncGroupedTipsReopen(sectionEl) {
    if (!sectionEl) return;
    var tips = tipsInSection(sectionEl);
    if (!tips.length) return;
    var count = 0;
    tips.forEach(function (tip) {
      applyTipCollapsedState(tip);
      if (!tip.hidden && tip.getAttribute("data-tip-collapsed") === "1") {
        count += 1;
      }
    });
    var btn = findGroupedTipsReopenButton(sectionEl);
    if (count > 0) {
      if (!btn) btn = ensureGroupedTipsReopenButton(sectionEl, tips);
      btn.hidden = false;
      btn.textContent = "Tips (" + count + ")";
    } else if (btn) {
      btn.hidden = true;
    }
  }

  function findTipReopenButton(tipEl) {
    var id = dismissibleTipId(tipEl);
    var prev = tipEl.previousElementSibling;
    if (
      prev &&
      prev.classList &&
      prev.classList.contains("dashboard__tips-reopen") &&
      prev.getAttribute("data-tip-reopen-for") === id
    ) {
      return prev;
    }
    return null;
  }

  function ensureTipReopenButton(tipEl) {
    var btn = findTipReopenButton(tipEl);
    if (btn) return btn;
    var id = dismissibleTipId(tipEl);
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dashboard__tips-reopen";
    btn.setAttribute("data-action", "reopen-tips");
    btn.setAttribute("data-tip-reopen-for", id);
    btn.hidden = true;
    btn.textContent = "Tips (1)";
    tipEl.parentElement.insertBefore(btn, tipEl);
    return btn;
  }

  function syncTipReopenInPlace(tipEl) {
    if (!tipEl) return;
    applyTipCollapsedState(tipEl);
    var collapsed =
      !tipEl.hidden && tipEl.getAttribute("data-tip-collapsed") === "1";
    var btn = findTipReopenButton(tipEl);
    if (collapsed) {
      if (!btn) btn = ensureTipReopenButton(tipEl);
      btn.hidden = false;
      btn.textContent = "Tips (1)";
    } else if (btn) {
      btn.hidden = true;
    }
  }

  function tipElForReopenButton(reopenBtn) {
    var tipId = reopenBtn.getAttribute("data-tip-reopen-for");
    if (!tipId) return null;
    var next = reopenBtn.nextElementSibling;
    if (
      next &&
      next.matches &&
      next.matches(DISMISSIBLE_TIP_SELECTOR) &&
      dismissibleTipId(next) === tipId
    ) {
      return next;
    }
    return document.querySelector(
      DISMISSIBLE_TIP_SELECTOR + '[data-tip-id="' + tipId + '"], #' + tipId
    );
  }

  function syncAllDismissibleTips() {
    if (dashboardMicroPanelEl) {
      syncGroupedTipsReopen(dashboardMicroPanelEl);
    }
    if (dashboardLongevityPanelEl) {
      dashboardLongevityPanelEl
        .querySelectorAll(".dashboard__longevity-processed-note")
        .forEach(function (tip) {
          syncTipReopenInPlace(tip);
        });
    }
  }

  function collapseDismissibleTip(tipEl) {
    collapsedTipIds[dismissibleTipId(tipEl)] = true;
    tipEl.setAttribute("data-tip-collapsed", "1");
    if (isMicroTipEl(tipEl)) {
      syncGroupedTipsReopen(dashboardMicroPanelEl);
    } else {
      syncTipReopenInPlace(tipEl);
    }
  }

  function reopenTipsInSection(sectionEl) {
    tipsInSection(sectionEl).forEach(function (tip) {
      delete collapsedTipIds[dismissibleTipId(tip)];
      tip.removeAttribute("data-tip-collapsed");
    });
    syncGroupedTipsReopen(sectionEl);
  }

  function reopenSingleTip(tipEl) {
    if (!tipEl) return;
    delete collapsedTipIds[dismissibleTipId(tipEl)];
    tipEl.removeAttribute("data-tip-collapsed");
    syncTipReopenInPlace(tipEl);
  }

  function handleDismissibleTipClick(e) {
    var reopenBtn = e.target.closest('[data-action="reopen-tips"]');
    if (reopenBtn) {
      e.preventDefault();
      if (reopenBtn.getAttribute("data-tip-reopen-for")) {
        reopenSingleTip(tipElForReopenButton(reopenBtn));
      } else {
        reopenTipsInSection(reopenBtn.parentElement);
      }
      return true;
    }
    var tip = e.target.closest(DISMISSIBLE_TIP_SELECTOR);
    if (!tip) return false;
    if (
      e.target.closest(
        "a, button, input, select, textarea, label, [data-action], [data-longevity-def], [data-micro-def]"
      )
    ) {
      return false;
    }
    e.preventDefault();
    collapseDismissibleTip(tip);
    return true;
  }

  function cholesterolPlaqueTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Cholesterol:</strong> High LDL and excess dietary cholesterol contribute to plaque buildup in artery walls—the process behind most heart attacks and strokes… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="cholesterol" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function fatsCholesterolTipHtml() {
    return (
      cholesterolPlaqueTipHtml() +
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "For most healthy adults, eggs in moderation are fine for your heart. Egg yolks are high in cholesterol, but dietary cholesterol affects blood levels less than saturated fat does… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-fats-cholesterol-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>" +
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Soluble fiber:</strong> Supplements like psyllium husk bind to cholesterol in your gut and help remove it through waste. Oats, beans, barley, apples, and citrus are food sources tracked above… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-fats-cholesterol-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>" +
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Plant sterols &amp; stanols:</strong> About 2 g/day from fortified spreads, orange juice, or supplements can lower LDL by 7–10% by blocking cholesterol absorption in the gut. Whole nuts and seeds supply small amounts—log fortified products explicitly… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-fats-cholesterol-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>" +
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Lab testing:</strong> Ask for ApoB alongside a standard lipid panel. ApoB counts atherogenic lipoprotein particles directly—each LDL, VLDL, and Lp(a) particle carries one ApoB molecule—so it is often more accurate than LDL cholesterol alone, especially when LDL-C looks normal but particle number is high… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-fats-cholesterol-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function tmaoProtectorsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>TMAO protectors</strong> lower the gut-and-liver compound tied to atherosclerosis through what you eat—not only by cutting choline, carnitine, and betaine. No single protector does it all—olive-oil DMB and raw garlic block the bacterial enzyme; fiber, polyphenols, flavonoids, and resveratrol reshape the microbiome; vitamin D, B vitamins, and fish oil help the body clear TMAO. All matter alongside eating less carnitine-rich red meat… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-tmao-protectors-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function fiberColonTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "Adequate fiber supports colon health—high intake lowers colorectal cancer risk (about 10% per extra 10 g/day) and helps prevent other common conditions like diverticulitis, constipation, and hemorrhoids. The opposite pattern—low fiber with frequent red meat—raises those risks. Aim for 100%+ DV from beans, whole grains, vegetables, and fruit… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-fiber-colon-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function berberineTipHtml(context) {
    var lead;
    if (context === "bloodSugar") {
      lead =
        "<strong>Berberine (herb / supplement / OTC — not tracked from food):</strong> A plant alkaloid studied for lowering fasting blood sugar and HbA1c and improving insulin sensitivity—small trials often compare it to metformin. It is not a substitute for prescribed diabetes care… ";
    } else if (context === "cholesterol") {
      lead =
        "<strong>Berberine (herb / supplement / OTC — not tracked from food):</strong> A plant alkaloid studied for lowering LDL cholesterol and triglycerides (partly by upregulating LDL receptors), sometimes used alongside or in place of low-dose statins. It is not a substitute for prescribed lipid care… ";
    } else {
      lead =
        "<strong>Berberine (herb / supplement / OTC — not tracked from food):</strong> A plant alkaloid used to help balance the gut microbiome and reduce gut inflammation. It is not a grocery-tracked nutrient and is not a substitute for medical care… ";
    }
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      lead +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-berberine-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiWhatIsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>What does upper GI consist of?</strong> The upper gastrointestinal tract is the esophagus, stomach, and duodenum (the first part of the small intestine)—the stretch that receives food, mixes it with acid and enzymes, and begins emptying into the rest of the gut… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiB1B6TipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Vitamin B1 (Thiamine) &amp; B6 (Pyridoxine):</strong> Vitamin B1 is foundational for the autonomic nervous system, which dictates digestion. Vitamin B6 aids in synthesizing neurotransmitters that regulate smooth muscle intestinal movements." +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiMagnesiumTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Magnesium:</strong> Magnesium helps regulate muscle contractions and muscle relaxation along the entire digestive tract. A deficiency can lead to sluggish smooth muscle function and delayed transit." +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiZincTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Zinc:</strong> Zinc helps stimulate the production of stomach acid (HCl) and supports gastrointestinal motility by influencing serum gastrin and motilin levels." +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiDeficiencyTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Upper GI nutrients:</strong> Deficiency here slows down upper GI motility and could result in gastroparesis—track vitamin D, vitamin B12, and iron alongside general gut-motility nutrients." +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiBileMotilityTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Bile &amp; motility:</strong> Bile helps stimulate movement (motility) through the gastrointestinal tract. Low bile often results in slower gut transit time, which commonly contributes to constipation… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiBileProductionTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Liver &amp; gallbladder:</strong> The liver continuously produces bile (a digestive fluid), and the gallbladder serves as a holding tank to store and concentrate it until you eat. When you consume fatty foods, your body signals the gallbladder, which then contracts to release this bile into the small intestine to break down the fats… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiBileNutrientsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Bile production nutrients:</strong> Key nutrients for bile production include choline, taurine, and glycine. Choline is vital for building phosphatidylcholine (a main component of bile), while taurine and glycine are essential for creating bile salts. Vitamin C stimulates bile acid synthesis, and magnesium helps relax bile ducts to improve flow… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      '<ol class="dashboard__longevity-processed-note-list">' +
      "<li><strong>Choline:</strong> Organic eggs, grass-fed beef, and sunflower or soy lecithin.</li>" +
      "<li><strong>Taurine &amp; glycine:</strong> Bone broth, gelatin, fish, collagen, and shellfish.</li>" +
      "<li><strong>Vitamin C:</strong> Bell peppers, citrus fruits, and strawberries.</li>" +
      "<li><strong>Magnesium:</strong> Spinach, leafy greens, nuts, and seeds.</li>" +
      "</ol>" +
      "</aside>"
    );
  }

  function upperGiBileGastricEmptyingTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Bile &amp; gastric emptying:</strong> Bile affects upper GI motility as well as impacting the stomach and upper part of the small intestine (duodenum), and affects gastric emptying. If food sits too long in the upper GI tract, fermentation gas pushes up against the lower esophageal sphincter… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiBittersTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Bitter foods:</strong> Consuming bitter foods actively stimulates your bitter taste receptors, signaling your brain to trigger bile production in the liver and release it from the gallbladder… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiBileHerbsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Bile support (herbs &amp; habits — not tracked from food):</strong> Dandelion root, milk thistle, turmeric (with black pepper / BioPerine), gentian, ginger (gingerols and shogaols). Or actual ox bile or bile salts. More: artichoke leaf extract often paired with ginger, actinidin (kiwi fruit extract), digestive enzymes (lipase, amylase, proteases—which lower the amount of work so food can go through the upper GI faster), chewing thoroughly, warm water, walking 10–15 mins after eating, chamomile to relax stomach muscles (eases bloating). Peppermint may ease bloating for some people but can lower LES pressure and worsen reflux in susceptible people—see LES tone tips… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesWhatIsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Lower esophageal sphincter (LES):</strong> A ring of smooth muscle where the esophagus meets the stomach. It normally keeps the junction closed and opens briefly when food enters the stomach. Inadequate pressure—or relaxation at the wrong time—lets stomach contents travel upward, producing acid reflux, regurgitation, heartburn, or GERD. Healthy LES tone makes reflux less likely, but reflux is also driven by transient LES relaxations, hiatal hernia, stomach distention, delayed emptying, excess abdominal pressure, meal size/timing, and esophageal clearance… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesNutrientsCaveatTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Can nutrients tighten the LES?</strong> No nutrient has been proven to permanently tighten the LES the way resistance training strengthens skeletal muscle. The useful strategy is supporting normal resting LES pressure while reducing forces that push stomach contents upward—soluble fiber, adequately lean protein, lower-fat meals, and enough zinc for tissue maintenance." +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesSolubleFiberTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Soluble fiber:</strong> Forms a gel that supports regularity and may lower constipation, straining, bloating, and abdominal pressure against the stomach and LES. In a small prospective study of nonerosive GERD with low baseline fiber, psyllium (5 g three times daily) was associated with higher minimum LES resting pressure and fewer reflux/heartburn episodes—introduce gradually with enough water so gas and distention do not temporarily worsen reflux… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      '<ol class="dashboard__longevity-processed-note-list">' +
      "<li>Oatmeal and oat bran</li>" +
      "<li>Psyllium husk</li>" +
      "<li>Barley</li>" +
      "<li>Applesauce or peeled apples (if tolerated)</li>" +
      "<li>Bananas</li>" +
      "<li>Cooked carrots and other well-tolerated soluble-fiber foods</li>" +
      "</ol>" +
      "</aside>"
    );
  }

  function upperGiLesProteinTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Protein &amp; LES pressure:</strong> Protein can stimulate gastrin release; older physiology research found protein meals raised blood gastrin and LES pressure in many people (response varies). Lean proteins—fish, skinless poultry, egg whites, moderate lean meat, low-fat yogurt/cottage cheese or tofu when tolerated—supply protein without the large fat load of fried meats, sausage, bacon, or ribeye. Prefer baked, grilled, steamed, or poached—not breaded/fried or heavy cream sauces… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesFatWatchTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Why lean beats high-fat protein:</strong> Fat in the small intestine stimulates CCK. High-fat meals may lower LES pressure, promote transient sphincter relaxation, and slow stomach emptying—leaving the stomach distended longer against the LES. Low-fat dairy often sits in the supportive category (protein with less fat burden) when tolerated; it is not proven to directly tighten the LES. Saturated fat here is a proxy watch for that high-fat meal pattern… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesZincTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Zinc &amp; esophageal tissue:</strong> Zinc supports normal cellular function and tissue repair; deficiency can delay wound healing. Adequate food zinc may support esophageal lining maintenance—fish, poultry, meat, eggs, dairy, beans, nuts, fortified cereals. Ordinary zinc supplements are not established as raising LES pressure or healing reflux esophagitis; the adult upper intake level is 40 mg/day from all sources unless a clinician directs otherwise (excess can impair copper absorption)." +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesTriggersTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>May lower LES tone or trigger reflux (not all tracked):</strong> High-fat/fried foods; peppermint, spearmint, and menthol; caffeine and coffee (decaffeinated coffee can still trigger some people); chocolate; alcohol; raw onion, garlic, and other alliums in susceptible people. Citrus, tomatoes, and other acidic foods often irritate an already-sensitive esophagus more than they lower LES tone. Identify personal triggers rather than blanket restriction… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLesLifestyleTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Lifestyle that protects the LES barrier:</strong> Remain upright after eating; avoid meals within about 2–3 hours of bedtime when nighttime reflux is a problem; prefer smaller meals over one very large meal; reduce excess abdominal pressure (weight around the midsection, tight waistbands, severe constipation); elevate the head of the bed for nocturnal reflux (wedge/frame elevation beats stacking pillows); avoid smoking and nicotine. Certain medications can lower LES pressure—review with a clinician; do not stop prescribed drugs on your own… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionUpperGiMotility" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function upperGiLiverFocusTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Liver &amp; bile for upper GI motility:</strong> Focus on liver health and bile production to help with upper GI motility—not just the nutrients that support motility directly. The liver rows below are the same set tracked under Liver health… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionLiver" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function dashDietTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "The DASH diet pairs calcium with potassium and magnesium, emphasizes fiber from vegetables and whole grains, and keeps saturated fat moderate—together they relax blood vessels, promote heart health, and regulate fluid balance. The plan targets about 1,250 mg of calcium daily from low-fat dairy, leafy greens, and fortified foods… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-dash-diet-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function thyroidHealthTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "As you get older—especially after 60—thyroid function is particularly sensitive to variations in iodine intake. Iodine deficiency plays an important role in hypothyroidism (enlarged thyroid and slowed metabolism). <strong>What to track:</strong> iodine is the priority; selenium, iron, zinc, and tyrosine help iodine support T4/T3 production… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionThyroid" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function thyroidOmega3TipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "Omega-3 fatty acids are highly important for thyroid health. They reduce inflammation and oxidative stress, which helps protect the thyroid gland from damage. EPA and DHA also produce metabolic compounds called resolvins that are crucial for managing autoimmune conditions like Hashimoto's disease. Additionally, they ensure cell membrane integrity for proper hormone signaling." +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialEnergyTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>What it means for me:</strong> Mitochondrial energy means you bounce back after workout, stress, etc." +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialNadTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>NAD:</strong> A cellular fuel shuttle that carries energy from food into your mitochondria so they can make ATP. Age and stress can lower NAD+, which often shows up as fatigue or brain fog… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="nad" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialNadPrecursorsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>NAD from food:</strong> Food does not contain meaningful NAD itself. Your body builds it from niacin, tryptophan, NR, and NMN; polyphenols help preserve the NAD you already have. NR and NMN are in foods like milk, broccoli, and cucumbers, but amounts are tiny… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="nad" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialSupplementsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Tip:</strong> Supplements that support mitochondria are CoQ10, phosphatidylcholine, Urolithin A (a postbiotic compound produced when specific gut bacteria break down plant polyphenols—ellagitannins—found in foods like pomegranates, berries, and walnuts), omega-3s, etc." +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialUrolithinTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Urolithin A:</strong> No food contains it directly—your gut bacteria make it from ellagitannins and ellagic acid in pomegranate (the richest source), berries, and walnuts… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="urolithinA" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialLifestyleTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Tip:</strong> Fasting and cold plunges. Improving metabolic health, exercising." +
      "</p>" +
      "</aside>"
    );
  }

  function mitochondrialOmega3TipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>EPA &amp; DHA (both — no fixed ratio):</strong> Omega-3s incorporate directly into mitochondrial membranes, improving membrane fluidity, energy (ATP) production, and protecting cells from oxidative stress." +
      "</p>" +
      "</aside>"
    );
  }

  function thyroidVitaminATipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "Vitamin A is essential for proper thyroid function, largely because it works hand-in-hand with iodine. It helps your body activate thyroid receptors and is required to convert the inactive thyroid hormone T4 into the active energy-boosting form, T3. Without enough Vitamin A, iodine struggles to do its job properly." +
      "</p>" +
      "</aside>"
    );
  }

  function liverHealthTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Why keep liver health:</strong> The liver stores glycogen, makes bile, clears medications and waste, and produces clotting proteins and albumin. Protecting it supports metabolism, digestion, and long-term risk of fatty liver and liver cancer… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionLiver" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      '<ol class="dashboard__longevity-processed-note-list">' +
      "<li><strong>More stable energy and blood sugar.</strong> The liver stores glucose as glycogen and releases it when needed. It also processes fats, proteins, and nutrients from food. Healthy liver function supports normal metabolism, although improving liver health does not automatically cure unexplained fatigue.</li>" +
      "<li><strong>Proper digestion and nutrient absorption.</strong> The liver produces bile, which helps digest fats and absorb fat-soluble vitamins such as vitamins A, D, E, and K.</li>" +
      "<li><strong>Normal handling of medications, alcohol, and waste products.</strong> The liver chemically processes many medications and potentially harmful substances so they can be eliminated. Protecting it reduces the risk that these substances accumulate because of impaired liver function.</li>" +
      "<li><strong>Normal clotting and fluid balance.</strong> The liver produces proteins including clotting factors and albumin. Advanced liver damage can therefore cause abnormal bleeding, swelling, and fluid accumulation.</li>" +
      "<li><strong>Lower risk of fatty liver progressing.</strong> Preventing or treating fatty liver lowers the chance of inflammation, fibrosis, cirrhosis, liver failure, and liver cancer. For people with excess weight and fatty liver, gradual weight loss and exercise can reduce liver fat; larger sustained losses may improve inflammation and fibrosis.</li>" +
      "<li><strong>Lower liver-cancer risk.</strong> Keeping the liver free of chronic injury, inflammation, and advanced scarring lowers the long-term chance of hepatocellular carcinoma.</li>" +
      "</ol>" +
      "</aside>"
    );
  }

  function liverSupplementsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Supplements &amp; herbs (not tracked from food):</strong> Common options people use for liver support include milk thistle (silymarin); " +
      "<strong>NAC</strong> (N-acetylcysteine / N-acetyl-L-cysteine / acetylcysteine)—a glutathione precursor and the hospital antidote for acetaminophen overdose; " +
      "dandelion root tea (traditional bitter / bile-flow herb); artichoke leaf extract (cynarin—bile and lipid support); and sometimes schisandra, TUDCA, or SAMe. " +
      "None of these appear as ordinary grocery nutrients, so they have no dashboard rows. Food-trackable alpha-lipoic acid and glutathione still help when you log them. " +
      "Herbs do not replace choline adequacy, weight management, limiting alcohol and fructose, or medical care… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionLiver" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyHealthTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Why kidney health matters:</strong> Kidneys filter waste, balance fluid and electrolytes, help control blood pressure, support red-blood-cell production, and regulate bone minerals. High blood pressure, diabetes, excess weight, and very high protein loads are among the main ways kidneys get stressed over decades… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionKidney" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyHerbsDirectTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Herbs traditionally used for kidney support (not tracked from food):</strong> Nettle leaf (Urtica dioica), dandelion leaf/root, marshmallow root, cornsilk, and chanca piedra appear in traditional kidney and urinary formulas. Evidence quality varies; some act as mild diuretics. They are not grocery-tracked nutrients and are not a substitute for medical care—especially with CKD, where “kidney cleanse” herbs can be unsafe… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionKidney" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyHerbsBloodPressureTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Herbs that support blood pressure (and thereby ease kidney stress):</strong> High blood pressure damages the kidneys’ filtering units over time. Hibiscus (Hibiscus sabdariffa) tea, garlic, hawthorn, and beetroot-style nitrate support are commonly discussed for blood-pressure patterns. Lowering pressure reduces how hard the kidneys must work—herbs do not replace prescribed BP medicines… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionKidney" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyHerbsBloodGlucoseTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Herbs that support blood glucose (and thereby ease kidney stress):</strong> Diabetes is a leading cause of chronic kidney disease. Berberine, cinnamon, fenugreek, and bitter melon are often used for glucose support. Steadier blood sugar reduces the glycemic and vascular stress that injures kidney filters—still not a substitute for diabetes care… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionKidney" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyHerbsWeightTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Herbs that support normal weight (and thereby ease kidney stress):</strong> Excess weight raises blood pressure, insulin demand, and kidney filtration workload. Green tea (EGCG), fiber supplements such as glucomannan, and cayenne/capsaicin appear in weight-support formulas. Gradual weight loss protects kidneys more reliably than any herb alone… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionKidney" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyPotassiumFoodTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Potassium from food—when kidney function is normal:</strong> Potassium-rich foods such as fruit, vegetables, beans, potatoes, dairy, nuts, and whole grains can support healthy blood pressure, which indirectly protects the kidneys. In people with normal kidney function, excess potassium from ordinary foods is usually eliminated in urine." +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyPotassiumCkdTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Potassium caution with CKD or certain medications:</strong> Potassium supplements and potassium-based salt substitutes require caution with CKD or medications such as ACE inhibitors, ARBs, spironolactone, or certain diuretics. Damaged kidneys may be unable to remove potassium safely." +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyProteinTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Protein—needed, but excess loads the kidneys:</strong> Protein is essential for muscle, immune function, and tissue repair. But very high-protein diets create more nitrogenous waste for the kidneys to process and may be inappropriate for people with CKD. For CKD not requiring dialysis, NIDDK cites approximately 0.8 g/kg/day as adequate for many adults, although individual needs vary. Animal-protein intake may also need moderation in people prone to kidney stones… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionKidney" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function kidneyMicronutrientCautionTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Magnesium, vitamin D, and other micronutrients:</strong> These nutrients are needed for overall health, but taking extra amounts does not “strengthen” normal kidneys. High supplement doses can become dangerous when kidney function is reduced because minerals may accumulate. For example, magnesium-toxicity risk rises with impaired kidney function, while excessive vitamin D can cause high calcium and, in extreme cases, kidney failure." +
      "</p>" +
      "</aside>"
    );
  }

  function grayHairTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Preventing &amp; possibly reversing gray hair:</strong> When premature graying is driven by deficiency (B12, folate, low ferritin, copper, zinc, vitamin D) or thyroid disease, correcting the cause can halt progression and sometimes restore pigment in new growth. Genetics and age-related melanocyte stem-cell loss usually do not reverse with nutrients alone. Severe stress can accelerate graying; some human graying appears reversible when stress falls… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionGrayHair" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function stressResilienceTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Adaptogens, cortisol, and adrenal support:</strong> Chronic stress drains magnesium, B vitamins, and vitamin C faster than calm periods. Adaptogen herbs and mushrooms—ashwagandha, rhodiola, holy basil, reishi, cordyceps—are studied for stress tolerance, but this section tracks the underlying nutrients from food that support cortisol balance and help prevent the depletion pattern sometimes called adrenal fatigue… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionStressResilience" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function brainAstrocyteSupportTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Astrocytes & glutamate cleanup:</strong> Astrocytes are support cells in the brain. One of their most important jobs is clearing excess glutamate from the synaptic space via glutamate transporters (EAAT1/GLAST and EAAT2/GLT-1), then converting it to glutamine for recycling back to neurons. That cleanup is energy-intensive and depends on potassium (ion gradients for transporter uptake), glutamine (shuttle amino acid), creatine and B vitamins (ATP demand), and antioxidants like vitamin C, selenium, glycine, and taurine that protect astrocytes from oxidative stress\u2026 " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionBrainLongevity" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function brainLongevityTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Glutamate balance & the MIND diet:</strong> Glutamate is the brain\u2019s main excitatory neurotransmitter\u2014essential for learning, memory, and synaptic plasticity. Aging makes it harder to keep glutamate tightly regulated: too much uncontrolled activity contributes to excitotoxic stress, while too little impairs mental drive and clarity. Magnesium sits in the NMDA receptor channel and helps prevent excessive calcium entry; B6 converts glutamate to GABA; DHA maintains neuronal membrane fluidity; creatine buffers brain ATP for neurotransmitter recycling. The MIND diet\u2014leafy greens, berries, nuts, fish, olive oil, whole grains, and beans\u2014provides these nutrients in a pattern linked with slower cognitive decline in observational research\u2026 " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionBrainLongevity" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function achesVitaminDTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Vitamin D & aches:</strong> Low vitamin D can contribute to muscle weakness or aches in some people, especially if blood 25-OH vitamin D is low. Vitamin D receptors are present in muscle tissue and immune cells; deficiency is linked to diffuse musculoskeletal pain, proximal weakness, and higher fall risk in older adults… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionAches" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function achesAntiInflammatoryTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Anti-inflammatory support:</strong> Chronic low-grade inflammation drives joint stiffness, muscle soreness, and tendon pain—especially with age. Omega-3 fatty acids (EPA and DHA) produce resolvins and protectins that help resolve inflammation rather than just suppress it. Curcumin, polyphenols, and sulforaphane modulate NF-κB and COX-2 pathways; magnesium and B6 lower inflammatory cytokine levels when intake is adequate. Your <strong>omega-6 : omega-3 ratio</strong> matters: a ratio above 10:1 (typical Western diet is 15–20:1) tilts eicosanoid production toward pro-inflammatory prostaglandins and leukotrienes; bringing it closer to 2–4:1 shifts the balance toward anti-inflammatory and pro-resolving mediators… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionAches" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function achesJointLubricationTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Joint lubrication & cartilage:</strong> Healthy cartilage depends on collagen turnover—vitamin C is required for collagen synthesis, while glycine and proline are the main collagen amino acids. Manganese and copper support cartilage proteoglycans and collagen cross-linking. Omega-3 fats help maintain synovial fluid viscosity, which cushions and lubricates joints during movement… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionAches" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Hydration & joints:</strong> Synovial fluid is roughly 80% water—chronic mild dehydration thickens it, reducing cushioning and increasing friction in joints. Aim for about <strong>2.7 L (91 oz) total water daily for women</strong> and <strong>3.7 L (125 oz) for men</strong> (from all food and drinks combined; about 80% typically comes from beverages). Needs increase with exercise, heat, altitude, and age—older adults often lose thirst sensitivity before fluid needs drop." +
      "</p>" +
      "</aside>"
    );
  }

  function achesAgeRelatedTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Age-related aches & deficiency patterns:</strong> Several nutrient deficiencies become more common with age and present as aches or pain: low vitamin D causes osteomalacia (bone softening); low B12 causes neuropathic pain and tingling; low magnesium and potassium cause muscle cramps; low iron triggers restless legs; and statin use depletes CoQ10, contributing to myalgia. Addressing these gaps can meaningfully reduce pain that is often attributed to &ldquo;just aging&rdquo;… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionAches" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Hydration & cramps:</strong> Dehydration concentrates electrolytes unevenly and is one of the most common triggers for muscle cramps, stiffness, and joint pain—especially in older adults whose thirst signals weaken with age. General guidelines: <strong>women ~2.7 L (91 oz)/day</strong>, <strong>men ~3.7 L (125 oz)/day</strong> total water from all sources (IOM adequate intake). Spread intake through the day rather than catching up in large amounts; pairing water with potassium- and magnesium-rich foods supports absorption and electrolyte balance." +
      "</p>" +
      "</aside>"
    );
  }

  function visceralFatBuildupTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Reducing buildup:</strong> Visceral fat is not only about calories—insulin sensitivity and body composition matter. Magnesium, vitamin D, chromium, and leucine support how cells handle glucose and retain muscle; EPA, DHA, and monounsaturated fat support a lower-inflammatory fat-storage pattern. Fiber and protein add satiety so excess calories are less likely to land as deep abdominal fat… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionVisceralFat" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function visceralFatMobilizationTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Mobilizing fat for energy:</strong> Burning stored fat—including visceral fat—depends on mitochondrial oxidation. B vitamins build NAD+, FAD, and coenzyme A; carnitine shuttles fatty acids into mitochondria; CoQ10 carries electrons in the respiratory chain; magnesium and iron support ATP and cytochromes. When these cofactors run low, fat tends to stay stored even in a calorie deficit… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionVisceralFat" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function visceralFatGlpTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Gut incretin signaling:</strong> Soluble fiber feeds bacteria that produce short-chain fatty acids and stimulate incretin hormones (GLP-1-like effects)—research links this pattern to lower visceral adiposity. Polyphenols, flavonoids, and resveratrol from plants further reshape the microbiome toward lower fat storage. Fermented foods add benefit but are not counted here… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionVisceralFat" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function pufaAntioxidantTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "PUFAs are essential for cell membranes and signaling—eating more raises your vitamin E need (about 0.6 mg per gram PUFA). They are fragile: fats you absorb can oxidize during normal metabolism, not only when oil goes bad from heat, air, or storage. Vitamin E (alpha-tocopherol) helps protect them. Some whole foods pair PUFA with vitamin E (sunflower seeds, almonds); refined or overheated oils often do not, and how you store and cook oils matters… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-pufa-antioxidant-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function histamineTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>DAO, HNMT, and histamine:</strong> Histamine is useful for immune defense and stomach-acid signaling, but buildup can trigger allergy-like symptoms when release, food load, or breakdown gets out of balance. DAO handles food histamine in the gut; HNMT clears intracellular histamine and depends on methylation capacity. Copper, B vitamins, vitamin C, zinc, magnesium, protein, and fresh-food habits can support tolerance… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-histamine-tip-modal">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function senomorphicsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Senomorphics vs senolytics:</strong> Essential vitamins and plant compounds work mainly as senomorphics—they quiet chronic age-related inflammation, neutralize free radicals, and shield DNA from oxidative damage that accelerates cellular aging. That is not the same as true senolytics, which selectively clear senescent “zombie” cells. The best-studied senolytics are fisetin and quercetin (the latter paired with the drug dasatinib); curcumin and resveratrol are usually studied as senomorphic / sirtuin-activating support rather than true senolytics. Food doses are supportive but rarely match supplement protocols." +
      "</p>" +
      "</aside>"
    );
  }

  function cellularAgingSenolyticsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Herbs, OTC &amp; supplements (not tracked from food):</strong> These sort into three mechanisms worth keeping distinct. " +
      "<strong>Senolytics</strong> (selectively clear senescent cells): <strong>fisetin</strong> (strawberries) is the most potent natural flavonoid in senolytic screens and is in human trials; <strong>quercetin</strong> (onions, capers, apples) is a weak senolytic alone but synergizes with the prescription kinase inhibitor <strong>dasatinib</strong> in the landmark “D+Q” protocol, and is often sold with bromelain for absorption; <strong>piperlongumine</strong> (long pepper) and the curcumin analog EF24 are research-grade senolytics. " +
      "<strong>Senomorphics / SASP inhibitors</strong> (quiet the senescence-associated secretory phenotype without killing the cell): <strong>apigenin</strong> (parsley, chamomile, celery) blocks the SASP via IKK/NF-κB and also inhibits CD38 to spare NAD+; <strong>theaflavin</strong> (black tea) and EGCG (green tea) act as antioxidant SASP suppressors; culinary curcumin sits here too (NF-κB modulation). " +
      "<strong>Geroprotectors often grouped in but not senolytic:</strong> <strong>resveratrol</strong> (a sirtuin activator / CR mimetic) and <strong>spermidine</strong> (an autophagy inducer). " +
      "None are ordinary grocery nutrients, so they have no dashboard rows, and food amounts rarely reach trial doses. Screen for interactions—quercetin and apigenin inhibit CYP3A4, and combining flavonoids with dasatinib, navitoclax, or anticoagulants warrants clinician oversight… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionCellularAging" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function calcificationPhosphorusTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "Excess absorbable phosphate is hard to dial down on a typical American diet—cola, deli meat, cheese spreads, and fast food often carry phosphate additives that do not show up clearly on labels. " +
      '<a href="https://www.amazon.com/s?k=calcium+acetate" target="_blank" rel="noopener noreferrer">Calcium acetate</a> ' +
      "is sold as a mealtime phosphate binder; most commercial products are made synthetically because natural food sources do not concentrate enough for binding doses. " +
      '<button type="button" class="dashboard__longevity-tip-link" data-action="open-phosphorus-binder-modal">Calcium acetate dosing &amp; phosphorus details</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function calcificationVitaminK2TipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Vitamin K2 (menaquinone):</strong> Found in fermented foods and animal products. It helps route calcium into bone and teeth and may reduce calcium buildup in arteries—not the same job as vitamin K1 from leafy greens, which mainly supports blood clotting in the liver… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-micro-def="vitaminK2" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function calcificationVitaminK2SubformsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>MK-4 vs MK-7:</strong> MK-4 from meat and dairy clears within hours—spread doses through the day. MK-7 from fermented foods like natto lasts for days, so once-daily food or supplement doses are usually enough. Many commercial natto products have K2 removed; when supplementing, choose MK-7… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-micro-def="vitaminK2" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function vascularSodiumPotassiumTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Lowering sodium, raising potassium:</strong> Potassium-rich foods (fruit, beans, greens, yogurt) can help offset sodium’s blood-pressure effects, but cutting sodium itself is still the main lever—under 2,300 mg/day (FDA / Dietary Guidelines), 2,000 mg (WHO), or closer to 1,500 mg (AHA ideal / high blood pressure). Naturally occurring nitrates in food (especially beets, spinach, arugula, celery) convert to nitric oxide, which widens blood vessels, improves blood flow, and lowers blood pressure—systemically and in the brain… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionVascularBloodPressure" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function vascularBloodPressureTipHtml() {
    return cholesterolPlaqueTipHtml() + vascularSodiumPotassiumTipHtml();
  }

  function vascularBrainTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Small-vessel brain health:</strong> Higher blood pressure and worse lipids over years can damage small vessels in the brain. Microvascular changes on a CT head indicate damage to the brain’s smallest blood vessels—often called microvascular ischemic disease or small vessel disease—and typically represent long-term effects of aging, chronic high blood pressure, or diabetes, appearing as wear and tear in the brain’s white matter. In older adults, that pattern is often discussed alongside slower processing, word-finding trouble, and memory lapses that can look like ordinary aging but may partly reflect small-vessel injury over decades—not something this dashboard diagnoses." +
      "</p>" +
      "</aside>" +
      vascularSodiumPotassiumTipHtml()
    );
  }

  function femaleHormonesPmsTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>PMS & cycle balance:</strong> Magnesium, vitamin B6, and calcium are the most studied food-level supports for mood swings, cramping, and breast tenderness before your period. EPA and DHA from fish add anti-inflammatory support when intake is low—not a cure, but gaps here are common and easy to track… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionFemaleHormonesPms" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function femaleHormonesIronTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Iron & menstruation:</strong> Premenopausal women lose iron every cycle—your dashboard uses an 18 mg/day iron DV (vs 8 mg for men). Pair plant iron with vitamin C; folate, B12, and riboflavin build red blood cells. Heavy periods, fatigue, or cold hands may mean you need more from food before supplements… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionFemaleHormonesIron" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function femaleHormonesEstrogenTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Broccoli & estrogen metabolism:</strong> Sulforaphane from broccoli, Brussels sprouts, and kale activates Nrf2 and supports healthy estrogen breakdown—not blocking estrogen entirely, but helping your liver and gut clear excess. Chop crucifers and let them sit 5–10 minutes before cooking to boost sulforaphane… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionFemaleHormonesEstrogen" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function femaleHormonesPostMenopauseTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>After menopause:</strong> Ovarian estrogen falls sharply—bone loss accelerates, cardiovascular risk shifts, and hot flashes or sleep disruption may persist. Calcium, vitamin D, magnesium, and vitamin K matter more for bone; fiber and fish oil support heart and brain aging. Sulforaphane from crucifers still supports estrogen metabolite balance when ovarian production is low… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionFemaleHormonesPostMenopause" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function maleHormonesTestosteroneTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Testosterone from food:</strong> Zinc, magnesium, and vitamin D are the core micronutrients tied to healthy testosterone production and free-testosterone balance. Very low fat or chronic calorie deficit can suppress androgens too—monounsaturated fats from olive oil and avocado support a healthier pattern than excess saturated fat… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionMaleHormonesTestosterone" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function maleHormonesProstateTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Broccoli & prostate health:</strong> Sulforaphane from broccoli and other crucifers is one of the best-studied food compounds for prostate cell defense—it activates Nrf2 antioxidant pathways. Selenium, vitamin D, and zinc concentrate in prostate tissue; fish oil adds anti-inflammatory support. This tracks diet gaps, not PSA screening… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionMaleHormonesProstate" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function maleHormonesEstrogenBalanceTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Men need estrogen balance too:</strong> Aromatase converts testosterone to estrogen—belly fat and aging raise that conversion. Sulforaphane from broccoli supports healthy estrogen metabolite ratios; fiber helps clear metabolites in the gut; zinc supports aromatase balance. Low testosterone with high body fat often means too much estrogen relative to androgens… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionMaleHormonesEstrogenBalance" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function longevityHormoneSectionHtml(
    title,
    sectionDefKey,
    noteHtml,
    tipHtml,
    microItems,
    longevityItems,
    weekMicro,
    weekLongevity,
    extraBodyHtml
  ) {
    var body =
      longevityListOpen() +
      longevitySubgroupHtml("From your micro entries", "micro") +
      microItems
        .map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        })
        .join("");
    if (longevityItems && longevityItems.length) {
      body +=
        longevitySubgroupHtml("From your longevity entries", "compounds") +
        longevityItems
          .map(function (item) {
            return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
          })
          .join("");
    }
    body += extraBodyHtml || "";
    body += longevityListClose();
    return longevitySectionWrap(title, sectionDefKey, noteHtml + tipHtml, body);
  }

  function renderFemaleHormoneSectionsHtml(weekLongevity, weekMicro) {
    return (
      longevityHormoneSectionHtml(
        "Female Hormones - PMS & cycle balance",
        "sectionFemaleHormonesPms",
        '<p class="dashboard__longevity-note">Premenstrual mood swings, cramping, breast tenderness, and sleep disruption often worsen when magnesium, B6, calcium, or omega-3 intake runs low. These repeat values from your micro and longevity entries so you can spot diet gaps—not a substitute for medical evaluation of endometriosis, PCOS, or severe PMDD.</p>',
        femaleHormonesPmsTipHtml(),
        LONGEVITY_FEMALE_PMS_FROM_MICRO,
        LONGEVITY_FEMALE_PMS_FROM_LONGEVITY,
        weekMicro,
        weekLongevity
      ) +
      longevityHormoneSectionHtml(
        "Female Hormones - Iron & menstruation",
        "sectionFemaleHormonesIron",
        '<p class="dashboard__longevity-note">Menstrual blood loss is the main reason women need roughly twice the iron of men (18 mg vs 8 mg/day on your dashboard). Low iron blunts energy, thyroid function, and hormone balance; vitamin C at meals doubles non-heme iron absorption from plants.</p>',
        femaleHormonesIronTipHtml(),
        LONGEVITY_FEMALE_IRON_FROM_MICRO,
        [],
        weekMicro,
        weekLongevity
      ) +
      longevityHormoneSectionHtml(
        "Female Hormones - Estrogen metabolism",
        "sectionFemaleHormonesEstrogen",
        '<p class="dashboard__longevity-note">Your liver and gut clear estrogen metabolites every day—fiber binds excess in the intestine, B vitamins support methylation, and sulforaphane from broccoli and crucifers activates Nrf2 pathways linked to healthier estrogen breakdown. Several weekly crucifer servings are a practical target.</p>',
        femaleHormonesEstrogenTipHtml(),
        LONGEVITY_FEMALE_ESTROGEN_FROM_MICRO,
        LONGEVITY_FEMALE_ESTROGEN_FROM_LONGEVITY,
        weekMicro,
        weekLongevity
      ) +
      longevityHormoneSectionHtml(
        "Female Hormones - Post-menopause",
        "sectionFemaleHormonesPostMenopause",
        "",
        femaleHormonesPostMenopauseTipHtml(),
        LONGEVITY_FEMALE_POST_MENO_FROM_MICRO,
        LONGEVITY_FEMALE_POST_MENO_FROM_LONGEVITY,
        weekMicro,
        weekLongevity,
        longevitySubgroupHtml("Jump to related longevity areas", "neutral") +
          longevityNavJumpRowHtml("sectionBoneDensity", "Bone density") +
          longevityNavJumpRowHtml(
            "sectionVascularBloodPressure",
            "Vascular - Blood Pressure"
          )
      )
    );
  }

  function renderMaleHormoneSectionsHtml(weekLongevity, weekMicro) {
    return (
      longevityHormoneSectionHtml(
        "Male Hormones - Testosterone support",
        "sectionMaleHormonesTestosterone",
        '<p class="dashboard__longevity-note">Testosterone naturally declines with age, but chronic low intake of zinc, magnesium, or vitamin D, very low dietary fat, or excess body fat can worsen the pattern. These nutrients support synthesis and free-testosterone balance—they do not replace medical evaluation of hypogonadism.</p>',
        maleHormonesTestosteroneTipHtml(),
        LONGEVITY_MALE_TESTOSTERONE_FROM_MICRO,
        LONGEVITY_MALE_TESTOSTERONE_FROM_LONGEVITY,
        weekMicro,
        weekLongevity
      ) +
      longevityHormoneSectionHtml(
        "Male Hormones - Prostate health",
        "sectionMaleHormonesProstate",
        '<p class="dashboard__longevity-note">Prostate enlargement and cancer risk rise with age. Sulforaphane from broccoli and crucifers is among the best-studied food compounds for prostate cell defense; selenium, vitamin D, and zinc concentrate in prostate tissue. Track diet gaps here alongside regular medical screening—not instead of it.</p>',
        maleHormonesProstateTipHtml(),
        LONGEVITY_MALE_PROSTATE_FROM_MICRO,
        LONGEVITY_MALE_PROSTATE_FROM_LONGEVITY,
        weekMicro,
        weekLongevity
      ) +
      longevityHormoneSectionHtml(
        "Male Hormones - Estrogen balance (Belly fat)",
        "sectionMaleHormonesEstrogenBalance",
        '<p class="dashboard__longevity-note">Men convert testosterone to estrogen via aromatase—belly fat and aging increase that conversion, which can lower relative androgen tone and affect body composition. Broccoli sulforaphane, fiber, and zinc support healthier estrogen metabolite ratios and aromatase balance.</p>',
        maleHormonesEstrogenBalanceTipHtml(),
        LONGEVITY_MALE_ESTROGEN_FROM_MICRO,
        LONGEVITY_MALE_ESTROGEN_FROM_LONGEVITY,
        weekMicro,
        weekLongevity
      )
    );
  }

  function openLongevityDefModal(key, returnTo, stackOnForm) {
    if (!microDefModalEl || !key) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (!stackOnForm) {
      if (activeMicroId) {
        saveMicrosFromForm();
        closeMicroModal();
      }
      if (activeLongevityId) {
        saveLongevityFromForm();
        closeLongevityModal();
      }
    }

    activeMicroDefKey = null;
    activeLongevityDefKey = key;
    setMicroDefFullscreen(false);
    if (microDefModalTitleEl) {
      microDefModalTitleEl.textContent = longevityDefLabel(key);
    }
    renderLongevityDefBody(key);
    renderDefModalTargets("longevity", key);
    setDefModalReturnSources(returnTo || null);
    setDefModalStackedForm(stackOnForm || null);
    syncDefModalSourcesBtn();
    microDefModalEl.hidden = false;
    updateBodyModalOpen();
    if (defModalReturnSources && microDefModalBackBtn) {
      microDefModalBackBtn.focus();
    } else if (microDefModalDoneBtn) {
      microDefModalDoneBtn.focus();
    }
  }

  function openMicroDefModal(key, returnTo, stackOnForm) {
    if (!microDefModalEl || !key) return;
    var field = microDisplayFieldByKey(key);
    if (!field) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) closeMicroGapsModal();
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
    if (!stackOnForm) {
      if (activeMicroId) {
        saveMicrosFromForm();
        closeMicroModal();
      }
      if (activeLongevityId) {
        saveLongevityFromForm();
        closeLongevityModal();
      }
    }

    activeLongevityDefKey = null;
    activeMicroDefKey = key;
    setMicroDefFullscreen(false);
    if (microDefModalTitleEl) {
      microDefModalTitleEl.textContent = field.label;
    }
    renderMicroDefBody(key);
    renderDefModalTargets("micro", key);
    setDefModalReturnSources(returnTo || null);
    setDefModalStackedForm(stackOnForm || null);
    syncDefModalSourcesBtn();
    microDefModalEl.hidden = false;
    updateBodyModalOpen();
    if (defModalReturnSources && microDefModalBackBtn) {
      microDefModalBackBtn.focus();
    } else if (microDefModalDoneBtn) {
      microDefModalDoneBtn.focus();
    }
  }

  function openMicroGapsModal() {
    if (!microGapsModalEl) return;

    if (activeImportId) closeImportModal();
    if (importAllModalEl && !importAllModalEl.hidden) closeImportAllModal();
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
    }
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) {
      closePhosphorusBinderModal();
    }
    if (caffeineTipModalEl && !caffeineTipModalEl.hidden) closeCaffeineTipModal();
    if (foodNoteModalEl && !foodNoteModalEl.hidden) closeFoodNoteModal();
    if (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) {
      closeFatsCholesterolTipModal();
    }
    if (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) {
      closeTmaoProtectorsTipModal();
    }
    if (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) {
      closeFiberColonTipModal();
    }
    if (berberineTipModalEl && !berberineTipModalEl.hidden) {
      closeBerberineTipModal();
    }
    if (dashDietTipModalEl && !dashDietTipModalEl.hidden) {
      closeDashDietTipModal();
    }
    if (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) {
      closePufaAntioxidantTipModal();
    }
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
      (weekJumpModalEl && !weekJumpModalEl.hidden) ||
      (copyDateModalEl && !copyDateModalEl.hidden) ||
      (favoriteEditModalEl && !favoriteEditModalEl.hidden) ||
      isFavoritesSidebarOpen() ||
      (microGapsModalEl && !microGapsModalEl.hidden) ||
      (healthTimelineModalEl && !healthTimelineModalEl.hidden) ||
      (microDefModalEl && !microDefModalEl.hidden) ||
      (microSourcesModalEl && !microSourcesModalEl.hidden) ||
      (longevitySourcesModalEl && !longevitySourcesModalEl.hidden) ||
      (macroRankModalEl && !macroRankModalEl.hidden) ||
      (foodSourcesModalEl && !foodSourcesModalEl.hidden) ||
      (phosphorusBinderModalEl && !phosphorusBinderModalEl.hidden) ||
      (caffeineTipModalEl && !caffeineTipModalEl.hidden) ||
      (fatsCholesterolTipModalEl && !fatsCholesterolTipModalEl.hidden) ||
      (tmaoProtectorsTipModalEl && !tmaoProtectorsTipModalEl.hidden) ||
      (fiberColonTipModalEl && !fiberColonTipModalEl.hidden) ||
      (dashDietTipModalEl && !dashDietTipModalEl.hidden) ||
      (pufaAntioxidantTipModalEl && !pufaAntioxidantTipModalEl.hidden) ||
      (histamineTipModalEl && !histamineTipModalEl.hidden) ||
      (foodNoteModalEl && !foodNoteModalEl.hidden) ||
      (settingsModalEl && !settingsModalEl.hidden) ||
      (authSignupModalEl && !authSignupModalEl.hidden) ||
      (authLoginModalEl && !authLoginModalEl.hidden) ||
      (tdeeCalculatorModalEl && !tdeeCalculatorModalEl.hidden) ||
      (tdeeHintModalEl && !tdeeHintModalEl.hidden) ||
      (macroSplitHintModalEl && !macroSplitHintModalEl.hidden) ||
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
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) closeHealthTimelineModal();

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
        advanceStarterGuideAfterImport();
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

  /** Food-sources amounts often need 2 decimals (e.g. 0.08 g AA) so fmtNum does not show "0". */
  function fmtFoodSourcesAmount(n) {
    var x = Number(n);
    if (!isFinite(x)) return "";
    var abs = Math.abs(x);
    if (abs === 0) return "0";
    if (abs >= 1) return fmtNum(x);
    var two = Math.round(x * 100) / 100;
    if (two === 0) {
      var three = Math.round(x * 1000) / 1000;
      return String(three);
    }
    return two % 1 === 0 ? String(two) : two.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
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

  var SERVING_MULTIPLIER_HTML_RE = /(\s*\*\s*(?:\d+(?:\.\d+)?|\.\d+))/g;

  function highlightServingMultipliersHtml(html) {
    return String(html).replace(
      SERVING_MULTIPLIER_HTML_RE,
      '<mark class="hl hl--multiplier">$1</mark>'
    );
  }

  function highlightedDayHtml(text, foodRegex) {
    var html = foodRegex ? highlightedHtml(text, foodRegex) : escapeHtml(text);
    return highlightServingMultipliersHtml(html);
  }

  function countKeyword(text, name) {
    var re = new RegExp(keywordMatchPattern(escapeRegex(name)), "gi");
    var count = 0;
    var match;
    while ((match = re.exec(text)) !== null) {
      count += keywordServingMultiplier(text, match.index + match[0].length);
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
    MICRO_ALL_FIELDS.forEach(function (field) {
      totals[field.key] = 0;
    });
    totals.fiber = 0;
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

      MICRO_ALL_FIELDS.forEach(function (field) {
        if (field.key === "fiber") return;
        var v = kw.micros[field.key];
        if (v === "" || v == null) return;
        totals[field.key] += hits * parseFloat(v);
      });
    });

    return applyFiberTotalToMicroTotals(totals);
  }

  function microContributionsFromText(text, microKey) {
    var list = [];
    var seen = {};

    keywords.forEach(function (kw) {
      var name = kw.name.trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;

      var hits = countKeyword(text, name);
      if (!hits) return;

      var perServing;
      if (microKey === "fiber") {
        perServing = fiberTotalFromParts(kw.micros);
      } else {
        var v = kw.micros[microKey];
        if (v === "" || v == null) return;
        perServing = parseFloat(v);
      }
      if (isNaN(perServing) || perServing <= 0) return;

      list.push({
        name: name,
        amount: hits * perServing,
        hits: hits,
        perServing: perServing,
      });
    });

    list.sort(function (a, b) {
      return b.amount - a.amount;
    });
    return list;
  }

  function macroContributionsFromText(text, macroKey) {
    var list = [];
    var seen = {};

    keywords.forEach(function (kw) {
      var name = kw.name.trim();
      if (!name) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;

      var hits = countKeyword(text, name);
      if (!hits) return;

      var perServing = parseMacro(kw[macroKey]);
      if (!perServing || isNaN(perServing) || perServing <= 0) return;

      list.push({
        name: name,
        amount: hits * perServing,
        hits: hits,
        perServing: perServing,
      });
    });

    list.sort(function (a, b) {
      return b.amount - a.amount;
    });
    return list;
  }

  function macroContributionsForScope(macroKey, scope) {
    if (scope === "weekly") {
      var merged = {};
      DAYS.forEach(function (day) {
        var el = document.getElementById(day.id);
        var text = el ? el.value : "";
        macroContributionsFromText(text, macroKey).forEach(function (item) {
          var k = item.name.toLowerCase();
          if (merged[k]) {
            merged[k].amount += item.amount;
            merged[k].hits += item.hits;
          } else {
            merged[k] = {
              name: item.name,
              amount: item.amount,
              hits: item.hits,
              perServing: item.perServing,
            };
          }
        });
      });
      return Object.keys(merged)
        .map(function (k) {
          return merged[k];
        })
        .sort(function (a, b) {
          return b.amount - a.amount;
        });
    }

    var dayEl = activeMacroRankDayId
      ? document.getElementById(activeMacroRankDayId)
      : null;
    var dayText = dayEl ? dayEl.value : "";
    return macroContributionsFromText(dayText, macroKey);
  }

  function macroRankTabLabel(tab) {
    if (tab === "carbs") return "Carbs";
    if (tab === "fats") return "Fats";
    return "Protein";
  }

  function normalizeMacroRankTab(tab) {
    if (tab === "carbs" || tab === "fats" || tab === "protein") return tab;
    return "protein";
  }

  function normalizeMacroRankScope(scope) {
    return scope === "weekly" ? "weekly" : "daily";
  }

  function syncMacroRankTabsUi() {
    if (!macroRankTabsEl) return;
    var tabs = macroRankTabsEl.querySelectorAll("[data-macro-rank-tab]");
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var key = normalizeMacroRankTab(tab.getAttribute("data-macro-rank-tab"));
      var selected = key === activeMacroRankTab;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.classList.toggle("macro-rank-modal__tab--active", selected);
      tab.tabIndex = selected ? 0 : -1;
    }
    if (macroRankBodyEl) {
      macroRankBodyEl.setAttribute(
        "aria-labelledby",
        "macro-rank-tab-" + activeMacroRankTab
      );
    }
  }

  function syncMacroRankScopeUi() {
    var isWeekly = activeMacroRankScope === "weekly";
    if (macroRankScopeDailyBtn) {
      macroRankScopeDailyBtn.setAttribute("aria-pressed", isWeekly ? "false" : "true");
    }
    if (macroRankScopeWeeklyBtn) {
      macroRankScopeWeeklyBtn.setAttribute("aria-pressed", isWeekly ? "true" : "false");
    }
  }

  function syncMacroRankHeaderUi() {
    var day = null;
    if (activeMacroRankDayId) {
      for (var i = 0; i < DAYS.length; i++) {
        if (DAYS[i].id === activeMacroRankDayId) {
          day = DAYS[i];
          break;
        }
      }
    }
    if (macroRankModalTitleEl) {
      if (activeMacroRankScope === "weekly") {
        var weekLabel = formatWeekRangeLabel(viewedWeekStart);
        macroRankModalTitleEl.textContent = weekLabel
          ? "Week of " + weekLabel
          : "Full week";
      } else if (day) {
        var dateLabel = dateLabelForDayId(activeMacroRankDayId);
        macroRankModalTitleEl.textContent =
          day.label + (dateLabel ? " " + dateLabel : "");
      } else {
        macroRankModalTitleEl.textContent = "Ranked macros";
      }
    }
    if (macroRankModalSubtitleEl) {
      macroRankModalSubtitleEl.textContent =
        activeMacroRankScope === "weekly"
          ? "Matched foods from Mon–Sun, ranked by protein, carbs, or fats"
          : "Matched foods ranked by protein, carbs, or fats";
    }
  }

  function syncMacroRankFilterUi() {
    if (!macroRankFilterEl) return;
    if (macroRankFilterEl.value !== activeMacroRankFilter) {
      macroRankFilterEl.value = activeMacroRankFilter;
    }
  }

  function renderMacroRankBody() {
    if (!macroRankBodyEl || !activeMacroRankDayId) return;
    var tab = normalizeMacroRankTab(activeMacroRankTab);
    var list = macroContributionsForScope(tab, activeMacroRankScope);
    if (!list.length) {
      macroRankBodyEl.innerHTML =
        '<p class="micro-sources-modal__empty">No matched foods with ' +
        escapeHtml(macroRankTabLabel(tab).toLowerCase()) +
        (activeMacroRankScope === "weekly" ? " this week" : "") +
        ".</p>";
      return;
    }
    var prepared = prepareSourcesList(list, activeMacroRankFilter, activeMacroRankSort);
    if (!prepared.length && (activeMacroRankFilter || "").trim()) {
      macroRankBodyEl.innerHTML = sourcesFilterEmptyHtml(activeMacroRankFilter);
      return;
    }
    macroRankBodyEl.innerHTML = nutrientSourcesListHtml(
      prepared,
      "g",
      activeMacroRankSort
    );
  }

  function openMacroRankModal(dayId) {
    if (!macroRankModalEl || !dayId) return;
    var day = null;
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].id === dayId) {
        day = DAYS[i];
        break;
      }
    }
    if (!day) return;

    if (microSourcesModalEl && !microSourcesModalEl.hidden) closeMicroSourcesModal();
    if (longevitySourcesModalEl && !longevitySourcesModalEl.hidden) {
      closeLongevitySourcesModal();
    }
    if (foodSourcesModalEl && !foodSourcesModalEl.hidden) closeFoodSourcesModal();

    activeMacroRankDayId = dayId;
    activeMacroRankTab = "protein";
    activeMacroRankScope = "daily";
    activeMacroRankSort = defaultSourcesSortForKey("amount");
    activeMacroRankFilter = "";
    setMacroRankScopeTipOpen(false);
    syncMacroRankTabsUi();
    syncMacroRankScopeUi();
    syncMacroRankHeaderUi();
    syncMacroRankFilterUi();
    renderMacroRankBody();
    macroRankModalEl.hidden = false;
    updateBodyModalOpen();
    if (macroRankFilterEl) {
      macroRankFilterEl.focus();
    } else {
      var activeTab = macroRankTabsEl
        ? macroRankTabsEl.querySelector(
            '[data-macro-rank-tab="' + activeMacroRankTab + '"]'
          )
        : null;
      if (activeTab) activeTab.focus();
    }
  }

  function closeMacroRankModal() {
    if (!macroRankModalEl) return;
    activeMacroRankDayId = null;
    activeMacroRankTab = "protein";
    activeMacroRankScope = "daily";
    activeMacroRankSort = defaultSourcesSortForKey("amount");
    activeMacroRankFilter = "";
    setMacroRankScopeTipOpen(false);
    syncMacroRankFilterUi();
    syncMacroRankScopeUi();
    if (macroRankBodyEl) macroRankBodyEl.innerHTML = "";
    syncMacroRankTabsUi();
    macroRankModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function setMacroRankTab(tab) {
    activeMacroRankTab = normalizeMacroRankTab(tab);
    syncMacroRankTabsUi();
    renderMacroRankBody();
  }

  function setMacroRankScope(scope) {
    activeMacroRankScope = normalizeMacroRankScope(scope);
    syncMacroRankScopeUi();
    syncMacroRankHeaderUi();
    renderMacroRankBody();
  }

  function setMacroRankScopeTipOpen(open) {
    if (!macroRankScopeInfoBtn) return;
    macroRankScopeInfoBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleMacroRankScopeTip() {
    if (!macroRankScopeInfoBtn) return;
    var open = macroRankScopeInfoBtn.getAttribute("aria-expanded") === "true";
    setMacroRankScopeTipOpen(!open);
  }

  function microContributionsForScope(microKey, scope) {
    if (scope === "week") {
      var merged = {};
      DAYS.forEach(function (day) {
        var el = document.getElementById(day.id);
        var text = el ? el.value : "";
        microContributionsFromText(text, microKey).forEach(function (item) {
          var k = item.name.toLowerCase();
          if (merged[k]) {
            merged[k].amount += item.amount;
            merged[k].hits += item.hits;
          } else {
            merged[k] = {
              name: item.name,
              amount: item.amount,
              hits: item.hits,
              perServing: item.perServing,
            };
          }
        });
      });
      return Object.keys(merged)
        .map(function (k) {
          return merged[k];
        })
        .sort(function (a, b) {
          return b.amount - a.amount;
        });
    }

    var text = "";
    DAYS.forEach(function (day) {
      if (day.id === scope) {
        var el = document.getElementById(day.id);
        text = el ? el.value : "";
      }
    });
    return microContributionsFromText(text, microKey);
  }

  function addMicroTotals(a, b) {
    var out = emptyMicroTotals();
    MICRO_ALL_FIELDS.forEach(function (field) {
      out[field.key] = a[field.key] + b[field.key];
    });
    return applyFiberTotalToMicroTotals(out);
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
        if (field.key === "glycemicIndex") return;
        var v = resolveLongevityValue(kw, field.key);
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

  function weekMacroTotals() {
    var week = { protein: 0, carbs: 0, fats: 0 };
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      var dayTotals = totalsFromText(text);
      week.protein += dayTotals.protein;
      week.carbs += dayTotals.carbs;
      week.fats += dayTotals.fats;
    });
    return week;
  }

  function dailyProteinTargetG() {
    var weightKg = getBodyWeightKg();
    if (weightKg) return weightKg * 0.8;
    return 50;
  }

  function proteinTargetPct(dailyG) {
    var target = dailyProteinTargetG();
    if (!target) return { pct: null, text: "—", kindLabel: "protein target" };
    var pct = (dailyG / target) * 100;
    var kindLabel = getBodyWeightKg() ? "0.8 g/kg" : "50 g/day DV";
    return {
      pct: pct,
      text: formatTargetPctNumber(pct),
      kindLabel: kindLabel,
      refKey: "protein",
    };
  }

  function giBucketsFromWeek() {
    var low = 0;
    var med = 0;
    var high = 0;
    var lowGl = 0;
    var medGl = 0;
    var highGl = 0;

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
        var gl = hits * ((gi * carbs) / 100);
        if (gi <= 55) {
          low += weight;
          lowGl += gl;
        } else if (gi <= 69) {
          med += weight;
          medGl += gl;
        } else {
          high += weight;
          highGl += gl;
        }
      });
    });

    return {
      low: low,
      med: med,
      high: high,
      lowGl: lowGl,
      medGl: medGl,
      highGl: highGl,
    };
  }

  function giSummaryFromBuckets(buckets) {
    var carbG = buckets.low + buckets.med + buckets.high;
    if (carbG <= 0) return null;
    var avgGi = ((buckets.lowGl + buckets.medGl + buckets.highGl) / carbG) * 100;
    return {
      avgGi: avgGi,
      highShare: Math.round((buckets.high / carbG) * 100),
      dailyCarbG: carbG / weekAverageDayCount(),
    };
  }

  function giTierSummaryLabel(avgGi) {
    if (avgGi == null || isNaN(avgGi)) return "—";
    if (avgGi <= 55) return "low · ≤55";
    if (avgGi <= 69) return "medium · 56–69";
    return "high · ≥70";
  }

  function giLimitPctFromAvg(avgGi) {
    if (avgGi == null || isNaN(avgGi)) return null;
    return (avgGi / 55) * 100;
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

  /**
   * Divisor for weekly → daily averages used by % DV panels.
   * Past and future viewed weeks: full Mon–Sun (7).
   * Current calendar week: Mon through today’s blue column (inclusive).
   */
  function weekAverageDayCount() {
    if (!isCurrentWeek()) return DAYS.length;
    var idx = dayIndexById(todayDayId());
    return idx >= 0 ? idx + 1 : DAYS.length;
  }

  function avgDailyLongevity(key, weekTotal) {
    return weekTotal / weekAverageDayCount();
  }

  function avgDailyLongevityPct(key, weekTotal) {
    var dv = dailyLongevityDv(key);
    if (!dv) return null;
    return (avgDailyLongevity(key, weekTotal) / dv) * 100;
  }

  function effectiveDailyOmega3FromWeek(weekLongevity) {
    var avg = function (k) {
      return avgDailyLongevity(k, weekLongevity[k] || 0);
    };
    var total = avg("omega3");
    if (total > 0) return total;
    var fromParts = avg("epa") + avg("dha") + avg("ala");
    return fromParts > 0 ? fromParts : 0;
  }

  function omega6To3RowDisplay(derived) {
    var ratio = derived.omega6To3;
    var idealMax = longevityDvStatus.omega6To3IdealMax;
    if (ratio != null && !isNaN(ratio)) {
      return {
        note:
          ratio <= idealMax
            ? "≤ " + idealMax + " ideal"
            : "> " + idealMax + " high",
        text: fmtNum(ratio) + ":1",
      };
    }
    if (derived.omega6G > 0 && derived.effectiveOmega3G <= 0) {
      return { note: "omega-6 without ω-3", text: "—" };
    }
    return { note: "—", text: "—" };
  }

  function longevityRowFromEffectiveOmega3(weekLongevity, weekMicro, label) {
    var field = longevityFieldByKey("omega3");
    if (!field) return "";
    var daily = effectiveDailyOmega3FromWeek(weekLongevity);
    var target = microRowTargetDisplay(field, daily, "longevity", weekMicro);
    var amtText = daily > 0 ? fmtNum(daily) + " g" : "—";
    return longevityRowHtml(
      label || field.label,
      amtText,
      daily > 0 ? target.text : "—",
      daily > 0 ? target.pct : null,
      "",
      false,
      "omega3",
      false,
      null,
      "omega3",
      "longevity",
      daily > 0 ? target.kindLabel : null,
      daily > 0 ? target.refKey : null,
      daily > 0 ? target.reqAmount : null
    );
  }

  function computeLongevityDerived(weekLongevity, weekMicro) {
    var avg = function (k) {
      return avgDailyLongevity(k, weekLongevity[k] || 0);
    };
    var o6 = avg("omega6");
    var o3 = effectiveDailyOmega3FromWeek(weekLongevity);
    var sat = avg("saturatedFat");
    var unsat = avg("monounsaturatedFat") + avg("polyunsaturatedFat");
    var ratioO6O3 = o3 > 0 ? o6 / o3 : null;
    var ratioSatUnsat = unsat > 0 ? sat / unsat : null;
    var pufaG = avg("polyunsaturatedFat");
    var vitEMg = avg("vitaminE");
    var pufaTarget = longevityDvStatus.pufaVitaminEAlphaTocopherolPerGram;
    var pufaVitaminERatio = pufaG > 0 ? vitEMg / pufaG : null;
    var pufaVitaminEProtection =
      pufaG > 0 && pufaTarget > 0 ? (vitEMg / (pufaG * pufaTarget)) * 100 : null;
    var giBuckets = giBucketsFromWeek();
    var dayCount = weekAverageDayCount();
    var sodiumMg = (weekMicro.sodium || 0) / dayCount;
    var potassiumMg = (weekMicro.potassium || 0) / dayCount;
    var ratioKNa = sodiumMg > 0 ? potassiumMg / sodiumMg : null;
    return {
      omega6To3: ratioO6O3,
      omega6G: o6,
      effectiveOmega3G: o3,
      satToUnsat: ratioSatUnsat,
      potassiumToSodium: ratioKNa,
      epaPlusDha: avg("epa") + avg("dha"),
      transFatG: avg("transFat"),
      pufaG: pufaG,
      vitaminEMg: vitEMg,
      pufaVitaminERatio: pufaVitaminERatio,
      pufaVitaminEProtection: pufaVitaminEProtection,
      weekGl: weekGlycemicLoadTotal() / dayCount,
      giBuckets: giBuckets,
      giSummary: giSummaryFromBuckets(giBuckets),
    };
  }

  function dailyDv(key) {
    if (demographicDv && demographicDv.getDailyMicroDv) {
      return demographicDv.getDailyMicroDv(demographic, key);
    }
    return 0;
  }

  function microRequiresDailyIntake(key) {
    return demographicDv && demographicDv.requiresDailyIntake
      ? demographicDv.requiresDailyIntake(key)
      : false;
  }

  function dailyMicroPct(key, amount) {
    var dv = dailyDv(key);
    if (!dv) return null;
    return (amount / dv) * 100;
  }

  function avgDailyMicroPct(key, weekTotal) {
    return dailyMicroPct(key, weekTotal / weekAverageDayCount());
  }

  function iomBwMinMgPerKg(key) {
    if (demographicDv && demographicDv.getIomBwMinMgPerKg) {
      return demographicDv.getIomBwMinMgPerKg(key);
    }
    return 0;
  }

  function getBodyWeightKg() {
    return userBodyWeightKg != null && userBodyWeightKg > 0 ? userBodyWeightKg : null;
  }

  function iomBwMinDaily(key) {
    var weightKg = getBodyWeightKg();
    if (!weightKg) return 0;
    if (demographicDv && demographicDv.getIomBwMinDaily) {
      return demographicDv.getIomBwMinDaily(key, weightKg);
    }
    return 0;
  }

  function iomBwMinPct(key, dailyAmount) {
    var min = iomBwMinDaily(key);
    if (!min) return null;
    return (dailyAmount / min) * 100;
  }

  function formatTargetPctNumber(pct) {
    if (pct == null || isNaN(pct)) return "—";
    return fmtNum(pct) + "%";
  }

  /** When there is no scoreable daily target, show bare intake (no %) instead of "—". */
  function formatNoTargetAmountText(dailyAmount) {
    var n = Number(dailyAmount);
    if (!isFinite(n) || n === 0) return "—";
    return fmtNum(n);
  }

  function targetTextIsAmountOnly(targetDisplay) {
    return (
      !!targetDisplay &&
      (targetDisplay.pct == null || isNaN(targetDisplay.pct)) &&
      !!targetDisplay.text &&
      targetDisplay.text !== "—" &&
      targetDisplay.text.indexOf("%") === -1
    );
  }

  var STUDY_MIN_MICRO_REFS = {
    glycine: {
      amount: 10000,
      source: "Meléndez-Hevia et al. 2009 — collagen synthesis deficit",
    },
    proline: {
      amount: 5000,
      source: "Barbul 2008; Albaugh et al. 2017 — collagen turnover",
    },
  };

  var STUDY_MAX_MICRO_REFS = {
    arginine: {
      amount: 20000,
      source: "Shao & Hathcock 2008 OSL",
    },
    glutamine: {
      amount: 14000,
      source: "Shao & Hathcock 2008 OSL",
    },
    taurine: {
      amount: 3000,
      source: "Shao & Hathcock 2008 OSL",
    },
    vitaminARetinol: {
      amount: 3000,
      source: "IOM 2001 UL — preformed vitamin A",
    },
  };

  var NO_STANDALONE_REF_MICRO_KEYS = {
    vitaminABetaCarotene: true,
    vitaminK1: true,
    vitaminK2: true,
    vitaminK2MK4: true,
    vitaminK2MK7: true,
    cysteine: true,
  };

  function studyMinMicroRef(key) {
    var ref = STUDY_MIN_MICRO_REFS[key];
    return ref && typeof ref.amount === "number" && ref.amount > 0 ? ref : null;
  }

  function studyMaxMicroRef(key) {
    var ref = STUDY_MAX_MICRO_REFS[key];
    return ref && typeof ref.amount === "number" && ref.amount > 0 ? ref : null;
  }

  function microHasNoStandaloneRef(key) {
    return !!NO_STANDALONE_REF_MICRO_KEYS[key];
  }

  function microTargetReqAmountText(key) {
    var field = microFieldByKey(key);
    var unit = field ? field.unit : "mg";
    var dv = dailyDv(key);
    if (dv) return fmtNum(dv) + " " + unit + "/day";
    if (iomBwMinMgPerKg(key)) {
      if (!getBodyWeightKg()) return "";
      return fmtNum(iomBwMinDaily(key)) + " " + unit + "/day";
    }
    var studyMin = studyMinMicroRef(key);
    if (studyMin) return fmtNum(studyMin.amount) + " " + unit + "/day";
    var studyMax = studyMaxMicroRef(key);
    if (studyMax) return fmtNum(studyMax.amount) + " " + unit + "/day";
    return "";
  }

  /** FDA % DV when set; otherwise IOM bw min % or study max % when available. */
  function microNutrientTargetPct(key, dailyAmount) {
    var dvPct = dailyMicroPct(key, dailyAmount);
    if (dvPct != null) {
      return {
        pct: dvPct,
        text: formatTargetPctNumber(dvPct),
        kind: "dv",
        kindLabel: "FDA DV",
        reqAmount: microTargetReqAmountText(key),
        limiting: false,
        refKey: key,
      };
    }
    if (iomBwMinMgPerKg(key)) {
      if (!getBodyWeightKg()) {
        return {
          pct: null,
          text: formatNoTargetAmountText(dailyAmount),
          kind: "iom",
          kindLabel: "IOM bw min · set weight",
          reqAmount: "",
          limiting: false,
          refKey: key,
        };
      }
      var iomPct = iomBwMinPct(key, dailyAmount);
      return {
        pct: iomPct,
        text: formatTargetPctNumber(iomPct),
        kind: "iom",
        kindLabel: "IOM bw min",
        reqAmount: microTargetReqAmountText(key),
        limiting: false,
        refKey: key,
      };
    }
    var studyMin = studyMinMicroRef(key);
    if (studyMin) {
      var minPct = studyMin.amount > 0 ? (dailyAmount / studyMin.amount) * 100 : null;
      return {
        pct: minPct,
        text: formatTargetPctNumber(minPct),
        kind: "studyMin",
        kindLabel: "Study min",
        reqAmount: microTargetReqAmountText(key),
        limiting: false,
        refKey: key,
      };
    }
    var studyMax = studyMaxMicroRef(key);
    if (studyMax) {
      var maxPct = studyMax.amount > 0 ? (dailyAmount / studyMax.amount) * 100 : null;
      return {
        pct: maxPct,
        text: formatTargetPctNumber(maxPct),
        kind: "studyMax",
        kindLabel: "Study max",
        reqAmount: microTargetReqAmountText(key),
        limiting: true,
        refKey: key,
      };
    }
    if (microHasNoStandaloneRef(key)) {
      return {
        pct: null,
        text: formatNoTargetAmountText(dailyAmount),
        kind: "none",
        kindLabel: "No ref",
        reqAmount: "",
        limiting: false,
        refKey: key,
      };
    }
    return {
      pct: null,
      text: formatNoTargetAmountText(dailyAmount),
      kind: "none",
      kindLabel: "",
      reqAmount: "",
      limiting: false,
      refKey: key,
    };
  }

  function microTargetReqText(field) {
    var amount = microTargetReqAmountText(field.key);
    return amount || "—";
  }

  function longevityTargetReqText(field) {
    var dv = dailyLongevityDv(field.key);
    if (dv) return fmtNum(dv) + " " + field.unit + "/day";
    if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
      var amount = microTargetReqAmountText(field.key);
      if (amount) return amount;
    }
    return "—";
  }

  function microRowTargetDisplay(field, dailyAmount, source, weekMicro) {
    if (source === "longevity") {
      var lvDv = dailyLongevityDv(field.key);
      if (lvDv) {
        var lvPct = (dailyAmount / lvDv) * 100;
        return {
          pct: lvPct,
          text: formatTargetPctNumber(lvPct),
          kindLabel: "FDA DV",
          reqAmount: fmtNum(lvDv) + " " + field.unit + "/day",
          reqText: longevityTargetReqText(field),
          limiting: false,
          refKey: field.key,
        };
      }
      if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
        var microField = microFieldByKey(field.key) || field;
        var microDaily =
          weekMicro && weekMicro[field.key] > 0
            ? weekMicro[field.key] / weekAverageDayCount()
            : dailyAmount;
        var bridged = microNutrientTargetPct(field.key, microDaily);
        return {
          pct: bridged.pct,
          text: bridged.text,
          kindLabel: bridged.kindLabel,
          reqAmount: microTargetReqAmountText(field.key),
          reqText: microTargetReqText(microField),
          limiting: !!bridged.limiting,
          refKey: bridged.refKey || field.key,
        };
      }
      return {
        pct: null,
        text: formatNoTargetAmountText(dailyAmount),
        kindLabel: "",
        reqAmount: "",
        reqText: "—",
        limiting: false,
        refKey: field.key,
      };
    }
    var target = microNutrientTargetPct(field.key, dailyAmount);
    return {
      pct: target.pct,
      text: target.text,
      kindLabel: target.kindLabel,
      reqAmount: target.reqAmount,
      reqText: microTargetReqText(field),
      limiting: !!target.limiting,
      refKey: target.refKey || field.key,
    };
  }

  function tierForMicroTargetPct(pct, limiting) {
    return limiting
      ? tierForPctInList(pct, DEFAULT_LIMITING_TIERS)
      : tierForMicroPct(pct);
  }

  function microTargetPctInlineStyle(targetDisplay) {
    return pctInlineStyle(
      targetDisplay.pct,
      tierForMicroTargetPct(targetDisplay.pct, !!targetDisplay.limiting)
    );
  }

  function microTargetStatsHtml(targetDisplay, amtText, options) {
    options = options || {};
    var statsClass = options.statsClass || "dashboard__micro-stats";
    var pctClass = options.pctClass || "dashboard__micro-pct";
    var amtClass = options.amtClass || "dashboard__micro-amt";
    var kindClass = options.kindClass || "dashboard__micro-target-kind";
    var reqClass = options.reqClass || "dashboard__micro-dv-req";
    var pctStyle =
      options.pctStyle != null ? options.pctStyle : microTargetPctInlineStyle(targetDisplay);
    if (targetTextIsAmountOnly(targetDisplay)) {
      pctClass +=
        pctClass.indexOf("dashboard__micro-day-pct") !== -1
          ? " dashboard__micro-day-pct--amount"
          : " dashboard__micro-pct--amount";
    }

    var html = '<div class="' + statsClass + '">';
    html +=
      '<span class="' +
      pctClass +
      '"' +
      pctStyle +
      ">" +
      escapeHtml(targetDisplay.text) +
      "</span>";
    html += '<span class="' + amtClass + '">' + escapeHtml(amtText) + "</span>";
    if (targetDisplay.kindLabel) {
      html += targetKindLabelHtml(targetDisplay.kindLabel, kindClass, targetDisplay.refKey);
    }
    if (showMicroDailyDv && targetDisplay.reqAmount) {
      html +=
        '<span class="' +
        reqClass +
        '">' +
        escapeHtml(targetDisplay.reqAmount) +
        "</span>";
    }
    html += "</div>";
    return html;
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

  var DEFAULT_MACRO_SPLIT_NEED_TOLERANCE = {
    protein: { maxNeedG: 4, maxOverG: 12 },
    carbs: { maxNeedG: 4, maxOverG: 12 },
    fats: { maxNeedG: 2, maxOverG: 4 },
  };

  var macroSplitNeedTolerance = DEFAULT_MACRO_SPLIT_NEED_TOLERANCE;

  function normalizeMacroSplitNeedTolerance(raw) {
    function one(src, fallback) {
      var srcObj = src && typeof src === "object" ? src : {};
      var maxNeedG = Number(srcObj.maxNeedG);
      var maxOverG = Number(srcObj.maxOverG);
      return {
        maxNeedG:
          !isNaN(maxNeedG) && maxNeedG >= 0 ? maxNeedG : fallback.maxNeedG,
        maxOverG:
          !isNaN(maxOverG) && maxOverG >= 0 ? maxOverG : fallback.maxOverG,
      };
    }
    var rawObj = raw && typeof raw === "object" ? raw : {};
    return {
      protein: one(rawObj.protein, DEFAULT_MACRO_SPLIT_NEED_TOLERANCE.protein),
      carbs: one(rawObj.carbs, DEFAULT_MACRO_SPLIT_NEED_TOLERANCE.carbs),
      fats: one(rawObj.fats, DEFAULT_MACRO_SPLIT_NEED_TOLERANCE.fats),
    };
  }

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
    potassiumToSodiumIdealMin: 2,
    pufaVitaminEAlphaTocopherolPerGram: 0.6,
    glycemicLoadMaxPerDay: 100,
    glycemicLoadModerateMaxPerDay: 120,
  };

  var longevityDvStatus = DEFAULT_LONGEVITY_STATUS;
  var longevityNavTopicColors = {};

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
      potassiumToSodiumIdealMin:
        parseFloat(raw.potassiumToSodiumIdealMin) ||
        DEFAULT_LONGEVITY_STATUS.potassiumToSodiumIdealMin,
      pufaVitaminEAlphaTocopherolPerGram:
        parseFloat(raw.pufaVitaminEAlphaTocopherolPerGram) ||
        DEFAULT_LONGEVITY_STATUS.pufaVitaminEAlphaTocopherolPerGram,
      glycemicLoadMaxPerDay:
        parseFloat(raw.glycemicLoadMaxPerDay) ||
        DEFAULT_LONGEVITY_STATUS.glycemicLoadMaxPerDay,
      glycemicLoadModerateMaxPerDay:
        parseFloat(raw.glycemicLoadModerateMaxPerDay) ||
        DEFAULT_LONGEVITY_STATUS.glycemicLoadModerateMaxPerDay,
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

  function normalizeLongevityNavTopicColors(raw) {
    if (!raw || typeof raw !== "object") return {};
    var out = {};
    Object.keys(raw).forEach(function (key) {
      var color = raw[key];
      if (typeof color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(color.trim())) {
        out[key] = color.trim();
      }
    });
    return out;
  }

  function longevityNavTopicColor(sectionDefKey) {
    if (!sectionDefKey) return null;
    return longevityNavTopicColors[sectionDefKey] || null;
  }

  function applyLongevityNavTopicColor(el, sectionDefKey) {
    if (!el) return;
    var color = longevityNavTopicColor(sectionDefKey);
    if (color) {
      el.setAttribute("data-longevity-topic-color", "");
      el.style.setProperty("--longevity-topic-color", color);
    } else {
      el.removeAttribute("data-longevity-topic-color");
      el.style.removeProperty("--longevity-topic-color");
    }
  }

  function refreshLongevityNavTopicColors() {
    if (dashboardLongevityNavAllListEl) {
      dashboardLongevityNavAllListEl
        .querySelectorAll(".dashboard__longevity-nav-all-link")
        .forEach(function (link) {
          applyLongevityNavTopicColor(link, link.getAttribute("data-longevity-nav-key"));
        });
    }
    if (longevityPanelOpen) {
      updateLongevityNavUi(longevityNavActiveIndex);
    }
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
        longevityNavTopicColors = normalizeLongevityNavTopicColors(
          data.longevityNavTopicColors
        );
        macroSplitNeedTolerance = normalizeMacroSplitNeedTolerance(
          data.macroSplitNeedTolerance
        );
        refreshLongevityNavTopicColors();
        done();
      })
      .catch(function () {
        microDvStatus = DEFAULT_MICRO_DV_STATUS;
        longevityDvStatus = DEFAULT_LONGEVITY_STATUS;
        longevityNavTopicColors = {};
        macroSplitNeedTolerance = DEFAULT_MACRO_SPLIT_NEED_TOLERANCE;
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
    return microTargetReqText(field);
  }

  function syncMicroDailyDvToggleUi() {
    if (!dashboardMicroDvToggleEl) return;
    dashboardMicroDvToggleEl.setAttribute(
      "aria-pressed",
      showMicroDailyDv ? "true" : "false"
    );
    dashboardMicroDvToggleEl.textContent = showMicroDailyDv
      ? "Hide daily targets"
      : "Show daily targets";
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

  function loadMicroViewDaily() {
    if (!persist) {
      microViewDaily = false;
      return;
    }
    microViewDaily = !!persist.getSetting("microViewDaily");
  }

  function saveMicroViewDaily() {
    if (!persist) return;
    persist.setSetting("microViewDaily", !!microViewDaily);
  }

  function loadShowMicroDailyDv() {
    if (!persist) {
      showMicroDailyDv = false;
      return;
    }
    showMicroDailyDv = !!persist.getSetting("microShowDv");
  }

  function saveShowMicroDailyDv() {
    if (!persist) return;
    persist.setSetting("microShowDv", !!showMicroDailyDv);
  }

  function loadShowAcuteToxicityIcons() {
    if (!persist) {
      showAcuteSideEffects = false;
      showAcuteAdverseEffects = false;
      return;
    }
    var s = persist.loadSettings();
    showAcuteSideEffects = !!s.showAcuteSideEffects;
    showAcuteAdverseEffects = !!s.showAcuteAdverseEffects;
  }

  function saveShowAcuteToxicityIcons() {
    if (!persist) return;
    persist.patchSettings({
      showAcuteSideEffects: !!showAcuteSideEffects,
      showAcuteAdverseEffects: !!showAcuteAdverseEffects,
    });
  }

  function loadShowDailyIntakeIcons() {
    if (!persist) {
      showDailyIntakeIcons = true;
      return;
    }
    showDailyIntakeIcons = persist.getSetting("showDailyIntakeIcons") !== false;
  }

  function saveShowDailyIntakeIcons() {
    if (!persist) return;
    persist.setSetting("showDailyIntakeIcons", !!showDailyIntakeIcons);
  }

  function syncDailyIntakeIconsToggleUi() {
    document.body.classList.toggle(
      "show-daily-intake-icons",
      !!showDailyIntakeIcons
    );
    document
      .querySelectorAll("[data-daily-intake-icons-toggle]")
      .forEach(function (btn) {
        btn.setAttribute(
          "aria-pressed",
          showDailyIntakeIcons ? "true" : "false"
        );
      });
    if (!showDailyIntakeIcons) {
      hideMicroDailyIntakePopover();
    }
  }

  function setShowDailyIntakeIcons(open) {
    showDailyIntakeIcons = !!open;
    saveShowDailyIntakeIcons();
    syncDailyIntakeIconsToggleUi();
  }

  function microStickyFilterActive() {
    return (
      filterStickyDailyIntake ||
      filterStickySideEffects ||
      filterStickyAdverseEffects ||
      filterStickyNutrientKeys.length > 0
    );
  }

  function microStickyIconFilterActive() {
    return (
      filterStickyDailyIntake ||
      filterStickySideEffects ||
      filterStickyAdverseEffects
    );
  }

  function microKeyMatchesStickyFilter(key) {
    if (!microStickyFilterActive()) return true;
    if (!key) return false;
    var nutrientOk = true;
    if (filterStickyNutrientKeys.length) {
      nutrientOk = filterStickyNutrientKeys.indexOf(key) !== -1;
    }
    if (!nutrientOk) return false;
    if (!microStickyIconFilterActive()) return true;
    var match = false;
    if (filterStickyDailyIntake && microRequiresDailyIntake(key)) {
      match = true;
    }
    var acute = microAcuteToxicityEntry(key);
    if (
      filterStickySideEffects &&
      microAcuteToxicityEffects(acute, "side").length
    ) {
      match = true;
    }
    if (
      filterStickyAdverseEffects &&
      microAcuteToxicityEffects(acute, "adverse").length
    ) {
      match = true;
    }
    return match;
  }

  function normalizeFilterStickyNutrientKeys(raw) {
    if (!Array.isArray(raw)) return [];
    var valid = {};
    MICRO_ALL_FIELDS.forEach(function (field) {
      valid[field.key] = true;
    });
    var out = [];
    var seen = {};
    raw.forEach(function (key) {
      if (typeof key !== "string" || !valid[key] || seen[key]) return;
      seen[key] = true;
      out.push(key);
    });
    return out;
  }

  function loadStickyIconFilters() {
    if (!persist) {
      filterStickyDailyIntake = false;
      filterStickySideEffects = false;
      filterStickyAdverseEffects = false;
      filterStickyNutrientKeys = [];
      return;
    }
    var s = persist.loadSettings();
    filterStickyDailyIntake = !!s.filterDailyIntake;
    filterStickySideEffects = !!s.filterSideEffects;
    filterStickyAdverseEffects = !!s.filterAdverseEffects;
    filterStickyNutrientKeys = normalizeFilterStickyNutrientKeys(
      s.filterNutrients || []
    );
  }

  function saveStickyIconFilters() {
    if (!persist) return;
    persist.patchSettings({
      filterDailyIntake: !!filterStickyDailyIntake,
      filterSideEffects: !!filterStickySideEffects,
      filterAdverseEffects: !!filterStickyAdverseEffects,
      filterNutrients: filterStickyNutrientKeys.slice(),
    });
  }

  function nutrientFilterChipHtml(key) {
    var field = microFieldByKey(key);
    if (!field) return "";
    return (
      '<span class="dashboard__nutrient-filter-chip" role="listitem" data-nutrient-key="' +
      escapeAttr(key) +
      '">' +
      '<span class="dashboard__nutrient-filter-chip-label">' +
      escapeHtml(field.label) +
      "</span>" +
      '<button type="button" class="dashboard__nutrient-filter-chip-remove" data-nutrient-filter-remove="' +
      escapeAttr(key) +
      '" aria-label="Remove ' +
      escapeAttr(field.label) +
      '">×</button>' +
      "</span>"
    );
  }

  function syncNutrientFilterUi() {
    var hasKeys = filterStickyNutrientKeys.length > 0;
    var chipsHtml = filterStickyNutrientKeys
      .map(nutrientFilterChipHtml)
      .join("");
    document
      .querySelectorAll(".dashboard__filter-panel-section--nutrients")
      .forEach(function (el) {
        el.classList.toggle("dashboard__filter-panel-section--active", hasKeys);
      });
    document
      .querySelectorAll("[data-nutrient-filter-chips]")
      .forEach(function (el) {
        el.innerHTML = chipsHtml;
      });
    document
      .querySelectorAll("[data-nutrient-filter-preset]")
      .forEach(function (btn) {
        var presetId = btn.getAttribute("data-nutrient-filter-preset");
        var active = nutrientFilterPresetActive(presetId);
        btn.classList.toggle(
          "dashboard__nutrient-filter-preset--active",
          active
        );
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
  }

  function nutrientFilterPresetKeys(presetId) {
    return NUTRIENT_FILTER_PRESETS[presetId] || null;
  }

  function nutrientFilterPresetActive(presetId) {
    var keys = nutrientFilterPresetKeys(presetId);
    if (!keys || !keys.length) return false;
    if (filterStickyNutrientKeys.length !== keys.length) return false;
    return keys.every(function (key) {
      return filterStickyNutrientKeys.indexOf(key) !== -1;
    });
  }

  function applyNutrientFilterPreset(presetId) {
    var keys = nutrientFilterPresetKeys(presetId);
    if (!keys) return;
    if (nutrientFilterPresetActive(presetId)) {
      filterStickyNutrientKeys = [];
    } else {
      clearMicroConditionFocusForStickyFilter();
      filterStickyNutrientKeys = keys.slice();
    }
    saveStickyIconFilters();
    syncStickyIconFilterUi();
    refreshStickyIconFilterViews();
  }

  function focusNutrientFilterInput(panel) {
    if (!panel) return;
    var input = panel.querySelector("[data-nutrient-filter-input]");
    if (!input) return;
    requestAnimationFrame(function () {
      input.focus({ preventScroll: true });
    });
  }

  function hideNutrientFilterSuggest(input) {
    if (!input) return;
    var wrap = input.closest(".dashboard__nutrient-filter-combobox");
    var suggest = wrap && wrap.querySelector(".dashboard__nutrient-filter-suggest");
    if (suggest) {
      suggest.hidden = true;
      suggest.innerHTML = "";
    }
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  function nutrientFilterSuggestMatches(query) {
    var q = (query || "").trim();
    if (!q) return [];
    var ql = q.toLowerCase();
    var selected = {};
    filterStickyNutrientKeys.forEach(function (key) {
      selected[key] = true;
    });
    var results = [];
    MICRO_ALL_FIELDS.forEach(function (field) {
      if (selected[field.key]) return;
      var label = field.label || "";
      var ll = label.toLowerCase();
      var code = (field.code || "").toLowerCase();
      var keyl = field.key.toLowerCase();
      var score = null;
      var highlight = { start: 0, len: 0 };
      var at = ll.indexOf(ql);
      if (at === 0) {
        score = 0;
        highlight = { start: 0, len: q.length };
      } else if (at > 0) {
        score = 2;
        highlight = { start: at, len: q.length };
      } else if (code === ql || keyl === ql) {
        score = 1;
        highlight = { start: 0, len: Math.min(q.length, label.length) };
      } else if (code.indexOf(ql) === 0 || keyl.indexOf(ql) === 0) {
        score = 3;
        highlight = { start: 0, len: Math.min(q.length, label.length) };
      } else {
        var prefixLen = commonPrefixLen(q, label);
        if (prefixLen >= 2) {
          var slice = ll.slice(0, q.length);
          var dist = levenshtein(ql, slice);
          var maxDist = q.length <= 4 ? 1 : Math.max(1, Math.floor(q.length / 4));
          if (dist <= maxDist) {
            score = 4 + dist;
            highlight = { start: 0, len: prefixLen };
          }
        }
      }
      if (score != null) {
        results.push({
          key: field.key,
          label: label,
          score: score,
          highlight: highlight,
        });
      }
    });
    results.sort(function (a, b) {
      if (a.score !== b.score) return a.score - b.score;
      return a.label.length - b.label.length;
    });
    return results.slice(0, 8);
  }

  function nutrientFilterSuggestItemHtml(match, index) {
    var start = match.highlight.start || 0;
    var len = match.highlight.len || 0;
    var before = match.label.slice(0, start);
    var mid = match.label.slice(start, start + len);
    var after = match.label.slice(start + len);
    var id = "nutrient-filter-opt-" + index;
    return (
      '<button type="button" class="dashboard__nutrient-filter-suggest-item" role="option" id="' +
      escapeAttr(id) +
      '" data-nutrient-filter-pick="' +
      escapeAttr(match.key) +
      '">' +
      (before ? escapeHtml(before) : "") +
      (mid
        ? '<span class="dashboard__nutrient-filter-suggest-match">' +
          escapeHtml(mid) +
          "</span>"
        : "") +
      (after ? escapeHtml(after) : "") +
      "</button>"
    );
  }

  function updateNutrientFilterSuggest(input) {
    if (!input) return;
    var wrap = input.closest(".dashboard__nutrient-filter-combobox");
    var suggest = wrap && wrap.querySelector(".dashboard__nutrient-filter-suggest");
    if (!suggest) return;
    var matches = nutrientFilterSuggestMatches(input.value);
    if (!matches.length) {
      hideNutrientFilterSuggest(input);
      return;
    }
    suggest.innerHTML = matches
      .map(function (match, i) {
        return nutrientFilterSuggestItemHtml(match, i);
      })
      .join("");
    suggest.hidden = false;
    input.setAttribute("aria-expanded", "true");
    var first = suggest.querySelector(".dashboard__nutrient-filter-suggest-item");
    if (first) {
      first.classList.add("dashboard__nutrient-filter-suggest-item--active");
      input.setAttribute("aria-activedescendant", first.id);
    }
  }

  function nutrientFilterActiveSuggestItem(suggest) {
    return (
      suggest &&
      suggest.querySelector(
        ".dashboard__nutrient-filter-suggest-item--active"
      )
    );
  }

  function moveNutrientFilterSuggestActive(input, delta) {
    var wrap = input && input.closest(".dashboard__nutrient-filter-combobox");
    var suggest = wrap && wrap.querySelector(".dashboard__nutrient-filter-suggest");
    if (!suggest || suggest.hidden) return;
    var items = Array.prototype.slice.call(
      suggest.querySelectorAll(".dashboard__nutrient-filter-suggest-item")
    );
    if (!items.length) return;
    var current = nutrientFilterActiveSuggestItem(suggest);
    var idx = current ? items.indexOf(current) : -1;
    var next = (idx + delta + items.length) % items.length;
    items.forEach(function (item, i) {
      item.classList.toggle(
        "dashboard__nutrient-filter-suggest-item--active",
        i === next
      );
    });
    input.setAttribute("aria-activedescendant", items[next].id);
    if (typeof items[next].scrollIntoView === "function") {
      items[next].scrollIntoView({ block: "nearest" });
    }
  }

  function addStickyNutrientFilter(key) {
    if (!key || !microFieldByKey(key)) return;
    if (filterStickyNutrientKeys.indexOf(key) !== -1) return;
    clearMicroConditionFocusForStickyFilter();
    filterStickyNutrientKeys = filterStickyNutrientKeys.concat([key]);
    saveStickyIconFilters();
    syncStickyIconFilterUi();
    refreshStickyIconFilterViews();
  }

  function removeStickyNutrientFilter(key) {
    var next = filterStickyNutrientKeys.filter(function (k) {
      return k !== key;
    });
    if (next.length === filterStickyNutrientKeys.length) return;
    filterStickyNutrientKeys = next;
    saveStickyIconFilters();
    syncStickyIconFilterUi();
    refreshStickyIconFilterViews();
  }

  function syncStickyIconFilterUi() {
    var active = microStickyFilterActive();
    document
      .querySelectorAll("[data-sticky-filter-disclosure]")
      .forEach(function (btn) {
        btn.classList.toggle(
          "dashboard__sticky-options-disclosure--active",
          active
        );
      });
    document
      .querySelectorAll("[data-sticky-filter-clear]")
      .forEach(function (btn) {
        btn.hidden = !active;
      });
    document.querySelectorAll("[data-sticky-filter]").forEach(function (input) {
      var kind = input.getAttribute("data-sticky-filter");
      var on =
        kind === "daily"
          ? filterStickyDailyIntake
          : kind === "adverse"
            ? filterStickyAdverseEffects
            : filterStickySideEffects;
      input.checked = !!on;
    });
    syncNutrientFilterUi();
  }

  function clearStickyIconFilters() {
    if (!microStickyFilterActive()) return;
    filterStickyDailyIntake = false;
    filterStickySideEffects = false;
    filterStickyAdverseEffects = false;
    filterStickyNutrientKeys = [];
    saveStickyIconFilters();
    syncStickyIconFilterUi();
    document
      .querySelectorAll("[data-nutrient-filter-input]")
      .forEach(function (input) {
        input.value = "";
        hideNutrientFilterSuggest(input);
      });
    refreshStickyIconFilterViews();
  }

  function clearMicroConditionFocusForStickyFilter() {
    if (!microConditionFocus) return;
    microConditionFocus = null;
    setMicroConditionExpanded(false);
    syncMicroConditionUi();
  }

  function refreshStickyIconFilterViews() {
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
    if (longevityPanelOpen) {
      renderLongevityPanel();
    }
    if (typeof syncLongevityNavHeightVar === "function") {
      syncLongevityNavHeightVar();
    }
  }

  function setStickyIconFilter(kind, open) {
    if (kind === "daily") filterStickyDailyIntake = !!open;
    else if (kind === "side") filterStickySideEffects = !!open;
    else if (kind === "adverse") filterStickyAdverseEffects = !!open;
    else return;
    if (open) clearMicroConditionFocusForStickyFilter();
    saveStickyIconFilters();
    syncStickyIconFilterUi();
    refreshStickyIconFilterViews();
  }

  function microStickyHighlightActive() {
    return (
      highlightStickyDailyIntake ||
      highlightStickySideEffects ||
      highlightStickyAdverseEffects
    );
  }

  function loadStickyIconHighlights() {
    if (!persist) {
      highlightStickyDailyIntake = false;
      highlightStickySideEffects = false;
      highlightStickyAdverseEffects = false;
      return;
    }
    var s = persist.loadSettings();
    highlightStickyDailyIntake = !!s.highlightDailyIntake;
    highlightStickySideEffects = !!s.highlightSideEffects;
    highlightStickyAdverseEffects = !!s.highlightAdverseEffects;
  }

  function saveStickyIconHighlights() {
    if (!persist) return;
    persist.patchSettings({
      highlightDailyIntake: !!highlightStickyDailyIntake,
      highlightSideEffects: !!highlightStickySideEffects,
      highlightAdverseEffects: !!highlightStickyAdverseEffects,
    });
  }

  function syncStickyIconHighlightUi() {
    var active = microStickyHighlightActive();
    document.body.classList.toggle(
      "highlight-daily-intake-icons",
      !!highlightStickyDailyIntake
    );
    document.body.classList.toggle(
      "highlight-side-effects",
      !!highlightStickySideEffects
    );
    document.body.classList.toggle(
      "highlight-adverse-effects",
      !!highlightStickyAdverseEffects
    );
    document
      .querySelectorAll("[data-sticky-highlight-disclosure]")
      .forEach(function (btn) {
        btn.classList.toggle(
          "dashboard__sticky-options-disclosure--active",
          active
        );
      });
    document
      .querySelectorAll("[data-sticky-highlight-clear]")
      .forEach(function (btn) {
        btn.hidden = !active;
      });
    document.querySelectorAll("[data-sticky-highlight]").forEach(function (btn) {
      var kind = btn.getAttribute("data-sticky-highlight");
      var on =
        kind === "daily"
          ? highlightStickyDailyIntake
          : kind === "adverse"
            ? highlightStickyAdverseEffects
            : highlightStickySideEffects;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function clearStickyIconHighlights() {
    if (!microStickyHighlightActive()) return;
    highlightStickyDailyIntake = false;
    highlightStickySideEffects = false;
    highlightStickyAdverseEffects = false;
    saveStickyIconHighlights();
    syncStickyIconHighlightUi();
  }

  function setStickyIconHighlight(kind, open) {
    if (kind === "daily") highlightStickyDailyIntake = !!open;
    else if (kind === "side") highlightStickySideEffects = !!open;
    else if (kind === "adverse") highlightStickyAdverseEffects = !!open;
    else return;
    saveStickyIconHighlights();
    syncStickyIconHighlightUi();
  }

  function syncAcuteToxicityToggleUi() {
    document.body.classList.toggle(
      "show-acute-side-effects",
      !!showAcuteSideEffects
    );
    document.body.classList.toggle(
      "show-acute-adverse-effects",
      !!showAcuteAdverseEffects
    );
    document.querySelectorAll("[data-acute-kind]").forEach(function (btn) {
      var kind = btn.getAttribute("data-acute-kind");
      var on =
        kind === "adverse" ? showAcuteAdverseEffects : showAcuteSideEffects;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (
      microAcuteToxicityPopoverAnchor &&
      ((microAcuteToxicityPopoverAnchor.getAttribute("data-micro-acute") ===
        "side" &&
        !showAcuteSideEffects) ||
        (microAcuteToxicityPopoverAnchor.getAttribute("data-micro-acute") ===
          "adverse" &&
          !showAcuteAdverseEffects))
    ) {
      hideMicroAcuteToxicityPopover();
    }
    if (typeof syncLongevityNavHeightVar === "function") {
      syncLongevityNavHeightVar();
    }
  }

  function setShowAcuteSideEffects(open) {
    showAcuteSideEffects = !!open;
    saveShowAcuteToxicityIcons();
    syncAcuteToxicityToggleUi();
  }

  function setShowAcuteAdverseEffects(open) {
    showAcuteAdverseEffects = !!open;
    saveShowAcuteToxicityIcons();
    syncAcuteToxicityToggleUi();
  }

  function setShowMicroDailyDv(open) {
    showMicroDailyDv = !!open;
    saveShowMicroDailyDv();
    if (microRequirementsOpen) {
      renderMicroRequirements();
    } else {
      syncMicroDailyDvToggleUi();
    }
  }

  function setMicroViewDaily(daily) {
    microViewDaily = !!daily;
    saveMicroViewDaily();
    if (microRequirementsOpen) {
      renderMicroRequirements();
    } else {
      syncMicroViewToggleUi();
      syncMicroHintText();
    }
  }

  function syncMicroHintText() {
    if (!dashboardMicroHintTextEl) return;
    var weightNote = getBodyWeightKg()
      ? " Nutrients without FDA % DV show IOM bw min (IOM 2005 amino acid EARs × your weight)."
      : " Set body weight in Settings for IOM bw min on nutrients without FDA % DV.";
    dashboardMicroHintTextEl.textContent = microViewDaily
      ? "Per-day intake vs FDA % DV or IOM bw min (Mon–Sun)." + weightNote
      : "Average daily intake vs FDA % DV or IOM bw min (Mon–Sun; current week uses Mon–today)." +
        weightNote;
  }

  function microIncludesExtendedDisplayFields() {
    return !!microMoreExpanded || !!microStatusFilter;
  }

  function microBaseDisplayFields() {
    var fields = [];
    MICRO_FIELDS.forEach(function (field) {
      fields.push({ source: "micro", field: field });
      Object.keys(MICRO_DERIVED_DEFS).forEach(function (derivedKey) {
        var derived = MICRO_DERIVED_DEFS[derivedKey];
        if (derived.afterKey === field.key) {
          fields.push({
            source: "derived",
            field: microDisplayFieldByKey(derivedKey),
          });
        }
      });
    });
    if (microIncludesExtendedDisplayFields()) {
      MICRO_EXTENDED_FIELDS.forEach(function (field) {
        fields.push({ source: "micro", field: field });
      });
      var addedLongevityKeys = {};
      Object.keys(MICRO_CONDITION_FOCUS).forEach(function (condId) {
        var cond = MICRO_CONDITION_FOCUS[condId];
        (cond.longevityNutrients || []).forEach(function (key) {
          if (addedLongevityKeys[key]) return;
          var field = longevityFieldByKey(key);
          if (field) {
            addedLongevityKeys[key] = true;
            fields.push({ source: "longevity", field: field });
          }
        });
      });
    }
    return fields;
  }

  function microFilterMeta(id) {
    return (
      (id && MICRO_CONDITION_FOCUS[id]) ||
      (id && MICRO_INTAKE_FILTER[id]) ||
      null
    );
  }

  function microConditionDisplayFields() {
    var fields;
    if (!microConditionFocus) {
      fields = microBaseDisplayFields();
    } else if (MICRO_INTAKE_FILTER[microConditionFocus]) {
      var wantsDaily = microConditionFocus === "poorlyAbsorbed";
      fields = microBaseDisplayFields().filter(function (entry) {
        return microRequiresDailyIntake(entry.field.key) === wantsDaily;
      });
    } else {
      var meta = MICRO_CONDITION_FOCUS[microConditionFocus];
      if (!meta) {
        fields = microBaseDisplayFields();
      } else {
        fields = [];
        (meta.nutrients || []).forEach(function (key) {
          var field = microFieldByKey(key);
          if (field) fields.push({ source: "micro", field: field });
        });
        (meta.longevityNutrients || []).forEach(function (key) {
          var field = longevityFieldByKey(key);
          if (field) fields.push({ source: "longevity", field: field });
        });
      }
    }
    if (!microStickyFilterActive()) return fields;
    fields = ensureSelectedNutrientFields(fields);
    return fields.filter(function (entry) {
      return microKeyMatchesStickyFilter(entry.field.key);
    });
  }

  function ensureSelectedNutrientFields(fields) {
    if (!filterStickyNutrientKeys.length) return fields;
    var seen = {};
    fields.forEach(function (entry) {
      if (entry && entry.field && entry.field.key) {
        seen[entry.field.key] = true;
      }
    });
    filterStickyNutrientKeys.forEach(function (key) {
      if (seen[key]) return;
      var field = microFieldByKey(key);
      if (!field) return;
      if (microConditionFocus) {
        if (MICRO_INTAKE_FILTER[microConditionFocus]) {
          var wantsDaily = microConditionFocus === "poorlyAbsorbed";
          if (microRequiresDailyIntake(key) !== wantsDaily) return;
        } else {
          var meta = MICRO_CONDITION_FOCUS[microConditionFocus];
          if (meta) {
            var allowed = (meta.nutrients || []).indexOf(key) !== -1;
            if (!allowed) return;
          }
        }
      }
      fields.push({ source: "micro", field: field });
      seen[key] = true;
    });
    return fields;
  }

  function longevityDailyDvText(field) {
    var dv = dailyLongevityDv(field.key);
    return dv ? fmtNum(dv) + " " + field.unit + "/day DV" : "—";
  }

  function microConditionAmtText(entry, total, perDay) {
    var field = entry.field;
    total = total || 0;
    if (entry.source === "longevity") {
      return total > 0
        ? fmtNum(perDay ? total : avgDailyLongevity(field.key, total)) +
            " " +
            field.unit +
            (perDay ? "" : "/day avg")
        : "—";
    }
    return total > 0
      ? fmtNum(perDay ? total : total / weekAverageDayCount()) +
          " " +
          field.unit +
          (perDay ? "" : "/day avg")
      : "—";
  }

  function microConditionSourcesIconHtml(entry, dayId) {
    if (entry.source === "derived") return "";
    var key = entry.field.key;
    if (entry.source === "longevity") {
      if (key === "glycemicIndex") return "";
      return appendMicroDailyIntakeIconHtml(
        longevitySourcesIconHtml(key, "longevity"),
        key
      );
    }
    return appendMicroDailyIntakeIconHtml(microSourcesIconHtml(key, dayId), key);
  }

  function microEntryStatusSnapshot(entry, microTotals, longevityTotals, perDay) {
    var field = entry.field;
    var isLongevity = entry.source === "longevity";
    var isDerived = entry.source === "derived";
    var total = isLongevity
      ? (longevityTotals && longevityTotals[field.key]) || 0
      : isDerived
        ? 0
        : field.key === "fiber"
          ? fiberTotalFromParts(microTotals)
          : (microTotals && microTotals[field.key]) || 0;
    var dailyAmount = isDerived
      ? 0
      : perDay
        ? total
        : total / weekAverageDayCount();
    var targetDisplay = isDerived
      ? microDerivedRowTargetDisplay(field.key, microTotals, !!perDay)
      : microRowTargetDisplay(field, dailyAmount, entry.source, microTotals);
    var tier = tierForMicroTargetPct(targetDisplay.pct, !!targetDisplay.limiting);
    var isZero;
    if (isDerived) {
      var derivedAmt = microDerivedAmtText(field.key, microTotals, !!perDay);
      isZero = !derivedAmt || derivedAmt === "—";
    } else {
      isZero = !(total > 0);
    }
    return {
      total: total,
      dailyAmount: dailyAmount,
      targetDisplay: targetDisplay,
      tier: tier,
      isZero: isZero,
    };
  }

  function microEntryMatchesStatusFilter(entry, microTotals, longevityTotals, perDay) {
    if (!microStatusFilter || !MICRO_STATUS_FILTERS[microStatusFilter]) return true;
    var snap = microEntryStatusSnapshot(
      entry,
      microTotals,
      longevityTotals,
      perDay
    );
    if (microStatusFilter === "zero") return snap.isZero;
    if (microStatusFilter === "redOrZero") {
      return snap.isZero || !!(snap.tier && snap.tier.id === "red");
    }
    if (microStatusFilter === "green") {
      return !!(snap.tier && snap.tier.id === "green");
    }
    if (microStatusFilter === "excess") {
      var pct = snap.targetDisplay && snap.targetDisplay.pct;
      if (pct == null || isNaN(pct)) return false;
      // Ceiling / study-max nutrients: at or over the limit.
      // Aim nutrients: strictly over 100% (100% itself stays Green).
      if (snap.targetDisplay.limiting) return pct >= 100;
      return pct > 100;
    }
    return true;
  }

  function syncMicroMoreToggleUi() {
    var microMoreToggleEl = document.getElementById("dashboard-micro-more-toggle");
    if (!microMoreToggleEl) return;
    var wrap = microMoreToggleEl.closest(".dashboard__micro-more-wrap");
    if (wrap) {
      // Status filters already include extended nutrients (e.g. Valine).
      wrap.hidden = !!microStatusFilter;
    }
    if (microStatusFilter) return;
    microMoreToggleEl.setAttribute(
      "aria-expanded",
      microMoreExpanded ? "true" : "false"
    );
    var moreLabel =
      microMoreToggleEl.querySelector(".dashboard__micro-more-toggle-label") ||
      microMoreToggleEl;
    moreLabel.textContent = microMoreExpanded
      ? "Less"
      : "More vitamins, minerals & amino acids";
  }

  function syncMicroStatusFilterUi() {
    var active = !!(microStatusFilter && MICRO_STATUS_FILTERS[microStatusFilter]);
    var meta = active ? MICRO_STATUS_FILTERS[microStatusFilter] : null;
    var statusToneClass = {
      zero: "dashboard__micro-status-toggle--zero",
      redOrZero: "dashboard__micro-status-toggle--red-zero",
      green: "dashboard__micro-status-toggle--green",
      excess: "dashboard__micro-status-toggle--excess",
    };
    if (dashboardMicroStatusToggleEl) {
      dashboardMicroStatusToggleEl.classList.toggle(
        "dashboard__micro-condition-toggle--active",
        active
      );
      Object.keys(statusToneClass).forEach(function (id) {
        dashboardMicroStatusToggleEl.classList.toggle(
          statusToneClass[id],
          active && microStatusFilter === id
        );
      });
    }
    if (dashboardMicroStatusLabelEl) {
      dashboardMicroStatusLabelEl.textContent = active ? meta.label : "Status";
    }
    if (dashboardMicroStatusClearEl) {
      dashboardMicroStatusClearEl.hidden = !active;
    }
    if (dashboardMicroStatusToggleIconEl) {
      dashboardMicroStatusToggleIconEl.setAttribute(
        "href",
        active ? meta.icon : MICRO_STATUS_FILTER_DEFAULT_ICON
      );
    }
    var clearItem = document.querySelector("[data-micro-status-clear-item]");
    if (clearItem) clearItem.hidden = !active;
    if (dashboardMicroStatusListEl) {
      dashboardMicroStatusListEl
        .querySelectorAll(
          ".dashboard__micro-condition-link[data-micro-status-filter]:not([data-micro-status-filter=''])"
        )
        .forEach(function (btn) {
          var id = btn.getAttribute("data-micro-status-filter");
          var selected = id === microStatusFilter;
          btn.classList.toggle("dashboard__micro-condition-link--active", selected);
          btn.setAttribute("aria-selected", selected ? "true" : "false");
        });
    }
    syncMicroMoreToggleUi();
  }

  function setMicroStatusFilter(id) {
    var next =
      id && MICRO_STATUS_FILTERS[id]
        ? id === microStatusFilter
          ? null
          : id
        : null;
    microStatusFilter = next;
    setMicroFilterMenuOpen(null);
    syncMicroStatusFilterUi();
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
  }

  function microConditionRowHtml(entry, weekMicro, weekLongevity) {
    if (!microEntryMatchesStatusFilter(entry, weekMicro, weekLongevity, false)) {
      return "";
    }
    var field = entry.field;
    var isLongevity = entry.source === "longevity";
    var isDerived = entry.source === "derived";
    var snap = microEntryStatusSnapshot(entry, weekMicro, weekLongevity, false);
    var total = snap.total;
    var targetDisplay = snap.targetDisplay;
    var amtText = isDerived
      ? microDerivedAmtText(field.key, weekMicro, false)
      : microConditionAmtText(entry, total, false);
    var tier = snap.tier;
    var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
    var rowCls =
      "dashboard__micro-row dashboard__micro-row--clickable" +
      (showMicroDailyDv ? " dashboard__micro-row--show-dv" : "") +
      (isLongevity ? " dashboard__micro-row--longevity" : "") +
      (isDerived ? " dashboard__micro-row--derived" : "");
    var defAttr = isLongevity ? "data-longevity-def" : "data-micro-def";

    var nameCls =
      "dashboard__micro-name" +
      (isMicroFormSubtypeKey(field.key) ? " dashboard__micro-name--form" : "");
    var html =
      '<div class="' +
      rowCls +
      '"' +
      tierAttr +
      ' role="listitem">' +
      '<span class="dashboard__micro-name-wrap">' +
      '<button type="button" class="' +
      nameCls +
      '" ' +
      defAttr +
      '="' +
      escapeAttr(field.key) +
      '" aria-haspopup="dialog">' +
      nutrientLabelHtml(field.label) +
      "</button>" +
      microConditionSourcesIconHtml(entry) +
      "</span>" +
      microTargetStatsHtml(targetDisplay, amtText);
    html += "</div>";
    return html;
  }

  function microFilterGroupForId(id) {
    if (!id) return null;
    return MICRO_INTAKE_FILTER_IDS[id] ? "intake" : "conditions";
  }

  function clearMicroFilterMenuFixed(listEl) {
    if (!listEl) return;
    if (listEl._microFilterMenuHomeParent) {
      listEl._microFilterMenuHomeParent.insertBefore(
        listEl,
        listEl._microFilterMenuHomeNext || null
      );
      listEl._microFilterMenuHomeParent = null;
      listEl._microFilterMenuHomeNext = null;
    }
    listEl.classList.remove("dashboard__micro-condition-list--fixed");
    listEl.style.position = "";
    listEl.style.top = "";
    listEl.style.left = "";
    listEl.style.right = "";
    listEl.style.maxWidth = "";
    listEl.style.maxHeight = "";
    listEl.style.overflowY = "";
    listEl.style.zIndex = "";
  }

  function positionMicroFilterMenuFixed(listEl, toggleEl) {
    if (!listEl || !toggleEl || listEl.hidden) return;
    // Escape sticky/backdrop-filter containing blocks so fixed coords match the viewport.
    if (listEl.parentElement !== document.body) {
      listEl._microFilterMenuHomeParent = listEl.parentElement;
      listEl._microFilterMenuHomeNext = listEl.nextSibling;
      document.body.appendChild(listEl);
    }
    var rect = toggleEl.getBoundingClientRect();
    var gap = 2;
    listEl.classList.add("dashboard__micro-condition-list--fixed");
    listEl.style.position = "fixed";
    listEl.style.zIndex = "60";
    listEl.style.right = "auto";
    listEl.style.maxWidth =
      Math.max(12, window.innerWidth - 16) + "px";
    var width = Math.max(listEl.offsetWidth, 16 * 16);
    var left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - width - 8)
    );
    var spaceBelow = window.innerHeight - rect.bottom - gap - 8;
    var spaceAbove = rect.top - gap - 8;
    var placeAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
    var estimatedH = Math.min(listEl.offsetHeight || 200, placeAbove ? spaceAbove : spaceBelow);
    var top = placeAbove
      ? Math.max(8, rect.top - gap - estimatedH)
      : rect.bottom + gap;
    var maxH = Math.max(
      120,
      placeAbove ? spaceAbove : window.innerHeight - top - 8
    );
    listEl.style.left = left + "px";
    listEl.style.top = top + "px";
    listEl.style.maxHeight = maxH + "px";
    listEl.style.overflowY = "auto";
  }

  function shouldFixMicroFilterMenus() {
    var track = document.querySelector(
      ".dashboard__micro-sticky-filters [data-sticky-filters-track]"
    );
    if (!track) return false;
    var overflowX = window.getComputedStyle(track).overflowX;
    return (
      overflowX === "auto" ||
      overflowX === "scroll" ||
      overflowX === "hidden"
    );
  }

  function syncMicroFilterMenuPositions() {
    var useFixed = shouldFixMicroFilterMenus();
    if (!useFixed || !microFilterMenuOpen) {
      clearMicroFilterMenuFixed(dashboardMicroIntakeListEl);
      clearMicroFilterMenuFixed(dashboardMicroConditionListEl);
      clearMicroFilterMenuFixed(dashboardMicroStatusListEl);
      return;
    }
    if (microFilterMenuOpen === "intake") {
      clearMicroFilterMenuFixed(dashboardMicroConditionListEl);
      clearMicroFilterMenuFixed(dashboardMicroStatusListEl);
      positionMicroFilterMenuFixed(
        dashboardMicroIntakeListEl,
        dashboardMicroIntakeToggleEl
      );
    } else if (microFilterMenuOpen === "conditions") {
      clearMicroFilterMenuFixed(dashboardMicroIntakeListEl);
      clearMicroFilterMenuFixed(dashboardMicroStatusListEl);
      positionMicroFilterMenuFixed(
        dashboardMicroConditionListEl,
        dashboardMicroConditionToggleEl
      );
    } else if (microFilterMenuOpen === "status") {
      clearMicroFilterMenuFixed(dashboardMicroIntakeListEl);
      clearMicroFilterMenuFixed(dashboardMicroConditionListEl);
      positionMicroFilterMenuFixed(
        dashboardMicroStatusListEl,
        dashboardMicroStatusToggleEl
      );
    }
  }

  function setMicroFilterMenuOpen(which) {
    microFilterMenuOpen =
      which === "intake" || which === "conditions" || which === "status"
        ? which
        : null;
    if (dashboardMicroIntakeToggleEl) {
      dashboardMicroIntakeToggleEl.setAttribute(
        "aria-expanded",
        microFilterMenuOpen === "intake" ? "true" : "false"
      );
    }
    if (dashboardMicroIntakeListEl) {
      dashboardMicroIntakeListEl.hidden = microFilterMenuOpen !== "intake";
    }
    if (dashboardMicroConditionToggleEl) {
      dashboardMicroConditionToggleEl.setAttribute(
        "aria-expanded",
        microFilterMenuOpen === "conditions" ? "true" : "false"
      );
    }
    if (dashboardMicroConditionListEl) {
      dashboardMicroConditionListEl.hidden = microFilterMenuOpen !== "conditions";
    }
    if (dashboardMicroStatusToggleEl) {
      dashboardMicroStatusToggleEl.setAttribute(
        "aria-expanded",
        microFilterMenuOpen === "status" ? "true" : "false"
      );
    }
    if (dashboardMicroStatusListEl) {
      dashboardMicroStatusListEl.hidden = microFilterMenuOpen !== "status";
    }
    window.requestAnimationFrame(syncMicroFilterMenuPositions);
  }

  function setMicroConditionExpanded(open) {
    setMicroFilterMenuOpen(open ? microFilterMenuOpen || "conditions" : null);
  }

  function syncMicroFilterListSelection(listEl) {
    if (!listEl) return;
    listEl
      .querySelectorAll(
        ".dashboard__micro-condition-link[data-micro-condition]:not([data-micro-condition=''])"
      )
      .forEach(function (btn) {
        var id = btn.getAttribute("data-micro-condition");
        var selected = id === microConditionFocus;
        btn.classList.toggle("dashboard__micro-condition-link--active", selected);
        btn.setAttribute("aria-selected", selected ? "true" : "false");
      });
  }

  function syncMicroConditionUi() {
    var active = !!microConditionFocus;
    var activeGroup = microFilterGroupForId(microConditionFocus);
    var filterMeta = microFilterMeta(microConditionFocus);
    var intakeActive = activeGroup === "intake";
    var conditionsActive = activeGroup === "conditions";

    if (dashboardMicroIntakeToggleEl) {
      dashboardMicroIntakeToggleEl.classList.toggle(
        "dashboard__micro-condition-toggle--active",
        intakeActive
      );
    }
    if (dashboardMicroIntakeLabelEl) {
      dashboardMicroIntakeLabelEl.textContent = intakeActive
        ? filterMeta.label
        : "Nutrition Intake";
    }
    if (dashboardMicroIntakeClearEl) {
      dashboardMicroIntakeClearEl.hidden = !intakeActive;
    }

    if (dashboardMicroConditionToggleEl) {
      dashboardMicroConditionToggleEl.classList.toggle(
        "dashboard__micro-condition-toggle--active",
        conditionsActive
      );
    }
    if (dashboardMicroConditionLabelEl) {
      dashboardMicroConditionLabelEl.textContent = conditionsActive
        ? filterMeta.label
        : "Conditions";
    }
    if (dashboardMicroConditionClearEl) {
      dashboardMicroConditionClearEl.hidden = !conditionsActive;
    }

    document
      .querySelectorAll("[data-micro-filter-clear-item]")
      .forEach(function (item) {
        var group = item.getAttribute("data-micro-filter-clear-item");
        item.hidden = !(active && activeGroup === group);
      });

    syncMicroFilterListSelection(dashboardMicroIntakeListEl);
    syncMicroFilterListSelection(dashboardMicroConditionListEl);

    if (microTipCaffeineEl) {
      microTipCaffeineEl.hidden = active;
    }
    if (microTipFatSolubleEl) {
      microTipFatSolubleEl.hidden =
        active && microConditionFocus !== "fatSolubleVitamins";
    }
    if (microTipCommonDeficienciesEl) {
      microTipCommonDeficienciesEl.hidden =
        active && microConditionFocus !== "americanCommonDeficiencies";
    }
    if (microTipCataractsEl) {
      microTipCataractsEl.hidden = microConditionFocus !== "cataractsPrevention";
    }
    if (microTipHairLossEl) {
      microTipHairLossEl.hidden = microConditionFocus !== "hairLoss";
    }
    if (microTipHairLossHerbsEl) {
      microTipHairLossHerbsEl.hidden = microConditionFocus !== "hairLoss";
    }
    if (microTipHairLossPrescriptionsEl) {
      microTipHairLossPrescriptionsEl.hidden = microConditionFocus !== "hairLoss";
    }
    syncGroupedTipsReopen(dashboardMicroPanelEl);
  }

  function setMicroConditionFocus(id) {
    var next = id && microFilterMeta(id) ? id : null;
    microConditionFocus = next;
    setMicroFilterMenuOpen(null);
    syncMicroConditionUi();
    if (next && microStickyFilterActive()) {
      clearStickyIconFilters();
      return;
    }
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
  }

  function microDayCardHtml(dayLabel, dayId, microTotals, longevityTotals, dateLabel) {
    var isToday = dayId === activeTodayDayId();
    var rows = "";
    microConditionDisplayFields().forEach(function (entry) {
      if (!microEntryMatchesStatusFilter(entry, microTotals, longevityTotals, true)) {
        return;
      }
      var field = entry.field;
      var isLongevity = entry.source === "longevity";
      var isDerived = entry.source === "derived";
      var snap = microEntryStatusSnapshot(entry, microTotals, longevityTotals, true);
      var total = snap.total;
      var targetDisplay = snap.targetDisplay;
      var amtText = isDerived
        ? microDerivedAmtText(field.key, microTotals, true)
        : microConditionAmtText(entry, total, true);
      var tier = snap.tier;
      var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
      var rowCls =
        "dashboard__micro-day-row dashboard__micro-day-row--clickable" +
        (isLongevity ? " dashboard__micro-day-row--longevity" : "") +
        (isDerived ? " dashboard__micro-day-row--derived" : "");
      var defAttr = isLongevity ? "data-longevity-def" : "data-micro-def";

      var nameCls =
        "dashboard__micro-day-name" +
        (isMicroFormSubtypeKey(field.key)
          ? " dashboard__micro-day-name--form"
          : "");
      rows +=
        '<div class="' +
        rowCls +
        '"' +
        tierAttr +
        ">" +
        '<span class="dashboard__micro-day-name-wrap">' +
        '<button type="button" class="' +
        nameCls +
        '" ' +
        defAttr +
        '="' +
        escapeAttr(field.key) +
        '" aria-haspopup="dialog">' +
        nutrientLabelHtml(field.label) +
        "</button>" +
        microConditionSourcesIconHtml(entry, dayId) +
        "</span>" +
        microTargetStatsHtml(targetDisplay, amtText, {
          statsClass: "dashboard__micro-day-stats",
          pctClass: "dashboard__micro-day-pct",
          amtClass: "dashboard__micro-day-amt",
          kindClass: "dashboard__micro-day-target-kind",
          reqClass: "dashboard__micro-day-dv-req",
        }) +
        "</div>";
    });

    return (
      '<article class="dashboard__card dashboard__micro-day-card' +
      (isToday ? " dashboard__card--today" : "") +
      '">' +
      '<span class="dashboard__label"' +
      (isToday ? ' aria-current="date"' : "") +
      ">" +
      escapeHtml(dayLabel) +
      "</span>" +
      (dateLabel
        ? '<span class="dashboard__date">' + escapeHtml(dateLabel) + "</span>"
        : "") +
      '<div class="dashboard__micro-day-rows">' +
      rows +
      "</div></article>"
    );
  }

  function renderMicroWeeklyList() {
    if (!dashboardMicroListEl) return;

    var weekMicro = weekMicroTotals();
    var weekLongevity = weekLongevityTotals();
    var html = "";
    microConditionDisplayFields().forEach(function (entry) {
      html += microConditionRowHtml(entry, weekMicro, weekLongevity);
    });
    dashboardMicroListEl.innerHTML = html;
  }

  function renderMicroDailyGrid() {
    if (!dashboardMicroDailyGridEl) return;

    var html = "";
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      var text = el ? el.value : "";
      html += microDayCardHtml(
        day.label,
        day.id,
        microTotalsFromText(text),
        longevityTotalsFromText(text),
        dateLabelForDayId(day.id)
      );
    });
    dashboardMicroDailyGridEl.innerHTML = html;
  }

  function renderMicroRequirements() {
    if (!dashboardMicroListEl) return;

    hideMicroDailyIntakePopover();
    hideMicroAcuteToxicityPopover();
    hideTargetRefPopover();
    syncMicroDailyDvToggleUi();
    syncMicroViewToggleUi();
    syncMicroHintText();
    syncMicroConditionUi();
    syncMicroStatusFilterUi();

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
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) {
      renderHealthTimelineAiPreview();
    }
  }

  function longevityBarRefPopoverLabel(reqAmount) {
    if (!reqAmount) return "";
    return reqAmount.replace(/\s*\/day\s*$/i, "").trim();
  }

  function longevityBarShowsRefNotch(kindLabel, refAmount, pct) {
    if (pct == null || isNaN(pct) || !refAmount) return false;
    return !!targetRefKindKey(kindLabel);
  }

  function longevityBarHtml(pct, limiting, kindLabel, refAmount) {
    if (pct == null || isNaN(pct)) {
      return (
        '<div class="dashboard__longevity-bar dashboard__longevity-bar--empty" aria-hidden="true"></div>'
      );
    }
    var tier = tierForLongevityPct(pct, !!limiting);
    var width = Math.min(100, Math.max(4, pct));
    var color = tier ? tier.color : "#c8c8c4";
    var refLabel = longevityBarRefPopoverLabel(refAmount);
    var showNotch = longevityBarShowsRefNotch(kindLabel, refAmount, pct);
    var notchHtml = showNotch
      ? '<span class="dashboard__longevity-bar-notch" tabindex="0" aria-label="100% reference: ' +
        escapeAttr(refLabel) +
        '"><span class="dashboard__longevity-bar-notch-popover" role="tooltip">' +
        escapeHtml(refLabel) +
        "</span></span>"
      : "";
    return (
      '<div class="dashboard__longevity-bar-wrap">' +
      '<div class="dashboard__longevity-bar" role="presentation" title="' +
      escapeAttr(fmtNum(pct) + "% of daily reference") +
      '"><div class="dashboard__longevity-bar-fill" style="width:' +
      escapeAttr(String(width)) +
      "%;background:" +
      escapeAttr(color) +
      '"></div></div>' +
      notchHtml +
      "</div>"
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

  function longevityGlycemicListOpen() {
    return (
      '<div class="dashboard__longevity-table">' +
      '<div class="dashboard__longevity-thead" aria-hidden="true">' +
      "<span>Metric</span>" +
      "<span>Daily avg</span>" +
      "<span>% target</span>" +
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

  function longevityNavJumpRowHtml(sectionDefKey, label) {
    return (
      '<div class="dashboard__longevity-row dashboard__longevity-row--jump" role="listitem">' +
      '<button type="button" class="dashboard__longevity-name dashboard__longevity-nav-jump-btn" data-longevity-nav-jump="' +
      escapeAttr(sectionDefKey) +
      '">' +
      escapeHtml(label) +
      "</button>" +
      '<span class="dashboard__longevity-amt">—</span>' +
      '<span class="dashboard__longevity-pct dashboard__longevity-pct--jump" aria-hidden="true">→</span>' +
      '<div class="dashboard__longevity-bar dashboard__longevity-bar--empty" aria-hidden="true"></div>' +
      "</div>"
    );
  }

  function longevitySectionWrap(title, sectionDefKey, noteHtml, bodyHtml) {
    var sectionId = sectionDefKey
      ? ' id="longevity-section-' + escapeAttr(sectionDefKey) + '"'
      : "";
    var sectionData = sectionDefKey
      ? ' data-longevity-nav="' + escapeAttr(sectionDefKey) + '"'
      : "";
    return (
      '<section class="dashboard__longevity-section"' +
      sectionId +
      sectionData +
      ">" +
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

  function glycemicLoadTargetPctHtml(glPct, glMax) {
    if (glPct == null || isNaN(glPct) || !glMax) return null;
    return (
      escapeHtml(fmtNum(glPct) + "% of ") +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="glycemicLoad" aria-haspopup="dialog">' +
      escapeHtml(fmtNum(glMax)) +
      "</button>"
    );
  }

  function pufaVitaminEProtectionPctHtml(pufaProtection) {
    if (pufaProtection == null || isNaN(pufaProtection)) return null;
    return (
      '<button type="button" class="dashboard__longevity-tip-link dashboard__longevity-pct-link" data-longevity-def="pufaVitaminEProtection" aria-haspopup="dialog">' +
      escapeHtml(fmtNum(pufaProtection) + "% of target") +
      "</button>"
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
    useMicroDef,
    pctHtml,
    sourcesKey,
    sourcesKind,
    kindLabel,
    kindRefKey,
    refAmount
  ) {
    if (microStickyFilterActive()) {
      var filterKey = sourcesKey || defKey || kindRefKey;
      if (!microKeyMatchesStickyFilter(filterKey)) return "";
    }
    var tier = tierForLongevityPct(pct, !!limiting);
    var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
    var rowCls = "dashboard__longevity-row" + (extraClass ? " " + extraClass : "");
    if (limiting) rowCls += " dashboard__longevity-row--limiting";
    var formName =
      isMicroFormSubtypeKey(defKey) || isMicroFormSubtypeKey(sourcesKey);
    var nameCls =
      "dashboard__longevity-name" +
      (formName ? " dashboard__longevity-name--form" : "");
    var nameHtml;
    if (defKey) {
      rowCls += " dashboard__longevity-row--clickable";
      var defAttr = useMicroDef ? "data-micro-def" : "data-longevity-def";
      nameHtml =
        '<button type="button" class="' +
        nameCls +
        '" ' +
        defAttr +
        '="' +
        escapeAttr(defKey) +
        '" aria-haspopup="dialog">' +
        nutrientLabelHtml(label) +
        "</button>";
    } else {
      nameHtml =
        '<span class="' +
        nameCls +
        '">' +
        nutrientLabelHtml(label) +
        "</span>";
    }
    if (sourcesKey && sourcesKind) {
      nameHtml =
        '<span class="dashboard__longevity-name-wrap">' +
        nameHtml +
        appendMicroDailyIntakeIconHtml(
          longevitySourcesIconHtml(sourcesKey, sourcesKind),
          sourcesKey
        ) +
        "</span>";
    }
    var pctInner = pctHtml || escapeHtml(pctText);
    var longevityPctClass = "dashboard__longevity-pct";
    if (
      targetTextIsAmountOnly({
        pct: pct,
        text: pctHtml ? "" : pctText,
      })
    ) {
      longevityPctClass += " dashboard__longevity-pct--amount";
    }
    var pctBlock =
      '<span class="dashboard__longevity-pct-wrap">' +
      '<span class="' +
      longevityPctClass +
      '"' +
      longevityPctInlineStyle(pct, !!limiting) +
      ">" +
      pctInner +
      "</span>";
    if (kindLabel) {
      pctBlock +=
        '<span class="dashboard__longevity-target-kind-wrap">' +
        targetKindLabelHtml(
          kindLabel,
          "dashboard__longevity-target-kind",
          kindRefKey || defKey || sourcesKey
        ) +
        "</span>";
    }
    pctBlock += "</span>";
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
      pctBlock +
      longevityBarHtml(pct, !!limiting, kindLabel, refAmount) +
      "</div>"
    );
  }

  function longevityRowFromLongevityField(field, weekLongevity, weekMicro) {
    weekMicro = weekMicro || {};
    var total = weekLongevity[field.key];
    var daily = avgDailyLongevity(field.key, total);
    var target = microRowTargetDisplay(field, daily, "longevity", weekMicro);
    var pct = target.pct;
    var pctText = target.text;
    var amtText =
      total > 0
        ? fmtNum(avgDailyLongevity(field.key, total)) + " " + field.unit
        : "—";
    return longevityRowHtml(
      field.label,
      amtText,
      pctText,
      pct,
      "",
      !!field.limiting || !!target.limiting,
      field.key,
      false,
      null,
      field.key,
      "longevity",
      target.kindLabel,
      target.refKey,
      target.reqAmount
    );
  }

  function longevityRowFromMicroKey(microKey, label, limiting, weekMicro) {
    var field = microFieldByKey(microKey);
    var unit = field ? field.unit : "";
    var total =
      microKey === "fiber" ? fiberTotalFromParts(weekMicro) : weekMicro[microKey] || 0;
    var daily = total / weekAverageDayCount();
    var target = microNutrientTargetPct(microKey, daily);
    var pct = target.pct;
    var pctText = target.text;
    var amtText = total > 0 ? fmtNum(daily) + " " + unit : "—";
    return longevityRowHtml(
      label || (field ? field.label : microKey),
      amtText,
      pctText,
      pct,
      "dashboard__longevity-row--from-micro",
      !!limiting || !!target.limiting,
      microKey,
      true,
      null,
      microKey,
      "micro",
      target.kindLabel,
      target.refKey,
      target.reqAmount
    );
  }

  /** Same micro intake scored against a custom upper-limit amount (limiting %). */
  function longevityRowFromMicroLimit(microKey, label, limitAmount, kindLabel, weekMicro) {
    var field = microFieldByKey(microKey);
    var unit = field ? field.unit : "mg";
    var total =
      microKey === "fiber" ? fiberTotalFromParts(weekMicro) : weekMicro[microKey] || 0;
    var daily = total / weekAverageDayCount();
    var pct =
      limitAmount > 0 && daily >= 0 ? (daily / limitAmount) * 100 : null;
    var pctText = formatTargetPctNumber(pct);
    var amtText = total > 0 ? fmtNum(daily) + " " + unit : "—";
    var reqAmount =
      limitAmount > 0 ? fmtNum(limitAmount) + " " + unit + "/day" : "";
    return longevityRowHtml(
      label || (field ? field.label : microKey),
      amtText,
      pctText,
      pct,
      "dashboard__longevity-row--from-micro",
      true,
      microKey,
      true,
      null,
      microKey,
      "micro",
      kindLabel,
      microKey,
      reqAmount
    );
  }

  function vascularSodiumLimitRowsHtml(weekMicro) {
    return VASCULAR_SODIUM_LIMIT_REFS.map(function (ref) {
      return longevityRowFromMicroLimit(
        "sodium",
        ref.label,
        ref.amount,
        ref.kindLabel,
        weekMicro
      );
    }).join("");
  }

  function longevityRowFromProtein(weekMacro, label) {
    var total = weekMacro.protein || 0;
    var daily = total / weekAverageDayCount();
    var target = proteinTargetPct(daily);
    var amtText = total > 0 ? fmtNum(daily) + " g" : "—";
    var proteinReqAmount = dailyProteinTargetG()
      ? fmtNum(dailyProteinTargetG()) + " g/day"
      : "";
    return longevityRowHtml(
      label || "Protein — satiety & lean mass",
      amtText,
      target.text,
      target.pct,
      "dashboard__longevity-row--from-macro",
      false,
      null,
      false,
      null,
      "protein",
      "macro",
      target.kindLabel,
      target.refKey,
      proteinReqAmount
    );
  }

  function longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro) {
    var key = item.key;
    if (LONGEVITY_KEYS_ALSO_IN_MICRO[key] && weekMicro[key] > 0) {
      return longevityRowFromMicroKey(key, item.label, !!item.limiting, weekMicro);
    }
    var field = longevityFieldByKey(key);
    if (!field) return "";
    return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
  }

  function longevityRowsGroupedByLimit(fields, weekLongevity, weekMicro) {
    weekMicro = weekMicro || {};
    var watch = [];
    var aim = [];
    fields.forEach(function (field) {
      if (field.limiting || (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key] && studyMaxMicroRef(field.key))) {
        watch.push(field);
      }
      else aim.push(field);
    });
    var html = "";
    if (watch.length) {
      html += longevitySubgroupHtml("Watch — lower % DV is better", "limit");
      watch.forEach(function (field) {
        html += longevityRowFromLongevityField(field, weekLongevity, weekMicro);
      });
    }
    if (aim.length) {
      html += longevitySubgroupHtml("Aim — higher % DV is better", "aim");
      aim.forEach(function (field) {
        html += longevityRowFromLongevityField(field, weekLongevity, weekMicro);
      });
    }
    return html;
  }

  function renderLongevityGiBuckets(buckets) {
    var sum = buckets.low + buckets.med + buckets.high;
    if (sum <= 0) {
      return '<p class="dashboard__longevity-note dashboard__longevity-note--gi">No GI data yet — add glycemic index and carbs on matched foods.</p>';
    }
    var dayCount = weekAverageDayCount();
    var pct = function (v) {
      return Math.round((v / sum) * 100);
    };
    var dailyAvg = function (v) {
      return v / dayCount;
    };
    var barMaxPx = 56;
    var giCol = function (carbVal, glVal, cls, tier, range) {
      var share = pct(carbVal);
      var dailyCarbs = dailyAvg(carbVal);
      var dailyGl = dailyAvg(glVal);
      var height = Math.max(4, Math.round((share / 100) * barMaxPx));
      return (
        '<div class="dashboard__gi-col">' +
        '<div class="dashboard__gi-bar-slot">' +
        '<div class="dashboard__gi-bucket-bar dashboard__gi-bucket-bar--' +
        cls +
        '" style="height:' +
        height +
        'px" title="' +
        escapeAttr(
          fmtNum(dailyGl) +
            " GL · " +
            fmtNum(dailyCarbs) +
            " g carbs/day · " +
            share +
            "% of carbs"
        ) +
        '"></div></div>' +
        '<div class="dashboard__gi-bucket-label">' +
        '<div class="dashboard__gi-bucket-tier">' +
        escapeHtml(tier) +
        "</div>" +
        '<div class="dashboard__gi-bucket-sub">' +
        escapeHtml(range) +
        "</div>" +
        '<div class="dashboard__gi-bucket-meta">' +
        escapeHtml(
          fmtNum(dailyGl) + " GL · " + fmtNum(dailyCarbs) + " g · " + share + "%"
        ) +
        "</div></div></div>"
      );
    };
    return (
      '<div class="dashboard__gi-section">' +
      '<div class="dashboard__gi-chart">' +
      '<p class="dashboard__gi-chart-title">GI distribution</p>' +
      '<div class="dashboard__gi-bars">' +
      giCol(buckets.low, buckets.lowGl, "low", "Low GI", "≤55") +
      giCol(buckets.med, buckets.medGl, "med", "Med GI", "56–69") +
      giCol(buckets.high, buckets.highGl, "high", "High GI", "≥70") +
      "</div></div></div>"
    );
  }

  function renderLongevityPanel() {
    hideTargetRefPopover();
    if (!dashboardLongevityContentEl) return;

    hideMicroDailyIntakePopover();
    hideMicroAcuteToxicityPopover();
    var weekLongevity = weekLongevityTotals();
    var weekMicro = weekMicroTotals();
    var weekMacro = weekMacroTotals();
    var derived = computeLongevityDerived(weekLongevity, weekMicro);
    var html = longevityLegendHtml();

    html += longevitySectionWrap(
      "Micronutrients from food",
      "sectionMicronutrients",
      '<p class="dashboard__longevity-note">Same values as your micro entries—shown here so you can reason about longevity alongside fats, compounds, and carbs. Sodium uses inverted colors (high % DV is a concern).</p>',
      longevityListOpen() +
        longevitySubgroupHtml("Watch — lower % DV is better", "limit") +
        MICRO_FIELDS.filter(function (field) {
          return field.key !== "fiber" && !!LONGEVITY_MICRO_LIMITING_KEYS[field.key];
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
          return field.key !== "fiber" && !LONGEVITY_MICRO_LIMITING_KEYS[field.key];
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

    var o6o3Display = omega6To3RowDisplay(derived);
    var o6o3Note = o6o3Display.note;
    var o6o3Text = o6o3Display.text;
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
      "Fiber & colon health",
      "sectionFiber",
      '<p class="dashboard__longevity-note">Same fiber value as your micro entries—grouped here for colon health and disease prevention.</p>' +
        fiberColonTipHtml() +
        berberineTipHtml("gut"),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        longevityRowFromMicroKey("fiber", "Fiber", false, weekMicro) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Upper GI Motility",
      "sectionUpperGiMotility",
      '<p class="dashboard__longevity-note">Tracks nutrients that support general gut motility and upper GI emptying, bile production, LES tone / reflux barrier, plus bile/liver levers that move food through the esophagus, stomach, and duodenum—not only colon fiber.</p>' +
        upperGiWhatIsTipHtml() +
        upperGiBileMotilityTipHtml() +
        upperGiBileProductionTipHtml() +
        upperGiBileGastricEmptyingTipHtml() +
        upperGiBittersTipHtml() +
        upperGiBileHerbsTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("General gut motility — from micro entries", "micro") +
        upperGiB1B6TipHtml() +
        longevityRowFromMicroKey(
          "thiamin",
          "Vitamin B1 (Thiamine) — autonomic nervous system & digestion",
          false,
          weekMicro
        ) +
        longevityRowFromMicroKey(
          "vitaminB6",
          "Vitamin B6 (Pyridoxine) — neurotransmitters for smooth-muscle movement",
          false,
          weekMicro
        ) +
        upperGiMagnesiumTipHtml() +
        longevityRowFromMicroKey(
          "magnesium",
          "Magnesium — muscle contraction & relaxation along the gut",
          false,
          weekMicro
        ) +
        upperGiZincTipHtml() +
        longevityRowFromMicroKey(
          "zinc",
          "Zinc — stomach acid (HCl), gastrin & motilin support",
          false,
          weekMicro
        ) +
        longevitySubgroupHtml("Upper GI — from micro entries", "micro") +
        upperGiDeficiencyTipHtml() +
        LONGEVITY_UPPER_GI_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Bile production support — from micro entries", "micro") +
        upperGiBileNutrientsTipHtml() +
        LONGEVITY_UPPER_GI_BILE_PRODUCTION_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("LES tone & reflux barrier", "aim") +
        upperGiLesWhatIsTipHtml() +
        upperGiLesNutrientsCaveatTipHtml() +
        longevitySubgroupHtml("Supports LES / antireflux barrier — aim", "aim") +
        upperGiLesSolubleFiberTipHtml() +
        longevityRowFromMicroKey(
          "solubleFiber",
          "Soluble fiber — LES resting pressure & lower abdominal pressure",
          false,
          weekMicro
        ) +
        upperGiLesProteinTipHtml() +
        longevityRowFromProtein(
          weekMacro,
          "Protein — gastrin support for temporary LES pressure (prefer lean)"
        ) +
        upperGiLesFatWatchTipHtml() +
        upperGiLesZincTipHtml() +
        longevityRowFromMicroKey(
          "zinc",
          "Zinc — esophageal tissue maintenance & repair",
          false,
          weekMicro
        ) +
        longevitySubgroupHtml(
          "Watch — high-fat pattern may lower LES / delay emptying",
          "limit"
        ) +
        LONGEVITY_UPPER_GI_LES_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(
            {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: true,
            },
            weekLongevity,
            weekMicro
          );
        }).join("") +
        upperGiLesTriggersTipHtml() +
        upperGiLesLifestyleTipHtml() +
        longevitySubgroupHtml(
          "Liver health — bile production & upper GI motility (same rows as Liver health)",
          "compounds"
        ) +
        upperGiLiverFocusTipHtml() +
        longevitySubgroupHtml("Liver-protective compounds", "compounds") +
        LONGEVITY_LIVER_PROTECTIVE_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Glutathione precursors & recycling — from micro entries", "micro") +
        LONGEVITY_LIVER_PRECURSORS_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionGlutathione",
          "Glutathione support — full precursor & enzyme set"
        ) +
        longevitySubgroupHtml("Choline & methyl donors — fatty liver prevention", "micro") +
        LONGEVITY_LIVER_CHOLINE_METHYL_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Choline & methyl donors — from longevity entries", "compounds") +
        LONGEVITY_LIVER_CHOLINE_METHYL_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          if (!item.limiting && field.limiting) {
            field = {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: false,
            };
          }
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Antioxidant & membrane protection — from micro entries", "micro") +
        LONGEVITY_LIVER_ANTIOXIDANT_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml(
          "Antioxidant & membrane protection — from longevity entries",
          "compounds"
        ) +
        LONGEVITY_LIVER_ANTIOXIDANT_FROM_LONGEVITY.map(function (item) {
          return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml(
          "Weight, glucose & triglyceride support — from micro entries",
          "micro"
        ) +
        LONGEVITY_LIVER_METABOLIC_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml(
          "Weight, glucose & triglyceride support — from longevity entries",
          "compounds"
        ) +
        LONGEVITY_LIVER_METABOLIC_FROM_LONGEVITY.map(function (item) {
          if (item.key === "omega3") {
            return longevityRowFromEffectiveOmega3(weekLongevity, weekMicro, item.label);
          }
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          if (!item.limiting && field.limiting) {
            field = {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: false,
            };
          }
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Caution — excess can burden the liver", "limit") +
        LONGEVITY_LIVER_WATCH_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Watch — lower is better for fatty liver risk", "limit") +
        LONGEVITY_LIVER_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Jump to related areas", "neutral") +
        longevityNavJumpRowHtml("sectionLiver", "Liver health — full section") +
        longevityNavJumpRowHtml("sectionFiber", "Fiber & colon health") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Thyroid health",
      "sectionThyroid",
      '<p class="dashboard__longevity-note">Same iodine, vitamin A, and cofactor values as your micro entries plus omega-3 from longevity—grouped here because thyroid needs tighten with age, especially after 60.</p>' +
        thyroidHealthTipHtml() +
        thyroidOmega3TipHtml() +
        thyroidVitaminATipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_THYROID_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("From your longevity entries", "compounds") +
        LONGEVITY_THYROID_FROM_LONGEVITY.map(function (item) {
          if (item.key === "omega3") {
            return longevityRowFromEffectiveOmega3(weekLongevity, weekMicro, item.label);
          }
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Watch — lower is better", "limit") +
        LONGEVITY_THYROID_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
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
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Liver health",
      "sectionLiver",
      '<p class="dashboard__longevity-note">Tracks liver-protective compounds (alpha-lipoic acid, glutathione) plus choline/methyl donors, antioxidants, and metabolic nutrients that support healthy weight, blood sugar, and triglycerides—grouped here because fatty liver, detoxification capacity, and long-term liver-cancer risk are tightly linked to diet.</p>' +
        liverHealthTipHtml() +
        liverSupplementsTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Liver-protective compounds", "compounds") +
        LONGEVITY_LIVER_PROTECTIVE_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Glutathione precursors & recycling — from micro entries", "micro") +
        LONGEVITY_LIVER_PRECURSORS_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionGlutathione",
          "Glutathione support — full precursor & enzyme set"
        ) +
        longevitySubgroupHtml("Choline & methyl donors — fatty liver prevention", "micro") +
        LONGEVITY_LIVER_CHOLINE_METHYL_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Choline & methyl donors — from longevity entries", "compounds") +
        LONGEVITY_LIVER_CHOLINE_METHYL_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          if (!item.limiting && field.limiting) {
            field = {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: false,
            };
          }
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Antioxidant & membrane protection — from micro entries", "micro") +
        LONGEVITY_LIVER_ANTIOXIDANT_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml(
          "Antioxidant & membrane protection — from longevity entries",
          "compounds"
        ) +
        LONGEVITY_LIVER_ANTIOXIDANT_FROM_LONGEVITY.map(function (item) {
          return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml(
          "Weight, glucose & triglyceride support — from micro entries",
          "micro"
        ) +
        LONGEVITY_LIVER_METABOLIC_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml(
          "Weight, glucose & triglyceride support — from longevity entries",
          "compounds"
        ) +
        LONGEVITY_LIVER_METABOLIC_FROM_LONGEVITY.map(function (item) {
          if (item.key === "omega3") {
            return longevityRowFromEffectiveOmega3(weekLongevity, weekMicro, item.label);
          }
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          if (!item.limiting && field.limiting) {
            field = {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: false,
            };
          }
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Caution — excess can burden the liver", "limit") +
        LONGEVITY_LIVER_WATCH_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Watch — lower is better for fatty liver risk", "limit") +
        LONGEVITY_LIVER_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Jump to related metabolic areas", "neutral") +
        longevityNavJumpRowHtml(
          "sectionVisceralFat",
          "Visceral fat — healthy weight & deep abdominal fat"
        ) +
        longevityNavJumpRowHtml(
          "sectionInsulinResistance",
          "Insulin resistance / sensitivity — diabetes & blood sugar"
        ) +
        longevityNavJumpRowHtml(
          "sectionFats",
          "Fats & cholesterol — triglycerides & lipid pattern"
        ) +
        longevityNavJumpRowHtml(
          "sectionGlycemic",
          "Glycemic load & GI distribution"
        ) +
        longevityNavJumpRowHtml("sectionFatGain", "Fat gain") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Kidney health",
      "sectionKidney",
      '<p class="dashboard__longevity-note">Tracks sodium (lower is better), potassium from food when kidneys are healthy, protein load, and the blood-pressure, glucose, weight, and cholesterol nutrients that protect kidneys from chronic stress—plus micronutrients needed for overall health without megadosing when kidney function is reduced.</p>' +
        kidneyHealthTipHtml() +
        kidneyHerbsDirectTipHtml() +
        kidneyHerbsBloodPressureTipHtml() +
        kidneyHerbsBloodGlucoseTipHtml() +
        kidneyHerbsWeightTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Electrolytes — sodium & potassium", "limit") +
        LONGEVITY_KIDNEY_ELECTROLYTE_WATCH_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Potassium — aim from food when kidneys are healthy", "aim") +
        kidneyPotassiumFoodTipHtml() +
        LONGEVITY_KIDNEY_ELECTROLYTE_AIM_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        kidneyPotassiumCkdTipHtml() +
        longevitySubgroupHtml("Protein load", "neutral") +
        kidneyProteinTipHtml() +
        longevityRowFromProtein(
          weekMacro,
          "Protein — essential, but excess raises kidney nitrogen load"
        ) +
        longevitySubgroupHtml(
          "Blood pressure — high BP damages kidney filters",
          "aim"
        ) +
        LONGEVITY_KIDNEY_BP_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Blood pressure — from longevity entries", "compounds") +
        LONGEVITY_KIDNEY_BP_FROM_LONGEVITY.map(function (item) {
          if (item.key === "omega3") {
            return longevityRowFromEffectiveOmega3(weekLongevity, weekMicro, item.label);
          }
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionVascularBloodPressure",
          "Vascular - Blood Pressure — full sodium / potassium / DASH set"
        ) +
        longevitySubgroupHtml(
          "Blood glucose — diabetes is a leading cause of kidney disease",
          "aim"
        ) +
        LONGEVITY_KIDNEY_GLUCOSE_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Blood glucose — from longevity entries", "compounds") +
        LONGEVITY_KIDNEY_GLUCOSE_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Blood glucose — watch (lower is better)", "limit") +
        LONGEVITY_KIDNEY_GLUCOSE_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionInsulinResistance",
          "Insulin resistance / sensitivity — diabetes & blood sugar"
        ) +
        longevityNavJumpRowHtml(
          "sectionGlycemic",
          "Glycemic load & GI distribution"
        ) +
        longevitySubgroupHtml(
          "Weight & cholesterol — excess weight and lipids stress kidneys",
          "aim"
        ) +
        LONGEVITY_KIDNEY_WEIGHT_CHOL_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Weight & cholesterol — from longevity entries", "compounds") +
        LONGEVITY_KIDNEY_WEIGHT_CHOL_FROM_LONGEVITY.map(function (item) {
          if (item.key === "omega3") {
            return longevityRowFromEffectiveOmega3(weekLongevity, weekMicro, item.label);
          }
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Weight & cholesterol — watch (lower is better)", "limit") +
        LONGEVITY_KIDNEY_WEIGHT_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionVisceralFat",
          "Visceral fat — healthy weight & deep abdominal fat"
        ) +
        longevityNavJumpRowHtml(
          "sectionFats",
          "Fats & cholesterol — triglycerides & lipid pattern"
        ) +
        longevityNavJumpRowHtml("sectionFatGain", "Fat gain") +
        longevitySubgroupHtml(
          "Magnesium, vitamin D & other micronutrients",
          "micro"
        ) +
        kidneyMicronutrientCautionTipHtml() +
        LONGEVITY_KIDNEY_MICRONUTRIENTS_FROM_MICRO.map(function (item) {
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
      "Gray hair",
      "sectionGrayHair",
      '<p class="dashboard__longevity-note">Same B12, folate, iron, copper, zinc, vitamin D, and iodine values as your micro entries—plus the full Stress resilience nutrient set (micro + longevity compounds)—grouped here for premature graying, thyroid-related pigment loss, and stress-accelerated canities.</p>' +
        grayHairTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Deficiency nutrients linked to premature graying", "micro") +
        LONGEVITY_GRAY_HAIR_DEFICIENCY_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Thyroid disease — pigment & hormone cofactors", "micro") +
        LONGEVITY_GRAY_HAIR_THYROID_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionThyroid",
          "Thyroid health — full cofactor set (iron, zinc, tyrosine, vitamin A, omega-3)"
        ) +
        longevitySubgroupHtml("Stress resilience — from your micro entries", "micro") +
        LONGEVITY_STRESS_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Stress resilience — from your longevity entries", "compounds") +
        LONGEVITY_STRESS_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityNavJumpRowHtml(
          "sectionStressResilience",
          "Stress resilience — same nutrient set in the dedicated section"
        ) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Bone density",
      "sectionBoneDensity",
      '<p class="dashboard__longevity-note">Same calcium, magnesium, vitamin D, and vitamin K values as your micro entries—plus K1/K2 and MK-4/MK-7 when you have a breakdown—grouped here for fracture and osteoporosis prevention.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_BONE_FROM_MICRO.map(function (item) {
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
      "Aches",
      "sectionAches",
      '<p class="dashboard__longevity-note">Muscle aches, joint stiffness, and body pain often worsen with age—but specific nutrient gaps can make them worse. This section groups nutrients that support vitamin D status (a common driver of unexplained aches), reduce chronic inflammation in joints and muscles, maintain cartilage and synovial fluid, and address age-related conditions like osteomalacia, neuropathic pain, cramps, and statin-related myalgia.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("Vitamin D status", "micro") +
        achesVitaminDTipHtml() +
        LONGEVITY_ACHES_VITAMIN_D_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Anti-inflammatory support — from micro entries", "micro") +
        achesAntiInflammatoryTipHtml() +
        LONGEVITY_ACHES_ANTI_INFLAMMATORY_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Anti-inflammatory support — from longevity entries", "compounds") +
        LONGEVITY_ACHES_ANTI_INFLAMMATORY_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Inflammatory balance — watch ratio", "limit") +
        longevityRowHtml(
          "Omega-6 : Omega-3 — inflammatory tone",
          o6o3Note,
          o6o3Text,
          null,
          "dashboard__longevity-row--computed",
          true,
          "omega6To3",
          false
        ) +
        longevitySubgroupHtml("Joint lubrication & cartilage — from micro entries", "micro") +
        achesJointLubricationTipHtml() +
        LONGEVITY_ACHES_JOINT_LUBRICATION_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Joint lubrication & cartilage — from longevity entries", "compounds") +
        LONGEVITY_ACHES_JOINT_LUBRICATION_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Age-related aches & deficiency patterns — from micro entries", "micro") +
        achesAgeRelatedTipHtml() +
        LONGEVITY_ACHES_AGE_RELATED_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Age-related aches — from longevity entries", "compounds") +
        LONGEVITY_ACHES_AGE_RELATED_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Stress resilience",
      "sectionStressResilience",
      '<p class="dashboard__longevity-note">Chronic stress drains magnesium, B vitamins, and vitamin C; these nutrients support cortisol balance, adrenal cofactors, and HPA-axis resilience when intake is low.</p>' +
        stressResilienceTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_STRESS_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("From your longevity entries", "compounds") +
        LONGEVITY_STRESS_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Staying sharp & lowering dementia risk",
      "sectionBrainLongevity",
      '<p class="dashboard__longevity-note">Brain longevity depends on glutamate balance, astrocyte glutamate clearance, blood flow, blood sugar control, and micronutrient support\u2014not a single memory pill. The MIND diet pattern (leafy greens, berries, nuts, fish, olive oil) provides the foundation; these nutrients support the signaling, structure, and energy systems that keep cognition sharp.</p>' +
        brainLongevityTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_BRAIN_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("From your longevity entries", "compounds") +
        LONGEVITY_BRAIN_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Astrocyte support — from micro entries", "micro") +
        brainAstrocyteSupportTipHtml() +
        LONGEVITY_BRAIN_ASTROCYTE_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Astrocyte support — from longevity entries", "compounds") +
        LONGEVITY_BRAIN_ASTROCYTE_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Sleep health",
      "sectionSleepHealth",
      '<p class="dashboard__longevity-note">Quality of life depends on rest, and uninterrupted sleep usually gets harder with age; these nutrients support the pathways that help when intake is low.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_SLEEP_FROM_MICRO.map(function (item) {
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
      "Mitochondrial health & cellular energy",
      "sectionMitochondrial",
      '<p class="dashboard__longevity-note">B vitamins build <button type="button" class="dashboard__longevity-tip-link" data-longevity-def="nad" aria-haspopup="dialog">NAD</button> and related cofactors (FAD, coenzyme A); tryptophan, NR, and NMN also feed NAD; polyphenols and resveratrol help preserve it (resveratrol also activates sirtuins); alpha-lipoic acid is a cofactor for the pyruvate and α-ketoglutarate dehydrogenase complexes that feed the TCA cycle; magnesium and iron support ATP production; carnitine shuttles fatty acids into mitochondria for β-oxidation, while creatine buffers ATP via phosphocreatine; CoQ10 (is also a nutrient) carries electrons in mitochondria, and copper powers Complex IV (cytochrome c oxidase) at the end of the electron transport chain; PQQ (pyrroloquinoline quinone) from plant and fermented foods promotes mitochondrial biogenesis (building new mitochondria via PGC-1α) and acts as a durable antioxidant; manganese (MnSOD), zinc (CuZn-SOD), selenium (glutathione peroxidase), and glutathione defend mitochondria and mtDNA from oxidative stress; choline builds phosphatidylcholine, a major mitochondrial membrane phospholipid that keeps membranes intact and fluid so the electron transport chain can make ATP; EPA and DHA (both) incorporate into mitochondrial membranes. These repeat values from your micro and longevity entries so you can spot gaps in cellular fuel—not just general % DV.</p>' +
        mitochondrialEnergyTipHtml() +
        mitochondrialNadTipHtml() +
        mitochondrialNadPrecursorsTipHtml() +
        mitochondrialSupplementsTipHtml() +
        mitochondrialUrolithinTipHtml() +
        mitochondrialLifestyleTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_MITO_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("From your longevity entries", "compounds") +
        LONGEVITY_MITO_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(
            {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: !!item.limiting,
            },
            weekLongevity,
            weekMicro
          );
        }).join("") +
        mitochondrialOmega3TipHtml() +
        LONGEVITY_MITO_OMEGA_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(
            {
              key: field.key,
              label: item.label || field.label,
              unit: field.unit,
              code: field.code,
              group: field.group,
              limiting: !!item.limiting,
            },
            weekLongevity,
            weekMicro
          );
        }).join("") +
        vascularEpaDhaRowHtml(
          derived,
          "EPA + DHA — combined mitochondrial membrane omega-3s"
        ) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Cellular aging & senomorphics",
      "sectionCellularAging",
        '<p class="dashboard__longevity-note">Vitamin D downregulates chronic age-related inflammation; vitamin C and E neutralize free radicals that damage DNA. Essential vitamins act like a shield against oxidative stress—the senomorphic side of longevity. See the note below on food vs supplement senolytics.</p>' +
        senomorphicsTipHtml() +
        cellularAgingSenolyticsTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        LONGEVITY_CELLULAR_AGING_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("From your longevity entries", "compounds") +
        LONGEVITY_CELLULAR_AGING_FROM_LONGEVITY.map(function (item) {
          return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
        }).join("") +
        longevityListClose()
    );

    html += carbSectionHtml();
    html += glycemicSectionHtml();

    html += longevitySectionWrap(
      "Insulin resistance / sensitivity",
      "sectionInsulinResistance",
      '<p class="dashboard__longevity-note">Aim for magnesium, fiber, vitamin D, omega-3s, and monounsaturated fat; watch saturated fat, refined carbs, and added sugar. When calorie-dense sources of those fats and fast carbs dominate, that pattern can support fat gain and insulin resistance over time—not from any single meal, but from years of excess.</p>' +
        kidneyHerbsBloodGlucoseTipHtml() +
        berberineTipHtml("bloodSugar"),
      longevityListOpen() +
        longevitySubgroupHtml("Aim — higher % DV is better", "aim") +
        LONGEVITY_INSULIN_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_INSULIN_AIM_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Watch — lower % DV is better", "limit") +
        LONGEVITY_INSULIN_WATCH_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml(
          "Jump to other areas that need to be optimized for insulin resistance / sensitivity",
          "neutral"
        ) +
        longevityNavJumpRowHtml("sectionCarb", "Carb quality") +
        longevityNavJumpRowHtml("sectionGlycemic", "Glycemic load & GI distribution") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Visceral fat",
      "sectionVisceralFat",
      '<p class="dashboard__longevity-note">Visceral fat is the deep abdominal fat linked to insulin resistance, inflammation, and cardiometabolic risk. Track nutrients below that help reduce buildup, mobilize stored fat for energy, and support gut incretin signaling—alongside exercise, sleep, and stress management.</p>' +
        kidneyHerbsWeightTipHtml() +
        visceralFatBuildupTipHtml() +
        visceralFatMobilizationTipHtml() +
        visceralFatGlpTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Nutrients that help reduce visceral fat buildup", "aim") +
        longevityRowFromMicroKey(
          "fiber",
          "Fiber — satiety & gut support",
          false,
          weekMicro
        ) +
        longevityRowFromProtein(weekMacro) +
        LONGEVITY_VISCERAL_FAT_REDUCE_BUILDUP_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_VISCERAL_FAT_REDUCE_BUILDUP_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Antioxidants — higher % DV is better", "aim") +
        LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_VISCERAL_FAT_ANTIOXIDANTS_FROM_LONGEVITY.map(function (item) {
          return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml(
          "Nutrients that support mobilizing fat for energy",
          "aim"
        ) +
        LONGEVITY_VISCERAL_FAT_MOBILIZE_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_VISCERAL_FAT_MOBILIZE_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Gut incretin support (GLP-like)", "aim") +
        LONGEVITY_VISCERAL_FAT_GLP_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_VISCERAL_FAT_GLP_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Jump to related areas", "neutral") +
        longevityNavJumpRowHtml("sectionFatGain", "Fat gain") +
        longevityNavJumpRowHtml(
          "sectionInsulinResistance",
          "Insulin resistance / sensitivity"
        ) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Fat gain",
      "sectionFatGain",
      '<p class="dashboard__longevity-note">Age-related fat gain is driven by muscle loss, slower metabolism, gradual loss of insulin sensitivity (cells need more insulin over time), poor sleep, and chronic cortisol—not just calories. These nutrients support the pathways that help you burn fuel and stay leaner over decades; jump links below cover related areas outside this list.</p>' +
        kidneyHerbsWeightTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Nutrients that support fat from aging", "aim") +
        LONGEVITY_FAT_GAIN_AGING_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_FAT_GAIN_AGING_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml(
          "Nutrients that support using food for energy rather than storing it as fat",
          "aim"
        ) +
        LONGEVITY_FAT_GAIN_ENERGY_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_FAT_GAIN_ENERGY_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Gut producing GLP-like compounds", "aim") +
        LONGEVITY_FAT_GAIN_GLP_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        LONGEVITY_FAT_GAIN_GLP_FROM_LONGEVITY.map(function (item) {
          var field = longevityFieldByKey(item.key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevitySubgroupHtml("Jump to related areas for fat gain", "neutral") +
        longevityNavJumpRowHtml(
          "sectionInsulinResistance",
          "Insulin resistance / sensitivity"
        ) +
        longevityNavJumpRowHtml(
          "sectionSleepHealth",
          "Sleep health — poor sleep can promote fat gain"
        ) +
        longevityNavJumpRowHtml(
          "sectionStressResilience",
          "Stress resilience — cortisol can promote fat gain"
        ) +
        longevityListClose()
    );

    var pufaRatio = derived.pufaVitaminERatio;
    var pufaProtection = derived.pufaVitaminEProtection;
    function pufaAntioxidantSectionHtml() {
      return longevitySectionWrap(
        "Fat oxidation & antioxidant protection",
        "sectionPufaAntioxidant",
        pufaAntioxidantTipHtml(),
        longevityListOpen() +
          longevitySubgroupHtml("Your intake", "aim") +
          (function () {
            var pufaField = longevityFieldByKey("polyunsaturatedFat");
            var vitEField = longevityFieldByKey("vitaminE");
            var rows = "";
            if (pufaField) rows += longevityRowFromLongevityField(pufaField, weekLongevity, weekMicro);
            if (vitEField) rows += longevityRowFromLongevityField(vitEField, weekLongevity, weekMicro);
            return rows;
          })() +
          longevitySubgroupHtml("Protection score — higher is better", "aim") +
          longevityRowHtml(
            "Vitamin E : PUFA",
            pufaRatio == null || isNaN(pufaRatio)
              ? "—"
              : fmtNum(pufaRatio) + " mg/g",
            pufaProtection == null || isNaN(pufaProtection)
              ? "—"
              : fmtNum(pufaProtection) + "% of target",
            pufaProtection,
            "dashboard__longevity-row--computed",
            false,
            "pufaVitaminEProtection",
            false,
            pufaVitaminEProtectionPctHtml(pufaProtection)
          ) +
          longevitySubgroupHtml(
            "Other nutrients that support antioxidant recycling",
            "aim"
          ) +
          LONGEVITY_PUFA_ANTIOXIDANT_SUPPORT_FROM_MICRO.map(function (item) {
            return longevityRowFromMicroKey(
              item.microKey,
              item.label,
              false,
              weekMicro
            );
          }).join("") +
          LONGEVITY_PUFA_ANTIOXIDANT_SUPPORT_FROM_LONGEVITY.map(function (item) {
            return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
          }).join("") +
          longevityListClose()
      );
    }

    function carbSectionHtml() {
      var groupFields = LONGEVITY_FIELDS.filter(function (field) {
        return field.group === "carb";
      });
      if (!groupFields.length) return "";
      return longevitySectionWrap(
        "Carb quality",
        "sectionCarb",
        "",
        longevityListOpen() +
          longevityRowsGroupedByLimit(groupFields, weekLongevity, weekMicro) +
          longevityListClose()
      );
    }

    function glycemicSectionHtml() {
      return longevitySectionWrap(
        "Glycemic load & GI distribution",
        "sectionGlycemic",
        '<p class="dashboard__longevity-note">GL = GI × carbs per serving ÷ 100 — a meal-impact score, not blood glucose or a vitamin % DV.</p>',
        longevityGlycemicListOpen() +
          (function () {
            var gi = derived.giSummary;
            var avgGi = gi ? gi.avgGi : null;
            var giPct = giLimitPctFromAvg(avgGi);
            var pctText = giTierSummaryLabel(avgGi);
            if (gi && gi.highShare > 0) {
              pctText += " · " + gi.highShare + "% high GI carbs";
            }
            return (
              longevitySubgroupHtml(
                "Glycemic index — carb-weighted from matched foods",
                "micro"
              ) +
              longevityRowHtml(
                "Glycemic index",
                avgGi == null || isNaN(avgGi) ? "—" : fmtNum(avgGi) + " avg GI",
                pctText,
                giPct,
                "dashboard__longevity-row--computed",
                true,
                "glycemicIndex",
                false,
                null,
                "glycemicLoad",
                "glycemicLoad"
              )
            );
          })() +
          longevitySubgroupHtml("Watch — lower glycemic load is better", "limit") +
          (function () {
            var glMax = longevityDvStatus.glycemicLoadMaxPerDay;
            var gl = derived.weekGl;
            var glPct = gl > 0 && glMax > 0 ? (gl / glMax) * 100 : null;
            return longevityRowHtml(
              "Avg daily glycemic load",
              gl > 0 ? fmtNum(gl) + " GL" : "—",
              glPct == null || isNaN(glPct)
                ? "—"
                : fmtNum(glPct) + "% of " + fmtNum(glMax),
              glPct,
              "dashboard__longevity-row--computed",
              true,
              "glycemicLoad",
              false,
              glycemicLoadTargetPctHtml(glPct, glMax),
              "glycemicLoad",
              "glycemicLoad"
            );
          })() +
          longevityListClose() +
          renderLongevityGiBuckets(derived.giBuckets)
      );
    }

    function histamineSectionHtml() {
      return longevitySectionWrap(
        "Histamine tolerance & quality of life",
        "sectionHistamine",
        '<p class="dashboard__longevity-note">Histamine tolerance affects quality of life through headaches, flushing, congestion, hives, sleep disruption, GI symptoms, and exercise tolerance. Food histamine is too storage- and fermentation-dependent to score here, so this section tracks breakdown and inflammatory-tolerance supports instead.</p>' +
          histamineTipHtml(),
        longevityListOpen() +
          longevitySubgroupHtml("Breakdown & tolerance support", "aim") +
          LONGEVITY_HISTAMINE_FROM_MICRO.map(function (item) {
            return longevityRowFromMicroKey(
              item.microKey,
              item.label,
              false,
              weekMicro
            );
          }).join("") +
          LONGEVITY_HISTAMINE_FROM_LONGEVITY.map(function (item) {
            return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
          }).join("") +
          longevityRowHtml(
            LONGEVITY_HISTAMINE_EPA_DHA_LABEL,
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
    }

    LONGEVITY_GROUPS.forEach(function (group) {
      if (group.id === "carb") return;
      if (group.id === "glutathione") {
        html += longevitySectionWrap(
          "Glutathione support",
          "sectionGlutathione",
          '<p class="dashboard__longevity-note">Glutathione is a tripeptide antioxidant your body makes from cysteine, glycine, and glutamate. This section repeats supporting nutrients that help supply precursors, recycle glutathione, and activate glutathione-related enzymes involved in oxidative stress defense, immune function, and detoxification.</p>',
          longevityListOpen() +
            longevitySubgroupHtml("From your micro entries", "micro") +
            LONGEVITY_GLUTATHIONE_FROM_MICRO.map(function (item) {
              return longevityRowFromMicroKey(
                item.microKey,
                item.label,
                !!item.limiting,
                weekMicro
              );
            }).join("") +
            longevitySubgroupHtml("From your longevity entries", "compounds") +
            LONGEVITY_GLUTATHIONE_FROM_LONGEVITY.map(function (item) {
              return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
            }).join("") +
            longevityListClose()
        );
        return;
      }
      if (group.id === "dnaRepair") {
        html += longevitySectionWrap(
          "DNA repair support",
          "sectionDnaRepair",
          '<p class="dashboard__longevity-note">These nutrients do not instantly undo DNA damage, but they support the systems that prevent and repair it: antioxidant defenses for free-radical damage, B vitamins for nucleotide and methylation chemistry, and minerals used by DNA repair and replication enzymes.</p>',
          longevityListOpen() +
            longevitySubgroupHtml("From your micro entries", "micro") +
            LONGEVITY_DNA_REPAIR_FROM_MICRO.map(function (item) {
              return longevityRowFromMicroKey(
                item.microKey,
                item.label,
                !!item.limiting,
                weekMicro
              );
            }).join("") +
            longevitySubgroupHtml("From your longevity entries", "compounds") +
            LONGEVITY_DNA_REPAIR_FROM_LONGEVITY.map(function (item) {
              return longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
            }).join("") +
            longevityListClose()
        );
        return;
      }
      var groupFields = LONGEVITY_FIELDS.filter(function (field) {
        return field.group === group.id;
      });
      if (!groupFields.length) return;
      var body = longevityListOpen() + longevityRowsGroupedByLimit(groupFields, weekLongevity, weekMicro);
      if (group.id === "fats") {
        body += longevitySubgroupHtml("Also from your micro entries", "micro");
        LONGEVITY_FATS_AIM_FROM_MICRO.forEach(function (item) {
          body += longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        });
        body += longevitySubgroupHtml("Triglyceride support — from longevity entries", "compounds");
        LONGEVITY_FATS_AIM_FROM_LONGEVITY.forEach(function (item) {
          body += longevityRowFromLongevityOrMicro(item, weekLongevity, weekMicro);
        });
        body += longevityRowHtml(
          "EPA + DHA",
          derived.epaPlusDha > 0 ? fmtNum(derived.epaPlusDha) + " g" : "—",
          derived.epaPlusDha > 0 ? "combined" : "—",
          null,
          "dashboard__longevity-row--computed",
          false,
          "epaPlusDha",
          false
        );
      }
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
      var noteHtml =
        group.id === "fats"
          ? '<p class="dashboard__longevity-note">Nutrients here support healthy LDL, HDL, total cholesterol, and triglyceride labs—maximize protective fats, plant sterols, fiber, omega-3s, and supporting vitamins; minimize saturated fat, trans fat, and excess dietary cholesterol.</p>' +
            fatsCholesterolTipHtml() +
            berberineTipHtml("cholesterol")
          : "";
      html += longevitySectionWrap(group.label, group.sectionDefKey, noteHtml, body);
      if (group.id === "compounds") {
        html += histamineSectionHtml();
      }
      if (group.id === "omega") {
        html += pufaAntioxidantSectionHtml();
      }
    });

    html += longevitySectionWrap(
      "Calcification & vascular balance",
      "sectionCalcification",
      '<p class="dashboard__longevity-note">Phosphorus also appears under compounds above. Excess absorbable phosphate from cola and processed foods can pull calcium into arteries even when calcium and vitamin D intake looks fine. Vitamin K (total), K1, K2 (menaquinone), MK-4, and MK-7 are tracked separately so you can view calcium routing under different lenses.</p>' +
        calcificationPhosphorusTipHtml() +
        calcificationVitaminK2TipHtml() +
        calcificationVitaminK2SubformsTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Aim — higher % DV is better", "aim") +
        LONGEVITY_CALCIFICATION_AIM_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            !!item.limiting,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Watch — lower % DV is better", "limit") +
        LONGEVITY_CALCIFICATION_FIELD_KEYS.map(function (key) {
          var field = longevityFieldByKey(key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "TMAO balance",
      "sectionTmao",
      '<p class="dashboard__longevity-note">Gut bacteria metabolize certain nutrients into trimethylamine (TMA). TMA is absorbed into your bloodstream and travels to the liver, where it is oxidized into TMAO. Elevated levels can increase cardiovascular and kidney disease risks. Quest can test for this: <a href="https://testdirectory.questdiagnostics.com/test/test-guides/TS_TMAO/tmao-trimethylamine-n-oxide" target="_blank" rel="noopener noreferrer">TMAO (trimethylamine N-oxide)</a>. Compare ↑ precursors vs ↓ protectors below.</p>' +
        tmaoProtectorsTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("↑ Precursors — lower % DV is better", "limit") +
        LONGEVITY_TMAO_PRECURSOR_KEYS.map(function (key) {
          var field = longevityFieldByKey(key);
          if (!field) return "";
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
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
          var total = weekLongevity[item.key] || 0;
          var daily = avgDailyLongevity(item.key, total);
          var target = microRowTargetDisplay(field, daily, "longevity", weekMicro);
          return longevityRowHtml(
            item.label,
            total > 0 ? fmtNum(daily) + " " + field.unit : "—",
            target.text,
            target.pct,
            "",
            false,
            item.key,
            false,
            null,
            item.key,
            "longevity",
            target.kindLabel,
            target.refKey,
            target.reqAmount
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

    html += longevitySectionWrap(
      "Methylation & homocysteine balance",
      "sectionHomocysteine",
      '<p class="dashboard__longevity-note">Homocysteine (Hcy) is an amino acid your body uses to help create proteins. Vitamin B12, B6, and folate break it down through methylation—a foundational process that also governs gene expression, neurotransmitter production, detoxification, and cellular repair. When those cofactors run low, homocysteine accumulates and damages arterial walls, accelerating vascular aging, stroke risk, and cognitive decline.</p>',
      longevityListOpen() +
        longevitySubgroupHtml("B-vitamin support — higher % DV is better", "aim") +
        LONGEVITY_HOMOCYSTEINE_FROM_MICRO.map(function (item) {
          return longevityRowFromMicroKey(
            item.microKey,
            item.label,
            false,
            weekMicro
          );
        }).join("") +
        longevitySubgroupHtml("Alternate methyl donors — balance with TMAO", "aim") +
        LONGEVITY_HOMOCYSTEINE_FROM_LONGEVITY.map(function (item) {
          return longevitySupportRowFromLongevityKey(item.key, item.label, weekLongevity);
        }).join("") +
        longevityListClose()
    );

    var kNa = derived.potassiumToSodium;
    var kNaIdeal =
      longevityDvStatus.potassiumToSodiumIdealMin ||
      DEFAULT_LONGEVITY_STATUS.potassiumToSodiumIdealMin;
    var kNaAmt = kNa == null || isNaN(kNa) ? "—" : fmtNum(kNa) + ":1";
    var kNaStatus =
      kNa == null || isNaN(kNa)
        ? "—"
        : kNa >= kNaIdeal
          ? "At target"
          : "Below " + kNaIdeal + ":1 target";
    var kNaPct =
      kNa != null && !isNaN(kNa) && kNaIdeal > 0
        ? Math.min(100, (kNa / kNaIdeal) * 100)
        : null;

    html += longevitySectionWrap(
      "Vascular - Blood Pressure",
      "sectionVascularBloodPressure",
      '<p class="dashboard__longevity-note">Potassium can help offset some sodium effects by balancing intake and relaxing blood vessels. In theory, a good target is about twice as much potassium as sodium while keeping sodium under the daily limit—assuming no kidney disease and no ACE inhibitors or other meds that retain potassium. Food\'s naturally occurring nitrates get converted into nitric oxide, which helps widen blood vessels, improve blood flow, and lower blood pressure—both systemically and in the brain; beets are among the best sources.</p>' +
        vascularBloodPressureTipHtml() +
        kidneyHerbsBloodPressureTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Watch — lower % of each sodium limit is better", "limit") +
        vascularSodiumLimitRowsHtml(weekMicro) +
        vascularRowsFromLongevityItems(
          LONGEVITY_VASCULAR_WATCH_FROM_LONGEVITY,
          weekLongevity,
          weekMicro
        ) +
        longevitySubgroupHtml("Aim — higher % DV is better", "aim") +
        vascularPrimaryAimRowsHtml(weekLongevity, weekMicro, derived, {
          includePotassiumRatio: true,
        }) +
        dashDietSubsectionHtml(weekMicro, weekLongevity) +
        longevitySubgroupHtml(
          "Lower priority — modest or mixed evidence",
          "neutral"
        ) +
        vascularLowerPriorityRowsHtml(weekLongevity, weekMicro) +
        longevitySubgroupHtml("Glutathione support — oxidative stress & NO availability", "aim") +
        vascularRowsFromMicroItems(LONGEVITY_VASCULAR_GLUTATHIONE_FROM_MICRO, false, weekMicro) +
        vascularRowsFromLongevityItems(LONGEVITY_VASCULAR_GLUTATHIONE_FROM_LONGEVITY, weekLongevity, weekMicro) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Vascular - Cerebral Blood Pressure",
      "sectionVascularBrain",
      vascularBrainTipHtml(),
      longevityListOpen() +
        '<p class="dashboard__longevity-note">Nutrition for cerebral small vessels follows the same pattern as systemic blood pressure—track the rows in Vascular - Blood Pressure and keep systemic pressure steady so it does not propagate to the brain’s smallest vessels.</p>' +
        longevityNavJumpRowHtml(
          "sectionVascularBloodPressure",
          "Vascular - Blood Pressure"
        ) +
        longevityListClose()
    );

    if (demographic === "female") {
      html += renderFemaleHormoneSectionsHtml(weekLongevity, weekMicro);
    } else {
      html += renderMaleHormoneSectionsHtml(weekLongevity, weekMicro);
    }

    dashboardLongevityContentEl.innerHTML = html;
    if (longevityNavPendingHashSection) {
      var pendingKey = longevityNavPendingHashSection;
      longevityNavPendingHashSection = null;
      var pendingIndex = longevityNavIndexForSection(pendingKey);
      if (pendingIndex >= 0) {
        scrollToLongevityNavSection(pendingKey, pendingIndex, "auto");
      }
    }
    syncLongevityNav(true);
    syncAllDismissibleTips();
  }

  function longevityNavSectionEl(sectionDefKey) {
    return document.getElementById("longevity-section-" + sectionDefKey);
  }

  function longevityNavScrollOffset() {
    if (!dashboardLongevityNavEl || dashboardLongevityNavEl.hidden) return 12;
    return dashboardLongevityNavEl.offsetHeight + 12;
  }

  function syncLongevityNavHeightVar() {
    if (!dashboardLongevityNavEl) return;
    document.documentElement.style.setProperty(
      "--longevity-nav-height",
      dashboardLongevityNavEl.offsetHeight + "px"
    );
  }

  function resetLongevityNavList() {
    longevityNavListBuilt = false;
    if (dashboardLongevityNavAllListEl) {
      dashboardLongevityNavAllListEl.innerHTML = "";
    }
  }

  function buildLongevityNavAllList() {
    if (!dashboardLongevityNavAllListEl || longevityNavListBuilt) return;
    var navSections = getLongevityNavSections();
    dashboardLongevityNavAllListEl.innerHTML = navSections.map(function (section, index) {
      return (
        '<li class="dashboard__longevity-nav-all-item">' +
        '<button type="button" class="dashboard__longevity-nav-all-link" data-longevity-nav-index="' +
        index +
        '" data-longevity-nav-key="' +
        escapeAttr(section.sectionDefKey) +
        '">' +
        escapeHtml(section.label) +
        "</button></li>"
      );
    }).join("");
    dashboardLongevityNavAllListEl
      .querySelectorAll(".dashboard__longevity-nav-all-link")
      .forEach(function (link) {
        applyLongevityNavTopicColor(link, link.getAttribute("data-longevity-nav-key"));
      });
    longevityNavListBuilt = true;
  }

  function setLongevityNavExpanded(open) {
    longevityNavExpanded = !!open;
    if (dashboardLongevityNavAllToggleEl) {
      dashboardLongevityNavAllToggleEl.setAttribute(
        "aria-expanded",
        longevityNavExpanded ? "true" : "false"
      );
    }
    if (dashboardLongevityNavAllListEl) {
      dashboardLongevityNavAllListEl.hidden = !longevityNavExpanded;
    }
  }

  function longevityNavIndexForSection(sectionDefKey) {
    var navSections = getLongevityNavSections();
    for (var i = 0; i < navSections.length; i++) {
      if (navSections[i].sectionDefKey === sectionDefKey) return i;
    }
    return -1;
  }

  function longevitySectionFromHash(hash) {
    var raw = String(hash || window.location.hash || "").replace(/^#/, "");
    if (raw.indexOf(LONGEVITY_HASH_PREFIX) !== 0) return null;
    var key = raw.slice(LONGEVITY_HASH_PREFIX.length);
    if (!key || longevityNavIndexForSection(key) < 0) return null;
    return key;
  }

  function longevityHashForSection(sectionDefKey) {
    return "#" + LONGEVITY_HASH_PREFIX + sectionDefKey;
  }

  function longevityNavUrlForSection(sectionDefKey) {
    return window.location.pathname + window.location.search + longevityHashForSection(sectionDefKey);
  }

  function setLongevityNavHash(sectionDefKey, replace) {
    if (longevityNavHashUpdating || !sectionDefKey) return;
    if (longevityNavIndexForSection(sectionDefKey) < 0) return;
    var url = longevityNavUrlForSection(sectionDefKey);
    var state = { longevityNav: sectionDefKey };
    longevityNavHashUpdating = true;
    if (replace) {
      history.replaceState(state, "", url);
    } else {
      history.pushState(state, "", url);
      longevityNavPushDepth += 1;
    }
    longevityNavHashUpdating = false;
  }

  function clearLongevityNavHash() {
    if (longevityNavHashUpdating) return;
    if (!window.location.hash || window.location.hash.indexOf("#" + LONGEVITY_HASH_PREFIX) !== 0) {
      return;
    }
    longevityNavHashUpdating = true;
    history.replaceState(null, "", window.location.pathname + window.location.search);
    longevityNavHashUpdating = false;
  }

  function handleLongevityNavFromUrl() {
    if (longevityNavHashUpdating) return;
    var sectionKey = longevitySectionFromHash();
    if (!sectionKey && history.state && history.state.longevityNav) {
      sectionKey = history.state.longevityNav;
    }
    if (!sectionKey) return;
    var index = longevityNavIndexForSection(sectionKey);
    if (index < 0) return;
    if (!longevityPanelOpen) {
      longevityNavPendingHashSection = sectionKey;
      setLongevityPanelOpen(true);
      return;
    }
    scrollToLongevityNavSection(sectionKey, index);
  }

  function navigateLongevityNavTo(sectionDefKey, index, options) {
    options = options || {};
    var idx =
      typeof index === "number" && index >= 0 ? index : longevityNavIndexForSection(sectionDefKey);
    if (idx < 0) return;
    setLongevityNavHash(sectionDefKey, !options.push);
    scrollToLongevityNavSection(sectionDefKey, idx, options.behavior || "smooth");
  }

  function longevityNavCanGoBack() {
    return longevityPanelOpen && longevityNavPushDepth > 0;
  }

  function applyInitialLongevityHash() {
    var sectionKey = longevitySectionFromHash();
    if (!sectionKey) return;
    longevityNavPendingHashSection = sectionKey;
    setLongevityPanelOpen(true);
  }

  function scrollToLongevityNavSection(sectionDefKey, index, scrollBehavior) {
    setLongevityNavExpanded(false);
    var sectionEl =
      longevityNavSectionEl(sectionDefKey) ||
      (dashboardLongevityContentEl &&
        dashboardLongevityContentEl.querySelector(
          '.dashboard__longevity-section[data-longevity-nav="' + sectionDefKey + '"]'
        ));
    if (!sectionEl) return;
    syncLongevityNavHeightVar();
    var top =
      sectionEl.getBoundingClientRect().top +
      window.scrollY -
      longevityNavScrollOffset();
    longevityNavSuppressSpy = true;
    if (typeof index === "number") {
      longevityNavActiveIndex = index;
      updateLongevityNavUi(index);
    }
    window.scrollTo({
      top: Math.max(0, top),
      behavior: scrollBehavior || "smooth",
    });
  }

  function getLongevityNavActiveIndex() {
    if (!dashboardLongevityContentEl) return 0;
    var sections = dashboardLongevityContentEl.querySelectorAll(
      ".dashboard__longevity-section[data-longevity-nav]"
    );
    if (!sections.length) return 0;
    var triggerY = longevityNavScrollOffset();
    var activeIndex = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= triggerY + 24) {
        activeIndex = i;
      }
    }
    return activeIndex;
  }

  function updateLongevityNavUi(activeIndex) {
    if (!dashboardLongevityNavEl) return;
    var sections = getLongevityNavSections();
    if (!sections.length) return;
    var index = Math.max(0, Math.min(activeIndex, sections.length - 1));
    longevityNavActiveIndex = index;
    var current = sections[index];
    var prev = index > 0 ? sections[index - 1] : null;
    var next = index < sections.length - 1 ? sections[index + 1] : null;

    if (dashboardLongevityNavCurrentTitleEl) {
      dashboardLongevityNavCurrentTitleEl.textContent = current.label;
      applyLongevityNavTopicColor(
        dashboardLongevityNavCurrentTitleEl.parentElement,
        current.sectionDefKey
      );
    }

    if (dashboardLongevityNavPrevEl && dashboardLongevityNavPrevTitleEl) {
      if (prev) {
        dashboardLongevityNavPrevEl.hidden = false;
        dashboardLongevityNavPrevEl.disabled = false;
        dashboardLongevityNavPrevTitleEl.textContent = prev.label;
        dashboardLongevityNavPrevEl.setAttribute("data-longevity-nav-key", prev.sectionDefKey);
        dashboardLongevityNavPrevEl.setAttribute(
          "data-longevity-nav-index",
          String(index - 1)
        );
      } else {
        dashboardLongevityNavPrevEl.hidden = true;
        dashboardLongevityNavPrevEl.disabled = true;
        dashboardLongevityNavPrevTitleEl.textContent = "";
        dashboardLongevityNavPrevEl.removeAttribute("data-longevity-nav-key");
        dashboardLongevityNavPrevEl.removeAttribute("data-longevity-nav-index");
      }
      applyLongevityNavTopicColor(
        dashboardLongevityNavPrevEl,
        prev ? prev.sectionDefKey : null
      );
    }

    if (dashboardLongevityNavNextEl && dashboardLongevityNavNextTitleEl) {
      if (next) {
        dashboardLongevityNavNextEl.hidden = false;
        dashboardLongevityNavNextEl.disabled = false;
        dashboardLongevityNavNextTitleEl.textContent = next.label;
        dashboardLongevityNavNextEl.setAttribute("data-longevity-nav-key", next.sectionDefKey);
        dashboardLongevityNavNextEl.setAttribute(
          "data-longevity-nav-index",
          String(index + 1)
        );
      } else {
        dashboardLongevityNavNextEl.hidden = true;
        dashboardLongevityNavNextEl.disabled = true;
        dashboardLongevityNavNextTitleEl.textContent = "";
        dashboardLongevityNavNextEl.removeAttribute("data-longevity-nav-key");
        dashboardLongevityNavNextEl.removeAttribute("data-longevity-nav-index");
      }
      applyLongevityNavTopicColor(
        dashboardLongevityNavNextEl,
        next ? next.sectionDefKey : null
      );
    }

    if (dashboardLongevityNavAllListEl) {
      var links = dashboardLongevityNavAllListEl.querySelectorAll(
        ".dashboard__longevity-nav-all-link"
      );
      links.forEach(function (link, linkIndex) {
        applyLongevityNavTopicColor(link, link.getAttribute("data-longevity-nav-key"));
        link.classList.toggle(
          "dashboard__longevity-nav-all-link--active",
          linkIndex === index
        );
        if (linkIndex === index) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  }

  function syncLongevityNavVisibility() {
    if (!dashboardLongevityNavEl) return;
    dashboardLongevityNavEl.hidden = !longevityPanelOpen;
  }

  function syncLongevityNav(force) {
    if (!longevityPanelOpen) return;
    buildLongevityNavAllList();
    syncLongevityNavHeightVar();
    var nextIndex = getLongevityNavActiveIndex();
    if (force && longevityNavActiveIndex >= 0) {
      var pinnedSection = getLongevityNavSections()[longevityNavActiveIndex];
      var pinnedEl =
        pinnedSection && longevityNavSectionEl(pinnedSection.sectionDefKey);
      if (pinnedEl) {
        var delta = Math.abs(
          pinnedEl.getBoundingClientRect().top - longevityNavScrollOffset()
        );
        if (delta <= 80) nextIndex = longevityNavActiveIndex;
      }
    }
    if (force || nextIndex !== longevityNavActiveIndex) {
      updateLongevityNavUi(nextIndex);
      if (!longevityNavSuppressSpy && longevityPanelOpen) {
        var activeSection = getLongevityNavSections()[nextIndex];
        if (activeSection) setLongevityNavHash(activeSection.sectionDefKey, true);
      }
    }
    syncLongevityNavVisibility();
  }

  function scheduleLongevityNavSync() {
    if (longevityNavScrollScheduled || !longevityPanelOpen) return;
    longevityNavScrollScheduled = true;
    window.requestAnimationFrame(function () {
      longevityNavScrollScheduled = false;
      if (longevityNavSuppressSpy) {
        clearTimeout(longevityNavScrollSettleTimer);
        longevityNavScrollSettleTimer = setTimeout(function () {
          longevityNavSuppressSpy = false;
          syncLongevityNav(true);
        }, 180);
        return;
      }
      syncLongevityNav(false);
    });
  }

  function initLongevityNav() {
    buildLongevityNavAllList();
    window.addEventListener("popstate", function () {
      if (longevityNavHashUpdating) return;
      if (longevityNavPushDepth > 0) longevityNavPushDepth -= 1;
      handleLongevityNavFromUrl();
    });
    window.addEventListener("hashchange", function () {
      if (longevityNavHashUpdating) return;
      handleLongevityNavFromUrl();
    });
    window.addEventListener("scroll", scheduleLongevityNavSync, { passive: true });
    window.addEventListener("resize", function () {
      syncLongevityNavHeightVar();
      scheduleLongevityNavSync();
    });

    if (dashboardLongevityNavPrevEl) {
      dashboardLongevityNavPrevEl.addEventListener("click", function () {
        var key = dashboardLongevityNavPrevEl.getAttribute("data-longevity-nav-key");
        var index = parseInt(
          dashboardLongevityNavPrevEl.getAttribute("data-longevity-nav-index"),
          10
        );
        if (key) navigateLongevityNavTo(key, index, { push: true });
      });
    }

    if (dashboardLongevityNavNextEl) {
      dashboardLongevityNavNextEl.addEventListener("click", function () {
        var key = dashboardLongevityNavNextEl.getAttribute("data-longevity-nav-key");
        var index = parseInt(
          dashboardLongevityNavNextEl.getAttribute("data-longevity-nav-index"),
          10
        );
        if (key) navigateLongevityNavTo(key, index, { push: true });
      });
    }

    if (dashboardLongevityNavAllToggleEl) {
      dashboardLongevityNavAllToggleEl.addEventListener("click", function () {
        setLongevityNavExpanded(!longevityNavExpanded);
        syncLongevityNavHeightVar();
      });
    }

    if (dashboardLongevityNavAllListEl) {
      dashboardLongevityNavAllListEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".dashboard__longevity-nav-all-link");
        if (!btn) return;
        e.preventDefault();
        navigateLongevityNavTo(
          btn.getAttribute("data-longevity-nav-key"),
          parseInt(btn.getAttribute("data-longevity-nav-index"), 10),
          { push: true }
        );
      });
    }
  }

  function setLongevityPanelOpen(open) {
    longevityPanelOpen = !!open;
    if (dashboardLongevityToggleEl) {
      dashboardLongevityToggleEl.setAttribute(
        "aria-expanded",
        longevityPanelOpen ? "true" : "false"
      );
      dashboardLongevityToggleEl.classList.toggle(
        "app-nav__btn--open",
        longevityPanelOpen
      );
    }
    if (dashboardLongevityPanelEl) {
      dashboardLongevityPanelEl.hidden = !longevityPanelOpen;
    }
    if (longevityPanelOpen) {
      renderLongevityPanel();
      initStickyFiltersCarousel();
    } else {
      setLongevityNavExpanded(false);
      clearLongevityNavHash();
      longevityNavPushDepth = 0;
      syncLongevityNavVisibility();
    }
  }

  function setWeekTotalOpen(open) {
    weekTotalOpen = !!open;
    if (dashboardWeekToggleEl) {
      dashboardWeekToggleEl.setAttribute("aria-expanded", weekTotalOpen ? "true" : "false");
      dashboardWeekToggleEl.classList.toggle("app-nav__btn--open", weekTotalOpen);
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
      dashboardMicroToggleEl.classList.toggle("app-nav__btn--open", microRequirementsOpen);
    }
    if (dashboardMicroPanelEl) {
      dashboardMicroPanelEl.hidden = !microRequirementsOpen;
    }
    if (microRequirementsOpen) {
      renderMicroRequirements();
      initStickyFiltersCarousel();
    } else {
      setMicroConditionExpanded(false);
    }
  }

  function normalizeDemographic(value) {
    if (demographicDv && demographicDv.normalizeDemographic) {
      return demographicDv.normalizeDemographic(value);
    }
    return value === "female" ? "female" : "male";
  }

  function getTdeeBaseline() {
    if (demographicDv && demographicDv.CALORIE_BASELINE) {
      return demographicDv.CALORIE_BASELINE[demographic] || 2500;
    }
    return demographic === "female" ? 1900 : 2500;
  }

  function saveTdee() {
    if (!persist) return;
    persist.setSetting(
      "tdee",
      userTdee == null || userTdee <= 0 ? null : userTdee
    );
  }

  function loadTdee() {
    if (!persist) {
      userTdee = null;
      return;
    }
    var n = persist.getSetting("tdee");
    userTdee = typeof n === "number" && n > 0 ? n : null;
  }

  function getTdee() {
    return userTdee != null && userTdee > 0 ? userTdee : null;
  }

  var MACRO_SPLIT_GOALS = {
    "weight-loss": { id: "weight-loss", label: "Weight loss" },
    bodybuilding: { id: "bodybuilding", label: "Bodybuilding" },
    maintenance: { id: "maintenance", label: "Maintenance" },
  };

  // Mid-range P/C/F % by body type × goal (aligned with MACRO_BODY_TYPES guidance).
  var MACRO_SPLIT_BODY_TYPES = {
    ectomorph: {
      id: "ectomorph",
      label: "Ectomorph",
      goals: {
        "weight-loss": { proteinPct: 30, carbsPct: 40, fatsPct: 30 },
        bodybuilding: { proteinPct: 25, carbsPct: 50, fatsPct: 25 },
        maintenance: { proteinPct: 30, carbsPct: 45, fatsPct: 25 },
      },
    },
    "ecto-mesomorph": {
      id: "ecto-mesomorph",
      label: "Ecto-mesomorph",
      goals: {
        "weight-loss": { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
        bodybuilding: { proteinPct: 30, carbsPct: 45, fatsPct: 25 },
        maintenance: { proteinPct: 30, carbsPct: 40, fatsPct: 30 },
      },
    },
    mesomorph: {
      id: "mesomorph",
      label: "Mesomorph",
      goals: {
        "weight-loss": { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
        bodybuilding: { proteinPct: 30, carbsPct: 45, fatsPct: 25 },
        maintenance: { proteinPct: 30, carbsPct: 40, fatsPct: 30 },
      },
    },
    "meso-endomorph": {
      id: "meso-endomorph",
      label: "Meso-endomorph",
      goals: {
        "weight-loss": { proteinPct: 35, carbsPct: 30, fatsPct: 35 },
        bodybuilding: { proteinPct: 32, carbsPct: 40, fatsPct: 28 },
        maintenance: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
      },
    },
    endomorph: {
      id: "endomorph",
      label: "Endomorph",
      goals: {
        "weight-loss": { proteinPct: 40, carbsPct: 30, fatsPct: 30 },
        bodybuilding: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
        maintenance: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
      },
    },
    "ecto-endomorph": {
      id: "ecto-endomorph",
      label: "Ecto-endomorph",
      goals: {
        "weight-loss": { proteinPct: 35, carbsPct: 30, fatsPct: 35 },
        bodybuilding: { proteinPct: 32, carbsPct: 40, fatsPct: 28 },
        maintenance: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
      },
    },
  };

  function normalizeMacroSplitValue(value) {
    if (!value) return null;
    if (typeof value === "string") {
      // Legacy goal-only ids → default mesomorph + that goal.
      if (!MACRO_SPLIT_GOALS[value]) return null;
      return { bodyType: "mesomorph", goal: value };
    }
    if (typeof value !== "object") return null;
    var bodyType = value.bodyType;
    var goal = value.goal;
    if (!MACRO_SPLIT_BODY_TYPES[bodyType] || !MACRO_SPLIT_GOALS[goal]) {
      return null;
    }
    return { bodyType: bodyType, goal: goal };
  }

  function getMacroSplit() {
    return normalizeMacroSplitValue(userMacroSplit);
  }

  function getMacroSplitPreset() {
    var split = getMacroSplit();
    if (!split) return null;
    var body = MACRO_SPLIT_BODY_TYPES[split.bodyType];
    var goalMeta = MACRO_SPLIT_GOALS[split.goal];
    var pct = body && body.goals ? body.goals[split.goal] : null;
    if (!body || !goalMeta || !pct) return null;
    return {
      bodyType: split.bodyType,
      goal: split.goal,
      label: body.label + " · " + goalMeta.label,
      proteinPct: pct.proteinPct,
      carbsPct: pct.carbsPct,
      fatsPct: pct.fatsPct,
    };
  }

  function saveMacroSplit() {
    if (!persist) return;
    persist.setSetting("macroSplit", getMacroSplit());
  }

  function loadMacroSplit() {
    if (!persist) {
      userMacroSplit = null;
      return;
    }
    userMacroSplit = normalizeMacroSplitValue(persist.getSetting("macroSplit"));
  }

  function settingsPreviewBodyWeightKg() {
    if (settingsModalEl && !settingsModalEl.hidden && settingsWeightEl) {
      if (settingsWeightEl.value.trim() === "") return null;
      var fromInput = settingsWeightKgFromInput();
      return isNaN(fromInput) ? null : fromInput;
    }
    return getBodyWeightKg();
  }

  function settingsPreviewBodyWeightLb() {
    var kg = settingsPreviewBodyWeightKg();
    if (kg == null || kg <= 0) return null;
    return kg / 0.453592;
  }

  var MACRO_GOAL_PROTEIN_GUIDANCE = {
    bodybuilding: [
      {
        title: "Evidence",
        rateLabel: "0.7 g/lb · building muscle",
        gPerLb: 0.7,
      },
      {
        title: "Other evidence",
        rateLabel: "0.82 g/lb · building muscle",
        gPerLb: 0.82,
      },
      {
        title: "Bro science",
        rateLabel: "1 g/lb · building muscle",
        gPerLb: 1,
      },
    ],
    maintenance: [
      {
        title: "Evidence",
        rateLabel: "0.36 g/lb · RDA minimum (0.8 g/kg)",
        gPerLb: 0.36,
      },
      {
        title: "Other evidence",
        rateLabel: "0.55 g/lb · active adults (1.2 g/kg)",
        gPerLb: 0.55,
      },
      {
        title: "Bro science",
        rateLabel: "0.7 g/lb · gym rule of thumb",
        gPerLb: 0.7,
      },
    ],
  };

  var WEIGHT_LOSS_GOAL_TIPS = [
    {
      title: "Calories",
      rateLabel: "Energy balance rule of thumb",
      body: "≈3,500 kcal deficit ≈ 1 lb lost",
    },
    {
      title: "Zone 2",
      rateHtml:
        '60–70% of <button type="button" class="settings-modal__max-hr-trigger" data-action="toggle-max-hr-popover" aria-expanded="false" aria-controls="max-hr-popover">max heart rate</button>',
      body: "Conversational pace — helps burn fat for fuel",
    },
    {
      title: "Carbs & habits",
      rateLabel: "Limit refined carbs & sugary drinks",
      body: "Keep protein & fiber high; train to keep muscle",
    },
  ];

  function clearMaxHrPopoverHideTimer() {
    if (maxHrPopoverHideTimer == null) return;
    clearTimeout(maxHrPopoverHideTimer);
    maxHrPopoverHideTimer = null;
  }

  function hideMaxHrPopover() {
    clearMaxHrPopoverHideTimer();
    if (!maxHrPopoverEl) return;
    maxHrPopoverEl.hidden = true;
    maxHrPopoverPinned = false;
    if (maxHrPopoverAnchor) {
      maxHrPopoverAnchor.setAttribute("aria-expanded", "false");
      maxHrPopoverAnchor = null;
    }
  }

  function showMaxHrPopover(anchor, pinned) {
    if (!maxHrPopoverEl || !anchor) return;
    clearMaxHrPopoverHideTimer();
    maxHrPopoverAnchor = anchor;
    maxHrPopoverPinned = !!pinned;
    maxHrPopoverEl.hidden = false;
    positionFixedPopoverBelow(maxHrPopoverEl, anchor);
    anchor.setAttribute("aria-expanded", "true");
  }

  function scheduleHideMaxHrPopover() {
    if (maxHrPopoverPinned) return;
    clearMaxHrPopoverHideTimer();
    maxHrPopoverHideTimer = setTimeout(function () {
      maxHrPopoverHideTimer = null;
      if (!maxHrPopoverPinned) hideMaxHrPopover();
    }, 160);
  }

  function toggleMaxHrPopover(anchor) {
    if (!anchor) return;
    if (
      maxHrPopoverAnchor === anchor &&
      maxHrPopoverEl &&
      !maxHrPopoverEl.hidden &&
      maxHrPopoverPinned
    ) {
      hideMaxHrPopover();
      return;
    }
    showMaxHrPopover(anchor, true);
  }

  function proteinEvidenceTileHtml(title, rateLabel, gPerLb, weightLb) {
    var amountHtml =
      weightLb == null
        ? '<button type="button" class="settings-modal__protein-evidence-error" data-action="focus-settings-weight">Enter body weight</button>'
        : '<span class="settings-modal__protein-evidence-val">' +
          escapeHtml(fmtNum(Math.round(weightLb * gPerLb)) + " g") +
          "</span>";
    return (
      '<li class="settings-modal__protein-evidence-tile">' +
      '<span class="settings-modal__protein-evidence-title">' +
      escapeHtml(title) +
      "</span>" +
      '<span class="settings-modal__protein-evidence-rate">' +
      escapeHtml(rateLabel) +
      "</span>" +
      amountHtml +
      "</li>"
    );
  }

  function weightLossTipTileHtml(tip) {
    var rateInner = tip.rateHtml
      ? tip.rateHtml
      : escapeHtml(tip.rateLabel || "");
    return (
      '<li class="settings-modal__protein-evidence-tile settings-modal__protein-evidence-tile--tip">' +
      '<span class="settings-modal__protein-evidence-title">' +
      escapeHtml(tip.title) +
      "</span>" +
      '<span class="settings-modal__protein-evidence-rate">' +
      rateInner +
      "</span>" +
      '<span class="settings-modal__protein-evidence-val settings-modal__protein-evidence-val--tip">' +
      escapeHtml(tip.body) +
      "</span>" +
      "</li>"
    );
  }

  function macroGoalGuidanceHtml(preset) {
    if (preset.goal === "weight-loss") {
      return (
        '<ul class="settings-modal__protein-evidence" aria-label="Weight loss tips">' +
        WEIGHT_LOSS_GOAL_TIPS.map(weightLossTipTileHtml).join("") +
        "</ul>"
      );
    }
    var rows = MACRO_GOAL_PROTEIN_GUIDANCE[preset.goal];
    if (!rows) return "";
    var weightLb = settingsPreviewBodyWeightLb();
    return (
      '<ul class="settings-modal__protein-evidence" aria-label="Protein per pound guidance">' +
      rows
        .map(function (row) {
          return proteinEvidenceTileHtml(
            row.title,
            row.rateLabel,
            row.gPerLb,
            weightLb
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function syncSettingsMacroSplitPreview() {
    if (!settingsMacroSplitPreviewEl) return;
    hideMaxHrPopover();
    var preset = getMacroSplitPreset();
    if (!preset) {
      settingsMacroSplitPreviewEl.hidden = true;
      settingsMacroSplitPreviewEl.innerHTML = "";
      return;
    }
    settingsMacroSplitPreviewEl.hidden = false;
    settingsMacroSplitPreviewEl.innerHTML =
      '<p class="settings-modal__macro-split-preview-line">' +
      escapeHtml(
        preset.label +
          " — " +
          preset.proteinPct +
          "% P / " +
          preset.carbsPct +
          "% C / " +
          preset.fatsPct +
          "% F"
      ) +
      "</p>" +
      macroGoalGuidanceHtml(preset);
  }

  function syncSettingsMacroSplitInput() {
    var split = getMacroSplit();
    var bodyType = split ? split.bodyType : "";
    var goal = split ? split.goal : "";
    if (settingsMacroBodyTypeEl) {
      settingsMacroBodyTypeEl.value = bodyType;
    }
    if (settingsMacroGoalEl) {
      settingsMacroGoalEl.value = bodyType ? goal : "";
      settingsMacroGoalEl.disabled = !bodyType;
    }
    syncSettingsMacroSplitPreview();
  }

  function readSettingsMacroSplitFromInput() {
    var bodyType =
      settingsMacroBodyTypeEl && settingsMacroBodyTypeEl.value
        ? settingsMacroBodyTypeEl.value
        : "";
    var goal =
      settingsMacroGoalEl && settingsMacroGoalEl.value
        ? settingsMacroGoalEl.value
        : "";
    if (!bodyType) {
      userMacroSplit = null;
      if (settingsMacroGoalEl) {
        settingsMacroGoalEl.value = "";
        settingsMacroGoalEl.disabled = true;
      }
    } else if (!goal) {
      userMacroSplit = null;
      if (settingsMacroGoalEl) {
        settingsMacroGoalEl.disabled = false;
      }
    } else {
      userMacroSplit = normalizeMacroSplitValue({
        bodyType: bodyType,
        goal: goal,
      });
      if (settingsMacroGoalEl) {
        settingsMacroGoalEl.disabled = false;
      }
    }
    saveMacroSplit();
    syncSettingsMacroSplitPreview();
  }

  function macroTargetsFromCalories(calories, split) {
    if (!split || !(calories > 0)) {
      return { protein: 0, carbs: 0, fats: 0 };
    }
    return {
      protein: (calories * (split.proteinPct / 100)) / 4,
      carbs: (calories * (split.carbsPct / 100)) / 4,
      fats: (calories * (split.fatsPct / 100)) / 9,
    };
  }

  function macroSplitCalorieBudget(fallbackCalories) {
    var tdee = getTdee();
    if (tdee != null) return tdee;
    if (fallbackCalories > 0) return fallbackCalories;
    return null;
  }

  function macroNeedDeltas(totals, calorieBudget, split) {
    var targets = macroTargetsFromCalories(calorieBudget, split);
    return {
      protein: targets.protein - (totals.protein || 0),
      carbs: targets.carbs - (totals.carbs || 0),
      fats: targets.fats - (totals.fats || 0),
      targets: targets,
    };
  }

  function macroNeedToleranceFor(macroKey) {
    var tol =
      macroSplitNeedTolerance && macroSplitNeedTolerance[macroKey]
        ? macroSplitNeedTolerance[macroKey]
        : DEFAULT_MACRO_SPLIT_NEED_TOLERANCE[macroKey];
    return tol || { maxNeedG: 0, maxOverG: 0 };
  }

  function isMacroNeedMet(macroKey, deltaGrams) {
    var tol = macroNeedToleranceFor(macroKey);
    return deltaGrams >= -tol.maxOverG && deltaGrams <= tol.maxNeedG;
  }

  function formatMacroNeedDenomSuffix(deltaGrams, targetGrams, denomMode) {
    var mode = denomMode === "consumed" ? "consumed" : "target";
    if (mode === "consumed") {
      var consumed = Math.round((targetGrams || 0) - (deltaGrams || 0));
      if (consumed === 0) return "/0g";
      return "/" + -consumed + "g";
    }
    var t = Math.round(targetGrams || 0);
    return t > 0 ? "/" + t + "g" : "";
  }

  function formatMacroNeedDelta(macroKey, deltaGrams, targetGrams, denomMode) {
    var n = Math.round(deltaGrams);
    var denomSuffix = formatMacroNeedDenomSuffix(
      deltaGrams,
      targetGrams,
      denomMode
    );
    if (isMacroNeedMet(macroKey, deltaGrams)) {
      if (n === 0) return "Met 0" + denomSuffix;
      return "Met " + (n > 0 ? "+" : "") + n + "g" + denomSuffix;
    }
    return (n > 0 ? "+" : "") + n + "g" + denomSuffix;
  }

  function macroNeedPartHtml(letter, macroKey, deltaGrams, targetGrams, denomMode) {
    var met = isMacroNeedMet(macroKey, deltaGrams);
    return (
      '<span class="dashboard__macro-need-item' +
      (met ? " dashboard__macro-need-item--met" : "") +
      '">' +
      '<span class="dashboard__macro-need-key">' +
      letter +
      "</span>" +
      '<span class="dashboard__macro-need-amt">' +
      escapeHtml(
        formatMacroNeedDelta(macroKey, deltaGrams, targetGrams, denomMode)
      ) +
      "</span></span>"
    );
  }

  function macroNeedValsHtml(deltas) {
    var targets = deltas.targets || {};
    return (
      macroNeedPartHtml("P", "protein", deltas.protein, targets.protein) +
      '<span class="week-summary__macro-need-sep"> · </span>' +
      macroNeedPartHtml("C", "carbs", deltas.carbs, targets.carbs) +
      '<span class="week-summary__macro-need-sep"> · </span>' +
      macroNeedPartHtml("F", "fats", deltas.fats, targets.fats)
    );
  }

  function clearMacroNeedPopoverHideTimer() {
    if (macroNeedPopoverHideTimer == null) return;
    clearTimeout(macroNeedPopoverHideTimer);
    macroNeedPopoverHideTimer = null;
  }

  function hideMacroNeedPopover() {
    clearMacroNeedPopoverHideTimer();
    if (!macroNeedPopoverEl) return;
    macroNeedPopoverEl.hidden = true;
    macroNeedPopoverPinned = false;
    if (macroNeedPopoverAnchor) {
      macroNeedPopoverAnchor.setAttribute("aria-expanded", "false");
      macroNeedPopoverAnchor = null;
    }
  }

  function showMacroNeedPopover(anchor, pinned) {
    if (!macroNeedPopoverEl || !anchor) return;
    clearMacroNeedPopoverHideTimer();
    macroNeedPopoverAnchor = anchor;
    macroNeedPopoverPinned = !!pinned;
    macroNeedPopoverEl.hidden = false;
    positionFixedPopoverBelow(macroNeedPopoverEl, anchor);
    anchor.setAttribute("aria-expanded", "true");
  }

  function scheduleHideMacroNeedPopover() {
    if (macroNeedPopoverPinned) return;
    clearMacroNeedPopoverHideTimer();
    macroNeedPopoverHideTimer = setTimeout(function () {
      macroNeedPopoverHideTimer = null;
      if (!macroNeedPopoverPinned) hideMacroNeedPopover();
    }, 160);
  }

  function toggleMacroNeedPopover(anchor) {
    if (!anchor) return;
    if (
      macroNeedPopoverAnchor === anchor &&
      macroNeedPopoverEl &&
      !macroNeedPopoverEl.hidden &&
      macroNeedPopoverPinned
    ) {
      hideMacroNeedPopover();
      return;
    }
    showMacroNeedPopover(anchor, true);
  }

  function dashboardMacroNeedBlockHtml(totals, isToday) {
    var split = getMacroSplitPreset();
    if (!split) return "";
    var budget = macroSplitCalorieBudget(totals.totalCal);
    if (budget == null) return "";
    var deltas = macroNeedDeltas(totals, budget, split);
    var targets = deltas.targets || {};
    var mode = macroNeedDenomMode === "consumed" ? "consumed" : "target";
    var denomHint =
      mode === "consumed"
        ? "Showing remaining / consumed. Click to show remaining / target total."
        : "Showing remaining / target total. Click to show remaining / consumed.";
    return (
      '<aside class="dashboard__macro-need' +
      (isToday ? " dashboard__macro-need--today" : "") +
      (mode === "consumed" ? " dashboard__macro-need--consumed" : "") +
      '" data-action="toggle-macro-need-denom">' +
      '<button type="button" class="dashboard__macro-need-label" data-action="toggle-macro-need-popover" aria-expanded="false" aria-controls="macro-need-popover">Need</button>' +
      '<span class="dashboard__macro-need-list" role="button" tabindex="0" aria-label="' +
      escapeAttr("Macro split need. " + denomHint) +
      '">' +
      macroNeedPartHtml("P", "protein", deltas.protein, targets.protein, mode) +
      macroNeedPartHtml("C", "carbs", deltas.carbs, targets.carbs, mode) +
      macroNeedPartHtml("F", "fats", deltas.fats, targets.fats, mode) +
      "</span></aside>"
    );
  }

  function weekSummaryMacroNeedHtml(week) {
    var split = getMacroSplitPreset();
    if (!split) return "";
    var dayCount = DAYS.length;
    var dayAvgTotals = {
      protein: week.protein / dayCount,
      carbs: week.carbs / dayCount,
      fats: week.fats / dayCount,
      totalCal: week.totalCal / dayCount,
    };
    var budget = macroSplitCalorieBudget(dayAvgTotals.totalCal);
    if (budget == null) return "";
    var deltas = macroNeedDeltas(dayAvgTotals, budget, split);
    return (
      '<div class="week-summary__macros-block">' +
      '<div class="week-summary__macro-need">' +
      '<span class="week-summary__macro-need-label">Need vs ' +
      escapeHtml(split.label) +
      " (day avg)</span>" +
      '<span class="week-summary__macro-need-vals">' +
      macroNeedValsHtml(deltas) +
      "</span>" +
      " · target " +
      split.proteinPct +
      "/" +
      split.carbsPct +
      "/" +
      split.fatsPct +
      "</div></div>"
    );
  }

  function saveBodyWeight() {
    if (!persist) return;
    persist.setSetting(
      "bodyWeightKg",
      userBodyWeightKg == null || userBodyWeightKg <= 0
        ? null
        : userBodyWeightKg
    );
  }

  function loadBodyWeight() {
    if (!persist) {
      userBodyWeightKg = null;
      return;
    }
    var n = persist.getSetting("bodyWeightKg");
    userBodyWeightKg = typeof n === "number" && n > 0 ? n : null;
  }

  function settingsWeightKgFromInput() {
    if (!settingsWeightEl) return NaN;
    var w = parseFloat(settingsWeightEl.value);
    if (isNaN(w) || w <= 0) return NaN;
    return settingsWeightUnit === "lb" ? w * 0.453592 : w;
  }

  function syncSettingsWeightInput() {
    if (!settingsWeightEl) return;
    if (userBodyWeightKg == null || userBodyWeightKg <= 0) {
      settingsWeightEl.value = "";
      return;
    }
    var display =
      settingsWeightUnit === "lb"
        ? userBodyWeightKg / 0.453592
        : userBodyWeightKg;
    settingsWeightEl.value = String(Math.round(display * 10) / 10);
  }

  function setSettingsWeightUnit(unit) {
    settingsWeightUnit = unit === "lb" ? "lb" : "kg";
    if (settingsWeightKgBtn) {
      settingsWeightKgBtn.classList.toggle(
        "tdee-calc__unit-btn--active",
        settingsWeightUnit === "kg"
      );
      settingsWeightKgBtn.setAttribute(
        "aria-pressed",
        settingsWeightUnit === "kg" ? "true" : "false"
      );
    }
    if (settingsWeightLbBtn) {
      settingsWeightLbBtn.classList.toggle(
        "tdee-calc__unit-btn--active",
        settingsWeightUnit === "lb"
      );
      settingsWeightLbBtn.setAttribute(
        "aria-pressed",
        settingsWeightUnit === "lb" ? "true" : "false"
      );
    }
    syncSettingsWeightInput();
  }

  function readSettingsWeightFromInput() {
    var kg = settingsWeightKgFromInput();
    userBodyWeightKg = isNaN(kg) ? null : kg;
    saveBodyWeight();
    syncSettingsMacroSplitPreview();
  }

  function focusSettingsWeightField() {
    if (!settingsWeightEl) return;
    var section = settingsWeightEl.closest(".settings-modal__section");
    if (section && section.scrollIntoView) {
      section.scrollIntoView({ block: "nearest" });
    }
    settingsWeightEl.focus();
  }

  function syncSettingsTdeeInput() {
    if (!settingsTdeeEl) return;
    settingsTdeeEl.value = userTdee != null && userTdee > 0 ? String(Math.round(userTdee)) : "";
    updateTdeePlaceholder();
  }

  function updateTdeePlaceholder() {
    if (!settingsTdeeEl) return;
    settingsTdeeEl.placeholder = String(getTdeeBaseline());
  }

  function readSettingsTdeeFromInput() {
    if (!settingsTdeeEl) return;
    var raw = settingsTdeeEl.value.trim();
    if (!raw) {
      userTdee = null;
      saveTdee();
      return;
    }
    var n = parseFloat(raw);
    userTdee = !isNaN(n) && n > 0 ? n : null;
    saveTdee();
  }

  function showAuthSignupError(message) {
    if (!authSignupErrorEl) return;
    if (!message) {
      authSignupErrorEl.hidden = true;
      authSignupErrorEl.textContent = "";
      return;
    }
    authSignupErrorEl.hidden = false;
    authSignupErrorEl.textContent = message;
  }

  function showAuthLoginError(message) {
    if (!authLoginErrorEl) return;
    if (!message) {
      authLoginErrorEl.hidden = true;
      authLoginErrorEl.textContent = "";
      return;
    }
    authLoginErrorEl.hidden = false;
    authLoginErrorEl.textContent = message;
  }

  function syncAuthUi() {
    var user = auth && auth.getCurrentUser ? auth.getCurrentUser() : null;
    var loggedIn = !!user;
    if (authLoggedOutEl) {
      authLoggedOutEl.hidden = loggedIn;
      authLoggedOutEl.setAttribute("aria-hidden", loggedIn ? "true" : "false");
    }
    if (authLoggedInEl) {
      authLoggedInEl.hidden = !loggedIn;
      authLoggedInEl.setAttribute("aria-hidden", loggedIn ? "false" : "true");
    }
    if (authUserEmailEl) {
      authUserEmailEl.textContent = user ? user.email : "";
      authUserEmailEl.title = user ? user.email : "";
    }
    if (loggedIn) {
      closeAuthSignupModal();
      closeAuthLoginModal();
    }
  }

  function closeAuthSignupModal() {
    if (!authSignupModalEl || authSignupModalEl.hidden) {
      showAuthSignupError("");
      return;
    }
    authSignupModalEl.hidden = true;
    showAuthSignupError("");
    updateBodyModalOpen();
  }

  function closeAuthLoginModal() {
    if (!authLoginModalEl || authLoginModalEl.hidden) {
      showAuthLoginError("");
      return;
    }
    authLoginModalEl.hidden = true;
    showAuthLoginError("");
    updateBodyModalOpen();
  }

  function openAuthSignupModal() {
    if (auth && auth.isLoggedIn && auth.isLoggedIn()) return;
    closeAuthLoginModal();
    if (!authSignupModalEl) return;
    showAuthSignupError("");
    if (authSignupEmailEl) authSignupEmailEl.value = "";
    if (authSignupPasswordEl) authSignupPasswordEl.value = "";
    authSignupModalEl.hidden = false;
    updateBodyModalOpen();
    if (authSignupEmailEl) authSignupEmailEl.focus();
  }

  function openAuthLoginModal() {
    if (auth && auth.isLoggedIn && auth.isLoggedIn()) return;
    closeAuthSignupModal();
    if (!authLoginModalEl) return;
    showAuthLoginError("");
    if (authLoginEmailEl) authLoginEmailEl.value = "";
    if (authLoginPasswordEl) authLoginPasswordEl.value = "";
    authLoginModalEl.hidden = false;
    updateBodyModalOpen();
    if (authLoginEmailEl) authLoginEmailEl.focus();
  }

  function loadPersistedAppState() {
    if (persist) persist.migrate();
    loadFoodDefinitions();
    loadKeywordReorderOpen();
    loadKeywordCaloriesOpen();
    loadKeywordsPageSize();
    loadDayNotes();
    loadFavorites();
    loadDayHighlightsPreference();
    loadDayWordWrapPreference();
    loadDayEditorHeight();
    loadMicroViewDaily();
    loadShowMicroDailyDv();
    loadShowAcuteToxicityIcons();
    loadShowDailyIntakeIcons();
    loadStickyIconFilters();
    loadStickyIconHighlights();
    loadDemographic();
    loadTdee();
    loadMacroSplit();
    loadBodyWeight();
  }

  function applyLoadedAppStateToUi() {
    markTodayDay();
    syncWeekFavoriteButton();
    syncDayFavoriteButtons();
    syncMicroDailyDvToggleUi();
    syncMicroViewToggleUi();
    syncAcuteToxicityToggleUi();
    syncDailyIntakeIconsToggleUi();
    syncStickyIconFilterUi();
    syncStickyIconHighlightUi();
    renderDemographicUi();
    syncDayHighlightsToggleUi();
    syncDayWordWrapToggleUi();
    syncSettingsTdeeInput();
    syncSettingsMacroSplitInput();
    setSettingsWeightUnit(settingsWeightUnit);
    updateKeywordReorderUi();
    updateKeywordCaloriesUi();
    renderKeywords();
    refreshAll();
    syncAuthUi();
  }

  function afterAuthSessionChange() {
    loadPersistedAppState();
    applyLoadedAppStateToUi();
  }

  function submitAuthSignup() {
    if (!auth) return;
    var email = authSignupEmailEl ? authSignupEmailEl.value : "";
    var password = authSignupPasswordEl ? authSignupPasswordEl.value : "";
    var result = auth.signup(email, password);
    if (!result || !result.ok) {
      showAuthSignupError((result && result.error) || "Could not create account.");
      return;
    }
    closeAuthSignupModal();
    afterAuthSessionChange();
  }

  function submitAuthLogin() {
    if (!auth) return;
    var email = authLoginEmailEl ? authLoginEmailEl.value : "";
    var password = authLoginPasswordEl ? authLoginPasswordEl.value : "";
    var result = auth.login(email, password);
    if (!result || !result.ok) {
      showAuthLoginError((result && result.error) || "Could not log in.");
      return;
    }
    closeAuthLoginModal();
    afterAuthSessionChange();
  }

  function submitAuthLogout() {
    if (!auth) return;
    closeAuthSignupModal();
    closeAuthLoginModal();
    auth.logout();
    afterAuthSessionChange();
  }

  function openSettingsModal() {
    if (!settingsModalEl) return;
    syncSettingsTdeeInput();
    setSettingsWeightUnit(settingsWeightUnit);
    syncSettingsWeightInput();
    syncSettingsMacroSplitInput();
    settingsModalEl.hidden = false;
    updateBodyModalOpen();
    if (settingsTdeeEl) {
      settingsTdeeEl.focus();
    }
  }

  function closeSettingsModal() {
    if (!settingsModalEl) return;
    hideMaxHrPopover();
    readSettingsTdeeFromInput();
    readSettingsMacroSplitFromInput();
    readSettingsWeightFromInput();
    settingsModalEl.hidden = true;
    updateBodyModalOpen();
    renderDashboard();
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
    if (longevityPanelOpen) {
      renderLongevityPanel();
    }
  }

  function renderTdeeCalcSexUi() {
    if (!tdeeCalcSexEl) return;
    var buttons = tdeeCalcSexEl.querySelectorAll("[data-tdee-sex]");
    buttons.forEach(function (btn) {
      var id = btn.getAttribute("data-tdee-sex");
      var selected = id === tdeeCalcSex;
      btn.classList.toggle("demographic__option--selected", selected);
      btn.setAttribute("aria-checked", selected ? "true" : "false");
    });
  }

  function setTdeeCalcSex(id) {
    tdeeCalcSex = normalizeDemographic(id);
    renderTdeeCalcSexUi();
    updateTdeeCalculatorResult();
  }

  function setTdeeCalcWeightUnit(unit) {
    tdeeCalcWeightUnit = unit === "lb" ? "lb" : "kg";
    if (tdeeCalcWeightKgBtn) {
      tdeeCalcWeightKgBtn.classList.toggle("tdee-calc__unit-btn--active", tdeeCalcWeightUnit === "kg");
      tdeeCalcWeightKgBtn.setAttribute("aria-pressed", tdeeCalcWeightUnit === "kg" ? "true" : "false");
    }
    if (tdeeCalcWeightLbBtn) {
      tdeeCalcWeightLbBtn.classList.toggle("tdee-calc__unit-btn--active", tdeeCalcWeightUnit === "lb");
      tdeeCalcWeightLbBtn.setAttribute("aria-pressed", tdeeCalcWeightUnit === "lb" ? "true" : "false");
    }
    updateTdeeCalculatorResult();
  }

  function setTdeeCalcHeightUnit(unit) {
    tdeeCalcHeightUnit = unit === "ft" ? "ft" : "cm";
    var isCm = tdeeCalcHeightUnit === "cm";
    if (tdeeCalcHeightCmWrapEl) tdeeCalcHeightCmWrapEl.hidden = !isCm;
    if (tdeeCalcHeightFtWrapEl) tdeeCalcHeightFtWrapEl.hidden = isCm;
    [tdeeCalcHeightCmBtn, tdeeCalcHeightCmBtn2].forEach(function (btn) {
      if (!btn) return;
      btn.classList.toggle("tdee-calc__unit-btn--active", isCm);
      btn.setAttribute("aria-pressed", isCm ? "true" : "false");
    });
    [tdeeCalcHeightFtBtn, tdeeCalcHeightFtBtn2].forEach(function (btn) {
      if (!btn) return;
      btn.classList.toggle("tdee-calc__unit-btn--active", !isCm);
      btn.setAttribute("aria-pressed", !isCm ? "true" : "false");
    });
    updateTdeeCalculatorResult();
  }

  function tdeeCalcWeightKg() {
    if (!tdeeCalcWeightEl) return NaN;
    var w = parseFloat(tdeeCalcWeightEl.value);
    if (isNaN(w) || w <= 0) return NaN;
    return tdeeCalcWeightUnit === "lb" ? w * 0.453592 : w;
  }

  function tdeeCalcHeightCm() {
    if (tdeeCalcHeightUnit === "cm") {
      if (!tdeeCalcHeightCmEl) return NaN;
      var cm = parseFloat(tdeeCalcHeightCmEl.value);
      return isNaN(cm) || cm <= 0 ? NaN : cm;
    }
    if (!tdeeCalcHeightFtEl || !tdeeCalcHeightInEl) return NaN;
    var ft = parseFloat(tdeeCalcHeightFtEl.value);
    var inches = parseFloat(tdeeCalcHeightInEl.value);
    if (isNaN(ft) || ft < 0) return NaN;
    if (isNaN(inches) || inches < 0) inches = 0;
    var totalIn = ft * 12 + inches;
    return totalIn <= 0 ? NaN : totalIn * 2.54;
  }

  function calcMifflinStJeor(sex, age, kg, cm, activityMult) {
    if (isNaN(age) || age <= 0 || isNaN(kg) || kg <= 0 || isNaN(cm) || cm <= 0) return null;
    var bmr =
      sex === "female"
        ? 10 * kg + 6.25 * cm - 5 * age - 161
        : 10 * kg + 6.25 * cm - 5 * age + 5;
    return Math.round(bmr * activityMult);
  }

  function tdeeCalcResistanceBonus() {
    if (tdeeCalcResistanceMode === "sets") {
      var heavy = tdeeCalcHeavySetsEl ? parseInt(tdeeCalcHeavySetsEl.value, 10) : 0;
      var light = tdeeCalcLightSetsEl ? parseInt(tdeeCalcLightSetsEl.value, 10) : 0;
      if (isNaN(heavy) || heavy < 0) heavy = 0;
      if (isNaN(light) || light < 0) light = 0;
      return Math.min(0.35, heavy * 0.01 + light * 0.004);
    }
    var days = tdeeCalcResistanceDaysEl ? parseInt(tdeeCalcResistanceDaysEl.value, 10) : 0;
    if (isNaN(days) || days < 0) days = 0;
    if (days > 7) days = 7;
    return days * 0.04;
  }

  function tdeeCalcCardioBonus() {
    if (!tdeeCalcCardioEnabledEl || !tdeeCalcCardioEnabledEl.checked) return 0;
    var days = tdeeCalcCardioDaysEl ? parseInt(tdeeCalcCardioDaysEl.value, 10) : 0;
    if (isNaN(days) || days < 0) days = 0;
    if (days > 7) days = 7;
    var intensity = tdeeCalcCardioIntensityEl ? tdeeCalcCardioIntensityEl.value : "moderate";
    var perDay = intensity === "vigorous" ? 0.055 : intensity === "light" ? 0.025 : 0.04;
    var cap = intensity === "vigorous" ? 0.3 : intensity === "light" ? 0.12 : 0.2;
    return Math.min(cap, days * perDay);
  }

  function tdeeCalcActivityMultiplier() {
    var mult = 1.2 + tdeeCalcResistanceBonus() + tdeeCalcCardioBonus();
    return Math.min(1.95, Math.max(1.2, mult));
  }

  function setTdeeCalcResistanceMode(mode) {
    tdeeCalcResistanceMode = mode === "sets" ? "sets" : "days";
    var isDays = tdeeCalcResistanceMode === "days";
    if (tdeeCalcResistanceDaysWrapEl) tdeeCalcResistanceDaysWrapEl.hidden = !isDays;
    if (tdeeCalcResistanceSetsWrapEl) tdeeCalcResistanceSetsWrapEl.hidden = isDays;
    if (tdeeCalcResistanceModeDaysBtn) {
      tdeeCalcResistanceModeDaysBtn.classList.toggle("tdee-calc__unit-btn--active", isDays);
      tdeeCalcResistanceModeDaysBtn.setAttribute("aria-pressed", isDays ? "true" : "false");
    }
    if (tdeeCalcResistanceModeSetsBtn) {
      tdeeCalcResistanceModeSetsBtn.classList.toggle("tdee-calc__unit-btn--active", !isDays);
      tdeeCalcResistanceModeSetsBtn.setAttribute("aria-pressed", !isDays ? "true" : "false");
    }
    updateTdeeCalculatorResult();
  }

  function syncTdeeCalcCardioUi() {
    var enabled = tdeeCalcCardioEnabledEl && tdeeCalcCardioEnabledEl.checked;
    if (tdeeCalcCardioWrapEl) tdeeCalcCardioWrapEl.hidden = !enabled;
    updateTdeeCalculatorResult();
  }

  function updateTdeeCalculatorResult() {
    if (!tdeeCalcResultEl) return;
    var age = tdeeCalcAgeEl ? parseFloat(tdeeCalcAgeEl.value) : NaN;
    var kg = tdeeCalcWeightKg();
    var cm = tdeeCalcHeightCm();
    var activityMult = tdeeCalcActivityMultiplier();
    if (tdeeCalcActivityFactorEl) {
      tdeeCalcActivityFactorEl.textContent = "Activity factor: " + activityMult.toFixed(2) + " (sedentary base + training)";
    }
    var tdee = calcMifflinStJeor(tdeeCalcSex, age, kg, cm, activityMult);
    tdeeCalcLastResult = tdee;
    if (tdee == null) {
      tdeeCalcResultEl.textContent = "—";
      if (tdeeCalculatorApplyBtn) tdeeCalculatorApplyBtn.disabled = true;
      return;
    }
    tdeeCalcResultEl.textContent = fmtNumGrouped(tdee) + " cal/day";
    if (tdeeCalculatorApplyBtn) tdeeCalculatorApplyBtn.disabled = false;
  }

  function openTdeeCalculatorModal() {
    if (!tdeeCalculatorModalEl) return;
    tdeeCalcSex = demographic;
    renderTdeeCalcSexUi();
    setTdeeCalcWeightUnit(tdeeCalcWeightUnit);
    setTdeeCalcHeightUnit(tdeeCalcHeightUnit);
    setTdeeCalcResistanceMode(tdeeCalcResistanceMode);
    syncTdeeCalcCardioUi();
    if (userBodyWeightKg && tdeeCalcWeightEl) {
      var display =
        tdeeCalcWeightUnit === "lb"
          ? userBodyWeightKg / 0.453592
          : userBodyWeightKg;
      tdeeCalcWeightEl.value = String(Math.round(display * 10) / 10);
    }
    updateTdeeCalculatorResult();
    tdeeCalculatorModalEl.hidden = false;
    updateBodyModalOpen();
    if (tdeeCalcAgeEl) tdeeCalcAgeEl.focus();
  }

  function closeTdeeCalculatorModal() {
    if (!tdeeCalculatorModalEl) return;
    tdeeCalculatorModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function applyTdeeFromCalculator() {
    if (tdeeCalcLastResult == null) return;
    userTdee = tdeeCalcLastResult;
    saveTdee();
    var kg = tdeeCalcWeightKg();
    if (!isNaN(kg) && kg > 0) {
      userBodyWeightKg = kg;
      saveBodyWeight();
      syncSettingsWeightInput();
    }
    syncSettingsTdeeInput();
    closeTdeeCalculatorModal();
    if (weekTotalOpen && lastWeekTotals) {
      renderWeekSummary(lastWeekTotals);
    }
  }

  function openTdeeHintModal() {
    if (!tdeeHintModalEl) return;
    tdeeHintModalEl.hidden = false;
    updateBodyModalOpen();
  }

  function closeTdeeHintModal() {
    if (!tdeeHintModalEl) return;
    tdeeHintModalEl.hidden = true;
    updateBodyModalOpen();
  }

  function openMacroSplitHintModal() {
    if (!macroSplitHintModalEl) return;
    macroSplitCarouselIndex = 0;
    renderMacroSplitCarousel();
    macroSplitHintModalEl.hidden = false;
    updateBodyModalOpen();
  }

  function closeMacroSplitHintModal() {
    if (!macroSplitHintModalEl) return;
    macroSplitHintModalEl.hidden = true;
    updateBodyModalOpen();
  }

  var MACRO_BODY_TYPES = [
    {
      title: "Ectomorph",
      mix: false,
      blurb:
        "Naturally lean and long-limbed; gains weight slowly. Tolerates—and often needs—more carbs to fuel training and a surplus.",
      goals: [
        {
          title: "Lose weight (fat loss)",
          note: "Run a modest deficit (see TDEE comparison). You may not need the highest protein if you are already lean—prioritize keeping training fuel.",
          protein: "Lower range (~28–32%) — enough to preserve muscle without crowding out carbs.",
          carbs: "Higher range (~35–40%) — keeps energy up for lifting and cardio.",
          fats: "Lower range (~25–28%) — don’t go too low; hormones still need fat.",
        },
        {
          title: "Gain muscle (lean bulk)",
          note: "Use a small surplus (~200–400 cal/day). You may need a slightly larger surplus than other types to see scale movement.",
          protein: "Lower range (~25–28%) — hit ~0.7–0.9 g/lb; extra calories are better spent on carbs.",
          carbs: "Higher range (~45–50%) — main driver for training volume and recovery.",
          fats: "Lower range (~20–25%) — fill remaining calories after protein and carbs.",
        },
        {
          title: "Recomposition & maintenance",
          note: "At maintenance, nudge composition with progressive lifting—not aggressive cuts.",
          protein: "Mid range (~28–30%) — steady, not maximal.",
          carbs: "Higher range (~42–45%) — supports frequent training.",
          fats: "Lower-mid range (~25–28%).",
        },
        {
          title: "Endurance & high-volume training",
          note: "Long sessions raise carb demand sharply for this type.",
          protein: "Lower range (~20–22%) — maintenance, not bulk.",
          carbs: "Higher range (~55–60%) — primary fuel for volume.",
          fats: "Lower range (~20–22%).",
        },
      ],
    },
    {
      title: "Ecto-mesomorph",
      mix: true,
      blurb:
        "Lean like an ectomorph but adds muscle more readily—athletic “hard gainer who responds.” Often the easiest mixed type for recomposition.",
      goals: [
        {
          title: "Lose weight (fat loss)",
          note: "Moderate deficit; you usually keep muscle well if protein stays solid.",
          protein: "Mid range (~32–35%) — slightly above ectomorph defaults.",
          carbs: "Mid-high range (~32–38%) — trim carbs before slashing below ~30%.",
          fats: "Mid range (~28–30%).",
        },
        {
          title: "Gain muscle (lean bulk)",
          note: "Small surplus is enough; you tend to partition calories toward muscle.",
          protein: "Mid range (~28–32%) — ~0.8–1.0 g/lb.",
          carbs: "Higher range (~42–48%) — still your best lever for volume.",
          fats: "Lower-mid range (~22–25%).",
        },
        {
          title: "Recomposition & maintenance",
          note: "Sweet spot for this mix—balanced split at maintenance often works.",
          protein: "Mid range (~30–32%).",
          carbs: "Mid range (~40–42%).",
          fats: "Mid range (~28–30%).",
        },
        {
          title: "Endurance & high-volume training",
          note: "Blend ectomorph carb tolerance with mesomorph recovery.",
          protein: "Lower-mid range (~22–24%).",
          carbs: "Higher range (~52–56%).",
          fats: "Mid range (~22–25%).",
        },
      ],
    },
    {
      title: "Mesomorph",
      mix: false,
      blurb:
        "Broad shoulders, natural muscle; loses fat and gains mass relatively easily. Balanced macros usually work—adjust by goal, not extremes.",
      goals: [
        {
          title: "Lose weight (fat loss)",
          note: "Moderate deficit; avoid over-cutting carbs if performance drops.",
          protein: "Mid range (~32–35%) — ~0.8–1.0 g/lb.",
          carbs: "Mid range (~30–35%) — lower if sedentary, higher if training hard.",
          fats: "Mid range (~30–32%).",
        },
        {
          title: "Gain muscle (lean bulk)",
          note: "Small surplus (~200–400 cal/day); you often respond quickly—don’t overshoot calories.",
          protein: "Mid range (~28–32%).",
          carbs: "Mid range (~42–45%) — supports volume without excess fat gain.",
          fats: "Mid range (~25–28%).",
        },
        {
          title: "Recomposition & maintenance",
          note: "Classic ~30 / 40 / 30 split is a strong default here.",
          protein: "Mid range (~30%).",
          carbs: "Mid range (~40%).",
          fats: "Mid range (~30%).",
        },
        {
          title: "Endurance & high-volume training",
          note: "Shift toward carbs without dropping protein too far.",
          protein: "Mid range (~22–25%).",
          carbs: "Mid-high range (~50–55%).",
          fats: "Mid range (~22–25%).",
        },
      ],
    },
    {
      title: "Meso-endomorph",
      mix: true,
      blurb:
        "Muscular frame but gains fat easily—strong lifter who has to watch surplus and carbs. Protein and portion control matter more than for pure mesomorphs.",
      goals: [
        {
          title: "Lose weight (fat loss)",
          note: "Deficit with higher protein and controlled carbs usually works best.",
          protein: "Higher range (~35–38%) — satiety and muscle retention.",
          carbs: "Lower-mid range (~28–32%) — tighten if fat loss stalls.",
          fats: "Mid range (~30–32%) — moderate, not minimal.",
        },
        {
          title: "Gain muscle (lean bulk)",
          note: "Keep surplus small; extra carbs can spill over into fat for this mix.",
          protein: "Mid-high range (~30–33%) — anchor the bulk.",
          carbs: "Mid range (~38–42%) — enough for lifts, not a free-for-all.",
          fats: "Mid range (~25–28%).",
        },
        {
          title: "Recomposition & maintenance",
          note: "Higher protein at maintenance helps offset carb sensitivity.",
          protein: "Higher range (~32–35%).",
          carbs: "Lower-mid range (~35–38%).",
          fats: "Mid range (~28–30%).",
        },
        {
          title: "Endurance & high-volume training",
          note: "Add carbs around sessions; keep baseline carbs moderate on rest days.",
          protein: "Mid range (~24–26%).",
          carbs: "Mid range (~45–50%) — periodize up on big weeks.",
          fats: "Mid range (~24–28%).",
        },
      ],
    },
    {
      title: "Endomorph",
      mix: false,
      blurb:
        "Rounder, stores fat readily; often strongest on higher protein and tighter carbs when cutting. Surplus bulks can add fat quickly—go slow.",
      goals: [
        {
          title: "Lose weight (fat loss)",
          note: "Modest deficit; protein and fiber keep hunger manageable.",
          protein: "Higher range (~35–40%) — ~0.9–1.0+ g/lb if training.",
          carbs: "Lower range (~25–30%) — raise only if performance suffers.",
          fats: "Mid-high range (~30–35%) — don’t drop fat too low.",
        },
        {
          title: "Gain muscle (lean bulk)",
          note: "Minimal surplus; monitor waist and scale weekly.",
          protein: "Higher range (~30–35%) — muscle without relying on excess carbs.",
          carbs: "Lower-mid range (~35–40%) — enough for training, not maximal.",
          fats: "Mid-high range (~28–32%).",
        },
        {
          title: "Recomposition & maintenance",
          note: "Protein-forward split at maintenance supports slow composition shifts.",
          protein: "Higher range (~32–35%).",
          carbs: "Lower-mid range (~35–38%).",
          fats: "Mid range (~28–30%).",
        },
        {
          title: "Endurance & high-volume training",
          note: "Carbs still rise with mileage—just not as high as for ectomorphs.",
          protein: "Mid range (~24–26%).",
          carbs: "Mid range (~45–48%) — fuel sessions, trim elsewhere if needed.",
          fats: "Mid-high range (~26–28%).",
        },
      ],
    },
    {
      title: "Ecto-endomorph",
      mix: true,
      blurb:
        "Often “skinny fat” or lean limbs with fat stored centrally—small frame but sensitive to surplus. Needs ectomorph portion sizes with endomorph macro discipline.",
      goals: [
        {
          title: "Lose weight (fat loss)",
          note: "Deficit with endomorph-style macro tilt even if you look small—central fat is often the issue, not scale weight.",
          protein: "Higher range (~34–38%) — protect lean mass.",
          carbs: "Lower range (~26–30%) — tighter than pure ectomorph.",
          fats: "Mid range (~30–32%).",
        },
        {
          title: "Gain muscle (lean bulk)",
          note: "Very small surplus; prioritize lifting over calorie floods.",
          protein: "Mid-high range (~30–33%).",
          carbs: "Mid range (~38–42%) — not ectomorph-high.",
          fats: "Mid range (~25–28%).",
        },
        {
          title: "Recomposition & maintenance",
          note: "Maintenance + high protein + lifting is often the best first step for this mix.",
          protein: "Higher range (~32–35%).",
          carbs: "Lower-mid range (~35–38%).",
          fats: "Mid range (~28–30%).",
        },
        {
          title: "Endurance & high-volume training",
          note: "Add carbs for long efforts; keep baseline moderate on easy weeks.",
          protein: "Mid range (~24–26%).",
          carbs: "Mid range (~44–48%).",
          fats: "Mid range (~26–28%).",
        },
      ],
    },
  ];

  function macroSplitGoalHtml(goal) {
    var recompExplain =
      goal.title === "Recomposition & maintenance"
        ? '<p class="macro-split-card__recomp-explain"><strong>Recomposition</strong> means eating at roughly maintenance calories while your body slowly trades fat for lean mass—scale weight may barely move, but shape and strength can improve over weeks and months. It is not a fast cut or a bulk; progressive resistance training is what drives the shift.</p>'
        : "";
    return (
      '<section class="macro-split-card__goal">' +
      '<h4 class="macro-split-card__goal-title">' +
      goal.title +
      "</h4>" +
      recompExplain +
      "<p>" +
      goal.note +
      "</p>" +
      '<ul class="micro-tip-modal__list macro-split-card__macros">' +
      "<li><strong>Protein:</strong> " +
      goal.protein +
      "</li>" +
      "<li><strong>Carbs:</strong> " +
      goal.carbs +
      "</li>" +
      "<li><strong>Fats:</strong> " +
      goal.fats +
      "</li>" +
      "</ul>" +
      "</section>"
    );
  }

  function renderMacroSplitCarousel() {
    if (!macroSplitCarouselCardEl || !macroSplitCarouselIndicatorEl) return;

    var types = MACRO_BODY_TYPES;
    if (!types.length) return;

    if (macroSplitCarouselIndex < 0) {
      macroSplitCarouselIndex = types.length - 1;
    } else if (macroSplitCarouselIndex >= types.length) {
      macroSplitCarouselIndex = 0;
    }

    var body = types[macroSplitCarouselIndex];
    var goalsHtml = "";
    body.goals.forEach(function (goal) {
      goalsHtml += macroSplitGoalHtml(goal);
    });

    macroSplitCarouselIndicatorEl.textContent =
      body.title + " (" + (macroSplitCarouselIndex + 1) + " / " + types.length + ")";

    macroSplitCarouselCardEl.innerHTML =
      '<header class="macro-split-card__head">' +
      "<h4 class=\"macro-split-card__title\">" +
      body.title +
      (body.mix ? ' <span class="macro-split-card__mix">mixed</span>' : "") +
      "</h4>" +
      "<p class=\"macro-split-card__blurb\">" +
      body.blurb +
      "</p>" +
      "</header>" +
      '<div class="macro-split-card__goals">' +
      goalsHtml +
      "</div>";

    if (macroSplitCarouselPrevEl) {
      var prev = types[(macroSplitCarouselIndex - 1 + types.length) % types.length];
      macroSplitCarouselPrevEl.setAttribute("aria-label", "Previous body type: " + prev.title);
    }
    if (macroSplitCarouselNextEl) {
      var next = types[(macroSplitCarouselIndex + 1) % types.length];
      macroSplitCarouselNextEl.setAttribute("aria-label", "Next body type: " + next.title);
    }
  }

  function setMacroSplitCarouselIndex(index) {
    macroSplitCarouselIndex = index;
    renderMacroSplitCarousel();
  }

  function shiftMacroSplitCarousel(delta) {
    setMacroSplitCarouselIndex(macroSplitCarouselIndex + delta);
  }

  function saveDemographic() {
    if (!persist) return;
    persist.setSetting("demographic", demographic);
  }

  function loadDemographic() {
    if (!persist) {
      demographic = DEFAULT_DEMOGRAPHIC;
      return;
    }
    var raw = persist.getSetting("demographic");
    if (raw) demographic = normalizeDemographic(raw);
  }

  function renderDemographicUi() {
    var metaMap = demographicDv ? demographicDv.META : {};
    var meta = metaMap[demographic] || metaMap[DEFAULT_DEMOGRAPHIC] || { icon: "♂", label: "Male" };
    if (settingsDemographicIconEl) {
      settingsDemographicIconEl.textContent = meta.icon;
    }
    if (settingsDemographicAbbrEl) {
      settingsDemographicAbbrEl.textContent = (meta.label || "M").charAt(0).toUpperCase();
    }
    if (!demographicOptionsEl) return;
    var buttons = demographicOptionsEl.querySelectorAll("[data-demographic]");
    buttons.forEach(function (btn) {
      var id = btn.getAttribute("data-demographic");
      var selected = id === demographic;
      btn.classList.toggle("demographic__option--selected", selected);
      btn.setAttribute("aria-checked", selected ? "true" : "false");
    });
    updateTdeePlaceholder();
  }

  function setDemographic(id) {
    var prevDemographic = demographic;
    demographic = normalizeDemographic(id);
    saveDemographic();
    renderDemographicUi();
    renderMicroRequirements();
    if (prevDemographic !== demographic) {
      resetLongevityNavList();
      if (longevityPanelOpen) {
        renderLongevityPanel();
      }
    }
    if (weekTotalOpen && lastWeekTotals) {
      renderWeekSummary(lastWeekTotals);
    }
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

  function macroPctFromTotals(t) {
    if (!t.totalCal) return { p: null, c: null, f: null };
    return {
      p: (t.proteinCal / t.totalCal) * 100,
      c: (t.carbsCal / t.totalCal) * 100,
      f: (t.fatsCal / t.totalCal) * 100,
    };
  }

  function dashboardCardToggleIconHtml(isPct) {
    return (
      '<svg class="dashboard__card-toggle-icon' +
      (isPct ? " dashboard__card-toggle-icon--flipped" : "") +
      '" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"></circle>' +
      '<path d="M8 8 L8 2 A6 6 0 0 1 13.2 10 Z" fill="currentColor" opacity="0.35"></path>' +
      '<path d="M8 8 L13.2 10 A6 6 0 0 1 8 14 Z" fill="currentColor" opacity="0.6"></path>' +
      "</svg>"
    );
  }

  function dashboardCardRankIconHtml(dayId) {
    return (
      '<button type="button" class="dashboard__card-rank" data-action="open-macro-rank-modal" data-day-id="' +
      escapeHtml(dayId) +
      '" aria-label="Show ranked macros for this day" title="Ranked macros">' +
      '<svg class="dashboard__card-rank-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<rect x="1" y="8" width="3" height="7" rx="0.5"></rect>' +
      '<rect x="6.5" y="4" width="3" height="11" rx="0.5"></rect>' +
      '<rect x="12" y="1" width="3" height="14" rx="0.5"></rect>' +
      "</svg></button>"
    );
  }

  function dashboardCardHtml(label, totals, dayId, dateLabel) {
    var isToday = dayId === activeTodayDayId();
    var isPct = dashboardMacroPctView;
    var pct = macroPctFromTotals(totals);
    var toggleLabel = isPct ? "Show grams and calories" : "Show macro percentages";
    var rowsHtml;

    if (isPct) {
      rowsHtml =
        '<div class="dashboard__row"><span class="dashboard__macro">Protein</span><span class="dashboard__val">' +
        (pct.p == null ? "—" : Math.round(pct.p) + "%") +
        "</span></div>" +
        '<div class="dashboard__row"><span class="dashboard__macro">Carbs</span><span class="dashboard__val">' +
        (pct.c == null ? "—" : Math.round(pct.c) + "%") +
        "</span></div>" +
        '<div class="dashboard__row"><span class="dashboard__macro">Fats</span><span class="dashboard__val">' +
        (pct.f == null ? "—" : Math.round(pct.f) + "%") +
        "</span></div>";
    } else {
      rowsHtml =
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
        " cal</span></div>";
    }

    return (
      '<div class="dashboard__day">' +
      '<article class="dashboard__card' +
      (isToday ? " dashboard__card--today" : "") +
      '">' +
      '<div class="dashboard__card-head">' +
      '<div class="dashboard__card-head-text">' +
      '<span class="dashboard__label"' +
      (isToday ? ' aria-current="date"' : "") +
      ">" +
      escapeHtml(label) +
      "</span>" +
      (dateLabel
        ? '<span class="dashboard__date">' + escapeHtml(dateLabel) + "</span>"
        : "") +
      "</div>" +
      '<div class="dashboard__card-actions">' +
      dashboardCardRankIconHtml(dayId) +
      '<button type="button" class="dashboard__card-toggle" data-action="toggle-dashboard-macro-view" data-day-id="' +
      escapeHtml(dayId) +
      '" aria-label="' +
      escapeHtml(toggleLabel) +
      '" aria-pressed="' +
      (isPct ? "true" : "false") +
      '">' +
      dashboardCardToggleIconHtml(isPct) +
      "</button>" +
      "</div>" +
      "</div>" +
      rowsHtml +
      '<div class="dashboard__row dashboard__row--total"><span class="dashboard__macro">Total</span><span class="dashboard__val">' +
      fmtNum(totals.totalCal) +
      " cal</span></div>" +
      "</article>" +
      dashboardMacroNeedBlockHtml(totals, isToday) +
      "</div>"
    );
  }

  function weekSummaryIconHtml(kind) {
    if (kind === "week") {
      return (
        '<svg class="week-summary__icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
        '<rect x="1" y="5" width="1.6" height="6" rx="0.3"></rect>' +
        '<rect x="3.1" y="5" width="1.6" height="6" rx="0.3"></rect>' +
        '<rect x="5.2" y="5" width="1.6" height="6" rx="0.3"></rect>' +
        '<rect x="7.3" y="5" width="1.6" height="6" rx="0.3"></rect>' +
        '<rect x="9.4" y="5" width="1.6" height="6" rx="0.3"></rect>' +
        '<rect x="11.5" y="5" width="1.6" height="6" rx="0.3"></rect>' +
        '<rect x="13.6" y="5" width="1.4" height="6" rx="0.3"></rect>' +
        "</svg>"
      );
    }
    if (kind === "tdee") {
      return (
        '<svg class="week-summary__icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
        '<path d="M3 12 L8 4 L13 12 Z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"></path>' +
        '<line x1="5.5" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"></line>' +
        "</svg>"
      );
    }
    return (
      '<svg class="week-summary__icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<rect x="5.5" y="4" width="5" height="8" rx="0.5"></rect>' +
      '<line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>' +
      "</svg>"
    );
  }

  function weekSummaryExplainLinkHtml() {
    return (
      '<button type="button" class="dashboard__longevity-section-link week-summary__explain-link" data-action="open-tdee-hint-modal" aria-haspopup="dialog">explain</button>'
    );
  }

  function weekSummaryMacroExplainLinkHtml() {
    return (
      '<button type="button" class="dashboard__longevity-section-link week-summary__explain-link" data-action="open-macro-split-hint-modal" aria-haspopup="dialog">explain</button>'
    );
  }

  function renderWeekSummary(week) {
    if (!weekSummaryEl) return;

    var dayAvgCal = week.totalCal / DAYS.length;
    var tdee = getTdee();
    var thirdStatHtml;

    if (tdee) {
      var weeklyTdee = tdee * DAYS.length;
      var weeklyDelta = week.totalCal - weeklyTdee;
      var lbsPerWeek = weeklyDelta / 3500;
      var statClass = "week-summary__stat week-summary__stat--balance";
      var label = "Maintenance";
      if (weeklyDelta < -25 * DAYS.length) {
        statClass += " week-summary__stat--deficit";
        label = "Deficit";
      } else if (weeklyDelta > 25 * DAYS.length) {
        statClass += " week-summary__stat--surplus";
        label = "Surplus";
      }
      var deltaPrefix = weeklyDelta >= 0 ? "+" : "";
      var lbsPrefix = lbsPerWeek >= 0 ? "+" : "";
      thirdStatHtml =
        '<div class="' +
        statClass +
        '">' +
        '<span class="week-summary__label">' +
        weekSummaryIconHtml("tdee") +
        label +
        "</span>" +
        '<span class="week-summary__calories">' +
        deltaPrefix +
        fmtNumGrouped(weeklyDelta) +
        " cal/week</span>" +
        '<span class="week-summary__projection">' +
        "~" +
        lbsPrefix +
        fmtNum(lbsPerWeek) +
        " lb/week</span>" +
        weekSummaryExplainLinkHtml() +
        "</div>";
    } else {
      thirdStatHtml =
        '<div class="week-summary__stat week-summary__stat--balance week-summary__stat--unset">' +
        '<span class="week-summary__label">' +
        weekSummaryIconHtml("tdee") +
        "vs TDEE" +
        "</span>" +
        '<span class="week-summary__calories week-summary__calories--muted">Set TDEE in Settings</span>' +
        weekSummaryExplainLinkHtml() +
        "</div>";
    }

    var macroPct = macroPctFromTotals(week);
    var macrosHtml = "";
    if (week.totalCal > 0 && macroPct.p != null) {
      macrosHtml =
        '<div class="week-summary__macros-block">' +
        '<div class="week-summary__macros">' +
        '<span class="week-summary__macros-label">Macro split (week avg)</span><div style="margin-top:5px;"></div> ' +
        "Protein " +
        Math.round(macroPct.p) +
        "% · Carbs " +
        Math.round(macroPct.c) +
        "% · Fats " +
        Math.round(macroPct.f) +
        "%" +
        "</div>" +
        weekSummaryMacroExplainLinkHtml() +
        "</div>";
    }
    var macroNeedHtml = weekSummaryMacroNeedHtml(week);

    weekSummaryEl.innerHTML =
      '<div class="week-summary__stats">' +
      '<div class="week-summary__stat">' +
      '<span class="week-summary__label">' +
      weekSummaryIconHtml("week") +
      "Week total</span>" +
      '<span class="week-summary__calories">' +
      fmtNumGrouped(week.totalCal) +
      " cal</span>" +
      "</div>" +
      '<div class="week-summary__stat">' +
      '<span class="week-summary__label">' +
      weekSummaryIconHtml("day") +
      "Day average</span>" +
      '<span class="week-summary__calories">' +
      fmtNumGrouped(dayAvgCal) +
      " cal</span>" +
      "</div>" +
      "</div>" +
      '<div class="week-summary__detail">' +
      thirdStatHtml +
      macrosHtml +
      macroNeedHtml +
      "</div>";
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
      html += dashboardCardHtml(day.label, totals, day.id, dateLabelForDayId(day.id));
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

  function setDayEditorMode(textarea, mode) {
    var editor = textarea.closest(".day__editor");
    if (!editor) return;
    editor.classList.remove(
      "day__editor--editing",
      "day__editor--viewing",
      "day__editor--plain"
    );
    editor.classList.add("day__editor--" + mode);
  }

  function updateDayEditorMode(textarea) {
    if (!textarea) return;
    if (!dayHighlightsEnabled) {
      setDayEditorMode(textarea, "plain");
      return;
    }
    if (document.activeElement === textarea) {
      setDayEditorMode(textarea, "editing");
      return;
    }
    setDayEditorMode(textarea, "viewing");
    updateDayHighlights(textarea);
  }

  function normalizeDayMealsText(text) {
    return String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
  }

  function visibleDayLineText(line) {
    return String(line || "")
      .replace(
        /[\u0000-\u001F\u007F-\u009F\u00A0\u00AD\u1680\u2000-\u200F\u2028\u2029\u202F\u205F\u3000\uFEFF]/g,
        ""
      )
      .trim();
  }

  function isBlankDayMealLine(line) {
    var visible = visibleDayLineText(line);
    if (!visible) return true;
    // Separator-only lines (bullets, dashes, dots) are not meal entries.
    return !/[A-Za-z0-9]/.test(visible);
  }

  function unmatchedDayLines(text) {
    var lines = normalizeDayMealsText(text).split("\n");
    var unmatched = [];
    lines.forEach(function (line, index) {
      if (isBlankDayMealLine(line)) return;
      var visible = visibleDayLineText(line);
      if (!lineMatchesFoodDefinition(visible)) {
        unmatched.push({ lineNum: index + 1, text: visible });
      }
    });
    return unmatched;
  }

  function allUnmatchedDayLines() {
    var items = [];
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      if (!el) return;
      unmatchedDayLines(el.value).forEach(function (item) {
        items.push({
          dayId: day.id,
          dayLabel: day.label.toUpperCase(),
          lineNum: item.lineNum,
          text: item.text,
        });
      });
    });
    return items;
  }

  function weekUnmatchedCarouselHtml(items, index) {
    var item = items[index];
    if (!item) return "";
    return (
      '<div class="week__unmatched-carousel" role="region" aria-label="Unmatched meal lines">' +
      '<div class="week__unmatched-carousel-nav">' +
      '<button type="button" class="week__unmatched-carousel-adj" data-unmatched-action="prev" aria-label="Previous unmatched line"' +
      (items.length < 2 ? " disabled" : "") +
      ">&lt;</button>" +
      '<span class="week__unmatched-carousel-indicator">' +
      (index + 1) +
      " / " +
      items.length +
      "</span>" +
      '<button type="button" class="week__unmatched-carousel-adj" data-unmatched-action="next" aria-label="Next unmatched line"' +
      (items.length < 2 ? " disabled" : "") +
      ">&gt;</button>" +
      "</div>" +
      '<button type="button" class="week__unmatched-carousel-card" data-unmatched-action="jump" data-day-id="' +
      escapeHtml(item.dayId) +
      '" data-line-num="' +
      item.lineNum +
      '">' +
      '<span class="week__unmatched-carousel-loc">' +
      escapeHtml(item.dayLabel) +
      " line " +
      item.lineNum +
      "</span>" +
      '<span class="week__unmatched-carousel-text">' +
      escapeHtml(item.text) +
      "</span>" +
      '<span class="week__unmatched-carousel-hint">Go to line</span>' +
      "</button>" +
      "</div>"
    );
  }

  function weekUnmatchedLinesHtml(items, open, index) {
    if (!items.length) return "";
    return (
      '<button type="button" class="week__unmatched-toggle" data-unmatched-action="toggle" aria-expanded="' +
      (open ? "true" : "false") +
      '">' +
      '<span class="week__unmatched-toggle-label">Unmatched</span>' +
      '<span class="week__unmatched-count">(' +
      items.length +
      ")</span>" +
      "</button>" +
      (open ? weekUnmatchedCarouselHtml(items, index) : "")
    );
  }

  function focusDayLine(dayId, lineNum) {
    var textarea = document.getElementById(dayId);
    if (!textarea) return;
    var lines = normalizeDayMealsText(textarea.value).split("\n");
    var index = Math.max(0, Math.min(lines.length - 1, Number(lineNum) - 1));
    var start = 0;
    // Map normalized line index back onto the raw textarea value, which may still use \r\n.
    var raw = String(textarea.value || "");
    var rawPos = 0;
    var lineIdx = 0;
    while (rawPos < raw.length && lineIdx < index) {
      var ch = raw.charAt(rawPos);
      if (ch === "\r" && raw.charAt(rawPos + 1) === "\n") {
        rawPos += 2;
        lineIdx += 1;
      } else if (ch === "\n" || ch === "\r") {
        rawPos += 1;
        lineIdx += 1;
      } else {
        rawPos += 1;
      }
    }
    start = rawPos;
    var end = start;
    while (
      end < raw.length &&
      raw.charAt(end) !== "\n" &&
      raw.charAt(end) !== "\r"
    ) {
      end += 1;
    }
    var editor = textarea.closest(".day__editor");
    if (editor) {
      var dayEl = editor.closest(".day");
      if (dayEl) {
        if (isDaysCarouselActive()) {
          setDaysCarouselDayId(dayId);
        } else {
          dayEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
    setDayEditorMode(textarea, "editing");
    setDayInputSelection(textarea, start, end);
  }

  function focusUnmatchedCarouselItem() {
    var item = unmatchedCarouselItems[unmatchedCarouselIndex];
    if (!item) return;
    focusDayLine(item.dayId, item.lineNum);
  }

  function renderWeekUnmatchedLines(focusItem) {
    if (!dayUnmatchedLinesEl) return;
    if (!unmatchedCarouselItems.length) {
      unmatchedCarouselOpen = false;
      unmatchedCarouselIndex = 0;
      dayUnmatchedLinesEl.hidden = true;
      dayUnmatchedLinesEl.innerHTML = "";
      return;
    }
    if (unmatchedCarouselIndex >= unmatchedCarouselItems.length) {
      unmatchedCarouselIndex = unmatchedCarouselItems.length - 1;
    }
    if (unmatchedCarouselIndex < 0) unmatchedCarouselIndex = 0;
    dayUnmatchedLinesEl.innerHTML = weekUnmatchedLinesHtml(
      unmatchedCarouselItems,
      unmatchedCarouselOpen,
      unmatchedCarouselIndex
    );
    dayUnmatchedLinesEl.hidden = false;
    if (focusItem && unmatchedCarouselOpen) focusUnmatchedCarouselItem();
  }

  function updateWeekUnmatchedLines() {
    if (!dayUnmatchedLinesEl) return;
    unmatchedCarouselItems = allUnmatchedDayLines();
    renderWeekUnmatchedLines(false);
  }

  function stepUnmatchedCarousel(delta) {
    if (!unmatchedCarouselItems.length) return;
    var len = unmatchedCarouselItems.length;
    unmatchedCarouselIndex = (unmatchedCarouselIndex + delta + len) % len;
    renderWeekUnmatchedLines(false);
  }

  function toggleUnmatchedCarousel() {
    unmatchedCarouselOpen = !unmatchedCarouselOpen;
    renderWeekUnmatchedLines(false);
  }

  function backdropCaretRect(backdrop, pos) {
    if (!backdrop) return null;

    var textLen = backdrop.textContent.length;
    if (pos < 0) return null;
    if (pos > textLen) pos = textLen;

    var node = null;
    var offset = 0;
    var count = 0;

    function walk(el) {
      if (node) return;
      if (el.nodeType === 3) {
        if (count + el.length >= pos) {
          node = el;
          offset = pos - count;
          return;
        }
        count += el.length;
        return;
      }
      for (var i = 0; i < el.childNodes.length; i++) {
        walk(el.childNodes[i]);
      }
    }

    walk(backdrop);

    if (!node) {
      if (pos !== 0) return null;
      var box = backdrop.getBoundingClientRect();
      var pad = getComputedStyle(backdrop);
      return {
        left: box.left + parseFloat(pad.paddingLeft),
        top: box.top + parseFloat(pad.paddingTop),
        height: parseFloat(pad.lineHeight) || 16,
        width: 0,
      };
    }

    var range = document.createRange();
    range.setStart(node, Math.min(offset, node.length));
    range.collapse(true);
    return range.getBoundingClientRect();
  }

  function caretIndexFromBackdropPoint(textarea, clientX, clientY) {
    var editor = textarea.closest(".day__editor");
    if (!editor) return null;
    var backdrop = editor.querySelector(".day__backdrop");
    if (!backdrop) return null;
    syncScroll(textarea, backdrop);

    var text = textarea.value;
    var bestPos = text.length;
    var bestScore = Infinity;

    for (var pos = 0; pos <= text.length; pos++) {
      var rect = backdropCaretRect(backdrop, pos);
      if (!rect) continue;
      var midY = rect.top + rect.height / 2;
      var dy = clientY - midY;
      var dx = clientX - rect.left;
      var score = dy * dy * 4 + dx * dx;
      if (score < bestScore) {
        bestScore = score;
        bestPos = pos;
      }
    }

    return bestPos;
  }

  function setDayInputSelection(textarea, start, end) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
  }

  function updateDayHighlights(textarea) {
    var editor = textarea.closest(".day__editor");
    if (!editor) return;
    var backdrop = editor.querySelector(".day__backdrop");
    if (!backdrop) return;

    if (!dayHighlightsEnabled) {
      backdrop.textContent = "";
      return;
    }

    if (!textarea.value) {
      var placeholder = textarea.getAttribute("placeholder") || "";
      backdrop.innerHTML = placeholder
        ? '<span class="day__backdrop-placeholder">' +
          escapeHtml(placeholder) +
          "</span>"
        : "";
      syncScroll(textarea, backdrop);
      return;
    }

    var regex = buildHighlightRegex(keywordNames());
    backdrop.innerHTML = highlightedDayHtml(textarea.value, regex);
    syncScroll(textarea, backdrop);
  }

  function refreshAll() {
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      if (!el) return;
      if (document.activeElement === el) {
        updateDayHighlights(el);
      } else {
        updateDayEditorMode(el);
      }
    });
    updateWeekUnmatchedLines();
    renderDashboard();
    updateDayClearButtons();
    updateDayFoodNotesUi();
  }

  function allDayMealsText() {
    return DAYS.map(function (day) {
      var el = document.getElementById(day.id);
      return el ? el.value : "";
    }).join("\n");
  }

  function detectedFoodNotes() {
    var text = allDayMealsText();
    if (!text.trim() || !foodNotesDefinitions.length) return [];
    return foodNotesDefinitions.filter(function (defn) {
      try {
        return new RegExp(defn.pattern, "i").test(text);
      } catch (e) {
        return false;
      }
    });
  }

  function foodNoteBodyHtml(note) {
    var text = typeof note === "string" ? note.trim() : "";
    if (!text) return "";
    if (text.indexOf("<") !== -1) {
      return text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    }
    return "<p>" + escapeHtml(text) + "</p>";
  }

  function dayFoodNotesLabelsHtml(matches) {
    var parts = [];
    matches.forEach(function (defn, index) {
      if (index > 0) {
        parts.push('<span class="week__food-notes-sep">,&nbsp;</span>');
      }
      parts.push(
        '<button type="button" class="week__food-notes-label" data-note-index="' +
          index +
          '" aria-expanded="false" aria-controls="day-food-notes-popover">' +
          escapeHtml(defn.label) +
          "</button>"
      );
    });
    return parts.join("");
  }

  function positionDayFoodNotesPopover(triggerEl) {
    if (!dayFoodNotesPopoverEl || !triggerEl || !dayFoodNotesEl) return;
    var wrapRect = dayFoodNotesEl.getBoundingClientRect();
    var rect = triggerEl.getBoundingClientRect();
    dayFoodNotesPopoverEl.style.left = Math.max(0, rect.left - wrapRect.left) + "px";
  }

  function clearDayFoodNotesHideTimer() {
    if (dayFoodNotesHideTimer) {
      clearTimeout(dayFoodNotesHideTimer);
      dayFoodNotesHideTimer = null;
    }
  }

  function scheduleDayFoodNotesHide() {
    clearDayFoodNotesHideTimer();
    dayFoodNotesHideTimer = setTimeout(function () {
      hideDayFoodNotesPopover(false);
    }, 120);
  }

  function syncDayFoodNotesLabelExpanded() {
    if (!dayFoodNotesLabelsEl) return;
    dayFoodNotesLabelsEl.querySelectorAll(".week__food-notes-label").forEach(function (btn) {
      var index = parseInt(btn.getAttribute("data-note-index"), 10);
      var expanded =
        !dayFoodNotesPopoverEl.hidden &&
        (dayFoodNotesPinned || dayFoodNotesActiveIndex === index);
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  function showDayFoodNotesPopoverForIndex(index, triggerEl) {
    if (!dayFoodNotesPopoverEl || index < 0 || index >= dayFoodNotesMatches.length) return;
    clearDayFoodNotesHideTimer();
    dayFoodNotesActiveIndex = index;
    var defn = dayFoodNotesMatches[index];
    dayFoodNotesPopoverEl.innerHTML =
      '<div class="week__food-notes-entry">' +
      '<div class="week__food-notes-entry-text">' +
      foodNoteBodyHtml(defn.note) +
      "</div>" +
      '<button type="button" class="week__food-notes-read-more" hidden>Read more</button>' +
      "</div>";
    positionDayFoodNotesPopover(triggerEl);
    dayFoodNotesPopoverEl.hidden = false;
    var textEl = dayFoodNotesPopoverEl.querySelector(".week__food-notes-entry-text");
    var readMoreBtn = dayFoodNotesPopoverEl.querySelector(".week__food-notes-read-more");
    if (textEl && readMoreBtn) {
      readMoreBtn.hidden = textEl.scrollHeight <= textEl.clientHeight;
    }
    syncDayFoodNotesLabelExpanded();
  }

  function hideDayFoodNotesPopover(force) {
    if (!dayFoodNotesPopoverEl) return;
    if (!force && dayFoodNotesPinned) return;
    clearDayFoodNotesHideTimer();
    dayFoodNotesPopoverEl.hidden = true;
    dayFoodNotesActiveIndex = -1;
    syncDayFoodNotesLabelExpanded();
  }

  function bindDayFoodNotesLabelEvents() {
    if (!dayFoodNotesLabelsEl) return;
    dayFoodNotesLabelsEl.querySelectorAll(".week__food-notes-label").forEach(function (btn) {
      btn.addEventListener("mouseenter", function () {
        showDayFoodNotesPopoverForIndex(
          parseInt(btn.getAttribute("data-note-index"), 10),
          btn
        );
      });
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var index = parseInt(btn.getAttribute("data-note-index"), 10);
        if (dayFoodNotesPinned && dayFoodNotesActiveIndex === index) {
          dayFoodNotesPinned = false;
          hideDayFoodNotesPopover(true);
          return;
        }
        dayFoodNotesPinned = true;
        showDayFoodNotesPopoverForIndex(index, btn);
      });
    });
  }

  function initDayFoodNotesEvents() {
    if (!dayFoodNotesEl || dayFoodNotesEl._foodNotesEventsBound) return;
    dayFoodNotesEl._foodNotesEventsBound = true;

    dayFoodNotesEl.addEventListener("mouseleave", function () {
      scheduleDayFoodNotesHide();
    });

    if (dayFoodNotesPopoverEl) {
      dayFoodNotesPopoverEl.addEventListener("mouseenter", function () {
        clearDayFoodNotesHideTimer();
      });
      dayFoodNotesPopoverEl.addEventListener("mouseleave", function () {
        scheduleDayFoodNotesHide();
      });
      dayFoodNotesPopoverEl.addEventListener("click", function (e) {
        var readMoreBtn = e.target.closest(".week__food-notes-read-more");
        if (!readMoreBtn) return;
        e.stopPropagation();
        if (dayFoodNotesActiveIndex < 0 || dayFoodNotesActiveIndex >= dayFoodNotesMatches.length) {
          return;
        }
        var defn = dayFoodNotesMatches[dayFoodNotesActiveIndex];
        openFoodNoteModal(defn.label, defn.note);
      });
    }

    document.addEventListener("click", function (e) {
      if (!dayFoodNotesEl || dayFoodNotesEl.hidden) return;
      if (dayFoodNotesEl.contains(e.target)) return;
      dayFoodNotesPinned = false;
      hideDayFoodNotesPopover(true);
    });

    window.addEventListener("resize", function () {
      if (!dayFoodNotesPopoverEl || dayFoodNotesPopoverEl.hidden || dayFoodNotesActiveIndex < 0) {
        return;
      }
      var activeBtn = dayFoodNotesLabelsEl.querySelector(
        '.week__food-notes-label[data-note-index="' + dayFoodNotesActiveIndex + '"]'
      );
      if (activeBtn) positionDayFoodNotesPopover(activeBtn);
    });
  }

  function updateDayFoodNotesUi() {
    if (!dayFoodNotesEl || !dayFoodNotesLabelsEl || !dayFoodNotesPopoverEl) return;
    var matches = detectedFoodNotes();
    if (!matches.length) {
      dayFoodNotesMatches = [];
      dayFoodNotesEl.hidden = true;
      dayFoodNotesPinned = false;
      hideDayFoodNotesPopover(true);
      dayFoodNotesLabelsEl.innerHTML = "";
      dayFoodNotesPopoverEl.innerHTML = "";
      return;
    }
    dayFoodNotesMatches = matches;
    dayFoodNotesEl.hidden = false;
    dayFoodNotesLabelsEl.innerHTML = dayFoodNotesLabelsHtml(matches);
    bindDayFoodNotesLabelEvents();
    if (dayFoodNotesPinned && dayFoodNotesActiveIndex >= 0) {
      var pinnedBtn = dayFoodNotesLabelsEl.querySelector(
        '.week__food-notes-label[data-note-index="' + dayFoodNotesActiveIndex + '"]'
      );
      if (pinnedBtn) {
        showDayFoodNotesPopoverForIndex(dayFoodNotesActiveIndex, pinnedBtn);
        return;
      }
      dayFoodNotesPinned = false;
    }
    hideDayFoodNotesPopover(true);
  }

  function saveFoodDefinitions() {
    if (!persist) return;
    persist.saveFoodDefinitions(keywords);
    invalidateFoodSourcesRowsCache();
  }

  function loadFoodDefinitions() {
    if (!persist) return;
    var data = persist.loadFoodDefinitions();
    if (!data) {
      keywords = [];
      syncNextIdFromKeywords();
      return;
    }
    var migrated = false;
    keywords = data.map(function (item) {
      var micros = normalizeMicros(item.micros);
      var longevity = normalizeLongevity(item.longevity, micros);
      longevity = mergeCarbQualityIntoLongevity(longevity, item.carbQuality);
      if (syncSharedMicroLongevity(micros, longevity)) migrated = true;
      return {
        id:
          item.id != null && item.id !== "" ? String(item.id) : makeId(),
        name: typeof item.name === "string" ? item.name : "",
        protein: item.protein === "" || item.protein == null ? "" : item.protein,
        carbs: item.carbs === "" || item.carbs == null ? "" : item.carbs,
        fats: item.fats === "" || item.fats == null ? "" : item.fats,
        micros: micros,
        longevity: longevity,
      };
    });
    if (migrated || ensureUniqueKeywordIds()) {
      saveFoodDefinitions();
    }
    syncNextIdFromKeywords();
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

    keywords[i].micros = finalizeMicrosFromForm(micros, keywords[i].name);
    Object.keys(LONGEVITY_KEYS_ALSO_IN_MICRO).forEach(function (key) {
      var v = micros[key];
      if (v !== "" && v != null && !isNaN(parseFloat(v))) {
        keywords[i].longevity[key] = true;
      } else if (keywords[i].longevity[key] === true) {
        keywords[i].longevity[key] = "";
      }
    });
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
        if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
          keywords[i].micros[field.key] = "";
          longevity[field.key] = "";
        } else {
          longevity[field.key] = "";
        }
      } else {
        var n = parseFloat(v);
        if (isNaN(n)) {
          longevity[field.key] = "";
        } else if (LONGEVITY_KEYS_ALSO_IN_MICRO[field.key]) {
          keywords[i].micros[field.key] = n;
          longevity[field.key] = true;
        } else {
          longevity[field.key] = n;
        }
      }
    });

    keywords[i].longevity = longevity;
    saveFoodDefinitions();
    updateLongevityButton(activeLongevityId);
    refreshAll();
  }

  function populateMicroForm(kw) {
    if (!microFormEl || !kw) return;
    MICRO_ALL_FIELDS.forEach(function (field) {
      var input = microFormEl.querySelector('[data-micro-key="' + field.key + '"]');
      if (input) {
        if (field.key === "fiber") {
          var totalFiber = fiberTotalFromParts(kw.micros);
          input.value = totalFiber > 0 ? totalFiber : "";
        } else {
          input.value = microInputValue(kw.micros[field.key]);
        }
      }
    });
  }

  function clearMicroSaveTimer() {
    clearTimeout(microSaveTimer);
  }

  function clearLongevitySaveTimer() {
    clearTimeout(longevitySaveTimer);
  }

  function resolveKeywordIndex(id, rowIndex) {
    if (
      rowIndex != null &&
      rowIndex >= 0 &&
      rowIndex < keywords.length &&
      String(keywords[rowIndex].id) === String(id)
    ) {
      return rowIndex;
    }
    return findIndex(id);
  }

  function openMicroModal(id, rowIndex) {
    if (!microModalEl || !microFormEl) return;
    var i = resolveKeywordIndex(id, rowIndex);
    if (i < 0) return;

    if (activeImportId) {
      closeImportModal();
    }
    if (activePositionId) closeKeywordPositionModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();

    if (activeMicroId && activeMicroId !== id) {
      clearMicroSaveTimer();
      saveMicrosFromForm();
    }

    clearMicroSaveTimer();
    activeMicroId = String(keywords[i].id);
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
        input.value = microInputValue(resolveLongevityValue(kw, field.key));
      }
    });
  }

  function openLongevityModal(id, rowIndex) {
    if (!longevityModalEl || !longevityFormEl) return;
    var i = resolveKeywordIndex(id, rowIndex);
    if (i < 0) return;

    if (activeImportId) closeImportModal();
    if (activePositionId) closeKeywordPositionModal();
    if (microDefModalEl && !microDefModalEl.hidden) closeMicroDefModal();
    if (activeMicroId && activeMicroId !== id) {
      clearMicroSaveTimer();
      saveMicrosFromForm();
      closeMicroModal();
    }
    if (activeLongevityId && activeLongevityId !== id) {
      clearLongevitySaveTimer();
      saveLongevityFromForm();
    }

    clearLongevitySaveTimer();
    activeLongevityId = String(keywords[i].id);
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

  function microFormFieldHtml(field) {
    return (
      '<label class="micro-form__field">' +
      '<button type="button" class="micro-form__label micro-form__label-link" data-micro-def="' +
      escapeAttr(field.key) +
      '" aria-haspopup="dialog">' +
      escapeHtml(field.label) +
      " (" +
      escapeHtml(field.code) +
      ')</button><span class="micro-form__unit">' +
      escapeHtml(field.unit) +
      "</span>" +
      '<input type="number" class="micro-form__input" min="0" step="0.1" inputmode="decimal" ' +
      'data-micro-key="' +
      escapeAttr(field.key) +
      '" placeholder="0">' +
      "</label>"
    );
  }

  function initMicroForm() {
    if (!microFormEl) return;

    var html = MICRO_FIELDS.map(microFormFieldHtml).join("");
    var minerals = MICRO_EXTENDED_FIELDS.filter(function (f) { return !f.group; });
    var aminos = MICRO_EXTENDED_FIELDS.filter(function (f) { return f.group === "amino"; });
    if (minerals.length) {
      html += '<div class="micro-form__separator">Additional trace minerals</div>';
      html += minerals.map(microFormFieldHtml).join("");
    }
    if (aminos.length) {
      html += '<div class="micro-form__separator">Amino acids</div>';
      html += aminos.map(microFormFieldHtml).join("");
    }
    microFormEl.innerHTML = html;
  }

  function initLongevityForm() {
    if (!longevityFormEl) return;

    longevityFormEl.innerHTML = LONGEVITY_GROUPS.filter(function (group) {
      return group.id !== "glutathione";
    }).map(function (group) {
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
              '<button type="button" class="longevity-form__label longevity-form__label-link" data-longevity-def="' +
              escapeAttr(field.key) +
              '" aria-haspopup="dialog">' +
              escapeHtml(field.label) +
              " (" +
              escapeHtml(field.code) +
              ")</button>" +
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
      if (!id || seen[id] || !isValidKeywordId(id)) {
        id = makeId();
      }
      if (id !== original) changed = true;
      seen[id] = true;
      kw.id = id;
    });
    syncNextIdFromKeywords();
    return changed;
  }

  function keywordRowIndex(row) {
    if (!keywordsListEl || !row) return -1;
    return Array.prototype.indexOf.call(keywordsListEl.children, row);
  }

  function keywordIdFromRow(row) {
    if (!row) return "";
    var id = row.getAttribute("data-id");
    return id != null && id !== "" ? String(id) : "";
  }

  function keywordIndexFromRow(row) {
    if (!row) return -1;
    var rowId = keywordIdFromRow(row);
    var domIndex = keywordRowIndex(row);
    if (
      rowId &&
      domIndex >= 0 &&
      domIndex < keywords.length &&
      String(keywords[domIndex].id) === rowId
    ) {
      return domIndex;
    }
    if (rowId) {
      var byId = findIndex(rowId);
      if (byId >= 0) return byId;
    }
    if (domIndex >= 0 && domIndex < keywords.length) return domIndex;
    return -1;
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

  function sortKeywordsAlphabetically() {
    if (keywords.length < 2) return;
    syncAllFieldsFromDom();
    if (activePositionId) closeKeywordPositionModal();
    keywords.sort(function (a, b) {
      var nameA = a && a.name ? String(a.name).trim().toLowerCase() : "";
      var nameB = b && b.name ? String(b.name).trim().toLowerCase() : "";
      if (!nameA && !nameB) return 0;
      if (!nameA) return 1;
      if (!nameB) return -1;
      return nameA.localeCompare(nameB);
    });
    keywordsPageIndex = 0;
    saveFoodDefinitions();
    renderKeywords();
    refreshAll();
  }

  function addKeyword() {
    keywords.push(blankKeyword());
    saveFoodDefinitions();
    if (keywordsPageSize > 0) {
      var visibleTotal = keywordsFilteredIndices().length;
      keywordsPageIndex = Math.max(
        0,
        Math.ceil(visibleTotal / keywordsPageSize) - 1
      );
    } else {
      keywordsPageIndex = 0;
    }
    renderKeywords();
    refreshAll();
    var lastRow = keywordsListEl.lastElementChild;
    if (lastRow) {
      var nameInput = lastRow.querySelector('[data-field="name"]');
      if (nameInput) nameInput.focus();
    }
  }

  function syncFieldFromDom(row) {
    var i = keywordIndexFromRow(row);
    if (i < 0 || i >= keywords.length) return;

    var nameEl = row.querySelector('[data-field="name"]');
    var proteinEl = row.querySelector('[data-field="protein"]');
    var carbsEl = row.querySelector('[data-field="carbs"]');
    var fatsEl = row.querySelector('[data-field="fats"]');

    if (nameEl) keywords[i].name = nameEl.value;
    if (proteinEl) keywords[i].protein = parseMacro(proteinEl.value);
    if (carbsEl) keywords[i].carbs = parseMacro(carbsEl.value);
    if (fatsEl) keywords[i].fats = parseMacro(fatsEl.value);
  }

  function loadKeywordReorderOpen() {
    if (!persist) {
      keywordReorderOpen = false;
      return;
    }
    keywordReorderOpen = !!persist.getSetting("keywordsReorderOpen");
  }

  function saveKeywordReorderOpen() {
    if (!persist) return;
    persist.setSetting("keywordsReorderOpen", !!keywordReorderOpen);
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

  function loadKeywordCaloriesOpen() {
    if (!persist) {
      keywordCaloriesOpen = false;
      return;
    }
    keywordCaloriesOpen = !!persist.getSetting("keywordsCaloriesOpen");
  }

  function saveKeywordCaloriesOpen() {
    if (!persist) return;
    persist.setSetting("keywordsCaloriesOpen", !!keywordCaloriesOpen);
  }

  function updateKeywordCaloriesUi() {
    if (keywordsTableEl) {
      keywordsTableEl.classList.toggle(
        "keywords__table--calories-open",
        keywordCaloriesOpen
      );
    }
    if (keywordsTotalCalHeaderEl) {
      keywordsTotalCalHeaderEl.hidden = !keywordCaloriesOpen;
    }
    keywordsCaloriesToggleEls.forEach(function (btn) {
      var label = btn.textContent.trim();
      if (keywordCaloriesOpen) {
        label = label.replace(" (g)", " (cal)");
      } else {
        label = label.replace(" (cal)", " (g)");
      }
      btn.textContent = label;
      btn.setAttribute("aria-pressed", keywordCaloriesOpen ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        keywordCaloriesOpen
          ? "Show " + label.replace(" (cal)", "").toLowerCase() + " grams"
          : "Show " + label.replace(" (g)", "").toLowerCase() + " calories"
      );
    });
  }

  function setKeywordCaloriesOpen(open) {
    var nextOpen = !!open;
    if (nextOpen && !keywordCaloriesOpen) {
      syncAllFieldsFromDom();
    }
    keywordCaloriesOpen = nextOpen;
    saveKeywordCaloriesOpen();
    renderKeywords();
  }

  function toggleKeywordCaloriesOpen() {
    setKeywordCaloriesOpen(!keywordCaloriesOpen);
  }

  function keywordsFilterNormalized() {
    return keywordsFilterQuery.trim().toLowerCase();
  }

  function keywordMatchesFilter(kw) {
    if (!keywordMatchesCategory(kw)) return false;
    var query = keywordsFilterNormalized();
    if (!query) return true;
    var name = kw && kw.name ? String(kw.name).trim().toLowerCase() : "";
    return name.indexOf(query) !== -1;
  }

  function keywordsFilteredIndices() {
    var out = [];
    for (var i = 0; i < keywords.length; i++) {
      if (keywordMatchesFilter(keywords[i])) out.push(i);
    }
    return out;
  }

  function keywordsHasActiveFilter() {
    return keywordsFilterNormalized().length > 0 || !!keywordsCategoryFilter;
  }

  function updateKeywordsCategoryUi() {
    var active = !!keywordsCategoryFilter;
    var label = keywordsCategoryFilterLabel();
    if (keywordsCategoryOpenBtn) {
      keywordsCategoryOpenBtn.classList.toggle("keywords__category-open--active", active);
      keywordsCategoryOpenBtn.setAttribute(
        "aria-label",
        active ? "Change category filter (" + label + ")" : "Filter by category"
      );
    }
    if (keywordsCategoryChipEl) {
      keywordsCategoryChipEl.hidden = !active;
    }
    if (keywordsCategoryChipLabelEl) {
      keywordsCategoryChipLabelEl.textContent = label;
    }
  }

  function updateKeywordsSearchUi() {
    var active = keywordsFilterNormalized().length > 0;
    if (keywordsSearchClearBtn) keywordsSearchClearBtn.hidden = !active;
    updateKeywordsCategoryUi();
  }

  function setKeywordsFilterQuery(query, options) {
    var opts = options || {};
    if (!opts.skipSync) syncAllFieldsFromDom();
    keywordsFilterQuery = query == null ? "" : String(query);
    if (keywordsSearchEl && keywordsSearchEl.value !== keywordsFilterQuery) {
      keywordsSearchEl.value = keywordsFilterQuery;
    }
    keywordsPageIndex = 0;
    clampKeywordsPageIndex();
    updateKeywordsSearchUi();
    renderKeywords();
  }

  function clearKeywordsFilter() {
    setKeywordsFilterQuery("");
    if (keywordsSearchEl) keywordsSearchEl.focus();
  }

  function setKeywordsCategoryFilter(categoryId, options) {
    var opts = options || {};
    if (!opts.skipSync) syncAllFieldsFromDom();
    keywordsCategoryFilter = categoryId == null ? "" : String(categoryId);
    keywordsPageIndex = 0;
    clampKeywordsPageIndex();
    updateKeywordsSearchUi();
    renderKeywords();
  }

  function clearKeywordsCategoryFilter() {
    setKeywordsCategoryFilter("");
  }

  function renderKeywordsCategoryUncategorizedList(names) {
    if (!keywordsCategoryUncategorizedListEl) return;
    keywordsCategoryUncategorizedListEl.innerHTML = "";
    if (!names.length) {
      var empty = document.createElement("li");
      empty.className = "keywords-category-modal__food-empty";
      empty.textContent = "All foods match a category.";
      keywordsCategoryUncategorizedListEl.appendChild(empty);
      return;
    }
    for (var i = 0; i < names.length; i++) {
      var li = document.createElement("li");
      li.className = "keywords-category-modal__food-item";
      li.textContent = names[i];
      keywordsCategoryUncategorizedListEl.appendChild(li);
    }
  }

  function setKeywordsCategoryUncategorizedOpen(open) {
    keywordsCategoryUncategorizedOpen = !!open;
    if (keywordsCategoryUncategorizedRevealBtn) {
      keywordsCategoryUncategorizedRevealBtn.setAttribute(
        "aria-expanded",
        keywordsCategoryUncategorizedOpen ? "true" : "false"
      );
    }
    if (keywordsCategoryUncategorizedListEl) {
      keywordsCategoryUncategorizedListEl.hidden = !keywordsCategoryUncategorizedOpen;
    }
  }

  function renderKeywordsCategoryModal() {
    var stats = keywordsCategoryCounts();
    if (keywordsCategoryListEl) {
      keywordsCategoryListEl.innerHTML = "";
      for (var i = 0; i < foodCategories.length; i++) {
        var cat = foodCategories[i];
        var count = stats.counts[cat.id] || 0;
        var li = document.createElement("li");
        li.className = "keywords-category-modal__item";
        li.setAttribute("role", "presentation");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "keywords-category-modal__link";
        btn.setAttribute("role", "option");
        btn.setAttribute("data-category", cat.id);
        var selected = keywordsCategoryFilter === cat.id;
        btn.setAttribute("aria-selected", selected ? "true" : "false");
        if (selected) btn.classList.add("keywords-category-modal__link--active");
        btn.innerHTML =
          "<span>" +
          escapeHtml(cat.label) +
          '</span><span class="keywords-category-modal__count">' +
          escapeHtml(String(count)) +
          "</span>";
        li.appendChild(btn);
        keywordsCategoryListEl.appendChild(li);
      }
    }
    if (keywordsCategoryUncategorizedCountEl) {
      keywordsCategoryUncategorizedCountEl.textContent = String(
        stats.uncategorized.length
      );
    }
    renderKeywordsCategoryUncategorizedList(stats.uncategorized);
    if (keywordsCategoryUncategorizedFilterBtn) {
      var uncatActive =
        keywordsCategoryFilter === KEYWORDS_CATEGORY_UNCATEGORIZED;
      keywordsCategoryUncategorizedFilterBtn.classList.toggle(
        "keywords-category-modal__filter-btn--active",
        uncatActive
      );
      keywordsCategoryUncategorizedFilterBtn.textContent = uncatActive
        ? "Filtering"
        : "Filter";
    }
    setKeywordsCategoryUncategorizedOpen(keywordsCategoryUncategorizedOpen);
  }

  function openKeywordsCategoryModal() {
    keywordsCategoryUncategorizedOpen = false;
    renderKeywordsCategoryModal();
    if (keywordsCategoryModalEl) keywordsCategoryModalEl.hidden = false;
    if (keywordsCategoryOpenBtn) {
      keywordsCategoryOpenBtn.setAttribute("aria-expanded", "true");
    }
  }

  function closeKeywordsCategoryModal() {
    if (keywordsCategoryModalEl) keywordsCategoryModalEl.hidden = true;
    if (keywordsCategoryOpenBtn) {
      keywordsCategoryOpenBtn.setAttribute("aria-expanded", "false");
      keywordsCategoryOpenBtn.focus();
    }
  }

  function applyKeywordsCategoryFromModal(categoryId) {
    setKeywordsCategoryFilter(categoryId);
    closeKeywordsCategoryModal();
  }

  function keywordsEffectivePageSize() {
    var total = keywordsFilteredIndices().length;
    if (!keywordsPageSize || keywordsPageSize <= 0) {
      return total || 1;
    }
    return keywordsPageSize;
  }

  function keywordsPageCount() {
    var total = keywordsFilteredIndices().length;
    if (!total) return 0;
    if (!keywordsPageSize || keywordsPageSize <= 0) return 1;
    return Math.ceil(total / keywordsPageSize);
  }

  function clampKeywordsPageIndex() {
    var pages = keywordsPageCount();
    if (pages === 0) {
      keywordsPageIndex = 0;
      return;
    }
    if (keywordsPageIndex < 0) keywordsPageIndex = 0;
    if (keywordsPageIndex >= pages) keywordsPageIndex = pages - 1;
  }

  function keywordsPageBounds() {
    var indices = keywordsFilteredIndices();
    if (!indices.length) return { start: 0, end: 0, indices: [] };
    clampKeywordsPageIndex();
    var size = keywordsEffectivePageSize();
    var start = keywordsPageIndex * size;
    var end = Math.min(indices.length, start + size);
    return {
      start: start,
      end: end,
      indices: indices.slice(start, end),
    };
  }

  function loadKeywordsPageSize() {
    if (!persist) {
      keywordsPageSize = KEYWORDS_DEFAULT_PAGE_SIZE;
      return;
    }
    var size = persist.getSetting("keywordsPageSize");
    if (size === 0 || size === 10 || size === 25 || size === 50 || size === 100) {
      keywordsPageSize = size;
    }
  }

  function saveKeywordsPageSize() {
    if (!persist) return;
    persist.setSetting("keywordsPageSize", keywordsPageSize);
  }

  function syncKeywordsPageSizeSelect() {
    if (!keywordsPageSizeEl) return;
    keywordsPageSizeEl.value = String(keywordsPageSize);
  }

  function updateKeywordsPaginationUi() {
    var allTotal = keywords.length;
    var visibleTotal = keywordsFilteredIndices().length;
    var filtered = keywordsHasActiveFilter();
    var showPagination = allTotal > 0;

    if (keywordsPaginationEl) {
      keywordsPaginationEl.hidden = !showPagination;
    }

    if (!showPagination) return;

    syncKeywordsPageSizeSelect();
    updateKeywordsSearchUi();

    var pages = keywordsPageCount();
    var showNav = pages > 1;

    if (keywordsPaginationNavEl) {
      keywordsPaginationNavEl.hidden = !showNav || visibleTotal === 0;
    }

    if (keywordsPageStatusEl) {
      if (visibleTotal === 0 && filtered) {
        keywordsPageStatusEl.textContent = "0 matching of " + allTotal;
      } else if (showNav) {
        var bounds = keywordsPageBounds();
        var status =
          bounds.start +
          1 +
          "\u2013" +
          bounds.end +
          " of " +
          visibleTotal +
          (filtered ? " matching" : "");
        if (filtered) status += " (" + allTotal + " total)";
        status +=
          " \u00b7 page " + (keywordsPageIndex + 1) + " of " + pages;
        keywordsPageStatusEl.textContent = status;
      } else if (filtered) {
        keywordsPageStatusEl.textContent =
          visibleTotal +
          " matching of " +
          allTotal +
          " food definition" +
          (allTotal === 1 ? "" : "s");
      } else {
        keywordsPageStatusEl.textContent =
          allTotal + " food definition" + (allTotal === 1 ? "" : "s");
      }
    }

    var onFirst = keywordsPageIndex <= 0;
    var onLast = keywordsPageIndex >= pages - 1;

    if (keywordsPageFirstBtn) keywordsPageFirstBtn.disabled = onFirst;
    if (keywordsPagePrevBtn) keywordsPagePrevBtn.disabled = onFirst;
    if (keywordsPageNextBtn) keywordsPageNextBtn.disabled = onLast;
    if (keywordsPageLastBtn) keywordsPageLastBtn.disabled = onLast;
  }

  function goKeywordsPage(index) {
    syncAllFieldsFromDom();
    keywordsPageIndex = index;
    clampKeywordsPageIndex();
    renderKeywords();
  }

  function changeKeywordsPageSize(size) {
    syncAllFieldsFromDom();
    var oldBounds = keywordsPageBounds();
    keywordsPageSize = size;
    saveKeywordsPageSize();
    if (keywordsPageSize > 0) {
      keywordsPageIndex = Math.floor(oldBounds.start / keywordsPageSize);
    } else {
      keywordsPageIndex = 0;
    }
    clampKeywordsPageIndex();
    renderKeywords();
  }

  function renderKeywords() {
    if (!keywordsListEl) return;

    clampKeywordsPageIndex();
    var bounds = keywordsPageBounds();
    var filtered = keywordsHasActiveFilter();
    var visibleTotal = keywordsFilteredIndices().length;

    keywordsListEl.innerHTML = "";

    for (var ri = 0; ri < bounds.indices.length; ri++) {
      var index = bounds.indices[ri];
      var kw = keywords[index];
      var tr = document.createElement("tr");
      tr.className = "keywords__row";
      tr.setAttribute("data-id", kw.id);

      var proteinVal = kw.protein === "" ? "" : kw.protein;
      var carbsVal = kw.carbs === "" ? "" : kw.carbs;
      var fatsVal = kw.fats === "" ? "" : kw.fats;
      var macroCellsHtml;

      if (keywordCaloriesOpen) {
        var cals = keywordMacroCalories(kw);
        macroCellsHtml =
          '<td class="keywords__macro">' +
          '<span class="keywords__cal">' +
          escapeHtml(cals.proteinCal) +
          "</span></td>" +
          '<td class="keywords__macro">' +
          '<span class="keywords__cal">' +
          escapeHtml(cals.carbsCal) +
          "</span></td>" +
          '<td class="keywords__macro">' +
          '<span class="keywords__cal">' +
          escapeHtml(cals.fatsCal) +
          "</span></td>" +
          '<td class="keywords__macro keywords__macro--total">' +
          '<span class="keywords__cal">' +
          escapeHtml(cals.totalCal) +
          "</span></td>";
      } else {
        macroCellsHtml =
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
          "</td>";
      }

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
        ">Move</button>" +
        "</div></div></td>" +
        '<td class="keywords__name">' +
        '<input type="text" class="keywords__input keywords__input--name" data-field="name" value="' +
        escapeAttr(kw.name) +
        '" placeholder="e.g. chicken" spellcheck="false">' +
        "</td>" +
        macroCellsHtml +
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
    }

    if (keywordsEmptyEl) {
      keywordsEmptyEl.hidden = keywords.length > 0;
    }

    if (keywordsFilterEmptyEl) {
      keywordsFilterEmptyEl.hidden = !(keywords.length > 0 && filtered && visibleTotal === 0);
    }

    if (keywordsTableEl) {
      keywordsTableEl.hidden = keywords.length > 0 && filtered && visibleTotal === 0;
    }

    updateKeywordReorderUi();
    updateKeywordCaloriesUi();
    updateKeywordsPaginationUi();
  }

  function dayById(id) {
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].id === id) return DAYS[i];
    }
    return null;
  }

  function dayIndexById(id) {
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].id === id) return i;
    }
    return -1;
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function toDateKey(d) {
    return (
      d.getFullYear() +
      "-" +
      pad2(d.getMonth() + 1) +
      "-" +
      pad2(d.getDate())
    );
  }

  function parseDateKey(key) {
    var parts = String(key || "").split("-");
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    if (!y || !m || !day) return null;
    var d = new Date(y, m - 1, day);
    if (
      d.getFullYear() !== y ||
      d.getMonth() !== m - 1 ||
      d.getDate() !== day
    ) {
      return null;
    }
    return d;
  }

  function mondayOf(d) {
    var copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = copy.getDay();
    var diff = dow === 0 ? -6 : 1 - dow;
    copy.setDate(copy.getDate() + diff);
    return copy;
  }

  function addDays(d, n) {
    var copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    copy.setDate(copy.getDate() + n);
    return copy;
  }

  function formatDayDateLabel(d) {
    return d.getMonth() + 1 + "/" + d.getDate() + "/" + String(d.getFullYear()).slice(-2);
  }

  var WEEK_RANGE_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function formatWeekRangeLabel(mondayKey) {
    var mon = parseDateKey(mondayKey);
    if (!mon) return "";
    var sun = addDays(mon, 6);
    return (
      WEEK_RANGE_MONTHS[mon.getMonth()] +
      " " +
      mon.getDate() +
      " – " +
      WEEK_RANGE_MONTHS[sun.getMonth()] +
      " " +
      sun.getDate() +
      ", " +
      sun.getFullYear()
    );
  }

  function weekDateKeys(mondayKey) {
    var mon = parseDateKey(mondayKey);
    var keys = [];
    if (!mon) return keys;
    for (var i = 0; i < 7; i++) {
      keys.push(toDateKey(addDays(mon, i)));
    }
    return keys;
  }

  function currentWeekMondayKey() {
    return toDateKey(mondayOf(new Date()));
  }

  function todayDateKey() {
    return toDateKey(new Date());
  }

  function isCurrentWeek() {
    return viewedWeekStart === currentWeekMondayKey();
  }

  function dateKeyForDayId(dayId, weekStart) {
    var idx = dayIndexById(dayId);
    if (idx < 0) return null;
    var keys = weekDateKeys(weekStart || viewedWeekStart);
    return keys[idx] || null;
  }

  function dateLabelForDayId(dayId) {
    var key = dateKeyForDayId(dayId);
    var d = key ? parseDateKey(key) : null;
    return d ? formatDayDateLabel(d) : "";
  }

  function todayDayId() {
    // Date#getDay: 0 = Sun … 6 = Sat
    return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
  }

  function activeTodayDayId() {
    return isCurrentWeek() ? todayDayId() : null;
  }

  function markTodayDay() {
    var todayId = activeTodayDayId();
    document.querySelectorAll(".week__grid .day").forEach(function (dayEl) {
      var input = dayEl.querySelector(".day__input");
      var isToday = !!(todayId && input && input.id === todayId);
      dayEl.classList.toggle("day--today", isToday);
      var label = dayEl.querySelector(".day__label");
      if (!label) return;
      if (isToday) label.setAttribute("aria-current", "date");
      else label.removeAttribute("aria-current");
    });
    markFavoriteDay();
    syncDaysCarouselNav();
  }

  function makeFavoriteId() {
    return "fav-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
  }

  function normalizeFavoriteEntry(raw) {
    if (!raw || typeof raw !== "object") return null;
    var type = raw.type === "week" ? "week" : raw.type === "day" ? "day" : null;
    if (!type) return null;
    var dateKey = String(raw.dateKey || "");
    var d = parseDateKey(dateKey);
    if (!d) return null;
    if (type === "week") {
      dateKey = toDateKey(mondayOf(d));
    } else {
      dateKey = toDateKey(d);
    }
    var name = String(raw.name || "").trim();
    if (!name) return null;
    var description = String(raw.description || "").trim();
    var id = String(raw.id || "").trim() || makeFavoriteId();
    return {
      id: id,
      type: type,
      dateKey: dateKey,
      name: name,
      description: description,
    };
  }

  function saveFavorites() {
    if (!persist) return;
    persist.saveFavorites(diaryFavorites);
  }

  function loadFavorites() {
    diaryFavorites = [];
    if (!persist) return;
    var parsed = persist.loadFavorites();
    if (!parsed) return;
    parsed.forEach(function (item) {
      var entry = normalizeFavoriteEntry(item);
      if (entry) diaryFavorites.push(entry);
    });
  }

  function findFavoriteIndexById(id) {
    for (var i = 0; i < diaryFavorites.length; i++) {
      if (diaryFavorites[i].id === id) return i;
    }
    return -1;
  }

  function findFavoriteByTypeAndKey(type, dateKey) {
    for (var i = 0; i < diaryFavorites.length; i++) {
      var fav = diaryFavorites[i];
      if (fav.type === type && fav.dateKey === dateKey) return fav;
    }
    return null;
  }

  function favoriteTargetLabel(fav) {
    if (!fav) return "";
    if (fav.type === "week") {
      return "Week · " + formatWeekRangeLabel(fav.dateKey);
    }
    var d = parseDateKey(fav.dateKey);
    var dayId = dayIdForDateKey(fav.dateKey);
    var dayMeta = dayId ? dayById(dayId) : null;
    var weekday = dayMeta ? dayMeta.label : "";
    var dateLabel = d ? formatDayDateLabel(d) : fav.dateKey;
    return (
      "Day · " +
      (weekday ? weekday + " " : "") +
      dateLabel
    );
  }

  function dayIdForDateKey(dateKey) {
    var d = parseDateKey(dateKey);
    if (!d) return null;
    return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d.getDay()];
  }

  function activeFavoriteDayId() {
    if (!activeFavoriteDayKey || !viewedWeekStart) return null;
    var keys = weekDateKeys(viewedWeekStart);
    var idx = keys.indexOf(activeFavoriteDayKey);
    if (idx < 0) return null;
    return DAYS[idx] ? DAYS[idx].id : null;
  }

  function markFavoriteDay() {
    var favoriteId = activeFavoriteDayId();
    document.querySelectorAll(".week__grid .day").forEach(function (dayEl) {
      var input = dayEl.querySelector(".day__input");
      var isFavorite = !!(favoriteId && input && input.id === favoriteId);
      dayEl.classList.toggle("day--favorite-day", isFavorite);
    });
    syncDayFavoriteButtons();
    syncWeekFavoriteButton();
  }

  function clearActiveFavoriteDayHighlight() {
    activeFavoriteDayKey = null;
    markFavoriteDay();
  }

  function setActiveFavoriteDayHighlight(dateKey) {
    if (activeFavoriteDayKey && activeFavoriteDayKey !== dateKey) {
      activeFavoriteDayKey = null;
      markFavoriteDay();
    }
    activeFavoriteDayKey = dateKey || null;
    markFavoriteDay();
  }

  function syncDayFavoriteButtons() {
    DAYS.forEach(function (day) {
      var btn = document.querySelector(
        '.day__favorite[data-day-id="' + day.id + '"]'
      );
      if (!btn) return;
      var key = dateKeyForDayId(day.id);
      var existing = key ? findFavoriteByTypeAndKey("day", key) : null;
      btn.disabled = !dayHasNotes(day.id);
      btn.setAttribute("aria-pressed", existing ? "true" : "false");
      btn.textContent = existing ? "Favorited" : "Favorite";
      btn.setAttribute(
        "aria-label",
        existing
          ? "Edit favorite for " + day.label
          : "Favorite " + day.label
      );
    });
  }

  function syncWeekFavoriteButton() {
    if (!weekNavFavoriteBtn) return;
    var existing = viewedWeekStart
      ? findFavoriteByTypeAndKey("week", viewedWeekStart)
      : null;
    weekNavFavoriteBtn.textContent = existing
      ? "Week favorited"
      : "Favorite week";
    weekNavFavoriteBtn.setAttribute("aria-pressed", existing ? "true" : "false");
  }

  function isFavoritesSidebarOpen() {
    return !!(
      favoritesSidebarEl &&
      favoritesSidebarEl.classList.contains("favorites-sidebar--open")
    );
  }

  function closeFavoritesSidebar() {
    if (!favoritesSidebarEl) return;
    favoritesSidebarEl.classList.remove("favorites-sidebar--open");
    favoritesSidebarEl.setAttribute("aria-hidden", "true");
    if ("inert" in favoritesSidebarEl) favoritesSidebarEl.inert = true;
    if (favoritesOpenBtn) favoritesOpenBtn.setAttribute("aria-expanded", "false");
    favoritesManaging = false;
    syncFavoritesSidebarMode();
    updateBodyModalOpen();
  }

  function favoritesBrowseItemHtml(fav) {
    var desc = fav.description
      ? '<span class="favorites-sidebar__item-desc">' +
        escapeHtml(fav.description) +
        "</span>"
      : "";
    return (
      '<button type="button" role="listitem" class="favorites-sidebar__item" data-action="go-favorite" data-favorite-id="' +
      escapeAttr(fav.id) +
      '">' +
      '<span class="favorites-sidebar__item-name">' +
      escapeHtml(fav.name) +
      "</span>" +
      '<span class="favorites-sidebar__item-meta">' +
      escapeHtml(favoriteTargetLabel(fav)) +
      "</span>" +
      desc +
      "</button>"
    );
  }

  function renderFavoritesBrowseList() {
    if (!favoritesListEl) return;
    if (!diaryFavorites.length) {
      favoritesListEl.innerHTML = "";
      return;
    }
    favoritesListEl.innerHTML = diaryFavorites
      .map(favoritesBrowseItemHtml)
      .join("");
  }

  function syncFavoritesSidebarMode() {
    var managing = !!favoritesManaging;
    if (favoritesListEl) favoritesListEl.hidden = managing;
    if (favoritesManageListEl) favoritesManageListEl.hidden = !managing;
    if (favoritesManageToggleBtn) {
      favoritesManageToggleBtn.textContent = managing ? "Done" : "Manage";
      favoritesManageToggleBtn.setAttribute(
        "aria-pressed",
        managing ? "true" : "false"
      );
    }
    if (favoritesSidebarTitleEl) {
      favoritesSidebarTitleEl.textContent = managing
        ? "Manage favorites"
        : "Favorites";
    }
    if (favoritesSidebarHintEl) {
      favoritesSidebarHintEl.textContent = managing
        ? "Rearrange, rename, edit descriptions, or delete. Click a name to jump there."
        : "Choose a favorite to jump there.";
    }
    var empty = diaryFavorites.length === 0;
    if (favoritesEmptyEl) favoritesEmptyEl.hidden = !empty;
    if (managing) renderFavoritesManageList();
    else renderFavoritesBrowseList();
  }

  function openFavoritesSidebar() {
    if (!favoritesSidebarEl || !favoritesOpenBtn) return;
    closeAllDayCopyMenus();
    favoritesManaging = false;
    syncFavoritesSidebarMode();
    favoritesSidebarEl.classList.add("favorites-sidebar--open");
    favoritesSidebarEl.setAttribute("aria-hidden", "false");
    if ("inert" in favoritesSidebarEl) favoritesSidebarEl.inert = false;
    favoritesOpenBtn.setAttribute("aria-expanded", "true");
    updateBodyModalOpen();
    var closeBtn = favoritesSidebarEl.querySelector(
      '[data-action="close-favorites-sidebar"].favorites-sidebar__close'
    );
    if (closeBtn) closeBtn.focus();
  }

  function toggleFavoritesSidebar() {
    if (isFavoritesSidebarOpen()) closeFavoritesSidebar();
    else openFavoritesSidebar();
  }

  function setFavoritesManaging(managing) {
    favoritesManaging = !!managing;
    syncFavoritesSidebarMode();
  }

  function showFavoriteEditError(message) {
    if (!favoriteEditErrorEl) return;
    if (!message) {
      favoriteEditErrorEl.hidden = true;
      favoriteEditErrorEl.textContent = "";
      return;
    }
    favoriteEditErrorEl.hidden = false;
    favoriteEditErrorEl.textContent = message;
  }

  function closeFavoriteEditModal() {
    if (!favoriteEditModalEl) return;
    favoriteEditModalEl.hidden = true;
    favoriteEditPending = null;
    showFavoriteEditError("");
    updateBodyModalOpen();
  }

  function openFavoriteEditModal(pending) {
    if (!favoriteEditModalEl || !pending) return;
    closeAllDayCopyMenus();
    favoriteEditPending = pending;
    var isEdit = !!pending.id;
    if (favoriteEditModalTitleEl) {
      favoriteEditModalTitleEl.textContent = isEdit
        ? "Edit favorite"
        : "Save favorite";
    }
    if (favoriteEditModalHintEl) {
      favoriteEditModalHintEl.textContent =
        (pending.type === "week" ? "Favorite week: " : "Favorite day: ") +
        (pending.targetLabel || "");
    }
    if (favoriteEditNameEl) favoriteEditNameEl.value = pending.name || "";
    if (favoriteEditDescriptionEl) {
      favoriteEditDescriptionEl.value = pending.description || "";
    }
    if (favoriteEditSaveBtn) {
      favoriteEditSaveBtn.textContent = isEdit ? "Save changes" : "Save favorite";
    }
    showFavoriteEditError("");
    favoriteEditModalEl.hidden = false;
    updateBodyModalOpen();
    if (favoriteEditNameEl) {
      favoriteEditNameEl.focus();
      favoriteEditNameEl.select();
    }
  }

  function defaultFavoriteName(type, dateKey) {
    if (type === "week") {
      return "Week of " + formatWeekRangeLabel(dateKey);
    }
    var d = parseDateKey(dateKey);
    var dayId = dayIdForDateKey(dateKey);
    var dayMeta = dayId ? dayById(dayId) : null;
    var weekday = dayMeta ? dayMeta.label : "Day";
    return weekday + " " + (d ? formatDayDateLabel(d) : dateKey);
  }

  function openFavoriteDayEditor(dayId) {
    var key = dateKeyForDayId(dayId);
    if (!key) return;
    var existing = findFavoriteByTypeAndKey("day", key);
    openFavoriteEditModal({
      id: existing ? existing.id : null,
      type: "day",
      dateKey: key,
      name: existing ? existing.name : defaultFavoriteName("day", key),
      description: existing ? existing.description : "",
      targetLabel: favoriteTargetLabel({
        type: "day",
        dateKey: key,
        name: "",
        description: "",
      }),
    });
  }

  function openFavoriteWeekEditor() {
    if (!viewedWeekStart) return;
    var existing = findFavoriteByTypeAndKey("week", viewedWeekStart);
    openFavoriteEditModal({
      id: existing ? existing.id : null,
      type: "week",
      dateKey: viewedWeekStart,
      name: existing
        ? existing.name
        : defaultFavoriteName("week", viewedWeekStart),
      description: existing ? existing.description : "",
      targetLabel: formatWeekRangeLabel(viewedWeekStart),
    });
  }

  function openFavoriteEditById(id) {
    var idx = findFavoriteIndexById(id);
    if (idx < 0) return;
    var fav = diaryFavorites[idx];
    openFavoriteEditModal({
      id: fav.id,
      type: fav.type,
      dateKey: fav.dateKey,
      name: fav.name,
      description: fav.description,
      targetLabel: favoriteTargetLabel(fav),
    });
  }

  function runFavoriteEditSave() {
    if (!favoriteEditPending) return;
    var name = favoriteEditNameEl
      ? favoriteEditNameEl.value.trim()
      : "";
    var description = favoriteEditDescriptionEl
      ? favoriteEditDescriptionEl.value.trim()
      : "";
    if (!name) {
      showFavoriteEditError("Enter a name for this favorite.");
      if (favoriteEditNameEl) favoriteEditNameEl.focus();
      return;
    }
    var entry = normalizeFavoriteEntry({
      id: favoriteEditPending.id || makeFavoriteId(),
      type: favoriteEditPending.type,
      dateKey: favoriteEditPending.dateKey,
      name: name,
      description: description,
    });
    if (!entry) {
      showFavoriteEditError("Could not save this favorite.");
      return;
    }
    var existingIdx = findFavoriteIndexById(entry.id);
    if (existingIdx >= 0) {
      diaryFavorites[existingIdx] = entry;
    } else {
      var dup = findFavoriteByTypeAndKey(entry.type, entry.dateKey);
      if (dup) {
        var dupIdx = findFavoriteIndexById(dup.id);
        entry.id = dup.id;
        diaryFavorites[dupIdx] = entry;
      } else {
        diaryFavorites.push(entry);
      }
    }
    saveFavorites();
    closeFavoriteEditModal();
    syncDayFavoriteButtons();
    syncWeekFavoriteButton();
    if (isFavoritesSidebarOpen()) syncFavoritesSidebarMode();
  }

  function deleteFavoriteById(id) {
    var idx = findFavoriteIndexById(id);
    if (idx < 0) return;
    var fav = diaryFavorites[idx];
    if (
      !window.confirm(
        'Delete favorite "' + fav.name + '"? This cannot be undone.'
      )
    ) {
      return;
    }
    diaryFavorites.splice(idx, 1);
    if (fav.type === "day" && fav.dateKey === activeFavoriteDayKey) {
      clearActiveFavoriteDayHighlight();
    }
    saveFavorites();
    syncDayFavoriteButtons();
    syncWeekFavoriteButton();
    if (isFavoritesSidebarOpen()) syncFavoritesSidebarMode();
  }

  function moveFavoriteById(id, delta) {
    var idx = findFavoriteIndexById(id);
    if (idx < 0) return;
    var next = idx + delta;
    if (next < 0 || next >= diaryFavorites.length) return;
    var tmp = diaryFavorites[idx];
    diaryFavorites[idx] = diaryFavorites[next];
    diaryFavorites[next] = tmp;
    saveFavorites();
    if (isFavoritesSidebarOpen()) syncFavoritesSidebarMode();
  }

  function favoritesManageRowHtml(fav, index) {
    var desc = fav.description
      ? '<div class="favorites-manage-desc">' +
        escapeHtml(fav.description) +
        "</div>"
      : "";
    return (
      '<div class="favorites-manage-row" role="listitem" data-favorite-id="' +
      escapeAttr(fav.id) +
      '">' +
      '<div class="favorites-manage-move">' +
      '<button type="button" class="favorites-manage-move-btn" data-action="favorite-move-up" data-favorite-id="' +
      escapeAttr(fav.id) +
      '" aria-label="Move up"' +
      (index === 0 ? " disabled" : "") +
      ">↑</button>" +
      '<button type="button" class="favorites-manage-move-btn" data-action="favorite-move-down" data-favorite-id="' +
      escapeAttr(fav.id) +
      '" aria-label="Move down"' +
      (index === diaryFavorites.length - 1 ? " disabled" : "") +
      ">↓</button>" +
      "</div>" +
      '<div class="favorites-manage-main">' +
      '<button type="button" class="favorites-manage-go" data-action="go-favorite" data-favorite-id="' +
      escapeAttr(fav.id) +
      '">' +
      escapeHtml(fav.name) +
      "</button>" +
      '<div class="favorites-manage-meta">' +
      escapeHtml(favoriteTargetLabel(fav)) +
      "</div>" +
      desc +
      "</div>" +
      '<div class="favorites-manage-actions">' +
      '<button type="button" class="favorites-manage-action" data-action="favorite-edit" data-favorite-id="' +
      escapeAttr(fav.id) +
      '">Edit</button>' +
      '<button type="button" class="favorites-manage-action favorites-manage-action--danger" data-action="favorite-delete" data-favorite-id="' +
      escapeAttr(fav.id) +
      '">Delete</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderFavoritesManageList() {
    if (!favoritesManageListEl) return;
    favoritesManageListEl.innerHTML = diaryFavorites.length
      ? diaryFavorites
          .map(function (fav, index) {
            return favoritesManageRowHtml(fav, index);
          })
          .join("")
      : "";
  }

  function goToFavoriteById(id) {
    var idx = findFavoriteIndexById(id);
    if (idx < 0) return;
    var fav = diaryFavorites[idx];
    closeFavoritesSidebar();
    closeFavoriteEditModal();
    if (fav.type === "week") {
      clearActiveFavoriteDayHighlight();
      setViewedWeekStart(fav.dateKey);
      return;
    }
    var d = parseDateKey(fav.dateKey);
    if (!d) return;
    var mondayKey = toDateKey(mondayOf(d));
    setActiveFavoriteDayHighlight(fav.dateKey);
    setViewedWeekStart(mondayKey);
    var dayId = dayIdForDateKey(fav.dateKey);
    if (dayId) {
      window.requestAnimationFrame(function () {
        setDaysCarouselDayId(dayId);
        var input = document.getElementById(dayId);
        if (input) {
          try {
            input.focus({ preventScroll: true });
          } catch (e) {
            input.focus();
          }
        }
      });
    }
  }

  function updateDayDateLabels() {
    DAYS.forEach(function (day) {
      var el = document.querySelector(
        '[data-day-date="' + day.id + '"]'
      );
      if (el) el.textContent = dateLabelForDayId(day.id);
    });
  }

  function earliestWeekMondayKey() {
    var d = parseDateKey(EARLIEST_DIARY_DATE);
    return d ? toDateKey(mondayOf(d)) : "2026-04-27";
  }

  function clampWeekMondayKey(mondayKey) {
    var next = mondayKey;
    var d = parseDateKey(next);
    if (!d) return earliestWeekMondayKey();
    next = toDateKey(mondayOf(d));
    var earliest = earliestWeekMondayKey();
    if (next < earliest) return earliest;
    return next;
  }

  function isEarliestViewedWeek() {
    return viewedWeekStart === earliestWeekMondayKey();
  }

  function updateWeekNavUi() {
    var label = formatWeekRangeLabel(viewedWeekStart);
    if (weekNavLabelTextEl) {
      weekNavLabelTextEl.textContent = label;
    } else if (weekNavLabelEl) {
      weekNavLabelEl.textContent = label;
    }
    if (weekNavLabelEl) {
      weekNavLabelEl.setAttribute(
        "aria-label",
        label ? "Choose week, currently " + label : "Choose week"
      );
    }
    if (weekNavThisBtn) {
      weekNavThisBtn.disabled = isCurrentWeek();
    }
    if (weekNavPrevBtn) {
      weekNavPrevBtn.disabled = isEarliestViewedWeek();
    }
    updateCopyActionButtons();
    syncWeekFavoriteButton();
    syncDayFavoriteButtons();
  }

  function saveViewedWeekStart() {
    if (!persist) return;
    if (viewedWeekStart) persist.setSetting("viewedWeekStart", viewedWeekStart);
  }

  function loadViewedWeekStartKey() {
    if (!persist) return null;
    var raw = persist.getSetting("viewedWeekStart");
    if (!raw) return null;
    var d = parseDateKey(raw);
    if (!d) return null;
    return toDateKey(mondayOf(d));
  }

  function flushEditorsToDayMeals() {
    if (!viewedWeekStart) return;
    var keys = weekDateKeys(viewedWeekStart);
    DAYS.forEach(function (day, i) {
      var el = document.getElementById(day.id);
      var key = keys[i];
      if (!key) return;
      var text = el ? el.value : "";
      if (text) dayMealsByDate[key] = text;
      else delete dayMealsByDate[key];
    });
  }

  function loadEditorsFromDayMeals() {
    if (!viewedWeekStart) return;
    var keys = weekDateKeys(viewedWeekStart);
    DAYS.forEach(function (day, i) {
      var el = document.getElementById(day.id);
      if (!el) return;
      el.value = dayMealsByDate[keys[i]] || "";
    });
  }

  function setViewedWeekStart(mondayKey) {
    var next = clampWeekMondayKey(mondayKey);
    flushEditorsToDayMeals();
    viewedWeekStart = next;
    saveViewedWeekStart();
    loadEditorsFromDayMeals();
    updateWeekNavUi();
    updateDayDateLabels();
    markTodayDay();
    refreshAll();
    updateDayClearButtons();
  }

  function stepViewedWeek(deltaWeeks) {
    if (!viewedWeekStart) return;
    var mon = parseDateKey(viewedWeekStart);
    if (!mon) return;
    setViewedWeekStart(toDateKey(addDays(mon, deltaWeeks * 7)));
  }

  function goToThisWeek() {
    setViewedWeekStart(currentWeekMondayKey());
  }

  var daysCarouselIndex = 0;
  var daysCarouselMq =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 520px)")
      : null;
  var daysCarouselNavEl = document.querySelector(".week__days-carousel-nav");
  var daysCarouselCurrentEl = document.getElementById("days-carousel-current");
  var daysCarouselScrollTimer = null;

  function isDaysCarouselActive() {
    return !!(daysCarouselMq && daysCarouselMq.matches);
  }

  function dayCarouselIndexById(dayId) {
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].id === dayId) return i;
    }
    return -1;
  }

  function weekGridDayEls() {
    var weekGrid = document.querySelector(".week__grid");
    if (!weekGrid) return [];
    return Array.prototype.slice.call(weekGrid.querySelectorAll(":scope > .day"));
  }

  function syncDaysCarouselNav() {
    if (!daysCarouselNavEl) return;
    var day = DAYS[daysCarouselIndex];
    if (daysCarouselCurrentEl) {
      var label = day ? day.label : "";
      var dateLabel = day ? dateLabelForDayId(day.id) : "";
      daysCarouselCurrentEl.textContent = dateLabel
        ? label + " · " + dateLabel
        : label;
    }
    var prevBtn = daysCarouselNavEl.querySelector(
      '[data-days-carousel="prev"]'
    );
    var nextBtn = daysCarouselNavEl.querySelector(
      '[data-days-carousel="next"]'
    );
    if (prevBtn) prevBtn.disabled = daysCarouselIndex <= 0;
    if (nextBtn) nextBtn.disabled = daysCarouselIndex >= DAYS.length - 1;
  }

  function scrollDaysCarouselToIndex(index) {
    var weekGrid = document.querySelector(".week__grid");
    var dayEls = weekGridDayEls();
    if (!weekGrid || !dayEls.length || !isDaysCarouselActive()) {
      syncDaysCarouselNav();
      return;
    }
    var clamped = Math.max(0, Math.min(dayEls.length - 1, index));
    daysCarouselIndex = clamped;
    var dayEl = dayEls[clamped];
    var gridRect = weekGrid.getBoundingClientRect();
    var dayRect = dayEl.getBoundingClientRect();
    weekGrid.scrollLeft += dayRect.left - gridRect.left;
    syncDaysCarouselNav();
  }

  function setDaysCarouselDayId(dayId) {
    var index = dayCarouselIndexById(dayId);
    if (index < 0) return;
    scrollDaysCarouselToIndex(index);
  }

  function stepDaysCarousel(delta) {
    scrollDaysCarouselToIndex(daysCarouselIndex + delta);
  }

  function syncDaysCarouselFromScroll() {
    var weekGrid = document.querySelector(".week__grid");
    var dayEls = weekGridDayEls();
    if (!weekGrid || !dayEls.length || !isDaysCarouselActive()) return;
    var gridLeft = weekGrid.getBoundingClientRect().left;
    var bestIndex = 0;
    var bestDist = Infinity;
    for (var i = 0; i < dayEls.length; i++) {
      var dist = Math.abs(dayEls[i].getBoundingClientRect().left - gridLeft);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    daysCarouselIndex = bestIndex;
    syncDaysCarouselNav();
  }

  function initDaysCarousel() {
    var weekGrid = document.querySelector(".week__grid");
    if (!weekGrid) return;
    if (!isDaysCarouselActive()) {
      syncDaysCarouselNav();
      return;
    }
    var startId = todayDayId();
    var startIndex = dayCarouselIndexById(startId);
    if (startIndex < 0) startIndex = 0;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        scrollDaysCarouselToIndex(startIndex);
      });
    });
  }

  var stickyFiltersCarouselMq =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 900px)")
      : null;
  var stickyFiltersCarouselState = new WeakMap();

  function isStickyFiltersCarouselActive() {
    return !!(stickyFiltersCarouselMq && stickyFiltersCarouselMq.matches);
  }

  function stickyFiltersTrackSlides(track) {
    return Array.prototype.slice.call(
      track.querySelectorAll(":scope > .dashboard__sticky-filter-group")
    );
  }

  function stickyFiltersCarouselRoot(track) {
    return track.closest(
      ".dashboard__micro-sticky-filters, .dashboard__longevity-sticky-filters"
    );
  }

  function syncStickyFiltersCarouselNav(track) {
    var root = stickyFiltersCarouselRoot(track);
    if (!root) return;
    var slides = stickyFiltersTrackSlides(track);
    var state = stickyFiltersCarouselState.get(track) || { index: 0 };
    var index = Math.max(0, Math.min(slides.length - 1, state.index || 0));
    state.index = index;
    stickyFiltersCarouselState.set(track, state);
    var currentId = track.getAttribute("data-sticky-filters-current");
    var currentEl = currentId ? document.getElementById(currentId) : null;
    if (currentEl) {
      var labelEl = slides[index]
        ? slides[index].querySelector(".dashboard__sticky-filter-group-label")
        : null;
      currentEl.textContent = labelEl
        ? (labelEl.textContent || "").trim()
        : "";
    }
    var prevBtn = root.querySelector(
      '[data-sticky-filters-carousel="prev"]'
    );
    var nextBtn = root.querySelector(
      '[data-sticky-filters-carousel="next"]'
    );
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= slides.length - 1;
  }

  function scrollStickyFiltersCarouselToIndex(track, index) {
    var slides = stickyFiltersTrackSlides(track);
    if (!track || !slides.length || !isStickyFiltersCarouselActive()) {
      syncStickyFiltersCarouselNav(track);
      return;
    }
    var clamped = Math.max(0, Math.min(slides.length - 1, index));
    stickyFiltersCarouselState.set(track, { index: clamped });
    var slide = slides[clamped];
    var trackRect = track.getBoundingClientRect();
    var slideRect = slide.getBoundingClientRect();
    track.scrollLeft += slideRect.left - trackRect.left;
    syncStickyFiltersCarouselNav(track);
  }

  function stepStickyFiltersCarousel(track, delta) {
    var state = stickyFiltersCarouselState.get(track) || { index: 0 };
    if (
      track.closest(".dashboard__micro-sticky-filters") &&
      microFilterMenuOpen
    ) {
      setMicroFilterMenuOpen(null);
    }
    scrollStickyFiltersCarouselToIndex(track, (state.index || 0) + delta);
  }

  function syncStickyFiltersCarouselFromScroll(track) {
    var slides = stickyFiltersTrackSlides(track);
    if (!track || !slides.length || !isStickyFiltersCarouselActive()) return;
    var trackLeft = track.getBoundingClientRect().left;
    var bestIndex = 0;
    var bestDist = Infinity;
    for (var i = 0; i < slides.length; i++) {
      var dist = Math.abs(
        slides[i].getBoundingClientRect().left - trackLeft
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    stickyFiltersCarouselState.set(track, { index: bestIndex });
    syncStickyFiltersCarouselNav(track);
  }

  function initStickyFiltersCarousel() {
    var tracks = document.querySelectorAll("[data-sticky-filters-track]");
    for (var i = 0; i < tracks.length; i++) {
      (function (track) {
        if (!stickyFiltersCarouselState.has(track)) {
          stickyFiltersCarouselState.set(track, { index: 0 });
        }
        if (!track._stickyFiltersCarouselBound) {
          track._stickyFiltersCarouselBound = true;
          var scrollTimer = null;
          track.addEventListener(
            "scroll",
            function () {
              if (scrollTimer) window.clearTimeout(scrollTimer);
              scrollTimer = window.setTimeout(function () {
                syncStickyFiltersCarouselFromScroll(track);
              }, 80);
            },
            { passive: true }
          );
        }
        if (!isStickyFiltersCarouselActive()) {
          syncStickyFiltersCarouselNav(track);
          return;
        }
        var state = stickyFiltersCarouselState.get(track) || { index: 0 };
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            scrollStickyFiltersCarouselToIndex(track, state.index || 0);
          });
        });
      })(tracks[i]);
    }
  }

  function dayNotesPayload() {
    flushEditorsToDayMeals();
    return {
      version: 2,
      days: Object.assign({}, dayMealsByDate),
    };
  }

  function saveDayNotes() {
    if (!persist) return;
    persist.saveDayMeals(dayNotesPayload());
  }

  function saveDayHighlightsPreference() {
    if (!persist) return;
    persist.setSetting("dayHighlights", !!dayHighlightsEnabled);
  }

  function loadDayHighlightsPreference() {
    if (!persist) {
      dayHighlightsEnabled = true;
      return;
    }
    dayHighlightsEnabled = persist.getSetting("dayHighlights") !== false;
  }

  function syncDayHighlightsToggleUi() {
    if (!dayHighlightsToggleBtn) return;
    dayHighlightsToggleBtn.classList.toggle(
      "week__highlight-toggle--off",
      !dayHighlightsEnabled
    );
    dayHighlightsToggleBtn.setAttribute(
      "aria-pressed",
      dayHighlightsEnabled ? "true" : "false"
    );
    dayHighlightsToggleBtn.setAttribute(
      "aria-label",
      dayHighlightsEnabled
        ? "Turn food highlighting off"
        : "Turn food highlighting on"
    );
  }

  function setDayHighlightsEnabled(enabled) {
    dayHighlightsEnabled = !!enabled;
    saveDayHighlightsPreference();
    syncDayHighlightsToggleUi();
    DAYS.forEach(function (day) {
      var el = document.getElementById(day.id);
      if (!el) return;
      updateDayEditorMode(el);
    });
    updateWeekUnmatchedLines();
  }

  function saveDayWordWrapPreference() {
    if (!persist) return;
    persist.setSetting("dayWordWrap", !!dayWordWrapEnabled);
  }

  function loadDayWordWrapPreference() {
    if (!persist) {
      dayWordWrapEnabled = true;
      return;
    }
    dayWordWrapEnabled = persist.getSetting("dayWordWrap") !== false;
  }

  function syncDayWordWrapToggleUi() {
    document.body.classList.toggle("day-word-wrap-off", !dayWordWrapEnabled);
    if (!dayWordWrapToggleBtn) return;
    dayWordWrapToggleBtn.classList.toggle(
      "week__highlight-toggle--off",
      !dayWordWrapEnabled
    );
    dayWordWrapToggleBtn.setAttribute(
      "aria-pressed",
      dayWordWrapEnabled ? "true" : "false"
    );
    dayWordWrapToggleBtn.setAttribute(
      "aria-label",
      dayWordWrapEnabled ? "Turn word wrap off" : "Turn word wrap on"
    );
  }

  function setDayWordWrapEnabled(enabled) {
    dayWordWrapEnabled = !!enabled;
    saveDayWordWrapPreference();
    syncDayWordWrapToggleUi();
  }

  function clampDayEditorHeight(px) {
    var min = 96;
    var max = Math.max(min, Math.floor(window.innerHeight * 0.8));
    return Math.round(Math.max(min, Math.min(max, px)));
  }

  function applyDayEditorHeight(px) {
    var height = clampDayEditorHeight(px);
    document.querySelectorAll(".day__editor").forEach(function (editor) {
      editor.style.height = height + "px";
    });
    return height;
  }

  function saveDayEditorHeight(px) {
    if (!persist) return;
    persist.setSetting("dayEditorHeight", px);
  }

  function loadDayEditorHeight() {
    if (!persist) return;
    var height = persist.getSetting("dayEditorHeight");
    if (typeof height === "number" && height > 0) applyDayEditorHeight(height);
  }

  function isDayEditorResizeIntent(e, editor) {
    var rect = editor.getBoundingClientRect();
    var grip = 24;
    return (
      e.clientX >= rect.right - grip &&
      e.clientY >= rect.bottom - grip &&
      e.clientX <= rect.right + 6 &&
      e.clientY <= rect.bottom + 6
    );
  }

  var dayEditorResizeTarget = null;

  function bindDayEditorResize() {
    document.addEventListener(
      "pointerdown",
      function (e) {
        if (e.button !== 0) return;
        var editor = e.target.closest(".day__editor");
        if (!editor) return;
        if (!isDayEditorResizeIntent(e, editor)) return;
        dayEditorResizeTarget = editor;
      },
      true
    );

    function finishDayEditorResize() {
      if (!dayEditorResizeTarget) return;
      var height = applyDayEditorHeight(dayEditorResizeTarget.offsetHeight);
      saveDayEditorHeight(height);
      dayEditorResizeTarget = null;
    }

    document.addEventListener("pointerup", finishDayEditorResize);
    document.addEventListener("pointercancel", function () {
      dayEditorResizeTarget = null;
    });
  }

  function isV2DayMealsData(data) {
    return !!(
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      data.version === 2 &&
      data.days &&
      typeof data.days === "object" &&
      !Array.isArray(data.days)
    );
  }

  function isLegacyWeekMealsData(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;
    if (isV2DayMealsData(data)) return false;
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].id in data) return true;
    }
    return false;
  }

  function migrateLegacyDayNotesToDates(data) {
    var keys = weekDateKeys(currentWeekMondayKey());
    var out = {};
    DAYS.forEach(function (day, i) {
      if (typeof data[day.id] === "string" && data[day.id]) {
        out[keys[i]] = data[day.id];
      }
    });
    return out;
  }

  function ingestDayMealsMap(daysObj) {
    var out = {};
    if (!daysObj || typeof daysObj !== "object" || Array.isArray(daysObj)) {
      return out;
    }
    Object.keys(daysObj).forEach(function (k) {
      if (!parseDateKey(k)) return;
      if (typeof daysObj[k] !== "string") return;
      if (daysObj[k]) out[k] = daysObj[k];
    });
    return out;
  }

  function loadDayNotes() {
    dayMealsByDate = {};
    var migrated = false;
    if (persist) {
      var data = persist.loadDayMeals();
      if (data) {
        if (isV2DayMealsData(data)) {
          dayMealsByDate = ingestDayMealsMap(data.days);
        } else if (isLegacyWeekMealsData(data)) {
          dayMealsByDate = migrateLegacyDayNotesToDates(data);
          migrated = true;
        }
      }
    }

    viewedWeekStart =
      clampWeekMondayKey(loadViewedWeekStartKey() || currentWeekMondayKey());
    loadEditorsFromDayMeals();
    updateWeekNavUi();
    updateDayDateLabels();
    if (migrated) saveDayNotes();
    saveViewedWeekStart();
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
        "JSON must be a legacy week object (mon…sun) or a v2 diary {\"version\":2,\"days\":{…}}"
      );
    }

    if (isV2DayMealsData(data)) return data;
    if (isLegacyWeekMealsData(data)) return data;

    throw new Error(
      "JSON must be a legacy week object (mon…sun) or a v2 diary {\"version\":2,\"days\":{…}}"
    );
  }

  function confirmImportAllDayMealsApply(missingMode, isV2) {
    var suffix;
    if (isV2) {
      suffix =
        missingMode === "keep"
          ? " Dates not in the JSON will be left unchanged."
          : " The diary will be replaced with only the imported dates.";
    } else {
      suffix =
        missingMode === "keep"
          ? " Viewed-week days not in the JSON will be left unchanged."
          : " Viewed-week days not in the JSON will be cleared.";
    }
    var hasNotes = isV2 ? anyStoredDayHasNotes() : anyDayHasNotes();
    if (!hasNotes) return true;
    return window.confirm(
      "Apply imported day meals?" +
        suffix +
        " This cannot be undone."
    );
  }

  function applySampleDayMealsData(data, clearMissing) {
    if (!viewedWeekStart) viewedWeekStart = currentWeekMondayKey();
    flushEditorsToDayMeals();
    var keys = weekDateKeys(viewedWeekStart);
    DAYS.forEach(function (day, i) {
      var el = document.getElementById(day.id);
      var key = keys[i];
      if (!el || !key) return;

      if (day.id in data) {
        if (typeof data[day.id] !== "string") {
          throw new Error(day.label + " must be a string");
        }
        el.value = data[day.id];
        if (data[day.id]) dayMealsByDate[key] = data[day.id];
        else delete dayMealsByDate[key];
      } else if (clearMissing) {
        el.value = "";
        delete dayMealsByDate[key];
      }
    });
    saveDayNotes();
  }

  function applyImportV2DayMealsData(data, clearMissing) {
    flushEditorsToDayMeals();
    var incoming = data.days;
    var next = clearMissing ? {} : Object.assign({}, dayMealsByDate);
    Object.keys(incoming).forEach(function (k) {
      if (!parseDateKey(k)) {
        throw new Error("Invalid date key: " + k);
      }
      if (typeof incoming[k] !== "string") {
        throw new Error(k + " must be a string");
      }
      if (incoming[k]) next[k] = incoming[k];
      else delete next[k];
    });
    dayMealsByDate = next;
    loadEditorsFromDayMeals();
    saveDayNotes();
  }

  function confirmImportSampleMealsReplace() {
    if (!viewedWeekStart) viewedWeekStart = currentWeekMondayKey();
    var range = formatWeekRangeLabel(viewedWeekStart);
    return window.confirm(
      "Replace meals for " +
        range +
        " with the sample week? This cannot be undone."
    );
  }

  /** Map a v2 sample diary onto a legacy mon…sun week (first sample week). */
  function legacyWeekFromSampleDayMeals(data) {
    if (isLegacyWeekMealsData(data)) return data;
    if (!isV2DayMealsData(data)) {
      throw new Error(
        "JSON must be a legacy week object (mon…sun) or a v2 diary {\"version\":2,\"days\":{…}}"
      );
    }
    var days = data.days;
    var earliest = null;
    Object.keys(days).forEach(function (k) {
      if (!parseDateKey(k)) return;
      if (!earliest || k < earliest) earliest = k;
    });
    if (!earliest) {
      throw new Error("Sample day meals has no dated entries");
    }
    var sampleMonday = toDateKey(mondayOf(parseDateKey(earliest)));
    var weekKeys = weekDateKeys(sampleMonday);
    var out = {};
    DAYS.forEach(function (day, i) {
      var key = weekKeys[i];
      var text = key && days[key];
      out[day.id] = typeof text === "string" ? text : "";
    });
    return out;
  }

  function importSampleMeals() {
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
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) {
      closeHealthTimelineModal();
    }

    // Confirm in the click handler (before fetch) so the browser keeps the
    // user-gesture and does not silently dismiss window.confirm.
    if (!confirmImportSampleMealsReplace()) return;

    fetch(IMPORT_SAMPLE_MEALS_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Could not load sample day meals");
        return res.text();
      })
      .then(function (raw) {
        var data = parseImportAllDayMealsObject(raw);
        // Always apply onto the currently viewed week (v2 dates are remapped).
        applySampleDayMealsData(legacyWeekFromSampleDayMeals(data), true);
        refreshAll();
        updateDayClearButtons();
      })
      .catch(function (e) {
        if (e.message === "cancelled") return;
        window.alert(e.message || "Import sample failed");
      });
  }

  function applyImportAllDayMealsReplace(raw) {
    var missingMode = getImportAllMealsMissingMode();
    var data = parseImportAllDayMealsObject(raw);
    var isV2 = isV2DayMealsData(data);
    if (!confirmImportAllDayMealsApply(missingMode, isV2)) {
      throw new Error("cancelled");
    }

    if (isV2) {
      applyImportV2DayMealsData(data, missingMode === "empty");
    } else {
      applySampleDayMealsData(data, missingMode === "empty");
    }
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

  function anyStoredDayHasNotes() {
    flushEditorsToDayMeals();
    var keys = Object.keys(dayMealsByDate);
    for (var i = 0; i < keys.length; i++) {
      if ((dayMealsByDate[keys[i]] || "").trim()) return true;
    }
    return false;
  }

  function updateCopyActionButtons() {
    var todayKey = todayDateKey();
    var yesterdayKey = toDateKey(addDays(new Date(), -1));
    var tomorrowKey = toDateKey(addDays(new Date(), 1));
    DAYS.forEach(function (day) {
      var wrap = document.querySelector(
        '.day__copy .day__copy-toggle[data-day-id="' + day.id + '"]'
      );
      if (!wrap) return;
      var menu = wrap.parentElement
        ? wrap.parentElement.querySelector(".day__copy-menu")
        : null;
      var key = dateKeyForDayId(day.id);
      var hasNotes = dayHasNotes(day.id);
      wrap.disabled = !key || !hasNotes;
      if (!menu) return;
      var weekToThis = menu.querySelector(
        '[data-action="copy-week-to-this-week"]'
      );
      var weekCustom = menu.querySelector('[data-action="copy-week-to-custom"]');
      var dayCustom = menu.querySelector('[data-action="copy-day-to-custom"]');
      var toToday = menu.querySelector('[data-action="copy-day-to-today"]');
      var toYest = menu.querySelector('[data-action="copy-day-to-yesterday"]');
      var toTom = menu.querySelector('[data-action="copy-day-to-tomorrow"]');
      if (weekToThis) weekToThis.disabled = isCurrentWeek() || !anyDayHasNotes();
      if (weekCustom) weekCustom.disabled = !anyDayHasNotes();
      if (dayCustom) dayCustom.disabled = !hasNotes;
      if (toToday) toToday.disabled = !hasNotes || key === todayKey;
      if (toYest) toYest.disabled = !hasNotes || key === yesterdayKey;
      if (toTom) toTom.disabled = !hasNotes || key === tomorrowKey;
    });
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
    updateCopyActionButtons();
    syncDayFavoriteButtons();
  }

  function closeAllDayCopyMenus() {
    document.querySelectorAll(".day__copy-toggle").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".day__copy-menu").forEach(function (menu) {
      menu.hidden = true;
    });
  }

  function toggleDayCopyMenu(dayId) {
    var btn = document.querySelector(
      '.day__copy-toggle[data-day-id="' + dayId + '"]'
    );
    if (!btn || btn.disabled) return;
    var menu = btn.parentElement
      ? btn.parentElement.querySelector(".day__copy-menu")
      : null;
    if (!menu) return;
    var willOpen = menu.hidden;
    closeAllDayCopyMenus();
    if (!willOpen) return;
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }

  function confirmReplaceMeals(message) {
    return window.confirm(message + " This cannot be undone.");
  }

  function destinationHasNotes(dateKey) {
    return !!((dayMealsByDate[dateKey] || "").trim());
  }

  function weekDestinationHasNotes(mondayKey) {
    var keys = weekDateKeys(mondayKey);
    for (var i = 0; i < keys.length; i++) {
      if (destinationHasNotes(keys[i])) return true;
    }
    return false;
  }

  function writeDateMeal(dateKey, text) {
    if (text) dayMealsByDate[dateKey] = text;
    else delete dayMealsByDate[dateKey];
  }

  function applyCopiedDayToEditorsIfNeeded(destKey, text) {
    if (!viewedWeekStart) return;
    var keys = weekDateKeys(viewedWeekStart);
    var idx = keys.indexOf(destKey);
    if (idx < 0) return;
    var el = document.getElementById(DAYS[idx].id);
    if (el) el.value = text;
  }

  function jumpToDateKey(dateKey) {
    var d = parseDateKey(dateKey);
    if (!d) return;
    setViewedWeekStart(toDateKey(mondayOf(d)));
  }

  function copyDayToDateKey(dayId, destKey, confirmLabel) {
    flushEditorsToDayMeals();
    var srcKey = dateKeyForDayId(dayId);
    if (!srcKey || !destKey || srcKey === destKey) return false;
    if (destKey < earliestWeekMondayKey()) {
      window.alert(
        "Dates before " +
          formatDayDateLabel(parseDateKey(EARLIEST_DIARY_DATE)) +
          " are outside the diary range."
      );
      return false;
    }
    var text = dayMealsByDate[srcKey] || "";
    if (
      destinationHasNotes(destKey) &&
      !confirmReplaceMeals(
        "Replace meals on " +
          (confirmLabel || destKey) +
          " with this date's meals?"
      )
    ) {
      return false;
    }
    writeDateMeal(destKey, text);
    var destMon = toDateKey(mondayOf(parseDateKey(destKey)));
    if (viewedWeekStart === destMon) {
      applyCopiedDayToEditorsIfNeeded(destKey, text);
      saveDayNotes();
      refreshAll();
      updateDayClearButtons();
    } else {
      saveDayNotes();
      jumpToDateKey(destKey);
    }
    return true;
  }

  function copyWeekToMondayKey(destMon, confirmLabel) {
    if (!viewedWeekStart) return false;
    destMon = clampWeekMondayKey(destMon);
    if (viewedWeekStart === destMon) return false;
    flushEditorsToDayMeals();
    var srcKeys = weekDateKeys(viewedWeekStart);
    var destKeys = weekDateKeys(destMon);
    if (
      weekDestinationHasNotes(destMon) &&
      !confirmReplaceMeals(
        "Replace meals for " +
          (confirmLabel || formatWeekRangeLabel(destMon)) +
          " with the viewed week's meals?"
      )
    ) {
      return false;
    }
    for (var j = 0; j < srcKeys.length; j++) {
      writeDateMeal(destKeys[j], dayMealsByDate[srcKeys[j]] || "");
    }
    saveDayNotes();
    setViewedWeekStart(destMon);
    return true;
  }

  function copyDayToToday(dayId) {
    copyDayToDateKey(
      dayId,
      todayDateKey(),
      "today (" + formatDayDateLabel(new Date()) + ")"
    );
  }

  function copyDayToYesterday(dayId) {
    var d = addDays(new Date(), -1);
    copyDayToDateKey(dayId, toDateKey(d), "yesterday (" + formatDayDateLabel(d) + ")");
  }

  function copyDayToTomorrow(dayId) {
    var d = addDays(new Date(), 1);
    copyDayToDateKey(dayId, toDateKey(d), "tomorrow (" + formatDayDateLabel(d) + ")");
  }

  function copyViewedWeekToThisWeek() {
    copyWeekToMondayKey(
      currentWeekMondayKey(),
      "this week (" + formatWeekRangeLabel(currentWeekMondayKey()) + ")"
    );
  }

  function parseTypedDate(raw) {
    var text = String(raw || "").trim();
    if (!text) return null;

    var iso = parseDateKey(text);
    if (iso) return iso;

    var m = text.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2}|\d{4})$/);
    if (m) {
      var month = parseInt(m[1], 10);
      var day = parseInt(m[2], 10);
      var year = parseInt(m[3], 10);
      if (m[3].length === 2) {
        year += year >= 70 ? 1900 : 2000;
      }
      var d = new Date(year, month - 1, day);
      if (
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === day
      ) {
        return d;
      }
    }

    var parsed = Date.parse(text);
    if (!isNaN(parsed)) {
      var fromNative = new Date(parsed);
      return new Date(
        fromNative.getFullYear(),
        fromNative.getMonth(),
        fromNative.getDate()
      );
    }
    return null;
  }

  function showWeekJumpError(message) {
    if (!weekJumpErrorEl) return;
    if (!message) {
      weekJumpErrorEl.hidden = true;
      weekJumpErrorEl.textContent = "";
      return;
    }
    weekJumpErrorEl.hidden = false;
    weekJumpErrorEl.textContent = message;
  }

  function syncWeekJumpPreview(dateObj) {
    if (!weekJumpPreviewEl) return;
    if (!dateObj) {
      weekJumpPreviewEl.textContent = "";
      return;
    }
    var mondayKey = toDateKey(mondayOf(dateObj));
    var clamped = clampWeekMondayKey(mondayKey);
    weekJumpPreviewEl.textContent =
      "Week: " + formatWeekRangeLabel(clamped);
  }

  function setWeekJumpFieldsFromDate(dateObj) {
    if (!dateObj) return;
    var key = toDateKey(dateObj);
    if (weekJumpDateEl) weekJumpDateEl.value = key;
    if (weekJumpTypedEl) {
      weekJumpTypedEl.value = formatDayDateLabel(dateObj);
    }
    syncWeekJumpPreview(dateObj);
  }

  function closeWeekJumpModal() {
    if (!weekJumpModalEl) return;
    weekJumpModalEl.hidden = true;
    showWeekJumpError("");
    updateBodyModalOpen();
  }

  function openWeekJumpModal() {
    if (!weekJumpModalEl) return;
    closeAllDayCopyMenus();
    var earliest = earliestWeekMondayKey();
    if (weekJumpDateEl) {
      weekJumpDateEl.min = earliest;
      weekJumpDateEl.value = viewedWeekStart || todayDateKey();
    }
    var seed = parseDateKey(weekJumpDateEl ? weekJumpDateEl.value : "") ||
      parseDateKey(viewedWeekStart) ||
      new Date();
    setWeekJumpFieldsFromDate(seed);
    showWeekJumpError("");
    weekJumpModalEl.hidden = false;
    updateBodyModalOpen();
    if (weekJumpTypedEl) weekJumpTypedEl.focus();
    else if (weekJumpDateEl) weekJumpDateEl.focus();
  }

  function resolveWeekJumpDate() {
    var typed = weekJumpTypedEl ? weekJumpTypedEl.value.trim() : "";
    if (typed) {
      var fromTyped = parseTypedDate(typed);
      if (fromTyped) return fromTyped;
      return null;
    }
    if (weekJumpDateEl && weekJumpDateEl.value) {
      return parseDateKey(weekJumpDateEl.value);
    }
    return null;
  }

  function runWeekJumpApply() {
    var d = resolveWeekJumpDate();
    if (!d) {
      showWeekJumpError("Enter a valid date (e.g. 5/1/26 or 2026-05-01).");
      return;
    }
    var key = toDateKey(d);
    if (key < earliestWeekMondayKey()) {
      showWeekJumpError(
        "Choose a date on or after " +
          formatDayDateLabel(parseDateKey(EARLIEST_DIARY_DATE)) +
          "."
      );
      return;
    }
    setViewedWeekStart(toDateKey(mondayOf(d)));
    closeWeekJumpModal();
  }

  function closeCopyDateModal() {
    if (!copyDateModalEl) return;
    copyDateModalEl.hidden = true;
    copyDatePending = null;
    showCopyDateError("");
    updateBodyModalOpen();
  }

  function openCopyDateModal(mode, dayId) {
    if (!copyDateModalEl || !copyDateInputEl) return;
    closeAllDayCopyMenus();
    copyDatePending = { mode: mode, dayId: dayId };
    var earliest = earliestWeekMondayKey();
    copyDateInputEl.min = earliest;
    copyDateInputEl.value = todayDateKey();
    if (copyDateModalTitleEl) {
      copyDateModalTitleEl.textContent =
        mode === "week" ? "Copy to custom week" : "Copy to custom day";
    }
    if (copyDateModalHintEl) {
      copyDateModalHintEl.textContent =
        mode === "week"
          ? "Pick any date in the destination week (Mon–Sun). Meals copy Mon→Mon … Sun→Sun."
          : "Pick the destination calendar day for this date’s meals.";
    }
    showCopyDateError("");
    copyDateModalEl.hidden = false;
    updateBodyModalOpen();
    copyDateInputEl.focus();
  }

  function runCopyDateModalApply() {
    if (!copyDatePending || !copyDateInputEl) return;
    var raw = copyDateInputEl.value;
    var d = parseDateKey(raw);
    if (!d) {
      showCopyDateError("Enter a valid date.");
      return;
    }
    var key = toDateKey(d);
    if (key < earliestWeekMondayKey()) {
      showCopyDateError(
        "Choose a date on or after " +
          formatDayDateLabel(parseDateKey(EARLIEST_DIARY_DATE)) +
          "."
      );
      return;
    }
    var pending = copyDatePending;
    var ok = false;
    if (pending.mode === "week") {
      ok = copyWeekToMondayKey(
        toDateKey(mondayOf(d)),
        formatWeekRangeLabel(toDateKey(mondayOf(d)))
      );
    } else {
      ok = copyDayToDateKey(
        pending.dayId,
        key,
        formatDayDateLabel(d)
      );
    }
    if (ok) closeCopyDateModal();
  }

  function handleDayCopyAction(action, dayId) {
    closeAllDayCopyMenus();
    if (action === "copy-week-to-this-week") {
      copyViewedWeekToThisWeek();
      return;
    }
    if (action === "copy-week-to-custom") {
      openCopyDateModal("week", dayId);
      return;
    }
    if (action === "copy-day-to-custom") {
      openCopyDateModal("day", dayId);
      return;
    }
    if (action === "copy-day-to-today") {
      copyDayToToday(dayId);
      return;
    }
    if (action === "copy-day-to-yesterday") {
      copyDayToYesterday(dayId);
      return;
    }
    if (action === "copy-day-to-tomorrow") {
      copyDayToTomorrow(dayId);
    }
  }

  var DAY_SUGGEST_MIN_CHARS = 2;
  var DAY_SUGGEST_MAX = 8;

  function clearDaySuggestDismissed(textarea) {
    if (!textarea) return;
    textarea._daySuggestDismissedLine = null;
  }

  function syncDaySuggestDismissedLine(textarea) {
    if (!textarea || textarea._daySuggestDismissedLine == null) return;
    var info = getCurrentLineInfo(textarea);
    if (info.lineStart !== textarea._daySuggestDismissedLine) {
      clearDaySuggestDismissed(textarea);
    }
  }

  function isDaySuggestDismissed(textarea) {
    if (!textarea || textarea._daySuggestDismissedLine == null) return false;
    var info = getCurrentLineInfo(textarea);
    return info.lineStart === textarea._daySuggestDismissedLine;
  }

  function dismissDaySuggest(textarea) {
    if (!textarea) return;
    var info = getCurrentLineInfo(textarea);
    textarea._daySuggestDismissedLine = info.lineStart;
    hideDaySuggest(textarea);
  }

  function daySuggestPanelHtml(matches) {
    return (
      '<div class="day__suggest-header">' +
      '<button type="button" class="day__suggest-dismiss" data-action="dismiss-suggest" aria-label="Dismiss suggestions for this line">Dismiss</button>' +
      "</div>" +
      '<div class="day__suggest-list" role="presentation">' +
      matches.map(daySuggestItemHtml).join("") +
      "</div>"
    );
  }

  function daySuggestRowHeight(suggestEl) {
    var item = suggestEl && suggestEl.querySelector(".day__suggest-item");
    if (item) return item.offsetHeight;
    return 28;
  }

  function commonPrefixLen(a, b) {
    var max = Math.min(a.length, b.length);
    for (var i = 0; i < max; i++) {
      if (a.charAt(i).toLowerCase() !== b.charAt(i).toLowerCase()) return i;
    }
    return max;
  }

  function levenshtein(a, b) {
    var m = a.length;
    var n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    var row = [];
    var i;
    var j;
    for (j = 0; j <= n; j++) row[j] = j;
    for (i = 1; i <= m; i++) {
      var prev = i;
      for (j = 1; j <= n; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var val = Math.min(row[j - 1] + cost, prev + 1, row[j] + 1);
        row[j - 1] = prev;
        prev = val;
      }
      row[n] = prev;
    }
    return row[n];
  }

  function getCurrentLineInfo(textarea) {
    var value = textarea.value;
    var pos = textarea.selectionStart;
    var lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    var lineEnd = value.indexOf("\n", pos);
    if (lineEnd === -1) lineEnd = value.length;
    return {
      lineStart: lineStart,
      lineEnd: lineEnd,
      text: value.substring(lineStart, pos),
      fullLine: value.substring(lineStart, lineEnd),
    };
  }

  function lineMatchesFoodDefinition(text) {
    var key = stripKeywordServingMultiplier(visibleDayLineText(text)).toLowerCase();
    if (!key) return false;
    for (var i = 0; i < keywords.length; i++) {
      if (keywords[i].name.trim().toLowerCase() === key) return true;
    }
    return false;
  }

  function foodSuggestHighlightRange(name, query) {
    var q = query.trim();
    if (!q) return { start: 0, len: 0 };
    var ql = q.toLowerCase();
    var nl = name.toLowerCase();
    var at = nl.indexOf(ql);
    if (at >= 0) return { start: at, len: q.length };
    return { start: 0, len: commonPrefixLen(q, name) };
  }

  function foodSuggestMatches(query) {
    var q = query.trim();
    if (!q) return [];

    var ql = q.toLowerCase();
    var results = [];

    keywordNames().forEach(function (name) {
      var nl = name.toLowerCase();
      var prefixLen = commonPrefixLen(q, name);
      var match = null;

      if (nl.indexOf(ql) === 0) {
        match = { name: name, score: 0, highlight: { start: 0, len: q.length } };
      } else if (prefixLen >= 2) {
        var slice = nl.slice(0, q.length);
        var dist = levenshtein(ql, slice);
        var maxDist = q.length <= 4 ? 1 : Math.max(1, Math.floor(q.length / 4));
        if (dist <= maxDist) {
          match = {
            name: name,
            score: 1 + dist,
            highlight: { start: 0, len: prefixLen },
          };
        }
      } else {
        var wordAt = nl.indexOf(ql);
        if (
          wordAt > 0 &&
          (nl.charAt(wordAt - 1) === " " || nl.charAt(wordAt - 1) === "-")
        ) {
          match = {
            name: name,
            score: 2,
            highlight: { start: wordAt, len: q.length },
          };
        }
      }

      if (match && match.highlight.len > 0) results.push(match);
    });

    results.sort(function (a, b) {
      if (a.score !== b.score) return a.score - b.score;
      return a.name.length - b.name.length;
    });

    return results.slice(0, DAY_SUGGEST_MAX);
  }

  function daySuggestItemHtml(match) {
    var name = match.name;
    var start = match.highlight.start;
    var len = match.highlight.len;
    var before = escapeHtml(name.substring(0, start));
    var matched = escapeHtml(name.substring(start, start + len));
    var after = escapeHtml(name.substring(start + len));
    return (
      '<button type="button" class="day__suggest-item" data-food-name="' +
      escapeAttr(name) +
      '" role="option" title="' +
      escapeAttr(name) +
      '">' +
      '<span class="day__suggest-item-chevron day__suggest-item-chevron--left" data-action="scroll-suggest-left" role="button" tabindex="-1" aria-label="Show start of food name">‹</span>' +
      '<span class="day__suggest-item-viewport">' +
      '<span class="day__suggest-item-label">' +
      (before ? '<span class="day__suggest-rest">' + before + "</span>" : "") +
      '<span class="day__suggest-match">' +
      matched +
      "</span>" +
      (after ? '<span class="day__suggest-rest">' + after + "</span>" : "") +
      "</span></span>" +
      '<span class="day__suggest-item-chevron day__suggest-item-chevron--right" data-action="scroll-suggest-right" role="button" tabindex="-1" aria-label="Show end of food name">›</span>' +
      "</button>"
    );
  }

  function daySuggestItemViewport(btn) {
    return btn.querySelector(".day__suggest-item-viewport");
  }

  function daySuggestItemLabelEl(btn) {
    return btn.querySelector(".day__suggest-item-label");
  }

  function daySuggestItemScrollOverflow(btn) {
    var viewport = daySuggestItemViewport(btn);
    if (!viewport) return 0;
    return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  }

  function daySuggestItemScrollTo(btn, left, smooth) {
    var viewport = daySuggestItemViewport(btn);
    if (!viewport) return;
    var maxLeft = daySuggestItemScrollOverflow(btn);
    var nextLeft = Math.max(0, Math.min(left, maxLeft));
    if (
      smooth &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      viewport.scrollTo({ left: nextLeft, behavior: "smooth" });
    } else {
      viewport.scrollLeft = nextLeft;
    }
  }

  function daySuggestItemUpdateChevrons(btn) {
    if (!btn.classList.contains("day__suggest-item--scrollable")) return;
    var viewport = daySuggestItemViewport(btn);
    var leftChevron = btn.querySelector(".day__suggest-item-chevron--left");
    var rightChevron = btn.querySelector(".day__suggest-item-chevron--right");
    if (!viewport || !leftChevron || !rightChevron) return;
    var overflow = daySuggestItemScrollOverflow(btn);
    var sl = viewport.scrollLeft;
    leftChevron.classList.toggle("day__suggest-item-chevron--disabled", sl <= 1);
    rightChevron.classList.toggle(
      "day__suggest-item-chevron--disabled",
      overflow <= 1 || sl >= overflow - 1
    );
  }

  function cancelDaySuggestItemScrollAnim(btn) {
    if (!btn || !btn._daySuggestScrollRaf) return;
    cancelAnimationFrame(btn._daySuggestScrollRaf);
    btn._daySuggestScrollRaf = null;
  }

  /** Slow continuous scroll to the right while a suggest pill is hovered. */
  function slowScrollDaySuggestItemRight(btn) {
    var viewport = daySuggestItemViewport(btn);
    if (!viewport) return;
    cancelDaySuggestItemScrollAnim(btn);
    var overflow = daySuggestItemScrollOverflow(btn);
    if (overflow <= 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      daySuggestItemScrollTo(btn, overflow, false);
      daySuggestItemUpdateChevrons(btn);
      return;
    }

    // ~40px/s — long names take a few seconds to reveal
    var pxPerMs = 0.04;
    var last = performance.now();

    function step(now) {
      if (!btn.isConnected) {
        btn._daySuggestScrollRaf = null;
        return;
      }
      var dt = Math.max(0, now - last);
      last = now;
      var maxLeft = daySuggestItemScrollOverflow(btn);
      var next = viewport.scrollLeft + dt * pxPerMs;
      if (next >= maxLeft) {
        viewport.scrollLeft = maxLeft;
        btn._daySuggestScrollRaf = null;
        daySuggestItemUpdateChevrons(btn);
        return;
      }
      viewport.scrollLeft = next;
      daySuggestItemUpdateChevrons(btn);
      btn._daySuggestScrollRaf = requestAnimationFrame(step);
    }

    btn._daySuggestScrollRaf = requestAnimationFrame(step);
  }

  function activateDaySuggestItemScroll(btn) {
    var viewport = daySuggestItemViewport(btn);
    var label = daySuggestItemLabelEl(btn);
    if (!viewport || !label) return;
    resetDaySuggestItemLabel(btn);
    btn.classList.add("day__suggest-item--fitted");
    if (label.scrollWidth <= viewport.clientWidth) {
      btn.classList.remove("day__suggest-item--fitted");
      return;
    }
    btn.classList.add("day__suggest-item--scrollable");
    daySuggestItemUpdateChevrons(btn);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        slowScrollDaySuggestItemRight(btn);
      });
    });
  }

  function resetDaySuggestItemLabel(btn) {
    cancelDaySuggestItemScrollAnim(btn);
    var viewport = daySuggestItemViewport(btn);
    if (viewport) viewport.scrollLeft = 0;
    btn.classList.remove(
      "day__suggest-item--fitted",
      "day__suggest-item--scrollable"
    );
  }

  function resetAllDaySuggestItemLabels(suggestEl) {
    if (!suggestEl) return;
    suggestEl.querySelectorAll(".day__suggest-item").forEach(
      resetDaySuggestItemLabel
    );
    suggestEl._daySuggestHoverItem = null;
  }

  function updateDaySuggestItemHover(suggestEl, target) {
    var btn =
      target && target.closest ? target.closest(".day__suggest-item") : null;
    if (btn && !suggestEl.contains(btn)) btn = null;

    if (suggestEl._daySuggestHoverItem === btn) return;

    resetAllDaySuggestItemLabels(suggestEl);
    if (!btn) return;
    suggestEl._daySuggestHoverItem = btn;
    activateDaySuggestItemScroll(btn);
  }

  function bindDaySuggestHover(el) {
    if (el._daySuggestHoverBound) return;
    el._daySuggestHoverBound = true;
    el.addEventListener("mousemove", function (e) {
      updateDaySuggestItemHover(el, e.target);
    });
    el.addEventListener("mouseleave", function () {
      resetAllDaySuggestItemLabels(el);
    });
    el.addEventListener(
      "touchstart",
      function (e) {
        var btn = e.target.closest(".day__suggest-item");
        if (!btn || !el.contains(btn)) return;
        updateDaySuggestItemHover(el, btn);
      },
      { passive: true }
    );
    el.addEventListener(
      "scroll",
      function (e) {
        if (!e.target.classList.contains("day__suggest-item-viewport")) return;
        var btn = e.target.closest(".day__suggest-item");
        if (btn) daySuggestItemUpdateChevrons(btn);
      },
      true
    );
  }

  function hideAllDaySuggests() {
    document.querySelectorAll(".day__suggest").forEach(function (el) {
      el.hidden = true;
      el.innerHTML = "";
      el.classList.remove("day__suggest--above");
      el.style.top = "";
      el.style.bottom = "";
      el.style.height = "";
      el.style.maxHeight = "";
    });
  }

  function hideDaySuggest(textarea) {
    if (!textarea) return;
    var editor = textarea.closest(".day__editor");
    if (!editor) return;
    var suggestEl = editor.querySelector(".day__suggest");
    if (!suggestEl) return;
    suggestEl.hidden = true;
    suggestEl.innerHTML = "";
    suggestEl.classList.remove("day__suggest--above");
    suggestEl.style.top = "";
    suggestEl.style.bottom = "";
    suggestEl.style.height = "";
    suggestEl.style.maxHeight = "";
  }

  function positionDaySuggest(textarea, suggestEl) {
    if (!textarea || !suggestEl) return;
    var editor = textarea.closest(".day__editor");
    if (!editor) return;
    var backdrop = editor.querySelector(".day__backdrop");
    if (!backdrop) return;

    var info = getCurrentLineInfo(textarea);
    var caretPos = info.lineStart + info.text.length;
    var rect = backdropCaretRect(backdrop, caretPos);
    if (!rect) return;

    var editorRect = editor.getBoundingClientRect();
    var gap = 2;
    var caretTop = rect.top - editorRect.top;
    var caretBottom = rect.bottom - editorRect.top;
    var editorHeight = editor.clientHeight;
    var placeAbove = caretTop >= editorHeight / 2;
    var header = suggestEl.querySelector(".day__suggest-header");
    var headerGap = 6;
    var headerHeight = header ? header.offsetHeight + headerGap : 0;
    var rowHeight = daySuggestRowHeight(suggestEl);
    var minPanelHeight = headerHeight + rowHeight;

    suggestEl.style.left = "0";
    suggestEl.style.right = "0";

    if (placeAbove) {
      // Pin to the top so the line being typed at the bottom stays visible.
      var maxHeight = Math.max(minPanelHeight, caretTop - gap);
      suggestEl.classList.add("day__suggest--above");
      suggestEl.style.top = "0";
      suggestEl.style.bottom = "auto";
      suggestEl.style.height = "auto";
      suggestEl.style.maxHeight = maxHeight + "px";
      return;
    }

    var top = caretBottom + gap;
    var availableBelow = editorHeight - top;
    if (availableBelow < minPanelHeight) {
      top = Math.max(0, editorHeight - minPanelHeight);
    }
    suggestEl.classList.remove("day__suggest--above");
    suggestEl.style.top = top + "px";
    suggestEl.style.bottom = "0";
    suggestEl.style.height = "";
    suggestEl.style.maxHeight = "";
  }

  function bindDaySuggestResize(editor) {
    if (!editor || editor._daySuggestResizeBound) return;
    editor._daySuggestResizeBound = true;
    if (typeof ResizeObserver === "undefined") return;
    var observer = new ResizeObserver(function () {
      var textarea = editor.querySelector(".day__input");
      var suggestEl = editor.querySelector(".day__suggest");
      if (textarea && suggestEl && !suggestEl.hidden) {
        positionDaySuggest(textarea, suggestEl);
      }
    });
    observer.observe(editor);
    editor._daySuggestResizeObserver = observer;
  }

  function ensureDaySuggestEl(editor) {
    var el = editor.querySelector(".day__suggest");
    if (el) {
      bindDaySuggestHover(el);
      bindDaySuggestResize(editor);
      return el;
    }

    el = document.createElement("div");
    el.className = "day__suggest";
    el.hidden = true;
    el.setAttribute("role", "listbox");
    el.setAttribute("aria-label", "Food name suggestions");
    el.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
    el.addEventListener("wheel", function (e) {
      var list = el.querySelector(".day__suggest-list");
      if (!list || list.scrollHeight <= list.clientHeight) return;
      var atTop = list.scrollTop <= 0;
      var atBottom =
        list.scrollTop + list.clientHeight >= list.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) return;
      e.stopPropagation();
    });
    el.addEventListener("click", function (e) {
      var textarea = editor.querySelector(".day__input");
      if (!textarea) return;
      if (e.target.closest('[data-action="dismiss-suggest"]')) {
        dismissDaySuggest(textarea);
        return;
      }
      if (e.target.closest('[data-action="scroll-suggest-left"]')) {
        e.stopPropagation();
        var leftBtn = e.target.closest(".day__suggest-item");
        if (leftBtn) {
          cancelDaySuggestItemScrollAnim(leftBtn);
          daySuggestItemScrollTo(leftBtn, 0, false);
          daySuggestItemUpdateChevrons(leftBtn);
        }
        return;
      }
      if (e.target.closest('[data-action="scroll-suggest-right"]')) {
        e.stopPropagation();
        var rightBtn = e.target.closest(".day__suggest-item");
        if (rightBtn) {
          cancelDaySuggestItemScrollAnim(rightBtn);
          daySuggestItemScrollTo(
            rightBtn,
            daySuggestItemScrollOverflow(rightBtn),
            false
          );
          daySuggestItemUpdateChevrons(rightBtn);
        }
        return;
      }
      var btn = e.target.closest("[data-food-name]");
      if (!btn) return;
      applyDayFoodSuggest(textarea, btn.getAttribute("data-food-name"));
    });
    bindDaySuggestHover(el);
    bindDaySuggestResize(editor);
    editor.appendChild(el);
    return el;
  }

  function applyDayFoodSuggest(textarea, foodName) {
    if (!foodName) return;
    var info = getCurrentLineInfo(textarea);
    var value = textarea.value;
    textarea.value =
      value.substring(0, info.lineStart) +
      foodName +
      value.substring(info.lineEnd);
    var pos = info.lineStart + foodName.length;
    textarea.setSelectionRange(pos, pos);
    clearDaySuggestDismissed(textarea);
    hideDaySuggest(textarea);
    applyDayNoteChange(textarea);
    textarea.focus();
  }

  /** Hovered suggest pill, or first option when none is hovered. */
  function daySuggestPickItem(suggestEl) {
    if (!suggestEl || suggestEl.hidden) return null;
    var hovered = suggestEl._daySuggestHoverItem;
    if (hovered && suggestEl.contains(hovered)) return hovered;
    return suggestEl.querySelector(".day__suggest-item");
  }

  function updateDaySuggest(textarea) {
    if (!textarea || !textarea.classList.contains("day__input")) return;
    var editor = textarea.closest(".day__editor");
    if (!editor) return;

    var info = getCurrentLineInfo(textarea);
    var query = info.text;

    syncDaySuggestDismissedLine(textarea);

    var queryTrimmed = query.trim();
    if (
      queryTrimmed.length < DAY_SUGGEST_MIN_CHARS ||
      lineMatchesFoodDefinition(info.fullLine)
    ) {
      if (!queryTrimmed) clearDaySuggestDismissed(textarea);
      hideDaySuggest(textarea);
      return;
    }

    if (isDaySuggestDismissed(textarea)) {
      hideDaySuggest(textarea);
      return;
    }

    var matches = foodSuggestMatches(query);
    if (!matches.length) {
      hideDaySuggest(textarea);
      return;
    }

    hideAllDaySuggests();
    var suggestEl = ensureDaySuggestEl(editor);
    suggestEl.innerHTML = daySuggestPanelHtml(matches);
    suggestEl._daySuggestHoverItem = null;
    suggestEl.hidden = false;
    requestAnimationFrame(function () {
      if (suggestEl.hidden) return;
      positionDaySuggest(textarea, suggestEl);
    });
  }

  function applyDayNoteChange(textarea) {
    updateDayHighlights(textarea);
    renderDashboard();
    saveDayNotes();
    updateDayClearButtons();
    updateDayFoodNotesUi();
    updateWeekUnmatchedLines();
  }

  function confirmClearDay(dayId) {
    var day = dayById(dayId);
    var label = day ? day.label : dayId;
    var dateLabel = dateLabelForDayId(dayId);
    return window.confirm(
      "Clear all meals for " +
        label +
        (dateLabel ? " (" + dateLabel + ")" : "") +
        "? This cannot be undone."
    );
  }

  function confirmClearAllDays() {
    var range = formatWeekRangeLabel(viewedWeekStart);
    return window.confirm(
      "Clear meals for all " +
        DAYS.length +
        " days in the viewed week" +
        (range ? " (" + range + ")" : "") +
        "? This cannot be undone."
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
    var editor = textarea.closest(".day__editor");
    var backdrop = editor.querySelector(".day__backdrop");

    updateDayEditorMode(textarea);

    textarea.addEventListener("focus", function () {
      setDayEditorMode(textarea, "editing");
    });
    textarea.addEventListener("blur", function () {
      textarea._daySelectAnchor = null;
      hideDaySuggest(textarea);
      updateDayEditorMode(textarea);
    });

    if (backdrop) {
      backdrop.addEventListener("mousedown", function (e) {
        if (!dayHighlightsEnabled || e.button !== 0) return;
        if (editor.classList.contains("day__editor--editing")) return;
        e.preventDefault();
        var pos = caretIndexFromBackdropPoint(textarea, e.clientX, e.clientY);
        setDayEditorMode(textarea, "editing");
        if (pos == null) {
          textarea.focus();
          return;
        }
        textarea._daySelectAnchor = pos;
        setDayInputSelection(textarea, pos, pos);
      });
    }

    textarea.addEventListener("input", function () {
      applyDayNoteChange(textarea);
      updateDaySuggest(textarea);
    });
    textarea.addEventListener("keyup", function () {
      updateDaySuggest(textarea);
    });
    textarea.addEventListener("click", function () {
      updateDaySuggest(textarea);
    });
    textarea.addEventListener("keydown", function (e) {
      var suggestEl = editor.querySelector(".day__suggest");
      if (e.key === "Tab" && !e.shiftKey) {
        if (!suggestEl || suggestEl.hidden) return;
        var pick = daySuggestPickItem(suggestEl);
        var foodName = pick && pick.getAttribute("data-food-name");
        if (!foodName) return;
        e.preventDefault();
        applyDayFoodSuggest(textarea, foodName);
        return;
      }
      if (e.key !== "Escape") return;
      if (!suggestEl || suggestEl.hidden) return;
      e.preventDefault();
      dismissDaySuggest(textarea);
    });
    textarea.addEventListener("scroll", function () {
      syncScroll(textarea, backdrop);
      var suggestEl = editor.querySelector(".day__suggest");
      if (suggestEl && !suggestEl.hidden) {
        positionDaySuggest(textarea, suggestEl);
      }
    });
  }

  document.addEventListener("selectionchange", function () {
    var active = document.activeElement;
    if (active && active.classList.contains("day__input")) {
      updateDaySuggest(active);
    }
  });

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

  keywordsCaloriesToggleEls.forEach(function (btn) {
    btn.addEventListener("click", toggleKeywordCaloriesOpen);
  });

  if (keywordsListEl) {
    keywordsListEl.addEventListener("input", onKeywordFieldChange);
    keywordsListEl.addEventListener("change", onKeywordFieldChange);

    keywordsListEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn || btn.disabled) return;
      var row = btn.closest(".keywords__row");
      if (!row) return;
      var index = keywordIndexFromRow(row);
      if (index < 0 || index >= keywords.length) return;
      var id = keywordIdFromRow(row) || String(keywords[index].id);
      var action = btn.getAttribute("data-action");

      if (action === "up") moveKeywordByIndex(index, -1);
      else if (action === "down") moveKeywordByIndex(index, 1);
      else if (action === "position") openKeywordPositionModalByIndex(index);
      else if (action === "delete") removeKeywordByIndex(index);
      else if (action === "micros") openMicroModal(id, index);
      else if (action === "longevity") openLongevityModal(id, index);
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
    microFormEl.addEventListener("click", function (e) {
      var microBtn = e.target.closest("[data-micro-def]");
      if (!microBtn) return;
      e.preventDefault();
      openMicroDefModal(microBtn.getAttribute("data-micro-def"), null, "micro");
    });
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

  if (healthTimelineAiOpenBtn) {
    healthTimelineAiOpenBtn.addEventListener("click", openHealthTimelineModal);
  }

  if (healthTimelineModalDoneBtn) {
    healthTimelineModalDoneBtn.addEventListener("click", closeHealthTimelineModal);
  }

  if (healthTimelineModalEl) {
    healthTimelineModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-health-timeline-modal"]')) {
        closeHealthTimelineModal();
      }
    });
  }

  if (healthTimelineAiCopyBtn) {
    healthTimelineAiCopyBtn.addEventListener("click", function () {
      copyHealthTimelinePromptToClipboard(function () {
        var prev = healthTimelineAiCopyBtn.textContent;
        healthTimelineAiCopyBtn.textContent = "Copied!";
        window.setTimeout(function () {
          healthTimelineAiCopyBtn.textContent = prev;
        }, 1500);
      });
    });
  }

  if (healthTimelineOpenChatgptEl) {
    healthTimelineOpenChatgptEl.addEventListener("click", function (e) {
      e.preventDefault();
      openHealthTimelineAiService(CHATGPT_URL);
    });
  }

  if (healthTimelineOpenClaudeEl) {
    healthTimelineOpenClaudeEl.addEventListener("click", function (e) {
      e.preventDefault();
      openHealthTimelineAiService(CLAUDE_URL);
    });
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
    if (keywordsCategoryModalEl && !keywordsCategoryModalEl.hidden) {
      closeKeywordsCategoryModal();
      return;
    }
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
      return;
    }
    if (copyDateModalEl && !copyDateModalEl.hidden) {
      closeCopyDateModal();
      return;
    }
    if (favoriteEditModalEl && !favoriteEditModalEl.hidden) {
      closeFavoriteEditModal();
      return;
    }
    if (isFavoritesSidebarOpen()) {
      closeFavoritesSidebar();
      return;
    }
    if (weekJumpModalEl && !weekJumpModalEl.hidden) {
      closeWeekJumpModal();
      return;
    }
    if (importAllModalEl && !importAllModalEl.hidden) {
      closeImportAllModal();
      return;
    }
    if (healthTimelineModalEl && !healthTimelineModalEl.hidden) {
      closeHealthTimelineModal();
      return;
    }
    if (microGapsModalEl && !microGapsModalEl.hidden) {
      closeMicroGapsModal();
      return;
    }
    if (tdeeCalculatorModalEl && !tdeeCalculatorModalEl.hidden) {
      closeTdeeCalculatorModal();
      return;
    }
    if (settingsModalEl && !settingsModalEl.hidden) {
      closeSettingsModal();
      return;
    }
    if (authSignupModalEl && !authSignupModalEl.hidden) {
      closeAuthSignupModal();
      return;
    }
    if (authLoginModalEl && !authLoginModalEl.hidden) {
      closeAuthLoginModal();
      return;
    }
    if (macroRankModalEl && !macroRankModalEl.hidden) {
      closeMacroRankModal();
      return;
    }
    if (microSourcesModalEl && !microSourcesModalEl.hidden) {
      if (microSourcesFullscreen) {
        setMicroSourcesFullscreen(false);
        return;
      }
      closeMicroSourcesModal();
      return;
    }
    if (longevitySourcesModalEl && !longevitySourcesModalEl.hidden) {
      if (longevitySourcesFullscreen) {
        setLongevitySourcesFullscreen(false);
        return;
      }
      closeLongevitySourcesModal();
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
    if (foodSourcesModalEl && !foodSourcesModalEl.hidden) {
      if (foodSourcesFullscreen) {
        setFoodSourcesFullscreen(false);
        return;
      }
      closeFoodSourcesModal();
      return;
    }
    if (longevityNavCanGoBack()) {
      e.preventDefault();
      history.back();
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

  if (keywordsSearchEl) {
    keywordsSearchEl.addEventListener("input", function () {
      setKeywordsFilterQuery(keywordsSearchEl.value);
    });
    // Chrome may autofill a saved username into this search field; wipe it for the first 2s.
    var keywordsAutofillGuardUntil = Date.now() + 2000;
    function clearKeywordsAutofill() {
      if (Date.now() > keywordsAutofillGuardUntil) return;
      if (!keywordsSearchEl.value && !keywordsFilterQuery) return;
      setKeywordsFilterQuery("", { skipSync: true });
    }
    clearKeywordsAutofill();
    var keywordsAutofillGuardId = setInterval(clearKeywordsAutofill, 50);
    setTimeout(function () {
      clearInterval(keywordsAutofillGuardId);
    }, 2050);
  }

  if (keywordsSearchClearBtn) {
    keywordsSearchClearBtn.addEventListener("click", clearKeywordsFilter);
  }

  if (keywordsCategoryOpenBtn) {
    keywordsCategoryOpenBtn.addEventListener("click", openKeywordsCategoryModal);
  }

  if (keywordsCategoryClearBtn) {
    keywordsCategoryClearBtn.addEventListener("click", clearKeywordsCategoryFilter);
  }

  if (keywordsCategoryModalDoneBtn) {
    keywordsCategoryModalDoneBtn.addEventListener("click", closeKeywordsCategoryModal);
  }

  if (keywordsCategoryModalClearBtn) {
    keywordsCategoryModalClearBtn.addEventListener("click", function () {
      clearKeywordsCategoryFilter();
      closeKeywordsCategoryModal();
    });
  }

  if (keywordsCategoryModalEl) {
    keywordsCategoryModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-keywords-category-modal"]')) {
        closeKeywordsCategoryModal();
        return;
      }
      var categoryBtn = e.target.closest("[data-category]");
      if (categoryBtn && keywordsCategoryModalEl.contains(categoryBtn)) {
        applyKeywordsCategoryFromModal(categoryBtn.getAttribute("data-category"));
      }
    });
  }

  if (keywordsCategoryUncategorizedRevealBtn) {
    keywordsCategoryUncategorizedRevealBtn.addEventListener("click", function () {
      setKeywordsCategoryUncategorizedOpen(!keywordsCategoryUncategorizedOpen);
    });
  }

  if (keywordsPageSizeEl) {
    keywordsPageSizeEl.addEventListener("change", function () {
      var size = parseInt(keywordsPageSizeEl.value, 10);
      if (isNaN(size)) return;
      changeKeywordsPageSize(size);
    });
  }

  if (keywordsPageFirstBtn) {
    keywordsPageFirstBtn.addEventListener("click", function () {
      goKeywordsPage(0);
    });
  }

  if (keywordsPagePrevBtn) {
    keywordsPagePrevBtn.addEventListener("click", function () {
      goKeywordsPage(keywordsPageIndex - 1);
    });
  }

  if (keywordsPageNextBtn) {
    keywordsPageNextBtn.addEventListener("click", function () {
      goKeywordsPage(keywordsPageIndex + 1);
    });
  }

  if (keywordsPageLastBtn) {
    keywordsPageLastBtn.addEventListener("click", function () {
      goKeywordsPage(keywordsPageCount() - 1);
    });
  }

  if (sortFoodsAlphabeticallyBtn) {
    sortFoodsAlphabeticallyBtn.addEventListener("click", sortKeywordsAlphabetically);
  }

  if (sortFoodsAlphabeticallyTopBtn) {
    sortFoodsAlphabeticallyTopBtn.addEventListener("click", sortKeywordsAlphabetically);
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

  if (exportAllFoodsTopBtn) {
    exportAllFoodsTopBtn.addEventListener("click", exportAllFoods);
  }

  if (importAllFoodsTopBtn) {
    importAllFoodsTopBtn.addEventListener("click", openImportAllModal);
  }

  if (importSampleFoodsTopBtn) {
    importSampleFoodsTopBtn.addEventListener("click", importSampleFoods);
  }

  if (keywordsEmptyEl) {
    keywordsEmptyEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="import-sample-from-empty"]')) {
        importSampleFoods();
      }
    });
  }

  if (starterGuideDismissEl) {
    starterGuideDismissEl.addEventListener("click", dismissStarterGuide);
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
    bindDayEditorResize();
    weekGridEl.addEventListener("click", function (e) {
      var favoriteBtn = e.target.closest('[data-action="favorite-day"]');
      if (favoriteBtn) {
        if (favoriteBtn.disabled) return;
        closeAllDayCopyMenus();
        closeFavoritesSidebar();
        var favoriteDayId = favoriteBtn.getAttribute("data-day-id");
        if (favoriteDayId) openFavoriteDayEditor(favoriteDayId);
        return;
      }
      var clearBtn = e.target.closest('[data-action="clear-day"]');
      if (clearBtn) {
        closeAllDayCopyMenus();
        var clearDayId = clearBtn.getAttribute("data-day-id");
        if (clearDayId) clearDayNotes(clearDayId);
        return;
      }
      var toggleBtn = e.target.closest('[data-action="toggle-day-copy"]');
      if (toggleBtn) {
        e.stopPropagation();
        var toggleDayId = toggleBtn.getAttribute("data-day-id");
        if (toggleDayId) toggleDayCopyMenu(toggleDayId);
        return;
      }
      var copyItem = e.target.closest(".day__copy-menu [data-action]");
      if (copyItem) {
        e.stopPropagation();
        var action = copyItem.getAttribute("data-action");
        var copyDayId = copyItem.getAttribute("data-day-id");
        if (action && copyDayId && !copyItem.disabled) {
          handleDayCopyAction(action, copyDayId);
        }
      }
    });
    weekGridEl.addEventListener(
      "scroll",
      function () {
        if (!isDaysCarouselActive()) return;
        if (daysCarouselScrollTimer) {
          window.clearTimeout(daysCarouselScrollTimer);
        }
        daysCarouselScrollTimer = window.setTimeout(function () {
          daysCarouselScrollTimer = null;
          syncDaysCarouselFromScroll();
        }, 60);
      },
      { passive: true }
    );
  }

  if (daysCarouselNavEl) {
    daysCarouselNavEl.addEventListener("click", function (e) {
      var adj = e.target.closest("[data-days-carousel]");
      if (!adj || adj.disabled) return;
      var action = adj.getAttribute("data-days-carousel");
      if (action === "prev") stepDaysCarousel(-1);
      else if (action === "next") stepDaysCarousel(1);
    });
  }

  if (daysCarouselMq) {
    var onDaysCarouselMqChange = function () {
      initDaysCarousel();
    };
    if (typeof daysCarouselMq.addEventListener === "function") {
      daysCarouselMq.addEventListener("change", onDaysCarouselMqChange);
    } else if (typeof daysCarouselMq.addListener === "function") {
      daysCarouselMq.addListener(onDaysCarouselMqChange);
    }
  }

  document.addEventListener("click", function (e) {
    var adj = e.target.closest("[data-sticky-filters-carousel]");
    if (!adj || adj.disabled) return;
    var root = adj.closest(
      ".dashboard__micro-sticky-filters, .dashboard__longevity-sticky-filters"
    );
    if (!root) return;
    var track = root.querySelector("[data-sticky-filters-track]");
    if (!track) return;
    var action = adj.getAttribute("data-sticky-filters-carousel");
    if (action === "prev") stepStickyFiltersCarousel(track, -1);
    else if (action === "next") stepStickyFiltersCarousel(track, 1);
  });

  if (stickyFiltersCarouselMq) {
    var onStickyFiltersCarouselMqChange = function () {
      initStickyFiltersCarousel();
    };
    if (typeof stickyFiltersCarouselMq.addEventListener === "function") {
      stickyFiltersCarouselMq.addEventListener(
        "change",
        onStickyFiltersCarouselMqChange
      );
    } else if (typeof stickyFiltersCarouselMq.addListener === "function") {
      stickyFiltersCarouselMq.addListener(onStickyFiltersCarouselMqChange);
    }
  }

  if (clearAllDaysBtn) {
    clearAllDaysBtn.addEventListener("click", clearAllDayNotes);
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".day__copy")) closeAllDayCopyMenus();
  });

  if (copyDateApplyBtn) {
    copyDateApplyBtn.addEventListener("click", runCopyDateModalApply);
  }
  if (copyDateCancelBtn) {
    copyDateCancelBtn.addEventListener("click", closeCopyDateModal);
  }
  if (copyDateModalEl) {
    copyDateModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-copy-date-modal"]')) {
        closeCopyDateModal();
      }
    });
  }
  if (copyDateInputEl) {
    copyDateInputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runCopyDateModalApply();
      }
    });
  }

  if (weekNavPrevBtn) {
    weekNavPrevBtn.addEventListener("click", function () {
      stepViewedWeek(-1);
    });
  }

  if (weekNavNextBtn) {
    weekNavNextBtn.addEventListener("click", function () {
      stepViewedWeek(1);
    });
  }

  if (weekNavThisBtn) {
    weekNavThisBtn.addEventListener("click", goToThisWeek);
  }

  if (weekNavFavoriteBtn) {
    weekNavFavoriteBtn.addEventListener("click", openFavoriteWeekEditor);
  }

  if (favoritesOpenBtn) {
    favoritesOpenBtn.addEventListener("click", function () {
      toggleFavoritesSidebar();
    });
  }

  if (favoritesManageToggleBtn) {
    favoritesManageToggleBtn.addEventListener("click", function () {
      setFavoritesManaging(!favoritesManaging);
    });
  }

  if (favoritesSidebarEl) {
    favoritesSidebarEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-favorites-sidebar"]')) {
        closeFavoritesSidebar();
        return;
      }
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      var favId = btn.getAttribute("data-favorite-id");
      if (action === "go-favorite" && favId) {
        goToFavoriteById(favId);
        return;
      }
      if (!favId) return;
      if (action === "favorite-edit") openFavoriteEditById(favId);
      else if (action === "favorite-delete") deleteFavoriteById(favId);
      else if (action === "favorite-move-up") moveFavoriteById(favId, -1);
      else if (action === "favorite-move-down") moveFavoriteById(favId, 1);
    });
  }

  if (favoriteEditSaveBtn) {
    favoriteEditSaveBtn.addEventListener("click", runFavoriteEditSave);
  }
  if (favoriteEditCancelBtn) {
    favoriteEditCancelBtn.addEventListener("click", closeFavoriteEditModal);
  }
  if (favoriteEditModalEl) {
    favoriteEditModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-favorite-edit-modal"]')) {
        closeFavoriteEditModal();
      }
    });
  }
  if (favoriteEditNameEl) {
    favoriteEditNameEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runFavoriteEditSave();
      }
    });
  }

  if (weekNavLabelEl) {
    weekNavLabelEl.addEventListener("click", openWeekJumpModal);
  }

  if (weekJumpApplyBtn) {
    weekJumpApplyBtn.addEventListener("click", runWeekJumpApply);
  }
  if (weekJumpCancelBtn) {
    weekJumpCancelBtn.addEventListener("click", closeWeekJumpModal);
  }
  if (weekJumpModalEl) {
    weekJumpModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-week-jump-modal"]')) {
        closeWeekJumpModal();
      }
    });
  }
  if (weekJumpDateEl) {
    weekJumpDateEl.addEventListener("change", function () {
      var d = parseDateKey(weekJumpDateEl.value);
      if (!d) return;
      showWeekJumpError("");
      if (weekJumpTypedEl) {
        weekJumpTypedEl.value = formatDayDateLabel(d);
      }
      syncWeekJumpPreview(d);
    });
  }
  if (weekJumpTypedEl) {
    weekJumpTypedEl.addEventListener("input", function () {
      showWeekJumpError("");
      var d = parseTypedDate(weekJumpTypedEl.value);
      if (!d) {
        syncWeekJumpPreview(null);
        return;
      }
      if (weekJumpDateEl) weekJumpDateEl.value = toDateKey(d);
      syncWeekJumpPreview(d);
    });
    weekJumpTypedEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runWeekJumpApply();
      }
    });
  }

  if (exportAllMealsBtn) {
    exportAllMealsBtn.addEventListener("click", exportAllDayMeals);
  }

  if (importAllMealsBtn) {
    importAllMealsBtn.addEventListener("click", openImportAllMealsModal);
  }

  if (importSampleMealsBtn) {
    importSampleMealsBtn.addEventListener("click", importSampleMeals);
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
    saveTdee();
    saveDayNotes();
    saveDayHighlightsPreference();
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

  function scrollDashboardJumpTarget(el) {
    if (!el || typeof el.scrollIntoView !== "function") return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openAndScrollPanel(isOpen, setOpen, panelEl) {
    var nextOpen = !isOpen;
    setOpen(nextOpen);
    if (nextOpen) {
      window.requestAnimationFrame(function () {
        scrollDashboardJumpTarget(panelEl);
      });
    }
  }

  var appNavModifiersHeld = false;

  function isAppNavShortcutBlockedTarget(el) {
    if (!el || !el.tagName) return false;
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA";
  }

  function isAppNavModifierKey(e) {
    return (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta"
    );
  }

  function anyAppNavModifierDown(e) {
    return !!(e.shiftKey || e.ctrlKey || e.metaKey || e.altKey);
  }

  function syncAppNavShortcutHintVisibility() {
    document.body.classList.toggle(
      "app-nav-shortcuts-visible",
      appNavModifiersHeld && !isAppNavShortcutBlockedTarget(document.activeElement)
    );
  }

  function clearAppNavShortcutHints() {
    if (!appNavModifiersHeld) return;
    appNavModifiersHeld = false;
    syncAppNavShortcutHintVisibility();
  }

  function handleAppNavShortcutKey(e) {
    if (e.defaultPrevented || e.repeat) return;
    if (isAppNavShortcutBlockedTarget(document.activeElement)) return;
    // + / = expand more micros; allow Shift so Shift+= matches the "+" hint.
    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      (e.key === "=" ||
        e.key === "+" ||
        e.code === "Equal" ||
        e.code === "NumpadAdd")
    ) {
      var microMoreShortcutEl = document.getElementById(
        "dashboard-micro-more-toggle"
      );
      if (!microMoreShortcutEl) return;
      e.preventDefault();
      microMoreShortcutEl.click();
      return;
    }
    if (anyAppNavModifierDown(e)) return;
    if (e.key === "s" || e.key === "S") {
      if (!dashboardFoodSourcesOpenBtn) return;
      e.preventDefault();
      dashboardFoodSourcesOpenBtn.click();
      return;
    }
    if (e.key === "d" || e.key === "D") {
      if (!dashboardFoodDefinitionsJumpEl) return;
      e.preventDefault();
      dashboardFoodDefinitionsJumpEl.click();
      return;
    }
    if (e.key === "e" || e.key === "E") {
      if (!dashboardFoodEntryJumpEl) return;
      e.preventDefault();
      dashboardFoodEntryJumpEl.click();
      return;
    }
    if (e.key === "m" || e.key === "M") {
      if (!dashboardMacrosJumpEl) return;
      e.preventDefault();
      dashboardMacrosJumpEl.click();
      return;
    }
    if (e.key === "w" || e.key === "W") {
      if (!dashboardWeekToggleEl) return;
      e.preventDefault();
      dashboardWeekToggleEl.click();
      return;
    }
    if (e.key === "r" || e.key === "R") {
      if (!dashboardMicroToggleEl) return;
      e.preventDefault();
      dashboardMicroToggleEl.click();
      return;
    }
    if (e.key === "l" || e.key === "L") {
      if (!dashboardLongevityToggleEl) return;
      e.preventDefault();
      dashboardLongevityToggleEl.click();
      return;
    }
    if (e.key === "v" || e.key === "V") {
      if (!dashboardMicroViewDailyEl && !dashboardMicroViewWeeklyEl) return;
      e.preventDefault();
      setMicroViewDaily(!microViewDaily);
      return;
    }
    if (e.key === "0") {
      e.preventDefault();
      if (!microRequirementsOpen) {
        setMicroRequirementsOpen(true);
      }
      setMicroConditionFocus(
        microConditionFocus === "americanCommonDeficiencies"
          ? null
          : "americanCommonDeficiencies"
      );
      return;
    }
    if (
      e.key === "1" ||
      e.key === "2" ||
      e.key === "3" ||
      e.key === "4" ||
      e.key === "5"
    ) {
      var statusByKey = {
        1: "zero",
        2: "redOrZero",
        3: "green",
        4: "excess",
      };
      if (e.key === "5") {
        e.preventDefault();
        setStickyIconFilter("adverse", !filterStickyAdverseEffects);
        return;
      }
      var statusId = statusByKey[e.key];
      if (!statusId) return;
      e.preventDefault();
      if (!microRequirementsOpen) {
        setMicroRequirementsOpen(true);
      }
      setMicroStatusFilter(statusId);
    }
  }

  document.addEventListener("keydown", function (e) {
    // Only the modifier key itself reveals hints — not letter keys while a
    // modifier is held, and not pointer clicks that happen to include modifiers.
    if (isAppNavModifierKey(e)) {
      appNavModifiersHeld = true;
      syncAppNavShortcutHintVisibility();
    }
    handleAppNavShortcutKey(e);
  });

  document.addEventListener("keyup", function (e) {
    if (!isAppNavModifierKey(e) && anyAppNavModifierDown(e)) return;
    appNavModifiersHeld = anyAppNavModifierDown(e);
    syncAppNavShortcutHintVisibility();
  });

  document.addEventListener(
    "pointerdown",
    function () {
      clearAppNavShortcutHints();
    },
    true
  );

  document.addEventListener("focusin", syncAppNavShortcutHintVisibility);

  window.addEventListener("blur", function () {
    clearAppNavShortcutHints();
  });

  if (dashboardMacrosJumpEl) {
    dashboardMacrosJumpEl.addEventListener("click", function () {
      scrollDashboardJumpTarget(dashboardGridEl);
    });
  }

  if (dashboardFoodDefinitionsJumpEl) {
    dashboardFoodDefinitionsJumpEl.addEventListener("click", function () {
      scrollDashboardJumpTarget(
        document.getElementById("food-definitions-heading")
      );
    });
  }

  if (dashboardFoodEntryJumpEl) {
    dashboardFoodEntryJumpEl.addEventListener("click", function () {
      scrollDashboardJumpTarget(document.getElementById("food-entry"));
    });
  }

  if (dashboardFoodSourcesOpenBtn) {
    dashboardFoodSourcesOpenBtn.addEventListener("click", openFoodSourcesModal);
  }

  if (dashboardWeekToggleEl) {
    dashboardWeekToggleEl.addEventListener("click", function () {
      openAndScrollPanel(weekTotalOpen, setWeekTotalOpen, weekSummaryEl);
    });
  }

  if (dashboardMicroToggleEl) {
    dashboardMicroToggleEl.addEventListener("click", function () {
      openAndScrollPanel(
        microRequirementsOpen,
        setMicroRequirementsOpen,
        dashboardMicroPanelEl
      );
    });
  }

  var dashboardMicroCloseEl = document.getElementById("dashboard-micro-close");
  if (dashboardMicroCloseEl) {
    dashboardMicroCloseEl.addEventListener("click", function () {
      setMicroRequirementsOpen(false);
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
      setShowMicroDailyDv(!showMicroDailyDv);
    });
  }

  document.addEventListener("click", function (e) {
    var nutrientFilterRemove = e.target.closest("[data-nutrient-filter-remove]");
    if (nutrientFilterRemove) {
      e.preventDefault();
      removeStickyNutrientFilter(
        nutrientFilterRemove.getAttribute("data-nutrient-filter-remove")
      );
      return;
    }
    var nutrientFilterPreset = e.target.closest("[data-nutrient-filter-preset]");
    if (nutrientFilterPreset) {
      e.preventDefault();
      applyNutrientFilterPreset(
        nutrientFilterPreset.getAttribute("data-nutrient-filter-preset")
      );
      return;
    }
    var nutrientFilterPick = e.target.closest("[data-nutrient-filter-pick]");
    if (nutrientFilterPick) {
      e.preventDefault();
      var pickKey = nutrientFilterPick.getAttribute("data-nutrient-filter-pick");
      var pickCombobox = nutrientFilterPick.closest(
        ".dashboard__nutrient-filter-combobox"
      );
      var pickInput =
        pickCombobox &&
        pickCombobox.querySelector("[data-nutrient-filter-input]");
      addStickyNutrientFilter(pickKey);
      if (pickInput) {
        pickInput.value = "";
        hideNutrientFilterSuggest(pickInput);
        pickInput.focus();
      }
      return;
    }
    if (!e.target.closest(".dashboard__nutrient-filter-combobox")) {
      document
        .querySelectorAll("[data-nutrient-filter-input]")
        .forEach(function (input) {
          hideNutrientFilterSuggest(input);
        });
    }
    var stickyOptionsToggle = e.target.closest("[data-sticky-options-toggle]");
    if (stickyOptionsToggle) {
      e.preventDefault();
      var group = stickyOptionsToggle.closest(".dashboard__sticky-options");
      var panelId = stickyOptionsToggle.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      var open = stickyOptionsToggle.getAttribute("aria-expanded") === "true";
      var nextOpen = !open;
      if (group) {
        group
          .querySelectorAll("[data-sticky-options-toggle]")
          .forEach(function (btn) {
            var otherId = btn.getAttribute("aria-controls");
            var otherPanel = otherId ? document.getElementById(otherId) : null;
            var isTarget = btn === stickyOptionsToggle;
            btn.setAttribute(
              "aria-expanded",
              isTarget && nextOpen ? "true" : "false"
            );
            if (otherPanel) otherPanel.hidden = !(isTarget && nextOpen);
          });
      } else {
        stickyOptionsToggle.setAttribute(
          "aria-expanded",
          nextOpen ? "true" : "false"
        );
        if (panel) panel.hidden = !nextOpen;
      }
      if (typeof syncLongevityNavHeightVar === "function") {
        syncLongevityNavHeightVar();
      }
      return;
    }
    var stickyFilterClear = e.target.closest("[data-sticky-filter-clear]");
    if (stickyFilterClear) {
      e.preventDefault();
      clearStickyIconFilters();
      return;
    }
    var stickyHighlightClear = e.target.closest("[data-sticky-highlight-clear]");
    if (stickyHighlightClear) {
      e.preventDefault();
      clearStickyIconHighlights();
      return;
    }
    var stickyHighlightToggle = e.target.closest("[data-sticky-highlight]");
    if (stickyHighlightToggle) {
      e.preventDefault();
      var highlightKind = stickyHighlightToggle.getAttribute("data-sticky-highlight");
      var highlightOn =
        stickyHighlightToggle.getAttribute("aria-pressed") === "true";
      setStickyIconHighlight(highlightKind, !highlightOn);
      return;
    }
    var dailyIntakeIconsToggle = e.target.closest(
      "[data-daily-intake-icons-toggle]"
    );
    if (dailyIntakeIconsToggle) {
      e.preventDefault();
      setShowDailyIntakeIcons(!showDailyIntakeIcons);
      return;
    }
    var acuteToggle = e.target.closest("[data-acute-kind]");
    if (!acuteToggle) return;
    e.preventDefault();
    var kind = acuteToggle.getAttribute("data-acute-kind");
    if (kind === "adverse") {
      setShowAcuteAdverseEffects(!showAcuteAdverseEffects);
      return;
    }
    if (kind === "side") {
      setShowAcuteSideEffects(!showAcuteSideEffects);
    }
  });

  document.addEventListener("input", function (e) {
    var nutrientInput = e.target.closest("[data-nutrient-filter-input]");
    if (!nutrientInput) return;
    updateNutrientFilterSuggest(nutrientInput);
  });

  document.addEventListener("focusin", function (e) {
    var nutrientInput = e.target.closest("[data-nutrient-filter-input]");
    if (!nutrientInput) return;
    if (nutrientInput.value.trim()) {
      updateNutrientFilterSuggest(nutrientInput);
    }
  });

  document.addEventListener("keydown", function (e) {
    var nutrientInput = e.target.closest("[data-nutrient-filter-input]");
    if (!nutrientInput) return;
    var wrap = nutrientInput.closest(".dashboard__nutrient-filter-combobox");
    var suggest =
      wrap && wrap.querySelector(".dashboard__nutrient-filter-suggest");
    if (e.key === "Escape") {
      if (suggest && !suggest.hidden) {
        e.preventDefault();
        hideNutrientFilterSuggest(nutrientInput);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!suggest || suggest.hidden) {
        updateNutrientFilterSuggest(nutrientInput);
      } else {
        moveNutrientFilterSuggestActive(nutrientInput, 1);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveNutrientFilterSuggestActive(nutrientInput, -1);
      return;
    }
    if (e.key === "Enter") {
      var activeItem = nutrientFilterActiveSuggestItem(suggest);
      if (activeItem && suggest && !suggest.hidden) {
        e.preventDefault();
        addStickyNutrientFilter(
          activeItem.getAttribute("data-nutrient-filter-pick")
        );
        nutrientInput.value = "";
        hideNutrientFilterSuggest(nutrientInput);
      }
    }
  });

  document.addEventListener("change", function (e) {
    var stickyFilterToggle = e.target.closest("[data-sticky-filter]");
    if (!stickyFilterToggle) return;
    var filterKind = stickyFilterToggle.getAttribute("data-sticky-filter");
    var checked = !!stickyFilterToggle.checked;
    if (filterKind === "daily") {
      setStickyIconFilter("daily", checked);
      return;
    }
    if (filterKind === "side") {
      setStickyIconFilter("side", checked);
      return;
    }
    if (filterKind === "adverse") {
      setStickyIconFilter("adverse", checked);
    }
  });

  function bindMicroFilterMenuToggle(toggleEl, menuId) {
    if (!toggleEl) return;
    toggleEl.addEventListener("click", function () {
      setMicroFilterMenuOpen(microFilterMenuOpen === menuId ? null : menuId);
    });
  }

  function bindMicroFilterClear(clearEl, clearFn) {
    if (!clearEl) return;
    clearEl.addEventListener("click", function () {
      clearFn();
    });
  }

  function bindMicroFilterList(listEl) {
    if (!listEl) return;
    listEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".dashboard__micro-condition-link");
      if (!btn) return;
      e.preventDefault();
      var statusId = btn.getAttribute("data-micro-status-filter");
      if (statusId != null) {
        if (!statusId) {
          setMicroStatusFilter(null);
          return;
        }
        setMicroStatusFilter(statusId === microStatusFilter ? null : statusId);
        return;
      }
      var id = btn.getAttribute("data-micro-condition");
      if (!id) {
        setMicroConditionFocus(null);
        return;
      }
      setMicroConditionFocus(id === microConditionFocus ? null : id);
    });
  }

  function clickInsideEl(el, target) {
    return !!(el && (el === target || el.contains(target)));
  }

  bindMicroFilterMenuToggle(dashboardMicroIntakeToggleEl, "intake");
  bindMicroFilterMenuToggle(dashboardMicroConditionToggleEl, "conditions");
  bindMicroFilterMenuToggle(dashboardMicroStatusToggleEl, "status");
  bindMicroFilterClear(dashboardMicroIntakeClearEl, function () {
    setMicroConditionFocus(null);
  });
  bindMicroFilterClear(dashboardMicroConditionClearEl, function () {
    setMicroConditionFocus(null);
  });
  bindMicroFilterClear(dashboardMicroStatusClearEl, function () {
    setMicroStatusFilter(null);
  });
  bindMicroFilterList(dashboardMicroIntakeListEl);
  bindMicroFilterList(dashboardMicroConditionListEl);
  bindMicroFilterList(dashboardMicroStatusListEl);
  syncMicroStatusFilterUi();

  window.addEventListener(
    "resize",
    function () {
      if (microFilterMenuOpen) syncMicroFilterMenuPositions();
    },
    { passive: true }
  );
  window.addEventListener(
    "scroll",
    function () {
      if (microFilterMenuOpen) syncMicroFilterMenuPositions();
    },
    { passive: true, capture: true }
  );

  document.addEventListener("click", function (e) {
    if (!microFilterMenuOpen) return;
    if (
      clickInsideEl(dashboardMicroIntakeToggleEl, e.target) ||
      clickInsideEl(dashboardMicroIntakeClearEl, e.target) ||
      clickInsideEl(dashboardMicroIntakeListEl, e.target) ||
      clickInsideEl(dashboardMicroConditionToggleEl, e.target) ||
      clickInsideEl(dashboardMicroConditionClearEl, e.target) ||
      clickInsideEl(dashboardMicroConditionListEl, e.target) ||
      clickInsideEl(dashboardMicroStatusToggleEl, e.target) ||
      clickInsideEl(dashboardMicroStatusClearEl, e.target) ||
      clickInsideEl(dashboardMicroStatusListEl, e.target)
    ) {
      return;
    }
    setMicroFilterMenuOpen(null);
  });

  if (dashboardLongevityToggleEl) {
    dashboardLongevityToggleEl.addEventListener("click", function () {
      openAndScrollPanel(
        longevityPanelOpen,
        setLongevityPanelOpen,
        dashboardLongevityPanelEl
      );
    });
  }

  var dashboardLongevityCloseEl = document.getElementById("dashboard-longevity-close");
  if (dashboardLongevityCloseEl) {
    dashboardLongevityCloseEl.addEventListener("click", function () {
      setLongevityPanelOpen(false);
    });
  }

  if (longevityFormEl) {
    longevityFormEl.addEventListener("input", scheduleLongevitySave);
    longevityFormEl.addEventListener("click", function (e) {
      var longevityBtn = e.target.closest("[data-longevity-def]");
      if (!longevityBtn) return;
      e.preventDefault();
      openLongevityDefModal(
        longevityBtn.getAttribute("data-longevity-def"),
        null,
        "longevity"
      );
    });
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
    if (e.target.closest("[data-micro-sources]")) return;
    if (e.target.closest("[data-longevity-sources]")) return;
    if (e.target.closest("[data-micro-daily-intake]")) return;
    if (e.target.closest("[data-micro-acute]")) return;
    if (e.target.closest(".dashboard__target-ref")) return;
    var microBtn = e.target.closest("[data-micro-def]");
    if (microBtn) {
      openMicroDefModal(microBtn.getAttribute("data-micro-def"));
      return;
    }
    var longevityBtn = e.target.closest("[data-longevity-def]");
    if (longevityBtn) {
      openLongevityDefModal(longevityBtn.getAttribute("data-longevity-def"));
    }
  }

  function handleMicroPanelSourcesClick(e) {
    if (handleMicroDailyIntakeClick(e)) return;
    if (handleMicroAcuteToxicityClick(e)) return;
    var longevityBtn = e.target.closest("[data-longevity-sources]");
    if (longevityBtn) {
      e.preventDefault();
      e.stopPropagation();
      openLongevitySourcesModal(
        longevityBtn.getAttribute("data-longevity-sources"),
        longevityBtn.getAttribute("data-longevity-sources-kind") || "longevity"
      );
      return;
    }
    handleMicroSourcesClick(e);
  }

  function handleMicroSourcesClick(e) {
    var btn = e.target.closest("[data-micro-sources]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var key = btn.getAttribute("data-micro-sources");
    var dayId = btn.getAttribute("data-micro-sources-day");
    openMicroSourcesModal(key, dayId || "week");
  }

  if (dashboardMicroListEl) {
    dashboardMicroListEl.addEventListener("click", handleMicroPanelSourcesClick);
    dashboardMicroListEl.addEventListener("click", handleMicroDefClick);
  }

  if (dashboardMicroDailyGridEl) {
    dashboardMicroDailyGridEl.addEventListener("click", handleMicroPanelSourcesClick);
    dashboardMicroDailyGridEl.addEventListener("click", handleMicroDefClick);
  }

  var microMoreToggleEl = document.getElementById("dashboard-micro-more-toggle");
  if (microMoreToggleEl) {
    microMoreToggleEl.addEventListener("click", function () {
      microMoreExpanded = !microMoreExpanded;
      syncMicroMoreToggleUi();
      if (microRequirementsOpen) renderMicroRequirements();
    });
  }

  if (dashboardMicroPanelEl) {
    dashboardMicroPanelEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="dismiss-panel-disclaimer"]')) {
        dismissPanelDisclaimer();
        return;
      }
      if (e.target.closest('[data-action="open-caffeine-tip-modal"]')) {
        openCaffeineTipModal();
        return;
      }
      handleDismissibleTipClick(e);
    });
  }

  if (dashboardLongevityPanelEl) {
    dashboardLongevityPanelEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="dismiss-panel-disclaimer"]')) {
        dismissPanelDisclaimer();
        return;
      }
      handleDismissibleTipClick(e);
    });
  }

  if (dashboardLongevityContentEl) {
    dashboardLongevityContentEl.addEventListener("click", function (e) {
      if (handleMicroDailyIntakeClick(e)) return;
      if (handleMicroAcuteToxicityClick(e)) return;
      if (e.target.closest('[data-action="open-phosphorus-binder-modal"]')) {
        openPhosphorusBinderModal();
        return;
      }
      if (e.target.closest('[data-action="open-fats-cholesterol-tip-modal"]')) {
        openFatsCholesterolTipModal();
        return;
      }
      if (e.target.closest('[data-action="open-tmao-protectors-tip-modal"]')) {
        openTmaoProtectorsTipModal();
        return;
      }
      if (e.target.closest('[data-action="open-fiber-colon-tip-modal"]')) {
        openFiberColonTipModal();
        return;
      }
      if (e.target.closest('[data-action="open-berberine-tip-modal"]')) {
        openBerberineTipModal();
        return;
      }
      if (e.target.closest('[data-action="open-pufa-antioxidant-tip-modal"]')) {
        openPufaAntioxidantTipModal();
        return;
      }
      if (e.target.closest('[data-action="open-histamine-tip-modal"]')) {
        openHistamineTipModal();
        return;
      }
      if (e.target.closest('[data-action="open-dash-diet-tip-modal"]')) {
        openDashDietTipModal();
        return;
      }
      var longevitySourcesBtn = e.target.closest("[data-longevity-sources]");
      if (longevitySourcesBtn) {
        e.preventDefault();
        e.stopPropagation();
        openLongevitySourcesModal(
          longevitySourcesBtn.getAttribute("data-longevity-sources"),
          longevitySourcesBtn.getAttribute("data-longevity-sources-kind") || "longevity"
        );
        return;
      }
      var microBtn = e.target.closest("[data-micro-def]");
      if (microBtn) {
        openMicroDefModal(microBtn.getAttribute("data-micro-def"));
        return;
      }
      var navJumpBtn = e.target.closest("[data-longevity-nav-jump]");
      if (navJumpBtn) {
        e.preventDefault();
        var jumpKey = navJumpBtn.getAttribute("data-longevity-nav-jump");
        var jumpIndex = longevityNavIndexForSection(jumpKey);
        navigateLongevityNavTo(jumpKey, jumpIndex, { push: true });
        return;
      }
      var longevityBtn = e.target.closest("[data-longevity-def]");
      if (longevityBtn) {
        openLongevityDefModal(longevityBtn.getAttribute("data-longevity-def"));
      }
    });
  }

  if (longevitySourcesModalDoneBtn) {
    longevitySourcesModalDoneBtn.addEventListener("click", closeLongevitySourcesModal);
  }

  if (longevitySourcesModalEl) {
    longevitySourcesModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-longevity-sources-modal"]')) {
        closeLongevitySourcesModal();
        return;
      }
      var sortBtn = e.target.closest("[data-sources-sort]");
      if (sortBtn && longevitySourcesModalEl.contains(sortBtn)) {
        activeLongevitySourcesSort = nextSourcesSort(
          activeLongevitySourcesSort,
          sortBtn.getAttribute("data-sources-sort")
        );
        renderLongevitySourcesBody();
        return;
      }
      handleSourcesModalTitleDefClick(
        e,
        longevitySourcesModalTitleEl,
        closeLongevitySourcesModal,
        function () {
          return activeLongevitySourcesKey
            ? {
                kind: "longevity",
                key: activeLongevitySourcesKey,
                sourcesKind: activeLongevitySourcesKind,
              }
            : null;
        }
      );
    });
  }

  if (microSourcesFullscreenToggleBtn) {
    microSourcesFullscreenToggleBtn.addEventListener("click", function () {
      setMicroSourcesFullscreen(!microSourcesFullscreen);
    });
  }

  if (longevitySourcesFullscreenToggleBtn) {
    longevitySourcesFullscreenToggleBtn.addEventListener("click", function () {
      setLongevitySourcesFullscreen(!longevitySourcesFullscreen);
    });
  }

  if (foodSourcesModalDoneBtn) {
    foodSourcesModalDoneBtn.addEventListener("click", closeFoodSourcesModal);
  }

  if (foodSourcesFullscreenToggleBtn) {
    foodSourcesFullscreenToggleBtn.addEventListener("click", function () {
      setFoodSourcesFullscreen(!foodSourcesFullscreen);
    });
  }

  if (foodSourcesFilterEl) {
    foodSourcesFilterEl.addEventListener("input", function () {
      activeFoodSourcesFilter = foodSourcesFilterEl.value || "";
      renderFoodSourcesBody();
    });
  }

  if (foodSourcesModalEl) {
    foodSourcesModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="return-to-def-modal"]')) {
        returnFromFoodSourcesToDefModal();
        return;
      }
      if (e.target.closest('[data-action="close-food-sources-modal"]')) {
        closeFoodSourcesModal();
        return;
      }
      var sortBtn = e.target.closest("[data-food-sources-sort]");
      if (sortBtn && foodSourcesModalEl.contains(sortBtn)) {
        activeFoodSourcesSort = nextFoodSourcesSort(
          activeFoodSourcesSort,
          sortBtn.getAttribute("data-food-sources-sort")
        );
        renderFoodSourcesBody();
        return;
      }
      var defBtn = e.target.closest("[data-food-sources-def]");
      if (defBtn && foodSourcesModalEl.contains(defBtn)) {
        e.preventDefault();
        openFoodSourcesNutrientDef(defBtn.getAttribute("data-food-sources-def"));
      }
    });
  }

  if (microSourcesModalDoneBtn) {
    microSourcesModalDoneBtn.addEventListener("click", closeMicroSourcesModal);
  }

  if (microSourcesScopeEl) {
    microSourcesScopeEl.addEventListener("change", function () {
      activeMicroSourcesScope = microSourcesScopeEl.value || "week";
      renderMicroSourcesBody();
    });
  }

  if (microSourcesFilterEl) {
    microSourcesFilterEl.addEventListener("input", function () {
      activeMicroSourcesFilter = microSourcesFilterEl.value || "";
      renderMicroSourcesBody();
    });
  }

  if (longevitySourcesFilterEl) {
    longevitySourcesFilterEl.addEventListener("input", function () {
      activeLongevitySourcesFilter = longevitySourcesFilterEl.value || "";
      renderLongevitySourcesBody();
    });
  }

  if (microSourcesModalEl) {
    microSourcesModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-micro-sources-modal"]')) {
        closeMicroSourcesModal();
        return;
      }
      var sortBtn = e.target.closest("[data-sources-sort]");
      if (sortBtn && microSourcesModalEl.contains(sortBtn)) {
        activeMicroSourcesSort = nextSourcesSort(
          activeMicroSourcesSort,
          sortBtn.getAttribute("data-sources-sort")
        );
        renderMicroSourcesBody();
        return;
      }
      handleSourcesModalTitleDefClick(
        e,
        microSourcesModalTitleEl,
        closeMicroSourcesModal,
        function () {
          return activeMicroSourcesKey
            ? {
                kind: "micro",
                key: activeMicroSourcesKey,
                scope: activeMicroSourcesScope,
              }
            : null;
        }
      );
    });
  }

  if (microDefModalBackBtn) {
    microDefModalBackBtn.addEventListener("click", returnFromDefModalToSources);
  }

  if (microDefModalDoneBtn) {
    microDefModalDoneBtn.addEventListener("click", closeMicroDefModal);
  }

  if (microDefModalSourcesBtn) {
    microDefModalSourcesBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openSourcesFromDefModal();
    });
  }

  if (phosphorusBinderModalDoneBtn) {
    phosphorusBinderModalDoneBtn.addEventListener("click", closePhosphorusBinderModal);
  }

  if (phosphorusBinderModalEl) {
    phosphorusBinderModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-phosphorus-binder-modal"]')) {
        closePhosphorusBinderModal();
      }
    });
  }

  if (caffeineTipModalDoneBtn) {
    caffeineTipModalDoneBtn.addEventListener("click", closeCaffeineTipModal);
  }

  if (caffeineTipModalEl) {
    caffeineTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-caffeine-tip-modal"]')) {
        closeCaffeineTipModal();
      }
    });
  }

  if (foodNoteModalDoneBtn) {
    foodNoteModalDoneBtn.addEventListener("click", closeFoodNoteModal);
  }

  if (foodNoteModalEl) {
    foodNoteModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-food-note-modal"]')) {
        closeFoodNoteModal();
      }
    });
  }

  if (fatsCholesterolTipModalDoneBtn) {
    fatsCholesterolTipModalDoneBtn.addEventListener("click", closeFatsCholesterolTipModal);
  }

  if (fatsCholesterolTipModalEl) {
    fatsCholesterolTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-fats-cholesterol-tip-modal"]')) {
        closeFatsCholesterolTipModal();
      }
    });
  }

  if (tmaoProtectorsTipModalDoneBtn) {
    tmaoProtectorsTipModalDoneBtn.addEventListener("click", closeTmaoProtectorsTipModal);
  }

  if (tmaoProtectorsTipModalEl) {
    tmaoProtectorsTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-tmao-protectors-tip-modal"]')) {
        closeTmaoProtectorsTipModal();
      }
    });
  }

  if (fiberColonTipModalDoneBtn) {
    fiberColonTipModalDoneBtn.addEventListener("click", closeFiberColonTipModal);
  }

  if (fiberColonTipModalEl) {
    fiberColonTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-fiber-colon-tip-modal"]')) {
        closeFiberColonTipModal();
      }
    });
  }

  if (berberineTipModalDoneBtn) {
    berberineTipModalDoneBtn.addEventListener("click", closeBerberineTipModal);
  }

  if (berberineTipModalEl) {
    berberineTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-berberine-tip-modal"]')) {
        closeBerberineTipModal();
      }
    });
  }

  if (pufaAntioxidantTipModalDoneBtn) {
    pufaAntioxidantTipModalDoneBtn.addEventListener("click", closePufaAntioxidantTipModal);
  }

  if (pufaAntioxidantTipModalEl) {
    pufaAntioxidantTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-pufa-antioxidant-tip-modal"]')) {
        closePufaAntioxidantTipModal();
      }
    });
  }

  if (histamineTipModalDoneBtn) {
    histamineTipModalDoneBtn.addEventListener("click", closeHistamineTipModal);
  }

  if (histamineTipModalEl) {
    histamineTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-histamine-tip-modal"]')) {
        closeHistamineTipModal();
      }
    });
  }

  if (dashDietTipModalDoneBtn) {
    dashDietTipModalDoneBtn.addEventListener("click", closeDashDietTipModal);
  }

  if (dashDietTipModalEl) {
    dashDietTipModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-dash-diet-tip-modal"]')) {
        closeDashDietTipModal();
      }
    });
  }

  if (microDefFullscreenToggleBtn) {
    microDefFullscreenToggleBtn.addEventListener("click", function () {
      setMicroDefFullscreen(!microDefFullscreen);
    });
  }

  if (microDefModalEl) {
    microDefModalEl.addEventListener("click", function (e) {
      var foodSourceBtn = e.target.closest('[data-action="open-food-sources-filter"]');
      if (foodSourceBtn) {
        e.preventDefault();
        openFoodSourcesFromDefFoodSource(
          foodSourceBtn.getAttribute("data-food-source-filter")
        );
        return;
      }
      if (e.target.closest('[data-action="return-to-sources-modal"]')) {
        returnFromDefModalToSources();
        return;
      }
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

  if (settingsOpenBtn) {
    settingsOpenBtn.addEventListener("click", openSettingsModal);
  }

  if (authLoginOpenBtn) {
    authLoginOpenBtn.addEventListener("click", openAuthLoginModal);
  }
  if (authSignupOpenBtn) {
    authSignupOpenBtn.addEventListener("click", openAuthSignupModal);
  }
  if (authLogoutBtn) {
    authLogoutBtn.addEventListener("click", submitAuthLogout);
  }
  if (authSignupCancelBtn) {
    authSignupCancelBtn.addEventListener("click", closeAuthSignupModal);
  }
  if (authSignupSubmitBtn) {
    authSignupSubmitBtn.addEventListener("click", submitAuthSignup);
  }
  if (authLoginCancelBtn) {
    authLoginCancelBtn.addEventListener("click", closeAuthLoginModal);
  }
  if (authLoginSubmitBtn) {
    authLoginSubmitBtn.addEventListener("click", submitAuthLogin);
  }
  if (authSignupModalEl) {
    authSignupModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-auth-signup-modal"]')) {
        closeAuthSignupModal();
      }
    });
    if (authSignupPasswordEl) {
      authSignupPasswordEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submitAuthSignup();
        }
      });
    }
  }
  if (authLoginModalEl) {
    authLoginModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-auth-login-modal"]')) {
        closeAuthLoginModal();
      }
    });
    if (authLoginPasswordEl) {
      authLoginPasswordEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submitAuthLogin();
        }
      });
    }
  }

  if (settingsModalDoneBtn) {
    settingsModalDoneBtn.addEventListener("click", closeSettingsModal);
  }

  if (settingsModalEl) {
    settingsModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-settings-modal"]')) {
        closeSettingsModal();
      }
    });
  }

  if (settingsTdeeEl) {
    settingsTdeeEl.addEventListener("change", readSettingsTdeeFromInput);
  }

  function onSettingsMacroSplitChange() {
    readSettingsMacroSplitFromInput();
    renderDashboard();
  }

  if (settingsMacroBodyTypeEl) {
    settingsMacroBodyTypeEl.addEventListener("change", onSettingsMacroSplitChange);
  }

  if (settingsMacroGoalEl) {
    settingsMacroGoalEl.addEventListener("change", onSettingsMacroSplitChange);
  }

  if (settingsWeightKgBtn) {
    settingsWeightKgBtn.addEventListener("click", function () {
      setSettingsWeightUnit("kg");
    });
  }

  if (settingsWeightLbBtn) {
    settingsWeightLbBtn.addEventListener("click", function () {
      setSettingsWeightUnit("lb");
    });
  }

  if (settingsWeightEl) {
    settingsWeightEl.addEventListener("input", syncSettingsMacroSplitPreview);
    settingsWeightEl.addEventListener("change", readSettingsWeightFromInput);
  }

  if (settingsMacroSplitPreviewEl) {
    settingsMacroSplitPreviewEl.addEventListener("click", function (e) {
      var maxHrBtn = e.target.closest('[data-action="toggle-max-hr-popover"]');
      if (maxHrBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleMaxHrPopover(maxHrBtn);
        return;
      }
      if (!e.target.closest('[data-action="focus-settings-weight"]')) return;
      focusSettingsWeightField();
    });
    settingsMacroSplitPreviewEl.addEventListener("mouseover", function (e) {
      var maxHrBtn = e.target.closest('[data-action="toggle-max-hr-popover"]');
      if (!maxHrBtn) return;
      showMaxHrPopover(maxHrBtn, maxHrPopoverPinned && maxHrPopoverAnchor === maxHrBtn);
    });
    settingsMacroSplitPreviewEl.addEventListener("mouseout", function (e) {
      var maxHrBtn = e.target.closest('[data-action="toggle-max-hr-popover"]');
      if (!maxHrBtn) return;
      var related = e.relatedTarget;
      if (
        related &&
        (maxHrBtn.contains(related) ||
          (maxHrPopoverEl && maxHrPopoverEl.contains(related)))
      ) {
        return;
      }
      scheduleHideMaxHrPopover();
    });
  }

  if (maxHrPopoverEl) {
    maxHrPopoverEl.addEventListener("mouseenter", function () {
      clearMaxHrPopoverHideTimer();
    });
    maxHrPopoverEl.addEventListener("mouseleave", function () {
      scheduleHideMaxHrPopover();
    });
  }

  document.addEventListener("click", function (e) {
    if (!maxHrPopoverEl || maxHrPopoverEl.hidden) return;
    if (
      e.target.closest('[data-action="toggle-max-hr-popover"]') ||
      e.target.closest("#max-hr-popover")
    ) {
      return;
    }
    hideMaxHrPopover();
  });

  window.addEventListener(
    "scroll",
    function () {
      if (maxHrPopoverEl && !maxHrPopoverEl.hidden) hideMaxHrPopover();
    },
    true
  );

  window.addEventListener("resize", function () {
    if (maxHrPopoverAnchor && maxHrPopoverEl && !maxHrPopoverEl.hidden) {
      positionFixedPopoverBelow(maxHrPopoverEl, maxHrPopoverAnchor);
    }
  });

  if (settingsTdeeCalcOpenBtn) {
    settingsTdeeCalcOpenBtn.addEventListener("click", openTdeeCalculatorModal);
  }

  if (tdeeCalculatorCancelBtn) {
    tdeeCalculatorCancelBtn.addEventListener("click", closeTdeeCalculatorModal);
  }

  if (tdeeCalculatorApplyBtn) {
    tdeeCalculatorApplyBtn.addEventListener("click", applyTdeeFromCalculator);
  }

  if (tdeeCalculatorModalEl) {
    tdeeCalculatorModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-tdee-calculator-modal"]')) {
        closeTdeeCalculatorModal();
      }
    });
  }

  if (tdeeCalcSexEl) {
    tdeeCalcSexEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-tdee-sex]");
      if (!btn) return;
      setTdeeCalcSex(btn.getAttribute("data-tdee-sex"));
    });
  }

  [tdeeCalcAgeEl, tdeeCalcWeightEl, tdeeCalcHeightCmEl, tdeeCalcHeightFtEl, tdeeCalcHeightInEl, tdeeCalcHeavySetsEl, tdeeCalcLightSetsEl].forEach(
    function (el) {
      if (!el) return;
      el.addEventListener("input", updateTdeeCalculatorResult);
    }
  );

  [tdeeCalcResistanceDaysEl, tdeeCalcCardioDaysEl, tdeeCalcCardioIntensityEl].forEach(function (el) {
    if (!el) return;
    el.addEventListener("change", updateTdeeCalculatorResult);
  });

  if (tdeeCalcResistanceModeDaysBtn) {
    tdeeCalcResistanceModeDaysBtn.addEventListener("click", function () {
      setTdeeCalcResistanceMode("days");
    });
  }

  if (tdeeCalcResistanceModeSetsBtn) {
    tdeeCalcResistanceModeSetsBtn.addEventListener("click", function () {
      setTdeeCalcResistanceMode("sets");
    });
  }

  if (tdeeCalcCardioEnabledEl) {
    tdeeCalcCardioEnabledEl.addEventListener("change", syncTdeeCalcCardioUi);
  }

  if (tdeeCalcWeightKgBtn) {
    tdeeCalcWeightKgBtn.addEventListener("click", function () {
      setTdeeCalcWeightUnit("kg");
    });
  }

  if (tdeeCalcWeightLbBtn) {
    tdeeCalcWeightLbBtn.addEventListener("click", function () {
      setTdeeCalcWeightUnit("lb");
    });
  }

  [tdeeCalcHeightCmBtn, tdeeCalcHeightCmBtn2].forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener("click", function () {
      setTdeeCalcHeightUnit("cm");
    });
  });

  [tdeeCalcHeightFtBtn, tdeeCalcHeightFtBtn2].forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener("click", function () {
      setTdeeCalcHeightUnit("ft");
    });
  });

  if (tdeeHintModalDoneBtn) {
    tdeeHintModalDoneBtn.addEventListener("click", closeTdeeHintModal);
  }

  if (macroSplitHintModalDoneBtn) {
    macroSplitHintModalDoneBtn.addEventListener("click", closeMacroSplitHintModal);
  }

  if (tdeeHintModalEl) {
    tdeeHintModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-tdee-hint-modal"]')) {
        closeTdeeHintModal();
      }
    });
  }

  if (macroSplitHintModalEl) {
    macroSplitHintModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-macro-split-hint-modal"]')) {
        closeMacroSplitHintModal();
      }
    });
  }

  if (macroSplitCarouselPrevEl) {
    macroSplitCarouselPrevEl.addEventListener("click", function () {
      shiftMacroSplitCarousel(-1);
    });
  }

  if (macroSplitCarouselNextEl) {
    macroSplitCarouselNextEl.addEventListener("click", function () {
      shiftMacroSplitCarousel(1);
    });
  }

  if (weekSummaryEl) {
    weekSummaryEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="open-tdee-hint-modal"]')) {
        openTdeeHintModal();
      }
      if (e.target.closest('[data-action="open-macro-split-hint-modal"]')) {
        openMacroSplitHintModal();
      }
    });
  }

  if (dashboardGridEl) {
    dashboardGridEl.addEventListener("click", function (e) {
      var needLabel = e.target.closest(
        '[data-action="toggle-macro-need-popover"]'
      );
      if (needLabel) {
        e.preventDefault();
        e.stopPropagation();
        toggleMacroNeedPopover(needLabel);
        return;
      }
      var needCard = e.target.closest('[data-action="toggle-macro-need-denom"]');
      if (needCard) {
        e.preventDefault();
        hideMacroNeedPopover();
        macroNeedDenomMode =
          macroNeedDenomMode === "consumed" ? "target" : "consumed";
        renderDashboard();
        return;
      }
      var rankBtn = e.target.closest('[data-action="open-macro-rank-modal"]');
      if (rankBtn) {
        openMacroRankModal(rankBtn.getAttribute("data-day-id"));
        return;
      }
      var btn = e.target.closest('[data-action="toggle-dashboard-macro-view"]');
      if (!btn) return;
      dashboardMacroPctView = !dashboardMacroPctView;
      renderDashboard();
    });

    dashboardGridEl.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target.closest('[data-action="toggle-macro-need-popover"]')) return;
      var needList = e.target.closest(".dashboard__macro-need-list");
      if (!needList || !needList.closest('[data-action="toggle-macro-need-denom"]')) {
        return;
      }
      e.preventDefault();
      hideMacroNeedPopover();
      macroNeedDenomMode =
        macroNeedDenomMode === "consumed" ? "target" : "consumed";
      renderDashboard();
    });

    dashboardGridEl.addEventListener("mouseover", function (e) {
      var needLabel = e.target.closest(
        '[data-action="toggle-macro-need-popover"]'
      );
      if (!needLabel) return;
      showMacroNeedPopover(
        needLabel,
        macroNeedPopoverPinned && macroNeedPopoverAnchor === needLabel
      );
    });

    dashboardGridEl.addEventListener("mouseout", function (e) {
      var needLabel = e.target.closest(
        '[data-action="toggle-macro-need-popover"]'
      );
      if (!needLabel) return;
      var related = e.relatedTarget;
      if (
        related &&
        (needLabel.contains(related) ||
          (macroNeedPopoverEl && macroNeedPopoverEl.contains(related)))
      ) {
        return;
      }
      scheduleHideMacroNeedPopover();
    });
  }

  if (macroNeedPopoverEl) {
    macroNeedPopoverEl.addEventListener("mouseenter", function () {
      clearMacroNeedPopoverHideTimer();
    });
    macroNeedPopoverEl.addEventListener("mouseleave", function () {
      scheduleHideMacroNeedPopover();
    });
  }

  document.addEventListener("click", function (e) {
    if (!macroNeedPopoverEl || macroNeedPopoverEl.hidden) return;
    if (
      e.target.closest('[data-action="toggle-macro-need-popover"]') ||
      e.target.closest("#macro-need-popover")
    ) {
      return;
    }
    hideMacroNeedPopover();
  });

  window.addEventListener(
    "scroll",
    function () {
      if (macroNeedPopoverEl && !macroNeedPopoverEl.hidden) {
        hideMacroNeedPopover();
      }
    },
    true
  );

  window.addEventListener("resize", function () {
    if (
      macroNeedPopoverAnchor &&
      macroNeedPopoverEl &&
      !macroNeedPopoverEl.hidden
    ) {
      positionFixedPopoverBelow(macroNeedPopoverEl, macroNeedPopoverAnchor);
    }
  });

  if (macroRankModalDoneBtn) {
    macroRankModalDoneBtn.addEventListener("click", closeMacroRankModal);
  }

  if (macroRankScopeDailyBtn) {
    macroRankScopeDailyBtn.addEventListener("click", function () {
      setMacroRankScope("daily");
    });
  }

  if (macroRankScopeWeeklyBtn) {
    macroRankScopeWeeklyBtn.addEventListener("click", function () {
      setMacroRankScope("weekly");
    });
  }

  if (macroRankScopeInfoBtn) {
    macroRankScopeInfoBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMacroRankScopeTip();
    });
  }

  if (macroRankFilterEl) {
    macroRankFilterEl.addEventListener("input", function () {
      activeMacroRankFilter = macroRankFilterEl.value || "";
      renderMacroRankBody();
    });
  }

  if (macroRankModalEl) {
    macroRankModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-macro-rank-modal"]')) {
        closeMacroRankModal();
        return;
      }
      if (
        macroRankScopeInfoBtn &&
        macroRankScopeInfoBtn.getAttribute("aria-expanded") === "true" &&
        !macroRankScopeInfoBtn.contains(e.target)
      ) {
        setMacroRankScopeTipOpen(false);
      }
      var tabBtn = e.target.closest("[data-macro-rank-tab]");
      if (tabBtn && macroRankModalEl.contains(tabBtn)) {
        setMacroRankTab(tabBtn.getAttribute("data-macro-rank-tab"));
        return;
      }
      var sortBtn = e.target.closest("[data-sources-sort]");
      if (sortBtn && macroRankModalEl.contains(sortBtn)) {
        activeMacroRankSort = nextSourcesSort(
          activeMacroRankSort,
          sortBtn.getAttribute("data-sources-sort")
        );
        renderMacroRankBody();
      }
    });
  }

  if (macroRankTabsEl) {
    macroRankTabsEl.addEventListener("keydown", function (e) {
      var tabs = Array.prototype.slice.call(
        macroRankTabsEl.querySelectorAll("[data-macro-rank-tab]")
      );
      if (!tabs.length) return;
      var current = e.target.closest("[data-macro-rank-tab]");
      if (!current || tabs.indexOf(current) === -1) return;
      var idx = tabs.indexOf(current);
      var nextIdx = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIdx = (idx + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIdx = (idx - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIdx = 0;
      } else if (e.key === "End") {
        nextIdx = tabs.length - 1;
      }
      if (nextIdx < 0) return;
      e.preventDefault();
      setMacroRankTab(tabs[nextIdx].getAttribute("data-macro-rank-tab"));
      tabs[nextIdx].focus();
    });
  }

  if (dayHighlightsToggleBtn) {
    dayHighlightsToggleBtn.addEventListener("click", function () {
      setDayHighlightsEnabled(!dayHighlightsEnabled);
    });
  }

  if (dayWordWrapToggleBtn) {
    dayWordWrapToggleBtn.addEventListener("click", function () {
      setDayWordWrapEnabled(!dayWordWrapEnabled);
    });
  }

  if (dayUnmatchedLinesEl) {
    dayUnmatchedLinesEl.addEventListener("mousedown", function (e) {
      var btn = e.target.closest("[data-unmatched-action]");
      if (!btn || !dayUnmatchedLinesEl.contains(btn)) return;
      var action = btn.getAttribute("data-unmatched-action");
      // Keep prev/next/toggle clicks from blurring a day textarea mid-click
      // (blur used to rebuild this DOM and eat or double the click).
      if (action === "prev" || action === "next" || action === "toggle") {
        e.preventDefault();
      }
    });
    dayUnmatchedLinesEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-unmatched-action]");
      if (!btn || !dayUnmatchedLinesEl.contains(btn)) return;
      var action = btn.getAttribute("data-unmatched-action");
      if (action === "toggle") {
        toggleUnmatchedCarousel();
        return;
      }
      if (action === "prev") {
        stepUnmatchedCarousel(-1);
        return;
      }
      if (action === "next") {
        stepUnmatchedCarousel(1);
        return;
      }
      if (action === "jump") {
        var dayId = btn.getAttribute("data-day-id");
        var lineNum = Number(btn.getAttribute("data-line-num"));
        if (!dayId || !lineNum) return;
        focusDayLine(dayId, lineNum);
      }
    });
  }

  if (dayFoodNotesEl) {
    initDayFoodNotesEvents();
  }

  document.addEventListener("click", function (e) {
    if (microDailyIntakePopoverAnchor) {
      if (!e.target.closest("[data-micro-daily-intake]")) {
        hideMicroDailyIntakePopover();
      }
    }
    if (microAcuteToxicityPopoverAnchor) {
      if (
        !e.target.closest("[data-micro-acute]") &&
        !e.target.closest("#micro-acute-toxicity-popover")
      ) {
        hideMicroAcuteToxicityPopover();
      }
    }
  });

  window.addEventListener(
    "scroll",
    function () {
      hideMicroDailyIntakePopover();
      hideMicroAcuteToxicityPopover();
    },
    true
  );

  function bindStarterGuideScrollResize() {
    if (starterGuideScrollResizeBound) return;
    starterGuideScrollResizeBound = true;
    window.addEventListener("scroll", repositionStarterGuide, true);
    window.addEventListener("resize", repositionStarterGuide);
  }

  function unbindStarterGuideScrollResize() {
    if (!starterGuideScrollResizeBound) return;
    starterGuideScrollResizeBound = false;
    window.removeEventListener("scroll", repositionStarterGuide, true);
    window.removeEventListener("resize", repositionStarterGuide);
  }

  function starterGuideTargetForStep(step) {
    if (step === "import") {
      return (
        importSampleFoodsTopBtn ||
        importSampleFoodsBtn ||
        document.getElementById("food-definitions-heading")
      );
    }
    if (step === "meals") {
      return document.querySelector(".week__grid");
    }
    return null;
  }

  function repositionStarterGuide() {
    if (!starterGuideEl || starterGuideEl.hidden || !starterGuideTarget) return;

    var rect = starterGuideTarget.getBoundingClientRect();
    var gap = 14;
    var panelWidth = starterGuideEl.offsetWidth || 280;
    var left = rect.left + rect.width / 2;
    var minLeft = panelWidth / 2 + 12;
    var maxLeft = window.innerWidth - panelWidth / 2 - 12;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    if (starterGuideStep === "import") {
      starterGuideEl.style.left = left + "px";
      starterGuideEl.style.top = rect.top - gap + "px";
      starterGuideEl.style.transform = "translate(-50%, -100%)";
      starterGuideEl.setAttribute("data-placement", "bottom");
      return;
    }

    if (starterGuideStep === "meals") {
      starterGuideEl.style.left = left + "px";
      starterGuideEl.style.top = rect.top - gap + "px";
      starterGuideEl.style.transform = "translate(-50%, -100%)";
      starterGuideEl.setAttribute("data-placement", "bottom");
    }
  }

  function hideStarterGuide() {
    if (!starterGuideEl) return;
    starterGuideEl.hidden = true;
    starterGuideStep = null;
    starterGuideTarget = null;
    unbindStarterGuideScrollResize();
  }

  function dismissStarterGuide() {
    if (starterGuideStep === "meals") {
      starterGuideEligible = false;
    }
    hideStarterGuide();
  }

  function showStarterGuideStep(step, message, scrollTarget) {
    if (!starterGuideEl || !starterGuideTextEl) return;

    starterGuideStep = step;
    starterGuideTarget = starterGuideTargetForStep(step);
    if (!starterGuideTarget) return;

    starterGuideTextEl.textContent = message;
    starterGuideEl.hidden = false;

    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(repositionStarterGuide, 350);
    } else {
      repositionStarterGuide();
    }

    bindStarterGuideScrollResize();
  }

  function maybeShowStarterGuideImportStep() {
    if (keywords.length > 0) return;
    starterGuideEligible = true;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (keywords.length > 0 || !starterGuideEligible) return;
        var section = document.querySelector(".keywords");
        showStarterGuideStep(
          "import",
          "Start here — import our sample food definitions so the app knows each food\u2019s nutrition.",
          section
        );
      });
    });
  }

  function advanceStarterGuideAfterImport() {
    if (!starterGuideEligible || keywords.length === 0) return;

    var weekGrid = document.querySelector(".week__grid");
    showStarterGuideStep(
      "meals",
      "Enter what you ate on Mon\u2013Wed (and the rest of the week). Type names that match your food definitions \u2014 suggestions appear as you type.",
      weekGrid
    );
  }

  function boot() {
    loadPersistedAppState();
    initDaysCarousel();
    initStickyFiltersCarousel();
    initLongevityNav();
    initTargetRefPopoverEvents();
    applyLoadedAppStateToUi();
    applyInitialLongevityHash();
    maybeShowStarterGuideImportStep();
  }

  loadAppConfig(function () {
    var pending = 5;
    function definitionsReady() {
      pending -= 1;
      if (pending === 0) boot();
    }
    loadMicroDefinitions(definitionsReady);
    loadLongevityDefinitions(definitionsReady);
    loadFoodNotesDefinitions(definitionsReady);
    loadFoodCategoriesDefinitions(definitionsReady);
    loadFoodSourcesPrecomputed(definitionsReady);
  });

  syncAuthUi();
})();
