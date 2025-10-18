'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Calculator,
  User,
  FileText,
  Euro
} from 'lucide-react';

interface Customer {
  id: string;
  customerNumber: string;
  company?: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  useEffect(() => {
    fetchCustomers();
    // Set due date to 14 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    setDueDate(futureDate.toISOString().split('T')[0]);
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Kunden:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSave = async () => {
    if (!selectedCustomerId) {
      alert('Bitte wählen Sie einen Kunden aus.');
      return;
    }

    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
      alert('Bitte füllen Sie alle Artikel korrekt aus.');
      return;
    }

    setSaving(true);

    try {
      const invoiceData = {
        customerId: selectedCustomerId,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        subtotal: calculateSubtotal(),
        total: calculateSubtotal(), // No VAT for small business
        currency: 'EUR',
        notes: notes,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }))
      };

      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/de/admin/rechnungen');
      } else {
        alert('Fehler beim Erstellen der Rechnung: ' + result.error);
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Rechnung:', error);
      alert('Fehler beim Erstellen der Rechnung');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Lade Kunden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Neue Rechnung</h1>
          <p className="text-gray-600 mt-2">Erstellen Sie eine neue Rechnung für einen Kunden</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Kunde auswählen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Kunde *</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kunden auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.company || `${customer.firstName} ${customer.lastName}`}
                          {customer.company && ` (${customer.firstName} ${customer.lastName})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCustomerId && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const customer = customers.find(c => c.id === selectedCustomerId);
                      return customer ? (
                        <div>
                          <h4 className="font-medium">
                            {customer.company || `${customer.firstName} ${customer.lastName}`}
                          </h4>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-sm text-gray-600">
                            {customer.address}, {customer.postalCode} {customer.city}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Rechnungsdetails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceDate">Rechnungsdatum *</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Fälligkeitsdatum *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Rechnungspositionen
                </CardTitle>
                <Button onClick={addItem} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Position hinzufügen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <Label>Beschreibung *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Artikel oder Dienstleistung"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Menge *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Einzelpreis *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Gesamt</Label>
                      <div className="flex items-center h-10 px-3 border border-input bg-background rounded-md">
                        <Euro className="w-4 h-4 mr-1 text-gray-400" />
                        {item.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notizen</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Interne Notizen oder zusätzliche Informationen..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rechnungsübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Zwischensumme:</span>
                <span>{calculateSubtotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>MwSt. (0%):</span>
                <span>0,00 €</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Gesamt:</span>
                  <span>{calculateSubtotal().toFixed(2)} €</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <p>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={saving || !selectedCustomerId}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Rechnung erstellen
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full"
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

