import { createContext, useContext, useEffect, useState } from "react";
import { Currency, ExchangeRates, Transaction } from "../types";
import axios from "axios";
interface FinanceContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    baseCurrency: Currency;
    setBaseCurrency: (currency: Currency) => void;
    exchangeRates: ExchangeRates;
    loading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });
    const [baseCurrency, setBaseCurrency] = useState<Currency>('USD');
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_API_KEY}/latest/${baseCurrency}`)

                setExchangeRates(res.data.conversion_rates);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                setLoading(false);
            }
        }

        fetchRates();
        const interval = setInterval(fetchRates, 60000);
        return () => clearInterval(interval);
    }, [baseCurrency])

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
        };
        setTransactions((prev) => [...prev, newTransaction]);
    }

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <FinanceContext.Provider value={
            {
                transactions,
                addTransaction,
                deleteTransaction,
                baseCurrency,
                setBaseCurrency,
                exchangeRates,
                loading
            }
        }>
            {children}
        </FinanceContext.Provider>
    )
}

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};