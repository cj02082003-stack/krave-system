// 'use client';

// import React, { useState } from 'react';

// export default function SettingsPage() {
//   const [isSaving, setIsSaving] = useState(false);
//   const [storeName, setStoreName] = useState('Krave Kitchen');
//   const [publicKey, setPublicKey] = useState('pk-Z09YgM14X9A07149021873109381273918');
//   const [secretKey, setSecretKey] = useState('sk-A81HjN30198031803123891028301928312');

//   const handleSaveSettings = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setTimeout(() => {
//       setIsSaving(false);
//       alert('System configurations successfully saved!');
//     }, 1200);
//   };

//   return (
//     <main className="p-6 max-w-4xl space-y-6 animate-fadeIn">
//       <div>
//         <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
//         <p className="text-xs text-slate-400 mt-0.5">Configure restaurant operational states and Maya Checkout parameters.</p>
//       </div>

//       <form onSubmit={handleSaveSettings} className="space-y-6">
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
//           <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Operational Configurations</h3>
//           <div className="space-y-1">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Public Name</label>
//             <input
//               type="text"
//               required
//               value={storeName}
//               onChange={(e) => setStoreName(e.target.value)}
//               className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
//             />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
//           <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Maya API Keys</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public API Key</label>
//               <input
//                 type="password"
//                 required
//                 value={publicKey}
//                 onChange={(e) => setPublicKey(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-mono font-bold"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret API Key</label>
//               <input
//                 type="password"
//                 required
//                 value={secretKey}
//                 onChange={(e) => setSecretKey(e.target.value)}
//                 className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-mono font-bold"
//               />
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={isSaving}
//           className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-[#e0532b]/20"
//         >
//           {isSaving ? 'Saving...' : 'Deploy Settings'}
//         </button>
//       </form>
//     </main>
//   );
// }

'use client';

import React, { useState } from 'react';
import { 
  Store, Phone, MapPin, Eye, EyeOff, Save, Loader2, 
  KeyRound, ShieldCheck, ToggleLeft, ToggleRight, Server, Radio
} from 'lucide-react';

export default function SystemSettingsPage() {
  // 1. DATA PARAMETERS FROM THE EXACT ACTIVE REFERENCE POOL
  const [storeName, setStoreName] = useState('Krave Kitchen');
  const [storePhone, setStorePhone] = useState('+63 917 555 9988');
  const [storeAddress, setStoreAddress] = useState('Katipunan Ave, Quezon City, Metro Manila');
  const [isOrderingActive, setIsOrderingActive] = useState(true);
  
  // 2. MAYA GATEWAY PARAMETERS & SECURE TOGGLE VIEWS
  const [gatewayMode, setGatewayMode] = useState<'SANDBOX' | 'PRODUCTION'>('PRODUCTION');
  const [showSecretKeys, setShowSecretKeys] = useState(false);
  
  // API KEY SIMULATION STATES FOR SECURITY MANAGEMENT
  const [publicKey, setPublicKey] = useState('pk-Z0N0Ym90X2tyYXZlX2tpdGNoZW5fZ2F0ZXdheV9leG1wXzIwMjY');
  const [secretKey, setSecretKey] = useState('sk-YmFja2VuZF9zZWNyZXRfa2V5X3N0cmluZ19rcmF2ZV9kZWxleHRfYXVkaXQ');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleGlobalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(false);

    setTimeout(() => {
      setSaving(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 w-full mx-auto max-w-[1200px] antialiased min-h-screen pb-12">
      
      {/* HEADER CONTROLS SHEET HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Configure restaurant operational states and Maya Checkout parameters.
          </p>
        </div>

        {/* TOP FLOATING SAVE CONTROLLER */}
        <button 
          onClick={handleGlobalSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-[#596643] hover:bg-[#3a352a] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition self-start sm:self-auto active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 stroke-[2.5]" />}
          <span>Save Configurations</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-700 font-bold animate-fadeIn">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>System credentials updated. All active point-of-sale routes successfully synchronized with Maya servers.</span>
        </div>
      )}

      {/* OPERATIONAL CONFIGURATIONS DECK BLOCK */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-50 pb-3">
          <h2 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2">
            <Store className="h-4 w-4 text-slate-500" /> Operational Configurations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Store Public Name</label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition text-slate-800" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Store Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                value={storePhone} 
                onChange={(e) => setStorePhone(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold font-mono outline-none focus:border-orange-500 focus:bg-white transition text-slate-800" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Dispatch Outlet Address</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              value={storeAddress} 
              onChange={(e) => setStoreAddress(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-orange-500 focus:bg-white transition text-slate-800" 
            />
          </div>
        </div>

        {/* STORE ORDERING SWITCH PIPELINE MECHANICS */}
        <div 
          onClick={() => setIsOrderingActive(!isOrderingActive)}
          className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 rounded-xl cursor-pointer transition-all"
        >
          <div className="space-y-0.5 pr-4">
            <span className="text-xs font-bold text-slate-800 block">Store Ordering State</span>
            <span className="text-[11px] text-slate-400 font-medium leading-relaxed block">
              Lock checkout operations instantly during kitchen downtime.
            </span>
          </div>
          <button type="button" className="text-slate-800 shrink-0">
            {isOrderingActive ? (
              <div className="w-9 h-5 bg-emerald-500 rounded-full p-0.5 transition-colors flex justify-end">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            ) : (
              <div className="w-9 h-5 bg-slate-200 rounded-full p-0.5 transition-colors flex justify-start">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            )}
          </button>
        </div>

      </div>

      {/* MAYA API GATEWAY CREDENTIALS ENHANCED LAYER */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 flex-wrap gap-2">
          <h2 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-slate-500" /> Maya API Gateway Credentials
          </h2>
          
          {/* SECURE VISIBILITY SWITCH TOGGLE TEXT TRIGGER */}
          <button
            type="button"
            onClick={() => setShowSecretKeys(!showSecretKeys)}
            className="inline-flex items-center gap-1 text-[11px] font-black text-bg-[#596643] hover:text-[#3a352a] uppercase tracking-wide transition"
          >
            {showSecretKeys ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>View Secret keys</span>
          </button>
        </div>

        {/* PILL MODE SELECTOR BASE COMPONENT FRAMEWORK */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 block">Gateway Sandbox Mode</span>
            <span className="text-[11px] text-slate-400 font-medium block">Production key transfers charge actual money.</span>
          </div>

          {/* DYNAMIC PILL TOGGLER MATRIX MATCHING HOVER STATES */}
          <div className="inline-flex bg-slate-200/70 p-1 rounded-xl border border-slate-300/30 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setGatewayMode('SANDBOX')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                gatewayMode === 'SANDBOX'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sandbox
            </button>
            <button
              type="button"
              onClick={() => setGatewayMode('PRODUCTION')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                gatewayMode === 'PRODUCTION'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Production
            </button>
          </div>
        </div>

        {/* INTEGRATED SECURE CREDENTIAL DATA READOUTS */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Public Facing Client API Key</span>
            <div className="relative font-mono text-xs">
              <input
                type={showSecretKeys ? "text" : "password"}
                readOnly
                value={publicKey}
                className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl tracking-wider text-slate-700 outline-none select-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Secret Authorization Signature Key</span>
              {gatewayMode === 'PRODUCTION' && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-rose-50 text-rose-600 px-2 py-0.5 rounded"> Live Endpoint </span>
              )}
            </div>
            <div className="relative font-mono text-xs">
              <input
                type={showSecretKeys ? "text" : "password"}
                readOnly
                value={secretKey}
                className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl tracking-wider text-slate-700 outline-none select-all font-bold"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}