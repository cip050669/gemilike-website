-- AlterTable
ALTER TABLE "GemstoneAnalysis" ADD COLUMN     "customPalette" JSONB,
ADD COLUMN     "kValue" INTEGER,
ADD COLUMN     "maskingOptions" JSONB,
ADD COLUMN     "paletteComparisons" JSONB,
ADD COLUMN     "whitepoint" TEXT DEFAULT 'D65';
