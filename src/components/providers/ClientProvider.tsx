'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientProviderProps {
  children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps): JSX.Element {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatches by only rendering on client
  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
