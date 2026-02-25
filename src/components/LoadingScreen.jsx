import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setFadeOut(true);
                    setTimeout(() => onComplete(), 600);
                    return 100;
                }
                return prev + Math.random() * 3 + 1;
            });
        }, 40);

        return () => clearInterval(interval);
    }, [onComplete]);

    const displayProgress = Math.min(Math.round(progress), 100);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cream transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Logo SVG - Upward trending chart icon */}
            <div className="relative mb-6 w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <clipPath id="logo-clip">
                            <rect x="0" y={100 - displayProgress} width="100" height={displayProgress} />
                        </clipPath>
                    </defs>
                    {/* Background (unfilled) */}
                    <g opacity="0.15">
                        {/* Shield shape */}
                        <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="#1a1a2e" />
                        {/* Upward arrow inside */}
                        <path d="M30 65 L45 45 L55 55 L70 35" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M60 35 L70 35 L70 45" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    {/* Filled version (clips based on progress) */}
                    <g clipPath="url(#logo-clip)">
                        <path d="M50 5 L90 20 L90 50 Q90 85 50 95 Q10 85 10 50 L10 20 Z" fill="#0a7c42" />
                        <path d="M30 65 L45 45 L55 55 L70 35" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M60 35 L70 35 L70 45" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>
            </div>

            {/* Percentage */}
            <span className="font-display text-2xl font-semibold text-charcoal tracking-wider">
                {displayProgress}%
            </span>

            {/* Brand name */}
            <p className="mt-4 font-display text-sm tracking-[0.3em] uppercase text-charcoal/50">
                Steady Gains
            </p>
        </div>
    );
}
