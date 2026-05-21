import { useState } from 'react';
import Navbar from './Navbar'; // Adjust paths based on your file tree
import Footer from './Footer';

// Mock views for illustration—swap these imports with your actual component views
function DashboardView({ netCashFlow }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Analytics Overview
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Welcome back. Here is your current data aggregation layer breakdown.
      </p>
      {/* Your actual main dashboard chart modules and metric grids go here */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Available Liquid Capital
        </span>
        <span className="text-3xl font-mono font-black text-slate-900 dark:text-slate-100">
          Kshs {netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

function LedgerLogsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Ledger Logs & Audit Trail
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Historical database of all automated transactional pushes and billing allocations.
      </p>
      {/* Your actual tabular transaction history block goes here */}
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400 font-mono">
        [Firestore Real-Time Data Ingestion Matrix]
      </div>
    </div>
  );
}

export default function PersonalFinanceHub() {
  // Global States shared between layout anchors
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [netCashFlow, setNetCashFlow] = useState(""); // Example initial balance context

  const handleLogout = () => {
    console.log("Terminating secure application pipeline session...");
    // Implement your Firebase auth sign-out or session cleanup here
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* SYSTEM HEADER NAVIGATION */}
      <Navbar 
        netCashFlow={netCashFlow} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* CORE INTERACTIVE CONTENT PANEL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'Dashboard' ? (
          <DashboardView netCashFlow={netCashFlow} />
        ) : (
          <LedgerLogsView />
        )}
      </main>

      {/* SYSTEM FOOTER METRICS & COMPLIANCE DISCLOSURES */}
      <Footer />
    </div>
  );
}