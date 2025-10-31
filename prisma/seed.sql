BEGIN;

-- Hero section
INSERT INTO "HeroSettings" ("id", "imageUrl", "title", "titleLine2", "subtitle", "primaryButtonText", "primaryButtonLink", "secondaryButtonText", "secondaryButtonLink", "createdAt", "updatedAt")
VALUES (
  'singleton',
  '/images/hero-fallback.jpg',
  'Schätze aus aller Welt',
  'Handverlesene Edelsteine für Sammler:innen',
  'Entdecken Sie einzigartig zertifizierte Edelsteine, kuratiert nach Herkunft, Qualität und Geschichte.',
  'Zum Shop',
  '/shop',
  'Kontakt aufnehmen',
  '/contact',
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO UPDATE
SET
  "imageUrl" = EXCLUDED."imageUrl",
  "title" = EXCLUDED."title",
  "titleLine2" = EXCLUDED."titleLine2",
  "subtitle" = EXCLUDED."subtitle",
  "primaryButtonText" = EXCLUDED."primaryButtonText",
  "primaryButtonLink" = EXCLUDED."primaryButtonLink",
  "secondaryButtonText" = EXCLUDED."secondaryButtonText",
  "secondaryButtonLink" = EXCLUDED."secondaryButtonLink",
  "updatedAt" = NOW();

-- Select options
DELETE FROM "SelectOption" WHERE "category" IN ('cut', 'form');

INSERT INTO "SelectOption" ("id", "category", "value", "label", "order", "isActive", "createdAt", "updatedAt") VALUES
  ('seed-cut-brillant', 'cut', 'Brillant', 'Brillantschliff', 0, TRUE, NOW(), NOW()),
  ('seed-cut-princess', 'cut', 'Princess', 'Princess-Schliff', 1, TRUE, NOW(), NOW()),
  ('seed-cut-emerald', 'cut', 'Emerald', 'Emerald-Schliff', 2, TRUE, NOW(), NOW()),
  ('seed-cut-oval', 'cut', 'Oval', 'Ovaler Schliff', 3, TRUE, NOW(), NOW()),
  ('seed-cut-cushion', 'cut', 'Cushion', 'Kissenschliff', 4, TRUE, NOW(), NOW()),
  ('seed-form-round', 'form', 'Rund', 'Rund', 0, TRUE, NOW(), NOW()),
  ('seed-form-oval', 'form', 'Oval', 'Oval', 1, TRUE, NOW(), NOW()),
  ('seed-form-cushion', 'form', 'Kissen', 'Kissen', 2, TRUE, NOW(), NOW()),
  ('seed-form-heart', 'form', 'Herz', 'Herz', 3, TRUE, NOW(), NOW()),
  ('seed-form-drop', 'form', 'Tropfen', 'Tropfen', 4, TRUE, NOW(), NOW());

-- Clean existing gemstones (and dependent records)
DELETE FROM "WishlistItem";
DELETE FROM "CartItem";
DELETE FROM "Cart";
DELETE FROM "GemstonePrice";
DELETE FROM "GemstoneMedia";
DELETE FROM "GemstoneAttributes";
DELETE FROM "GemstoneInventory";
DELETE FROM "Gemstone";

-- Emerald Aurora
INSERT INTO "Gemstone" (
  "id", "slug", "status", "category", "name", "shortDescription", "longDescription",
  "origin", "condition", "isNew", "isSold", "featured", "cut", "cutForm",
  "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'gem-emerald-aurora',
  'emerald-aurora',
  'PUBLISHED',
  'Smaragd',
  'Emerald Aurora',
  'Intensiv grüner Smaragd aus Kolumbien mit lebhaftem Funkeln.',
  'Ein sorgfältig facettierter Smaragd in erlesener Qualität. Seine tiefgrüne Farbe mit hoher Transparenz macht ihn zu einem Highlight für jede Sammlung.',
  'Kolumbien',
  'CUT',
  TRUE,
  FALSE,
  TRUE,
  'Brillant',
  'Oval',
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO "GemstoneInventory" (
  "id", "gemstoneId", "condition", "caratWeight", "gramWeight", "quantity", "warehouseLocation", "createdAt", "updatedAt"
) VALUES (
  'inv-emerald-aurora',
  'gem-emerald-aurora',
  'CUT',
  2.34,
  NULL,
  1,
  'Berlin-01',
  NOW(),
  NOW()
);

INSERT INTO "GemstoneAttributes" (
  "id", "gemstoneId", "lengthMm", "widthMm", "heightMm", "color", "colorSaturation", "clarity", "cutGrade", "treatment", "certification", "createdAt", "updatedAt"
) VALUES (
  'attr-emerald-aurora',
  'gem-emerald-aurora',
  8.2,
  5.9,
  4.1,
  'Smaragdgrün',
  'Intense',
  'VS1',
  'Excellent',
  'Geölt',
  'GIA',
  NOW(),
  NOW()
);

INSERT INTO "GemstonePrice" (
  "id", "gemstoneId", "currency", "priceNet", "priceGross", "taxRate", "createdAt", "updatedAt"
) VALUES (
  'price-emerald-aurora',
  'gem-emerald-aurora',
  'EUR',
  5200.00,
  6188.00,
  19.00,
  NOW(),
  NOW()
);

INSERT INTO "GemstoneMedia" (
  "id", "gemstoneId", "type", "url", "thumbnailUrl", "alt", "position", "isPrimary", "createdAt", "updatedAt"
) VALUES
  ('media-emerald-aurora-1', 'gem-emerald-aurora', 'IMAGE', '/products/placeholder-gem.jpg', NULL, 'Emerald Aurora', 0, TRUE, NOW(), NOW()),
  ('media-emerald-aurora-2', 'gem-emerald-aurora', 'IMAGE', '/products/placeholder-gem.jpg', NULL, 'Emerald Aurora Detail', 1, FALSE, NOW(), NOW());

-- Ruby Flame
INSERT INTO "Gemstone" (
  "id", "slug", "status", "category", "name", "shortDescription", "longDescription",
  "origin", "condition", "isNew", "isSold", "featured", "cut", "cutForm",
  "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'gem-ruby-flame',
  'ruby-flame',
  'PUBLISHED',
  'Rubin',
  'Ruby Flame',
  'Thailändischer Rubin mit warmem Rot und klassischem Princess-Schliff.',
  'Dieser Rubin besticht durch sein intensives Rot und saubere Facetten. Perfekt für feinste Schmuckstücke oder als Anlageobjekt.',
  'Thailand',
  'CUT',
  FALSE,
  FALSE,
  TRUE,
  'Princess',
  'Rund',
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO "GemstoneInventory" (
  "id", "gemstoneId", "condition", "caratWeight", "quantity", "warehouseLocation", "createdAt", "updatedAt"
) VALUES (
  'inv-ruby-flame',
  'gem-ruby-flame',
  'CUT',
  1.78,
  1,
  'Berlin-02',
  NOW(),
  NOW()
);

INSERT INTO "GemstoneAttributes" (
  "id", "gemstoneId", "lengthMm", "widthMm", "heightMm", "color", "colorSaturation", "clarity", "cutGrade", "treatment", "certification", "createdAt", "updatedAt"
) VALUES (
  'attr-ruby-flame',
  'gem-ruby-flame',
  6.1,
  6.0,
  4.0,
  'Rot',
  'Vivid',
  'VS2',
  'Very Good',
  'Erhitzt',
  'IGI',
  NOW(),
  NOW()
);

INSERT INTO "GemstonePrice" (
  "id", "gemstoneId", "currency", "priceNet", "priceGross", "taxRate", "createdAt", "updatedAt"
) VALUES (
  'price-ruby-flame',
  'gem-ruby-flame',
  'EUR',
  4100.00,
  4879.00,
  19.00,
  NOW(),
  NOW()
);

INSERT INTO "GemstoneMedia" (
  "id", "gemstoneId", "type", "url", "alt", "position", "isPrimary", "createdAt", "updatedAt"
) VALUES (
  'media-ruby-flame-1',
  'gem-ruby-flame',
  'IMAGE',
  '/products/placeholder-gem.jpg',
  'Ruby Flame',
  0,
  TRUE,
  NOW(),
  NOW()
);

-- Sapphire Dawn
INSERT INTO "Gemstone" (
  "id", "slug", "status", "category", "name", "shortDescription", "longDescription",
  "origin", "condition", "isNew", "isSold", "featured", "cut", "cutForm",
  "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'gem-sapphire-dawn',
  'sapphire-dawn',
  'PUBLISHED',
  'Saphir',
  'Sapphire Dawn',
  'Unbehandelter Rohsaphir aus Madagaskar mit natürlicher Form.',
  'Ein authentischer Rohsaphir, der die natürliche Schönheit des Gesteins zeigt. Ideal für Sammler:innen, die Ursprünglichkeit schätzen.',
  'Madagaskar',
  'ROUGH',
  FALSE,
  FALSE,
  FALSE,
  NULL,
  NULL,
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO "GemstoneInventory" (
  "id", "gemstoneId", "condition", "gramWeight", "quantity", "warehouseLocation", "createdAt", "updatedAt"
) VALUES (
  'inv-sapphire-dawn',
  'gem-sapphire-dawn',
  'ROUGH',
  12.6,
  1,
  'Berlin-03',
  NOW(),
  NOW()
);

INSERT INTO "GemstoneAttributes" (
  "id", "gemstoneId", "lengthMm", "widthMm", "heightMm", "color", "colorSaturation", "clarity", "treatment", "createdAt", "updatedAt"
) VALUES (
  'attr-sapphire-dawn',
  'gem-sapphire-dawn',
  18.4,
  11.2,
  9.7,
  'Blau',
  'Medium',
  'Included',
  'Keine Behandlung',
  NOW(),
  NOW()
);

INSERT INTO "GemstonePrice" (
  "id", "gemstoneId", "currency", "priceNet", "priceGross", "taxRate", "createdAt", "updatedAt"
) VALUES (
  'price-sapphire-dawn',
  'gem-sapphire-dawn',
  'EUR',
  950.00,
  1130.50,
  19.00,
  NOW(),
  NOW()
);

INSERT INTO "GemstoneMedia" (
  "id", "gemstoneId", "type", "url", "alt", "position", "isPrimary", "createdAt", "updatedAt"
) VALUES (
  'media-sapphire-dawn-1',
  'gem-sapphire-dawn',
  'IMAGE',
  '/products/placeholder-gem.jpg',
  'Sapphire Dawn',
  0,
  TRUE,
  NOW(),
  NOW()
);

COMMIT;
