/**
 * Steady Gains — DB Cleanup Script
 * Wipes ALL user data in the correct FK order.
 * Safe to run before launch when no real users exist.
 * 
 * Run with: node src/cleanup.js
 */

import 'dotenv/config';
import prisma from './config/db.js';

async function cleanup() {
    console.log('🧹 Starting database cleanup...');
    console.log(`🔗 DB: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'connected'}\n`);

    // Must delete in FK dependency order (children before parents)
    const [tickets] = await Promise.all([
        prisma.ticket.deleteMany(),
    ]);
    console.log(`🎫 Deleted ${tickets.count} tickets`);

    const [invoices] = await Promise.all([
        prisma.invoice.deleteMany(),
    ]);
    console.log(`🧾 Deleted ${invoices.count} invoices`);

    const transactions = await prisma.transaction.deleteMany();
    console.log(`💳 Deleted ${transactions.count} transactions`);

    const userPlans = await prisma.userPlan.deleteMany();
    console.log(`📊 Deleted ${userPlans.count} user plans`);

    const paymentMethods = await prisma.paymentMethod.deleteMany();
    console.log(`💰 Deleted ${paymentMethods.count} payment methods`);

    const users = await prisma.user.deleteMany();
    console.log(`👤 Deleted ${users.count} users`);

    console.log('\n✅ Database is clean and ready for production!');
    await prisma.$disconnect();
}

cleanup().catch((err) => {
    console.error('❌ Cleanup failed:', err.message);
    prisma.$disconnect();
    process.exit(1);
});
