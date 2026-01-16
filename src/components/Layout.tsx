import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut,
    PackageSearch,
    ShoppingCart,
    BarChart3,
    Users,
    Menu,
    X
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { name: 'المدخلات', path: '/inbound', icon: PackageSearch, permission: 'inbound' },
        { name: 'المخرجات', path: '/outbound', icon: ShoppingCart, permission: 'outbound' },
        { name: 'التقارير', path: '/reports', icon: BarChart3, permission: 'reports' },
        { name: 'المستخدمين', path: '/users', icon: Users, permission: 'users' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user || location.pathname === '/login') {
        return <>{children}</>;
    }

    const filteredItems = navItems.filter(item =>
        user && (user.role === 'admin' || user.permissions[item.permission as keyof typeof user.permissions])
    );

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 h-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-3 md:hidden text-gray-800 hover:bg-gray-100 rounded-full"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black text-[#5c0000] tracking-tight">بسطرمة اليسر</span>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Al-Yusr Pastrami</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-left">
                        <span className="text-xs font-black text-gray-400">مرحباً بك</span>
                        <span className="text-sm font-bold text-[#5c0000]">{user?.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="تسجيل خروج"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Modern Sidebar (Desktop) */}
                <aside className="hidden md:flex flex-col w-72 bg-white border-l border-gray-100 p-6 gap-3">
                    <div className="mb-6 px-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-tighter">القائمة الرئيسية</p>
                    </div>
                    {filteredItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-[#5c0000] text-white shadow-xl shadow-red-900/20' : 'text-slate-600 hover:bg-slate-50'}
              `}
                        >
                            <item.icon size={22} className={location.pathname === item.path ? 'animate-pulse' : ''} />
                            <span className="font-bold text-lg">{item.name}</span>
                        </NavLink>
                    ))}
                </aside>

                {/* Mobile Slide-over Menu */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-white w-[80%] h-full p-6 flex flex-col gap-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-2xl font-black text-[#5c0000]">القائمة</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                            </div>
                            {filteredItems.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                            flex items-center gap-4 p-5 rounded-2xl
                            ${isActive ? 'bg-[#5c0000] text-white shadow-lg' : 'text-slate-600 active:bg-slate-100'}
                        `}
                                >
                                    <item.icon size={24} />
                                    <span className="font-black text-xl">{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic Main Content */}
                <main className="flex-1 w-full page-container animate-slide-up">
                    {children}
                </main>
            </div>

            {/* Native-feeling Bottom Tab Bar (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-gray-100 md:hidden flex justify-around items-center px-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                {filteredItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1.5 transition-all w-16 h-16 rounded-2xl
                ${isActive ? 'text-[#5c0000]' : 'text-slate-400'}
              `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-2 rounded-xl transition-all ${location.pathname === item.path ? 'bg-red-50 scale-110' : ''}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
                                </div>
                                <span className={`text-[10px] font-black tracking-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Styles for specific layout components */}
            <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .flex-col { flex-direction: column; }
        .text-slate-600 { color: #475569; }
        .text-slate-400 { color: #94a3b8; }
        .bg-slate-50 { background-color: #f8fafc; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-widest { letter-spacing: 0.1em; }
        .font-black { font-weight: 900; }
      `}</style>
        </div>
    );
};

export default Layout;
