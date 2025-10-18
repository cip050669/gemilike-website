'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  Star,
  Edit,
  MessageSquare,
  Filter,
  Download
} from 'lucide-react';
import { CustomerDetailsModal } from '@/components/admin/CustomerDetailsModal';
import { CustomerNotesModal } from '@/components/admin/CustomerNotesModal';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  lastOrderAt?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  tags: string[];
  orders: Order[];
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  gemstoneName: string;
  quantity: number;
  price: number;
}

export default function CustomersPage() {
  const t = useTranslations('admin');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const customersData = await response.json();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
      // Fallback zu Mock-Daten bei Fehlern
      const mockCustomers: Customer[] = [
        {
          id: 'CUST-001',
          name: 'Max Mustermann',
          email: 'max.mustermann@email.com',
          phone: '+49 123 456789',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
          lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          totalOrders: 5,
          totalSpent: 12500,
          status: 'vip',
          notes: 'Sehr zufriedener Kunde, bevorzugt Smaragde',
          tags: ['VIP', 'Smaragd-Liebhaber'],
          orders: [
            {
              id: 'ORD-001',
              orderNumber: 'ORD-2025-001',
              total: 2500,
              status: 'delivered',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              items: [
                { id: 'ITEM-001', gemstoneName: 'Smaragd 001', quantity: 1, price: 2500 }
              ]
            }
          ]
        },
        {
          id: 'CUST-002',
          name: 'Anna Schmidt',
          email: 'anna.schmidt@email.com',
          phone: '+49 987 654321',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
          lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          totalOrders: 3,
          totalSpent: 8900,
          status: 'active',
          notes: 'Interessiert sich für Rubine',
          tags: ['Rubin-Interesse'],
          orders: [
            {
              id: 'ORD-002',
              orderNumber: 'ORD-2025-002',
              total: 3200,
              status: 'processing',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
              items: [
                { id: 'ITEM-002', gemstoneName: 'Rubin 002', quantity: 1, price: 3200 }
              ]
            }
          ]
        },
        {
          id: 'CUST-003',
          name: 'Peter Weber',
          email: 'peter.weber@email.com',
          phone: '+49 555 123456',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
          lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
          totalOrders: 2,
          totalSpent: 4200,
          status: 'active',
          notes: 'Sammler von Diamanten',
          tags: ['Diamant-Sammler'],
          orders: [
            {
              id: 'ORD-003',
              orderNumber: 'ORD-2024-120',
              total: 2100,
              status: 'delivered',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
              items: [
                { id: 'ITEM-003', gemstoneName: 'Diamant 003', quantity: 1, price: 2100 }
              ]
            }
          ]
        },
        {
          id: 'CUST-004',
          name: 'Lisa Müller',
          email: 'lisa.mueller@email.com',
          phone: '+49 777 888999',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
          lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
          totalOrders: 1,
          totalSpent: 1800,
          status: 'inactive',
          notes: 'Einmaliger Käufer, Saphir gekauft',
          tags: ['Einmalig'],
          orders: [
            {
              id: 'ORD-004',
              orderNumber: 'ORD-2024-115',
              total: 1800,
              status: 'delivered',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
              items: [
                { id: 'ITEM-004', gemstoneName: 'Saphir 004', quantity: 1, price: 1800 }
              ]
            }
          ]
        },
        {
          id: 'CUST-005',
          name: 'Thomas Klein',
          email: 'thomas.klein@email.com',
          phone: '+49 333 444555',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
          totalOrders: 4,
          totalSpent: 15600,
          status: 'vip',
          notes: 'Neuer VIP-Kunde, hohe Ausgaben',
          tags: ['VIP', 'Neu', 'Hochwertig'],
          orders: [
            {
              id: 'ORD-005',
              orderNumber: 'ORD-2025-003',
              total: 4500,
              status: 'shipped',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
              items: [
                { id: 'ITEM-005', gemstoneName: 'Smaragd 005', quantity: 1, price: 4500 }
              ]
            }
          ]
        }
      ];
      setCustomers(mockCustomers);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  const handleCustomerClick = (customer: Customer) => {
    console.log('👁️ CUSTOMER DETAILS BUTTON CLICKED:', customer.id);
    alert(`👁️ KUNDE ${customer.name.toUpperCase()} DETAILS WERDEN ANGEZEIGT!\n\nEmail: ${customer.email}\nStatus: ${customer.status.toUpperCase()}\nBestellungen: ${customer.totalOrders}`);
    
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleEditNotes = (customer: Customer) => {
    console.log('📝 CUSTOMER NOTES BUTTON CLICKED:', customer.id);
    alert(`📝 NOTIZEN FÜR ${customer.name.toUpperCase()} WERDEN BEARBEITET!\n\nAktuelle Notiz: ${customer.notes || 'Keine Notizen'}`);
    
    setSelectedCustomer(customer);
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async (customerId: string, notes: string) => {
    try {
      const response = await fetch('/api/admin/customers/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, notes })
      });

      if (response.ok) {
        setCustomers(prev => prev.map(c => 
          c.id === customerId ? { ...c, notes } : c
        ));
        setIsNotesModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const exportCustomers = () => {
    console.log('💾 EXPORT CUSTOMERS BUTTON CLICKED');
    alert('💾 KUNDENDATEN WERDEN EXPORTIERT!');
    
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Status', 'Created At', 'Last Order'].join(','),
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.email,
        customer.phone || '',
        customer.totalOrders,
        customer.totalSpent,
        customer.status,
        new Date(customer.createdAt).toLocaleDateString('de-DE'),
        customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString('de-DE') : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      alert(`✅ Kundendaten erfolgreich exportiert!\n\nDatei: customers-${new Date().toISOString().split('T')[0]}.csv\nKunden: ${filteredCustomers.length}`);
    }, 500);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'vip': return 'default';
      case 'active': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Lade Kunden...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Kundenverwaltung</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCustomers} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Kunden, Bestellhistorie und Notizen
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Kunden suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inaktiv</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Kunden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kunden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Kunden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'vip').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('de-DE')} €
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(customer.createdAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getStatusBadgeVariant(customer.status)}>
                        {customer.status.toUpperCase()}
                      </Badge>
                      {customer.status === 'vip' && <Star className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.totalOrders} Bestellungen • {customer.totalSpent.toLocaleString('de-DE')} €
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNotes(customer)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Keine Kunden gefunden</p>
        </div>
      )}

      {/* Modals */}
      {selectedCustomer && (
        <>
          <CustomerDetailsModal
            customer={selectedCustomer}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
          />
          <CustomerNotesModal
            customer={selectedCustomer}
            isOpen={isNotesModalOpen}
            onClose={() => setIsNotesModalOpen(false)}
            onSave={handleSaveNotes}
          />
        </>
      )}
    </div>
  );
}
