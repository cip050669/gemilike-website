/*
  Warnings:

  - You are about to drop the column `message` on the `NewstickerItem` table. All the data in the column will be lost.
  - Added the required column `text` to the `NewstickerItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HeroSettings" ADD COLUMN     "subtitleColor" TEXT NOT NULL DEFAULT '#F4F4FF';

-- AlterTable
ALTER TABLE "NewstickerItem" DROP COLUMN "message",
ADD COLUMN     "headingColor" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "subheadingColor" TEXT,
ADD COLUMN     "text" TEXT NOT NULL;
