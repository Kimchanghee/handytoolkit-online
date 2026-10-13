import createNextIntlPlugin from 'next-intl/plugin';

const STATIC_EXPORT = process.env.STATIC_EXPORT === '1';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // STATIC_EXPORT=1 -> fully static site in ./out (Cloudflare static assets); default stays standalone server
  ...(STATIC_EXPORT ? { output: 'export', trailingSlash: true } : { output: 'standalone' }),
  images: {
    ...(STATIC_EXPORT ? { unoptimized: true } : {}),
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async headers() {
    if (STATIC_EXPORT) return [];
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withNextIntl(nextConfig);
