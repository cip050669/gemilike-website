'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function notifyWishlistCustomers(gemstoneId: string) {
  try {
    // Get gemstone details
    const gemstone = await prisma.gemstone.findUnique({
      where: { id: gemstoneId },
      include: {
        priceBooks: {
          orderBy: [{ validFrom: 'desc' }, { createdAt: 'desc' }],
          take: 1,
        },
        media: {
          where: { type: 'IMAGE', isPrimary: true },
          take: 1,
        },
      },
    });

    if (!gemstone || gemstone.isSold) {
      return; // Gemstone not found or still sold
    }

    // Get all wishlist items for this gemstone
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        gemstoneId,
      },
      include: {
        wishlist: {
          include: {
            customer: {
              include: {
                user: {
                  select: {
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Also get wishlists by sessionId (guest wishlists - skip these for email notifications)

    // Filter to customers with emails and marketing opt-in
    // Skip guest wishlists (no customerId)
    const customersToNotify = wishlistItems
      .filter((item) => {
        const customer = item.wishlist.customer;
        // Only notify if customer exists, has user with email, and opted in to marketing
        return (
          customer &&
          customer.userId && // Ensure customer has a user account
          customer.marketingOptIn
        );
      })
      .map(async (item) => {
        // Get user email separately since we need to fetch it
        const user = await prisma.user.findUnique({
          where: { id: item.wishlist.customer!.userId },
          select: { email: true, name: true },
        });
        
        return {
          customer: item.wishlist.customer!,
          user: user,
          wishlistItem: item,
        };
      });

    const resolvedCustomers = await Promise.all(customersToNotify);
    
    // Filter out customers without email
    const customersWithEmail = resolvedCustomers.filter(
      (entry) => entry.user && entry.user.email
    );

    // Remove duplicates (customer might have multiple wishlists)
    const uniqueCustomers = new Map<string, typeof customersWithEmail[0]>();
    customersWithEmail.forEach((entry) => {
      if (entry.customer.id && !uniqueCustomers.has(entry.customer.id)) {
        uniqueCustomers.set(entry.customer.id, entry);
      }
    });

    // Prisma 7: Typ-Assertion für priceBooks Array
    const priceBooks = Array.isArray(gemstone.priceBooks) ? gemstone.priceBooks : [];
    const price = priceBooks[0] as unknown as { priceGross: number | null; currency: string | null } | undefined;
    const priceDisplay = price
      ? `${Number(price.priceGross).toFixed(2)} ${price.currency}`
      : 'Preis auf Anfrage';

    const gemstoneUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://gemilike.com'}/de/shop/${gemstone.slug}`;
    const imageUrl = gemstone.media[0]?.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://gemilike.com'}/images/placeholder-gem.svg`;

    // Send emails to all customers
    const emailPromises = Array.from(uniqueCustomers.values()).map(async (entry) => {
      const customerName = `${entry.customer.firstName || ''} ${entry.customer.lastName || ''}`.trim() || entry.user.name || 'Liebe/r Kunde/in';

      try {
        await sendEmail({
          to: entry.user.email!,
          subject: `🔄 ${gemstone.name} ist wieder verfügbar!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
              <div style="padding: 24px; background: linear-gradient(135deg, #111827, #1f2937); border-radius: 16px 16px 0 0;">
                <h1 style="margin: 0; color: #fff; font-size: 24px;">Gemilike</h1>
                <p style="margin: 8px 0 0; color: #d1d5db; font-size: 16px;">Ihr Wunschartikel ist verfügbar</p>
              </div>
              <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
                <h2 style="color: #111827; margin-bottom: 16px;">Gute Nachrichten, ${customerName}!</h2>
                
                <p style="color: #374151; line-height: 1.6; margin-bottom: 24px;">
                  Der Artikel <strong>${gemstone.name}</strong> aus Ihrer Merkliste ist wieder verfügbar!
                </p>

                <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                  <img src="${imageUrl}" alt="${gemstone.name}" style="max-width: 300px; height: auto; border-radius: 8px; margin-bottom: 16px;" />
                  <h3 style="color: #111827; margin: 0 0 8px;">${gemstone.name}</h3>
                  <p style="color: #6b7280; margin: 0 0 8px;">${gemstone.category}</p>
                  <p style="color: #111827; font-size: 20px; font-weight: bold; margin: 0;">${priceDisplay}</p>
                </div>

                ${gemstone.shortDescription ? `
                  <p style="color: #374151; line-height: 1.6; margin-bottom: 24px;">
                    ${gemstone.shortDescription}
                  </p>
                ` : ''}

                <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
                  <a href="${gemstoneUrl}" 
                     style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Jetzt ansehen
                  </a>
                </div>

                <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
                  Sie erhalten diese E-Mail, weil Sie diesen Artikel in Ihrer Merkliste gespeichert haben.
                  <br />
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gemilike.com'}/de/wishlist" style="color: #2563eb;">
                    Ihre Merkliste ansehen
                  </a>
                </p>
              </div>
            </div>
          `,
          text: `Gute Nachrichten, ${customerName}!\n\nDer Artikel "${gemstone.name}" aus Ihrer Merkliste ist wieder verfügbar!\n\nPreis: ${priceDisplay}\n\nJetzt ansehen: ${gemstoneUrl}\n\nSie erhalten diese E-Mail, weil Sie diesen Artikel in Ihrer Merkliste gespeichert haben.`,
        });
      } catch (error) {
        console.error(`Error sending wishlist notification to ${entry.user.email}:`, error);
        // Continue with other emails even if one fails
      }
    });

    await Promise.allSettled(emailPromises);
    console.log(`Sent wishlist notifications to ${uniqueCustomers.size} customers for gemstone ${gemstone.name}`);
  } catch (error) {
    console.error('Error notifying wishlist customers:', error);
    // Don't throw, just log the error
  }
}

