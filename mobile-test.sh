#!/bin/bash

# Mobile Testing Script für Gemilike Website
# Verwendung: ./mobile-test.sh [PORT] [--tunnel]

PORT=${1:-3000}
TUNNEL=${2:-""}

echo "🚀 Gemilike Mobile Testing Setup"
echo "================================="

# Alle laufenden Next.js Prozesse stoppen
echo "🛑 Stoppe alle laufenden Server..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Port freigeben
echo "🔓 Mache Port $PORT frei..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
sleep 1

# Server starten
echo "🚀 Starte Next.js Server auf Port $PORT..."
if [ "$TUNNEL" = "--tunnel" ]; then
    echo "🌐 Starte mit LAN-Zugriff..."
    npm run dev:lan &
else
    echo "🏠 Starte lokalen Server..."
    npm run dev &
fi

# Warten bis Server läuft
echo "⏳ Warte auf Server-Start..."
sleep 5

# IP-Adresse ermitteln
IP=$(hostname -I | awk '{print $1}')
echo ""
echo "📱 Mobile Testing URLs:"
echo "======================="
echo "🏠 Homepage: http://$IP:$PORT/de"
echo "🛒 Shop:     http://$IP:$PORT/de/shop"
echo "⚙️  Admin:    http://$IP:$PORT/de/admin"
echo ""

# QR-Code generieren (falls qrencode installiert ist)
if command -v qrencode &> /dev/null; then
    echo "📱 QR-Code für Homepage:"
    qrencode -t ansiutf8 "http://$IP:$PORT/de"
    echo ""
fi

# Server-Status prüfen
echo "🔍 Prüfe Server-Status..."
if curl -s -I "http://$IP:$PORT/de" | grep -q "200 OK"; then
    echo "✅ Server läuft erfolgreich!"
    echo "📱 Verwenden Sie die URLs oben auf Ihrem Handy"
else
    echo "❌ Server-Problem erkannt"
    echo "🔧 Versuche alternative Ports..."
    
    # Alternative Ports versuchen
    for alt_port in 3001 3002 3003 3004 3005; do
        echo "🔄 Versuche Port $alt_port..."
        lsof -ti:$alt_port | xargs kill -9 2>/dev/null || true
        PORT=$alt_port npm run dev:lan &
        sleep 3
        if curl -s -I "http://$IP:$alt_port/de" | grep -q "200 OK"; then
            echo "✅ Server läuft auf Port $alt_port!"
            echo "📱 Neue URL: http://$IP:$alt_port/de"
            break
        fi
    done
fi

echo ""
echo "🎯 Mobile Testing Checkliste:"
echo "============================="
echo "✅ Homepage lädt korrekt"
echo "✅ Newsticker funktioniert (135px Abstand)"
echo "✅ Geschichten-Sektion scrollbar"
echo "✅ Shop-Thumbnails mit farbigen Piktogrammen"
echo "✅ GemstoneCard mit Tooltips"
echo "✅ Admin-Panel zugänglich"
echo ""
echo "🔧 Troubleshooting:"
echo "- Falls Verbindung fehlschlägt: WLAN prüfen"
echo "- Falls Seite nicht lädt: Browser-Cache leeren"
echo "- Falls Port belegt: Script erneut ausführen"
echo ""
echo "📱 Viel Erfolg beim Mobile Testing!"


