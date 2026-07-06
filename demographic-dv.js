/**
 * Gender-specific daily reference values for % DV on the dashboard micro panel.
 * Loaded before app.js; exposed as window.NutrientsDemographicDv.
 *
 * Labels on packaging are often a single “genderless” % DV; this app divides
 * average daily intake by the profile you pick (male / female) so percentages
 * reflect typical needs, not one blended label.
 * 
 * 
 * Iron: Women need significantly more iron (typically 18 mg) than men (8 mg) due to menstruation.
 * Vitamins & Fiber: Men generally require higher daily intakes of certain vitamins (like Vitamin C and zinc) and fiber simply due to higher average body mass and calorie needs.
 * Calories: The average calorie baseline for men (around 2,400–2,600) is higher than for women (around 1,800–2,000)
 * 
 * 
 */
(function (global) {
  var DEFAULT_DEMOGRAPHIC = "male";

  var META = {
    male: { icon: "♂", label: "Male" },
    female: { icon: "♀", label: "Female" },
  };

  /** Typical maintenance calories (informative; macros use food definitions). */
  var CALORIE_BASELINE = {
    male: 2500,
    female: 1900,
  };

  /**
   * Daily targets per micro key (aligned with MICRO_FIELDS keys in app.js).
   * Sources: FDA Daily Values where fixed; NIH/IOM RDAs where they differ by sex.
   */
  var DAILY_MICRO_DV = {
    male: {
      fiber: 38,
      sodium: 2300,
      potassium: 3400,
      calcium: 1000,
      iron: 8,
      magnesium: 420,
      zinc: 11,
      selenium: 55,
      copper: 900,
      manganese: 2.3,
      chromium: 35,
      iodine: 150,
      vitaminA: 900,
      vitaminD: 15,
      vitaminE: 15,
      vitaminK: 120,
      vitaminB12: 2.4,
      thiamin: 1.2,
      riboflavin: 1.3,
      niacin: 16,
      pantothenicAcid: 5,
      vitaminB6: 1.3,
      vitaminC: 90,
      folate: 400,
      biotin: 30,
      phosphorus: 700,
      choline: 550,
      molybdenum: 45,
      chloride: 2300,
    },
    female: {
      fiber: 25,
      sodium: 2300,
      potassium: 2600,
      calcium: 1000,
      iron: 18,
      magnesium: 320,
      zinc: 8,
      selenium: 55,
      copper: 900,
      manganese: 1.8,
      chromium: 25,
      iodine: 150,
      vitaminA: 700,
      vitaminD: 15,
      vitaminE: 15,
      vitaminK: 90,
      vitaminB12: 2.4,
      thiamin: 1.1,
      riboflavin: 1.1,
      niacin: 14,
      pantothenicAcid: 5,
      vitaminB6: 1.3,
      vitaminC: 75,
      folate: 400,
      biotin: 30,
      phosphorus: 700,
      choline: 425,
      molybdenum: 45,
      chloride: 2300,
    },
  };

  function normalizeDemographic(id) {
    return id === "female" ? "female" : "male";
  }

  /**
   * Denominator for % DV: (avg daily micro amount / this value) × 100.
   * @param {string} demographic - "male" | "female"
   * @param {string} microKey - e.g. "iron", "vitaminC"
   * @returns {number} daily target in the micro's unit, or 0 if unknown
   */
  function getDailyMicroDv(demographic, microKey) {
    var profile = DAILY_MICRO_DV[normalizeDemographic(demographic)];
    if (!profile) return 0;
    var dv = profile[microKey];
    return typeof dv === "number" && dv > 0 ? dv : 0;
  }

  /**
   * Micro/longevity keys where weekly ÷7 averaging can hide day-to-day gaps:
   * water-soluble vitamins (not B12), steady electrolytes/minerals, fiber,
   * choline, essential amino acids, and ALA. See DAILY_INTAKE_MICRO_KEYS.
   */
  var DAILY_INTAKE_MICRO_KEYS = [
    "solubleFiber",
    "insolubleFiber",
    "sodium",
    "potassium",
    "chloride",
    "magnesium",
    "zinc",
    "choline",
    "vitaminC",
    "thiamin",
    "riboflavin",
    "niacin",
    "pantothenicAcid",
    "vitaminB6",
    "biotin",
    "folate",
    "histidine",
    "isoleucine",
    "leucine",
    "lysine",
    "methionine",
    "phenylalanine",
    "threonine",
    "tryptophan",
    "valine",
    "ala",
  ];

  function requiresDailyIntake(microKey) {
    return DAILY_INTAKE_MICRO_KEYS.indexOf(microKey) !== -1;
  }

  /**
   * IOM (2005) estimated average requirement for indispensable amino acids,
   * mg/kg body weight/day (adults 19+). The IOM was reorganized as the Health
   * and Medicine Division (HMD) of the National Academies in 2015.
   * Sulfur (Met+Cys) and aromatic (Phe+Tyr) pairs are split for per-nutrient tracking.
   */
  var IOM_BW_MIN_MG_PER_KG = {
    histidine: 14,
    isoleucine: 20,
    leucine: 39,
    lysine: 30,
    methionine: 10.4,
    phenylalanine: 14,
    threonine: 15,
    tryptophan: 5,
    tyrosine: 19,
    valine: 24,
  };

  function getIomBwMinMgPerKg(microKey) {
    var mgPerKg = IOM_BW_MIN_MG_PER_KG[microKey];
    return typeof mgPerKg === "number" && mgPerKg > 0 ? mgPerKg : 0;
  }

  function hasIomBwMin(microKey) {
    return getIomBwMinMgPerKg(microKey) > 0;
  }

  /** Daily IOM body-weight minimum in the micro nutrient's unit (mg). */
  function getIomBwMinDaily(microKey, weightKg) {
    var mgPerKg = getIomBwMinMgPerKg(microKey);
    if (!mgPerKg || typeof weightKg !== "number" || weightKg <= 0) return 0;
    return mgPerKg * weightKg;
  }

  global.NutrientsDemographicDv = {
    DEFAULT_DEMOGRAPHIC: DEFAULT_DEMOGRAPHIC,
    META: META,
    CALORIE_BASELINE: CALORIE_BASELINE,
    DAILY_MICRO_DV: DAILY_MICRO_DV,
    DAILY_INTAKE_MICRO_KEYS: DAILY_INTAKE_MICRO_KEYS,
    IOM_BW_MIN_MG_PER_KG: IOM_BW_MIN_MG_PER_KG,
    normalizeDemographic: normalizeDemographic,
    getDailyMicroDv: getDailyMicroDv,
    requiresDailyIntake: requiresDailyIntake,
    getIomBwMinMgPerKg: getIomBwMinMgPerKg,
    hasIomBwMin: hasIomBwMin,
    getIomBwMinDaily: getIomBwMinDaily,
  };
})(typeof window !== "undefined" ? window : this);
