-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "contentImages" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'de';

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "metaDescription" TEXT;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "readingTime" INTEGER;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "difficulty" TEXT;

-- AlterTable: Convert tags from TEXT to TEXT[]
-- First, convert existing tags string to array
UPDATE "Blog" SET "tags" = CASE 
  WHEN "tags" IS NULL OR "tags" = '' THEN ARRAY[]::TEXT[]
  ELSE ARRAY["tags"]::TEXT[]
END;

-- AlterTable: Change column type from TEXT to TEXT[]
ALTER TABLE "Blog" ALTER COLUMN "tags" TYPE TEXT[] USING "tags"::TEXT[];

-- DropIndex
DROP INDEX IF EXISTS "Blog_slug_key";

-- CreateIndex
CREATE INDEX "Blog_slug_locale_idx" ON "Blog"("slug", "locale");

-- CreateIndex
CREATE INDEX "Blog_published_locale_idx" ON "Blog"("published", "locale");

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");

-- CreateUniqueConstraint
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_slug_locale_key" UNIQUE ("slug", "locale");

