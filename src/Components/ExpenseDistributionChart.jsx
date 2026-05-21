// src/components/ExpenseDistributionChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
//import { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; 

// Vibrant colors that work well across both light and dark backgrounds
const PALETTE = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ExpenseDistributionChart({ chartData = [], totalExpenses = 0 }) {
    //const [isOpen, setIsOpen] = useState(false); 
    const { isDark } = useTheme();

    return (
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-colors duration-200 ${
            isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800'
        }`}>
            <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Categorical Allocations
                </h2>
                <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Relative weights of standard outbound transaction paths
                </p>
            </div>

            <div className="h-52 relative flex items-center justify-center my-2">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={chartData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={55} 
                                outerRadius={75} 
                                paddingAngle={3} 
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`segment-${index}`} fill={PALETTE[index % PALETTE.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                                    borderRadius: '8px', 
                                    fontSize: '12px',
                                    color: isDark ? '#f1f5f9' : '#334155'
                                }} 
                                itemStyle={{ color: isDark ? '#f1f5f9' : '#334155' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        No active outlays recorded
                    </div>
                )}
            </div>

            <div className={`flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] mt-2 border-t pt-3 ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
                {chartData.map((entry, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                        <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                        ></span>
                        {entry.name} ({totalExpenses > 0 ? ((entry.value / totalExpenses) * 100).toFixed(0) : 0}%)
                    </span>
                ))}
            </div>
        </div>
    );
}