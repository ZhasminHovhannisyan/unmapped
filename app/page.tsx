import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
              World Bank Youth Summit · Challenge 05
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              UN<span className="text-blue-400">MAPPED</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 font-medium mb-4 leading-snug">
              Closing the distance between real skills and economic opportunity in the age of AI.
            </p>
            <p className="text-slate-400 text-base mb-10 max-w-xl leading-relaxed">
              If you have skills but no employer knows you exist — if you are invisible to the formal economy — UNMAPPED is for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/profile"
                className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Map Your Skills →
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors text-sm border border-white/20"
              >
                Program Officer Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amara story */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Meet Amara</p>
            <blockquote className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed mb-4 border-l-4 border-blue-400 pl-5">
              "She is 22, lives outside Accra, runs a phone repair business since 17, taught herself coding from YouTube on a shared mobile connection. She has real skills. But to the formal economy — she is unmapped."
            </blockquote>
            <p className="text-sm text-slate-500">
              She is not the exception. Over 600 million young people across LMICs hold skills that broken credentialing systems and absent matching infrastructure render economically invisible.
            </p>
          </div>
        </div>
      </section>

      {/* Three failures */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Three Failures. One Platform.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              number: "01",
              title: "Broken Signals",
              desc: "Education credentials don't translate into labor market signals. A secondary school certificate tells an employer almost nothing. Informal skills are invisible.",
              color: "border-red-200 bg-red-50",
              numColor: "text-red-400",
            },
            {
              number: "02",
              title: "AI Disruption Without Readiness",
              desc: "Automation is arriving unevenly. Jobs in routine and manual work — disproportionately held by young LMIC workers — face the highest disruption risk.",
              color: "border-amber-200 bg-amber-50",
              numColor: "text-amber-400",
            },
            {
              number: "03",
              title: "No Matching Infrastructure",
              desc: "Even where skills and jobs exist in the same place, the connective tissue is absent. Matching happens through informal networks that exclude the most vulnerable.",
              color: "border-blue-200 bg-blue-50",
              numColor: "text-blue-400",
            },
          ].map((item) => (
            <div key={item.number} className={`rounded-2xl border p-6 ${item.color}`}>
              <p className={`text-3xl font-black mb-3 ${item.numColor}`}>{item.number}</p>
              <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Localizability section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
                Country-Agnostic Design
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Not an app. A configurable infrastructure layer.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Any government, NGO, training provider, or employer can plug in their own country data — without changing a line of code. Switch the context in the top navigation to see it live.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                {[
                  "Labor market data source and wage structure",
                  "Education taxonomy and credential mapping",
                  "Automation exposure calibration (LMIC-adjusted)",
                  "Opportunity types (formal, self-employment, gig, cooperative)",
                  "UI language and script",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-64 shrink-0">
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500">Two demo contexts, zero code changes</p>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { country: "Ghana", region: "Sub-Saharan Africa, urban informal", sectors: "ICT Repair · Mobile Money · Trade", color: "bg-blue-50 border-blue-200" },
                    { country: "Bangladesh", region: "South Asia, garments sector", sectors: "RMG · ICT Freelancing · Agriculture", color: "bg-purple-50 border-purple-200" },
                  ].map((ctx) => (
                    <div key={ctx.country} className={`rounded-lg border p-3 ${ctx.color}`}>
                      <p className="text-sm font-bold text-slate-900">{ctx.country}</p>
                      <p className="text-xs text-slate-500">{ctx.region}</p>
                      <p className="text-[11px] text-slate-600 mt-1">{ctx.sectors}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three modules */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">Three Modules</h2>
          <p className="text-sm text-slate-500 text-center mb-10 max-w-lg mx-auto">
            UNMAPPED is an open, localizable infrastructure layer — not an app. Any government, NGO, or employer can plug in their own country data.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Skills Signal Engine",
                desc: "Map informal experience, education, and demonstrated competencies to ESCO/ISCO-08 — producing a portable, human-readable skills profile Amara can own.",
                href: "/profile",
                cta: "Start Wizard →",
                bg: "bg-blue-600",
              },
              {
                num: "02",
                title: "AI Readiness Lens",
                desc: "Calibrated-for-LMIC automation risk assessment. Which skills are durable, which are at risk, and what adjacent skills build resilience — using Frey-Osborne + ILO task indices.",
                href: "/readiness",
                cta: "View Readiness →",
                bg: "bg-purple-600",
              },
              {
                num: "03",
                title: "Opportunity Matching",
                desc: "Real econometric signals — sector growth, wage floors, returns to education — matched to your profile. Honest, grounded, reachable. Dual view: youth + policymaker.",
                href: "/opportunities",
                cta: "See Opportunities →",
                bg: "bg-emerald-600",
              },
            ].map((mod) => (
              <div key={mod.num} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
                <div className={`w-10 h-10 rounded-xl ${mod.bg} text-white flex items-center justify-center text-sm font-bold mb-4`}>
                  {mod.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{mod.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">{mod.desc}</p>
                <Link
                  href={mod.href}
                  className={`text-sm font-semibold ${mod.bg.replace("bg-", "text-")} hover:underline`}
                >
                  {mod.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data sources strip */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 text-center mb-5">
          Grounded in Real Data
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "ILO ILOSTAT", "World Bank WDI", "World Bank HCI", "ESCO v1.2",
            "ISCO-08", "Frey & Osborne 2013", "ILO Task Indices", "Wittgenstein Centre",
            "ITU 2023", "World Bank WBES",
          ].map((src) => (
            <span
              key={src}
              className="px-3 py-1 rounded-full text-xs text-slate-600 bg-slate-100 border border-slate-200"
            >
              {src}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-400 space-y-1">
          <p>UNMAPPED — Built for the World Bank Youth Summit Hackathon, 2025</p>
          <p>In collaboration with MIT Club of Northern California and MIT Club of Germany</p>
          <p className="mt-2">
            All data sourced from publicly available datasets. Not a substitute for professional career advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
