import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function AdminSettings() {
    const { currency, setCurrency, currencies, rates, formatCurrency } = useLanguage();
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error('New passwords do not match');
        if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
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

    const getExchangeLabel = (code) => {
        if (code === 'USD') return 'Base currency';
        const rate = rates[code];
        if (!rate) return 'Loading...';
        return `1 USD = ${rate.toFixed(2)} ${code}`;
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">Admin Settings</h1>
                <p className="text-charcoal/50 text-sm mt-1">Manage your admin account preferences.</p>
            </div>

            {/* Currency Setting */}
            <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
                <h2 className="font-semibold text-charcoal mb-1">Display Currency</h2>
                <p className="text-sm text-charcoal/50 mb-5">Choose which currency to display all amounts in. Amounts are converted from USD using live exchange rates.</p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                    {Object.values(currencies).map((cur) => {
                        const isSelected = currency === cur.code;
                        return (
                            <button
                                key={cur.code}
                                onClick={() => { setCurrency(cur.code); toast.success(`Currency set to ${cur.label}`); }}
                                className={`relative flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                        ? 'border-emerald-brand bg-emerald-50/60'
                                        : 'border-gray-200 hover:border-emerald-brand/40 bg-white'
                                    }`}
                            >
                                {isSelected && (
                                    <span className="absolute top-3 right-3 w-5 h-5 bg-emerald-brand rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                )}
                                <span className="text-2xl mb-1">{cur.flag}</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-bold text-charcoal text-lg">{cur.symbol}</span>
                                    <span className="text-sm font-semibold text-charcoal">{cur.code}</span>
                                </div>
                                <span className="text-xs text-charcoal/50">{cur.label}</span>
                                <span className={`text-xs font-medium mt-1 ${cur.code === 'USD' ? 'text-charcoal/30' : 'text-emerald-600'}`}>
                                    {getExchangeLabel(cur.code)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Preview section */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-3">Preview</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        {[100, 1000, 10000].map((usd) => (
                            <div key={usd}>
                                <p className="text-xs text-charcoal/40 mb-0.5">${usd.toLocaleString()} USD</p>
                                <p className="font-display font-bold text-charcoal text-base">{formatCurrency(usd)}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-charcoal/30 text-center mt-3">Exchange rates update automatically every hour</p>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
                <h2 className="font-semibold text-charcoal mb-1">Change Password</h2>
                <p className="text-sm text-charcoal/50 mb-4">Update your admin account password.</p>
                <form onSubmit={handlePasswordSave} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-charcoal/60 mb-1.5 block uppercase tracking-wider">Current Password</label>
                        <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-charcoal/60 mb-1.5 block uppercase tracking-wider">New Password</label>
                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 6 characters" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-charcoal/60 mb-1.5 block uppercase tracking-wider">Confirm New Password</label>
                        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter new password" />
                    </div>
                    <Button type="submit" disabled={loadingPassword} className="bg-emerald-brand hover:bg-emerald-dark text-white">
                        {loadingPassword ? 'Saving...' : 'Update Password'}
                    </Button>
                </form>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
                <h2 className="font-semibold text-charcoal mb-4">Account Info</h2>
                <dl className="space-y-3 text-sm">
                    <div className="flex justify-between"><dt className="text-charcoal/50">Name</dt><dd className="font-medium text-charcoal">{user?.name}</dd></div>
                    <div className="flex justify-between"><dt className="text-charcoal/50">Email</dt><dd className="font-medium text-charcoal">{user?.email}</dd></div>
                    <div className="flex justify-between"><dt className="text-charcoal/50">Role</dt><dd className="font-bold text-emerald-brand uppercase text-xs tracking-wider">{user?.role}</dd></div>
                </dl>
            </div>
        </div>
    );
}
