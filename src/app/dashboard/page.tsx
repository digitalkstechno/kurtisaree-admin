'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Sparkles, Plus, LogOut, Package, Tag, ArrowUpRight, Loader2, Users, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logout successful');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex selection:bg-pink-100 selection:text-pink-600">
      {/* Sidebar - Dark & Professional */}
      <aside className="w-72 bg-gray-900 text-white hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-20">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-900/20 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-serif tracking-tighter text-white">
              KURTI<span className="text-pink-500 italic">SAREE</span>
            </span>
          </Link>
        </div>

        <div className="px-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 px-4 mb-4">Management</p>
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 bg-white/10 text-white rounded-xl font-bold transition-all border border-white/5">
              <LayoutDashboard size={20} className="text-pink-500" /> Overview
            </Link>
            <Link href="/products" className="flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-semibold transition-all group">
              <Package size={20} className="group-hover:text-pink-500 transition-colors" /> Saree & Kurti Catalog
            </Link>
            <Link href="/add-product" className="flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-semibold transition-all group">
              <Plus size={20} className="group-hover:text-pink-500 transition-colors" /> Add Saree/Kurti
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-serif text-gray-900 tracking-tight">Management Portal</h1>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Manage Catalog Details</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/add-product" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98]">
              <Plus size={16} /> Add Saree/Kurti
            </Link>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Saree/Kurti</p>
                <h3 className="text-4xl font-serif text-gray-900 mt-1">{stats?.totalProducts || 0}</h3>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Tag size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Collections</p>
                <h3 className="text-4xl font-serif text-gray-900 mt-1">{stats?.totalCategories || 2}</h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Inquiries</p>
                <h3 className="text-4xl font-serif text-gray-900 mt-1">12</h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Eye size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catalog Views</p>
                <h3 className="text-4xl font-serif text-gray-900 mt-1">1.2k</h3>
              </div>
            </div>
          </div>

          {/* Catalog & Activity Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-8">
              <h4 className="text-xl font-serif text-gray-900 tracking-tight flex items-center gap-3">
                Quick Management
                <div className="h-px bg-gray-100 flex-1" />
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/products" className="group p-8 bg-white border border-gray-100 rounded-[32px] hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                   <div className="flex flex-col gap-6">
                      <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                         <Package size={24} />
                      </div>
                      <div className="space-y-2">
                         <p className="text-xl font-serif text-gray-900">View Catalog Details</p>
                         <p className="text-sm text-gray-500 font-medium leading-relaxed">Update or check details for existing sarees and kurtis.</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-600 group-hover:gap-4 transition-all">
                        Open Catalog <ArrowUpRight size={14} />
                      </div>
                   </div>
                </Link>

                <Link href="/add-product" className="group p-8 bg-white border border-gray-100 rounded-[32px] hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                   <div className="flex flex-col gap-6">
                      <div className="w-12 h-12 bg-pink-600 text-white rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                         <Plus size={24} />
                      </div>
                      <div className="space-y-2">
                         <p className="text-xl font-serif text-gray-900">Add New Details</p>
                         <p className="text-sm text-gray-500 font-medium leading-relaxed">Enter details for a new saree or kurti to show in the catalog.</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-600 group-hover:gap-4 transition-all">
                        Enter Details <ArrowUpRight size={14} />
                      </div>
                   </div>
                </Link>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-xl font-serif text-gray-900 tracking-tight flex items-center gap-3">
                System Status
                <div className="h-px bg-gray-100 flex-1" />
              </h4>
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full min-h-[300px] flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-2">
                  <Sparkles size={32} />
                </div>
                <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
                <p className="text-xs text-gray-400 font-light max-w-[200px]">The management portal is synced with the production catalog.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
