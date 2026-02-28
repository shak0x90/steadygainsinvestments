/**
 * Steady Gains — Production Setup Script
 * Creates admin user and investment plans only.
 * Safe to run on a clean database before launch.
 *
 * Run with: node src/setup-prod.js
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setup() {
    console.log('🚀 Setting up production data...\n');

    // ── Plans ───────────────────────────────────────────
    const existingPlans = await prisma.plan.count();
    if (existingPlans > 0) {
        console.log(`📋 ${existingPlans} plans already exist, skipping plan creation.`);
    } else {
        const plans = await Promise.all([
            prisma.plan.create({ data: { name: 'Starter', minInvestment: 100, roiLow: '4-6%', roiMedium: '6-8%', roiHigh: '8-10%', duration: '6 months', description: 'Perfect for beginners. A safe, stable entry into the world of investing with consistent returns.', features: ['Low-risk bond & stable funds', 'Monthly returns', 'Withdraw anytime', 'No lock-in period'], popular: false, color: '#9ca3af' } }),
            prisma.plan.create({ data: { name: 'Steady', minInvestment: 500, roiLow: '8-10%', roiMedium: '10-12%', roiHigh: '12-15%', duration: '12 months', description: 'Our most popular plan. A balanced mix of growth and stability for the everyday investor.', features: ['Balanced portfolio mix', 'Quarterly dividends', 'Priority support', 'Reinvestment options'], popular: true, color: '#0a7c42' } }),
            prisma.plan.create({ data: { name: 'Growth', minInvestment: 1000, roiLow: '12-15%', roiMedium: '15-18%', roiHigh: '18-22%', duration: '18 months', description: 'For investors ready to accelerate. Higher growth potential with a diversified portfolio.', features: ['Growth-focused allocation', 'Monthly performance reports', 'Dedicated advisor', 'Early access to new funds'], popular: false, color: '#c8a44e' } }),
            prisma.plan.create({ data: { name: 'Premium', minInvestment: 5000, roiLow: '18-22%', roiMedium: '22-26%', roiHigh: '26-30%', duration: '24 months', description: 'Maximum growth potential. For experienced investors looking for aggressive returns.', features: ['Aggressive growth strategy', 'Weekly insights & reports', 'VIP support line', 'Custom portfolio options'], popular: false, color: '#1a1a2e' } }),
        ]);
        console.log(`✅ Created ${plans.length} investment plans`);
    }

    // ── Admin ────────────────────────────────────────────
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@steadygains.com' } });
    if (existingAdmin) {
        console.log('👤 Admin already exists, skipping.');
    } else {
        const adminPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@steadygains.com',
                password: adminPassword,
                role: 'ADMIN',
                isEmailVerified: true,
                active: true,
            },
        });
        console.log('✅ Admin created:  admin@steadygains.com / admin123');
        console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    }

    console.log('\n🎉 Production setup complete!');
    await prisma.$disconnect();
}

setup().catch((err) => {
    console.error('❌ Setup failed:', err.message);
    prisma.$disconnect();
    process.exit(1);
});
