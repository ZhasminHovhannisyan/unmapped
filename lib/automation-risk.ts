import freyOsborneData from "@/data/frey-osborne.json";
import iloTaskData from "@/data/ilo-task-indices.json";
import type { AutomationRisk, AutomationCalibration, TaskBreakdown, AdjacentSkill, WittgensteinProjection } from "@/config/types";

interface FreyOsborneEntry {
  label: string;
  rawScore: number;
  representativeOccupations?: string[];
  notes?: string;
}

interface ILOTaskEntry {
  label: string;
  routineManual: number;
  routineCognitive: number;
  nonRoutineManual: number;
  nonRoutineCognitive: number;
  social: number;
  durabilityLabel: string;
  durabilityScore: number;
}

/**
 * Core LMIC calibration formula:
 * adjustedRisk = rawRisk × infrastructureMultiplier × (1 - formalEmploymentShare × 0.3)
 *
 * Lower infrastructure = less near-term automation investment even if tasks are routine.
 * Low formal employment share = informal economy buffers displacement speed.
 */
export function calculateAdjustedRisk(
  rawScore: number,
  calibration: AutomationCalibration
): number {
  const adjusted =
    rawScore *
    calibration.infrastructureMultiplier *
    (1 - calibration.formalEmploymentShare * 0.3);
  return Math.min(1, Math.max(0, adjusted));
}

export function getAutomationRisk(
  iscoMajorGroup: number,
  calibration: AutomationCalibration,
  countryId: string,
  wittgensteinProjection: WittgensteinProjection
): AutomationRisk {
  const key = String(iscoMajorGroup) as keyof typeof freyOsborneData.byIscoMajorGroup;
  const foEntry = (freyOsborneData.byIscoMajorGroup as Record<string, FreyOsborneEntry>)[key];
  const iloEntry = (iloTaskData.byIscoMajorGroup as Record<string, ILOTaskEntry>)[key];

  const rawScore = foEntry?.rawScore ?? 0.5;
  const adjustedScore = calculateAdjustedRisk(rawScore, calibration);

  const taskBreakdown: TaskBreakdown = {
    routineManual: iloEntry?.routineManual ?? 0.2,
    routineCognitive: iloEntry?.routineCognitive ?? 0.2,
    nonRoutineManual: iloEntry?.nonRoutineManual ?? 0.2,
    nonRoutineCognitive: iloEntry?.nonRoutineCognitive ?? 0.2,
    social: iloEntry?.social ?? 0.2,
  };

  const adjacentSkills = getAdjacentSkills(iscoMajorGroup, calibration.digitalReadinessScore);

  const riskLabel = adjustedScore < 0.4 ? "low" : adjustedScore < 0.7 ? "moderate" : "high";

  return {
    rawFreyOsborneScore: rawScore,
    adjustedScore,
    riskLabel,
    taskBreakdown,
    adjacentSkills,
    wittgensteinProjection,
    dataSource: "Frey & Osborne (2013) + ILO Task Indices (2023)",
    calibrationNote: `Adjusted from raw score of ${(rawScore * 100).toFixed(0)}% using LMIC calibration: infrastructure multiplier ${calibration.infrastructureMultiplier}, formal employment share ${(calibration.formalEmploymentShare * 100).toFixed(0)}%.`,
  };
}

function getAdjacentSkills(iscoMajorGroup: number, digitalReadiness: number): AdjacentSkill[] {
  const baseSkills: Record<number, AdjacentSkill[]> = {
    4: [
      {
        label: "Data Analysis with Google Sheets / Excel",
        reason: "Moves from data entry (high risk) to data interpretation (low risk)",
        trainingUrl: "https://www.coursera.org/learn/excel-basics-data-analysis-ibm",
        trainingProvider: "Coursera (IBM) — Free to audit",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
      {
        label: "Mobile Money & Digital Finance Operations",
        reason: "Financial services roles are growing and leverage existing numeracy skills",
        trainingUrl: "https://www.gsma.com/mobile-money/training",
        trainingProvider: "GSMA Mobile Money Academy — Free",
        estimatedWeeks: 2,
        requiresBroadband: false,
      },
      {
        label: "Customer Service & Complaint Resolution",
        reason: "Social interaction tasks remain highly resistant to automation",
        trainingUrl: "https://alison.com/course/customer-service-fundamentals",
        trainingProvider: "Alison — Free Certificate",
        estimatedWeeks: 3,
        requiresBroadband: false,
      },
    ],
    7: [
      {
        label: "Solar & Renewable Energy Installation",
        reason: "Growing sector in LMICs; leverages hands-on repair skills; requires minimal digital infrastructure",
        trainingUrl: "https://www.energia.org/training/",
        trainingProvider: "ENERGIA / GOGLA Training Programs",
        estimatedWeeks: 6,
        requiresBroadband: false,
      },
      {
        label: "IoT Device Repair & Connectivity",
        reason: "Electronics repair skills transfer directly to emerging IoT maintenance work",
        trainingUrl: "https://www.coursera.org/specializations/iot",
        trainingProvider: "Coursera — Free to audit",
        estimatedWeeks: 8,
        requiresBroadband: true,
      },
      {
        label: "Business Management for Micro-enterprises",
        reason: "Self-employment with skilled trades can be formalised and scaled",
        trainingUrl: "https://www.ifc.org/sme-toolkit",
        trainingProvider: "IFC SME Toolkit — Free",
        estimatedWeeks: 3,
        requiresBroadband: false,
      },
    ],
    8: [
      {
        label: "Quality Control & Textile Inspection",
        reason: "Supervisory/inspection roles are less automatable than machine operation",
        trainingUrl: "https://alison.com/course/quality-management",
        trainingProvider: "Alison — Free Certificate",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
      {
        label: "Logistics & Supply Chain Coordination",
        reason: "Coordination and communication roles within manufacturing resist automation",
        trainingUrl: "https://www.coursera.org/learn/supply-chain-logistics",
        trainingProvider: "Coursera (Rutgers) — Free to audit",
        estimatedWeeks: 5,
        requiresBroadband: false,
      },
      {
        label: "Equipment Maintenance & Preventive Servicing",
        reason: "Maintenance roles require physical judgment that automation cannot yet replicate",
        trainingUrl: "https://alison.com/course/industrial-maintenance",
        trainingProvider: "Alison — Free Certificate",
        estimatedWeeks: 6,
        requiresBroadband: false,
      },
    ],
    5: [
      {
        label: "Community Health & Nutrition Education",
        reason: "Care and health promotion roles are growing in LMICs and are highly automation-resilient",
        trainingUrl: "https://www.futurelearn.com/courses/community-health",
        trainingProvider: "FutureLearn — Free to audit",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
      {
        label: "Digital Marketing for Small Businesses",
        reason: "Extends customer service skills into higher-value digital marketing work",
        trainingUrl: "https://learndigital.withgoogle.com/digitalgarage",
        trainingProvider: "Google Digital Garage — Free Certificate",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
    ],
    6: [
      {
        label: "Agro-processing & Value Addition",
        reason: "Processing and packaging add income without requiring land — builds on farming knowledge",
        trainingUrl: "https://www.fao.org/e-learning-center",
        trainingProvider: "FAO e-Learning Centre — Free",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
      {
        label: "Climate-Smart Agriculture Techniques",
        reason: "High-demand skills as climate adaptation funding targets agricultural workers",
        trainingUrl: "https://www.cgiar.org/research/program/ccafs/",
        trainingProvider: "CGIAR / CCAFS Training",
        estimatedWeeks: 5,
        requiresBroadband: false,
      },
    ],
    9: [
      {
        label: "Early Childhood Care & Development",
        reason: "Care work is highly resilient to automation; community demand is growing",
        trainingUrl: "https://alison.com/course/child-development",
        trainingProvider: "Alison — Free Certificate",
        estimatedWeeks: 6,
        requiresBroadband: false,
      },
      {
        label: "Waste Management & Recycling Operations",
        reason: "Growing green economy sector with accessible entry points",
        trainingUrl: "https://www.unep.org/training",
        trainingProvider: "UNEP Training Resources — Free",
        estimatedWeeks: 3,
        requiresBroadband: false,
      },
    ],
    1: [
      {
        label: "Project Management Fundamentals",
        reason: "Formalises coordination skills already used informally in management roles",
        trainingUrl: "https://www.coursera.org/learn/project-management-foundations",
        trainingProvider: "Coursera — Free to audit",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
      {
        label: "Financial Literacy for Small Enterprise",
        reason: "Strengthens business resilience against economic shocks",
        trainingUrl: "https://www.ifc.org/sme-toolkit",
        trainingProvider: "IFC SME Toolkit — Free",
        estimatedWeeks: 3,
        requiresBroadband: false,
      },
    ],
    3: [
      {
        label: "Digital Health Records & Patient Data",
        reason: "Health tech adoption is growing in LMICs — adds value to technical roles",
        trainingUrl: "https://www.futurelearn.com/courses/digital-health",
        trainingProvider: "FutureLearn — Free to audit",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
      {
        label: "Basic Accounting & Payroll Software",
        reason: "Moves from routine data input to interpreted financial reporting",
        trainingUrl: "https://alison.com/course/bookkeeping",
        trainingProvider: "Alison — Free Certificate",
        estimatedWeeks: 4,
        requiresBroadband: false,
      },
    ],
  };

  const skills = baseSkills[iscoMajorGroup] ?? baseSkills[5];

  // Filter broadband-required skills if digital readiness is low
  if (digitalReadiness < 40) {
    return skills.filter((s) => !s.requiresBroadband);
  }
  return skills;
}
