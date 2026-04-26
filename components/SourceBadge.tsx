"use client";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: string;
  year?: number;
  url?: string;
  className?: string;
  /** When set, used as the native tooltip (`title`) on the badge/link. */
  tooltip?: string;
}

export function SourceBadge({ source, year, url, className, tooltip }: SourceBadgeProps) {
  const label = year ? `${source} ${year}` : source;
  const titleText = tooltip ?? `Data source: ${label}`;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors border border-slate-200",
          className
        )}
        title={titleText}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 5h8M5 1v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {label}
      </a>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200",
        className
      )}
      title={titleText}
    >
      {label}
    </span>
  );
}
