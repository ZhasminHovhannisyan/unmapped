import { NextRequest, NextResponse } from "next/server";
import { buildFallbackProfile, buildLocalProfile } from "@/lib/skills-mapping";
import { getCountryConfig } from "@/lib/country-config";
import type { WizardFormData, ESCOSkill } from "@/config/types";

export async function POST(req: NextRequest) {
  const formData: WizardFormData = await req.json();

  // Try OpenAI if key is configured
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.length > 10) {
    try {
      const config = getCountryConfig(formData.countryId);
      const sector = config.sectorClassification.find((s) => s.id === formData.sectorId);
      const education = config.educationTaxonomy.find((e) => e.id === formData.educationLevelId);

      const prompt = `You are a labor market analyst for the World Bank. Map this person's skills to ISCO-08 and ESCO standards.

Context:
- Country: ${config.name} (${config.region})
- Sector: ${sector?.localLabel}
- Education: ${education?.localLabel} (ISCED: ${education?.isced})
- Job title: ${formData.jobTitle}
- Years experience: ${formData.yearsExperience}
- Self-description: "${formData.freeTextSkills}"
- Selected skills: ${formData.selectedCompetencies.length} items

Return ONLY a JSON object with:
{
  "iscoCode": "4-digit ISCO-08 code",
  "iscoTitle": "occupation title",
  "escoSkills": [
    {"uri": "short-id", "label": "skill label", "proficiencyEstimate": "basic|intermediate|advanced", "durability": "high|moderate|at_risk"}
  ],
  "softSkills": ["skill1", "skill2", "skill3"],
  "informalAssets": ["asset1", "asset2"],
  "portabilityScore": 0-100,
  "humanReadableSummary": "2-3 sentences written directly to the person (use 'you'/'your'). Plain language, no jargon. Explain what they can do and why their skills matter."
}

Rules: portabilityScore above 60 if they have 3+ years experience. Be generous about informal skills — they are real. humanReadableSummary must be empowering, specific, and honest.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResult = JSON.parse(data.choices[0].message.content) as {
          iscoCode: string;
          iscoTitle: string;
          escoSkills: ESCOSkill[];
          softSkills: string[];
          informalAssets: string[];
          portabilityScore: number;
          humanReadableSummary: string;
        };

        const profile = buildLocalProfile(formData, aiResult);
        return NextResponse.json({ profile, source: "ai" });
      }
    } catch (err) {
      console.error("OpenAI mapping failed, falling back:", err);
    }
  }

  // Fallback: rule-based profile
  const profile = buildFallbackProfile(formData);
  return NextResponse.json({ profile, source: "fallback" });
}
