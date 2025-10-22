'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: t('admin.dashboard'), icon: '📊' },
    { href: '/admin/gemstones', label: t('admin.gemstones'), icon: '💎' },
    { href: '/admin/about', label: t('admin.about.title'), icon: '📝' },
    { href: '/admin/settings', label: t('admin.settings'), icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-gem-bgDark text-gem-text min-h-screen border-r border-gem-iceDark/20">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gem-iceLight">{t('admin.title')}</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 hover:bg-gem-ice/10 hover:text-gem-iceLight transition-colors ${
              pathname === item.href ? 'bg-gem-ice/15 text-gem-iceLight border-r-2 border-gem-ice' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}