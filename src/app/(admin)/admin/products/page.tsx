// 'use client';

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { 
//   Search, Plus, Edit2, Trash2, Loader2, ChefHat, 
//   Soup, UtensilsCrossed, X, Save, AlertTriangle, UploadCloud
// } from 'lucide-react';

// export default function KraveMenuPage() {
//   const [activeTab, setActiveTab] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [categoryList, setCategoryList] = useState<any[]>([]); // Nauna dapat ito
  
//   // MODAL DRAWER MANAGEMENT STATES
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // UPGRADED CUSTOM DELETE MODAL STATES
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
//   const [deleting, setDeleting] = useState(false);

//   // FORM INPUT DATA STATE
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: "Chef's Specials",
//     status: 'IN STOCK',
//     image: ''
//   });

//   // IMAGE FILE PREVIEW STATES
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploadingFile, setUploadingFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // AYOS: Inilagay sa loob ng useMemo pagkatapos ma-declare ang categoryList
//   const tabs = useMemo(() => ["All", ...categoryList.map(c => c.name)], [categoryList]);

//   const categoryCounts = useMemo(() => {
//     const counts: { [key: string]: number } = { All: products.length };
//     categoryList.forEach(cat => {
//       counts[cat.name] = products.filter(p => p.category === cat.name).length;
//     });
//     return counts;
//   }, [products, categoryList]);

//   // ... (Ang natitirang code mo ay tama na, panatilihin mo na lang)
  
//   const fetchKraveMenu = async () => {
//     setLoading(true);
//     const { data: prods } = await supabase.from('products').select('*');
//     const { data: cats } = await supabase.from('categories').select('id, name').eq('status', 'ACTIVE');
    
//     setProducts(prods || []);
//     setCategoryList(cats || []); 
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchKraveMenu();
//   }, []);

//   const filteredProducts = useMemo(() => {
//     return products.filter(product => {
//       const matchesTab = activeTab === 'All' || product.category.toLowerCase() === activeTab.toLowerCase();
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             product.description?.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesTab && matchesSearch;
//     });
//   }, [products, activeTab, searchQuery]);

//   // LIVE IMAGE INTERACTION MANAGER HANDLERS
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadingFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeSelectedImage = () => {
//     setImagePreview(null);
//     setUploadingFile(null);
//     setFormData(prev => ({ ...prev, image: '' }));
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const handleOpenCreateModal = () => {
//     setModalMode('create');
//     setFormData({ name: '', description: '', price: '', category: "Chef's Specials", status: 'IN STOCK', image: '' });
//     setImagePreview(null);
//     setUploadingFile(null);
//     setIsModalOpen(true);
//   };

//   const handleOpenEditModal = (product: any) => {
//     setModalMode('edit');
//     setSelectedProductId(product.id);
//     setFormData({
//       name: product.name,
//       description: product.description || '',
//       price: product.price.toString(),
//       category: product.category,
//       status: product.status,
//       image: product.image_url || ''
//     });
//     setImagePreview(product.image_url || null);
//     setUploadingFile(null);
//     setIsModalOpen(true);
//   };

//   // =======================================================
//   // 💾 CREATE / UPDATE: Submit Handlers Connected to DB
//   // =======================================================
// const handleFormSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!formData.name || !formData.price) return;
//   setSubmitting(true);
  
//   try {
//     let finalImageUrl = formData.image;
//     // ... (Panatilihin ang image upload logic mo dito)
//     // 🔥 AKTIBONG IMAGE UPLOAD STORAGE CORE CONTROLLER
//       if (uploadingFile) {
//         const fileExt = uploadingFile.name.split('.').pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
//         const filePath = `dishes/${fileName}`;

//         // I-upload ang actual binary asset data block sa iyong storage bucket
//         const { error: uploadError } = await supabase.storage
//           .from('menu-dishes') // Siguraduhing may bucket ka sa Supabase na may pangalang 'menu-dishes' at naka-Public
//           .upload(filePath, uploadingFile);

//         if (uploadError) throw uploadError;

//         // Kuhanin ang active string path mapping asset link
//         const { data: { publicUrl } } = supabase.storage
//           .from('menu-dishes')
//           .getPublicUrl(filePath);

//         finalImageUrl = publicUrl;
//       }
    
//     // 1. DITO ANG BRIDGE: Hanapin ang ID base sa piniling category name
//     const { data: catData } = await supabase
//       .from('categories')
//       .select('id')
//       .eq('name', formData.category)
//       .single();

//     // 2. Payload na may tamang category_id
//     const payload = {
//       name: formData.name,
//       description: formData.description || 'No description.',
//       price: parseFloat(formData.price),
//       category: formData.category, // string
//       category_id: catData?.id || null, // UUID (Ito ang nag-uugnay sa dalawa)
//       status: formData.status,
//       image_url: finalImageUrl
//     };

//     if (modalMode === 'create') {
//       const { error } = await supabase.from('products').insert([payload]);
//       if (error) throw error;
//     } else {
//       const { error } = await supabase.from('products').update(payload).eq('id', selectedProductId);
//       if (error) throw error;
//     }

//     setIsModalOpen(false);
//     fetchKraveMenu(); 
//   } catch (err) {
//     console.error("Error saving data:", err);
//   } finally {
//     setSubmitting(false);
//   }
// };

//   const triggerDeleteConfirmation = (id: string, name: string) => {
//     setItemToDelete({ id, name });
//     setIsDeleteModalOpen(true);
//   };

//   // ==========================================
//   // 🗑️ DELETE: Remove Operation Connection
//   // ==========================================
//   const handleConfirmDelete = async () => {
//     if (!itemToDelete) return;
//     setDeleting(true);

//     try {
//       const { error } = await supabase
//         .from('products')
//         .delete()
//         .eq('id', itemToDelete.id);

//       if (error) throw error;

//       setIsDeleteModalOpen(false);
//       setItemToDelete(null);
//       fetchKraveMenu(); // Re-sync frontend values array rows
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete selected item record node.");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // REUSABLE ITEM THUMBNAIL RENDERER ENGINE
//   const renderItemImage = (product: any) => {
//     if (product.image_url) {
//       return (
//         <img 
//           src={product.image_url} 
//           alt={product.name} 
//           className="w-10 h-10 rounded-xl object-cover border border-slate-200/60"
//         />
//       );
//     }
//     return (
//       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
//         {product.category === "Chef's Specials" && <ChefHat className="h-4 w-4 text-[#596643]" />}
//         {product.category === "Vietnamese & Asian" && <Soup className="h-4 w-4 text-emerald-600" />}
//         {product.category === "Appetizers & Dimsum" && <UtensilsCrossed className="h-4 w-4 text-indigo-600" />}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased relative min-h-screen">
      
//       {/* HEADER SECTION */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Menu Listings</h1>
//           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
//             Manage your kitchen dishes, adjust availability states, and configure store item price tiers.
//           </p>
//         </div>
        
//         <button 
//           onClick={handleOpenCreateModal}
//           className="inline-flex items-center justify-center gap-2 bg-[#596643] hover:bg-[#454f34] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition whitespace-nowrap self-start sm:self-auto active:scale-95"
//         >
//           <Plus className="h-4 w-4 stroke-[3]" />
//           Add New Dish
//         </button>
//       </div>

//       {/* FILTER SEARCH DECK ROW */}
//       <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
//         <div className="flex gap-1.5 overflow-x-auto pb-1.5 md:pb-0 max-w-full custom-scrollbar">
//           {tabs.map((tab) => {
//             const count = categoryCounts[tab as keyof typeof categoryCounts] || 0;
//             const isTabActive = activeTab === tab;
//             return (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
//                   isTabActive ? 'bg-slate-100 text-slate-800 shadow-inner' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
//                 }`}
//               >
//                 {tab}
//                 <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
//                   isTabActive ? 'bg-slate-800 text-white' : 'bg-slate-200/60 text-slate-500'
//                 }`}>{count}</span>
//               </button>
//             );
//           })}
//         </div>

//         <div className="relative w-full md:max-w-xs lg:max-w-sm">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search active menu list..."
//             className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition"
//           />
//         </div>
//       </div>

//       {/* CORE PRODUCTS WORKSPACE */}
//       {loading ? (
//         <div className="py-24 text-center text-slate-400 font-medium">
//           <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#596643] mb-2" /> Syncing with Supabase Repository...
//         </div>
//       ) : (
//         <div>
//           {/* A. DESKTOP SYSTEM PLATFORM VIEW */}
//           <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
//                   <th className="py-4 px-6">Product Details</th>
//                   <th className="py-4 px-6 text-center">Price</th>
//                   <th className="py-4 px-6 text-center">Availability</th>
//                   <th className="py-4 px-6 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs">
//                 {filteredProducts.map((product) => (
//                   <tr key={product.id} className="hover:bg-slate-50/40 transition group">
//                     <td className="py-4 px-6 max-w-sm">
//                       <div className="flex items-center gap-4">
//                         {renderItemImage(product)}
//                         <div>
//                           <p className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</p>
//                           <p className="text-slate-400 leading-normal font-medium text-[11px] truncate max-w-xs lg:max-w-md">{product.description}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6 text-center font-black text-slate-900 text-sm">₱{Number(product.price).toFixed(2)}</td>
//                     <td className="py-4 px-6 text-center">
//                       <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
//                         product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
//                       }`}>{product.status}</span>
//                     </td>
//                     <td className="py-4 px-6 text-right font-bold space-x-4">
//                       <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-900 transition">Edit</button>
//                       <button onClick={() => triggerDeleteConfirmation(product.id, product.name)} className="text-rose-500 hover:text-rose-800 transition">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* B. MOBILE STACK LAYOUT */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
//             {filteredProducts.map((product) => (
//               <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
//                 <div className="flex items-start gap-3.5">
//                   {renderItemImage(product)}
//                   <div className="space-y-1 flex-1">
//                     <div className="flex items-center justify-between gap-2">
//                       <h3 className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</h3>
//                       <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
//                         product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
//                       }`}>{product.status}</span>
//                     </div>
//                     <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{product.description}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
//                   <div>
//                     <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Base Price</span>
//                     <span className="font-black text-slate-900 text-sm">₱{Number(product.price).toFixed(2)}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs font-bold">
//                     <button onClick={() => handleOpenEditModal(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl flex items-center gap-1 transition"><Edit2 className="h-3.5 w-3.5" />Edit</button>
//                     <button onClick={() => triggerDeleteConfirmation(product.id, product.name)} className="p-2 text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-xl flex items-center gap-1 transition"><Trash2 className="h-3.5 w-3.5" />Delete</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* =========================================================================
//           SLIDE-OVER MODAL CONSOLE (CREATE & EDIT DRAWER WITH LIVE DB UPLOAD)
//           ========================================================================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !submitting && setIsModalOpen(false)} />
//           <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100">
//             <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
//               <div className="flex items-center gap-2">
//                 <div className="bg-[#596643] text-white p-1.5 rounded-lg">
//                   {modalMode === 'create' ? <Plus className="h-4 w-4 stroke-[3]" /> : <Edit2 className="h-4 w-4" />}
//                 </div>
//                 <div>
//                   <h3 className="font-black text-slate-800 text-sm tracking-tight">
//                     {modalMode === 'create' ? 'Create Menu Entry' : 'Modify Menu Parameters'}
//                   </h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Krave Kitchen Controller</p>
//                 </div>
//               </div>
//               <button onClick={() => !submitting && setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              
//               {/* IMAGE UPLOAD SLOT COMPONENT CONTAINER */}
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Media Display</label>
                
//                 {imagePreview ? (
//                   <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group aspect-video flex items-center justify-center">
//                     <img 
//                       src={imagePreview} 
//                       alt="Preview" 
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-xs">
//                       <button
//                         type="button"
//                         disabled={submitting}
//                         onClick={removeSelectedImage}
//                         className="bg-white/90 hover:bg-white text-rose-600 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-sm disabled:opacity-50"
//                       >
//                         <Trash2 className="h-3.5 w-3.5" /> Remove Image
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     onClick={() => !submitting && fileInputRef.current?.click()}
//                     className="border-2 border-dashed border-slate-200 hover:border-[#596643] rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition group flex flex-col items-center justify-center gap-2"
//                   >
//                     <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 group-hover:text-[#596643] group-hover:border-[#596643]/30 transition shadow-xs">
//                       <UploadCloud className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="text-xs font-bold text-slate-700">Click to upload recipe display photo</p>
//                       <p className="text-[10px] text-slate-400 font-medium mt-0.5">Supports PNG, JPG, or WEBP up to 5MB</p>
//                     </div>
//                   </div>
//                 )}
                
//                 <input 
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                   disabled={submitting}
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Name *</label>
//                 <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Kare Kare Bagnet" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category Channel</label>
//                 <select 
//                   value={formData.category} 
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
//                   className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#596643] text-slate-700"
//                 >
//                   {categoryList.map((cat) => (
//                     <option key={cat.id} value={cat.name}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Selling Price (PHP) *</label>
//                 <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#596643] focus:bg-white transition font-mono text-slate-800" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Kitchen Stock Status</label>
//                 <div className="flex gap-2">
//                   {['IN STOCK', 'SOLD OUT'].map((statusOption) => (
//                     <button key={statusOption} type="button" onClick={() => setFormData({ ...formData, status: statusOption })} className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider transition ${formData.status === statusOption ? statusOption === 'IN STOCK' ? 'bg-[#596643] text-white shadow-sm' : 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200/60'}`}>{statusOption}</button>
//                   ))}
//                 </div>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description / Recipe Notes</label>
//                 <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe recipe guidelines..." className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition resize-none leading-relaxed" />
//               </div>
//             </form>

//             <div className="h-16 border-t border-slate-100 px-6 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
//               <button type="button" disabled={submitting} onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition">Cancel</button>
//               <button type="submit" onClick={handleFormSubmit} disabled={submitting || !formData.name || !formData.price} className="inline-flex items-center gap-1.5 bg-[#596643] hover:bg-[#454f34] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition">
//                 {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
//                 {modalMode === 'create' ? 'Save Product' : 'Update Product'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden antialiased">
//           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => !deleting && setIsDeleteModalOpen(false)} />
//           <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 p-6 space-y-6 text-center animate-scaleUp">
//             <div className="mx-auto w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl">
//               <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
//             </div>
//             <div className="space-y-2">
//               <h3 className="text-base font-black text-slate-800 tracking-tight">Remove Dish from Menu?</h3>
//               <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
//                 Sigurado ka bang nais mong permanenteng burahin ang <span className="font-extrabold text-slate-700">"{itemToDelete?.name}"</span>? Ang aksyon na ito ay hindi na maaaring bawiin.
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-3 pt-2">
//               <button type="button" disabled={deleting} onClick={() => setIsDeleteModalOpen(false)} className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition disabled:opacity-50">No, Keep It</button>
//               <button type="button" disabled={deleting} onClick={handleConfirmDelete} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/10 transition inline-flex items-center justify-center gap-1.5 disabled:opacity-50">
//                 {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// update 2.0
// 'use client';

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { 
//   Search, Plus, Edit2, Trash2, Loader2, ChefHat, 
//   Soup, UtensilsCrossed, X, Save, AlertTriangle, UploadCloud
// } from 'lucide-react';

// export default function KraveMenuPage() {
//   const [activeTab, setActiveTab] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [categoryList, setCategoryList] = useState<any[]>([]);
  
//   // MODAL DRAWER MANAGEMENT STATES
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // UPGRADED CUSTOM DELETE MODAL STATES
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
//   const [deleting, setDeleting] = useState(false);

//   // FORM INPUT DATA STATE
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: "Chef's Specials",
//     status: 'IN STOCK',
//     image: ''
//   });

//   // IMAGE FILE PREVIEW STATES
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploadingFile, setUploadingFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Dynamic values grouping based on categoryList sequence mapping parameters
//   const tabs = useMemo(() => ["All", ...categoryList.map(c => c.name)], [categoryList]);

//   const categoryCounts = useMemo(() => {
//     const counts: { [key: string]: number } = { All: products.length };
//     categoryList.forEach(cat => {
//       counts[cat.name] = products.filter(p => p.category === cat.name).length;
//     });
//     return counts;
//   }, [products, categoryList]);
  
//   const fetchKraveMenu = async () => {
//     try {
//       setLoading(true);
//       const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
//       const { data: cats } = await supabase.from('categories').select('id, name').eq('status', 'ACTIVE');
      
//       setProducts(prods || []);
//       setCategoryList(cats || []); 
//     } catch (err) {
//       console.error("Live configuration sync pipeline failure:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchKraveMenu();
//   }, []);

//   const filteredProducts = useMemo(() => {
//     return products.filter(product => {
//       const matchesTab = activeTab === 'All' || product.category?.toLowerCase() === activeTab.toLowerCase();
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             product.description?.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesTab && matchesSearch;
//     });
//   }, [products, activeTab, searchQuery]);

//   // LIVE IMAGE INTERACTION MANAGER HANDLERS
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadingFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeSelectedImage = () => {
//     setImagePreview(null);
//     setUploadingFile(null);
//     setFormData(prev => ({ ...prev, image: '' }));
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const handleOpenCreateModal = () => {
//     setModalMode('create');
//     setFormData({ 
//       name: '', 
//       description: '', 
//       price: '', 
//       category: categoryList[0]?.name || "Chef's Specials", 
//       status: 'IN STOCK', 
//       image: '' 
//     });
//     setImagePreview(null);
//     setUploadingFile(null);
//     setIsModalOpen(true);
//   };

//   const handleOpenEditModal = (product: any) => {
//     setModalMode('edit');
//     setSelectedProductId(product.id);
//     setFormData({
//       name: product.name,
//       description: product.description || '',
//       price: product.price.toString(),
//       category: product.category,
//       status: product.status,
//       image: product.image_url || ''
//     });
//     setImagePreview(product.image_url || null);
//     setUploadingFile(null);
//     setIsModalOpen(true);
//   };

//   // =======================================================
//   // 💾 CREATE / UPDATE: Submit Handlers Connected to DB
//   // =======================================================
//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name || !formData.price) return;
//     setSubmitting(true);
    
//     try {
//       let finalImageUrl = formData.image;
      
//       // 🔥 AKTIBONG IMAGE UPLOAD STORAGE CORE CONTROLLER
//       if (uploadingFile) {
//         const fileExt = uploadingFile.name.split('.').pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
//         const filePath = `dishes/${fileName}`;

//         // A. KUNG NAKA-EDIT MODE AT MAY LUMANG LARAWAN, BURAHIN MUNA ITO SA STORAGE
//         if (modalMode === 'edit' && formData.image) {
//           try {
//             // Hatiin ang mahabang URL para makuha ang file path block ('dishes/filename.ext')
//             const bucketFolderKeyword = 'menu-dishes/';
//             if (formData.image.includes(bucketFolderKeyword)) {
//               const oldFilePath = formData.image.split(bucketFolderKeyword)[1];
              
//               if (oldFilePath) {
//                 // Utusan ang Supabase na burahin ang lumang file para walang natatambak
//                 await supabase.storage
//                   .from('menu-dishes')
//                   .remove([oldFilePath]);
                
//                 console.log("Successfully deleted old storage asset file:", oldFilePath);
//               }
//             }
//           } catch (storageDelErr) {
//             // Lalampas lang ito para hindi mag-crash ang app kung sakaling manual na nabura na pala sa dashboard ang file dati
//             console.error("Non-blocking storage clean up notice:", storageDelErr);
//           }
//         }

//         // B. I-upload ang bagong larawan sa iyong storage bucket gaya ng dati
//         const { error: uploadError } = await supabase.storage
//           .from('menu-dishes')
//           .upload(filePath, uploadingFile);

//         if (uploadError) throw uploadError;

//         // Kuhanin ang active string path mapping asset link
//         const { data: { publicUrl } } = supabase.storage
//           .from('menu-dishes')
//           .getPublicUrl(filePath);

//         finalImageUrl = publicUrl;
//       }
      
//       // 1. DITO ANG BRIDGE: Hanapin ang ID base sa piniling category name
//       const { data: catData } = await supabase
//         .from('categories')
//         .select('id')
//         .eq('name', formData.category)
//         .single();

//       // 2. Payload na may tamang category_id at valid computed image_url text block string
//       const payload = {
//         name: formData.name,
//         description: formData.description || 'No description.',
//         price: parseFloat(formData.price),
//         category: formData.category, 
//         category_id: catData?.id || null, 
//         status: formData.status,
//         image_url: finalImageUrl
//       };

//       if (modalMode === 'create') {
//         const { error } = await supabase.from('products').insert([payload]);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from('products').update(payload).eq('id', selectedProductId);
//         if (error) throw error;
//       }

//       setIsModalOpen(false);
//       fetchKraveMenu(); 
//     } catch (err) {
//       console.error("Error saving data:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const triggerDeleteConfirmation = (id: string, name: string) => {
//     setItemToDelete({ id, name });
//     setIsDeleteModalOpen(true);
//   };

//   // ==========================================
//   // 🗑️ DELETE: Remove Operation Connection
//   // ==========================================
//   const handleConfirmDelete = async () => {
//     if (!itemToDelete) return;
//     setDeleting(true);

//     try {
//       // 1. HANAPIN MUNA ANG IMAGE URL NG DISH BAGO ITO BURAHIN SA DATABASE
//       const { data: currentProduct } = await supabase
//         .from('products')
//         .select('image_url')
//         .eq('id', itemToDelete.id)
//         .single();

//       // 2. KUNG MAY LARAWAN, BURAHIN DIN SA STORAGE BUCKET
//       if (currentProduct?.image_url) {
//         const bucketFolderKeyword = 'menu-dishes/';
//         if (currentProduct.image_url.includes(bucketFolderKeyword)) {
//           const filePathInStorage = currentProduct.image_url.split(bucketFolderKeyword)[1];
//           if (filePathInStorage) {
//             await supabase.storage.from('menu-dishes').remove([filePathInStorage]);
//           }
//         }
//       }

//       // 3. BURAHIN ANG ROW SA DATABASE TABLE
//       const { error } = await supabase
//         .from('products')
//         .delete()
//         .eq('id', itemToDelete.id);

//       if (error) throw error;

//       setIsDeleteModalOpen(false);
//       setItemToDelete(null);
//       fetchKraveMenu(); 
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete selected item record node.");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // REUSABLE ITEM THUMBNAIL RENDERER ENGINE
//   const renderItemImage = (product: any) => {
//     if (product.image_url) {
//       return (
//         <img 
//           src={product.image_url} 
//           alt={product.name} 
//           className="w-10 h-10 rounded-xl object-cover border border-slate-200/60 shrink-0"
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = 'https://placehold.co/100x100';
//           }}
//         />
//       );
//     }
//     return (
//       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
//         {product.category === "Chef's Specials" && <ChefHat className="h-4 w-4 text-[#596643]" />}
//         {product.category === "Vietnamese & Asian" && <Soup className="h-4 w-4 text-emerald-600" />}
//         {product.category === "Appetizers & Dimsum" && <UtensilsCrossed className="h-4 w-4 text-indigo-600" />}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased relative min-h-screen">
      
//       {/* HEADER SECTION */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Menu Listings</h1>
//           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
//             Manage your kitchen dishes, adjust availability states, and configure store item price tiers.
//           </p>
//         </div>
        
//         <button 
//           onClick={handleOpenCreateModal}
//           className="inline-flex items-center justify-center gap-2 bg-[#596643] hover:bg-[#454f34] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition whitespace-nowrap self-start sm:self-auto active:scale-95"
//         >
//           <Plus className="h-4 w-4 stroke-[3]" />
//           Add New Dish
//         </button>
//       </div>

//       {/* FILTER SEARCH DECK ROW */}
//       <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
//         <div className="flex gap-1.5 overflow-x-auto pb-1.5 md:pb-0 max-w-full custom-scrollbar">
//           {tabs.map((tab) => {
//             const count = categoryCounts[tab as keyof typeof categoryCounts] || 0;
//             const isTabActive = activeTab === tab;
//             return (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
//                   isTabActive ? 'bg-slate-100 text-slate-800 shadow-inner' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
//                 }`}
//               >
//                 {tab}
//                 <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
//                   isTabActive ? 'bg-slate-800 text-white' : 'bg-slate-200/60 text-slate-500'
//                 }`}>{count}</span>
//               </button>
//             );
//           })}
//         </div>

//         <div className="relative w-full md:max-w-xs lg:max-w-sm">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search active menu list..."
//             className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition"
//           />
//         </div>
//       </div>

//       {/* CORE PRODUCTS WORKSPACE */}
//       {loading ? (
//         <div className="py-24 text-center text-slate-400 font-medium">
//           <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#596643] mb-2" /> Syncing with Supabase Repository...
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white">
//           <p className="text-sm font-medium text-slate-400 italic">No food dishes found inside the database engine parameters.</p>
//         </div>
//       ) : (
//         <div>
//           {/* A. DESKTOP SYSTEM PLATFORM VIEW */}
//           <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
//                   <th className="py-4 px-6">Product Details</th>
//                   <th className="py-4 px-6 text-center">Price</th>
//                   <th className="py-4 px-6 text-center">Availability</th>
//                   <th className="py-4 px-6 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs">
//                 {filteredProducts.map((product) => (
//                   <tr key={product.id} className="hover:bg-slate-50/40 transition group">
//                     <td className="py-4 px-6 max-w-sm">
//                       <div className="flex items-center gap-4">
//                         {renderItemImage(product)}
//                         <div>
//                           <p className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</p>
//                           <p className="text-slate-400 leading-normal font-medium text-[11px] truncate max-w-xs lg:max-w-md">{product.description}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6 text-center font-black text-slate-900 text-sm">₱{Number(product.price).toFixed(2)}</td>
//                     <td className="py-4 px-6 text-center">
//                       <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
//                         product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
//                       }`}>{product.status}</span>
//                     </td>
//                     <td className="py-4 px-6 text-right font-bold space-x-4">
//                       <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-900 transition">Edit</button>
//                       <button onClick={() => triggerDeleteConfirmation(product.id, product.name)} className="text-rose-500 hover:text-rose-800 transition">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* B. MOBILE STACK LAYOUT */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
//             {filteredProducts.map((product) => (
//               <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
//                 <div className="flex items-start gap-3.5">
//                   {renderItemImage(product)}
//                   <div className="space-y-1 flex-1">
//                     <div className="flex items-center justify-between gap-2">
//                       <h3 className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</h3>
//                       <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
//                         product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
//                       }`}>{product.status}</span>
//                     </div>
//                     <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{product.description}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
//                   <div>
//                     <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Base Price</span>
//                     <span className="font-black text-slate-900 text-sm">₱{Number(product.price).toFixed(2)}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs font-bold">
//                     <button onClick={() => handleOpenEditModal(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl flex items-center gap-1 transition"><Edit2 className="h-3.5 w-3.5" />Edit</button>
//                     <button onClick={() => triggerDeleteConfirmation(product.id, product.name)} className="p-2 text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-xl flex items-center gap-1 transition"><Trash2 className="h-3.5 w-3.5" />Delete</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* =========================================================================
//           SLIDE-OVER MODAL CONSOLE (CREATE & EDIT DRAWER WITH LIVE DB UPLOAD)
//           ========================================================================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !submitting && setIsModalOpen(false)} />
//           <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100">
//             <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
//               <div className="flex items-center gap-2">
//                 <div className="bg-[#596643] text-white p-1.5 rounded-lg">
//                   {modalMode === 'create' ? <Plus className="h-4 w-4 stroke-[3]" /> : <Edit2 className="h-4 w-4" />}
//                 </div>
//                 <div>
//                   <h3 className="font-black text-slate-800 text-sm tracking-tight">
//                     {modalMode === 'create' ? 'Create Menu Entry' : 'Modify Menu Parameters'}
//                   </h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Krave Kitchen Controller</p>
//                 </div>
//               </div>
//               <button onClick={() => !submitting && setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              
//               {/* IMAGE UPLOAD SLOT COMPONENT CONTAINER */}
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Media Display</label>
                
//                 {imagePreview ? (
//                   <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group aspect-video flex items-center justify-center">
//                     <img 
//                       src={imagePreview} 
//                       alt="Preview" 
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-xs">
//                       <button
//                         type="button"
//                         disabled={submitting}
//                         onClick={removeSelectedImage}
//                         className="bg-white/90 hover:bg-white text-rose-600 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-sm disabled:opacity-50"
//                       >
//                         <Trash2 className="h-3.5 w-3.5" /> Remove Image
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     onClick={() => !submitting && fileInputRef.current?.click()}
//                     className="border-2 border-dashed border-slate-200 hover:border-[#596643] rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition group flex flex-col items-center justify-center gap-2"
//                   >
//                     <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 group-hover:text-[#596643] group-hover:border-[#596643]/30 transition shadow-xs">
//                       <UploadCloud className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="text-xs font-bold text-slate-700">Click to upload recipe display photo</p>
//                       <p className="text-[10px] text-slate-400 font-medium mt-0.5">Supports PNG, JPG, or WEBP up to 5MB</p>
//                     </div>
//                   </div>
//                 )}
                
//                 <input 
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                   disabled={submitting}
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Name *</label>
//                 <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Kare Kare Bagnet" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category Channel</label>
//                 <select 
//                   value={formData.category} 
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
//                   className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#596643] text-slate-700"
//                 >
//                   {categoryList.map((cat) => (
//                     <option key={cat.id} value={cat.name}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Selling Price (PHP) *</label>
//                 <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#596643] focus:bg-white transition font-mono text-slate-800" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Kitchen Stock Status</label>
//                 <div className="flex gap-2">
//                   {['IN STOCK', 'SOLD OUT'].map((statusOption) => (
//                     <button key={statusOption} type="button" onClick={() => setFormData({ ...formData, status: statusOption })} className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider transition ${formData.status === statusOption ? statusOption === 'IN STOCK' ? 'bg-[#596643] text-white shadow-sm' : 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200/60'}`}>{statusOption}</button>
//                   ))}
//                 </div>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description / Recipe Notes</label>
//                 <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe recipe guidelines..." className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition resize-none leading-relaxed" />
//               </div>
//             </form>

//             <div className="h-16 border-t border-slate-100 px-6 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
//               <button type="button" disabled={submitting} onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition">Cancel</button>
//               <button type="submit" onClick={handleFormSubmit} disabled={submitting || !formData.name || !formData.price} className="inline-flex items-center gap-1.5 bg-[#596643] hover:bg-[#454f34] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition">
//                 {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
//                 {modalMode === 'create' ? 'Save Product' : 'Update Product'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden antialiased">
//           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => !deleting && setIsDeleteModalOpen(false)} />
//           <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 p-6 space-y-6 text-center animate-scaleUp">
//             <div className="mx-auto w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl">
//               <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
//             </div>
//             <div className="space-y-2">
//               <h3 className="text-base font-black text-slate-800 tracking-tight">Remove Dish from Menu?</h3>
//               <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
//                 Sigurado ka bang nais mong permanenteng burahin ang <span className="font-extrabold text-slate-700">"{itemToDelete?.name}"</span>? Ang aksyon na ito ay hindi na maaaring bawiin.
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-3 pt-2">
//               <button type="button" disabled={deleting} onClick={() => setIsDeleteModalOpen(false)} className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition disabled:opacity-50">No, Keep It</button>
//               <button type="button" disabled={deleting} onClick={handleConfirmDelete} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/10 transition inline-flex items-center justify-center gap-1.5 disabled:opacity-50">
//                 {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// update 3.0
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Search, Plus, Edit2, Trash2, Loader2, X, Save, AlertTriangle, UploadCloud, Layers
} from 'lucide-react';

export default function KraveMenuPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: "Chef's Specials",
    menu_heading: '', 
    status: 'IN STOCK',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👑 IN-UPGRADE: Dahil naka-sort na ang categoryList sa fetch, automatic nang naka-Priority #1 to down ang mga tabs
  const tabs = useMemo(() => ["All", ...categoryList.map(c => c.name)], [categoryList]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { All: products.length };
    categoryList.forEach(cat => {
      counts[cat.name] = products.filter(p => p.category === cat.name).length;
    });
    return counts;
  }, [products, categoryList]);
  
  const fetchKraveMenu = async () => {
    try {
      setLoading(true);
      const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      
      // 👑 IN-UPGRADE: Idinagdag ang `.order('priority', { ascending: true })` para naka-ayos mula Priority #1 pababa
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name, priority')
        .eq('status', 'ACTIVE')
        .order('priority', { ascending: true });
      
      setProducts(prods || []);
      setCategoryList(cats || []); 
    } catch (err) {
      console.error("Live configuration sync pipeline failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKraveMenu();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesTab = activeTab === 'All' || product.category?.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.menu_heading?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setImagePreview(null);
    setUploadingFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      category: categoryList[0]?.name || "Chef's Specials", 
      menu_heading: '',
      status: 'IN STOCK', 
      image: '' 
    });
    setImagePreview(null);
    setUploadingFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setModalMode('edit');
    setSelectedProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      category: product.category,
      menu_heading: product.menu_heading || '',
      status: product.status,
      image: product.image_url || ''
    });
    setImagePreview(product.image_url || null);
    setUploadingFile(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    setSubmitting(true);
    
    try {
      let finalImageUrl = formData.image;
      
      if (uploadingFile) {
        const fileExt = uploadingFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `dishes/${fileName}`;

        if (modalMode === 'edit' && formData.image) {
          try {
            const bucketFolderKeyword = 'menu-dishes/';
            if (formData.image.includes(bucketFolderKeyword)) {
              const oldFilePath = formData.image.split(bucketFolderKeyword)[1];
              if (oldFilePath) {
                await supabase.storage.from('menu-dishes').remove([oldFilePath]);
              }
            }
          } catch (storageDelErr) {
            console.error("Non-blocking storage clean up notice:", storageDelErr);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('menu-dishes')
          .upload(filePath, uploadingFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('menu-dishes')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }
      
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', formData.category)
        .single();

      const payload = {
        name: formData.name,
        description: formData.description || 'No description.',
        price: parseFloat(formData.price),
        category: formData.category, 
        category_id: catData?.id || null, 
        menu_heading: formData.menu_heading.trim() || null,
        status: formData.status,
        image_url: finalImageUrl || null
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', selectedProductId);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchKraveMenu(); 
    } catch (err) {
      console.error("Error saving data:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirmation = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);

    try {
      const { data: currentProduct } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', itemToDelete.id)
        .single();

      if (currentProduct?.image_url) {
        const bucketFolderKeyword = 'menu-dishes/';
        if (currentProduct.image_url.includes(bucketFolderKeyword)) {
          const filePathInStorage = currentProduct.image_url.split(bucketFolderKeyword)[1];
          if (filePathInStorage) {
            await supabase.storage.from('menu-dishes').remove([filePathInStorage]);
          }
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchKraveMenu(); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected item record node.");
    } finally {
      setDeleting(false);
    }
  };

  const renderItemImage = (product: any) => {
    const KRAVE_LOGO_PATH = '/logo.jpg';

    if (product.image_url) {
      return (
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-10 h-10 rounded-xl object-cover border border-slate-200/60 shrink-0 bg-white"
          onError={(e) => {
            (e.target as HTMLImageElement).src = KRAVE_LOGO_PATH;
          }}
        />
      );
    }

    return (
      <img 
        src={KRAVE_LOGO_PATH} 
        alt="Krave Kitchen" 
        className="w-10 h-10 rounded-xl object-cover border border-slate-200/60 shrink-0 bg-white" 
      />
    );
  };

  return (
    <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased relative min-h-screen bg-[#f8fafc] p-4 md:p-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Menu Listings</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Manage your kitchen dishes, adjust availability states, and configure store item price tiers.
          </p>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-[#596643] hover:bg-[#454f34] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition whitespace-nowrap self-start sm:self-auto active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add New Dish
        </button>
      </div>

      {/* FILTER SEARCH DECK ROW WITH DESKTOP SLIDER ARROWS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm select-none">
        
        {/* Left Column: Carousel Wrapper */}
        <div className="relative flex-1 max-w-full md:max-w-[60%] lg:max-w-[64%] flex items-center group">
          
          {/* LEFT NAV ARROW */}
          <button
            type="button"
            onClick={() => {
              const container = document.getElementById('krave-categories-deck');
              if (container) container.scrollBy({ left: -240, behavior: 'smooth' });
            }}
            className="hidden md:flex absolute -left-2 z-10 items-center justify-center h-8 w-8 rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition active:scale-90"
            title="Scroll Left"
          >
            <span className="text-sm font-black">←</span>
          </button>

          {/* Scrollable Tabs Engine */}
          <div 
            id="krave-categories-deck"
            className="flex gap-2 overflow-x-auto pb-2 md:pb-0 px-0 md:px-8 max-w-full scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => {
              const count = categoryCounts[tab as keyof typeof categoryCounts] || 0;
              const isTabActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap border ${
                    isTabActive 
                      ? 'bg-[#596643] text-white border-[#596643] shadow-sm' 
                      : 'text-slate-500 bg-slate-50 border-slate-200/70 hover:text-slate-800 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  {tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black transition-colors ${
                    isTabActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT NAV ARROW */}
          <button
            type="button"
            onClick={() => {
              const container = document.getElementById('krave-categories-deck');
              if (container) container.scrollBy({ left: 240, behavior: 'smooth' });
            }}
            className="hidden md:flex absolute -right-2 z-10 items-center justify-center h-8 w-8 rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition active:scale-90"
            title="Scroll Right"
          >
            <span className="text-sm font-black">→</span>
          </button>
        </div>

        {/* Right Column: Search Input Area */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active menu list..."
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:ring-2 focus:ring-[#596643]/10 focus:bg-white transition"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-3 w-3 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* CORE PRODUCTS WORKSPACE */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 font-medium">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#596643] mb-2" /> Syncing with Supabase Repository...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white">
          <p className="text-sm font-medium text-slate-400 italic">No food dishes found inside the database engine parameters.</p>
        </div>
      ) : (
        <div>
          {/* DESKTOP VIEW */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6 text-center">Section / Subtitle</th>
                  <th className="py-4 px-6 text-center">Price</th>
                  <th className="py-4 px-6 text-center">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 transition group">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-4">
                        {renderItemImage(product)}
                        <div>
                          <p className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</p>
                          <p className="text-slate-400 leading-normal font-medium text-[11px] truncate max-w-xs lg:max-w-md">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {product.menu_heading ? (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-md text-[10px]">
                          <Layers className="w-3 h-3" /> {product.menu_heading}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px] italic">Main list</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center font-black text-slate-900 text-sm">
                      ₱{product.price ? Number(product.price).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                      }`}>{product.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold space-x-4">
                      <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-900 transition">Edit</button>
                      <button onClick={() => triggerDeleteConfirmation(product.id, product.name)} className="text-rose-500 hover:text-rose-800 transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {renderItemImage(product)}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</h3>
                      <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
                        product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                      }`}>{product.status}</span>
                    </div>
                    {product.menu_heading && (
                      <p className="text-[10px] text-slate-500 font-bold bg-slate-50 px-1.5 py-0.5 rounded inline-block">
                        📍 {product.menu_heading}
                      </p>
                    )}
                    <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{product.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Base Price</span>
                    <span className="font-black text-slate-900 text-sm">₱{product.price ? Number(product.price).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <button onClick={() => handleOpenEditModal(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl flex items-center gap-1 transition"><Edit2 className="h-3.5 w-3.5" />Edit</button>
                    <button onClick={() => triggerDeleteConfirmation(product.id, product.name)} className="p-2 text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-xl flex items-center gap-1 transition"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CONSOLE INSERTS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !submitting && setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100">
            <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-[#596643] text-white p-1.5 rounded-lg">
                  {modalMode === 'create' ? <Plus className="h-4 w-4 stroke-[3]" /> : <Edit2 className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm tracking-tight">
                    {modalMode === 'create' ? 'Create Menu Entry' : 'Modify Menu Parameters'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Krave Kitchen Controller</p>
                </div>
              </div>
              <button onClick={() => !submitting && setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              
              {/* IMAGE UPLOAD COMPONENT */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Media Display</label>
                {imagePreview ? (
                  <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group aspect-video flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-xs">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={removeSelectedImage}
                        className="bg-white/90 hover:bg-white text-rose-600 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-sm disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => !submitting && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-[#596643] rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition group flex flex-col items-center justify-center gap-2"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 group-hover:text-[#596643] group-hover:border-[#596643]/30 transition shadow-xs">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to upload recipe display photo</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Supports PNG, JPG, or WEBP up to 5MB</p>
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" disabled={submitting} />
              </div>

              {/* PRODUCT NAME INPUT */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Kare Kare Bagnet" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition" />
              </div>

              {/* MAIN CATEGORY SELECT */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category Channel</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#596643] text-slate-700"
                >
                  {categoryList.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* MENU HEADING FIELD CONSOLE */}
              <div className="space-y-1.5 bg-slate-50 border border-dashed border-slate-200 p-3.5 rounded-xl">
                <label className="text-[11px] font-black text-[#596643] uppercase tracking-wider block">
                  Menu Subtitle Heading (Opsyonal)
                </label>
                <input 
                  type="text" 
                  value={formData.menu_heading} 
                  onChange={(e) => setFormData({ ...formData, menu_heading: e.target.value })} 
                  placeholder="Halimbawa: Sticky Rice Specials, Classic Favorites" 
                  className="w-full bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] transition shadow-xs" 
                />
                <p className="text-[9px] text-slate-400 font-medium">
                  Iwanang blanko kung walang sub-heading na kailangan para sa putaheng ito sa loob ng menu card.
                </p>
              </div>

              {/* SELLING PRICE */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Selling Price (PHP) *</label>
                <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#596643] focus:bg-white transition font-mono text-slate-800" />
              </div>

              {/* AVAILABILITY STATUS BUTTONS */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Kitchen Stock Status</label>
                <div className="flex gap-2">
                  {['IN STOCK', 'SOLD OUT'].map((statusOption) => (
                    <button key={statusOption} type="button" onClick={() => setFormData({ ...formData, status: statusOption })} className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider transition ${formData.status === statusOption ? statusOption === 'IN STOCK' ? 'bg-[#596643] text-white shadow-sm' : 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200/60'}`}>{statusOption}</button>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION REVIEWS */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description / Recipe Notes</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe recipe guidelines..." className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#596643] focus:bg-white transition resize-none leading-relaxed" />
              </div>
            </form>

            <div className="h-16 border-t border-slate-100 px-6 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
              <button type="button" disabled={submitting} onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition">Cancel</button>
              <button type="submit" onClick={handleFormSubmit} disabled={submitting || !formData.name || !formData.price} className="inline-flex items-center gap-1.5 bg-[#596643] hover:bg-[#454f34] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition">
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {modalMode === 'create' ? 'Save Product' : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE DIALOG MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden antialiased">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => !deleting && setIsDeleteModalOpen(false)} />
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 p-6 space-y-6 text-center">
            <div className="mx-auto w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl">
              <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 tracking-tight">Remove Dish from Menu?</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Sigurado ka bang nais mong permanenteng burahin ang <span className="font-extrabold text-slate-700">"{itemToDelete?.name}"</span>? Ang aksyon na ito ay hindi na maaaring bawiin.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" disabled={deleting} onClick={() => setIsDeleteModalOpen(false)} className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition">No, Keep It</button>
              <button type="button" disabled={deleting} onClick={handleConfirmDelete} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg transition inline-flex items-center justify-center gap-1.5">
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}