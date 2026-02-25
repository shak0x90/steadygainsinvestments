import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';

const TYPE_FILTERS = ['All', 'Deposit', 'Return', 'Withdrawal'];

export default function Transactions() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('history'); // 'history' or 'invoices'
    const [filter, setFilter] = useState('All');
    const [transactions, setTransactions] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewInvoice, setViewInvoice] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.getTransactions(),
            api.getMyInvoices()
        ]).then(([txData, invData]) => {
            setTransactions(txData);
            setInvoices(invData);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filteredTx = filter === 'All'
        ? transactions
        : transactions.filter((t) => t.type.toLowerCase() === filter.toLowerCase());

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-emerald-brand border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">Transactions & ROI</h1>
                <p className="text-charcoal/50 text-sm mt-1">View your complete financial history and ROI invoices</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border/50">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === 'history' ? 'border-emerald-brand text-emerald-brand' : 'border-transparent text-charcoal/50 hover:text-charcoal'
                        }`}
                >
                    Transaction History
                </button>
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === 'invoices' ? 'border-emerald-brand text-emerald-brand' : 'border-transparent text-charcoal/50 hover:text-charcoal'
                        }`}
                >
                    ROI Invoices
                </button>
            </div>

            {activeTab === 'history' ? (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        {TYPE_FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${filter === f
                                    ? 'bg-emerald-brand text-white'
                                    : 'bg-white text-charcoal/60 border border-border/50 hover:border-emerald-brand/30'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-border">
                                        <th className="text-left px-6 py-3 text-charcoal/50 font-medium text-xs">Type</th>
                                        <th className="text-left px-6 py-3 text-charcoal/50 font-medium text-xs">Description</th>
                                        <th className="text-left px-6 py-3 text-charcoal/50 font-medium text-xs">Date</th>
                                        <th className="text-right px-6 py-3 text-charcoal/50 font-medium text-xs">Amount</th>
                                        <th className="text-right px-6 py-3 text-charcoal/50 font-medium text-xs">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTx.map((tx) => (
                                        <tr key={tx.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-700' :
                                                    tx.type === 'RETURN' ? 'bg-emerald-50 text-emerald-700' :
                                                        'bg-orange-50 text-orange-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-blue-500' :
                                                        tx.type === 'RETURN' ? 'bg-emerald-500' :
                                                            'bg-orange-500'
                                                        }`} />
                                                    {tx.type.charAt(0) + tx.type.slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-charcoal font-medium">{tx.description}</td>
                                            <td className="px-6 py-4 text-charcoal/50">
                                                {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'WITHDRAWAL' ? 'text-orange-600' : tx.type === 'RETURN' ? 'text-emerald-600' : 'text-charcoal'
                                                }`}>
                                                {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' ? 'text-emerald-brand bg-emerald-brand/10' :
                                                    tx.status === 'PENDING' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTx.length === 0 && (
                            <div className="p-12 text-center text-charcoal/40">
                                <p className="text-sm">No transactions found.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-border">
                                    <th className="text-left px-6 py-3 text-charcoal/50 font-medium text-xs">Invoice #</th>
                                    <th className="text-left px-6 py-3 text-charcoal/50 font-medium text-xs">Period</th>
                                    <th className="text-left px-6 py-3 text-charcoal/50 font-medium text-xs">Plan</th>
                                    <th className="text-right px-6 py-3 text-charcoal/50 font-medium text-xs">ROI</th>
                                    <th className="text-right px-6 py-3 text-charcoal/50 font-medium text-xs">Return Amount</th>
                                    <th className="text-right px-6 py-3 text-charcoal/50 font-medium text-xs">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-charcoal/60">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4 font-medium text-charcoal">{inv.month} {inv.year}</td>
                                        <td className="px-6 py-4 text-charcoal/60">{inv.planName}</td>
                                        <td className="px-6 py-4 text-right text-emerald-brand font-medium">{inv.roiPercentage}%</td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">+${inv.returnAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setViewInvoice(inv)} className="text-xs text-emerald-brand hover:underline font-medium cursor-pointer">View Invoice</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {invoices.length === 0 && (
                        <div className="p-12 text-center text-charcoal/40">
                            <p className="text-sm">No ROI invoices found yet.</p>
                        </div>
                    )}
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
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 print:border print:border-emerald-700 print:bg-transparent print:px-6 print:py-2 print:text-sm print:font-bold print:tracking-widest print:uppercase">PAID</span>
                                <button onClick={() => window.print()} className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer print:hidden">🖨 Print</button>
                            </div>
                        </div>

                        <div className="px-6 pb-6 mt-4 print:hidden">
                            <Button onClick={() => setViewInvoice(null)} variant="outline" className="w-full rounded-lg">Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
