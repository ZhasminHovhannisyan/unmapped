import type { CountryConfig } from "../types";

const ghana: CountryConfig = {
  id: "ghana",
  name: "Ghana",
  region: "Sub-Saharan Africa",
  language: "English",
  currency: "GHS",
  currencySymbol: "₵",
  uiLocale: "en",
  rtl: false,

  // World Bank HCI 2020; WDI youth pop; ILO ILOSTAT informality; ITU 2023
  humanCapitalIndex: 0.45,
  population15to24M: 6.8,
  neetRate: 27.4,                  // WDI SL.UEM.NEET.ZS, Ghana 2022
  informalEconomyShare: 0.85,      // ILO ILOSTAT 2022
  mobileInternetPenetration: 41.0, // ITU 2023
  wageFloorUSD: 130,               // Monthly NMW equivalent ~GHS 1,126 / month (2023)

  educationTaxonomy: [
    { id: "jhs", localLabel: "JHS / BECE (Basic Education Certificate)", isced: "lower_secondary", yearsOfSchooling: 9 },
    { id: "shs", localLabel: "SHS / WASSCE / SSSCE", isced: "upper_secondary", yearsOfSchooling: 12 },
    { id: "tvet", localLabel: "TVET / Apprenticeship Certificate", isced: "post_secondary_non_tertiary", yearsOfSchooling: 13 },
    { id: "hn_diploma", localLabel: "HND / Diploma", isced: "short_cycle_tertiary", yearsOfSchooling: 14 },
    { id: "degree", localLabel: "University Degree (Bachelor's)", isced: "bachelor", yearsOfSchooling: 16 },
    { id: "no_formal", localLabel: "No formal qualification", isced: "no_formal", yearsOfSchooling: 0 },
  ],

  sectorClassification: [
    { id: "ict_repair", localLabel: "ICT / Electronics Repair & Services", iscoMajorGroup: 7 },
    { id: "trade_retail", localLabel: "Trade & Retail (Market / Shop)", iscoMajorGroup: 5 },
    { id: "agriculture", localLabel: "Agriculture & Agro-processing", iscoMajorGroup: 6 },
    { id: "construction", localLabel: "Construction & Artisan Trades", iscoMajorGroup: 7 },
    { id: "transport", localLabel: "Transport & Logistics", iscoMajorGroup: 8 },
    { id: "hospitality", localLabel: "Hospitality & Food Services", iscoMajorGroup: 5 },
    { id: "finance_mobile", localLabel: "Financial Services / Mobile Money", iscoMajorGroup: 4 },
    { id: "health_community", localLabel: "Community Health & Care Work", iscoMajorGroup: 5 },
    { id: "education_tutoring", localLabel: "Education & Tutoring", iscoMajorGroup: 2 },
    { id: "creative_media", localLabel: "Creative, Media & Design", iscoMajorGroup: 2 },
  ],

  automationCalibration: {
    infrastructureMultiplier: 0.68, // Lower automation exposure due to limited tech adoption in informal economy
    digitalReadinessScore: 41,      // ITU 2023
    formalEmploymentShare: 0.15,    // Only ~15% in formal economy (ILO)
  },

  laborMarketDataUrl: "/data/labor-market/ghana.json",
  topGrowthSectors: ["ICT & Digital Services", "Agro-processing", "Financial Services (Mobile Money)", "Construction"],

  opportunityTypes: ["formal_employment", "self_employment", "gig", "training_pathway"],

  // Wittgenstein Centre 2025 projections loaded from static data
};

export default ghana;
