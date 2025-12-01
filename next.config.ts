import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Temporarily disable static export for development
  // output: 'export',
  trailingSlash: true,
  // Enable standalone output for Docker optimization
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000',
        'https://fqm1955x-3000.euw.devtunnels.ms',
      ],
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
