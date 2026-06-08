'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [storeName, setStoreName] = useState('Krave Kitchen');
  const [publicKey, setPublicKey] = useState('pk-Z09YgM14X9A07149021873109381273918');
  const [secretKey, setSecretKey] = useState('sk-A81HjN30198031803123891028301928312');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('System configurations successfully saved!');
    }, 1200);
  };

  return (
    <main className="p-6 max-w-4xl space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Configure restaurant operational states and Maya Checkout parameters.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Operational Configurations</h3>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Public Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0532b]/20"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Maya API Keys</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public API Key</label>
              <input
                type="password"
                required
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret API Key</label>
              <input
                type="password"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#e0532b] hover:bg-[#c5411c] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-[#e0532b]/20"
        >
          {isSaving ? 'Saving...' : 'Deploy Settings'}
        </button>
      </form>
    </main>
  );
}