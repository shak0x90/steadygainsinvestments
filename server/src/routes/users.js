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
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.user.count({ where: { role: 'USER', active: true } }),
            prisma.plan.count({ where: { active: true } }),
        ]);

        const users = await prisma.user.findMany({
            where: { role: 'USER' },
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

// Get all pending modification requests globally (admin)
router.get('/modifications/pending', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pendingPlans = await prisma.userPlan.findMany({
            where: {
                OR: [
                    { pendingAmount: { not: null } },
                    { pendingRiskLevel: { not: null } }
                ]
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                plan: true
            },
            orderBy: { createdAt: 'asc' }
        });
        res.json(pendingPlans);
    } catch (err) {
        console.error('Get pending modifications error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Approve a modification
router.post('/modifications/:userPlanId/approve', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userPlanId = parseInt(req.params.userPlanId);
        const userPlan = await prisma.userPlan.findUnique({
            where: { id: userPlanId },
            include: { plan: true }
        });

        if (!userPlan || (!userPlan.pendingAmount && !userPlan.pendingRiskLevel)) {
            return res.status(404).json({ error: 'Pending modification not found' });
        }

        await prisma.userPlan.update({
            where: { id: userPlanId },
            data: {
                amount: userPlan.pendingAmount || userPlan.amount,
                riskLevel: userPlan.pendingRiskLevel || userPlan.riskLevel,
                pendingAmount: null,
                pendingRiskLevel: null
            }
        });

        res.json({ success: true, message: 'Modification approved and applied.' });
    } catch (err) {
        console.error('Approve modification error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Reject a modification (Refunds difference)
router.post('/modifications/:userPlanId/reject', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userPlanId = parseInt(req.params.userPlanId);
        const userPlan = await prisma.userPlan.findUnique({
            where: { id: userPlanId },
            include: { plan: true }
        });

        if (!userPlan || (!userPlan.pendingAmount && !userPlan.pendingRiskLevel)) {
            return res.status(404).json({ error: 'Pending modification not found' });
        }

        const currentAmount = userPlan.amount;
        const pendingAmount = userPlan.pendingAmount;
        const difference = pendingAmount && pendingAmount > currentAmount ? pendingAmount - currentAmount : 0;

        await prisma.$transaction(async (tx) => {
            await tx.userPlan.update({
                where: { id: userPlanId },
                data: {
                    pendingAmount: null,
                    pendingRiskLevel: null
                }
            });

            if (difference > 0) {
                await tx.user.update({
                    where: { id: userPlan.userId },
                    data: {
                        totalInvested: { decrement: difference },
                        currentValue: { decrement: difference }
                    }
                });

                await tx.transaction.create({
                    data: {
                        userId: userPlan.userId,
                        type: 'REFUND',
                        amount: difference,
                        description: `Admin Rejected Mod - Refunded ${userPlan.plan.name} Plan Increase`
                    }
                });
            }
        });

        res.json({ success: true, message: 'Modification rejected and refunded.' });
    } catch (err) {
        console.error('Reject modification error:', err);
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

            // Promote any pending plan modifications to active now that the return is paid
            if (activeUserPlan.pendingAmount || activeUserPlan.pendingRiskLevel) {
                await tx.userPlan.update({
                    where: { id: activeUserPlan.id },
                    data: {
                        amount: activeUserPlan.pendingAmount || activeUserPlan.amount,
                        riskLevel: activeUserPlan.pendingRiskLevel || activeUserPlan.riskLevel,
                        pendingAmount: null,
                        pendingRiskLevel: null,
                    }
                });
            }

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
