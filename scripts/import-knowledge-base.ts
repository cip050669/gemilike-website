/**
 * Migration Script: Import KnowledgeBase from JSON to Database
 * 
 * Usage: npx tsx scripts/import-knowledge-base.ts
 */

import { prisma } from '../lib/prisma';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { KnowledgeArticle } from '@/lib/types/knowledge';

const KNOWLEDGE_FILE_PATH = join(process.cwd(), 'data', 'knowledge.json');

async function importKnowledgeBase() {
  try {
    console.log('📚 Starting KnowledgeBase migration from JSON to DB...');

    // Read JSON file
    const raw = await readFile(KNOWLEDGE_FILE_PATH, 'utf-8');
    const articles: KnowledgeArticle[] = JSON.parse(raw);

    if (!Array.isArray(articles)) {
      console.error('❌ Invalid JSON format: expected array');
      process.exit(1);
    }

    console.log(`📄 Found ${articles.length} articles to import`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const article of articles) {
      try {
        // Check if article already exists
        const existing = await prisma.knowledgeBase.findFirst({
          where: {
            slug: article.slug,
            locale: 'de', // Default locale
          },
        });

        if (existing) {
          console.log(`⏭️  Skipping ${article.slug} (already exists)`);
          skipped++;
          continue;
        }

        // Import article
        await prisma.knowledgeBase.create({
          data: {
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            author: article.author || 'Gemilike Redaktion',
            category: article.category || 'Grundlagen',
            tags: article.tags || [],
            image: article.image || null,
            contentImages: article.contentImages || [],
            published: article.published || false,
            featured: article.featured || false,
            locale: 'de',
            metaDescription: article.metaDescription || null,
            readingTime: article.readingTime || null,
            difficulty: article.difficulty || 'beginner',
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
          },
        });

        console.log(`✅ Imported: ${article.title}`);
        imported++;
      } catch (error) {
        console.error(`❌ Error importing ${article.slug}:`, error);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('✨ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importKnowledgeBase();

