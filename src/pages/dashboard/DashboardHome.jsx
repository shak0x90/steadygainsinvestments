import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
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
    const { t, formatCurrency } = useLanguage();
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

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-border/50 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                            <div>
                                <div className="h-3 bg-gray-200 rounded w-20 mb-2 mt-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                    <div className="bg-white rounded-xl p-6 border border-border/50 h-[360px]">
                        <div className="flex justify-between mb-6">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="h-64 bg-gray-100 rounded"></div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-border/50 h-[360px]">
                        <div className="flex justify-between mb-6">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!stats) return null;

    // Build real chart data from user's transaction history
    const buildChartData = () => {
        // If there are no transactions yet, just show a flat line starting from their totalInvested
        if (!recentTx || recentTx.length === 0) {
            return [
                { month: 'Start', value: stats.totalInvested },
                { month: 'Now', value: stats.currentValue }
            ];
        }

        // We process the transactions chronologically (they come in desc order, so reverse them)
        const sortedTx = [...recentTx].reverse();

        let runningBalance = 0;
        const chartDataMap = new Map();

        // Add an initial data point if there is a gap before the first transaction
        // (Assuming totalInvested/currentValue might have pre-existing data)
        const earliestDate = new Date(sortedTx[0].date);
        chartDataMap.set('Start', 0);

        sortedTx.forEach(tx => {
            const dateStr = new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            if (tx.status === 'COMPLETED') {
                if (tx.type === 'DEPOSIT') {
                    runningBalance += tx.amount;
                } else if (tx.type === 'RETURN') {
                    // Assuming Returns also increase the current value (reinvestment)
                    runningBalance += tx.amount;
                } else if (tx.type === 'WITHDRAWAL') {
                    runningBalance -= tx.amount;
                }
            }

            // Map the date to the running balance at that time
            chartDataMap.set(dateStr, runningBalance);
        });

        // Ensure the final point matches the exact currentValue
        const finalDate = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        chartDataMap.set(`Today (${finalDate})`, stats.currentValue);

        return Array.from(chartDataMap).map(([month, value]) => ({ month, value }));
    };

    const chartData = buildChartData();

    const STAT_CARDS = [
        {
            label: t('dashboard.totalInvested'),
            value: formatCurrency(stats.totalInvested),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            label: t('dashboard.totalValue'),
            value: formatCurrency(stats.currentValue),
            change: `+${formatCurrency(stats.lifetimeEarnings)}`,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
            ),
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            label: t('dashboard.totalROI'),
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
            value: stats.userPlans?.length > 0 ? `${stats.userPlans.length} Plan${stats.userPlans.length > 1 ? 's' : ''}` : 'None',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            label: 'Projected Year-End ROI',
            value: formatCurrency((stats.totalInvested * ((stats.latestRoiPercentage || 0) * 12)) / 100),
            change: `~${((stats.latestRoiPercentage || 0) * 12).toFixed(1)}% APR`,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
            ),
            bgColor: 'bg-teal-50',
            iconColor: 'text-teal-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">
                    {t('dashboard.welcome')}, {user?.name?.split(' ')[0] || 'Investor'} 👋
                </h1>
                <p className="text-charcoal/50 text-sm mt-1">Here&apos;s how your investments are doing</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl p-4 sm:p-5 border border-border/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center`}>
                                {card.icon}
                            </div>
                            {card.change && (card.label === 'Current Value' || card.label === 'Projected Year-End ROI') && (
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.label === 'Projected Year-End ROI' ? 'text-teal-700 bg-teal-100' : 'text-emerald-brand bg-emerald-brand/10'}`}>
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
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
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
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-emerald-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-charcoal mb-1">No Activity Yet</p>
                                    <p className="text-xs text-charcoal/50 mb-4">You're ready to start growing your wealth!</p>
                                    <Link to="/dashboard/plans" className="text-xs font-semibold text-emerald-brand bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors inline-block">View Investment Plans</Link>
                                </div>
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

                {/* Active Plans Detail */}
                {stats?.userPlans?.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-semibold text-charcoal">Your Active Plans</h3>
                            <Link to="/dashboard/plans" className="text-xs text-emerald-brand hover:underline">Manage Plans</Link>
                        </div>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {stats.userPlans.map(up => (
                                <div key={up.id} className="p-4 rounded-xl border border-border/50 bg-gray-50 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-display font-bold text-charcoal flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: up.plan.color || '#0a7c42' }} />
                                                {up.plan.name}
                                            </h4>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${up.riskLevel === 'Low' ? 'bg-blue-100 text-blue-700' :
                                                up.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>{up.riskLevel} Risk</span>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-xs text-charcoal/50">Invested</p>
                                                <p className="font-bold text-charcoal">${up.amount.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-charcoal/50">Expected ROI</p>
                                                <p className="font-bold text-emerald-brand">
                                                    {up.riskLevel === 'Low' ? up.plan.roiLow : up.riskLevel === 'Medium' ? up.plan.roiMedium : up.plan.roiHigh}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {(up.pendingAmount || up.pendingRiskLevel) && (
                                        <div className="mt-4 pt-3 border-t border-amber-200/50">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending Changes</span>
                                            </div>
                                            <p className="text-[11px] text-amber-700 flex justify-between items-center">
                                                <span className="opacity-75">Takes effect next cycle</span>
                                                <span className="font-semibold">
                                                    {up.pendingAmount ? `$${up.pendingAmount.toLocaleString()}` : ''}
                                                    {up.pendingAmount && up.pendingRiskLevel ? ' · ' : ''}
                                                    {up.pendingRiskLevel ? `${up.pendingRiskLevel}` : ''}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
