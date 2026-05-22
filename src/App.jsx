import { FinanceProvider, useFinance } from './Components/FinanceContext';
import { ThemeProvider } from './Context/ThemeContext'; 
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