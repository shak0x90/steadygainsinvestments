import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userData = await login(email, password);
            navigate(userData.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left brand panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-charcoal relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-brand/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold-brand/10 rounded-full blur-2xl" />

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 relative z-10">
                    <div className="w-9 h-9 rounded-lg bg-emerald-brand flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-5 h-5">
                            <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="white" opacity="0.3" />
                            <path d="M30 65 L45 45 L55 55 L70 35" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M60 35 L70 35 L70 45" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-display font-bold text-base tracking-tight text-white">STEADY GAINS</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/40">Investments</span>
                    </div>
                </Link>

                {/* Feature text */}
                <div className="relative z-10">
                    <h2 className="font-display text-3xl font-bold text-white leading-tight mb-4">
                        Your money, growing<br />while you sleep.
                    </h2>
                    <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                        Join 50,000+ investors who are building their future with as little as $100. Track your returns, manage your portfolio, all in one place.
                    </p>

                    <div className="mt-8 flex gap-6">
                        {[
                            { value: '18.2%', label: 'Avg. Return' },
                            { value: '$100', label: 'Min. Start' },
                            { value: '50K+', label: 'Investors' },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="font-display font-bold text-white text-lg">{s.value}</p>
                                <p className="text-white/40 text-xs">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/20 text-xs relative z-10">
                    © {new Date().getFullYear()} Steady Gains Investments
                </p>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-cream">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
                        <div className="w-9 h-9 rounded-lg bg-emerald-brand flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-5 h-5">
                                <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="white" opacity="0.3" />
                                <path d="M30 65 L45 45 L55 55 L70 35" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M60 35 L70 35 L70 45" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-display font-bold text-base tracking-tight text-charcoal">STEADY GAINS</span>
                    </Link>

                    <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Welcome back</h1>
                    <p className="text-charcoal/50 text-sm mb-8">Sign in to your investor dashboard</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border-border/50 focus:border-emerald-brand rounded-lg"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white border-border/50 focus:border-emerald-brand rounded-lg"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-brand hover:bg-emerald-dark text-white rounded-lg shadow-lg shadow-emerald-brand/20 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </Button>
                    </form>

                    {/* Demo credentials hint */}
                    <div className="mt-6 p-3 bg-emerald-brand/5 border border-emerald-brand/20 rounded-lg">
                        <p className="text-xs text-emerald-brand font-medium mb-1">Demo Credentials</p>
                        <p className="text-xs text-charcoal/50">User: <span className="font-mono text-charcoal/70">demo@steadygains.com</span> / <span className="font-mono text-charcoal/70">demo123</span></p>
                        <p className="text-xs text-charcoal/50">Admin: <span className="font-mono text-charcoal/70">admin@steadygains.com</span> / <span className="font-mono text-charcoal/70">admin123</span></p>
                    </div>

                    <p className="mt-8 text-center text-sm text-charcoal/50">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-emerald-brand font-medium hover:underline">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
