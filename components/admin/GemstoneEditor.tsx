'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGemstoneStore } from '@/lib/store/gemstoneStore';

interface GemstoneEditorProps {
  gemstone: any;
  onClose: () => void;
}

export function GemstoneEditor({ gemstone, onClose }: GemstoneEditorProps) {
  const t = useTranslations();
  const { addGemstone, updateGemstone } = useGemstoneStore();
  const [formData, setFormData] = useState({
    name: gemstone?.name || '',
    type: gemstone?.type || '',
    description: gemstone?.description || '',
    price: gemstone?.price || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gemstone?.id) {
      updateGemstone(gemstone.id, formData);
    } else {
      addGemstone(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {gemstone?.id ? t('admin.editGemstone') : t('admin.newGemstone')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.type')}</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.price')}</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {gemstone?.id ? t('admin.update') : t('admin.create')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {t('admin.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}