import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { ChevronDown, ShoppingBag, UserPlus, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Outbound: React.FC = () => {
    const { merchants, transactions, addMerchant, addTransaction, getMerchantBalance, addDebtPayment } = useStorage();
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');

    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [itemName, setItemName] = useState('بسطرمة');
    const [weight, setWeight] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('cash');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const customers = merchants.filter(m => m.type === 'customer');

    const handleAddCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCustomerName) return;
        const m = addMerchant({ name: newCustomerName, type: 'customer' });
        setSelectedCustomerId(m.id);
        setNewCustomerName('');
        setShowAddCustomer(false);
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerId || !weight || !price) return;

        const total = Number(weight) * Number(price);
        addTransaction({
            type: 'outbound',
            merchantId: selectedCustomerId,
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
        const amount = prompt('ادخل المبلغ المسدد من المحل:');
        if (amount && !isNaN(Number(amount))) {
            addDebtPayment({
                merchantId,
                amount: Number(amount),
                date: format(new Date(), 'yyyy-MM-dd'),
            });
            alert('تم تسجيل القبض بنجاح');
        }
    };

    const recentTransactions = transactions
        .filter(t => t.type === 'outbound')
        .slice(0, 10);

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">حسابات المخرجات (المحلات)</h2>
                <button
                    onClick={() => setShowAddCustomer(!showAddCustomer)}
                    className="btn-outline flex items-center gap-2 text-sm"
                >
                    {showAddCustomer ? <ChevronDown size={18} /> : <UserPlus size={18} />}
                    {showAddCustomer ? 'إغلاق' : 'محل جديد'}
                </button>
            </div>

            {showAddCustomer && (
                <form onSubmit={handleAddCustomer} className="premium-card flex gap-4 items-end animate-fade-in">
                    <div className="flex-1 grid gap-2">
                        <label className="text-sm font-semibold">اسم المحل / العميل</label>
                        <input
                            value={newCustomerName}
                            onChange={e => setNewCustomerName(e.target.value)}
                            placeholder="مثال: سوبر ماركت الأمانة"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary h-[46px]">إضافة</button>
                </form>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Sales Form */}
                <div className="md:col-span-2 premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ShoppingBag className="text-[#8b0000]" /> تسجيل فاتورة بيع
                    </h3>
                    <form onSubmit={handleAddTransaction} className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">المحل</label>
                            <select
                                value={selectedCustomerId}
                                onChange={e => setSelectedCustomerId(e.target.value)}
                                required
                            >
                                <option value="">اختر المحل</option>
                                {customers.map(s => (
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
                            <label className="text-sm font-semibold">سعر البيع</label>
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
                            <div className="flex justify-between items-center mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                <span className="font-bold text-gray-700">إجمالي المبيعات:</span>
                                <span className="text-2xl font-bold text-green-700">{((Number(weight) || 0) * (Number(price) || 0)).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>
                            </div>
                            <button type="submit" className="btn-primary w-full py-4 text-lg">حفظ الفاتورة</button>
                        </div>
                    </form>
                </div>

                {/* Customer Balances */}
                <div className="premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <DollarSign className="text-green-600" /> مديونيات المحلات
                    </h3>
                    <div className="grid gap-3">
                        {customers.length === 0 && <p className="text-gray-400 text-sm italic">لا يوجد محلات مضافة</p>}
                        {customers.map(s => {
                            const balance = getMerchantBalance(s.id);
                            return (
                                <div key={s.id} className="p-3 border rounded-xl flex justify-between items-center bg-white shadow-sm">
                                    <div>
                                        <p className="font-bold text-gray-700">{s.name}</p>
                                        <p className={`text-sm ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {balance > 0 ? `${balance} ج.م (لنا)` : 'سداد كامل'}
                                        </p>
                                    </div>
                                    {balance > 0 && (
                                        <button
                                            onClick={() => handlePayDebt(s.id)}
                                            className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200 font-bold hover:bg-red-100"
                                        >
                                            تحصيل
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
                    <Calendar size={20} className="text-blue-500" /> آخر المبيعات المسجلة
                </h3>
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-3">التاريخ</th>
                            <th className="p-3">المحل</th>
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
                                <td className="p-3 font-medium">{merchants.find(m => m.id === t.merchantId)?.name || 'محل محذوف'}</td>
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
        .bg-green-50 { background-color: #f0fdf4; }
        .text-green-700 { color: #15803d; }
        .border-green-100 { border-color: #dcfce7; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};

export default Outbound;
