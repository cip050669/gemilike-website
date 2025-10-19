'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '256px', 
        backgroundColor: '#1f2937', 
        color: 'white', 
        flexShrink: 0, 
        position: 'fixed', 
        height: '100vh', 
        left: 0, 
        top: 0, 
        zIndex: 10,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Panel</h2>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>Gemilike</p>
        </div>
        <nav style={{ marginTop: '24px', paddingBottom: '120px' }}>
          {menuItems.map((item, index) => {
            const showSectionDivider = 
              index > 0 && 
              item.section !== menuItems[index - 1].section;
            
            return (
              <div key={item.href}>
                {showSectionDivider && (
                  <div style={{ margin: '12px 0', borderTop: '1px solid #374151' }}></div>
                )}
                <Link
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: pathname === item.href ? '#374151' : 'transparent',
                    borderLeft: pathname === item.href ? '4px solid #3b82f6' : '4px solid transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.backgroundColor = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          padding: '24px', 
          backgroundColor: '#1f2937', 
          borderTop: '1px solid #374151' 
        }}>
          <Link href="/de" style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none' }}>
            ← Zur Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: '256px', 
        padding: '32px', 
        overflow: 'auto',
        backgroundColor: '#000000'
      }}>
        {children}
      </main>
    </div>
  );
}
