#!/bin/bash
# SOFORTIGE LÖSUNG - Git Problem beheben

set -e

cd /home/cip050669/CascadeProjects/gemilike-website

echo "=== SOFORTIGE LÖSUNG ==="
echo ""

echo "1. Alle Änderungen stagen..."
git add -A
echo "✓ Gestaged"
echo ""

echo "2. Änderungen committen..."
git commit -m 'feat: Docker Setup, Markdown Linter Fixes, Accessibility Improvements' || echo "Bereits committed oder nichts zu committen"
echo "✓ Committed"
echo ""

echo "3. Remote-Änderungen holen..."
git fetch origin
echo "✓ Geholt"
echo ""

echo "4. Rebase durchführen..."
git pull --rebase origin main
echo "✓ Rebase erfolgreich"
echo ""

echo "5. Zu GitHub pushen..."
git push origin main
echo "✓ Push erfolgreich"
echo ""

echo "6. Finaler Status..."
git status
echo ""

echo "=== PROBLEM GELÖST ==="

