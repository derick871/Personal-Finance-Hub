import { useState, useEffect } from 'react';
import { LayoutDashboard, Layers, Calendar, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ netCashFlow, activeTab, setActiveTab, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  // Track dark layer status locally, initializing from preference state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return true; 
  });

  // Handle synchronization of class injection onto the document object
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Hardcoded date layout matching the project context snapshot
  const CURRENT_SYSTEM_DATE = "May 19, 2026";

  return (
    <nav className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-50 px-4 lg:px-8 shadow-sm transition-colors duration-300">
      <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
        
        {/* LEFT: BRAND LOGO */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg font-black text-xs tracking-tighter shadow-md shadow-blue-600/20">
            PFH
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
            FinAnalytics Hub
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <button 
            onClick={() => setActiveTab('Dashboard')} 
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'Dashboard' 
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/50 shadow-inner' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard size={14} /> 
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('Ledger Logs')} 
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'Ledger Logs' 
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/50 shadow-inner' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Layers size={14} /> 
            <span>Ledger Logs</span>
          </button>
        </div>

        {/* RIGHT: METRICS, THEME TUNER & SESSION BUTTON (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dynamic Theme Toggle Action Button Container */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Calendar Anchor */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-3 py-1.5 rounded-xl transition-colors">
            <Calendar size={13} className="text-blue-600 dark:text-blue-500" /> 
            <span>{CURRENT_SYSTEM_DATE}</span>
          </div>

          {/* Quick Balance Preview */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs transition-colors">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Net Asset:</span>
            <span className={`font-mono font-bold ${netCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              Kshs {netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {/* EXIT SESSION BUTTON */}
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-50 hover:text-white border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm"
            title="Terminate Secure Session"
          >
            <LogOut size={14} />
            <span>Exit Session</span>
          </button>
        </div>

        {/* MOBILE TRIGGER SWITCH BUTTON */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Quick Balance Mobile Metric */}
          <div className="bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
            Kshs {netCashFlow.toFixed(0)}
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/40 focus:outline-none transition-colors"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED NAVIGATION PANEL */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800/60 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 space-y-1">
            <button 
              onClick={() => { setActiveTab('Dashboard'); setIsOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'Dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => { setActiveTab('Ledger Logs'); setIsOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'Ledger Logs' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Layers size={16} /> Ledger Logs
            </button>
          </div>
          
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60 px-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar size={12}/> Pipeline Context:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{CURRENT_SYSTEM_DATE}</span>
            </div>
            
            <button 
              onClick={() => { setIsOpen(false); onLogout(); }} 
              className="w-full flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 py-2.5 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-500/20 transition-all"
            >
              <LogOut size={14} />
              <span>Exit System Session</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}