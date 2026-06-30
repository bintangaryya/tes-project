'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getQuest, setQuest, getTodayKey, formatRupiah, getTransaksi, getSettings } from '@/lib/storage';
import { t } from '@/lib/translations';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Trophy, CheckCircle2, Circle, Target } from 'lucide-react';
import { Settings } from '@/lib/types';

export default function QuestPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettingsState] = useState<Settings>({ darkMode: false, language: 'id', tipsEnabled: true });
  const [nabung, setNabung] = useState(false);
  const [pengeluaranHari, setPengeluaranHari] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push('/'); return; }
    const loadedSettings = getSettings();
    setSettingsState(loadedSettings);
    if (loadedSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

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
      .filter(item => item.tanggal === todayDate && item.kategori === 'pengeluaran')
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

  const lang = settings.language;
  const dark = settings.darkMode;
  const nabungProgress = nabung ? 100 : 0;
  const underBudget = pengeluaranHari < 50000;
  const expenseProgress = Math.min(100, (pengeluaranHari / 50000) * 100);

  return (
    <div className={`flex min-h-screen ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
        <main className="p-6 flex-1">
          <div className="mb-6">
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
              <Trophy size={24} className="text-amber-500" /> {t('quest.title', lang)}
            </h2>
            <p className={`mt-1 text-sm font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('quest.selesaikan', lang)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nabung Quest */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${nabung ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg shadow-green-500/10' : dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Target size={16} className="text-amber-500" />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('quest.missionSehari', lang)}</span>
                  </div>
                  <h3 className={`text-lg font-extrabold ${dark ? 'text-white' : 'text-gray-800'}`}>{t('quest.nabung', lang)} {formatRupiah(15000)}</h3>
                </div>
                <button onClick={toggleNabung} className="mt-1 hover:scale-110 transition-transform duration-200">
                  {nabung ? (
                    <CheckCircle2 size={36} className="text-green-500 drop-shadow-lg" />
                  ) : (
                    <Circle size={36} className={`${dark ? 'text-gray-600' : 'text-gray-300'} hover:text-green-400 transition-colors`} />
                  )}
                </button>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className={`font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('quest.progress', lang)}</span>
                  <span className={`font-bold ${nabung ? 'text-green-500' : dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {nabung ? t('quest.selesai', lang) : '0%'}
                  </span>
                </div>
                <div className={`w-full rounded-full h-2.5 ${dark ? 'bg-gray-700' : 'bg-gray-200/80'}`}>
                  <div className={`h-2.5 rounded-full transition-all duration-700 ease-out ${nabung ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-300'}`} style={{ width: `${nabungProgress}%` }} />
                </div>
              </div>

              <p className={`text-xs mt-4 font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {nabung ? (lang === 'en' ? 'You saved today!' : 'Kamu sudah nabung hari ini!') : t('quest.klikCentang', lang)}
              </p>
            </div>

            {/* Expense Quest */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${underBudget ? (dark ? 'bg-gray-800 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg shadow-blue-500/10') : (dark ? 'bg-gray-800 border-red-800' : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-lg shadow-red-500/10')}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Target size={16} className="text-amber-500" />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('quest.missionSehari', lang)}</span>
                  </div>
                  <h3 className={`text-lg font-extrabold ${dark ? 'text-white' : 'text-gray-800'}`}>{t('quest.pengeluaranUnder', lang)} {formatRupiah(50000)}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${underBudget ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-500/25' : 'bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/25'}`}>
                  {underBudget ? <CheckCircle2 size={20} className="text-white" /> : <span className="text-white font-bold text-sm">!</span>}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className={`font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('quest.pengeluaranHari', lang)}</span>
                  <span className={`font-bold ${underBudget ? 'text-blue-500' : 'text-red-500'}`}>
                    {formatRupiah(pengeluaranHari)}
                  </span>
                </div>
                <div className={`w-full rounded-full h-2.5 ${dark ? 'bg-gray-700' : 'bg-gray-200/80'}`}>
                  <div className={`h-2.5 rounded-full transition-all duration-700 ease-out ${underBudget ? 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-500/30'}`} style={{ width: `${expenseProgress}%` }} />
                </div>
              </div>

              <p className={`text-xs mt-4 font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('quest.sisaBudget', lang)}: <span className={`font-bold ${underBudget ? 'text-blue-500' : 'text-red-500'}`}>{formatRupiah(Math.max(0, 50000 - pengeluaranHari))}</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
