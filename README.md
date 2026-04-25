# UNMAPPED
### Closing the distance between real skills and economic opportunity in the age of AI

**World Bank Youth Summit Hackathon · Challenge 05**  
*In collaboration with MIT Club of Northern California and MIT Club of Germany*

---

## What is UNMAPPED?

UNMAPPED is an **open, localizable infrastructure layer** — not a closed app — that connects a young person's real skills to real economic opportunity in low- and middle-income countries (LMICs).

It is designed so any government, NGO, training provider, or employer can plug in country-specific data (labor market, education taxonomy, language, automation calibration) **without changing a line of code**.

### Meet Amara
She is 22, lives outside Accra, holds a secondary school certificate, runs a phone repair business since 17, and taught herself coding from YouTube on a shared mobile connection. She has real skills — but to the formal economy, she is **unmapped**. UNMAPPED is built for her.

---

## Three Modules

| Module | Description |
|--------|-------------|
| **01 Skills Signal Engine** | 3-step wizard → portable ESCO/ISCO-08 skills profile |
| **02 AI Readiness & Displacement Risk** | Frey-Osborne + ILO task indices, LMIC-calibrated |
| **03 Opportunity Matching + Dashboard** | Real econometric signals, dual youth/policymaker view |

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Optional: AI-powered skills mapping

Add your OpenAI API key to `.env.local` to enable GPT-4o skills mapping:
```
OPENAI_API_KEY=sk-...
```

Without it, the app uses rule-based fallback mapping — **fully functional for demo purposes**.

---

## Demo Flow

1. **Homepage** → See the "Country-Agnostic Design" section
2. **Skills Wizard** (`/profile`) → Use "Load Demo →" button for Amara's pre-filled scenario, OR complete the 3 steps manually
3. **AI Readiness** (`/readiness`) → Risk gauge, task breakdown, Wittgenstein projections
4. **Opportunities** (`/opportunities`) → Real econometric signals + matched roles
5. **Program Dashboard** (`/dashboard`) → Policymaker view, aggregate charts, CSV export
6. **Switch context** using the Ghana / Bangladesh buttons in the navbar

---

## Country-Agnostic Architecture

Switch between **Ghana (Sub-Saharan Africa)** and **Bangladesh (South Asia)** using the top navigation. The following reconfigures automatically:

- Education taxonomy (WASSCE/SHS ↔ SSC/HSC)
- Sector classifications mapped to ISCO-08
- Automation calibration (infrastructure multiplier, digital readiness)
- Labor market wage data and sector growth signals
- Opportunity types (Ghana: formal/self-employment/gig; Bangladesh: + cooperative)
- All econometric signal cards

To add a new country: create `/config/countries/[id].ts` and `/data/labor-market/[id].json`. Zero code changes required.

---

## Data Sources

All data is real, sourced, and cited inline throughout the app.

| Source | Usage |
|--------|-------|
| **ILO ILOSTAT** (2023) | Sector employment growth, wage floors, formal employment share |
| **World Bank WDI** (2023) | Youth NEET rate, development indicators |
| **World Bank Human Capital Index** (2020) | Returns to education, HCI scores |
| **Frey & Osborne** (2013) | Automation probability scores by ISCO major group |
| **ILO Task Indices** (2023) | Routine vs non-routine task content by occupation |
| **Wittgenstein Centre** (2023) | Education attainment projections 2025–2035 (SSP2 scenario) |
| **ESCO v1.2** | Skills taxonomy, occupation-skill mappings |
| **ISCO-08** | Occupational classification standard |
| **ITU** (2023) | Digital readiness, mobile internet penetration |

### LMIC Calibration Formula
```
adjustedRisk = freyOsborneRisk 
  × automationCalibration.infrastructureMultiplier 
  × (1 − formalEmploymentShare × 0.3)
```
This formula is shown transparently to all users in the AI Readiness module.

---

## Technical Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (system font, no web fonts)
- **Recharts** (dynamically imported for performance)
- **Zustand** (persistent state)
- **OpenAI API** (optional, graceful fallback)

---

## Design Principles

- **Infrastructure, not product**: country config is a pluggable JSON/TS file
- **Design for constraint**: system font, progressive enhancement, mobile-first
- **Show the data**: every number has a `SourceBadge` (source + year + link)
- **Be honest**: `HonestLimitsCallout` on every data page
- **No aspirational matching**: wages shown as realistic ranges, not ceilings

---

*UNMAPPED — Built for the World Bank Youth Summit Hackathon, 2026*
