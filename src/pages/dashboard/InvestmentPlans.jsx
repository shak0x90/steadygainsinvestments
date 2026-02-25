import { useState } from 'react';
import { investmentPlans } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';

export default function InvestmentPlans() {
    const { user } = useAuth();
    const [subscribingTo, setSubscribingTo] = useState(null);

    const handleSubscribe = async (planName) => {
        setSubscribingTo(planName);
        try {
            await api.subscribePlan({ planName });
            window.location.reload(); // Refresh to pull updated user plans
        } catch (err) {
            alert(err.message || 'Failed to subscribe');
            setSubscribingTo(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">Investment Plans</h1>
                <p className="text-charcoal/50 text-sm mt-1">Choose the plan that fits your goals and budget</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                {investmentPlans.map((plan) => {
                    const isActive = user?.plans?.some(p => p.name?.toLowerCase() === plan.id) || false;
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
                                    <span className="font-semibold text-charcoal">${plan.minInvestment.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Expected ROI</span>
                                    <span className="font-semibold text-emerald-brand">{plan.expectedRoi}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Duration</span>
                                    <span className="font-semibold text-charcoal">{plan.duration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Risk Level</span>
                                    <span className={`font-semibold ${plan.risk === 'Low' ? 'text-blue-600' :
                                        plan.risk === 'Medium' ? 'text-amber-600' :
                                            plan.risk === 'Medium-High' ? 'text-orange-600' : 'text-red-600'
                                        }`}>{plan.risk}</span>
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
                                onClick={() => handleSubscribe(plan.name)}
                                className={`w-full rounded-lg text-sm ${isActive
                                    ? 'bg-emerald-50 text-emerald-brand border border-emerald-brand/30 hover:bg-emerald-100 cursor-default'
                                    : 'bg-emerald-brand hover:bg-emerald-dark text-white'
                                    }`}
                                disabled={isActive || subscribingTo === plan.name}
                            >
                                {subscribingTo === plan.name ? 'Subscribing...' : isActive ? 'Subscribed' : 'Subscribe'}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
