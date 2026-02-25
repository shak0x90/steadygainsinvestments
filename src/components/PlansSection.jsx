import { useScrollReveal } from '@/hooks/useScrollReveal';
import { investmentPlans } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PlansSection() {
    const [ref, isVisible] = useScrollReveal(0.1);

    return (
        <section id="plans" className="py-24 lg:py-32 bg-cream relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-brand/20 to-transparent" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-brand/5 rounded-full blur-3xl" />

            <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className={`text-center mb-16 animate-fade-up ${isVisible ? 'visible' : ''}`}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-emerald-brand" />
                        <span className="text-sm font-medium text-emerald-brand tracking-wider uppercase">Plans for Every Budget</span>
                        <div className="w-8 h-[2px] bg-emerald-brand" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-4">
                        Start with <span className="text-emerald-brand">$100</span>, grow at your pace
                    </h2>
                    <p className="text-charcoal/50 text-base max-w-xl mx-auto">
                        No matter your budget, we have a plan that fits. Pick one and start building your future today.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {investmentPlans.map((plan, i) => (
                        <div
                            key={plan.id}
                            className={`animate-fade-up stagger-${i + 1} ${isVisible ? 'visible' : ''} relative bg-white rounded-2xl border-2 p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${plan.popular
                                    ? 'border-emerald-brand shadow-lg shadow-emerald-brand/10'
                                    : 'border-border/50 hover:border-emerald-brand/30'
                                }`}
                        >
                            {/* Most Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-brand text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                                    ⭐ Most Popular
                                </div>
                            )}

                            {/* Plan color dot */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                                style={{ backgroundColor: plan.color + '12', color: plan.color }}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h3 className="font-display text-xl font-bold text-charcoal mb-1">{plan.name}</h3>

                            {/* Price highlight */}
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="font-display text-3xl font-bold text-charcoal">
                                    ${plan.minInvestment.toLocaleString()}
                                </span>
                                <span className="text-charcoal/40 text-sm">min</span>
                            </div>

                            <p className="text-charcoal/50 text-sm leading-relaxed mb-5">{plan.description}</p>

                            {/* Key stats */}
                            <div className="space-y-2.5 mb-6 bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal/50">Expected ROI</span>
                                    <span className="font-bold text-emerald-brand">{plan.expectedRoi}</span>
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
                            <ul className="space-y-2 mb-7">
                                {plan.features.map((f) => (
                                    <li key={f} className="text-sm text-charcoal/60 flex items-start gap-2">
                                        <svg className="w-4 h-4 text-emerald-brand shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                className={`w-full rounded-xl text-sm py-5 transition-all duration-300 ${plan.popular
                                        ? 'bg-emerald-brand hover:bg-emerald-dark text-white shadow-md shadow-emerald-brand/20 hover:-translate-y-0.5'
                                        : 'bg-charcoal hover:bg-charcoal-light text-white'
                                    }`}
                            >
                                <Link to="/signup">Get Started</Link>
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`mt-12 text-center animate-fade-up stagger-5 ${isVisible ? 'visible' : ''}`}>
                    <p className="text-charcoal/40 text-sm">
                        Not sure which plan is right for you?{' '}
                        <a href="#contact" className="text-emerald-brand font-medium hover:underline">Talk to our team</a>
                        {' '}— we&apos;ll help you choose.
                    </p>
                </div>
            </div>
        </section>
    );
}
