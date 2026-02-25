import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Settings() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [saved, setSaved] = useState(false);

    const [notifications, setNotifications] = useState({
        returns: true,
        deposits: true,
        newsletter: false,
        promo: false,
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">Settings</h1>
                <p className="text-charcoal/50 text-sm mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl p-6 border border-border/50">
                <h3 className="font-display font-semibold text-charcoal mb-5">Profile Information</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-brand/20 flex items-center justify-center text-emerald-brand text-xl font-bold">
                            {user?.avatar || 'U'}
                        </div>
                        <div>
                            <p className="font-medium text-charcoal">{user?.name}</p>
                            <p className="text-xs text-charcoal/40">Member since {new Date(user?.joinDate || '2025-01-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Full Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-50 border-border/50 focus:border-emerald-brand rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Email</label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50 border-border/50 focus:border-emerald-brand rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-lg"
                        >
                            Save Changes
                        </Button>
                        {saved && (
                            <span className="text-sm text-emerald-brand font-medium animate-fade-in visible">
                                ✓ Saved successfully
                            </span>
                        )}
                    </div>
                </form>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl p-6 border border-border/50">
                <h3 className="font-display font-semibold text-charcoal mb-5">Notification Preferences</h3>
                <div className="space-y-4">
                    {[
                        { key: 'returns', label: 'Return notifications', desc: 'Get notified when you receive investment returns' },
                        { key: 'deposits', label: 'Deposit confirmations', desc: 'Receive confirmation emails for deposits' },
                        { key: 'newsletter', label: 'Weekly newsletter', desc: 'Stay updated with market insights and tips' },
                        { key: 'promo', label: 'Promotional emails', desc: 'Learn about new plans and offers' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-charcoal">{item.label}</p>
                                <p className="text-xs text-charcoal/40">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${notifications[item.key] ? 'bg-emerald-brand' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-xl p-6 border border-red-200">
                <h3 className="font-display font-semibold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-xs text-charcoal/50 mb-4">Once deleted, your account cannot be recovered.</p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                    Delete Account
                </Button>
            </div>
        </div>
    );
}
