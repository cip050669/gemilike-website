#!/usr/bin/env node

/**
 * Mobile Server Starter
 * Startet einen lokalen Server für mobile Tests
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

console.log('📱 Mobile Server Starter');
console.log('========================\n');

// Server-Status prüfen
function checkServer() {
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
  
  console.log('🌐 Netzwerk-Informationen:');
  console.log('==========================');
  
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`📱 Mobile URL: http://${iface.address}:3002`);
        console.log(`   Deutsche Version: http://${iface.address}:3002/de`);
        console.log(`   Englische Version: http://${iface.address}:3002/en`);
        break;
      }
    }
  }
  
  console.log('\n💡 Hinweise:');
  console.log('   - Beide Geräte müssen im gleichen WLAN sein');
  console.log('   - Firewall muss Port 3002 erlauben');
  console.log('   - Für externen Zugriff: Port Forwarding im Router');
}

// Alternative Tunnel-Services
function showAlternatives() {
  console.log('\n🔧 Alternative Lösungen:');
  console.log('========================');
  
  console.log('\n1. Cloudflare Tunnel (Empfohlen):');
  console.log('   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb');
  console.log('   sudo dpkg -i cloudflared-linux-amd64.deb');
  console.log('   cloudflared tunnel --url http://localhost:3002');
  
  console.log('\n2. Serveo (SSH-basiert):');
  console.log('   ssh -R 80:localhost:3002 serveo.net');
  
  console.log('\n3. Ngrok (Benötigt Account):');
  console.log('   ~/bin/ngrok http 3002');
  console.log('   (Registrierung erforderlich: https://dashboard.ngrok.com/signup)');
  
  console.log('\n4. Port Forwarding (Router):');
  console.log('   - Router-Administration öffnen');
  console.log('   - Port Forwarding: 3002 → 192.168.1.104:3002');
  console.log('   - Öffnen Sie: http://[Ihre-Öffentliche-IP]:3002');
}

// Hauptfunktion
async function startMobileServer() {
  console.log('🚀 Starte Mobile Server Setup...\n');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('\n❌ Next.js Server läuft nicht!');
    console.log('Bitte starten Sie zuerst: npm run dev');
    return;
  }
  
  console.log('');
  showNetworkInfo();
  showAlternatives();
  
  console.log('\n📊 Test-URLs:');
  console.log('=============');
  console.log('Lokal: http://localhost:3002');
  console.log('Mobile: http://192.168.1.104:3002');
  console.log('Deutsch: http://192.168.1.104:3002/de');
  console.log('Englisch: http://192.168.1.104:3002/en');
  
  console.log('\n🎯 Nächste Schritte:');
  console.log('====================');
  console.log('1. Öffnen Sie die Mobile-URL auf Ihrem Smartphone');
  console.log('2. Testen Sie alle Funktionen');
  console.log('3. Überprüfen Sie die Responsive Darstellung');
  console.log('4. Für externen Zugriff: Verwenden Sie eine der Alternativen');
}

// Server starten
startMobileServer().catch(console.error);

