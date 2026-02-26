import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function AdminModifications() {
    const [requests, setRequests] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchData = async () => {
        try {
            const [modData, txData] = await Promise.all([
                api.getPendingModifications(),
                api.getTransactions('WITHDRAWAL')
            ]);
            setRequests(modData);
            setWithdrawals(txData.filter(tx => tx.status === 'PENDING'));
        } catch (err) {
            toast.error(err.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this modification request? It will be applied immediately.')) return;
        setProcessingId(`mod-${id}`);
        try {
            await api.approveModification(id);
            toast.success('Modification approved successfully.');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to approve');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this request? Any increased funds will be refunded to the user.')) return;
        setProcessingId(`mod-${id}`);
        try {
            await api.rejectModification(id);
            toast.success('Modification rejected and refunded.');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to reject');
        } finally {
            setProcessingId(null);
        }
    };

    const handleApproveWithdrawal = async (id) => {
        if (!window.confirm('Are you sure you have sent the funds to the user? This marks the payout as completed.')) return;
        setProcessingId(`with-${id}`);
        try {
            await api.updateTxStatus(id, 'COMPLETED');
            toast.success('Withdrawal approved successfully.');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to approve withdrawal');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectWithdrawal = async (id) => {
        if (!window.confirm('Are you sure you want to reject this withdrawal? The requested amount will be immediately refunded back to the user\'s available balance.')) return;
        setProcessingId(`with-${id}`);
        try {
            await api.updateTxStatus(id, 'REJECTED');
            toast.success('Withdrawal rejected and funds refunded.');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to reject withdrawal');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-display text-2xl font-bold text-charcoal">Action Requests</h1>
                    <p className="text-charcoal/50 text-sm mt-1">Review pending plan modifications and user withdrawals.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f8f9fa] text-charcoal/60 uppercase text-[10px] font-bold tracking-wider border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Current Investment</th>
                                <th className="px-6 py-4 text-emerald-600 bg-emerald-50/50">Requested Changes</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-charcoal/50">
                                        No pending modification requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-charcoal">{req.user.name}</div>
                                            <div className="text-xs text-charcoal/50">{req.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded flex items-center justify-center border border-gray-100" style={{ backgroundColor: req.plan.color + '15', color: req.plan.color }}>
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <span className="font-semibold text-charcoal">{req.plan.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-charcoal font-medium">${req.amount.toLocaleString()}</div>
                                            <div className="text-xs text-charcoal/50">{req.riskLevel} Risk</div>
                                        </td>
                                        <td className="px-6 py-4 bg-emerald-50/30">
                                            {req.pendingAmount && req.pendingAmount !== req.amount && (
                                                <div className="flex items-center gap-2 text-xs font-semibold">
                                                    <span className="text-charcoal/50">Amount:</span>
                                                    <span className="text-charcoal">${req.amount.toLocaleString()}</span>
                                                    <span className="text-emerald-500">→</span>
                                                    <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">${req.pendingAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {req.pendingRiskLevel && req.pendingRiskLevel !== req.riskLevel && (
                                                <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                                                    <span className="text-charcoal/50">Strategy:</span>
                                                    <span className="text-charcoal">{req.riskLevel}</span>
                                                    <span className="text-emerald-500">→</span>
                                                    <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{req.pendingRiskLevel}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => handleReject(req.id)}
                                                    disabled={processingId === `mod-${req.id}`}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    onClick={() => handleApprove(req.id)}
                                                    disabled={processingId === `mod-${req.id}`}
                                                >
                                                    {processingId === `mod-${req.id}` ? 'Processing...' : 'Approve'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Withdrawals Section */}
            <div className="pt-8">
                <div className="mb-4">
                    <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
                        <span>Pending Withdrawals</span>
                        {withdrawals.length > 0 && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                {withdrawals.length}
                            </span>
                        )}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f8f9fa] text-charcoal/60 uppercase text-[10px] font-bold tracking-wider border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Payout Detail / Method</th>
                                    <th className="px-6 py-4">Request Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {withdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-charcoal/50">
                                            No pending withdrawal requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    withdrawals.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-charcoal">{tx.user?.name || 'Unknown User'}</div>
                                                <div className="text-xs text-charcoal/50">{tx.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[15px] font-bold text-charcoal">
                                                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-charcoal/70 text-sm max-w-sm whitespace-pre-wrap">
                                                    {tx.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-charcoal/60 text-sm">
                                                {new Date(tx.date).toLocaleDateString()}
                                                <div className="text-xs">
                                                    {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => handleRejectWithdrawal(tx.id)}
                                                        disabled={processingId === `with-${tx.id}`}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => handleApproveWithdrawal(tx.id)}
                                                        disabled={processingId === `with-${tx.id}`}
                                                    >
                                                        {processingId === `with-${tx.id}` ? 'Processing...' : 'Approve'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
