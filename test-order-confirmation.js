#!/usr/bin/env node

/**
 * Test-Script für Bestellbestätigungen
 * Testet das E-Mail-System für Bestellbestätigungen
 */

const nodemailer = require('nodemailer');

// E-Mail-Konfiguration
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

// Test-Daten für Bestellbestätigung
const testOrderData = {
  orderNumber: 'TEST-ORD-001',
  customerEmail: 'test@example.com',
  customerName: 'Max Mustermann',
  orderDate: new Date().toLocaleDateString('de-DE'),
  totalAmount: 1250.00,
  currency: 'EUR',
  items: [
    {
      name: 'Kolumbianischer Smaragd 001',
      quantity: 1,
      price: 1250.00
    }
  ],
  locale: 'de'
};

// E-Mail-Template für Bestellbestätigung
const orderConfirmationTemplate = (data) => `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.locale === 'de' ? 'Bestellbestätigung' : 'Order Confirmation'}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .order-info { background: #e9ecef; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; padding: 15px 0; border-top: 2px solid #333; }
    .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${data.locale === 'de' ? 'Bestellbestätigung' : 'Order Confirmation'}</h2>
      <p>${data.locale === 'de' ? 'Vielen Dank für Ihre Bestellung!' : 'Thank you for your order!'}</p>
    </div>
    
    <div class="content">
      <div class="order-info">
        <p><strong>${data.locale === 'de' ? 'Bestellnummer:' : 'Order Number:'}</strong> #${data.orderNumber}</p>
        <p><strong>${data.locale === 'de' ? 'Bestelldatum:' : 'Order Date:'}</strong> ${data.orderDate}</p>
        <p><strong>${data.locale === 'de' ? 'Kunde:' : 'Customer:'}</strong> ${data.customerName}</p>
      </div>
      
      <h3>${data.locale === 'de' ? 'Bestellte Artikel:' : 'Ordered Items:'}</h3>
      ${data.items.map(item => `
        <div class="item">
          <span>${item.name} (${item.quantity}x)</span>
          <span>${item.price.toFixed(2)} ${data.currency}</span>
        </div>
      `).join('')}
      
      <div class="total">
        ${data.locale === 'de' ? 'Gesamtbetrag:' : 'Total Amount:'} ${data.totalAmount.toFixed(2)} ${data.currency}
      </div>
      
      <p>${data.locale === 'de' ? 'Wir bearbeiten Ihre Bestellung und senden Ihnen eine Versandbestätigung, sobald die Artikel versandt wurden.' : 'We are processing your order and will send you a shipping confirmation once the items have been shipped.'}</p>
    </div>
    
    <div class="footer">
      <p>${data.locale === 'de' ? 'Bei Fragen zu Ihrer Bestellung kontaktieren Sie uns gerne.' : 'If you have any questions about your order, please contact us.'}</p>
      <p>Gemilike GmbH | ${data.locale === 'de' ? 'Edelsteinhandel' : 'Gemstone Trading'}</p>
    </div>
  </div>
</body>
</html>
`;

// Admin-Benachrichtigung Template
const adminNotificationTemplate = (data) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Bestellung - Gemilike</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .order-info { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; padding: 15px 0; border-top: 2px solid #333; }
    .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🚨 Neue Bestellung eingegangen</h2>
      <p>Eine neue Bestellung wurde über die Website aufgegeben</p>
    </div>
    
    <div class="content">
      <div class="order-info">
        <p><strong>Bestellnummer:</strong> #${data.orderNumber}</p>
        <p><strong>Kunde:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Bestelldatum:</strong> ${data.orderDate}</p>
        <p><strong>Gesamtbetrag:</strong> ${data.totalAmount.toFixed(2)} ${data.currency}</p>
      </div>
      
      <h3>Bestellte Artikel:</h3>
      ${data.items.map(item => `
        <div class="item">
          <span>${item.name} (${item.quantity}x)</span>
          <span>${item.price.toFixed(2)} ${data.currency}</span>
        </div>
      `).join('')}
      
      <div class="total">
        Gesamtbetrag: ${data.totalAmount.toFixed(2)} ${data.currency}
      </div>
      
      <p><strong>Bitte bearbeiten Sie die Bestellung in Ihrem Admin-Panel.</strong></p>
    </div>
    
    <div class="footer">
      <p>Diese E-Mail wurde automatisch vom Bestellsystem gesendet.</p>
      <p>Gemilike GmbH | Admin-Benachrichtigung</p>
    </div>
  </div>
</body>
</html>
`;

async function testOrderConfirmation() {
  console.log('🧪 Teste Bestellbestätigungs-E-Mails...\n');

  // SMTP-Konfiguration anzeigen
  console.log('📧 SMTP-Konfiguration:');
  console.log(`Host: ${smtpConfig.host}`);
  console.log(`Port: ${smtpConfig.port}`);
  console.log(`User: ${smtpConfig.auth.user}`);
  console.log(`From: ${process.env.SMTP_FROM || smtpConfig.auth.user}`);
  console.log(`Secure: ${smtpConfig.secure}\n`);

  // Prüfen ob SMTP konfiguriert ist
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.log('❌ SMTP nicht konfiguriert!');
    console.log('Bitte setzen Sie die Umgebungsvariablen:');
    console.log('- SMTP_HOST');
    console.log('- SMTP_PORT');
    console.log('- SMTP_USER');
    console.log('- SMTP_PASSWORD');
    console.log('- SMTP_FROM (optional)\n');
    
    console.log('📋 Test-Daten (ohne E-Mail-Versand):');
    console.log(JSON.stringify(testOrderData, null, 2));
    return;
  }

  try {
    // Transporter erstellen
    const transporter = nodemailer.createTransporter(smtpConfig);

    // Verbindung testen
    console.log('🔗 Teste SMTP-Verbindung...');
    await transporter.verify();
    console.log('✅ SMTP-Verbindung erfolgreich!\n');

    // Bestellbestätigung an Kunden senden
    console.log('📤 Sende Bestellbestätigung an Kunden...');
    const customerEmailResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: testOrderData.customerEmail,
      subject: `Bestellbestätigung #${testOrderData.orderNumber} - Gemilike`,
      html: orderConfirmationTemplate(testOrderData),
    });
    console.log('✅ Bestellbestätigung erfolgreich gesendet!');
    console.log(`Message ID: ${customerEmailResult.messageId}\n`);

    // Admin-Benachrichtigung senden
    console.log('📤 Sende Admin-Benachrichtigung...');
    const adminEmailResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: smtpConfig.auth.user,
      subject: `Neue Bestellung #${testOrderData.orderNumber} - Gemilike`,
      html: adminNotificationTemplate(testOrderData),
    });
    console.log('✅ Admin-Benachrichtigung erfolgreich gesendet!');
    console.log(`Message ID: ${adminEmailResult.messageId}\n`);

    console.log('🎉 Bestellbestätigungs-E-Mails erfolgreich getestet!');
    console.log('\n📊 Zusammenfassung:');
    console.log(`- Kunden-E-Mail: ${customerEmailResult.messageId}`);
    console.log(`- Admin-E-Mail: ${adminEmailResult.messageId}`);
    console.log(`- Bestellnummer: ${testOrderData.orderNumber}`);
    console.log(`- Kunde: ${testOrderData.customerName}`);
    console.log(`- Betrag: ${testOrderData.totalAmount.toFixed(2)} ${testOrderData.currency}`);

  } catch (error) {
    console.error('❌ Fehler beim Testen der Bestellbestätigungen:', error.message);
    
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
testOrderConfirmation();

