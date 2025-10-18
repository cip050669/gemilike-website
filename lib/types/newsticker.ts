export interface NewstickerItem {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewstickerSettings {
  isEnabled: boolean;
  autoRotate: boolean;
  rotationInterval: number; // in milliseconds
  showControls: boolean;
  showCloseButton: boolean;
}
