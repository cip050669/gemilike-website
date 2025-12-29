import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllGemstones() {
  try {
    console.log('Starting deletion of all gemstones...');

    // First, count how many gemstones exist
    const count = await prisma.gemstone.count();
    console.log(`Found ${count} gemstones in database`);

    if (count === 0) {
      console.log('No gemstones to delete.');
      return;
    }

    // Delete all gemstones (cascade will handle related records)
    // We need to delete in the right order due to foreign key constraints
    console.log('Deleting related records...');
    
    // Delete wishlist items
    await prisma.wishlistItem.deleteMany({});
    console.log('Deleted wishlist items');
    
    // Delete cart items
    await prisma.cartItem.deleteMany({});
    console.log('Deleted cart items');
    
    // Delete order items
    await prisma.orderItem.deleteMany({});
    console.log('Deleted order items');
    
    // Delete reviews
    await prisma.review.deleteMany({});
    console.log('Deleted reviews');
    
    // Delete download grants
    await prisma.downloadGrant.deleteMany({});
    console.log('Deleted download grants');
    
    // Delete gemstone tags
    await prisma.gemstoneTag.deleteMany({});
    console.log('Deleted gemstone tags');
    
    // Delete gemstone prices
    await prisma.gemstonePrice.deleteMany({});
    console.log('Deleted gemstone prices');
    
    // Delete gemstone media
    await prisma.gemstoneMedia.deleteMany({});
    console.log('Deleted gemstone media');
    
    // Delete gemstone attributes
    await prisma.gemstoneAttributes.deleteMany({});
    console.log('Deleted gemstone attributes');
    
    // Delete gemstone inventory
    await prisma.gemstoneInventory.deleteMany({});
    console.log('Deleted gemstone inventory');
    
    // Finally, delete gemstones
    const result = await prisma.gemstone.deleteMany({});
    console.log(`Successfully deleted ${result.count} gemstones`);

    console.log('All gemstones and related records have been deleted.');
  } catch (error) {
    console.error('Error deleting gemstones:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllGemstones()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

