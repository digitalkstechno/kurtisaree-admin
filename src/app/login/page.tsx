'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      toast.success('Access Granted. Welcome back.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-pink-100 selection:text-pink-600">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-50 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-50 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="max-w-[450px] w-full relative z-10">
        <div className="bg-white border border-gray-100 p-10 md:p-14 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gray-900 rounded-[28px] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl transition-transform duration-700 hover:rotate-[360deg]">
              <Sparkles size={32} />
            </div>
            <h1 className="text-3xl font-serif text-gray-900 tracking-tight mb-3">Management Portal</h1>
            <p className="text-gray-400 text-sm font-light tracking-wide uppercase">KURTISAREE | Administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Email Identifier</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors duration-300">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Security Key</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors duration-300">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authenticate <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em]">© 2026 KURTISAREE. Handcrafted Legacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
