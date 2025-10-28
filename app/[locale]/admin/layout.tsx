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
    { href: '/de/admin/audit', label: '🔍 Audit Logs' },
    { href: '/de/admin/about', label: 'ℹ️ Über uns' },
    { href: '/de/admin/blogs', label: '📝 Blog' },
    { href: '/de/admin/customers', label: '👥 Kunden' },
    { href: '/de/admin/dashboard', label: '📈 Statistiken' },
    { href: '/de/admin', label: '🏠 Dashboard' },
    { href: '/de/admin/gemstones', label: '💎 Edelsteine' },
    { href: '/de/admin/header', label: '🔝 Header' },
    { href: '/de/admin/newsletter', label: '📧 Newsletter' },
    { href: '/de/admin/newsticker', label: '📰 Newsticker' },
    { href: '/de/admin/orders', label: '🛒 Bestellungen' },
    { href: '/de/admin/overview', label: '📊 Übersicht' },
    { href: '/de/admin/pictogram-descriptions', label: '🔣 Piktogramme' },
    { href: '/de/admin/reports', label: '📊 Reports' },
    { href: '/de/admin/select-options', label: '📋 Select Options' },
    { href: '/de/admin/settings', label: '⚙️ Einstellungen' },
    { href: '/de/admin/stories', label: '📖 Stories' },
    { href: '/de/admin/wissenswertes', label: '📚 Wissenswertes' },
    { href: '/de/admin/worldmap', label: '🗺️ Weltkarte' },
  ];

  // Sortierung: a..z, dann ä, ö, ü; Emojis werden ignoriert
  const normalizeLabel = (label: string) =>
    label
      .replace(/[^\p{L}\p{N}\s]/gu, '') // Emojis/Symbole entfernen
      .trim()
      .toLowerCase();

  const alphabet = 'abcdefghijklmnopqrstuvwxyzäöü';
  const rank = (ch: string) => {
    const idx = alphabet.indexOf(ch);
    return idx === -1 ? alphabet.length + ch.codePointAt(0)! : idx;
  };

  const germanCustomCompare = (a: string, b: string) => {
    const sa = normalizeLabel(a);
    const sb = normalizeLabel(b);
    const len = Math.min(sa.length, sb.length);
    for (let i = 0; i < len; i++) {
      const ra = rank(sa[i]);
      const rb = rank(sb[i]);
      if (ra !== rb) return ra - rb;
    }
    return sa.length - sb.length;
  };

  const sortedMenuItems = [...menuItems].sort((a, b) =>
    germanCustomCompare(a.label, b.label)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'rgba(31, 41, 55, 0.5)' }}>
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
          <div style={{ marginBottom: '16px' }}>
            <Link href="/de" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '14px', 
              color: '#9ca3af', 
              textDecoration: 'none',
              marginBottom: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: '#374151',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
            }}>
              ← Zur Website
            </Link>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Panel</h2>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>Gemilike</p>
        </div>
        <nav style={{ marginTop: '24px', paddingBottom: '120px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
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
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: '256px', 
        padding: '32px', 
        overflow: 'auto',
        backgroundColor: 'rgba(31, 41, 55, 0.5)'
      }}>
        {children}
      </main>
    </div>
  );
}
