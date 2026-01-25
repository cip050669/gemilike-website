'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Truck, Mail, Phone } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  city?: string;
  isActive: boolean;
  rating?: number;
  _count: {
    purchaseOrders: number;
  };
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/admin/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Lieferanten wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/suppliers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSuppliers();
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Löschen');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Fehler beim Löschen');
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lieferantenverwaltung</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Ihre Lieferanten und deren Informationen
          </p>
        </div>
        <Link href="/de/admin/warehouse/suppliers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Lieferant
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Lieferanten suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {supplier.name}
                  </CardTitle>
                  {supplier.companyName && (
                    <CardDescription className="mt-1">
                      {supplier.companyName}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {supplier.isActive ? (
                    <Badge variant="default" className="bg-green-500">
                      Aktiv
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inaktiv</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {supplier.contactPerson && (
                <div className="text-sm">
                  <span className="font-medium">Ansprechpartner:</span> {supplier.contactPerson}
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {supplier.email}
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {supplier.phone}
                </div>
              )}
              {supplier.city && (
                <div className="text-sm text-muted-foreground">
                  📍 {supplier.city}
                </div>
              )}
              {supplier.rating && (
                <div className="text-sm">
                  <span className="font-medium">Bewertung:</span>{' '}
                  {'⭐'.repeat(supplier.rating)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {supplier._count.purchaseOrders} Bestellungen
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Link href={`/de/admin/warehouse/suppliers/${supplier.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(supplier.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Keine Lieferanten gefunden' : 'Noch keine Lieferanten vorhanden'}
            </p>
            {!searchTerm && (
              <Link href="/de/admin/warehouse/suppliers/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ersten Lieferanten anlegen
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

