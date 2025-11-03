-- CreateTable
CREATE TABLE "FooterLink" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FooterLink_section_locale_idx" ON "FooterLink"("section", "locale");

-- CreateIndex
CREATE INDEX "FooterLink_section_locale_order_idx" ON "FooterLink"("section", "locale", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FooterSection_section_key" ON "FooterSection"("section");

-- CreateIndex
CREATE INDEX "FooterSection_section_locale_idx" ON "FooterSection"("section", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "FooterSection_section_locale_key" ON "FooterSection"("section", "locale");
