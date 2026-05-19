// src/components/MetricCard.jsx

export default function MetricCard({ title, value, icon: Icon, variant = 'blue' }) {
  const themes = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
        <h3 className={`text-2xl font-bold tracking-tight mt-1 ${variant === 'rose' ? 'text-rose-400' : variant === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`}>
          {value}
        </h3>
      </div>
      <div className={`p-2.5 rounded-lg ${themes[variant] || themes.blue}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}