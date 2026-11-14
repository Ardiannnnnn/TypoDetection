import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
  return {
    rules: { userAgent: "*", ...(indexable ? { allow: "/" } : { disallow: "/" }) },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
