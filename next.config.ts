import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
// Frontend hosting must never receive the owner's backend credential.
if (process.env.ADMIN_ACCESS_TOKEN || Object.keys(process.env).some(name =>
  name.startsWith('NEXT_PUBLIC_') && /SECRET|TOKEN|PASSWORD|PRIVATE_KEY|SERVER_KEY|ADMIN/.test(name)
)) {
  throw new Error('Hapus kredensial rahasia dari environment frontend. Kunci pemilik hanya untuk backend.');
}

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
    ] }];
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
