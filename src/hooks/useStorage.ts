import { useState, useEffect } from 'react';
import type { Transaction, Merchant, DebtPayment } from '../types';

export const useStorage = () => {
    const [merchants, setMerchants] = useState<Merchant[]>(() => {
        const saved = localStorage.getItem('alyosr_merchants');
        return saved ? JSON.parse(saved) : [];
    });

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('alyosr_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [debtPayments, setDebtPayments] = useState<DebtPayment[]>(() => {
        const saved = localStorage.getItem('alyosr_debt_payments');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('alyosr_merchants', JSON.stringify(merchants));
    }, [merchants]);

    useEffect(() => {
        localStorage.setItem('alyosr_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('alyosr_debt_payments', JSON.stringify(debtPayments));
    }, [debtPayments]);

    const addMerchant = (merchant: Omit<Merchant, 'id'>) => {
        const newMerchant = { ...merchant, id: crypto.randomUUID() };
        setMerchants([...merchants, newMerchant]);
        return newMerchant;
    };

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        setTransactions([newTransaction, ...transactions]);
        return newTransaction;
    };

    const updateTransaction = (id: string, updates: Partial<Transaction>) => {
        setTransactions(transactions.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const addDebtPayment = (payment: Omit<DebtPayment, 'id'>) => {
        const newPayment = { ...payment, id: crypto.randomUUID() };
        setDebtPayments([newPayment, ...debtPayments]);

        // Update paid amount in related credit transactions if needed, 
        // or just manage merchant balance dynamically in selectors
        return newPayment;
    };

    const getMerchantBalance = (merchantId: string) => {
        const merchantTransactions = transactions.filter(t => t.merchantId === merchantId);
        const merchantPayments = debtPayments.filter(p => p.merchantId === merchantId);

        const totalTransactionDebt = merchantTransactions.reduce((sum, t) => {
            if (t.paymentType === 'credit') {
                return sum + (t.totalAmount - t.paidAmount);
            }
            return sum;
        }, 0);

        const totalPaid = merchantPayments.reduce((sum, p) => sum + p.amount, 0);

        return totalTransactionDebt - totalPaid;
    };

    return {
        merchants,
        transactions,
        debtPayments,
        addMerchant,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addDebtPayment,
        getMerchantBalance,
    };
};
