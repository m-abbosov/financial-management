export type Currency = 'USD' | 'EUR' | 'UZS';

export interface Transaction {
    id: string;
    amount: number;
    currency: Currency;
    category: string;
    type: 'income' | 'expense';
    date: string;
    comment: string;
}

export interface ExchangeRates {
    [key: string]: number;
}