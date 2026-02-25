import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PROPOSITIONS = [
    {
        id: '01',
        title: 'Start Small, Grow Big',
        description: 'Begin your investment journey with just $100. No minimum balance requirements, no pressure — invest at your own pace and watch your money grow.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        id: '02',
        title: 'Expert-Managed Portfolios',
        description: 'Our team of experienced investment professionals manages your portfolio so you don\'t have to. Sit back while the experts work for your future.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
    {
        id: '03',
        title: 'Full Transparency, Always',
        description: 'Track every dollar in real-time through your personal dashboard. Know exactly where your money is, how it\'s performing, and when your next return hits.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        id: '04',
        title: 'Flexible Plans for Every Budget',
        description: 'Choose from multiple investment plans designed for different goals and timelines. Whether you\'re saving for a vacation or retirement, there\'s a plan for you.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function ValueProposition() {
    const [activeId, setActiveId] = useState('03');
    const [ref, isVisible] = useScrollReveal(0.1);

    return (
        <section id="proposition" className="py-24 lg:py-32 bg-charcoal relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-brand/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-gold-brand/5 rounded-full blur-2xl" />

            <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-start justify-between mb-16 flex-wrap gap-6">
                    <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-up ${isVisible ? 'visible' : ''}`}>
                        Why Investors Love Us
                    </h2>
                    <a
                        href="#about"
                        className={`text-sm text-white/50 hover:text-emerald-light flex items-center gap-2 transition-colors animate-fade-up stagger-1 ${isVisible ? 'visible' : ''}`}
                    >
                        Learn more
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </a>
                </div>

                <div className="space-y-0">
                    {PROPOSITIONS.map((item, i) => {
                        const isActive = activeId === item.id;
                        return (
                            <div
                                key={item.id}
                                className={`animate-fade-up stagger-${i + 1} ${isVisible ? 'visible' : ''}`}
                            >
                                <button
                                    onClick={() => setActiveId(isActive ? null : item.id)}
                                    className={`w-full text-left py-6 px-6 flex items-center gap-6 transition-all duration-500 rounded-lg cursor-pointer group ${isActive
                                            ? 'bg-emerald-brand text-white'
                                            : 'text-white/80 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className="flex-1 font-display font-semibold text-lg">
                                        {item.title}
                                    </span>
                                    <span className={`font-display text-sm font-bold ${isActive ? 'text-white' : 'text-white/30'}`}>
                                        {item.id}
                                    </span>
                                </button>

                                {/* Expandable content */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 pl-[4.5rem]">
                                        <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10 mx-6" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
