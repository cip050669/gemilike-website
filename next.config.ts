import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /** Turbopack: Workspace-Root (behebt „set turbopack.root“ / Next.js-Auflösung) */
  turbopack: {
    root: projectRoot,
  },
  // Temporarily disable static export for development
  // output: 'export',
  trailingSlash: true,
  // Enable standalone output for Docker optimization
  output: 'standalone',
  /** Reduziert Turbopack/NFT-Tracing für native/fs-lastige Mail-Laufzeit */
  serverExternalPackages: ['nodemailer'],
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
