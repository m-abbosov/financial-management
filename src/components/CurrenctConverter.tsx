import React, { useState, useEffect } from 'react';
import { Currency } from '../types';
import { ArrowRightLeft } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import numberWithSpaces from '../helpers/numberWithSpaces';

export const CurrencyConverter: React.FC = () => {
    const { exchangeRates, baseCurrency } = useFinance();
    const [amount, setAmount] = useState<string>('');
    const [fromCurrency, setFromCurrency] = useState<Currency>(baseCurrency);
    const [toCurrency, setToCurrency] = useState<Currency>('EUR');
    const [result, setResult] = useState<number | null>(null);

    const currencies: Currency[] = ['USD', 'EUR', 'UZS'];

    useEffect(() => {
        if (amount && exchangeRates[toCurrency]) {
            const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
            setResult(parseFloat(amount) * rate);
        }
    }, [amount, fromCurrency, toCurrency, exchangeRates]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Currency Converter</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Amount"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value as Currency)}
                        className="w-full p-2 border rounded"
                    >
                        {currencies.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>
                    <ArrowRightLeft className="w-6 h-6" />
                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value as Currency)}
                        className="w-full p-2 border rounded"
                    >
                        {currencies.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="text-xl font-semibold text-center">
                    {result !== null && amount !== '' && (
                        <span>
                            {numberWithSpaces(Number(parseFloat(amount).toFixed(2)))} {fromCurrency} = {numberWithSpaces(Number(result.toFixed(2)))} {toCurrency}
                        </span>
                    )}
                </div>
            </div>
            <h2 className='text-2xl font-bold mb-4 mt-5'>Currency Rates</h2>
            <div className='grid grid-cols-3'>
                {
                    currencies.map((curr) => (
                        <div key={curr} className='flex items-center gap-2'>
                            <span className='font-semibold'>{curr}:</span>
                            <span className=''>{numberWithSpaces(Number(exchangeRates[curr].toFixed(2)))}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};