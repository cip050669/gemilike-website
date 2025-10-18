#!/usr/bin/env node

/**
 * Test-Script für Newsletter-Integration
 * Testet das Newsletter-System mit der gemeinsamen SMTP-Konfiguration
 */

// Lade .env.local Datei explizit
require('dotenv').config({ path: '.env.local' });

const nodemailer = require('nodemailer');

// E-Mail-Konfiguration (gleiche wie für Kontaktformular und Bestellbestätigungen)
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// Test-Daten für Newsletter
const newsletterData = {
  email: 'info@gemilike.com',
  locale: 'de'
};

const newsletterDataEN = {
  email: 'info@gemilike.com',
  locale: 'en'
};

// Newsletter Template (Deutsch)
const newsletterTemplateDE = (data) => `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter-Anmeldung</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
    .features { background: #e9ecef; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .features ul { margin: 0; padding-left: 20px; }
    .features li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Newsletter-Anmeldung</h2>
      <p>Willkommen bei unserem Newsletter!</p>
    </div>
    
    <div class="content">
      <p>Vielen Dank für Ihre Anmeldung zu unserem Newsletter!</p>
      
      <p>Ihre E-Mail-Adresse: <strong>${data.email}</strong></p>
      
      <div class="features">
        <h3>Mit unserem Newsletter informieren wir Sie über:</h3>
        <ul>
          <li>💎 Neue Edelsteine und Kollektionen</li>
          <li>🎯 Exklusive Angebote und Rabatte</li>
          <li>📚 Fachwissen und Tipps</li>
          <li>🎪 Veranstaltungen und Events</li>
          <li>⭐ Kundenbewertungen und Erfahrungen</li>
        </ul>
      </div>
      
      <p>Sie erhalten regelmäßig wertvolle Informationen über die Welt der Edelsteine und exklusive Angebote, die nur für unsere Newsletter-Abonnenten verfügbar sind.</p>
      
      <p>Bei Fragen zu unserem Newsletter können Sie uns jederzeit kontaktieren.</p>
    </div>
    
    <div class="footer">
      <p>Sie können sich jederzeit von unserem Newsletter abmelden, indem Sie auf den Abmelde-Link in einer unserer E-Mails klicken.</p>
      <p>Gemilike GmbH | Edelsteinhandel</p>
    </div>
  </div>
</body>
</html>
`;

// Newsletter Template (Englisch)
const newsletterTemplateEN = (data) => `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter Subscription</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
    .features { background: #e9ecef; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .features ul { margin: 0; padding-left: 20px; }
    .features li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Newsletter Subscription</h2>
      <p>Welcome to our newsletter!</p>
    </div>
    
    <div class="content">
      <p>Thank you for subscribing to our newsletter!</p>
      
      <p>Your email address: <strong>${data.email}</strong></p>
      
      <div class="features">
        <h3>With our newsletter we inform you about:</h3>
        <ul>
          <li>💎 New gemstones and collections</li>
          <li>🎯 Exclusive offers and discounts</li>
          <li>📚 Expert knowledge and tips</li>
          <li>🎪 Events and exhibitions</li>
          <li>⭐ Customer reviews and experiences</li>
        </ul>
      </div>
      
      <p>You will regularly receive valuable information about the world of gemstones and exclusive offers that are only available to our newsletter subscribers.</p>
      
      <p>If you have any questions about our newsletter, please feel free to contact us at any time.</p>
    </div>
    
    <div class="footer">
      <p>You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in one of our emails.</p>
      <p>Gemilike GmbH | Gemstone Trading</p>
    </div>
  </div>
</body>
</html>
`;

async function testNewsletter() {
  console.log('📧 Teste Newsletter-Integration mit gemeinsamer SMTP-Konfiguration...\n');

  // SMTP-Konfiguration anzeigen
  console.log('📧 Gemeinsame SMTP-Konfiguration:');
  console.log(`Host: ${smtpConfig.host}`);
  console.log(`Port: ${smtpConfig.port}`);
  console.log(`User: ${smtpConfig.auth.user || 'NICHT GESETZT'}`);
  console.log(`From: ${process.env.SMTP_FROM || smtpConfig.auth.user || 'NICHT GESETZT'}`);
  console.log(`Secure: ${smtpConfig.secure}\n`);

  // Prüfen ob SMTP konfiguriert ist
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.log('❌ SMTP nicht konfiguriert!');
    console.log('Bitte setzen Sie die Umgebungsvariablen in .env.local:');
    console.log('- SMTP_HOST');
    console.log('- SMTP_PORT');
    console.log('- SMTP_USER');
    console.log('- SMTP_PASSWORD');
    console.log('- SMTP_FROM (optional)\n');
    
    console.log('📋 Test-Daten (ohne E-Mail-Versand):');
    console.log('Newsletter DE:', JSON.stringify(newsletterData, null, 2));
    console.log('Newsletter EN:', JSON.stringify(newsletterDataEN, null, 2));
    return;
  }

  try {
    // Transporter erstellen
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verbindung testen
    console.log('🔗 Teste SMTP-Verbindung...');
    await transporter.verify();
    console.log('✅ SMTP-Verbindung erfolgreich!\n');

    // Test 1: Newsletter-Anmeldung (Deutsch)
    console.log('📤 Test 1: Newsletter-Anmeldung (Deutsch)...');
    const newsletterDEResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: newsletterData.email,
      subject: 'Newsletter-Anmeldung bestätigen - Gemilike',
      html: newsletterTemplateDE(newsletterData),
    });
    console.log('✅ Newsletter-Anmeldung (DE) erfolgreich gesendet!');
    console.log(`Message ID: ${newsletterDEResult.messageId}\n`);

    // Test 2: Newsletter-Anmeldung (Englisch)
    console.log('📤 Test 2: Newsletter-Anmeldung (Englisch)...');
    const newsletterENResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: newsletterDataEN.email,
      subject: 'Confirm Newsletter Subscription - Gemilike',
      html: newsletterTemplateEN(newsletterDataEN),
    });
    console.log('✅ Newsletter-Anmeldung (EN) erfolgreich gesendet!');
    console.log(`Message ID: ${newsletterENResult.messageId}\n`);

    // Test 3: Newsletter-Beispiel (Marketing-E-Mail)
    console.log('📤 Test 3: Newsletter-Beispiel (Marketing-E-Mail)...');
    const marketingResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: newsletterData.email,
      subject: '💎 Neue Edelsteine im Oktober - Gemilike Newsletter',
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Newsletter Oktober 2025</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
            .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .gemstone { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #007bff; }
            .offer { background: #fff3cd; padding: 15px; border-radius: 4px; margin: 15px 0; border: 1px solid #ffeaa7; }
            .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💎 Gemilike Newsletter</h1>
              <p>Oktober 2025 - Neue Edelsteine & Exklusive Angebote</p>
            </div>
            
            <div class="content">
              <h2>Liebe Edelstein-Liebhaber,</h2>
              
              <p>willkommen zu unserem Oktober-Newsletter! Wir haben wieder spannende Neuigkeiten und exklusive Angebote für Sie zusammengestellt.</p>
              
              <div class="gemstone">
                <h3>🆕 Neue Edelsteine im Sortiment</h3>
                <p><strong>Kolumbianische Smaragde:</strong> Frisch eingetroffen - Premium-Qualität mit lebendigem Grün</p>
                <p><strong>Burma-Rubine:</strong> Seltene Exemplare mit außergewöhnlicher Farbe und Klarheit</p>
                <p><strong>Kashmir-Saphire:</strong> Die begehrtesten Saphire der Welt - limitierte Verfügbarkeit</p>
              </div>
              
              <div class="offer">
                <h3>🎯 Exklusives Newsletter-Angebot</h3>
                <p><strong>15% Rabatt</strong> auf alle Edelsteine über 1.000€</p>
                <p>Gültig bis 31. Oktober 2025</p>
                <p><strong>Code:</strong> NEWSLETTER15</p>
              </div>
              
              <h3>📚 Edelstein-Wissen des Monats</h3>
              <p>Wussten Sie, dass Smaragde zu den seltensten Edelsteinen der Welt gehören? Nur etwa 1% aller geförderten Smaragde erreichen die Qualität für Schmuck.</p>
              
              <h3>🎪 Kommende Events</h3>
              <p>Besuchen Sie uns auf der <strong>Mineralienmesse München</strong> vom 15.-17. November 2025. Wir freuen uns auf Ihren Besuch!</p>
            </div>
            
            <div class="footer">
              <p>Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.</p>
              <p>Gemilike GmbH | Edelsteinhandel | <a href="#">Abmelden</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Newsletter-Beispiel erfolgreich gesendet!');
    console.log(`Message ID: ${marketingResult.messageId}\n`);

    console.log('🎉 Newsletter-Integration erfolgreich getestet!');
    console.log('\n📊 Zusammenfassung:');
    console.log(`- Newsletter (DE): ${newsletterDEResult.messageId}`);
    console.log(`- Newsletter (EN): ${newsletterENResult.messageId}`);
    console.log(`- Marketing-E-Mail: ${marketingResult.messageId}`);
    console.log(`- Gemeinsame SMTP-Konfiguration: ✅ Funktioniert`);

    console.log('\n💡 Newsletter-System verwendet die gleiche SMTP-Konfiguration:');
    console.log('- Newsletter-Anmeldung: /api/newsletter');
    console.log('- Kontaktformular: /api/contact');
    console.log('- Bestellbestätigungen: /api/orders/confirmation');
    console.log('- Gemeinsame Bibliothek: lib/email.ts');

  } catch (error) {
    console.error('❌ Fehler beim Testen des Newsletter-Systems:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Mögliche Lösungen:');
      console.log('- Überprüfen Sie Benutzername und Passwort');
      console.log('- Bei Gmail: App-Passwort verwenden');
      console.log('- Bei Strato: E-Mail-Passwort verwenden (nicht Kundencenter-Passwort)');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Mögliche Lösungen:');
      console.log('- Überprüfen Sie Host und Port');
      console.log('- Firewall-Einstellungen prüfen');
      console.log('- Internetverbindung testen');
    }
  }
}

// Test ausführen
testNewsletter();
