#!/usr/bin/env node

/**
 * E-Mail-Test für Strato-Konfiguration
 * 
 * Verwendung:
 * node test-email.js
 */

const nodemailer = require('nodemailer');

// Lade Umgebungsvariablen
require('dotenv').config({ path: '.env.local' });

async function testEmailConfiguration() {
  console.log('🧪 Teste Strato E-Mail-Konfiguration...\n');

  // Konfiguration anzeigen
  console.log('📧 Konfiguration:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`From: ${process.env.SMTP_FROM}`);
  console.log(`Secure: ${process.env.SMTP_SECURE}\n`);

  // Prüfe ob alle Variablen gesetzt sind
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('❌ Fehler: SMTP-Konfiguration unvollständig!');
    console.log('Bitte überprüfen Sie die .env.local Datei.\n');
    return;
  }

  try {
    // Transporter erstellen
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Für Entwicklung
      },
    });

    console.log('🔗 Teste SMTP-Verbindung...');

    // Verbindung testen
    await transporter.verify();
    console.log('✅ SMTP-Verbindung erfolgreich!\n');

    // Test-E-Mail senden
    console.log('📤 Sende Test-E-Mail...');

    const testEmail = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // An sich selbst senden
      subject: 'Test-E-Mail von Gemilike Website',
      html: `
        <h2>✅ E-Mail-System funktioniert!</h2>
        <p>Diese Test-E-Mail wurde erfolgreich über die Gemilike Website gesendet.</p>
        <p><strong>Konfiguration:</strong></p>
        <ul>
          <li>Host: ${process.env.SMTP_HOST}</li>
          <li>Port: ${process.env.SMTP_PORT}</li>
          <li>User: ${process.env.SMTP_USER}</li>
          <li>Zeitstempel: ${new Date().toLocaleString('de-DE')}</li>
        </ul>
        <p>Das E-Mail-System ist bereit für den produktiven Einsatz!</p>
        <hr>
        <p><small>Gemilike - Heroes in Gems</small></p>
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test-E-Mail erfolgreich gesendet!');
    console.log(`Message ID: ${result.messageId}\n`);

    console.log('🎉 E-Mail-System ist vollständig funktionsfähig!');
    console.log('Sie können jetzt:');
    console.log('- Kontaktformular-E-Mails empfangen');
    console.log('- Newsletter-Bestätigungen senden');
    console.log('- Bestellbestätigungen versenden\n');

  } catch (error) {
    console.error('❌ Fehler beim Testen der E-Mail-Konfiguration:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Mögliche Lösungen:');
      console.log('- Überprüfen Sie das E-Mail-Passwort in der .env.local Datei');
      console.log('- Stellen Sie sicher, dass Sie das E-Mail-Passwort (nicht das Strato-Kundencenter-Passwort) verwenden');
      console.log('- Prüfen Sie die E-Mail-Einstellungen im Strato-Kundencenter');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Mögliche Lösungen:');
      console.log('- Überprüfen Sie Ihre Internetverbindung');
      console.log('- Prüfen Sie die Firewall-Einstellungen (Port 587)');
      console.log('- Kontaktieren Sie den Strato-Support');
    }
  }
}

// Test ausführen
testEmailConfiguration().catch(console.error);
