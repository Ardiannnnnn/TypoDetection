import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "./providers";
import { buildSiteMetadata } from "@/lib/site";

const locales = ["en", "id"];
export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return buildSiteMetadata((await params).locale);
}
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();
  return <html lang={locale} suppressHydrationWarning><body><Providers messages={messages} locale={locale}>{children}</Providers></body></html>;
}
