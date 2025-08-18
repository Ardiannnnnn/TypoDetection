import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { poppins } from "../fonts";
import Footer from "@/components/Footer"
import { Providers } from "./providers";

const locales = ["en", "id"];

export const metadata: Metadata = {
  title: "TypoTrace | Deteksi Typo Laporan & Skripsi Secara Otomatis",
  description:
    "TypoTrace membantu mendeteksi dan memperbaiki kesalahan penulisan (typo) pada laporan, skripsi, atau dokumen akademik Anda dengan cepat, otomatis, dan akurat.",
  keywords: ["deteksi typo", "skripsi", "laporan", "cek tulisan otomatis", "typo checker Indonesia"],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "TypoTrace | Deteksi Typo Laporan & Skripsi",
    description:
      "Periksa laporan dan skripsi bebas typo secara otomatis dan akurat dengan TypoTrace.",
    url: "https://typotrace.vercel.app",
    siteName: "TypoTrace",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TypoTrace - Deteksi Typo Otomatis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypoTrace | Deteksi Typo Laporan & Skripsi",
    description:
      "Cek typo laporan dan skripsi dengan cepat dan otomatis.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={poppins.variable} suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers messages={messages} locale={locale}>
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
