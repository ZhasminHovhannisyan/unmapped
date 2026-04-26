export type ExposureColor = "green" | "amber" | "red";

export interface SectorAutomationRow {
  score: number;
  color: ExposureColor;
  atRiskTasks: string[];
}

const SECTOR_AUTOMATION: Record<string, SectorAutomationRow> = {
  ict_repair: {
    score: 0.31,
    color: "green",
    atRiskTasks: ["basic component swapping", "cash-only transaction handling", "manual inventory logging"],
  },
  trade_retail: {
    score: 0.58,
    color: "amber",
    atRiskTasks: ["cash handling", "stock counting", "routine customer queries"],
  },
  agriculture: {
    score: 0.67,
    color: "amber",
    atRiskTasks: ["manual harvesting", "basic sorting and grading", "repetitive packaging"],
  },
  construction: {
    score: 0.42,
    color: "green",
    atRiskTasks: ["material measuring", "routine surface finishing"],
  },
  transport: {
    score: 0.71,
    color: "red",
    atRiskTasks: ["route following", "basic dispatching", "manual scheduling"],
  },
  hospitality: {
    score: 0.52,
    color: "amber",
    atRiskTasks: ["order taking", "basic food prep", "cash billing"],
  },
  finance_mobile: {
    score: 0.45,
    color: "green",
    atRiskTasks: ["basic transaction processing", "routine balance queries"],
  },
  health_community: {
    score: 0.28,
    color: "green",
    atRiskTasks: ["routine data entry", "appointment scheduling"],
  },
  education_tutoring: {
    score: 0.33,
    color: "green",
    atRiskTasks: ["rote drill exercises", "attendance recording"],
  },
  creative_media: {
    score: 0.22,
    color: "green",
    atRiskTasks: ["simple template-based layouts"],
  },
  garments_rmd: {
    score: 0.61,
    color: "amber",
    atRiskTasks: ["machine-timed line work", "repetitive finishing", "piece-rate bundling"],
  },
};

const ALIASES: Record<string, string> = {
  ict_services: "ict_repair",
  agriculture_crop: "agriculture",
  finance_mfs: "finance_mobile",
  health_pharma: "health_community",
  food_processing: "agriculture",
  domestic_care: "health_community",
};

export function normalizeSectorForAutomationExposure(sectorId: string): string {
  return ALIASES[sectorId] ?? sectorId;
}

export function getSectorAutomationExposure(sectorId: string): SectorAutomationRow {
  const key = normalizeSectorForAutomationExposure(sectorId);
  return (
    SECTOR_AUTOMATION[key] ?? {
      score: 0.61,
      color: "amber",
      atRiskTasks: ["routine manual tasks", "repetitive processing"],
    }
  );
}

export const LMIC_SECTOR_AVERAGE_SCORE = 0.61;
