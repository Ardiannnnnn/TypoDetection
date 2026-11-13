import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "./providers";

const locales = ["en", "id"];
export const metadata: Metadata = {
  title: "TypoTrace — Tinjau laporan Anda",
  description: "Alat bantu meninjau dugaan salah tulis dan bagian asing yang belum italic pada PDF laporan. Temuan otomatis tetap perlu diperiksa penulis.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "TypoTrace — Ruang tinjau laporan", description: "Mulai dari PDF, lalu tinjau setiap temuan.", siteName: "TypoTrace", type: "website" },
};
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();
  return <html lang={locale}><body><Providers messages={messages} locale={locale}>{children}</Providers></body></html>;
}
