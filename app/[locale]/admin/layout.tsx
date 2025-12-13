'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Mail, LogOut, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    { href: '/de/admin/audit', label: '🔍 Audit Logs' },
    { href: '/de/admin/about', label: 'ℹ️ Wer sind wir?' },
    { href: '/de/admin/blogs', label: '📝 Blog' },
    { href: '/de/admin/carts', label: '🛒 Warenkörbe' },
    { href: '/de/admin/checkout-analytics', label: '📊 Checkout-Analytics' },
    { href: '/de/admin/color-charts', label: '🎨 Farbtafeln' },
    { href: '/de/admin/customers', label: '👥 Kunden' },
    { href: '/de/admin/dashboard', label: '📈 Statistiken' },
    { href: '/de/admin', label: '🏠 Dashboard' },
    { href: '/de/admin/gemstones', label: '💎 Edelsteine' },
    { href: '/de/admin/gemstone-analyses', label: '🔬 Farbanalysen' },
    { href: '/de/admin/header', label: '🔝 Header' },
    { href: '/de/admin/hero-image', label: '🖼️ Hero-Bild' },
    { href: '/de/admin/container-content', label: '🧾 Container-Texte' },
    { href: '/de/admin/legal-pages', label: '⚖️ Rechtliches' },
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError('Ungültige Anmeldedaten');
        setIsLoading(false);
      } else if (result?.ok) {
        setShowLogin(false);
        setEmail('');
        setPassword('');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Ein Fehler ist aufgetreten');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/de/admin/login');
    router.refresh();
  };

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

        {/* Login/User Section */}
        <div style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #374151',
          borderBottom: '1px solid #374151',
          marginTop: '16px'
        }}>
          {status === 'loading' ? (
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Lädt...</div>
          ) : session ? (
            <div style={{ color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <User style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.user?.email || 'Admin'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {(session.user as { role?: string })?.role || 'User'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
              >
                <LogOut style={{ width: '14px', height: '14px' }} />
                Abmelden
              </button>
            </div>
          ) : (
            <div>
              {showLogin ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {loginError && (
                    <div style={{ 
                      padding: '8px', 
                      backgroundColor: '#7f1d1d', 
                      color: '#fca5a5', 
                      borderRadius: '4px', 
                      fontSize: '12px' 
                    }}>
                      {loginError}
                    </div>
                  )}
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ 
                      position: 'absolute', 
                      left: '8px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      width: '14px', 
                      height: '14px', 
                      color: '#9ca3af' 
                    }} />
                    <Input
                      type="email"
                      placeholder="E-Mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        paddingLeft: '28px',
                        height: '32px',
                        fontSize: '13px',
                        backgroundColor: '#374151',
                        borderColor: '#4b5563',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ 
                      position: 'absolute', 
                      left: '8px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      width: '14px', 
                      height: '14px', 
                      color: '#9ca3af' 
                    }} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Passwort"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        paddingLeft: '28px',
                        paddingRight: '28px',
                        height: '32px',
                        fontSize: '13px',
                        backgroundColor: '#374151',
                        borderColor: '#4b5563',
                        color: 'white'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        height: '32px',
                        fontSize: '13px',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      {isLoading ? '...' : 'Anmelden'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setEmail('');
                        setPassword('');
                        setLoginError('');
                      }}
                      style={{
                        height: '32px',
                        fontSize: '13px',
                        backgroundColor: '#6b7280',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  <Mail style={{ width: '16px', height: '16px' }} />
                  Anmelden
                </button>
              )}
            </div>
          )}
        </div>

        <nav style={{ marginTop: '24px', paddingBottom: '120px' }}>
          {sortedMenuItems.map((item) => (
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
