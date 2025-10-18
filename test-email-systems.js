#!/usr/bin/env node

/**
 * Test-Script für beide E-Mail-Systeme
 * Testet Kontaktformular und Bestellbestätigungen mit der gleichen SMTP-Konfiguration
 */

const nodemailer = require('nodemailer');

// E-Mail-Konfiguration (gleiche wie für Kontaktformular)
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

// Test-Daten für Kontaktformular
const contactData = {
  name: 'Max Mustermann',
  email: 'max@example.com',
  subject: 'Test Kontaktformular',
  message: 'Dies ist eine Test-Nachricht über das Kontaktformular.',
  locale: 'de'
};

// Test-Daten für Bestellbestätigung
const orderData = {
  orderNumber: 'TEST-ORD-001',
  customerEmail: 'kunde@example.com',
  customerName: 'Anna Schmidt',
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

// Kontaktformular Template
const contactTemplate = (data) => `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kontaktanfrage</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-top: 5px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
    .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Neue Kontaktanfrage</h2>
      <p>Sie haben eine neue Kontaktanfrage über Ihre Website erhalten.</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      
      <div class="field">
        <div class="label">E-Mail:</div>
        <div class="value">${data.email}</div>
      </div>
      
      <div class="field">
        <div class="label">Betreff:</div>
        <div class="value">${data.subject}</div>
      </div>
      
      <div class="field">
        <div class="label">Nachricht:</div>
        <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Diese E-Mail wurde automatisch über das Kontaktformular Ihrer Website gesendet.</p>
      <p>Gemilike GmbH | Edelsteinhandel</p>
    </div>
  </div>
</body>
</html>
`;

// Bestellbestätigung Template
const orderTemplate = (data) => `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestellbestätigung</title>
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
      <h2>Bestellbestätigung</h2>
      <p>Vielen Dank für Ihre Bestellung!</p>
    </div>
    
    <div class="content">
      <div class="order-info">
        <p><strong>Bestellnummer:</strong> #${data.orderNumber}</p>
        <p><strong>Bestelldatum:</strong> ${data.orderDate}</p>
        <p><strong>Kunde:</strong> ${data.customerName}</p>
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
      
      <p>Wir bearbeiten Ihre Bestellung und senden Ihnen eine Versandbestätigung, sobald die Artikel versandt wurden.</p>
    </div>
    
    <div class="footer">
      <p>Bei Fragen zu Ihrer Bestellung kontaktieren Sie uns gerne.</p>
      <p>Gemilike GmbH | Edelsteinhandel</p>
    </div>
  </div>
</body>
</html>
`;

async function testEmailSystems() {
  console.log('🧪 Teste beide E-Mail-Systeme mit gemeinsamer SMTP-Konfiguration...\n');

  // SMTP-Konfiguration anzeigen
  console.log('📧 Gemeinsame SMTP-Konfiguration:');
  console.log(`Host: ${smtpConfig.host}`);
  console.log(`Port: ${smtpConfig.port}`);
  console.log(`User: ${smtpConfig.auth.user}`);
  console.log(`From: ${process.env.SMTP_FROM || smtpConfig.auth.user}`);
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
    console.log('Kontaktformular:', JSON.stringify(contactData, null, 2));
    console.log('Bestellbestätigung:', JSON.stringify(orderData, null, 2));
    return;
  }

  try {
    // Transporter erstellen
    const transporter = nodemailer.createTransporter(smtpConfig);

    // Verbindung testen
    console.log('🔗 Teste SMTP-Verbindung...');
    await transporter.verify();
    console.log('✅ SMTP-Verbindung erfolgreich!\n');

    // Test 1: Kontaktformular
    console.log('📤 Test 1: Kontaktformular-E-Mail...');
    const contactResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: smtpConfig.auth.user, // Admin-E-Mail
      subject: 'Neue Kontaktanfrage - Gemilike',
      html: contactTemplate(contactData),
    });
    console.log('✅ Kontaktformular-E-Mail erfolgreich gesendet!');
    console.log(`Message ID: ${contactResult.messageId}\n`);

    // Test 2: Bestellbestätigung (Kunde)
    console.log('📤 Test 2: Bestellbestätigung an Kunden...');
    const orderResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: orderData.customerEmail,
      subject: `Bestellbestätigung #${orderData.orderNumber} - Gemilike`,
      html: orderTemplate(orderData),
    });
    console.log('✅ Bestellbestätigung erfolgreich gesendet!');
    console.log(`Message ID: ${orderResult.messageId}\n`);

    // Test 3: Admin-Benachrichtigung
    console.log('📤 Test 3: Admin-Benachrichtigung...');
    const adminResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: smtpConfig.auth.user,
      subject: `Neue Bestellung #${orderData.orderNumber} - Gemilike`,
      html: `
        <h2>🚨 Neue Bestellung eingegangen</h2>
        <p><strong>Bestellnummer:</strong> #${orderData.orderNumber}</p>
        <p><strong>Kunde:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
        <p><strong>Gesamtbetrag:</strong> ${orderData.totalAmount.toFixed(2)} ${orderData.currency}</p>
        <p><strong>Artikel:</strong></p>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} (${item.quantity}x) - ${item.price.toFixed(2)} ${orderData.currency}</li>`).join('')}
        </ul>
        <p>Bitte bearbeiten Sie die Bestellung in Ihrem Admin-Panel.</p>
      `,
    });
    console.log('✅ Admin-Benachrichtigung erfolgreich gesendet!');
    console.log(`Message ID: ${adminResult.messageId}\n`);

    console.log('🎉 Alle E-Mail-Systeme erfolgreich getestet!');
    console.log('\n📊 Zusammenfassung:');
    console.log(`- Kontaktformular: ${contactResult.messageId}`);
    console.log(`- Bestellbestätigung: ${orderResult.messageId}`);
    console.log(`- Admin-Benachrichtigung: ${adminResult.messageId}`);
    console.log(`- Gemeinsame SMTP-Konfiguration: ✅ Funktioniert`);

    console.log('\n💡 Beide Systeme verwenden die gleiche SMTP-Konfiguration:');
    console.log('- Kontaktformular: /api/contact');
    console.log('- Bestellbestätigungen: /api/orders/confirmation');
    console.log('- Gemeinsame Bibliothek: lib/email.ts');

  } catch (error) {
    console.error('❌ Fehler beim Testen der E-Mail-Systeme:', error.message);
    
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
testEmailSystems();

