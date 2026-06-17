import React from 'react';

export default function AdminGlobalLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Dynamic Header Section Blueprint */}
      <div className="flex flex-col gap-2">
        <div className="h-6 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-72 bg-slate-200/70 rounded-lg" />
      </div>

      {/* Analytics Counter Grid Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3.5">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 rounded-md" />
              <div className="w-8 h-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-7 w-20 bg-slate-200 rounded-lg" />
            <div className="h-3.5 w-32 bg-slate-200/60 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Database Table Content Wireframe */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
        <div className="flex justify-between items-center pb-2">
          <div className="h-5 w-36 bg-slate-200 rounded-md" />
          <div className="h-9 w-24 bg-slate-200 rounded-xl" />
        </div>
        <div className="space-y-3">
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-200 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-200 rounded-md" />
                  <div className="h-2.5 w-16 bg-slate-200/60 rounded-md" />
                </div>
              </div>
              <div className="h-4 w-14 bg-slate-200 rounded-md" />
              <div className="h-4 w-20 bg-slate-200 rounded-md" />
              <div className="w-7 h-7 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}