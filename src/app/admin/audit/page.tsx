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
  Plus
} from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function AuditAdmin() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, filterSeverity, filterUser]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        user: 'admin@gemilike.com',
        action: 'LOGIN',
        resource: 'Admin Panel',
        details: 'Successful login from IP 192.168.1.100',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2024-01-20T10:30:00Z',
        severity: 'low'
      },
      {
        id: '2',
        user: 'admin@gemilike.com',
        action: 'UPDATE',
        resource: 'Product: Blauer Saphir 2ct',
        details: 'Product price updated from €2,500.00 to €2,750.00',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2024-01-20T10:25:00Z',
        severity: 'medium'
      },
      {
        id: '3',
        user: 'admin@gemilike.com',
        action: 'DELETE',
        resource: 'Customer: peter.weber@email.com',
        details: 'Customer account deleted due to GDPR request',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2024-01-20T09:15:00Z',
        severity: 'high'
      },
      {
        id: '4',
        user: 'admin@gemilike.com',
        action: 'CREATE',
        resource: 'New Product: Grüner Smaragd 1.5ct',
        details: 'New product added to catalog with price €3,200.00',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2024-01-20T08:45:00Z',
        severity: 'medium'
      },
      {
        id: '5',
        user: 'admin@gemilike.com',
        action: 'FAILED_LOGIN',
        resource: 'Admin Panel',
        details: 'Failed login attempt with incorrect password',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        timestamp: '2024-01-20T08:30:00Z',
        severity: 'critical'
      }
    ];

    setAuditLogs(mockLogs);
    setLoading(false);
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === filterSeverity);
    }

    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.user === filterUser);
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

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Niedrig';
      case 'medium': return 'Mittel';
      case 'high': return 'Hoch';
      case 'critical': return 'Kritisch';
      default: return 'Unbekannt';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return <Shield className="w-4 h-4 text-green-500" />;
      case 'LOGOUT': return <Shield className="w-4 h-4 text-gray-500" />;
      case 'CREATE': return <Plus className="w-4 h-4 text-blue-500" />;
      case 'UPDATE': return <Edit className="w-4 h-4 text-yellow-500" />;
      case 'DELETE': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'FAILED_LOGIN': return <Shield className="w-4 h-4 text-red-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Audit-Logs"
          description="Lade Audit-Log-Daten..."
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
          <>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Vollständiger Export
            </Button>
          </>
        }
      />

      {/* Filters */}
      <AdminCard title="Filter und Suche">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Suche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Aktion, Ressource oder Details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="severity">Schweregrad</Label>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
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
            <Label htmlFor="user">Benutzer</Label>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger>
                <SelectValue placeholder="Alle Benutzer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Benutzer</SelectItem>
                <SelectItem value="admin@gemilike.com">admin@gemilike.com</SelectItem>
                <SelectItem value="user@gemilike.com">user@gemilike.com</SelectItem>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(log.severity)}`}>
                      {getSeverityText(log.severity)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{log.user}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>{log.resource}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{log.ipAddress}</span>
                  </div>
                </div>
                
                <p className="mt-2 text-gray-700 dark:text-gray-300">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Audit-Log Details</h2>
              <Button variant="outline" onClick={() => setShowLogDetails(false)}>
                Schließen
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Log Info */}
              <div className="space-y-4">
                <AdminCard title="Log-Informationen">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">ID:</span>
                      <span className="font-medium">{selectedLog.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Aktion:</span>
                      <span className="font-medium">{selectedLog.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ressource:</span>
                      <span className="font-medium">{selectedLog.resource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Schweregrad:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedLog.severity)}`}>
                        {getSeverityText(selectedLog.severity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Zeitstempel:</span>
                      <span>{formatTimestamp(selectedLog.timestamp)}</span>
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="Benutzer-Informationen">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Benutzer:</span>
                      <p className="font-medium">{selectedLog.user}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">IP-Adresse:</span>
                      <p className="font-medium">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">User Agent:</span>
                      <p className="font-medium text-sm break-all">{selectedLog.userAgent}</p>
                    </div>
                  </div>
                </AdminCard>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <AdminCard title="Details">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Beschreibung:</span>
                      <p className="font-medium mt-1">{selectedLog.details}</p>
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="Sicherheitsinformationen">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Verdächtige Aktivität:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedLog.severity === 'critical' || selectedLog.severity === 'high'
                          ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                          : 'text-green-600 bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {selectedLog.severity === 'critical' || selectedLog.severity === 'high' ? 'Ja' : 'Nein'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Erfordert Aufmerksamkeit:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedLog.action === 'FAILED_LOGIN' || selectedLog.action === 'DELETE'
                          ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                          : 'text-green-600 bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {selectedLog.action === 'FAILED_LOGIN' || selectedLog.action === 'DELETE' ? 'Ja' : 'Nein'}
                      </span>
                    </div>
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
