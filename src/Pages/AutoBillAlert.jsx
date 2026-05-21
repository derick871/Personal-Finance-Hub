import { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../Components/FinanceContext'; 
import { Bell, PlusCircle, Trash2, CheckCircle2, Zap } from 'lucide-react';

export default function AutoBillAlerts() {
  const { addTransaction } = useFinance();

  // 1. Dynamic State: Initialize with LocalStorage data so user entries persist
  const [autoBills, setAutoBills] = useState(() => {
    const saved = localStorage.getItem('user_auto_bills');
    return saved ? JSON.parse(saved) : [];
  });

  // Form input capture state
  const [formValues, setFormValues] = useState({
    name: '',
    paybill: '',
    account: '',
    phone: '',
    amount: '',
    dueDay: ''
  });

  // Track executed bills for the current month so they don't fire duplicates repeatedly
  const [executedBills, setExecutedBills] = useState(() => {
    const saved = localStorage.getItem('executed_bills_tracker');
    const currentMonth = new Date().getMonth();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.month === currentMonth) return parsed.ids;
    }
    return [];
  });

  // Save changes to localStorage whenever the bills change
  useEffect(() => {
    localStorage.setItem('user_auto_bills', JSON.stringify(autoBills));
  }, [autoBills]);

  // 2. Calculations Pipeline: Alerts Engine & Auto-Payment Trigger
  const SYSTEM_CURRENT_DAY = 19; // Current timeline context anchor (May 19, 2026)

  const { activeAlerts, billsToAutoPay } = useMemo(() => {
    const alerts = [];
    const autoPayList = [];

    autoBills.forEach(bill => {
      let daysUntilDue = bill.dueDay - SYSTEM_CURRENT_DAY;
      // Handle rolling wrap-around if due day is early next month
      if (daysUntilDue < 0) daysUntilDue = (31 - SYSTEM_CURRENT_DAY) + Number(bill.dueDay);

      const updatedBill = { ...bill, daysUntilDue };

      // Requirement A: Alert user 5 days before payment is due
      if (daysUntilDue === 5) {
        alerts.push(updatedBill);
      }

      // Requirement B: Process automatic payments when due date hits (daysUntilDue === 0)
      if (daysUntilDue === 0 && !executedBills.includes(bill.id)) {
        autoPayList.push(bill);
      }
    });

    return { activeAlerts: alerts, billsToAutoPay: autoPayList };
  }, [autoBills, executedBills]);

  // 3. Automated Payment Processing Side-Effect Loop
  useEffect(() => {
    if (billsToAutoPay.length > 0) {
      billsToAutoPay.forEach(async (bill) => {
        try {
          const formattedDate = new Date().toISOString().split('T')[0];
          const description = `[Auto-Pay] ${bill.name} (Acc: ${bill.account})`;
          
          // Requirement C: Automatically process & inject directly into the main mini statement context
          await addTransaction(
            description,
            parseFloat(bill.amount),
            'expense',
            'Utilities',
            formattedDate
          );

          // Track execution status to prevent infinite loop cycles
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

  // 4. Action Handlers
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
    <div className="space-y-6">
      {activeAlerts.length > 0 && (
        <section className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Bell size={15} className="animate-bounce" /> M-PESA Automation Notification Pipeline (T-5 Days Alert)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="bg-slate-950/70 border border-amber-500/20 rounded-lg p-3 text-xs flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">{alert.name}</p>
                  <p className="text-[10px] text-amber-500/80 mt-0.5 font-medium">
                     Due in 5 Days (Automated Settlement Pending on Day {alert.dueDay})
                  </p>
                </div>
                <span className="font-bold text-amber-400 font-mono text-right">
                  Kshs: {alert.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: WORKSPACE MANAGEMENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BILL FORM REGISTRATION INTAKE CRADLE */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
            <PlusCircle className="text-blue-400" size={16} /> Monthly Bills
          </h2>
          <form onSubmit={handleCreateBill} className="space-y-3.5">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Company / Utility Name</label>
              <input type="text" name="name" required value={formValues.name} onChange={handleInputChange} placeholder="e.g., Safaricom Home Fiber, Kenya Power" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-white block mb-1">Paybill Number</label>
                <input type="text" name="paybill" required value={formValues.paybill} onChange={handleInputChange} placeholder="e.g., 888888" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-white block mb-1">Account Number</label>
                <input type="text" name="account" required value={formValues.account} onChange={handleInputChange} placeholder="e.g., 37199281" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white block mb-1">M-PESA Phone Number</label>
              <input type="tel" name="phone" required value={formValues.phone} onChange={handleInputChange} placeholder="e.g., 254745668544" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-white block mb-1">Amount (Kshs)</label>
                <input type="number" name="amount" min="1" step="0.01" required value={formValues.amount} onChange={handleInputChange} placeholder="Amount" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-white block mb-1">Due Calendar Day</label>
                <input type="Date" id="date" name="dueDay" min="1" max="31" required value={formValues.dueDay} onChange={handleInputChange} placeholder="Day (1-31)" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <button type="submit" className="w-half p-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2">
              <PlusCircle size={14} /> Commit Bill Automation
            </button>
          </form>
        </div>

        {/* BILL MATRIX RECONCILIATION TABLE LAYER */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Zap className="text-indigo-400" size={16} /> Configured Direct-Debit Utilities Registry
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-full text-slate-400 font-mono">
                Active Hooks: {autoBills.length}
              </span>
            </div>

            {autoBills.length === 0 ? (
              <div className="h-48 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs text-white max-w-xs leading-relaxed">
                  No automated bills defined yet. Use the intake scheduler form to register utilities.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider font-bold text-white">
                      <th className="pb-3 pr-2">Company</th>
                      <th className="pb-3 px-2">Payment Target</th>
                      <th className="pb-3 px-2">Due Day</th>
                      <th className="pb-3 px-2 text-right">Amount</th>
                      <th className="pb-3 pl-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {autoBills.map(bill => {
                      const isPaidThisMonth = executedBills.includes(bill.id);
                      return (
                        <tr key={bill.id} className="hover:bg-slate-950/40 group transition-colors">
                          <td className="py-3 pr-2 font-semibold text-slate-200">
                            <div>
                              {bill.name}
                              <div className="text-[9px] text-slate-500 font-mono font-normal mt-0.5">Src Tel: {bill.phone}</div>
                            </div>
                          </td>
                          <td className="py-3 px-2 font-mono text-slate-400 text-[11px]">
                            <div>PB: {bill.paybill}</div>
                            <div className="text-[10px] text-slate-500">Acc: {bill.account}</div>
                          </td>
                          <td className="py-3 px-2 text-slate-300">
                            <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                              Day {bill.dueDate}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-slate-200">
                            Ksh {bill.amount.toFixed(2)}
                          </td>
                          <td className="py-3 pl-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isPaidThisMonth ? (
                                <span className="text-emerald-400 flex items-center gap-0.5 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Settlement loop cleared for current calendar cycle">
                                  <CheckCircle2 size={12} /> Settled
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                  Pending
                                </span>
                              )}
                              <button onClick={() => handleDeleteBill(bill.id)} className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors" title="Deregister Utility Hook">
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