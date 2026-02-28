import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
    { key: 'nav.about', href: '#about' },
    { key: 'nav.plans', href: '#plans' },
    { key: 'nav.contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const { locale, setLocale, t } = useLanguage();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-border/50'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-18">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 500 500" className="w-10 h-10">
                            <defs>
                                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#1b253d" />
                                    <stop offset="100%" stopColor="#12192b" />
                                </linearGradient>
                                <linearGradient id="greenArrow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8bc34a" />
                                    <stop offset="100%" stopColor="#689f38" />
                                </linearGradient>
                                <linearGradient id="lightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00e5ff" />
                                    <stop offset="100%" stopColor="#00838f" />
                                </linearGradient>
                                <linearGradient id="midBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00b4d8" />
                                    <stop offset="100%" stopColor="#0077b6" />
                                </linearGradient>
                                <linearGradient id="darkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2a437c" />
                                    <stop offset="100%" stopColor="#152238" />
                                </linearGradient>
                            </defs>
                            <circle cx="250" cy="250" r="230" fill="url(#bgGrad)" />
                            <path d="M 250 80 L 350 140 L 320 140 L 320 170 L 250 135 L 180 170 L 180 140 L 150 140 Z" fill="url(#greenArrow)" />
                            <text x="250" y="132" fontFamily="Arial, Helvetica, sans-serif" fontSize="36" fontWeight="bold" fill="#ffffff" textAnchor="middle">$</text>
                            <path d="M 150 170 L 150 250 L 250 310 L 250 240 L 190 200 Z" fill="url(#darkBlue)" />
                            <path d="M 350 170 L 350 260 L 250 320 L 250 260 L 310 220 Z" fill="url(#midBlue)" />
                            <path d="M 160 205 C 190 180, 220 170, 250 190 C 280 210, 310 200, 340 180 L 300 225 C 270 250, 240 250, 200 225 Z" fill="url(#lightBlue)" />
                            <path d="M 250 320 L 160 265 L 250 200 L 340 265 Z" fill="url(#midBlue)" opacity="0.8" />
                            <path d="M 250 320 L 200 290 L 270 230 L 320 260 Z" fill="url(#lightBlue)" />
                            <path d="M 280 300 L 240 275 L 290 235 L 330 260 Z" fill="#00e5ff" opacity="0.5" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-display font-bold text-base tracking-tight text-charcoal">STEADY GAINS</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-charcoal/50">Investments</span>
                    </div>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            className="text-sm font-medium text-charcoal/70 hover:text-emerald-brand transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-brand after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                </div>

                {/* CTA - conditional on auth state */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Language Toggle */}
                    <button
                        onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 hover:border-emerald-brand/30 bg-white/50 hover:bg-emerald-50 transition-all duration-300 text-xs font-semibold text-charcoal/70"
                        title={locale === 'en' ? 'বাংলায় দেখুন' : 'View in English'}
                    >
                        <span className="text-sm">{locale === 'en' ? '🇧🇩' : '🇺🇸'}</span>
                        {locale === 'en' ? 'বাংলা' : 'EN'}
                    </button>
                    {user ? (
                        <Button
                            asChild
                            className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full px-6"
                        >
                            <Link to="/dashboard">{t('nav.dashboard')}</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-charcoal/70 hover:text-emerald-brand rounded-full px-5"
                            >
                                <Link to="/signin">{t('nav.signIn')}</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full px-6"
                            >
                                <Link to="/signup">{t('nav.signUp')}</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-charcoal transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-charcoal transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-charcoal transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-500 bg-white/95 backdrop-blur-xl ${mobileOpen ? 'max-h-96 border-b border-border' : 'max-h-0'
                    }`}
            >
                <div className="px-6 py-4 flex flex-col gap-3">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-base font-medium text-charcoal/80 hover:text-emerald-brand py-2 transition-colors"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                    {user ? (
                        <Button
                            asChild
                            className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full mt-2"
                        >
                            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>{t('nav.dashboard')}</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="outline"
                                className="border-charcoal/20 text-charcoal rounded-full mt-2"
                            >
                                <Link to="/signin" onClick={() => setMobileOpen(false)}>{t('nav.signIn')}</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full"
                            >
                                <Link to="/signup" onClick={() => setMobileOpen(false)}>{t('nav.signUp')}</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
