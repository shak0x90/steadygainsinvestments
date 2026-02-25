import { useScrollReveal } from '@/hooks/useScrollReveal';

const PRINCIPLES = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: 'Simple & Transparent',
        description: 'No hidden fees, no fine print. You always know where your money is and how it\'s growing.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
        ),
        title: 'Smart, Not Complicated',
        description: 'Our experts handle the heavy lifting. You get clear insights and easy-to-understand reports.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
            </svg>
        ),
        title: 'Built for the Long Run',
        description: 'Whether it\'s 6 months or 10 years, we help you build wealth at your own pace.',
    },
];

export default function About() {
    const [ref, isVisible] = useScrollReveal(0.1);
    const [ref2, isVisible2] = useScrollReveal(0.1);

    return (
        <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-brand/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Top section */}
                <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    {/* Left text */}
                    <div className={`animate-fade-up ${isVisible ? 'visible' : ''}`}>
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-6">
                            Investing shouldn&apos;t be{' '}
                            <span className="text-emerald-brand">only for the wealthy</span>
                        </h2>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-[2px] bg-emerald-brand" />
                            <div className="w-3 h-[2px] bg-emerald-brand/50" />
                            <span className="text-sm font-medium text-emerald-brand tracking-wider uppercase">About Us</span>
                        </div>

                        <p className="text-charcoal/60 leading-relaxed text-base mb-4">
                            Steady Gains was built with one belief: everyone deserves a chance to
                            grow their wealth. You don&apos;t need thousands to get started — just $100
                            and a willingness to take the first step.
                        </p>
                        <p className="text-charcoal/60 leading-relaxed text-base">
                            We handle the complex stuff — market analysis, portfolio management,
                            risk balancing — so you can focus on living your life while your money
                            grows steadily in the background.
                        </p>
                    </div>

                    {/* Right images */}
                    <div className={`relative animate-fade-up stagger-2 ${isVisible ? 'visible' : ''}`}>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80"
                                alt="People shaking hands, symbolizing partnership"
                                className="w-full h-80 object-cover rounded-xl shadow-lg"
                            />
                            {/* Overlapping smaller image */}
                            <img
                                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
                                alt="Savings growing over time"
                                className="absolute -bottom-8 -right-6 w-40 h-48 object-cover rounded-lg shadow-xl border-4 border-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Core Principles */}
                <div ref={ref2}>
                    <div className={`flex items-center gap-3 mb-8 animate-fade-up ${isVisible2 ? 'visible' : ''}`}>
                        <div className="w-8 h-[2px] bg-emerald-brand" />
                        <div className="w-3 h-[2px] bg-emerald-brand/50" />
                        <span className="text-sm font-medium text-emerald-brand tracking-wider uppercase">Why People Choose Us</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {PRINCIPLES.map((p, i) => (
                            <div
                                key={p.title}
                                className={`animate-fade-up stagger-${i + 1} ${isVisible2 ? 'visible' : ''} group p-8 rounded-xl border border-border/50 hover:border-emerald-brand/30 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-brand/5`}
                            >
                                <div className="w-12 h-12 rounded-lg bg-emerald-brand/10 text-emerald-brand flex items-center justify-center mb-5 group-hover:bg-emerald-brand group-hover:text-white transition-all duration-300">
                                    {p.icon}
                                </div>
                                <h3 className="font-display font-semibold text-lg text-charcoal mb-3">{p.title}</h3>
                                <p className="text-sm text-charcoal/55 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
