export interface PictogramDescription {
  id: string;
  icon: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PictogramSettings {
  descriptions: PictogramDescription[];
}
