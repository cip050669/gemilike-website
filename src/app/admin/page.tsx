'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { LayoutDashboard, TrendingUp, Users, ShoppingCart, Eye, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'customer' | 'product' | 'email';
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalRevenue: 125430.50,
        totalOrders: 342,
        totalCustomers: 1287,
        totalProducts: 156,
        monthlyGrowth: 12.5,
        orderGrowth: 8.3,
        customerGrowth: 15.2,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'order',
          message: 'Neue Bestellung #1001 von Max Mustermann',
          timestamp: 'vor 5 Minuten'
        },
        {
          id: '2',
          type: 'product',
          message: 'Produkt "Blauer Saphir 2ct" wurde aktualisiert',
          timestamp: 'vor 1 Stunde'
        },
        {
          id: '3',
          type: 'customer',
          message: 'Neuer Kunde Anna Schmidt registriert',
          timestamp: 'vor 3 Stunden'
        },
        {
          id: '4',
          type: 'email',
          message: 'Newsletter an 1,247 Abonnenten versendet',
          timestamp: 'vor 6 Stunden'
        },
        {
          id: '5',
          type: 'order',
          message: 'Bestellung #1000 wurde versandt',
          timestamp: 'vor 1 Tag'
        }
      ]);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'customer': return <Users className="w-4 h-4 text-green-500" />;
      case 'product': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'email': return <DollarSign className="w-4 h-4 text-orange-500" />;
      default: return <LayoutDashboard className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Dashboard"
          description="Lade Dashboard-Daten..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <AdminCard key={i} title="">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
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
        title="Dashboard"
        description="Willkommen im Gemilike Admin Panel. Hier finden Sie eine Übersicht über Ihre wichtigsten Daten."
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard title="Gesamtumsatz">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.monthlyGrowth}% diesen Monat
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </AdminCard>

        <AdminCard title="Bestellungen">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.orderGrowth}% diese Woche
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </AdminCard>

        <AdminCard title="Kunden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalCustomers}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.customerGrowth}% heute
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </AdminCard>

        <AdminCard title="Produkte">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Im Katalog
              </p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
        </AdminCard>
      </div>

      {/* Recent Activities */}
      <AdminCard title="Letzte Aktivitäten">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                {getActivityIcon(activity.type)}
                <span className="text-gray-700 dark:text-gray-300">{activity.message}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Quick Actions */}
      <AdminCard title="Schnellaktionen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="text-center">
              <ShoppingCart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Neue Bestellung</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manuell erstellen</p>
            </div>
          </button>
          
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <div className="text-center">
              <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Produkt hinzufügen</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Neues Produkt</p>
            </div>
          </button>
          
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <div className="text-center">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Kunde verwalten</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kundenübersicht</p>
            </div>
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
