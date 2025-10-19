'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/de/admin', label: '🏠 Dashboard', section: 'main' },
    { href: '/de/admin/overview', label: '📊 Übersicht', section: 'main' },
    { href: '/de/admin/dashboard', label: '📈 Statistiken', section: 'main' },
    
    { href: '/de/admin/header', label: '🔝 Header', section: 'content' },
    { href: '/de/admin/footer', label: '⬇️ Footer', section: 'content' },
    { href: '/de/admin/about', label: 'ℹ️ Über uns', section: 'content' },
    { href: '/de/admin/blogs', label: '📝 Blog', section: 'content' },
    { href: '/de/admin/stories', label: '📖 Stories', section: 'content' },
    { href: '/de/admin/newsticker', label: '📰 Newsticker', section: 'content' },
    { href: '/de/admin/worldmap', label: '🗺️ Weltkarte', section: 'content' },
    { href: '/de/admin/pictogram-descriptions', label: '🔣 Piktogramme', section: 'content' },
    
    { href: '/de/admin/customers', label: '👥 Kunden', section: 'shop' },
    { href: '/de/admin/orders', label: '🛒 Bestellungen', section: 'shop' },
    
    { href: '/de/admin/newsletter', label: '📧 Newsletter', section: 'marketing' },
    { href: '/de/admin/reports', label: '📊 Reports', section: 'marketing' },
    
    { href: '/de/admin/settings', label: '⚙️ Einstellungen', section: 'system' },
    { href: '/de/admin/audit', label: '🔍 Audit Logs', section: 'system' },
    { href: '/de/admin/select-options', label: '📋 Select Options', section: 'system' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400">Gemilike</p>
        </div>
        <nav className="mt-6 space-y-1">
          {menuItems.map((item, index) => {
            const showSectionDivider = 
              index > 0 && 
              item.section !== menuItems[index - 1].section;
            
            return (
              <div key={item.href}>
                {showSectionDivider && (
                  <div className="my-3 border-t border-gray-700"></div>
                )}
                <Link
                  href={item.href}
                  className={`block px-6 py-3 hover:bg-gray-800 transition-colors ${
                    pathname === item.href ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="p-6 mt-auto">
          <Link href="/de" className="text-sm text-gray-400 hover:text-white">
            ← Zur Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
