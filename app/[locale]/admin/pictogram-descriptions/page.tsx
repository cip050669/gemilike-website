'use client';

import { PictogramDescriptionManager } from '@/components/admin/PictogramDescriptionManager';

export default function AdminPictogramDescriptionsPage() {

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Piktogramm-Beschreibungen</h1>
      <p className="text-muted-foreground">
        Verwalten Sie die Erklärungen für die Piktogramme in den Edelstein-Karten.
      </p>
      <PictogramDescriptionManager />
    </div>
  );
}
