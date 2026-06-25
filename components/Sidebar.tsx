'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PiggyBank, UtensilsCrossed, Trophy, LogOut } from 'lucide-react';
import { clearUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';

const menus = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tabungan', label: 'Tabungan', icon: PiggyBank },
  { href: '/tracker', label: 'Tracker', icon: UtensilsCrossed },
  { href: '/quest', label: 'Quest', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-amber-600">STUKU</h1>
        <p className="text-xs text-gray-500">Student Keuangan</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
