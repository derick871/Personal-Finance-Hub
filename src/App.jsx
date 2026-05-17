import { Auth } from "./Components/Auth";
import { Dashboard } from "./Components/Dashboard";
import { FinanceProvider, useFinance } from "./Components/FinanceContext";

// Created an inner component to safely access context values
function AppContent() {
  const { user } = useFinance();

  // If user state is empty/logged out, show Auth page; otherwise show Dashboard
  return !user ? <Auth /> : <Dashboard />;
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
    
  );

  
}



export default App;