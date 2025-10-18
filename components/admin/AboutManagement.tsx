'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function AboutManagement() {
  const t = useTranslations();
  const [content, setContent] = useState({
    title: 'Über uns',
    description: 'Seit über 20 Jahren sind wir Ihr vertrauensvoller Partner für Edelsteine...',
    mission: 'Unsere Mission ist es, die schönsten Edelsteine der Welt zu finden...',
    vision: 'Wir träumen von einer Welt, in der jeder die Magie der Edelsteine erleben kann...'
  });

  const handleSave = () => {
    // Save content logic here
    console.log('Saving about content:', content);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">{t('admin.about.title')}</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">{t('admin.about.description')}</label>
        <textarea
          value={content.description}
          onChange={(e) => setContent({ ...content, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">{t('admin.about.mission')}</label>
        <textarea
          value={content.mission}
          onChange={(e) => setContent({ ...content, mission: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">{t('admin.about.vision')}</label>
        <textarea
          value={content.vision}
          onChange={(e) => setContent({ ...content, vision: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>
      
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {t('admin.save')}
      </button>
    </div>
  );
}