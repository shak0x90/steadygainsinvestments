import { useScrollReveal } from '@/hooks/useScrollReveal';

const NEWS_ITEMS = [
    {
        category: 'News',
        date: 'February 2026',
        title: 'Steady Gains Investments announces strategic partnership with global renewable energy leader',
        excerpt: 'The partnership will accelerate investment into next-generation clean energy infrastructure across North America and Europe.',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&q=80',
        featured: true,
    },
    {
        category: 'Investment Strategies',
        date: 'January 2026',
        title: 'Q4 2025 Market Outlook: Navigating growth in emerging tech sectors',
        excerpt: 'Our latest analysis highlights opportunities in AI infrastructure and sustainable technology.',
        image: null,
        featured: false,
    },
    {
        category: 'Events',
        date: 'December 2025',
        title: 'Annual Investor Summit 2025 recap and key takeaways',
        excerpt: 'A roundup of insights shared at our flagship event attended by 200+ institutional investors.',
        image: null,
        featured: false,
    },
];

const TABS = ['News', 'Investment Strategies', 'Events', 'Technology and Innovation'];

export default function News() {
    const [ref, isVisible] = useScrollReveal(0.1);

    const featured = NEWS_ITEMS.find((n) => n.featured);
    const others = NEWS_ITEMS.filter((n) => !n.featured);

    return (
        <section id="news" className="py-24 lg:py-32 bg-cream relative overflow-hidden">
            <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-start justify-between mb-12 flex-wrap gap-6">
                    <div className={`animate-fade-up ${isVisible ? 'visible' : ''} max-w-full`}>
                        <p className="text-xs text-emerald-brand tracking-wider uppercase font-medium mb-2">Category of News</p>
                        <div className="flex gap-6 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
                            {TABS.map((tab, i) => (
                                <button
                                    key={tab}
                                    className={`text-sm pb-1 transition-colors duration-300 ${i === 0
                                        ? 'text-charcoal font-semibold border-b-2 border-charcoal'
                                        : 'text-charcoal/40 hover:text-charcoal/70'
                                        } whitespace-nowrap`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`animate-fade-up stagger-1 ${isVisible ? 'visible' : ''}`}>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">Stay Informed</h2>
                        <a href="#" className="text-sm text-emerald-brand hover:underline flex items-center gap-1 mt-2">
                            More news
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Featured article */}
                    {featured && (
                        <div className={`animate-fade-up stagger-2 ${isVisible ? 'visible' : ''}`}>
                            <h3 className="font-display text-xl font-semibold text-charcoal mb-3 leading-snug hover:text-emerald-brand transition-colors cursor-pointer">
                                {featured.title}
                            </h3>
                            <p className="text-sm text-charcoal/50 mb-4 leading-relaxed">{featured.excerpt}</p>
                            <p className="text-xs text-charcoal/40 mb-6">{featured.date}</p>
                            <a href="#" className="text-sm text-emerald-brand font-medium flex items-center gap-2 hover:gap-3 transition-all">
                                Read more
                                <div className="w-6 h-[1.5px] bg-emerald-brand" />
                            </a>
                        </div>
                    )}

                    {/* Featured image */}
                    {featured?.image && (
                        <div className={`animate-fade-up stagger-3 ${isVisible ? 'visible' : ''}`}>
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="w-full h-48 sm:h-72 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            />
                        </div>
                    )}
                </div>

                {/* Other articles */}
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    {others.map((item, i) => (
                        <div
                            key={item.title}
                            className={`animate-fade-up stagger-${i + 4} ${isVisible ? 'visible' : ''} group border-t border-border pt-6`}
                        >
                            <p className="text-xs text-emerald-brand/70 tracking-wider uppercase mb-2">{item.category}</p>
                            <h4 className="font-display font-semibold text-charcoal group-hover:text-emerald-brand transition-colors cursor-pointer mb-2">
                                {item.title}
                            </h4>
                            <p className="text-xs text-charcoal/40">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
