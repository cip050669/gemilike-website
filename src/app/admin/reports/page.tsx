'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ReportData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
}

export default function ReportsAdmin() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockData: ReportData = {
      period: selectedPeriod === '30' ? 'Letzte 30 Tage' : selectedPeriod === '90' ? 'Letzte 90 Tage' : 'Letztes Jahr',
      revenue: 125430.50,
      orders: 342,
      customers: 1287,
      growth: {
        revenue: 12.5,
        orders: 8.3,
        customers: 15.2
      },
      topProducts: [
        { name: 'Blauer Saphir 2ct', sales: 45, revenue: 112500.00 },
        { name: 'Grüner Smaragd 1.5ct', sales: 32, revenue: 102400.00 },
        { name: 'Roter Rubin 3ct', sales: 28, revenue: 126000.00 },
        { name: 'Amethyst Ring', sales: 67, revenue: 20100.00 },
        { name: 'Topas Ohrringe', sales: 23, revenue: 13800.00 }
      ],
      salesByCategory: [
        { category: 'Saphire', revenue: 45000, percentage: 35.8 },
        { category: 'Smaragde', revenue: 32000, percentage: 25.5 },
        { category: 'Rubine', revenue: 28000, percentage: 22.3 },
        { category: 'Amethyste', revenue: 15000, percentage: 12.0 },
        { category: 'Topase', revenue: 5430.50, percentage: 4.4 }
      ]
    };

    setReportData(mockData);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Berichte und Analytics"
          description="Lade Berichtsdaten..."
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
        title="Berichte und Analytics"
        description="Detaillierte Einblicke in Umsatz, Bestellungen und Kundenverhalten."
        actions={
          <>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Letzte 30 Tage</SelectItem>
                <SelectItem value="90">Letzte 90 Tage</SelectItem>
                <SelectItem value="365">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard title="Gesamtumsatz">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(reportData!.revenue)}
              </p>
              <p className={`text-sm flex items-center ${getGrowthColor(reportData!.growth.revenue)}`}>
                {getGrowthIcon(reportData!.growth.revenue)}
                <span className="ml-1">+{reportData!.growth.revenue}%</span>
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </AdminCard>

        <AdminCard title="Bestellungen">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {reportData!.orders}
              </p>
              <p className={`text-sm flex items-center ${getGrowthColor(reportData!.growth.orders)}`}>
                {getGrowthIcon(reportData!.growth.orders)}
                <span className="ml-1">+{reportData!.growth.orders}%</span>
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </AdminCard>

        <AdminCard title="Neue Kunden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {reportData!.customers}
              </p>
              <p className={`text-sm flex items-center ${getGrowthColor(reportData!.growth.customers)}`}>
                {getGrowthIcon(reportData!.growth.customers)}
                <span className="ml-1">+{reportData!.growth.customers}%</span>
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </AdminCard>

        <AdminCard title="Durchschnittswert">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(reportData!.revenue / reportData!.orders)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pro Bestellung
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </AdminCard>
      </div>

      {/* Top Products */}
      <AdminCard title="Bestseller Produkte">
        <div className="space-y-4">
          {reportData!.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} Verkäufe</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(product.revenue)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.sales} Stück
                </p>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Sales by Category */}
      <AdminCard title="Umsatz nach Kategorien">
        <div className="space-y-4">
          {reportData!.salesByCategory.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{category.category}</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(category.revenue)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({category.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Quick Actions */}
      <AdminCard title="Schnellaktionen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Download className="w-6 h-6 mb-2" />
            <span>Umsatzbericht</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <BarChart3 className="w-6 h-6 mb-2" />
            <span>Produktanalyse</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Users className="w-6 h-6 mb-2" />
            <span>Kundenbericht</span>
          </Button>
        </div>
      </AdminCard>
    </div>
  );
}
