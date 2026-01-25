# Warenwirtschaftssystem (WWS) - Migration Anleitung

**Datum:** 11. Januar 2026

---

## Übersicht

Das Warenwirtschaftssystem wurde vollständig implementiert, aber die Datenbank-Migration kann nur durchgeführt werden, wenn eine `DATABASE_URL` verfügbar ist.

---

## Status

✅ **Abgeschlossen:**
- Datenbank-Modelle definiert (Supplier, Warehouse, PurchaseOrder, StockMovement, etc.)
- API-Routes implementiert
- Admin-UI Seiten erstellt
- Dashboard mit Statistiken erstellt

⏳ **Ausstehend:**
- Datenbank-Migration (erfordert DATABASE_URL)

---

## Migration durchführen

### Voraussetzungen

1. **DATABASE_URL setzen:**
   ```bash
   # In .env Datei oder als Umgebungsvariable
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

2. **Prisma Client generieren:**
   ```bash
   npx prisma generate
   ```

### Migration ausführen

```bash
# Migration erstellen und anwenden
npx prisma migrate dev --name add_warehouse_management_system

# Oder nur Migration erstellen (ohne anzuwenden)
npx prisma migrate dev --name add_warehouse_management_system --create-only
```

### Nach der Migration

```bash
# Prisma Client neu generieren (falls nötig)
npx prisma generate
```

---

## Neue Datenbank-Modelle

Die Migration erstellt folgende Tabellen:

- **Supplier** - Lieferantenverwaltung
- **Warehouse** - Lagerorte
- **PurchaseOrder** - Einkaufsbestellungen
- **PurchaseOrderItem** - Bestellpositionen
- **StockMovement** - Lagerbewegungen
- **StockReservation** - Bestandsreservierungen

### Enums

- **PurchaseOrderStatus** - Status von Einkaufsbestellungen
- **StockMovementType** - Typen von Lagerbewegungen
- **StockReferenceType** - Referenztypen für Bewegungen
- **ReservationStatus** - Status von Reservierungen

---

## Verwendung

Nach der Migration sind alle Funktionen verfügbar:

1. **Admin-Bereich:** `/de/admin/warehouse`
2. **API-Routes:**
   - `/api/admin/suppliers`
   - `/api/admin/warehouses`
   - `/api/admin/purchase-orders`
   - `/api/admin/stock-movements`
   - `/api/admin/warehouse/stats`

---

## Fehlerbehebung

### Fehler: "DATABASE_URL is required"

**Lösung:** Stellen Sie sicher, dass `DATABASE_URL` in Ihrer `.env` Datei gesetzt ist:

```bash
# .env Datei erstellen/bearbeiten
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/dbname"' >> .env
```

### Fehler: "The datasource.url property is required"

**Lösung:** Die `prisma.config.ts` wurde aktualisiert, um eine klarere Fehlermeldung zu zeigen. Stellen Sie sicher, dass `DATABASE_URL` gesetzt ist.

---

## Hinweise

- Die Migration kann jederzeit durchgeführt werden, wenn die Datenbank verfügbar ist
- Alle UI-Komponenten und API-Routes funktionieren bereits (mit Fallbacks)
- Nach der Migration werden echte Daten angezeigt

---

**Letzte Aktualisierung:** 11. Januar 2026

