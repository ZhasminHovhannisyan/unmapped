"use client";

interface RiskGaugeProps {
  score: number;   // 0–1
  riskLabel: "low" | "moderate" | "high";
}

export function RiskGauge({ score, riskLabel }: RiskGaugeProps) {
  const pct = Math.round(score * 100);

  // SVG semicircle gauge
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circumference = Math.PI * radius; // half circle
  const strokeDashoffset = circumference * (1 - score);

  const trackColor = "#e2e8f0";
  const fillColors = {
    low: "#10b981",
    moderate: "#f59e0b",
    high: "#ef4444",
  };

  return (
    <div className="flex flex-col items-center w-44 shrink-0">
      <div className="relative w-44 h-24 overflow-hidden">
        <svg
          viewBox="0 0 160 90"
          className="w-full h-full"
          aria-label={`Automation risk: ${pct}% — ${riskLabel}`}
        >
          {/* Track */}
          <path
            d={`M 20 80 A 60 60 0 0 1 140 80`}
            fill="none"
            stroke={trackColor}
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M 20 80 A 60 60 0 0 1 140 80`}
            fill="none"
            stroke={fillColors[riskLabel]}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          {/* Center text */}
          <text
            x="80"
            y="70"
            textAnchor="middle"
            className="font-black"
            fontSize="22"
            fontWeight="900"
            fill={fillColors[riskLabel]}
          >
            {pct}%
          </text>
        </svg>
      </div>
      <p className="text-xs text-slate-500 -mt-1 text-center">
        LMIC-Adjusted Risk
      </p>
    </div>
  );
}
