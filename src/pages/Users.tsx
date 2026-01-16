import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';

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
        <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين والصلاحيات</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Create User Form */}
                <div className="md:col-span-1 premium-card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <UserPlus className="text-[#8b0000]" /> إضافة مستخدم جديد
                    </h3>
                    <form onSubmit={handleAddUser} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">اسم المستخدم</label>
                            <input value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">كلمة المرور</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>

                        <div className="grid gap-3 pt-2">
                            <p className="text-sm font-bold text-gray-700">الصلاحيات:</p>
                            {Object.keys(permissions).map(key => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={permissions[key as keyof typeof permissions]}
                                        onChange={e => setPermissions({ ...permissions, [key]: e.target.checked })}
                                        className="w-4 h-4 accent-[#8b0000]"
                                    />
                                    <span className="text-sm capitalize">
                                        {key === 'inbound' ? 'المدخلات (المشتريات)' :
                                            key === 'outbound' ? 'المخرجات (المبيعات)' :
                                                key === 'reports' ? 'التقارير' : 'إدارة المستخدمين'}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <button type="submit" className="btn-primary mt-4">حفظ المستخدم</button>
                    </form>
                </div>

                {/* Users List */}
                <div className="md:col-span-2 premium-card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Shield className="text-blue-600" /> المستخدمين الحاليين
                    </h3>
                    <div className="grid gap-4">
                        {users.map(u => (
                            <div key={u.id} className="p-4 border rounded-2xl bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-lg">{u.username}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200'}`}>
                                            {u.role === 'admin' ? 'مدير نظام' : 'موظف'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">الرقم السري: ****</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(u.permissions).map(([key, val]) => (
                                        <div key={key} className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${val ? 'text-green-600 bg-green-50' : 'text-gray-300'}`}>
                                            {val ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                            {key === 'inbound' ? 'مدخلات' :
                                                key === 'outbound' ? 'مخرجات' :
                                                    key === 'reports' ? 'تقارير' : 'مستخدمين'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .accent-\\[\\#8b0000\\] { accent-color: #8b0000; }
        .bg-purple-100 { background-color: #f3e8ff; }
        .text-purple-700 { color: #7e22ce; }
        .bg-gray-200 { background-color: #e5e7eb; }
      `}</style>
        </div>
    );
};

export default UsersPage;
