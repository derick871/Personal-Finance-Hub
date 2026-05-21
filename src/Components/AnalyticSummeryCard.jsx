// AnalyticsSummaryCards.jsx
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import MetricCard from './MetricCard';
import { useTheme } from '../context/ThemeContext';

export default function AnalyticsSummaryCards({ metrics }) {
  const { isDark } = useTheme();

  // Theme classes
  const sectionBg = isDark ? 'bg-slate-950' : 'bg-slate-50';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-800';

  return (
    <section
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl transition-colors duration-300 ${sectionBg}`}
    >
      <div className={textClass}>
        <MetricCard
          title="Net Cash Flow"
          value={`Kshs ${metrics.netCashFlow.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={Wallet}
          variant={metrics.netCashFlow >= 0 ? 'emerald' : 'rose'}
          isDark={isDark}
        />
      </div>

      <div className={textClass}>
        <MetricCard
          title="Aggregate Revenue"
          value={`Kshs ${metrics.incomeSum.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={TrendingUp}
          variant="blue"
          isDark={isDark}
        />
      </div>

      <div className={textClass}>
        <MetricCard
          title="Total Outlays"
          value={`Kshs ${metrics.expenseSum.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={TrendingDown}
          variant="rose"
          isDark={isDark}
        />
      </div>

      <div className={textClass}>
        <MetricCard
          title="Savings Elasticity"
          value={`${metrics.savingsRate}%`}
          icon={Percent}
          variant="indigo"
          isDark={isDark}
        />
      </div>
    </section>
  );
}