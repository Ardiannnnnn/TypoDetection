import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { poppins } from "../fonts";
import { Providers } from "./providers";

const locales = ["en", "id"];

export const metadata: Metadata = {
  title: "TypoDetector",
  description: "Automatically detect typos in your thesis...",
  icons: { icon: "/favicon.svg" },
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
        {children}
      </Providers>
    </body>
  </html>
);
}
