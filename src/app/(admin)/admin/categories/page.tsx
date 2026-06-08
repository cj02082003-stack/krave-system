'use client';

import React, { useState, useMemo } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  status: 'Active' | 'Disabled';
  productCount: number;
  sortOrder: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'CAT-001', name: 'Mains', slug: 'mains', description: 'Traditional Filipino main plates.', emoji: '🍛', status: 'Active', productCount: 12, sortOrder: 1 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  return (
    <main className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Categories Layout</h2>
          <p className="text-xs text-slate-400">Manage storefront catalog sections, sort order, and menu display toggles.</p>
        </div>
        <button className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-4 px-6">Category Detail</th>
              <th className="py-4 px-4 text-center">Linked Items</th>
              <th className="py-4 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="py-4 px-6 flex items-center space-x-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-950 block">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-xs font-bold">{cat.productCount} dishes</td>
                <td className="py-4 px-4 text-xs font-bold text-emerald-600">{cat.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}