import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import api from '@/utils/api';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-charcoal text-white px-3 py-2 rounded-lg text-xs shadow-lg">
                <p className="font-medium">{label}</p>
                <p className="text-emerald-light">${payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentTx, setRecentTx] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getPortfolioSummary(),
            api.getTransactions()
        ]).then(([summary, txs]) => {
            setStats(summary);
            setRecentTx(txs.slice(0, 5));
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-emerald-brand border-t-transparent rounded-full" /></div>;
    if (!stats) return null;

    // We don't have historical chart data in the DB yet, so we'll mock a simple line based on current value for now,
    // or you could build a chart from the transaction history. Let's make a simple flat line up to current.
    const mockChartData = [
        { month: 'Jan', value: stats.totalInvested },
        { month: 'Feb', value: stats.currentValue > stats.totalInvested ? stats.totalInvested + (stats.currentValue - stats.totalInvested) / 2 : stats.currentValue },
        { month: 'Mar', value: stats.currentValue },
    ];

    const STAT_CARDS = [
        {
            label: 'Total Invested',
            value: `$${stats.totalInvested.toLocaleString()}`,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            label: 'Current Value',
            value: `$${stats.currentValue.toLocaleString()}`,
            change: `+$${stats.lifetimeEarnings.toLocaleString()}`,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
            ),
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            label: 'Total ROI',
            value: `${stats.totalROI}%`,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
        },
        {
            label: 'Active Plans',
            value: stats.plans?.length > 0 ? `${stats.plans.length} Plan${stats.plans.length > 1 ? 's' : ''}` : 'None',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">
                    Welcome back, {user?.name?.split(' ')[0] || 'Investor'} 👋
                </h1>
                <p className="text-charcoal/50 text-sm mt-1">Here&apos;s how your investments are doing</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl p-5 border border-border/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center`}>
                                {card.icon}
                            </div>
                            {card.change && card.label === 'Current Value' && stats.lifetimeEarnings > 0 && (
                                <span className="text-xs text-emerald-brand font-medium bg-emerald-brand/10 px-2 py-0.5 rounded-full">
                                    {card.change}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-charcoal/50 mb-1">{card.label}</p>
                        <p className="font-display text-xl font-bold text-charcoal">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Recent Activity */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                {/* Portfolio Chart */}
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-semibold text-charcoal">Portfolio Growth</h3>
                        <span className="text-xs text-charcoal/40">YTD</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={mockChartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0a7c42" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#0a7c42" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#0a7c42" strokeWidth={2} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-charcoal">Recent Activity</h3>
                        <Link to="/dashboard/transactions" className="text-xs text-emerald-brand hover:underline">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {recentTx.length === 0 ? (
                            <p className="text-sm text-charcoal/40 text-center py-4">No recent activity</p>
                        ) : recentTx.map((tx) => (
                            <div key={tx.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-600' :
                                    tx.type === 'RETURN' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {tx.type === 'DEPOSIT' ? '↓' : tx.type === 'RETURN' ? '↑' : '↗'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-charcoal font-medium truncate">{tx.description}</p>
                                    <p className="text-xs text-charcoal/40">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                                <span className={`text-sm font-medium ${tx.type === 'WITHDRAWAL' ? 'text-orange-600' : tx.type === 'RETURN' ? 'text-emerald-600' : 'text-charcoal'
                                    }`}>
                                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
