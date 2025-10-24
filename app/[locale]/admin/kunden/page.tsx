'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';

interface Customer {
  id: string;
  customerNumber: string;
  company?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
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

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCustomers(customers.filter(c => c.id !== customerId));
      } else {
        alert('Fehler beim Löschen des Kunden');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Kunden:', error);
      alert('Fehler beim Löschen des Kunden');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.customerNumber.toLowerCase().includes(searchLower) ||
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.city.toLowerCase().includes(searchLower)
    );
  });

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Kunden</h1>
          <p className="text-gray-300 mt-2">Verwalten Sie Ihre Kunden und deren Informationen</p>
        </div>
        <Link href="/de/admin/kunden/neu">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Neuer Kunde
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kunden</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unternehmen</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {customers.filter(c => c.company).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Kunden suchen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Kundennummer, Name, E-Mail oder Stadt suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-white">Keine Kunden gefunden</h3>
            <p className="mt-1 text-sm text-gray-500">
              {customers.length === 0 
                ? 'Erstellen Sie Ihren ersten Kunden.' 
                : 'Versuchen Sie andere Suchkriterien.'}
            </p>
            {customers.length === 0 && (
              <div className="mt-6">
                <Link href="/de/admin/kunden/neu">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ersten Kunden erstellen
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {customer.company || `${customer.firstName} ${customer.lastName}`}
                    </CardTitle>
                    <CardDescription>
                      {customer.customerNumber}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.postalCode} {customer.city}</span>
                </div>
                
                {customer.company && (
                  <div className="text-sm text-gray-500">
                    {customer.firstName} {customer.lastName}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                  
                  <Link href={`/de/admin/kunden/${customer.id}/rechnungen`}>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Rechnungen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
