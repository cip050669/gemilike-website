'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, Video } from 'lucide-react';

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
      return <Image className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export function DownloadArea() {
  const [downloading, setDownloading] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
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
    </div>
  );
}
