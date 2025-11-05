import { prisma } from '../lib/prisma';
import { loadBlogs } from '../lib/data/blogs';

async function migrateBlogsToPrisma() {
  try {
    console.log('🚀 Starting Blog migration from JSON to Prisma...\n');

    const blogs = await loadBlogs();
    console.log(`📦 Found ${blogs.length} blog posts in JSON file\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const blog of blogs) {
      try {
        // Check if blog already exists (by slug and locale)
        const existing = await prisma.blog.findFirst({
          where: {
            slug: blog.slug,
            locale: blog.locale || 'de',
          },
        });

        if (existing) {
          console.log(`⏭️  Skipping ${blog.slug} (already exists)`);
          skipped++;
          continue;
        }

        // Convert tags from string to array if needed
        let tagsArray: string[] = [];
        if (Array.isArray(blog.tags)) {
          tagsArray = blog.tags;
        } else if (blog.tags && typeof blog.tags === 'string') {
          tagsArray = (blog.tags as string).split(',').map(t => t.trim()).filter(Boolean);
        }

        // Calculate reading time if not provided
        const readingTime = blog.readingTime || Math.ceil(blog.content.split(' ').length / 200);

        // Import blog
        await prisma.blog.create({
          data: {
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt || '',
            author: blog.author || 'Gemilike Team',
            category: blog.category,
            tags: tagsArray,
            image: blog.image || null,
            contentImages: blog.contentImages || [],
            published: blog.published || false,
            featured: blog.featured || false,
            locale: blog.locale || 'de',
            metaDescription: blog.metaDescription || null,
            readingTime: readingTime,
            difficulty: blog.difficulty || null,
            publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : (blog.published ? new Date() : null),
            views: blog.views || 0,
            createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
            updatedAt: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
          },
        });

        console.log(`✅ Imported: ${blog.title}`);
        imported++;
      } catch (error) {
        console.error(`❌ Error importing ${blog.slug}:`, error);
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

migrateBlogsToPrisma();

