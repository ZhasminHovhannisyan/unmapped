import ghana from "./ghana";
import bangladesh from "./bangladesh";
import type { CountryConfig } from "../types";

export const countryConfigs: Record<string, CountryConfig> = {
  ghana,
  bangladesh,
};

export function getCountryConfig(id: string): CountryConfig {
  const config = countryConfigs[id];
  if (!config) throw new Error(`Country config not found: ${id}`);
  return config;
}

export { ghana, bangladesh };
