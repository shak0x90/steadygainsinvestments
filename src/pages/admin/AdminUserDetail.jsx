import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AdminUserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayModal, setShowPayModal] = useState(false);

    // Pay form
    const now = new Date();
    const [payForm, setPayForm] = useState({
        roiPercentage: '',
        month: MONTHS[now.getMonth()],
        year: now.getFullYear(),
        note: '',
        planName: '',
    });
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState('');

    // Invoice viewer
    const [viewInvoice, setViewInvoice] = useState(null);

    const fetchUser = () => {
        api.getUser(id).then(setUser).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { fetchUser(); }, [id]);

    const selectedAmount = payForm.planName ? user?.userPlans?.find(up => up.plan.name === payForm.planName)?.amount || 0 : user?.totalInvested || 0;
    const calculatedReturn = user && payForm.roiPercentage
        ? ((selectedAmount * parseFloat(payForm.roiPercentage)) / 100).toFixed(2)
        : '0.00';

    const handlePayReturn = async () => {
        setPaying(true);
        setPayError('');
        try {
            const invoice = await api.payReturn(id, payForm);
            toast.success(`Return of $${invoice.returnAmount.toFixed(2)} paid! Invoice: ${invoice.invoiceNumber}`);
            setShowPayModal(false);
            setPayForm({ ...payForm, roiPercentage: '', note: '', planName: '' });
            fetchUser(); // refresh data
        } catch (err) {
            setPayError(err.message);
            toast.error(err.message || 'Failed to issue return');
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" /></div>;
    if (!user) return <div className="text-center py-20 text-charcoal/50">User not found</div>;

    const roi = user.totalInvested > 0 ? ((user.currentValue - user.totalInvested) / user.totalInvested * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
                <Link to="/admin/users" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="font-display text-2xl font-bold text-charcoal">{user.name}</h1>
                    <p className="text-charcoal/40 text-sm">{user.email} · Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <Button onClick={() => setShowPayModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                    💰 Pay Monthly Return
                </Button>
            </div>

            {/* User stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Active Plans', value: user.userPlans?.length || '0', color: 'text-charcoal' },
                    { label: 'Total Invested', value: `$${user.totalInvested.toLocaleString()}`, color: 'text-blue-600' },
                    { label: 'Current Value', value: `$${user.currentValue.toLocaleString()}`, color: 'text-emerald-600' },
                    { label: 'Total ROI', value: `${roi}%`, color: 'text-amber-600' },
                    { label: 'Status', value: user.active ? 'Active' : 'Disabled', color: user.active ? 'text-emerald-600' : 'text-red-600' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl p-4 border border-border/50">
                        <p className="text-xs text-charcoal/40 mb-1">{s.label}</p>
                        <p className={`font-display text-lg font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Plan details card */}
            {/* Plan details cards */}
            {user.userPlans?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                    {user.userPlans.map(up => {
                        const p = up.plan;

                        // Determine which ROI applies based on the active risk level
                        const currentRoi = up.riskLevel === 'Low' ? p.roiLow :
                            up.riskLevel === 'Medium' ? p.roiMedium : p.roiHigh;

                        return (
                            <div key={up.id} className="bg-white rounded-xl p-5 border border-border/50">
                                <h3 className="font-display font-semibold text-charcoal mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color || '#0a7c42' }} />
                                    {p.name} Plan
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-charcoal/40">Invested Amount</p>
                                        <p className="font-semibold text-sm">${up.amount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-charcoal/40">Target ROI</p>
                                        <p className="font-semibold text-sm text-emerald-brand">{currentRoi}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-charcoal/40">Duration</p>
                                        <p className="font-semibold text-sm">{p.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-charcoal/40">Risk Strategy</p>
                                        <p className={`font-semibold text-sm ${up.riskLevel === 'Low' ? 'text-blue-600' :
                                            up.riskLevel === 'Medium' ? 'text-amber-600' : 'text-red-600'
                                            }`}>{up.riskLevel}</p>
                                    </div>
                                </div>
                                {(up.pendingAmount || up.pendingRiskLevel) && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Modifications</span>
                                        </div>
                                        <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                            Changes queued for next payout cycle:<br />
                                            {up.pendingAmount ? `Amount: $${up.pendingAmount.toLocaleString()}` : ''}
                                            {up.pendingAmount && up.pendingRiskLevel ? ' | ' : ''}
                                            {up.pendingRiskLevel ? `Strategy: ${up.pendingRiskLevel} Risk` : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Invoices / Payment History */}
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <h3 className="font-display font-semibold text-charcoal mb-4">Payment History (Invoices)</h3>
                    {user.invoices?.length ? (
                        <div className="space-y-2">
                            {user.invoices.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-border/30">
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">{inv.month} {inv.year}</p>
                                        <p className="text-xs text-charcoal/40">{inv.invoiceNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-600">+${inv.returnAmount.toFixed(2)}</p>
                                        <p className="text-xs text-charcoal/40">{inv.roiPercentage}% ROI</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{inv.status}</span>
                                        <button onClick={() => setViewInvoice(inv)} className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-charcoal/40 py-4 text-center">No payments issued yet</p>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <h3 className="font-display font-semibold text-charcoal mb-4">Transaction History</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {user.transactions?.map((tx) => (
                            <div key={tx.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-600' :
                                    tx.type === 'RETURN' ? 'bg-emerald-50 text-emerald-600' :
                                        'bg-orange-50 text-orange-600'
                                    }`}>
                                    {tx.type === 'DEPOSIT' ? '↓' : tx.type === 'RETURN' ? '↑' : '↗'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-charcoal font-medium truncate">{tx.description}</p>
                                    <p className="text-xs text-charcoal/40">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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

            {/* Holdings */}
            {user.holdings?.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-border/50">
                    <h3 className="font-display font-semibold text-charcoal mb-4">Holdings</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {user.holdings.map((h) => (
                            <div key={h.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-charcoal">{h.name}</p>
                                <p className="text-lg font-bold text-charcoal">${h.amount.toLocaleString()}</p>
                                <p className="text-xs text-emerald-brand font-medium">{h.change} · {h.roi}% ROI</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PAY RETURN MODAL */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPayModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-xl font-bold text-charcoal mb-1">Pay Monthly Return</h2>
                        <p className="text-charcoal/50 text-sm mb-5">Issue ROI return to <strong>{user.name}</strong></p>

                        {payError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{payError}</div>}

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-3">
                            <div>
                                <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Applicable Plan</label>
                                <select
                                    value={payForm.planName}
                                    onChange={(e) => setPayForm({ ...payForm, planName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                                >
                                    <option value="">Select Plan...</option>
                                    {user.userPlans?.map(up => <option key={up.plan.id} value={up.plan.name}>{up.plan.name} (${up.amount.toLocaleString()} — {up.riskLevel} Risk)</option>)}
                                </select>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-charcoal/50">Base Amount used for ROI</span>
                                <span className="font-semibold">${selectedAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Month</label>
                                    <select value={payForm.month} onChange={(e) => setPayForm({ ...payForm, month: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Year</label>
                                    <Input type="number" value={payForm.year} onChange={(e) => setPayForm({ ...payForm, year: parseInt(e.target.value) })} className="rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">ROI Percentage (%)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={payForm.roiPercentage}
                                    onChange={(e) => setPayForm({ ...payForm, roiPercentage: e.target.value })}
                                    placeholder="e.g. 4.0"
                                    className="rounded-lg text-lg font-bold"
                                />
                            </div>

                            {/* Calculated amount */}
                            <div className="bg-emerald-50 rounded-lg p-4 text-center">
                                <p className="text-xs text-emerald-brand/70 mb-1">Return Amount</p>
                                <p className="font-display text-3xl font-bold text-emerald-brand">${calculatedReturn}</p>
                                <p className="text-xs text-charcoal/40 mt-1">{payForm.roiPercentage || '0'}% of ${user.totalInvested.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Note (optional)</label>
                                <Textarea
                                    value={payForm.note}
                                    onChange={(e) => setPayForm({ ...payForm, note: e.target.value })}
                                    placeholder="e.g. Market performed well this month"
                                    className="rounded-lg" rows={2}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={handlePayReturn}
                                disabled={paying || !payForm.roiPercentage}
                                className="flex-1 bg-emerald-brand hover:bg-emerald-dark text-white rounded-lg"
                            >
                                {paying ? 'Processing...' : `Pay $${calculatedReturn}`}
                            </Button>
                            <Button onClick={() => setShowPayModal(false)} variant="outline" className="rounded-lg">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW INVOICE MODAL */}
            {viewInvoice && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:bg-transparent print:p-0 print-container" onClick={() => setViewInvoice(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl print:shadow-none print:w-full print:max-w-none print:rounded-none print:m-0 print:p-8" onClick={(e) => e.stopPropagation()}>
                        {/* Invoice Header */}
                        <div className="bg-charcoal text-white p-6 rounded-t-2xl print:bg-white print:text-charcoal print:border-b-2 print:border-gray-200 print:rounded-none print:p-0 print:pb-8">
                            <div className="flex items-center justify-between mb-4 print:mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-md bg-emerald-brand flex items-center justify-center print:bg-transparent print:w-10 print:h-10">
                                        <svg viewBox="0 0 100 100" className="w-4 h-4 print:w-8 print:h-8 print:text-emerald-brand">
                                            <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="currentColor" opacity="0.3" className="print:hidden" />
                                            <path d="M30 65 L45 45 L55 55 L70 35" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-display font-bold text-sm print:text-2xl print:text-emerald-brand">STEADY GAINS</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-white/40 print:text-gray-400 print:text-xl font-bold tracking-widest">INVOICE</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="font-mono text-xs text-white/50 print:text-gray-600 print:text-sm">Invoice #: {viewInvoice.invoiceNumber}</p>
                                    <p className="text-white/60 text-xs mt-1 print:text-gray-600 print:text-sm">Issued: {new Date(viewInvoice.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="hidden print:block text-right text-sm text-gray-500">
                                    <p>Steady Gains Investments</p>
                                    <p>123 Financial District</p>
                                    <p>New York, NY 10004</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice body */}
                        <div className="p-6 space-y-4 print:p-0 print:pt-10 print:space-y-8">
                            {/* Hidden on screen, shown on print: Bill To */}
                            <div className="hidden print:block mb-8">
                                <h3 className="text-gray-400 text-xs font-bold tracking-wider mb-2 uppercase">Billed To</h3>
                                <p className="font-bold text-lg text-charcoal">{user?.name || 'Investor'}</p>
                                <p className="text-gray-500">{user?.email || ''}</p>
                            </div>

                            {/* Shown on screen, hidden on print: Summary List */}
                            <div className="print:hidden space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Investor</span>
                                    <span className="font-semibold text-charcoal">{user.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Period</span>
                                    <span className="font-semibold">{viewInvoice.month} {viewInvoice.year}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Plan</span>
                                    <span className="font-semibold">{viewInvoice.planName}</span>
                                </div>
                                <hr className="border-border" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Invested Amount</span>
                                    <span className="font-semibold">${viewInvoice.investedAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">ROI Applied</span>
                                    <span className="font-semibold text-emerald-brand">{viewInvoice.roiPercentage}%</span>
                                </div>
                            </div>

                            {/* Hidden on screen, shown on print: Invoice Table */}
                            <div className="hidden print:block border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-charcoal">Investment Plan Return - {viewInvoice.planName}</p>
                                                <p className="text-sm text-gray-500 mt-1">Billing Period: {viewInvoice.month} {viewInvoice.year}</p>
                                            </td>
                                            <td className="py-4 px-4 text-right"></td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4">
                                                <p className="text-gray-600">Total Invested Amount</p>
                                            </td>
                                            <td className="py-4 px-4 text-right font-medium text-gray-800">${viewInvoice.investedAmount.toLocaleString()}</td>
                                        </tr>
                                        <tr className="bg-gray-50/50">
                                            <td className="py-4 px-4">
                                                <p className="text-gray-600">ROI Applied</p>
                                            </td>
                                            <td className="py-4 px-4 text-right font-medium text-emerald-600">{viewInvoice.roiPercentage}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <hr className="border-border print:hidden" />

                            {/* Return Amount */}
                            <div className="flex justify-between items-end print:mt-12 print:pt-6 print:border-t-2 print:border-gray-800">
                                <div className="hidden print:block">
                                    <p className="text-gray-500 text-sm">Thank you for investing with Steady Gains.</p>
                                </div>
                                <div className="flex justify-between w-full print:w-auto print:block print:text-right">
                                    <span className="text-charcoal/50 font-medium print:text-gray-500 print:text-xs print:uppercase print:tracking-widest print:block print:mb-1">Total Return Amount</span>
                                    <span className="font-display text-2xl font-bold text-emerald-brand print:text-4xl">${viewInvoice.returnAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {viewInvoice.note && (
                                <div className="bg-gray-50 rounded-lg p-3 print:bg-transparent print:p-0 print:border-l-4 print:border-emerald-brand print:pl-4 print:mt-8 print:rounded-none">
                                    <p className="text-xs text-charcoal/40 mb-1 print:text-gray-500 print:font-bold print:uppercase print:tracking-wider">Administrator Note</p>
                                    <p className="text-sm text-charcoal/70 print:text-gray-800 print:italic">"{viewInvoice.note}"</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 print:mt-16 print:justify-start">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${viewInvoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                    } print:border print:border-emerald-700 print:bg-transparent print:px-6 print:py-2 print:text-sm print:font-bold print:tracking-widest print:uppercase`}>{viewInvoice.status}</span>
                                <button onClick={() => window.print()} className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer print:hidden">🖨 Print</button>
                            </div>
                        </div>

                        <div className="px-6 pb-6 print:hidden">
                            <Button onClick={() => setViewInvoice(null)} variant="outline" className="w-full rounded-lg">Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
