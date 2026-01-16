import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { ChevronDown, Package, UserPlus, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Inbound: React.FC = () => {
    const { merchants, transactions, addMerchant, addTransaction, getMerchantBalance, addDebtPayment } = useStorage();
    const [showAddMerchant, setShowAddMerchant] = useState(false);
    const [newMerchantName, setNewMerchantName] = useState('');

    const [selectedMerchantId, setSelectedMerchantId] = useState('');
    const [itemName, setItemName] = useState('بسطرمة');
    const [weight, setWeight] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('cash');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const suppliers = merchants.filter(m => m.type === 'supplier');

    const handleAddMerchant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMerchantName) return;
        const m = addMerchant({ name: newMerchantName, type: 'supplier' });
        setSelectedMerchantId(m.id);
        setNewMerchantName('');
        setShowAddMerchant(false);
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMerchantId || !weight || !price) return;

        const total = Number(weight) * Number(price);
        addTransaction({
            type: 'inbound',
            merchantId: selectedMerchantId,
            itemName,
            weight: Number(weight),
            pricePerUnit: Number(price),
            totalAmount: total,
            paidAmount: paymentType === 'cash' ? total : 0,
            paymentType,
            date,
        });

        setWeight('');
        setPrice('');
    };

    const handlePayDebt = (merchantId: string) => {
        const amount = prompt('ادخل المبلغ المسدد:');
        if (amount && !isNaN(Number(amount))) {
            addDebtPayment({
                merchantId,
                amount: Number(amount),
                date: format(new Date(), 'yyyy-MM-dd'),
            });
            alert('تم تسجيل السداد بنجاح');
        }
    };

    const recentTransactions = transactions
        .filter(t => t.type === 'inbound')
        .slice(0, 10);

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">حسابات المدخلات (الموردين)</h2>
                <button
                    onClick={() => setShowAddMerchant(!showAddMerchant)}
                    className="btn-outline flex items-center gap-2 text-sm"
                >
                    {showAddMerchant ? <ChevronDown size={18} /> : <UserPlus size={18} />}
                    {showAddMerchant ? 'إغلاق' : 'مورد جديد'}
                </button>
            </div>

            {showAddMerchant && (
                <form onSubmit={handleAddMerchant} className="premium-card flex gap-4 items-end animate-fade-in">
                    <div className="flex-1 grid gap-2">
                        <label className="text-sm font-semibold">اسم المورد</label>
                        <input
                            value={newMerchantName}
                            onChange={e => setNewMerchantName(e.target.value)}
                            placeholder="مثال: شركة اليسر للتجارة"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary h-[46px]">إضافة</button>
                </form>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Purchase Form */}
                <div className="md:col-span-2 premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Package className="text-[#8b0000]" /> تسجيل فاتورة شراء
                    </h3>
                    <form onSubmit={handleAddTransaction} className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">المورد</label>
                            <select
                                value={selectedMerchantId}
                                onChange={e => setSelectedMerchantId(e.target.value)}
                                required
                            >
                                <option value="">اختر المورد</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} (مديونية: {getMerchantBalance(s.id)} ج)</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">الصنف</label>
                            <input value={itemName} onChange={e => setItemName(e.target.value)} required />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">الوزن (كجم)</label>
                            <input
                                type="number" step="0.001"
                                value={weight} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">سعر الكيلو</label>
                            <input
                                type="number" step="0.01"
                                value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">طريقة الدفع</label>
                            <div className="flex gap-4 p-2 bg-gray-50 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={paymentType === 'cash'} onChange={() => setPaymentType('cash')} className="w-4 h-4" /> كاش
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={paymentType === 'credit'} onChange={() => setPaymentType('credit')} className="w-4 h-4" /> أجل
                                </label>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">التاريخ</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>

                        <div className="sm:col-span-2 pt-4">
                            <div className="flex justify-between items-center mb-4 p-4 bg-red-50 rounded-xl border border-red-100">
                                <span className="font-bold text-gray-700">إجمالي الفاتورة:</span>
                                <span className="text-2xl font-bold text-[#8b0000]">{((Number(weight) || 0) * (Number(price) || 0)).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>
                            </div>
                            <button type="submit" className="btn-primary w-full py-4 text-lg">حفظ الفاتورة</button>
                        </div>
                    </form>
                </div>

                {/* Supplier Balances */}
                <div className="premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <DollarSign className="text-green-600" /> مديونيات الموردين
                    </h3>
                    <div className="grid gap-3">
                        {suppliers.length === 0 && <p className="text-gray-400 text-sm italic">لا يوجد موردين مضافين</p>}
                        {suppliers.map(s => {
                            const balance = getMerchantBalance(s.id);
                            return (
                                <div key={s.id} className="p-3 border rounded-xl flex justify-between items-center bg-white shadow-sm">
                                    <div>
                                        <p className="font-bold text-gray-700">{s.name}</p>
                                        <p className={`text-sm ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {balance > 0 ? `${balance} ج.م (عليك)` : 'سداد كامل'}
                                        </p>
                                    </div>
                                    {balance > 0 && (
                                        <button
                                            onClick={() => handlePayDebt(s.id)}
                                            className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 font-bold hover:bg-green-100"
                                        >
                                            سداد
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="premium-card overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500" /> آخر الفواتير المسجلة
                </h3>
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-3">التاريخ</th>
                            <th className="p-3">المورد</th>
                            <th className="p-3">الصنف</th>
                            <th className="p-3">الوزن</th>
                            <th className="p-3">القيمة</th>
                            <th className="p-3">الدفع</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map(t => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-sm">{t.date}</td>
                                <td className="p-3 font-medium">{merchants.find(m => m.id === t.merchantId)?.name || 'مورد محذوف'}</td>
                                <td className="p-3">{t.itemName}</td>
                                <td className="p-3">{t.weight.toLocaleString('ar-EG', { maximumFractionDigits: 3 })} كجم</td>
                                <td className="p-3 font-bold">{t.totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج</td>
                                <td className="p-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${t.paymentType === 'cash' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {t.paymentType === 'cash' ? 'كاش' : 'أجل'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .flex-1 { flex: 1 1 0%; }
        .h-\\[46px\\] { height: 46px; }
        .md\\:col-span-2 { grid-column: span 2 / span 2; }
        .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .items-end { align-items: flex-end; }
        .p-4 { padding: 1rem; }
        .bg-red-50 { background-color: #fef2f2; }
        .rounded-xl { border-radius: 0.75rem; }
        .border-red-100 { border-color: #fee2e2; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .overflow-x-auto { overflow-x: auto; }
        .border-collapse { border-collapse: collapse; }
        .bg-gray-50 { background-color: #f9fafb; }
      `}</style>
        </div>
    );
};

export default Inbound;
