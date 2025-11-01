import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gem,
  Users,
  ShieldCheck,
  Gauge,
  ShoppingCart,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Edelsteine', href: '/admin', icon: Gem },
  { label: 'Kunden', href: '/admin/customers', icon: Users },
  { label: 'Audit-Log', href: '/admin/audit', icon: ShieldCheck },
  { label: 'Dashboard', href: '/admin/dashboard', icon: Gauge },
  { label: 'Bestellungen', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Berichte', href: '/admin/reports', icon: BarChart3 },
  { label: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center space-x-8 overflow-x-auto border-b border-muted pb-3"
      aria-label="Admin Navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              'hover:bg-muted hover:text-foreground text-muted-foreground',
              isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminNavigation;
