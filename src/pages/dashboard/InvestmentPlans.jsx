import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function InvestmentPlans() {
    const { user } = useAuth();
    const { t, formatCurrency } = useLanguage();
    const [subscribingTo, setSubscribingTo] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ amount: '', riskLevel: 'Medium' });
    const [activeTab, setActiveTab] = useState('available');
    const [cancelling, setCancelling] = useState(false);
    const [usableFunds, setUsableFunds] = useState(0);

    useEffect(() => {
        Promise.all([
            api.getPlans(),
            api.getPortfolioSummary()
        ]).then(([plansData, summary]) => {
            setPlans(plansData);
            setUsableFunds(summary.usableFunds || 0);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleOpenModal = (plan) => {
        setSelectedPlan(plan);
        const existingPlan = user?.userPlans?.find(up => up.plan?.id === plan.id);

        if (existingPlan) {
            setForm({ amount: existingPlan.amount, riskLevel: existingPlan.riskLevel });
        } else {
            setForm({ amount: plan.minInvestment, riskLevel: 'Medium' });
        }
    };

    const handleCancelModification = async (planId) => {
        setCancelling(true);
        try {
            await api.cancelPlanModification(planId);
            toast.success("Modification request cancelled successfully.");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            toast.error(err.message || "Failed to cancel request.");
            setCancelling(false);
        }
    };

    const handleSubscribeConfirm = async () => {
        if (!form.amount || form.amount < selectedPlan.minInvestment) {
            return toast.error(`Minimum investment is $${selectedPlan.minInvestment}`);
        }

        const isModifying = user?.userPlans?.some(up => up.plan?.id === selectedPlan.id);

        setSubscribingTo(true);
        try {
            if (isModifying) {
                await api.modifyPlan(selectedPlan.id, {
                    amount: parseFloat(form.amount),
                    riskLevel: form.riskLevel
                });
                toast.success(`Successfully submitted modification for the ${selectedPlan.name} plan!`);
            } else {
                await api.subscribePlan({
                    planName: selectedPlan.name,
                    amount: parseFloat(form.amount),
                    riskLevel: form.riskLevel
                });
                toast.success(`Successfully subscribed for $${form.amount} at ${form.riskLevel} risk!`);
            }

            setSelectedPlan(null);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            toast.error(err.message || 'Failed to process request');
            setSubscribingTo(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">{t('investPlans.title')}</h1>
                <p className="text-charcoal/50 text-sm mt-1">{t('investPlans.subtitle')}</p>
            </div>

            <div className="flex border-b border-border/60">
                <button
                    onClick={() => setActiveTab('available')}
                    className={`pb-4 px-1 mr-8 font-medium text-sm transition-colors relative ${activeTab === 'available' ? 'text-emerald-brand' : 'text-charcoal/50 hover:text-charcoal/80'}`}
                >
                    {t('investPlans.availablePlans')}
                    {activeTab === 'available' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-brand rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'active' ? 'text-emerald-brand' : 'text-charcoal/50 hover:text-charcoal/80'}`}
                >
                    {t('investPlans.myActivePlans')}
                    <span className="ml-2 bg-charcoal/5 text-charcoal/60 px-2 py-0.5 rounded-full text-xs font-bold">{user?.userPlans?.length || 0}</span>
                    {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-brand rounded-t-full" />}
                </button>
            </div>

            {activeTab === 'available' && (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {plans.map((plan) => {
                        const isActive = user?.userPlans?.some(up => up.plan?.id === plan.id) || false;
                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${isActive ? 'border-emerald-brand shadow-md' : plan.popular ? 'border-emerald-brand/30' : 'border-border/50'
                                    }`}
                            >
                                {/* Badges */}
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-brand text-white text-xs font-bold px-3 py-0.5 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                {isActive && (
                                    <div className="absolute -top-3 right-4 bg-charcoal text-white text-xs font-bold px-3 py-0.5 rounded-full">
                                        Active Plan
                                    </div>
                                )}

                                {/* Plan color indicator */}
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: plan.color + '15', color: plan.color }}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <h3 className="font-display text-xl font-bold text-charcoal mb-1">{plan.name}</h3>
                                <p className="text-charcoal/50 text-xs mb-4 leading-relaxed">{plan.description}</p>

                                {/* Stats */}
                                <div className="space-y-2 mb-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-charcoal/50">Min. Investment</span>
                                        <span className="font-semibold text-charcoal">{formatCurrency(plan.minInvestment)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-charcoal/50">Duration</span>
                                        <span className="font-semibold text-charcoal">{plan.duration}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-5">
                                    <div className="bg-gray-50 border border-gray-100 rounded text-center py-1">
                                        <p className="text-[10px] text-charcoal/40 uppercase font-semibold">Low Risk</p>
                                        <p className="text-xs font-bold text-blue-600">{plan.roiLow}</p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 rounded text-center py-1">
                                        <p className="text-[10px] text-charcoal/40 uppercase font-semibold">Med Risk</p>
                                        <p className="text-xs font-bold text-amber-600">{plan.roiMedium}</p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 rounded text-center py-1">
                                        <p className="text-[10px] text-charcoal/40 uppercase font-semibold">High Risk</p>
                                        <p className="text-xs font-bold text-red-600">{plan.roiHigh}</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-1.5 mb-6">
                                    {plan.features.map((f) => (
                                        <li key={f} className="text-xs text-charcoal/60 flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-emerald-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handleOpenModal(plan)}
                                    className={`w-full rounded-lg text-sm bg-emerald-brand hover:bg-emerald-dark text-white`}
                                >
                                    {isActive ? 'Modify Plan' : 'Subscribe'}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'active' && (
                <div className="space-y-4">
                    {user?.userPlans?.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-border p-12 text-center">
                            <h3 className="text-lg font-bold text-charcoal mb-2">No Active Plans</h3>
                            <p className="text-charcoal/50 text-sm mb-6 max-w-sm mx-auto">You aren't subscribed to any investment plans yet. Browse our available plans to start growing your wealth.</p>
                            <Button onClick={() => setActiveTab('available')} className="bg-emerald-brand hover:bg-emerald-dark text-white">
                                View Available Plans
                            </Button>
                        </div>
                    ) : (
                        user?.userPlans?.map((userPlan) => {
                            const isPending = userPlan.pendingAmount || userPlan.pendingRiskLevel;
                            const plan = userPlan.plan;

                            return (
                                <div key={userPlan.id} className="bg-white rounded-xl border border-border/50 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                                    <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center border border-gray-100" style={{ backgroundColor: plan.color + '10', color: plan.color }}>
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-display text-xl font-bold text-charcoal">{plan.name}</h3>
                                                <p className="text-charcoal/50 text-sm mt-0.5">Subscribed since {new Date(userPlan.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenModal(plan)}
                                                className="border-emerald-brand/30 text-emerald-brand hover:bg-emerald-50"
                                                disabled={isPending}
                                            >
                                                {isPending ? 'Modification Pending' : 'Modify Plan'}
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                                            <div>
                                                <p className="text-xs text-charcoal/40 uppercase font-semibold mb-1">Current Investment</p>
                                                <p className="text-lg font-bold text-charcoal">${userPlan.amount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-charcoal/40 uppercase font-semibold mb-1">Risk Strategy</p>
                                                <p className="text-lg font-bold text-charcoal">{userPlan.riskLevel} Risk</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-charcoal/40 uppercase font-semibold mb-1">Target ROI</p>
                                                <p className="text-lg font-bold text-emerald-brand">
                                                    {userPlan.riskLevel === 'Low' ? plan.roiLow : userPlan.riskLevel === 'Medium' ? plan.roiMedium : plan.roiHigh}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-charcoal/40 uppercase font-semibold mb-1">Duration</p>
                                                <p className="text-lg font-bold text-charcoal">{plan.duration}</p>
                                            </div>
                                        </div>

                                        {isPending && (
                                            <div className="mt-6 bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-800">Update Processing</p>
                                                        <p className="text-xs font-medium text-amber-700/80 mt-0.5">
                                                            Pending change to <span className="font-bold">${userPlan.pendingAmount?.toLocaleString()}</span> at <span className="font-bold">{userPlan.pendingRiskLevel} Risk</span>.
                                                            Takes effect next billing cycle.
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCancelModification(plan.id)}
                                                    disabled={cancelling}
                                                    className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 h-9 shrink-0"
                                                >
                                                    {cancelling ? 'Cancelling...' : 'Cancel Request'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Custom Subscription Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlan(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedPlan.color + '15', color: selectedPlan.color }}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h2 className="font-display text-xl font-bold text-charcoal">{selectedPlan.name} Plan</h2>
                                <p className="text-xs text-charcoal/50">
                                    {user?.userPlans?.some(up => up.plan?.id === selectedPlan.id) ? t('investPlans.modifyActive') : t('investPlans.configureNew')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 my-6">
                            <div>
                                <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider font-semibold">{t('investPlans.investmentAmount')}</label>
                                <Input
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    min={selectedPlan.minInvestment}
                                    placeholder={`Min: $${selectedPlan.minInvestment}`}
                                    className="text-lg font-medium"
                                />
                                <p className="text-xs text-emerald-brand mt-1 flex justify-between">
                                    <span>{t('investPlans.minimum')}: {formatCurrency(selectedPlan.minInvestment)}</span>
                                    <span>{t('investPlans.recommended')}: {formatCurrency(selectedPlan.minInvestment * 2)}</span>
                                </p>
                            </div>

                            {/* Usable Funds Indicator */}
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${parseFloat(form.amount || 0) > usableFunds ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal/50">{t('investPlans.usableFunds')}</p>
                                    <p className={`text-lg font-bold ${parseFloat(form.amount || 0) > usableFunds ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(usableFunds)}</p>
                                </div>
                                {parseFloat(form.amount || 0) > usableFunds && (
                                    <div className="text-right">
                                        <p className="text-[10px] text-red-500 font-semibold">{t('investPlans.insufficientFunds')}</p>
                                        <p className="text-[9px] text-red-400">{t('investPlans.needMore')} {formatCurrency(parseFloat(form.amount || 0) - usableFunds)}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider font-semibold">{t('investPlans.riskStrategy')}</label>
                                <select
                                    value={form.riskLevel}
                                    onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}
                                    className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white font-medium text-charcoal focus:ring-2 focus:ring-emerald-brand"
                                >
                                    <option value="Low">Low Risk — Steady & Reliable ({selectedPlan.roiLow})</option>
                                    <option value="Medium">Medium Risk — Balanced Growth ({selectedPlan.roiMedium})</option>
                                    <option value="High">High Risk — Aggressive Growth ({selectedPlan.roiHigh})</option>
                                </select>
                            </div>
                        </div>

                        {user?.userPlans?.some(up => up.plan?.id === selectedPlan.id) && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mt-4 font-medium flex items-start gap-2">
                                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Modifications take effect upon <strong className="font-bold border-b border-amber-700">Admin approval</strong> or your next active billing cycle.</span>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setSelectedPlan(null)} disabled={subscribingTo}>Cancel</Button>
                            <Button
                                onClick={handleSubscribeConfirm}
                                className="bg-emerald-brand hover:bg-emerald-dark text-white shadow-lg"
                                disabled={subscribingTo || parseFloat(form.amount || 0) > usableFunds}
                            >
                                {subscribingTo ? 'Processing...' : user?.userPlans?.some(up => up.plan?.id === selectedPlan.id) ? 'Submit Change Request' : 'Confirm Subscription'}
                            </Button>
                        </div>
                        {parseFloat(form.amount || 0) > usableFunds && (
                            <p className="text-center text-xs text-red-500 mt-3 font-medium">You need to deposit more funds before subscribing. <a href="/dashboard/withdraw" className="underline font-bold">Go to Deposit</a></p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
