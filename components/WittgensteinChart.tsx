"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface EducationLandscapePoint {
  year: number;
  value: number;
}

interface WittgensteinChartProps {
  data: EducationLandscapePoint[];
  countryLabel: string;
}

export function WittgensteinChart({ data, countryLabel }: WittgensteinChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "% 20–24 with upper secondary+"]}
            labelFormatter={(y) => `${y}`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name={`${countryLabel} (upper secondary+)`}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#3b82f6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 text-right mt-1">
        % aged 20–24 with upper secondary qualifications or above · {countryLabel}
      </p>
    </div>
  );
}
