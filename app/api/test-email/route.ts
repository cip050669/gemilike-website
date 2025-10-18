import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { smtpHost, smtpPort, smtpUser, smtpPassword } = body;

    // Validate required fields
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      return NextResponse.json(
        { error: 'Missing required SMTP configuration' },
        { status: 400 }
      );
    }

    // Create transporter with provided settings
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Test the connection
    await transporter.verify();

    // Send a test email
    const testResult = await transporter.sendMail({
      from: smtpUser,
      to: smtpUser, // Send to self for testing
      subject: 'Email settings test - Gemilike',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
            .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .success { color: #28a745; font-weight: bold; }
            .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Email settings test</h2>
              <p>Your email configuration works correctly!</p>
            </div>
            
            <div class="content">
              <p class="success">🎉 Email test successful!</p>
              
              <p>This email confirms that your SMTP configuration is set up correctly:</p>
              
              <ul>
                <li><strong>SMTP host:</strong> ${smtpHost}</li>
                <li><strong>SMTP port:</strong> ${smtpPort}</li>
                <li><strong>Username:</strong> ${smtpUser}</li>
                <li><strong>Test time:</strong> ${new Date().toISOString()}</li>
              </ul>
              
              <p>All email features (contact form, order confirmations, newsletter) should now work properly.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent automatically from the Gemilike admin panel.</p>
              <p>Gemilike GmbH | Gemstone trading</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email test successful:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      messageId: testResult.messageId
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email settings tested successfully',
        messageId: testResult.messageId,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
