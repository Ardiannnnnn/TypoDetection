import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/upload", "/guide"].flatMap(section => ["id", "en"].map(locale => ({
    url: `${SITE_URL}/${locale}${section}`,
    alternates: { languages: { id: `${SITE_URL}/id${section}`, en: `${SITE_URL}/en${section}` } },
  })));
}
