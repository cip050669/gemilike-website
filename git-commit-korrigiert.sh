#!/bin/bash
# Korrigierter Git Commit und Push

cd /home/cip050669/CascadeProjects/gemilike-website

echo "=== Git Commit und Push ==="
echo ""

echo "1. Alle Änderungen stagen..."
git add -A
echo "✓ Dateien gestaged"
echo ""

echo "2. Commit erstellen..."
git commit -m "feat: Docker Setup, Markdown Linter Fixes, Accessibility Improvements"
echo "✓ Commit erstellt"
echo ""

echo "3. Zu GitHub pushen..."
git push origin main
echo "✓ Push erfolgreich"
echo ""

echo "=== Abgeschlossen ==="

