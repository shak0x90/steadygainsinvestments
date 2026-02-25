// Portfolio value over time (last 12 months)
export const portfolioHistory = [
    { month: 'Mar', value: 1000 },
    { month: 'Apr', value: 1045 },
    { month: 'May', value: 1120 },
    { month: 'Jun', value: 1085 },
    { month: 'Jul', value: 1200 },
    { month: 'Aug', value: 1350 },
    { month: 'Sep', value: 1410 },
    { month: 'Oct', value: 1520 },
    { month: 'Nov', value: 1680 },
    { month: 'Dec', value: 1750 },
    { month: 'Jan', value: 1890 },
    { month: 'Feb', value: 2050 },
];

// Asset allocation breakdown
export const assetAllocation = [
    { name: 'Tech & Innovation', value: 35, color: '#0a7c42' },
    { name: 'Real Estate', value: 25, color: '#10b864' },
    { name: 'Green Energy', value: 20, color: '#c8a44e' },
    { name: 'Fixed Income', value: 15, color: '#3a3a5c' },
    { name: 'Cash Reserve', value: 5, color: '#9ca3af' },
];

// Individual holdings
export const holdings = [
    { id: 1, name: 'Tech Growth Fund', amount: 875, roi: 24.5, status: 'active', change: '+3.2%' },
    { id: 2, name: 'Real Estate Trust', amount: 625, roi: 12.8, status: 'active', change: '+1.1%' },
    { id: 3, name: 'Green Energy ETF', amount: 500, roi: 18.3, status: 'active', change: '+2.7%' },
    { id: 4, name: 'Stable Bond Fund', amount: 375, roi: 6.2, status: 'active', change: '+0.4%' },
    { id: 5, name: 'Cash Reserve', amount: 125, roi: 2.1, status: 'active', change: '+0.1%' },
];

// Transaction history
export const transactions = [
    { id: 1, type: 'deposit', amount: 500, date: '2026-02-20', status: 'completed', description: 'Monthly investment' },
    { id: 2, type: 'return', amount: 45.50, date: '2026-02-15', status: 'completed', description: 'Quarterly dividend - Tech Growth Fund' },
    { id: 3, type: 'deposit', amount: 200, date: '2026-02-01', status: 'completed', description: 'Additional investment' },
    { id: 4, type: 'return', amount: 32.10, date: '2026-01-15', status: 'completed', description: 'Monthly return - Real Estate Trust' },
    { id: 5, type: 'withdrawal', amount: 100, date: '2026-01-10', status: 'completed', description: 'Partial withdrawal' },
    { id: 6, type: 'deposit', amount: 500, date: '2026-01-01', status: 'completed', description: 'Monthly investment' },
    { id: 7, type: 'return', amount: 28.80, date: '2025-12-15', status: 'completed', description: 'Quarterly dividend - Green Energy ETF' },
    { id: 8, type: 'deposit', amount: 300, date: '2025-12-01', status: 'completed', description: 'Bonus investment' },
    { id: 9, type: 'return', amount: 51.20, date: '2025-11-15', status: 'completed', description: 'Monthly return - Tech Growth Fund' },
    { id: 10, type: 'deposit', amount: 500, date: '2025-11-01', status: 'completed', description: 'Monthly investment' },
];

// Investment plans
export const investmentPlans = [
    {
        id: 'starter',
        name: 'Starter',
        minInvestment: 100,
        expectedRoi: '6-10%',
        duration: '6 months',
        risk: 'Low',
        description: 'Perfect for beginners. A safe, stable entry into the world of investing with consistent returns.',
        features: ['Low-risk bond & stable funds', 'Monthly returns', 'Withdraw anytime', 'No lock-in period'],
        popular: false,
        color: '#9ca3af',
    },
    {
        id: 'steady',
        name: 'Steady',
        minInvestment: 500,
        expectedRoi: '10-15%',
        duration: '12 months',
        risk: 'Medium',
        description: 'Our most popular plan. A balanced mix of growth and stability for the everyday investor.',
        features: ['Balanced portfolio mix', 'Quarterly dividends', 'Priority support', 'Reinvestment options'],
        popular: true,
        color: '#0a7c42',
    },
    {
        id: 'growth',
        name: 'Growth',
        minInvestment: 1000,
        expectedRoi: '15-22%',
        duration: '18 months',
        risk: 'Medium-High',
        description: 'For investors ready to accelerate. Higher growth potential with a diversified tech and real estate portfolio.',
        features: ['Growth-focused allocation', 'Monthly performance reports', 'Dedicated advisor', 'Early access to new funds'],
        popular: false,
        color: '#c8a44e',
    },
    {
        id: 'premium',
        name: 'Premium',
        minInvestment: 5000,
        expectedRoi: '20-30%',
        duration: '24 months',
        risk: 'High',
        description: 'Maximum growth potential. For experienced investors looking for aggressive returns.',
        features: ['Aggressive growth strategy', 'Weekly insights & reports', 'VIP support line', 'Custom portfolio options'],
        popular: false,
        color: '#1a1a2e',
    },
];

// Dashboard summary stats
export const dashboardStats = {
    totalInvested: 2500,
    currentValue: 3120,
    totalROI: 24.8,
    nextReturnDate: '2026-03-15',
    nextReturnEstimate: 48.50,
    monthlyGrowth: 3.2,
    activeInvestments: 5,
    lifetimeEarnings: 620,
};
