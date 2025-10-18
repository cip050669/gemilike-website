import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { getSubscribers } from '@/lib/newsletter-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, subject, content, locale = 'de' } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const subscribers = getSubscribers().filter(sub => sub.status === 'active');
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    console.log(`📧 Sending newsletter to ${subscribers.length} subscribers`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        const emailResult = await sendEmail({
          to: subscriber.email,
          subject: subject,
          html: emailTemplates.newsletterCampaign.html({
            subject,
            content,
            unsubscribeLink: `${process.env.NEXTAUTH_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&id=${subscriber.id}`,
            locale,
          }),
        });

        if (emailResult.success) {
          console.log(`E-Mail erfolgreich gesendet: ${emailResult.messageId}`);
          results.push({ email: subscriber.email, status: 'success', messageId: emailResult.messageId });
          successCount++;
        } else {
          console.error(`Fehler beim Senden an ${subscriber.email}:`, emailResult.error);
          results.push({ email: subscriber.email, status: 'error', error: emailResult.error });
          errorCount++;
        }
      } catch (sendError) {
        console.error(`Unerwarteter Fehler beim Senden an ${subscriber.email}:`, sendError);
        results.push({ email: subscriber.email, status: 'error', error: sendError instanceof Error ? sendError.message : 'Unknown error' });
        errorCount++;
      }
    }

    console.log(`📧 Newsletter sending completed: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json(
      { 
        success: true, 
        message: `Newsletter sent to ${successCount} subscribers`,
        stats: {
          total: subscribers.length,
          success: successCount,
          errors: errorCount,
        },
        results,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter sending API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
