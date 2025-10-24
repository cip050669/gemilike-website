import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { allGemstones } from '@/lib/data/gemstones';
import { Gemstone } from '@/lib/types/gemstone';

export interface DashboardStats {
  // Verkaufsstatistiken
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  
  // Produktstatistiken
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  
  // Kundenstatistiken
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  
  // Beliebte Produkte
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  
  // Kategorien-Statistiken
  categoryStats: Array<{
    category: string;
    count: number;
    totalValue: number;
    averagePrice: number;
  }>;
  
  // Herkunft-Statistiken
  originStats: Array<{
    origin: string;
    count: number;
    totalValue: number;
  }>;
  
  // Behandlungs-Statistiken
  treatmentStats: Array<{
    treatment: string;
    count: number;
    percentage: number;
  }>;
  
  // Zertifizierungs-Statistiken
  certificationStats: {
    certified: number;
    uncertified: number;
    certifiedPercentage: number;
  };
  
  // Preis-Statistiken
  priceStats: {
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    medianPrice: number;
  };
  
  // Gewichts-Statistiken
  weightStats: {
    totalCaratWeight: number;
    totalGramWeight: number;
    averageCaratWeight: number;
    averageGramWeight: number;
  };
  
  // Zeitstempel
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const stats = await generateDashboardStats(allGemstones);

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard stats' },
      { status: 500 }
    );
  }
}

async function generateDashboardStats(gemstones: Gemstone[]): Promise<DashboardStats> {
  const totalProducts = gemstones.length;
  const availableProducts = gemstones.filter(g => g.inStock).length;
  const outOfStockProducts = gemstones.filter(g => !g.inStock).length;
  const lowStockProducts = gemstones.filter(g => g.quantity <= 5).length;
  
  // Mock sales data - in production, this would come from your orders database
  const totalRevenue = gemstones.reduce((sum, g) => sum + (g.price * Math.floor(Math.random() * 10 + 1)), 0);
  const totalOrders = Math.floor(totalRevenue / 1500); // Average order value ~1500€
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const revenueGrowth = Math.random() * 20 - 5; // -5% to +15%
  
  // Mock customer data
  const totalCustomers = Math.floor(totalOrders * 0.8); // 80% of orders are from unique customers
  const newCustomers = Math.floor(totalCustomers * 0.3);
  const returningCustomers = totalCustomers - newCustomers;
  
  // Top selling products (mock)
  const topSellingProducts = gemstones
    .map(g => ({
      id: g.id,
      name: g.name,
      sales: Math.floor(Math.random() * 20 + 1),
      revenue: g.price * Math.floor(Math.random() * 20 + 1)
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  
  // Category statistics
  const categoryMap = new Map<string, { count: number; totalValue: number }>();
  gemstones.forEach(g => {
    const existing = categoryMap.get(g.category) || { count: 0, totalValue: 0 };
    categoryMap.set(g.category, {
      count: existing.count + 1,
      totalValue: existing.totalValue + g.price
    });
  });
  
  const categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    totalValue: data.totalValue,
    averagePrice: data.totalValue / data.count
  })).sort((a, b) => b.totalValue - a.totalValue);
  
  // Origin statistics
  const originMap = new Map<string, { count: number; totalValue: number }>();
  gemstones.forEach(g => {
    const existing = originMap.get(g.origin) || { count: 0, totalValue: 0 };
    originMap.set(g.origin, {
      count: existing.count + 1,
      totalValue: existing.totalValue + g.price
    });
  });
  
  const originStats = Array.from(originMap.entries()).map(([origin, data]) => ({
    origin,
    count: data.count,
    totalValue: data.totalValue
  })).sort((a, b) => b.totalValue - a.totalValue);
  
  // Treatment statistics
  const treatmentMap = new Map<string, number>();
  gemstones.forEach(g => {
    const treatment = g.treatment.treated ? g.treatment.type || 'treated' : 'untreated';
    treatmentMap.set(treatment, (treatmentMap.get(treatment) || 0) + 1);
  });
  
  const treatmentStats = Array.from(treatmentMap.entries()).map(([treatment, count]) => ({
    treatment: treatment === 'untreated' ? 'Unbehandelt' : 
              treatment === 'heated' ? 'Erhitzt' :
              treatment === 'oiled' ? 'Geölt' :
              treatment === 'irradiated' ? 'Bestrahlt' :
              treatment === 'diffused' ? 'Diffundiert' :
              treatment === 'filled' ? 'Gefüllt' :
              treatment === 'coated' ? 'Beschichtet' :
              treatment,
    count,
    percentage: (count / totalProducts) * 100
  })).sort((a, b) => b.count - a.count);
  
  // Certification statistics
  const certified = gemstones.filter(g => g.certification.certified).length;
  const uncertified = totalProducts - certified;
  const certificationStats = {
    certified,
    uncertified,
    certifiedPercentage: (certified / totalProducts) * 100
  };
  
  // Price statistics
  const prices = gemstones.map(g => g.price).sort((a, b) => a - b);
  const priceStats = {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    medianPrice: prices[Math.floor(prices.length / 2)]
  };
  
  // Weight statistics
  const cutGemstones = gemstones.filter(g => g.type === 'cut');
  const roughGemstones = gemstones.filter(g => g.type === 'rough');
  
  const totalCaratWeight = cutGemstones.reduce((sum, g) => sum + (g as any).caratWeight, 0);
  const totalGramWeight = roughGemstones.reduce((sum, g) => sum + (g as any).gramWeight, 0);
  
  const weightStats = {
    totalCaratWeight,
    totalGramWeight,
    averageCaratWeight: cutGemstones.length > 0 ? totalCaratWeight / cutGemstones.length : 0,
    averageGramWeight: roughGemstones.length > 0 ? totalGramWeight / roughGemstones.length : 0
  };
  
  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    revenueGrowth,
    totalProducts,
    availableProducts,
    outOfStockProducts,
    lowStockProducts,
    totalCustomers,
    newCustomers,
    returningCustomers,
    topSellingProducts,
    categoryStats,
    originStats,
    treatmentStats,
    certificationStats,
    priceStats,
    weightStats,
    lastUpdated: new Date().toISOString()
  };
}
