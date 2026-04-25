import { NextRequest, NextResponse } from "next/server";
import { matchOpportunities } from "@/lib/opportunity-matching";
import { getCountryConfig } from "@/lib/country-config";
import type { SkillsProfile } from "@/config/types";

export async function POST(req: NextRequest) {
  const { profile }: { profile: SkillsProfile } = await req.json();
  const config = getCountryConfig(profile.countryId);
  const result = matchOpportunities(profile, config);
  return NextResponse.json(result);
}
