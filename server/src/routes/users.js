import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all users (admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true, name: true, email: true, role: true,
                totalInvested: true, currentValue: true, active: true,
                createdAt: true, userPlans: { include: { plan: { select: { id: true, name: true } } } },
                _count: { select: { transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin stats — must be before /:id to avoid route conflict
router.get('/stats/overview', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [totalUsers, activeUsers, totalPlans] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { active: true } }),
            prisma.plan.count({ where: { active: true } }),
        ]);

        const users = await prisma.user.findMany({
            select: { totalInvested: true, currentValue: true },
        });

        const totalInvested = users.reduce((sum, u) => sum + u.totalInvested, 0);
        const totalValue = users.reduce((sum, u) => sum + u.currentValue, 0);

        const recentTransactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' },
            take: 10,
            include: { user: { select: { name: true, email: true } } },
        });

        res.json({
            totalUsers,
            activeUsers,
            totalPlans,
            totalInvested,
            totalValue,
            totalEarnings: totalValue - totalInvested,
            recentTransactions,
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single user with full details (admin)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true, name: true, email: true, role: true,
                totalInvested: true, currentValue: true, active: true,
                createdAt: true, userPlans: { include: { plan: true } }, holdings: true,
                transactions: { orderBy: { date: 'desc' } },
                invoices: { orderBy: { issuedAt: 'desc' } },
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, email, role, active, planIds, totalInvested, currentValue } = req.body;
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && { role }),
                ...(active !== undefined && { active }),
                ...(totalInvested !== undefined && { totalInvested: parseFloat(totalInvested) }),
                ...(currentValue !== undefined && { currentValue: parseFloat(currentValue) }),
            },
            select: {
                id: true, name: true, email: true, role: true,
                totalInvested: true, currentValue: true, active: true,
                userPlans: { include: { plan: { select: { id: true, name: true } } } },
            },
        });
        res.json(user);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PAY RETURN — Issue monthly ROI to a user
router.post('/:id/pay-return', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { roiPercentage, month, year, note, planName } = req.body;

        // Fetch user with plans
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { userPlans: { include: { plan: true } } },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const activeUserPlan = user.userPlans.find(up => up.plan.name === planName);
        if (!activeUserPlan) return res.status(400).json({ error: `User is not subscribed to ${planName} plan.` });

        // Calculate return amount against the exact plan investment
        const returnAmount = parseFloat(((activeUserPlan.amount * roiPercentage) / 100).toFixed(2));

        // Generate invoice number: INV-YYYY-MM-USERID-RANDOM
        const invoiceNumber = `INV-${year}-${String(month).padStart(2, '0')}-${userId}-${Date.now().toString(36).toUpperCase()}`;

        // Check if already paid this month
        const existing = await prisma.invoice.findFirst({
            where: { userId, month: String(month), year: parseInt(year) },
        });
        if (existing) {
            return res.status(400).json({ error: `Return already paid for ${month}/${year} (Invoice: ${existing.invoiceNumber})` });
        }

        // Create invoice + transaction + update user balance in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create invoice
            const invoice = await tx.invoice.create({
                data: {
                    invoiceNumber,
                    userId,
                    month: String(month),
                    year: parseInt(year),
                    planName: activeUserPlan.plan.name,
                    investedAmount: activeUserPlan.amount,
                    roiPercentage: parseFloat(roiPercentage),
                    returnAmount,
                    status: 'PAID',
                    note: note || null,
                },
            });

            // Create return transaction
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'RETURN',
                    amount: returnAmount,
                    description: `Monthly ROI (${roiPercentage}%) — ${month}/${year}`,
                    status: 'COMPLETED',
                    date: new Date(),
                    invoiceId: invoice.id,
                },
            });

            // Update user's currentValue
            await tx.user.update({
                where: { id: userId },
                data: { currentValue: { increment: returnAmount } },
            });

            return invoice;
        });

        res.status(201).json(result);
    } catch (err) {
        console.error('Pay return error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's invoices
router.get('/:id/invoices', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            where: { userId: parseInt(req.params.id) },
            orderBy: { issuedAt: 'desc' },
        });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
