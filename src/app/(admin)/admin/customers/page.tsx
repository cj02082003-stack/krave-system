// 'use client';

// import React, { useState, useMemo } from 'react';

// // --- TYPE DEFINITIONS ---
// interface CustomerOrder {
//   orderId: string;
//   date: string;
//   total: number;
//   paymentMethod: string;
//   status: string;
// }

// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   tier: 'VIP' | 'Regular' | 'New';
//   status: 'Active' | 'Suspended';
//   joinDate: string;
//   totalOrders: number;
//   totalSpend: number;
//   favoriteDish: string;
//   avatarColor: string;
//   orderHistory: CustomerOrder[];
// }

// const INITIAL_CUSTOMERS: Customer[] = [
//   {
//     id: 'CUST-001',
//     name: 'Mary Grace Alano',
//     email: 'mary.grace@email.com',
//     phone: '+63 920 987 6543',
//     tier: 'VIP',
//     status: 'Active',
//     joinDate: 'Jan 15, 2025',
//     totalOrders: 18,
//     totalSpend: 8450,
//     favoriteDish: '🍳 Sizzling Pork Sisig',
//     avatarColor: 'bg-orange-500',
//     orderHistory: [
//       { orderId: 'ORD-1250', date: 'Today, 10:24 AM', total: 500, paymentMethod: 'Maya Wallet', status: 'Preparing' },
//     ]
//   },
// ];

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeTierFilter, setActiveTierFilter] = useState<'All' | 'VIP' | 'Regular' | 'New'>('All');
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(INITIAL_CUSTOMERS[0]);

//   const stats = useMemo(() => {
//     const active = customers.filter(c => c.status === 'Active').length;
//     const vips = customers.filter(c => c.tier === 'VIP').length;
//     const totalSpendSum = customers.reduce((acc, curr) => acc + curr.totalSpend, 0);
//     const averageLTV = customers.length ? totalSpendSum / customers.length : 0;

//     return {
//       total: customers.length,
//       active,
//       vips,
//       avgLTV: averageLTV
//     };
//   }, [customers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(cust => {
//       const matchesTier = activeTierFilter === 'All' || cust.tier === activeTierFilter;
//       const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesTier && matchesSearch;
//     });
//   }, [customers, activeTierFilter, searchQuery]);

//   return (
//     <main className="flex h-full overflow-hidden">
//       {/* Customers List */}
//       <div className="flex-grow w-1/2 flex flex-col border-r border-slate-100 overflow-y-auto p-6 space-y-6">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Accounts</h2>
//           <p className="text-xs text-slate-400">Monitor loyal customers and analyze lifetime value metrics.</p>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
//             <p className="text-lg font-black text-slate-800 mt-1">{stats.total}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VIPs</p>
//             <p className="text-lg font-black text-amber-600 mt-1">{stats.vips}</p>
//           </div>
//         </div>

//         <div className="space-y-3">
//           {filteredCustomers.map((cust) => (
//             <div
//               key={cust.id}
//               onClick={() => setSelectedCustomer(cust)}
//               className="p-4 bg-white rounded-xl border border-slate-150 cursor-pointer hover:border-slate-350 transition-all"
//             >
//               <p className="font-bold text-xs text-slate-900">{cust.name}</p>
//               <p className="text-[10px] text-slate-400">{cust.email}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Details Area */}
//       <div className="hidden md:flex md:w-1/2 bg-white flex-col overflow-y-auto p-8">
//         {selectedCustomer ? (
//           <div className="space-y-6">
//             <h3 className="font-extrabold text-slate-900 text-base">{selectedCustomer.name}</h3>
//             <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
//               <p><strong>Join Date:</strong> {selectedCustomer.joinDate}</p>
//               <p><strong>Favorite Dish:</strong> {selectedCustomer.favoriteDish}</p>
//               <p><strong>LTV:</strong> ₱{selectedCustomer.totalSpend.toLocaleString()}</p>
//             </div>
//           </div>
//         ) : (
//           <div className="h-full flex items-center justify-center text-slate-400">
//             Select a customer profile to inspect purchase data.
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

'use client';

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Search, Users, Star, Ban, ShieldCheck, Mail, Phone, 
  Calendar, CreditCard, X, AlertTriangle, Loader2 
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  tier: 'VIP' | 'REGULAR' | 'NEW';
  status: 'ACTIVE' | 'SUSPENDED';
  totalSpend: number;
  address: string;
}

export default function CustomerAccountsPage() {
  // 10 REALISTIC CUSTOMER ACCOUNTS FOR SYSTEM STRESS TESTING
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CU-9021', name: 'Mary Grace Alano', email: 'mary.grace@email.com', phone: '+63 920 987 6543', joinDate: 'Jan 15, 2025', tier: 'VIP', status: 'ACTIVE', totalSpend: 8450.00, address: 'Unit 4B, Burgundy Tower, Katipunan Ave, Quezon City' },
    { id: 'CU-4820', name: 'Kenneth Sison', email: 'ken.sison@gmail.com', phone: '+63 917 555 1234', joinDate: 'Feb 02, 2025', tier: 'REGULAR', status: 'ACTIVE', totalSpend: 4120.00, address: '12 Villegas St, Malate, Manila' },
    { id: 'CU-1104', name: 'Patricia Mendoza', email: 'patricia.m@yahoo.com', phone: '+63 908 333 9876', joinDate: 'May 11, 2026', tier: 'NEW', status: 'ACTIVE', totalSpend: 1100.00, address: 'Block 5 Lot 2, Solen Residences, Santa Rosa, Laguna' },
    { id: 'CU-5591', name: 'John Raymond Cruz', email: 'jr.cruz@gmail.com', phone: '+63 915 222 8844', joinDate: 'Mar 19, 2025', tier: 'VIP', status: 'ACTIVE', totalSpend: 12450.00, address: '22A Eastwood Avenue, Bagumbayan, Quezon City' },
    { id: 'CU-3342', name: 'Maria Cassandra Santos', email: 'cassey.santos@outlook.com', phone: '+63 922 777 4110', joinDate: 'Jun 30, 2025', tier: 'REGULAR', status: 'SUSPENDED', totalSpend: 3900.00, address: 'Building 3 Apt 12, BGC, Taguig City' },
    { id: 'CU-8819', name: 'Dominic Reyes', email: 'dom.reyes@gmail.com', phone: '+63 906 444 5566', joinDate: 'Aug 14, 2025', tier: 'VIP', status: 'ACTIVE', totalSpend: 9800.00, address: '77 Don Antonio St, Commonwealth, Quezon City' },
    { id: 'CU-2281', name: 'Alyssa Mae Torres', email: 'alyssa.torres@yahoo.com', phone: '+63 919 888 2345', joinDate: 'Oct 05, 2025', tier: 'NEW', status: 'ACTIVE', totalSpend: 950.00, address: '143 Pasong Tamo Extension, Makati City' },
    { id: 'CU-7740', name: 'Mark Anthony Diaz', email: 'mark.diaz@gmail.com', phone: '+63 947 111 9922', joinDate: 'Dec 01, 2025', tier: 'REGULAR', status: 'ACTIVE', totalSpend: 5400.00, address: '45 Vista Verde Executive Village, Cainta, Rizal' },
    { id: 'CU-6612', name: 'Chloe Bianca Villanueva', email: 'chloe.v@gmail.com', phone: '+63 918 666 3311', joinDate: 'Jan 20, 2026', tier: 'VIP', status: 'ACTIVE', totalSpend: 15300.00, address: 'Penthouse B, Pioneer Highlands, Mandaluyong City' },
    { id: 'CU-4405', name: 'Joshua Miguel Ramos', email: 'josh.ramos@gmail.com', phone: '+63 905 999 7788', joinDate: 'Feb 14, 2026', tier: 'REGULAR', status: 'SUSPENDED', totalSpend: 2150.00, address: '88 McArthur Highway, San Fernando, Pampanga' }
  ]);

  // CONTROL INTERFACE STATES
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CU-9021');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  // ACTION MODAL STATES
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'SUSPEND' | 'ACTIVATE' | 'REVOKE' | 'GRANT';
    customerId: string | null;
  }>({ isOpen: false, type: 'SUSPEND', customerId: null });
  
  const [actionLoading, setActionLoading] = useState(false);

  // AUTOMATED AGGREGATED METRICS COMPUTER
  const metrics = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'ACTIVE').length;
    const vips = customers.filter(c => c.tier === 'VIP').length;
    const avgSpend = total > 0 ? Math.round(customers.reduce((acc, c) => acc + c.totalSpend, 0) / total) : 0;
    return { total, active, vips, avgSpend };
  }, [customers]);

  // LIVE PIPELINE FILTER ENGINE
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  // RE-ASSIGN ACTIVE PROFILE SELECTION
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setIsMobileDrawerOpen(true); // Auto trigger slide-over details wrapper on mobile screen dimensions
  };

  const openActionModal = (type: 'SUSPEND' | 'ACTIVATE' | 'REVOKE' | 'GRANT', id: string) => {
    setActionModal({ isOpen: true, type, customerId: id });
  };

  const handleExecuteAction = () => {
    if (!actionModal.customerId) return;
    setActionLoading(true);

    setTimeout(() => {
      setCustomers(prev => prev.map(c => {
        if (c.id !== actionModal.customerId) return c;
        if (actionModal.type === 'SUSPEND') return { ...c, status: 'SUSPENDED' };
        if (actionModal.type === 'ACTIVATE') return { ...c, status: 'ACTIVE' };
        if (actionModal.type === 'REVOKE') return { ...c, tier: 'REGULAR' };
        if (actionModal.type === 'GRANT') return { ...c, tier: 'VIP' };
        return c;
      }));

      setActionLoading(false);
      setActionModal({ isOpen: false, type: 'SUSPEND', customerId: null });
    }, 600);
  };

  // SHAREABLE CARD CONTENT FACTORY FOR DRILL-DOWN VISUALS
  const renderProfileDetailsCard = (customer: Customer) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl text-base font-black flex items-center justify-center shrink-0 ${
            customer.status === 'SUSPENDED' ? 'bg-rose-50 text-rose-500' : 'bg-orange-500 text-white'
          }`}>
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              {customer.name}
              {customer.tier === 'VIP' && <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />}
            </h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3" /> Member since {customer.joinDate}
            </p>
          </div>
        </div>
        <span className={`self-start sm:self-auto text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
          customer.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
        }`}>
          Status: {customer.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/60 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1"><Mail className="h-3 w-3" /> Email Address</span>
          <span className="text-xs font-bold text-slate-700 block truncate select-all">{customer.email}</span>
        </div>
        <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/60 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1"><Phone className="h-3 w-3" /> Contact Number</span>
          <span className="text-xs font-bold text-slate-700 block select-all">{customer.phone}</span>
        </div>
        <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/60 sm:col-span-2 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1"><CreditCard className="h-3 w-3" /> Delivery Address</span>
          <span className="text-xs font-bold text-slate-700 block leading-relaxed">{customer.address}</span>
        </div>
      </div>

      <div className="bg-amber-50/40 border border-amber-100/70 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">Customer Loyalty Segment</h4>
          <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed max-w-sm">
            {customer.tier === 'VIP' ? 'VIP Tier rewards include Maya exclusive checkout vouchers.' : 'Grant VIP Tier access to enable specialized exclusive promotional discount tiers.'}
          </p>
        </div>
        {customer.tier === 'VIP' ? (
          <button onClick={() => openActionModal('REVOKE', customer.id)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl tracking-wide transition shrink-0 active:scale-95">REVOKE VIP PRIVILEGE</button>
        ) : (
          <button onClick={() => openActionModal('GRANT', customer.id)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl tracking-wide transition shrink-0 active:scale-95">GRANT VIP STATUS</button>
        )}
      </div>

      <div className="bg-rose-50/40 border border-rose-100/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">Emergency Account Constraints</h4>
          <p className="text-[11px] text-rose-600/80 font-medium leading-relaxed max-w-sm">
            {customer.status === 'ACTIVE' ? 'Suspend account to block checkout requests instantly.' : 'Lift restrictions to reactivate order checkout configurations.'}
          </p>
        </div>
        {customer.status === 'ACTIVE' ? (
          <button onClick={() => openActionModal('SUSPEND', customer.id)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl tracking-wide transition shrink-0 active:scale-95">SUSPEND ACCOUNT</button>
        ) : (
          <button onClick={() => openActionModal('ACTIVATE', customer.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl tracking-wide transition shrink-0 active:scale-95">REACTIVATE ACCOUNT</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full mx-auto max-w-[1600px] antialiased min-h-screen pb-12 relative">
      
      {/* PLATFORM HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Customer Accounts</h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
          Monitor loyal customers and analyze lifetime value metrics.
        </p>
      </div>

      {/* METRICS COUNT DECK CARDS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: metrics.total, color: 'text-slate-800' },
          { label: 'Active', val: metrics.active, color: 'text-emerald-600' },
          { label: 'VIP Tier', val: metrics.vips, color: 'text-amber-500' },
          { label: 'Avg Spend LTV', val: `₱${metrics.avgSpend.toLocaleString()}`, color: 'text-slate-900 font-black' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{m.label}</span>
            <span className={`text-base sm:text-xl font-black ${m.color}`}>{m.val}</span>
          </div>
        ))}
      </div>

      {/* REACTION GRID SPLIT PLATFORM CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INDEX ACCOUNTS LIST (LEFT SIDE DECK) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative w-full bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts directory..."
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition"
            />
          </div>

          {/* DYNAMIC SCROLL FRAME CONTAINER FOR 10 CUSTOMERS */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredCustomers.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-400 font-medium shadow-sm">
                No active profiles match the query parameters.
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const isSelected = customer.id === selectedCustomerId;
                return (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer.id)}
                    className={`bg-white border p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected 
                        ? 'border-orange-500 ring-1 ring-orange-500/20 shadow-sm' 
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        customer.status === 'SUSPENDED'
                          ? 'bg-rose-50 text-rose-500 border border-rose-100'
                          : customer.tier === 'VIP'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight truncate">{customer.name}</h4>
                        <p className="text-slate-400 font-medium text-[11px] truncate">{customer.email}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <span className={`inline-block text-[9px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded ${
                        customer.status === 'SUSPENDED' ? 'bg-rose-100 text-rose-600' : customer.tier === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>{customer.status === 'SUSPENDED' ? 'SUSPENDED' : customer.tier}</span>
                      <p className="font-black text-slate-800 text-xs sm:text-sm tracking-tight">₱{customer.totalSpend.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DESKTOP PERMANENT PANEL PREVIEW (RIGHT SIDE DECK - HIDDEN ON MOBILE SCREEN DIMENSIONS) */}
        <div className="hidden lg:block lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          {currentCustomer ? renderProfileDetailsCard(currentCustomer) : (
            <div className="py-24 text-center text-xs text-slate-400 font-medium">Select a user profile...</div>
          )}
        </div>

      </div>

      {/* MOBILE DRILL-DOWN MODAL OVERLAY SHEET (SLIDES UP FOR CRISP MOBILE VIEWPORT HANDLING) */}
      {isMobileDrawerOpen && currentCustomer && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto animate-slideUp border-t border-slate-100">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" onClick={() => setIsMobileDrawerOpen(false)} />
            <button onClick={() => setIsMobileDrawerOpen(false)} className="absolute right-4 top-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="h-4 w-4" /></button>
            {renderProfileDetailsCard(currentCustomer)}
          </div>
        </div>
      )}

      {/* LIVE ACTION TRIGGER DECK FORM ACTIONS MODAL */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !actionLoading && setActionModal({ isOpen: false, type: 'SUSPEND', customerId: null })} />
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 space-y-6 text-center animate-scaleUp">
            <div className={`mx-auto w-14 h-14 border flex items-center justify-center rounded-2xl ${actionModal.type === 'SUSPEND' || actionModal.type === 'REVOKE' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
              {actionModal.type === 'SUSPEND' && <Ban className="h-6 w-6 stroke-[2.5]" />}
              {actionModal.type === 'REVOKE' && <AlertTriangle className="h-6 w-6 stroke-[2.5]" />}
              {actionModal.type === 'ACTIVATE' && <ShieldCheck className="h-6 w-6 stroke-[2.5]" />}
              {actionModal.type === 'GRANT' && <Star className="h-6 w-6 stroke-[2.5] fill-emerald-500/20" />}
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                {actionModal.type === 'SUSPEND' && 'Confirm Account Suspension'}
                {actionModal.type === 'ACTIVATE' && 'Reactivate Account Status'}
                {actionModal.type === 'REVOKE' && 'Revoke VIP Privilege Tier'}
                {actionModal.type === 'GRANT' && 'Promote to VIP Tier'}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-2">
                {actionModal.type === 'SUSPEND' && 'Sigurado ka bang nais mong isuspinde ang account na ito? Hindi makakapag-checkout ng mga order ang customer habang naka-lock.'}
                {actionModal.type === 'ACTIVATE' && 'Nais mo bang ibalik sa normal ang account na ito upang payagan muli ang regular placement ng orders sa checkout channel.'}
                {actionModal.type === 'REVOKE' && 'Tatanggalin ang lahat ng Maya exclusive checkout promotional vouchers at privileges para sa account na ito.'}
                {actionModal.type === 'GRANT' && 'Ila-lock-in ang account na ito sa premium support metrics tiers at bibigyan ng system promotional checkout perks.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" disabled={actionLoading} onClick={() => setActionModal({ isOpen: false, type: 'SUSPEND', customerId: null })} className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition">Cancel</button>
              <button type="button" disabled={actionLoading} onClick={handleExecuteAction} className={`w-full py-3 text-white font-black text-xs rounded-xl shadow-md transition inline-flex items-center justify-center gap-1.5 ${actionModal.type === 'SUSPEND' || actionModal.type === 'REVOKE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}