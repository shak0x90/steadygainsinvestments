import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function Settings() {
    const { user, login } = useAuth();
    const { locale, setLocale, currency, setCurrency, currencies, formatCurrency, rates, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loadingProfile, setLoadingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [notifications, setNotifications] = useState({
        returns: true,
        deposits: true,
        newsletter: false,
        promo: false,
    });

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            const updatedUser = await api.updateProfile({ name });
            login(updatedUser, localStorage.getItem('sg_token'));
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('New passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoadingPassword(true);
        try {
            await api.updatePassword(currentPassword, newPassword);
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.message || 'Failed to change password');
        } finally {
            setLoadingPassword(false);
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const tabs = [
        {
            id: 'profile', label: 'Profile', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            )
        },
        {
            id: 'security', label: 'Security', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            )
        },
        {
            id: 'notifications', label: 'Notifications', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            )
        },
        {
            id: 'currency', label: 'Currency & Language', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">Account Settings</h1>
                <p className="text-charcoal/50 text-sm mt-1">Manage your profile, security, and preferences</p>
            </div>

            {/* User Profile Banner */}
            <div className="relative bg-gradient-to-br from-charcoal via-charcoal to-emerald-900 rounded-2xl p-6 text-white overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-brand/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-brand/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />

                <div className="relative flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-brand to-emerald-dark flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-brand/20 shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-display text-xl font-bold truncate">{user?.name || 'User'}</h2>
                        <p className="text-white/50 text-sm truncate">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                            </span>
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                Member since {new Date(user?.joinDate || user?.createdAt || '2025-01-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-white text-charcoal shadow-sm'
                            : 'text-charcoal/50 hover:text-charcoal/70'
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">

                {/* ── Profile Tab ── */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                        <div className="px-6 py-5 border-b border-border/50">
                            <h3 className="font-display font-semibold text-charcoal">Profile Information</h3>
                            <p className="text-xs text-charcoal/40 mt-0.5">Update your personal details used across the platform</p>
                        </div>
                        <form onSubmit={handleProfileSave} className="p-6 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs font-semibold text-charcoal/70 tracking-wider uppercase mb-2 block">Full Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-11 bg-gray-50/80 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/20 rounded-xl transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-charcoal/70 tracking-wider uppercase mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Input
                                            value={email}
                                            disabled
                                            className="h-11 bg-gray-100 border-gray-200 text-charcoal/40 rounded-xl cursor-not-allowed pr-20"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-wider font-bold text-charcoal/25 bg-gray-200/80 px-2 py-0.5 rounded-md">
                                            locked
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-charcoal/35 mt-1.5">Contact support to change your email address</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                <p className="text-[10px] text-charcoal/30">Last updated: {new Date().toLocaleDateString()}</p>
                                <Button
                                    type="submit"
                                    disabled={loadingProfile || name === user?.name}
                                    className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-xl px-6 h-10 shadow-sm shadow-emerald-brand/20 disabled:opacity-40 transition-all"
                                >
                                    {loadingProfile ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                            Saving...
                                        </span>
                                    ) : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Security Tab ── */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-5 border-b border-border/50">
                                <h3 className="font-display font-semibold text-charcoal">Change Password</h3>
                                <p className="text-xs text-charcoal/40 mt-0.5">Use a strong password with at least 6 characters</p>
                            </div>
                            <form onSubmit={handlePasswordSave} className="p-6 space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-charcoal/70 tracking-wider uppercase mb-2 block">Current Password</label>
                                    <Input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter your current password"
                                        className="h-11 bg-gray-50/80 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/20 rounded-xl max-w-md transition-all"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
                                    <div>
                                        <label className="text-xs font-semibold text-charcoal/70 tracking-wider uppercase mb-2 block">New Password</label>
                                        <Input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min 6 characters"
                                            className="h-11 bg-gray-50/80 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/20 rounded-xl transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-charcoal/70 tracking-wider uppercase mb-2 block">Confirm New Password</label>
                                        <Input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter new password"
                                            className={`h-11 bg-gray-50/80 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/20 rounded-xl transition-all ${confirmPassword && confirmPassword !== newPassword ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                                                }`}
                                        />
                                        {confirmPassword && confirmPassword !== newPassword && (
                                            <p className="text-[10px] text-red-500 mt-1.5 font-medium">Passwords do not match</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword && (
                                    <div className="max-w-md">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider">Strength:</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${newPassword.length >= 12 ? 'text-emerald-600' : newPassword.length >= 8 ? 'text-amber-500' : 'text-red-500'
                                                }`}>
                                                {newPassword.length >= 12 ? 'Strong' : newPassword.length >= 8 ? 'Medium' : 'Weak'}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${newPassword.length >= (i * 3)
                                                        ? newPassword.length >= 12 ? 'bg-emerald-500' : newPassword.length >= 8 ? 'bg-amber-400' : 'bg-red-400'
                                                        : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end pt-2 border-t border-border/30">
                                    <Button
                                        type="submit"
                                        disabled={loadingPassword || !currentPassword || !newPassword || !confirmPassword}
                                        className="bg-charcoal hover:bg-charcoal/90 text-white rounded-xl px-6 h-10 shadow-sm disabled:opacity-40 transition-all"
                                    >
                                        {loadingPassword ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                Updating...
                                            </span>
                                        ) : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-red-100 bg-red-50/30">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <h3 className="font-display font-semibold text-red-600 text-sm">Danger Zone</h3>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-charcoal">Delete your account</p>
                                    <p className="text-xs text-charcoal/40 mt-0.5">Permanently remove your account and all data. This action cannot be undone.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl text-xs font-semibold px-5 h-9 shrink-0 transition-all"
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Notifications Tab ── */}
                {activeTab === 'notifications' && (
                    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                        <div className="px-6 py-5 border-b border-border/50">
                            <h3 className="font-display font-semibold text-charcoal">Notification Preferences</h3>
                            <p className="text-xs text-charcoal/40 mt-0.5">Choose what updates you'd like to receive</p>
                        </div>
                        <div className="divide-y divide-border/30">
                            {[
                                { key: 'returns', label: 'Return Notifications', desc: 'Get notified when you receive investment returns', icon: '📈' },
                                { key: 'deposits', label: 'Deposit Confirmations', desc: 'Receive confirmation emails for deposits', icon: '💰' },
                                { key: 'newsletter', label: 'Weekly Newsletter', desc: 'Stay updated with market insights and tips', icon: '📬' },
                                { key: 'promo', label: 'Promotional Emails', desc: 'Learn about new plans and exclusive offers', icon: '🎁' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between px-6 py-5 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-charcoal">{item.label}</p>
                                            <p className="text-xs text-charcoal/40 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                        className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${notifications[item.key]
                                            ? 'bg-emerald-brand shadow-inner shadow-emerald-dark/20'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-all duration-300 ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-border/30">
                            <p className="text-[10px] text-charcoal/30 text-center">Notification preferences are saved automatically</p>
                        </div>
                    </div>
                )}

                {/* ── Currency & Language Tab ── */}
                {activeTab === 'currency' && (
                    <div className="space-y-6">
                        {/* Currency Selection */}
                        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-5 border-b border-border/50">
                                <h3 className="font-display font-semibold text-charcoal">Display Currency</h3>
                                <p className="text-xs text-charcoal/40 mt-0.5">Choose which currency to display all amounts in. Amounts are converted from USD using live exchange rates.</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {Object.entries(currencies).map(([code, cur]) => (
                                        <button
                                            key={code}
                                            onClick={() => setCurrency(code)}
                                            className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer group ${currency === code
                                                    ? 'border-emerald-brand bg-emerald-50/50 shadow-sm shadow-emerald-brand/10'
                                                    : 'border-border/50 hover:border-emerald-brand/30 hover:bg-gray-50'
                                                }`}
                                        >
                                            {currency === code && (
                                                <div className="absolute top-3 right-3">
                                                    <svg className="w-5 h-5 text-emerald-brand" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="text-3xl mb-2">{cur.flag}</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-charcoal">{cur.symbol}</span>
                                                <span className="text-sm font-semibold text-charcoal/60">{cur.code}</span>
                                            </div>
                                            <p className="text-xs text-charcoal/40 mt-1">{cur.label}</p>
                                            {code !== 'USD' && (
                                                <p className="text-[10px] text-emerald-600 font-medium mt-2">
                                                    1 USD = {rates[code]?.toFixed(2)} {code}
                                                </p>
                                            )}
                                            {code === 'USD' && (
                                                <p className="text-[10px] text-charcoal/30 font-medium mt-2">Base currency</p>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Live Preview */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-border/30">
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal/40 mb-3">Preview</p>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-charcoal/50">$100 USD</p>
                                            <p className="text-lg font-bold text-charcoal">{formatCurrency(100)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-charcoal/50">$1,000 USD</p>
                                            <p className="text-lg font-bold text-charcoal">{formatCurrency(1000)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-charcoal/50">$10,000 USD</p>
                                            <p className="text-lg font-bold text-charcoal">{formatCurrency(10000)}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-charcoal/25 text-center mt-3">Exchange rates update automatically every hour</p>
                                </div>
                            </div>
                        </div>

                        {/* Language Selection */}
                        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-5 border-b border-border/50">
                                <h3 className="font-display font-semibold text-charcoal">Display Language</h3>
                                <p className="text-xs text-charcoal/40 mt-0.5">Choose the language for the interface</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { code: 'en', label: 'English', flag: '🇺🇸', desc: 'Default language' },
                                        { code: 'bn', label: 'বাংলা', flag: '🇧🇩', desc: 'Bengali / Bangla' },
                                    ].map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLocale(lang.code)}
                                            className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer ${locale === lang.code
                                                    ? 'border-emerald-brand bg-emerald-50/50 shadow-sm shadow-emerald-brand/10'
                                                    : 'border-border/50 hover:border-emerald-brand/30 hover:bg-gray-50'
                                                }`}
                                        >
                                            {locale === lang.code && (
                                                <div className="absolute top-3 right-3">
                                                    <svg className="w-5 h-5 text-emerald-brand" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="text-3xl mb-2">{lang.flag}</div>
                                            <p className="text-base font-bold text-charcoal">{lang.label}</p>
                                            <p className="text-xs text-charcoal/40 mt-0.5">{lang.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
