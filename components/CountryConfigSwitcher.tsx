"use client";
import { useAppStore } from "@/lib/store";
import { countryConfigs } from "@/config/countries";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { SkillsProfile } from "@/config/types";

export function CountryConfigSwitcher() {
  const { currentCountryId, setCurrentCountryId, setCurrentProfile } = useAppStore();
  const router = useRouter();

  const countries = Object.values(countryConfigs);

  function handleSwitch(id: string) {
    if (id === currentCountryId) return;
    setCurrentCountryId(id);
    // Clear profile so the new country context is clean; no router.refresh()
    // needed — all components react to the Zustand store update directly.
    setCurrentProfile(null as unknown as SkillsProfile);
    router.push("/profile");
  }

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
      {countries.map((c) => (
        <button
          key={c.id}
          onClick={() => handleSwitch(c.id)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
            currentCountryId === c.id
              ? "bg-white shadow-sm text-slate-900 border border-slate-200"
              : "text-slate-500 hover:text-slate-700"
          )}
          title={`Switch to ${c.name} (${c.region})`}
        >
          {c.name}
          <span className="hidden sm:inline text-slate-400 font-normal"> · {c.region}</span>
        </button>
      ))}
    </div>
  );
}
