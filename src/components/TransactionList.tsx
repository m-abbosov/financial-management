import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, baseCurrency, exchangeRates } = useFinance();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const categories = ['all', ...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions
    .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
    .filter((t) => {
      const transactionDate = new Date(t.date);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;

      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const convertAmount = (amount: number, fromCurrency: string) => {
    if (!exchangeRates[fromCurrency]) return amount;
    return (amount / exchangeRates[fromCurrency]) * exchangeRates[baseCurrency];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Filter</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <AnimatePresence>
        {filteredTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-b p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">
                {transaction.category} - {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </div>
              <div className="text-sm text-gray-600">{transaction.comment}</div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toFixed(2)}{' '}
                {transaction.currency}
                <span className="text-gray-500 text-sm ml-2">
                  (≈ {convertAmount(transaction.amount, transaction.currency).toFixed(2)} {baseCurrency})
                </span>
              </span>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};