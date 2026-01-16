import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = login(username, password);
        if (success) {
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        } else {
            setError('خطأ في اسم المستخدم أو كلمة المرور');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="premium-card w-full max-w-md shadow-2xl border-t-4 border-[#8b0000]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#8b0000] mb-2">بسطرمة اليسر</h1>
                    <p className="text-gray-500">سجل الدخول لإدارة حساباتك</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-gray-700">اسم المستخدم</label>
                        <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pr-10"
                                placeholder="ادخل اسم المستخدم"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                                placeholder="ادخل كلمة المرور"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2">
                        <LogIn size={20} />
                        تسجيل الدخول
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} بسطرمة اليسر - جميع الحقوق محفوظة
                </div>
            </div>

            {/* Basic Tailwind-like helper classes used in the component */}
            <style>{`
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .min-h-\\[80vh\\] { min-height: 80vh; }
        .w-full { width: 100%; }
        .max-w-md { max-width: 28rem; }
        .text-center { text-align: center; }
        .mb-8 { margin-bottom: 2rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .font-bold { font-weight: 700; }
        .mb-2 { margin-bottom: 0.5rem; }
        .text-gray-500 { color: #6b7280; }
        .grid { display: grid; }
        .gap-6 { gap: 1.5rem; }
        .gap-2 { gap: 0.5rem; }
        .bg-red-50 { background-color: #fef2f2; }
        .text-red-600 { color: #dc2626; }
        .p-3 { padding: 0.75rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .font-medium { font-weight: 500; }
        .border-red-100 { border-color: #fee2e2; }
        .text-gray-700 { color: #374151; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .right-3 { right: 0.75rem; }
        .top-1/2 { top: 50%; }
        .-translate-y-1/2 { transform: translateY(-50%); }
        .text-gray-400 { color: #9ca3af; }
        .pr-10 { padding-right: 2.5rem; }
        .mt-2 { margin-top: 0.5rem; }
        .gap-2 { gap: 0.5rem; }
        .mt-8 { margin-top: 2rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
      `}</style>
        </div>
    );
};

export default Login;
