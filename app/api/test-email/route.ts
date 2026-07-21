import { NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { sendEmail } from '@/lib/email';

/**
 * Admin-only SMTP smoke test using server env configuration.
 * Does not accept client-provided SMTP credentials (SSRF / credential abuse).
 */
export async function POST() {
  try {
    const { session } = await getSessionWithUser();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const to = session.user.email;
    if (!to) {
      return NextResponse.json(
        { error: 'Admin account has no email address' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const result = await sendEmail({
      to,
      subject: 'Email settings test - Gemilike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email settings test</h2>
          <p>Your server SMTP configuration works correctly.</p>
          <p>Test time: ${timestamp}</p>
        </div>
      `,
      text: `Email settings test successful at ${timestamp}`,
    });

    if (result.success === false) {
      return NextResponse.json(
        { success: false, error: 'Email test failed', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email settings tested successfully',
      messageId: result.messageId,
      timestamp,
    });
  } catch (error) {
    console.error('Email test failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'Email test failed' },
      { status: 500 }
    );
  }
}
