/** % of population aged 20–24 with upper secondary qualifications or above (hardcoded projections). */

const GHANA_SERIES = [
  { year: 2020, value: 32 },
  { year: 2025, value: 38 },
  { year: 2030, value: 45 },
  { year: 2035, value: 51 },
];

const BANGLADESH_SERIES = [
  { year: 2020, value: 28 },
  { year: 2025, value: 35 },
  { year: 2030, value: 42 },
  { year: 2035, value: 49 },
];

const SENTENCES: Record<string, string> = {
  ghana:
    "By 2035, an estimated 51% of 20–24 year olds in Ghana will hold upper secondary qualifications or above — up from 32% in 2020. Skills-based profiles will matter more, not less, as credential competition increases.",
  bangladesh:
    "By 2035, an estimated 49% of 20–24 year olds in Bangladesh will hold upper secondary qualifications or above — up from 28% in 2020. Early skills documentation will be a competitive advantage.",
};

const LABELS: Record<string, string> = {
  ghana: "Ghana",
  bangladesh: "Bangladesh",
};

export function getEducationLandscapeShift(countryId: string): {
  data: { year: number; value: number }[];
  countryLabel: string;
  sentence: string;
} {
  const id = countryId === "bangladesh" ? "bangladesh" : "ghana";
  return {
    data: id === "bangladesh" ? BANGLADESH_SERIES : GHANA_SERIES,
    countryLabel: LABELS[id],
    sentence: SENTENCES[id],
  };
}
