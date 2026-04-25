import type { CountryConfig } from "../types";

const bangladesh: CountryConfig = {
  id: "bangladesh",
  name: "Bangladesh",
  region: "South Asia",
  language: "Bengali (বাংলা)",
  currency: "BDT",
  currencySymbol: "৳",
  uiLocale: "bn",
  rtl: false,

  // World Bank HCI 2020; WDI; ILO; ITU 2023
  humanCapitalIndex: 0.46,
  population15to24M: 29.2,
  neetRate: 32.1,                  // WDI SL.UEM.NEET.ZS, Bangladesh 2022
  informalEconomyShare: 0.85,      // ILO ILOSTAT 2022
  mobileInternetPenetration: 38.7, // ITU 2023
  wageFloorUSD: 95,                // Garment sector NMW ~BDT 12,500/month (2023) ≈ USD 95

  educationTaxonomy: [
    { id: "no_formal", localLabel: "No formal qualification / Informal Learning", isced: "no_formal", yearsOfSchooling: 0 },
    { id: "primary", localLabel: "Primary (Class 5 / PSC)", isced: "primary", yearsOfSchooling: 5 },
    { id: "jsc", localLabel: "JSC / JDC (Junior School Certificate)", isced: "lower_secondary", yearsOfSchooling: 8 },
    { id: "ssc", localLabel: "SSC / Dakhil (Secondary School Certificate)", isced: "upper_secondary", yearsOfSchooling: 10 },
    { id: "hsc", localLabel: "HSC / Alim (Higher Secondary Certificate)", isced: "upper_secondary", yearsOfSchooling: 12 },
    { id: "diploma", localLabel: "Diploma in Engineering / Polytechnic", isced: "short_cycle_tertiary", yearsOfSchooling: 14 },
    { id: "degree", localLabel: "Bachelor's / Honours Degree", isced: "bachelor", yearsOfSchooling: 16 },
  ],

  sectorClassification: [
    { id: "garments_rmd", localLabel: "Ready-Made Garments (RMG)", iscoMajorGroup: 8 },
    { id: "agriculture_crop", localLabel: "Agriculture & Crop Farming", iscoMajorGroup: 6 },
    { id: "construction", localLabel: "Construction & Civil Works", iscoMajorGroup: 7 },
    { id: "trade_retail", localLabel: "Trade & Retail", iscoMajorGroup: 5 },
    { id: "transport", localLabel: "Transport (Rickshaw, CNG, Courier)", iscoMajorGroup: 8 },
    { id: "ict_services", localLabel: "ICT / Freelancing / Digital Services", iscoMajorGroup: 2 },
    { id: "health_pharma", localLabel: "Health & Pharmaceutical", iscoMajorGroup: 3 },
    { id: "finance_mfs", localLabel: "Mobile Financial Services (bKash etc.)", iscoMajorGroup: 4 },
    { id: "food_processing", localLabel: "Food Processing & Fisheries", iscoMajorGroup: 6 },
    { id: "domestic_care", localLabel: "Domestic & Care Work", iscoMajorGroup: 9 },
  ],

  automationCalibration: {
    infrastructureMultiplier: 0.65,  // RMG sector high routine exposure but low capital for automation
    digitalReadinessScore: 39,       // ITU 2023
    formalEmploymentShare: 0.14,     // ~14% formal employment (ILO 2022)
  },

  laborMarketDataUrl: "/data/labor-market/bangladesh.json",
  topGrowthSectors: ["ICT & Freelancing", "Light Manufacturing", "Healthcare", "Agro-processing"],

  opportunityTypes: ["formal_employment", "self_employment", "gig", "training_pathway", "cooperative"],
};

export default bangladesh;
