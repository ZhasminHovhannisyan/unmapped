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

  currentProfile: SkillsProfile | null;
  setCurrentProfile: (profile: SkillsProfile) => void;

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
    }
  )
);
