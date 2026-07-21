#!/usr/bin/env bash
# Stellt sicher, dass die lokale Dev-PostgreSQL laeuft (Docker Compose),
# bevor Next.js startet. Reduziert P1001-/Connection-Fehler nachhaltig.
#
# Ueberspringen:
#   SKIP_ENSURE_DEV_DB=1 npm run dev          (Remote-DB, ohne Docker)
#   CI-Umgebungen werden automatisch uebersprungen.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -n "${CI:-}" || -n "${GITHUB_ACTIONS:-}" || -n "${VERCEL:-}" ]]; then
  echo "[ensure-dev-postgres] CI/Hosting erkannt — ueberspringe."
  exit 0
fi

if [[ "${SKIP_ENSURE_DEV_DB:-}" == "1" ]]; then
  echo "[ensure-dev-postgres] SKIP_ENSURE_DEV_DB=1 — ueberspringe."
  exit 0
fi

POSTGRES_PORT="${POSTGRES_PORT:-5433}"
POSTGRES_USER="${POSTGRES_USER:-gemilike}"
POSTGRES_DB="${POSTGRES_DB:-gemilike}"

port_reachable() {
  local host="127.0.0.1"
  (echo >/dev/tcp/${host}/${POSTGRES_PORT}) &>/dev/null
}

if port_reachable; then
  echo "[ensure-dev-postgres] Port ${POSTGRES_PORT} ist erreichbar — kein Docker-Start noetig."
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "[ensure-dev-postgres] WARNUNG: Port ${POSTGRES_PORT} ist nicht offen und Docker fehlt."
  echo "  Starten Sie PostgreSQL manuell oder installieren Sie Docker und nutzen Sie: npm run db:up"
  exit 0
fi

if ! docker info >/dev/null 2>&1; then
  echo "[ensure-dev-postgres] WARNUNG: Docker-Daemon laeuft nicht (docker info fehlgeschlagen)."
  echo "  Starten Sie Docker Desktop bzw. den Docker-Dienst, dann: npm run db:up"
  exit 0
fi

if [[ ! -f docker-compose.yml ]]; then
  echo "[ensure-dev-postgres] Keine docker-compose.yml — ueberspringe."
  exit 0
fi

echo "[ensure-dev-postgres] Starte PostgreSQL (docker compose up -d postgres)…"
docker compose up -d postgres

echo "[ensure-dev-postgres] Warte auf pg_isready (max. ca. 90s)…"
for _ in $(seq 1 45); do
  if docker compose exec -T postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; then
    echo "[ensure-dev-postgres] PostgreSQL ist bereit (User=${POSTGRES_USER}, DB=${POSTGRES_DB})."
    exit 0
  fi
  sleep 2
done

echo "[ensure-dev-postgres] FEHLER: PostgreSQL im Container wurde nicht rechtzeitig bereit."
echo "  Logs: docker compose logs postgres"
echo "  Remote-DB ohne lokalen Container: SKIP_ENSURE_DEV_DB=1 npm run dev"
exit 1
