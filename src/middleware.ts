import createMiddleware from 'next-intl/middleware';
import { locales } from './config';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always', // ✅ Tambahkan ini untuk ensure prefix selalu ada
  localeDetection: false   // ✅ Enable locale detection
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(id|en)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/some-page` -> `/en/some-page`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};