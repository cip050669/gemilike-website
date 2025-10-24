import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { getSubscribers } from '@/lib/newsletter-storage';

const BASE_URL =
  process.env.NEXTAUTH_URL ??
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { subject, content, locale = 'de' } = body;
    
    if (!subject?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject and content are required' },
        { status: 400 }
      );
    }
    
    const subscribers = getSubscribers().filter((subscriber) => subscriber.status === 'active');
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active subscribers found' },
        { status: 400 }
      );
    }
    
    console.log(`📧 Sending newsletter ${id} to ${subscribers.length} subscribers`);
    
    const results: Array<
      | { email: string; status: 'success'; messageId: string }
      | { email: string; status: 'error'; error: string }
    > = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const subscriber of subscribers) {
      const unsubscribeLink = `${BASE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(
        subscriber.email
      )}&id=${subscriber.id}`;
      
      try {
        const emailResult = await sendEmail({
          to: subscriber.email,
          subject,
          html: emailTemplates.newsletterCampaign({
            subject,
            content,
            unsubscribeLink,
            locale: subscriber.locale || locale
          }).html,
        });
        
        if (emailResult.success) {
          results.push({
            email: subscriber.email,
            status: 'success',
            messageId: emailResult.messageId
          });
          successCount++;
        } else {
          results.push({
            email: subscriber.email,
            status: 'error',
            error: 'error' in emailResult ? emailResult.error : 'Unknown error'
          });
          errorCount++;
        }
      } catch (error) {
        results.push({
          email: subscriber.email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
      results: {
        total: subscribers.length,
        success: successCount,
        errors: errorCount,
        details: results
      }
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Senden des Newsletters' },
      { status: 500 }
    );
  }
}
