import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const FOOTER_LINKS = [
    {
        title: 'Company',
        links: [
            { label: 'About', href: '#about' },
            { label: 'How It Works', href: '#proposition' },
            { label: 'Track Record', href: '#track-record' },
            { label: 'Team', href: '#team' },
            { label: 'News', href: '#news' },
        ],
    },
    {
        title: 'Contact',
        links: [
            { label: 'Email: hello@steadygains.com', href: 'mailto:hello@steadygains.com' },
            { label: 'Phone: (555) 123-4567', href: 'tel:+15551234567' },
            { label: 'New York, NY 10001', href: '#' },
        ],
    },
];

export default function ContactFooter() {
    const [ref, isVisible] = useScrollReveal(0.1);
    const [formData, setFormData] = useState({
        name: '', company: '', phone: '', email: '', comments: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                    <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-12">
                        {/* Logo & description */}
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-brand flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                                        <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="white" opacity="0.3" />
                                        <path d="M30 65 L45 45 L55 55 L70 35" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M60 35 L70 35 L70 45" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
                                            <a
                                                href={link.href}
                                                className="text-white/40 text-sm hover:text-emerald-light transition-colors duration-300"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-white/30 text-xs">
                            © {new Date().getFullYear()} Steady Gains Investments. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            {['LinkedIn', 'Twitter', 'Email'].map((s) => (
                                <a key={s} href="#" className="text-white/30 text-xs hover:text-emerald-light transition-colors">
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
