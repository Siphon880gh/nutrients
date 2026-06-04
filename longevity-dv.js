/**
 * Daily reference values for the longevity dashboard panel (% DV denominators).
 * Loaded before app.js; exposed as window.NutrientsLongevityDv.
 */
(function (global) {
  /** Keys aligned with LONGEVITY_FIELDS in app.js (stored nutrients only). */
  var DAILY_LONGEVITY_DV = {
    saturatedFat: 20,
    monounsaturatedFat: 0,
    polyunsaturatedFat: 0,
    transFat: 0,
    cholesterol: 300,
    omega3: 1.6,
    omega6: 17,
    omega9: 0,
    ala: 1.6,
    epa: 0,
    dha: 0,
    linoleicAcid: 14,
    arachidonicAcid: 0,
    oleicAcid: 0,
    palmitoleicAcid: 0,
    vitaminE: 15,
    vitaminK: 120,
    vitaminK1: 120,
    vitaminK2: 120,
    selenium: 55,
    polyphenols: 0,
    flavonoids: 0,
    carotenoids: 0,
    curcumin: 0,
    resveratrol: 0,
    coq10: 0,
    sulforaphane: 0,
    phosphorus: 700,
    glycemicIndex: 0,
    addedSugar: 50,
    refinedCarbs: 0,
    netCarbs: 0,
  };

  /** Micro keys shown in longevity panel but stored under food.micros */
  var FROM_MICRO_KEYS = ["calcium", "magnesium", "vitaminD"];

  function getDailyLongevityDv(key) {
    var dv = DAILY_LONGEVITY_DV[key];
    return typeof dv === "number" && dv > 0 ? dv : 0;
  }

  function hasDailyDv(key) {
    return getDailyLongevityDv(key) > 0;
  }

  global.NutrientsLongevityDv = {
    DAILY_LONGEVITY_DV: DAILY_LONGEVITY_DV,
    FROM_MICRO_KEYS: FROM_MICRO_KEYS,
    getDailyLongevityDv: getDailyLongevityDv,
    hasDailyDv: hasDailyDv,
  };
})(typeof window !== "undefined" ? window : this);
