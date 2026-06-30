'use client';

import { useState } from 'react';
import { Wishlist } from '@/lib/types';
import { formatRupiah } from '@/lib/storage';
import { Target, CheckCircle2, Clock, Trophy, Plus, X, Pencil } from 'lucide-react';

interface Props {
  activeWishlist: Wishlist | null;
  history: Wishlist[];
  onUpdate: (id: string, updates: Partial<Wishlist>) => void;
  onCreate: (wishlist: Wishlist) => void;
  onComplete: (id: string) => void;
}

export default function WishlistSection({ activeWishlist, history, onUpdate, onCreate, onComplete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nama: '', budget: '', nominalPerHari: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.budget || !formData.nominalPerHari) return;

    const budget = parseInt(formData.budget);
    const nominalPerHari = parseInt(formData.nominalPerHari);
    const totalHari = Math.ceil(budget / nominalPerHari);

    const newWishlist: Wishlist = {
      id: editingId || Date.now().toString(),
      nama: formData.nama,
      budget,
      nominalPerHari,
      hariTercapai: editingId && activeWishlist?.id === editingId ? activeWishlist.hariTercapai : 0,
      status: 'aktif',
      tanggalMulai: editingId && activeWishlist?.id === editingId ? activeWishlist.tanggalMulai : new Date().toISOString().split('T')[0],
    };

    onCreate(newWishlist);
    setFormData({ nama: '', budget: '', nominalPerHari: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleNabung = () => {
    if (!activeWishlist) return;
    const newHari = activeWishlist.hariTercapai + 1;
    const totalHari = Math.ceil(activeWishlist.budget / activeWishlist.nominalPerHari);

    if (newHari >= totalHari) {
      onComplete(activeWishlist.id);
    } else {
      onUpdate(activeWishlist.id, { hariTercapai: newHari });
    }
  };

  const handleEdit = () => {
    if (!activeWishlist) return;
    setFormData({
      nama: activeWishlist.nama,
      budget: activeWishlist.budget.toString(),
      nominalPerHari: activeWishlist.nominalPerHari.toString(),
    });
    setEditingId(activeWishlist.id);
    setShowForm(true);
  };

  const handleReset = () => {
    if (!activeWishlist) return;
    if (confirm('Yakin mau reset wishlist ini? Progress akan hilang.')) {
      onUpdate(activeWishlist.id, { hariTercapai: 0 });
    }
  };

  const activeTotalHari = activeWishlist ? Math.ceil(activeWishlist.budget / activeWishlist.nominalPerHari) : 0;
  const activeProgress = activeWishlist ? (activeWishlist.hariTercapai / activeTotalHari) * 100 : 0;
  const activeTerkumpul = activeWishlist ? activeWishlist.hariTercapai * activeWishlist.nominalPerHari : 0;
  const activeSisaHari = activeWishlist ? activeTotalHari - activeWishlist.hariTercapai : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Target size={24} className="text-amber-500" />
            Target Nabung
          </h2>
          <p className="text-gray-500 text-sm mt-1">Fokus ke satu wishlist, capai dengan konsisten!</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-sm">{editingId ? 'Edit Target' : 'Buat Target Baru'}</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); setFormData({ nama: '', budget: '', nominalPerHari: '' }); }} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Barang</label>
              <input type="text" placeholder="Contoh: Fixie Tsunami SNM100" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:border-amber-400 focus:ring-0 outline-none transition-all mt-1" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget (Rp)</label>
                <input type="number" placeholder="9700000" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:border-amber-400 focus:ring-0 outline-none transition-all mt-1" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nabung/Hari (Rp)</label>
                <input type="number" placeholder="100000" value={formData.nominalPerHari} onChange={(e) => setFormData({ ...formData, nominalPerHari: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:border-amber-400 focus:ring-0 outline-none transition-all mt-1" required />
              </div>
            </div>
            {formData.budget && formData.nominalPerHari && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm text-amber-700">
                  <span className="font-bold">Estimasi: {Math.ceil(parseInt(formData.budget) / parseInt(formData.nominalPerHari))} hari</span>
                  <span className="text-amber-500 ml-2">(≈ {Math.floor(Math.ceil(parseInt(formData.budget) / parseInt(formData.nominalPerHari)) / 30)} bulan {Math.ceil(parseInt(formData.budget) / parseInt(formData.nominalPerHari)) % 30} hari)</span>
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all">
                {editingId ? 'Update Target' : 'Buat Target'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ nama: '', budget: '', nominalPerHari: '' }); }} className="flex-1 bg-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-300 transition-all">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Wishlist */}
      {activeWishlist && !showForm && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">Target Aktif</p>
              <h3 className="text-xl font-bold mt-1">{activeWishlist.nama}</h3>
            </div>
            <button onClick={handleEdit} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all">
              <Pencil size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-amber-100 text-xs">Budget</p>
              <p className="font-bold text-lg">{formatRupiah(activeWishlist.budget)}</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs">Nabung/Hari</p>
              <p className="font-bold text-lg">{formatRupiah(activeWishlist.nominalPerHari)}</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs">Sisa Hari</p>
              <p className="font-bold text-lg">{activeSisaHari} hari</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-amber-100">Progress</span>
              <span className="font-bold">{activeWishlist.hariTercapai}/{activeTotalHari} hari ({Math.round(activeProgress)}%)</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4">
              <div
                className="bg-white h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.min(activeProgress, 100)}%` }}
              >
                {activeProgress > 10 && (
                  <span className="text-xs font-bold text-amber-600">{Math.round(activeProgress)}%</span>
                )}
              </div>
            </div>
            <p className="text-xs text-amber-100 mt-2">
              Terkumpul: <span className="font-bold text-white">{formatRupiah(activeTerkumpul)}</span> dari {formatRupiah(activeWishlist.budget)}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button onClick={handleNabung} className="flex-1 bg-white text-amber-600 py-3 rounded-xl font-bold text-sm hover:bg-amber-50 transition-all flex items-center justify-center gap-2 shadow-lg">
              <CheckCircle2 size={18} />
              Hari Ini Nabung
            </button>
            <button onClick={handleReset} className="px-4 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
              <Clock size={18} />
            </button>
          </div>
        </div>
      )}

      {/* No Active Wishlist */}
      {!activeWishlist && !showForm && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-amber-500" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Belum Ada Target</h3>
          <p className="text-gray-500 text-sm mb-4">Buat target nabung untuk wishlist kamu!</p>
          <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold mx-auto shadow-lg shadow-amber-500/20 transition-all">
            <Plus size={16} /> Buat Target
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            Riwayat Target Tercapai
          </h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.nama}</p>
                    <p className="text-[11px] text-gray-400">{item.tanggalSelesai} • {Math.ceil(item.budget / item.nominalPerHari)} hari</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-green-500">{formatRupiah(item.budget)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
