import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import api from '@/utils/api';

export default function ContactFooter() {
    const [ref, isVisible] = useScrollReveal(0.1);
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '', company: '', phone: '', email: '', comments: '',
    });
    const [contactInfo, setContactInfo] = useState({
        email: 'hello@steadygains.com',
        phone: '(555) 123-4567',
        address: 'New York, NY 10001',
        linkedin: '#',
        twitter: '#',
    });

    useEffect(() => {
        api.getContentBySection('contact').then((data) => {
            if (data) {
                setContactInfo(prev => ({
                    email: data.contact_email || prev.email,
                    phone: data.contact_phone || prev.phone,
                    address: data.contact_address || prev.address,
                    linkedin: data.social_linkedin || prev.linkedin,
                    twitter: data.social_twitter || prev.twitter,
                }));
            }
        }).catch(() => { });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const FOOTER_LINKS = [
        {
            title: t('nav.about'),
            links: [
                { label: t('nav.about'), href: '#about' },
                { label: t('nav.plans'), href: '#plans' },
                { label: t('nav.contact'), href: '#contact' },
                { label: 'Terms & Conditions', href: '/terms' },
            ],
        },
        {
            title: t('contact.title'),
            links: [
                { label: `${t('contact.email')}: ${contactInfo.email}`, href: `mailto:${contactInfo.email}` },
                { label: `${t('contact.phone')}: ${contactInfo.phone}`, href: `tel:${contactInfo.phone.replace(/[^+\d]/g, '')}` },
                { label: contactInfo.address, href: '#' },
            ],
        },
    ];

    return (
        <>
            {/* Contact Section */}
            <section id="contact" className="py-24 lg:py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-brand/20 to-transparent" />

                <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Left text */}
                        <div className={`animate-fade-up ${isVisible ? 'visible' : ''}`}>
                            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-6">
                                Contact Us
                            </h2>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-[2px] bg-gold-brand" />
                                <svg className="w-5 h-5 text-gold-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            <p className="text-charcoal/55 leading-relaxed max-w-md">
                                Got questions about getting started? Curious which plan is right for you?
                                We&apos;re real people and we&apos;d love to hear from you — no question is too small.
                            </p>
                        </div>

                        {/* Right form */}
                        <div className={`animate-fade-up stagger-2 ${isVisible ? 'visible' : ''}`}>
                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Your name</label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-cream/50 border-border/50 focus:border-emerald-brand rounded-lg"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Company name</label>
                                        <Input
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="bg-cream/50 border-border/50 focus:border-emerald-brand rounded-lg"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Phone</label>
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="bg-cream/50 border-border/50 focus:border-emerald-brand rounded-lg"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">E-mail</label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-cream/50 border-border/50 focus:border-emerald-brand rounded-lg"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Message</label>
                                    <Textarea
                                        name="comments"
                                        value={formData.comments}
                                        onChange={handleChange}
                                        className="bg-cream/50 border-border/50 focus:border-emerald-brand rounded-lg min-h-[100px]"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-full px-8 shadow-lg shadow-emerald-brand/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Get in touch
                                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                        </svg>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-charcoal py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-12 lg:gap-24 mb-16">
                        {/* Brand column & Logo description */}
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
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
                                <div>
                                    <span className="font-display font-bold text-white text-sm tracking-tight">STEADY GAINS</span>
                                    <span className="block text-[9px] tracking-[0.2em] uppercase text-white/40">Investments</span>
                                </div>
                            </div>
                            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                                Making investing accessible for everyone. Start with as little as $100 and grow your future.
                            </p>
                        </div>

                        {/* Link columns */}
                        {FOOTER_LINKS.map((col) => (
                            <div key={col.title}>
                                <h4 className="text-white/70 font-medium text-sm mb-4">{col.title}</h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            {link.href.startsWith('/') ? (
                                                <a href={link.href} className="text-white/40 text-sm hover:text-emerald-light transition-colors duration-300">
                                                    {link.label}
                                                </a>
                                            ) : (
                                                <a href={link.href} className="text-white/40 text-sm hover:text-emerald-light transition-colors duration-300">
                                                    {link.label}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center sm:justify-between gap-4">
                        <p className="text-white/40 text-sm">
                            © {new Date().getFullYear()} Steady Gains Investments. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            {contactInfo.linkedin !== '#' && (
                                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs hover:text-emerald-light transition-colors">
                                    LinkedIn
                                </a>
                            )}
                            {contactInfo.twitter !== '#' && (
                                <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs hover:text-emerald-light transition-colors">
                                    Twitter
                                </a>
                            )}
                            <a href={`mailto:${contactInfo.email}`} className="text-white/30 text-xs hover:text-emerald-light transition-colors">
                                Email
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
