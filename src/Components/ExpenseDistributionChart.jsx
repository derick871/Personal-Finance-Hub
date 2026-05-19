// src/components/ExpenseDistributionChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PALETTE = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ExpenseDistributionChart({ chartData, totalExpenses }) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">Categorical Allocations</h2>
        <p className="text-[11px] text-slate-500">Relative weights of standard outbound transaction paths</p>
      </div>
      <div className="h-52 relative flex items-center justify-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`segment-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-slate-600">No active outlays recorded</div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-3">
        {chartData.map((entry, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
            {entry.name} ({totalExpenses > 0 ? ((entry.value / totalExpenses) * 100).toFixed(0) : 0}%)
          </span>
        ))}
      </div>
    </div>
  );
}