#!/usr/bin/env node

/**
 * Mobile Testing Fix
 * Behebt alle Probleme für mobile Tests
 */

const http = require('http');
const https = require('https');

console.log('🔧 Mobile Testing Fix');
console.log('====================\n');

// Test 1: Lokaler Server
function testLocalServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      console.log('✅ Lokaler Server läuft');
      console.log(`   Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ Lokaler Server nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 2: LocalTunnel
function testLocalTunnel() {
  return new Promise((resolve) => {
    const req = https.get('https://sharp-lamps-pull.loca.lt/de', (res) => {
      console.log('✅ LocalTunnel funktioniert');
      console.log(`   URL: https://sharp-lamps-pull.loca.lt`);
      console.log(`   Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ LocalTunnel nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Hero-Bild
function testHeroImage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/uploads/hero/hero-1759840578273.jpg', (res) => {
      console.log('✅ Hero-Bild verfügbar');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Content-Type: ${res.headers['content-type']}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ Hero-Bild nicht verfügbar:', err.message);
      resolve(false);
    });
  });
}

// Cache-Lösung anzeigen
function showCacheSolution() {
  console.log('\n🔧 Cache-Problem Lösung:');
  console.log('========================');
  console.log('1. Browser-Cache leeren:');
  console.log('   - Desktop: Ctrl + F5 (Hard Refresh)');
  console.log('   - Mobile: App schließen und neu öffnen');
  console.log('   - Oder: Inkognito/Private Browser verwenden');
  console.log('\n2. Entwicklertools verwenden:');
  console.log('   - F12 → Network Tab → "Disable cache" aktivieren');
  console.log('   - F12 → Application Tab → Storage → "Clear storage"');
  console.log('\n3. Alternative URLs testen:');
  console.log('   - Lokal: http://192.168.1.104:3002/de');
  console.log('   - Tunnel: https://sharp-lamps-pull.loca.lt/de');
}

// Mobile Testing URLs
function showMobileURLs() {
  console.log('\n📱 Mobile Testing URLs:');
  console.log('=======================');
  console.log('🌐 LocalTunnel (Extern):');
  console.log('   https://sharp-lamps-pull.loca.lt/de');
  console.log('   https://sharp-lamps-pull.loca.lt/en');
  console.log('   https://sharp-lamps-pull.loca.lt/de/shop');
  console.log('   https://sharp-lamps-pull.loca.lt/de/contact');
  console.log('   https://sharp-lamps-pull.loca.lt/de/admin');
  console.log('\n🏠 Lokales Netzwerk:');
  console.log('   http://192.168.1.104:3002/de');
  console.log('   http://192.168.1.104:3002/en');
  console.log('   http://192.168.1.104:3002/de/shop');
  console.log('   http://192.168.1.104:3002/de/contact');
  console.log('   http://192.168.1.104:3002/de/admin');
}

// Troubleshooting
function showTroubleshooting() {
  console.log('\n🛠️ Troubleshooting:');
  console.log('===================');
  console.log('❌ "Hero image failed to load" Fehler?');
  console.log('   ✅ Browser-Cache leeren (Ctrl + F5)');
  console.log('   ✅ Inkognito/Private Browser verwenden');
  console.log('   ✅ Entwicklertools → Network → "Disable cache"');
  console.log('\n❌ LocalTunnel nicht erreichbar?');
  console.log('   ✅ LocalTunnel läuft: ~/.npm-global/bin/lt --port 3002');
  console.log('   ✅ URL korrekt: https://sharp-lamps-pull.loca.lt');
  console.log('   ✅ Lokaler Server läuft: npm run dev');
  console.log('\n❌ Mobile Gerät kann nicht zugreifen?');
  console.log('   ✅ Beide Geräte im gleichen WLAN');
  console.log('   ✅ Firewall blockiert Port 3002');
  console.log('   ✅ IP-Adresse korrekt: 192.168.1.104');
}

// Hauptfunktion
async function fixMobileTesting() {
  console.log('🚀 Starte Mobile Testing Fix...\n');
  
  const localOk = await testLocalServer();
  if (!localOk) {
    console.log('\n❌ Lokaler Server läuft nicht!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const tunnelOk = await testLocalTunnel();
  
  console.log('');
  const heroOk = await testHeroImage();
  
  console.log('');
  showMobileURLs();
  showCacheSolution();
  showTroubleshooting();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Lokaler Server: ${localOk ? '✅' : '❌'}`);
  console.log(`LocalTunnel: ${tunnelOk ? '✅' : '❌'}`);
  console.log(`Hero-Bild: ${heroOk ? '✅' : '❌'}`);
  
  if (localOk && tunnelOk && heroOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Mobile Testing ist bereit!');
    console.log('\n📱 Nächste Schritte:');
    console.log('   1. Öffnen Sie: https://sharp-lamps-pull.loca.lt/de');
    console.log('   2. Falls Fehler: Browser-Cache leeren (Ctrl + F5)');
    console.log('   3. Testen Sie alle Funktionen');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Troubleshooting-Tipps.');
  }
}

// Fix ausführen
fixMobileTesting().catch(console.error);
