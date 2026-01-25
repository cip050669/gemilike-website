'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Warehouse as WarehouseIcon, MapPin } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country: string;
  isActive: boolean;
  isDefault: boolean;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/admin/warehouses');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lagerverwaltung</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Ihre Lagerorte
          </p>
        </div>
        <Link href="/de/admin/warehouse/warehouses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Lagerort
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <WarehouseIcon className="h-5 w-5" />
                    {warehouse.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Code: {warehouse.code}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  {warehouse.isDefault && (
                    <Badge variant="default" className="bg-blue-500">
                      Standard
                    </Badge>
                  )}
                  {warehouse.isActive ? (
                    <Badge variant="default" className="bg-green-500">
                      Aktiv
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inaktiv</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {warehouse.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{warehouse.address}</div>
                    {warehouse.city && (
                      <div className="text-muted-foreground">
                        {warehouse.postalCode} {warehouse.city}
                      </div>
                    )}
                    {warehouse.country && (
                      <div className="text-muted-foreground">{warehouse.country}</div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Link href={`/de/admin/warehouse/warehouses/${warehouse.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {warehouses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <WarehouseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Noch keine Lagerorte vorhanden
            </p>
            <Link href="/de/admin/warehouse/warehouses/new" className="mt-4 inline-block">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ersten Lagerort anlegen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

