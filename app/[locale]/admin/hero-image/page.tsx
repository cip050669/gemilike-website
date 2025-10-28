import { HeroImageManager } from '@/components/admin/HeroImageManager';

export default function AdminHeroImagePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hero-Bild Verwaltung</h1>
      <p className="text-muted-foreground">
        Verwalten Sie das Hero-Bild und die zugehörigen Texte auf der Startseite.
      </p>
      <HeroImageManager />
    </div>
  );
}
