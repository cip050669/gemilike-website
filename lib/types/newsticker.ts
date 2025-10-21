export interface NewstickerItem {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: Date;
  updatedAt: Date;
  headingColor?: string;
  subheadingColor?: string;
}

export interface NewstickerSettings {
  isEnabled: boolean;
  autoRotate: boolean;
  rotationInterval: number; // in milliseconds
  showControls: boolean;
  showCloseButton: boolean;
}
