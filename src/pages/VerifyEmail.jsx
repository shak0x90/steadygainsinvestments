import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMsg('Invalid verification link. No token provided.');
            return;
        }

        api.verifyEmail(token)
            .then(() => {
                setStatus('success');
            })
            .catch((err) => {
                setStatus('error');
                setErrorMsg(err.message || 'Verification failed. The link might be expired or already used.');
            });
    }, [token]);

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-brand/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border/50 p-8 sm:p-12 relative z-10 flex flex-col items-center">

                {status === 'verifying' && (
                    <>
                        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-brand rounded-full animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-charcoal mb-2">Verifying Email...</h2>
                        <p className="text-charcoal/60">Please wait while we verify your account.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-charcoal mb-2">Email Verified!</h2>
                        <p className="text-charcoal/60 mb-8">Your account is now fully active. You can sign in to access your dashboard.</p>
                        <Link to="/signin" className="w-full">
                            <Button className="w-full h-12 bg-emerald-brand hover:bg-emerald-dark text-white rounded-xl">
                                Go to Sign In
                            </Button>
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-charcoal mb-2">Verification Failed</h2>
                        <p className="text-charcoal/60 mb-8">{errorMsg}</p>
                        <Link to="/signin" className="w-full">
                            <Button variant="outline" className="w-full h-12 border-charcoal/20 hover:bg-gray-50 rounded-xl text-charcoal">
                                Return to Sign In
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
