import { User, Transaksi, Tabungan, QuestHistory } from './types';

const KEYS = {
  USER: 'stuku_user',
  TRANSAKSI: 'stuku_transaksi',
  TABUNGAN: 'stuku_tabungan',
  QUEST: 'stuku_quest',
};

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export function setUser(user: User) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(KEYS.USER);
}

export function getTransaksi(): Transaksi[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.TRANSAKSI);
  return data ? JSON.parse(data) : [];
}

export function addTransaksi(transaksi: Transaksi) {
  const list = getTransaksi();
  list.unshift(transaksi);
  localStorage.setItem(KEYS.TRANSAKSI, JSON.stringify(list));
}

export function deleteTransaksi(id: string) {
  const list = getTransaksi().filter(t => t.id !== id);
  localStorage.setItem(KEYS.TRANSAKSI, JSON.stringify(list));
}

export function getTabungan(): Tabungan {
  if (typeof window === 'undefined') return { saldo: 0, uangSaku: 0, biayaWajib: [], pengeluaranLain: 0 };
  const data = localStorage.getItem(KEYS.TABUNGAN);
  return data ? JSON.parse(data) : { saldo: 0, uangSaku: 0, biayaWajib: [], pengeluaranLain: 0 };
}

export function setTabungan(tabungan: Tabungan) {
  localStorage.setItem(KEYS.TABUNGAN, JSON.stringify(tabungan));
}

export function getQuest(): QuestHistory {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(KEYS.QUEST);
  return data ? JSON.parse(data) : {};
}

export function setQuest(quest: QuestHistory) {
  localStorage.setItem(KEYS.QUEST, JSON.stringify(quest));
}

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}
