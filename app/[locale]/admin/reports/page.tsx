'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, Calendar, BarChart3, PieChart, FileText } from 'lucide-react';

export default function AdminReportsPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [, setGeneratedReports] = useState<string[]>([]);

  // Generate report function
  const generateReport = async (reportId: string, reportTitle: string) => {
    console.log(`🚀 GENERATE REPORT BUTTON CLICKED: ${reportId}`);
    alert(`🚀 ${reportTitle.toUpperCase()} WIRD GENERIERT!`);
    
    setIsGenerating(reportId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to generated reports
    setGeneratedReports(prev => [...prev, reportId]);
    setIsGenerating(null);
    
    alert(`✅ ${reportTitle} ERFOLGREICH GENERIERT!`);
  };

  // Download report function
  const downloadReport = (reportId: string, reportTitle: string) => {
    console.log(`💾 DOWNLOAD REPORT BUTTON CLICKED: ${reportId}`);
    alert(`💾 ${reportTitle.toUpperCase()} DOWNLOAD FUNKTIONIERT!`);
    
    // Create sample data based on report type
    let sampleData;
    
    switch (reportId) {
      case 'orders':
        sampleData = {
          reportId,
          reportTitle,
          generatedAt: new Date().toISOString(),
          data: {
            totalOrders: 156,
            totalRevenue: 45230,
            averageOrderValue: 289,
            orderStatus: {
              completed: 142,
              pending: 8,
              cancelled: 6
            },
            topProducts: [
              { name: 'Kolumbianischer Smaragd 001', orders: 23, revenue: 28750 },
              { name: 'Burma-Rubin Premium', orders: 18, revenue: 18900 },
              { name: 'Kashmir-Saphir Extra', orders: 15, revenue: 22500 }
            ],
            monthlyTrend: [
              { month: 'Januar', orders: 156, revenue: 45230 },
              { month: 'Dezember', orders: 134, revenue: 38920 },
              { month: 'November', orders: 142, revenue: 41180 }
            ],
            customerSegments: {
              newCustomers: 23,
              returningCustomers: 89,
              vipCustomers: 12
            }
          }
        };
        break;
      case 'sales':
        sampleData = {
          reportId,
          reportTitle,
          generatedAt: new Date().toISOString(),
          data: {
            totalRevenue: 45230,
            totalOrders: 156,
            averageOrderValue: 289,
            topCategories: ['Smaragd', 'Rubin', 'Saphir'],
            monthlyGrowth: 12.5
          }
        };
        break;
      case 'inventory':
        sampleData = {
          reportId,
          reportTitle,
          generatedAt: new Date().toISOString(),
          data: {
            totalItems: 89,
            inStock: 67,
            lowStock: 12,
            outOfStock: 10,
            categories: {
              'Smaragd': { total: 23, inStock: 18, lowStock: 3, outOfStock: 2 },
              'Rubin': { total: 19, inStock: 15, lowStock: 2, outOfStock: 2 },
              'Saphir': { total: 21, inStock: 16, lowStock: 3, outOfStock: 2 },
              'Aquamarin': { total: 26, inStock: 18, lowStock: 4, outOfStock: 4 }
            }
          }
        };
        break;
      case 'customers':
        sampleData = {
          reportId,
          reportTitle,
          generatedAt: new Date().toISOString(),
          data: {
            totalCustomers: 234,
            newCustomers: 23,
            returningCustomers: 89,
            customerSegments: {
              'Premium': 12,
              'Standard': 156,
              'Basic': 66
            },
            topCountries: ['Deutschland', 'Österreich', 'Schweiz', 'Niederlande'],
            averageOrderValue: 289,
            customerLifetimeValue: 1250
          }
        };
        break;
      default:
        sampleData = {
          reportId,
          reportTitle,
          generatedAt: new Date().toISOString(),
          data: {
            totalRevenue: 45230,
            totalOrders: 156,
            averageOrderValue: 289,
            topCategories: ['Smaragd', 'Rubin', 'Saphir'],
            monthlyGrowth: 12.5
          }
        };
    }
    
    // Download as JSON
    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${reportId}-bericht-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Schedule report function
  const scheduleReport = (reportId: string, reportTitle: string) => {
    console.log(`📅 SCHEDULE REPORT BUTTON CLICKED: ${reportId}`);
    alert(`📅 ${reportTitle.toUpperCase()} TERMINPLANUNG FUNKTIONIERT!`);
  };

  const reports = [
    {
      id: 'sales',
      title: 'Umsatzbericht',
      description: 'Monatliche und jährliche Umsatzstatistiken',
      icon: TrendingUp,
      lastGenerated: '2025-01-10',
      type: 'monthly'
    },
    {
      id: 'inventory',
      title: 'Lagerbestand',
      description: 'Übersicht über verfügbare Edelsteine',
      icon: BarChart3,
      lastGenerated: '2025-01-11',
      type: 'daily'
    },
    {
      id: 'customers',
      title: 'Kundenanalyse',
      description: 'Kundenverhalten und Präferenzen',
      icon: PieChart,
      lastGenerated: '2025-01-09',
      type: 'weekly'
    },
    {
      id: 'orders',
      title: 'Bestellbericht',
      description: 'Detaillierte Bestellstatistiken',
      icon: FileText,
      lastGenerated: '2025-01-11',
      type: 'daily'
    }
  ];

  const quickStats = [
    { label: 'Umsatz diesen Monat', value: '€45,230', change: '+12.5%', positive: true },
    { label: 'Neue Kunden', value: '23', change: '+8.2%', positive: true },
    { label: 'Bestellungen', value: '156', change: '+15.3%', positive: true },
    { label: 'Durchschnittswert', value: '€289', change: '-2.1%', positive: false }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Berichte</h1>
        <p className="text-muted-foreground">
          Analysen und Statistiken für Ihr Geschäft
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} vs. letzter Monat
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Letzte Generierung:</span>
                    <span>{report.lastGenerated}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Typ:</span>
                    <span className="capitalize">{report.type}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => generateReport(report.id, report.title)}
                      disabled={isGenerating === report.id}
                    >
                      {isGenerating === report.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generiere...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Generieren
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => scheduleReport(report.id, report.title)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Zuletzt generierte Berichte</CardTitle>
          <CardDescription>
            Ihre kürzlich erstellten Berichte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Umsatzbericht Januar 2025</div>
                  <div className="text-sm text-muted-foreground">
                    Generiert am 10.01.2025 um 14:30
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadReport('sales', 'Umsatzbericht Januar 2025')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Lagerbestand Q4 2024</div>
                  <div className="text-sm text-muted-foreground">
                    Generiert am 08.01.2025 um 09:15
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadReport('inventory', 'Lagerbestand Q4 2024')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <PieChart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Kundenanalyse Dezember 2024</div>
                  <div className="text-sm text-muted-foreground">
                    Generiert am 05.01.2025 um 16:45
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadReport('customers', 'Kundenanalyse Dezember 2024')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Bestellbericht Januar 2025</div>
                  <div className="text-sm text-muted-foreground">
                    Generiert am 11.01.2025 um 11:30
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadReport('orders', 'Bestellbericht Januar 2025')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
