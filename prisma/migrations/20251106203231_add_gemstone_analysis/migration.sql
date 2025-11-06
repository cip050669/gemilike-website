-- CreateTable
CREATE TABLE "GemstoneAnalysis" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageName" TEXT,
    "primaryColor" JSONB NOT NULL,
    "secondaryColors" JSONB NOT NULL,
    "luminanceSaturation" JSONB NOT NULL,
    "spectralCharacteristic" JSONB NOT NULL,
    "giaColorGrade" JSONB NOT NULL,
    "overallImpression" JSONB NOT NULL,
    "pleochroism" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "notes" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "GemstoneAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GemstoneAnalysis_createdAt_idx" ON "GemstoneAnalysis"("createdAt");

-- CreateIndex
CREATE INDEX "GemstoneAnalysis_published_idx" ON "GemstoneAnalysis"("published");

-- CreateIndex
CREATE INDEX "GemstoneAnalysis_createdById_idx" ON "GemstoneAnalysis"("createdById");

-- AddForeignKey
ALTER TABLE "GemstoneAnalysis" ADD CONSTRAINT "GemstoneAnalysis_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
