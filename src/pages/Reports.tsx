import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import {
    BarChart,
    TrendingUp,
    TrendingDown,
    Package,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Download
} from 'lucide-react';
import { startOfMonth, endOfMonth, format, isWithinInterval, parseISO } from 'date-fns';

const Reports: React.FC = () => {
    const { transactions, products, seedDemoData } = useStorage();
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    const filteredTransactions = transactions.filter(t => {
        const tDate = parseISO(t.date);
        return isWithinInterval(tDate, {
            start: parseISO(startDate),
            end: parseISO(endDate)
        });
    });

    const stats = filteredTransactions.reduce((acc, t) => {
        if (t.type === 'inbound') {
            acc.totalCost += t.totalAmount;
            acc.inboundWeight += t.weight;
        } else {
            acc.totalSales += t.totalAmount;
            acc.outboundWeight += t.weight;
        }
        return acc;
    }, { totalSales: 0, totalCost: 0, inboundWeight: 0, outboundWeight: 0 });

    const totalProfit = stats.totalSales - stats.totalCost;

    // Inventory calculation (all time) grouped by productId
    const inventory = transactions.reduce((acc: any, t) => {
        const id = t.productId || t.itemName; // Fallback for old data
        if (!acc[id]) {
            const product = products.find(p => p.id === t.productId);
            acc[id] = {
                name: product?.name || t.itemName,
                weight: 0,
                avgPurchasePrice: 0,
                purchaseCount: 0
            };
        }

        if (t.type === 'inbound') {
            acc[id].weight += t.weight;
            acc[id].avgPurchasePrice = (acc[id].avgPurchasePrice * acc[id].purchaseCount + t.pricePerUnit) / (acc[id].purchaseCount + 1);
            acc[id].purchaseCount += 1;
        } else {
            acc[id].weight -= t.weight;
        }
        return acc;
    }, {});

    return (
        <div className="grid gap-8 pb-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="section-title">
                            <BarChart size={32} className="text-[#5c0000]" />
                            التقارير المالية
                        </h2>
                        <button
                            onClick={seedDemoData}
                            className="btn btn-outline btn-sm text-[10px] font-black"
                        >
                            تحميل بيانات تجريبية
                        </button>
                    </div>
                    <p className="text-gray-500 font-bold text-sm">متابعة الأداء، الأرباح، وحالة المخزون</p>
                </div>

                <div className="premium-card flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#5c0000]/5 !border-[#5c0000]/10">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-[#5c0000]" size={24} />
                        <span className="font-black text-gray-700">تحديد الفترة الزمنية:</span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] uppercase tracking-tighter text-gray-400 font-black mb-1">من تاريخ</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="!py-2 !px-3 !bg-white !border-gray-200"
                            />
                        </div>
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] uppercase tracking-tighter text-gray-400 font-black mb-1">إلى تاريخ</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="!py-2 !px-3 !bg-white !border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="premium-card bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-xl text-green-600">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase">إجمالي المبيعات</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-gray-800">{stats.totalSales.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                            <span className="text-sm font-bold text-gray-400">ج.م</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-xl text-red-600">
                                <TrendingDown size={20} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase">إجمالي المشتريات</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-gray-800">{stats.totalCost.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                            <span className="text-sm font-bold text-gray-400">ج.م</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card bg-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                <BarChart size={20} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase">صافي الربح التقديري</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-black ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-sm font-bold text-gray-400">ج.م</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Inventory Breakdown */}
                <div className="premium-card">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-800">حالة المخزون</h3>
                            <p className="text-xs font-bold text-gray-400">الكميات المتاحة حالياً بالمحل</p>
                        </div>
                        <Package size={28} className="text-orange-400" />
                    </div>

                    <div className="space-y-4">
                        {Object.values(inventory).map((item: any) => (
                            <div key={item.name} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 group transition-all hover:bg-white hover:shadow-lg hover:border-transparent">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="font-black text-lg text-gray-800">{item.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">متوسط التكلفة:</span>
                                            <span className="text-xs font-bold text-gray-600">{item.avgPurchasePrice.toLocaleString('ar-EG')} ج/كجم</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="text-2xl font-black text-[#5c0000]">{item.weight.toLocaleString('ar-EG', { maximumFractionDigits: 3 })}</span>
                                            <span className="text-xs font-black text-gray-400">كجم</span>
                                        </div>
                                        <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-[#5c0000] rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(100, Math.max(0, (item.weight / 100) * 100))}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {Object.keys(inventory).length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="font-bold text-gray-400 text-sm italic">لا توجد بيانات بضاعة مسجلة</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activities Feed */}
                <div className="premium-card">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-800">آخر العمليات</h3>
                            <p className="text-xs font-bold text-gray-400">سجل النشاط للفترة المحددة</p>
                        </div>
                        <Download className="text-gray-400 cursor-pointer hover:text-[#5c0000]" size={20} />
                    </div>

                    <div className="space-y-6">
                        {filteredTransactions.slice(0, 8).map(t => (
                            <div key={t.id} className="flex items-center gap-4 group">
                                <div className={`p-3 rounded-2xl ${t.type === 'inbound' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {t.type === 'inbound' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-gray-800">{t.itemName}</span>
                                        <span className={`font-black ${t.type === 'inbound' ? 'text-red-600' : 'text-green-600'}`}>
                                            {t.type === 'inbound' ? '-' : '+'}{t.totalAmount.toLocaleString('ar-EG')} ج
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] font-bold text-gray-400">{t.date} • {t.weight.toLocaleString('ar-EG')} كجم</span>
                                        <span className="text-[10px] font-black uppercase text-gray-300 group-hover:text-gray-400 transition-colors">
                                            {t.type === 'inbound' ? 'مشتريات' : 'مبيعات'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <div className="text-center py-10 opacity-50 italic font-bold text-gray-400">
                                لا توجد عمليات في هذه الفترة
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
