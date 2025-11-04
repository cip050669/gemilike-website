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
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-y-auto p-2 bg-[#111111] text-white z-[10001]">
        <DialogHeader>
          <DialogTitle className="text-white">Edelstein Details: {gemstone.name}</DialogTitle>
        </DialogHeader>
        
        <div className="w-full flex items-center justify-center min-h-full">
          <div className="w-full max-w-5xl [&_.text-gem-text]:text-white [&_.text-gem-text2]:text-white/80 [&_h3]:text-white [&_p]:text-white/90 [&_span]:text-white/90">
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
