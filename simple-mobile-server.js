#!/usr/bin/env node

/**
 * Simple Mobile Server
 * Startet einen einfachen HTTP-Server für mobile Tests
 */

const http = require('http');
const { exec } = require('child_process');

console.log('📱 Simple Mobile Server');
console.log('=======================\n');

// Server-Status prüfen
function checkNextJSServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002', (res) => {
      console.log('✅ Next.js Server läuft auf Port 3002');
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Next.js Server nicht erreichbar:', err.message);
      console.log('   Bitte starten Sie zuerst: npm run dev');
      resolve(false);
    });
  });
}

// Netzwerk-Informationen anzeigen
function showNetworkInfo() {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  console.log('🌐 Mobile Testing URLs:');
  console.log('========================');
  
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`📱 Mobile URL: http://${iface.address}:3002`);
        console.log(`   🇩🇪 Deutsche Version: http://${iface.address}:3002/de`);
        console.log(`   🇬🇧 Englische Version: http://${iface.address}:3002/en`);
        console.log(`   🛍️  Shop: http://${iface.address}:3002/de/shop`);
        console.log(`   📧 Kontakt: http://${iface.address}:3002/de/contact`);
        console.log(`   ⚙️  Admin: http://${iface.address}:3002/de/admin`);
        break;
      }
    }
  }
}

// QR-Code generieren (falls qrencode installiert ist)
function generateQRCode() {
  return new Promise((resolve) => {
    exec('which qrencode', (error) => {
      if (error) {
        console.log('\n💡 QR-Code Generator nicht verfügbar');
        console.log('   Installieren Sie: sudo apt install qrencode');
        resolve(false);
      } else {
        const os = require('os');
        const networkInterfaces = os.networkInterfaces();
        
        for (const interfaceName in networkInterfaces) {
          const interfaces = networkInterfaces[interfaceName];
          for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
              const url = `http://${iface.address}:3002/de`;
              console.log(`\n📱 QR-Code für Mobile Testing:`);
              console.log('===============================');
              exec(`qrencode -t ansiutf8 "${url}"`, (err, stdout) => {
                if (!err) {
                  console.log(stdout);
                }
              });
              break;
            }
          }
        }
        resolve(true);
      }
    });
  });
}

// Test-URLs anzeigen
function showTestURLs() {
  console.log('\n🧪 Test-URLs für Mobile Testing:');
  console.log('=================================');
  console.log('📱 Hauptseite: http://192.168.1.104:3002/de');
  console.log('🛍️  Shop: http://192.168.1.104:3002/de/shop');
  console.log('📧 Kontakt: http://192.168.1.104:3002/de/contact');
  console.log('ℹ️  Über uns: http://192.168.1.104:3002/de/about');
  console.log('⚙️  Admin: http://192.168.1.104:3002/de/admin');
  console.log('📧 Newsletter: http://192.168.1.104:3002/de (Footer)');
}

// Troubleshooting-Tipps
function showTroubleshooting() {
  console.log('\n🔧 Troubleshooting:');
  console.log('===================');
  console.log('❌ Mobile Gerät kann nicht auf Server zugreifen?');
  console.log('   ✅ Beide Geräte im gleichen WLAN?');
  console.log('   ✅ Firewall blockiert Port 3002?');
  console.log('   ✅ IP-Adresse korrekt?');
  console.log('\n❌ Website lädt langsam?');
  console.log('   ✅ WLAN-Signal stark genug?');
  console.log('   ✅ Server läuft stabil?');
  console.log('\n❌ Bilder laden nicht?');
  console.log('   ✅ Hero-Bild Problem behoben?');
  console.log('   ✅ Alle Assets verfügbar?');
}

// Hauptfunktion
async function startMobileServer() {
  console.log('🚀 Starte Mobile Server Setup...\n');
  
  const serverRunning = await checkNextJSServer();
  
  if (!serverRunning) {
    console.log('\n❌ Next.js Server läuft nicht!');
    console.log('Bitte starten Sie zuerst: npm run dev');
    return;
  }
  
  console.log('');
  showNetworkInfo();
  showTestURLs();
  
  await generateQRCode();
  
  showTroubleshooting();
  
  console.log('\n🎯 Nächste Schritte:');
  console.log('====================');
  console.log('1. 📱 Öffnen Sie die Mobile-URL auf Ihrem Smartphone');
  console.log('2. 🧪 Testen Sie alle Funktionen (Navigation, Newsletter, etc.)');
  console.log('3. 📐 Überprüfen Sie die Responsive Darstellung');
  console.log('4. 🔍 Testen Sie verschiedene Bildschirmgrößen');
  console.log('5. 🌐 Für externen Zugriff: Port Forwarding im Router');
  
  console.log('\n💡 Tipp:');
  console.log('   Verwenden Sie die QR-Code für schnellen Zugriff!');
}

// Server starten
startMobileServer().catch(console.error);

