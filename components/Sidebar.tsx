'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PiggyBank, UtensilsCrossed, Trophy, Settings, Home, X } from 'lucide-react';
import { Settings as SettingsType } from '@/lib/types';
import { t } from '@/lib/translations';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  settings?: SettingsType;
}

export default function Sidebar({ open, onToggle, settings }: SidebarProps) {
  const pathname = usePathname();
  const lang = settings?.language || 'id';
  const dark = settings?.darkMode || false;

  const menus = [
    { href: '/dashboard', label: t('sidebar.dashboard', lang), icon: LayoutDashboard },
    { href: '/tabungan', label: t('sidebar.tabungan', lang), icon: PiggyBank },
    { href: '/tracker', label: t('sidebar.tracker', lang), icon: UtensilsCrossed },
    { href: '/quest', label: t('sidebar.quest', lang), icon: Trophy },
    { href: '/settings', label: t('sidebar.settings', lang), icon: Settings },
  ];

  return (
    <>
      {!open && (
        <button
          onClick={onToggle}
          className={`fixed top-5 left-5 z-50 backdrop-blur-md border rounded-xl p-2.5 shadow-lg transition-all duration-200 ${
            dark ? 'bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700' : 'bg-white/80 border-gray-200/60 text-gray-600 hover:bg-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full backdrop-blur-xl border-r flex flex-col transition-all duration-300 z-40 shadow-xl ${
          dark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/90 border-gray-200/60'
        } ${open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
              <PiggyBank size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">STUKU</h1>
              <p className={`text-[10px] font-medium tracking-wider uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Student Keuangan</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
              dark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
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
                    : dark
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-800'
                }`}
              >
                <Icon size={19} />
                <span className="font-semibold text-sm">{menu.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
