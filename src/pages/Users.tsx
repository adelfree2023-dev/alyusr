import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, CheckCircle, XCircle, Users, Unlock } from 'lucide-react';

const UsersPage: React.FC = () => {
    const { users, addUser } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [permissions, setPermissions] = useState({
        inbound: true,
        outbound: true,
        reports: false,
        users: false
    });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        addUser({
            username,
            password,
            role: 'staff',
            permissions
        });

        setUsername('');
        setPassword('');
        alert('تم إضافة المستخدم بنجاح');
    };

    return (
        <div className="grid gap-8 pb-10">
            <div className="flex flex-col gap-2">
                <h2 className="section-title">
                    <Users size={32} className="text-[#5c0000]" />
                    إدارة المستخدمين
                </h2>
                <p className="text-gray-500 font-bold text-sm">إدارة حسابات الموظفين وتخصيص صلاحيات الوصول</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Create User Form */}
                <div className="lg:col-span-1">
                    <div className="premium-card sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-red-100 rounded-xl text-[#5c0000]">
                                <UserPlus size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">إضافة مستخدم</h3>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">اسم المستخدم</label>
                                <input value={username} onChange={e => setUsername(e.target.value)} required placeholder="Username" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">كلمة المرور</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <p className="text-xs font-black uppercase tracking-widest text-[#5c0000]">صلاحيات الموظف:</p>
                                <div className="grid gap-2">
                                    {Object.keys(permissions).map(key => (
                                        <label key={key} className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50/50 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions[key as keyof typeof permissions]}
                                                    onChange={e => setPermissions({ ...permissions, [key]: e.target.checked })}
                                                    className="w-5 h-5 accent-[#5c0000] rounded-lg"
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">
                                                {key === 'inbound' ? 'المشتريات والمدخلات' :
                                                    key === 'outbound' ? 'المبيعات والمخرجات' :
                                                        key === 'reports' ? 'التقارير المالية' : 'إدارة المستخدمين'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full shadow-xl">
                                حفظ بيانات المستخدم
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2">
                    <div className="premium-card">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-black text-gray-800">حسابات النظام</h3>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{users.length} مـستخدم</span>
                        </div>

                        <div className="grid gap-4">
                            {users.map(u => (
                                <div key={u.id} className="p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400 group-hover:from-[#5c0000]/10 group-hover:to-[#5c0000]/20 group-hover:text-[#5c0000] transition-all">
                                            <Unlock size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-xl text-gray-800">{u.username}</span>
                                                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-gray-100 text-gray-500'}`}>
                                                    {u.role === 'admin' ? 'مدير نظام' : 'موظف'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Secure Access Enabled</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 md:justify-end">
                                        {Object.entries(u.permissions).map(([key, val]) => (
                                            <div key={key} className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all ${val ? 'text-green-600 bg-green-50/50 border-green-100' : 'text-gray-300 bg-gray-50 border-gray-100'}`}>
                                                {val ? <CheckCircle size={12} strokeWidth={3} /> : <XCircle size={12} strokeWidth={3} />}
                                                {key === 'inbound' ? 'مشتريات' :
                                                    key === 'outbound' ? 'مبيعات' :
                                                        key === 'reports' ? 'تقارير' : 'مستخدمين'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
