"use client";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "@/components/Them-Providers";
export function Providers({ children, messages, locale }: {
  children: React.ReactNode; messages: AbstractIntlMessages; locale: string;
}) {
  return <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
    <NextIntlClientProvider messages={messages} locale={locale}>{children}</NextIntlClientProvider>
  </ThemeProvider>;
}
