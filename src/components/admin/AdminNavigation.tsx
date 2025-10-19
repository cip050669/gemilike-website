'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  FileText, 
  Settings,
  Mail,
  Gem,
  LayoutDashboard,
  Image,
  Palette,
  Menu,
  X
} from 'lucide-react';

export default function AdminNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/homepage', icon: Home, label: 'Startseite' },
    { href: '/admin/products', icon: Package, label: 'Produkte' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Bestellungen' },
    { href: '/admin/customers', icon: Users, label: 'Kunden' },
    { href: '/admin/reports', icon: BarChart2, label: 'Berichte' },
    { href: '/admin/email-settings', icon: Mail, label: 'E-Mail-Einstellungen' },
    { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
    { href: '/admin/media', icon: Image, label: 'Medien' },
    { href: '/admin/design', icon: Palette, label: 'Design' },
    { href: '/admin/audit', icon: FileText, label: 'Audit-Logs' },
    { href: '/admin/settings', icon: Settings, label: 'Einstellungen' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gemilike</h2>
            <p className="text-sm text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 overflow-y-auto">
        <ul className="space-y-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-400">admin@gemilike.de</p>
          </div>
        </div>
      </div>
    </div>
  );
}
