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
      chromium: 35,
      iodine: 150,
      vitaminA: 900,
      vitaminD: 15,
      vitaminB12: 2.4,
      thiamin: 1.2,
      riboflavin: 1.3,
      niacin: 16,
      pantothenicAcid: 5,
      vitaminB6: 1.3,
      vitaminC: 90,
      folate: 400,
      biotin: 30,
    },
    female: {
      fiber: 25,
      sodium: 2300,
      potassium: 2600,
      calcium: 1000,
      iron: 18,
      magnesium: 320,
      zinc: 8,
      chromium: 25,
      iodine: 150,
      vitaminA: 700,
      vitaminD: 15,
      vitaminB12: 2.4,
      thiamin: 1.1,
      riboflavin: 1.1,
      niacin: 14,
      pantothenicAcid: 5,
      vitaminB6: 1.3,
      vitaminC: 75,
      folate: 400,
      biotin: 30,
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

  global.NutrientsDemographicDv = {
    DEFAULT_DEMOGRAPHIC: DEFAULT_DEMOGRAPHIC,
    META: META,
    CALORIE_BASELINE: CALORIE_BASELINE,
    DAILY_MICRO_DV: DAILY_MICRO_DV,
    normalizeDemographic: normalizeDemographic,
    getDailyMicroDv: getDailyMicroDv,
  };
})(typeof window !== "undefined" ? window : this);
