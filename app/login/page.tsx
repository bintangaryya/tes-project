'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUser } from '@/lib/storage';
import { PiggyBank, ArrowRight, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && (!nama.trim() || !email.trim() || !password.trim())) return;
    if (mode === 'login' && (!email.trim() || !password.trim())) return;

    const displayName = mode === 'signup' ? nama.trim() : email.split('@')[0];
    setUser({ nama: displayName, kelas: 'Siswa' });
    router.push('/home');
  };

  const handleGoogleLogin = () => {
    setUser({ nama: 'Google User', kelas: 'Siswa' });
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/50 to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-10 w-full max-w-md relative z-10 border border-white/60 animate-scaleIn">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
            <PiggyBank size={38} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">STUKU</h1>
          <p className="text-gray-400 mt-1.5 text-sm tracking-wide">
            {mode === 'login' ? 'Masuk ke akunmu' : 'Buat akun baru'}
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3.5 font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Login dengan Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">atau</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className={`relative group ${focused === 'nama' ? 'scale-[1.01]' : ''} transition-transform duration-200`}>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  onFocus={() => setFocused('nama')}
                  onBlur={() => setFocused('')}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-amber-400 focus:bg-white outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                  placeholder="Masukkan nama kamu"
                  required
                />
              </div>
            </div>
          )}

          <div className={`relative group ${focused === 'email' ? 'scale-[1.01]' : ''} transition-transform duration-200`}>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-amber-400 focus:bg-white outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                placeholder="contoh@email.com"
                required
              />
            </div>
          </div>

          <div className={`relative group ${focused === 'password' ? 'scale-[1.01]' : ''} transition-transform duration-200`}>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-amber-400 focus:bg-white outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
          >
            {mode === 'login' ? 'Masuk' : 'Buat Akun'}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-amber-500 hover:text-amber-600 font-semibold transition-colors"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <Link
          href="/"
          className="block text-center text-gray-400 text-xs mt-4 hover:text-gray-600 transition-colors"
        >
          &larr; Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}