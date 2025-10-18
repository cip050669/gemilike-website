# 📋 Rechnungsanwendung für Kleinunternehmer - Implementierungsleitfaden

## ✅ Bereits erledigt:
1. **Datenbank-Schema** - Vollständig in `prisma/schema.prisma`
2. **TypeScript-Typen** - In `lib/types/invoice.ts`

---

## 🚀 Implementierungsschritte

### **Schritt 2: API-Routes erstellen**

#### 2.1 Kunden-API (`app/api/admin/customers/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Alle Kunden abrufen
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { invoices: true }
        }
      }
    });
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST - Neuen Kunden erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Kundennummer generieren
    const lastCustomer = await prisma.customer.findFirst({
      orderBy: { customerNumber: 'desc' }
    });
    const nextNumber = lastCustomer 
      ? parseInt(lastCustomer.customerNumber.replace('K', '')) + 1 
      : 1;
    const customerNumber = `K${nextNumber.toString().padStart(5, '0')}`;

    const customer = await prisma.customer.create({
      data: {
        customerNumber,
        ...body
      }
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

// PUT - Kunden aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const customer = await prisma.customer.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE - Kunden löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID required' },
        { status: 400 }
      );
    }

    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
```

#### 2.2 Rechnungen-API (`app/api/admin/invoices/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Alle Rechnungen abrufen
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { invoiceDate: 'desc' },
      include: {
        customer: true,
        bankAccount: true,
        items: {
          orderBy: { order: 'asc' }
        }
      }
    });
    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST - Neue Rechnung erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, items, ...invoiceData } = body;

    // Rechnungsnummer generieren
    const settings = await prisma.companySettings.findFirst();
    const invoiceNumber = `${settings?.invoicePrefix || 'RE'}${settings?.nextInvoiceNumber.toString().padStart(5, '0')}`;

    // Gesamtsumme berechnen
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    );

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        subtotal,
        total: subtotal, // Keine MwSt. für Kleinunternehmer
        ...invoiceData,
        items: {
          create: items.map((item: any, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            order: index
          }))
        }
      },
      include: {
        customer: true,
        items: true
      }
    });

    // Nächste Rechnungsnummer erhöhen
    if (settings) {
      await prisma.companySettings.update({
        where: { id: settings.id },
        data: { nextInvoiceNumber: settings.nextInvoiceNumber + 1 }
      });
    }

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// PUT - Rechnung aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, items, ...invoiceData } = body;

    // Alte Items löschen
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    });

    // Neue Gesamtsumme berechnen
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    );

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...invoiceData,
        subtotal,
        total: subtotal,
        items: {
          create: items.map((item: any, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            order: index
          }))
        }
      },
      include: {
        customer: true,
        items: true
      }
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE - Rechnung löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID required' },
        { status: 400 }
      );
    }

    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
```

#### 2.3 Bankkonten-API (`app/api/admin/bank-accounts/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Alle Bankkonten abrufen
export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: { isDefault: 'desc' }
    });
    return NextResponse.json({ success: true, accounts });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank accounts' },
      { status: 500 }
    );
  }
}

// POST - Neues Bankkonto erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Wenn isDefault true ist, alle anderen auf false setzen
    if (body.isDefault) {
      await prisma.bankAccount.updateMany({
        data: { isDefault: false }
      });
    }

    const account = await prisma.bankAccount.create({
      data: body
    });

    return NextResponse.json({ success: true, account }, { status: 201 });
  } catch (error) {
    console.error('Error creating bank account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bank account' },
      { status: 500 }
    );
  }
}

// PUT - Bankkonto aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Wenn isDefault true ist, alle anderen auf false setzen
    if (data.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { id: { not: id } },
        data: { isDefault: false }
      });
    }

    const account = await prisma.bankAccount.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, account });
  } catch (error) {
    console.error('Error updating bank account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bank account' },
      { status: 500 }
    );
  }
}

// DELETE - Bankkonto löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Bank account ID required' },
        { status: 400 }
      );
    }

    await prisma.bankAccount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bank account' },
      { status: 500 }
    );
  }
}
```

#### 2.4 Firmeneinstellungen-API (`app/api/admin/company-settings/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Firmeneinstellungen abrufen
export async function GET() {
  try {
    let settings = await prisma.companySettings.findFirst();
    
    // Wenn keine Einstellungen existieren, Standardwerte erstellen
    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          companyName: 'Gemilike',
          ownerName: 'Inhaber Name',
          address: 'Musterstraße 1',
          postalCode: '12345',
          city: 'Musterstadt',
          country: 'Deutschland',
          email: 'info@gemilike.com',
          invoicePrefix: 'RE',
          nextInvoiceNumber: 1,
          smallBusinessNotice: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
          paymentTerms: 14
        }
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company settings' },
      { status: 500 }
    );
  }
}

// PUT - Firmeneinstellungen aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const settings = await prisma.companySettings.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company settings' },
      { status: 500 }
    );
  }
}
```

---

### **Schritt 3: Admin-Seiten erstellen**

Die Admin-Seiten werden im nächsten Schritt erstellt. Aufgrund der Token-Limits erstelle ich jetzt ein separates Dokument für die Frontend-Komponenten.

---

## 📦 Benötigte NPM-Pakete

```bash
npm install @react-pdf/renderer nodemailer
npm install -D @types/nodemailer
```

---

## 🎯 Nächste Schritte

1. **API-Routes erstellen** - Kopieren Sie die obigen Code-Snippets in die entsprechenden Dateien
2. **Seed-Daten erstellen** - Siehe `scripts/seed-invoice-data.ts` (wird noch erstellt)
3. **Frontend-Komponenten** - Siehe separates Dokument `INVOICE_FRONTEND_GUIDE.md`
4. **PDF-Generierung** - Siehe `lib/pdf/invoice-generator.ts` (wird noch erstellt)
5. **E-Mail-Versand** - Siehe `lib/email/invoice-mailer.ts` (wird noch erstellt)

---

## ✅ Status

- [x] Datenbank-Schema
- [x] TypeScript-Typen
- [x] API-Routes (Dokumentiert)
- [ ] Frontend-Komponenten
- [ ] PDF-Generierung
- [ ] E-Mail-Versand
- [ ] Navigation erweitern
- [ ] Seed-Daten

**Fortsetzung folgt in der nächsten Konversation!**


