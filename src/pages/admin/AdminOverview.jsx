import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formatCurrency } = useLanguage();

    useEffect(() => {
        api.getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold text-charcoal">Admin Overview</h1>

            {/* Stats cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Active Users', value: stats?.activeUsers || 0, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Total Invested', value: formatCurrency(stats?.totalInvested || 0), color: 'bg-amber-50 text-amber-600' },
                    { label: 'Total Earnings', value: formatCurrency(stats?.totalEarnings || 0), color: 'bg-purple-50 text-purple-600' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl p-5 border border-border/50">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3 text-lg font-bold`}>
                            {typeof s.value === 'number' ? s.value : '$'}
                        </div>
                        <p className="text-xs text-charcoal/50 mb-1">{s.label}</p>
                        <p className="font-display text-xl font-bold text-charcoal">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 border border-border/50">
                <h3 className="font-display font-semibold text-charcoal mb-4">Recent Transactions (All Users)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 text-charcoal/50 font-medium text-xs">User</th>
                                <th className="text-left py-2 text-charcoal/50 font-medium text-xs">Type</th>
                                <th className="text-right py-2 text-charcoal/50 font-medium text-xs">Amount</th>
                                <th className="text-right py-2 text-charcoal/50 font-medium text-xs">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stats?.recentTransactions || []).map((tx) => (
                                <tr key={tx.id} className="border-b border-border/50">
                                    <td className="py-2 text-charcoal font-medium">{tx.user?.name}</td>
                                    <td className="py-2">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-700' :
                                            tx.type === 'RETURN' ? 'bg-emerald-50 text-emerald-700' :
                                                'bg-orange-50 text-orange-700'
                                            }`}>{tx.type}</span>
                                    </td>
                                    <td className="py-2 text-right font-semibold">${tx.amount.toFixed(2)}</td>
                                    <td className="py-2 text-right">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                                            tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                                                'bg-red-50 text-red-700'
                                            }`}>{tx.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
