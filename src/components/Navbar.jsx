import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#proposition' },
    { label: 'Plans', href: '#plans' },
    { label: 'Track Record', href: '#track-record' },
    { label: 'Team', href: '#team' },
    { label: 'News', href: '#news' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();

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
                    <div className="w-9 h-9 rounded-lg bg-emerald-brand flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 100 100" className="w-5 h-5">
                            <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="white" opacity="0.3" />
                            <path d="M30 65 L45 45 L55 55 L70 35" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M60 35 L70 35 L70 45" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-charcoal/70 hover:text-emerald-brand transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-brand after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA - conditional on auth state */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <Button
                            asChild
                            className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full px-6"
                        >
                            <Link to="/dashboard">My Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-charcoal/70 hover:text-emerald-brand rounded-full px-5"
                            >
                                <Link to="/signin">Sign In</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full px-6"
                            >
                                <Link to="/signup">Get Started</Link>
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
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-base font-medium text-charcoal/80 hover:text-emerald-brand py-2 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    {user ? (
                        <Button
                            asChild
                            className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full mt-2"
                        >
                            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>My Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="outline"
                                className="border-charcoal/20 text-charcoal rounded-full mt-2"
                            >
                                <Link to="/signin" onClick={() => setMobileOpen(false)}>Sign In</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full"
                            >
                                <Link to="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
