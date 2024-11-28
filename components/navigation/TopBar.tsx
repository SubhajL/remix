'use client';

import { usePathname } from 'next/navigation';

export default function TopBar() {
  const pathname = usePathname();
  
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/create':
        return 'Create Content';
      case '/dashboard':
        return 'Dashboard';
      default:
        return 'Content Generator';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          {getPageTitle(pathname)}
        </h1>
      </div>
    </header>
  );
} 