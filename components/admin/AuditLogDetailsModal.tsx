'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  Activity, 
  Globe, 
  Monitor,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

interface AuditLogDetailsModalProps {
  log: AuditLog;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetailsModal({ log, isOpen, onClose }: AuditLogDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'ADD':
        return '➕';
      case 'UPDATE':
      case 'EDIT':
        return '✏️';
      case 'DELETE':
      case 'REMOVE':
        return '🗑️';
      case 'VIEW':
      case 'READ':
        return '👁️';
      case 'LOGIN':
      case 'LOGOUT':
        return '👤';
      default:
        return '📋';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getActionIcon(log.action)}</span>
            Audit-Log Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Benutzer</div>
                  <div className="text-sm text-muted-foreground">{log.userName}</div>
                </div>
              </div>
              <Badge variant={getActionBadgeVariant(log.action)}>
                {log.action}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Entität</div>
                <div className="text-sm text-muted-foreground">
                  {log.entityType}: {log.entityId}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Zeitstempel</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technische Details</h3>
            
            {log.ipAddress && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">IP-Adresse</div>
                    <div className="text-sm text-muted-foreground font-mono">{log.ipAddress}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(log.ipAddress!)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {log.userAgent && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">User Agent</div>
                    <div className="text-sm text-muted-foreground font-mono max-w-md truncate">
                      {log.userAgent}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(log.userAgent!)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          {/* Action Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aktions-Details</h3>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
            <Button 
              onClick={() => {
                alert(`📋 Audit-Log ${log.id} Details erfolgreich angezeigt!`);
              }}
            >
              Details bestätigen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}