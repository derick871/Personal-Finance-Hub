// src/components/MiniStatement.jsx
import { useState, useMemo } from 'react';
import { FileText, ArrowUpRight, ArrowDownLeft, Clock, SlidersHorizontal, ListFilter, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; 
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function MiniStatement({ transactions }) {
  const { isDark } = useTheme();
  const [statementType, setStatementType] = useState('All'); 
  const [statementLimit, setStatementLimit] = useState(5);   

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

  const downloadPDFStatement = () => {
    const doc = new jsPDF();
    
    // 1. Theme-Aware Document Branding Header Context
    const headerBg = isDark ? [15, 23, 42] : [30, 41, 59]; // slate-900 vs slate-800
    doc.setFillColor(...headerBg);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FINANCEHUB STATEMENT", 14, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); 
    doc.text(`Generated at: ${new Date().toLocaleDateString()} ${miniStatement.generatedAt}`, 14, 32);
    doc.text(`Filter Mode: ${statementType.toUpperCase()}`, 150, 32);

    // 2. Theme-Aware Summary Card Block Metrics
    const cardBorder = isDark ? [51, 65, 85] : [226, 232, 240]; // slate-700 vs slate-200
    const cardBg = isDark ? [30, 41, 59] : [248, 250, 252];     // slate-800 vs slate-50
    const cardTextPrimary = isDark ? [241, 245, 249] : [15, 23, 42]; 
    
    doc.setDrawColor(...cardBorder);
    doc.setFillColor(...cardBg);
    doc.roundedRect(14, 48, 182, 20, 3, 3, 'FD');
    
    doc.setTextColor(100, 116, 139); 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("WINDOW AGGREGATION TOTAL", 20, 56);
    
    doc.setTextColor(...cardTextPrimary);
    doc.setFontSize(14);
    doc.text(`Kshs ${miniStatement.aggregateValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 20, 64);

    // 3. Transform Data Array Rows
    const tableColumns = ["Date", "Description", "Category", "Type", "Amount"];
    const tableRows = miniStatement.records.map(tx => [
      tx.date,
      tx.description,
      tx.category,
      tx.type.toUpperCase(),
      `${tx.type === 'income' ? '+' : '-'} KShs ${tx.amount.toFixed(2)}`
    ]);

    // 4. Paint the Dynamic Theme Data Table
    doc.autoTable({
      startY: 76,
      head: [tableColumns],
      body: tableRows,
      theme: isDark ? 'dark' : 'striped',
      headStyles: { 
        fillColor: isDark ? [15, 23, 42] : [30, 41, 59], 
        fontStyle: 'bold', 
        fontSize: 10 
      },
      bodyStyles: { 
        fontSize: 9, 
        textColor: isDark ? [226, 232, 240] : [51, 65, 85] 
      },
      columnStyles: {
        4: { halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: function(data) {
        if (data.column.index === 4) {
          const rowText = data.cell.raw || "";
          if (rowText.startsWith('+')) {
            data.cell.styles.textColor = [16, 185, 129]; 
          } else if (rowText.startsWith('-')) {
            data.cell.styles.textColor = [244, 63, 94]; 
          }
        }
      }
    });

    doc.save(`Mini_Statement_${Date.now()}.pdf`);
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-xl space-y-4 max-w-md w-full transition-colors duration-200 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDark ? 'border-slate-800/60' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/10' : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}>
            <FileText size={18} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Mini-Statement Engine
            </h3>
            <p className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock size={10} /> Active compilation: {miniStatement.generatedAt}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={downloadPDFStatement}
            disabled={miniStatement.records.length === 0}
            className={`p-2 rounded-lg transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-slate-950 hover:bg-amber-500 text-slate-300 hover:text-white border-slate-700/60' 
                : 'bg-slate-500 hover:bg-slate-400 text-white hover:text-amber-500 border-slate-500'
            }`}
            title="Download Statement PDF"
          >
            <Download size={14} />
          </button>

          <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-medium ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            Vol: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-bold`}>{miniStatement.volume}</span>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-2 text-xs p-2 rounded-xl border ${
        isDark ? 'bg-slate-950/40 border-slate-800/50' : 'bg-slate-50 border-slate-100'
      }`}>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${
          isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <ListFilter size={12} className="text-slate-500" />
          <select 
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
            className={`bg-transparent font-medium focus:outline-none cursor-pointer w-full text-[11px] ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <option value="All" className={isDark ? 'bg-slate-950' : 'bg-white'}>All Vectors</option>
            <option value="income" className={isDark ? 'bg-slate-950' : 'bg-white'}>Incomes Only</option>
            <option value="expense" className={isDark ? 'bg-slate-950' : 'bg-white'}>Outlays Only</option>
          </select>
        </div>

        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${
          isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <SlidersHorizontal size={12} className="text-slate-500" />
          <select 
            value={statementLimit}
            onChange={(e) => setStatementLimit(Number(e.target.value))}
            className={`bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer w-full text-[11px] ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <option value={5} className={isDark ? 'bg-slate-950' : 'bg-white'}>Limit: 5 Rows</option>
            <option value={10} className={isDark ? 'bg-slate-950' : 'bg-white'}>Limit: 10 Rows</option>
            <option value={15} className={isDark ? 'bg-slate-950' : 'bg-white'}>Limit: 15 Rows</option>
          </select>
        </div>
      </div>

      <div className={`space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin ${
        isDark ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-slate-200'
      }`}>
        {miniStatement.records.length > 0 ? (
          miniStatement.records.map((tx) => (
            <div 
              key={tx.id} 
              className={`p-2.5 rounded-xl flex items-center justify-between transition-all border ${
                isDark 
                  ? 'bg-slate-950/50 hover:bg-slate-950 border-slate-800/40 hover:border-slate-800' 
                  : 'bg-slate-50/70 hover:bg-white border-slate-100 hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  tx.type === 'income' 
                    ? isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : isDark ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                
                <div className="min-w-0">
                  <h4 className={`text-xs font-semibold truncate max-w-[180px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {tx.description}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                    <span className="font-mono">{tx.date}</span>
                    <span>•</span>
                    <span className={`px-1 py-0.2 rounded text-[9px] ${
                      isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`text-right text-xs font-mono font-bold ${
                tx.type === 'income' 
                  ? isDark ? 'text-emerald-400' : 'text-emerald-600' 
                  : isDark ? 'text-rose-400' : 'text-rose-600'
              }`}>
                {tx.type === 'income' ? '+' : '-'} Kshs {tx.amount.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 text-xs border border-dashed rounded-xl ${
            isDark ? 'text-white border-slate-800' : 'text-slate-600 border-slate-200'
          }`}>
            No items matching your evaluation criteria
          </div>
        )}
      </div>

      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
        isDark ? 'bg-slate-950 border-slate-800/60 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
      }`}>
        <span className="text-slate-700 font-medium uppercase tracking-wider text-[10px]">
          Window Aggregation:
        </span>
        <span className={`font-mono font-bold px-2 py-1 rounded border ${
          isDark ? 'text-white bg-slate-900 border-slate-800' : 'text-slate-800 bg-white border-slate-200'
        }`}>
          Kshs {miniStatement.aggregateValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

    </div>
  );
}