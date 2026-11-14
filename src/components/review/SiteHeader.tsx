"use client";

import { FileText } from "lucide-react";
import AppearanceToggle from "./AppearanceToggle";

export default function SiteHeader({ locale, section = "" }: { locale: string; section?: string }) {
  const english = locale === "en";
  return <header className="toolbar site-toolbar" data-section={section}>
    <a className="brand" href={`/${locale}`} aria-label="TypoTrace"><FileText aria-hidden="true"/><span>TypoTrace</span></a>
    <nav className="site-navigation" aria-label={english ? "Main navigation" : "Navigasi utama"}>
      <a href={`/${locale}/guide`} aria-current={section === "/guide" ? "page" : undefined}>{english ? "Guide" : "Panduan"}</a>
      <AppearanceToggle english={english}/>
      <a className="locale-link" href={`/${english ? "id" : "en"}${section}`} aria-label={english ? "Ganti ke Bahasa Indonesia" : "Switch to English"}>{english ? "ID" : "EN"}</a>
      <a className="button primary" href={`/${locale}/upload`}>{english ? "Review PDF" : "Periksa PDF"}</a>
    </nav>
  </header>;
}
