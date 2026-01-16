import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import {
    BarChart,
    TrendingUp,
    TrendingDown,
    Package,
    Calendar,
    Download
} from 'lucide-react';
import { startOfMonth, endOfMonth, format, isWithinInterval, parseISO } from 'date-fns';

const Reports: React.FC = () => {
    const { transactions } = useStorage();
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

    // Inventory calculation (all time)
    const inventory = transactions.reduce((acc: any, t) => {
        if (!acc[t.itemName]) acc[t.itemName] = { weight: 0, avgPurchasePrice: 0, purchaseCount: 0 };

        if (t.type === 'inbound') {
            acc[t.itemName].weight += t.weight;
            acc[t.itemName].avgPurchasePrice = (acc[t.itemName].avgPurchasePrice * acc[t.itemName].purchaseCount + t.pricePerUnit) / (acc[t.itemName].purchaseCount + 1);
            acc[t.itemName].purchaseCount += 1;
        } else {
            acc[t.itemName].weight -= t.weight;
        }
        return acc;
    }, {});

    return (
        <div className="grid gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h2>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border">
                    <Calendar size={18} className="text-gray-400" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="border-none p-1 text-sm bg-transparent w-auto"
                    />
                    <span className="text-gray-300">|</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="border-none p-1 text-sm bg-transparent w-auto"
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
                <div className="premium-card border-r-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-bold">إجمالي المبيعات</p>
                            <h3 className="text-2xl font-black mt-1">{stats.totalSales.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</h3>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                <div className="premium-card border-r-4 border-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-bold">إجمالي المشتريات</p>
                            <h3 className="text-2xl font-black mt-1">{stats.totalCost.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</h3>
                        </div>
                        <div className="bg-red-100 p-2 rounded-lg text-red-600">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                </div>

                <div className="premium-card border-r-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-bold">صافي الربح التقديري</p>
                            <h3 className="text-2xl font-black mt-1">{totalProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</h3>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <BarChart size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Inventory Status */}
                <div className="premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Package className="text-orange-500" /> حالة المخزون الحالي
                    </h3>
                    <div className="grid gap-4">
                        {Object.keys(inventory).length === 0 && <p className="text-gray-400 text-sm italic">لا توجد بيانات بضاعة</p>}
                        {Object.entries(inventory).map(([name, data]: [string, any]) => (
                            <div key={name} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800">{name}</p>
                                    <p className="text-xs text-gray-500">متوسط سعر الشراء: {data.avgPurchasePrice.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-[#8b0000]">{data.weight.toLocaleString('ar-EG', { maximumFractionDigits: 3 })} كجم</p>
                                    <p className="text-xs font-bold text-gray-400">في المحل</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sales vs Purchases list */}
                <div className="premium-card">
                    <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                        <span>آخر العمليات بالفترة</span>
                        <button className="text-blue-600 text-sm flex items-center gap-1">
                            <Download size={16} /> تصوير
                        </button>
                    </h3>
                    <div className="space-y-3">
                        {filteredTransactions.slice(0, 5).map(t => (
                            <div key={t.id} className="flex justify-between items-center text-sm border-b pb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${t.type === 'inbound' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    <div>
                                        <p className="font-bold">{t.itemName}</p>
                                        <p className="text-xs text-gray-400">{t.date}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${t.type === 'inbound' ? 'text-red-600' : 'text-green-600'}`}>
                                    {t.type === 'inbound' ? '-' : '+'}{t.totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج
                                </p>
                            </div>
                        ))}
                        {filteredTransactions.length === 0 && <p className="text-gray-400 text-center py-8">لا توجد عمليات في هذه الفترة</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
