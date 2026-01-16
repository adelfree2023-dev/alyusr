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

    if (!user && location.pathname !== '/login') {
        return <>{children}</>;
    }

    const filteredItems = navItems.filter(item =>
        user && (user.role === 'admin' || user.permissions[item.permission as keyof typeof user.permissions])
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 md:hidden text-gray-600"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#8b0000]">بسطرمة اليسر</span>
                        <span className="hidden md:inline-block text-gray-400 text-sm">| نظام الحسابات</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium hidden sm:inline-block">مرحباً {user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">تسجيل خروج</span>
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden md:flex flex-col w-64 border-l border-gray-200 bg-white min-h-screen p-4 gap-2 sticky top-16">
                    {filteredItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-xl transition-all
                ${isActive ? 'bg-[#8b0000] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}
              `}
                        >
                            <item.icon size={20} />
                            <span className="font-semibold">{item.name}</span>
                        </NavLink>
                    ))}
                </aside>

                {/* Mobile Navigation (Menu or Bottom Nav) */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-white w-2/3 h-full p-4 flex flex-col gap-2 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="mb-6 pt-4 text-center">
                                <span className="text-xl font-bold text-[#8b0000]">القائمة</span>
                            </div>
                            {filteredItems.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                            flex items-center gap-3 p-3 rounded-xl
                            ${isActive ? 'bg-[#8b0000] text-white shadow-md' : 'text-gray-600'}
                        `}
                                >
                                    <item.icon size={20} />
                                    <span className="font-semibold">{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden flex justify-around py-2 z-30">
                {filteredItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                flex flex-col items-center gap-1 transition-all
                ${isActive ? 'text-[#8b0000]' : 'text-gray-400'}
              `}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] font-bold">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="h-16 md:hidden"></div> {/* Bottom nav spacer */}
        </div>
    );
};

export default Layout;
