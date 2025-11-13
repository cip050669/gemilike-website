'use client';

import Link from 'next/link';

export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="sr-only-focusable skip-link"
      aria-label="Zum Hauptinhalt springen"
    >
      Zum Hauptinhalt springen
    </Link>
  );
}

