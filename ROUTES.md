# Verfügbare Routen

## Deutsch (Standard)

**Hinweis:** Der Development Server läuft standardmäßig auf Port 3000. Falls dieser belegt ist, wird automatisch ein anderer Port verwendet (z.B. 3002). Prüfen Sie die Terminal-Ausgabe für den korrekten Port.

### Öffentliche Seiten
- **Homepage:** http://localhost:3000 oder http://localhost:3000/de
- **Über uns:** http://localhost:3000/de/about
- **Leistungen:** http://localhost:3000/de/services
- **Blog:** http://localhost:3000/de/blog
- **Shop:** http://localhost:3000/de/shop
- **Warenkorb:** http://localhost:3000/de/cart
- **Kontakt:** http://localhost:3000/de/contact

### Rechtliche Seiten (noch zu erstellen)
- **Impressum:** http://localhost:3000/de/imprint
- **Datenschutz:** http://localhost:3000/de/privacy
- **AGB:** http://localhost:3000/de/terms

## Englisch

### Public Pages
- **Homepage:** http://localhost:3000/en
- **About:** http://localhost:3000/en/about
- **Services:** http://localhost:3000/en/services
- **Blog:** http://localhost:3000/en/blog
- **Shop:** http://localhost:3000/en/shop
- **Cart:** http://localhost:3000/en/cart
- **Contact:** http://localhost:3000/en/contact

## API-Endpunkte

- **Kontaktformular:** POST http://localhost:3000/api/contact
  ```json
  {
    "name": "Max Mustermann",
    "email": "max@example.com",
    "subject": "Frage zu Edelsteinen",
    "message": "Ihre Nachricht",
    "locale": "de"
  }
  ```

- **Newsletter:** POST http://localhost:3000/api/newsletter
  ```json
  {
    "email": "max@example.com",
    "locale": "de"
  }
  ```

- **Bestellbestätigung:** POST http://localhost:3000/api/orders/confirmation
  ```json
  {
    "orderNumber": "ORD-2025-001",
    "customerEmail": "customer@example.com",
    "customerName": "Max Mustermann",
    "orderDate": "2025-01-10",
    "totalAmount": 299.99,
    "currency": "EUR",
    "items": [
      {
        "name": "Kolumbianischer Smaragd",
        "quantity": 1,
        "price": 299.99
      }
    ],
    "locale": "de"
  }
  ```

## Sprachumschaltung

Die Middleware leitet automatisch um:
- `/` → `/de` (Standard-Sprache)
- Benutzer kann über Header zwischen DE/EN wechseln
- Sprache wird in Cookie gespeichert

## Produktions-URLs (nach Deployment)

- https://gemilike.de
- https://gemilike.de/en
- https://gemilike.com (sollte auf gemilike.de weiterleiten)
