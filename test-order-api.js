#!/usr/bin/env node

/**
 * Test-Script für Bestellbestätigungs-API
 * Testet die API-Route /api/orders/confirmation
 */

const testOrderData = {
  orderNumber: 'API-TEST-001',
  customerEmail: 'test@example.com',
  customerName: 'Anna Schmidt',
  orderDate: new Date().toLocaleDateString('de-DE'),
  totalAmount: 2890.00,
  currency: 'EUR',
  items: [
    {
      name: 'Rubin 002 - Premium Qualität',
      quantity: 1,
      price: 2890.00
    }
  ],
  locale: 'de'
};

const testOrderDataEN = {
  orderNumber: 'API-TEST-002',
  customerEmail: 'test-en@example.com',
  customerName: 'John Smith',
  orderDate: new Date().toLocaleDateString('en-US'),
  totalAmount: 1500.00,
  currency: 'EUR',
  items: [
    {
      name: 'Sapphire 003 - High Quality',
      quantity: 1,
      price: 1500.00
    }
  ],
  locale: 'en'
};

async function testOrderConfirmationAPI() {
  console.log('🧪 Teste Bestellbestätigungs-API...\n');

  const baseUrl = 'http://localhost:3001';
  const apiEndpoint = '/api/orders/confirmation';

  console.log(`🌐 API-Endpunkt: ${baseUrl}${apiEndpoint}\n`);

  // Test 1: Deutsche Bestellbestätigung
  console.log('📧 Test 1: Deutsche Bestellbestätigung');
  console.log('Daten:', JSON.stringify(testOrderData, null, 2));
  
  try {
    const response1 = await fetch(`${baseUrl}${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });

    const result1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Deutsche Bestellbestätigung erfolgreich!');
      console.log('Antwort:', JSON.stringify(result1, null, 2));
    } else {
      console.log('❌ Fehler bei deutscher Bestellbestätigung:');
      console.log('Status:', response1.status);
      console.log('Antwort:', JSON.stringify(result1, null, 2));
    }
  } catch (error) {
    console.log('❌ Netzwerk-Fehler bei deutscher Bestellbestätigung:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Englische Bestellbestätigung
  console.log('📧 Test 2: Englische Bestellbestätigung');
  console.log('Daten:', JSON.stringify(testOrderDataEN, null, 2));
  
  try {
    const response2 = await fetch(`${baseUrl}${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderDataEN),
    });

    const result2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ Englische Bestellbestätigung erfolgreich!');
      console.log('Antwort:', JSON.stringify(result2, null, 2));
    } else {
      console.log('❌ Fehler bei englischer Bestellbestätigung:');
      console.log('Status:', response2.status);
      console.log('Antwort:', JSON.stringify(result2, null, 2));
    }
  } catch (error) {
    console.log('❌ Netzwerk-Fehler bei englischer Bestellbestätigung:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Fehlerhafte Daten
  console.log('📧 Test 3: Fehlerhafte Daten (Validierung)');
  const invalidData = {
    orderNumber: 'INVALID-001',
    // customerEmail fehlt
    customerName: 'Test User',
    // items fehlen
  };
  
  try {
    const response3 = await fetch(`${baseUrl}${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });

    const result3 = await response3.json();
    
    if (response3.status === 400) {
      console.log('✅ Validierung funktioniert korrekt!');
      console.log('Fehler-Antwort:', JSON.stringify(result3, null, 2));
    } else {
      console.log('❌ Validierung funktioniert nicht wie erwartet:');
      console.log('Status:', response3.status);
      console.log('Antwort:', JSON.stringify(result3, null, 2));
    }
  } catch (error) {
    console.log('❌ Netzwerk-Fehler bei Validierungstest:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Mehrere Artikel
  console.log('📧 Test 4: Bestellung mit mehreren Artikeln');
  const multiItemOrder = {
    orderNumber: 'MULTI-001',
    customerEmail: 'multi@example.com',
    customerName: 'Multi Item Customer',
    orderDate: new Date().toLocaleDateString('de-DE'),
    totalAmount: 4500.00,
    currency: 'EUR',
    items: [
      {
        name: 'Smaragd 001 - Premium',
        quantity: 1,
        price: 2500.00
      },
      {
        name: 'Diamant 002 - Hochwertig',
        quantity: 2,
        price: 1000.00
      }
    ],
    locale: 'de'
  };
  
  try {
    const response4 = await fetch(`${baseUrl}${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(multiItemOrder),
    });

    const result4 = await response4.json();
    
    if (response4.ok) {
      console.log('✅ Mehrere Artikel erfolgreich!');
      console.log('Antwort:', JSON.stringify(result4, null, 2));
    } else {
      console.log('❌ Fehler bei mehreren Artikeln:');
      console.log('Status:', response4.status);
      console.log('Antwort:', JSON.stringify(result4, null, 2));
    }
  } catch (error) {
    console.log('❌ Netzwerk-Fehler bei mehreren Artikeln:', error.message);
  }

  console.log('\n🎉 API-Tests abgeschlossen!');
  console.log('\n💡 Hinweise:');
  console.log('- Stellen Sie sicher, dass der Development Server läuft (npm run dev)');
  console.log('- Überprüfen Sie die Browser-Konsole für weitere Logs');
  console.log('- Bei SMTP-Fehlern: Überprüfen Sie die .env.local Konfiguration');
}

// Test ausführen
testOrderConfirmationAPI();

