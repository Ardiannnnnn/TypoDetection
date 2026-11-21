"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import AppearanceToggle from "./AppearanceToggle";

export default function SiteHeader({ locale, section = "" }: { locale: string; section?: string }) {
  const english = locale === "en";
  return <header className="toolbar site-toolbar" data-section={section}>
    <Link className="brand" href={`/${locale}`} aria-label="Check Your Paper" aria-current={section === "" ? "page" : undefined}><FileText aria-hidden="true"/><span className="brand-wordmark"><strong>Check</strong><span>your paper</span></span></Link>
    <nav className="site-navigation" aria-label={english ? "Main navigation" : "Navigasi utama"}>
      <Link href={`/${locale}/guide`} aria-current={section === "/guide" ? "page" : undefined}>{english ? "Guide" : "Panduan"}</Link>
      <AppearanceToggle english={english}/>
      <Link className="locale-link" href={`/${english ? "id" : "en"}${section}`} scroll={false} aria-label={english ? "Ganti ke Bahasa Indonesia" : "Switch to English"}>{english ? "ID" : "EN"}</Link>
      <Link className="button primary" href={`/${locale}/upload`}>{english ? "Review PDF" : "Periksa PDF"}</Link>
    </nav>
  </header>;
}
