#!/usr/bin/env node

/**
 * Mobile Access Test Script
 * Testet verschiedene Methoden für externen Zugriff
 */

const http = require('http');
const { exec } = require('child_process');

console.log('📱 Mobile Access Test');
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

// Test 2: Netzwerk-IP
function testNetworkIP() {
  return new Promise((resolve) => {
    const networkIP = require('os').networkInterfaces();
    let localIP = null;
    
    for (const interfaceName in networkIP) {
      const interfaces = networkIP[interfaceName];
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIP = iface.address;
          break;
        }
      }
      if (localIP) break;
    }
    
    if (localIP) {
      console.log(`🌐 Netzwerk-IP gefunden: ${localIP}`);
      console.log(`   Testen Sie: http://${localIP}:3002`);
      resolve(true);
    } else {
      console.log('❌ Keine Netzwerk-IP gefunden');
      resolve(false);
    }
  });
}

// Test 3: Öffentliche IP
function testPublicIP() {
  return new Promise((resolve) => {
    const req = http.get('http://ipinfo.io/ip', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const publicIP = data.trim();
        console.log(`🌍 Öffentliche IP: ${publicIP}`);
        console.log(`   Hinweis: Port 3002 muss im Router freigegeben werden`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Öffentliche IP nicht abrufbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Mobile Access Tests...\n');
  
  const localOk = await testLocalServer();
  if (!localOk) {
    console.log('\n❌ Lokaler Server läuft nicht. Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const networkOk = await testNetworkIP();
  
  console.log('');
  const publicOk = await testPublicIP();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Lokaler Server: ${localOk ? '✅' : '❌'}`);
  console.log(`Netzwerk-IP: ${networkOk ? '✅' : '❌'}`);
  console.log(`Öffentliche IP: ${publicOk ? '✅' : '❌'}`);
  
  console.log('\n💡 Nächste Schritte:');
  console.log('====================');
  console.log('1. Für lokales Netzwerk: Verwenden Sie die Netzwerk-IP');
  console.log('2. Für externen Zugriff: Verwenden Sie Ngrok oder Serveo');
  console.log('3. Für dauerhaften Zugriff: Port Forwarding im Router einrichten');
}

// Tests ausführen
runTests().catch(console.error);
