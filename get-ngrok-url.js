#!/usr/bin/env node

/**
 * Ngrok URL Finder
 * Findet die aktuelle Ngrok-URL für mobile Tests
 */

const http = require('http');

console.log('🌐 Ngrok URL Finder');
console.log('===================\n');

// Ngrok API abfragen
function getNgrokURL() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:4040/api/tunnels', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data);
          if (tunnels.tunnels && tunnels.tunnels.length > 0) {
            const tunnel = tunnels.tunnels[0];
            console.log('✅ Ngrok Tunnel gefunden!');
            console.log(`   URL: ${tunnel.public_url}`);
            console.log(`   Status: ${tunnel.state}`);
            console.log(`   Protokoll: ${tunnel.proto}`);
            console.log(`   Lokaler Port: ${tunnel.config.addr}`);
            resolve(tunnel.public_url);
          } else {
            console.log('❌ Kein aktiver Tunnel gefunden');
            resolve(null);
          }
        } catch (error) {
          console.log('❌ Fehler beim Parsen der Ngrok-API:', error.message);
          resolve(null);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Ngrok API nicht erreichbar:', err.message);
      console.log('   Stellen Sie sicher, dass Ngrok läuft: ~/bin/ngrok http 3002');
      resolve(null);
    });
  });
}

// Hauptfunktion
async function findURL() {
  console.log('🔍 Suche nach Ngrok-URL...\n');
  
  const url = await getNgrokURL();
  
  if (url) {
    console.log('\n📱 Mobile Testing bereit!');
    console.log('========================');
    console.log(`🌐 Öffnen Sie auf Ihrem Mobilgerät: ${url}`);
    console.log(`   Deutsche Version: ${url}/de`);
    console.log(`   Englische Version: ${url}/en`);
    console.log('\n💡 Hinweise:');
    console.log('   - Die URL ist von überall erreichbar');
    console.log('   - HTTPS ist automatisch aktiviert');
    console.log('   - Ngrok läuft solange der Terminal-Prozess aktiv ist');
    console.log('\n🛑 Zum Beenden: Ctrl+C im Ngrok-Terminal');
  } else {
    console.log('\n⚠️  Ngrok nicht gefunden');
    console.log('========================');
    console.log('Bitte starten Sie Ngrok manuell:');
    console.log('   ~/bin/ngrok http 3002');
    console.log('\nOder verwenden Sie eine alternative Lösung:');
    console.log('   - Lokales Netzwerk: http://192.168.1.104:3002');
    console.log('   - Port Forwarding im Router einrichten');
  }
}

// URL finden
findURL().catch(console.error);

