import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User, ShieldCheck } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5c0000]/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl -ml-64 -mb-64"></div>

            <div className="w-full max-w-[440px] relative z-10 animate-fade-in">
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5c0000] to-[#800000] rounded-[2.5rem] shadow-2xl mb-4 rotate-3 transform transition-transform hover:rotate-0">
                        <ShieldCheck size={40} className="text-[#d4af37]" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">بسطرمة اليسر</h1>
                    <p className="text-gray-500 font-bold text-sm">نظام الإدارة المحاسبية المتقدم</p>
                </div>

                <div className="premium-card !p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black text-center border-2 border-red-100 animate-slide-up">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">اسم المستخدم</label>
                            <div className="relative group">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5c0000] transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="!pr-12 !h-14 font-bold border-2 focus:border-[#5c0000] bg-gray-50/50"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5c0000] transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="!pr-12 !h-14 font-bold border-2 focus:border-[#5c0000] bg-gray-50/50"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full h-14 text-lg font-black shadow-xl mt-4 flex items-center justify-center gap-3"
                        >
                            تأكيد الدخول
                            <LogIn size={20} />
                        </button>
                    </form>
                </div>

                <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    &copy; {new Date().getFullYear()} AL-YOSR PASTRAMI • SECURE ACCESS
                </p>
            </div>
        </div>
    );
};

export default Login;
