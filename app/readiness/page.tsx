"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getCountryConfig } from "@/lib/country-config";
import { getAutomationRisk } from "@/lib/automation-risk";
import { HonestLimitsCallout } from "@/components/HonestLimitsCallout";
import { SourceBadge } from "@/components/SourceBadge";
import { RiskGauge } from "@/components/RiskGauge";
import wittgensteinData from "@/data/wittgenstein-projections.json";

const TaskBreakdownChart = dynamic(
  () => import("@/components/TaskBreakdownChart").then((m) => m.TaskBreakdownChart),
  { ssr: false, loading: () => <div className="h-[180px] bg-slate-100 rounded-lg animate-pulse" /> }
);
const WittgensteinChart = dynamic(
  () => import("@/components/WittgensteinChart").then((m) => m.WittgensteinChart),
  { ssr: false, loading: () => <div className="h-[220px] bg-slate-100 rounded-lg animate-pulse" /> }
);

export default function ReadinessPage() {
  const { currentProfile } = useAppStore();

  const risk = useMemo(() => {
    if (!currentProfile) return null;
    const config = getCountryConfig(currentProfile.countryId);
    const wData = (wittgensteinData.countries as Record<string, typeof wittgensteinData.countries.ghana>)[currentProfile.countryId];
    const projection = {
      country: config.name,
      year2025: wData["2025"],
      year2035: wData["2035"],
      source: wittgensteinData._source,
    };
    return getAutomationRisk(
      currentProfile.iscoMajorGroup,
      config.automationCalibration,
      currentProfile.countryId,
      projection
    );
  }, [currentProfile]);

  if (!currentProfile || !risk) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">No skills profile found. Please complete the Skills Wizard first.</p>
        <Link
          href="/profile"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Go to Skills Wizard →
        </Link>
      </main>
    );
  }

  const riskColors = {
    low: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Low Risk" },
    moderate: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Moderate Risk" },
    high: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "High Risk" },
  };
  const rc = riskColors[risk.riskLabel];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">AI Readiness & Displacement Risk</h1>
        <p className="text-sm text-slate-500">
          Based on your profile: <strong className="text-slate-700">{currentProfile.iscoTitle}</strong>
        </p>
      </div>

      {/* Risk gauge + summary */}
      <div className={`rounded-2xl border p-6 ${rc.bg}`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RiskGauge score={risk.adjustedScore} riskLabel={risk.riskLabel} />
          <div className="flex-1">
            <h2 className={`text-lg font-bold mb-1 ${rc.text}`}>
              {rc.label}: {(risk.adjustedScore * 100).toFixed(0)}% Automation Exposure
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              {risk.riskLabel === "high"
                ? "Many of the tasks in your current work are routine and could be disrupted by automation over the next decade. This doesn't mean you will lose your job — but it means building resilience now is important."
                : risk.riskLabel === "moderate"
                ? "Some of your tasks are automation-sensitive, but you also have durable skills that protect you. The adjacent skills below can strengthen your position."
                : "Your current skills profile has low automation exposure. Many of your core tasks require judgment, physical dexterity, or social interaction that AI cannot replicate today."}
            </p>
            <div className="flex flex-wrap gap-2">
              <SourceBadge
                source="Frey & Osborne 2013"
                url="https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf"
              />
              <SourceBadge
                source="ILO Task Indices 2023"
                url="https://ilostat.ilo.org/"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calibration note */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Calibration Note</p>
        <p className="text-xs text-slate-600 leading-relaxed">{risk.calibrationNote}</p>
        <p className="text-xs text-slate-500 mt-1">
          Formula: <code className="font-mono bg-slate-200 px-1 rounded">adjustedRisk = freyOsborneRisk × infrastructureMultiplier × (1 − formalEmploymentShare × 0.3)</code>
        </p>
      </div>

      {/* Task breakdown chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Task Content Breakdown</h2>
          <SourceBadge source="ILO Task Indices 2023" url="https://ilostat.ilo.org/" />
        </div>
        <TaskBreakdownChart breakdown={risk.taskBreakdown} />
        <p className="text-xs text-slate-500 mt-3">
          Routine tasks (manual + cognitive) are highest automation risk. Non-routine cognitive and social tasks are most durable.
        </p>
      </div>

      {/* Adjacent skills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">Skills That Build Resilience</h2>
        <p className="text-sm text-slate-500 mb-4">
          These specific, achievable skills would meaningfully reduce your automation risk. All are accessible without a university degree.
        </p>
        <div className="space-y-3">
          {risk.adjacentSkills.map((skill, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-0.5">{skill.label}</p>
                <p className="text-xs text-slate-600 mb-2">{skill.reason}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">{skill.estimatedWeeks} weeks · {skill.trainingProvider}</span>
                  {skill.requiresBroadband && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded border border-amber-200">
                      Requires broadband
                    </span>
                  )}
                  {skill.trainingUrl && (
                    <a
                      href={skill.trainingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Access training →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wittgenstein projections */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-900">Where Your Region Is Heading</h2>
          <SourceBadge
            source="Wittgenstein Centre 2023"
            url="https://dataexplorer.wittgensteincentre.org/"
          />
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Education attainment projections for {risk.wittgensteinProjection.country}, 2025 vs 2035.
        </p>
        <WittgensteinChart projection={risk.wittgensteinProjection} />
        <p className="text-xs text-slate-500 mt-3 italic">
          {(wittgensteinData.countries as Record<string, { insight: string }>)[currentProfile.countryId]?.insight}
        </p>
      </div>

      {/* Honest limits */}
      <HonestLimitsCallout message="This assessment uses Frey & Osborne (2013) automation scores calibrated for LMIC context using ILO infrastructure and formality data. Automation risk in informal economies is harder to measure than in formal ones — displacement speed is slower where labour is cheaper than capital. Treat this as a directional signal, not a prediction. Source year: 2013 (Frey-Osborne), 2023 (ILO task indices)." />

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href="/opportunities"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          See My Opportunities →
        </Link>
        <Link
          href="/profile"
          className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          ← Back to Profile
        </Link>
      </div>
    </main>
  );
}
