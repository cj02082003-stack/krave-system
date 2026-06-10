// 'use client';

// import React, { useState, useMemo } from 'react';

// // --- TYPE DEFINITIONS & MOCK DATABASES ---
// interface OrderItem {
//   name: string;
//   qty: number;
//   price: number;
// }

// interface Order {
//   id: string;
//   customerName: string;
//   phone: string;
//   type: 'Delivery' | 'Pickup';
//   address?: string;
//   items: OrderItem[];
//   subtotal: number;
//   deliveryFee: number;
//   total: number;
//   status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
//   paymentStatus: 'Paid' | 'Processing' | 'Pending Payment' | 'Failed';
//   paymentMethod: string;
//   mayaRef?: string;
//   timePlaced: string;
//   specialInstructions?: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   category: 'Mains' | 'Sides' | 'Drinks' | 'Desserts';
//   price: number;
//   status: 'In Stock' | 'Low Stock' | 'Sold Out';
//   emoji: string;
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
// }

// interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   emoji: string;
//   status: 'Active' | 'Disabled';
//   productCount: number;
//   sortOrder: number;
// }

// interface Discount {
//   id: string;
//   code: string;
//   description: string;
//   type: 'Percentage' | 'Fixed Amount';
//   value: number;
//   minSpend: number;
//   status: 'Active' | 'Expired';
//   isMayaExclusive: boolean;
//   totalUsed: number;
//   limit: number;
// }

// const INITIAL_PRODUCTS: Product[] = [
//   { id: 'PROD-001', name: 'Sizzling Pork Sisig', description: 'Traditional pork hash on a screaming hot skillet.', category: 'Mains', price: 220, status: 'In Stock', emoji: '🍳' },
//   { id: 'PROD-002', name: 'Krave Signature Burger', description: 'Flame grilled double patty with cheddar melt.', category: 'Mains', price: 240, status: 'In Stock', emoji: '🍔' },
//   { id: 'PROD-003', name: 'Beef Kansi Hotpot', description: 'Sour beef soup infused with real batuan fruit.', category: 'Mains', price: 300, status: 'Sold Out', emoji: '🍲' },
//   { id: 'PROD-004', name: 'Crispy Garlic Fries', description: 'Thick cut fries tossed in roasted garlic & parsley.', category: 'Sides', price: 110, status: 'In Stock', emoji: '🍟' },
//   { id: 'PROD-005', name: 'Mango Taro Milkshake', description: 'Fresh sweet mangoes layered with authentic taro root.', category: 'Drinks', price: 150, status: 'In Stock', emoji: '🥤' }
// ];

// const INITIAL_ORDERS: Order[] = [
//   {
//     id: 'ORD-1250',
//     customerName: 'Mary Grace Alano',
//     phone: '+63 920 987 6543',
//     type: 'Delivery',
//     address: 'Unit 4B, Burgundy Tower, Katipunan Ave, Quezon City',
//     items: [
//       { name: 'Sizzling Pork Sisig', qty: 1, price: 220 },
//       { name: 'Garlic Rice', qty: 2, price: 40 }
//     ],
//     subtotal: 300,
//     deliveryFee: 50,
//     total: 350,
//     status: 'Preparing',
//     paymentStatus: 'Paid',
//     paymentMethod: 'Maya Wallet',
//     mayaRef: 'MYA-102941X',
//     timePlaced: '15 mins ago'
//   },
//   {
//     id: 'ORD-1249',
//     customerName: 'Kenneth Sison',
//     phone: '+63 917 123 4567',
//     type: 'Pickup',
//     items: [
//       { name: 'Krave Signature Burger', qty: 2, price: 240 },
//       { name: 'Crispy Garlic Fries', qty: 1, price: 110 }
//     ],
//     subtotal: 590,
//     deliveryFee: 0,
//     total: 590,
//     status: 'Pending',
//     paymentStatus: 'Processing',
//     paymentMethod: 'Maya QR Ph',
//     mayaRef: 'MYA-881249P',
//     timePlaced: '24 mins ago'
//   },
//   {
//     id: 'ORD-1248',
//     customerName: 'Patricia Mendoza',
//     phone: '+63 908 555 1212',
//     type: 'Delivery',
//     address: '22C Eastwood Mansion, Libis, Quezon City',
//     items: [
//       { name: 'Beef Kansi Hotpot', qty: 1, price: 300 },
//       { name: 'Mango Taro Milkshake', qty: 1, price: 150 }
//     ],
//     subtotal: 450,
//     deliveryFee: 60,
//     total: 510,
//     status: 'Pending',
//     paymentStatus: 'Pending Payment',
//     paymentMethod: 'Maya Card Checkout',
//     mayaRef: 'MYA-774902A',
//     timePlaced: '1 hour ago'
//   }
// ];

// const INITIAL_CUSTOMERS: Customer[] = [
//   { id: 'CUST-001', name: 'Mary Grace Alano', email: 'mary.grace@email.com', phone: '+63 920 987 6543', tier: 'VIP', status: 'Active', joinDate: 'Jan 15, 2025', totalOrders: 18, totalSpend: 8450, favoriteDish: '🍳 Sizzling Pork Sisig', avatarColor: 'bg-orange-500' },
//   { id: 'CUST-002', name: 'Kenneth Sison', email: 'ken.sison@gmail.com', phone: '+63 917 123 4567', tier: 'Regular', status: 'Active', joinDate: 'Feb 10, 2025', totalOrders: 9, totalSpend: 4120, favoriteDish: '🍔 Krave Signature Burger', avatarColor: 'bg-blue-500' },
//   { id: 'CUST-003', name: 'Patricia Mendoza', email: 'patricia.m@yahoo.com', phone: '+63 908 555 1212', tier: 'New', status: 'Active', joinDate: 'May 02, 2026', totalOrders: 2, totalSpend: 1100, favoriteDish: '🍲 Beef Kansi Hotpot', avatarColor: 'bg-purple-500' },
//   { id: 'CUST-004', name: 'Dino Macalintal', email: 'dino.mac@gmail.com', phone: '+63 945 990 1234', tier: 'Regular', status: 'Suspended', joinDate: 'Dec 05, 2024', totalOrders: 12, totalSpend: 5490, favoriteDish: '🍳 Sizzling Pork Sisig', avatarColor: 'bg-slate-500' }
// ];

// const INITIAL_CATEGORIES: Category[] = [
//   { id: 'CAT-001', name: 'Mains', slug: 'mains', description: 'Traditional Filipino plates & hot signature skillets.', emoji: '🍛', status: 'Active', productCount: 12, sortOrder: 1 },
//   { id: 'CAT-002', name: 'Sides', slug: 'sides', description: 'Perfect extra bites to pair with your rice and burgers.', emoji: '🍟', status: 'Active', productCount: 6, sortOrder: 2 },
//   { id: 'CAT-003', name: 'Drinks', slug: 'drinks', description: 'Fresh fruits milkshakes and carbonated beverages.', emoji: '🥤', status: 'Active', productCount: 8, sortOrder: 3 },
//   { id: 'CAT-004', name: 'Desserts', slug: 'desserts', description: 'Sweet treats to complete your Filipino feast.', emoji: '🍰', status: 'Active', productCount: 4, sortOrder: 4 }
// ];

// const INITIAL_DISCOUNTS: Discount[] = [
//   { id: 'DSC-001', code: 'KRAVEMAYA50', description: '₱50 off when checking out via Maya gateway.', type: 'Fixed Amount', value: 50, minSpend: 350, status: 'Active', isMayaExclusive: true, totalUsed: 142, limit: 500 },
//   { id: 'DSC-002', code: 'WELCOME10', description: '10% discount for first-time customer orders.', type: 'Percentage', value: 10, minSpend: 250, status: 'Active', isMayaExclusive: false, totalUsed: 89, limit: 1000 },
//   { id: 'DSC-003', code: 'KRAVESUNDAY', description: 'Get free delivery on Sundays over ₱600 checkout.', type: 'Fixed Amount', value: 60, minSpend: 600, status: 'Expired', isMayaExclusive: false, totalUsed: 300, limit: 300 }
// ];

// export default function App() {
//   // Navigation tabs emulation system
//   const [activeTab, setActiveTab] = useState<'Dashboard' | 'Orders' | 'Products' | 'Customers' | 'Categories' | 'Discounts' | 'Reports' | 'Settings'>('Dashboard');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [dbSyncing, setDbSyncing] = useState(false);
//   const [isMayaModalOpen, setIsMayaModalOpen] = useState(false);
//   const [mayaMode, setMayaMode] = useState<'sandbox' | 'production'>('sandbox');
//   const [toastMessage, setToastMessage] = useState<string | null>(null);

//   // Core system databases managed centrally
//   const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
//   const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
//   const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
//   const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
//   const [discounts, setDiscounts] = useState<Discount[]>(INITIAL_DISCOUNTS);

//   const triggerToast = (msg: string) => {
//     setToastMessage(msg);
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   const handleDBSync = () => {
//     setDbSyncing(true);
//     setTimeout(() => {
//       setDbSyncing(false);
//       triggerToast('Supabase database sync completed in real-time!');
//     }, 1200);
//   };

//   const navigationTabs = [
//     { name: 'Dashboard', icon: '📊' },
//     { name: 'Orders', icon: '🛒', badge: orders.filter(o => o.status === 'Pending').length.toString() },
//     { name: 'Products', icon: '🍲' },
//     { name: 'Customers', icon: '👥' },
//     { name: 'Categories', icon: '📁' },
//     { name: 'Discounts', icon: '🏷️' },
//     { name: 'Reports', icon: '📈' },
//     { name: 'Settings', icon: '⚙️' },
//   ];

//   return (
//     <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      
//       {/* Toast Alert Banner */}
//       {toastMessage && (
//         <div className="fixed top-5 right-5 z-[100] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center space-x-2 animate-fadeIn">
//           <span className="text-[#e0532b]">🔥</span>
//           <span>{toastMessage}</span>
//         </div>
//       )}

//       {/* --- DESKTOP/MOBILE SIDEBAR --- */}
//       {/* Ginawa nating dynamic height (h-screen / lg:h-full) at flexbox structure para hindi maputol ang footer */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-screen lg:h-full bg-[#0a0f1d] text-white flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
//         {/* Top Half Section (Header + Scrollable Nav Links) */}
//         <div className="flex flex-col flex-1 min-h-0">
          
//           {/* Brand Header - Naka-set sa shrink-0 para palaging fixed sa taas */}
//           <div className="shrink-0 p-6 border-b border-slate-800/60 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="h-9 w-9 rounded-xl bg-[#e0532b] flex items-center justify-center shadow-md shadow-[#e0532b]/25">
//                 <span className="text-lg">🔥</span>
//               </div>
//               <div>
//                 <h1 className="font-bold text-sm tracking-wider text-white">KRAVE KITCHEN</h1>
//                 <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Admin Desk</p>
//               </div>
//             </div>
//             <button 
//               onClick={() => setIsMobileMenuOpen(false)} 
//               className="lg:hidden text-slate-400 hover:text-white transition-all text-sm p-1.5 rounded-lg bg-slate-800/30"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Navigation Links - Ginawang flex-1 at overflow-y-auto para ito lang ang mag-scroll kung maliit ang screen */}
//           <nav className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
//             {navigationTabs.map((tab) => {
//               const isActive = activeTab === tab.name;
//               return (
//                 <button
//                   key={tab.name}
//                   onClick={() => {
//                     setActiveTab(tab.name as any);
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
//                     isActive
//                       ? 'bg-[#e0532b] text-white font-bold shadow-lg shadow-[#e0532b]/15'
//                       : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <span className="text-base">{tab.icon}</span>
//                     <span>{tab.name}</span>
//                   </div>
//                   {tab.badge && tab.badge !== '0' && (
//                     <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white text-[#e0532b]' : 'bg-red-500 text-white'}`}>
//                       {tab.badge}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Global Maya Integration Footer - Naka-set sa shrink-0 para nakapako palagi sa ilalim kahit gaano kahaba ang nav links */}
//         <div className="shrink-0 p-4 border-t border-slate-800/60 bg-[#0a0f1d]/95 backdrop-blur-sm">
//           <div 
//             onClick={() => setIsMayaModalOpen(true)}
//             className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800/60 border border-slate-800/80 cursor-pointer hover:border-[#e0532b]/40 transition-all group text-left"
//           >
//             <span className="text-[11px] font-bold text-[#e0532b] flex items-center gap-1.5 group-hover:text-white transition-colors">
//               💳 Maya Gateway Active
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//             </span>
//             <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
//               Verify Webhooks, Sandbox logs, and instant settlements.
//             </p>
//             <button 
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsMayaModalOpen(true);
//               }}
//               className="w-full mt-3 bg-slate-800 hover:bg-[#e0532b] hover:text-white text-white text-[10px] py-2 rounded-lg font-bold transition-all"
//             >
//               Settlement Settings
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* --- MAIN CORE SYSTEM WORKSPACE --- */}
//       <div className="flex-1 flex flex-col overflow-hidden">
        
//         {/* --- REUSABLE GLOBAL HEADER --- */}
//         <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)} 
//               className="lg:hidden text-slate-600 hover:text-slate-900 focus:outline-none p-1.5 hover:bg-slate-100 rounded-lg transition-all text-xl"
//             >
//               ☰
//             </button>
//             <span className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">Krave Kitchen Hub</span>
//           </div>

//           <div className="flex items-center space-x-4 sm:space-x-6">
//             {/* Realtime Supabase Sync Controller */}
//             <button 
//               onClick={handleDBSync}
//               className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
//                 dbSyncing 
//                   ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse' 
//                   : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
//               }`}
//             >
//               <span className={`h-1.5 w-1.5 rounded-full ${dbSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
//               {dbSyncing ? 'Syncing Supabase...' : 'Realtime DB Connected'}
//             </button>

//             <div className="relative cursor-pointer hover:text-slate-900 text-slate-600 transition-colors">
//               <span className="text-xl">🔔</span>
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
//                 {orders.filter(o => o.status === 'Pending').length}
//               </span>
//             </div>

//             {/* Profile Detail */}
//             <div className="flex items-center space-x-3 pl-4 border-l border-slate-100">
//               <div className="h-8 w-8 rounded-full bg-[#e0532b]/10 text-[#e0532b] flex items-center justify-center font-extrabold text-xs border border-[#e0532b]/25">JD</div>
//               <div className="hidden md:block text-left">
//                 <p className="text-xs font-bold text-slate-800 leading-none">Juan Dela Cruz</p>
//                 <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Kitchen Admin</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* --- DYNAMIC CHILD PAGES INSTANTIATION --- */}
//         <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
//           {activeTab === 'Dashboard' && (
//             <AdminDashboard 
//               products={products} 
//               orders={orders} 
//               customers={customers} 
//               onNavigate={setActiveTab}
//             />
//           )}
//           {activeTab === 'Orders' && (
//             <OrdersPage 
//               orders={orders} 
//               setOrders={setOrders} 
//               triggerToast={triggerToast}
//             />
//           )}
//           {activeTab === 'Products' && (
//             <ProductsPage 
//               products={products} 
//               setProducts={setProducts} 
//               triggerToast={triggerToast}
//             />
//           )}
//           {activeTab === 'Customers' && (
//             <CustomersPage 
//               customers={customers} 
//               setCustomers={setCustomers} 
//               orders={orders}
//               triggerToast={triggerToast}
//             />
//           )}
//           {activeTab === 'Categories' && (
//             <CategoriesPage 
//               categories={categories} 
//               setCategories={setCategories} 
//               products={products}
//               triggerToast={triggerToast}
//             />
//           )}
//           {activeTab === 'Discounts' && (
//             <DiscountsPage 
//               discounts={discounts} 
//               setDiscounts={setDiscounts} 
//               triggerToast={triggerToast}
//             />
//           )}
//           {activeTab === 'Reports' && (
//             <ReportsPage 
//               orders={orders}
//             />
//           )}
//           {activeTab === 'Settings' && (
//             <SettingsPage 
//               mayaMode={mayaMode} 
//               setMayaMode={setMayaMode} 
//               triggerToast={triggerToast}
//             />
//           )}
//         </div>

//       </div>

//       {/* --- GLOBAL MAYA STATUS MODAL --- */}
//       {isMayaModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 shadow-xl overflow-hidden text-left">
            
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center space-x-2.5">
//                 <span className="text-xl">💳</span>
//                 <div>
//                   <h3 className="font-extrabold text-slate-900 text-sm">Maya Settlement Live Status</h3>
//                   <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Gateway Connection Active</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsMayaModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
//                 <div className="flex justify-between font-bold text-slate-700">
//                   <span>Merchant ID</span>
//                   <span className="font-mono">MID-KRAVE-902813</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-slate-700">
//                   <span>Current Mode</span>
//                   <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] uppercase font-black">{mayaMode === 'sandbox' ? 'Sandbox' : 'Production'}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-slate-700">
//                   <span>Active Webhooks</span>
//                   <span className="text-emerald-600 flex items-center gap-1 font-bold">
//                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//                     Operational (Status 200)
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Recent Settlement Audits</h4>
//                 <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
//                   {[
//                     { date: 'Today • 03:00 AM', amt: '₱12,546.00', status: 'Settled', id: 'SET-9018A' },
//                     { date: 'Yesterday • 03:00 AM', amt: '₱24,850.00', status: 'Settled', id: 'SET-8812B' },
//                     { date: 'June 02 • 03:00 AM', amt: '₱18,290.00', status: 'Settled', id: 'SET-7729C' }
//                   ].map((log) => (
//                     <div key={log.id} className="flex justify-between items-center text-xs p-2.5 bg-[#f8fafc] border border-slate-100 rounded-lg">
//                       <div>
//                         <p className="font-bold text-slate-800">{log.amt}</p>
//                         <p className="text-[9px] text-slate-400">{log.date} • {log.id}</p>
//                       </div>
//                       <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">{log.status}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsMayaModalOpen(false)}
//                   className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
//                 >
//                   Close Audit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsMayaModalOpen(false);
//                     setActiveTab('Settings');
//                   }}
//                   className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
//                 >
//                   Gateway Config Settings
//                 </button>
//               </div>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// // ==========================================
// // 1. DASHBOARD COMPONENT
// // ==========================================
// interface DashboardProps {
//   products: Product[];
//   orders: Order[];
//   customers: Customer[];
//   onNavigate: (tab: any) => void;
// }

// function AdminDashboard({ products, orders, customers, onNavigate }: DashboardProps) {
//   const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');

//   const stats = useMemo(() => {
//     const totalOrdersCount = orders.length;
//     const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
    
//     // Revenue calculations
//     const revenueSum = orders
//       .filter(o => o.paymentStatus === 'Paid')
//       .reduce((sum, current) => sum + current.total, 0);
    
//     const mayaRevenue = orders
//       .filter(o => o.paymentStatus === 'Paid' && o.paymentMethod.startsWith('Maya'))
//       .reduce((sum, current) => sum + current.total, 0);

//     const formatCurrency = (val: number) => `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//     return {
//       totalOrders: totalOrdersCount.toString(),
//       totalRevenue: formatCurrency(revenueSum),
//       mayaShare: `${formatCurrency(mayaRevenue)} via Maya (${Math.round((mayaRevenue / (revenueSum || 1)) * 100)}%)`,
//       customersCount: customers.length.toString(),
//       pendingOrders: pendingOrdersCount.toString(),
//     };
//   }, [orders, customers]);

//   // Vector graphics calculations for trend line graph
//   const salesGraphPoints = useMemo(() => {
//     const dataPoints = [
//       { day: 'Mon', val: 8000 },
//       { day: 'Tue', val: 18000 },
//       { day: 'Wed', val: 14000 },
//       { day: 'Thu', val: 26000 },
//       { day: 'Fri', val: 21000 },
//       { day: 'Sat', val: 32000 },
//       { day: 'Sun', val: 28000 },
//     ];
    
//     const maxVal = Math.max(...dataPoints.map(p => p.val)) * 1.15;
//     const width = 600;
//     const height = 180;
    
//     const mapped = dataPoints.map((dp, i) => {
//       const x = (i / (dataPoints.length - 1)) * width;
//       const y = height - (dp.val / maxVal) * height + 10;
//       return { ...dp, x, y };
//     });

//     const linePath = mapped.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
//     const areaPath = `${linePath} L ${mapped[mapped.length - 1].x} ${height + 20} L ${mapped[0].x} ${height + 20} Z`;

//     return { mapped, linePath, areaPath };
//   }, []);

//   return (
//     <main className="p-6 space-y-6">
      
//       {/* Upper Grid Title */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Krave Kitchen Dashboard</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Track real-time orders, manage menus, and monitor Maya transactions.</p>
//         </div>

//         <div className="flex bg-white border border-slate-200/80 p-1 rounded-xl shadow-sm self-start">
//           {['today', 'week', 'month'].map((opt) => (
//             <button
//               key={opt}
//               onClick={() => setTimeframe(opt as any)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all capitalize ${
//                 timeframe === opt ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Metrics Row */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
//         {/* Metric Card: Orders */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Total Orders</p>
//             <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalOrders}</h3>
//             <span className="text-[10px] font-bold mt-1.5 text-emerald-600 block">▲ +18.5% from last week</span>
//           </div>
//           <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">📦</div>
//         </div>

//         {/* Metric Card: Revenue */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Total Revenue</p>
//             <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalRevenue}</h3>
//             <p className="text-[9px] text-blue-600 font-bold mt-1.5 bg-blue-50/60 px-2 py-0.5 rounded-md">💳 {stats.mayaShare}</p>
//           </div>
//           <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">₱</div>
//         </div>

//         {/* Metric Card: Customers */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Customers</p>
//             <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.customersCount}</h3>
//             <span className="text-[10px] font-bold mt-1.5 text-emerald-600 block">▲ +12.7% from last week</span>
//           </div>
//           <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">👥</div>
//         </div>

//         {/* Metric Card: Queue */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Kitchen Queue</p>
//             <h3 className="text-xl sm:text-2xl font-black text-[#e0532b] mt-1">{stats.pendingOrders}</h3>
//             <span className="text-[10px] font-bold mt-1.5 text-amber-600 block">▲ +4.3% from last week</span>
//           </div>
//           <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#e0532b] flex items-center justify-center text-lg">🍳</div>
//         </div>

//       </div>

//       {/* Graphs & Live Feeds Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* SVG Graphic Area Chart */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
//           <div className="flex items-center justify-between">
//             <h4 className="font-extrabold text-sm sm:text-base text-slate-900">Sales Trend Analysis</h4>
//             <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">Weekly Gross Scale</span>
//           </div>

//           <div className="w-full h-48 mt-4 relative">
//             <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
//               <defs>
//                 <linearGradient id="dashboardGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#e0532b" stopOpacity="0.25" />
//                   <stop offset="100%" stopColor="#e0532b" stopOpacity="0.00" />
//                 </linearGradient>
//               </defs>
//               <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
//               <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
//               <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

//               <path d={salesGraphPoints.areaPath} fill="url(#dashboardGrad)" />
//               <path d={salesGraphPoints.linePath} fill="none" stroke="#e0532b" strokeWidth="3" strokeLinecap="round" />

//               {salesGraphPoints.mapped.map((pt, i) => (
//                 <g key={i} className="group cursor-pointer">
//                   <circle cx={pt.x} cy={pt.y} r="5" fill="white" stroke="#e0532b" strokeWidth="3" />
//                   <text x={pt.x} y="195" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-400">{pt.day}</text>
//                 </g>
//               ))}
//             </svg>
//           </div>
//         </div>

//         {/* Recent Orders Overview Feed */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
//           <div>
//             <div className="flex items-center justify-between">
//               <h4 className="font-extrabold text-sm sm:text-base text-slate-900">Recent Transactions</h4>
//               <button onClick={() => onNavigate('Orders')} className="text-xs font-bold text-[#e0532b] hover:underline">View All</button>
//             </div>
            
//             <div className="mt-4 space-y-3.5">
//               {orders.slice(0, 3).map((ord) => (
//                 <div key={ord.id} className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100 flex justify-between items-center text-xs">
//                   <div>
//                     <span className="font-mono font-bold text-slate-800">{ord.id}</span>
//                     <p className="text-[10px] text-slate-400 mt-0.5">{ord.customerName} • {ord.timePlaced}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-slate-900">₱{ord.total.toFixed(2)}</p>
//                     <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
//                       ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
//                     }`}>
//                       {ord.paymentStatus}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </main>
//   );
// }

// // ==========================================
// // 2. ORDERS MANAGEMENT PAGE
// // ==========================================
// interface OrdersPageProps {
//   orders: Order[];
//   setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
//   triggerToast: (msg: string) => void;
// }

// function OrdersPage({ orders, setOrders, triggerToast }: OrdersPageProps) {
//   const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Preparing' | 'Ready' | 'Completed'>('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

//   const updateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
//     // 1. Update the parent orders array state cleanly
//     setOrders((prev) =>
//       prev.map((ord) => ord.id === orderId ? { ...ord, status: nextStatus } : ord)
//     );
    
//     // 2. Update the local selected order state safely outside the loop
//     if (selectedOrder?.id === orderId) {
//       setSelectedOrder(prev => prev ? { ...prev, status: nextStatus } : null);
//     }
    
//     triggerToast(`Order ${orderId} has been moved to ${nextStatus}.`);
//   };

//   const filteredOrdersList = useMemo(() => {
//     return orders.filter((order) => {
//       const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
//       const matchesSearch =
//         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesFilter && matchesSearch;
//     });
//   }, [orders, activeFilter, searchQuery]);

//   return (
//     <main className="flex h-full overflow-hidden">
      
//       {/* Left List Pane */}
//       <div className="flex-grow w-1/2 flex flex-col border-r border-slate-100 overflow-y-auto">
//         <div className="p-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10 space-y-4">
//           <div>
//             <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Order Management</h2>
//             <p className="text-xs text-slate-400">Track incoming customer orders and update kitchen queue states.</p>
//           </div>

//           <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
//             {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveFilter(tab as any)}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
//                   activeFilter === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="relative">
//             <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">🔍</span>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by Order ID or Client Name..."
//               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//             />
//           </div>
//         </div>

//         {/* Incoming Cards Scroll */}
//         <div className="p-6 space-y-4">
//           {filteredOrdersList.map((ord) => (
//             <div
//               key={ord.id}
//               onClick={() => setSelectedOrder(ord)}
//               className={`p-5 rounded-2xl border transition-all cursor-pointer ${
//                 selectedOrder?.id === ord.id 
//                   ? 'border-[#e0532b] bg-white ring-1 ring-[#e0532b] shadow-md shadow-[#e0532b]/5' 
//                   : 'bg-white border-slate-150 hover:border-slate-300'
//               }`}
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <span className="font-mono font-black text-sm text-slate-900">{ord.id}</span>
//                     <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
//                       ord.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
//                       ord.status === 'Preparing' ? 'bg-indigo-150 text-indigo-800 bg-indigo-50' :
//                       ord.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
//                     }`}>
//                       {ord.status}
//                     </span>
//                   </div>
//                   <p className="text-[10px] text-slate-400 mt-1">{ord.customerName} • {ord.timePlaced}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-extrabold text-sm text-slate-950">₱{ord.total.toFixed(2)}</p>
//                   <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md inline-block mt-1">{ord.paymentMethod}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Details Panel Drawer */}
//       <div className="hidden md:flex md:w-1/2 bg-white flex-col overflow-y-auto p-8 space-y-6">
//         {selectedOrder ? (
//           <>
//             <div className="pb-6 border-b border-slate-100 flex justify-between items-start">
//               <div>
//                 <span className="font-mono font-black text-xl text-slate-900">{selectedOrder.id}</span>
//                 <p className="text-xs text-slate-400 mt-1">Placed {selectedOrder.timePlaced} via online portal</p>
//               </div>
              
//               {/* Context-driven kitchen action buttons */}
//               <div className="flex gap-2">
//                 {selectedOrder.status === 'Pending' && (
//                   <button 
//                     onClick={() => updateOrderStatus(selectedOrder.id, 'Preparing')}
//                     className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#e0532b]/20"
//                   >
//                     Accept & Cook 🍳
//                   </button>
//                 )}
//                 {selectedOrder.status === 'Preparing' && (
//                   <button 
//                     onClick={() => updateOrderStatus(selectedOrder.id, 'Ready')}
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
//                   >
//                     Mark as Ready 📦
//                   </button>
//                 )}
//                 {selectedOrder.status === 'Ready' && (
//                   <button 
//                     onClick={() => updateOrderStatus(selectedOrder.id, 'Completed')}
//                     className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
//                   >
//                     Complete Order ✓
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Customer Details Sheet */}
//             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//               <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Client Identity</h4>
//               <div className="grid grid-cols-2 gap-4 text-xs">
//                 <div>
//                   <p className="text-slate-400">Name</p>
//                   <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-400">Contact Number</p>
//                   <p className="font-bold text-slate-800">{selectedOrder.phone}</p>
//                 </div>
//                 {selectedOrder.type === 'Delivery' && (
//                   <div className="col-span-2">
//                     <p className="text-slate-400">Delivery Address</p>
//                     <p className="font-bold text-slate-800 leading-normal">{selectedOrder.address}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Maya Audit Logs */}
//             <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2.5">
//               <h4 className="text-[10px] font-black uppercase text-blue-800 tracking-wider">💳 Maya Settlement Logs</h4>
//               <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
//                 <div>
//                   <p className="text-slate-450 text-[10px] font-bold">Transaction Reference</p>
//                   <p className="font-mono font-bold mt-0.5">{selectedOrder.mayaRef || 'Not Assigned'}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-450 text-[10px] font-bold">Gateway Audit State</p>
//                   <p className="font-extrabold mt-0.5 text-blue-700 uppercase tracking-tight">{selectedOrder.paymentStatus}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Items Summary Ledger */}
//             <div className="space-y-4">
//               <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Dishes List</h4>
//               <div className="divide-y divide-slate-100">
//                 {selectedOrder.items.map((it, idx) => (
//                   <div key={idx} className="py-3 flex justify-between items-center text-xs">
//                     <span className="font-bold text-slate-800">{it.qty}x <span className="font-medium text-slate-750">{it.name}</span></span>
//                     <span className="font-extrabold text-slate-900">₱{(it.qty * it.price).toFixed(2)}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
//             <span className="text-5xl">👈</span>
//             <p className="text-xs font-bold mt-3">Select an order card to inspect the transaction details.</p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// // ==========================================
// // 3. PRODUCTS MANAGEMENT PAGE
// // ==========================================
// interface ProductsProps {
//   products: Product[];
//   setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
//   triggerToast: (msg: string) => void;
// }

// function ProductsPage({ products, setProducts, triggerToast }: ProductsProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState<'All' | 'Mains' | 'Sides' | 'Drinks'>('All');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   // Form Fields
//   const [formName, setFormName] = useState('');
//   const [formPrice, setFormPrice] = useState(100);
//   const [formCategory, setFormCategory] = useState<'Mains' | 'Sides' | 'Drinks'>('Mains');
//   const [formDesc, setFormDesc] = useState('');
//   const [formEmoji, setFormEmoji] = useState('🍲');

//   const openAddModal = () => {
//     setEditingProduct(null);
//     setFormName('');
//     setFormPrice(100);
//     setFormCategory('Mains');
//     setFormDesc('');
//     setFormEmoji('🍲');
//     setIsModalOpen(true);
//   };

//   const openEditModal = (p: Product) => {
//     setEditingProduct(p);
//     setFormName(p.name);
//     setFormPrice(p.price);
//     setFormCategory(p.category as any);
//     setFormDesc(p.description);
//     setFormEmoji(p.emoji);
//     setIsModalOpen(true);
//   };

//   const handleSaveProduct = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingProduct) {
//       setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, name: formName, price: formPrice, category: formCategory, description: formDesc, emoji: formEmoji } : p));
//       triggerToast(`Successfully modified menu item: ${formName}.`);
//     } else {
//       const newProd: Product = {
//         id: `PROD-${Date.now().toString().slice(-3)}`,
//         name: formName,
//         price: formPrice,
//         category: formCategory,
//         description: formDesc,
//         emoji: formEmoji,
//         status: 'In Stock'
//       };
//       setProducts(prev => [...prev, newProd]);
//       triggerToast(`Successfully added new food option: ${formName}!`);
//     }
//     setIsModalOpen(false);
//   };

//   const deleteProduct = (id: string, name: string) => {
//     setProducts(prev => prev.filter(p => p.id !== id));
//     triggerToast(`Dish ${name} removed from active menu list.`);
//   };

//   const toggleStockStatus = (id: string, currentStatus: Product['status']) => {
//     const next: Product['status'] = currentStatus === 'In Stock' ? 'Sold Out' : 'In Stock';
//     setProducts(prev => prev.map(p => p.id === id ? { ...p, status: next } : p));
//     triggerToast(`Availability toggled to ${next}.`);
//   };

//   const filteredProducts = useMemo(() => {
//     return products.filter((prod) => {
//       const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
//       const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [products, activeCategory, searchQuery]);

//   return (
//     <main className="p-6 space-y-6">
      
//       {/* Title Controls */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Menu Listings</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Edit store dishes, adjust real-time stock levels, and customize descriptions.</p>
//         </div>
//         <button 
//           onClick={openAddModal}
//           className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#e0532b]/15"
//         >
//           <span>+ Add New Dish</span>
//         </button>
//       </div>

//       {/* Categories Filtering Widgets */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
//         <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
//           {['All', 'Mains', 'Sides', 'Drinks'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveCategory(tab as any)}
//               className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
//                 activeCategory === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="relative">
//           <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">🔍</span>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search active menu list..."
//             className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//           />
//         </div>
//       </div>

//       {/* Main Table Layout */}
//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               <th className="py-4 px-6">Product Details</th>
//               <th className="py-4 px-4">Price</th>
//               <th className="py-4 px-4">Availability</th>
//               <th className="py-4 px-6 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {filteredProducts.map((p) => (
//               <tr key={p.id} className="group hover:bg-slate-50/20 transition-all">
//                 <td className="py-4 px-6 flex items-center space-x-3">
//                   <span className="text-2xl p-1.5 bg-slate-50 rounded-xl border border-slate-100">{p.emoji}</span>
//                   <div>
//                     <span className="text-xs font-bold text-slate-950 block">{p.name}</span>
//                     <span className="text-[10px] text-slate-400 block max-w-sm truncate mt-0.5">{p.description}</span>
//                   </div>
//                 </td>
//                 <td className="py-4 px-4 text-xs font-extrabold text-slate-900">₱{p.price.toFixed(2)}</td>
//                 <td className="py-4 px-4">
//                   <button 
//                     onClick={() => toggleStockStatus(p.id, p.status)}
//                     className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
//                       p.status === 'In Stock' 
//                         ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
//                         : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
//                     }`}
//                   >
//                     {p.status}
//                   </button>
//                 </td>
//                 <td className="py-4 px-6 text-right space-x-3">
//                   <button onClick={() => openEditModal(p)} className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
//                   <button onClick={() => deleteProduct(p.id, p.name)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add / Edit Dialog Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
//           <form onSubmit={handleSaveProduct} className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl overflow-hidden text-left">
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="font-extrabold text-slate-900 text-sm">
//                 {editingProduct ? 'Modify Dish Config' : 'Add New Food Option'}
//               </h3>
//               <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Icon</label>
//                   <input
//                     type="text"
//                     required
//                     maxLength={2}
//                     value={formEmoji}
//                     onChange={(e) => setFormEmoji(e.target.value)}
//                     className="w-full text-center px-2 py-2 border border-slate-200 rounded-xl text-lg"
//                   />
//                 </div>
//                 <div className="col-span-2 space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dish Name</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. Sizzling Sisig"
//                     value={formName}
//                     onChange={(e) => setFormName(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price (₱)</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formPrice}
//                     onChange={(e) => setFormPrice(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</label>
//                   <select
//                     value={formCategory}
//                     onChange={(e) => setFormCategory(e.target.value as any)}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   >
//                     <option value="Mains">Mains</option>
//                     <option value="Sides">Sides</option>
//                     <option value="Drinks">Drinks</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
//                 <textarea
//                   rows={2}
//                   required
//                   placeholder="Ingredients, presentation styles..."
//                   value={formDesc}
//                   onChange={(e) => setFormDesc(e.target.value)}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                 />
//               </div>
//             </div>

//             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
//               <button 
//                 type="button" 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit"
//                 className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#e0532b]/20"
//               >
//                 Save configurations
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//     </main>
//   );
// }

// // ==========================================
// // 4. CUSTOMERS PAGE
// // ==========================================
// interface CustomersProps {
//   customers: Customer[];
//   setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
//   orders: Order[];
//   triggerToast: (msg: string) => void;
// }

// function CustomersPage({ customers, setCustomers, orders, triggerToast }: CustomersProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

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

//   const toggleCustomerStatus = (id: string, currentStatus: Customer['status']) => {
//     const next: Customer['status'] = currentStatus === 'Active' ? 'Suspended' : 'Active';
    
//     // 1. Update parent customers database state
//     setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: next } : c));
    
//     // 2. Safely sync local detail display customer focus
//     if (selectedCustomer?.id === id) {
//       setSelectedCustomer(prev => prev ? { ...prev, status: next } : null);
//     }
    
//     triggerToast(`Customer status updated to ${next}.`);
//   };

//   const promoteToVIP = (id: string, currentTier: Customer['tier']) => {
//     const next: Customer['tier'] = currentTier === 'VIP' ? 'Regular' : 'VIP';
    
//     // 1. Update parent customers loyalty tier state
//     setCustomers(prev => prev.map(c => c.id === id ? { ...c, tier: next } : c));
    
//     // 2. Safely sync local focus
//     if (selectedCustomer?.id === id) {
//       setSelectedCustomer(prev => prev ? { ...prev, tier: next } : null);
//     }
    
//     triggerToast(`Customer loyalty updated to ${next}.`);
//   };

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(cust => 
//       cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       cust.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [customers, searchQuery]);

//   return (
//     <main className="flex h-full overflow-hidden">
      
//       {/* Left List Pane */}
//       <div className="flex-grow w-1/2 flex flex-col border-r border-slate-100 overflow-y-auto p-6 space-y-6">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Accounts</h2>
//           <p className="text-xs text-slate-400">Monitor loyal customers and analyze lifetime value metrics.</p>
//         </div>

//         {/* Dynamic Analytics Header */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
//             <p className="text-lg font-black text-slate-800 mt-1">{stats.total}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
//             <p className="text-lg font-black text-emerald-600 mt-1">{stats.active}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VIP Tier</p>
//             <p className="text-lg font-black text-amber-600 mt-1">{stats.vips}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left col-span-2 md:col-span-1">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Spend LTV</p>
//             <p className="text-lg font-black text-slate-800 mt-1">₱{stats.avgLTV.toFixed(0)}</p>
//           </div>
//         </div>

//         <div className="relative">
//           <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">🔍</span>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search accounts directory..."
//             className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//           />
//         </div>

//         {/* Directory Row Cards */}
//         <div className="space-y-3">
//           {filteredCustomers.map((cust) => (
//             <div
//               key={cust.id}
//               onClick={() => setSelectedCustomer(cust)}
//               className={`p-4 bg-white rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
//                 selectedCustomer?.id === cust.id ? 'border-[#e0532b] shadow-md shadow-[#e0532b]/5' : 'border-slate-150 hover:border-slate-350'
//               }`}
//             >
//               <div className="flex items-center space-x-3 text-left">
//                 <div className={`h-8 w-8 rounded-full ${cust.avatarColor} text-white flex items-center justify-center text-xs font-extrabold`}>
//                   {cust.name.slice(0, 2).toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-bold text-xs text-slate-900">{cust.name}</p>
//                   <p className="text-[10px] text-slate-400 mt-0.5">{cust.email}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
//                   cust.tier === 'VIP' ? 'bg-amber-100 text-amber-800' :
//                   cust.tier === 'Regular' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
//                 }`}>
//                   {cust.tier}
//                 </span>
//                 <p className="text-[10px] font-black text-slate-800 mt-1">₱{cust.totalSpend.toLocaleString()}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Detail Pane Drawer */}
//       <div className="hidden md:flex md:w-1/2 bg-white flex-col overflow-y-auto p-8 text-left">
//         {selectedCustomer ? (
//           <div className="space-y-6">
            
//             {/* Header Identity */}
//             <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
//               <div className={`h-14 w-14 rounded-full ${selectedCustomer.avatarColor} text-white flex items-center justify-center text-xl font-extrabold`}>
//                 {selectedCustomer.name.slice(0,2).toUpperCase()}
//               </div>
//               <div>
//                 <h3 className="font-extrabold text-slate-900 text-base">{selectedCustomer.name}</h3>
//                 <p className="text-xs text-slate-400 mt-1">Member since {selectedCustomer.joinDate}</p>
//               </div>
//             </div>

//             {/* Profile Meta Info */}
//             <div className="grid grid-cols-2 gap-4 text-xs">
//               <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
//                 <p className="text-slate-400">Email Address</p>
//                 <p className="font-bold text-slate-800 mt-1">{selectedCustomer.email}</p>
//               </div>
//               <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
//                 <p className="text-slate-400">Mobile Phone</p>
//                 <p className="font-bold text-slate-800 mt-1">{selectedCustomer.phone}</p>
//               </div>
//             </div>

//             {/* Detailed Loyalty Card */}
//             <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Customer Loyalty Segment</p>
//                 <p className="text-xs text-slate-650 mt-1 font-medium">VIP Tier rewards include Maya exclusive checkout vouchers.</p>
//               </div>
//               <button
//                 onClick={() => promoteToVIP(selectedCustomer.id, selectedCustomer.tier)}
//                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
//                   selectedCustomer.tier === 'VIP' ? 'bg-slate-900 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'
//                 }`}
//               >
//                 {selectedCustomer.tier === 'VIP' ? 'Revoke VIP Privilege' : 'Grant VIP Badge 👑'}
//               </button>
//             </div>

//             {/* Direct account locks */}
//             <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-black uppercase text-rose-800 tracking-wider">Emergency Account Constraints</p>
//                 <p className="text-xs text-slate-650 mt-1 font-medium">Suspend account to block checkout requests instantly.</p>
//               </div>
//               <button
//                 onClick={() => toggleCustomerStatus(selectedCustomer.id, selectedCustomer.status)}
//                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
//                   selectedCustomer.status === 'Active' ? 'bg-rose-650 bg-red-600 text-white' : 'bg-slate-900 text-white'
//                 }`}
//               >
//                 {selectedCustomer.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
//               </button>
//             </div>

//           </div>
//         ) : (
//           <div className="h-full flex items-center justify-center text-slate-400 text-center">
//             Select a customer profile card to inspect their loyalty status.
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// // ==========================================
// // 5. CATEGORIES PAGE
// // ==========================================
// interface CategoriesProps {
//   categories: Category[];
//   setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
//   products: Product[];
//   triggerToast: (msg: string) => void;
// }

// function CategoriesPage({ categories, setCategories, products, triggerToast }: CategoriesProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);

//   // Form Fields
//   const [formName, setFormName] = useState('');
//   const [formSlug, setFormSlug] = useState('');
//   const [formEmoji, setFormEmoji] = useState('🍛');
//   const [formDesc, setFormDesc] = useState('');
//   const [formSortOrder, setFormSortOrder] = useState(1);

//   const openAddModal = () => {
//     setEditingCategory(null);
//     setFormName('');
//     setFormSlug('');
//     setFormEmoji('🍛');
//     setFormDesc('');
//     setFormSortOrder(1);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (c: Category) => {
//     setEditingCategory(c);
//     setFormName(c.name);
//     setFormSlug(c.slug);
//     setFormEmoji(c.emoji);
//     setFormDesc(c.description);
//     setFormSortOrder(c.sortOrder);
//     setIsModalOpen(true);
//   };

//   const handleSaveCategory = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingCategory) {
//       setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: formName, slug: formSlug, emoji: formEmoji, description: formDesc, sortOrder: formSortOrder } : c));
//       triggerToast(`Category "${formName}" updated.`);
//     } else {
//       const newCat: Category = {
//         id: `CAT-${Date.now().toString().slice(-3)}`,
//         name: formName,
//         slug: formSlug,
//         emoji: formEmoji,
//         description: formDesc,
//         sortOrder: formSortOrder,
//         productCount: 0,
//         status: 'Active'
//       };
//       setCategories(prev => [...prev, newCat]);
//       triggerToast(`New category "${formName}" added.`);
//     }
//     setIsModalOpen(false);
//   };

//   const deleteCategory = (id: string, name: string) => {
//     // Safety check constraint
//     const linkedDishes = products.filter(p => p.category.toLowerCase() === name.toLowerCase());
//     if (linkedDishes.length > 0) {
//       triggerToast(`Cannot delete category "${name}" because ${linkedDishes.length} products are linked to it.`);
//       return;
//     }
//     setCategories(prev => prev.filter(c => c.id !== id));
//     triggerToast(`Category "${name}" removed from catalog.`);
//   };

//   const toggleCategoryStatus = (id: string, currentStatus: Category['status']) => {
//     const next: Category['status'] = currentStatus === 'Active' ? 'Disabled' : 'Active';
//     setCategories(prev => prev.map(c => c.id === id ? { ...c, status: next } : c));
//     triggerToast(`Category visibility toggled to ${next}.`);
//   };

//   return (
//     <main className="p-6 space-y-6">
      
//       {/* Title */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Categories Layout</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Manage storefront catalog sections, sort order, and menu display toggles.</p>
//         </div>
//         <button 
//           onClick={openAddModal}
//           className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#e0532b]/15"
//         >
//           <span>+ Add Category</span>
//         </button>
//       </div>

//       {/* Grid Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {categories.map((cat) => (
//           <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
//             <div className="flex justify-between items-start">
//               <div className="flex items-center space-x-3 text-left">
//                 <span className="text-3xl p-2 bg-slate-50 border border-slate-100 rounded-2xl">{cat.emoji}</span>
//                 <div>
//                   <h4 className="font-extrabold text-sm text-slate-900">{cat.name}</h4>
//                   <span className="text-[10px] font-mono font-bold text-slate-400">/{cat.slug}</span>
//                 </div>
//               </div>
//               <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
//                 cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-150 text-slate-600'
//               }`}>
//                 {cat.status}
//               </span>
//             </div>

//             <p className="text-xs text-slate-450 text-left line-clamp-2 leading-relaxed min-h-[32px]">{cat.description}</p>

//             <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
//               <span className="font-semibold text-slate-600">Priority: <span className="font-extrabold">#{cat.sortOrder}</span></span>
//               <div className="space-x-3 font-bold">
//                 <button onClick={() => toggleCategoryStatus(cat.id, cat.status)} className="text-slate-400 hover:text-slate-650">Toggle</button>
//                 <button onClick={() => openEditModal(cat)} className="text-indigo-600 hover:underline">Edit</button>
//                 <button onClick={() => deleteCategory(cat.id, cat.name)} className="text-red-600 hover:underline">Delete</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Categories Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
//           <form onSubmit={handleSaveCategory} className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl overflow-hidden text-left">
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="font-extrabold text-slate-900 text-sm">
//                 {editingCategory ? 'Modify Catalog Section' : 'Deploy Menu Category'}
//               </h3>
//               <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Emoji Icon</label>
//                   <input
//                     type="text"
//                     required
//                     maxLength={2}
//                     value={formEmoji}
//                     onChange={(e) => setFormEmoji(e.target.value)}
//                     className="w-full text-center px-2 py-2 border border-slate-200 rounded-xl text-lg"
//                   />
//                 </div>
//                 <div className="col-span-2 space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section Title</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. Mains, Skillets"
//                     value={formName}
//                     onChange={(e) => {
//                       setFormName(e.target.value);
//                       setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
//                     }}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Slug URL</label>
//                   <input
//                     type="text"
//                     required
//                     readOnly
//                     placeholder="Auto generated slug"
//                     value={formSlug}
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-450"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sorting weight</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formSortOrder}
//                     onChange={(e) => setFormSortOrder(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section Brief Description</label>
//                 <textarea
//                   rows={2}
//                   required
//                   placeholder="Appears on the digital menu layout..."
//                   value={formDesc}
//                   onChange={(e) => setFormDesc(e.target.value)}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                 />
//               </div>
//             </div>

//             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
//               <button 
//                 type="button" 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit"
//                 className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#e0532b]/20"
//               >
//                 Save Category
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//     </main>
//   );
// }

// // ==========================================
// // 6. DISCOUNTS PAGE
// // ==========================================
// interface DiscountsProps {
//   discounts: Discount[];
//   setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
//   triggerToast: (msg: string) => void;
// }

// function DiscountsPage({ discounts, setDiscounts, triggerToast }: DiscountsProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

//   // Form Fields
//   const [formCode, setFormCode] = useState('');
//   const [formDesc, setFormDesc] = useState('');
//   const [formType, setFormType] = useState<'Percentage' | 'Fixed Amount'>('Fixed Amount');
//   const [formValue, setFormValue] = useState(50);
//   const [formMinSpend, setFormMinSpend] = useState(350);
//   const [formLimit, setFormLimit] = useState(100);
//   const [formMayaExclusive, setFormMayaExclusive] = useState(false);

//   const stats = useMemo(() => {
//     const active = discounts.filter(d => d.status === 'Active').length;
//     const totalMaya = discounts.filter(d => d.isMayaExclusive).length;
//     const savingsSaved = discounts.reduce((acc, curr) => acc + (curr.totalUsed * curr.value), 0);

//     return {
//       active,
//       totalMaya,
//       savingsSaved: `₱${savingsSaved.toLocaleString()}`
//     };
//   }, [discounts]);

//   const openAddModal = () => {
//     setEditingDiscount(null);
//     setFormCode('');
//     setFormDesc('');
//     setFormType('Fixed Amount');
//     setFormValue(50);
//     setFormMinSpend(350);
//     setFormLimit(100);
//     setFormMayaExclusive(false);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (d: Discount) => {
//     setEditingDiscount(d);
//     setFormCode(d.code);
//     setFormDesc(d.description);
//     setFormType(d.type);
//     setFormValue(d.value);
//     setFormMinSpend(d.minSpend);
//     setFormLimit(d.limit);
//     setFormMayaExclusive(d.isMayaExclusive);
//     setIsModalOpen(true);
//   };

//   const handleSaveDiscount = (e: React.FormEvent) => {
//     e.preventDefault();
//     const formattedCode = formCode.toUpperCase().replace(/\s+/g, '');
//     if (editingDiscount) {
//       setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? { ...d, code: formattedCode, description: formDesc, type: formType, value: formValue, minSpend: formMinSpend, limit: formLimit, isMayaExclusive: formMayaExclusive } : d));
//       triggerToast(`Campaign coupon "${formattedCode}" modified successfully.`);
//     } else {
//       const newDsc: Discount = {
//         id: `DSC-${Date.now().toString().slice(-3)}`,
//         code: formattedCode,
//         description: formDesc,
//         type: formType,
//         value: formValue,
//         minSpend: formMinSpend,
//         status: 'Active',
//         isMayaExclusive: formMayaExclusive,
//         totalUsed: 0,
//         limit: formLimit
//       };
//       setDiscounts(prev => [...prev, newDsc]);
//       triggerToast(`Campaign promotion "${formattedCode}" deployed live.`);
//     }
//     setIsModalOpen(false);
//   };

//   const deleteDiscount = (id: string, code: string) => {
//     setDiscounts(prev => prev.filter(d => d.id !== id));
//     triggerToast(`Promo campaign ${code} deleted.`);
//   };

//   const toggleDiscountStatus = (id: string, currentStatus: Discount['status']) => {
//     const next: Discount['status'] = currentStatus === 'Active' ? 'Expired' : 'Active';
//     setDiscounts(prev => prev.map(d => d.id === id ? { ...d, status: next } : d));
//     triggerToast(`Promo state changed to ${next}.`);
//   };

//   return (
//     <main className="p-6 space-y-6">
      
//       {/* Title */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Promos & Discounts</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Deploy digital vouchers, minimum spend limits, and exclusive Maya offers.</p>
//         </div>
//         <button 
//           onClick={openAddModal}
//           className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#e0532b]/15"
//         >
//           <span>+ New Campaign</span>
//         </button>
//       </div>

//       {/* Analytics Widgets */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</p>
//           <p className="text-lg font-black text-slate-800 mt-1">{stats.active}</p>
//         </div>
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maya Exclusives</p>
//           <p className="text-lg font-black text-blue-600 mt-1">{stats.totalMaya}</p>
//         </div>
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cumulative Saved Value</p>
//           <p className="text-lg font-black text-emerald-600 mt-1">{stats.savingsSaved}</p>
//         </div>
//       </div>

//       {/* Campaigns list Table */}
//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-left">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               <th className="py-4 px-6">Coupon Offer</th>
//               <th className="py-4 px-4 text-center">Environment</th>
//               <th className="py-4 px-4 text-center">Limits Usage</th>
//               <th className="py-4 px-4 text-center">Usage Progress</th>
//               <th className="py-4 px-6 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {discounts.map((disc) => {
//               const usagePercent = Math.min(100, Math.round((disc.totalUsed / disc.limit) * 100));
//               return (
//                 <tr key={disc.id} className="group hover:bg-slate-50/20 transition-all text-xs">
//                   <td className="py-4 px-6 max-w-sm">
//                     <div className="flex items-center space-x-2">
//                       <span className="font-mono font-black text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-800">{disc.code}</span>
//                       <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
//                         disc.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-150 text-slate-600'
//                       }`}>
//                         {disc.status}
//                       </span>
//                     </div>
//                     <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-medium">{disc.description}</p>
//                   </td>
//                   <td className="py-4 px-4 text-center font-bold">
//                     {disc.isMayaExclusive ? (
//                       <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">💳 Maya Pay Only</span>
//                     ) : (
//                       <span className="text-[9px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-wider">Standard Channel</span>
//                     )}
//                   </td>
//                   <td className="py-4 px-4 text-center font-extrabold text-slate-800">
//                     {disc.totalUsed} / {disc.limit}
//                   </td>
//                   <td className="py-4 px-4 max-w-[100px]">
//                     <div className="flex items-center space-x-2">
//                       <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
//                         <div 
//                           className={`h-full ${disc.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}
//                           style={{ width: `${usagePercent}%` }}
//                         />
//                       </div>
//                       <span className="font-bold text-[10px] text-slate-500">{usagePercent}%</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-right space-x-3 font-bold">
//                     <button onClick={() => toggleDiscountStatus(disc.id, disc.status)} className="text-slate-400 hover:text-slate-650">Toggle</button>
//                     <button onClick={() => openEditModal(disc)} className="text-indigo-600 hover:underline">Edit</button>
//                     <button onClick={() => deleteDiscount(disc.id, disc.code)} className="text-red-600 hover:underline">Delete</button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Campaigns Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
//           <form onSubmit={handleSaveDiscount} className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl overflow-hidden text-left">
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="font-extrabold text-slate-900 text-sm">
//                 {editingDiscount ? 'Modify Discount Campaign' : 'Create Live Promo Campaign'}
//               </h3>
//               <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Promo Coupon Code</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. KRAVEMAYA50"
//                   value={formCode}
//                   onChange={(e) => setFormCode(e.target.value)}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20 uppercase"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Discount Type</label>
//                   <select
//                     value={formType}
//                     onChange={(e) => setFormType(e.target.value as any)}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   >
//                     <option value="Fixed Amount">Fixed Amount (₱)</option>
//                     <option value="Percentage">Percentage (%)</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Discount Value</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formValue}
//                     onChange={(e) => setFormValue(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min. Spend required (₱)</label>
//                   <input
//                     type="number"
//                     required
//                     min={0}
//                     value={formMinSpend}
//                     onChange={(e) => setFormMinSpend(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max Redemptions Limit</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formLimit}
//                     onChange={(e) => setFormLimit(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Campaign Description</label>
//                 <textarea
//                   rows={2}
//                   required
//                   placeholder="Terms & Conditions or description brief..."
//                   value={formDesc}
//                   onChange={(e) => setFormDesc(e.target.value)}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//                 />
//               </div>

//               {/* Toggle environment exclusively for Maya */}
//               <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
//                 <div>
//                   <h4 className="text-xs font-bold text-slate-800">Exclusive to Maya Gateways</h4>
//                   <p className="text-[9px] text-slate-450 mt-0.5">Voucher will only apply if paid via Maya.</p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setFormMayaExclusive(!formMayaExclusive)}
//                   className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
//                     formMayaExclusive ? 'bg-blue-600' : 'bg-slate-200'
//                   }`}
//                 >
//                   <span
//                     className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                       formMayaExclusive ? 'translate-x-4' : 'translate-x-0'
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
//               <button 
//                 type="button" 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit"
//                 className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#e0532b]/20"
//               >
//                 Deploy Campaign
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//     </main>
//   );
// }

// // ==========================================
// // 7. REPORTS PAGE
// // ==========================================
// interface ReportsProps {
//   orders: Order[];
// }

// function ReportsPage({ orders }: ReportsProps) {
//   const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('week');
//   const [exportingType, setExportingType] = useState<string | null>(null);

//   const reportsData = useMemo(() => {
//     // Basic sums
//     const grossSales = orders
//       .filter(o => o.paymentStatus === 'Paid')
//       .reduce((sum, current) => sum + current.total, 0);
    
//     const mayaFees = orders
//       .filter(o => o.paymentStatus === 'Paid' && o.paymentMethod.startsWith('Maya'))
//       .reduce((sum, current) => sum + current.total * 0.025, 0); // Simulated 2.5% MDR fee rate

//     const netSales = grossSales - mayaFees;
//     const avgOrderValue = orders.length ? grossSales / orders.length : 0;

//     return {
//       grossSales,
//       netSales,
//       mayaFees,
//       avgOrderValue
//     };
//   }, [orders]);

//   const handleExport = (type: 'pdf' | 'csv') => {
//     setExportingType(type);
//     setTimeout(() => {
//       setExportingType(null);
//     }, 1500);
//   };

//   return (
//     <main className="p-6 space-y-6">
      
//       {/* Title */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Business Reports Hub</h2>
//           <p className="text-xs text-slate-400 mt-0.5">Audit payouts, net restaurant sales performance, and Maya billing schedules.</p>
//         </div>

//         <div className="flex bg-white border border-slate-200/80 p-1 rounded-xl shadow-sm self-start">
//           {['today', 'week', 'month', 'year'].map((opt) => (
//             <button
//               key={opt}
//               onClick={() => setTimeframe(opt as any)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all capitalize ${
//                 timeframe === opt ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Reports Metric Cards Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1 text-left">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Gross Revenue</span>
//           <p className="text-lg sm:text-2xl font-black text-slate-900">₱{reportsData.grossSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//         </div>
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1 text-left">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Net Payouts</span>
//           <p className="text-lg sm:text-2xl font-black text-emerald-600">₱{reportsData.netSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//         </div>
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1 text-left">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Maya MDR Fees (2.5%)</span>
//           <p className="text-lg sm:text-2xl font-black text-blue-600">₱{reportsData.mayaFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//         </div>
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1 text-left">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Avg Order Value</span>
//           <p className="text-lg sm:text-2xl font-black text-slate-800">₱{reportsData.avgOrderValue.toFixed(2)}</p>
//         </div>
//       </div>

//       {/* Analytics Vector and export buttons */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* Mock Graphic breakdown of payouts */}
//         <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
//           <div className="flex justify-between items-center">
//             <h4 className="font-extrabold text-sm text-slate-900">Maya Settlement MDR Leakage</h4>
//             <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">MDR Audited</span>
//           </div>

//           <div className="relative h-24 flex items-end space-x-3 text-center">
//             <div className="flex-1 flex flex-col justify-end space-y-1 h-full">
//               <div className="bg-slate-100 rounded-lg h-[80%] flex items-end justify-center">
//                 <div className="bg-[#e0532b] rounded-lg w-full h-[97.5%] flex items-center justify-center text-[10px] text-white font-extrabold">97.5%</div>
//               </div>
//               <span className="text-[9px] font-extrabold text-slate-400">Net Merchant Settlement</span>
//             </div>
//             <div className="flex-1 flex flex-col justify-end space-y-1 h-full max-w-[120px]">
//               <div className="bg-slate-100 rounded-lg h-[15%] flex items-end justify-center">
//                 <div className="bg-blue-500 rounded-lg w-full h-full flex items-center justify-center text-[9px] text-white font-extrabold">2.5%</div>
//               </div>
//               <span className="text-[9px] font-extrabold text-slate-400">Maya MDR</span>
//             </div>
//           </div>
//         </div>

//         {/* Ledger Export Options card */}
//         <div className="bg-white p-6 rounded-2xl border border-[#f1f5f9] shadow-sm flex flex-col justify-between space-y-4">
//           <div className="text-left">
//             <h4 className="font-extrabold text-sm text-slate-900">Export Ledger Sheets</h4>
//             <p className="text-xs text-slate-400 mt-1">Export transaction sheets directly for municipal taxing compliance.</p>
//           </div>

//           <div className="space-y-2">
//             <button
//               onClick={() => handleExport('pdf')}
//               disabled={exportingType !== null}
//               className="w-full bg-[#0a0f1d] hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
//             >
//               {exportingType === 'pdf' ? '⏳ Generating PDF Document...' : '📄 Export as PDF Document'}
//             </button>
//             <button
//               onClick={() => handleExport('csv')}
//               disabled={exportingType !== null}
//               className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all border border-slate-200"
//             >
//               {exportingType === 'csv' ? '⏳ Compiling Excel Sheets...' : '📊 Export as CSV Sheets'}
//             </button>
//           </div>
//         </div>

//       </div>

//     </main>
//   );
// }

// // ==========================================
// // 8. SETTINGS PAGE
// // ==========================================
// interface SettingsProps {
//   mayaMode: 'sandbox' | 'production';
//   setMayaMode: (mode: 'sandbox' | 'production') => void;
//   triggerToast: (msg: string) => void;
// }

// function SettingsPage({ mayaMode, setMayaMode, triggerToast }: SettingsProps) {
//   const [storeName, setStoreName] = useState('Krave Kitchen');
//   const [storeContact, setStoreContact] = useState('+63 917 555 9988');
//   const [storeAddress, setStoreAddress] = useState('Katipunan Ave, Quezon City, Metro Manila');
//   const [isOpen, setIsOpen] = useState(true);

//   // API configurations
//   const [publicKey, setPublicKey] = useState('pk-Z09YgM14X9A07149021873109381273918');
//   const [secretKey, setSecretKey] = useState('sk-A81HjN30198031803123891028301928312');
//   const [showKeys, setShowKeys] = useState(false);

//   // Sound Config
//   const [orderSoundAlert, setOrderSoundAlert] = useState(true);

//   const handleSaveSettings = (e: React.FormEvent) => {
//     e.preventDefault();
//     triggerToast('System credentials and settings successfully saved!');
//   };

//   return (
//     <main className="p-6 max-w-4xl space-y-6 text-left">
      
//       {/* Title */}
//       <div>
//         <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
//         <p className="text-xs text-slate-400 mt-0.5">Configure restaurant operational states and Maya Checkout parameters.</p>
//       </div>

//       <form onSubmit={handleSaveSettings} className="space-y-6">
        
//         {/* Operational Configs */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
//           <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Operational Configurations</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Public Name</label>
//               <input
//                 type="text"
//                 required
//                 value={storeName}
//                 onChange={(e) => setStoreName(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Contact Phone</label>
//               <input
//                 type="text"
//                 required
//                 value={storeContact}
//                 onChange={(e) => setStoreContact(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//               />
//             </div>
//             <div className="md:col-span-2 space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Outlet Address</label>
//               <input
//                 type="text"
//                 required
//                 value={storeAddress}
//                 onChange={(e) => setStoreAddress(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//               />
//             </div>
//           </div>

//           <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
//             <div>
//               <h4 className="text-xs font-bold text-slate-800">Store Ordering State</h4>
//               <p className="text-[10px] text-slate-450 mt-0.5">Lock checkout operations instantly during kitchen downtime.</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => setIsOpen(!isOpen)}
//               className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
//                 isOpen ? 'bg-emerald-500' : 'bg-slate-200'
//               }`}
//             >
//               <span
//                 className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                   isOpen ? 'translate-x-4' : 'translate-x-0'
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Maya API Configurations */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
//           <div className="flex justify-between items-center border-b border-slate-50 pb-2">
//             <h3 className="font-extrabold text-sm text-slate-900">Maya API Gateway Credentials</h3>
//             <button
//               type="button"
//               onClick={() => setShowKeys(!showKeys)}
//               className="text-xs font-extrabold text-[#e0532b]"
//             >
//               {showKeys ? '🔒 Hide Secret keys' : '👁️ View Secret keys'}
//             </button>
//           </div>

//           {/* Toggle environments */}
//           <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
//             <div>
//               <p className="font-bold text-slate-800">Gateway Sandbox Mode</p>
//               <p className="text-[9px] text-slate-450">Production key transfers charge actual money.</p>
//             </div>
//             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
//               <button
//                 type="button"
//                 onClick={() => setMayaMode('sandbox')}
//                 className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
//                   mayaMode === 'sandbox' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'
//                 }`}
//               >
//                 Sandbox
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setMayaMode('production')}
//                 className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
//                   mayaMode === 'production' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'
//                 }`}
//               >
//                 Production
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Gateway Key</label>
//               <input
//                 type={showKeys ? 'text' : 'password'}
//                 required
//                 value={publicKey}
//                 onChange={(e) => setPublicKey(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Gateway Key</label>
//               <input
//                 type={showKeys ? 'text' : 'password'}
//                 required
//                 value={secretKey}
//                 onChange={(e) => setSecretKey(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Browser Settings Alerts */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
//           <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Kitchen Notifications Alerts</h3>
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="text-xs font-bold text-slate-800">New Order Chime Notification</h4>
//               <p className="text-[10px] text-slate-400 mt-0.5">Plays alert sound on tablet when checkout webhook triggers paid order.</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => setOrderSoundAlert(!orderSoundAlert)}
//               className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
//                 orderSoundAlert ? 'bg-emerald-500' : 'bg-slate-200'
//               }`}
//             >
//               <span
//                 className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                   orderSoundAlert ? 'translate-x-4' : 'translate-x-0'
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Save button */}
//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#e0532b]/20"
//           >
//             Deploy Settings & Configurations
//           </button>
//         </div>

//       </form>
//     </main>
//   );
// }

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users2, 
  FolderHeart, BadgePercent, BarChart3, Settings, Bell, Menu, X, 
  ShieldCheck, Radio, Loader2, Link2, LogOut, User, Activity, Check, Trash2
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 1. DYNAMIC MAYA GATEWAY API STATES
  const [gatewayMode, setGatewayMode] = useState<'SANDBOX' | 'PRODUCTION'>('PRODUCTION');
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [isPingingApi, setIsPingingApi] = useState(false);
  const [lastPingTime, setLastPingTime] = useState('200ms');

  // 2. NOTIFICATION INTERACTIVE STATE
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #1042 queued from Katipunan branch', time: '5m ago', unread: true },
    { id: 2, text: 'Maya payout clearance settled: ₱341.25 transfer complete', time: '1h ago', unread: true },
    { id: 3, text: 'Gateway configuration altered by Super Admin', time: '2h ago', unread: false }
  ]);

  // 3. PROFILE DROPDOWN INTERACTIVE STATE
  const [profileOpen, setProfileOpen] = useState(false);

  // MENU LINKS LOG SYSTEM FROM REGISTERED MODULES
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

  // HANDLERS FOR DROPDOWNS CLOSING ON CLICK-AWAY
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

  // TRIGGER GATEWAY HANDSHAKE SIMULATION
  const handlePingGateway = () => {
    setIsPingingApi(true);
    setTimeout(() => {
      setIsPingingApi(false);
      setIsApiConnected(true);
      setLastPingTime(`${Math.floor(Math.random() * 120) + 80}ms`);
    }, 800);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // REUSABLE MAYA GATEWAY COMPONENT IN SIDEBAR
  const renderMayaGatewayWidget = () => (
    <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl shrink-0 transition-all">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Link2 className={`h-4 w-4 ${isApiConnected ? 'text-blue-400' : 'text-slate-500'}`} />
          <span className="text-white text-[11px] font-black tracking-wider uppercase">Maya Gateway API</span>
        </div>
        <span className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
      </div>
      
      <div className="space-y-2">
        <p className="text-[10px] text-slate-400 leading-normal font-medium">
          {isApiConnected 
            ? `Connected to ${gatewayMode} API server routes.`
            : 'API signature validation offline.'}
        </p>
        
        {isApiConnected && (
          <div className="flex items-center justify-between text-[9px] bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/30 font-mono text-slate-400">
            <span>Latency Speed:</span>
            <span className="text-emerald-400 font-bold">{lastPingTime}</span>
          </div>
        )}

        <button
          onClick={handlePingGateway}
          disabled={isPingingApi}
          className="w-full bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700/60 hover:text-white py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition inline-flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
        >
          {isPingingApi ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
              <span>Verifying Handshake...</span>
            </>
          ) : (
            <>
              <Activity className="h-3 w-3 text-blue-400" />
              <span>Ping API Endpoint</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex antialiased selection:bg-amber-500/20">
      
      {/* =========================================================================
          1. DESKTOP SIDEBAR
          ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-[#1E293B] shrink-0 border-r border-slate-700/20 sticky top-0 z-50">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-700/40 shrink-0">
          <div className="bg-amber-500 p-1.5 rounded-lg text-white shadow-sm shadow-amber-500/30">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm text-white tracking-tight leading-none">Krave Admin</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Management Suite</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-tight transition-all ${
                  isActive 
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Global Maya Integration Footer Container */}
        <div className="p-4 border-t border-slate-700/30">
          {renderMayaGatewayWidget()}
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE DRAWER SIDEBAR
          ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex flex-col w-[260px] h-full bg-[#1E293B] shadow-2xl animate-slideIn">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-1.5 rounded-lg text-white">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-sm text-white tracking-tight">Krave Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-tight transition-all ${
                      isActive ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-700/30">
              {renderMayaGatewayWidget()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CONTAINER & UPGRADED GLOBAL HEADER COMPONENTS
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200/70 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-xs z-40 relative">
          
          {/* LEFT: PIPELINE SWITCHER STAMPS */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition">
              <Menu className="h-5 w-5" />
            </button>
            <div className="items-center gap-2 hidden sm:flex">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gateway Pipeline:</span>
              <button
                onClick={() => setGatewayMode(p => p === 'PRODUCTION' ? 'SANDBOX' : 'PRODUCTION')}
                className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide transition-all border ${
                  gatewayMode === 'PRODUCTION' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}
              >
                ● {gatewayMode} MODE
              </button>
            </div>
          </div>

          {/* RIGHT: NOTIFICATIONS & PROFILE PANELS DECK LAYOUT */}
          <div className="flex items-center gap-3">
            
            {/* NOTIFICATION TRIGGER CONTAINER */}
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

              {/* NOTIFICATION LIVE FLYOUT WINDOW PANEL */}
              {notifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 space-y-3 z-50 animate-fadeIn">
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
            
            <div className="h-5 w-px bg-slate-200 mx-0.5" />
            
            {/* PROFILE TRIGGER CONTAINER */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 text-left p-1 rounded-xl hover:bg-slate-50 transition select-none"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-sm ring-2 ring-slate-100">
                  KK
                </div>
                <div className="hidden xs:block pr-1">
                  <p className="text-xs font-black text-slate-800 leading-none">Admin Staff</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1">Store Owner</p>
                </div>
              </button>

              {/* PROFILE DROPDOWN ACTIONS PLATFORM */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50 animate-fadeIn space-y-0.5">
                  <div className="px-3 py-2 border-b border-slate-50 text-xs text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    Account Operations
                  </div>
                  
                  <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>View Profile</span>
                  </button>

                  <button onClick={() => { setProfileOpen(false); handlePingGateway(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <Activity className="h-3.5 w-3.5 text-slate-400" />
                    <span>System Audit Logs</span>
                  </button>

                  <hr className="border-slate-100 my-1" />

                  <button onClick={() => alert('Simulated Session Exited safely.')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition">
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          {children}
        </main>
      </div>

    </div>
  );
}