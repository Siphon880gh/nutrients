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
  var STORAGE_KEY_BODY_WEIGHT_KG = "nutrients-body-weight-kg";
  var STORAGE_KEY_TDEE = "nutrients-tdee";
  var STORAGE_KEY_DAYS = "nutrients-day-notes";
  var STORAGE_KEY_DAY_EDITOR_HEIGHT = "nutrients-day-editor-height";
  var STORAGE_KEY_DAY_HIGHLIGHTS = "nutrients-day-highlights";
  var STORAGE_KEY_REORDER = "nutrients-keywords-reorder-open";
  var STORAGE_KEY_CALORIES = "nutrients-keywords-calories-open";
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
  var keywordCaloriesOpen = false;
  var keywordsCaloriesToggleEls = document.querySelectorAll(
    ".keywords__macro-toggle[data-action='toggle-calories']"
  );
  var keywordsTotalCalHeaderEl = document.querySelector(".keywords__th-total--cal");
  var addKeywordBtn = document.getElementById("add-keyword");
  var dashboardGridEl = document.getElementById("dashboard-grid");
  var weekSummaryEl = document.getElementById("week-summary");
  var dashboardPrintBtn = document.getElementById("dashboard-print");
  var dashboardWeekToggleEl = document.getElementById("dashboard-week-toggle");
  var dashboardMicroToggleEl = document.getElementById("dashboard-micro-toggle");
  var dashboardMicroPanelEl = document.getElementById("dashboard-micro-panel");
  var dashboardMicroListEl = document.getElementById("dashboard-micro-list");
  var dashboardMicroMoreWrapEl = document.querySelector(".dashboard__micro-more-wrap");
  var dashboardMicroDailyGridEl = document.getElementById("dashboard-micro-daily-grid");
  var dashboardMicroHintTextEl = document.getElementById("dashboard-micro-hint-text");
  var dashboardMicroConditionToggleEl = document.getElementById(
    "dashboard-micro-condition-toggle"
  );
  var dashboardMicroConditionLabelEl = document.getElementById(
    "dashboard-micro-condition-label"
  );
  var dashboardMicroConditionClearEl = document.getElementById(
    "dashboard-micro-condition-clear"
  );
  var dashboardMicroConditionClearItemEl = document.getElementById(
    "dashboard-micro-condition-clear-item"
  );
  var dashboardMicroConditionListEl = document.getElementById(
    "dashboard-micro-condition-list"
  );
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
  var microDefBodyEl = document.getElementById("micro-def-body");
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
  var settingsDemographicIconEl = document.getElementById("settings-demographic-icon");
  var settingsTdeeEl = document.getElementById("settings-tdee");
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
  var exportAllFoodsTopBtn = document.getElementById("export-all-foods-top");
  var importAllFoodsTopBtn = document.getElementById("import-all-foods-top");
  var importSampleFoodsTopBtn = document.getElementById("import-sample-foods-top");
  var starterGuideEl = document.getElementById("starter-guide");
  var starterGuideTextEl = document.getElementById("starter-guide-text");
  var starterGuideDismissEl = document.getElementById("starter-guide-dismiss");
  var starterGuideEligible = false;
  var starterGuideStep = null;
  var starterGuideTarget = null;
  var starterGuideScrollResizeBound = false;
  var IMPORT_SAMPLE_FOODS_URL = "samples/definitions-food.json";
  var importAllMealsModalEl = document.getElementById("import-all-meals-modal");
  var importAllMealsJsonEl = document.getElementById("import-all-meals-json");
  var importAllMealsErrorEl = document.getElementById("import-all-meals-error");
  var importAllMealsApplyBtn = document.getElementById("import-all-meals-apply");
  var importAllMealsCancelBtn = document.getElementById("import-all-meals-cancel");
  var exportAllMealsBtn = document.getElementById("export-all-meals");
  var importAllMealsBtn = document.getElementById("import-all-meals");
  var dayHighlightsToggleBtn = document.getElementById("day-highlights-toggle");
  var dayFoodNotesEl = document.getElementById("day-food-notes");
  var dayFoodNotesLabelsEl = document.getElementById("day-food-notes-labels");
  var dayFoodNotesPopoverEl = document.getElementById("day-food-notes-popover");
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
  var userBodyWeightKg = null;
  var settingsWeightUnit = "lb";
  var tdeeCalcSex = DEFAULT_DEMOGRAPHIC;
  var tdeeCalcWeightUnit = "lb";
  var tdeeCalcHeightUnit = "ft";
  var tdeeCalcResistanceMode = "days";
  var tdeeCalcLastResult = null;
  var dayHighlightsEnabled = true;
  var dashboardMacroPctView = false;
  var weekTotalOpen = false;
  var panelDisclaimerDismissed = false;
  var microRequirementsOpen = false;
  var microConditionExpanded = false;
  var microConditionFocus = null;
  var showMicroDailyDv = false;
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
  var activeMicroSourcesKey = null;
  var activeMicroSourcesScope = "week";
  var activeLongevitySourcesKey = null;
  var activeLongevitySourcesKind = null;
  var microSourcesModalEl = document.getElementById("micro-sources-modal");
  var microSourcesModalTitleEl = document.getElementById("micro-sources-modal-title");
  var microSourcesScopeEl = document.getElementById("micro-sources-scope");
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
  var longevitySourcesBodyEl = document.getElementById("longevity-sources-body");
  var longevitySourcesModalDoneBtn = document.getElementById("longevity-sources-modal-done");
  var longevitySourcesFullscreenToggleBtn = document.getElementById(
    "longevity-sources-fullscreen-toggle"
  );
  var microSourcesFullscreen = false;
  var longevitySourcesFullscreen = false;
  var microDailyIntakePopoverEl = document.getElementById("micro-daily-intake-popover");
  var microDailyIntakePopoverAnchor = null;
  var targetRefPopoverEl = document.getElementById("target-ref-popover");
  var targetRefPopoverTextEl = document.getElementById("target-ref-popover-text");
  var targetRefPopoverAnchor = null;

  var TARGET_REF_POPOVER_TEXT = {
    fda:
      "FDA Daily Value — the daily reference behind % DV on U.S. nutrition labels for vitamins and minerals. The FDA factors in absorbability: for example, plant vitamin A is expressed as retinol activity equivalents (RAE), which reflects lower absorption from vegetables than from preformed vitamin A in animal foods. This app uses sex-specific targets from Settings where needs differ from a single label number.",
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
    sectionFats: { label: "Fats & cholesterol" },
    sectionOmega: { label: "Omega fatty acids" },
    sectionGlutathione: { label: "Glutathione support" },
    sectionDnaRepair: { label: "DNA repair support" },
    sectionCompounds: { label: "Longevity & inflammation compounds" },
    sectionCarb: { label: "Carb quality" },
    sectionMicronutrients: { label: "Micronutrients from food" },
    sectionFiber: { label: "Fiber & colon health" },
    sectionThyroid: { label: "Thyroid health" },
    sectionBoneDensity: { label: "Bone density" },
    sectionStressResilience: { label: "Stress resilience" },
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
    coffeeTeaUser: {
      label: "Chronic coffee / tea / energy drink user",
      nutrients: ["iron", "zinc", "calcium", "magnesium", "vitaminC"],
    },
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
      ],
      longevityNutrients: ["epa", "dha"],
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
        "resveratrol",
        "curcumin",
      ],
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
      ],
    },
    cataractsPrevention: {
      label: "Cataracts prevention",
      nutrients: ["vitaminC", "vitaminA", "zinc", "vitaminE", "selenium"],
      longevityNutrients: [
        "lutein",
        "carotenoids",
        "epa",
        "dha",
      ],
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

  var MICRO_FIELDS = [
    { key: "fiber", label: "Fiber", unit: "g", code: "f" },
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
    { key: "vitaminD", label: "Vitamin D", unit: "mcg", code: "d" },
    { key: "vitaminE", label: "Vitamin E", unit: "mg", code: "e" },
    { key: "vitaminK", label: "Vitamin K", unit: "mcg", code: "vk" },
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
    { key: "fluoride", label: "Fluoride", unit: "mg", code: "fl" },
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
    { label: "Thyroid health", sectionDefKey: "sectionThyroid" },
    { label: "Bone density", sectionDefKey: "sectionBoneDensity" },
    { label: "Stress resilience", sectionDefKey: "sectionStressResilience" },
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
  ];

  var LONGEVITY_BONE_FROM_MICRO = [
    { microKey: "calcium", label: "Calcium", limiting: false },
    { microKey: "magnesium", label: "Magnesium", limiting: false },
    { microKey: "vitaminD", label: "Vitamin D", limiting: false },
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
    { microKey: "pantothenicAcid", label: "Pantothenic acid (B5)", limiting: false },
    { microKey: "biotin", label: "Biotin (B7)", limiting: false },
    { microKey: "iron", label: "Iron", limiting: false },
    { microKey: "magnesium", label: "Magnesium", limiting: false },
    { microKey: "manganese", label: "Manganese", limiting: false },
    {
      microKey: "taurine",
      label: "Taurine — mitochondrial antioxidant",
      limiting: false,
    },
  ];

  var LONGEVITY_MITO_FROM_LONGEVITY = [{ key: "coq10", label: "Coenzyme Q10", limiting: false }];

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
    { key: "polyphenols", label: "Polyphenols — vascular support" },
    { key: "monounsaturatedFat", label: "Monounsaturated fat — olive-oil pattern" },
  ];

  var LONGEVITY_VASCULAR_LOWER_PRIORITY_FROM_MICRO = [
    { microKey: "vitaminD", label: "Vitamin D — observational BP links" },
  ];

  var LONGEVITY_VASCULAR_LOWER_PRIORITY_FROM_LONGEVITY = [
    { key: "vitaminK", label: "Vitamin K — calcium routing" },
    { key: "vitaminK2", label: "Vitamin K2 — arterial calcification" },
    { key: "coq10", label: "CoQ10 — trial data mostly supplemental" },
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
    var pct = avgDailyLongevityPct(key, value);
    return longevityRowHtml(
      label,
      value > 0 ? fmtNum(avgDailyLongevity(key, value)) + " " + field.unit : "—",
      pct == null || isNaN(pct) ? "—" : fmtNum(pct) + "%",
      pct,
      "",
      false,
      key,
      false,
      null,
      key,
      "longevity"
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
    {
      key: "taurine",
      label: "Taurine",
      unit: "mg",
      code: "tau",
      group: "compounds",
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
    MICRO_ALL_FIELDS.forEach(function (field) {
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
      MICRO_ALL_FIELDS.forEach(function (field) {
        if (field.key in data.micros) {
          kw.micros[field.key] = storedMacroValue(data.micros[field.key]);
        }
      });
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
      "  - micros.vitaminK: kale, spinach, broccoli, natto, egg yolks (mcg)"
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
      "Rule: amounts for the micro requirements panel belong in micros. " +
      "When the same nutrient key also appears in longevity, store the number in micros only and set longevity[key] to true.\n\n" +
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
      var avgDaily = total / DAYS.length;
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
      var avgDaily = total / DAYS.length;
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
      entry.tooLow.length ||
      entry.tooHigh.length ||
      entry.enough.length ||
      entry.dashboardTracking.length ||
      entry.foodSources.length ||
      entry.foodSourceGroups.length ||
      entry.male.length ||
      entry.female.length
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
    MICRO_ALL_FIELDS.forEach(function (field) {
      var raw = data[field.key];
      if (!raw || typeof raw !== "object") return;
      var entry = Object.assign(
        {
          tooLow: stringArray(raw.tooLow),
          tooHigh: stringArray(raw.tooHigh),
          enough: stringArray(raw.enough),
          dashboardTracking: stringArray(raw.dashboardTracking),
          foodSources: stringArray(raw.foodSources),
          foodSourceGroups: foodSourceGroupsArray(raw),
          male: stringArray(raw.male),
          female: stringArray(raw.female),
        },
        microConditionDefFields(raw)
      );
      if (microDefEntryHasContent(entry)) {
        out[field.key] = entry;
      }
    });
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
        if (done) done();
      })
      .catch(function () {
        microDefinitions = {};
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
    });
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
        if (done) done();
      })
      .catch(function () {
        longevityDefinitions = {};
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
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function microDefFoodSourcesHtml(sources, groups) {
    if (groups && groups.length) {
      return (
        '<section class="micro-def__sources">' +
        '<h4 class="micro-def__sources-heading">Food sources</h4>' +
        groups
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
          .join("") +
        "</section>"
      );
    }
    if (!sources.length) return "";
    return (
      '<section class="micro-def__sources">' +
      '<h4 class="micro-def__sources-heading">Food sources</h4>' +
      microDefFoodSourcesListHtml(sources) +
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
    var field = microFieldByKey(key);
    var def = microDefinitions[key];
    if (!def) {
      microDefBodyEl.innerHTML =
        '<p class="micro-def__empty">No description is available for ' +
        escapeHtml(field ? field.label : key) +
        " yet.</p>";
      return;
    }

    var html = microDefConditionSectionHtml(key, def);

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

    if (def.foodSourceGroups.length || def.foodSources.length) {
      html += microDefFoodSourcesHtml(def.foodSources, def.foodSourceGroups);
    }

    microDefBodyEl.innerHTML =
      html || '<p class="micro-def__empty">No description content yet.</p>';
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

    if (!limiting && def.tooHigh.length) {
      html +=
        '<section class="micro-def__section">' +
        '<h4 class="micro-def__heading">If intake is too high</h4>' +
        microDefParagraphsHtml(def.tooHigh) +
        "</section>";
    }

    if (def.foodSourceGroups.length || def.foodSources.length) {
      html += microDefFoodSourcesHtml(def.foodSources, def.foodSourceGroups);
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

  function setDefModalReturnSources(returnTo) {
    defModalReturnSources = returnTo || null;
    if (microDefModalBackBtn) {
      microDefModalBackBtn.hidden = !defModalReturnSources;
    }
    if (microDefModalFooterEl) {
      microDefModalFooterEl.classList.toggle(
        "modal__footer--split",
        !!defModalReturnSources
      );
    }
  }

  function setDefModalStackedForm(kind) {
    defModalStackedForm = kind || null;
    if (microDefModalEl) {
      microDefModalEl.classList.toggle("modal--stacked", !!kind);
    }
  }

  function defModalSourcesTarget() {
    if (activeMicroDefKey) {
      if (!microFieldByKey(activeMicroDefKey)) return null;
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
    if (microDefModalEl) microDefModalEl.hidden = true;
    setDefModalReturnSources(null);
    setDefModalStackedForm(null);
    if (microDefModalSourcesBtn) microDefModalSourcesBtn.hidden = true;
    updateBodyModalOpen();
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

  function nutrientSourcesListHtml(list, unit) {
    var total = 0;
    var html = '<ol class="micro-sources-modal__list">';
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
        (idx + 1) +
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
    var dayCount = DAYS.length;
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

  function glycemicLoadSourcesListHtml(list) {
    var total = 0;
    var html =
      '<p class="micro-sources-modal__gi-legend" role="note">' +
      '<span class="micro-sources-modal__gi-legend-item micro-sources-modal__gi-legend-item--low">Low GI ≤55</span>' +
      '<span class="micro-sources-modal__gi-legend-item micro-sources-modal__gi-legend-item--med">Med GI 56–69</span>' +
      '<span class="micro-sources-modal__gi-legend-item micro-sources-modal__gi-legend-item--high">High GI ≥70</span>' +
      "</p>" +
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
        (idx + 1) +
        "</span>" +
        '<span class="micro-sources-modal__name">' +
        escapeHtml(item.name) +
        "</span>" +
        calcHtml +
        "</li>";
    });
    html += "</ol>";
    var dailyAvg = total / DAYS.length;
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
          kind === "micro" ? kw.micros[nutrientKey] : resolveLongevityValue(kw, nutrientKey);
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

    if (activeLongevitySourcesKind === "glycemicLoad") {
      html += glycemicLoadSourcesListHtml(list);
    } else {
      html += nutrientSourcesListHtml(list, unit);
    }
    longevitySourcesBodyEl.innerHTML = html;
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
    setLongevitySourcesFullscreen(false);
    longevitySourcesModalEl.hidden = true;
    setSourcesModalStackedOnDef(false);
    updateBodyModalOpen();
    if (stackedOnDef && microDefModalEl && !microDefModalEl.hidden) {
      focusMicroDefModal();
    }
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

    html += nutrientSourcesListHtml(list, field.unit);
    microSourcesBodyEl.innerHTML = html;
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
    setMicroSourcesFullscreen(false);
    populateMicroSourcesScopeSelect(activeMicroSourcesScope);
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
      '<svg class="dashboard__micro-daily-intake-icon icon-day" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<rect x="5.5" y="4" width="5" height="8" rx="0.5"></rect>' +
      '<line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>' +
      "</svg></button>"
    );
  }

  function appendMicroDailyIntakeIconHtml(html, microKey) {
    if (!microRequiresDailyIntake(microKey)) return html;
    return html + microDailyIntakeIconHtml();
  }

  function positionMicroDailyIntakePopover(anchor) {
    if (!microDailyIntakePopoverEl || !anchor) return;
    var rect = anchor.getBoundingClientRect();
    microDailyIntakePopoverEl.style.left = Math.max(8, rect.left) + "px";
    microDailyIntakePopoverEl.style.top = rect.bottom + 6 + "px";
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
    if (microDailyIntakePopoverAnchor === btn && !microDailyIntakePopoverEl.hidden) {
      hideMicroDailyIntakePopover();
      return;
    }
    hideMicroDailyIntakePopover();
    microDailyIntakePopoverAnchor = btn;
    positionMicroDailyIntakePopover(btn);
    microDailyIntakePopoverEl.hidden = false;
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
    if (!targetRefPopoverEl || !anchor) return;
    var rect = anchor.getBoundingClientRect();
    targetRefPopoverEl.style.left = Math.max(8, rect.left) + "px";
    targetRefPopoverEl.style.top = rect.bottom + 6 + "px";
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
    positionTargetRefPopover(btn);
    targetRefPopoverEl.hidden = false;
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

  function fatsCholesterolTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "For most healthy adults, eggs in moderation are fine for your heart. Egg yolks are high in cholesterol, but dietary cholesterol affects blood levels less than saturated fat does… " +
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
      "<strong>Senomorphics vs senolytics:</strong> Essential vitamins and plant compounds work mainly as senomorphics—they quiet chronic age-related inflammation, neutralize free radicals, and shield DNA from oxidative damage that accelerates cellular aging. That is not the same as true senolytics, which target senescent “zombie” cells directly. For senolytic research compounds, supplements such as fisetin, quercetin, curcumin, and resveratrol are what trials study—food doses are supportive but rarely match supplement protocols." +
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

  function vascularSodiumPotassiumTipHtml() {
    return (
      '<aside class="dashboard__longevity-processed-note dashboard__longevity-processed-note--section" role="note">' +
      '<p class="dashboard__longevity-processed-note-text">' +
      "<strong>Lowering sodium, raising potassium:</strong> Potassium-rich foods (fruit, beans, greens, yogurt) can help offset sodium’s blood-pressure effects, but cutting sodium itself is still the main lever—under 2,300 mg/day, or 1,500 mg if you already have high blood pressure. Naturally occurring nitrates in food (especially beets, spinach, arugula, celery) convert to nitric oxide, which widens blood vessels, improves blood flow, and lowers blood pressure—systemically and in the brain… " +
      '<button type="button" class="dashboard__longevity-tip-link" data-longevity-def="sectionVascularBloodPressure" aria-haspopup="dialog">Read more</button>' +
      "</p>" +
      "</aside>"
    );
  }

  function vascularBloodPressureTipHtml() {
    return vascularSodiumPotassiumTipHtml();
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
    var field = microFieldByKey(key);
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
      (microGapsModalEl && !microGapsModalEl.hidden) ||
      (healthTimelineModalEl && !healthTimelineModalEl.hidden) ||
      (microDefModalEl && !microDefModalEl.hidden) ||
      (microSourcesModalEl && !microSourcesModalEl.hidden) ||
      (longevitySourcesModalEl && !longevitySourcesModalEl.hidden) ||
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
    MICRO_ALL_FIELDS.forEach(function (field) {
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

      MICRO_ALL_FIELDS.forEach(function (field) {
        var v = kw.micros[field.key];
        if (v === "" || v == null) return;
        totals[field.key] += hits * parseFloat(v);
      });
    });

    return totals;
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

      var v = kw.micros[microKey];
      if (v === "" || v == null) return;
      var perServing = parseFloat(v);
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
      dailyCarbG: carbG / DAYS.length,
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
    var pufaG = avg("polyunsaturatedFat");
    var vitEMg = avg("vitaminE");
    var pufaTarget = longevityDvStatus.pufaVitaminEAlphaTocopherolPerGram;
    var pufaVitaminERatio = pufaG > 0 ? vitEMg / pufaG : null;
    var pufaVitaminEProtection =
      pufaG > 0 && pufaTarget > 0 ? (vitEMg / (pufaG * pufaTarget)) * 100 : null;
    var giBuckets = giBucketsFromWeek();
    var sodiumMg = (weekMicro.sodium || 0) / DAYS.length;
    var potassiumMg = (weekMicro.potassium || 0) / DAYS.length;
    var ratioKNa = sodiumMg > 0 ? potassiumMg / sodiumMg : null;
    return {
      omega6To3: ratioO6O3,
      satToUnsat: ratioSatUnsat,
      potassiumToSodium: ratioKNa,
      epaPlusDha: avg("epa") + avg("dha"),
      transFatG: avg("transFat"),
      pufaG: pufaG,
      vitaminEMg: vitEMg,
      pufaVitaminERatio: pufaVitaminERatio,
      pufaVitaminEProtection: pufaVitaminEProtection,
      weekGl: weekGlycemicLoadTotal() / DAYS.length,
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
    return dailyMicroPct(key, weekTotal / DAYS.length);
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
  };

  var NO_STANDALONE_REF_MICRO_KEYS = {
    cysteine: true,
    glycine: true,
    proline: true,
  };

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
          text: "—",
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
        text: "—",
        kind: "none",
        kindLabel: "No ref",
        reqAmount: "",
        limiting: false,
        refKey: key,
      };
    }
    return { pct: null, text: "—", kind: "none", kindLabel: "", reqAmount: "", limiting: false, refKey: key };
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
            ? weekMicro[field.key] / DAYS.length
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
      return { pct: null, text: "—", kindLabel: "", reqAmount: "", reqText: "—", limiting: false, refKey: field.key };
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
        refreshLongevityNavTopicColors();
        done();
      })
      .catch(function () {
        microDvStatus = DEFAULT_MICRO_DV_STATUS;
        longevityDvStatus = DEFAULT_LONGEVITY_STATUS;
        longevityNavTopicColors = {};
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
      ? "Hide targets"
      : "Show targets";
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
    if (!dashboardMicroHintTextEl) return;
    var weightNote = getBodyWeightKg()
      ? " Nutrients without FDA % DV show IOM bw min (IOM 2005 amino acid EARs × your weight)."
      : " Set body weight in Settings for IOM bw min on nutrients without FDA % DV.";
    dashboardMicroHintTextEl.textContent = microViewDaily
      ? "Per-day intake vs FDA % DV or IOM bw min (Mon–Sun)." + weightNote
      : "Average daily intake vs FDA % DV or IOM bw min (Mon–Sun)." + weightNote;
  }

  function microBaseDisplayFields() {
    var fields = MICRO_FIELDS.map(function (field) {
      return { source: "micro", field: field };
    });
    if (microMoreExpanded) {
      MICRO_EXTENDED_FIELDS.forEach(function (field) {
        fields.push({ source: "micro", field: field });
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
    if (!microConditionFocus) {
      return microBaseDisplayFields();
    }
    if (MICRO_INTAKE_FILTER[microConditionFocus]) {
      var wantsDaily = microConditionFocus === "poorlyAbsorbed";
      return microBaseDisplayFields().filter(function (entry) {
        return microRequiresDailyIntake(entry.field.key) === wantsDaily;
      });
    }
    var meta = MICRO_CONDITION_FOCUS[microConditionFocus];
    if (!meta) {
      return microBaseDisplayFields();
    }
    var out = [];
    (meta.nutrients || []).forEach(function (key) {
      var field = microFieldByKey(key);
      if (field) out.push({ source: "micro", field: field });
    });
    (meta.longevityNutrients || []).forEach(function (key) {
      var field = longevityFieldByKey(key);
      if (field) out.push({ source: "longevity", field: field });
    });
    return out;
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
      ? fmtNum(perDay ? total : total / DAYS.length) +
          " " +
          field.unit +
          (perDay ? "" : "/day avg")
      : "—";
  }

  function microConditionSourcesIconHtml(entry, dayId) {
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

  function microConditionRowHtml(entry, weekMicro, weekLongevity) {
    var field = entry.field;
    var isLongevity = entry.source === "longevity";
    var total = isLongevity
      ? weekLongevity[field.key] || 0
      : weekMicro[field.key] || 0;
    var dailyAmount = total / DAYS.length;
    var targetDisplay = microRowTargetDisplay(
      field,
      dailyAmount,
      entry.source,
      weekMicro
    );
    var pct = targetDisplay.pct;
    var amtText = microConditionAmtText(entry, total, false);
    var tier = tierForMicroTargetPct(pct, !!targetDisplay.limiting);
    var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
    var rowCls =
      "dashboard__micro-row dashboard__micro-row--clickable" +
      (showMicroDailyDv ? " dashboard__micro-row--show-dv" : "") +
      (isLongevity ? " dashboard__micro-row--longevity" : "");
    var defAttr = isLongevity ? "data-longevity-def" : "data-micro-def";

    var html =
      '<div class="' +
      rowCls +
      '"' +
      tierAttr +
      ' role="listitem">' +
      '<span class="dashboard__micro-name-wrap">' +
      '<button type="button" class="dashboard__micro-name" ' +
      defAttr +
      '="' +
      escapeAttr(field.key) +
      '" aria-haspopup="dialog">' +
      escapeHtml(field.label) +
      "</button>" +
      microConditionSourcesIconHtml(entry) +
      "</span>" +
      microTargetStatsHtml(targetDisplay, amtText);
    html += "</div>";
    return html;
  }

  function setMicroConditionExpanded(open) {
    microConditionExpanded = !!open;
    if (dashboardMicroConditionToggleEl) {
      dashboardMicroConditionToggleEl.setAttribute(
        "aria-expanded",
        microConditionExpanded ? "true" : "false"
      );
    }
    if (dashboardMicroConditionListEl) {
      dashboardMicroConditionListEl.hidden = !microConditionExpanded;
    }
  }

  function syncMicroConditionUi() {
    var active = !!microConditionFocus;
    if (dashboardMicroConditionToggleEl) {
      dashboardMicroConditionToggleEl.classList.toggle(
        "dashboard__micro-condition-toggle--active",
        active
      );
    }
    if (dashboardMicroConditionLabelEl) {
      var filterMeta = microFilterMeta(microConditionFocus);
      dashboardMicroConditionLabelEl.textContent = active
        ? "Filter: " + filterMeta.label
        : "Filter";
    }
    if (dashboardMicroConditionClearEl) {
      dashboardMicroConditionClearEl.hidden = !active;
    }
    if (dashboardMicroConditionClearItemEl) {
      dashboardMicroConditionClearItemEl.hidden = !active;
    }
    if (dashboardMicroConditionListEl) {
      dashboardMicroConditionListEl
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
    if (microTipCaffeineEl) {
      microTipCaffeineEl.hidden = active;
    }
    if (microTipCataractsEl) {
      microTipCataractsEl.hidden = microConditionFocus !== "cataractsPrevention";
    }
  }

  function setMicroConditionFocus(id) {
    microConditionFocus = id && microFilterMeta(id) ? id : null;
    setMicroConditionExpanded(false);
    syncMicroConditionUi();
    if (microRequirementsOpen) {
      renderMicroRequirements();
    }
  }

  function microDayCardHtml(dayLabel, dayId, microTotals, longevityTotals) {
    var rows = "";
    microConditionDisplayFields().forEach(function (entry) {
      var field = entry.field;
      var isLongevity = entry.source === "longevity";
      var total = isLongevity
        ? longevityTotals[field.key] || 0
        : microTotals[field.key] || 0;
      var targetDisplay = microRowTargetDisplay(
        field,
        total,
        entry.source,
        microTotals
      );
      var pct = targetDisplay.pct;
      var amtText = microConditionAmtText(entry, total, true);
      var tier = tierForMicroTargetPct(pct, !!targetDisplay.limiting);
      var tierAttr = tier ? ' data-dv-tier="' + escapeAttr(tier.id) + '"' : "";
      var rowCls =
        "dashboard__micro-day-row dashboard__micro-day-row--clickable" +
        (isLongevity ? " dashboard__micro-day-row--longevity" : "");
      var defAttr = isLongevity ? "data-longevity-def" : "data-micro-def";

      rows +=
        '<div class="' +
        rowCls +
        '"' +
        tierAttr +
        ">" +
        '<span class="dashboard__micro-day-name-wrap">' +
        '<button type="button" class="dashboard__micro-day-name" ' +
        defAttr +
        '="' +
        escapeAttr(field.key) +
        '" aria-haspopup="dialog">' +
        escapeHtml(field.label) +
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
        longevityTotalsFromText(text)
      );
    });
    dashboardMicroDailyGridEl.innerHTML = html;
  }

  function renderMicroRequirements() {
    if (!dashboardMicroListEl) return;

    hideMicroDailyIntakePopover();
    hideTargetRefPopover();
    syncMicroDailyDvToggleUi();
    syncMicroViewToggleUi();
    syncMicroHintText();
    syncMicroConditionUi();

    if (dashboardMicroListEl) {
      dashboardMicroListEl.hidden = microViewDaily;
    }
    if (dashboardMicroMoreWrapEl) {
      dashboardMicroMoreWrapEl.hidden = microViewDaily;
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
    kindRefKey
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
    var pctBlock =
      '<span class="dashboard__longevity-pct-wrap">' +
      '<span class="dashboard__longevity-pct"' +
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
      longevityBarHtml(pct, !!limiting) +
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
      target.refKey
    );
  }

  function longevityRowFromMicroKey(microKey, label, limiting, weekMicro) {
    var field = microFieldByKey(microKey);
    var unit = field ? field.unit : "";
    var total = weekMicro[microKey] || 0;
    var daily = total / DAYS.length;
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
      target.refKey
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
    var dayCount = DAYS.length;
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
      "Fiber & colon health",
      "sectionFiber",
      '<p class="dashboard__longevity-note">Same fiber value as your micro entries—grouped here for colon health and disease prevention.</p>' +
        fiberColonTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("From your micro entries", "micro") +
        longevityRowFromMicroKey("fiber", "Fiber", false, weekMicro) +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Thyroid health",
      "sectionThyroid",
      '<p class="dashboard__longevity-note">Same iodine and cofactor values as your micro entries—grouped here because thyroid needs tighten with age, especially after 60.</p>' +
        thyroidHealthTipHtml(),
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
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Bone density",
      "sectionBoneDensity",
      '<p class="dashboard__longevity-note">Same calcium, magnesium, and vitamin D values as your micro entries—grouped here for fracture and osteoporosis prevention.</p>',
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
      '<p class="dashboard__longevity-note">B vitamins build <button type="button" class="dashboard__longevity-tip-link" data-longevity-def="nad" aria-haspopup="dialog">NAD</button> and related cofactors (FAD, coenzyme A); magnesium and iron support ATP production; manganese supports mitochondrial antioxidant defense via manganese superoxide dismutase (MnSOD); CoQ10 (is also a nutrient) carries electrons in mitochondria. These repeat values from your micro and longevity entries so you can spot gaps in cellular fuel—not just general % DV.</p>',
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
          return longevityRowFromLongevityField(field, weekLongevity, weekMicro);
        }).join("") +
        longevityListClose()
    );

    html += longevitySectionWrap(
      "Cellular aging & senomorphics",
      "sectionCellularAging",
      '<p class="dashboard__longevity-note">Vitamin D downregulates chronic age-related inflammation; vitamin C and E neutralize free radicals that damage DNA. Essential vitamins act like a shield against oxidative stress—the senomorphic side of longevity. See the note below on food vs supplement senolytics.</p>' +
        senomorphicsTipHtml(),
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
      '<p class="dashboard__longevity-note">Aim for magnesium, fiber, vitamin D, omega-3s, and monounsaturated fat; watch saturated fat, refined carbs, and added sugar. When calorie-dense sources of those fats and fast carbs dominate, that pattern can support fat gain and insulin resistance over time—not from any single meal, but from years of excess.</p>',
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
      "Fat gain",
      "sectionFatGain",
      '<p class="dashboard__longevity-note">Age-related fat gain is driven by muscle loss, slower metabolism, gradual loss of insulin sensitivity (cells need more insulin over time), poor sleep, and chronic cortisol—not just calories. These nutrients support the pathways that help you burn fuel and stay leaner over decades; jump links below cover related areas outside this list.</p>',
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
      var noteHtml = group.id === "fats" ? fatsCholesterolTipHtml() : "";
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
      '<p class="dashboard__longevity-note">Phosphorus also appears under compounds above. Excess absorbable phosphate from cola and processed foods can pull calcium into arteries even when calcium and vitamin D intake looks fine.</p>' +
        calcificationPhosphorusTipHtml(),
      longevityListOpen() +
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
            false,
            null,
            item.key,
            "longevity"
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
        vascularBloodPressureTipHtml(),
      longevityListOpen() +
        longevitySubgroupHtml("Watch — lower % DV is better", "limit") +
        longevityRowFromMicroKey("sodium", "Sodium (main one to control)", true, weekMicro) +
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
        "dashboard__toggle--open",
        longevityPanelOpen
      );
    }
    if (dashboardLongevityPanelEl) {
      dashboardLongevityPanelEl.hidden = !longevityPanelOpen;
    }
    if (longevityPanelOpen) {
      renderLongevityPanel();
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
    try {
      if (userTdee == null || userTdee <= 0) {
        localStorage.removeItem(STORAGE_KEY_TDEE);
      } else {
        localStorage.setItem(STORAGE_KEY_TDEE, String(userTdee));
      }
    } catch (e) {
      /* ignore */
    }
  }

  function loadTdee() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_TDEE);
      if (raw == null || raw === "") {
        userTdee = null;
        return;
      }
      var n = parseFloat(raw);
      userTdee = !isNaN(n) && n > 0 ? n : null;
    } catch (e) {
      userTdee = null;
    }
  }

  function getTdee() {
    return userTdee != null && userTdee > 0 ? userTdee : null;
  }

  function saveBodyWeight() {
    try {
      if (userBodyWeightKg == null || userBodyWeightKg <= 0) {
        localStorage.removeItem(STORAGE_KEY_BODY_WEIGHT_KG);
      } else {
        localStorage.setItem(STORAGE_KEY_BODY_WEIGHT_KG, String(userBodyWeightKg));
      }
    } catch (e) {
      /* ignore */
    }
  }

  function loadBodyWeight() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_BODY_WEIGHT_KG);
      if (raw == null || raw === "") {
        userBodyWeightKg = null;
        return;
      }
      var n = parseFloat(raw);
      userBodyWeightKg = !isNaN(n) && n > 0 ? n : null;
    } catch (e) {
      userBodyWeightKg = null;
    }
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

  function openSettingsModal() {
    if (!settingsModalEl) return;
    syncSettingsTdeeInput();
    setSettingsWeightUnit(settingsWeightUnit);
    syncSettingsWeightInput();
    settingsModalEl.hidden = false;
    updateBodyModalOpen();
    if (settingsTdeeEl) {
      settingsTdeeEl.focus();
    }
  }

  function closeSettingsModal() {
    if (!settingsModalEl) return;
    readSettingsTdeeFromInput();
    readSettingsWeightFromInput();
    settingsModalEl.hidden = true;
    updateBodyModalOpen();
    if (weekTotalOpen && lastWeekTotals) {
      renderWeekSummary(lastWeekTotals);
    }
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
    if (settingsDemographicIconEl) {
      settingsDemographicIconEl.textContent = meta.icon;
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
    if (isPct) {
      return (
        '<svg class="dashboard__card-toggle-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
        '<rect x="2" y="3" width="12" height="2" rx="0.4"></rect>' +
        '<rect x="2" y="7" width="8" height="2" rx="0.4"></rect>' +
        '<rect x="2" y="11" width="10" height="2" rx="0.4"></rect>' +
        "</svg>"
      );
    }
    return (
      '<svg class="dashboard__card-toggle-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"></circle>' +
      '<path d="M8 8 L8 2 A6 6 0 0 1 13.2 10 Z" fill="currentColor" opacity="0.35"></path>' +
      '<path d="M8 8 L13.2 10 A6 6 0 0 1 8 14 Z" fill="currentColor" opacity="0.6"></path>' +
      "</svg>"
    );
  }

  function dashboardCardHtml(label, totals, dayId) {
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
      '<article class="dashboard__card">' +
      '<div class="dashboard__card-head">' +
      '<span class="dashboard__label">' +
      escapeHtml(label) +
      "</span>" +
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
      rowsHtml +
      '<div class="dashboard__row dashboard__row--total"><span class="dashboard__macro">Total</span><span class="dashboard__val">' +
      fmtNum(totals.totalCal) +
      " cal</span></div>" +
      "</article>"
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
      html += dashboardCardHtml(day.label, totals, day.id);
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

    if (!dayHighlightsEnabled) {
      backdrop.textContent = textarea.value;
      syncScroll(textarea, backdrop);
      return;
    }

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
        input.value = microInputValue(kw.micros[field.key]);
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

  function loadKeywordCaloriesOpen() {
    try {
      keywordCaloriesOpen =
        localStorage.getItem(STORAGE_KEY_CALORIES) === "true";
    } catch (e) {
      keywordCaloriesOpen = false;
    }
  }

  function saveKeywordCaloriesOpen() {
    try {
      localStorage.setItem(
        STORAGE_KEY_CALORIES,
        keywordCaloriesOpen ? "true" : "false"
      );
    } catch (e) {
      /* ignore */
    }
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
    });

    if (keywordsEmptyEl) {
      keywordsEmptyEl.hidden = keywords.length > 0;
    }

    updateKeywordReorderUi();
    updateKeywordCaloriesUi();
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

  function saveDayHighlightsPreference() {
    try {
      localStorage.setItem(
        STORAGE_KEY_DAY_HIGHLIGHTS,
        dayHighlightsEnabled ? "on" : "off"
      );
    } catch (e) {
      /* ignore */
    }
  }

  function loadDayHighlightsPreference() {
    try {
      dayHighlightsEnabled =
        localStorage.getItem(STORAGE_KEY_DAY_HIGHLIGHTS) !== "off";
    } catch (e) {
      dayHighlightsEnabled = true;
    }
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
      if (el) updateDayHighlights(el);
    });
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
    try {
      localStorage.setItem(STORAGE_KEY_DAY_EDITOR_HEIGHT, String(px));
    } catch (e) {
      /* ignore */
    }
  }

  function loadDayEditorHeight() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_DAY_EDITOR_HEIGHT);
      if (!raw) return;
      var height = parseInt(raw, 10);
      if (height > 0) applyDayEditorHeight(height);
    } catch (e) {
      /* ignore */
    }
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
      '<button type="button" class="day__suggest-dismiss" data-action="dismiss-suggest" aria-label="Dismiss suggestions for this line">Dismiss</button>' +
      '<div class="day__suggest-list" role="presentation">' +
      matches.map(daySuggestItemHtml).join("") +
      "</div>"
    );
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
    var key = String(text).trim().toLowerCase();
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
      '<span class="day__suggest-item-label">' +
      (before ? '<span class="day__suggest-rest">' + before + "</span>" : "") +
      '<span class="day__suggest-match">' +
      matched +
      "</span>" +
      (after ? '<span class="day__suggest-rest">' + after + "</span>" : "") +
      "</span></button>"
    );
  }

  var DAY_SUGGEST_LABEL_INSET = 1;

  function daySuggestItemLabelWidth(btn) {
    var style = getComputedStyle(btn);
    return (
      btn.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight) -
      DAY_SUGGEST_LABEL_INSET * 2
    );
  }

  function daySuggestItemLabelOverflow(btn) {
    var label = btn.querySelector(".day__suggest-item-label");
    if (!label) return 0;
    var labelStyle = getComputedStyle(label);
    var labelRect = label.getBoundingClientRect();
    var contentRight = labelRect.right - parseFloat(labelStyle.paddingRight) - 1;
    var contentLeft = labelRect.left + parseFloat(labelStyle.paddingLeft) + 1;
    var walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
    var firstText = null;
    var lastText = null;
    while (walker.nextNode()) {
      if (!walker.currentNode.nodeValue) continue;
      if (!firstText) firstText = walker.currentNode;
      lastText = walker.currentNode;
    }
    if (!lastText || !lastText.length) return 0;
    var startRange = document.createRange();
    startRange.setStart(firstText, 0);
    startRange.setEnd(firstText, 1);
    var endRange = document.createRange();
    endRange.setStart(lastText, lastText.length - 1);
    endRange.setEnd(lastText, lastText.length);
    var startRect = startRange.getBoundingClientRect();
    var endRect = endRange.getBoundingClientRect();
    return Math.max(
      endRect.right - contentRight,
      contentLeft - startRect.left,
      0
    );
  }

  function fitDaySuggestItemLabel(btn) {
    var label = btn.querySelector(".day__suggest-item-label");
    if (!label) return;
    resetDaySuggestItemLabel(btn);
    btn.style.minWidth = btn.offsetWidth + "px";
    var maxWidth = daySuggestItemLabelWidth(btn);
    if (label.scrollWidth <= maxWidth) {
      btn.style.minWidth = "";
      return;
    }
    btn.classList.add("day__suggest-item--fitted");
    maxWidth = daySuggestItemLabelWidth(btn);
    var baseSize = parseFloat(getComputedStyle(label).fontSize);
    var absoluteMin = baseSize * 0.45;
    var size = Math.max(absoluteMin, baseSize * (maxWidth / label.scrollWidth));
    label.style.transition = "none";
    label.style.fontSize = size + "px";
    while (daySuggestItemLabelOverflow(btn) > 0 && size > absoluteMin + 0.25) {
      size -= 0.25;
      label.style.fontSize = size + "px";
    }
    label.style.transition = "";
  }

  function resetDaySuggestItemLabel(btn) {
    var label = btn.querySelector(".day__suggest-item-label");
    if (!label) return;
    label.style.fontSize = "";
    label.style.transition = "";
    btn.style.minWidth = "";
    btn.classList.remove("day__suggest-item--fitted");
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
    fitDaySuggestItemLabel(btn);
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
  }

  function hideAllDaySuggests() {
    document.querySelectorAll(".day__suggest").forEach(function (el) {
      el.hidden = true;
      el.innerHTML = "";
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
  }

  function ensureDaySuggestEl(editor) {
    var el = editor.querySelector(".day__suggest");
    if (el) {
      bindDaySuggestHover(el);
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
      var btn = e.target.closest("[data-food-name]");
      if (!btn) return;
      applyDayFoodSuggest(textarea, btn.getAttribute("data-food-name"));
    });
    bindDaySuggestHover(el);
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

  function updateDaySuggest(textarea) {
    if (!textarea || !textarea.classList.contains("day__input")) return;
    var editor = textarea.closest(".day__editor");
    if (!editor) return;

    var info = getCurrentLineInfo(textarea);
    var query = info.text;

    syncDaySuggestDismissedLine(textarea);

    if (!query.trim() || lineMatchesFoodDefinition(info.fullLine)) {
      if (!query.trim()) clearDaySuggestDismissed(textarea);
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
  }

  function applyDayNoteChange(textarea) {
    updateDayHighlights(textarea);
    renderDashboard();
    saveDayNotes();
    updateDayClearButtons();
    updateDayFoodNotesUi();
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
      updateDaySuggest(textarea);
    });
    textarea.addEventListener("keyup", function () {
      updateDaySuggest(textarea);
    });
    textarea.addEventListener("click", function () {
      updateDaySuggest(textarea);
    });
    textarea.addEventListener("blur", function () {
      hideDaySuggest(textarea);
    });
    textarea.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var editor = textarea.closest(".day__editor");
      var suggestEl = editor && editor.querySelector(".day__suggest");
      if (!suggestEl || suggestEl.hidden) return;
      e.preventDefault();
      dismissDaySuggest(textarea);
    });
    textarea.addEventListener("scroll", function () {
      syncScroll(textarea, backdrop);
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
    if (importAllMealsModalEl && !importAllMealsModalEl.hidden) {
      closeImportAllMealsModal();
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

  if (dashboardMicroConditionToggleEl) {
    dashboardMicroConditionToggleEl.addEventListener("click", function () {
      setMicroConditionExpanded(!microConditionExpanded);
    });
  }

  if (dashboardMicroConditionClearEl) {
    dashboardMicroConditionClearEl.addEventListener("click", function () {
      setMicroConditionFocus(null);
    });
  }

  if (dashboardMicroConditionListEl) {
    dashboardMicroConditionListEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".dashboard__micro-condition-link");
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute("data-micro-condition");
      if (!id) {
        setMicroConditionFocus(null);
        return;
      }
      setMicroConditionFocus(id === microConditionFocus ? null : id);
    });
  }

  document.addEventListener("click", function (e) {
    if (!microConditionExpanded) return;
    if (
      dashboardMicroConditionToggleEl &&
      (dashboardMicroConditionToggleEl === e.target ||
        dashboardMicroConditionToggleEl.contains(e.target))
    ) {
      return;
    }
    if (
      dashboardMicroConditionClearEl &&
      (dashboardMicroConditionClearEl === e.target ||
        dashboardMicroConditionClearEl.contains(e.target))
    ) {
      return;
    }
    if (
      dashboardMicroConditionListEl &&
      (dashboardMicroConditionListEl === e.target ||
        dashboardMicroConditionListEl.contains(e.target))
    ) {
      return;
    }
    setMicroConditionExpanded(false);
  });

  if (dashboardLongevityToggleEl) {
    dashboardLongevityToggleEl.addEventListener("click", function () {
      setLongevityPanelOpen(!longevityPanelOpen);
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
      microMoreToggleEl.setAttribute("aria-expanded", microMoreExpanded ? "true" : "false");
      microMoreToggleEl.textContent = microMoreExpanded
        ? "Less"
        : "More vitamins, minerals & amino acids";
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
      }
    });
  }

  if (dashboardLongevityPanelEl) {
    dashboardLongevityPanelEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="dismiss-panel-disclaimer"]')) {
        dismissPanelDisclaimer();
      }
    });
  }

  if (dashboardLongevityContentEl) {
    dashboardLongevityContentEl.addEventListener("click", function (e) {
      if (handleMicroDailyIntakeClick(e)) return;
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

  if (microSourcesModalDoneBtn) {
    microSourcesModalDoneBtn.addEventListener("click", closeMicroSourcesModal);
  }

  if (microSourcesScopeEl) {
    microSourcesScopeEl.addEventListener("change", function () {
      activeMicroSourcesScope = microSourcesScopeEl.value || "week";
      renderMicroSourcesBody();
    });
  }

  if (microSourcesModalEl) {
    microSourcesModalEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-action="close-micro-sources-modal"]')) {
        closeMicroSourcesModal();
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
    settingsWeightEl.addEventListener("change", readSettingsWeightFromInput);
  }

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
      var btn = e.target.closest('[data-action="toggle-dashboard-macro-view"]');
      if (!btn) return;
      dashboardMacroPctView = !dashboardMacroPctView;
      renderDashboard();
    });
  }

  if (dayHighlightsToggleBtn) {
    dayHighlightsToggleBtn.addEventListener("click", function () {
      setDayHighlightsEnabled(!dayHighlightsEnabled);
    });
  }

  if (dayFoodNotesEl) {
    initDayFoodNotesEvents();
  }

  document.addEventListener("click", function (e) {
    if (!microDailyIntakePopoverAnchor) return;
    if (e.target.closest("[data-micro-daily-intake]")) return;
    hideMicroDailyIntakePopover();
  });

  window.addEventListener(
    "scroll",
    function () {
      hideMicroDailyIntakePopover();
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
    loadFoodDefinitions();
    loadKeywordReorderOpen();
    loadKeywordCaloriesOpen();
    loadDayNotes();
    loadDayHighlightsPreference();
    loadDayEditorHeight();
    loadDemographic();
    loadTdee();
    loadBodyWeight();
    renderDemographicUi();
    syncDayHighlightsToggleUi();
    syncSettingsTdeeInput();
    setSettingsWeightUnit(settingsWeightUnit);
    renderKeywords();
    initLongevityNav();
    initTargetRefPopoverEvents();
    refreshAll();
    applyInitialLongevityHash();
    maybeShowStarterGuideImportStep();
  }

  loadAppConfig(function () {
    var pending = 3;
    function definitionsReady() {
      pending -= 1;
      if (pending === 0) boot();
    }
    loadMicroDefinitions(definitionsReady);
    loadLongevityDefinitions(definitionsReady);
    loadFoodNotesDefinitions(definitionsReady);
  });
})();
