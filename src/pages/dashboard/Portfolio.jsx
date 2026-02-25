import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '@/utils/api';

const COLORS = ['#0a7c42', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-charcoal text-white px-3 py-2 rounded-lg text-xs shadow-lg">
                <p className="font-medium">{payload[0].name}</p>
                <p className="text-emerald-light">{payload[0].value.toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};

export default function Portfolio() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getPortfolioSummary().then(setStats).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-emerald-brand border-t-transparent rounded-full" /></div>;
    if (!stats) return null;

    const totalValue = stats.holdings.reduce((sum, h) => sum + h.amount, 0);

    const assetAllocation = totalValue > 0 ? stats.holdings.map((h, i) => ({
        name: h.name,
        value: Number(((h.amount / totalValue) * 100).toFixed(1)),
        color: COLORS[i % COLORS.length]
    })) : [{ name: 'Cash', value: 100, color: '#e5e7eb' }];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">Your Portfolio</h1>
                <p className="text-charcoal/50 text-sm mt-1">See how your money is allocated across different assets</p>
            </div>

            <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
                {/* Donut Chart */}
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <h3 className="font-display font-semibold text-charcoal mb-4">Asset Allocation</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={assetAllocation}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={100}
                                dataKey="value"
                                stroke="none"
                            >
                                {assetAllocation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="space-y-2 mt-4">
                        {assetAllocation.map((a) => (
                            <div key={a.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                                    <span className="text-xs text-charcoal/70">{a.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-charcoal">{a.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <h3 className="font-display font-semibold text-charcoal mb-4">Holdings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 text-charcoal/50 font-medium text-xs">Asset</th>
                                    <th className="text-right py-3 text-charcoal/50 font-medium text-xs">Amount</th>
                                    <th className="text-right py-3 text-charcoal/50 font-medium text-xs">ROI</th>
                                    <th className="text-right py-3 text-charcoal/50 font-medium text-xs">Change</th>
                                    <th className="text-right py-3 text-charcoal/50 font-medium text-xs">Allocation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.holdings.map((h, i) => (
                                    <tr key={h.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                                                    {h.name.split(' ').map(w => w[0]).join('')}
                                                </div>
                                                <span className="font-medium text-charcoal">{h.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-right font-semibold text-charcoal">${h.amount.toLocaleString()}</td>
                                        <td className="py-3 text-right text-emerald-brand font-semibold">{h.roi}%</td>
                                        <td className="py-3 text-right">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${h.change.startsWith('+') ? 'text-emerald-brand bg-emerald-brand/10' : 'text-red-600 bg-red-50'}`}>
                                                {h.change}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right text-charcoal/60">
                                            {totalValue > 0 ? ((h.amount / totalValue) * 100).toFixed(1) : 0}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-charcoal/10">
                                    <td className="py-3 font-bold text-charcoal">Total</td>
                                    <td className="py-3 text-right font-bold text-charcoal">${totalValue.toLocaleString()}</td>
                                    <td colSpan="3" />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {stats.holdings.length === 0 && (
                        <div className="p-12 text-center text-charcoal/40">
                            <p className="text-sm">No active holdings found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
