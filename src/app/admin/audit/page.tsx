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
  Download, 
  Eye, 
  User, 
  Calendar,
  Clock,
  Shield,
  Edit,
  Trash2,
  Plus,
  Settings,
  Mail,
  ShoppingCart,
  Package
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'warning';
}

interface AuditFilter {
  user: string;
  action: string;
  severity: string;
  dateFrom: string;
  dateTo: string;
}

export default function AuditAdmin() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AuditFilter>({
    user: 'all',
    action: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, filters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock audit logs
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: '2024-01-20T10:30:00Z',
        user: 'admin@gemilike.de',
        action: 'LOGIN',
        resource: 'Authentication',
        details: 'Successful login from IP 192.168.1.100',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        status: 'success'
      },
      {
        id: '2',
        timestamp: '2024-01-20T10:25:00Z',
        user: 'admin@gemilike.de',
        action: 'UPDATE',
        resource: 'Product',
        details: 'Updated product "Blauer Saphir 2ct" - changed price from €2,400 to €2,500',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        status: 'success'
      },
      {
        id: '3',
        timestamp: '2024-01-20T09:15:00Z',
        user: 'admin@gemilike.de',
        action: 'CREATE',
        resource: 'Order',
        details: 'Created new order #1001 for customer Max Mustermann',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        status: 'success'
      },
      {
        id: '4',
        timestamp: '2024-01-20T08:45:00Z',
        user: 'admin@gemilike.de',
        action: 'DELETE',
        resource: 'Customer',
        details: 'Deleted customer account for peter.weber@email.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'high',
        status: 'success'
      },
      {
        id: '5',
        timestamp: '2024-01-20T08:30:00Z',
        user: 'admin@gemilike.de',
        action: 'SEND_EMAIL',
        resource: 'Newsletter',
        details: 'Sent newsletter campaign "Neue Saphire Kollektion" to 1,247 subscribers',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        status: 'success'
      },
      {
        id: '6',
        timestamp: '2024-01-20T08:00:00Z',
        user: 'admin@gemilike.de',
        action: 'UPLOAD',
        resource: 'Media',
        details: 'Uploaded 5 new product images to /products/ folder',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        status: 'success'
      },
      {
        id: '7',
        timestamp: '2024-01-19T16:20:00Z',
        user: 'admin@gemilike.de',
        action: 'FAILED_LOGIN',
        resource: 'Authentication',
        details: 'Failed login attempt with incorrect password',
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'medium',
        status: 'failed'
      },
      {
        id: '8',
        timestamp: '2024-01-19T15:45:00Z',
        user: 'admin@gemilike.de',
        action: 'CONFIG_CHANGE',
        resource: 'System',
        details: 'Changed SMTP configuration settings',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'high',
        status: 'success'
      }
    ];

    setAuditLogs(mockLogs);
    setLoading(false);
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.user !== 'all') {
      filtered = filtered.filter(log => log.user === filters.user);
    }

    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => log.timestamp >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => log.timestamp <= filters.dateTo);
    }

    setFilteredLogs(filtered);
  };

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowLogDetails(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return <Shield className="w-4 h-4" />;
      case 'UPDATE': return <Edit className="w-4 h-4" />;
      case 'CREATE': return <Plus className="w-4 h-4" />;
      case 'DELETE': return <Trash2 className="w-4 h-4" />;
      case 'SEND_EMAIL': return <Mail className="w-4 h-4" />;
      case 'UPLOAD': return <Package className="w-4 h-4" />;
      case 'CONFIG_CHANGE': return <Settings className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('de-DE');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Audit-Logs"
          description="Lade Audit-Logs..."
        />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
        title="Audit-Logs"
        description="Überwachen Sie alle Benutzeraktivitäten und Systemereignisse."
        actions={
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <AdminCard title="Filter und Suche">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="search">Suche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Benutzer, Aktion oder Details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="user">Benutzer</Label>
            <Select value={filters.user} onValueChange={(value) => setFilters({...filters, user: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Alle Benutzer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Benutzer</SelectItem>
                <SelectItem value="admin@gemilike.de">admin@gemilike.de</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="action">Aktion</Label>
            <Select value={filters.action} onValueChange={(value) => setFilters({...filters, action: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Alle Aktionen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Aktionen</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="SEND_EMAIL">Send Email</SelectItem>
                <SelectItem value="UPLOAD">Upload</SelectItem>
                <SelectItem value="CONFIG_CHANGE">Config Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="severity">Schweregrad</Label>
            <Select value={filters.severity} onValueChange={(value) => setFilters({...filters, severity: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Alle Schweregrade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Schweregrade</SelectItem>
                <SelectItem value="low">Niedrig</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
                <SelectItem value="critical">Kritisch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateFrom">Von</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="dateTo">Bis</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>
        </div>
      </AdminCard>

      {/* Audit Logs */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <AdminCard key={log.id} title="">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getActionIcon(log.action)}
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {log.action}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{log.user}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{log.resource}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{log.ipAddress}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(log.timestamp).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                  {log.details}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewLog(log)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Log Details Modal */}
      {showLogDetails && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Audit-Log Details</h2>
              <Button variant="outline" onClick={() => setShowLogDetails(false)}>
                Schließen
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Aktion</Label>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ressource</Label>
                  <p className="font-medium">{selectedLog.resource}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Benutzer</Label>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Zeitstempel</Label>
                  <p className="font-medium">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">IP-Adresse</Label>
                  <p className="font-medium">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Details</Label>
                <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                  {selectedLog.details}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">User Agent</Label>
                <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-mono">
                  {selectedLog.userAgent}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}