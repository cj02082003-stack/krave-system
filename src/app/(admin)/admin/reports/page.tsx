'use client';

import React, { useMemo } from 'react';

export default function ReportsPage() {
  const reportsData = useMemo(() => {
    return {
      grossSales: 168450,
      netSales: 160027.5,
      totalMayaFees: 8422.5,
      avgOrderValue: 481.28
    };
  }, []);

  return (
    <main className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Business Reports Hub</h2>
        <p className="text-xs text-slate-400 mt-0.5">Audit payouts, net restaurant sales performance, and Maya billing schedules.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Gross Revenue</span>
          <p className="text-lg sm:text-2xl font-black text-slate-900">₱{reportsData.grossSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Net Payouts</span>
          <p className="text-lg sm:text-2xl font-black text-emerald-600">₱{reportsData.netSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Maya Settle Fees</span>
          <p className="text-lg sm:text-2xl font-black text-blue-600">₱{reportsData.totalMayaFees.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Avg Order Value</span>
          <p className="text-lg sm:text-2xl font-black text-slate-800">₱{reportsData.avgOrderValue.toFixed(2)}</p>
        </div>
      </div>
    </main>
  );
}