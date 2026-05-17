import { useState } from 'react';
import { useFinance } from './FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  // FIXED: Changed logOutUser to logoutUser to match context definition
  const { user, logoutUser, loginWithGoogle, transactions, addTransaction, deleteTransaction, loading } = useFinance();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  // Core Metric Formulas
  const incomeTotal = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netWorth = incomeTotal - expenseTotal;

  const chartData = [
    {
      name: 'Financial Overview',
      Income: incomeTotal,
      Expenses: expenseTotal,
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert('Fill out remaining form spaces');
    await addTransaction(title, amount, type, category);
    setTitle('');
    setAmount('');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">Syncing data with cloud services...</p>
        </div>
      </div>
    );
  }

  // Handle Protected Login View if user isn't authenticated yet
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-6 text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-900">Finance Hub Canvas</h2>
          <p className="text-sm text-gray-500">Please sign in to view and organize your active ledger items.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-colors shadow-sm"
          >
            Sign In With Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Welcome Panel */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Finance Hub Canvas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Logged in as: <span className="font-semibold text-gray-700">{user?.email}</span>
            </p>
          </div>
          <button 
            onClick={logoutUser} 
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-lg transition-colors shadow-sm"
          >
            Logout
          </button>
        </header>

        {/* Ribbon Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Net Worth Card */}
          <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100/80 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-sm font-medium text-blue-700 uppercase tracking-wider">Calculated Net Worth</h4>
            <h2 className={`text-3xl font-extrabold mt-2 tracking-tight ${netWorth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          
          {/* Income Card */}
          <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100/80 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-sm font-medium text-emerald-700 uppercase tracking-wider">Inflow (Income)</h4>
            <h2 className="text-3xl font-extrabold text-emerald-700 mt-2 tracking-tight">
              +${incomeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          
          {/* Expenses Card */}
          <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-100/80 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-sm font-medium text-rose-700 uppercase tracking-wider">Outflow (Expenses)</h4>
            <h2 className="text-3xl font-extrabold text-rose-700 mt-2 tracking-tight">
              -${expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Visual Breakdown</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '14px' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lower Dashboard Splits */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Transaction Input Engine */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Post Action Item</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Entry Label</label>
                <input 
                  type="text" 
                  placeholder="e.g. Electric bill" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stream Class</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="expense">Expense Deduction</option>
                  <option value="income">Income Resource</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Context Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="Food">Food / Groceries</option>
                  <option value="Housing">Housing / Rent</option>
                  <option value="Utilities">Utilities / Tech</option>
                  <option value="Entertainment">Leisure / Entertainment</option>
                  <option value="Salary">Inbound / Paycheck</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-600/10"
              >
                Commit Entry
              </button>
            </form>
          </div>

          {/* Real-time Ledger Log */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Live Activity Ledger</h3>
            <div className="max-h-[440px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">No movements listed in cloud log profiles.</p>
              ) : (
                transactions.map(t => (
                  <div 
                    key={t.id} 
                    className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:scale-[1.01] hover:shadow-md border-l-4 ${
                      t.type === 'income' ? 'border-l-emerald-500' : 'border-l-rose-500'
                    }`}
                  >
                    <div>
                      <h5 className="text-sm font-semibold text-gray-800">{t.title}</h5>
                      <span className="inline-block text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md mt-1 border border-gray-100">
                        {t.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(t.id)} 
                        className="text-gray-300 hover:text-rose-500 active:text-rose-700 p-1 rounded-md transition-colors"
                        title="Delete record"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};