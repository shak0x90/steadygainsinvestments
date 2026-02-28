import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';

export default function Hero() {
    const [ref, isVisible] = useScrollReveal(0.1);
    const { t, formatCurrency } = useLanguage();
    const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80');

    useEffect(() => {
        api.getContentBySection('images').then((data) => {
            if (data?.hero_image) setHeroImage(data.hero_image);
        }).catch(() => { });
    }, []);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-cream" id="hero">
            {/* Background decorative elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-brand/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold-brand/5 rounded-full blur-3xl" />

            <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10 pt-24 sm:pt-28 pb-20 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <div className={`animate-fade-up ${isVisible ? 'visible' : ''}`}>
                        <p className="text-emerald-brand font-medium text-sm tracking-[0.15em] uppercase mb-6">
                            ── {t('hero.tagline')}
                        </p>

                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-charcoal mb-8">
                            {t('hero.title')}
                        </h1>

                        <p className="text-lg text-charcoal/60 leading-relaxed max-w-lg mb-10">
                            {t('hero.subtitle')}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full px-8 text-base shadow-lg shadow-emerald-brand/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-brand/30 hover:-translate-y-0.5"
                            >
                                <a href="#about">
                                    {t('hero.getStarted')}
                                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-charcoal/20 text-charcoal hover:border-emerald-brand hover:text-emerald-brand rounded-full px-8 text-base transition-all duration-300"
                            >
                                <a href="#track-record">{t('hero.viewPlans')}</a>
                            </Button>
                        </div>

                        {/* Mini stats */}
                        <div className={`mt-14 flex flex-wrap gap-6 sm:gap-10 animate-fade-up stagger-3 ${isVisible ? 'visible' : ''}`}>
                            {[
                                { value: '50K+', label: t('hero.activeInvestors') },
                                { value: formatCurrency(100), label: t('hero.totalInvested') },
                                { value: '95%', label: t('hero.avgReturn') },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="font-display text-2xl font-bold text-charcoal">{stat.value}</p>
                                    <p className="text-xs text-charcoal/50 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right image */}
                    <div className={`relative animate-fade-up stagger-2 ${isVisible ? 'visible' : ''}`}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-charcoal/10">
                            <img
                                src={heroImage.startsWith('/uploads') ? (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + heroImage : heroImage) : heroImage}
                                alt="Diverse group of people planning their financial future"
                                className="w-full h-64 sm:h-80 lg:h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
                        </div>
                        {/* Floating accent card */}
                        <div className="mt-4 sm:absolute sm:-bottom-6 sm:-left-6 bg-white rounded-xl p-5 shadow-xl border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-brand/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-charcoal/50">Avg. Annual Return</p>
                                    <p className="font-display font-bold text-emerald-brand text-lg">+18.2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-charcoal/40 tracking-wider">Scroll</span>
                <div className="w-5 h-8 border-2 border-charcoal/20 rounded-full flex justify-center pt-1.5">
                    <div className="w-1 h-2 bg-charcoal/30 rounded-full" />
                </div>
            </div>
        </section>
    );
}
