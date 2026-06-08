'use client';

import React, { useState, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface CustomerOrder {
  orderId: string;
  date: string;
  total: number;
  paymentMethod: string;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'VIP' | 'Regular' | 'New';
  status: 'Active' | 'Suspended';
  joinDate: string;
  totalOrders: number;
  totalSpend: number;
  favoriteDish: string;
  avatarColor: string;
  orderHistory: CustomerOrder[];
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Mary Grace Alano',
    email: 'mary.grace@email.com',
    phone: '+63 920 987 6543',
    tier: 'VIP',
    status: 'Active',
    joinDate: 'Jan 15, 2025',
    totalOrders: 18,
    totalSpend: 8450,
    favoriteDish: '🍳 Sizzling Pork Sisig',
    avatarColor: 'bg-orange-500',
    orderHistory: [
      { orderId: 'ORD-1250', date: 'Today, 10:24 AM', total: 500, paymentMethod: 'Maya Wallet', status: 'Preparing' },
    ]
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTierFilter, setActiveTierFilter] = useState<'All' | 'VIP' | 'Regular' | 'New'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(INITIAL_CUSTOMERS[0]);

  const stats = useMemo(() => {
    const active = customers.filter(c => c.status === 'Active').length;
    const vips = customers.filter(c => c.tier === 'VIP').length;
    const totalSpendSum = customers.reduce((acc, curr) => acc + curr.totalSpend, 0);
    const averageLTV = customers.length ? totalSpendSum / customers.length : 0;

    return {
      total: customers.length,
      active,
      vips,
      avgLTV: averageLTV
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      const matchesTier = activeTierFilter === 'All' || cust.tier === activeTierFilter;
      const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [customers, activeTierFilter, searchQuery]);

  return (
    <main className="flex h-full overflow-hidden">
      {/* Customers List */}
      <div className="flex-grow w-1/2 flex flex-col border-r border-slate-100 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Accounts</h2>
          <p className="text-xs text-slate-400">Monitor loyal customers and analyze lifetime value metrics.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <p className="text-lg font-black text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VIPs</p>
            <p className="text-lg font-black text-amber-600 mt-1">{stats.vips}</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomer(cust)}
              className="p-4 bg-white rounded-xl border border-slate-150 cursor-pointer hover:border-slate-350 transition-all"
            >
              <p className="font-bold text-xs text-slate-900">{cust.name}</p>
              <p className="text-[10px] text-slate-400">{cust.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details Area */}
      <div className="hidden md:flex md:w-1/2 bg-white flex-col overflow-y-auto p-8">
        {selectedCustomer ? (
          <div className="space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base">{selectedCustomer.name}</h3>
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <p><strong>Join Date:</strong> {selectedCustomer.joinDate}</p>
              <p><strong>Favorite Dish:</strong> {selectedCustomer.favoriteDish}</p>
              <p><strong>LTV:</strong> ₱{selectedCustomer.totalSpend.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Select a customer profile to inspect purchase data.
          </div>
        )}
      </div>
    </main>
  );
}