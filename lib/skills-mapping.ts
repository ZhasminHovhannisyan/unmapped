import escoData from "@/data/esco-skills-subset.json";
import type { ESCOSkill, SkillsProfile, EducationLevel, WizardFormData } from "@/config/types";
import { getCountryConfig } from "@/lib/country-config";

interface ESCOOccupation {
  label: string;
  iscoMajorGroup: number;
  escoUri: string;
  coreSkills: { uri: string; label: string; durability: string }[];
}

export function getIscoMajorGroupFromSector(sectorId: string, countryId: string): number {
  const config = getCountryConfig(countryId);
  const sector = config.sectorClassification.find((s) => s.id === sectorId);
  return sector?.iscoMajorGroup ?? 5;
}

export function getSkillsForSector(sectorId: string): ESCOSkill[] {
  // Map sector IDs to occupation ISCO codes
  const sectorToIsco: Record<string, string> = {
    ict_repair: "7421",
    trade_retail: "5220",
    agriculture: "6111",
    agriculture_crop: "6111",
    garments_rmd: "8153",
    ict_services: "2513",
    finance_mobile: "4311",
    finance_mfs: "4311",
  };

  const iscoCode = sectorToIsco[sectorId];
  const occupation = iscoCode
    ? (escoData.occupations as Record<string, ESCOOccupation>)[iscoCode]
    : null;

  if (occupation) {
    return occupation.coreSkills.map((s) => ({
      uri: s.uri,
      label: s.label,
      proficiencyEstimate: "intermediate" as const,
      durability: s.durability as ESCOSkill["durability"],
    }));
  }

  // Fallback: return digital basics
  return escoData.skillGroups.digital_basics.map((s) => ({
    uri: s.uri,
    label: s.label,
    proficiencyEstimate: "basic" as const,
    durability: s.durability as ESCOSkill["durability"],
  }));
}

export function getAllChecklistSkills(sectorId: string): { uri: string; label: string }[] {
  const sectorSkills = getSkillsForSector(sectorId);
  const digitalSkills = escoData.skillGroups.digital_basics;
  const entSkills = escoData.skillGroups.entrepreneurship;
  const comSkills = escoData.skillGroups.communication;

  const all = [
    ...sectorSkills.map((s) => ({ uri: s.uri, label: s.label })),
    ...digitalSkills.map((s) => ({ uri: s.uri, label: s.label })),
    ...entSkills.map((s) => ({ uri: s.uri, label: s.label })),
    ...comSkills.map((s) => ({ uri: s.uri, label: s.label })),
  ];

  // Deduplicate
  const seen = new Set<string>();
  return all.filter((s) => {
    if (seen.has(s.uri)) return false;
    seen.add(s.uri);
    return true;
  });
}

export function buildLocalProfile(
  formData: WizardFormData,
  aiResult: {
    iscoCode: string;
    iscoTitle: string;
    escoSkills: ESCOSkill[];
    softSkills: string[];
    informalAssets: string[];
    portabilityScore: number;
    humanReadableSummary: string;
  }
): SkillsProfile {
  const config = getCountryConfig(formData.countryId);
  const educationLevel = config.educationTaxonomy.find(
    (e) => e.id === formData.educationLevelId
  ) as EducationLevel;

  const iscoCode = aiResult.iscoCode;
  const iscoMajorGroup = parseInt(iscoCode.charAt(0)) || 5;

  return {
    createdAt: new Date().toISOString(),
    countryId: formData.countryId,
    iscoCode,
    iscoTitle: aiResult.iscoTitle,
    iscoMajorGroup,
    escoSkills: aiResult.escoSkills,
    softSkills: aiResult.softSkills,
    informalAssets: aiResult.informalAssets,
    portabilityScore: aiResult.portabilityScore,
    humanReadableSummary: aiResult.humanReadableSummary,
    educationLevel,
    yearsExperience: formData.yearsExperience,
    sector: formData.sectorId,
  };
}

// Fallback profile (no AI) for demo/offline use
export function buildFallbackProfile(formData: WizardFormData): SkillsProfile {
  const config = getCountryConfig(formData.countryId);
  const educationLevel = config.educationTaxonomy.find(
    (e) => e.id === formData.educationLevelId
  ) ?? config.educationTaxonomy[0];

  const sector = config.sectorClassification.find((s) => s.id === formData.sectorId);
  const iscoMajorGroup = sector?.iscoMajorGroup ?? 5;
  const iscoCode = `${iscoMajorGroup}000`;

  const escoSkills = getSkillsForSector(formData.sectorId);

  return {
    createdAt: new Date().toISOString(),
    countryId: formData.countryId,
    iscoCode,
    iscoTitle: formData.jobTitle || sector?.localLabel || "Service and Sales Worker",
    iscoMajorGroup,
    escoSkills: escoSkills.map((s) => ({ ...s, proficiencyEstimate: "intermediate" as const })),
    softSkills: ["problem-solving", "customer communication", "self-direction", "adaptability"],
    informalAssets: formData.freeTextSkills
      ? [formData.freeTextSkills.substring(0, 120)]
      : ["Self-taught skills through practical experience"],
    portabilityScore: Math.min(
      95,
      40 + educationLevel.yearsOfSchooling * 3 + formData.yearsExperience * 2
    ),
    humanReadableSummary: `You are a ${sector?.localLabel ?? "worker"} with ${formData.yearsExperience} year(s) of experience and a ${educationLevel.localLabel}. Your hands-on skills and practical knowledge are real and valuable — this profile maps them to internationally recognised standards so employers and training programs can understand what you bring.`,
    educationLevel,
    yearsExperience: formData.yearsExperience,
    sector: formData.sectorId,
  };
}
