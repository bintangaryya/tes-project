'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, getTransaksi, getQuest, getTodayKey, formatRupiah } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { PiggyBank, TrendingDown, Trophy, ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabungan, setTabungan] = useState({ saldo: 0, uangSaku: 0, biayaWajib: [] as { id: string; nama: string; nominal: number }[], pengeluaranLain: 0 });
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [recentTransaksi, setRecentTransaksi] = useState<{ id: string; tanggal: string; nominal: number; kategori: string; keterangan: string }[]>([]);
  const [questDone, setQuestDone] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/');
      return;
    }

    const tab = getTabungan();
    setTabungan(tab);

    const transaksi = getTransaksi();
    setRecentTransaksi(transaksi.slice(0, 5));

    const bulanan = tab.biayaWajib.reduce((a: number, b: { nominal: number }) => a + b.nominal, 0) + tab.pengeluaranLain;
    const pengeluaranTransaksi = transaksi
      .filter((t) => t.kategori === 'pengeluaran')
      .reduce((a, b) => a + b.nominal, 0);
    setTotalPengeluaran(bulanan + pengeluaranTransaksi);

    const quest = getQuest();
    const today = getTodayKey();
    const todayQuest = quest[today];
    let done = 0;
    if (todayQuest) {
      if (todayQuest.nabung) done++;
      if (todayQuest.pengeluaranHari < 50000) done++;
    }
    setQuestDone(done);
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Saldo</p>
                  <p className="text-2xl font-extrabold text-gray-800 mt-2">{formatRupiah(tabungan.saldo)}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <PiggyBank className="text-green-500" size={22} />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pengeluaran Bulanan</p>
                  <p className="text-2xl font-extrabold text-gray-800 mt-2">{formatRupiah(totalPengeluaran)}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <TrendingDown className="text-red-500" size={22} />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quest Hari Ini</p>
                  <p className="text-2xl font-extrabold text-gray-800 mt-2">{questDone}/2 Selesai</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Trophy className="text-amber-500" size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Transaksi Terakhir</h3>
              {recentTransaksi.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada transaksi</p>
              ) : (
                <div className="space-y-3">
                  {recentTransaksi.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.kategori === 'pemasukan' ? 'bg-green-50' : 'bg-red-50'}`}>
                          {t.kategori === 'pemasukan' ? <TrendingDown size={16} className="text-green-500 rotate-180" /> : <TrendingDown size={16} className="text-red-500" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{t.keterangan}</p>
                          <p className="text-[11px] text-gray-400">{t.tanggal}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${t.kategori === 'pemasukan' ? 'text-green-500' : 'text-red-500'}`}>
                        {t.kategori === 'pemasukan' ? '+' : '-'}{formatRupiah(t.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/tabungan" className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-200 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PiggyBank size={18} className="text-amber-600" />
                    </div>
                    <span className="font-semibold text-amber-700 text-sm">Tambah Transaksi</span>
                  </div>
                  <ArrowRight size={18} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/tracker" className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target size={18} className="text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-700 text-sm">Cek Tracker Makan</span>
                  </div>
                  <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/quest" className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy size={18} className="text-purple-600" />
                    </div>
                    <span className="font-semibold text-purple-700 text-sm">Lihat Quest</span>
                  </div>
                  <ArrowRight size={18} className="text-purple-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
