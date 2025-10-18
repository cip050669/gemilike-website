'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Euro,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    company?: string;
    firstName: string;
    lastName: string;
  };
  invoiceDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'OVERDUE' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  total: number;
  currency: string;
}

interface InvoiceStats {
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  overdueInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  unpaidAmount: number;
  overdueAmount: number;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  useEffect(() => {
    fetchInvoices();
    fetchStats();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices');
      const data = await response.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Rechnungen:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/invoices/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: 'Entwurf', variant: 'secondary' as const },
      SENT: { label: 'Versendet', variant: 'default' as const },
      OVERDUE: { label: 'Überfällig', variant: 'destructive' as const },
      CANCELLED: { label: 'Storniert', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const paymentConfig = {
      UNPAID: { label: 'Unbezahlt', variant: 'destructive' as const },
      PARTIALLY_PAID: { label: 'Teilweise bezahlt', variant: 'secondary' as const },
      PAID: { label: 'Bezahlt', variant: 'default' as const }
    };
    
    const config = paymentConfig[paymentStatus as keyof typeof paymentConfig] || paymentConfig.UNPAID;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${invoice.customer.firstName} ${invoice.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || invoice.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Lade Rechnungen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rechnungen</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihre Rechnungen und Zahlungen</p>
        </div>
        <Link href="/de/admin/rechnungen/neu">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Neue Rechnung
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt Rechnungen</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Überfällige Rechnungen</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.overdueAmount)} offen
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bezahlte Rechnungen</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.paidInvoices}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Suche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechnungsnummer, Kunde suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Status</SelectItem>
                <SelectItem value="DRAFT">Entwurf</SelectItem>
                <SelectItem value="SENT">Versendet</SelectItem>
                <SelectItem value="OVERDUE">Überfällig</SelectItem>
                <SelectItem value="CANCELLED">Storniert</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Zahlungsstatus filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Zahlungsstatus</SelectItem>
                <SelectItem value="UNPAID">Unbezahlt</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Teilweise bezahlt</SelectItem>
                <SelectItem value="PAID">Bezahlt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rechnungen ({filteredInvoices.length})</CardTitle>
          <CardDescription>
            Übersicht aller Rechnungen mit Status und Zahlungsinformationen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Rechnungen gefunden</h3>
              <p className="mt-1 text-sm text-gray-500">
                {invoices.length === 0 
                  ? 'Erstellen Sie Ihre erste Rechnung.' 
                  : 'Versuchen Sie andere Suchkriterien.'}
              </p>
              {invoices.length === 0 && (
                <div className="mt-6">
                  <Link href="/de/admin/rechnungen/neu">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Erste Rechnung erstellen
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rechnungsnummer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Kunde</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Datum</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fällig</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Betrag</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Zahlung</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {invoice.customer.company || `${invoice.customer.firstName} ${invoice.customer.lastName}`}
                        </div>
                        {invoice.customer.company && (
                          <div className="text-sm text-gray-500">
                            {invoice.customer.firstName} {invoice.customer.lastName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(invoice.invoiceDate)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-4">
                        {getPaymentBadge(invoice.paymentStatus)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

