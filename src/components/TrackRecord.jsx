import { useScrollReveal } from '@/hooks/useScrollReveal';

const STATS = [
    {
        category: 'Our Community',
        items: [
            { value: '50K+', label: 'Happy Investors' },
            { value: '12+', label: 'Countries Served' },
        ],
    },
    {
        category: 'Performance',
        items: [
            { value: '18.2%', label: 'Avg. Annual Return' },
            { value: '95%', label: 'Positive Return Rate' },
        ],
    },
    {
        category: 'Payouts',
        items: [
            { value: '$120M+', label: 'Total Returns Paid Out' },
        ],
    },
];

export default function TrackRecord() {
    const [ref, isVisible] = useScrollReveal(0.1);

    return (
        <section id="track-record" className="py-24 lg:py-32 bg-charcoal-light relative overflow-hidden">
            <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
                <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-16 animate-fade-up ${isVisible ? 'visible' : ''}`}>
                    Our Track Record
                </h2>

                {/* Decorative graphic */}
                <div className={`mb-12 animate-fade-up stagger-1 ${isVisible ? 'visible' : ''}`}>
                    <svg className="w-24 h-24 text-emerald-brand/20" viewBox="0 0 100 100" fill="none">
                        <path d="M10 50 Q25 20 50 50 Q75 80 90 50" stroke="currentColor" strokeWidth="2" />
                        <path d="M10 60 Q25 30 50 60 Q75 90 90 60" stroke="currentColor" strokeWidth="2" />
                        <path d="M50 10 L50 90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                        <path d="M10 50 L90 50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    </svg>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden">
                    {STATS.map((group, gi) => (
                        <div key={group.category} className={`bg-charcoal-light p-8 lg:p-10 animate-fade-up stagger-${gi + 2} ${isVisible ? 'visible' : ''}`}>
                            <p className="text-xs text-white/40 tracking-wider uppercase mb-6 font-medium">
                                {group.category}
                            </p>
                            <div className="space-y-6">
                                {group.items.map((item) => (
                                    <div key={item.label} className="border-l-2 border-emerald-brand/40 pl-4">
                                        <p className="font-display text-3xl lg:text-4xl font-bold text-white">
                                            {item.value}
                                        </p>
                                        <p className="text-sm text-white/50 mt-1">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
