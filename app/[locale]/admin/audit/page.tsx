'use client';

import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, User, Calendar, Activity, Eye, Trash2, Edit, Plus } from 'lucide-react';
import { AuditLogDetailsModal } from '@/components/admin/AuditLogDetailsModal';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockAuditLogs: AuditLog[] = [
      {
        id: 'AUDIT-001',
        userId: 'admin-001',
        userName: 'Admin User',
        action: 'LOGIN',
        entityType: 'User',
        entityId: 'admin-001',
        details: { loginTime: new Date().toISOString() },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'AUDIT-002',
        userId: 'admin-001',
        userName: 'Admin User',
        action: 'CREATE',
        entityType: 'Gemstone',
        entityId: 'EMERALD-001',
        details: { name: 'Smaragd 001', price: 1250, category: 'Emerald' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'AUDIT-003',
        userId: 'admin-002',
        userName: 'Manager User',
        action: 'UPDATE',
        entityType: 'Gemstone',
        entityId: 'RUBY-002',
        details: { price: 890, previousPrice: 750 },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: 'AUDIT-004',
        userId: 'admin-002',
        userName: 'Manager User',
        action: 'DELETE',
        entityType: 'Gemstone',
        entityId: 'SAPPHIRE-003',
        details: { name: 'Saphir 003', reason: 'Defekt' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
      {
        id: 'AUDIT-005',
        userId: 'admin-001',
        userName: 'Admin User',
        action: 'VIEW',
        entityType: 'Order',
        entityId: 'ORD-001',
        details: { customer: 'Max Mustermann', total: 1250 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
    ];

    setAuditLogs(mockAuditLogs);
    setLoading(false);
  }, []);

  const filteredLogs = useMemo(() => {
    let result = auditLogs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((log) =>
        log.userName.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.entityType.toLowerCase().includes(term) ||
        log.entityId.toLowerCase().includes(term)
      );
    }

    if (actionFilter !== 'all') {
      result = result.filter((log) => log.action === actionFilter);
    }

    if (userFilter !== 'all') {
      result = result.filter((log) => log.userId === userFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      result = result.filter((log) => new Date(log.createdAt) >= filterDate);
    }

    return result;
  }, [auditLogs, searchTerm, actionFilter, userFilter, dateFilter]);

  const handleLogClick = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Datum', 'Benutzer', 'Aktion', 'Entität', 'ID', 'Details', 'IP-Adresse'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.createdAt).toLocaleString('de-DE'),
        log.userName,
        log.action,
        log.entityType,
        log.entityId,
        JSON.stringify(log.details).replace(/,/g, ';'),
        log.ipAddress || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      alert(`✅ Audit-Logs erfolgreich exportiert!\n\nDatei: audit-logs-${new Date().toISOString().split('T')[0]}.csv\nEinträge: ${filteredLogs.length}`);
    }, 500);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'ADD':
        return <Plus className="w-4 h-4" />;
      case 'UPDATE':
      case 'EDIT':
        return <Edit className="w-4 h-4" />;
      case 'DELETE':
      case 'REMOVE':
        return <Trash2 className="w-4 h-4" />;
      case 'VIEW':
      case 'READ':
        return <Eye className="w-4 h-4" />;
      case 'LOGIN':
      case 'LOGOUT':
        return <User className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'ADD':
        return 'default';
      case 'UPDATE':
      case 'EDIT':
        return 'secondary';
      case 'DELETE':
      case 'REMOVE':
        return 'destructive';
      case 'LOGIN':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getUniqueActions = () => {
    return [...new Set(auditLogs.map(log => log.action))];
  };

  const getUniqueUsers = () => {
    const users = auditLogs.reduce((acc, log) => {
      if (!acc.find(u => u.id === log.userId)) {
        acc.push({ id: log.userId, name: log.userName });
      }
      return acc;
    }, [] as { id: string; name: string }[]);
    return users;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Lade Audit-Logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Audit-Log</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportLogs} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Vollständige Nachverfolgung aller Admin-Aktionen
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Audit-Logs suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Alle Aktionen</option>
            {getUniqueActions().map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Alle Benutzer</option>
            {getUniqueUsers().map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Alle Zeiten</option>
            <option value="today">Heute</option>
            <option value="week">Letzte 7 Tage</option>
            <option value="month">Letzter Monat</option>
            <option value="year">Letztes Jahr</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Einträge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs.filter(log => {
                const today = new Date();
                const logDate = new Date(log.createdAt);
                return logDate.toDateString() === today.toDateString();
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktive Benutzer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueUsers().length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueActions().length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getActionIcon(log.action)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{log.userName}</h3>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{log.entityType}: {log.entityId}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(log.createdAt).toLocaleString('de-DE')}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogClick(log)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Keine Audit-Logs gefunden</p>
        </div>
      )}

      {/* Modal */}
      {selectedLog && (
        <AuditLogDetailsModal
          log={selectedLog}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
