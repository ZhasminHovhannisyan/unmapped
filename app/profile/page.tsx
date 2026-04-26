"use client";
import { useAppStore } from "@/lib/store";
import { SkillsWizard } from "@/components/SkillsWizard";
import { SkillsProfileCard } from "@/components/SkillsProfileCard";
import { SourceBadge } from "@/components/SourceBadge";

export default function ProfilePage() {
  const { currentProfile, hasHydrated } = useAppStore();

  if (!hasHydrated) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="h-96 bg-slate-100 rounded-xl animate-pulse" />
      </main>
    );
  }

  if (currentProfile) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <SkillsProfileCard profile={currentProfile} />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Module 01</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Skills Signal Engine</h1>
        <p className="text-slate-500 text-sm max-w-xl mb-3">
          Map your real skills to internationally recognised standards. This 3-step wizard creates a portable profile grounded in ESCO and ISCO-08 occupational taxonomies.
        </p>
        <div className="flex gap-2">
          <SourceBadge source="ESCO v1.2" url="https://esco.ec.europa.eu" />
          <SourceBadge source="ISCO-08" url="https://www.ilo.org/public/english/bureau/stat/isco/isco08/" />
        </div>
      </div>
      <SkillsWizard />
    </main>
  );
}
