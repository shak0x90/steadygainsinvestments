import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        api.getTransactions(filter || undefined).then(setTransactions).catch(console.error).finally(() => setLoading(false));
    }, [filter]);

    const handleStatusChange = async (id, status) => {
        try {
            await api.updateTxStatus(id, status);
            setTransactions(transactions.map((tx) => (tx.id === id ? { ...tx, status } : tx)));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="font-display text-2xl font-bold text-charcoal">All Transactions</h1>
                <div className="flex gap-2">
                    {['', 'DEPOSIT', 'RETURN', 'WITHDRAWAL'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setLoading(true); setFilter(f); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${filter === f ? 'bg-amber-500 text-white' : 'bg-white text-charcoal/60 border border-border/50'
                                }`}
                        >
                            {f || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-border">
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">User</th>
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">Type</th>
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">Description</th>
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">Date</th>
                                <th className="text-right px-5 py-3 text-charcoal/50 font-medium text-xs">Amount</th>
                                <th className="text-center px-5 py-3 text-charcoal/50 font-medium text-xs">Status</th>
                                <th className="text-right px-5 py-3 text-charcoal/50 font-medium text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-border/50 hover:bg-gray-50">
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-charcoal">{tx.user?.name || '—'}</p>
                                        <p className="text-xs text-charcoal/40">{tx.user?.email || ''}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-700' :
                                                tx.type === 'RETURN' ? 'bg-emerald-50 text-emerald-700' :
                                                    'bg-orange-50 text-orange-700'
                                            }`}>{tx.type}</span>
                                    </td>
                                    <td className="px-5 py-3 text-charcoal/70 max-w-[200px] truncate">{tx.description}</td>
                                    <td className="px-5 py-3 text-charcoal/50 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="px-5 py-3 text-right font-semibold">${tx.amount.toFixed(2)}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                                                tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-red-50 text-red-700'
                                            }`}>{tx.status}</span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {tx.status === 'PENDING' && (
                                            <div className="flex gap-1 justify-end">
                                                <button onClick={() => handleStatusChange(tx.id, 'COMPLETED')} className="text-xs bg-emerald-brand text-white px-2 py-1 rounded hover:bg-emerald-dark cursor-pointer">Approve</button>
                                                <button onClick={() => handleStatusChange(tx.id, 'REJECTED')} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 && (
                    <div className="p-12 text-center text-charcoal/40 text-sm">No transactions found</div>
                )}
            </div>
        </div>
    );
}
