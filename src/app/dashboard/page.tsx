'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Plus, LogOut, Package, Tag, ArrowUpRight, Loader2 } from 'lucide-react';
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
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
            <ShoppingBag size={28} />
            Admin
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-xl font-bold">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
            <Package size={20} /> Products
          </Link>
          <Link href="/add-product" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
            <Plus size={20} /> Add Product
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <Link href="/add-product" className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-colors">
              <Plus size={18} /> New Product
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                <Package size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalProducts || 0}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Tag size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Categories</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalCategories || 2}</h3>
              </div>
            </div>
            {/* Additional dummy stats */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Recent Sales</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">45</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <ArrowUpRight size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">₹12.5k</h3>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-xl font-bold mb-6">Product Management</h4>
              <div className="space-y-4">
                <Link href="/products" className="block p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            <Package size={20} />
                         </div>
                         <div>
                            <p className="font-bold">View Product List</p>
                            <p className="text-sm text-gray-500">Edit or delete existing products</p>
                         </div>
                      </div>
                      <ArrowUpRight size={20} className="text-gray-300" />
                   </div>
                </Link>
                <Link href="/add-product" className="block p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            <Plus size={20} />
                         </div>
                         <div>
                            <p className="font-bold">Add New Product</p>
                            <p className="text-sm text-gray-500">Create new saree or kurti listing</p>
                         </div>
                      </div>
                      <ArrowUpRight size={20} className="text-gray-300" />
                   </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-xl font-bold mb-6">Recent Activity</h4>
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p className="text-sm">Activity logging coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
