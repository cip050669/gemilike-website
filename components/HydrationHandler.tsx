'use client';

import { useEffect } from 'react';

export function HydrationHandler() {
  useEffect(() => {
    // Intentionally left blank to avoid DOM mutations during hydration
  }, []);

  return null;
}
