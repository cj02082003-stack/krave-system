'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ToggleLeft, ToggleRight, Edit2, Trash2, X, Save, AlertTriangle, Loader2, Sparkles, Globe, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ProductMapping {
  id: string;
  name: string;
  price: number;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  priority: number;
  status: string;
  products?: ProductMapping[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Modals & Submitting States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    priority: 1,
    status: 'ACTIVE'
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { data: categoriesData } = await supabase.from('categories').select('*');
    const { data: productsData } = await supabase.from('products').select('*');

    const dataWithProducts = categoriesData?.map(cat => ({
      ...cat,
      products: productsData?.filter(p => p.category_id === cat.id) || []
    }));

    // 👑 IN-UPGRADE: SORT ENGINE (Ascending Order - Priority #1 to Down)
    // Kung gusto mong baligtarin (pataas ang numero), pagpalitin lang ang `a` at `b` -> (b.priority || 0) - (a.priority || 0)
    const sortedData = dataWithProducts ? [...dataWithProducts].sort((a, b) => (a.priority || 0) - (b.priority || 0)) : [];

    setCategories(sortedData);

    // Dynamic state pointer para i-highlight ang bagong top-priority group kung wala pang napipili
    if (sortedData.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(sortedData[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, status: newStatus } : cat));

    try {
      const { error } = await supabase.from('categories').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error("Failed configuration pipeline:", err);
      fetchCategories();
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    const nextPriority = categories.length > 0 ? Math.max(...categories.map(c => c.priority || 0)) + 1 : 1;
    setFormData({ name: '', slug: '', description: '', priority: nextPriority, status: 'ACTIVE' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode('edit');
    setSelectedCategoryId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      priority: category.priority || 1,
      status: category.status || 'ACTIVE'
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      slug: formData.slug.trim(),
      description: formData.description,
      priority: Number(formData.priority),
      status: formData.status
    };

    try {
      if (modalMode === 'create') {
        const { data, error } = await supabase.from('categories').insert([payload]).select();
        if (error) throw error;
        if (data && data.length > 0) setSelectedCategoryId(data[0].id);
      } else {
        if (!selectedCategoryId) return;
        const { error } = await supabase.from('categories').update(payload).eq('id', selectedCategoryId);
        if (error) throw error;
      }
      await fetchCategories();
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Writing sequence aborted:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', itemToDelete.id);
      if (error) throw error;
      setSelectedCategoryId(null);
      await fetchCategories();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Purging stack violation exception:", err);
    } finally {
      setDeleting(false);
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategoryId) || categories[0] || null;
  const activeProducts = currentCategory?.products || [];

  const renderCategoryIcon = (name: string) => {
    const title = name.toLowerCase();
    if (title.includes('chef')) return <Sparkles className="h-5 w-5 text-orange-500" />;
    if (title.includes('viet') || title.includes('asian')) return <Globe className="h-5 w-5 text-emerald-500" />;
    return <Utensils className="h-5 w-5 text-amber-500" />;
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 antialiased bg-[#f8fafc]">
      
      {/* HEADER SECTION - UPGRADED MOBILE RESPONSIVENESS */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight">Categories Layout</h1>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 leading-normal">
            MANAGE STOREFRONT CATALOG SECTIONS, SORT ORDER, AND MENU DISPLAY TOGGLES.
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-[#556b2f] hover:bg-[#3d4f21] text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm shadow-sm transition w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Category
        </button>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <Loader2 className="h-8 w-8 text-[#556b2f] animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-4">Loading database mapping engine...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT: CATEGORY LIST CARDS */}
          <div className="lg:col-span-2 space-y-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`p-4 sm:p-6 bg-white border rounded-2xl shadow-sm cursor-pointer transition-all relative ${
                  category.id === selectedCategoryId ? 'border-[#556b2f] ring-1 ring-[#556b2f]' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Status Badge */}
                <span className={`absolute top-4 right-4 sm:top-6 sm:right-6 text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  category.status === 'ACTIVE' ? 'bg-[#e6f7ed] text-[#15803d]' : 'bg-slate-100 text-slate-400'
                }`}>
                  {category.status}
                </span>

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Rounded Icon Box */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                    {renderCategoryIcon(category.name)}
                  </div>

                  <div className="space-y-1 w-full pr-12 sm:pr-16">
                    <h3 className="font-black text-slate-800 text-sm sm:text-base tracking-tight">{category.name}</h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono font-medium break-all">{category.slug}</p>
                    <p className="text-xs sm:text-sm font-normal text-slate-500 pt-1.5 leading-relaxed">{category.description || 'No description provided.'}</p>
                    
                    {/* Card Actions Footer Area - Upgraded Responsive Flex Wrap */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center pt-4 mt-3 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                      <p className="text-[11px] sm:text-xs font-bold text-slate-400">
                        Priority: <span className="text-slate-800 font-mono font-black">#{category.priority}</span>
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs font-bold">
                        <button 
                          onClick={(e) => handleToggleStatus(category.id, category.status, e)}
                          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition"
                        >
                          {category.status === 'ACTIVE' ? <ToggleRight className="h-4 w-4 text-[#556b2f]" /> : <ToggleLeft className="h-4 w-4 text-slate-300" />}
                          Toggle
                        </button>
                        <button onClick={(e) => handleOpenEditModal(category, e)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button onClick={(e) => triggerDelete(category.id, category.name, e)} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: ASSIGNED PRODUCTS LIST CARD WITH SUBTITLE HEADINGS */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-black text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                📋 ASSIGNED PRODUCTS LIST ({activeProducts.length})
              </h2>
              {currentCategory && (
                <p className="text-[10px] font-bold text-[#556b2f] lg:hidden">
                  Showing products for: <span className="underline">{currentCategory.name}</span>
                </p>
              )}
            </div>
            
            <div className="space-y-4 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {activeProducts.length === 0 ? (
                <p className="text-xs font-semibold text-slate-400 italic py-8 text-center bg-slate-50 rounded-xl">
                  No dishes inside this parameter block.
                </p>
              ) : (
                Object.entries(
                  activeProducts.reduce((acc: { [key: string]: any[] }, product: any) => {
                    const key = product.menu_heading || 'Main Selection';
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(product);
                    return acc;
                  }, {})
                ).map(([heading, subProducts]: [string, any[]]) => (
                  <div key={heading} className="space-y-2">
                    <div className="flex items-center gap-2 py-1">
                      <span className="h-px bg-slate-200 flex-1"></span>
                      <span className="text-[9px] sm:text-[10px] font-black text-[#556b2f] bg-[#e6f7ed] px-2 py-0.5 rounded uppercase tracking-wider">
                        {heading}
                      </span>
                      <span className="h-px bg-slate-200 flex-1"></span>
                    </div>

                    {subProducts.map((p) => (
                      <div key={p.id} className="p-3 sm:p-4 bg-slate-50/60 border border-slate-100 rounded-xl flex justify-between items-center transition hover:bg-slate-50 gap-2">
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight truncate">{p.name}</p>
                          <span className={`inline-block text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                            p.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-800 font-mono shrink-0">
                          ₱{Number(p.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* FORM INTERFACES MODAL - RESPONSIVE UPGRADE */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:animate-none">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-black text-slate-800 text-xs sm:text-sm">{modalMode === 'create' ? 'Add Category Group' : 'Edit Category Parameters'}</h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Group Label *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-slate-400" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Routing Link Slug *</label>
                <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold font-mono outline-none focus:border-slate-400" placeholder="/slug-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Priority Order Index</label>
                  <input type="number" required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-mono font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Display Toggle State</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 h-[40px] bg-white">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Description Composition</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold resize-none outline-none focus:border-slate-400" />
              </div>
              <div className="flex justify-end items-center gap-3 pt-2 pb-4 sm:pb-0">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2.5 text-xs font-bold text-slate-500">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-[#556b2f] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DANGER DELETION REMOVAL WARNING MODAL - RESPONSIVE UPGRADE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4 pb-8 sm:pb-6 animate-in slide-in-from-bottom sm:animate-none">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 flex items-center justify-center rounded-full"><AlertTriangle className="h-5 w-5" /></div>
            <div>
              <h3 className="font-black text-slate-800 text-sm">Purge Category?</h3>
              <p className="text-xs text-slate-400 mt-1">Siguradong buburahin si "{itemToDelete?.name}"?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" disabled={deleting} onClick={() => setIsDeleteModalOpen(false)} className="py-3 sm:py-2.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleConfirmDelete} className="py-3 sm:py-2.5 bg-red-600 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1">
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}