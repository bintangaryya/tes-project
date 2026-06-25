'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/storage';
import { User } from '@/lib/types';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Selamat Datang!</h2>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.nama}</p>
            <p className="text-xs text-gray-500">{user.kelas}</p>
          </div>
        </div>
      )}
    </header>
  );
}
