'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, setUser, clearUser, getSettings, updateSettings } from '@/lib/storage';
import { t } from '@/lib/translations';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { User, Moon, Sun, Globe, Shield, LogOut, Save, ChevronRight } from 'lucide-react';
import { Language } from '@/lib/types';

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUserState] = useState<{ nama: string; kelas: string } | null>(null);
  const [settings, setSettingsState] = useState({ darkMode: false, language: 'id' as Language, tipsEnabled: true });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ nama: '', kelas: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) { router.push('/'); return; }
    setUserState(currentUser);
    setEditData(currentUser);
    setSettingsState(getSettings());
  }, [router]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleSaveProfile = () => {
    if (!editData.nama || !editData.kelas) return;
    setUser({ nama: editData.nama, kelas: editData.kelas });
    setUserState(editData);
    setEditMode(false);
  };

  const handleToggleDarkMode = () => {
    const newSettings = updateSettings({ darkMode: !settings.darkMode });
    setSettingsState(newSettings);
  };

  const handleChangeLanguage = (lang: Language) => {
    const newSettings = updateSettings({ language: lang });
    setSettingsState(newSettings);
  };

  const handleLogout = () => {
    if (confirm('Yakin mau logout?')) {
      clearUser();
      router.push('/');
    }
  };

  if (!user) return null;

  return (
    <div className={`flex min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} settings={settings} />
        <main className="p-6 flex-1">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className={`text-xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
              {t('settings.title', settings.language)}
            </h2>

            {/* Profil Akun */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border ${settings.darkMode ? 'border-gray-700' : 'border-white/60'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold text-sm flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <User size={16} className="text-amber-500" />
                  {t('settings.profil', settings.language)}
                </h3>
                {!editMode && (
                  <button onClick={() => setEditMode(true)} className="text-amber-500 text-xs font-semibold hover:text-amber-600">
                    {t('settings.gantiAkun', settings.language)}
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <label className={`text-xs font-semibold ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>{t('settings.nama', settings.language)}</label>
                    <input type="text" value={editData.nama} onChange={(e) => setEditData({ ...editData, nama: e.target.value })} className={`w-full px-4 py-2.5 ${settings.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all mt-1`} />
                  </div>
                  <div>
                    <label className={`text-xs font-semibold ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>{t('settings.kelas', settings.language)}</label>
                    <input type="text" value={editData.kelas} onChange={(e) => setEditData({ ...editData, kelas: e.target.value })} className={`w-full px-4 py-2.5 ${settings.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl text-sm font-medium focus:border-amber-400 focus:ring-0 outline-none transition-all mt-1`} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/20">{t('settings.simpan', settings.language)}</button>
                    <button onClick={() => { setEditMode(false); setEditData(user); }} className={`flex-1 ${settings.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-300 transition-all`}>{t('tabungan.batal', settings.language)}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('settings.nama', settings.language)}</span>
                    <span className={`font-semibold text-sm ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>{user.nama}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('settings.kelas', settings.language)}</span>
                    <span className={`font-semibold text-sm ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>{user.kelas}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tampilan */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border ${settings.darkMode ? 'border-gray-700' : 'border-white/60'}`}>
              <h3 className={`font-bold text-sm mb-4 flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                {settings.darkMode ? <Moon size={16} className="text-amber-500" /> : <Sun size={16} className="text-amber-500" />}
                {t('settings.tampilan', settings.language)}
              </h3>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('settings.darkMode', settings.language)}</span>
                <button onClick={handleToggleDarkMode} className={`w-12 h-6 rounded-full transition-all ${settings.darkMode ? 'bg-amber-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Bahasa */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border ${settings.darkMode ? 'border-gray-700' : 'border-white/60'}`}>
              <h3 className={`font-bold text-sm mb-4 flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Globe size={16} className="text-amber-500" />
                {t('settings.bahasa', settings.language)}
              </h3>
              <div className="space-y-2">
                <button onClick={() => handleChangeLanguage('id')} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.language === 'id' ? 'bg-amber-50 border-2 border-amber-300' : `${settings.darkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-gray-50 border-2 border-gray-200'}`}`}>
                  <span className={`text-sm font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Indonesia</span>
                  {settings.language === 'id' && <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                </button>
                <button onClick={() => handleChangeLanguage('en')} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.language === 'en' ? 'bg-amber-50 border-2 border-amber-300' : `${settings.darkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-gray-50 border-2 border-gray-200'}`}`}>
                  <span className={`text-sm font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>English</span>
                  {settings.language === 'en' && <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                </button>
              </div>
            </div>

            {/* Keamanan */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border ${settings.darkMode ? 'border-gray-700' : 'border-white/60'}`}>
              <h3 className={`font-bold text-sm mb-2 flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Shield size={16} className="text-amber-500" />
                {t('settings.keamanan', settings.language)}
              </h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('settings.keamananDesc', settings.language)}</p>
              <div className={`mt-4 p-4 rounded-xl ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 opacity-50">
                  <Shield size={20} className="text-gray-400" />
                  <div>
                    <p className={`text-sm font-medium ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Password</p>
                    <p className={`text-xs ${settings.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all">
              <LogOut size={18} />
              {t('settings.logout', settings.language)}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
