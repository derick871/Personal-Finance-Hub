import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Percent, 
  Search, 
  Filter, 
  Flame 
} from 'lucide-react';

const KPI_DATA = {
  totalIncome: 145000,
  totalExpenses: 92400,
  netSavings: 52600,
};

// Fixed case sensitivity matching and added percentage multiplication
const savingsRate = ((KPI_DATA.totalIncome - KPI_DATA.totalExpenses) / KPI_DATA.totalIncome) * 100;

const WEEKLY_TRENDS = [
  { name: 'Week 1', Income: 45000, Expenses: 22000 },
  { name: 'Week 2', Income: 35000, Expenses: 28400 },
  { name: 'Week 3', Income: 40000, Expenses: 19000 },
  { name: 'Week 4', Income: 25000, Expenses: 23000 },
];

const CATEGORIES = [
  { name: 'Rent & Housing', amount: 35000, budget: 35000, color: 'bg-blue-500' },
  { name: 'Food & Dining', amount: 24200, budget: 25000, color: 'bg-orange-500' },
  { name: 'Utilities & Water', amount: 18000, budget: 15000, color: 'bg-amber-500' }, 
  { name: 'Entertainment', amount: 15200, budget: 20000, color: 'bg-purple-500' },
];

const TRANSACTIONS = [
  { id: 'TX-1001', date: 'May 18, 2026', description: 'Water Bill Auto-Pay', category: 'Utilities & Water', amount: -4500, type: 'recurring' },
  { id: 'TX-1002', date: 'May 15, 2026', description: 'Salary Deposit', category: 'Income', amount: 145000, type: 'income' },
  { id: 'TX-1003', date: 'May 12, 2026', description: 'Supermarket Groceries', category: 'Food & Dining', amount: -12400, type: 'expense' },
  { id: 'TX-1004', date: 'May 10, 2026', description: 'Monthly House Rent', category: 'Rent & Housing', amount: -35000, type: 'recurring' },
  { id: 'TX-1005', date: 'May 05, 2026', description: 'Electronics Hub Purchase', category: 'Entertainment', amount: -15200, type: 'expense' },
];

// Renamed from monthlySummaryDashboard to PascalCase to follow React specifications
export default function MonthlySummaryDashboard() {
  const [searchTerms, setSearchTerms] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Aligned array filter variable names consistently
  const filteredTransactions = TRANSACTIONS.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerms.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerms.toLowerCase());
        
    if (filterType === "All") return matchesSearch;
    if (filterType === "income") return matchesSearch && tx.amount > 0;
    if (filterType === "expense") return matchesSearch && tx.amount < 0;
    if (filterType === "recurring") return matchesSearch && tx.type === "recurring";
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Monthly Transaction Summary</h1>
            <p className="text-sm text-slate-500 mt-1">Financial performance statement for May 2026</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white shadow-sm border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600">
            Statement Period: <span className="text-slate-900">May 01 - May 31</span>
          </div>
        </div>

        {/* 1. Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Income Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Income</span>
              <p className="text-2xl font-bold text-slate-900">KES {KPI_DATA.totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</span>
              <p className="text-2xl font-bold text-slate-900">KES {KPI_DATA.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <ArrowDownRight className="h-6 w-6" />
            </div>
          </div>

          {/* Net Savings Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Savings</span>
              <p className="text-2xl font-bold text-slate-900">KES {KPI_DATA.netSavings.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Wallet className="h-6 w-6" />
            </div>
          </div>

          {/* Savings Rate Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Savings Rate</span>
              <p className="text-2xl font-bold text-slate-900">{savingsRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Percent className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Mid section: Visual Analytics & Categorized Spending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 3. Cash Flow Bar Graph Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">Weekly Cash Flow Trend</h2>
              <p className="text-xs text-slate-400">Comparative look at weekly inflows versus outflows</p>
            </div>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value) => [`KES ${Number(value).toLocaleString()}`]} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Categorized Spending Breakdown */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Budget Progress</h2>
                <p className="text-xs text-slate-400">Actual spend versus designated budget caps</p>
              </div>
              
              <div className="space-y-5">
                {CATEGORIES.map((cat) => {
                  const percentUsed = (cat.amount / cat.budget) * 100;
                  const isOverBudget = cat.amount > cat.budget;

                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          {cat.name}
                          {isOverBudget && <Flame className="h-4 w-4 text-amber-500" title="Over Budget Limit" />}
                        </span>
                        <span className="text-slate-500">
                          <strong className="text-slate-900">KES {cat.amount.toLocaleString()}</strong> / {cat.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isOverBudget ? 'bg-rose-500' : cat.color} transition-all duration-500`}
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 flex items-start gap-2">
              <span className="font-bold text-amber-600">Note:</span>
              <span>Your Utilities category exceeded its planned allocations by KES 3,000 this month due to localized spikes.</span>
            </div>
          </div>
        </div>

        {/* 4. Transaction Ledger & Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Detailed Transaction Ledger</h2>
              <p className="text-xs text-slate-400">Complete historical logs for this operational window</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Search input mapped to searchTerms */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ledger..."
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-full sm:w-60 transition-all"
                />
              </div>

              {/* Filter selection mapped to capitalized cases correctly */}
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer pr-1 text-slate-700"
                >
                  <option value="All">All Logs</option>
                  <option value="income">Inflow Deposits</option>
                  <option value="expense">Direct Outflows</option>
                  <option value="recurring">Subscriptions / Standing Orders</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-6">Reference ID</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-medium text-xs text-slate-400">{tx.id}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-500">{tx.date}</td>
                      <td className="py-4 px-6 font-medium text-slate-950">
                        <div className="flex items-center gap-2">
                          {tx.description}
                          {tx.type === 'recurring' && (
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase">
                              Fixed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-semibold whitespace-nowrap ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.amount > 0 ? '+' : ''} {tx.amount.toLocaleString()} KES
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      No matches found based on the selected filter configurations.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}