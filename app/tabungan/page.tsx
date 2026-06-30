'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, setTabungan, getTransaksi, addTransaksi, deleteTransaksi, formatRupiah, getWishlist, setWishlist, getActiveWishlist, getWishlistHistory, addWishlist, updateWishlist, getTodayKey, getSettings } from '@/lib/storage';
import { t } from '@/lib/translations';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RiwayatTransaksi from '@/components/RiwayatTransaksi';
import WishlistSection from '@/components/WishlistSection';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, LayoutDashboard, History, Target } from 'lucide-react';
import { Transaksi, BiayaWajib, Wishlist, Settings } from '@/lib/types';

type Tab = 'ringkasan' | 'riwayat' | 'wishlist';

export default function TabunganPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettingsState] = useState<Settings>({ darkMode: false, language: 'id', tipsEnabled: true });
  const [activeTab, setActiveTab] = useState<Tab>('ringkasan');
  const [tabungan, setTabunganState] = useState({ saldo: 0, uangSaku: 0, biayaWajib: [] as BiayaWajib[], pengeluaranLain: 0 });
  const [transaksi, setTransaksiList] = useState<Transaksi[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ kategori: 'pemasukan' as 'pemasukan' | 'pengeluaran', nominal: '', keterangan: '' });
  const [uangSakuInput, setUangSakuInput] = useState('');
  const [pengeluaranLainInput, setPengeluaranLainInput] = useState('');
  const [biayaWajibBaru, setBiayaWajibBaru] = useState({ nama: '', nominal: '' });
  const [activeWishlist, setActiveWishlist] = useState<Wishlist | null>(null);
  const [wishlistHistory, setWishlistHistory] = useState<Wishlist[]>([]);

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
    setTabunganState(getTabungan());
    setTransaksiList(getTransaksi());
    setActiveWishlist(getActiveWishlist());
    setWishlistHistory(getWishlistHistory());
  }, [router]);

  const handleAddTransaksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nominal || !formData.keterangan) return;
    const nominal = parseInt(formData.nominal);
    const newTransaksi: Transaksi = {
      id: Date.now().toString(),
      tanggal: new Date().toLocaleDateString('id-ID'),
      nominal,
      kategori: formData.kategori,
      keterangan: formData.keterangan,
    };
    addTransaksi(newTransaksi);
    const newSaldo = formData.kategori === 'pemasukan' ? tabungan.saldo + nominal : tabungan.saldo - nominal;
    const updated = { ...tabungan, saldo: newSaldo };
    setTabungan(updated);
    setTabunganState(updated);
    setTransaksiList(getTransaksi());
    setFormData({ kategori: 'pemasukan', nominal: '', keterangan: '' });
    setShowForm(false);
  };

  const handleDeleteTransaksi = (id: string, t: Transaksi) => {
    deleteTransaksi(id);
    const newSaldo = t.kategori === 'pemasukan' ? tabungan.saldo - t.nominal : tabungan.saldo + t.nominal;
    const updated = { ...tabungan, saldo: newSaldo };
    setTabungan(updated);
    setTabunganState(updated);
    setTransaksiList(getTransaksi());
  };

  const handleSaveBulanan = () => {
    const updated = {
      ...tabungan,
      uangSaku: parseInt(uangSakuInput) || tabungan.uangSaku,
      pengeluaranLain: parseInt(pengeluaranLainInput) || tabungan.pengeluaranLain,
    };
    setTabungan(updated);
    setTabunganState(updated);
  };

  const handleAddBiayaWajib = () => {
    if (!biayaWajibBaru.nama || !biayaWajibBaru.nominal) return;
    const newBiaya: BiayaWajib = {
      id: Date.now().toString(),
      nama: biayaWajibBaru.nama,
      nominal: parseInt(biayaWajibBaru.nominal),
    };
    const updated = { ...tabungan, biayaWajib: [...tabungan.biayaWajib, newBiaya] };
    setTabungan(updated);
    setTabunganState(updated);
    setBiayaWajibBaru({ nama: '', nominal: '' });
  };

  const handleDeleteBiayaWajib = (id: string) => {
    const updated = { ...tabungan, biayaWajib: tabungan.biayaWajib.filter(b => b.id !== id) };
    setTabungan(updated);
    setTabunganState(updated);
  };

  const lang = settings.language;
  const dark = settings.darkMode;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'ringkasan', label: t('tabungan.ringkasan', lang), icon: <LayoutDashboard size={16} /> },
    { key: 'wishlist', label: t('tabungan.targetNabung', lang), icon: <Target size={16} /> },
    { key: 'riwayat', label: t('tabungan.riwayatTransaksi', lang), icon: <History size={16} /> },
  ];

  return (
    <div className={`flex min-h-screen ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
        <main className="p-6 flex-1">
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                      : dark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-gray-800 border border-gray-200/60'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'ringkasan' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                      <Wallet className="text-green-500" size={20} />
                    </div>
                    <p className={`font-semibold text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('tabungan.saldoSaatIni', lang)}</p>
                  </div>
                  <p className={`text-3xl font-extrabold ${dark ? 'text-white' : 'text-gray-800'}`}>{formatRupiah(tabungan.saldo)}</p>
                </div>

                <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="text-blue-500" size={20} />
                    </div>
                    <p className={`font-semibold text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('tabungan.pemasukanBulanan', lang)}</p>
                  </div>
                  <p className="text-3xl font-extrabold text-blue-500">{formatRupiah(tabungan.uangSaku)}</p>
                </div>

                <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
                      <TrendingDown className="text-red-500" size={20} />
                    </div>
                    <p className={`font-semibold text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('tabungan.pengeluaranWajib', lang)}</p>
                  </div>
                  <p className="text-3xl font-extrabold text-red-500">{formatRupiah(tabungan.biayaWajib.reduce((a, b) => a + b.nominal, 0))}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{t('tabungan.riwayatTransaksi', lang)}</h3>
                    <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200">
                      <Plus size={14} /> {t('tabungan.tambah', lang)}
                    </button>
                  </div>

                  {showForm && (
                    <form onSubmit={handleAddTransaksi} className={`mb-4 p-4 rounded-xl space-y-3 border ${dark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50/80 border-gray-100'}`}>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFormData({ ...formData, kategori: 'pemasukan' })} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${formData.kategori === 'pemasukan' ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t('tabungan.pemasukan', lang)}</button>
                        <button type="button" onClick={() => setFormData({ ...formData, kategori: 'pengeluaran' })} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${formData.kategori === 'pengeluaran' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t('tabungan.pengeluaran', lang)}</button>
                      </div>
                      <input type="number" placeholder={t('tabungan.nominal', lang)} value={formData.nominal} onChange={(e) => setFormData({ ...formData, nominal: e.target.value })} className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all ${dark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200 text-gray-800'}`} required />
                      <input type="text" placeholder={t('tabungan.keterangan', lang)} value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all ${dark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200 text-gray-800'}`} required />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/20">{t('tabungan.simpan', lang)}</button>
                        <button type="button" onClick={() => setShowForm(false)} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t('tabungan.batal', lang)}</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {transaksi.length === 0 ? (
                      <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t('tabungan.belumTransaksi', lang)}</p>
                    ) : (
                      transaksi.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between py-3 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.kategori === 'pemasukan' ? 'bg-green-50' : 'bg-red-50'}`}>
                              {item.kategori === 'pemasukan' ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                            </div>
                            <div>
                              <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{item.keterangan}</p>
                              <p className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.tanggal}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${item.kategori === 'pemasukan' ? 'text-green-500' : 'text-red-500'}`}>
                              {item.kategori === 'pemasukan' ? '+' : '-'}{formatRupiah(item.nominal)}
                            </span>
                            <button onClick={() => handleDeleteTransaksi(item.id, item)} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${dark ? 'text-gray-500 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
                    <h3 className={`font-bold mb-4 text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{t('tabungan.uangSaku', lang)}</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('tabungan.uangSaku', lang)}</label>
                        <div className="flex gap-2 mt-2">
                          <input type="number" placeholder={tabungan.uangSaku.toString()} value={uangSakuInput} onChange={(e) => setUangSakuInput(e.target.value)} className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-blue-400 focus:ring-0 outline-none transition-all ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
                          <button onClick={handleSaveBulanan} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all">Set</button>
                        </div>
                      </div>
                      <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('tabungan.pengeluaranLain', lang)}</label>
                        <div className="flex gap-2 mt-2">
                          <input type="number" placeholder={tabungan.pengeluaranLain.toString()} value={pengeluaranLainInput} onChange={(e) => setPengeluaranLainInput(e.target.value)} className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-blue-400 focus:ring-0 outline-none transition-all ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
                          <button onClick={handleSaveBulanan} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all">Set</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-white/60'} backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border`}>
                    <h3 className={`font-bold mb-4 text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{t('tabungan.biayaWajib', lang)}</h3>
                    <div className="flex gap-2 mb-3">
                      <input type="text" placeholder={lang === 'en' ? 'Name (SPP, etc)' : 'Nama (SPP, dll)'} value={biayaWajibBaru.nama} onChange={(e) => setBiayaWajibBaru({ ...biayaWajibBaru, nama: e.target.value })} className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
                      <input type="number" placeholder={t('tabungan.nominal', lang)} value={biayaWajibBaru.nominal} onChange={(e) => setBiayaWajibBaru({ ...biayaWajibBaru, nominal: e.target.value })} className={`w-28 px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
                      <button onClick={handleAddBiayaWajib} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all">{t('tabungan.tambah', lang)}</button>
                    </div>
                    <div className="space-y-2">
                      {tabungan.biayaWajib.map((b) => (
                        <div key={b.id} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                          <span className={`font-medium text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{b.nama}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{formatRupiah(b.nominal)}</span>
                            <button onClick={() => handleDeleteBiayaWajib(b.id)} className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all ${dark ? 'text-gray-500 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'riwayat' && (
            <RiwayatTransaksi transaksi={transaksi} />
          )}

          {activeTab === 'wishlist' && (
            <WishlistSection
              activeWishlist={activeWishlist}
              history={wishlistHistory}
              onUpdate={(id, updates) => {
                updateWishlist(id, updates);
                setActiveWishlist(getActiveWishlist());
                setWishlistHistory(getWishlistHistory());
              }}
              onCreate={(wishlist) => {
                addWishlist(wishlist);
                setActiveWishlist(getActiveWishlist());
              }}
              onComplete={(id) => {
                const all = getWishlist();
                if (all[id]) {
                  all[id] = { ...all[id], status: 'selesai', tanggalSelesai: getTodayKey() };
                  setWishlist(all);
                  setActiveWishlist(getActiveWishlist());
                  setWishlistHistory(getWishlistHistory());
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
