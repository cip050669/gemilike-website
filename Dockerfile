# syntax=docker/dockerfile:1.8

ARG NODE_VERSION=22-alpine

# ============================================
# Dependencies Stage
# ============================================
FROM node:${NODE_VERSION} AS deps
ARG NODE_VERSION
# Install system dependencies for image processing, color analysis, and other features
RUN apk add --no-cache --virtual .build-deps \
    libc6-compat \
    openssl \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    libpng-dev
WORKDIR /app

# Copy package files (optimized for cache)
COPY package.json package-lock.json* ./

# Install dependencies with cache mount for faster builds
# Using multiple cache mounts for better performance
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/root/.cache \
    npm ci --omit=dev --legacy-peer-deps --prefer-offline --no-audit

# ============================================
# Builder Stage
# ============================================
FROM node:${NODE_VERSION} AS builder
ARG NODE_VERSION
# Install system dependencies for build (including image processing libraries for color analysis)
RUN apk add --no-cache --virtual .build-deps \
    libc6-compat \
    openssl \
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
# Optimized layer caching: package files first
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/root/.cache \
    npm ci --legacy-peer-deps --prefer-offline --no-audit

# Copy Prisma schema and generate client (separate layer for better caching)
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.cache/prisma \
    --mount=type=cache,target=/root/.npm \
    npx prisma generate

# Copy source code in optimized order (static files first, then code)
COPY public ./public
COPY i18n ./i18n
COPY messages ./messages
COPY next.config.ts tsconfig.json ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY middleware*.ts ./
COPY types ./types
COPY prisma ./prisma

# Set build-time environment variables
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build the application with optimizations
# This will create the standalone output in .next/standalone
RUN --mount=type=cache,target=/root/.cache/next \
    npm run build

# Verify critical files exist after build
RUN test -f public/sw.js && echo "✓ Service Worker found" || echo "⚠ Warning: Service Worker not found" && \
    test -d .next/standalone && echo "✓ Standalone build found" || (echo "✗ Standalone build missing" && exit 1)

# ============================================
# Runner Stage (Production)
# ============================================
FROM node:${NODE_VERSION} AS runner
ARG NODE_VERSION
# Install runtime dependencies for image processing, color analysis, and utilities
# Minimal runtime dependencies only
RUN apk add --no-cache --virtual .runtime-deps \
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
    ttf-liberation \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NODE_OPTIONS="--disable-proto=delete"

# Create non-root user for security with minimal permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs -h /app -s /bin/sh && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app

# Copy necessary files from builder in optimized order
# With standalone output, Next.js creates a self-contained server
# Copy standalone build first (largest, changes least)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy public files (including Service Worker)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

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

# Set proper permissions for runtime
RUN chmod -R 755 /app && \
    chmod -R 644 /app/.next/static/* 2>/dev/null || true && \
    find /app -type d -exec chmod 755 {} \; && \
    find /app -type f -exec chmod 644 {} \;

# Create directories for volumes with proper permissions
RUN mkdir -p /app/public/uploads /app/public/invoices /app/public/gemstone-analyses /app/public/color-charts /app/data && \
    chown -R nextjs:nodejs /app/public /app/data && \
    chmod -R 755 /app/public /app/data

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check (can be overridden by docker-compose)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health 2>/dev/null || \
        curl -f http://localhost:3000/api/health 2>/dev/null || \
        exit 1

# Use node directly instead of npm for better performance
CMD ["node", "server.js"]
