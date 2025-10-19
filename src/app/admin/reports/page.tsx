'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface ReportData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function ReportsAdmin() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data based on period
    const mockData: ReportData = {
      period: selectedPeriod,
      revenue: selectedPeriod === 'week' ? 12500 : selectedPeriod === 'month' ? 125430 : 1254300,
      orders: selectedPeriod === 'week' ? 15 : selectedPeriod === 'month' ? 342 : 3420,
      customers: selectedPeriod === 'week' ? 8 : selectedPeriod === 'month' ? 1287 : 12870,
      products: 156,
      growth: {
        revenue: selectedPeriod === 'week' ? 5.2 : selectedPeriod === 'month' ? 12.5 : 25.3,
        orders: selectedPeriod === 'week' ? 3.1 : selectedPeriod === 'month' ? 8.3 : 18.7,
        customers: selectedPeriod === 'week' ? 2.5 : selectedPeriod === 'month' ? 15.2 : 35.8
      }
    };

    setReportData(mockData);

    // Mock chart data
    setChartData([
      { name: 'Smaragde', value: 35, color: '#10B981' },
      { name: 'Rubine', value: 25, color: '#EF4444' },
      { name: 'Saphire', value: 20, color: '#3B82F6' },
      { name: 'Diamanten', value: 15, color: '#8B5CF6' },
      { name: 'Sonstige', value: 5, color: '#F59E0B' }
    ]);

    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'week': return 'Diese Woche';
      case 'month': return 'Diesen Monat';
      case 'year': return 'Dieses Jahr';
      default: return 'Diesen Monat';
    }
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
        description="Analysieren Sie Umsätze, Bestellungen und Kundenverhalten."
        actions={
          <div className="flex space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Diesen Monat</SelectItem>
                <SelectItem value="year">Dieses Jahr</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard title="Umsatz">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(reportData?.revenue || 0)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{reportData?.growth.revenue}% {getPeriodText(selectedPeriod)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </AdminCard>

        <AdminCard title="Bestellungen">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(reportData?.orders || 0)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{reportData?.growth.orders}% {getPeriodText(selectedPeriod)}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </AdminCard>

        <AdminCard title="Neue Kunden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(reportData?.customers || 0)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{reportData?.growth.customers}% {getPeriodText(selectedPeriod)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </AdminCard>

        <AdminCard title="Produkte">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(reportData?.products || 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Im Katalog
              </p>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </AdminCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Umsatz nach Kategorien">
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: item.color, 
                        width: `${item.value}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Umsatzentwicklung">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Durchschnittlicher Bestellwert</span>
              <span className="font-semibold">{formatCurrency(reportData?.revenue! / reportData?.orders! || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Konversionsrate</span>
              <span className="font-semibold">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Wiederholungskäufe</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Kundenzufriedenheit</span>
              <span className="font-semibold text-green-600">4.8/5</span>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Top Products */}
      <AdminCard title="Top-Produkte">
        <div className="space-y-4">
          {[
            { name: 'Blauer Saphir 2ct', sales: 15, revenue: 37500 },
            { name: 'Grüner Smaragd 1.5ct', sales: 12, revenue: 38400 },
            { name: 'Roter Rubin 3ct', sales: 8, revenue: 36000 },
            { name: 'Diamantring 1ct', sales: 6, revenue: 18000 },
            { name: 'Amethyst Halskette', sales: 20, revenue: 8000 }
          ].map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} Verkäufe</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(product.revenue)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Umsatz</p>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Recent Activity */}
      <AdminCard title="Aktuelle Trends">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 dark:text-green-200">Wachsender Umsatz</h3>
            <p className="text-sm text-green-600 dark:text-green-400">+12.5% diesen Monat</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Neue Kunden</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">+15.2% diesen Monat</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ShoppingCart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">Mehr Bestellungen</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">+8.3% diese Woche</p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}