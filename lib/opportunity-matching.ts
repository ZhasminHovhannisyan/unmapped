import type {
  SkillsProfile,
  OpportunityMatch,
  LaborMarketSignal,
  OpportunityMatchResult,
  CountryConfig,
  PathwayStep,
} from "@/config/types";
import ghanaLaborData from "@/data/labor-market/ghana.json";
import bangladeshLaborData from "@/data/labor-market/bangladesh.json";

interface LaborMarketData {
  econSignals: LaborMarketSignal[];
  wageRangesBySector: Record<string, { min: number; max: number; median: number; currency: string; year: number }>;
  sectorGrowthRanking: { sector: string; annualGrowthPct: number; source: string }[];
}

const laborDataMap: Record<string, LaborMarketData> = {
  ghana: ghanaLaborData as unknown as LaborMarketData,
  bangladesh: bangladeshLaborData as unknown as LaborMarketData,
};

function loadLaborMarketData(countryId: string): LaborMarketData {
  return laborDataMap[countryId] ?? laborDataMap.ghana;
}

function buildPathway(
  profile: SkillsProfile,
  roleTitle: string,
  skillGaps: string[],
  isFreeOpportunity: boolean
): PathwayStep[] {
  const steps: PathwayStep[] = [
    {
      label: "Where you are now",
      description: `${profile.educationLevel.localLabel} + ${profile.yearsExperience} year(s) experience as ${profile.iscoTitle}`,
      estimatedDuration: "Today",
      isFree: true,
    },
  ];

  if (skillGaps.length > 0) {
    steps.push({
      label: `Bridge skill: ${skillGaps[0]}`,
      description: `Learn ${skillGaps[0]} to qualify for ${roleTitle}. Free courses available.`,
      estimatedDuration: "4–8 weeks",
      isFree: true,
      resourceUrl: "https://alison.com",
    });
  }

  steps.push({
    label: roleTitle,
    description: isFreeOpportunity
      ? "Apply directly — no degree required for this role."
      : "Apply via job board or community network after skill bridge.",
    estimatedDuration: "After skill bridge",
    isFree: true,
  });

  return steps;
}

export function matchOpportunities(
  profile: SkillsProfile,
  config: CountryConfig
): OpportunityMatchResult {
  const laborData = loadLaborMarketData(config.id);

  const matches: OpportunityMatch[] = [];

  // Build matches based on ISCO major group and sector
  const group = profile.iscoMajorGroup;
  const wageRanges = laborData.wageRangesBySector;

  type OpportunityTemplate = {
    roleTitle: string;
    sector: string;
    opportunityType: OpportunityMatch["opportunityType"];
    skillGaps: string[];
    isReachable: boolean;
    matchScoreBase: number;
    matchReason: string;
    wageKey: string;
  };

  const opportunityTemplates: Record<number, OpportunityTemplate[]> = {
    7: [
      {
        roleTitle: "Electronics Repair Technician (Self-employed)",
        sector: "ICT / Electronics Repair",
        opportunityType: "self_employment",
        skillGaps: ["business record-keeping", "digital marketing basics"],
        isReachable: true,
        matchScoreBase: 88,
        matchReason: "Your hands-on repair skills directly match this role. Self-employment removes credential barriers.",
        wageKey: "ict_repair",
      },
      {
        roleTitle: "Mobile Money Agent / FinTech Support",
        sector: "Financial Services",
        opportunityType: "self_employment",
        skillGaps: ["mobile banking platform training"],
        isReachable: true,
        matchScoreBase: 72,
        matchReason: "Customer-facing experience and digital literacy transfer well to mobile financial services.",
        wageKey: "finance_mobile",
      },
      {
        roleTitle: "ICT Technician — Community Hub",
        sector: "ICT & Digital Services",
        opportunityType: "formal_employment",
        skillGaps: ["CompTIA A+ fundamentals", "network basics"],
        isReachable: true,
        matchScoreBase: 65,
        matchReason: "A short technical certification can bridge from informal repair to formal ICT technician roles.",
        wageKey: "ict_repair",
      },
    ],
    5: [
      {
        roleTitle: "Community Health Worker / Nutrition Promoter",
        sector: "Healthcare & Community Services",
        opportunityType: "formal_employment",
        skillGaps: ["basic health literacy certification"],
        isReachable: true,
        matchScoreBase: 74,
        matchReason: "Community-facing experience and communication skills are the core requirements for this growing role.",
        wageKey: "health_community",
      },
      {
        roleTitle: "Market Trader — Agro-processed Goods",
        sector: "Trade & Agro-processing",
        opportunityType: "self_employment",
        skillGaps: ["value chain basics", "food safety handling"],
        isReachable: true,
        matchScoreBase: 82,
        matchReason: "Customer service and negotiation skills transfer directly. No credential required to start.",
        wageKey: "trade_retail",
      },
    ],
    8: [
      {
        roleTitle: "Quality Control Supervisor — Manufacturing",
        sector: "Manufacturing",
        opportunityType: "formal_employment",
        skillGaps: ["quality management fundamentals", "basic statistics"],
        isReachable: true,
        matchScoreBase: 70,
        matchReason: "Machine operation experience gives you production floor credibility. Supervisory roles resist automation.",
        wageKey: "garments_rmd",
      },
      {
        roleTitle: "Logistics Coordinator — Courier/Last Mile",
        sector: "Transport & Logistics",
        opportunityType: "gig",
        skillGaps: ["route planning app training"],
        isReachable: true,
        matchScoreBase: 68,
        matchReason: "Physical logistics work is growing with e-commerce. Coordination skills extend your reach beyond driving.",
        wageKey: "transport",
      },
    ],
    6: [
      {
        roleTitle: "Agro-processing Worker / Food Packaging",
        sector: "Agro-processing",
        opportunityType: "formal_employment",
        skillGaps: ["food safety certification (HACCP basics)"],
        isReachable: true,
        matchScoreBase: 80,
        matchReason: "Agricultural knowledge translates directly to processing and packaging. Agro-processing is a top growth sector.",
        wageKey: "agriculture",
      },
      {
        roleTitle: "Smallholder Cooperative Lead",
        sector: "Agriculture",
        opportunityType: "cooperative",
        skillGaps: ["cooperative management basics"],
        isReachable: true,
        matchScoreBase: 78,
        matchReason: "Experienced farmers with strong practical knowledge can access better prices and inputs through cooperative structures.",
        wageKey: "agriculture",
      },
    ],
    4: [
      {
        roleTitle: "Data Entry Supervisor / Team Lead",
        sector: "Administration",
        opportunityType: "formal_employment",
        skillGaps: ["team leadership basics", "advanced spreadsheet skills"],
        isReachable: true,
        matchScoreBase: 72,
        matchReason: "Supervisory roles are more resilient to automation than direct data entry. Leadership skills are the bridge.",
        wageKey: "finance_mobile",
      },
      {
        roleTitle: "Mobile Money Operations Agent",
        sector: "Financial Services",
        opportunityType: "self_employment",
        skillGaps: ["mobile banking platform onboarding"],
        isReachable: true,
        matchScoreBase: 78,
        matchReason: "Numeracy and data handling experience directly relevant. High demand role with flexible entry.",
        wageKey: "finance_mobile",
      },
    ],
    2: [
      {
        roleTitle: "Freelance Web Developer / Digital Consultant",
        sector: "ICT & Digital Services",
        opportunityType: "self_employment",
        skillGaps: ["front-end web development (HTML/CSS)", "client communication"],
        isReachable: true,
        matchScoreBase: 85,
        matchReason: "Your self-taught coding skills are directly marketable on global freelancing platforms.",
        wageKey: "ict_services",
      },
    ],
    9: [
      {
        roleTitle: "Waste Sorting / Recycling Coordinator",
        sector: "Green Economy",
        opportunityType: "formal_employment",
        skillGaps: ["waste classification training"],
        isReachable: true,
        matchScoreBase: 65,
        matchReason: "Growing urban waste sector. Requires no credentials, offers stable employment.",
        wageKey: "trade_retail",
      },
      {
        roleTitle: "Early Childhood Care Facilitator",
        sector: "Education & Care",
        opportunityType: "training_pathway",
        skillGaps: ["child development basics (8-week course)"],
        isReachable: true,
        matchScoreBase: 70,
        matchReason: "Care work is automation-resilient and in high demand in urban LMICs.",
        wageKey: "health_community",
      },
    ],
  };

  const templates = opportunityTemplates[group] ?? opportunityTemplates[5];

  for (const template of templates) {
    // Only include opportunity types allowed in this country config
    if (!config.opportunityTypes.includes(template.opportunityType)) continue;

    const wageRange = wageRanges[template.wageKey] ??
      wageRanges[Object.keys(wageRanges)[0]];

    // Adjust match score based on experience and education
    const experienceBonus = Math.min(10, profile.yearsExperience * 2);
    const educationBonus = Math.min(10, profile.educationLevel.yearsOfSchooling);
    const matchScore = Math.min(98, template.matchScoreBase + experienceBonus + educationBonus / 2);

    matches.push({
      id: `${config.id}-${template.wageKey}-${template.opportunityType}`,
      roleTitle: template.roleTitle,
      sector: template.sector,
      opportunityType: template.opportunityType,
      matchScore: Math.round(matchScore),
      matchReason: template.matchReason,
      realisticWageRangeUSD: [wageRange.min, wageRange.max],
      wageSource: `ILO ILOSTAT ${wageRange.year}`,
      wageYear: wageRange.year,
      skillGaps: template.skillGaps,
      pathwaySteps: buildPathway(profile, template.roleTitle, template.skillGaps, template.isReachable),
      isReachable: template.isReachable,
    });
  }

  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return {
    profile,
    matches: matches.slice(0, 3),
    econSignals: laborData.econSignals.slice(0, 4),
    aggregateInsight: `Based on ${config.name}'s labor market data, your strongest opportunities are in ${matches[0]?.sector ?? "services"}.`,
  };
}
