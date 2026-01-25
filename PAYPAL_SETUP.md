# PayPal Integration Setup

**Status:** ✅ Implementiert  
**Datum:** 2025-01-13  
**Version:** 1.0

---

## 🎯 Übersicht

Die PayPal-Integration ermöglicht Online-Zahlungen über PayPal (sowohl PayPal-Konto als auch Kreditkarte). Beide Zahlungsmethoden werden über PayPal abgewickelt.

---

## 📦 Installierte Pakete

- `@paypal/react-paypal-js` - PayPal SDK für Frontend (React)
- `@paypal/paypal-server-sdk` - PayPal SDK für Backend (Server-Side)

---

## 🔧 Konfiguration

### 1. PayPal Developer Account erstellen

1. Gehen Sie zu [PayPal Developer](https://developer.paypal.com/)
2. Erstellen Sie ein Konto oder melden Sie sich an
3. Erstellen Sie eine App:
   - **Sandbox** für Tests
   - **Live** für Produktion

### 2. Umgebungsvariablen konfigurieren

Fügen Sie folgende Variablen zu Ihrer `.env.local` Datei hinzu:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=sandbox  # oder 'live' für Produktion

# App URL (für PayPal Redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3003  # oder Ihre Produktions-URL
```

### 3. PayPal Client ID und Secret erhalten

**Sandbox (Test):**
1. Gehen Sie zu [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox)
2. Erstellen Sie eine neue App oder verwenden Sie eine bestehende
3. Kopieren Sie die **Client ID** und das **Secret**

**Live (Produktion):**
1. Gehen Sie zu [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications)
2. Erstellen Sie eine neue App oder verwenden Sie eine bestehende
3. Kopieren Sie die **Client ID** und das **Secret**

---

## 🚀 Verwendung

### Checkout-Flow

1. **Kunde wählt Zahlungsmethode:**
   - PayPal
   - Kreditkarte (über PayPal)

2. **Bestellung wird erstellt:**
   - Adressdaten werden gespeichert
   - Bestellung wird mit Status `PENDING` und `UNPAID` erstellt

3. **PayPal Checkout:**
   - PayPal Button wird angezeigt
   - Kunde wird zu PayPal weitergeleitet
   - Kunde kann mit PayPal-Konto oder Kreditkarte bezahlen

4. **Zahlungsbestätigung:**
   - Nach erfolgreicher Zahlung wird Bestellung auf `PAID` gesetzt
   - Weiterleitung zur Bestellbestätigung

---

## 📡 API Endpoints

### `POST /api/paypal/create-order`

Erstellt eine PayPal-Bestellung.

**Request:**
```json
{
  "orderId": "order-id-from-database",
  "total": 1250.00,
  "currency": "EUR"
}
```

**Response:**
```json
{
  "orderId": "paypal-order-id",
  "status": "CREATED"
}
```

### `POST /api/paypal/capture-order`

Erfasst eine PayPal-Bestellung nach Kundenbestätigung.

**Request:**
```json
{
  "paypalOrderId": "paypal-order-id",
  "orderId": "order-id-from-database"
}
```

**Response:**
```json
{
  "success": true,
  "status": "COMPLETED",
  "orderId": "order-id-from-database",
  "paymentStatus": "PAID"
}
```

### `POST /api/paypal/webhook`

Webhook-Handler für PayPal-Events.

**Konfiguration:**
1. Gehen Sie zu PayPal Developer Dashboard
2. Wählen Sie Ihre App
3. Fügen Sie Webhook URL hinzu: `https://your-domain.com/api/paypal/webhook`
4. Wählen Sie Events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `CHECKOUT.ORDER.APPROVED`

---

## 🧪 Testing

### Sandbox Test Accounts

PayPal stellt Test-Accounts zur Verfügung:

1. Gehen Sie zu [PayPal Sandbox](https://developer.paypal.com/dashboard/accounts)
2. Erstellen Sie Test-Accounts:
   - **Käufer-Account** (für Test-Zahlungen)
   - **Verkäufer-Account** (für Test-Empfang)

### Test-Zahlung durchführen

1. Starten Sie den Development Server: `npm run dev`
2. Gehen Sie zur Checkout-Seite
3. Wählen Sie "PayPal" oder "Kreditkarte (über PayPal)"
4. Klicken Sie auf "Bestellung abschließen"
5. PayPal Button wird angezeigt
6. Verwenden Sie Sandbox-Test-Account für Zahlung

---

## 🔒 Sicherheit

- **Client ID** ist öffentlich (kann im Frontend verwendet werden)
- **Client Secret** ist privat (nur Server-Side)
- Webhook-Events sollten verifiziert werden (aktuell nicht implementiert, empfohlen für Produktion)

---

## 📝 Bestellstatus

Nach erfolgreicher PayPal-Zahlung:

- `paymentStatus`: `UNPAID` → `PAID`
- `paymentMethod`: `PAYPAL`
- `paidAt`: Aktuelles Datum/Zeit
- `notes`: Enthält PayPal Order ID und Capture ID

---

## 🐛 Fehlerbehebung

### PayPal Button wird nicht angezeigt

- Prüfen Sie, ob `NEXT_PUBLIC_PAYPAL_CLIENT_ID` gesetzt ist
- Prüfen Sie Browser-Konsole auf Fehler
- Stellen Sie sicher, dass PayPal SDK korrekt geladen wird

### Zahlung schlägt fehl

- Prüfen Sie PayPal Developer Dashboard auf Fehler
- Prüfen Sie Server-Logs auf API-Fehler
- Stellen Sie sicher, dass `PAYPAL_CLIENT_SECRET` korrekt ist

### Webhook funktioniert nicht

- Prüfen Sie Webhook-URL in PayPal Dashboard
- Stellen Sie sicher, dass Webhook-Events aktiviert sind
- Prüfen Sie Server-Logs auf Webhook-Requests

---

## 📚 Weitere Ressourcen

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Checkout Integration](https://developer.paypal.com/docs/checkout/)
- [PayPal Webhooks](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)

---

## ✅ Implementierte Features

- ✅ PayPal Checkout Button Integration
- ✅ Kreditkartenzahlung über PayPal
- ✅ Bestellstatus-Updates nach Zahlung
- ✅ Webhook-Handler für Zahlungsbestätigungen
- ✅ Error Handling
- ✅ Loading States

---

## 🔄 Nächste Schritte (Optional)

- [ ] Webhook-Signatur-Verifizierung
- [ ] Refund-Funktionalität
- [ ] Zahlungshistorie
- [ ] Zahlungsbenachrichtigungen per E-Mail


