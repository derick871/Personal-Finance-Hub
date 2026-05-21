import { Filter, Trash2, Layers } from 'lucide-react';

export default function TransactionTable({ 
  visibleTransactions, 
  totalCount, 
  categoryFilter, 
  setCategoryFilter, 
  filterCategories, 
  deleteTransaction 
}) {
  return (
    <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers size={16} className="text-slate-400" /> Complete Transaction Ledger
            </h2>
            <p className="text-[11px] text-slate-500">Real-time Cloud Sync Engine (Firestore)</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] self-start sm:self-center">
            <Filter size={12} className="text-slate-500" />
            <span className="text-slate-500">Class:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer text-xs"
            >
              {filterCategories.map((cat, idx) => (
                <option key={idx} value={cat} className="bg-slate-950 text-slate-300">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500">
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
                    <td className={`py-2.5 px-3 text-right font-bold font-mono ${tx.type === 'income' ? 'text-amber-500' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}Kshs: {tx.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button onClick={() => deleteTransaction(tx.id)} className="text-slate-600 hover:text-red-500 p-1 rounded transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-white font-medium">No live system records match specifications.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-[10px] text-white text-right mt-4 pt-3 border-t border-slate-800/50 font-mono">
        Live State Sync Counter: {visibleTransactions.length} of {totalCount} entries active
      </div>
    </div>
  );
}