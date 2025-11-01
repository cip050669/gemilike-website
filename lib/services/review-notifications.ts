'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

interface ReviewWithDetails {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
  gemstone: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export async function sendReviewNotificationEmail(review: ReviewWithDetails) {
  try {
    // Get admin email: Priority: ENV > CompanySettings > Default
    // First check ENV variable (highest priority for configuration)
    let adminEmail = process.env.ADMIN_EMAIL;
    
    // If not in ENV, check company settings
    if (!adminEmail) {
      const companySettings = await prisma.companySettings.findFirst();
      adminEmail = companySettings?.email;
    }
    
    // Fallback to default if neither is set
    if (!adminEmail) {
      adminEmail = 'admin@gemilike.com';
      console.warn('Admin email not configured. Using default. Please set ADMIN_EMAIL in environment variables or companySettings.email in database.');
    }

    const customerName = review.customer
      ? `${review.customer.firstName || ''} ${review.customer.lastName || ''}`.trim() || 'Anonym'
      : 'Anonym';
    
    const gemstoneName = review.gemstone?.name || 'Unbekanntes Produkt';
    const gemstoneLink = review.gemstone
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://gemilike.com'}/de/shop/${review.gemstone.slug}`
      : '#';

    const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    await sendEmail({
      to: adminEmail,
      subject: `Neue Bewertung für ${gemstoneName} (${review.rating}/5)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <div style="padding: 24px; background: linear-gradient(135deg, #111827, #1f2937); border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; color: #fff; font-size: 24px;">Gemilike Admin</h1>
            <p style="margin: 8px 0 0; color: #d1d5db; font-size: 16px;">Neue Produktbewertung</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <h2 style="color: #111827; margin-bottom: 16px;">Neue Bewertung erhalten</h2>
            
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px;"><strong>Produkt:</strong> <a href="${gemstoneLink}" style="color: #2563eb;">${gemstoneName}</a></p>
              <p style="margin: 0 0 8px;"><strong>Bewertung:</strong> ${stars} (${review.rating}/5)</p>
              ${review.verified ? '<p style="margin: 0 0 8px;"><strong>Status:</strong> ✓ Verifizierter Kauf</p>' : ''}
              <p style="margin: 0;"><strong>Kunde:</strong> ${customerName}</p>
            </div>

            ${review.title ? `<h3 style="color: #111827; margin-bottom: 8px;">${review.title}</h3>` : ''}
            ${review.comment ? `<p style="color: #374151; line-height: 1.6; margin-bottom: 16px;">${review.comment}</p>` : ''}

            <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gemilike.com'}/de/admin/reviews" 
                 style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Bewertung verwalten
              </a>
            </div>
          </div>
        </div>
      `,
      text: `Neue Bewertung für ${gemstoneName}\n\nBewertung: ${review.rating}/5\nKunde: ${customerName}\n${review.title ? `Titel: ${review.title}\n` : ''}${review.comment ? `Kommentar: ${review.comment}\n` : ''}\nVerwalten: ${process.env.NEXT_PUBLIC_APP_URL || 'https://gemilike.com'}/de/admin/reviews`,
    });
  } catch (error) {
    console.error('Error sending review notification email:', error);
    // Don't throw, just log the error
  }
}

