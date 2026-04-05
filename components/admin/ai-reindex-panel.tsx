'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AiJobSummary {
  id: string;
  type: string;
  status: string;
  locale: string | null;
  createdAt: string;
  completedAt: string | null;
  error: string | null;
}

interface AiReindexPanelProps {
  locale: string;
  staleGemstoneEmbeddings: number;
  staleKnowledgeEmbeddings: number;
  initialRecentJobs?: AiJobSummary[];
}

interface JobSummaryResponse {
  jobs?: AiJobSummary[];
  error?: string;
}

function badgeVariantForStatus(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'accent' as const;
    case 'FAILED':
      return 'destructive' as const;
    case 'RUNNING':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

function labelForType(type: string) {
  switch (type) {
    case 'GEMSTONE_REINDEX':
      return 'Produkt-Reindex';
    case 'KNOWLEDGE_REINDEX':
      return 'Knowledge-Reindex';
    case 'GEMSTONE_SUGGESTION':
      return 'Produkt-Vorschlag';
    case 'IMAGE_ANALYSIS':
      return 'Bildanalyse';
    default:
      return type;
  }
}

export function AiReindexPanel({
  locale,
  staleGemstoneEmbeddings,
  staleKnowledgeEmbeddings,
  initialRecentJobs = [],
}: AiReindexPanelProps) {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'gemstones' | 'knowledge' | null>(null);
  const [recentJobs, setRecentJobs] = useState<AiJobSummary[]>(initialRecentJobs);
  const [loadingJobs, setLoadingJobs] = useState(initialRecentJobs.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const latestGemstoneJob = useMemo(
    () => recentJobs.find((job) => job.type === 'GEMSTONE_REINDEX'),
    [recentJobs]
  );
  const latestKnowledgeJob = useMemo(
    () => recentJobs.find((job) => job.type === 'KNOWLEDGE_REINDEX'),
    [recentJobs]
  );
  const hasRunningJobs = useMemo(
    () => recentJobs.some((job) => job.status === 'RUNNING' || job.status === 'PENDING'),
    [recentJobs]
  );

  async function loadJobs(background = false) {
    try {
      setError(null);
      if (background) {
        setIsRefreshing(true);
      } else {
        setLoadingJobs(true);
      }
      const response = await fetch(`/api/admin/ai/jobs?limit=6&ts=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const payload = (await response.json()) as JobSummaryResponse;

      if (!response.ok) {
        throw new Error(payload.error || 'KI-Jobs konnten nicht geladen werden');
      }

      setRecentJobs(Array.isArray(payload.jobs) ? payload.jobs : []);
      setLastUpdatedAt(new Date().toISOString());
    } catch (jobsError) {
      setError(jobsError instanceof Error ? jobsError.message : 'Unbekannter Fehler');
    } finally {
      setLoadingJobs(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    setRecentJobs(initialRecentJobs);
    setLoadingJobs(false);
    setLastUpdatedAt(new Date().toISOString());
  }, [initialRecentJobs]);

  useEffect(() => {
    if (initialRecentJobs.length > 0) {
      return;
    }
    loadJobs();
  }, [initialRecentJobs.length]);

  useEffect(() => {
    if (!hasRunningJobs && pendingAction === null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      loadJobs(true);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasRunningJobs, pendingAction]);

  async function triggerReindex(target: 'gemstones' | 'knowledge') {
    setMessage(null);
    setError(null);
    setPendingAction(target);

    try {
      const response = await fetch(`/api/admin/ai/reindex/${target}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target === 'knowledge' ? { locale } : {}),
      });

      const payload = (await response.json()) as {
        error?: string;
        processed?: number;
        jobId?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || 'Reindex fehlgeschlagen');
      }

      setMessage(
        `${target === 'gemstones' ? 'Produkt' : 'Knowledge'}-Reindex gestartet/abgeschlossen. ` +
          `Verarbeitet: ${payload.processed ?? 0}, Job: ${payload.jobId ?? 'n/a'}`
      );

      await loadJobs(true);

      startTransition(() => {
        window.location.reload();
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unbekannter Fehler');
    } finally {
      setPendingAction(null);
    }
  }

  async function handleManualRefresh() {
    await loadJobs(true);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
              KI / Embedding-Suche
            </CardTitle>
            <CardDescription>
              Reindexing fuer Hybrid-Suche, Embedding-Status und letzte KI-Jobs
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {(isRefreshing || hasRunningJobs) && (
              <Badge variant="secondary" className="gap-2">
                <Activity className="h-3 w-3" />
                Live
              </Badge>
            )}
            <Badge variant="outline">{locale.toUpperCase()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Produkte ohne aktuelles Embedding</p>
            <p className="mt-2 text-3xl font-bold">{staleGemstoneEmbeddings}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {latestGemstoneJob
                ? `Letzter Lauf: ${new Date(
                    latestGemstoneJob.completedAt ?? latestGemstoneJob.createdAt
                  ).toLocaleString('de-DE')} • ${latestGemstoneJob.status}`
                : 'Noch kein Produkt-Reindex vorhanden'}
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => triggerReindex('gemstones')}
              disabled={hasHydrated ? pendingAction !== null : undefined}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${pendingAction === 'gemstones' ? 'animate-spin' : ''}`} />
              Produkt-Reindex ausfuehren
            </Button>
          </div>

          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Wissensartikel ohne aktuelles Embedding</p>
            <p className="mt-2 text-3xl font-bold">{staleKnowledgeEmbeddings}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {latestKnowledgeJob
                ? `Letzter Lauf: ${new Date(
                    latestKnowledgeJob.completedAt ?? latestKnowledgeJob.createdAt
                  ).toLocaleString('de-DE')} • ${latestKnowledgeJob.status}`
                : 'Noch kein Knowledge-Reindex vorhanden'}
            </p>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => triggerReindex('knowledge')}
              disabled={hasHydrated ? pendingAction !== null : undefined}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${pendingAction === 'knowledge' ? 'animate-spin' : ''}`} />
              Knowledge-Reindex ausfuehren
            </Button>
          </div>
        </div>

        {message ? (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Letzte KI-Jobs
              </h3>
              {lastUpdatedAt ? (
                <p className="text-xs text-muted-foreground">
                  Zuletzt aktualisiert: {new Date(lastUpdatedAt).toLocaleTimeString('de-DE')}
                </p>
              ) : null}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleManualRefresh}
              disabled={hasHydrated ? loadingJobs || isRefreshing : undefined}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${(loadingJobs || isRefreshing) ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>

          {loadingJobs ? (
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
              KI-Jobs werden geladen...
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
              Noch keine KI-Jobs vorhanden.
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{labelForType(job.type)}</span>
                      <Badge variant={badgeVariantForStatus(job.status)}>{job.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Job {job.id} • {job.locale || 'all'} • gestartet{' '}
                      {new Date(job.createdAt).toLocaleString('de-DE')}
                    </p>
                    {job.error ? <p className="text-xs text-red-300">{job.error}</p> : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {job.completedAt
                      ? `abgeschlossen ${new Date(job.completedAt).toLocaleString('de-DE')}`
                      : 'noch nicht abgeschlossen'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
