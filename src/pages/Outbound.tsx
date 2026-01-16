import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { ShoppingBag, UserPlus, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Outbound: React.FC = () => {
    const { merchants, transactions, products, addMerchant, addTransaction, getMerchantBalance, addDebtPayment } = useStorage();
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');

    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [weight, setWeight] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('cash');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const customers = merchants.filter(m => m.type === 'customer');
    const allProducts = products;

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
        if (!selectedCustomerId || !selectedProductId || !weight || !price) return;

        const product = products.find(p => p.id === selectedProductId);
        const total = Number(weight) * Number(price);

        addTransaction({
            type: 'outbound',
            merchantId: selectedCustomerId,
            productId: selectedProductId,
            itemName: product?.name || '',
            weight: Number(weight),
            pricePerUnit: Number(price),
            totalAmount: total,
            paidAmount: paymentType === 'cash' ? total : 0,
            paymentType,
            date,
        });

        setWeight('');
        setPrice('');
        alert('تم تسجيل المبيعات بنجاح');
    };

    const handlePayDebt = (merchantId: string) => {
        const amount = prompt('ادخل المبلغ المحصل من المحل:');
        if (amount && !isNaN(Number(amount))) {
            addDebtPayment({
                merchantId,
                amount: Number(amount),
                date: format(new Date(), 'yyyy-MM-dd'),
            });
            alert('تم تسجيل التحصيل بنجاح');
        }
    };

    const recentTransactions = transactions
        .filter(t => t.type === 'outbound')
        .slice(0, 5);

    return (
        <div className="grid gap-8 pb-10">
            <div className="flex flex-col gap-2">
                <h2 className="section-title">
                    <ShoppingBag size={32} className="text-[#5c0000]" />
                    حسابات المبيعات (المحلات)
                </h2>
                <p className="text-gray-500 font-bold text-sm">تسجيل الفواتير وتحصيل المبالغ الآجلة</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Sale Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-800">فاتورة بيع جديدة</h3>
                            <button
                                onClick={() => setShowAddCustomer(true)}
                                className="btn btn-outline btn-sm text-xs"
                            >
                                <UserPlus size={16} /> محل جديد
                            </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label>المحل / العميل</label>
                                <select
                                    value={selectedCustomerId}
                                    onChange={e => setSelectedCustomerId(e.target.value)}
                                    required
                                >
                                    <option value="">اختر المحل</option>
                                    {customers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label>الصنف</label>
                                <select
                                    value={selectedProductId}
                                    onChange={e => setSelectedProductId(e.target.value)}
                                    required
                                >
                                    <option value="">اختر الصنف</option>
                                    {allProducts.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label>الوزن (كجم)</label>
                                <input
                                    type="number" step="0.001"
                                    placeholder="0.000"
                                    value={weight} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label>سعر البيع</label>
                                <input
                                    type="number" step="0.01"
                                    placeholder="0.00"
                                    value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label>طريقة الدفع</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('cash')}
                                        className={`btn font-black border-2 ${paymentType === 'cash' ? 'bg-[#5c0000] text-white border-[#5c0000]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    >
                                        كاش
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('credit')}
                                        className={`btn font-black border-2 ${paymentType === 'credit' ? 'bg-[#5c0000] text-white border-[#5c0000]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    >
                                        أجل (على الحساب)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label>التاريخ</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <div className="bg-green-50 p-6 rounded-2xl border-2 border-dashed border-green-200 flex justify-between items-center mb-6">
                                    <span className="text-lg font-bold text-gray-600">إجمالي المبيعات</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-green-700">
                                            {((Number(weight) || 0) * (Number(price) || 0)).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-sm font-bold text-gray-400 mr-2">ج.م</span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full shadow-2xl py-5 text-xl">
                                    حفظ الفاتورة
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Recent Sales History */}
                    <div className="premium-card overflow-hidden !p-0">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-black text-lg">آخر المبيعات</h3>
                            <Calendar size={20} className="text-gray-400" />
                        </div>
                        <div className="table-container">
                            <table className="text-sm">
                                <thead>
                                    <tr>
                                        <th>المحل / الصنف</th>
                                        <th>الوزن</th>
                                        <th>الإجمالي</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-800">{merchants.find(m => m.id === t.merchantId)?.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold">{t.itemName} - {t.date}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold">{t.weight.toLocaleString('ar-EG')} كجم</td>
                                            <td className="p-4 font-black text-green-700">{t.totalAmount.toLocaleString('ar-EG')} ج</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${t.paymentType === 'cash' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {t.paymentType === 'cash' ? 'كاش' : 'أجل'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Balances */}
                <div className="space-y-6">
                    <div className="premium-card border-r-4 border-green-500">
                        <h3 className="text-lg font-black mb-6 flex items-center justify-between">
                            مديونيات المحلات (لنا)
                            <DollarSign size={20} className="text-green-600" />
                        </h3>
                        <div className="space-y-4">
                            {customers.map(s => {
                                const balance = getMerchantBalance(s.id);
                                if (balance <= 0) return null;
                                return (
                                    <div key={s.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-gray-700">{s.name}</span>
                                            <span className="text-green-600 font-black">{balance.toLocaleString('ar-EG')} ج</span>
                                        </div>
                                        <button
                                            onClick={() => handlePayDebt(s.id)}
                                            className="btn btn-primary btn-sm !rounded-xl !py-2 text-xs"
                                        >
                                            تحصيل جزء
                                        </button>
                                    </div>
                                );
                            })}
                            {customers.every(s => getMerchantBalance(s.id) <= 0) && (
                                <div className="text-center py-6">
                                    <p className="text-gray-400 font-bold italic text-sm">لا يوجد ديون محصلة</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: New Customer */}
            {showAddCustomer && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="premium-card w-full max-w-md animate-slide-up">
                        <h3 className="text-2xl font-black mb-6 text-[#5c0000]">محل جديد</h3>
                        <form onSubmit={handleAddCustomer} className="space-y-6">
                            <div className="space-y-2">
                                <label>اسم المحل / العميل</label>
                                <input value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} required autoFocus placeholder="ادخل اسم المحل هنا..." />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="btn btn-primary flex-1">إضافة</button>
                                <button type="button" onClick={() => setShowAddCustomer(false)} className="btn btn-outline flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Outbound;
