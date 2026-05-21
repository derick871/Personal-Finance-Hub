// src/components/AutoBillAlerts.jsx
import { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../Components/FinanceContext'; 
import { useTheme } from '../context/ThemeContext';
import { Bell, PlusCircle, Trash2, CheckCircle2, Zap } from 'lucide-react';

export default function AutoBillAlerts() {
  const { addTransaction } = useFinance();
  const { isDark } = useTheme();

  const [autoBills, setAutoBills] = useState(() => {
    const saved = localStorage.getItem('user_auto_bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [formValues, setFormValues] = useState({
    name: '',
    paybill: '',
    account: '',
    phone: '',
    amount: '',
    dueDay: ''
  });

  const [executedBills, setExecutedBills] = useState(() => {
    const saved = localStorage.getItem('executed_bills_tracker');
    const currentMonth = new Date().getMonth();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.month === currentMonth) return parsed.ids;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('user_auto_bills', JSON.stringify(autoBills));
  }, [autoBills]);

  const SYSTEM_CURRENT_DAY = 19; 

  const { activeAlerts, billsToAutoPay } = useMemo(() => {
    const alerts = [];
    const autoPayList = [];

    autoBills.forEach(bill => {
      let daysUntilDue = bill.dueDay - SYSTEM_CURRENT_DAY;
      if (daysUntilDue < 0) daysUntilDue = (31 - SYSTEM_CURRENT_DAY) + Number(bill.dueDay);

      const updatedBill = { ...bill, daysUntilDue };

      if (daysUntilDue === 5) {
        alerts.push(updatedBill);
      }

      if (daysUntilDue === 0 && !executedBills.includes(bill.id)) {
        autoPayList.push(bill);
      }
    });

    return { activeAlerts: alerts, billsToAutoPay: autoPayList };
  }, [autoBills, executedBills]);

  useEffect(() => {
    if (billsToAutoPay.length > 0) {
      billsToAutoPay.forEach(async (bill) => {
        try {
          const formattedDate = new Date().toISOString().split('T')[0];
          const description = `[Auto-Pay] ${bill.name} (Acc: ${bill.account})`;
          
          await addTransaction(
            description,
            parseFloat(bill.amount),
            'expense',
            'Utilities',
            formattedDate
          );

          setExecutedBills(prev => {
            const updatedIds = [...prev, bill.id];
            localStorage.setItem('executed_bills_tracker', JSON.stringify({
              month: new Date().getMonth(),
              ids: updatedIds
            }));
            return updatedIds;
          });
        } catch (error) {
          console.error("Automated settlement transaction pipeline failure:", error);
        }
      });
    }
  }, [billsToAutoPay, addTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!formValues.name || !formValues.amount || !formValues.dueDay) return;

    const newBill = {
      id: Date.now(),
      name: formValues.name,
      paybill: formValues.paybill,
      account: formValues.account,
      phone: formValues.phone,
      amount: parseFloat(formValues.amount),
      dueDay: parseInt(formValues.dueDay, 10)
    };

    setAutoBills(prev => [...prev, newBill]);
    setFormValues({ name: '', paybill: '', account: '', phone: '', amount: '', dueDay: '' });
  };

  const handleDeleteBill = (id) => {
    setAutoBills(prev => prev.filter(bill => bill.id !== id));
    setExecutedBills(prev => prev.filter(billId => billId !== id));
  };

  return (
    <div className="space-y-6 transition-colors duration-200">
      {activeAlerts.length > 0 && (
        <section className={`border rounded-xl p-4 flex flex-col gap-3 ${
          isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-amber-400' : 'text-amber-700'
          }`}>
            <Bell size={15} className="animate-bounce" /> M-PESA Automation Notification Pipeline (T-5 Days Alert)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`border rounded-lg p-3 text-xs flex justify-between items-center ${
                isDark ? 'bg-slate-950/70 border-amber-500/20' : 'bg-white border-amber-200/60 shadow-sm'
              }`}>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{alert.name}</p>
                  <p className={`text-[10px] mt-0.5 font-medium ${isDark ? 'text-amber-500/80' : 'text-amber-600'}`}>
                     Due in 5 Days (Automated Settlement Pending on Day {alert.dueDay})
                  </p>
                </div>
                <span className={`font-bold font-mono text-right ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  Kshs: {alert.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTAKE CARD */}
        <div className={`p-5 rounded-xl border lg:col-span-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-sm font-semibold flex items-center gap-2 mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <PlusCircle className="text-blue-400" size={16} /> Monthly Bills
          </h2>
          <form onSubmit={handleCreateBill} className="space-y-3.5">
            <div>
              <label className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Company / Utility Name
              </label>
              <input type="text" name="name" required value={formValues.name} onChange={handleInputChange} placeholder="e.g., Safaricom Home Fiber, Kenya Power" className={`w-full border rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Paybill Number
                </label>
                <input type="text" name="paybill" required value={formValues.paybill} onChange={handleInputChange} placeholder="e.g., 888888" className={`w-full border rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`} />
              </div>
              <div>
                <label className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Account Number
                </label>
                <input type="text" name="account" required value={formValues.account} onChange={handleInputChange} placeholder="e.g., 37199281" className={`w-full border rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`} />
              </div>
            </div>

            <div>
              <label className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                M-PESA Phone Number
              </label>
              <input type="tel" name="phone" required value={formValues.phone} onChange={handleInputChange} placeholder="e.g., 254745668544" className={`w-full border rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Amount (Kshs)
                </label>
                <input type="number" name="amount" min="1" step="0.01" required value={formValues.amount} onChange={handleInputChange} placeholder="Amount" className={`w-full border rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`} />
              </div>
              <div>
                <label className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Due Calendar Day
                </label>
                <input type="number" name="dueDay" min="1" max="31" required value={formValues.formValues?.dueDay || formValues.dueDay} onChange={handleInputChange} placeholder="Day (1-31)" className={`w-full border rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`} />
              </div>
            </div>

            <button type="submit" className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2 shadow-sm">
              <PlusCircle size={14} /> Commit Bill Automation
            </button>
          </form>
        </div>

        {/* REGISTRY TABLE VIEW */}
        <div className={`p-5 rounded-xl border lg:col-span-2 flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Zap className="text-indigo-400" size={16} /> Configured Direct-Debit Utilities Registry
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full font-mono ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                Active Hooks: {autoBills.length}
              </span>
            </div>

            {autoBills.length === 0 ? (
              <div className={`h-48 border border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <p className={`text-xs max-w-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-700'}`}>
                  No automated bills defined yet. Use the intake scheduler form to register utilities.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase tracking-wider font-bold ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-700'
                    }`}>
                      <th className="pb-3 pr-2">Company</th>
                      <th className="pb-3 px-2">Payment Target</th>
                      <th className="pb-3 px-2">Due Day</th>
                      <th className="pb-3 px-2 text-right">Amount</th>
                      <th className="pb-3 pl-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                    {autoBills.map(bill => {
                      const isPaidThisMonth = executedBills.includes(bill.id);
                      return (
                        <tr key={bill.id} className={`transition-colors ${isDark ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50/60'}`}>
                          <td className={`py-3 pr-2 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            <div>
                              {bill.name}
                              <div className="text-[9px] text-slate-500 font-mono font-normal mt-0.5">Src Tel: {bill.phone}</div>
                            </div>
                          </td>
                          <td className={`py-3 px-2 font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <div>PB: {bill.paybill}</div>
                            <div className="text-[10px] text-slate-500">Acc: {bill.account}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-1.5 py-0.5 rounded border font-mono text-[11px] ${
                              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                              Day {bill.dueDay}
                            </span>
                          </td>
                          <td className={`py-3 px-2 text-right font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            Ksh {bill.amount.toFixed(2)}
                          </td>
                          <td className="py-3 pl-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isPaidThisMonth ? (
                                <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border ${
                                  isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                }`} title="Settlement loop cleared for current calendar cycle">
                                  <CheckCircle2 size={12} /> Settled
                                </span>
                              ) : (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  isDark ? 'text-slate-500 bg-slate-950 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
                                }`}>
                                  Pending
                                </span>
                              )}
                              <button onClick={() => handleDeleteBill(bill.id)} className={`p-1 rounded transition-colors ${
                                isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              }`} title="Deregister Utility Hook">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}