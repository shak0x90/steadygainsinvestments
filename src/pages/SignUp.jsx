import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!agreeTerms) {
            setError('You must read and agree to the Terms and Conditions to proceed.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await signup(name, email, password);
            setSuccessMsg(res.message || 'Registration successful. Please check your email to verify your account.');
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

                <div className="relative z-10">
                    <h2 className="font-display text-3xl font-bold text-white leading-tight mb-4">
                        Start your investing<br />journey today.
                    </h2>
                    <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                        It only takes a minute to create your account. Begin with $100 and watch your money grow with expert-managed portfolios.
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {[
                            { icon: '✓', text: 'Start with just $100' },
                            { icon: '✓', text: 'No hidden fees' },
                            { icon: '✓', text: 'Withdraw anytime' },
                            { icon: '✓', text: 'Expert management' },
                        ].map((f) => (
                            <div key={f.text} className="flex items-center gap-2">
                                <span className="text-emerald-light text-sm">{f.icon}</span>
                                <span className="text-white/60 text-xs">{f.text}</span>
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

                    <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Create your account</h1>
                    <p className="text-charcoal/50 text-sm mb-8">Start investing in under 2 minutes</p>

                    {successMsg ? (
                        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center shadow-lg shadow-emerald-brand/10">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-emerald-800 font-bold text-lg mb-2">Check your email</h3>
                            <p className="text-emerald-700 text-sm leading-relaxed mb-6">{successMsg}</p>
                            <Link to="/signin">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full shadow-md">
                                    Go to Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Full Name</label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-white border-border/50 focus:border-emerald-brand rounded-lg"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
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
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Confirm</label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="bg-white border-border/50 focus:border-emerald-brand rounded-lg"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-border/50 text-emerald-brand focus:ring-emerald-brand cursor-pointer"
                                    />
                                    <label htmlFor="terms" className="text-sm text-charcoal/60 leading-tight">
                                        I have completely read, understood, and agree to the Steady Gains{' '}
                                        <Link to="/terms" target="_blank" className="font-semibold text-emerald-brand hover:underline">
                                            Terms and Conditions
                                        </Link>.
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-brand hover:bg-emerald-dark text-white rounded-lg shadow-lg shadow-emerald-brand/20 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                            Creating account...
                                        </span>
                                    ) : 'Create Free Account'}
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-sm text-charcoal/50">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-emerald-brand font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
