'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, getTransaksi, getQuest, getTodayKey, formatRupiah } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { PiggyBank, TrendingDown, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
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

    const bulanan = tab.uangSaku + tab.biayaWajib.reduce((a: number, b: { nominal: number }) => a + b.nominal, 0) + tab.pengeluaranLain;
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Saldo</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{formatRupiah(tabungan.saldo)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <PiggyBank className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pengeluaran Bulanan</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{formatRupiah(totalPengeluaran)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quest Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{questDone}/2 Selesai</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Trophy className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Transaksi Terakhir</h3>
              {recentTransaksi.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada transaksi</p>
              ) : (
                <div className="space-y-3">
                  {recentTransaksi.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{t.keterangan}</p>
                        <p className="text-xs text-gray-500">{t.tanggal}</p>
                      </div>
                      <span className={`font-semibold ${t.kategori === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.kategori === 'pemasukan' ? '+' : '-'}{formatRupiah(t.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/tabungan" className="flex items-center justify-between p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <span className="font-medium text-amber-700">Tambah Transaksi</span>
                  <ArrowRight size={20} className="text-amber-600" />
                </Link>
                <Link href="/tracker" className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-700">Cek Tracker Makan</span>
                  <ArrowRight size={20} className="text-blue-600" />
                </Link>
                <Link href="/quest" className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="font-medium text-purple-700">Lihat Quest</span>
                  <ArrowRight size={20} className="text-purple-600" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
