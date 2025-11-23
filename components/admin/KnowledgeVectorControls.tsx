'use client';

import { useState } from 'react';

interface KnowledgeVectorControlsProps {
  locale: string;
}

type ActionType = 'rebuild' | 'invalidate';

export function KnowledgeVectorControls({ locale }: KnowledgeVectorControlsProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(action: ActionType) {
    setStatus('loading');
    setMessage(null);

    try {
      const response = await fetch('/api/admin/knowledge-base/vector-search/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, action }),
      });

      if (!response.ok) {
        throw new Error('Aktion konnte nicht ausgeführt werden.');
      }

      const data = await response.json();
      const timestamp = data.refreshedAt || data.timestamp;
      const formattedTime = timestamp ? new Date(timestamp).toLocaleString('de-DE') : '';

      if (action === 'rebuild') {
        setMessage(
          `Vektor-Cache aktualisiert (${data.count ?? 0} Artikel)${
            formattedTime ? ` – ${formattedTime}` : ''
          }`
        );
      } else {
        setMessage(
          `Cache geleert. Er wird automatisch beim nächsten Suchvorgang neu aufgebaut${
            formattedTime ? ` – ${formattedTime}` : ''
          }.`
        );
      }

      setStatus('success');
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : 'Unbekannter Fehler beim Aktualisieren des Caches.'
      );
      setStatus('error');
    }
  }

  const isLoading = status === 'loading';

  return (
    <div className="rounded-lg border border-white/10 bg-gray-900/40 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Semantische Suche</h3>
          <p className="text-sm text-gray-400">
            Aktualisiere den Vektor-Cache für die Wissenswertes-Ergebnisse dieses Sprachraums.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handleAction('rebuild')}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Aktualisiere …' : 'Vektor-Cache aktualisieren'}
          </button>
          <button
            type="button"
            onClick={() => handleAction('invalidate')}
            disabled={isLoading}
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cache leeren
          </button>
        </div>
      </div>
      {message && (
        <p
          className={`mt-4 text-sm ${
            status === 'error' ? 'text-red-300' : 'text-emerald-300'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

