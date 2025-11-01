'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string | null;
  status: string;
  paymentStatus: string;
  invoiceDate: string;
  dueDate: string;
  paymentDate: string | null;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  items: InvoiceItem[];
  pdfStorageKey: string | null;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/user/invoices');
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
    type IconComponent = typeof FileText;
    const variants: Record<string, { variant: BadgeVariant; icon: IconComponent; label: string }> = {
      DRAFT: { variant: 'secondary', icon: FileText, label: 'Entwurf' },
      ISSUED: { variant: 'default', icon: FileText, label: 'Ausgestellt' },
      SENT: { variant: 'default', icon: FileText, label: 'Gesendet' },
      OVERDUE: { variant: 'destructive', icon: XCircle, label: 'Überfällig' },
      PAID: { variant: 'default', icon: CheckCircle, label: 'Bezahlt' },
      CANCELLED: { variant: 'secondary', icon: XCircle, label: 'Storniert' },
    };

    const config = variants[status] || { variant: 'secondary', icon: FileText, label: status };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
    type IconComponent = typeof FileText;
    const variants: Record<string, { variant: BadgeVariant; icon: IconComponent; label: string }> = {
      UNPAID: { variant: 'destructive', icon: XCircle, label: 'Nicht bezahlt' },
      PENDING: { variant: 'default', icon: Clock, label: 'Ausstehend' },
      PAID: { variant: 'default', icon: CheckCircle, label: 'Bezahlt' },
      FAILED: { variant: 'destructive', icon: XCircle, label: 'Fehlgeschlagen' },
      REFUNDED: { variant: 'secondary', icon: CheckCircle, label: 'Erstattet' },
    };

    const config = variants[status] || { variant: 'secondary', icon: Clock, label: status };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      const response = await fetch(`/api/user/invoices/${invoice.id}/download`);
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Fehler beim Herunterladen der Rechnung.');
        return;
      }

      // Get PDF blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Fehler beim Herunterladen der Rechnung.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 p-8">
        <div className="container mx-auto">
          <div className="text-white">Lade Rechnungen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Meine Rechnungen</h1>
          <p className="text-gray-300">Alle Ihre Rechnungen auf einen Blick</p>
        </div>

        {invoices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Sie haben noch keine Rechnungen.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        {invoice.invoiceNumber}
                        {invoice.orderNumber && (
                          <Link
                            href={`/de/orders/${invoice.orderNumber}`}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            (Bestellung: {invoice.orderNumber})
                          </Link>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(invoice.status)}
                        {getPaymentStatusBadge(invoice.paymentStatus)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Rechnungsdatum: {formatDate(invoice.invoiceDate)}
                      </div>
                      {invoice.dueDate && (
                        <div className="text-sm text-muted-foreground">
                          Fälligkeitsdatum: {formatDate(invoice.dueDate)}
                        </div>
                      )}
                      {invoice.paymentDate && (
                        <div className="text-sm text-green-600 mt-1">
                          Bezahlt am: {formatDate(invoice.paymentDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoice.items.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Positionen:</h3>
                        <div className="space-y-2">
                          {invoice.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <p className="font-medium">{item.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} x {formatCurrency(item.unitPrice, invoice.currency)}
                                </p>
                              </div>
                              <div className="font-semibold">
                                {formatCurrency(item.total, invoice.currency)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Zwischensumme:</p>
                        <p className="text-sm text-muted-foreground">MwSt.:</p>
                        <p className="font-bold mt-2">Gesamt:</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {formatCurrency(invoice.subtotal, invoice.currency)}
                        </p>
                        <p className="text-sm">
                          {formatCurrency(invoice.taxAmount, invoice.currency)}
                        </p>
                        <p className="font-bold mt-2">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => handleDownload(invoice)} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        PDF herunterladen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

