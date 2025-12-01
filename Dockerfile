# syntax=docker/dockerfile:1.8

ARG NODE_VERSION=22-alpine

# ============================================
# Dependencies Stage
# ============================================
FROM node:${NODE_VERSION} AS deps
ARG NODE_VERSION
# Install system dependencies for image processing, color analysis, and other features
RUN apk add --no-cache libc6-compat openssl \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    libpng-dev
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --legacy-peer-deps

# ============================================
# Builder Stage
# ============================================
FROM node:${NODE_VERSION} AS builder
ARG NODE_VERSION
# Install system dependencies for build (including image processing libraries for color analysis)
RUN apk add --no-cache libc6-compat openssl \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    libpng-dev \
    python3 \
    make \
    g++
WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies)
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.cache/prisma \
    npx prisma generate

# Copy source code
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build the application
# This will create the standalone output in .next/standalone
RUN npm run build

# Verify critical files exist after build
RUN test -f public/sw.js && echo "✓ Service Worker found" || echo "⚠ Warning: Service Worker not found" && \
    test -d .next/standalone && echo "✓ Standalone build found" || (echo "✗ Standalone build missing" && exit 1)

# ============================================
# Runner Stage (Production)
# ============================================
FROM node:${NODE_VERSION} AS runner
ARG NODE_VERSION
# Install runtime dependencies for image processing, color analysis, and utilities
RUN apk add --no-cache \
    wget \
    curl \
    netcat-openbsd \
    cairo \
    jpeg \
    pango \
    giflib \
    pixman \
    libpng \
    fontconfig \
    ttf-dejavu \
    ttf-liberation
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs && \
    chown -R nextjs:nodejs /app

# Copy necessary files from builder
# With standalone output, Next.js creates a self-contained server
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Service Worker (for PWA/Offline support)
# Service Worker is in public/sw.js and will be served automatically
# No additional copy needed as it's already in public/

# Copy Prisma schema and migrations (needed for migrations at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy Prisma Client from builder (needed for runtime)
# The standalone build may not include all Prisma Client files
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy i18n configuration (needed for next-intl)
COPY --from=builder --chown=nextjs:nodejs /app/i18n ./i18n
COPY --from=builder --chown=nextjs:nodejs /app/messages ./messages

# Copy package.json for potential runtime scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Ensure Service Worker is accessible (already in public/, but verify)
# Service Worker registration happens client-side via ServiceWorkerRegistration component

# Note: Data files for color charts are mounted as volumes in docker-compose
# They are not copied into the image to keep it smaller and allow updates without rebuild

# Note: Prisma Client is included both in standalone output and explicitly copied above

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check is handled by docker-compose
# Use node directly instead of npm for better performance
CMD ["node", "server.js"]
