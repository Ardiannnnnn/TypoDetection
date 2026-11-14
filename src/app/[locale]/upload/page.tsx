import type { Metadata } from "next";
import { buildSiteMetadata } from "@/lib/site";
import ReviewWorkspace from "@/components/review/ReviewWorkspace";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return buildSiteMetadata((await params).locale, "/upload");
}

export default function UploadPage() {
  return <ReviewWorkspace />;
}
