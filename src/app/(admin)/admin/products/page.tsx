// // 'use client';

// // import React, { useState, useMemo } from 'react';

// // // --- TYPE DEFINITIONS ---
// // interface Product {
// //   id: string;
// //   name: string;
// //   description: string;
// //   category: 'Mains' | 'Sides' | 'Drinks' | 'Desserts';
// //   price: number;
// //   status: 'In Stock' | 'Low Stock' | 'Sold Out';
// //   emoji: string;
// // }

// // const INITIAL_PRODUCTS: Product[] = [
// //   { id: 'PROD-001', name: 'Sizzling Pork Sisig', description: 'Traditional hot skillet pork hash.', category: 'Mains', price: 220, status: 'In Stock', emoji: '🍳' },
// // ];

// // export default function ProductsPage() {
// //   const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [activeCategory, setActiveCategory] = useState<'All' | 'Mains' | 'Sides' | 'Drinks' | 'Desserts'>('All');

// //   const filteredProducts = useMemo(() => {
// //     return products.filter((prod) => {
// //       const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
// //       const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
// //       return matchesCategory && matchesSearch;
// //     });
// //   }, [products, activeCategory, searchQuery]);

// //   return (
// //     <main className="p-6 space-y-6 animate-fadeIn">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Menu Listings</h2>
// //           <p className="text-xs text-slate-400 mt-0.5">Edit store dishes, adjust real-time stock levels, and customize descriptions.</p>
// //         </div>
// //         <button className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
// //           + Add New Dish
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
// //         <table className="w-full text-left border-collapse">
// //           <thead>
// //             <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-450 uppercase tracking-widest">
// //               <th className="py-4 px-6">Product Details</th>
// //               <th className="py-4 px-4">Price</th>
// //               <th className="py-4 px-4">Status</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-slate-50">
// //             {filteredProducts.map((p) => (
// //               <tr key={p.id}>
// //                 <td className="py-4 px-6 flex items-center space-x-3">
// //                   <span className="text-2xl">{p.emoji}</span>
// //                   <span className="text-xs font-bold text-slate-950">{p.name}</span>
// //                 </td>
// //                 <td className="py-4 px-4 text-xs font-bold">₱{p.price.toFixed(2)}</td>
// //                 <td className="py-4 px-4 text-xs font-bold text-emerald-600">{p.status}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </main>
// //   );
// // }

// // src/app/(admin)/admin/products/page.tsx
// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { supabase } from '@/utils/supabase/client';

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   category: 'Mains' | 'Sides' | 'Drinks' | 'Desserts';
//   price: number;
//   status: 'In Stock' | 'Low Stock' | 'Sold Out';
//   emoji: string;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState<'All' | 'Mains' | 'Sides' | 'Drinks' | 'Desserts'>('All');
  
//   // Dialog sheets at toast controllers
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [toastMessage, setToastMessage] = useState<string | null>(null);

//   // Form Field State Controllers
//   const [formName, setFormName] = useState('');
//   const [formPrice, setFormPrice] = useState<number>(100);
//   const [formCategory, setFormCategory] = useState<Product['category']>('Mains');
//   const [formDesc, setFormDesc] = useState('');
//   const [formEmoji, setFormEmoji] = useState('🍲');
//   const [saving, setSaving] = useState(false);

//   const triggerToast = (msg: string) => {
//     setToastMessage(msg);
//     setTimeout(() => setToastMessage(null), 4000);
//   };

//   // FETCH REALTIME DATA FROM SUPABASE SQL TABLES
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('products')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       if (data) setProducts(data as Product[]);
//     } catch (err: any) {
//       triggerToast(`Sync Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();

//     // Supabase Realtime Listener Engine Setup
//     const channel = supabase
//       .channel('realtime-products')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
//         fetchProducts();
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const openAddModal = () => {
//     setEditingProduct(null);
//     setFormName('');
//     setFormPrice(100);
//     setFormCategory('Mains');
//     setFormDesc('');
//     setFormEmoji('🍲');
//     setIsModalOpen(true);
//   };

//   const openEditModal = (p: Product) => {
//     setEditingProduct(p);
//     setFormName(p.name);
//     setFormPrice(p.price);
//     setFormCategory(p.category);
//     setFormDesc(p.description);
//     setFormEmoji(p.emoji || '🍲');
//     setIsModalOpen(true);
//   };

//   const handleSaveProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       if (editingProduct) {
//         const { error } = await supabase
//           .from('products')
//           .update({
//             name: formName,
//             price: formPrice,
//             category: formCategory,
//             description: formDesc,
//             emoji: formEmoji,
//           })
//           .eq('id', editingProduct.id);

//         if (error) throw error;
//         triggerToast(`Successfully modified item: ${formName}`);
//       } else {
//         const { error } = await supabase
//           .from('products')
//           .insert([{
//             name: formName,
//             price: formPrice,
//             category: formCategory,
//             description: formDesc,
//             emoji: formEmoji,
//             status: 'In Stock',
//           }]);

//         if (error) throw error;
//         triggerToast(`Successfully created dish option: ${formName}`);
//       }
//       setIsModalOpen(false);
//     } catch (err: any) {
//       triggerToast(`Database Error: ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const toggleStockStatus = async (id: string, currentStatus: Product['status']) => {
//     const nextStatus: Product['status'] = currentStatus === 'In Stock' ? 'Sold Out' : 'In Stock';
//     try {
//       const { error } = await supabase
//         .from('products')
//         .update({ status: nextStatus })
//         .eq('id', id);

//       if (error) throw error;
//       triggerToast(`Dish availability is now ${nextStatus}`);
//     } catch (err: any) {
//       triggerToast(`Error modifying stock: ${err.message}`);
//     }
//   };

//   const deleteProduct = async (id: string, name: string) => {
//     if (!window.confirm(`Are you sure you want to completely delete ${name}?`)) return;
//     try {
//       const { error } = await supabase.from('products').delete().eq('id', id);
//       if (error) throw error;
//       triggerToast(`Removed ${name} from active lists.`);
//     } catch (err: any) {
//       triggerToast(`Delete Error: ${err.message}`);
//     }
//   };

//   const filteredProducts = useMemo(() => {
//     return products.filter((prod) => {
//       const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
//       const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [products, activeCategory, searchQuery]);

//   return (
//     <main className="p-6 space-y-6 animate-fadeIn">
//       {toastMessage && (
//         <div className="fixed top-5 right-5 z-[100] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
//           <span>🔔</span> {toastMessage}
//         </div>
//       )}

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Menu Listings</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Edit store dishes, adjust real-time stock levels, and customize descriptions.</p>
//         </div>
//         <button onClick={openAddModal} className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#e0532b]/15">
//           + Add New Dish
//         </button>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
//         <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl w-fit">
//           {['All', 'Mains', 'Sides', 'Drinks', 'Desserts'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveCategory(tab as any)}
//               className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
//                 activeCategory === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="relative">
//           <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">🔍</span>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search active menu list..."
//             className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20 text-slate-800"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-20 text-xs text-slate-400 font-bold tracking-widest animate-pulse">SYNCING WITH SUPABASE LIVE SERVERS...</div>
//       ) : filteredProducts.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 text-xs text-slate-400 font-bold">No products configuration setup found.</div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-450 uppercase tracking-widest">
//                   <th className="py-4 px-6 w-[55%]">Product Details</th>
//                   <th className="py-4 px-4 w-[15%]">Price</th>
//                   <th className="py-4 px-4 w-[15%]">Status</th>
//                   <th className="py-4 px-6 text-right w-[15%]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {filteredProducts.map((p) => (
//                   <tr key={p.id} className="group hover:bg-slate-50/20 transition-all">
//                     <td className="py-4 px-6 flex items-center space-x-3">
//                       <span className="text-2xl p-1.5 bg-slate-50 rounded-xl border border-slate-100">{p.emoji || '🍲'}</span>
//                       <div>
//                         <span className="text-xs font-bold text-slate-950 block">{p.name}</span>
//                         <span className="text-[10px] text-slate-400 block max-w-sm truncate mt-0.5">{p.description}</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-4 text-xs font-extrabold text-slate-900">₱{Number(p.price).toFixed(2)}</td>
//                     <td className="py-4 px-4">
//                       <button 
//                         type="button"
//                         onClick={() => toggleStockStatus(p.id, p.status)}
//                         className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
//                           p.status === 'In Stock' 
//                             ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
//                             : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
//                         }`}
//                       >
//                         {p.status}
//                       </button>
//                     </td>
//                     <td className="py-4 px-6 text-right space-x-3">
//                       <button type="button" onClick={() => openEditModal(p)} className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
//                       <button type="button" onClick={() => deleteProduct(p.id, p.name)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* MODAL SHEET CONTROLLER */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
//           <form onSubmit={handleSaveProduct} className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl overflow-hidden text-left animate-fadeIn">
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="font-extrabold text-slate-900 text-sm">{editingProduct ? 'Modify Dish Config' : 'Add New Food Option'}</h3>
//               <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Icon</label>
//                   <input type="text" required maxLength={2} value={formEmoji} onChange={(e) => setFormEmoji(e.target.value)} className="w-full text-center px-2 py-2 border border-slate-200 rounded-xl text-lg text-slate-800 bg-white focus:outline-none" />
//                 </div>
//                 <div className="col-span-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dish Name</label>
//                   <input type="text" required placeholder="e.g. Pork Sisig" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20 text-slate-800" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price (₱)</label>
//                   <input type="number" required min={1} value={formPrice} onChange={(e) => setFormPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20 text-slate-800" />
//                 </div>
//                 <div>
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
//                   <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20 text-slate-800 bg-white">
//                     <option value="Mains">Mains</option>
//                     <option value="Sides">Sides</option>
//                     <option value="Drinks">Drinks</option>
//                     <option value="Desserts">Desserts</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
//                 <textarea rows={2} required placeholder="Ingredients..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20 text-slate-800" />
//               </div>
//             </div>
//             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
//               <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
//               <button type="submit" disabled={saving} className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md">{saving ? 'Saving...' : 'Save configurations'}</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </main>
//   );
// }

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Search, Plus, Edit2, Trash2, Loader2, ChefHat, 
  Soup, UtensilsCrossed, X, Save, AlertTriangle 
} from 'lucide-react';

export default function KraveMenuPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL DRAWER MANAGEMENT STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // UPGRADED CUSTOM DELETE MODAL STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // FORM INPUT DATA STATE
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: "Chef's Specials",
    status: 'IN STOCK'
  });

  const tabs = ["All", "Chef's Specials", "Vietnamese & Asian", "Appetizers & Dimsum"];

  // INITIAL DATA SEEDING (KRAVE KITCHEN INVENTORY)
  useEffect(() => {
    async function fetchKraveMenu() {
      try {
        const officialKraveMenu = [
          { id: 1, name: "Kare Kare Bagnet", description: "Crispy bagnet pieces served with traditional thick peanut sauce and local vegetables.", price: 380.00, status: "IN STOCK", category: "Chef's Specials" },
          { id: 2, name: "Mongo Bagnet", description: "Creamy, savory mung bean stew topped with generous crunchy bagnet chunks.", price: 180.00, status: "IN STOCK", category: "Chef's Specials" },
          { id: 3, name: "Grilled Pork Belly", description: "Perfectly marinated pork belly grilled over live charcoal embers.", price: 250.00, status: "IN STOCK", category: "Chef's Specials" },
          { id: 4, name: "Special BBQ Skewers", description: "Krave's signature sweet-savory street-style pork barbecue skewers (3pcs).", price: 165.00, status: "IN STOCK", category: "Chef's Specials" },
          { id: 5, name: "Chicken Cordon Bleu", description: "Tender chicken breasts rolled around premium ham and cheese, breaded and fried.", price: 280.00, status: "IN STOCK", category: "Chef's Specials" },
          { id: 6, name: "Pho Bo (Beef Pho)", description: "Traditional aromatic Vietnamese noodle soup with tender beef slices and fresh herbs.", price: 290.00, status: "IN STOCK", category: "Vietnamese & Asian" },
          { id: 7, name: "Vietnamese Salad (Gòi)", description: "Refreshing crisp vegetable salad tossed in a signature tangy Vietnamese dressing.", price: 195.00, status: "IN STOCK", category: "Vietnamese & Asian" },
          { id: 8, name: "Gòi Cuòn (Spring Rolls)", description: "Fresh rice paper rolls packed with shrimp, pork, herbs, and rice vermicelli.", price: 180.00, status: "IN STOCK", category: "Vietnamese & Asian" },
          { id: 9, name: "Beef Banh Mi", description: "Crisp crusty baguette stuffed with savory seasoned beef, pickled carrots, and cilantro.", price: 220.00, status: "IN STOCK", category: "Vietnamese & Asian" },
          { id: 10, name: "Pad Thai", description: "Stir-fried rice noodles with tofu, bean sprouts, peanuts, and authentic tamarind sauce.", price: 240.00, status: "SOLD OUT", category: "Vietnamese & Asian" },
          { id: 11, name: "Tamarind Prawn", description: "Juicy, plump prawns coated in a sticky, sweet-and-sour tamarind glaze glaze.", price: 390.00, status: "IN STOCK", category: "Vietnamese & Asian" },
          { id: 12, name: "Hakaw", description: "Classic translucent steamed dumplings packed with plump, juicy whole shrimp fillings (4pcs).", price: 160.00, status: "IN STOCK", category: "Appetizers & Dimsum" },
          { id: 13, name: "Crab Rangoon", description: "Crispy fried wonton wrappers stuffed with a creamy blend of crab meat and cream cheese.", price: 175.00, status: "IN STOCK", category: "Appetizers & Dimsum" }
        ];
        setProducts(officialKraveMenu);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchKraveMenu();
  }, []);

  const categoryCounts = useMemo(() => {
    return {
      All: products.length,
      "Chef's Specials": products.filter(p => p.category === "Chef's Specials").length,
      "Vietnamese & Asian": products.filter(p => p.category === "Vietnamese & Asian").length,
      "Appetizers & Dimsum": products.filter(p => p.category === "Appetizers & Dimsum").length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesTab = activeTab === 'All' || product.category.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', description: '', price: '', category: "Chef's Specials", status: 'IN STOCK' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setModalMode('edit');
    setSelectedProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    setSubmitting(true);
    
    setTimeout(() => {
      if (modalMode === 'create') {
        const newDishItem = {
          id: Date.now(),
          name: formData.name,
          description: formData.description || 'No description.',
          price: parseFloat(formData.price),
          category: formData.category,
          status: formData.status
        };
        setProducts((prev) => [newDishItem, ...prev]);
      } else {
        setProducts((prev) => prev.map(p => p.id === selectedProductId 
          ? { ...p, name: formData.name, description: formData.description, price: parseFloat(formData.price), category: formData.category, status: formData.status }
          : p
        ));
      }
      setIsModalOpen(false);
      setSubmitting(false);
    }, 600);
  };

  // UPGRADED DISH DELETION MODAL INTERFACE TRIGGERS
  const triggerDeleteConfirmation = (id: number, name: string) => {
    setItemToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setDeleting(true);

    // Nag-simulate ng network latency bago burahin sa state array
    setTimeout(() => {
      setProducts(prev => prev.filter(p => p.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleting(false);
    }, 500);
  };

  return (
    <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased relative min-h-screen">
      
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
          className="inline-flex items-center justify-center gap-2 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md shadow-orange-700/10 transition whitespace-nowrap self-start sm:self-auto active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Add New Dish
        </button>
      </div>

      {/* FILTER SEARCH DECK ROW */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 md:pb-0 max-w-full custom-scrollbar">
          {tabs.map((tab) => {
            const count = categoryCounts[tab as keyof typeof categoryCounts] || 0;
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isTabActive ? 'bg-slate-100 text-slate-800 shadow-inner' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                  isTabActive ? 'bg-slate-800 text-white' : 'bg-slate-200/60 text-slate-500'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:max-w-xs lg:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active menu list..."
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* CORE PRODUCTS WORKSPACE */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 font-medium">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-orange-500 mb-2" /> Syncing repository...
        </div>
      ) : (
        <div>
          {/* A. DESKTOP SYSTEM PLATFORM VIEW */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6">Product Details</th>
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
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {product.category === "Chef's Specials" && <ChefHat className="h-4 w-4 text-amber-600" />}
                          {product.category === "Vietnamese & Asian" && <Soup className="h-4 w-4 text-emerald-600" />}
                          {product.category === "Appetizers & Dimsum" && <UtensilsCrossed className="h-4 w-4 text-indigo-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</p>
                          <p className="text-slate-400 leading-normal font-medium text-[11px] truncate max-w-xs lg:max-w-md">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-black text-slate-900 text-sm">₱{product.price.toFixed(2)}</td>
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

          {/* B. MOBILE STACK LAYOUT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {product.category === "Chef's Specials" && <ChefHat className="h-4 w-4 text-amber-600" />}
                    {product.category === "Vietnamese & Asian" && <Soup className="h-4 w-4 text-emerald-600" />}
                    {product.category === "Appetizers & Dimsum" && <UtensilsCrossed className="h-4 w-4 text-indigo-600" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">{product.name}</h3>
                      <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
                        product.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                      }`}>{product.status}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{product.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Base Price</span>
                    <span className="font-black text-slate-900 text-sm">₱{product.price.toFixed(2)}</span>
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

      {/* =========================================================================
          SLIDE-OVER MODAL CONSOLE (CREATE & EDIT DRAWER)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100">
            <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white p-1.5 rounded-lg">
                  {modalMode === 'create' ? <Plus className="h-4 w-4 stroke-[3]" /> : <Edit2 className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm tracking-tight">
                    {modalMode === 'create' ? 'Create Menu Entry' : 'Modify Menu Parameters'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Krave Kitchen Controller</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dish Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Kare Kare Bagnet" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category Channel</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-orange-500 text-slate-700">
                  <option value="Chef's Specials">Chef's Specials</option>
                  <option value="Vietnamese & Asian">Vietnamese & Asian</option>
                  <option value="Appetizers & Dimsum">Appetizers & Dimsum</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Selling Price (PHP) *</label>
                <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition font-mono text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Kitchen Stock Status</label>
                <div className="flex gap-2">
                  {['IN STOCK', 'SOLD OUT'].map((statusOption) => (
                    <button key={statusOption} type="button" onClick={() => setFormData({ ...formData, status: statusOption })} className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wider transition ${formData.status === statusOption ? statusOption === 'IN STOCK' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200/60'}`}>{statusOption}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description / Recipe Notes</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe recipe guidelines..." className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition resize-none leading-relaxed" />
              </div>
            </form>

            <div className="h-16 border-t border-slate-100 px-6 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
              <button type="button" disabled={submitting} onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition">Cancel</button>
              <button type="submit" onClick={handleFormSubmit} disabled={submitting || !formData.name || !formData.price} className="inline-flex items-center gap-1.5 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition">
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {modalMode === 'create' ? 'Save Product' : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          UPGRADED: NEW HIGH-FIDELITY DELETE CONFIRMATION MODAL (NO LOCALHOST ALERT)
          ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden antialiased">
          
          {/* Backdrop Blur Layer */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => !deleting && setIsDeleteModalOpen(false)} 
          />

          {/* Centered Modal Content Card */}
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 p-6 space-y-6 text-center animate-scaleUp">
            
            {/* Warning Alert Icon Container */}
            <div className="mx-auto w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl">
              <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
            </div>

            {/* Modal Body Descriptive Texts */}
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Remove Dish from Menu?
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Sigurado ka bang nais mong permanenteng burahin ang <span className="font-extrabold text-slate-700">"{itemToDelete?.name}"</span>? Ang aksyon na ito ay hindi na maaaring bawiin.
              </p>
            </div>

            {/* Action Action Trigger Control Buttons Footer */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition disabled:opacity-50"
              >
                No, Keep It
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/10 transition inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}