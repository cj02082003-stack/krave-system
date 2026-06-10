// 'use client';

// import React, { useState } from 'react';

// interface Discount {
//   id: string;
//   code: string;
//   description: string;
//   type: 'Percentage' | 'Fixed Amount';
//   value: number;
//   minSpend: number;
//   status: 'Active' | 'Expired';
//   isMayaExclusive: boolean;
// }

// const INITIAL_DISCOUNTS: Discount[] = [
//   { id: 'DSC-001', code: 'KRAVEMAYA50', description: '₱50 off when checking out via Maya gateway.', type: 'Fixed Amount', value: 50, minSpend: 350, status: 'Active', isMayaExclusive: true },
// ];

// export default function DiscountsPage() {
//   const [discounts] = useState<Discount[]>(INITIAL_DISCOUNTS);

//   return (
//     <main className="p-6 space-y-6 animate-fadeIn">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Promos & Discounts</h2>
//           <p className="text-xs text-slate-400">Deploy digital vouchers, minimum spend limits, and exclusive Maya offers.</p>
//         </div>
//         <button className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
//           + New Campaign
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               <th className="py-4 px-6">Coupon Offer</th>
//               <th className="py-4 px-4">Value</th>
//               <th className="py-4 px-4">Min Spend</th>
//               <th className="py-4 px-4">Environment</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {discounts.map((disc) => (
//               <tr key={disc.id}>
//                 <td className="py-4 px-6 max-w-sm">
//                   <span className="font-mono font-black text-xs bg-slate-100 px-2 py-1 rounded border text-slate-800">{disc.code}</span>
//                   <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{disc.description}</p>
//                 </td>
//                 <td className="py-4 px-4 text-xs font-bold">₱{disc.value} Off</td>
//                 <td className="py-4 px-4 text-xs font-bold">₱{disc.minSpend}</td>
//                 <td className="py-4 px-4 text-xs font-bold">
//                   {disc.isMayaExclusive ? (
//                     <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">💳 Maya Pay Exclusive</span>
//                   ) : (
//                     <span className="text-[9px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-wider">Standard</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

'use client';

import React, { useState } from 'react';
import { 
  Plus, Ticket, Edit2, Trash2, Power, PowerOff, X, 
  Save, AlertTriangle, Loader2, Percent, CreditCard, CheckCircle2, RefreshCw 
} from 'lucide-react';

interface Promotion {
  id: string;
  code: string;
  description: string;
  status: 'ACTIVE' | 'EXPIRED';
  environment: 'MAYA PAY ONLY' | 'STANDARD CHANNEL';
  usageCurrent: number;
  usageMax: number;
}

export default function PromosAndDiscountsPage() {
  // 1. ACCURATE DESIGN METRICS DATA POOL
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'PRM-01',
      code: 'KRAVEMAYA50',
      description: '₱50 off when checking out via Maya gateway.',
      status: 'ACTIVE',
      environment: 'MAYA PAY ONLY',
      usageCurrent: 142,
      usageMax: 500
    },
    {
      id: 'PRM-02',
      code: 'WELCOME10',
      description: '10% discount for first-time customer orders.',
      status: 'ACTIVE',
      environment: 'STANDARD CHANNEL',
      usageCurrent: 89,
      usageMax: 1000
    },
    {
      id: 'PRM-03',
      code: 'KRAVESUNDAY',
      description: 'Get free delivery on Sundays over ₱600 checkout.',
      status: 'EXPIRED',
      environment: 'STANDARD CHANNEL',
      usageCurrent: 300,
      usageMax: 300
    }
  ]);

  // SYSTEM COMPONENT INTERFACE LOGIC STATES
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // CUSTOM SYSTEM DELETE CONFIGURATIONS
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; code: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // FORM OBJECT INITIAL VALUES STATE
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'EXPIRED',
    environment: 'STANDARD CHANNEL' as 'MAYA PAY ONLY' | 'STANDARD CHANNEL',
    usageCurrent: 0,
    usageMax: 500
  });

  // METRIC SUMMARY DERIVATIONS
  const activeCampaignsCount = promotions.filter(p => p.status === 'ACTIVE').length;
  const mayaExclusivesCount = promotions.filter(p => p.environment === 'MAYA PAY ONLY').length;

  // FUNCTION: FLIP CAMPAIGN SYSTEM STATUS FROM INTERACTIVE CARD LINE ROW
  const handleToggleStatus = (id: string) => {
    setPromotions(prev => prev.map(promo => {
      if (promo.id !== id) return promo;
      const nextStatus = promo.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE';
      return {
        ...promo,
        status: nextStatus,
        // Kung ibinalik sa active pero puno na, i-reset nang kaunti ang capacity para sa testing simulation
        usageCurrent: nextStatus === 'ACTIVE' && promo.usageCurrent >= promo.usageMax ? Math.floor(promo.usageMax * 0.5) : promo.usageCurrent
      };
    }));
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ code: '', description: '', status: 'ACTIVE', environment: 'STANDARD CHANNEL', usageCurrent: 0, usageMax: 500 });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (promo: Promotion) => {
    setModalMode('edit');
    setSelectedPromoId(promo.id);
    setFormData({
      code: promo.code,
      description: promo.description,
      status: promo.status,
      environment: promo.environment,
      usageCurrent: promo.usageCurrent,
      usageMax: promo.usageMax
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.description) return;
    setSubmitting(true);

    setTimeout(() => {
      if (modalMode === 'create') {
        const newPromo: Promotion = {
          id: `PRM-${Date.now().toString().slice(-2)}`,
          code: formData.code.toUpperCase().replace(/\s+/g, ''),
          description: formData.description,
          status: formData.status,
          environment: formData.environment,
          usageCurrent: Number(formData.usageCurrent),
          usageMax: Number(formData.usageMax)
        };
        setPromotions(prev => [...prev, newPromo]);
      } else {
        setPromotions(prev => prev.map(p => p.id === selectedPromoId 
          ? { 
              ...p, 
              code: formData.code.toUpperCase().replace(/\s+/g, ''), 
              description: formData.description, 
              status: formData.status, 
              environment: formData.environment,
              usageCurrent: Number(formData.usageCurrent),
              usageMax: Number(formData.usageMax)
            }
          : p
        ));
      }
      setIsFormModalOpen(false);
      setSubmitting(false);
    }, 500);
  };

  const triggerDeleteConfirmation = (id: string, code: string) => {
    setItemToDelete({ id, code });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setDeleting(true);

    setTimeout(() => {
      setPromotions(prev => prev.filter(p => p.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleting(false);
    }, 500);
  };

  return (
    <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased min-h-screen pb-12 relative">
      
      {/* HEADER MANAGEMENT TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Promos & Discounts</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Deploy digital vouchers, minimum spend limits, and exclusive Maya offers.
          </p>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition self-start sm:self-auto active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          New Campaign
        </button>
      </div>

      {/* CORE ANALYTICS STATS DECK SEGMENT LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* STAT 1: ACTIVE CAMPAIGNS CONTAINER */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Active Campaigns</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{activeCampaignsCount}</span>
          </div>
        </div>

        {/* STAT 2: MAYA EXCLUSIVES CONTAINER */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Maya Exclusives</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{mayaExclusivesCount}</span>
          </div>
        </div>

        {/* STAT 3: CUMULATIVE VALUE CONTAINER */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1.5 sm:col-span-2 lg:col-span-1">
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Cumulative Saved Value</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">₱25,990</span>
          </div>
        </div>

      </div>

      {/* VOUCHER DATABASE DIRECTORY (RESPONSIVE ADAPTIVE ENGAGING INTERFACE) */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        
        {/* TABLE VIEW SYSTEM SHEET (VISIBLE ONLY ON LARGE DESKTOPS FOR GRID SYNC) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 bg-slate-50/50 tracking-wider h-12">
                <th className="pl-6 pr-4 font-bold">Coupon Offer</th>
                <th className="px-4 font-bold">Environment</th>
                <th className="px-4 font-bold">Limits Usage</th>
                <th className="px-4 font-bold">Usage Progress</th>
                <th className="pr-6 pl-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {promotions.map((promo) => {
                const isActive = promo.status === 'ACTIVE';
                const usagePercentage = Math.min(Math.round((promo.usageCurrent / promo.usageMax) * 100), 100);
                const isMaya = promo.environment === 'MAYA PAY ONLY';

                return (
                  <tr key={promo.id} className={`hover:bg-slate-50/50 transition-colors h-20 ${!isActive ? 'bg-slate-50/30' : ''}`}>
                    
                    {/* Column 1: Coupon Basics */}
                    <td className="pl-6 pr-4 py-4 max-w-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 font-mono font-black px-2 py-0.5 rounded border border-slate-200 tracking-wide text-[11px]">
                            {promo.code}
                          </span>
                          <span className={`text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase ${
                            isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {promo.status}
                          </span>
                        </div>
                        <p className="text-slate-400 font-medium text-[11px] leading-relaxed truncate">{promo.description}</p>
                      </div>
                    </td>

                    {/* Column 2: Channel Environment */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 font-bold font-mono text-[10px] tracking-wider rounded px-2 py-0.5 ${
                        isMaya 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isMaya && <CreditCard className="h-3 w-3" />}
                        {promo.environment}
                      </span>
                    </td>

                    {/* Column 3: Raw Numbers Log */}
                    <td className="px-4 py-4 whitespace-nowrap font-mono font-black text-slate-700">
                      {promo.usageCurrent} <span className="text-slate-300 stroke-[2]">/</span> {promo.usageMax}
                    </td>

                    {/* Column 4: Operational Limit Progress Meter Bar */}
                    <td className="px-4 py-4 min-w-[140px]">
                      <div className="flex items-center gap-2.5 max-w-[160px]">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              usagePercentage >= 100 ? 'bg-slate-400' : isMaya ? 'bg-emerald-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[10px] text-slate-400 text-right w-7">{usagePercentage}%</span>
                      </div>
                    </td>

                    {/* Column 5: Multi-action Configuration Option Rows */}
                    <td className="pr-6 pl-4 py-4 whitespace-nowrap text-right font-bold">
                      <div className="flex items-center justify-end gap-3.5">
                        <button 
                          onClick={() => handleToggleStatus(promo.id)}
                          className={`inline-flex items-center gap-1 transition-colors ${isActive ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-500 hover:text-emerald-700'}`}
                          title={isActive ? 'Expire Campaign' : 'Reactivate Campaign'}
                        >
                          {isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                          <span>Toggle</span>
                        </button>
                        <button onClick={() => handleOpenEditModal(promo)} className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => triggerDeleteConfirmation(promo.id, promo.code)} className="text-rose-500 hover:text-rose-700 inline-flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE GRID LAYOUT VERSION (AUTOMATICALLY FIRES BELOW MD GRAPH INTERFACES) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {promotions.map((promo) => {
            const isActive = promo.status === 'ACTIVE';
            const usagePercentage = Math.min(Math.round((promo.usageCurrent / promo.usageMax) * 100), 100);
            return (
              <div key={promo.id} className={`p-4 space-y-4 ${!isActive ? 'bg-slate-50/50 opacity-75' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-100 text-slate-700 font-mono font-black px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {promo.code}
                      </span>
                      <span className={`text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {promo.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium text-xs leading-relaxed">{promo.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-400">
                  <div className="space-y-0.5">
                    <span className="block text-[9px] font-black uppercase text-slate-400">Channel Environment</span>
                    <span className="text-slate-700 font-bold block">{promo.environment}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[9px] font-black uppercase text-slate-400">Current Usage</span>
                    <span className="text-slate-700 font-black font-mono block">{promo.usageCurrent} / {promo.usageMax}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Usage Allocation Progress</span>
                    <span className="font-mono">{usagePercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${usagePercentage}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-2 text-xs font-bold border-t border-slate-50">
                  <button onClick={() => handleToggleStatus(promo.id)} className={`inline-flex items-center gap-1 ${isActive ? 'text-slate-400' : 'text-emerald-500'}`}>
                    {isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />} <span>Toggle</span>
                  </button>
                  <button onClick={() => handleOpenEditModal(promo)} className="text-indigo-600 inline-flex items-center gap-1"><Edit2 className="h-3.5 w-3.5" /> <span>Edit</span></button>
                  <button onClick={() => triggerDeleteConfirmation(promo.id, promo.code)} className="text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> <span>Delete</span></button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          SLIDE-OVER DRAW SLOT PANEL (CREATE & EDIT FORM OPERATIONS)
          ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFormModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100 animate-slideLeft">
            
            <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white p-1.5 rounded-lg">
                  {modalMode === 'create' ? <Plus className="h-4 w-4 stroke-[3]" /> : <Edit2 className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm tracking-tight">
                    {modalMode === 'create' ? 'Create Promo Campaign' : 'Modify Campaign Matrix'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Krave Marketing Automation</p>
                </div>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Voucher Code String *</label>
                <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g., KRAVEMAYA100" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black outline-none focus:border-orange-500 focus:bg-white transition uppercase font-mono tracking-wider" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Campaign Context Description *</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe details (e.g., 10% discount for first-time customer orders...)" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition resize-none leading-relaxed" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Channel Deployment</label>
                  <select value={formData.environment} onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 h-[38px] outline-none focus:border-orange-500">
                    <option value="STANDARD CHANNEL">STANDARD CHANNEL</option>
                    <option value="MAYA PAY ONLY">MAYA PAY ONLY</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Campaign State</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 h-[38px] outline-none focus:border-orange-500">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Logs Claimed</label>
                  <input type="number" min="0" max={formData.usageMax} value={formData.usageCurrent} onChange={(e) => setFormData({ ...formData, usageCurrent: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-slate-800" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Max Claim Limit Capacity</label>
                  <input type="number" min="1" value={formData.usageMax} onChange={(e) => setFormData({ ...formData, usageMax: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-slate-800" />
                </div>
              </div>
            </form>

            <div className="h-16 border-t border-slate-100 px-6 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
              <button type="button" disabled={submitting} onClick={() => setIsFormModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" onClick={handleFormSubmit} disabled={submitting || !formData.code || !formData.description} className="inline-flex items-center gap-1.5 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition">
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {modalMode === 'create' ? 'Deploy Promo' : 'Update Campaign'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          UPGRADED HIGH-FIDELITY CONFIRMATION MODAL (NO ALERT BLOCKS)
          ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden antialiased">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => !deleting && setIsDeleteModalOpen(false)} />
          
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 space-y-6 text-center animate-scaleUp">
            
            <div className="mx-auto w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl">
              <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 tracking-tight">Remove Promo Voucher?</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-2">
                Sigurado ka bang nais mong tanggalin ang promo code <span className="font-mono font-extrabold text-slate-700">"{itemToDelete?.code}"</span>? Lahat ng transactions na gumagamit nito ay ititigil agad.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition inline-flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}