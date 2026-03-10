'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutDashboard, Package, LogOut, Loader2, Upload, X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    category: 'saree',
    description: '',
    price: 0,
    discountPrice: 0,
    images: [] as string[],
    fabric: '',
    color: '',
    work: '',
    occasion: '',
    blouseIncluded: 'Yes',
    kurtiType: '',
    sleeveType: '',
    neckType: '',
    size: [] as string[],
    stock: 0,
  });

  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size: string) => {
    setProduct(prev => ({
      ...prev,
      size: prev.size.includes(size) ? prev.size.filter(s => s !== size) : [...prev.size, size]
    }));
  };

  const addImageUrl = () => {
    if (imageUrl) {
      setProduct(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', product);
      toast.success('Product added successfully!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
          <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
            <Package size={20} /> Products
          </Link>
          <Link href="/add-product" className="flex items-center gap-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-xl font-bold">
            <Plus size={20} /> Add Product
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/products" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-pink-600 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={18} />}
            Publish Product
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Basic Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={product.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    placeholder="Enter product title..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={product.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      placeholder="elegant-silk-saree"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    >
                      <option value="saree">Saree</option>
                      <option value="kurti">Kurti</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    value={product.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                    placeholder="Describe the product material, design, style..."
                  />
                </div>
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Pricing & Inventory</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={product.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Price (₹)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={product.discountPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Units</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={product.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Specification - Dynamic */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Product Specifications</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fabric</label>
                  <input
                    type="text"
                    name="fabric"
                    required
                    value={product.fabric}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={product.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                
                {product.category === 'saree' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Work Type</label>
                      <input
                        type="text"
                        name="work"
                        value={product.work}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Occasion</label>
                      <input
                        type="text"
                        name="occasion"
                        value={product.occasion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Blouse Included</label>
                      <select
                        name="blouseIncluded"
                        value={product.blouseIncluded}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </>
                )}

                {product.category === 'kurti' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kurti Type</label>
                      <input
                        type="text"
                        name="kurtiType"
                        value={product.kurtiType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sleeve Type</label>
                      <input
                        type="text"
                        name="sleeveType"
                        value={product.sleeveType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Neck Type</label>
                      <input
                        type="text"
                        name="neckType"
                        value={product.neckType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Available Sizes</label>
                      <div className="flex flex-wrap gap-3">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeChange(size)}
                            className={`px-6 py-2 rounded-xl font-bold border-2 transition-all ${
                              product.size.includes(size)
                                ? 'bg-pink-600 border-pink-600 text-white'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-pink-200 hover:text-pink-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Media - Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Product Images</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="Image URL..."
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((url, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-100 group">
                      <Image src={url} alt="Product preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {product.images.length === 0 && (
                    <div className="col-span-2 aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                       <Upload size={32} className="mb-2" />
                       <p className="text-xs font-medium">Add product images</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
               <h4 className="text-pink-900 font-bold mb-2">Publishing Tip</h4>
               <p className="text-pink-700 text-sm leading-relaxed">
                 High quality images (aspect ratio 3:4) significantly increase your chances of making a sale. Ensure product details are accurate.
               </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
