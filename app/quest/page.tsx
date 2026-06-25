'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getQuest, setQuest, getTodayKey, formatRupiah, getTransaksi } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Trophy, CheckCircle2, Circle, Target } from 'lucide-react';

export default function QuestPage() {
  const router = useRouter();
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy size={24} /> Quest Harian
            </h2>
            <p className="text-gray-500 mt-1">Selesaikan misi hari ini!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-xl p-6 shadow-sm border-2 ${nabung ? 'bg-green-50 border-green-300' : 'bg-white border-gray-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-500">Mission Sehari</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Nabung {formatRupiah(15000)}</h3>
                </div>
                <button onClick={toggleNabung} className="mt-1">
                  {nabung ? (
                    <CheckCircle2 size={32} className="text-green-500" />
                  ) : (
                    <Circle size={32} className="text-gray-300 hover:text-green-400" />
                  )}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className={`font-medium ${nabung ? 'text-green-600' : 'text-gray-500'}`}>
                    {nabung ? 'Selesai!' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all duration-500 ${nabung ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: `${nabungProgress}%` }} />
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                {nabung ? 'Kamu sudah nabung hari ini!' : 'Klik centang jika sudah nabung hari ini'}
              </p>
            </div>

            <div className={`rounded-xl p-6 shadow-sm border-2 ${underBudget ? 'bg-blue-50 border-blue-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-500">Mission Sehari</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Pengeluaran Under {formatRupiah(50000)}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${underBudget ? 'bg-blue-500' : 'bg-red-500'}`}>
                  {underBudget ? <CheckCircle2 size={20} className="text-white" /> : <span className="text-white font-bold">!</span>}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pengeluaran Hari Ini</span>
                  <span className={`font-medium ${underBudget ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatRupiah(pengeluaranHari)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all duration-500 ${underBudget ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${expenseProgress}%` }} />
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Sisa budget hari ini: <span className={`font-semibold ${underBudget ? 'text-blue-600' : 'text-red-600'}`}>{formatRupiah(Math.max(0, 50000 - pengeluaranHari))}</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
