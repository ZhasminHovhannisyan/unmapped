import { countryConfigs, getCountryConfig } from "@/config/countries";
import type { CountryConfig } from "@/config/types";

export { getCountryConfig, countryConfigs };

export function getAllCountryConfigs(): CountryConfig[] {
  return Object.values(countryConfigs);
}

export function getCountryConfigSafe(id: string): CountryConfig | null {
  try {
    return getCountryConfig(id);
  } catch {
    return null;
  }
}
