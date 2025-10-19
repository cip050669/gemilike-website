import { ReactNode } from 'react';

interface AdminHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
