"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { SourceBadge } from "./SourceBadge";
import { cn } from "@/lib/utils";
import type { SkillsProfile, ESCOSkill } from "@/config/types";
import { useAppStore } from "@/lib/store";
import { getCountryConfig } from "@/lib/country-config";

interface SkillsProfileCardProps {
  profile: SkillsProfile;
}

const durabilityConfig = {
  high: { label: "High durability", color: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  moderate: { label: "Moderate", color: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  at_risk: { label: "At risk", color: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-400" },
};

export function SkillsProfileCard({ profile }: SkillsProfileCardProps) {
  const router = useRouter();
  const { setCurrentProfile } = useAppStore();

  function handleShareLink() {
    const encoded = btoa(JSON.stringify(profile)).substring(0, 200);
    const url = `${window.location.origin}/profile?data=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Shareable link copied to clipboard!");
    });
  }

  function handleDownloadJson() {
    const config = getCountryConfig(profile.countryId);
    const sectorObj = config.sectorClassification.find((s) => s.id === profile.sector);
    const skillsList = [...profile.escoSkills.map((s) => s.label), ...profile.softSkills];
    const hostname = typeof window !== "undefined" ? window.location.host : "unmapped";
    const payload = {
      generatedBy: `UNMAPPED — ${hostname}`,
      generatedAt: new Date().toISOString(),
      context: `${config.name}, ${config.region}`,
      profile: {
        age: profile.age ?? null,
        educationLevel: profile.educationLevel.localLabel,
        isced: profile.educationLevel.isced,
        sector: sectorObj?.localLabel ?? profile.sector,
        isco08Code: profile.iscoCode,
        isco08Label: profile.iscoTitle,
        escoURI: profile.escoOccupationUri ?? "",
        skills: skillsList,
        portabilityNote:
          "This profile is mapped to ISCO-08 and ESCO v1.2 international standards and is portable across borders and sectors.",
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unmapped-skills-profile.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setCurrentProfile(null);
    router.push("/profile");
  }

  const highDurability = profile.escoSkills.filter((s) => s.durability === "high");
  const moderateDurability = profile.escoSkills.filter((s) => s.durability === "moderate");
  const atRisk = profile.escoSkills.filter((s) => s.durability === "at_risk");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Skills Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generated {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Start over
        </button>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-1">
              ISCO-08 Occupation
            </p>
            <h2 className="text-xl font-bold">{profile.iscoTitle}</h2>
            <p className="text-blue-200 text-sm mt-0.5">Code: {profile.iscoCode}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-blue-200 text-xs font-semibold mb-1">Portability Score</p>
            <p className="text-4xl font-black">{profile.portabilityScore}</p>
            <p className="text-blue-200 text-xs">/100</p>
          </div>
        </div>

        <p className="text-blue-50 text-sm leading-relaxed border-t border-blue-500 pt-4">
          {profile.humanReadableSummary}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <SourceBadge
            source="ISCO-08"
            url="https://www.ilo.org/public/english/bureau/stat/isco/isco08/"
            className="bg-blue-500/50 text-blue-100 border-blue-400"
          />
          <SourceBadge
            source="ESCO v1.2"
            url="https://esco.ec.europa.eu"
            className="bg-blue-500/50 text-blue-100 border-blue-400"
          />
        </div>
      </div>

      {/* Portability breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">Skills by Durability</h3>
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600">High durability ({highDurability.length})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-600">Moderate ({moderateDurability.length})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
            <span className="text-slate-600">At risk ({atRisk.length})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.escoSkills.map((skill: ESCOSkill) => {
            const dc = durabilityConfig[skill.durability];
            return (
              <span
                key={skill.uri}
                className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", dc.color)}
                title={`Durability: ${dc.label} · ${skill.proficiencyEstimate}`}
              >
                {skill.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Soft skills + informal assets */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Transferable Skills</h3>
          <ul className="space-y-1.5">
            {profile.softSkills.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Informal Assets</h3>
          <ul className="space-y-1.5">
            {profile.informalAssets.map((asset, i) => (
              <li key={i} className="text-sm text-slate-700 leading-relaxed">
                <span className="mr-1.5 text-purple-500">◆</span>
                {asset}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-3">
            These skills don't always appear in formal taxonomies — but they are real and valuable.
          </p>
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-2 text-sm">Education & Context</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {profile.age != null && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Age</p>
              <p className="font-semibold text-slate-800">{profile.age}</p>
            </div>
          )}
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-slate-500 text-xs mb-1">Education Level</p>
            <p className="font-semibold text-slate-800">{profile.educationLevel.localLabel}</p>
            <p className="text-xs text-slate-500">{profile.educationLevel.isced.replace(/_/g, " ")}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-slate-500 text-xs mb-1">Years of Experience</p>
            <p className="font-semibold text-slate-800">{profile.yearsExperience} year{profile.yearsExperience !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-slate-500 text-xs mb-1">Portability</p>
            <p className="font-semibold text-slate-800">{profile.portabilityScore}/100</p>
            <p className="text-xs text-slate-500">Cross-border / cross-sector</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/readiness"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          See My AI Readiness →
        </Link>
        <button
          type="button"
          onClick={handleDownloadJson}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden />
          Download Skills Profile (JSON)
        </button>
        <button
          type="button"
          onClick={handleShareLink}
          className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Copy Shareable Link
        </button>
      </div>
      <p className="text-xs text-slate-500 max-w-xl">
        Your profile is mapped to international standards (ISCO-08, ESCO v1.2) — shareable with any employer, NGO, or
        training provider.
      </p>
    </div>
  );
}
