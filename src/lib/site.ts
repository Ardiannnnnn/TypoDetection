import type { Metadata } from "next";
import { notFound } from "next/navigation";

const DEFAULT_SITE_URL = "https://checkyourpaper.jry.codes";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Public deployment target. Reads NEXT_PUBLIC_SITE_URL with fallback. */
export const SITE_URL = resolveSiteUrl();

export const siteCopy = {
  id: {
    title: "TypoTrace — Periksa ejaan dan italic pada PDF laporan",
    description: "Tinjau dugaan kesalahan ejaan dan istilah asing yang belum italic pada PDF laporan atau skripsi. Lihat temuan per halaman dan unduh PDF berhighlight.",
  },
  en: {
    title: "TypoTrace — Review spelling and italics in PDF reports",
    description: "Review possible spelling issues and foreign terms that need italics in Indonesian PDF reports. Inspect findings by page and download an annotated PDF.",
  },
};

export function buildSiteMetadata(locale: string, section = ""): Metadata {
  if (locale !== "id" && locale !== "en") notFound();
  const en = locale === "en";
  const copy = section === "/guide"
    ? { title: en ? "Understanding your PDF review — TypoTrace" : "Panduan membaca hasil PDF — TypoTrace", description: en ? "Understand spelling highlights, missing italics and review items in TypoTrace." : "Kenali arti highlight ejaan, istilah belum miring, dan bagian yang perlu ditinjau pada hasil TypoTrace." }
    : section === "/upload"
    ? { title: en ? "Review your PDF — TypoTrace" : "Periksa PDF laporan Anda — TypoTrace", description: en ? "Upload your Indonesian PDF report and review possible spelling issues and missing italics by page." : "Unggah PDF laporan dan tinjau kandidat salah ejaan serta istilah yang belum miring per halaman." }
    : siteCopy[locale];
  const indexable = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
  return {
    metadataBase: new URL(SITE_URL),
    ...copy,
    applicationName: "TypoTrace",
    icons: { icon: "/favicon.svg" },
    alternates: { canonical: `/${locale}${section}`, languages: { id: `/id${section}`, en: `/en${section}`, "x-default": `/en${section}` } },
    robots: { index: indexable, follow: true },
    openGraph: { ...copy, url: `/${locale}${section}`, siteName: "TypoTrace", type: "website", locale: en ? "en_US" : "id_ID", alternateLocale: en ? "id_ID" : "en_US", images: [{ url: "/share-card.png", width: 1200, height: 630, alt: "TypoTrace — PDF review" }] },
    twitter: { card: "summary_large_image", ...copy, images: ["/share-card.png"] },
  };
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildWebApplicationJsonLd(locale: string): Record<string, unknown> {
  const lang = locale === "id" ? "id" : "en";
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TypoTrace",
    url: `${SITE_URL}/${lang}`,
    description: siteCopy[lang].description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: ["en", "id"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildBreadcrumbJsonLd(
  locale: string,
  items: ReadonlyArray<{ name: string; path: string }>,
): Record<string, unknown> {
  const lang = locale === "id" ? "id" : "en";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}/${lang}${item.path}`,
    })),
  };
}

export function buildFaqJsonLd(
  faqs: ReadonlyArray<readonly [string, string]>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
