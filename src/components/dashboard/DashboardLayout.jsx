import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        label: 'Investment Plans',
        path: '/dashboard/plans',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: 'Portfolio',
        path: '/dashboard/portfolio',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
        ),
    },
    {
        label: 'Deposit & Withdraw',
        path: '/dashboard/withdraw',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        )
    },
    {
        label: 'Support',
        path: '/dashboard/support',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.38-.443 2.842-2.14 4.288-2.14 4.288s1.604-.153 3.32-.94a9.463 9.463 0 005.547 1.772z" />
            </svg>
        ),
    },
    {
        label: 'Transactions',
        path: '/dashboard/transactions',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
    },
    {
        label: 'Settings',
        path: '/dashboard/settings',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sendingVerification, setSendingVerification] = useState(false);
    const { user, logout } = useAuth();
    const { t, locale, setLocale } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // Translated labels for nav items
    const navLabels = {
        '/dashboard': t('dashboard.overview'),
        '/dashboard/plans': t('dashboard.investmentPlans'),
        '/dashboard/portfolio': t('dashboard.portfolio'),
        '/dashboard/withdraw': t('dashboard.depositWithdraw'),
        '/dashboard/transactions': t('dashboard.transactions'),
        '/dashboard/settings': t('dashboard.settings'),
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const handleResendVerification = async () => {
        setSendingVerification(true);
        try {
            const res = await api.resendVerification(user.email);
            toast.success(res.message);
        } catch (err) {
            toast.error(err.message || 'Failed to resend email');
        } finally {
            setSendingVerification(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 flex items-center gap-2.5 border-b border-white/10">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 500 500" className="w-10 h-10">
                                <defs>
                                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#1b253d" />
                                        <stop offset="100%" stopColor="#12192b" />
                                    </linearGradient>
                                    <linearGradient id="greenArrow" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8bc34a" />
                                        <stop offset="100%" stopColor="#689f38" />
                                    </linearGradient>
                                    <linearGradient id="lightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00e5ff" />
                                        <stop offset="100%" stopColor="#00838f" />
                                    </linearGradient>
                                    <linearGradient id="midBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00b4d8" />
                                        <stop offset="100%" stopColor="#0077b6" />
                                    </linearGradient>
                                    <linearGradient id="darkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2a437c" />
                                        <stop offset="100%" stopColor="#152238" />
                                    </linearGradient>
                                </defs>
                                <circle cx="250" cy="250" r="230" fill="url(#bgGrad)" />
                                <path d="M 250 80 L 350 140 L 320 140 L 320 170 L 250 135 L 180 170 L 180 140 L 150 140 Z" fill="url(#greenArrow)" />
                                <text x="250" y="132" fontFamily="Arial, Helvetica, sans-serif" fontSize="36" fontWeight="bold" fill="#ffffff" textAnchor="middle">$</text>
                                <path d="M 150 170 L 150 250 L 250 310 L 250 240 L 190 200 Z" fill="url(#darkBlue)" />
                                <path d="M 350 170 L 350 260 L 250 320 L 250 260 L 310 220 Z" fill="url(#midBlue)" />
                                <path d="M 160 205 C 190 180, 220 170, 250 190 C 280 210, 310 200, 340 180 L 300 225 C 270 250, 240 250, 200 225 Z" fill="url(#lightBlue)" />
                                <path d="M 250 320 L 160 265 L 250 200 L 340 265 Z" fill="url(#midBlue)" opacity="0.8" />
                                <path d="M 250 320 L 200 290 L 270 230 L 320 260 Z" fill="url(#lightBlue)" />
                                <path d="M 280 300 L 240 275 L 290 235 L 330 260 Z" fill="#00e5ff" opacity="0.5" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-display font-bold text-white text-sm tracking-tight">STEADY GAINS</span>
                            <span className="block text-[9px] tracking-[0.2em] uppercase text-white/40">Dashboard</span>
                        </div>
                    </div>

                    {/* Nav items */}
                    <nav className="flex-1 p-4 space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-emerald-brand text-white'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                {item.icon}
                                {navLabels[item.path] || item.label}
                            </NavLink>
                        ))}

                        {user?.role === 'ADMIN' && (
                            <div className="pt-3 mt-3 border-t border-white/10">
                                <NavLink
                                    to="/admin"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.633-5.633a2.25 2.25 0 013.182-3.182l5.633 5.633a2.25 2.25 0 01-3.182 3.182z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.28 12.28L3.989 18.57a.75.75 0 001.067 1.066l6.29-6.29" />
                                    </svg>
                                    Admin Panel
                                </NavLink>
                            </div>
                        )}
                    </nav>

                    {/* Bottom user section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-brand/20 flex items-center justify-center text-emerald-light text-sm font-bold">
                                {user?.avatar || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                                <p className="text-white/40 text-xs truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            {t('dashboard.logout')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <div className="flex-1 lg:ml-64">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 hover:border-emerald-brand/30 bg-white/50 hover:bg-emerald-50 transition-all duration-300 text-xs font-semibold text-charcoal/70"
                            title={locale === 'en' ? 'বাংলায় দেখুন' : 'View in English'}
                        >
                            <span className="text-sm">{locale === 'en' ? '🇧🇩' : '🇺🇸'}</span>
                            {locale === 'en' ? 'বাংলা' : 'EN'}
                        </button>
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5 text-charcoal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-brand rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                {user && !user.isEmailVerified && (
                    <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm animate-fade-in">
                        <div className="flex items-center gap-2 text-amber-800 font-medium">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Please verify your email address to secure your account.</span>
                        </div>
                        <button
                            onClick={handleResendVerification}
                            disabled={sendingVerification}
                            className="whitespace-nowrap px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md font-medium transition-colors disabled:opacity-50"
                        >
                            {sendingVerification ? 'Sending...' : 'Resend Email'}
                        </button>
                    </div>
                )}
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
