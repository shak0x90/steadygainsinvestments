import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function Withdraw() {
    const { user, login } = useAuth();
    const { t, formatCurrency } = useLanguage();
    const [activeTab, setActiveTab] = useState('withdraw');

    // Withdraw state
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedMethodId, setSelectedMethodId] = useState('');
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);

    // Deposit state
    const [depositAmount, setDepositAmount] = useState('');
    const [depositMethod, setDepositMethod] = useState('Bank Transfer');
    const [depositRef, setDepositRef] = useState('');
    const [loadingDeposit, setLoadingDeposit] = useState(false);

    // Shared state
    const [transactions, setTransactions] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loadingMethods, setLoadingMethods] = useState(true);
    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [portfolioSummary, setPortfolioSummary] = useState(null);

    const usableFunds = portfolioSummary?.usableFunds ?? 0;
    const totalValue = user?.currentValue || 0;

    const fetchData = async () => {
        try {
            const [txData, methodsData, summary] = await Promise.all([
                api.getTransactions(),
                api.getPaymentMethods(),
                api.getPortfolioSummary()
            ]);
            setTransactions(txData.filter(tx => tx.type === 'WITHDRAWAL' || tx.type === 'DEPOSIT'));
            setPaymentMethods(methodsData);
            setPortfolioSummary(summary);
            if (methodsData.length > 0 && !selectedMethodId) {
                setSelectedMethodId(methodsData[0].id.toString());
            }
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setLoadingHistory(false);
            setLoadingMethods(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Withdraw Handler ──
    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amt = parseFloat(withdrawAmount);
        if (!amt || amt < 10) return toast.error('Minimum withdrawal is $10');
        if (amt > usableFunds) return toast.error(`You only have $${usableFunds.toFixed(2)} in usable funds`);
        if (!selectedMethodId) return toast.error('Please select a saved payment method');

        const selectedMethod = paymentMethods.find(m => m.id.toString() === selectedMethodId);
        let detailsStr = `${selectedMethod.accountName} - ${selectedMethod.accountNumber}`;
        if (selectedMethod.type === 'BANK') {
            const extra = [
                selectedMethod.branchName && `Branch: ${selectedMethod.branchName}`,
                selectedMethod.routingNumber && `Routing: ${selectedMethod.routingNumber}`,
                selectedMethod.swiftCode && `SWIFT: ${selectedMethod.swiftCode}`
            ].filter(Boolean).join(', ');
            if (extra) detailsStr += `\n${extra}`;
        }

        setLoadingWithdraw(true);
        try {
            await api.createWithdrawal({ amount: amt, method: selectedMethod.provider, details: detailsStr });
            toast.success('Withdrawal request submitted!');
            setWithdrawAmount('');
            const updatedUser = await api.getMe();
            login(updatedUser, localStorage.getItem('sg_token'));
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to submit withdrawal');
        } finally { setLoadingWithdraw(false); }
    };

    // ── Deposit Handler ──
    const handleDeposit = async (e) => {
        e.preventDefault();
        const amt = parseFloat(depositAmount);
        if (!amt || amt < 1) return toast.error('Minimum deposit is $1');

        setLoadingDeposit(true);
        try {
            await api.createDeposit({ amount: amt, method: depositMethod, details: depositRef || null });
            toast.success('Deposit request submitted! Awaiting admin approval.');
            setDepositAmount('');
            setDepositRef('');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to submit deposit');
        } finally { setLoadingDeposit(false); }
    };

    // ── Delete Payment Method ──
    const handleDeleteMethod = async (id) => {
        if (!window.confirm('Remove this payment method?')) return;
        try {
            await api.deletePaymentMethod(id);
            toast.success('Payment method deleted');
            setPaymentMethods(prev => prev.filter(m => m.id !== id));
            if (selectedMethodId === id.toString()) setSelectedMethodId('');
        } catch (err) { toast.error(err.message || 'Failed to delete'); }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            COMPLETED: 'bg-emerald-100 text-emerald-700',
            PENDING: 'bg-amber-100 text-amber-700',
            REJECTED: 'bg-red-100 text-red-700',
        };
        return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
    };

    const lockedInPlans = portfolioSummary ? (totalValue - usableFunds) : 0;

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">{t('funding.title')}</h1>
                <p className="text-charcoal/50 text-sm mt-1">{t('funding.subtitle')}</p>
            </div>

            {/* ── Balance Overview ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-charcoal to-charcoal/90 rounded-2xl p-5 text-white">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{t('funding.totalValue')}</p>
                    <p className="text-2xl font-display font-bold mt-1">{formatCurrency(totalValue)}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-brand to-emerald-dark rounded-2xl p-5 text-white">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">{t('funding.usableFunds')}</p>
                    <p className="text-2xl font-display font-bold mt-1">{formatCurrency(usableFunds)}</p>
                    <p className="text-[9px] text-white/40 mt-1">{t('funding.usableNote')}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-border/50">
                    <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-semibold">{t('funding.lockedInPlans')}</p>
                    <p className="text-2xl font-display font-bold text-charcoal mt-1">{formatCurrency(lockedInPlans)}</p>
                    <p className="text-[9px] text-charcoal/30 mt-1">{t('funding.lockedNote')}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_2fr] gap-6">

                {/* Left Column */}
                <div className="space-y-6">

                    {/* ── Deposit / Withdraw Tab Switcher ── */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('withdraw')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'withdraw' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/40 hover:text-charcoal/60'}`}
                        >
                            {t('funding.withdraw')}
                        </button>
                        <button
                            onClick={() => setActiveTab('deposit')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'deposit' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/40 hover:text-charcoal/60'}`}
                        >
                            {t('funding.deposit')}
                        </button>
                    </div>

                    {/* ── Withdraw Form ── */}
                    {activeTab === 'withdraw' && (
                        <div className="bg-white rounded-xl p-6 border border-border/50">
                            <form onSubmit={handleWithdraw} className="space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Amount ($)</label>
                                    <Input type="number" min="10" step="0.01" placeholder="0.00" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="h-12 text-lg font-medium bg-gray-50 border-gray-200" required />
                                    {withdrawAmount && parseFloat(withdrawAmount) > usableFunds && (
                                        <p className="text-[10px] text-red-500 font-medium mt-1">Exceeds usable funds (${usableFunds.toFixed(2)})</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Payout Method</label>
                                    {paymentMethods.length === 0 ? (
                                        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                            Please add a payment method below first.
                                        </div>
                                    ) : (
                                        <select value={selectedMethodId} onChange={(e) => setSelectedMethodId(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-gray-50 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand transition-colors text-charcoal font-medium text-sm" required>
                                            <option value="" disabled>Select a saved method...</option>
                                            {paymentMethods.map(m => (
                                                <option key={m.id} value={m.id}>{m.provider} ({m.accountNumber.slice(-4)})</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="text-[10px] text-charcoal/40 bg-gray-50 p-3 rounded-lg">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Only <strong>usable funds</strong> can be withdrawn (not locked in active plans).</li>
                                        <li>Processing time is typically 1-3 business days.</li>
                                        <li>Minimum withdrawal is $10.00.</li>
                                    </ul>
                                </div>

                                <Button type="submit" disabled={loadingWithdraw || usableFunds <= 0 || paymentMethods.length === 0} className="w-full h-12 bg-emerald-brand hover:bg-emerald-dark text-white rounded-xl font-medium">
                                    {loadingWithdraw ? 'Submitting...' : 'Request Withdrawal'}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* ── Deposit Form ── */}
                    {activeTab === 'deposit' && (
                        <div className="bg-white rounded-xl p-6 border border-border/50">
                            <form onSubmit={handleDeposit} className="space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Deposit Amount ($)</label>
                                    <Input type="number" min="1" step="0.01" placeholder="0.00" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="h-12 text-lg font-medium bg-gray-50 border-gray-200" required />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Payment Method</label>
                                    <select value={depositMethod} onChange={(e) => setDepositMethod(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-gray-50 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand transition-colors text-charcoal font-medium text-sm">
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="bKash">bKash</option>
                                        <option value="Nagad">Nagad</option>
                                        <option value="Crypto (USDT)">Crypto (USDT)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Transaction Reference <span className="normal-case text-charcoal/30 font-normal">(optional)</span></label>
                                    <Input value={depositRef} onChange={(e) => setDepositRef(e.target.value)} placeholder="e.g., TxID or bank reference #" className="h-11 bg-gray-50 border-gray-200" />
                                </div>

                                <div className="text-[10px] text-charcoal/40 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Deposit requests require <strong>admin approval</strong>.</li>
                                        <li>Your funds will be credited once the transfer is confirmed.</li>
                                        <li>Deposited funds become <strong>usable funds</strong> for investment or withdrawal.</li>
                                    </ul>
                                </div>

                                <Button type="submit" disabled={loadingDeposit} className="w-full h-12 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl font-medium">
                                    {loadingDeposit ? 'Submitting...' : 'Submit Deposit Request'}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* ── Saved Payment Methods ── */}
                    <div className="bg-white rounded-xl p-6 border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-semibold text-charcoal">Saved Methods</h3>
                            <button onClick={() => setIsAddMethodModalOpen(true)} className="text-xs font-semibold text-emerald-brand hover:text-emerald-dark bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">+ Add New</button>
                        </div>

                        {loadingMethods ? (
                            <p className="text-sm text-charcoal/40 animate-pulse">Loading methods...</p>
                        ) : paymentMethods.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-xs text-charcoal/50 mb-2">No payment methods saved.</p>
                                <button onClick={() => setIsAddMethodModalOpen(true)} className="text-xs font-medium text-emerald-brand hover:underline">Add your first method</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {paymentMethods.map(method => (
                                    <div key={method.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-charcoal">{method.provider}</p>
                                            <p className="text-[11px] text-charcoal/60 font-mono mt-0.5">{method.accountNumber}</p>
                                            <p className="text-[10px] text-charcoal/40 mt-1 uppercase tracking-wider">{method.accountName}</p>
                                        </div>
                                        <button onClick={() => handleDeleteMethod(method.id)} className="text-[10px] text-red-500 hover:text-red-700 font-semibold self-end sm:self-center">REMOVE</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="bg-white rounded-xl border border-border/50 overflow-hidden flex flex-col h-fit">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center">
                        <h3 className="font-display font-semibold text-charcoal">Transaction History</h3>
                        <span className="text-[10px] uppercase font-bold text-charcoal/40 bg-gray-100 px-2 py-1 rounded">Deposits & Withdrawals</span>
                    </div>

                    <div className="overflow-x-auto flex-1 p-6">
                        {loadingHistory ? (
                            <div className="flex justify-center items-center h-32">
                                <span className="text-sm text-charcoal/40 animate-pulse">Loading history...</span>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-charcoal/50 text-sm">No transactions yet.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-charcoal/50 border-b border-border/50">
                                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Date</th>
                                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Type</th>
                                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Amount</th>
                                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] hidden sm:table-cell">Details</th>
                                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="text-charcoal transition-colors hover:bg-gray-50/50">
                                            <td className="py-3 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="py-3">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={`py-3 font-bold text-sm ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-charcoal'}`}>
                                                {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3 text-charcoal/50 text-xs max-w-[180px] truncate hidden sm:table-cell" title={tx.description}>
                                                {tx.description}
                                            </td>
                                            <td className="py-3"><StatusBadge status={tx.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Method Modal */}
            {isAddMethodModalOpen && (
                <AddPaymentMethodModal
                    isOpen={isAddMethodModalOpen}
                    onClose={() => setIsAddMethodModalOpen(false)}
                    onAdded={() => { setIsAddMethodModalOpen(false); fetchData(); }}
                    user={user}
                />
            )}
        </div>
    );
}

function AddPaymentMethodModal({ isOpen, onClose, onAdded, user }) {
    const [type, setType] = useState('MOBILE');
    const [provider, setProvider] = useState('bKash');
    const [accountName, setAccountName] = useState(user?.name || '');
    const [accountNumber, setAccountNumber] = useState('');
    const [branchName, setBranchName] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.addPaymentMethod({
                type, provider, accountName, accountNumber,
                ...(type === 'BANK' && { branchName, routingNumber, swiftCode })
            });
            toast.success('Payment method saved!');
            onAdded();
        } catch (err) {
            toast.error(err.message || 'Failed to save');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="p-6 border-b border-border/50 flex justify-between items-center">
                    <h2 className="text-xl font-display font-bold text-charcoal">Add Payment Method</h2>
                    <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Category</label>
                            <select value={type} onChange={(e) => { setType(e.target.value); if (e.target.value === 'MOBILE') setProvider('bKash'); if (e.target.value === 'BANK') setProvider(''); if (e.target.value === 'CRYPTO') setProvider('USDT (TRC20)'); }} className="w-full h-11 px-3 rounded-lg bg-gray-50 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand font-medium text-sm">
                                <option value="MOBILE">Mobile Wallet</option>
                                <option value="BANK">Bank Account</option>
                                <option value="CRYPTO">Crypto</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Provider</label>
                            {type === 'MOBILE' ? (
                                <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-gray-50 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand font-medium text-sm">
                                    <option value="bKash">bKash</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Rocket">Rocket</option>
                                </select>
                            ) : type === 'CRYPTO' ? (
                                <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-gray-50 border-gray-200 focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand font-medium text-sm">
                                    <option value="USDT (TRC20)">USDT (TRC20)</option>
                                    <option value="USDT (ERC20)">USDT (ERC20)</option>
                                    <option value="BTC">Bitcoin</option>
                                </select>
                            ) : (
                                <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Bank Name" required className="h-11 bg-gray-50 border-gray-200" />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 flex justify-between">
                            Account Name
                            <span className="text-emerald-brand normal-case font-normal">*Must match profile</span>
                        </label>
                        <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Exact name on account" required className="h-11 bg-gray-50 border-gray-200" />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">
                            {type === 'MOBILE' ? 'Mobile Number' : type === 'BANK' ? 'Account Number' : 'Wallet Address'}
                        </label>
                        <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder={type === 'MOBILE' ? 'e.g., 017xxxxxxxx' : type === 'BANK' ? 'Bank Account Number' : 'Deposit address'} required className="h-11 bg-gray-50 border-gray-200 font-mono" />
                    </div>

                    {type === 'BANK' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/50 pt-4 mt-2">
                            <div>
                                <label className="text-[10px] font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Branch Name</label>
                                <Input value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="Branch" required className="h-11 bg-gray-50 border-gray-200 text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">Routing #</label>
                                <Input value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder="Optional" className="h-11 bg-gray-50 border-gray-200 text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-charcoal tracking-wider uppercase mb-1.5 block">SWIFT Code</label>
                                <Input value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} placeholder="Optional" className="h-11 bg-gray-50 border-gray-200 text-sm" />
                            </div>
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1 h-11">Cancel</Button>
                        <Button type="submit" disabled={loading} className="flex-1 h-11 bg-emerald-brand hover:bg-emerald-dark text-white">
                            {loading ? 'Saving...' : 'Save Method'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
