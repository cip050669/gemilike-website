#!/bin/bash
# Script zum Beheben der NEXTAUTH_URL

echo "🔧 NEXTAUTH_URL wird aktualisiert..."
echo ""

# Prüfe ob .env existiert
if [ ! -f .env ]; then
  echo "❌ .env Datei nicht gefunden!"
  exit 1
fi

# Backup erstellen
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup erstellt: .env.backup.*"

# Aktualisiere NEXTAUTH_URL
if grep -q "NEXTAUTH_URL" .env; then
  # Ersetze die Zeile
  sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="http://192.168.1.105:3003"|' .env
  echo "✅ NEXTAUTH_URL aktualisiert auf: http://192.168.1.105:3003"
else
  # Füge die Zeile hinzu
  echo 'NEXTAUTH_URL="http://192.168.1.105:3003"' >> .env
  echo "✅ NEXTAUTH_URL hinzugefügt"
fi

echo ""
echo "📋 Nächste Schritte:"
echo "1. Server neu starten: npm run dev"
echo "2. Login testen: http://192.168.1.105:3003/de/admin/login"
echo ""
