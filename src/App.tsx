import { CurrencyConverter } from "./components/CurrenctConverter";
import { Dashboard } from "./components/Dashboard";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { FinanceProvider } from "./context/FinanceContext"
import { Wallet } from 'lucide-react';

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Personal Finance Manager</h1>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <CurrencyConverter />
            <Dashboard />
            <TransactionForm />
            <TransactionList />
          </div>
        </main>
      </div>
    </FinanceProvider>
  )
}

export default App
