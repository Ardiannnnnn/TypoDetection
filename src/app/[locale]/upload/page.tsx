import type { Metadata } from "next";
import {
  buildBreadcrumbJsonLd,
  buildSiteMetadata,
  serializeJsonLd,
} from "@/lib/site";
import ReviewWorkspace from "@/components/review/ReviewWorkspace";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return buildSiteMetadata((await params).locale, "/upload");
}

export default async function UploadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const breadcrumb = buildBreadcrumbJsonLd(locale, [
    { name: "TypoTrace", path: "" },
    { name: en ? "Review your PDF" : "Periksa PDF", path: "/upload" },
  ]);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}/>
    <ReviewWorkspace />
  </>;
}
