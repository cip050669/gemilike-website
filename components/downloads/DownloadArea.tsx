'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image as ImageIcon, Video, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy Load schwere Komponenten
const ColorChartGrid = dynamic(
  () => import('@/components/color-charts/ColorChartGrid').then((mod) => ({ default: mod.ColorChartGrid })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Lade Farbtafeln...</div>
      </div>
    ),
    ssr: false,
  }
);

const GemstoneColorAnalyzer = dynamic(
  () => import('@/components/color-charts/GemstoneColorAnalyzer').then((mod) => ({ default: mod.GemstoneColorAnalyzer })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Lade Farbanalyse...</div>
      </div>
    ),
    ssr: false, // Client-Side nur
  }
);

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'image' | 'video' | 'other';
  size: string;
  url: string;
}

const downloadItems: DownloadItem[] = [
  {
    id: '1',
    title: 'Edelstein-Katalog 2024',
    description: 'Unser aktueller Katalog mit den schönsten Edelsteinen',
    type: 'pdf',
    size: '2.4 MB',
    url: '/downloads/katalog-2024.pdf'
  },
  {
    id: '2',
    title: 'Zertifikat-Vorlage',
    description: 'Vorlage für Edelstein-Zertifikate',
    type: 'pdf',
    size: '1.2 MB',
    url: '/downloads/zertifikat-vorlage.pdf'
  },
  {
    id: '3',
    title: 'Edelstein-Guide',
    description: 'Umfassender Leitfaden zu Edelsteinen',
    type: 'pdf',
    size: '3.8 MB',
    url: '/downloads/edelstein-guide.pdf'
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5" />;
    case 'image':
      return <ImageIcon className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export function DownloadArea() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders on client to avoid hydration mismatch
  // This prevents Radix UI from generating different IDs on server vs client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async (item: DownloadItem) => {
    setDownloading(item.id);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would trigger the actual download here
      console.log(`Downloading: ${item.title}`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  // Prevent hydration mismatch by not rendering tabs until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Lade...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dokumente
          </TabsTrigger>
          <TabsTrigger value="color-charts" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Farbtafeln
          </TabsTrigger>
          <TabsTrigger value="color-analysis" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Farbanalyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Downloads</h2>
            <p className="text-muted-foreground">
              Hier finden Sie nützliche Dokumente und Kataloge zum Herunterladen.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {downloadItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getIcon(item.type)}
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.size}</span>
                    <Button
                      onClick={() => handleDownload(item)}
                      disabled={downloading === item.id}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {downloading === item.id ? 'Lädt...' : 'Herunterladen'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="color-charts" className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="gradient-text animate-glow">GemILike Farbtafeln</span>
            </h2>
            <p className="text-muted-foreground">
              Interaktive Farbkarten mit GIA-konformer Benennung für Edelsteinhandel
            </p>
          </div>

          <ColorChartGrid locale="de" />
        </TabsContent>

        <TabsContent value="color-analysis" className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="gradient-text animate-glow">Edelstein-Farbanalyse</span>
            </h2>
            <p className="text-muted-foreground">
              Professionelle Farbanalyse von Edelsteinen basierend auf Bildanalyse
            </p>
          </div>

          <GemstoneColorAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
