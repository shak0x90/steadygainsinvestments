import { useScrollReveal } from '@/hooks/useScrollReveal';

const TEAM_MEMBERS = [
    {
        name: 'Alexander Reed',
        title: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        bio: 'Started Steady Gains to make investing accessible for everyone.',
    },
    {
        name: 'Sophia Chen',
        title: 'Head of Investments',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        bio: '15 years making smart investment decisions for everyday people.',
    },
    {
        name: 'Marcus Johnson',
        title: 'Head of Customer Success',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        bio: 'Obsessed with making sure every investor feels supported.',
    },
    {
        name: 'Elena Vasquez',
        title: 'Head of Education',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        bio: 'Helps new investors understand their journey, step by step.',
    },
];

export default function Team() {
    const [ref, isVisible] = useScrollReveal(0.1);

    return (
        <section id="team" className="py-24 lg:py-32 bg-charcoal relative overflow-hidden">
            <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 items-start">
                    {/* Left text */}
                    <div className={`animate-fade-up ${isVisible ? 'visible' : ''} lg:sticky lg:top-32`}>
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                            The People Behind Your Growth
                        </h2>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-[2px] bg-gold-brand" />
                            <div className="w-3 h-[2px] bg-gold-brand/50" />
                        </div>

                        <p className="text-white/50 text-sm leading-relaxed">
                            Real people who care about your financial future.
                            Our team combines financial expertise with a genuine passion
                            for helping everyday investors succeed. We&apos;re here to make
                            sure your money works as hard as you do.
                        </p>
                    </div>

                    {/* Right grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {TEAM_MEMBERS.map((member, i) => (
                            <div
                                key={member.name}
                                className={`animate-fade-up stagger-${i + 1} ${isVisible ? 'visible' : ''} relative group rounded-xl overflow-hidden cursor-pointer`}
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-56 sm:h-72 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                {/* Hover info card */}
                                <div className="absolute inset-0 flex flex-col justify-end p-5">
                                    <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                        <p className="font-display font-bold text-lg text-white">{member.name}</p>
                                        <p className="text-emerald-light text-sm font-medium">{member.title}</p>
                                        <p className="text-white/50 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>

                                {/* Active indicator on first member */}
                                {i === 0 && (
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-emerald-brand/80 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 100 100">
                                            <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
