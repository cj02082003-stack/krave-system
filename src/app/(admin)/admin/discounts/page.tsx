'use client';

import React, { useState } from 'react';

interface Discount {
  id: string;
  code: string;
  description: string;
  type: 'Percentage' | 'Fixed Amount';
  value: number;
  minSpend: number;
  status: 'Active' | 'Expired';
  isMayaExclusive: boolean;
}

const INITIAL_DISCOUNTS: Discount[] = [
  { id: 'DSC-001', code: 'KRAVEMAYA50', description: '₱50 off when checking out via Maya gateway.', type: 'Fixed Amount', value: 50, minSpend: 350, status: 'Active', isMayaExclusive: true },
];

export default function DiscountsPage() {
  const [discounts] = useState<Discount[]>(INITIAL_DISCOUNTS);

  return (
    <main className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Promos & Discounts</h2>
          <p className="text-xs text-slate-400">Deploy digital vouchers, minimum spend limits, and exclusive Maya offers.</p>
        </div>
        <button className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
          + New Campaign
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-4 px-6">Coupon Offer</th>
              <th className="py-4 px-4">Value</th>
              <th className="py-4 px-4">Min Spend</th>
              <th className="py-4 px-4">Environment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {discounts.map((disc) => (
              <tr key={disc.id}>
                <td className="py-4 px-6 max-w-sm">
                  <span className="font-mono font-black text-xs bg-slate-100 px-2 py-1 rounded border text-slate-800">{disc.code}</span>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{disc.description}</p>
                </td>
                <td className="py-4 px-4 text-xs font-bold">₱{disc.value} Off</td>
                <td className="py-4 px-4 text-xs font-bold">₱{disc.minSpend}</td>
                <td className="py-4 px-4 text-xs font-bold">
                  {disc.isMayaExclusive ? (
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">💳 Maya Pay Exclusive</span>
                  ) : (
                    <span className="text-[9px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-wider">Standard</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}