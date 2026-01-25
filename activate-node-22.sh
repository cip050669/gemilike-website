#!/bin/bash
# Script zum Aktivieren von Node.js 22
# WICHTIG: Dieses Script muss mit 'source' ausgeführt werden, nicht direkt!
# 
# Verwendung:
#   source activate-node-22.sh
#   ODER
#   . activate-node-22.sh

echo "🔧 Node.js 22 wird aktiviert..."
echo ""

# nvm aktivieren
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh"
  echo "✅ nvm aktiviert"
else
  echo "❌ nvm nicht gefunden. Bitte installieren Sie nvm zuerst."
  echo "   https://github.com/nvm-sh/nvm#installing-and-updating"
  return 1 2>/dev/null || exit 1
fi

# Prüfen ob Node.js 22 installiert ist
if ! nvm list 22 &>/dev/null || [ -z "$(nvm list 22 | grep -E 'v22|->')" ]; then
  echo ""
  echo "📦 Node.js 22 wird installiert..."
  nvm install 22
fi

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
echo "✅ Node.js 22 aktiviert!"
echo ""
echo "Aktuelle Versionen:"
echo "  Node.js: $(node --version)"
echo "  npm:     $(npm --version)"
echo ""
echo "Sie können jetzt 'npm run dev' ausführen."

