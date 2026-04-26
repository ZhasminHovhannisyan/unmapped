import type { ESCOSkill, SkillsProfile, WizardFormData } from "@/config/types";
import { getCountryConfig } from "@/lib/country-config";

const AMARA_ESCO_OCCUPATION_URI = "http://data.europa.eu/esco/occupation/44c3b84c";

export function getAmaraDemoFormData(): WizardFormData {
  return {
    countryId: "ghana",
    age: 22,
    educationLevelId: "shs",
    sectorId: "ict_repair",
    yearsExperience: 5,
    jobTitle: "Electronics repair technician",
    freeTextSkills:
      "I repair phones and tablets, run a small repair shop outside Accra, and buy parts wholesale. I taught myself coding from YouTube on a shared connection. I speak three languages with customers and suppliers.",
    selectedCompetencies: [],
  };
}

function amaraEscoSkills(): ESCOSkill[] {
  return [
    {
      uri: "http://data.europa.eu/esco/skill/amara/diagnosis",
      label: "Electronics Diagnosis & Repair",
      proficiencyEstimate: "advanced",
      durability: "high",
    },
    {
      uri: "http://data.europa.eu/esco/skill/amara/mobile",
      label: "Mobile Device Servicing",
      proficiencyEstimate: "advanced",
      durability: "high",
    },
    {
      uri: "http://data.europa.eu/esco/skill/amara/coding",
      label: "Basic Coding (self-taught)",
      proficiencyEstimate: "intermediate",
      durability: "moderate",
    },
    {
      uri: "http://data.europa.eu/esco/skill/amara/customer",
      label: "Customer Service",
      proficiencyEstimate: "advanced",
      durability: "high",
    },
    {
      uri: "http://data.europa.eu/esco/skill/amara/lang",
      label: "Multilingual Communication (3 languages)",
      proficiencyEstimate: "advanced",
      durability: "high",
    },
    {
      uri: "http://data.europa.eu/esco/skill/amara/biz",
      label: "Business Operations (self-employed since age 17)",
      proficiencyEstimate: "advanced",
      durability: "high",
    },
  ];
}

/** Fully prefilled Amara (Ghana) profile for demo — ISCO-08 7421 Electronics Mechanics */
export function getAmaraDemoProfile(): SkillsProfile {
  const config = getCountryConfig("ghana");
  const educationLevel =
    config.educationTaxonomy.find((e) => e.id === "shs") ?? config.educationTaxonomy[0];

  return {
    createdAt: new Date().toISOString(),
    countryId: "ghana",
    age: 22,
    iscoCode: "7421",
    iscoTitle: "Electronics Mechanics and Servicers",
    iscoMajorGroup: 7,
    escoOccupationUri: AMARA_ESCO_OCCUPATION_URI,
    escoSkills: amaraEscoSkills(),
    softSkills: [
      "Problem-solving under time pressure",
      "Negotiation with suppliers and customers",
      "Self-directed learning",
    ],
    informalAssets: [
      "Runs an independent phone repair business with limited formal credit",
      "Trilingual customer base — bridges informal and formal retail channels",
    ],
    portabilityScore: 82,
    humanReadableSummary:
      "You bring hands-on electronics repair, mobile servicing, and customer-facing service together with the hustle of running your own shop. Your multilingual communication and self-taught digital skills make this profile portable across cities and similar markets — not only where you live today.",
    educationLevel,
    yearsExperience: 5,
    sector: "ict_repair",
  };
}
