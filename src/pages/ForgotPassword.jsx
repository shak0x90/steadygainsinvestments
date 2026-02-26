import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');

        try {
            await api.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to request password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-brand/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-brand/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border/50 p-8 sm:p-10 relative z-10">
                <Link to="/" className="inline-block mb-10">
                    <svg width="40" height="40" viewBox="0 0 500 500">
                        <defs>
                            <linearGradient id="lightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00e5ff" />
                                <stop offset="100%" stop-color="#00838f" />
                            </linearGradient>
                            <linearGradient id="midBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00b4d8" />
                                <stop offset="100%" stop-color="#0077b6" />
                            </linearGradient>
                            <linearGradient id="darkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#2a437c" />
                                <stop offset="100%" stop-color="#152445" />
                            </linearGradient>
                        </defs>
                        <path d="M 150 250 L 250 310 L 250 110 L 150 170 Z" fill="url(#darkBlue)" />
                        <path d="M 350 260 L 250 320 L 250 110 L 310 170 Z" fill="url(#midBlue)" />
                        <path d="M 250 320 L 160 265 L 250 60 L 340 265 Z" fill="url(#midBlue)" opacity="0.8" />
                        <path d="M 250 320 L 200 290 L 270 230 L 320 260 Z" fill="url(#lightBlue)" />
                    </svg>
                </Link>

                <div className="mb-8">
                    <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Reset Password</h1>
                    <p className="text-charcoal/60 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {success ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-emerald-800 mb-1">Check your email</h3>
                        <p className="text-sm text-emerald-600">
                            If an account exists for {email}, we have sent a password reset link.
                        </p>
                        <Link to="/signin" className="block mt-6 text-emerald-brand font-medium hover:underline text-sm">
                            Return to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-charcoal tracking-wider uppercase">Email Address</label>
                            <Input
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-gray-50 border-gray-200"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-emerald-brand hover:bg-emerald-dark text-white text-base rounded-xl font-medium"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        <div className="text-center pt-2">
                            <Link to="/signin" className="text-sm text-charcoal/50 hover:text-emerald-brand transition-colors">
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
