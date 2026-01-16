import { useState, useEffect } from 'react';
import type { Transaction, Merchant, DebtPayment, Product } from '../types';

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

    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('alyosr_products');
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

    useEffect(() => {
        localStorage.setItem('alyosr_products', JSON.stringify(products));
    }, [products]);

    const addMerchant = (merchant: Omit<Merchant, 'id'>) => {
        const newMerchant = { ...merchant, id: crypto.randomUUID() };
        setMerchants([...merchants, newMerchant]);
        return newMerchant;
    };

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: crypto.randomUUID() };
        setProducts([...products, newProduct]);
        return newProduct;
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

    const seedDemoData = () => {
        // Clear all
        setMerchants([]);
        setTransactions([]);
        setDebtPayments([]);
        setProducts([]);

        // Merchants
        const s1 = { id: 's1', name: 'شركة النور للمواد الغذائية', type: 'supplier' as const };
        const s2 = { id: 's2', name: 'مزراعة الهداية', type: 'supplier' as const };
        const c1 = { id: 'c1', name: 'سوبر ماركت مكة', type: 'customer' as const };
        const c2 = { id: 'c2', name: 'أولاد رجب', type: 'customer' as const };

        setMerchants([s1, s2, c1, c2]);

        // Products
        const p1 = { id: 'p1', name: 'لحم بقري بلدي', supplierId: 's1' };
        const p2 = { id: 'p2', name: 'ثوم مفروم ممتاز', supplierId: 's2' };
        const p3 = { id: 'p3', name: 'بهارات بسطرمة سرية', supplierId: 's1' };
        const p4 = { id: 'p4', name: 'بسطرمة اليسر - فاخر', supplierId: 'local' }; // System generated

        setProducts([p1, p2, p3, p4]);

        // Transactions
        const t1: Transaction = {
            id: 't1', type: 'inbound', merchantId: 's1', productId: 'p1', itemName: 'لحم بقري بلدي',
            weight: 150, pricePerUnit: 320, totalAmount: 48000, paidAmount: 0, paymentType: 'credit', date: '2026-01-01'
        };
        const t2: Transaction = {
            id: 't2', type: 'inbound', merchantId: 's2', productId: 'p2', itemName: 'ثوم مفروم ممتاز',
            weight: 50, pricePerUnit: 80, totalAmount: 4000, paidAmount: 4000, paymentType: 'cash', date: '2026-01-05'
        };
        const t3: Transaction = {
            id: 't3', type: 'outbound', merchantId: 'c1', productId: 'p4', itemName: 'بسطرمة اليسر - فاخر',
            weight: 25, pricePerUnit: 650, totalAmount: 16250, paidAmount: 16250, paymentType: 'cash', date: '2026-01-10'
        };
        const t4: Transaction = {
            id: 't4', type: 'outbound', merchantId: 'c2', productId: 'p4', itemName: 'بسطرمة اليسر - فاخر',
            weight: 40, pricePerUnit: 640, totalAmount: 25600, paidAmount: 0, paymentType: 'credit', date: '2026-01-12'
        };

        setTransactions([t4, t3, t2, t1]);

        // Payments
        const pay1 = { id: 'pay1', merchantId: 's1', amount: 20000, date: '2026-01-15' };
        setDebtPayments([pay1]);

        alert('تم تحميل البيانات التجريبية بنجاح. يمكنك الآن مراجعة التقارير والحسابات.');
    };

    return {
        merchants,
        transactions,
        debtPayments,
        products,
        addMerchant,
        addProduct,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addDebtPayment,
        getMerchantBalance,
        seedDemoData
    };
};
