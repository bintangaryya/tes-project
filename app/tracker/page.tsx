'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, setTabungan, getSettings } from '@/lib/storage';
import { t } from '@/lib/translations';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import type { Lokasi } from '@/components/MapComponent';
import { Settings as SettingsType } from '@/lib/types';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Loading map...</div>,
});
import { Utensils, DollarSign, MapPin, Map, Settings } from 'lucide-react';

type BudgetLevel = 'hemat' | 'sedang' | 'fancy';

const lokasiData: Record<BudgetLevel, (Lokasi & { tipe: BudgetLevel })[]> = {
  hemat: [
    { nama: 'Kantin Kampus', lat: -6.200000, lng: 106.820000, estimasi: 'Rp 8.000 - 15.000', tipe: 'hemat' },
    { nama: 'Warung Tegal', lat: -6.201000, lng: 106.821500, estimasi: 'Rp 10.000 - 15.000', tipe: 'hemat' },
    { nama: 'Nasi Kuning Bu Ani', lat: -6.199500, lng: 106.819000, estimasi: 'Rp 8.000 - 12.000', tipe: 'hemat' },
    { nama: 'Mie Ayam Pak Budi', lat: -6.200500, lng: 106.821000, estimasi: 'Rp 10.000 - 15.000', tipe: 'hemat' },
  ],
  sedang: [
    { nama: 'Food Court Mall', lat: -6.198000, lng: 106.823000, estimasi: 'Rp 20.000 - 30.000', tipe: 'sedang' },
    { nama: 'Resto Padang Sederhana', lat: -6.199000, lng: 106.822000, estimasi: 'Rp 18.000 - 28.000', tipe: 'sedang' },
    { nama: 'Soto Betawi Mas Rohman', lat: -6.201500, lng: 106.820500, estimasi: 'Rp 20.000 - 25.000', tipe: 'sedang' },
    { nama: 'Warmindo Supreme', lat: -6.197500, lng: 106.821000, estimasi: 'Rp 15.000 - 25.000', tipe: 'sedang' },
  ],
  fancy: [
    { nama: 'Bakmi GM', lat: -6.197000, lng: 106.824000, estimasi: 'Rp 35.000 - 50.000', tipe: 'fancy' },
    { nama: 'Solaria', lat: -6.198500, lng: 106.823500, estimasi: 'Rp 30.000 - 45.000', tipe: 'fancy' },
    { nama: 'Kopi Kenangan', lat: -6.199500, lng: 106.824500, estimasi: 'Rp 25.000 - 40.000', tipe: 'fancy' },
    { nama: 'PHD / KFC', lat: -6.196500, lng: 106.823000, estimasi: 'Rp 35.000 - 55.000', tipe: 'fancy' },
  ],
};

const budgetInfo: Record<BudgetLevel, { labelId: string; labelEn: string; color: string; bg: string; maxId: string; maxEn: string; gradient: string }> = {
  hemat: { labelId: 'Hemat', labelEn: 'Budget', color: 'text-green-600', bg: 'bg-green-500', maxId: 'Maks Rp 15.000/hari', maxEn: 'Max Rp 15,000/day', gradient: 'from-green-400 to-emerald-500' },
  sedang: { labelId: 'Sedang', labelEn: 'Medium', color: 'text-blue-600', bg: 'bg-blue-500', maxId: 'Rp 15.000 - 30.000/hari', maxEn: 'Rp 15,000 - 30,000/day', gradient: 'from-blue-400 to-cyan-500' },
  fancy: { labelId: 'Fancy', labelEn: 'Fancy', color: 'text-purple-600', bg: 'bg-purple-500', maxId: 'Lebih dari Rp 30.000/hari', maxEn: 'Over Rp 30,000/day', gradient: 'from-purple-400 to-pink-500' },
};

export default function TrackerPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettingsState] = useState<SettingsType>({ darkMode: false, language: 'id', tipsEnabled: true });
  const [selected, setSelected] = useState<BudgetLevel>('hemat');
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [kampusLat, setKampusLat] = useState('-6.200000');
  const [kampusLng, setKampusLng] = useState('106.820000');

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
    const tab = getTabungan();
    if (tab.kampusLat) {
      setKampusLat(tab.kampusLat);
      setKampusLng(tab.kampusLng ?? '');
    }
  }, [router]);

  const handleSaveKoordinat = () => {
    const tab = getTabungan();
    const updated = { ...tab, kampusLat, kampusLng };
    setTabungan(updated);
    setShowSettings(false);
  };

  const lang = settings.language;
  const dark = settings.darkMode;
  const center: [number, number] = [parseFloat(kampusLat), parseFloat(kampusLng)];
  const filteredLokasi = lokasiData[selected];
  const info = budgetInfo[selected];
  const label = lang === 'en' ? info.labelEn : info.labelId;
  const max = lang === 'en' ? info.maxEn : info.maxId;

  return (
    <div className={`flex min-h-screen ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
                <Utensils size={24} /> {t('tracker estimasi', lang)}
              </h2>
              <p className={`mt-1 text-sm font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('tracker.pilihBudget', lang)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowMap(!showMap)} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all duration-200 ${showMap ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25' : dark ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white/80 border border-gray-200/60 text-gray-600 hover:bg-white shadow-sm'}`}>
                <Map size={14} /> {showMap ? t('tracker.sembunyikanMap', lang) : t('tracker.tampilkanMap', lang)}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all duration-200 ${dark ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white/80 border border-gray-200/60 text-gray-600 hover:bg-white shadow-sm'}`}>
                <Settings size={14} /> {t('tracker.koordinatKampus', lang)}
              </button>
            </div>
          </div>

          {showSettings && (
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border mb-6`}>
              <h3 className={`font-bold mb-4 text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{lang === 'en' ? 'Campus Location (Coordinates)' : 'Lokasi Kampus (Koordinat)'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Latitude</label>
                  <input type="text" value={kampusLat} onChange={(e) => setKampusLat(e.target.value)} className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all mt-2 ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} placeholder="-6.200000" />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Longitude</label>
                  <input type="text" value={kampusLng} onChange={(e) => setKampusLng(e.target.value)} className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all mt-2 ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} placeholder="106.820000" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleSaveKoordinat} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200">
                    {t('tabungan.simpan', lang)}
                  </button>
                </div>
              </div>
              <p className={`text-[11px] mt-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{lang === 'en' ? 'Enter your campus coordinates. Example: Google Maps → right click → What\'s here?' : 'Masukkan koordinat lokasi kampus kamu. Contoh: Google Maps → klik kanan → What\'s here?'}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            {(Object.keys(budgetInfo) as BudgetLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelected(level)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selected === level
                    ? `bg-gradient-to-br ${budgetInfo[level].gradient} text-white border-transparent shadow-xl`
                    : dark ? 'bg-gray-800 border-gray-700 hover:border-amber-500' : 'bg-white/80 border-gray-200/60 hover:border-amber-300 shadow-sm hover:shadow-md'
                }`}
              >
                <DollarSign size={28} className={`mx-auto mb-2 ${selected === level ? 'text-white' : budgetInfo[level].color}`} />
                <p className={`font-bold text-sm ${selected === level ? '' : dark ? 'text-white' : 'text-gray-800'}`}>{label}</p>
                <p className={`text-xs mt-1 ${selected === level ? 'text-white/80' : dark ? 'text-gray-500' : 'text-gray-400'}`}>{max}</p>
              </button>
            ))}
          </div>

          {showMap && (
            <div className="mb-6">
              <h3 className={`font-bold text-sm mb-3 ${info.color}`}>
                {t('tracker.rekomendasi', lang)} ({label})
              </h3>
              <div className={`rounded-2xl overflow-hidden shadow-sm border ${dark ? 'border-gray-700' : 'border-gray-200/60'}`}>
                <MapComponent center={center} lokasi={filteredLokasi} />
              </div>
            </div>
          )}

          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
            <h3 className={`font-bold text-sm mb-4 ${info.color}`}>
              {t('tracker.rekomendasi', lang)} ({label})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLokasi.map((tempat, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50/80 border border-gray-100 hover:bg-white hover:shadow-sm'}`}>
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{tempat.nama}</p>
                    <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{tempat.estimasi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
