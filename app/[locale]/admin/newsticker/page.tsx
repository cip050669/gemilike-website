'use client';

import { NewstickerManager } from '@/components/admin/NewstickerManager';

export default function NewstickerAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Newsticker Verwaltung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie die Newsticker-Nachrichten, die auf der Homepage angezeigt werden.
        </p>
      </div>
      
      <NewstickerManager />
    </div>
  );
}
