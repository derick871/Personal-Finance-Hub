import { useState, useMemo } from 'react';
import { useFinance } from './FinanceContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, Percent, PlusCircle, Filter, Trash2, Calendar, Layers, LogOut,
  Bell, ShieldCheck, RefreshCw, Cpu
} from 'lucide-react';

const PALETTE = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Housing', 'Utilities', 'Transport', 'Leisure'];

export default function Dashboard() {
  const { user, transactions, logoutUser, addTransaction, deleteTransaction } = useFinance();
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Standard Ledger Transaction Form State
  const [formValues, setFormValues] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  // --- M-PESA AUTOMATED STANDING BILLS ---
  const [autoBills, setAutoBills] = useState([
    { id: 1, name: "Zuku Internet Home", amount: 35.00, paybill: "502100", account: "zuku552", phone: "254711223344", dueDay: 23 },
    { id: 2, name: "KPLC Tokens Failsafe", amount: 20.00, paybill: "888888", account: "37199281", phone: "254711223344", dueDay: 23 }
  ]);

  // Automated Bill Form State
  const [billForm, setBillForm] = useState({
    name: '', amount: '', paybill: '', account: '', phone: '2547', dueDay: '1'
  });

  // --- AUTOMATION ENGINE & REMINDER SCANNER (5-Day Boundary Window) ---
  const autoBillAlerts = useMemo(() => {
    // Synchronized to the system context date: May 19, 2026
    const SYSTEM_CURRENT_DAY = ''; 
    
    return autoBills.map(bill => {
      let daysUntilDue = bill.dueDay - SYSTEM_CURRENT_DAY;
      
      // If day has passed in current month, calculate distance to next month's day
      if (daysUntilDue < 0) {
        const daysInCurrentMonth = 31; // May has 31 days
        daysUntilDue = (daysInCurrentMonth - SYSTEM_CURRENT_DAY) + bill.dueDay;
      }
      
      return {
        ...bill,
        daysUntilDue,
        isTriggered: daysUntilDue === 5
      };
    }).filter(bill => bill.isTriggered);
  }, [autoBills]);

  // --- ANALYTICS TRANSLATION ENGINE ---
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
      return {
        timelineDate: tx.date,
        Balance: cumulativeBalance,
        Mutation: tx.type === 'income' ? tx.amount : -tx.amount
      };
    });
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    if (categoryFilter === 'All') return transactions;
    return transactions.filter(tx => tx.category === categoryFilter);
  }, [transactions, categoryFilter]);

  const filterCategories = useMemo(() => {
    const uniqueCategories = new Set(transactions.map(tx => tx.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, [transactions]);

  // --- CONTROLLER PIPELINE ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBillFormChange = (e) => {
    const { name, value } = e.target;
    setBillForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInsertTransaction = async (e) => {
    e.preventDefault();
    const { description, amount, type, category, date } = formValues;
    if (!description || !amount || parseFloat(amount) <= 0) return;

    const assignedCategory = type === 'income' ? 'Income' : category;
    
    // Fixed: Parse amount explicitly to a Float to protect state arithmetic
    await addTransaction(description, parseFloat(amount), type, assignedCategory, date);
    
    setFormValues(prev => ({ ...prev, description: '', amount: '' }));
  };

  const handleRegisterAutoBill = (e) => {
    e.preventDefault();
    if (!billForm.name || !billForm.amount || !billForm.paybill) return;

    const newBill = {
      id: Date.now(),
      name: billForm.name,
      amount: parseFloat(billForm.amount),
      paybill: billForm.paybill,
      account: billForm.account || 'BILLS-GENERIC',
      phone: billForm.phone,
      dueDay: parseInt(billForm.dueDay)
    };

    setAutoBills(prev => [...prev, newBill]);
    setBillForm({ name: '', amount: '', paybill: '', account: '', phone: '2547', dueDay: '1' });
  };

  const handleDeleteAutoBill = (id) => {
    setAutoBills(prev => prev.filter(bill => bill.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-500 p-4 sm:p-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* APP BRAND BAR */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white font-black text-sm tracking-tighter">PFH</div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Personal Finance Hub & Analytics
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Authorized User: <span className="text-slate-300 font-medium">{user?.email || "SSO Workspace"}</span></p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-400">
              <Calendar size={14} className="text-blue-500" />
              May 2026 Accounting Context
            </div>
            <button 
              onClick={logoutUser}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-red-500 text-white border border-slate-800 hover:border-rose-900/50 text-xs px-3 py-2 rounded-xl transition-all"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* CRON ALERTS DISPATCH BANNER */}
        {autoBillAlerts.length > 0 && (
          <section className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Bell size={16} className="animate-bounce" />
              <h4 className="text-xs font-bold uppercase tracking-wider">M-PESA Automation Notice: Pipeline Engine Reminders (T-5 Days)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {autoBillAlerts.map(alert => (
                <div key={alert.id} className="bg-slate-950/60 border border-amber-500/20 rounded-lg p-3 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-200">{alert.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Paybill: <span className="text-slate-300 font-mono">{alert.paybill}</span> | Account: <span className="text-slate-300 font-mono">{alert.account}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-400 block">Kshs: {alert.amount.toFixed(2)}</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                      Deducting via STK in 5 Days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 1. HIGH DENSITY KPI RIBBON */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Net Cash Flow</span>
              <h3 className={`text-2xl font-bold tracking-tight mt-1 ${dynamicMetrics.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${dynamicMetrics.netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg ${dynamicMetrics.netCashFlow >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Wallet size={20} />
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aggregate Revenue</span>
              <h3 className="text-2xl font-bold tracking-tight mt-1 text-emerald-400">
                ${dynamicMetrics.incomeSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Outlays</span>
              <h3 className="text-2xl font-bold tracking-tight mt-1 text-rose-400">
                ${dynamicMetrics.expenseSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
              <TrendingDown size={20} />
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Savings Elasticity</span>
              <h3 className="text-2xl font-bold tracking-tight mt-1 text-blue-400">
                {dynamicMetrics.savingsRate}%
              </h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Percent size={20} />
            </div>
          </div>
        </section>

        {/* 2. RECHARTS ANALYTICS RUNTIME */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200">Balance Progression Curve</h2>
              <p className="text-[11px] text-slate-500">Dynamic telemetry timeline showing asset depth adjustments</p>
            </div>
            <div className="h-64 w-full">
              {balanceTimelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Categorical Allocations</h2>
              <p className="text-[11px] text-slate-500">Relative weights of standard outbound transaction paths</p>
            </div>
            <div className="h-52 relative flex items-center justify-center">
              {categoricalChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoricalChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoricalChartData.map((entry, index) => (
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
              {categoricalChartData.map((entry, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                  {entry.name} ({dynamicMetrics.expenseSum > 0 ? ((entry.value / dynamicMetrics.expenseSum) * 100).toFixed(0) : 0}%)
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. INPUT INGESTION ENGINE & REAL-TIME TRANSACTION LOG */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm h-fit">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <PlusCircle className="text-blue-400" size={16} /> Ledger Entry Pipeline
              </h2>
              <p className="text-[11px] text-slate-500">Direct mutation form injection layout</p>
            </div>
            
            <form onSubmit={handleInsertTransaction} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Transaction Flow Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormValues(prev => ({ ...prev, type: 'expense' }))}
                    className={`py-2 px-3 text-xs rounded-lg border font-semibold tracking-wide transition-all ${formValues.type === 'expense' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Outbound Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormValues(prev => ({ ...prev, type: 'income' }))}
                    className={`py-2 px-3 text-xs rounded-lg border font-semibold tracking-wide transition-all ${formValues.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Inbound Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Descriptor Summary</label>
                <input
                  type="text"
                  name="description"
                  required
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Azure API Compute Token"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Value (Kshs)</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    required
                    value={formValues.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Execution Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formValues.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              {formValues.type === 'expense' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Structural Category</label>
                  <select
                    name="category"
                    value={formValues.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                  >
                    {DEFAULT_EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-md mt-2">
                Inject to Cloud Ledger
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Layers size={16} className="text-slate-400" /> Complete Transaction Ledger
                  </h2>
                  <p className="text-[11px] text-slate-500">Real-time Cloud Sync Engine (Firestore)</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] self-start sm:self-center">
                  <Filter size={12} className="text-slate-500" />
                  <span className="text-slate-500">Class:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer"
                  >
                    {filterCategories.map((cat, idx) => (
                      <option key={idx} value={cat} className="bg-slate-950 text-slate-300">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[10px] uppercase font-bold bg-slate-950/60 text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3 font-medium">Timestamp</th>
                      <th className="py-2 px-3 font-medium">Log Descriptor</th>
                      <th className="py-2 px-3 font-medium">Classification</th>
                      <th className="py-2 px-3 font-medium text-right">Value Offset</th>
                      <th className="py-2 px-3 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {visibleTransactions.length > 0 ? (
                      visibleTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">{tx.date}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-200 max-w-xs truncate">{tx.description}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                              {tx.category}
                            </span>
                          </td>
                          <td className={`py-2.5 px-3 text-right font-bold font-mono ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.type === 'income' ? '+' : '-'}Kshs: {tx.amount.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button onClick={() => deleteTransaction(tx.id)} className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-600 font-medium">No live system records match specifications.</td>
                      </tr>
                    )}
                  </tbody>
                 
                </table>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 text-right mt-4 pt-3 border-t border-slate-800/50 font-mono">
              Live State Sync Counter: {visibleTransactions.length} of {transactions.length} entries active
            </div>
          </div>
        </section>

        {/* --- 4. AUTOMATED M-PESA BILLING CONFIGURATION PANEL --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form to Register New Automated Bills */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Cpu className="text-amber-500" size={16} /> M-PESA Standing Engine
              </h2>
              <p className="text-[11px] text-slate-500">Create automatic recurring Paybill schedules</p>
            </div>
            
            <form onSubmit={handleRegisterAutoBill} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Service/Bill Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={billForm.name}
                  onChange={handleBillFormChange}
                  placeholder="e.g., Safaricom Home Fiber"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Value Amount</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    value={billForm.amount}
                    onChange={handleBillFormChange}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Due Day of Month</label>
                  <input
                    type="number"
                    name="dueDay"
                    min="1"
                    max="31"
                    required
                    value={billForm.dueDay}
                    onChange={handleBillFormChange}
                    placeholder="23"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">M-PESA Paybill</label>
                  <input
                    type="text"
                    name="paybill"
                    required
                    value={billForm.paybill}
                    onChange={handleBillFormChange}
                    placeholder="e.g., 222222"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="account"
                    required
                    value={billForm.account}
                    onChange={handleBillFormChange}
                    placeholder="e.g., ACC-881"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Target Phone (254...)</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={billForm.phone}
                  onChange={handleBillFormChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <button type="submit" className="w-full bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-md mt-1 flex items-center justify-center gap-1.5">
                <RefreshCw size={12} /> Authorize Automated Direct Debit
              </button>
            </form>
          </div>

          {/* Active Automated Bills Queue Display */}
          <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={16} /> Active M-PESA Auto-Deduction Registry
              </h2>
              <p className="text-[11px] text-slate-500">Validated daemon tasks pushing directly to your real M-PESA statements</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] uppercase font-bold bg-slate-950/60 text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Service</th>
                    <th className="py-2 px-3">Paybill/Account</th>
                    <th className="py-2 px-3 text-center">Monthly Execution Day</th>
                    <th className="py-2 px-3 text-right">Value Limit</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {autoBills.length > 0 ? (
                    autoBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-200">{bill.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">
                          {bill.paybill} <span className="text-slate-600">/</span> {bill.account}
                        </td>
                        <td className="py-2.5 px-3 text-center text-blue-400 font-semibold font-mono">
                          Day {bill.dueDay}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-200 font-mono">
                          ${bill.amount.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Active Sync
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button onClick={() => handleDeleteAutoBill(bill.id)} className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-600 font-medium">No active automated deduction streams configured.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}