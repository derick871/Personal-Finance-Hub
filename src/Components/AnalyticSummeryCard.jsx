// src/components/AnalyticsSummaryCards.jsx
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import MetricCard from './MetricCard';

export default function AnalyticsSummaryCards({ metrics }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Net Cash Flow" 
        value={`$${metrics.netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={Wallet}
        variant={metrics.netCashFlow >= 0 ? 'emerald' : 'rose'}
      />
      <MetricCard 
        title="Aggregate Revenue" 
        value={`$${metrics.incomeSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        icon={TrendingUp}
        variant="emerald"
      />
      <MetricCard 
        title="Total Outlays" 
        value={`$${metrics.expenseSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        icon={TrendingDown}
        variant="rose"
      />
      <MetricCard 
        title="Savings Elasticity" 
        value={`${metrics.savingsRate}%`}
        icon={Percent}
        variant="blue"
      />
    </section>
  );
}