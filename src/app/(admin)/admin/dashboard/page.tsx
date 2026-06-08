'use client';

import React, { useState, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface Metric {
  value: string;
  change: string;
  isUp: boolean;
}

interface TimeframeData {
  stats: {
    totalOrders: Metric;
    totalRevenue: Metric;
    mayaShare: string;
    customers: Metric;
    pendingOrders: Metric;
  };
  chartPoints: { x: string; value: number; displayVal: string }[];
}

const TIMEFRAME_DATA: Record<'today' | 'week' | 'month', TimeframeData> = {
  today: {
    stats: {
      totalOrders: { value: '142', change: '+8.2% from yesterday', isUp: true },
      totalRevenue: { value: '₱18,450.00', change: '+11.5% from yesterday', isUp: true },
      mayaShare: '₱12,546.00 via Maya (68%)',
      customers: { value: '94', change: '+5.1% from yesterday', isUp: true },
      pendingOrders: { value: '6', change: '-2 from an hour ago', isUp: false },
    },
    chartPoints: [
      { x: '8 AM', value: 1200, displayVal: '₱1.2k' },
      { x: '11 AM', value: 4500, displayVal: '₱4.5k' },
      { x: '2 PM', value: 3800, displayVal: '₱3.8k' },
      { x: '5 PM', value: 5900, displayVal: '₱5.9k' },
      { x: '8 PM', value: 8100, displayVal: '₱8.1k' },
      { x: '11 PM', value: 2100, displayVal: '₱2.1k' },
    ]
  },
  week: {
    stats: {
      totalOrders: { value: '1,248', change: '+18.5% from last week', isUp: true },
      totalRevenue: { value: '₱148,780.00', change: '+22.3% from last week', isUp: true },
      mayaShare: '₱98,450.00 via Maya (66%)',
      customers: { value: '856', change: '+12.7% from last week', isUp: true },
      pendingOrders: { value: '32', change: '+4.3% from last week', isUp: true },
    },
    chartPoints: [
      { x: 'Mon', value: 15000, displayVal: '₱15k' },
      { x: 'Tue', value: 24000, displayVal: '₱24k' },
      { x: 'Wed', value: 28000, displayVal: '₱28k' },
      { x: 'Thu', value: 21000, displayVal: '₱21k' },
      { x: 'Fri', value: 32000, displayVal: '₱32k' },
      { x: 'Sat', value: 45000, displayVal: '₱45k' },
      { x: 'Sun', value: 38000, displayVal: '₱38k' },
    ]
  },
  month: {
    stats: {
      totalOrders: { value: '5,120', change: '+21.1% from last month', isUp: true },
      totalRevenue: { value: '₱612,400.00', change: '+25.4% from last month', isUp: true },
      mayaShare: '₱404,184.00 via Maya (66%)',
      customers: { value: '3,420', change: '+14.2% from last month', isUp: true },
      pendingOrders: { value: '118', change: '+6.1% from last month', isUp: true },
    },
    chartPoints: [
      { x: 'Week 1', value: 120000, displayVal: '₱120k' },
      { x: 'Week 2', value: 165000, displayVal: '₱165k' },
      { x: 'Week 3', value: 145000, displayVal: '₱145k' },
      { x: 'Week 4', value: 182400, displayVal: '₱182.4k' },
    ]
  }
};

const INITIAL_RECENT_ORDERS = [
  { id: '#ORD-1250', time: 'Today • 10:24 AM', items: '1x Sizzling Pork Sisig, 2x Garlic Rice', price: '₱300.00', status: 'Paid', gateway: 'Maya (Auth/Settle)', statusColor: 'emerald' },
  { id: '#ORD-1249', time: 'Today • 09:15 AM', items: '2x Krave Signature Burger, 1x Fries', price: '₱480.00', status: 'Processing', gateway: 'Maya (Pending)', statusColor: 'amber' },
  { id: '#ORD-1248', time: 'Yesterday • 06:45 PM', items: '1x Beef Kansi Hotpot, 3x Rice', price: '₱360.00', status: 'Pending Payment', gateway: 'Maya (Initiated)', statusColor: 'orange' },
];

const TOP_PRODUCTS = [
  { name: 'Krave Signature Burger', sold: 342, revenue: '₱102,600.00', image: '🍔' },
  { name: 'Sizzling Pork Sisig Skillet', sold: 294, revenue: '₱64,680.00', image: '🍳' },
];

const CATEGORY_DATA = [
  { name: 'Burgers & Sandwiches', percentage: 35, color: '#e0532b' },
  { name: 'Rice Meals', percentage: 40, color: '#f59e0b' },
  { name: 'Drinks & Shakes', percentage: 15, color: '#3b82f6' },
  { name: 'Sides & Skillets', percentage: 10, color: '#10b981' },
];

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');

  const currentData = TIMEFRAME_DATA[timeframe];

  const chartData = useMemo(() => {
    const pointsCount = currentData.chartPoints.length;
    const widthInterval = 700 / (pointsCount - 1 || 1);
    const values = currentData.chartPoints.map(p => p.value);
    const maxVal = Math.max(...values, 1000) * 1.15;

    const coords = currentData.chartPoints.map((pt, i) => {
      const cx = i * widthInterval;
      const cy = 210 - (pt.value / maxVal) * 160;
      return { cx, cy, label: pt.x, display: pt.displayVal };
    });

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.cx} ${c.cy}`).join(' ');
    const fillPath = coords.length > 0 ? `${linePath} L ${coords[coords.length - 1].cx} 220 L 0 220 Z` : '';

    return { coords, linePath, fillPath };
  }, [currentData]);

  const doughnutSegments = useMemo(() => {
    let cumulativePercent = 0;
    return CATEGORY_DATA.map((cat) => {
      const startPercent = cumulativePercent;
      cumulativePercent += cat.percentage;
      return { ...cat, startPercent };
    });
  }, []);

  return (
    <main className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Krave Kitchen Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track real-time orders, manage menus, and monitor Maya transactions.</p>
        </div>

        <div className="flex bg-white border border-slate-200/80 p-1 rounded-xl shadow-sm self-start">
          {['today', 'week', 'month'].map((opt) => (
            <button
              key={opt}
              onClick={() => setTimeframe(opt as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all capitalize ${
                timeframe === opt ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Total Orders</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{currentData.stats.totalOrders.value}</h3>
            <span className="text-[10px] font-bold mt-1.5 text-emerald-650">▲ {currentData.stats.totalOrders.change}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">📦</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Total Revenue</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{currentData.stats.totalRevenue.value}</h3>
            <p className="text-[9px] text-blue-600 font-bold mt-1.5 bg-blue-50/60 px-2 py-0.5 rounded-md">💳 {currentData.stats.mayaShare}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">₱</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Customers</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{currentData.stats.customers.value}</h3>
            <span className="text-[10px] font-bold text-emerald-650">▲ {currentData.stats.customers.change}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">👥</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Kitchen Queue</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#e0532b] mt-1">{currentData.stats.pendingOrders.value}</h3>
            <span className="text-[10px] font-bold text-amber-600">{currentData.stats.pendingOrders.change}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#e0532b] flex items-center justify-center text-lg">🍳</div>
        </div>
      </div>

      {/* Charts & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">Sales Trends</h4>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">PH Peso (₱) Scale</span>
          </div>

          <div className="w-full h-64 mt-6 relative">
            <svg viewBox="0 0 700 250" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0532b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#e0532b" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="700" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="110" x2="700" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="170" x2="700" y2="170" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="220" x2="700" y2="220" stroke="#e2e8f0" strokeWidth="1.5" />

              {chartData.fillPath && <path d={chartData.fillPath} fill="url(#chartGrad)" />}
              {chartData.linePath && <path d={chartData.linePath} fill="none" stroke="#e0532b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}

              {chartData.coords.map((node, index) => (
                <g key={index} className="group cursor-pointer">
                  <circle cx={node.cx} cy={node.cy} r="5.5" fill="white" stroke="#e0532b" strokeWidth="3.5" className="transition-all duration-150 group-hover:r-7" />
                  <text x={node.cx} y="240" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-400">{node.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">Recent Transactions</h4>
            <p className="text-xs text-slate-400 mt-1">Status feed from Maya gateway settlements.</p>

            <div className="mt-5 space-y-3.5 max-h-[250px] overflow-y-auto">
              {INITIAL_RECENT_ORDERS.map((ord) => (
                <div key={ord.id} className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-xs text-slate-800">{ord.id}</span>
                    <span className="font-extrabold text-xs text-slate-950">{ord.price}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">{ord.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}