'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Loader2, LayoutDashboard, Package, LogOut, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products?limit=100');
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch catalog');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to archive this masterpiece? This action cannot be undone.')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product archived successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logout successful');
    router.push('/login');
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex selection:bg-pink-100 selection:text-pink-600">
      {/* Sidebar - Consistent with Dashboard */}
      <aside className="w-72 bg-gray-900 text-white hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-20">
        <div className="p-8">
          <Link href="/products" className="flex items-center gap-3 group">
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
            <Link href="/products" className="flex items-center gap-3 px-4 py-3.5 bg-white/10 text-white rounded-xl font-bold transition-all border border-white/5">
              <Package size={20} className="text-pink-500" /> Saree & Kurti Catalog
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
            <h1 className="text-2xl font-serif text-gray-900 tracking-tight">Saree & Kurti Catalog</h1>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Manage Catalog Details</p>
          </div>
          <Link href="/add-product" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98]">
            <Plus size={16} /> Add Saree/Kurti
          </Link>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search by name, fabric, or collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 text-base font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Catalog Table */}
          <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Saree / Kurti</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Collection</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Price Details</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Availability</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product: any) => (
                    <tr key={product._id} className="group hover:bg-gray-50/50 transition-colors duration-300">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                            <Image src={getImageUrl(product.images[0])} alt={product.name} fill className="object-cover" unoptimized={true} />
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-lg font-serif text-gray-900 group-hover:text-pink-600 transition-colors duration-300">{product.name}</p>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
  <span>{product.fabric}</span>
  <span className="w-1 h-1 bg-gray-200 rounded-full inline-block"></span>
  <span>{product.color}</span>
</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${
                          product.category === 'saree' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="space-y-1">
                          <p className="text-base font-bold text-gray-900">{formatPrice(product.discountPrice || product.price)}</p>
                          {product.discountPrice && (
                            <p className="text-xs text-gray-300 line-through font-bold">{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-gray-600' : 'text-red-500'}`}>
                            {product.stock} Pieces
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                          <Link 
                            href={`/edit-product/${product._id}`} 
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit Details"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            onClick={() => deleteProduct(product._id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Archive Piece"
                          >
                            <Trash2 size={18} />
                          </button>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_SHOP_URL || 'http://localhost:3000'}/product/${product.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all"
                            title="View in Catalog"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="p-20 text-center space-y-4 bg-gray-50/30">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <Package size={32} />
                </div>
                <p className="text-xl font-serif text-gray-900">No masterpieces found</p>
                <p className="text-sm text-gray-400 font-light max-w-xs mx-auto">Try refining your search identifier or add a new creation to the catalog.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-[10px] font-bold uppercase tracking-widest text-pink-600 hover:text-pink-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
