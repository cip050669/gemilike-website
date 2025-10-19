'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  User,
  UserCheck,
  UserX
} from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: Address;
  status: 'active' | 'inactive' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  registrationDate: string;
  notes?: string;
  preferences: {
    newsletter: boolean;
    sms: boolean;
    categories: string[];
  };
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, filterStatus]);

  const fetchCustomers = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockCustomers: Customer[] = [
      {
        id: '1',
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@email.com',
        phone: '+49 123 456789',
        address: {
          street: 'Musterstraße 123',
          city: 'Musterstadt',
          zipCode: '12345',
          country: 'Deutschland'
        },
        status: 'active',
        totalOrders: 3,
        totalSpent: 8750.00,
        lastOrderDate: '2024-01-20',
        registrationDate: '2023-12-15',
        notes: 'VIP-Kunde, bevorzugt Saphire',
        preferences: {
          newsletter: true,
          sms: false,
          categories: ['Saphire', 'Rubine']
        }
      },
      {
        id: '2',
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna.schmidt@email.com',
        phone: '+49 987 654321',
        address: {
          street: 'Beispielweg 456',
          city: 'Beispielstadt',
          zipCode: '54321',
          country: 'Deutschland'
        },
        status: 'active',
        totalOrders: 1,
        totalSpent: 3200.00,
        lastOrderDate: '2024-01-18',
        registrationDate: '2024-01-10',
        preferences: {
          newsletter: true,
          sms: true,
          categories: ['Smaragde']
        }
      },
      {
        id: '3',
        firstName: 'Peter',
        lastName: 'Weber',
        email: 'peter.weber@email.com',
        address: {
          street: 'Teststraße 789',
          city: 'Teststadt',
          zipCode: '98765',
          country: 'Deutschland'
        },
        status: 'inactive',
        totalOrders: 1,
        totalSpent: 4500.00,
        lastOrderDate: '2023-11-15',
        registrationDate: '2023-10-01',
        notes: 'Keine Aktivität seit 3 Monaten',
        preferences: {
          newsletter: false,
          sms: false,
          categories: ['Rubine']
        }
      }
    ];

    setCustomers(mockCustomers);
    setLoading(false);
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === filterStatus);
    }

    setFilteredCustomers(filtered);
  };

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    
    // Fetch customer orders
    const mockOrders: CustomerOrder[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-01-20',
        total: 2500.00,
        status: 'processing'
      },
      {
        id: '2',
        orderNumber: 'ORD-2023-045',
        date: '2023-12-15',
        total: 3200.00,
        status: 'delivered'
      },
      {
        id: '3',
        orderNumber: 'ORD-2023-032',
        date: '2023-11-10',
        total: 3050.00,
        status: 'delivered'
      }
    ];
    
    setCustomerOrders(mockOrders);
    setShowCustomerDetails(true);
  };

  const handleStatusUpdate = (customerId: string, newStatus: string) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: newStatus as any }
        : customer
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'inactive': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'blocked': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'inactive': return 'Inaktiv';
      case 'blocked': return 'Gesperrt';
      default: return 'Unbekannt';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="w-4 h-4" />;
      case 'inactive': return <User className="w-4 h-4" />;
      case 'blocked': return <UserX className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Kunden verwalten"
          description="Lade Kundendaten..."
        />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <AdminCard key={i} title="">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Kunden verwalten"
        description="Verwalten Sie Kundenprofile, Bestellhistorie und Kommunikation."
      />

      {/* Filters and Search */}
      <AdminCard title="Filter und Suche">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Suche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Name oder E-Mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
                <SelectItem value="blocked">Gesperrt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter anwenden
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <AdminCard key={customer.id} title="">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(customer.status)}`}>
                    {getStatusIcon(customer.status)}
                    <span className="ml-1">{getStatusText(customer.status)}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{customer.email}</span>
                  </div>
                  
                  {customer.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    <span>{customer.totalOrders} Bestellungen</span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{formatCurrency(customer.totalSpent)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewCustomer(customer)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
                
                <Select 
                  value={customer.status} 
                  onValueChange={(value) => handleStatusUpdate(customer.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                    <SelectItem value="blocked">Gesperrt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Kundenprofil - {selectedCustomer.firstName} {selectedCustomer.lastName}
              </h2>
              <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                Schließen
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <AdminCard title="Kontaktinformationen">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    {selectedCustomer.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                      <div>
                        <p>{selectedCustomer.address.street}</p>
                        <p>{selectedCustomer.address.zipCode} {selectedCustomer.address.city}</p>
                        <p>{selectedCustomer.address.country}</p>
                      </div>
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="Kundenstatistiken">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}>
                        {getStatusText(selectedCustomer.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Registriert:</span>
                      <span>{new Date(selectedCustomer.registrationDate).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bestellungen:</span>
                      <span className="font-semibold">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gesamtausgaben:</span>
                      <span className="font-bold">{formatCurrency(selectedCustomer.totalSpent)}</span>
                    </div>
                    {selectedCustomer.lastOrderDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Letzte Bestellung:</span>
                        <span>{new Date(selectedCustomer.lastOrderDate).toLocaleDateString('de-DE')}</span>
                      </div>
                    )}
                  </div>
                </AdminCard>

                {selectedCustomer.notes && (
                  <AdminCard title="Notizen">
                    <p className="text-gray-700 dark:text-gray-300">{selectedCustomer.notes}</p>
                  </AdminCard>
                )}
              </div>

              {/* Preferences and Orders */}
              <div className="lg:col-span-2 space-y-4">
                <AdminCard title="Präferenzen">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Kommunikation</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedCustomer.preferences.newsletter}
                            readOnly
                            className="mr-2"
                          />
                          <span className="text-sm">Newsletter</span>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedCustomer.preferences.sms}
                            readOnly
                            className="mr-2"
                          />
                          <span className="text-sm">SMS-Benachrichtigungen</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Bevorzugte Kategorien</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.preferences.categories.map((category) => (
                          <span key={category} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="Bestellhistorie">
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.date).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AdminCard>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
