import { useTransactions } from '../Components/FinanceContext';
import{useTheme} from '../context/ThemeContext';
export const TransactionList = () => {
  const { isDark } = useTheme();
  const { transactions, deleteTransaction } = useTransactions();

  // Calculations
  const amounts = transactions.map(t => t.amount);
  const totalBalance = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expenses = Math.abs(amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0)).toFixed(2);

  return (
    <div>
      {/* Metrics Header */}
      <div style={{ display: 'flex', justifyContent: 'space-around', background: '#eee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div>
          <h4>Balance</h4>
          <h2 style={{ color: totalBalance >= 0 ? 'green' : 'red' }}>${totalBalance}</h2>
        </div>
        <div>
          <h4>Income</h4>
          <h2 style={{ color: 'green' }}>${income}</h2>
        </div>
        <div>
          <h4>Expenses</h4>
          <h2 style={{ color: 'red' }}>${expenses}</h2>
        </div>
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
      </div>

      {/* History List */}
      <h3>History Log</h3>
      <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
        {transactions.map((t) => (
          <li key={t.id} style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '10px', 
            margin: '5px 0',
            background: '#fff',
            borderLeft: `5px solid ${t.amount < 0 ? 'red' : 'green'}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <span>{t.text} <small style={{ color: '#888' }}>({t.category})</small></span>
            <span>
              {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount)}
              <button 
                onClick={() => deleteTransaction(t.id)} 
                style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
              >
                X
                isDark ? 'text-slate-500 hover:text-rose-500' : 'text-red-500 hover:text-red-700'
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TransactionList;