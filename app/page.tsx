'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUser } from '@/lib/storage';
import { PiggyBank } from 'lucide-react';

export default function LoginPage() {
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !kelas.trim()) return;
    setUser({ nama: nama.trim(), kelas: kelas.trim() });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <PiggyBank size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-amber-600">STUKU</h1>
          <p className="text-gray-500 mt-2">Student Keuangan Tracker</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="Masukkan nama kamu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="Contoh: XII RPL 1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Mulai
          </button>
        </form>
      </div>
    </div>
  );
}
