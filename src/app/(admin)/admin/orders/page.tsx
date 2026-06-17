'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Search, Loader2, CheckCircle2, ShoppingBag, CreditCard, 
  User, MapPin, ChevronLeft, Printer, MessageSquare, 
  Clock, Flame, Check, AlertCircle, TrendingUp
} from 'lucide-react';

export default function LiveOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const tabs = ['All', 'Pending', 'Preparing', 'Ready', 'Completed'];

  useEffect(() => {
    async function fetchLiveOrders() {
      try {
        // Dataset formatted with strict timestamp auditing & micro-states
        const mockOrders = [
          {
            id: 'ORD-1250',
            status: 'Preparing',
            timeAgo: '15 mins ago',
            customerName: 'Mary Grace Alano',
            contactNumber: '+63 920 987 6543',
            address: 'Unit 4B, Burgundy Tower, Katipunan Ave, Quezon City',
            amount: 350.00,
            paymentMethod: 'Maya Wallet',
            txRef: 'MYA-102941X',
            auditState: 'PAID',
            history: { created: '11:15 PM', prepping: '11:20 PM', ready: '--', completed: '--' },
            dishes: [
              { name: 'Sizzling Pork Sisig', qty: 1, price: 220.00 },
              { name: 'Garlic Rice', qty: 2, price: 80.00 }
            ]
          },
          {
            id: 'ORD-1249',
            status: 'Pending',
            timeAgo: '24 mins ago',
            customerName: 'Kenneth Sison',
            contactNumber: '+63 917 123 4567',
            address: 'Block 3 Lot 12, White Plains, Quezon City',
            amount: 590.00,
            paymentMethod: 'Maya QR Ph',
            txRef: 'MYA-884219A',
            auditState: 'PAID',
            history: { created: '11:06 PM', prepping: '--', ready: '--', completed: '--' },
            dishes: [
              { name: 'Kare Kare Bagnet', qty: 1, price: 380.00 },
              { name: 'Pad Thai', qty: 1, price: 210.00 }
            ]
          },
          {
            id: 'ORD-1248',
            status: 'Pending',
            timeAgo: '1 hour ago',
            customerName: 'Patricia Mendoza',
            contactNumber: '+63 908 456 7890',
            address: '12 Pioneer St, Mandaluyong City',
            amount: 510.00,
            paymentMethod: 'Maya Card Checkout',
            txRef: 'MYA-332155Z',
            auditState: 'PAID',
            history: { created: '10:30 PM', prepping: '--', ready: '--', completed: '--' },
            dishes: [
              { name: 'Pho Bo (Beef Pho)', qty: 1, price: 290.00 },
              { name: 'Beef Banh Mi', qty: 1, price: 220.00 }
            ]
          }
        ];
        
        setOrders(mockOrders);
        if (mockOrders.length > 0) setSelectedOrder(mockOrders[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveOrders();
  }, []);

  // Compute live contextual counts dynamically for the navigation pill components
  const tabCounts = useMemo(() => {
    return {
      All: orders.length,
      Pending: orders.filter(o => o.status === 'Pending').length,
      Preparing: orders.filter(o => o.status === 'Preparing').length,
      Ready: orders.filter(o => o.status === 'Ready').length,
      Completed: orders.filter(o => o.status === 'Completed').length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handleStatusTransition = async (orderId: string, nextStatus: string) => {
    setUpdating(true);
    setTimeout(() => {
      const nowString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const updatedHistory = { ...o.history };
          if (nextStatus === 'Preparing') updatedHistory.prepping = nowString;
          if (nextStatus === 'Ready') updatedHistory.ready = nowString;
          if (nextStatus === 'Completed') updatedHistory.completed = nowString;
          return { ...o, status: nextStatus, history: updatedHistory };
        }
        return o;
      }));
      setSelectedOrder((prev: any) => {
        if (prev.id === orderId) {
          const updatedHistory = { ...prev.history };
          if (nextStatus === 'Preparing') updatedHistory.prepping = nowString;
          if (nextStatus === 'Ready') updatedHistory.ready = nowString;
          if (nextStatus === 'Completed') updatedHistory.completed = nowString;
          return { ...prev, status: nextStatus, history: updatedHistory };
        }
        return prev;
      });
      setUpdating(false);
    }, 600);
  };

  return (
    <div className="w-full mx-auto max-w-[1600px] h-[calc(100vh-110px)] flex flex-col space-y-5">
      
      {/* HEADER CONTROLS SECTION */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 ${viewMode === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Live Order Management 
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Real-time kitchen automation dashboard terminal
          </p>
        </div>

        {/* COMPACT TOP-BAR MINI KRAVE ANALYTICS */}
        <div className="flex gap-4 bg-white border border-slate-200/60 p-3 rounded-2xl shadow-sm max-w-max">
          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Avg. Prep Time</p>
            <p className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5 justify-center"><Clock className="h-3 w-3 text-indigo-500" /> 14.5m</p>
          </div>
          <div className="w-px bg-slate-100" />
          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Active Load</p>
            <p className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5 justify-center"><Flame className="h-3 w-3 text-amber-500" /> High</p>
          </div>
        </div>
      </div>

      {/* FILTER TABS & LIVE ROW QUERIES */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 ${viewMode === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
        {/* Advanced Horizontal Badged Pill Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 bg-slate-100 p-1.5 rounded-xl max-w-full custom-scrollbar">
          {tabs.map((tab) => {
            const count = tabCounts[tab as keyof typeof tabCounts] || 0;
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isTabActive 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                  isTabActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Input Filter bar */}
        <div className="relative w-full sm:max-w-xs md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID or Client..."
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-amber-500 transition shadow-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* TWO-COLUMN GRID VIEWPORT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden w-full">
        
        {/* ================= LEFT LIST CHANNEL ================= */}
        <div className={`lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar pb-6 ${viewMode === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-medium">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-amber-500 mb-2" /> Syncing cluster logs...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium shadow-sm">
              No orders matched this operational view.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setViewMode('detail'); }}
                  className={`bg-white border-2 rounded-2xl p-5 cursor-pointer shadow-sm transition-all flex flex-col gap-4 active:scale-[0.99] lg:active:scale-100 ${
                    isSelected ? 'border-orange-500 ring-2 ring-orange-500/5' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-sm tracking-tight">{order.id}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        order.status === 'Preparing' ? 'bg-indigo-50 text-indigo-600' : 
                        order.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 
                        order.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-600'
                      }`}>{order.status}</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">₱{order.amount.toFixed(2)}</span>
                  </div>

                  <div className="flex items-end justify-between text-xs font-medium">
                    <div className="text-slate-400 space-y-0.5">
                      <p className="text-slate-700 font-bold">{order.customerName}</p>
                      <p className="text-[10px] flex items-center gap-1"><Clock className="h-3 w-3" /> {order.timeAgo}</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{order.paymentMethod}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= RIGHT DETAIL WORKBENCH SHEET ================= */}
        <div className={`lg:col-span-7 h-full min-h-0 pb-6 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          {selectedOrder ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between overflow-y-auto custom-scrollbar gap-5">
              
              {/* TOP PROFILE CONTROL ACTION BAR */}
              <div className="space-y-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode('list')} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                        {selectedOrder.id}
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{selectedOrder.status}</span>
                      </h2>
                      <p className="text-[11px] text-slate-400 font-medium">Audited tracking log channel</p>
                    </div>
                  </div>

                  {/* KITCHEN KRAVE ACTION FLOW MACHINE */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button onClick={() => alert('Printing internal kitchen chit ticket...')} className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl transition" title="Print Invoice">
                      <Printer className="h-4 w-4" />
                    </button>
                    
                    {selectedOrder.status === 'Pending' && (
                      <button onClick={() => handleStatusTransition(selectedOrder.id, 'Preparing')} disabled={updating} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-40">
                        {updating ? 'Processing...' : 'Accept & Cook 🍳'}
                      </button>
                    )}
                    {selectedOrder.status === 'Preparing' && (
                      <button onClick={() => handleStatusTransition(selectedOrder.id, 'Ready')} disabled={updating} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-40">
                        {updating ? 'Processing...' : 'Mark as Ready 📦'}
                      </button>
                    )}
                    {selectedOrder.status === 'Ready' && (
                      <button onClick={() => handleStatusTransition(selectedOrder.id, 'Completed')} disabled={updating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-40">
                        {updating ? 'Processing...' : 'Dispatch Order ✔'}
                      </button>
                    )}
                  </div>
                </div>
                <hr className="border-slate-100" />
              </div>

              {/* CORE DATA LOG CONTROLS STACK */}
              <div className="space-y-4 flex-1">
                
                {/* ADVANCED TIMELINE PROGRESS STEPPER */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kitchen Milestone Pipeline</span>
                  <div className="grid grid-cols-4 text-center text-[10px] font-bold text-slate-400 relative">
                    <div className={selectedOrder.history.created !== '--' ? 'text-amber-600' : ''}>
                      <p className="font-black">● Received</p>
                      <p className="font-medium text-slate-400 mt-0.5">{selectedOrder.history.created}</p>
                    </div>
                    <div className={selectedOrder.history.prepping !== '--' ? 'text-indigo-600' : ''}>
                      <p className="font-black">● Prepping</p>
                      <p className="font-medium text-slate-400 mt-0.5">{selectedOrder.history.prepping}</p>
                    </div>
                    <div className={selectedOrder.history.ready !== '--' ? 'text-emerald-600' : ''}>
                      <p className="font-black">● Ready</p>
                      <p className="font-medium text-slate-400 mt-0.5">{selectedOrder.history.ready}</p>
                    </div>
                    <div className={selectedOrder.history.completed !== '--' ? 'text-slate-800' : ''}>
                      <p className="font-black">● Dispatched</p>
                      <p className="font-medium text-slate-400 mt-0.5">{selectedOrder.history.completed}</p>
                    </div>
                  </div>
                </div>

                {/* Identity Profiles card block */}
                <div className="bg-white border border-slate-200/70 p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 border-b pb-2 border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Client Identity logs</span>
                    </div>
                    <button onClick={() => alert(`Sending notification to ${selectedOrder.contactNumber}`)} className="text-[10px] text-amber-600 font-bold flex items-center gap-1 hover:underline">
                      <MessageSquare className="h-3 w-3" /> Notify Buyer
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold mb-0.5">Name</p>
                      <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-0.5">Contact Line</p>
                      <p className="font-bold text-slate-800 font-mono">{selectedOrder.contactNumber}</p>
                    </div>
                  </div>
                  <div className="text-xs pt-1">
                    <p className="text-slate-400 font-semibold mb-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" /> Drop-off Point</p>
                    <p className="font-bold text-slate-700 leading-relaxed">{selectedOrder.address}</p>
                  </div>
                </div>

                {/* Maya Processing Block */}
                <div className="bg-blue-50/20 border border-blue-100 p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-1.5 text-blue-600/90">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Gateway Audit Settlements</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Payment Engine Provider</p>
                      <p className="font-bold text-slate-700">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Maya Verification Hash</p>
                      <p className="font-bold text-slate-800 font-mono text-[11px] tracking-wide uppercase">{selectedOrder.txRef}</p>
                    </div>
                  </div>
                </div>

                {/* Food Discs Basket Mapping arrays */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dishes Basket Breakdown</span>
                  <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {selectedOrder.dishes.map((dish: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs font-bold">
                        <div className="text-slate-800 flex items-center gap-2">
                          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] font-black">{dish.qty}x</span>
                          <span className="tracking-tight">{dish.name}</span>
                        </div>
                        <span className="text-slate-900 font-black">₱{dish.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between font-black text-slate-900 text-sm pt-1.5 text-right">
                    <span className="text-xs text-slate-400 font-bold">Gross Total Value:</span>
                    <span>₱{selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs font-medium p-6 text-center">
              <ShoppingBag className="h-8 w-8 text-slate-300 mb-2 animate-bounce" />
              Select an item entry from the left queue to load terminal details
            </div>
          )}
        </div>

      </div>

    </div>
  );
}