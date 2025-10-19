import { ReactNode } from 'react';
import AdminLayoutComponent from '@/components/admin/AdminLayout';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLayoutComponent>
      {children}
    </AdminLayoutComponent>
  );
}