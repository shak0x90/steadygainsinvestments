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
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 500 500" className="w-10 h-10">
                                <defs>
                                    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#1b253d" />
                                        <stop offset="100%" stopColor="#12192b" />
                                    </linearGradient>
                                    <linearGradient id="greenArrow2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8bc34a" />
                                        <stop offset="100%" stopColor="#689f38" />
                                    </linearGradient>
                                    <linearGradient id="lightBlue2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00e5ff" />
                                        <stop offset="100%" stopColor="#00838f" />
                                    </linearGradient>
                                    <linearGradient id="midBlue2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00b4d8" />
                                        <stop offset="100%" stopColor="#0077b6" />
                                    </linearGradient>
                                    <linearGradient id="darkBlue2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2a437c" />
                                        <stop offset="100%" stopColor="#152238" />
                                    </linearGradient>
                                </defs>
                                <circle cx="250" cy="250" r="230" fill="url(#bgGrad2)" />
                                <path d="M 250 80 L 350 140 L 320 140 L 320 170 L 250 135 L 180 170 L 180 140 L 150 140 Z" fill="url(#greenArrow2)" />
                                <text x="250" y="132" fontFamily="Arial, Helvetica, sans-serif" fontSize="36" fontWeight="bold" fill="#ffffff" textAnchor="middle">$</text>
                                <path d="M 150 170 L 150 250 L 250 310 L 250 240 L 190 200 Z" fill="url(#darkBlue2)" />
                                <path d="M 350 170 L 350 260 L 250 320 L 250 260 L 310 220 Z" fill="url(#midBlue2)" />
                                <path d="M 160 205 C 190 180, 220 170, 250 190 C 280 210, 310 200, 340 180 L 300 225 C 270 250, 240 250, 200 225 Z" fill="url(#lightBlue2)" />
                                <path d="M 250 320 L 160 265 L 250 200 L 340 265 Z" fill="url(#midBlue2)" opacity="0.8" />
                                <path d="M 250 320 L 200 290 L 270 230 L 320 260 Z" fill="url(#lightBlue2)" />
                                <path d="M 280 300 L 240 275 L 290 235 L 330 260 Z" fill="#00e5ff" opacity="0.5" />
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
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-semibold text-charcoal tracking-wider uppercase">Password</label>
                                <Link to="/forgot-password" className="text-xs font-medium text-emerald-brand hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
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
