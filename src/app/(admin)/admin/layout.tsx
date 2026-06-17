'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users2, 
  FolderHeart, BadgePercent, BarChart3, Settings, Bell, Menu, X, 
  LogOut, User, ShieldCheck, Clock, ChevronDown, AlertTriangle, Check, Trash2
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // =========================================================================
  // 🗄️ DATABASE CONNECTION READY STATES
  // =========================================================================
  const [adminUser, setAdminUser] = useState({
    fullName: 'Chef Krave Master',
    email: 'management@kravekitchen.ph',
    role: 'Store Owner',
    branch: 'Katipunan Main Branch',
    avatarInitials: 'KK'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #1042 queued from Katipunan branch', time: '5m ago', unread: true },
    { id: 2, text: 'Payout clearance settled: ₱341.25 transfer complete', time: '1h ago', unread: true },
    { id: 3, text: 'System dashboard theme updated by Super Admin', time: '2h ago', unread: false }
  ]);

  // SYSTEM DROPDOWN & MODAL INTERACTIVE TOGGLES
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // LIVE CLOCK ENGINE
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // SIDEBAR NAV MODULE REGISTER
  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders Queue', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Krave Menu', href: '/admin/products', icon: UtensilsCrossed },
    { name: 'Customers', href: '/admin/customers', icon: Users2 },
    { name: 'Categories', href: '/admin/categories', icon: FolderHeart },
    { name: 'Discounts', href: '/admin/discounts', icon: BadgePercent },
    { name: 'Reports Ledger', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // OUTSIDE CLICK DROPDOWN CLOSER SYSTEM
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const executeLogout = () => {
    setLogoutModalOpen(false);
    console.log('Database Session Exited safely.');
  };

  const renderSystemStatusWidget = () => (
    <div className="p-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl shrink-0 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#596643]" />
          <span className="text-white text-[10px] font-black tracking-wider uppercase">System Engine</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-black tracking-wide uppercase">Operational</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-[10px] text-slate-400 leading-normal font-medium">
          All payment terminals, storefront checkout nodes, and local kitchen pipelines are online.
        </p>
        
        <div className="flex items-center justify-between text-[9px] bg-slate-900/40 px-2.5 py-1.5 rounded-xl border border-slate-700/30 font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>Sync Time:</span>
          </div>
          <span className="text-white font-bold">{currentTime || '--:--:-- --'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex antialiased selection:bg-[#596643]/20">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen bg-[#1E293B] shrink-0 border-r border-slate-700/20 sticky top-0 z-50">
        <div className="h-24 flex items-center gap-4 px-6 border-b border-slate-700/30 shrink-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 border-slate-700/50 shadow-md bg-slate-800 transition-transform duration-300 hover:scale-105">
            <img src="/logo.jpg" alt="Krave Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[16px] text-white tracking-tight leading-tight">Krave Admin</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Management Suite</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-tight transition-all ${
                  isActive 
                    ? 'bg-[#596643] text-white shadow-md shadow-[#596643]/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/30">
          {renderSystemStatusWidget()}
        </div>
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex flex-col w-[280px] h-full bg-[#1E293B] shadow-2xl animate-slideIn">
            <div className="h-24 flex items-center justify-between px-6 border-b border-slate-700/30 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 border-slate-700/50 bg-slate-800">
                  <img src="/logo.jpg" alt="Krave Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-[16px] text-white tracking-tight leading-tight">Krave Admin</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Suite Mobile</span>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-tight transition-all ${
                      isActive ? 'bg-[#596643] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-700/30">
              {renderSystemStatusWidget()}
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTAINER & HEADER SYSTEM */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200/70 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-xs z-40 relative">
          
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition">
              <Menu className="h-5 w-5" />
            </button>
            <div className="items-center gap-2 hidden sm:flex">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Store Console:</span>
              <div className="bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wide border border-slate-200/60 shadow-inner">
                📍 {adminUser.branch}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* NOTIFICATION */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-xl border transition relative ${notifOpen ? 'bg-slate-100 border-slate-300 text-slate-800' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-orange-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2.5 z-50 animate-fadeIn w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-slate-800">System Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-[10px] text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1">
                        <Check className="h-3 w-3 stroke-[3]" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-50 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-[11px] text-slate-400 py-4 font-medium">All clear! No pending notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`pt-2 flex items-start justify-between gap-2 first:pt-0 ${n.unread ? 'bg-orange-50/40 p-1.5 rounded-lg' : ''}`}>
                          <div className="space-y-0.5">
                            <p className="text-[11px] text-slate-700 font-semibold leading-normal">{n.text}</p>
                            <span className="text-[9px] text-slate-400 font-bold tracking-tight block">{n.time}</span>
                          </div>
                          <button onClick={() => clearNotification(n.id)} className="text-slate-300 hover:text-rose-500 p-0.5 transition mt-0.5">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-6 w-px bg-slate-200" />
            
            {/* PROFILE DETAILED SELECTION DECK */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-3 text-left p-1.5 rounded-xl transition select-none ${profileOpen ? 'bg-slate-100 border-slate-300' : 'hover:bg-slate-50'}`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-sm border border-slate-700/10">
                  {adminUser.avatarInitials}
                </div>
                
                <div className="hidden md:block pr-1">
                  <p className="text-xs font-black text-slate-800 tracking-tight leading-none">{adminUser.fullName}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-[#596643] rounded-full" />
                    {adminUser.role}
                  </p>
                </div>
                
                <ChevronDown className={`h-3 w-3 text-slate-400 hidden md:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50 animate-fadeIn space-y-0.5">
                  <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                    <p className="text-xs font-black text-slate-800 leading-none truncate">{adminUser.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-1.5">{adminUser.email}</p>
                  </div>
                  
                  <div className="px-3 py-1.5 text-slate-400 font-bold uppercase tracking-wider text-[9px]">Account Operations</div>
                  
                  <Link 
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>View Profile Details</span>
                  </Link>

                  <hr className="border-slate-100 my-1" />

                  <button 
                    onClick={() => { setProfileOpen(false); setLogoutModalOpen(true); }} 
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* =========================================================================
            CLEAN CHILDREN INJECTION (Next.js routing captures loading state automatically)
            ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          {children}
        </main>
      </div>

      {/* 4. LOGOUT MODAL */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setLogoutModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 transform transition-all animate-scaleUp z-10 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Confirm Session Logout</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Krave Kitchen Administrative Panel</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-normal font-medium">
              Are you sure you want to terminate your current session? You will need to log in again with your credentials to access the order dispatch queue and database layout panels.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button onClick={() => setLogoutModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 transition">
                Cancel
              </button>
              <button onClick={executeLogout} className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/10 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}