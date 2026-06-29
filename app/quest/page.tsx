'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getQuest, setQuest, getTodayKey, formatRupiah, getTransaksi } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Trophy, CheckCircle2, Circle, Target } from 'lucide-react';

export default function QuestPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nabung, setNabung] = useState(false);
  const [pengeluaranHari, setPengeluaranHari] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push('/'); return; }

    const quest = getQuest();
    const today = getTodayKey();
    const todayQuest = quest[today];

    if (todayQuest) {
      setNabung(todayQuest.nabung);
      setPengeluaranHari(todayQuest.pengeluaranHari);
    }

    const transaksi = getTransaksi();
    const todayDate = new Date().toLocaleDateString('id-ID');
    const todayExpenses = transaksi
      .filter(t => t.tanggal === todayDate && t.kategori === 'pengeluaran')
      .reduce((a, b) => a + b.nominal, 0);
    setPengeluaranHari(todayExpenses);

    if (todayExpenses !== todayQuest?.pengeluaranHari) {
      const updated = { ...quest, [today]: { tanggal: today, nabung: todayQuest?.nabung || false, pengeluaranHari: todayExpenses } };
      setQuest(updated);
    }
  }, [router]);

  const toggleNabung = () => {
    const newVal = !nabung;
    setNabung(newVal);
    const quest = getQuest();
    const today = getTodayKey();
    const updated = { ...quest, [today]: { tanggal: today, nabung: newVal, pengeluaranHari } };
    setQuest(updated);
  };

  const nabungProgress = nabung ? 100 : 0;
  const underBudget = pengeluaranHari < 50000;
  const expenseProgress = Math.min(100, (pengeluaranHari / 50000) * 100);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
              <Trophy size={24} className="text-amber-500" /> Quest Harian
            </h2>
            <p className="text-gray-400 mt-1 text-sm font-medium">Selesaikan misi hari ini!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${nabung ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg shadow-green-500/10' : 'bg-white/80 border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Target size={16} className="text-amber-500" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mission Sehari</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-800">Nabung {formatRupiah(15000)}</h3>
                </div>
                <button onClick={toggleNabung} className="mt-1 hover:scale-110 transition-transform duration-200">
                  {nabung ? (
                    <CheckCircle2 size={36} className="text-green-500 drop-shadow-lg" />
                  ) : (
                    <Circle size={36} className="text-gray-300 hover:text-green-400 transition-colors" />
                  )}
                </button>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500 font-medium">Progress</span>
                  <span className={`font-bold ${nabung ? 'text-green-500' : 'text-gray-400'}`}>
                    {nabung ? 'Selesai!' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200/80 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-700 ease-out ${nabung ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-300'}`} style={{ width: `${nabungProgress}%` }} />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 font-medium">
                {nabung ? 'Kamu sudah nabung hari ini!' : 'Klik centang jika sudah nabung hari ini'}
              </p>
            </div>

            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${underBudget ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg shadow-blue-500/10' : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-lg shadow-red-500/10'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Target size={16} className="text-amber-500" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mission Sehari</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-800">Pengeluaran Under {formatRupiah(50000)}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${underBudget ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-500/25' : 'bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/25'}`}>
                  {underBudget ? <CheckCircle2 size={20} className="text-white" /> : <span className="text-white font-bold text-sm">!</span>}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500 font-medium">Pengeluaran Hari Ini</span>
                  <span className={`font-bold ${underBudget ? 'text-blue-500' : 'text-red-500'}`}>
                    {formatRupiah(pengeluaranHari)}
                  </span>
                </div>
                <div className="w-full bg-gray-200/80 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-700 ease-out ${underBudget ? 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-500/30'}`} style={{ width: `${expenseProgress}%` }} />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 font-medium">
                Sisa budget hari ini: <span className={`font-bold ${underBudget ? 'text-blue-500' : 'text-red-500'}`}>{formatRupiah(Math.max(0, 50000 - pengeluaranHari))}</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
