"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { EconSignalCard } from "@/components/EconSignalCard";
import { HonestLimitsCallout } from "@/components/HonestLimitsCallout";
import { SourceBadge } from "@/components/SourceBadge";
import { cn } from "@/lib/utils";
import type { OpportunityMatchResult, OpportunityMatch } from "@/config/types";

const oppTypeLabels: Record<string, string> = {
  formal_employment: "Formal Employment",
  self_employment: "Self-Employment",
  gig: "Gig / Flexible",
  training_pathway: "Training Pathway",
  cooperative: "Cooperative",
};

const oppTypeColors: Record<string, string> = {
  formal_employment: "bg-blue-100 text-blue-800",
  self_employment: "bg-emerald-100 text-emerald-800",
  gig: "bg-purple-100 text-purple-800",
  training_pathway: "bg-amber-100 text-amber-800",
  cooperative: "bg-teal-100 text-teal-800",
};

export default function OpportunitiesPage() {
  const { currentProfile } = useAppStore();
  const [result, setResult] = useState<OpportunityMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [openPathway, setOpenPathway] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProfile) return;
    setLoading(true);
    fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: currentProfile }),
    })
      .then((r) => r.json())
      .then((data: OpportunityMatchResult) => setResult(data))
      .finally(() => setLoading(false));
  }, [currentProfile]);

  if (!currentProfile) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">No skills profile found. Please complete the Skills Wizard first.</p>
        <Link href="/profile" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold">
          Go to Skills Wizard →
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Matching your profile to real opportunities...
        </div>
      </main>
    );
  }

  if (!result) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Opportunities</h1>
        <p className="text-sm text-slate-500">
          Honest, grounded matches for <strong className="text-slate-700">{currentProfile.iscoTitle}</strong> — not aspirational, not generic.
        </p>
      </div>

      {/* Key economic signals — ALWAYS visible, always sourced */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Key Economic Signals</h2>
          <span className="text-xs text-slate-400">— always sourced, always visible</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {result.econSignals.slice(0, 4).map((signal, i) => (
            <EconSignalCard key={i} signal={signal} highlight={i < 2} />
          ))}
        </div>
      </div>

      {/* Matches */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">Your Best-Fit Opportunities</h2>
        <div className="space-y-4">
          {result.matches.map((match: OpportunityMatch) => (
            <div key={match.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          oppTypeColors[match.opportunityType]
                        )}
                      >
                        {oppTypeLabels[match.opportunityType]}
                      </span>
                      <span className="text-xs text-slate-400">{match.sector}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{match.roleTitle}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black text-blue-600">{match.matchScore}%</p>
                    <p className="text-xs text-slate-400">match</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 mb-3">{match.matchReason}</p>

                {/* Wage range — always sourced */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-0.5">Realistic earnings range</p>
                    <p className="text-base font-bold text-slate-900">
                      ${match.realisticWageRangeUSD[0]}–${match.realisticWageRangeUSD[1]}
                      <span className="text-sm font-normal text-slate-500 ml-1">USD/month</span>
                    </p>
                  </div>
                  <SourceBadge source={match.wageSource} year={match.wageYear} url="https://ilostat.ilo.org/" />
                </div>

                {/* Skill gaps */}
                {match.skillGaps.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1.5">Skills to bridge:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.skillGaps.map((gap, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pathway toggle */}
                <button
                  onClick={() =>
                    setOpenPathway(openPathway === match.id ? null : match.id)
                  }
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  {openPathway === match.id ? "▲ Hide pathway" : "▼ Show your pathway"}
                </button>
              </div>

              {/* Pathway steps */}
              {openPathway === match.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Your Pathway</p>
                  <div className="space-y-3">
                    {match.pathwaySteps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          {i < match.pathwaySteps.length - 1 && (
                            <div className="w-px h-full min-h-4 bg-blue-200 my-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                          <p className="text-xs text-slate-600">{step.description}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{step.estimatedDuration}</p>
                          {step.resourceUrl && (
                            <a
                              href={step.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline mt-0.5 block"
                            >
                              Access resource →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <HonestLimitsCallout message="These matches are based on your ISCO occupational group and local labor market data from ILO ILOSTAT (2023). Match scores are algorithmic estimates, not guarantees. Wage ranges reflect medians — individual earnings vary significantly by location, network, and skill level. Opportunity types are filtered by what is realistic in your country context." />

      <div className="flex gap-3">
        <Link href="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          View Program Dashboard →
        </Link>
        <Link href="/readiness" className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
          ← Back to AI Readiness
        </Link>
      </div>
    </main>
  );
}
