'use client';

import { create } from 'zustand';

interface Gemstone {
  id: string;
  name: string;
  type: string;
  description?: string;
  price?: number;
  image?: string;
}

interface GemstoneStore {
  gemstones: Gemstone[];
  fetchGemstones: () => void;
  addGemstone: (gemstone: Omit<Gemstone, 'id'>) => void;
  updateGemstone: (id: string, gemstone: Partial<Gemstone>) => void;
  deleteGemstone: (id: string) => void;
}

export const useGemstoneStore = create<GemstoneStore>((set, get) => ({
  gemstones: [],
  
  fetchGemstones: () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('gemstones');
    if (saved) {
      set({ gemstones: JSON.parse(saved) });
    }
  },
  
  addGemstone: (gemstone) => {
    const newGemstone = {
      ...gemstone,
      id: Date.now().toString()
    };
    const updated = [...get().gemstones, newGemstone];
    set({ gemstones: updated });
    localStorage.setItem('gemstones', JSON.stringify(updated));
  },
  
  updateGemstone: (id, updates) => {
    const updated = get().gemstones.map(g => 
      g.id === id ? { ...g, ...updates } : g
    );
    set({ gemstones: updated });
    localStorage.setItem('gemstones', JSON.stringify(updated));
  },
  
  deleteGemstone: (id) => {
    const updated = get().gemstones.filter(g => g.id !== id);
    set({ gemstones: updated });
    localStorage.setItem('gemstones', JSON.stringify(updated));
  }
}));
