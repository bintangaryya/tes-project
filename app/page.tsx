'use client';

import { PiggyBank, TrendingDown, Trophy, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/50 to-orange-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
            <PiggyBank size={20} className="text-white" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">STUKU</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/login?mode=signup"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/30 rotate-3 hover:rotate-0 transition-transform duration-500">
            <PiggyBank size={52} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Kelola Keuanganmu dengan Bijak
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            STUKU adalah aplikasi tracker keuangan yang dirancang khusus untuk pelajar.
            Mulai belajar mengelola uang saku dari sekarang!
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
          >
            Mulai Sekarang <ArrowRight size={18} />
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-8 justify-center">
          <Sparkles size={20} className="text-amber-500" />
          <h2 className="text-xl font-bold text-gray-800">Fitur Unggulan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <PiggyBank className="text-green-500" size={26} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Tabungan</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kelola saldo, catat pemasukan dan pengeluaran, atur uang saku bulanan,
              serta pantau biaya wajib.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="text-red-500" size={26} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Tracker Makan</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Rekomendasi tempat makan berdasarkan budget harianmu. Pilih level hemat, sedang,
              atau fancy.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="text-amber-500" size={26} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Quest Harian</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Selesaikan misi harian seperti nabung Rp15.000 dan menjaga pengeluaran
              untuk membangun kebiasaan finansial.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="text-blue-500" size={26} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Peta Lokasi</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Lihat lokasi tempat makan rekomendasi di peta interaktif. Sesuaikan
              koordinat lokasi kampusmu.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-200/60 bg-white/50 backdrop-blur-xl">
        STUKU &copy; 2026 &mdash; Student Keuangan Tracker
      </footer>
    </div>
  );
}