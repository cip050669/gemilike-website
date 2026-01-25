#!/bin/bash
# Script zum Aktivieren von Node.js 22 mit nvm

set -e

echo "🔧 Node.js 22 Setup wird durchgeführt..."
echo ""

# nvm aktivieren
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh"
  echo "✅ nvm aktiviert"
else
  echo "❌ nvm nicht gefunden. Bitte installieren Sie nvm zuerst."
  echo "   https://github.com/nvm-sh/nvm#installing-and-updating"
  exit 1
fi

# Node.js 22 installieren
echo ""
echo "📦 Installiere Node.js 22..."
nvm install 22

# Node.js 22 aktivieren
echo ""
echo "🔄 Aktiviere Node.js 22..."
nvm use 22

# Als Standard setzen
echo ""
echo "⭐ Setze Node.js 22 als Standard..."
nvm alias default 22

# Versionen anzeigen
echo ""
echo "✅ Setup abgeschlossen!"
echo ""
echo "Aktuelle Versionen:"
echo "  Node.js: $(node --version)"
echo "  npm:     $(npm --version)"
echo ""
echo "Sie können jetzt 'npm run dev' ausführen."

