'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ImportDialogProps {
  onClose: () => void;
}

export function ImportDialog({ onClose }: ImportDialogProps) {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      // Handle file import logic here
      console.log('Importing file:', file.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800/30 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{t('admin.import')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('admin.selectFile')}</label>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={!file}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {t('admin.import')}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {t('admin.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}