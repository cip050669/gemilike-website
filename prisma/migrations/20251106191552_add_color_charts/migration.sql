-- CreateTable
CREATE TABLE "ColorChart" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "gia" JSONB NOT NULL,
    "gradient" TEXT[],
    "pleochro" TEXT[],
    "light" TEXT NOT NULL DEFAULT 'D55, CRI ≥95',
    "note" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "ColorChart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ColorChart_slug_key" ON "ColorChart"("slug");

-- CreateIndex
CREATE INDEX "ColorChart_published_locale_idx" ON "ColorChart"("published", "locale");

-- CreateIndex
CREATE INDEX "ColorChart_featured_idx" ON "ColorChart"("featured");

-- CreateIndex
CREATE INDEX "ColorChart_slug_locale_idx" ON "ColorChart"("slug", "locale");

-- AddForeignKey
ALTER TABLE "ColorChart" ADD CONSTRAINT "ColorChart_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
