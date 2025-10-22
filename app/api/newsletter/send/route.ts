import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { getSubscribers } from '@/lib/newsletter-storage';

const BASE_URL =
  process.env.NEXTAUTH_URL ??
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, subject, content, locale = 'de' } = body as {
      campaignId?: string;
      subject?: string;
      content?: string;
      locale?: 'de' | 'en';
    };

    if (!subject?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    const subscribers = getSubscribers().filter((subscriber) => subscriber.status === 'active');

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    console.log(`📧 Sending newsletter ${campaignId ?? ''} to ${subscribers.length} subscribers`);

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
        const template = emailTemplates.newsletterCampaign({
          subject,
          content,
          unsubscribeLink,
          locale,
        });

        const emailResult = await sendEmail({
          to: subscriber.email,
          subject: template.subject,
          html: template.html,
        });

        if (emailResult.success) {
          successCount += 1;
          results.push({
            email: subscriber.email,
            status: 'success',
            messageId: emailResult.messageId,
          });
        } else {
          errorCount += 1;
          results.push({
            email: subscriber.email,
            status: 'error',
            error: emailResult.error,
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        errorCount += 1;
        results.push({
          email: subscriber.email,
          status: 'error',
          error: message,
        });
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Newsletter sending API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: message },
      { status: 500 }
    );
  }
}
