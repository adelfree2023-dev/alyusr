const Inbound: React.FC = () => {
    const { merchants, transactions, products, addMerchant, addProduct, addTransaction, getMerchantBalance, addDebtPayment } = useStorage();
    const [showAddMerchant, setShowAddMerchant] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newMerchantName, setNewMerchantName] = useState('');
    const [newProductName, setNewProductName] = useState('');

    const [selectedMerchantId, setSelectedMerchantId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [weight, setWeight] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('cash');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const suppliers = merchants.filter(m => m.type === 'supplier');
    const supplierProducts = products.filter(p => p.supplierId === selectedMerchantId);

    const handleAddMerchant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMerchantName) return;
        const m = addMerchant({ name: newMerchantName, type: 'supplier' });
        setSelectedMerchantId(m.id);
        setNewMerchantName('');
        setShowAddMerchant(false);
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProductName || !selectedMerchantId) return;
        const p = addProduct({ name: newProductName, supplierId: selectedMerchantId });
        setSelectedProductId(p.id);
        setNewProductName('');
        setShowAddProduct(false);
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMerchantId || !selectedProductId || !weight || !price) return;

        const product = products.find(p => p.id === selectedProductId);
        const total = Number(weight) * Number(price);

        addTransaction({
            type: 'inbound',
            merchantId: selectedMerchantId,
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
        alert('تم حفظ الفاتورة بنجاح');
    };

    const handlePayDebt = (merchantId: string) => {
        const amount = prompt('ادخل المبلغ المسدد للمورد:');
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
        .slice(0, 5);

    return (
        <div className="grid gap-8 pb-10">
            <div className="flex flex-col gap-2">
                <h2 className="section-title">
                    <Package size={32} className="text-[#5c0000]" />
                    حسابات الموردين
                </h2>
                <p className="text-gray-500 font-bold text-sm">إدارة المشتريات والديون والمنتجات</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Entry Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-800">فاتورة شراء جديدة</h3>
                            <button
                                onClick={() => setShowAddMerchant(true)}
                                className="btn btn-outline btn-sm text-xs"
                            >
                                <UserPlus size={16} /> مورد جديد
                            </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label>المورد</label>
                                <select
                                    value={selectedMerchantId}
                                    onChange={e => {
                                        setSelectedMerchantId(e.target.value);
                                        setSelectedProductId('');
                                    }}
                                    required
                                >
                                    <option value="">اختر المورد</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="mb-0">الصنف</label>
                                    {selectedMerchantId && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddProduct(true)}
                                            className="text-[10px] font-black text-[#5c0000] hover:underline"
                                        >
                                            + إضافة صنف لهذا المورد
                                        </button>
                                    )}
                                </div>
                                <select
                                    value={selectedProductId}
                                    onChange={e => setSelectedProductId(e.target.value)}
                                    required
                                    disabled={!selectedMerchantId}
                                >
                                    <option value="">{selectedMerchantId ? 'اختر الصنف' : 'اختر المورد أولاً'}</option>
                                    {supplierProducts.map(p => (
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
                                <label>سعر الكيلو</label>
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
                                        آجل (دين)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label>التاريخ</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <div className="bg-[#5c0000]/5 p-6 rounded-2xl border-2 border-dashed border-[#5c0000]/20 flex justify-between items-center mb-6">
                                    <span className="text-lg font-bold text-gray-600">إجمالي الفاتورة</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-[#5c0000]">
                                            {((Number(weight) || 0) * (Number(price) || 0)).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-sm font-bold text-gray-400 mr-2">ج.م</span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full shadow-2xl py-5 text-xl">
                                    حفظ وتسجيل الفاتورة
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Recent History */}
                    <div className="premium-card overflow-hidden !p-0">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-black text-lg">آخر العمليات</h3>
                            <Calendar size={20} className="text-gray-400" />
                        </div>
                        <div className="table-container">
                            <table className="text-sm">
                                <thead>
                                    <tr>
                                        <th>المورد / الصنف</th>
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
                                            <td className="p-4 font-black text-[#5c0000]">{t.totalAmount.toLocaleString('ar-EG')} ج</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${t.paymentType === 'cash' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {t.paymentType === 'cash' ? 'كاش' : 'آجل'}
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
                    <div className="premium-card border-r-4 border-[#5c0000]">
                        <h3 className="text-lg font-black mb-6 flex items-center justify-between">
                            مديونيات الموردين
                            <DollarSign size={20} className="text-red-500" />
                        </h3>
                        <div className="space-y-4">
                            {suppliers.map(s => {
                                const balance = getMerchantBalance(s.id);
                                if (balance <= 0) return null;
                                return (
                                    <div key={s.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-gray-700">{s.name}</span>
                                            <span className="text-red-600 font-black">{balance.toLocaleString('ar-EG')} ج</span>
                                        </div>
                                        <button
                                            onClick={() => handlePayDebt(s.id)}
                                            className="btn btn-primary btn-sm !rounded-xl !py-2 text-xs"
                                        >
                                            تسديد جزء
                                        </button>
                                    </div>
                                );
                            })}
                            {suppliers.every(s => getMerchantBalance(s.id) <= 0) && (
                                <div className="text-center py-6">
                                    <p className="text-gray-400 font-bold italic text-sm">لا يوجد مديونيات حالية</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddMerchant && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="premium-card w-full max-w-md animate-slide-up">
                        <h3 className="text-2xl font-black mb-6 text-[#5c0000]">مورد جديد</h3>
                        <form onSubmit={handleAddMerchant} className="space-y-6">
                            <div className="space-y-2">
                                <label>اسم الشركة / المورد</label>
                                <input value={newMerchantName} onChange={e => setNewMerchantName(e.target.value)} required autoFocus placeholder="ادخل الاسم هنا..." />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="btn btn-primary flex-1">إضافة</button>
                                <button type="button" onClick={() => setShowAddMerchant(false)} className="btn btn-outline flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="premium-card w-full max-w-md animate-slide-up">
                        <h3 className="text-2xl font-black mb-6 text-[#5c0000]">إضافة صنف جديد</h3>
                        <form onSubmit={handleAddProduct} className="space-y-6">
                            <div className="space-y-2">
                                <label>اسم الصنف</label>
                                <input value={newProductName} onChange={e => setNewProductName(e.target.value)} required autoFocus placeholder="مثلاً: بسطرمة ممتاز" />
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-500">
                                سيتم ربط هذا الصنف بـ: {merchants.find(m => m.id === selectedMerchantId)?.name}
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="btn btn-primary flex-1">تأكيد</button>
                                <button type="button" onClick={() => setShowAddProduct(false)} className="btn btn-outline flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbound;
