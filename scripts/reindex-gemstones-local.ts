import '../prisma/env-bootstrap';

import { prisma } from '../lib/prisma';
import { embedText } from '../lib/ai/embeddings';

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decimalToString(value: unknown): string {
  if (value == null) return '';
  return String(value).trim();
}

function buildGemstoneSearchText(gemstone: {
  name: string;
  category: string;
  origin: string | null;
  rarity: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  cut: string | null;
  cutForm: string | null;
  attributes: {
    color: string | null;
    colorSaturation: string | null;
    clarity: string | null;
    treatment: string | null;
    certification: string | null;
  } | null;
  inventory: {
    caratWeight: unknown;
    gramWeight: unknown;
    quantity: number;
  } | null;
}): string {
  return [
    gemstone.name,
    gemstone.category,
    gemstone.origin ?? '',
    gemstone.cut ?? '',
    gemstone.cutForm ?? '',
    gemstone.rarity ?? '',
    gemstone.attributes?.color ?? '',
    gemstone.attributes?.colorSaturation ?? '',
    gemstone.attributes?.clarity ?? '',
    gemstone.attributes?.treatment ?? '',
    gemstone.attributes?.certification ?? '',
    decimalToString(gemstone.inventory?.caratWeight),
    decimalToString(gemstone.inventory?.gramWeight),
    gemstone.inventory ? String(gemstone.inventory.quantity) : '',
    stripMarkdown(`${gemstone.shortDescription ?? ''}\n${gemstone.longDescription ?? ''}`),
  ]
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const gemstones = await prisma.gemstone.findMany({
    include: {
      attributes: true,
      inventory: true,
    },
  });

  let model = 'local-hash-embedding-v1';

  for (const gemstone of gemstones) {
    const embedding = embedText(buildGemstoneSearchText(gemstone));
    model = embedding.model;

    await prisma.gemstone.update({
      where: { id: gemstone.id },
      data: {
        searchEmbedding: embedding.vector,
        searchEmbeddingModel: embedding.model,
        searchEmbeddingUpdatedAt: new Date(),
      },
    });
  }

  console.log(
    JSON.stringify(
      {
        processed: gemstones.length,
        model,
        entity: 'gemstones',
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
