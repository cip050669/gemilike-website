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
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold">{t('admin.title')}</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 hover:bg-gray-800 ${
              pathname === item.href ? 'bg-gray-800' : ''
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