'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { PiggyBank, TrendingDown, Trophy, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/');
      return;
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-white/60 p-8 mb-8 animate-fadeIn">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <PiggyBank size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">STUKU</h1>
                  <p className="text-gray-400 text-sm font-medium tracking-wide">Student Keuangan Tracker</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>
                  <strong className="text-gray-800">STUKU</strong> adalah aplikasi tracker keuangan yang dirancang khusus untuk pelajar.
                  Aplikasi ini membantu kamu mengelola uang saku, memantau pengeluaran, dan belajar hemat
                  sejak dini.
                </p>
                <p>
                  Dengan STUKU, kamu bisa mencatat semua transaksi harian, mengatur biaya wajib bulanan seperti
                  SPP dan transportasi, serta melihat ringkasan keuanganmu secara real-time.
                </p>
              </div>

              <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Mulai Sekarang <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-amber-500" />
              <h2 className="text-lg font-bold text-gray-800">Fitur Utama</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PiggyBank className="text-green-500" size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">Tabungan</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Kelola saldo, catat pemasukan dan pengeluaran, atur uang saku bulanan,
                  serta pantau biaya wajib seperti SPP dan transportasi.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingDown className="text-red-500" size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">Tracker Makan</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Rekomendasi tempat makan berdasarkan budget harianmu. Pilih level hemat, sedang,
                  atau fancy, dan lihat rekomendasinya di peta!
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="text-amber-500" size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">Quest Harian</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Selesaikan misi harian seperti nabung Rp15.000 dan menjaga pengeluaran di bawah Rp50.000
                  untuk membangun kebiasaan finansial yang baik.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="text-blue-500" size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">Peta Lokasi</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Lihat lokasi tempat makan rekomendasi di peta interaktif. Sesuaikan koordinat
                  lokasi kampusmu untuk rekomendasi yang lebih akurat.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
