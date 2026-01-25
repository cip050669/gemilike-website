#!/bin/bash
# Script to check and use correct Node.js version

# Load nvm if available (must be sourced, not executed)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Check if .nvmrc exists
if [ -f .nvmrc ]; then
  REQUIRED_VERSION=$(cat .nvmrc | tr -d '[:space:]')
  CURRENT_VERSION=$(node --version 2>/dev/null | tr -d 'v' || echo "")
  CURRENT_MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
  REQUIRED_MAJOR=$(echo "$REQUIRED_VERSION" | cut -d. -f1)
  
  # Check if major version matches (e.g., 22.x.x matches 22)
  if [ -z "$CURRENT_VERSION" ] || [ "$CURRENT_MAJOR" != "$REQUIRED_MAJOR" ]; then
    echo "⚠️  Node.js version mismatch!"
    echo "   Required: v$REQUIRED_VERSION (from .nvmrc)"
    echo "   Current:  v$CURRENT_VERSION"
    
    if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
      echo ""
      echo "📦 Installing/using Node.js v$REQUIRED_VERSION with nvm..."
      nvm install "$REQUIRED_VERSION" 2>/dev/null || true
      nvm use "$REQUIRED_VERSION"
      echo "✅ Switched to Node.js $(node --version)"
    else
      echo ""
      echo "❌ nvm not found. Please install Node.js v$REQUIRED_VERSION manually."
      echo "   Download from: https://nodejs.org/"
      exit 1
    fi
  else
    echo "✅ Node.js version correct: $(node --version)"
  fi
else
  echo "⚠️  No .nvmrc file found. Skipping version check."
fi

