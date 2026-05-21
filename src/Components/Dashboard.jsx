import { useState, useMemo } from 'react';
import { useFinance } from './FinanceContext';
import { PlusCircle, ShieldAlert } from 'lucide-react';

// Subcomponents 
import AnalyticsSummaryCards from '../Components/AnalyticSummeryCard';
import BalanceAreaChart from '../Components/BalanceAreaChart';
import ExpenseDistributionChart from '../Components/ExpenseDistributionChart';
import TransactionTable from '../Components/TransactionTable';
import MiniStatement from '../Pages/MiniStatement'; 
import AutoBillAlerts from '../Pages/AutoBillAlert';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';

// Updated import path to match your exported component name seamlessly
import MonthlySummaryDashboard from '../Pages/MonthlySummary'; 

const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Housing', 'Utilities', 'Transport', 'Leisure', 'Shopping'];

export default function Dashboard() {
  const { user, transactions, logoutUser, addTransaction, deleteTransaction } = useFinance();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [formValues, setFormValues] = useState({
    description: '', amount: '', type: 'expense', category: 'Shopping',
    date: new Date().toISOString().split('T')[0]
  });

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

  // --- TAB CONTROLLER VIEW RESOLVER ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            {/* AUTOMATION WARNING BANNER MODULE */}
            <AutoBillAlerts />

            {/* 1. SEPARATED KPI CARDS BLOCK */}
            <AnalyticsSummaryCards metrics={dynamicMetrics} />

            {/* 2. RECHARTS HOOK BLOCKS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BalanceAreaChart timelineData={balanceTimelineData} />
              <ExpenseDistributionChart chartData={categoricalChartData} totalExpenses={dynamicMetrics.expenseSum} />
            </div>

            {/* 3. FORMS & DATA LEDGER PIPELINES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6 lg:col-span-1">
                {/* LEDGER INTAKE ENGINE */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                    <PlusCircle className="text-blue-500 dark:text-blue-400" size={16} /> 
                    Entry Pipeline
                  </h2>
                  <form onSubmit={handleInsertTransaction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button" 
                        onClick={() => setFormValues(prev => ({ ...prev, type: 'expense' }))} 
                        className={`py-2 text-xs rounded-lg border font-semibold transition-colors ${formValues.type === 'expense' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/50 text-rose-600 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        Expense
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFormValues(prev => ({ ...prev, type: 'income' }))} 
                        className={`py-2 text-xs rounded-lg border font-semibold transition-colors ${formValues.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        Income
                      </button>
                    </div>
                    <input type="text" name="description" required value={formValues.description} onChange={handleInputChange} placeholder="Descriptor Description" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" name="amount" step="0.01" required value={formValues.amount} onChange={handleInputChange} placeholder="Kshs" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" />
                      <input type="date" name="date" required value={formValues.date} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" />
                    </div>
                    {formValues.type === 'expense' && (
                      <select name="category" value={formValues.category} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500">
                        {DEFAULT_EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    )}
                    <button type="submit" className="w-half p-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-md shadow-blue-600/10">Inject Entry</button>
                  </form>
                </div>

                <MiniStatement transactions={transactions} />
              </div>

              {/* EXTRACTED LEDGER LIST DATA CONTAINER */}
              <div className="lg:col-span-2">
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
          </>
        );

      case 'Monthly Summary':
        {/* Renders  full structural subcomponent when tab clicks */}
        return <MonthlySummaryDashboard />;

      case 'Ledger Logs':
      default:
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[500px]">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Ledger Audit History</h1>
            <p className="text-xs text-slate-500 mt-1 mb-6">Historical data pipeline view tracking deep real-time system allocations.</p>
            <TransactionTable 
              visibleTransactions={transactions}
              totalCount={transactions.length}
              categoryFilter="All"
              setCategoryFilter={() => {}}
              filterCategories={filterCategories}
              deleteTransaction={deleteTransaction}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-sans antialiased transition-colors duration-300 flex flex-col justify-between">
      <div>
        <Navbar 
          netCashFlow={dynamicMetrics.netCashFlow} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={logoutUser} 
        />

        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          {renderTabContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
}