'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';

interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GemstoneImageCropProps {
  imageUrl: string;
  onCrop: (region: CropRegion | null) => void;
  onClose: () => void;
}

export function GemstoneImageCrop({ imageUrl, onCrop, onClose }: GemstoneImageCropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropRegion, setCropRegion] = useState<CropRegion | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const maxWidth = container.clientWidth - 40;
        const maxHeight = window.innerHeight - 200;
        
        let width = img.width;
        let height = img.height;
        
        const scale = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= scale;
        height *= scale;
        
        setImageSize({ width, height });
        
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            drawCropRegion(ctx, cropRegion, width, height);
          }
        }
      }
    };
    img.src = imageUrl;
  }, [imageUrl, cropRegion]);

  const drawCropRegion = (
    ctx: CanvasRenderingContext2D,
    region: CropRegion | null,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (!region) return;

    // Draw overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Clear crop region
    ctx.clearRect(region.x, region.y, region.width, region.height);
    ctx.drawImage(ctx.canvas, 0, 0);

    // Draw border
    ctx.strokeStyle = '#9A1A63';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(region.x, region.y, region.width, region.height);
    ctx.setLineDash([]);

    // Draw corner handles
    const handleSize = 10;
    ctx.fillStyle = '#9A1A63';
    const corners = [
      { x: region.x, y: region.y },
      { x: region.x + region.width, y: region.y },
      { x: region.x, y: region.y + region.height },
      { x: region.x + region.width, y: region.y + region.height },
    ];
    corners.forEach((corner) => {
      ctx.fillRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    if (!pos) return;

    setIsDragging(true);
    setStartPos(pos);
    setCropRegion({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !startPos) return;

    const pos = getMousePos(e);
    if (!pos || !imageSize) return;

    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);
    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);

    setCropRegion({
      x: Math.max(0, Math.min(x, imageSize.width - width)),
      y: Math.max(0, Math.min(y, imageSize.height - height)),
      width: Math.min(width, imageSize.width - x),
      height: Math.min(height, imageSize.height - y),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPos(null);
  };

  const handleApply = () => {
    if (!cropRegion || !imageSize) {
      onCrop(null);
      return;
    }

    // Convert canvas coordinates to image coordinates
    const img = new Image();
    img.onload = () => {
      const scaleX = img.width / imageSize.width;
      const scaleY = img.height / imageSize.height;

      const imageRegion: CropRegion = {
        x: Math.round(cropRegion.x * scaleX),
        y: Math.round(cropRegion.y * scaleY),
        width: Math.round(cropRegion.width * scaleX),
        height: Math.round(cropRegion.height * scaleY),
      };

      onCrop(imageRegion);
      onClose();
    };
    img.src = imageUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            Edelstein-Bereich auswählen (optional)
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 text-sm text-gray-400">
          Ziehen Sie einen Bereich um den Edelstein, um die Analyse zu fokussieren.
          Lassen Sie leer, um automatische Erkennung zu verwenden.
        </div>

        <div ref={containerRef} className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border border-gray-600 cursor-crosshair"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="outline" onClick={() => {
            setCropRegion(null);
            onCrop(null);
            onClose();
          }}>
            Automatisch
          </Button>
          <Button onClick={handleApply} className="bg-[#9A1A63] hover:bg-[#7a1450]">
            <Check className="h-4 w-4 mr-2" />
            Anwenden
          </Button>
        </div>
      </div>
    </div>
  );
}

