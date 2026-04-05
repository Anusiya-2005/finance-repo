'use client';

import { useEffect, useState } from 'react';

type SummaryData = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryTotals: Record<string, number>;
};

export default function Dashboard() {
  const [data, setData] = useState<SummaryData | any>(null);
  // Using the new Admin ID generated after the DB wipe
  const adminId = 'cmnm0108h0000140a9pp76bpy3';

  useEffect(() => {
    fetch('/api/dashboard/summary', {
      headers: { 'X-User-Id': adminId }
    })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-sans">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-sans">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-xl">
          <h2 className="text-xl font-bold mb-2">API Error</h2>
          <p>{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-8 md:p-24 selection:bg-emerald-500/30">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-16 space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
          Finance Overview
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl leading-relaxed">
          Real-time backend data visualization mapping your REST APIs to a premium interface.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Net Balance */}
        <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-emerald-500/50 to-neutral-800 hover:from-emerald-400 hover:to-neutral-700 transition-all duration-500">
          <div className="h-full w-full bg-neutral-950/90 rounded-[23px] p-8 flex flex-col justify-center backdrop-blur-xl">
             <h3 className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-2">Net Balance</h3>
             <p className="text-5xl font-light text-white">${data.netBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Income */}
        <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/50 to-neutral-800 hover:from-blue-400 hover:to-neutral-700 transition-all duration-500">
          <div className="h-full w-full bg-neutral-950/90 rounded-[23px] p-8 flex flex-col justify-center backdrop-blur-xl">
             <h3 className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Income</h3>
             <p className="text-5xl font-light text-white">${data.totalIncome.toLocaleString()}</p>
          </div>
        </div>

        {/* Expense */}
        <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-rose-500/50 to-neutral-800 hover:from-rose-400 hover:to-neutral-700 transition-all duration-500">
          <div className="h-full w-full bg-neutral-950/90 rounded-[23px] p-8 flex flex-col justify-center backdrop-blur-xl">
             <h3 className="text-rose-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Expenses</h3>
             <p className="text-5xl font-light text-white">${data.totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl p-[1px] bg-gradient-to-b from-neutral-800 to-neutral-900 overflow-hidden">
           <div className="bg-neutral-950/90 rounded-[23px] p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6 text-neutral-200">Category Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(data.categoryTotals).map(([category, amount]) => (
                  <div key={category} className="flex flex-col gap-2 p-4 rounded-xl hover:bg-neutral-900/50 transition-colors">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-neutral-400 font-medium">{category}</span>
                      <span className="text-white text-lg font-light">${amount.toLocaleString()}</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-emerald-500 rounded-full" 
                         style={{ width: `${(amount / Math.max(data.totalIncome, data.totalExpense)) * 100}%`}}
                       />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
