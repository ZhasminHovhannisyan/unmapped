export type ISCEDLevel =
  | "no_formal"
  | "primary"
  | "lower_secondary"
  | "upper_secondary"
  | "post_secondary_non_tertiary"
  | "short_cycle_tertiary"
  | "bachelor"
  | "master"
  | "doctoral";

export interface EducationLevel {
  id: string;
  localLabel: string;       // e.g. "WASSCE / SSSCE" in Ghana
  isced: ISCEDLevel;
  yearsOfSchooling: number;
}

export interface Sector {
  id: string;
  localLabel: string;
  iscoMajorGroup: number;   // 1–9 per ISCO-08
  escoUri?: string;
}

export type OpportunityType =
  | "formal_employment"
  | "self_employment"
  | "gig"
  | "training_pathway"
  | "cooperative";

export interface AutomationCalibration {
  infrastructureMultiplier: number;  // 0.6–1.0
  digitalReadinessScore: number;     // 0–100, ITU data
  formalEmploymentShare: number;     // 0–1
}

export interface CountryConfig {
  id: string;
  name: string;
  region: string;
  language: string;
  currency: string;
  currencySymbol: string;
  educationTaxonomy: EducationLevel[];
  sectorClassification: Sector[];
  automationCalibration: AutomationCalibration;
  laborMarketDataUrl: string;
  wageFloorUSD: number;
  topGrowthSectors: string[];
  opportunityTypes: OpportunityType[];
  uiLocale: string;
  rtl: boolean;
  population15to24M: number;       // millions, youth population
  neetRate: number;                // % not in education, employment, training (WDI SL.UEM.NEET.ZS)
  humanCapitalIndex: number;       // World Bank HCI 0–1
  informalEconomyShare: number;    // % of employment that is informal
  mobileInternetPenetration: number; // % population with mobile internet
}

// --- Skills Profile ---

export type ProficiencyLevel = "basic" | "intermediate" | "advanced";

export interface ESCOSkill {
  uri: string;
  label: string;
  proficiencyEstimate: ProficiencyLevel;
  durability: "high" | "moderate" | "at_risk";
}

export interface SkillsProfile {
  userId?: string;
  createdAt: string;
  countryId: string;
  iscoCode: string;
  iscoTitle: string;
  iscoMajorGroup: number;
  escoSkills: ESCOSkill[];
  softSkills: string[];
  informalAssets: string[];
  portabilityScore: number;         // 0–100
  humanReadableSummary: string;
  educationLevel: EducationLevel;
  yearsExperience: number;
  sector: string;
}

// --- Automation Risk ---

export interface AutomationRisk {
  rawFreyOsborneScore: number;      // 0–1
  adjustedScore: number;            // 0–1, LMIC-calibrated
  riskLabel: "low" | "moderate" | "high";
  taskBreakdown: TaskBreakdown;
  adjacentSkills: AdjacentSkill[];
  wittgensteinProjection: WittgensteinProjection;
  dataSource: string;
  calibrationNote: string;
}

export interface TaskBreakdown {
  routineManual: number;      // share 0–1
  routineCognitive: number;
  nonRoutineManual: number;
  nonRoutineCognitive: number;
  social: number;
}

export interface AdjacentSkill {
  label: string;
  reason: string;
  trainingUrl?: string;
  trainingProvider: string;
  estimatedWeeks: number;
  requiresBroadband: boolean;
}

export interface WittgensteinProjection {
  country: string;
  year2025: EducationShare;
  year2035: EducationShare;
  source: string;
}

export interface EducationShare {
  noEducation: number;
  primary: number;
  lowerSecondary: number;
  upperSecondary: number;
  postSecondary: number;
  tertiary: number;
}

// --- Opportunities ---

export interface LaborMarketSignal {
  signalType: "sector_growth" | "wage_floor" | "returns_to_education" | "neet_rate" | "employment_growth";
  label: string;
  value: number | string;
  unit: string;
  source: string;
  sourceUrl: string;
  year: number;
  description: string;
}

export interface OpportunityMatch {
  id: string;
  roleTitle: string;
  sector: string;
  opportunityType: OpportunityType;
  matchScore: number;              // 0–100
  matchReason: string;
  realisticWageRangeUSD: [number, number];
  wageSource: string;
  wageYear: number;
  skillGaps: string[];
  pathwaySteps: PathwayStep[];
  isReachable: boolean;            // false if requires degree they don't have
}

export interface PathwayStep {
  label: string;
  description: string;
  estimatedDuration: string;
  isFree: boolean;
  resourceUrl?: string;
}

export interface OpportunityMatchResult {
  profile: SkillsProfile;
  matches: OpportunityMatch[];
  econSignals: LaborMarketSignal[];
  aggregateInsight: string;
}

// --- Policymaker Dashboard ---

export interface AggregateProfile {
  totalProfiles: number;
  topSkillGaps: { skill: string; count: number }[];
  sectorDistribution: { sector: string; count: number }[];
  avgPortabilityScore: number;
  avgAutomationRisk: number;
  countryBreakdown: { country: string; count: number }[];
}

// --- Form State ---

export interface WizardFormData {
  countryId: string;
  age: number;
  educationLevelId: string;
  sectorId: string;
  yearsExperience: number;
  jobTitle: string;
  freeTextSkills: string;
  selectedCompetencies: string[];
}

// --- Data Source Citation ---

export interface DataSource {
  id: string;
  name: string;
  shortName: string;
  url: string;
  description: string;
  year: number;
  coverage: string;
}
