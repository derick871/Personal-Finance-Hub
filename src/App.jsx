import { FinanceProvider, useFinance } from './Components/FinanceContext';
import { ThemeProvider } from './context/ThemeContext'; // Adjusted to match standard directory tracking
import Auth from './Components/Auth';
import Dashboard from './Components/Dashboard';

function AppContent() {
  const { user } = useFinance();

  // Route guarding conditional execution block
  if (!user) {
    return <Auth />;
  }
``
  return <Dashboard />;
}

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}