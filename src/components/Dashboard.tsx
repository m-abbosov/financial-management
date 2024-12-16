import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Dashboard: React.FC = () => {
    const { transactions, baseCurrency, exchangeRates } = useFinance();

    const convertAmount = (amount: number, fromCurrency: string) => {
        if (!exchangeRates[fromCurrency]) return amount;
        return (amount / exchangeRates[fromCurrency]) * exchangeRates[baseCurrency];
    };

    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + convertAmount(t.amount, t.currency), 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + convertAmount(t.amount, t.currency), 0);

    const netBalance = totalIncome - totalExpense;

    const expensesByCategory = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
            const amount = convertAmount(t.amount, t.currency);
            acc[t.category] = (acc[t.category] || 0) + amount;
            return acc;
        }, {} as Record<string, number>);

    const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold mb-4">Financial Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Income:</span>
                        <span className="text-green-600 font-semibold">
                            {totalIncome.toFixed(2)} {baseCurrency}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Expenses:</span>
                        <span className="text-red-600 font-semibold">
                            {totalExpense.toFixed(2)} {baseCurrency}
                        </span>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Net Balance:</span>
                            <span className={`font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netBalance.toFixed(2)} {baseCurrency}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold mb-4">Expense Distribution</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`${value.toFixed(2)} ${baseCurrency}`, 'Amount']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};