'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, setTabungan } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import type { Lokasi } from '@/components/MapComponent';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">Memuat peta...</div>,
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

const budgetInfo: Record<BudgetLevel, { label: string; color: string; bg: string; max: string }> = {
  hemat: { label: 'Hemat', color: 'text-green-600', bg: 'bg-green-500', max: 'Maks Rp 15.000/hari' },
  sedang: { label: 'Sedang', color: 'text-blue-600', bg: 'bg-blue-500', max: 'Rp 15.000 - 30.000/hari' },
  fancy: { label: 'Fancy', color: 'text-purple-600', bg: 'bg-purple-500', max: 'Lebih dari Rp 30.000/hari' },
};

export default function TrackerPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<BudgetLevel>('hemat');
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [kampusLat, setKampusLat] = useState('-6.200000');
  const [kampusLng, setKampusLng] = useState('106.820000');

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push('/'); return; }
    const tab = getTabungan();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyTab: any = tab;
    if (anyTab.kampusLat) {
      setKampusLat(anyTab.kampusLat as string);
      setKampusLng(anyTab.kampusLng as string);
    }
  }, [router]);

  const handleSaveKoordinat = () => {
    const tab = getTabungan();
    const updated = { ...tab, kampusLat, kampusLng } as Parameters<typeof setTabungan>[0];
    setTabungan(updated);
    setShowSettings(false);
  };

  const center: [number, number] = [parseFloat(kampusLat), parseFloat(kampusLng)];
  const filteredLokasi = lokasiData[selected];
  const info = budgetInfo[selected];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Utensils size={24} /> Estimasi Makan per Hari
              </h2>
              <p className="text-gray-500 mt-1">Pilih level budget makanmu</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowMap(!showMap)} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${showMap ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                <Map size={16} /> {showMap ? 'Sembunyikan Map' : 'Tampilkan Map'}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                <Settings size={16} /> Koordinat Kampus
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Lokasi Kampus (Koordinat)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Latitude</label>
                  <input type="text" value={kampusLat} onChange={(e) => setKampusLat(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm mt-1" placeholder="-6.200000" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Longitude</label>
                  <input type="text" value={kampusLng} onChange={(e) => setKampusLng(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm mt-1" placeholder="106.820000" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleSaveKoordinat} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Simpan
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Masukkan koordinat lokasi kampus kamu. Contoh: Google Maps → klik kanan → What&apos;s here?</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            {(Object.keys(budgetInfo) as BudgetLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelected(level)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selected === level
                    ? `${budgetInfo[level].bg} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 hover:border-amber-300'
                }`}
              >
                <DollarSign size={32} className={`mx-auto mb-2 ${selected === level ? 'text-white' : budgetInfo[level].color}`} />
                <p className={`font-bold text-lg ${selected === level ? '' : 'text-gray-800'}`}>{budgetInfo[level].label}</p>
                <p className={`text-sm mt-1 ${selected === level ? 'text-white/80' : 'text-gray-500'}`}>{budgetInfo[level].max}</p>
              </button>
            ))}
          </div>

          {showMap && (
            <div className="mb-6">
              <h3 className={`font-semibold text-lg mb-3 ${info.color}`}>
                Peta Lokasi Makan ({info.label})
              </h3>
              <MapComponent center={center} lokasi={filteredLokasi} />
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className={`font-semibold text-lg mb-4 ${info.color}`}>
              Rekomendasi Tempat Makan ({info.label})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLokasi.map((tempat, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tempat.nama}</p>
                    <p className="text-sm text-gray-500">{tempat.estimasi}</p>
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
