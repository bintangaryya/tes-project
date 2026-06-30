'use client';

import { useState, useMemo } from 'react';
import { Transaksi } from '@/lib/types';
import { formatRupiah } from '@/lib/storage';
import { Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Period = 'minggu' | 'bulanan' | 'tahun';

interface RiwayatTransaksiProps {
  transaksi: Transaksi[];
}

function parseDate(tanggal: string): Date {
  const parts = tanggal.split('/');
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function getWeekKey(date: Date): string {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
}

function getMonthKey(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getYearKey(date: Date): string {
  return date.getFullYear().toString();
}

const COLORS = ['#22c55e', '#ef4444'];

export default function RiwayatTransaksi({ transaksi }: RiwayatTransaksiProps) {
  const [period, setPeriod] = useState<Period>('minggu');
  const [chartType, setChartType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');

  const groupedData = useMemo(() => {
    const groups: Record<string, { pemasukan: number; pengeluaran: number; count: number }> = {};

    transaksi.forEach((t) => {
      const date = parseDate(t.tanggal);
      let key = '';

      if (period === 'minggu') {
        key = getWeekKey(date);
      } else if (period === 'bulanan') {
        key = getMonthKey(date);
      } else {
        key = getYearKey(date);
      }

      if (!groups[key]) {
        groups[key] = { pemasukan: 0, pengeluaran: 0, count: 0 };
      }

      if (t.kategori === 'pemasukan') {
        groups[key].pemasukan += t.nominal;
      } else {
        groups[key].pengeluaran += t.nominal;
      }
      groups[key].count++;
    });

    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([label, data]) => ({ label, ...data }));
  }, [transaksi, period]);

  const chartData = useMemo(() => {
    return groupedData.map((g) => ({
      name: g.label.length > 12 ? g.label.substring(0, 12) + '...' : g.label,
      fullName: g.label,
      pemasukan: g.pemasukan,
      pengeluaran: g.pengeluaran,
      selisih: g.pemasukan - g.pengeluaran,
    }));
  }, [groupedData]);

  const pieData = useMemo(() => {
    const totalPemasukan = transaksi.filter(t => t.kategori === 'pemasukan').reduce((a, b) => a + b.nominal, 0);
    const totalPengeluaran = transaksi.filter(t => t.kategori === 'pengeluaran').reduce((a, b) => a + b.nominal, 0);
    return [
      { name: 'Pemasukan', value: totalPemasukan },
      { name: 'Pengeluaran', value: totalPengeluaran },
    ].filter(d => d.value > 0);
  }, [transaksi]);

  const totalPemasukan = transaksi.filter(t => t.kategori === 'pemasukan').reduce((a, b) => a + b.nominal, 0);
  const totalPengeluaran = transaksi.filter(t => t.kategori === 'pengeluaran').reduce((a, b) => a + b.nominal, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
    return value.toString();
  };

  const periods: { key: Period; label: string; icon: string }[] = [
    { key: 'minggu', label: 'Mingguan', icon: '📅' },
    { key: 'bulanan', label: 'Bulanan', icon: '📆' },
    { key: 'tahun', label: 'Tahunan', icon: '🗓️' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <BarChart3 className="text-purple-500" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Riwayat Transaksi</h3>
          <p className="text-[11px] text-gray-400">Analisis keuanganmu</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">Total Masuk</p>
          <p className="text-lg font-extrabold text-green-600 mt-1">{formatRupiah(totalPemasukan)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
          <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Total Keluar</p>
          <p className="text-lg font-extrabold text-red-600 mt-1">{formatRupiah(totalPengeluaran)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Selisih</p>
          <p className={`text-lg font-extrabold mt-1 ${totalPemasukan - totalPengeluaran >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatRupiah(totalPemasukan - totalPengeluaran)}
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
        <h4 className="font-bold text-gray-800 text-sm mb-4">Ringkasan Keseluruhan</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatRupiah(value as number)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-800 text-sm">Grafik Periode</h4>
          <div className="flex gap-1.5">
            <button
              onClick={() => setChartType('pemasukan')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${chartType === 'pemasukan' ? 'bg-green-500 text-white shadow-md shadow-green-500/25' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setChartType('pengeluaran')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${chartType === 'pengeluaran' ? 'bg-red-500 text-white shadow-md shadow-red-500/25' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                period === p.key
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="h-64">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Belum ada data untuk periode ini</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value) => formatRupiah(value as number)}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.name === label);
                    return item?.fullName || label;
                  }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Bar
                  dataKey={chartType === 'pemasukan' ? 'pemasukan' : 'pengeluaran'}
                  fill={chartType === 'pemasukan' ? '#22c55e' : '#ef4444'}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-white/60">
        <h4 className="font-bold text-gray-800 text-sm mb-4">Detail Periode</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {groupedData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Belum ada transaksi</p>
          ) : (
            groupedData.map((g, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{g.label}</p>
                  <p className="text-[11px] text-gray-400">{g.count} transaksi</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-500">+{formatRupiah(g.pemasukan)}</p>
                  <p className="text-xs font-bold text-red-500">-{formatRupiah(g.pengeluaran)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
