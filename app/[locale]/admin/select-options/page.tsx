import { useTranslations } from 'next-intl';
import { SelectOptionsManager } from '@/components/admin/SelectOptionsManager';

export default function AdminSelectOptionsPage() {
  const t = useTranslations('admin');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Auswahllisten-Verwaltung</h1>
      <p className="text-muted-foreground">
        Verwalten Sie die Auswahloptionen für Schliff, Form, Reinheit und andere Felder in den Edelstein-Details.
      </p>
      <SelectOptionsManager />
    </div>
  );
}
