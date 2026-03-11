'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, LayoutDashboard, Package, LogOut, Loader2, Upload, X, ChevronLeft, Sparkles, Save, Info, Trash2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { getImageUrl } from '@/lib/utils';

export default function EditProductPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products?limit=1000`); 
        const productData = response.data.products.find((p: any) => p._id === id);
        if (productData) {
          setProduct(productData);
        } else {
          toast.error('Masterpiece not found in catalog');
          router.push('/products');
        }
      } catch (error) {
        toast.error('Failed to retrieve masterpiece details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await api.post('/upload', formData);
      setProduct((prev) => ({ ...prev, images: [...prev.images, response.data.image] }));
      toast.success('Image Uploaded Successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Image upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Sanitize images array to ensure it only contains strings
    const sanitizedProduct = {
      ...product,
      images: product.images.map(img => typeof img === 'string' ? img : (img as any).url || '').filter(Boolean)
    };

    try {
      await api.put(`/products/${id}`, sanitizedProduct);
      toast.success('Masterpiece updated successfully');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update masterpiece');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this masterpiece from the catalog?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Masterpiece removed from catalog');
        router.push('/products');
      } catch (error: any) {
        toast.error('Failed to remove masterpiece');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logout successful');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600 mx-auto" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Retrieving Masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex selection:bg-pink-100 selection:text-pink-600">
      {/* Sidebar - Consistent with Dashboard */}
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
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-semibold transition-all group">
              <LayoutDashboard size={20} className="group-hover:text-pink-500 transition-colors" /> Overview
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
          <div className="flex items-center gap-4">
            <Link href="/products" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif text-gray-900 tracking-tight">Edit Saree / Kurti Details</h1>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Refining Details for: {product.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDelete}
              className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Remove from Catalog"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Update Catalog
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* General Info */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="w-8 h-8 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center">
                  <Info size={18} />
                </div>
                <h3 className="text-xl font-serif text-gray-900">General Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={product.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                    placeholder="e.g. Royal Silk Banarasi Saree"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Slug (URL Name)</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={product.slug}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                      placeholder="royal-silk-banarasi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Collection</label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                    >
                      <option value="saree">Saree Collection</option>
                      <option value="kurti">Kurti Collection</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Description & Details</label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    value={product.description}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900 resize-none"
                    placeholder="Describe the fabric, work, and special features..."
                  />
                </div>
              </div>
            </div>

            {/* Valuation & Inventory */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="w-8 h-8 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center">
                  <Package size={18} />
                </div>
                <h3 className="text-xl font-serif text-gray-900">Price & Availability</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Original Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={product.price}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Discounted Price (₹)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={product.discountPrice}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Pieces Available</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={product.stock}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="w-8 h-8 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-xl font-serif text-gray-900">Technical Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Fabric Type</label>
                  <input
                    type="text"
                    name="fabric"
                    required
                    value={product.fabric}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                    placeholder="e.g. Pure Georgette"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Color Name</label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={product.color}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                    placeholder="e.g. Crimson Red"
                  />
                </div>
                
                {product.category === 'saree' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Embroidery/Work</label>
                      <input
                        type="text"
                        name="work"
                        value={product.work}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                        placeholder="e.g. Zari Embroidery"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Occasion</label>
                      <input
                        type="text"
                        name="occasion"
                        value={product.occasion}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                        placeholder="e.g. Wedding, Party"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Blouse Piece</label>
                      <select
                        name="blouseIncluded"
                        value={product.blouseIncluded}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                      >
                        <option value="Yes">Included</option>
                        <option value="No">Not Included</option>
                      </select>
                    </div>
                  </>
                )}

                {product.category === 'kurti' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Kurti Style</label>
                      <input
                        type="text"
                        name="kurtiType"
                        value={product.kurtiType}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                        placeholder="e.g. Anarkali"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Sleeve Type</label>
                      <input
                        type="text"
                        name="sleeveType"
                        value={product.sleeveType}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base font-medium text-gray-900"
                        placeholder="e.g. Three-Quarter"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-4">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Available Sizes</label>
                      <div className="flex flex-wrap gap-3">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeChange(size)}
                            className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest border-2 transition-all duration-300 ${
                              product.size.includes(size)
                                ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200'
                                : 'bg-white border-gray-100 text-gray-300 hover:border-pink-200 hover:text-pink-500'
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

          {/* Visual Assets - Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8 sticky top-32">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="w-8 h-8 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <h3 className="text-xl font-serif text-gray-900">Visual Assets</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Upload Product Images</label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    <div className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                      uploading ? 'bg-gray-50 border-gray-200' : 'bg-gray-50/50 border-gray-100 group-hover:border-pink-200 group-hover:bg-pink-50/10'
                    }`}>
                      {uploading ? (
                        <Loader2 className="animate-spin text-pink-600" size={32} />
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-pink-500 group-hover:scale-110 transition-all">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">Click to Upload</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((url, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-50 group shadow-sm">
                      <Image src={getImageUrl(url)} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized={true} />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-600 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {product.images.length === 0 && !uploading && (
                    <div className="col-span-2 aspect-[3/4] bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center text-gray-300 p-8 text-center space-y-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Upload size={24} />
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Images define the catalog aesthetic</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <div className="bg-pink-50/50 p-6 rounded-2xl space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-pink-900 flex items-center gap-2">
                    <Sparkles size={14} /> Design Tip
                  </p>
                  <p className="text-xs text-pink-700 font-light leading-relaxed">
                    Use high-resolution 3:4 aspect ratio portrait images for the best gallery experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
