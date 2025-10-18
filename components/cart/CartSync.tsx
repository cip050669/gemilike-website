'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePersistentCartStore } from '@/lib/store/persistentCart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export function CartSync() {
  const { data: session } = useSession();
  const { 
    isSyncing, 
    lastSynced, 
    autoSave, 
    setAutoSave, 
    saveCartToServer, 
    loadCartFromServer,
    items 
  } = usePersistentCartStore();

  // Auto-save cart when items change
  useEffect(() => {
    if (session?.user?.id && autoSave && items.length > 0) {
      const timeoutId = setTimeout(() => {
        saveCartToServer(session.user.id);
      }, 2000); // Debounce for 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [items, session?.user?.id, autoSave, saveCartToServer]);

  // Load cart from server when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      loadCartFromServer(session.user.id);
    }
  }, [session?.user?.id, loadCartFromServer]);

  const handleManualSync = () => {
    if (session?.user?.id) {
      saveCartToServer(session.user.id);
    }
  };

  const handleToggleAutoSave = () => {
    setAutoSave(!autoSave);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isSyncing ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Synchronisiere...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1">
            {autoSave ? (
              <Cloud className="w-4 h-4 text-green-600" />
            ) : (
              <CloudOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">
              {autoSave ? 'Auto-Sync' : 'Offline'}
            </span>
          </div>
          
          {lastSynced && (
            <Badge variant="outline" className="text-xs">
              {new Date(lastSynced).toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSync}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAutoSave}
            className="h-6 px-2 text-xs"
          >
            {autoSave ? 'Auto aus' : 'Auto an'}
          </Button>
        </>
      )}
    </div>
  );
}
