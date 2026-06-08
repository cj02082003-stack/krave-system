'use client';

import React, { useState, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Mains' | 'Sides' | 'Drinks' | 'Desserts';
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Sold Out';
  emoji: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 'PROD-001', name: 'Sizzling Pork Sisig', description: 'Traditional hot skillet pork hash.', category: 'Mains', price: 220, status: 'In Stock', emoji: '🍳' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mains' | 'Sides' | 'Drinks' | 'Desserts'>('All');

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <main className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Menu Listings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Edit store dishes, adjust real-time stock levels, and customize descriptions.</p>
        </div>
        <button className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
          + Add New Dish
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-450 uppercase tracking-widest">
              <th className="py-4 px-6">Product Details</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="py-4 px-6 flex items-center space-x-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-xs font-bold text-slate-950">{p.name}</span>
                </td>
                <td className="py-4 px-4 text-xs font-bold">₱{p.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-xs font-bold text-emerald-600">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}