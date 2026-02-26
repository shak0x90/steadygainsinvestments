import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.transaction.deleteMany();
    await prisma.holding.deleteMany();
    await prisma.siteContent.deleteMany();
    await prisma.user.deleteMany();
    await prisma.plan.deleteMany();

    // Create plans
    const plans = await Promise.all([
        prisma.plan.create({
            data: {
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
        }),
        prisma.plan.create({
            data: {
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
        }),
        prisma.plan.create({
            data: {
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
        }),
        prisma.plan.create({
            data: {
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
        }),
    ]);

    console.log(`✅ Created ${plans.length} plans`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@steadygains.com',
            password: adminPassword,
            role: 'ADMIN',
            userPlans: {
                create: [
                    { planId: plans[1].id, amount: 5000, riskLevel: 'Medium' }
                ]
            },
            totalInvested: 10000,
            currentValue: 14500,
        },
    });

    // Create demo investor
    const demoPassword = await bcrypt.hash('demo123', 10);
    const demo = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'demo@steadygains.com',
            password: demoPassword,
            role: 'USER',
            userPlans: {
                create: [
                    { planId: plans[1].id, amount: 2500, riskLevel: 'Medium' }
                ]
            },
            totalInvested: 2500,
            currentValue: 3120,
        },
    });

    // Create a second demo user
    const user2Pass = await bcrypt.hash('user123', 10);
    const user2 = await prisma.user.create({
        data: {
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            password: user2Pass,
            role: 'USER',
            userPlans: {
                create: [
                    { planId: plans[0].id, amount: 500, riskLevel: 'Low' }
                ]
            },
            totalInvested: 500,
            currentValue: 545,
        },
    });

    console.log(`✅ Created 3 users (admin + 2 investors)`);

    // Create holdings for demo user
    await prisma.holding.createMany({
        data: [
            { userId: demo.id, name: 'Tech Growth Fund', amount: 875, roi: 24.5, change: '+3.2%' },
            { userId: demo.id, name: 'Real Estate Trust', amount: 625, roi: 12.8, change: '+1.1%' },
            { userId: demo.id, name: 'Green Energy ETF', amount: 500, roi: 18.3, change: '+2.7%' },
            { userId: demo.id, name: 'Stable Bond Fund', amount: 375, roi: 6.2, change: '+0.4%' },
            { userId: demo.id, name: 'Cash Reserve', amount: 125, roi: 2.1, change: '+0.1%' },
        ],
    });

    // Holdings for Sarah
    await prisma.holding.createMany({
        data: [
            { userId: user2.id, name: 'Stable Bond Fund', amount: 350, roi: 5.8, change: '+0.5%' },
            { userId: user2.id, name: 'Cash Reserve', amount: 195, roi: 3.2, change: '+0.2%' },
        ],
    });

    console.log('✅ Created holdings');

    // Create transactions for demo user
    await prisma.transaction.createMany({
        data: [
            { userId: demo.id, type: 'DEPOSIT', amount: 500, description: 'Monthly investment', status: 'COMPLETED', date: new Date('2026-02-20') },
            { userId: demo.id, type: 'RETURN', amount: 45.50, description: 'Quarterly dividend - Tech Growth Fund', status: 'COMPLETED', date: new Date('2026-02-15') },
            { userId: demo.id, type: 'DEPOSIT', amount: 200, description: 'Additional investment', status: 'COMPLETED', date: new Date('2026-02-01') },
            { userId: demo.id, type: 'RETURN', amount: 32.10, description: 'Monthly return - Real Estate Trust', status: 'COMPLETED', date: new Date('2026-01-15') },
            { userId: demo.id, type: 'WITHDRAWAL', amount: 100, description: 'Partial withdrawal', status: 'COMPLETED', date: new Date('2026-01-10') },
            { userId: demo.id, type: 'DEPOSIT', amount: 500, description: 'Monthly investment', status: 'COMPLETED', date: new Date('2026-01-01') },
            { userId: demo.id, type: 'RETURN', amount: 28.80, description: 'Quarterly dividend - Green Energy ETF', status: 'COMPLETED', date: new Date('2025-12-15') },
            { userId: demo.id, type: 'DEPOSIT', amount: 300, description: 'Bonus investment', status: 'COMPLETED', date: new Date('2025-12-01') },
            { userId: demo.id, type: 'RETURN', amount: 51.20, description: 'Monthly return - Tech Growth Fund', status: 'COMPLETED', date: new Date('2025-11-15') },
            { userId: demo.id, type: 'DEPOSIT', amount: 500, description: 'Monthly investment', status: 'COMPLETED', date: new Date('2025-11-01') },
            // Pending withdrawal for admin testing
            { userId: user2.id, type: 'WITHDRAWAL', amount: 50, description: 'Withdrawal request', status: 'PENDING', date: new Date('2026-02-24') },
            { userId: user2.id, type: 'DEPOSIT', amount: 500, description: 'Initial investment', status: 'COMPLETED', date: new Date('2025-10-01') },
        ],
    });

    console.log('✅ Created transactions');

    // Create site content
    await prisma.siteContent.createMany({
        data: [
            { key: 'hero_tagline', value: 'Investing made simple for everyone', section: 'hero' },
            { key: 'hero_title', value: 'Start With $100, Build Your Future.', section: 'hero' },
            { key: 'hero_subtitle', value: 'No huge savings needed. No confusing jargon. Just a simple, transparent way for everyday people to grow their money with steady, reliable returns.', section: 'hero' },
            { key: 'stat_investors', value: '50K+', section: 'stats' },
            { key: 'stat_min_investment', value: '$100', section: 'stats' },
            { key: 'stat_satisfaction', value: '95%', section: 'stats' },
            { key: 'about_title', value: "Investing shouldn't be only for the wealthy", section: 'about' },
            { key: 'about_text_1', value: "Steady Gains was built with one belief: everyone deserves a chance to grow their wealth. You don't need thousands to get started — just $100 and a willingness to take the first step.", section: 'about' },
            { key: 'about_text_2', value: 'We handle the complex stuff — market analysis, portfolio management, risk balancing — so you can focus on living your life while your money grows steadily in the background.', section: 'about' },
            { key: 'footer_tagline', value: 'Making investing accessible for everyone. Start with as little as $100 and grow your future.', section: 'footer' },
        ],
    });

    console.log('✅ Created site content');
    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Admin: admin@steadygains.com / admin123');
    console.log('   User:  demo@steadygains.com / demo123');
    console.log('   User:  sarah@example.com / user123');
}

seed()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
