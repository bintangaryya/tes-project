'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/storage';
import { User } from '@/lib/types';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="text-lg font-bold text-gray-800">Selamat Datang! 👋</h2>
      </div>
      {user && (
        <div className="flex items-center gap-3 bg-gray-50/80 rounded-2xl px-4 py-2 border border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-500/20">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{user.nama}</p>
            <p className="text-[11px] text-gray-400 font-medium">{user.kelas}</p>
          </div>
        </div>
      )}
    </header>
  );
}
