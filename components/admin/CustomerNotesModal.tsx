'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  lastOrderAt?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  tags: string[];
  orders: Order[];
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  gemstoneName: string;
  quantity: number;
  price: number;
}

interface CustomerNotesModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerId: string, notes: string) => void;
}

export function CustomerNotesModal({ customer, isOpen, onClose, onSave }: CustomerNotesModalProps) {
  const [notes, setNotes] = useState(customer.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    alert(`💾 NOTIZEN FÜR ${customer.name.toUpperCase()} WERDEN GESPEICHERT!\n\nNeue Notiz: ${notes}`);
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(customer.id, notes);
    setIsSaving(false);
    
    setTimeout(() => {
      alert(`✅ Notizen für ${customer.name} erfolgreich gespeichert!`);
    }, 500);
  };

  const handleCancel = () => {
    setNotes(customer.notes || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Notizen bearbeiten: {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground">{customer.email}</div>
              </div>
            </div>
          </div>

          {/* Notes Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notizen</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notizen über den Kunden hinzufügen..."
              className="min-h-[200px]"
            />
            <div className="text-xs text-muted-foreground">
              {notes.length} Zeichen
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Speichern...
                </>
              ) : (
                'Speichern'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}