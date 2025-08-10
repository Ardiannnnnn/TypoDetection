'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

interface ProvidersProps {
  children: React.ReactNode;
  messages: any;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}