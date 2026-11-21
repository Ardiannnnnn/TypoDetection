import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sections: ReadonlyArray<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/upload", priority: 0.9, changeFrequency: "weekly" },
    { path: "/guide", priority: 0.8, changeFrequency: "monthly" },
  ];

  return sections.flatMap(({ path, priority, changeFrequency }) =>
    (["en", "id"] as const).map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${path}`,
          id: `${SITE_URL}/id${path}`,
          "x-default": `${SITE_URL}/en${path}`,
        },
      },
    })),
  );
}
