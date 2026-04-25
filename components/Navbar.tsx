"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CountryConfigSwitcher } from "./CountryConfigSwitcher";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Skills Wizard" },
  { href: "/readiness", label: "AI Readiness" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/dashboard", label: "Program Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-lg tracking-tight text-slate-900">
            UN<span className="text-blue-600">MAPPED</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === link.href
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CountryConfigSwitcher />
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 border-t border-slate-100">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors",
              pathname === link.href
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
