#!/bin/bash

# Mobile Testing Setup für Gemilike Website
# Verschiedene Optionen für externen Zugriff

echo "🌐 Mobile Testing Setup für Gemilike Website"
echo "=============================================="
echo ""

# Option 1: Ngrok (Empfohlen)
echo "📱 Option 1: Ngrok (Empfohlen)"
echo "=============================="
echo "1. Ngrok installieren:"
echo "   wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz"
echo "   tar -xzf ngrok-v3-stable-linux-amd64.tgz"
echo "   sudo mv ngrok /usr/local/bin/"
echo ""
echo "2. Ngrok starten:"
echo "   ngrok http 3002"
echo ""
echo "3. Öffnen Sie die angezeigte URL auf Ihrem Mobilgerät"
echo "   Beispiel: https://abc123.ngrok.io"
echo ""

# Option 2: Cloudflare Tunnel
echo "☁️  Option 2: Cloudflare Tunnel"
echo "================================="
echo "1. Cloudflared installieren:"
echo "   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
echo "   sudo dpkg -i cloudflared-linux-amd64.deb"
echo ""
echo "2. Tunnel starten:"
echo "   cloudflared tunnel --url http://localhost:3002"
echo ""

# Option 3: Serveo (Keine Installation nötig)
echo "🚀 Option 3: Serveo (Keine Installation nötig)"
echo "=============================================="
echo "1. SSH-Tunnel erstellen:"
echo "   ssh -R 80:localhost:3002 serveo.net"
echo ""
echo "2. Öffnen Sie die angezeigte URL auf Ihrem Mobilgerät"
echo ""

# Option 4: LocalTunnel
echo "🔗 Option 4: LocalTunnel"
echo "========================"
echo "1. LocalTunnel installieren:"
echo "   npm install -g localtunnel"
echo ""
echo "2. Tunnel starten:"
echo "   lt --port 3002"
echo ""

# Option 5: Port Forwarding (Router)
echo "🏠 Option 5: Port Forwarding (Router)"
echo "====================================="
echo "1. Router-Administration öffnen"
echo "2. Port Forwarding einrichten:"
echo "   - Externer Port: 3002"
echo "   - Interner Port: 3002"
echo "   - IP: $(hostname -I | awk '{print $1}')"
echo "3. Öffnen Sie: http://$(curl -s ifconfig.me):3002"
echo ""

# Aktuelle Netzwerk-Informationen
echo "📊 Aktuelle Netzwerk-Informationen:"
echo "=================================="
echo "Lokale IP: $(hostname -I | awk '{print $1}')"
echo "Öffentliche IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Nicht verfügbar')"
echo "Server läuft auf: http://localhost:3002"
echo ""

# Empfehlung
echo "💡 Empfehlung:"
echo "=============="
echo "Für den einfachsten Start verwenden Sie Option 3 (Serveo):"
echo "   ssh -R 80:localhost:3002 serveo.net"
echo ""
echo "Falls SSH nicht verfügbar ist, verwenden Sie Option 1 (Ngrok):"
echo "   ngrok http 3002"
echo ""

# Test-Script erstellen
cat > test-mobile-access.js << 'EOF'
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
EOF

chmod +x test-mobile-access.js

echo "📝 Test-Script erstellt: test-mobile-access.js"
echo "   Führen Sie aus mit: node test-mobile-access.js"
echo ""

