'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getTabungan, setTabungan, getTransaksi, addTransaksi, deleteTransaksi, formatRupiah } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaksi, BiayaWajib } from '@/lib/types';

export default function TabunganPage() {
  const router = useRouter();
  const [tabungan, setTabunganState] = useState({ saldo: 0, uangSaku: 0, biayaWajib: [] as BiayaWajib[], pengeluaranLain: 0 });
  const [transaksi, setTransaksiList] = useState<Transaksi[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ kategori: 'pemasukan' as 'pemasukan' | 'pengeluaran', nominal: '', keterangan: '' });
  const [uangSakuInput, setUangSakuInput] = useState('');
  const [pengeluaranLainInput, setPengeluaranLainInput] = useState('');
  const [biayaWajibBaru, setBiayaWajibBaru] = useState({ nama: '', nominal: '' });

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push('/'); return; }
    setTabunganState(getTabungan());
    setTransaksiList(getTransaksi());
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="text-green-600" size={20} />
                </div>
                <p className="font-medium text-gray-800">Saldo Saat Ini</p>
              </div>
              <p className="text-3xl font-bold text-gray-800">{formatRupiah(tabungan.saldo)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <p className="font-medium text-gray-800">Pemasukan Bulanan</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{formatRupiah(tabungan.uangSaku)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="text-red-600" size={20} />
                </div>
                <p className="font-medium text-gray-800">Pengeluaran Wajib</p>
              </div>
              <p className="text-3xl font-bold text-red-600">{formatRupiah(tabungan.biayaWajib.reduce((a, b) => a + b.nominal, 0))}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Riwayat Transaksi</h3>
                <button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Plus size={16} /> Tambah
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleAddTransaksi} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setFormData({ ...formData, kategori: 'pemasukan' })} className={`flex-1 py-2 rounded-lg text-sm font-medium ${formData.kategori === 'pemasukan' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Pemasukan</button>
                    <button type="button" onClick={() => setFormData({ ...formData, kategori: 'pengeluaran' })} className={`flex-1 py-2 rounded-lg text-sm font-medium ${formData.kategori === 'pengeluaran' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Pengeluaran</button>
                  </div>
                  <input type="number" placeholder="Nominal" value={formData.nominal} onChange={(e) => setFormData({ ...formData, nominal: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  <input type="text" placeholder="Keterangan" value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm">Simpan</button>
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg text-sm">Batal</button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transaksi.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada transaksi</p>
                ) : (
                  transaksi.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.kategori === 'pemasukan' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {t.kategori === 'pemasukan' ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t.keterangan}</p>
                          <p className="text-xs text-gray-500">{t.tanggal}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${t.kategori === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.kategori === 'pemasukan' ? '+' : '-'}{formatRupiah(t.nominal)}
                        </span>
                        <button onClick={() => handleDeleteTransaksi(t.id, t)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Pengeluaran Bulanan</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Uang Saku / Bulanan</label>
                    <div className="flex gap-2 mt-1">
                      <input type="number" placeholder={tabungan.uangSaku.toString()} value={uangSakuInput} onChange={(e) => setUangSakuInput(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                      <button onClick={handleSaveBulanan} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Set</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Pengeluaran Lain / Bulan</label>
                    <div className="flex gap-2 mt-1">
                      <input type="number" placeholder={tabungan.pengeluaranLain.toString()} value={pengeluaranLainInput} onChange={(e) => setPengeluaranLainInput(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                      <button onClick={handleSaveBulanan} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Set</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Biaya Wajib / Bulanan</h3>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="Nama (SPP, dll)" value={biayaWajibBaru.nama} onChange={(e) => setBiayaWajibBaru({ ...biayaWajibBaru, nama: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                  <input type="number" placeholder="Nominal" value={biayaWajibBaru.nominal} onChange={(e) => setBiayaWajibBaru({ ...biayaWajibBaru, nominal: e.target.value })} className="w-28 px-3 py-2 border rounded-lg text-sm" />
                  <button onClick={handleAddBiayaWajib} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm">Tambah</button>
                </div>
                <div className="space-y-2">
                  {tabungan.biayaWajib.map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{b.nama}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatRupiah(b.nominal)}</span>
                        <button onClick={() => handleDeleteBiayaWajib(b.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
