// src/components/Dashboard.jsx
import { useState, useMemo } from 'react';
import { useFinance } from './FinanceContext';
import { 
  PlusCircle, Calendar, LogOut, Bell, LayoutDashboard, Layers, ShieldAlert 
} from 'lucide-react';

// Subcomponents Imported Below
import AnalyticsSummaryCards from '../Components/AnalyticSummeryCard';
import BalanceAreaChart from '../Components/BalanceAreaChart';
import ExpenseDistributionChart from '../Components/ExpenseDistributionChart';
import TransactionTable from '../Components/TransactionTable';

const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Housing', 'Utilities', 'Transport', 'Leisure'];

export default function Dashboard() {
  const { user, transactions, logoutUser, addTransaction, deleteTransaction } = useFinance();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [formValues, setFormValues] = useState({
    description: '', amount: '', type: 'expense', category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const [autoBills] = useState([
    { id: 1, name: "WIFI Internet Home", amount: 35.00, paybill: "502100", account: "zuku552", phone: "254711223344", dueDay: 24 },
    { id: 2, name: "KPLC Tokens Failsafe", amount: 20.00, paybill: "888888", account: "37199281", phone: "254711223344", dueDay: 24 }
  ]);

  // --- COMPUTE ENGINES ---
  const dynamicMetrics = useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') incomeSum += tx.amount;
      if (tx.type === 'expense') expenseSum += tx.amount;
    });
    const netCashFlow = incomeSum - expenseSum;
    const savingsRate = incomeSum > 0 ? ((netCashFlow / incomeSum) * 100).toFixed(1) : '0.0';
    return { incomeSum, expenseSum, netCashFlow, savingsRate };
  }, [transactions]);

  const autoBillAlerts = useMemo(() => {
    const SYSTEM_CURRENT_DAY = 19; // May 19, 2026 Context Execution Window
    return autoBills.map(bill => {
      let daysUntilDue = bill.dueDay - SYSTEM_CURRENT_DAY;
      if (daysUntilDue < 0) daysUntilDue = (31 - SYSTEM_CURRENT_DAY) + bill.dueDay;
      return { ...bill, daysUntilDue, isTriggered: daysUntilDue === 5 };
    }).filter(bill => bill.isTriggered);
  }, [autoBills]);

  const categoricalChartData = useMemo(() => {
    const map = {};
    transactions.filter(tx => tx.type === 'expense').forEach(tx => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });
    return Object.keys(map).map(key => ({ name: key, value: map[key] }));
  }, [transactions]);

  const balanceTimelineData = useMemo(() => {
    const sortedTimeline = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativeBalance = 0;
    return sortedTimeline.map(tx => {
      cumulativeBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      return { timelineDate: tx.date, Balance: cumulativeBalance };
    });
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    if (categoryFilter === 'All') return transactions;
    return transactions.filter(tx => tx.category === categoryFilter);
  }, [transactions, categoryFilter]);

  const filterCategories = useMemo(() => {
    return ['All', ...Array.from(new Set(transactions.map(tx => tx.category)))];
  }, [transactions]);

  // --- ACTIONS CONTROLLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleInsertTransaction = async (e) => {
    e.preventDefault();
    const { description, amount, type, category, date } = formValues;
    if (!description || !amount || parseFloat(amount) <= 0) return;
    await addTransaction(description, parseFloat(amount), type, type === 'income' ? 'Income' : category, date);
    setFormValues(prev => ({ ...prev, description: '', amount: '' }));
  };

  // 🔒 CRITICAL AUTHENTICATION GUARD LAYER
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-xl">
          <div className="mx-auto w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="text-slate-200 font-semibold text-base">Access Restricted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You must be successfully logged into your cloud identity account profile to monitor dashboard analytics.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-lg transition-colors"
            >
              Return to Login Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans antialiased">
      {/* APP NAVBAR SHELL */}
      <nav className="bg-slate-900 text-slate-100 border-b border-slate-800/80 sticky top-0 z-50 px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
          {/* Logo Brand Segment */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg font-black text-xs tracking-tighter">PFH</div>
            <span className="font-bold text-base bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">FinAnalytics Hub</span>
          </div>
          
          {/* Internal Dashboard Route Filters */}
          <div className="hidden md:flex items-center gap-1">
            {[{ name: 'Dashboard', icon: <LayoutDashboard size={16} /> }, { name: 'Ledger Logs', icon: <Layers size={16} /> }].map((item) => (
              <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${activeTab === item.name ? 'bg-slate-800 text-blue-400 border border-slate-700/50' : 'text-slate-400 hover:text-slate-100'}`}>
                {item.icon} {item.name}
              </button>
            ))}
          </div>

          {/* Right Metrics & Global Control Center Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-[11px] bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl">
              <Calendar size={13} className="text-blue-500" /> May 19, 2026 Context
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Net Asset:</span>
              <span className={`font-mono font-bold ${dynamicMetrics.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${dynamicMetrics.netCashFlow.toFixed(2)}
              </span>
            </div>
            
            {/* 🚪 REFINED EXIT SESSION CONTROL BUTTON */}
            <button 
              onClick={logoutUser} 
              className="flex items-center gap-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              title="Terminate Secure Session"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Exit Session</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* AUTOMATION WARNING BANNER */}
        {autoBillAlerts.length > 0 && (
          <section className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase"><Bell size={16} /> M-PESA Automation Notification Pipeline (T-5 Days)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {autoBillAlerts.map(alert => (
                <div key={alert.id} className="bg-slate-950/60 border border-amber-500/20 rounded-lg p-3 text-xs flex justify-between items-center">
                  <div><p className="font-semibold text-slate-200">{alert.name}</p></div>
                  <span className="font-bold text-amber-400">Kshs: {alert.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 1. SEPARATED KPI CARDS BLOCK */}
        <AnalyticsSummaryCards metrics={dynamicMetrics} />

        {/* 2. RECHARTS HOOK BLOCKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BalanceAreaChart timelineData={balanceTimelineData} />
          <ExpenseDistributionChart chartData={categoricalChartData} totalExpenses={dynamicMetrics.expenseSum} />
        </div>

        {/* 3. FORMS & DATA LEDGER SYSTEM MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEDGER INTAKE ENGINE */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 h-fit">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4"><PlusCircle className="text-blue-400" size={16} /> Entry Pipeline</h2>
            <form onSubmit={handleInsertTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setFormValues(prev => ({ ...prev, type: 'expense' }))} className={`py-2 text-xs rounded-lg border font-semibold ${formValues.type === 'expense' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-slate-950 border-slate-800'}`}>Expense</button>
                <button type="button" onClick={() => setFormValues(prev => ({ ...prev, type: 'income' }))} className={`py-2 text-xs rounded-lg border font-semibold ${formValues.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800'}`}>Income</button>
              </div>
              <input type="text" name="description" required value={formValues.description} onChange={handleInputChange} placeholder="Descriptor Description" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" name="amount" step="0.01" required value={formValues.amount} onChange={handleInputChange} placeholder="Kshs" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200" />
                <input type="date" name="date" required value={formValues.date} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200" />
              </div>
              {formValues.type === 'expense' && (
                <select name="category" value={formValues.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200">
                  {DEFAULT_EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              )}
              <button type="submit" className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg">Inject Entry</button>
            </form>
          </div>

          {/* EXTRACTED LEDGER LIST DATA CONTAINER */}
          <TransactionTable 
            visibleTransactions={visibleTransactions}
            totalCount={transactions.length}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            filterCategories={filterCategories}
            deleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}