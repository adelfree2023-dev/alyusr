export type TransactionType = 'inbound' | 'outbound';
export type PaymentStatus = 'cash' | 'credit';

export interface Merchant {
    id: string;
    name: string;
    type: 'supplier' | 'customer';
    phone?: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    merchantId: string;
    itemName: string;
    weight: number;
    pricePerUnit: number;
    totalAmount: number;
    paidAmount: number;
    paymentType: PaymentStatus;
    date: string;
}

export interface User {
    id: string;
    username: string;
    password?: string;
    role: 'admin' | 'staff';
    permissions: {
        inbound: boolean;
        outbound: boolean;
        reports: boolean;
        users: boolean;
    };
}

export interface DebtPayment {
    id: string;
    merchantId: string;
    amount: number;
    date: string;
    transactionId?: string; // Optional: link to a specific credit transaction
}
