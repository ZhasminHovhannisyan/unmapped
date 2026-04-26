"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/** Ensures `hasHydrated` flips after zustand/persist finishes (SSR-safe). */
export function StoreHydration() {
  useEffect(() => {
    const mark = () => useAppStore.getState().setHasHydrated(true);

    const unsub = useAppStore.persist.onFinishHydration(mark);
    if (useAppStore.persist.hasHydrated()) {
      mark();
    }
    return unsub;
  }, []);

  return null;
}
