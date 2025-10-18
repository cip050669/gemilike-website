'use client';

import { useState, useEffect } from 'react';
import { PictogramDescription } from '@/lib/types/pictogram-descriptions';

export function usePictogramDescriptions() {
  const [descriptions, setDescriptions] = useState<PictogramDescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDescriptions = async () => {
      try {
        const response = await fetch('/api/admin/pictogram-descriptions', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.descriptions) {
            // Sort by order and filter active descriptions
            const sortedDescriptions = data.descriptions
              .filter((desc: PictogramDescription) => desc.isActive)
              .sort((a: PictogramDescription, b: PictogramDescription) => a.order - b.order);
            setDescriptions(sortedDescriptions);
          }
        }
      } catch (error) {
        console.error('Error loading pictogram descriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDescriptions();
  }, []);

  const getDescriptionByIcon = (iconName: string): string | null => {
    const description = descriptions.find(desc => desc.icon === iconName);
    return description ? description.description : null;
  };

  const getTitleByIcon = (iconName: string): string | null => {
    const description = descriptions.find(desc => desc.icon === iconName);
    return description ? description.title : null;
  };

  return {
    descriptions,
    loading,
    getDescriptionByIcon,
    getTitleByIcon
  };
}
