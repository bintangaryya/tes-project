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
}

export interface Quest {
  tanggal: string;
  nabung: boolean;
  pengeluaranHari: number;
}

export interface QuestHistory {
  [key: string]: Quest;
}
