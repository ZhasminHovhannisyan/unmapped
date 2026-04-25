"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { getCountryConfig } from "@/lib/country-config";
import { getAllChecklistSkills } from "@/lib/skills-mapping";
import { cn } from "@/lib/utils";
import type { WizardFormData } from "@/config/types";

const STEPS = ["Your Context", "Your Work", "Your Skills"];

const defaultForm: WizardFormData = {
  countryId: "ghana",
  age: 22,
  educationLevelId: "",
  sectorId: "",
  yearsExperience: 1,
  jobTitle: "",
  freeTextSkills: "",
  selectedCompetencies: [],
};

export function SkillsWizard() {
  const router = useRouter();
  const { currentCountryId, setCurrentFormData } = useAppStore();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardFormData>({ ...defaultForm, countryId: currentCountryId });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form selections (but not free text) when country changes in navbar
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      countryId: currentCountryId,
      educationLevelId: "",
      sectorId: "",
      selectedCompetencies: [],
    }));
    setStep(0);
  }, [currentCountryId]);

  const config = getCountryConfig(form.countryId);
  const checklistSkills = form.sectorId ? getAllChecklistSkills(form.sectorId) : [];

  function update<K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCompetency(uri: string) {
    setForm((prev) => ({
      ...prev,
      selectedCompetencies: prev.selectedCompetencies.includes(uri)
        ? prev.selectedCompetencies.filter((u) => u !== uri)
        : [...prev.selectedCompetencies, uri],
    }));
  }

  const canProceed = [
    form.educationLevelId !== "" && form.sectorId !== "",
    form.jobTitle !== "" && form.yearsExperience > 0,
    form.freeTextSkills.length > 10,
  ];

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      setCurrentFormData(form);
      const res = await fetch("/api/skills-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Skills mapping failed");
      const data = await res.json();
      useAppStore.getState().setCurrentProfile(data.profile);
      useAppStore.getState().addSessionProfile({
        profile: data.profile,
        formData: form,
        createdAt: new Date().toISOString(),
      });
      router.push("/profile");
    } catch (e) {
      setError("Could not generate your profile. Using offline mode.");
      // Fallback — build locally
      const { buildFallbackProfile } = await import("@/lib/skills-mapping");
      const fallback = buildFallbackProfile(form);
      useAppStore.getState().setCurrentProfile(fallback);
      useAppStore.getState().addSessionProfile({
        profile: fallback,
        formData: form,
        createdAt: new Date().toISOString(),
      });
      router.push("/profile");
    } finally {
      setLoading(false);
    }
  }

  // Demo quick-fill for judges
  function loadAmaraDemo() {
    setForm({
      countryId: currentCountryId,
      age: 22,
      educationLevelId: currentCountryId === "bangladesh" ? "ssc" : "shs",
      sectorId: currentCountryId === "bangladesh" ? "garments_rmd" : "ict_repair",
      yearsExperience: 5,
      jobTitle: currentCountryId === "bangladesh" ? "Garment Quality Checker" : "Phone repair technician",
      freeTextSkills:
        currentCountryId === "bangladesh"
          ? "I work in a garments factory checking quality and measurements. I know different fabric types and can identify defects. I also use mobile banking and help my co-workers with phone issues."
          : "I repair smartphones, tablets and laptops. I diagnose battery, screen, and software problems. I also buy parts in bulk and resell them. I taught myself basic coding from YouTube videos.",
      selectedCompetencies: [],
    });
    setStep(2);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo shortcut for judges */}
      <div className="mb-4 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="text-xs text-amber-700 flex-1">
          <strong>Demo shortcut:</strong> Load a pre-filled profile (Amara scenario for {config.name}) to skip the wizard.
        </span>
        <button
          onClick={loadAmaraDemo}
          className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shrink-0"
        >
          Load Demo →
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                i < step
                  ? "bg-blue-600 text-white"
                  : i === step
                  ? "bg-blue-600 text-white ring-2 ring-blue-200 ring-offset-1"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                i === step ? "text-blue-700" : "text-slate-400"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded",
                  i < step ? "bg-blue-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {step === 0 && (
          <Step1
            form={form}
            config={config}
            update={update}
          />
        )}
        {step === 1 && (
          <Step2
            form={form}
            config={config}
            update={update}
          />
        )}
        {step === 2 && (
          <Step3
            form={form}
            checklistSkills={checklistSkills}
            update={update}
            toggleCompetency={toggleCompetency}
          />
        )}

        {error && (
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed[step]}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !canProceed[step]}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate My Skills Profile →"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Step sub-components ----

type StepProps = {
  form: WizardFormData;
  config: ReturnType<typeof getCountryConfig>;
  update: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void;
};

function Step1({ form, config, update }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Step 1: Your Context</h2>
        <p className="text-sm text-slate-500">Tell us a bit about where you are starting from.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Country / Region
        </label>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-800">
          {config.name} — {config.region}
          <span className="ml-2 text-slate-400 text-xs">(change using switcher in nav)</span>
        </div>
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your Age
        </label>
        <input
          id="age"
          type="number"
          min={15}
          max={35}
          value={form.age}
          onChange={(e) => update("age", parseInt(e.target.value) || 18)}
          className="w-32 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Highest Education Level
        </label>
        <div className="space-y-2">
          {config.educationTaxonomy.map((level) => (
            <label
              key={level.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                form.educationLevelId === level.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <input
                type="radio"
                name="educationLevel"
                value={level.id}
                checked={form.educationLevelId === level.id}
                onChange={() => update("educationLevelId", level.id)}
                className="mt-0.5 accent-blue-600"
              />
              <div>
                <p className="text-sm font-medium text-slate-800">{level.localLabel}</p>
                <p className="text-xs text-slate-500">ISCED Level: {level.isced.replace(/_/g, " ")} · {level.yearsOfSchooling} years of schooling</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Your Main Sector / Work Area
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {config.sectorClassification.map((sector) => (
            <label
              key={sector.id}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors",
                form.sectorId === sector.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <input
                type="radio"
                name="sector"
                value={sector.id}
                checked={form.sectorId === sector.id}
                onChange={() => update("sectorId", sector.id)}
                className="accent-blue-600"
              />
              <span className="text-sm text-slate-800">{sector.localLabel}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ form, update }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Step 2: Your Work</h2>
        <p className="text-sm text-slate-500">Tell us about the work you actually do.</p>
      </div>

      <div>
        <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your Job or Role Title
        </label>
        <input
          id="jobTitle"
          type="text"
          placeholder="e.g. Phone repair technician, Market trader, Farm supervisor…"
          value={form.jobTitle}
          onChange={(e) => update("jobTitle", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="years" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Years of Experience in This Work
        </label>
        <input
          id="years"
          type="number"
          min={0}
          max={25}
          value={form.yearsExperience}
          onChange={(e) => update("yearsExperience", parseInt(e.target.value) || 0)}
          className="w-32 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="freeText" className="block text-sm font-semibold text-slate-700 mb-1.5">
          In your own words — what do you actually do and know how to do?
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Don't worry about formal language. Write however you naturally speak. Include informal skills, things you taught yourself, languages you speak, or any other relevant capabilities.
        </p>
        <textarea
          id="freeText"
          rows={5}
          placeholder="e.g. I repair phones and tablets — diagnose battery, screen, and software problems. I also buy parts in bulk and resell them. I taught myself coding from YouTube and can build simple websites…"
          value={form.freeTextSkills}
          onChange={(e) => update("freeTextSkills", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">{form.freeTextSkills.length} characters</p>
      </div>
    </div>
  );
}

function Step3({
  form,
  checklistSkills,
  update,
  toggleCompetency,
}: {
  form: WizardFormData;
  checklistSkills: { uri: string; label: string }[];
  update: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void;
  toggleCompetency: (uri: string) => void;
}) {
  void update; // used by parent
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Step 3: Your Skills</h2>
        <p className="text-sm text-slate-500">
          Select the skills you actually use in your work. This helps us map to international skill standards.
        </p>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {checklistSkills.map((skill) => (
          <label
            key={skill.uri}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
              form.selectedCompetencies.includes(skill.uri)
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <input
              type="checkbox"
              checked={form.selectedCompetencies.includes(skill.uri)}
              onChange={() => toggleCompetency(skill.uri)}
              className="accent-blue-600 w-4 h-4 shrink-0"
            />
            <span className="text-sm text-slate-800">{skill.label}</span>
          </label>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Selected: {form.selectedCompetencies.length} of {checklistSkills.length} skills.
        You can proceed with any selection — the more you select, the richer your profile.
      </p>
    </div>
  );
}
