"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SkillsProfile, WizardFormData } from "@/config/types";

interface ProfileSession {
  profile: SkillsProfile;
  formData: WizardFormData;
  createdAt: string;
}

interface AppStore {
  currentCountryId: string;
  setCurrentCountryId: (id: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;

  currentProfile: SkillsProfile | null;
  setCurrentProfile: (profile: SkillsProfile | null) => void;

  currentFormData: WizardFormData | null;
  setCurrentFormData: (data: WizardFormData) => void;

  sessionProfiles: ProfileSession[];
  addSessionProfile: (session: ProfileSession) => void;
  clearSessionProfiles: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentCountryId: "ghana",
      setCurrentCountryId: (id) => set({ currentCountryId: id }),

      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      currentProfile: null,
      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      currentFormData: null,
      setCurrentFormData: (data) => set({ currentFormData: data }),

      sessionProfiles: [],
      addSessionProfile: (session) =>
        set((state) => ({
          sessionProfiles: [...state.sessionProfiles, session],
        })),
      clearSessionProfiles: () => set({ sessionProfiles: [] }),
    }),
    {
      name: "unmapped-store",
      partialize: (state) => ({
        currentCountryId: state.currentCountryId,
        currentProfile: state.currentProfile,
        currentFormData: state.currentFormData,
        sessionProfiles: state.sessionProfiles,
      }),
    }
  )
);
