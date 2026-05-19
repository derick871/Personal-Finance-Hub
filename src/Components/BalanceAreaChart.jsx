// src/components/BalanceAreaChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BalanceAreaChart({ timelineData }) {
  return (
    <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-200">Balance Progression Curve</h2>
        <p className="text-[11px] text-slate-500">Dynamic telemetry timeline showing asset depth adjustments</p>
      </div>
      <div className="h-64 w-full">
        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceSpline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
              <XAxis dataKey="timelineDate" stroke="#475569" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Balance" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#balanceSpline)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-600">No telemetry historical ledger elements verified</div>
        )}
      </div>
    </div>
  );
}