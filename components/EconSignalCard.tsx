import { SourceBadge } from "./SourceBadge";
import { cn } from "@/lib/utils";
import type { LaborMarketSignal } from "@/config/types";

interface EconSignalCardProps {
  signal: LaborMarketSignal;
  className?: string;
  highlight?: boolean;
}

const signalIcons: Record<LaborMarketSignal["signalType"], string> = {
  sector_growth: "↑",
  wage_floor: "$",
  returns_to_education: "🎓",
  neet_rate: "!",
  employment_growth: "⊕",
};

const signalColors: Record<LaborMarketSignal["signalType"], string> = {
  sector_growth: "bg-emerald-50 border-emerald-200",
  wage_floor: "bg-blue-50 border-blue-200",
  returns_to_education: "bg-purple-50 border-purple-200",
  neet_rate: "bg-red-50 border-red-200",
  employment_growth: "bg-sky-50 border-sky-200",
};

const valueColors: Record<LaborMarketSignal["signalType"], string> = {
  sector_growth: "text-emerald-700",
  wage_floor: "text-blue-700",
  returns_to_education: "text-purple-700",
  neet_rate: "text-red-700",
  employment_growth: "text-sky-700",
};

export function EconSignalCard({ signal, className, highlight }: EconSignalCardProps) {
  const icon = signalIcons[signal.signalType];
  const colorClass = signalColors[signal.signalType];
  const valueColor = valueColors[signal.signalType];

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        colorClass,
        highlight && "ring-2 ring-offset-1 ring-blue-300",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {signal.signalType.replace(/_/g, " ")}
          </span>
        </div>
        <SourceBadge source={signal.source} year={signal.year} url={signal.sourceUrl} />
      </div>

      <p className="text-sm font-semibold text-slate-800 mb-1">{signal.label}</p>

      <p className={cn("text-2xl font-bold tabular-nums mb-1", valueColor)}>
        {typeof signal.value === "number"
          ? signal.signalType === "wage_floor"
            ? `$${signal.value}`
            : `${signal.value}${signal.unit.startsWith("%") ? "%" : ""}`
          : signal.value}
        {signal.unit && !signal.unit.startsWith("%") && signal.signalType !== "wage_floor" && (
          <span className="text-sm font-normal text-slate-500 ml-1">{signal.unit}</span>
        )}
      </p>

      <p className="text-xs text-slate-600 leading-relaxed">{signal.description}</p>
    </div>
  );
}
