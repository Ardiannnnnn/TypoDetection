import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type { Metadata } from 'next';
import '../globals.css';
import { poppins } from '../fonts';


const locales = ['en', 'id'];

export const metadata: Metadata = {
  title: 'TypoDetector',
  description: 'AI-powered typo detection for PDF documents',
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // ✅ Debug logs di server side
  console.log('🔧 Layout - Received locale:', locale);
  
  if (!locales.includes(locale)) {
    console.log('❌ Layout - Invalid locale, calling notFound');
    notFound();
  }

  const messages = await getMessages();
  console.log('📄 Layout - Messages loaded for locale:', locale);
  console.log('🎯 Layout - Sample message:', messages?.hero?.title);

  return (
    <html lang={locale} className={poppins.variable}>
      <body className={poppins.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}