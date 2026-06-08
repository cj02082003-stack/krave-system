'use client';

import React, { useState, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  type: 'Delivery' | 'Pickup';
  address?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Processing' | 'Pending Payment' | 'Failed';
  paymentMethod: string;
  mayaRef?: string;
  timePlaced: string;
  specialInstructions?: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1250',
    customerName: 'Mary Grace Alano',
    phone: '+63 920 987 6543',
    type: 'Delivery',
    address: 'Unit 4B, Burgundy Tower, Katipunan Ave, Quezon City',
    items: [
      { name: 'Sizzling Pork Sisig', qty: 1, price: 220 },
      { name: 'Garlic Rice', qty: 2, price: 40 },
    ],
    subtotal: 300,
    deliveryFee: 50,
    total: 350,
    status: 'Preparing',
    paymentStatus: 'Paid',
    paymentMethod: 'Maya Wallet',
    mayaRef: 'MYA-102941X',
    timePlaced: '15 mins ago',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Preparing' | 'Ready' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(INITIAL_ORDERS[0]);

  const updateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = { ...ord, status: nextStatus };
          if (selectedOrder?.id === orderId) setSelectedOrder(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const processedOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeFilter === 'All' || order.status === activeFilter;
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  return (
    <main className="flex-1 flex overflow-hidden h-full">
      {/* List Panel */}
      <div className="flex-grow w-1/2 flex flex-col border-r border-slate-100 overflow-y-auto">
        <div className="p-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10 space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Order Management</h2>
            <p className="text-xs text-slate-400">Track incoming customer orders and update kitchen queue states.</p>
          </div>

          <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
            {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {processedOrders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedOrder?.id === ord.id ? 'border-[#e0532b] bg-white ring-1 ring-[#e0532b]' : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono font-black text-sm text-slate-900">{ord.id}</span>
                <span className="font-extrabold text-sm text-slate-900">₱{ord.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Side Drawer */}
      <div className="hidden md:flex md:w-1/2 bg-white flex-col overflow-y-auto p-8 space-y-6">
        {selectedOrder ? (
          <>
            <div className="pb-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="font-mono font-black text-xl text-slate-900">{selectedOrder.id}</span>
                <p className="text-xs text-slate-400 mt-1">Placed {selectedOrder.timePlaced} via online portal</p>
              </div>
              <div className="flex gap-2">
                {selectedOrder.status === 'Pending' && (
                  <button onClick={() => updateOrderStatus(selectedOrder.id, 'Preparing')} className="bg-[#e0532b] text-white px-4 py-2 rounded-xl text-xs font-bold">Accept & Cook</button>
                )}
                {selectedOrder.status === 'Preparing' && (
                  <button onClick={() => updateOrderStatus(selectedOrder.id, 'Ready')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Mark as Ready</button>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs font-bold text-slate-900">Customer: {selectedOrder.customerName}</p>
              <p className="text-xs text-slate-500">{selectedOrder.phone}</p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <span className="text-5xl">👈</span>
            <p className="text-xs font-bold mt-3">Select an order card to inspect the transaction details.</p>
          </div>
        )}
      </div>
    </main>
  );
}