import type { SkillsProfile } from "@/config/types";

function explainLine(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("customer") || l.includes("communicat") || l.includes("multilingual")) {
    return "Live communication and reading social cues stay harder to automate than back-office routines.";
  }
  if (l.includes("diagnos") || l.includes("troubleshoot") || l.includes("repair")) {
    return "Hands-on fault-finding mixes tacit knowledge with inspection — a strong buffer in field service.";
  }
  if (l.includes("business") || l.includes("stock") || l.includes("operations")) {
    return "Micro-enterprise coordination across suppliers, cash flow, and customers is poor fit for rigid automation.";
  }
  return "Combines judgment, context, or relationship work that remains costly for machines to replicate locally.";
}

export function getDurableSkillsDisplay(profile: SkillsProfile): { label: string; line: string }[] {
  const highs = profile.escoSkills.filter((s) => s.durability === "high");
  const out: { label: string; line: string }[] = [];
  for (const s of highs) {
    if (out.length >= 3) break;
    out.push({ label: s.label, line: explainLine(s.label) });
  }
  for (const s of profile.softSkills) {
    if (out.length >= 3) break;
    if (out.some((o) => o.label === s)) continue;
    out.push({ label: s, line: explainLine(s) });
  }
  return out.slice(0, 3);
}
