#!/bin/bash
# Script zum Beheben des npm_config_prefix Problems und Aktivieren von Node.js 22

echo "🔧 Behebe npm_config_prefix Problem und aktiviere Node.js 22..."
echo ""

# nvm aktivieren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# npm_config_prefix zurücksetzen
echo "📝 Setze npm_config_prefix zurück..."
unset npm_config_prefix

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
echo "✅ Node.js 22 aktiviert!"
echo ""
echo "Aktuelle Versionen:"
echo "  Node.js: $(node --version)"
echo "  npm:     $(npm --version)"
echo ""
echo "⚠️  WICHTIG: Führen Sie diese Befehle in Ihrer Shell aus:"
echo "   unset npm_config_prefix"
echo "   nvm use 22"
echo ""
