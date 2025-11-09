#!/bin/bash
# Komplettes Git Commit und Push Script mit Rebase

set -e

echo "=== Git Commit und Push - Komplett ==="
echo ""

cd /home/cip050669/CascadeProjects/gemilike-website

echo "Schritt 1: Prüfe Status..."
git status --short
echo ""

echo "Schritt 2: Stage alle Änderungen..."
git add -A
echo "✓ Alle Änderungen gestaged"
echo ""

echo "Schritt 3: Hole Remote-Änderungen..."
git fetch origin
echo "✓ Remote-Änderungen geholt"
echo ""

echo "Schritt 4: Rebase durchführen (synchronisiere Branches)..."
git pull --rebase origin main || {
    echo "⚠️ Rebase hatte Konflikte oder Probleme"
    echo "Versuche Merge statt Rebase..."
    git pull origin main
}
echo "✓ Branches synchronisiert"
echo ""

echo "Schritt 5: Prüfe ob noch uncommitted Änderungen vorhanden sind..."
if [ -n "$(git status --porcelain)" ]; then
    echo "Es gibt noch uncommitted Änderungen, committe sie..."
    git add -A
    git commit -m 'feat: Docker Setup, Markdown Linter Fixes, Accessibility Improvements'
    echo "✓ Commit erstellt"
else
    echo "Keine uncommitted Änderungen"
fi
echo ""

echo "Schritt 6: Zeige letzten Commit..."
git log --oneline -1
echo ""

echo "Schritt 7: Push zu GitHub..."
git push origin main
echo "✓ Push erfolgreich"
echo ""

echo "Schritt 8: Finaler Status..."
git status
echo ""

echo "=== Abgeschlossen ==="
echo "✓ Alle Änderungen wurden erfolgreich committed und gepusht"

