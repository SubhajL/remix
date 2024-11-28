'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Create', path: '/create' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Gen</h1>
      </div>
      <nav className="space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === item.path
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
} 