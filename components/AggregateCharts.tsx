"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AggregateProfile } from "@/config/types";

interface AggregateChartsProps {
  aggregate: AggregateProfile;
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#6366f1"];

export function AggregateCharts({ aggregate }: AggregateChartsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Top skill gaps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Top Skill Gaps Across Profiles</h3>
        <p className="text-xs text-slate-500 mb-4">At-risk skills appearing most frequently (ESCO taxonomy)</p>
        {aggregate.topSkillGaps.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No at-risk skills found in current profiles.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={aggregate.topSkillGaps}
              layout="vertical"
              margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="skill"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip
                formatter={(v) => [`${v} profiles`, "Count"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {aggregate.topSkillGaps.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sector distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Sector Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Where session users are working</p>
        {aggregate.sectorDistribution.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No sector data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={aggregate.sectorDistribution}
              layout="vertical"
              margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="sector"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip
                formatter={(v) => [`${v} profiles`, "Count"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {aggregate.sectorDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
