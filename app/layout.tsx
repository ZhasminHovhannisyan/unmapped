import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { StoreHydration } from "@/components/StoreHydration";

export const metadata: Metadata = {
  title: "UNMAPPED — Skills to Opportunity",
  description:
    "Closing the distance between real skills and economic opportunity in the age of AI. World Bank Youth Summit Hackathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <StoreHydration />
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
