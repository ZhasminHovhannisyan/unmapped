"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { WittgensteinProjection } from "@/config/types";

interface WittgensteinChartProps {
  projection: WittgensteinProjection;
}

const LEVELS = [
  { key: "noEducation", label: "No Education", color: "#ef4444" },
  { key: "primary", label: "Primary", color: "#f97316" },
  { key: "lowerSecondary", label: "Lower Secondary", color: "#f59e0b" },
  { key: "upperSecondary", label: "Upper Secondary", color: "#3b82f6" },
  { key: "postSecondary", label: "Post-Secondary", color: "#8b5cf6" },
  { key: "tertiary", label: "Tertiary", color: "#10b981" },
] as const;

export function WittgensteinChart({ projection }: WittgensteinChartProps) {
  const data = [
    {
      year: "2025",
      ...Object.fromEntries(
        LEVELS.map((l) => [l.key, Math.round(projection.year2025[l.key] * 100)])
      ),
    },
    {
      year: "2035",
      ...Object.fromEntries(
        LEVELS.map((l) => [l.key, Math.round(projection.year2035[l.key] * 100)])
      ),
    },
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name as string]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            iconType="square"
            iconSize={8}
          />
          {LEVELS.map((level) => (
            <Bar
              key={level.key}
              dataKey={level.key}
              name={level.label}
              stackId="a"
              fill={level.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 text-right mt-1">
        Source: {projection.source.split(".")[0]}
      </p>
    </div>
  );
}
