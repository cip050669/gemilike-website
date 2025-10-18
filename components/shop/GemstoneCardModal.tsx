import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GemstoneCard } from './GemstoneCard';
import { Gemstone } from '@/lib/types/gemstone';

interface GemstoneCardModalProps {
  gemstone: Gemstone | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (gemstone: Gemstone) => void;
  isAdded: boolean;
}

export function GemstoneCardModal({ 
  gemstone, 
  isOpen, 
  onClose, 
  onAddToCart, 
  isAdded 
}: GemstoneCardModalProps) {
  if (!gemstone) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-y-auto p-2">
        <DialogHeader>
          <DialogTitle>Edelstein Details: {gemstone.name}</DialogTitle>
        </DialogHeader>
        
        <div className="w-full flex items-center justify-center min-h-full">
          <div className="w-full max-w-5xl">
            <GemstoneCard
              gemstone={gemstone}
              onAddToCart={onAddToCart}
              isAdded={isAdded}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
