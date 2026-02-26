import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await api.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/signin');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password. The link might be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-charcoal mb-2">Invalid Link</h2>
                <p className="text-charcoal/60 mb-6">This password reset link is invalid or missing the token.</p>
                <Link to="/forgot-password">
                    <Button className="bg-emerald-brand hover:bg-emerald-dark text-white">Request New Link</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-brand/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-brand/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border/50 p-8 sm:p-10 relative z-10">
                <div className="mb-8">
                    <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Create New Password</h1>
                    <p className="text-charcoal/60 text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                {success ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-emerald-800 mb-1">Password Reset!</h3>
                        <p className="text-sm text-emerald-600">
                            Your password has been successfully reset. Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-charcoal tracking-wider uppercase">New Password</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 bg-gray-50 border-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-charcoal tracking-wider uppercase">Confirm New Password</label>
                            <Input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 bg-gray-50 border-gray-200"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-emerald-brand hover:bg-emerald-dark text-white text-base rounded-xl font-medium"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
