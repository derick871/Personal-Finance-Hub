// src/components/MiniStatement.jsx
import { useState, useMemo } from 'react';
import { FileText, ArrowUpRight, ArrowDownLeft, Clock, SlidersHorizontal, ListFilter, Download } from 'lucide-react';
// Import PDF generators
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function MiniStatement({ transactions }) {
  // Local Control States for the Engine
  const [statementType, setStatementType] = useState('All'); // Options: 'All', 'income', 'expense'
  const [statementLimit, setStatementLimit] = useState(5);   // Options: 5, 10, 15

  // --- YOUR MINI-STATEMENT ENGINE (PRESERVED LOGIC) ---
  const miniStatement = useMemo(() => {
    let filtered = [...transactions];
    if (statementType !== 'All') {
      filtered = filtered.filter(tx => tx.type === statementType);
    }

    const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const records = sorted.slice(0, statementLimit);

    let internalSum = 0;
    filtered.forEach(tx => {
      internalSum += tx.amount;
    });

    return {
      records,
      volume: records.length,
      aggregateValue: internalSum,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }, [transactions, statementType, statementLimit]);

  // --- PDF GENERATION ENGINE HANDLE ---
  const downloadPDFStatement = () => {
    const doc = new jsPDF();
    
    // 1. Document Branding Header Context
    doc.setFillColor(15, 23, 42); // slate-900 canvas block
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FINANCEHUB STATEMENT", 14, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Generated at: ${new Date().toLocaleDateString()} ${miniStatement.generatedAt}`, 14, 32);
    doc.text(`Filter Mode: ${statementType.toUpperCase()}`, 150, 32);

    // 2. Summary Card Block Metrics
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(14, 48, 182, 20, 3, 3, 'FD');
    
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("WINDOW AGGREGATION TOTAL", 20, 56);
    
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(14);
    doc.text(`Kshs ${miniStatement.aggregateValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 20, 64);

    // 3. Transform Data Array Rows to AutoTable Grid Format
    const tableColumns = ["Date", "Description", "Category", "Type", "Amount"];
    const tableRows = miniStatement.records.map(tx => [
      tx.date,
      tx.description,
      tx.category,
      tx.type.toUpperCase(),
      `${tx.type === 'income' ? '+' : '-'} KShs ${tx.amount.toFixed(2)}`
    ]);

    // 4. Paint the Data Table
    doc.autoTable({
      startY: 76,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], fontStyle: 'bold', fontSize: 10 }, // slate-800
      bodyStyles: { fontSize: 9, textColor: [51, 65, 85] }, // slate-700
      columnStyles: {
        4: { halign: 'right', fontStyle: 'bold' } // Align currency column layout cleanly
      },
      didParseCell: function(data) {
        // Dynamic coloring condition row cells based on cash vector type
        if (data.column.index === 4) {
          const rowText = data.cell.raw || "";
          if (rowText.startsWith('+')) {
            data.cell.styles.textColor = [16, 185, 129]; // emerald-500
          } else if (rowText.startsWith('-')) {
            data.cell.styles.textColor = [244, 63, 94]; // rose-500
          }
        }
      }
    });

    // 5. Trigger System File Browser Storage Pipeline Save Action
    doc.save(`Mini_Statement_${Date.now()}.pdf`);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 max-w-md w-full">
      
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500/10 text-blue-400 p-2 rounded-xl border border-blue-500/10">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-slate-200 text-sm font-semibold tracking-tight">Mini-Statement Engine</h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock size={10} /> Active compilation: {miniStatement.generatedAt}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* RUNTIME DOWNLOAD BUTTON */}
          <button
            onClick={downloadPDFStatement}
            disabled={miniStatement.records.length === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download Statement PDF"
          >
            <Download size={14} />
          </button>

          {/* RUNTIME METRIC BADGE */}
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono font-medium text-slate-400">
            Vol: <span className="text-blue-400 font-bold">{miniStatement.volume}</span>
          </div>
        </div>
      </div>

      {/* FILTER SYSTEM CONTROLS TRIPPERS */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">
        {/* Type Selector Toggle */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800/80">
          <ListFilter size={12} className="text-slate-500" />
          <select 
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
            className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer w-full text-[11px]"
          >
            <option value="All" className="bg-slate-950">All Vectors</option>
            <option value="income" className="bg-slate-950">Incomes Only</option>
            <option value="expense" className="bg-slate-950">Outlays Only</option>
          </select>
        </div>

        {/* Dynamic Slice Window Row Constraints */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800/80">
          <SlidersHorizontal size={12} className="text-slate-500" />
          <select 
            value={statementLimit}
            onChange={(e) => setStatementLimit(Number(e.target.value))}
            className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer w-full text-[11px]"
          >
            <option value={5} className="bg-slate-950">Limit: 5 Rows</option>
            <option value={10} className="bg-slate-950">Limit: 10 Rows</option>
            <option value={15} className="bg-slate-950">Limit: 15 Rows</option>
          </select>
        </div>
      </div>

      {/* STATEMENT SLICE SCROLL SHEET */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {miniStatement.records.length > 0 ? (
          miniStatement.records.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-slate-950/50 hover:bg-slate-950 border border-slate-800/40 hover:border-slate-800 p-2.5 rounded-xl flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  tx.type === 'income' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                }`}>
                  {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                
                <div className="min-w-0">
                  <h4 className="text-slate-200 text-xs font-semibold truncate max-w-[180px]">
                    {tx.description}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                    <span className="font-mono">{tx.date}</span>
                    <span>•</span>
                    <span className="px-1 py-0.2 bg-slate-800/80 rounded text-[9px] text-slate-400">
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`text-right text-xs font-mono font-bold ${
                tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {tx.type === 'income' ? '+' : '-'} Kshs {tx.amount.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl">
            No items matching your evaluation criteria
          </div>
        )}
      </div>

      {/* FOOTER TOTALIZER BAR */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">
          Window Aggregation:
        </span>
        <span className="font-mono font-bold text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
          Kshs {miniStatement.aggregateValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

    </div>
  );
}