'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamically import WorldMap to avoid SSR issues
const WorldMap = dynamic(() => import('@/components/map/WorldMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-[70vh] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

export default function WorldMapPage() {
  const t = useTranslations('worldmap');
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Loading state während Hydration
  if (!isClient) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-6xl container-dark">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              <span className="gradient-text animate-glow flex items-center justify-center gap-3">
                <Globe className="h-12 w-12 text-primary" />
                {t('title')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Weltkarte wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl container-dark">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text animate-glow flex items-center justify-center gap-3">
              <Globe className="h-12 w-12 text-primary" />
              {t('title')}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Tabs for different map views */}
        <Tabs defaultValue="interactive" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interactive">Interaktive Karte</TabsTrigger>
            <TabsTrigger value="static">Statische Ansicht</TabsTrigger>
          </TabsList>
          
          <TabsContent value="interactive" className="mt-6">
            <div className="container-dark rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Interaktive Weltkarte</h3>
                <p className="text-sm text-muted-foreground">
                  Erkunden Sie die Edelstein-Fundorte auf der interaktiven Karte. 
                  Klicken Sie auf die Länder-Marker für weitere Informationen.
                </p>
              </div>
              <WorldMap />
            </div>
          </TabsContent>
          
          <TabsContent value="static" className="mt-6">
            <div className="container-dark rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Statische Ansicht</h3>
                <p className="text-sm text-muted-foreground">
                  Übersicht aller kommerziell wichtigen Edelstein-Lagerstätten weltweit.
                </p>
              </div>
              
              {/* Länder-Übersicht */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-foreground">Länder mit Edelstein-Lagerstätten</h4>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { country: "Südafrika", count: 8, gems: ["Diamond", "Emerald", "Garnet", "Tourmaline"] },
                    { country: "Botswana", count: 6, gems: ["Diamond"] },
                    { country: "Namibia", count: 4, gems: ["Diamond", "Tourmaline"] },
                    { country: "Tansania", count: 7, gems: ["Tanzanite", "Ruby", "Sapphire", "Emerald"] },
                    { country: "Kenia", count: 3, gems: ["Ruby", "Sapphire", "Garnet"] },
                    { country: "Uganda", count: 2, gems: ["Emerald", "Garnet"] },
                    { country: "Madagaskar", count: 6, gems: ["Sapphire", "Ruby", "Emerald", "Tourmaline"] },
                    { country: "Mosambik", count: 3, gems: ["Ruby", "Tourmaline"] },
                    { country: "Sambia", count: 2, gems: ["Emerald"] },
                    { country: "Myanmar", count: 8, gems: ["Ruby", "Sapphire", "Spinel", "Jade"] },
                    { country: "Thailand", count: 4, gems: ["Ruby", "Sapphire"] },
                    { country: "Sri Lanka", count: 5, gems: ["Sapphire", "Ruby", "Spinel", "Zircon"] },
                    { country: "Indien", count: 12, gems: ["Diamond", "Emerald", "Garnet", "Sapphire"] },
                    { country: "Vietnam", count: 6, gems: ["Ruby", "Sapphire", "Spinel"] },
                    { country: "Kambodscha", count: 2, gems: ["Ruby", "Zircon"] },
                    { country: "Indonesien", count: 4, gems: ["Diamond", "Ruby", "Sapphire"] },
                    { country: "Philippinen", count: 3, gems: ["Jade", "Ruby", "Pearl"] },
                    { country: "Kolumbien", count: 6, gems: ["Emerald"] },
                    { country: "Brasilien", count: 12, gems: ["Emerald", "Tourmaline", "Aquamarine", "Topaz", "Alexandrite"] },
                    { country: "USA", count: 8, gems: ["Diamond", "Sapphire", "Opal", "Tourmaline", "Topaz"] },
                    { country: "Kanada", count: 3, gems: ["Diamond", "Jade"] },
                    { country: "Australien", count: 8, gems: ["Opal", "Sapphire", "Diamond", "Garnet"] },
                    { country: "Russland", count: 4, gems: ["Diamond", "Alexandrite", "Demantoid", "Uvarovite"] },
                    { country: "Tschechien", count: 2, gems: ["Garnet"] },
                    { country: "Ägypten", count: 2, gems: ["Peridot"] },
                    { country: "Tadschikistan", count: 2, gems: ["Spinel"] }
                  ].map((country, index) => (
                    <Card key={index} className="container-dark border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-foreground">{country.country}</h5>
                          <Badge variant="secondary" className="text-xs">
                            {country.count} Lagerstätten
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {country.gems.map((gem, gemIndex) => (
                            <Badge key={gemIndex} variant="outline" className="text-xs">
                              {gem}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Gesamtstatistiken */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="container-dark border p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">26</div>
                      <div className="text-sm text-muted-foreground">Länder</div>
                    </div>
                  </Card>
                  <Card className="container-dark border p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">150+</div>
                      <div className="text-sm text-muted-foreground">Lagerstätten</div>
                    </div>
                  </Card>
                  <Card className="container-dark border p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">20+</div>
                      <div className="text-sm text-muted-foreground">Edelstein-Typen</div>
                    </div>
                  </Card>
                  <Card className="container-dark border p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">6</div>
                      <div className="text-sm text-muted-foreground">Kontinente</div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal removed - not needed for static view */}
      </div>
    </div>
  );
}
