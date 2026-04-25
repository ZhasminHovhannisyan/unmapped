import { cn } from "@/lib/utils";

interface HonestLimitsCalloutProps {
  message: string;
  className?: string;
}

export function HonestLimitsCallout({ message, className }: HonestLimitsCalloutProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50",
        className
      )}
      role="note"
      aria-label="Limitations notice"
    >
      <svg
        className="shrink-0 mt-0.5 text-amber-500"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 2L1.5 15.5h15L9 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 7v4M9 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-sm text-amber-800 leading-relaxed">{message}</p>
    </div>
  );
}
