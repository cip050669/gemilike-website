'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
}

export function DarkModeToggle({ className }: DarkModeToggleProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'true' || (!saved && prefersDark);
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode, mounted]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode((prev) => !prev)}
      aria-label={
        !mounted
          ? 'Dark Mode umschalten'
          : darkMode
            ? 'Light Mode aktivieren'
            : 'Dark Mode aktivieren'
      }
      title={
        darkMode
          ? 'Hellmodus aktivieren - Wechseln Sie zum hellen Farbschema'
          : 'Dunkelmodus aktivieren - Wechseln Sie zum dunklen Farbschema'
      }
      className={cn(className)}
    >
      {darkMode || !mounted ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </button>
  );
}
