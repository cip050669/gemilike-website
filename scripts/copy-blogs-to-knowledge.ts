import { prisma } from '../lib/prisma';

async function copyBlogsToKnowledge() {
  try {
    console.log('🚀 Starting copy of Blog posts to Knowledge Base...\n');

    // Get all published blogs
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
    });

    console.log(`📦 Found ${blogs.length} published blog posts\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const blog of blogs) {
      try {
        // Check if knowledge article already exists (by slug and locale)
        const existing = await prisma.knowledgeBase.findFirst({
          where: {
            slug: blog.slug,
            locale: blog.locale || 'de',
          },
        });

        if (existing) {
          console.log(`⏭️  Skipping ${blog.slug} (already exists in Knowledge Base)`);
          skipped++;
          continue;
        }

        // Generate a unique slug for knowledge base (add -wissenswertes suffix if needed)
        let knowledgeSlug = blog.slug;
        const slugExists = await prisma.knowledgeBase.findFirst({
          where: {
            slug: knowledgeSlug,
            locale: blog.locale || 'de',
          },
        });

        if (slugExists) {
          knowledgeSlug = `${blog.slug}-wissenswertes`;
        }

        // Calculate reading time if not provided
        const readingTime = blog.readingTime || Math.ceil(blog.content.split(' ').length / 200);

        // Create knowledge article from blog post
        await prisma.knowledgeBase.create({
          data: {
            title: blog.title,
            slug: knowledgeSlug,
            content: blog.content,
            excerpt: blog.excerpt || blog.content.substring(0, 200) + '...',
            author: blog.author || 'Gemilike Redaktion',
            category: blog.category || 'Allgemein',
            tags: blog.tags || [],
            image: blog.image || null,
            contentImages: blog.contentImages || [],
            published: blog.published,
            featured: blog.featured,
            locale: blog.locale || 'de',
            metaDescription: blog.metaDescription || blog.excerpt || blog.content.substring(0, 160) + '...',
            readingTime: readingTime,
            difficulty: blog.difficulty || null,
            publishedAt: blog.publishedAt || (blog.published ? blog.createdAt : null),
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
          },
        });

        console.log(`✅ Copied: ${blog.title} (slug: ${knowledgeSlug})`);
        imported++;
      } catch (error) {
        console.error(`❌ Error copying ${blog.slug}:`, error);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('✨ Copy completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

copyBlogsToKnowledge();

