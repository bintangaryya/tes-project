export interface User {
  nama: string;
  kelas: string;
}

export interface Transaksi {
  id: string;
  tanggal: string;
  nominal: number;
  kategori: 'pemasukan' | 'pengeluaran';
  keterangan: string;
}

export interface BiayaWajib {
  id: string;
  nama: string;
  nominal: number;
}

export interface Tabungan {
  saldo: number;
  uangSaku: number;
  biayaWajib: BiayaWajib[];
  pengeluaranLain: number;
  kampusLat?: string;
  kampusLng?: string;
}

export interface Quest {
  tanggal: string;
  nabung: boolean;
  pengeluaranHari: number;
}

export interface QuestHistory {
  [key: string]: Quest;
}

export interface Wishlist {
  id: string;
  nama: string;
  budget: number;
  nominalPerHari: number;
  hariTercapai: number;
  status: 'aktif' | 'selesai';
  tanggalMulai: string;
  tanggalSelesai?: string;
}

export interface WishlistHistory {
  [key: string]: Wishlist;
}

export type Language = 'id' | 'en';

export interface Settings {
  darkMode: boolean;
  language: Language;
  tipsEnabled: boolean;
}
