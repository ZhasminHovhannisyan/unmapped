"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getCountryConfig } from "@/lib/country-config";
import { EconSignalCard } from "@/components/EconSignalCard";
import { SourceBadge } from "@/components/SourceBadge";
import { HonestLimitsCallout } from "@/components/HonestLimitsCallout";
import { getAutomationRisk } from "@/lib/automation-risk";
import wittgensteinData from "@/data/wittgenstein-projections.json";

const AggregateCharts = dynamic(
  () => import("@/components/AggregateCharts").then((m) => m.AggregateCharts),
  { ssr: false, loading: () => <div className="h-[200px] bg-slate-100 rounded-lg animate-pulse" /> }
);
import ghanaData from "@/data/labor-market/ghana.json";
import bangladeshData from "@/data/labor-market/bangladesh.json";
import type { AggregateProfile, LaborMarketSignal } from "@/config/types";

interface LaborDataFile {
  econSignals: LaborMarketSignal[];
  wageRangesBySector: Record<string, { min: number; max: number; median: number; currency: string; year: number }>;
  sectorGrowthRanking: { sector: string; annualGrowthPct: number; source: string }[];
}

const laborDataMap: Record<string, LaborDataFile> = {
  ghana: ghanaData as unknown as LaborDataFile,
  bangladesh: bangladeshData as unknown as LaborDataFile,
};

export default function DashboardPage() {
  const { sessionProfiles, currentCountryId, clearSessionProfiles } = useAppStore();
  const config = getCountryConfig(currentCountryId);
  const laborData = laborDataMap[currentCountryId] ?? ghanaData;

  const aggregate = useMemo<AggregateProfile>(() => {
    if (sessionProfiles.length === 0) {
      return {
        totalProfiles: 0,
        topSkillGaps: [],
        sectorDistribution: [],
        avgPortabilityScore: 0,
        avgAutomationRisk: 0,
        countryBreakdown: [],
      };
    }

    const skillGapCounts: Record<string, number> = {};
    const sectorCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    let totalPortability = 0;
    let totalRisk = 0;

    for (const session of sessionProfiles) {
      const p = session.profile;
      totalPortability += p.portabilityScore;

      // Calculate automation risk for this profile
      const wData = (wittgensteinData.countries as Record<string, typeof wittgensteinData.countries.ghana>)[p.countryId];
      const countryConf = getCountryConfig(p.countryId);
      const projection = {
        country: countryConf.name,
        year2025: wData?.["2025"] ?? wittgensteinData.countries.ghana["2025"],
        year2035: wData?.["2035"] ?? wittgensteinData.countries.ghana["2035"],
        source: wittgensteinData._source,
      };
      const risk = getAutomationRisk(p.iscoMajorGroup, countryConf.automationCalibration, p.countryId, projection);
      totalRisk += risk.adjustedScore;

      // Sector
      const sectorLabel = countryConf.sectorClassification.find((s) => s.id === p.sector)?.localLabel ?? p.sector;
      sectorCounts[sectorLabel] = (sectorCounts[sectorLabel] ?? 0) + 1;

      // Country
      countryCounts[p.countryId] = (countryCounts[p.countryId] ?? 0) + 1;

      // Skill gaps — from ESCO at-risk skills
      for (const skill of p.escoSkills) {
        if (skill.durability === "at_risk") {
          skillGapCounts[skill.label] = (skillGapCounts[skill.label] ?? 0) + 1;
        }
      }
    }

    const n = sessionProfiles.length;
    return {
      totalProfiles: n,
      topSkillGaps: Object.entries(skillGapCounts)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      sectorDistribution: Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, count }))
        .sort((a, b) => b.count - a.count),
      avgPortabilityScore: Math.round(totalPortability / n),
      avgAutomationRisk: Math.round((totalRisk / n) * 100),
      countryBreakdown: Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count })),
    };
  }, [sessionProfiles]);

  const topEconSignals = laborData.econSignals.slice(0, 4) as LaborMarketSignal[];

  function exportCSV() {
    if (sessionProfiles.length === 0) return;
    const rows = [
      ["Name / Role", "Country", "Sector", "Education", "ISCO Code", "Portability Score", "Automation Risk (raw)", "Created At"],
      ...sessionProfiles.map((s) => {
        const p = s.profile;
        const countryConf = getCountryConfig(p.countryId);
        const wData = (wittgensteinData.countries as Record<string, typeof wittgensteinData.countries.ghana>)[p.countryId];
        const projection = { country: countryConf.name, year2025: wData?.["2025"] ?? wittgensteinData.countries.ghana["2025"], year2035: wData?.["2035"] ?? wittgensteinData.countries.ghana["2035"], source: wittgensteinData._source };
        const risk = getAutomationRisk(p.iscoMajorGroup, countryConf.automationCalibration, p.countryId, projection);
        return [
          p.iscoTitle,
          p.countryId,
          p.sector,
          p.educationLevel.localLabel,
          p.iscoCode,
          p.portabilityScore,
          `${(risk.adjustedScore * 100).toFixed(0)}%`,
          p.createdAt,
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unmapped-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
            Program Officer View
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Program Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregate view of skills profiles from this session — {config.name}, {config.region}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {sessionProfiles.length > 0 && (
            <>
              <button
                onClick={exportCSV}
                className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={clearSessionProfiles}
                className="px-3 py-2 text-xs font-semibold border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                Clear Session
              </button>
            </>
          )}
        </div>
      </div>

      {/* KEY ECONOMETRIC SIGNALS — prominently at top, always sourced */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Key Econometric Signals — {config.name}
          </h2>
          <SourceBadge source="ILO ILOSTAT" year={2023} url="https://ilostat.ilo.org/" />
          <SourceBadge source="World Bank WDI" year={2023} url="https://data.worldbank.org/" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topEconSignals.map((signal, i) => (
            <EconSignalCard key={i} signal={signal} highlight={i < 2} />
          ))}
        </div>
      </div>

      {/* Country context strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Human Capital Index",
            value: config.humanCapitalIndex.toFixed(2),
            sub: "World Bank HCI 2020",
            url: "https://www.worldbank.org/en/publication/human-capital",
          },
          {
            label: "Youth NEET Rate",
            value: `${config.neetRate}%`,
            sub: "WDI SL.UEM.NEET.ZS 2022",
            url: "https://data.worldbank.org/indicator/SL.UEM.NEET.ZS",
          },
          {
            label: "Informal Economy Share",
            value: `${(config.informalEconomyShare * 100).toFixed(0)}%`,
            sub: "ILO ILOSTAT 2022",
            url: "https://ilostat.ilo.org/",
          },
          {
            label: "Mobile Internet",
            value: `${config.mobileInternetPenetration}%`,
            sub: "ITU 2023",
            url: "https://www.itu.int/en/ITU-D/Statistics/",
          },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-500 hover:underline"
            >
              {item.sub}
            </a>
          </div>
        ))}
      </div>

      {/* Session aggregate */}
      {sessionProfiles.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-500 mb-4">No profiles yet in this session.</p>
          <Link
            href="/profile"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Complete Skills Wizard →
          </Link>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Profiles", value: aggregate.totalProfiles },
              { label: "Avg Portability", value: `${aggregate.avgPortabilityScore}/100` },
              { label: "Avg Automation Risk", value: `${aggregate.avgAutomationRisk}%` },
              { label: "Countries", value: aggregate.countryBreakdown.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <AggregateCharts aggregate={aggregate} />
        </>
      )}

      <HonestLimitsCallout message="This dashboard reflects profiles generated in the current browser session only — it is not a persistent database. Aggregate statistics are session-level estimates. For production deployment, connect to a backend data store. Econometric signals are sourced from ILO ILOSTAT (2023) and World Bank WDI (2023)." />
    </main>
  );
}
