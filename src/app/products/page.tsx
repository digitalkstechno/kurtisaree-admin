'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Filter, Loader2, LayoutDashboard, Package, LogOut } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';
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
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Same as Dashboard) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
            <Package size={28} />
            Admin
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-xl font-bold">
            <Package size={20} /> Products
          </Link>
          <Link href="/add-product" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
            <Plus size={20} /> Add Product
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
          <Link href="/add-product" className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-colors">
            <Plus size={18} /> New Product
          </Link>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Price</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Stock</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                          <Image src={product.images[0] || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500 font-medium">Slug: {product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        product.category === 'saree' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{formatPrice(product.discountPrice || product.price)}</p>
                      {product.discountPrice && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/edit-product/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-bold">No products found</p>
                <p>Try searching with a different term or add a new product.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
