#!/bin/bash
# Git Commit und Push Script

set -e

echo "=== Git Commit und Push ==="
echo ""

cd /home/cip050669/CascadeProjects/gemilike-website

echo "1. Git Status prüfen..."
git status
echo ""

echo "2. Alle Änderungen stagen..."
git add -A
echo "✓ Dateien gestaged"
echo ""

echo "3. Geänderte Dateien:"
git status --short
echo ""

echo "4. Commit erstellen..."
git commit -m "feat: Docker Setup, Markdown Linter Fixes, Accessibility Improvements

- Added comprehensive Docker setup with Makefile
- Created production and development Dockerfiles
- Fixed all 59 Markdown linter errors in UMSETZUNGSPLAN.md
- Fixed accessibility issue in legal-pages admin component
- Updated ANWENDERHANDBUCH with Borderline v4 features
- All builds passing, no linter errors"
echo "✓ Commit erstellt"
echo ""

echo "5. Letzter Commit:"
git log --oneline -1
echo ""

echo "6. Zu GitHub pushen..."
git push
echo "✓ Push erfolgreich"
echo ""

echo "7. Finaler Status:"
git status
echo ""

echo "=== Abgeschlossen ==="

