'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/storage';
import { User, Settings } from '@/lib/types';
import { t } from '@/lib/translations';
import { Menu, Sparkles } from 'lucide-react';

const motivasi = [
  'Menabung sedikit demi sedikit, lama-lama jadi bukit.',
  'Hemat pangkal kaya, boros pangkal miskin.',
  'Jangan tunda besok, mulai menabung hari ini.',
  'Rp10.000/hari = Rp300.000/bulan. Konsisten itu kunci!',
  'Masa depan cerah dimulai dari tabungan hari ini.',
  'Setiap rupiah yang ditabung adalah langkah menuju impian.',
  'Disiplin menabung hari ini, kebebasan finansial di masa depan.',
  'Kebiasaan kecil hari ini,成果 besar di masa depan.',
  'Uang yang ditabung adalah uang yang bekerja untukmu.',
  'Jadikan menabung sebagai kebiasaan, bukan paksaan.',
];

function getGreeting(lang: string): string {
  const hour = new Date().getHours();
  if (lang === 'en') {
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 16) return 'Good Afternoon';
    if (hour >= 16 && hour < 18) return 'Good Evening';
    return 'Good Night';
  }
  if (hour >= 5 && hour < 12) return 'Selamat Pagi';
  if (hour >= 12 && hour < 16) return 'Selamat Siang';
  if (hour >= 16 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

function getEmoji(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '☀️';
  if (hour >= 12 && hour < 16) return '🌤️';
  if (hour >= 16 && hour < 18) return '🌅';
  return '🌙';
}

function getRandomMotivasi(): string {
  const today = new Date().getDate();
  return motivasi[today % motivasi.length];
}

interface HeaderProps {
  onMenuClick?: () => void;
  settings?: Settings;
}

export default function Header({ onMenuClick, settings }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const lang = settings?.language || 'id';
  const dark = settings?.darkMode || false;

  useEffect(() => {
    setUser(getUser());
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const greeting = getGreeting(lang);
  const emoji = getEmoji();
  const motivasiText = getRandomMotivasi();

  return (
    <header className={`backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30 ${
      dark ? 'bg-gray-900/70 border-gray-700' : 'bg-white/70 border-gray-200/60'
    }`}>
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 lg:hidden ${
              dark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>
            {greeting}, {user?.nama}! {emoji}
          </h2>
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{dateStr}</p>
          <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>💡 &ldquo;{motivasiText}&rdquo;</p>
        </div>
      </div>
      {user && (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-2 border ${
          dark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50/80 border-gray-100'
        }`}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-500/20">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{user.nama}</p>
            <p className={`text-[11px] font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{user.kelas}</p>
          </div>
        </div>
      )}
    </header>
  );
}
