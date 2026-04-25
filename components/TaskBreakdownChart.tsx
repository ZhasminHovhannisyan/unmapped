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
import type { TaskBreakdown } from "@/config/types";

interface TaskBreakdownChartProps {
  breakdown: TaskBreakdown;
}

const taskLabels: Record<keyof TaskBreakdown, string> = {
  routineManual: "Routine Manual",
  routineCognitive: "Routine Cognitive",
  nonRoutineManual: "Non-Routine Manual",
  nonRoutineCognitive: "Non-Routine Cognitive",
  social: "Social / Interpersonal",
};

const taskColors: Record<keyof TaskBreakdown, string> = {
  routineManual: "#ef4444",
  routineCognitive: "#f97316",
  nonRoutineManual: "#f59e0b",
  nonRoutineCognitive: "#10b981",
  social: "#3b82f6",
};

const taskDurability: Record<keyof TaskBreakdown, string> = {
  routineManual: "At risk",
  routineCognitive: "At risk",
  nonRoutineManual: "Moderate",
  nonRoutineCognitive: "High durability",
  social: "High durability",
};

export function TaskBreakdownChart({ breakdown }: TaskBreakdownChartProps) {
  const data = (Object.keys(breakdown) as (keyof TaskBreakdown)[]).map((key) => ({
    name: taskLabels[key],
    value: Math.round(breakdown[key] * 100),
    color: taskColors[key],
    durability: taskDurability[key],
    key,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, 60]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={130}
          />
          <Tooltip
            formatter={(value, _name, entry) => [
              `${value}% of task content`,
              (entry?.payload as { durability?: string } | undefined)?.durability ?? "",
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
