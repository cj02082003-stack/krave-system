// 'use client';

// import React, { useState, useMemo } from 'react';

// interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   emoji: string;
//   status: 'Active' | 'Disabled';
//   productCount: number;
//   sortOrder: number;
// }

// const INITIAL_CATEGORIES: Category[] = [
//   { id: 'CAT-001', name: 'Mains', slug: 'mains', description: 'Traditional Filipino main plates.', emoji: '🍛', status: 'Active', productCount: 12, sortOrder: 1 },
// ];

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

//   return (
//     <main className="p-6 space-y-6 animate-fadeIn">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Categories Layout</h2>
//           <p className="text-xs text-slate-400">Manage storefront catalog sections, sort order, and menu display toggles.</p>
//         </div>
//         <button className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
//           + Add Category
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               <th className="py-4 px-6">Category Detail</th>
//               <th className="py-4 px-4 text-center">Linked Items</th>
//               <th className="py-4 px-4">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {categories.map((cat) => (
//               <tr key={cat.id}>
//                 <td className="py-4 px-6 flex items-center space-x-3">
//                   <span className="text-2xl">{cat.emoji}</span>
//                   <div>
//                     <span className="text-xs font-bold text-slate-950 block">{cat.name}</span>
//                     <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
//                   </div>
//                 </td>
//                 <td className="py-4 px-4 text-center text-xs font-bold">{cat.productCount} dishes</td>
//                 <td className="py-4 px-4 text-xs font-bold text-emerald-600">{cat.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, Layers, Edit2, Trash2, Power, PowerOff, X, 
  Save, AlertTriangle, Loader2, Sparkles, Globe, Soup, ShoppingBag
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  priority: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ProductMapping {
  name: string;
  price: string;
  isAvailable: boolean;
}

export default function AccurateCategoriesPage() {
  // 1. EKSLEVADO AT SAKTONG KATEGORYA BASE SA KRAVE KITCHEN DATA
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'CAT-01',
      name: "Chef's Specials",
      slug: '/chefs-specials',
      description: 'Premium signature dishes featuring our famous crispy bagnet twists and grilled favorites.',
      priority: 1,
      status: 'ACTIVE'
    },
    {
      id: 'CAT-02',
      name: 'Vietnamese & Asian',
      slug: '/viet-asian',
      description: 'Authentic Pho, fresh street-style Banh Mi, and classic Southeast Asian stir-fry noodles.',
      priority: 2,
      status: 'ACTIVE'
    },
    {
      id: 'CAT-03',
      name: 'Appetizers & Dimsum',
      slug: '/appetizers-dimsum',
      description: 'Perfect starters, steamed dimsum baskets, and crunchy deep-fried finger food pairs.',
      priority: 3,
      status: 'ACTIVE'
    }
  ]);

  // 2. ACCURATE PRODUCT ASSIGNMENT MAPPING GRID FOR PREVIEWING DATA
  const productCatalog: Record<string, ProductMapping[]> = {
    'CAT-01': [
      { name: 'Kare Kare Bagnet', price: '₱380.00', isAvailable: true },
      { name: 'Mongo Bagnet', price: '₱240.00', isAvailable: true },
      { name: 'Grilled Pork Belly', price: '₱290.00', isAvailable: true },
      { name: 'Special BBQ Skewers', price: '₱180.00', isAvailable: true },
      { name: 'Chicken Cordon Bleu', price: '₱320.00', isAvailable: false }
    ],
    'CAT-02': [
      { name: 'Pho Bo (Beef Pho)', price: '₱260.00', isAvailable: true },
      { name: 'Vietnamese Salad (Gỏi)', price: '₱190.00', isAvailable: true },
      { name: 'Gỏi Cuốn (Spring Rolls)', price: '₱160.00', isAvailable: true },
      { name: 'Beef Banh Mi', price: '₱180.00', isAvailable: true },
      { name: 'Pad Thai', price: '₱280.00', isAvailable: true }
    ],
    'CAT-03': [
      { name: 'Hakaw', price: '₱150.00', isAvailable: true },
      { name: 'Tamarind Prawn', price: '₱340.00', isAvailable: true },
      { name: 'Crab Rangoon', price: '₱180.00', isAvailable: true }
    ]
  };

  // SYSTEM INTERFACE STATE MANAGER CONTROLS
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('CAT-01');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // DELETE MODAL SYSTEM STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    priority: 1,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setIsMobileDrawerOpen(true);
  };

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, status: cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : cat));
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    const nextPriority = categories.length > 0 ? Math.max(...categories.map(c => c.priority)) + 1 : 1;
    setFormData({ name: '', slug: '', description: '', priority: nextPriority, status: 'ACTIVE' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode('edit');
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      priority: category.priority,
      status: category.status
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      if (modalMode === 'create') {
        const newCat: Category = {
          id: `CAT-${Date.now().toString().slice(-2)}`,
          name: formData.name,
          slug: formData.slug.startsWith('/') ? formData.slug : `/${formData.slug}`,
          description: formData.description || 'No store catalog description provided.',
          priority: Number(formData.priority),
          status: formData.status
        };
        setCategories(prev => [...prev, newCat]);
        setSelectedCategoryId(newCat.id);
      } else {
        setCategories(prev => prev.map(cat => cat.id === selectedCategoryId ? { ...cat, name: formData.name, slug: formData.slug, description: formData.description, priority: Number(formData.priority), status: formData.status } : cat));
      }
      setIsFormModalOpen(false);
      setSubmitting(false);
    }, 500);
  };

  const triggerDeleteConfirmation = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setDeleting(true);
    setTimeout(() => {
      setCategories(prev => prev.filter(cat => cat.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleting(false);
    }, 500);
  };

  // IN-LIBRARY ACCURATE ICON DISPATCHER (SOUP FALLBACK FOR DIMSUM SECTIONS)
  const getCategoryIcon = (name: string) => {
    if (name.includes("Chef")) return <Sparkles className="h-5 w-5 text-orange-500" />;
    if (name.includes("Vietnamese") || name.includes("Asian")) return <Globe className="h-5 w-5 text-emerald-500" />;
    return <Soup className="h-5 w-5 text-amber-500" />;
  };

  const currentCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];
  const activeProducts = currentCategory ? (productCatalog[currentCategory.id] || []) : [];

  const renderProductListPanel = () => (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShoppingBag className="h-3.5 w-3.5" /> Assigned Products List ({activeProducts.length})
        </h3>
      </div>
      <div className="space-y-2.5">
        {activeProducts.map((product, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 block">{product.name}</span>
              <span className={`inline-block text-[9px] font-extrabold uppercase px-1 rounded ${
                product.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
              }`}>{product.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            <span className="font-mono text-xs font-black text-slate-700">{product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased min-h-screen pb-12 relative">
      
      {/* HEADER SECTION CONTROLLERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Categories Layout</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Manage storefront catalog sections, sort order, and menu display toggles.
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition self-start sm:self-auto active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Category
        </button>
      </div>

      {/* CORE DISPLAY PIPELINE SYSTEM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN INTERACTIVE DIRECTORY SECTION */}
        <div className="lg:col-span-7 space-y-3.5">
          {categories
            .sort((a, b) => a.priority - b.priority)
            .map((category) => {
              const isSelected = category.id === selectedCategoryId;
              const isActive = category.status === 'ACTIVE';
              return (
                <div 
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                  className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 cursor-pointer transition-all ${
                    isSelected ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        {getCategoryIcon(category.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-slate-800 text-sm tracking-tight truncate">{category.name}</h3>
                        <p className="text-slate-400 font-bold text-[10px] tracking-wide font-mono mt-0.5">{category.slug}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {category.status}
                    </span>
                  </div>

                  <p className="text-slate-500 font-medium text-xs leading-relaxed">{category.description}</p>

                  <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-[11px] font-bold">
                    <span className="text-slate-400">Priority: <span className="text-slate-700 font-black font-mono">#{category.priority}</span></span>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => handleToggleStatus(category.id, e)} className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1">
                        {isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />} <span>Toggle</span>
                      </button>
                      <button onClick={(e) => handleOpenEditModal(category, e)} className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                        <Edit2 className="h-3.5 w-3.5" /> <span>Edit</span>
                      </button>
                      <button onClick={(e) => triggerDeleteConfirmation(category.id, category.name, e)} className="text-rose-500 hover:text-rose-700 inline-flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" /> <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* DESKTOP DRILL DOWN SPECIFICS RENDER PANEL (RIGHT COLUMN DECK) */}
        <div className="hidden lg:block lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          {currentCategory ? renderProductListPanel() : (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">Select a category layout framework card...</div>
          )}
        </div>

      </div>

      {/* MOBILE DRAW SLOT FOR PRODUCTS OVERLAY DISCOVERY LIST */}
      {isMobileDrawerOpen && currentCategory && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl p-6 shadow-2xl z-10 max-h-[75vh] overflow-y-auto border-t border-slate-100">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" onClick={() => setIsMobileDrawerOpen(false)} />
            <h2 className="text-base font-black text-slate-800 tracking-tight mb-4">{currentCategory.name} Products</h2>
            {renderProductListPanel()}
          </div>
        </div>
      )}

      {/* MODAL CORES CREATION SHEET SYSTEM OVERLAY */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFormModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100 animate-slideLeft">
            <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50">
              <span className="font-black text-slate-800 text-sm tracking-tight">{modalMode === 'create' ? 'Create Catalog Category' : 'Modify Catalog Parameters'}</span>
              <button onClick={() => setIsFormModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Category Title Label *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Chef's Specials" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Store Route Link Slug *</label>
                <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g., /chefs-specials" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition font-mono text-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Queue Priority Order</label>
                  <input type="number" required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Default State</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 h-[38px]">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Catalog Descriptive Tags</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 resize-none leading-relaxed" />
              </div>
            </form>

            <div className="h-16 border-t border-slate-100 px-6 flex items-center justify-end gap-3 bg-slate-50/50">
              <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2.5 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" onClick={handleFormSubmit} disabled={submitting} className="bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition inline-flex items-center gap-1.5">
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Update Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADED DELETE SYSTEM MODAL CONTROLS */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !deleting && setIsDeleteModalOpen(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative z-10 space-y-5 animate-scaleUp">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 flex items-center justify-center rounded-xl border border-rose-100"><AlertTriangle className="h-5 w-5 stroke-[2.5]" /></div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 tracking-tight">Remove Catalog Category?</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-1">Sigurado ka bang nais mong permanenteng burahin ang kategoryang <span className="font-extrabold text-slate-700">"{itemToDelete?.name}"</span>?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" disabled={deleting} onClick={() => setIsDeleteModalOpen(false)} className="py-2.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleConfirmDelete} className="py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5">{deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}