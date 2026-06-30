'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, getTransaksi, getQuest, getTodayKey, formatRupiah, getSettings } from '@/lib/storage';
import { t } from '@/lib/translations';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TipsCarousel from '@/components/TipsCarousel';
import { PiggyBank, TrendingDown, Trophy, ArrowRight, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Settings, User } from '@/lib/types';

const motivasi = [
  'Menabung sedikit demi sedikit, lama-lama jadi bukit.',
  'Hemat pangkal kaya, boros pangkal miskin.',
  'Jangan tunda besok, mulai menabung hari ini.',
  'Rp10.000/hari = Rp300.000/bulan. Konsisten itu kunci!',
  'Masa depan cerah dimulai dari tabungan hari ini.',
  'Kebiasaan kecil hari ini,成果 besar di masa depan.',
  'Uang yang ditabung adalah uang yang bekerja untukmu.',
  'Jadikan menabung sebagai kebiasaan, bukan paksaan.',
  'Setiap rupiah yang ditabung adalah langkah menuju impian.',
  'Disiplin menabung hari ini, kebebasan finansial di masa depan.',
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

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState<Settings>({ darkMode: false, language: 'id', tipsEnabled: true });
  const [user, setUser] = useState<User | null>(null);
  const [tabungan, setTabungan] = useState({ saldo: 0, uangSaku: 0, biayaWajib: [] as { id: string; nama: string; nominal: number }[], pengeluaranLain: 0 });
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [recentTransaksi, setRecentTransaksi] = useState<{ id: string; tanggal: string; nominal: number; kategori: string; keterangan: string }[]>([]);
  const [questDone, setQuestDone] = useState(0);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);

    const loadedSettings = getSettings();
    setSettings(loadedSettings);

    if (loadedSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  const lang = settings.language;
  const dark = settings.darkMode;

  return (
    <div className={`flex min-h-screen ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
        <main className="p-6 flex-1">
          {/* Tips Carousel */}
          {settings.tipsEnabled && (
            <div className="mb-6">
              <TipsCarousel language={lang} />
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('dashboard.totalSaldo', lang)}</p>
                  <p className={`text-2xl font-extrabold mt-2 ${dark ? 'text-white' : 'text-gray-800'}`}>{formatRupiah(tabungan.saldo)}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <PiggyBank className="text-green-500" size={22} />
                </div>
              </div>
            </div>

            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('dashboard.pengeluaranBulanan', lang)}</p>
                  <p className={`text-2xl font-extrabold mt-2 ${dark ? 'text-white' : 'text-gray-800'}`}>{formatRupiah(totalPengeluaran)}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <TrendingDown className="text-red-500" size={22} />
                </div>
              </div>
            </div>

            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('dashboard.questHari', lang)}</p>
                  <p className={`text-2xl font-extrabold mt-2 ${dark ? 'text-white' : 'text-gray-800'}`}>{questDone}/2 {t('dashboard.selesai', lang)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Trophy className="text-amber-500" size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent Transactions */}
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
              <h3 className={`font-bold mb-4 text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{t('dashboard.transaksiTerakhir', lang)}</h3>
              {recentTransaksi.length === 0 ? (
                <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('dashboard.belumTransaksi', lang)}</p>
              ) : (
                <div className="space-y-3">
                  {recentTransaksi.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between py-3 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.kategori === 'pemasukan' ? 'bg-green-50' : 'bg-red-50'}`}>
                          {item.kategori === 'pemasukan' ? <TrendingDown size={16} className="text-green-500 rotate-180" /> : <TrendingDown size={16} className="text-red-500" />}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{item.keterangan}</p>
                          <p className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.tanggal}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${item.kategori === 'pemasukan' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.kategori === 'pemasukan' ? '+' : '-'}{formatRupiah(item.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
              <h3 className={`font-bold mb-4 text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{t('dashboard.quickActions', lang)}</h3>
              <div className="space-y-3">
                <Link href="/tabungan" className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                  dark ? 'bg-amber-900/30 hover:bg-amber-900/50' : 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PiggyBank size={18} className="text-amber-600" />
                    </div>
                    <span className={`font-semibold text-sm ${dark ? 'text-amber-400' : 'text-amber-700'}`}>{t('dashboard.tambahTransaksi', lang)}</span>
                  </div>
                  <ArrowRight size={18} className={`${dark ? 'text-amber-500' : 'text-amber-500'} group-hover:translate-x-1 transition-transform`} />
                </Link>
                <Link href="/tracker" className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                  dark ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target size={18} className="text-blue-600" />
                    </div>
                    <span className={`font-semibold text-sm ${dark ? 'text-blue-400' : 'text-blue-700'}`}>{t('dashboard.cekTracker', lang)}</span>
                  </div>
                  <ArrowRight size={18} className={`${dark ? 'text-blue-500' : 'text-blue-500'} group-hover:translate-x-1 transition-transform`} />
                </Link>
                <Link href="/quest" className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                  dark ? 'bg-purple-900/30 hover:bg-purple-900/50' : 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy size={18} className="text-purple-600" />
                    </div>
                    <span className={`font-semibold text-sm ${dark ? 'text-purple-400' : 'text-purple-700'}`}>{t('dashboard.lihatQuest', lang)}</span>
                  </div>
                  <ArrowRight size={18} className={`${dark ? 'text-purple-500' : 'text-purple-500'} group-hover:translate-x-1 transition-transform`} />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
