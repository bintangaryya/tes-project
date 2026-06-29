'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PiggyBank, UtensilsCrossed, Trophy, LogOut, Home, X } from 'lucide-react';
import { clearUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';

const menus = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tabungan', label: 'Tabungan', icon: PiggyBank },
  { href: '/tracker', label: 'Tracker', icon: UtensilsCrossed },
  { href: '/quest', label: 'Quest', icon: Trophy },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <>
      {!open && (
        <button
          onClick={onToggle}
          className="fixed top-5 left-5 z-50 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-xl p-2.5 shadow-lg shadow-black/5 hover:bg-white hover:shadow-xl transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/60 flex flex-col transition-all duration-300 z-40 shadow-xl shadow-black/5 ${
          open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
              <PiggyBank size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">STUKU</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Student Keuangan</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                    : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-800'
                }`}
              >
                <Icon size={19} />
                <span className="font-semibold text-sm">{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 w-full transition-all duration-200 group"
          >
            <LogOut size={19} className="group-hover:rotate-180 transition-transform duration-300" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
