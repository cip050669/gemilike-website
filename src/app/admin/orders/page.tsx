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
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  User,
  Calendar,
  MapPin
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customerName: 'Max Mustermann',
        customerEmail: 'max.mustermann@email.com',
        status: 'processing',
        total: 2500.00,
        items: [
          {
            id: '1',
            productName: 'Blauer Saphir 2ct',
            quantity: 1,
            price: 2500.00,
            total: 2500.00
          }
        ],
        shippingAddress: {
          street: 'Musterstraße 123',
          city: 'Musterstadt',
          zipCode: '12345',
          country: 'Deutschland'
        },
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        customerName: 'Anna Schmidt',
        customerEmail: 'anna.schmidt@email.com',
        status: 'shipped',
        total: 3200.00,
        items: [
          {
            id: '2',
            productName: 'Grüner Smaragd 1.5ct',
            quantity: 1,
            price: 3200.00,
            total: 3200.00
          }
        ],
        shippingAddress: {
          street: 'Beispielweg 456',
          city: 'Beispielstadt',
          zipCode: '54321',
          country: 'Deutschland'
        },
        createdAt: '2024-01-18',
        updatedAt: '2024-01-19',
        trackingNumber: 'DHL123456789'
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        customerName: 'Peter Weber',
        customerEmail: 'peter.weber@email.com',
        status: 'delivered',
        total: 4500.00,
        items: [
          {
            id: '3',
            productName: 'Roter Rubin 3ct',
            quantity: 1,
            price: 4500.00,
            total: 4500.00
          }
        ],
        shippingAddress: {
          street: 'Teststraße 789',
          city: 'Teststadt',
          zipCode: '98765',
          country: 'Deutschland'
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-01-17'
      }
    ];

    setOrders(mockOrders);
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'shipped': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'delivered': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ausstehend';
      case 'processing': return 'In Bearbeitung';
      case 'shipped': return 'Versandt';
      case 'delivered': return 'Geliefert';
      case 'cancelled': return 'Storniert';
      default: return 'Unbekannt';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Bestellungen verwalten"
          description="Lade Bestelldaten..."
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
        title="Bestellungen verwalten"
        description="Verwalten Sie Kundenbestellungen, Versand und Zahlungsstatus."
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
                placeholder="Bestellnummer, Kunde oder E-Mail..."
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
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="processing">In Bearbeitung</SelectItem>
                <SelectItem value="shipped">Versandt</SelectItem>
                <SelectItem value="delivered">Geliefert</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <AdminCard key={order.id} title="">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{order.customerName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{formatCurrency(order.total)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(order.createdAt).toLocaleDateString('de-DE')}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{order.shippingAddress.city}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewOrder(order)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
                
                <Select 
                  value={order.status} 
                  onValueChange={(value) => handleStatusUpdate(order.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="processing">In Bearbeitung</SelectItem>
                    <SelectItem value="shipped">Versandt</SelectItem>
                    <SelectItem value="delivered">Geliefert</SelectItem>
                    <SelectItem value="cancelled">Storniert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Bestelldetails - {selectedOrder.orderNumber}</h2>
              <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                Schließen
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <AdminCard title="Bestellinformationen">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bestellnummer:</span>
                      <span className="font-medium">{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gesamtbetrag:</span>
                      <span className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Erstellt am:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleDateString('de-DE')}</span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
                        <span className="font-mono">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </AdminCard>

                <AdminCard title="Kundeninformationen">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">E-Mail:</span>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                </AdminCard>
              </div>

              {/* Items and Address */}
              <div className="space-y-4">
                <AdminCard title="Bestellte Artikel">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <span className="font-semibold">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </AdminCard>

                <AdminCard title="Lieferadresse">
                  <div className="space-y-2">
                    <p className="font-medium">{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.zipCode} {selectedOrder.shippingAddress.city}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
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
