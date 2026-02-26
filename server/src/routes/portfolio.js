import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get user's holdings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const holdings = await prisma.holding.findMany({
            where: { userId: req.user.id },
        });
        res.json(holdings);
    } catch (err) {
        console.error('Get holdings error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get portfolio summary
router.get('/summary', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { totalInvested: true, currentValue: true, userPlans: { include: { plan: true } } },
        });

        const holdings = await prisma.holding.findMany({
            where: { userId: req.user.id },
        });

        const totalHoldings = holdings.reduce((sum, h) => sum + h.amount, 0);
        const roi = user.totalInvested > 0
            ? ((user.currentValue - user.totalInvested) / user.totalInvested * 100).toFixed(1)
            : 0;

        // Fetch the user's latest ROI percentage to calculate projected year-end returns
        const latestInvoice = await prisma.invoice.findFirst({
            where: { userId: req.user.id, status: 'PAID' },
            orderBy: { issuedAt: 'desc' },
        });

        res.json({
            totalInvested: user.totalInvested,
            currentValue: user.currentValue,
            totalROI: parseFloat(roi),
            activeInvestments: holdings.length,
            lifetimeEarnings: user.currentValue - user.totalInvested,
            holdings,
            userPlans: user.userPlans,
            latestRoiPercentage: latestInvoice ? latestInvoice.roiPercentage : 0,
        });
    } catch (err) {
        console.error('Get portfolio summary error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Subscribe to a new plan
router.post('/subscribe', authMiddleware, async (req, res) => {
    try {
        const { planName, amount, riskLevel } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Valid investment amount is required' });
        if (!['Low', 'Medium', 'High'].includes(riskLevel)) return res.status(400).json({ error: 'Valid risk level (Low, Medium, High) is required' });

        const plan = await prisma.plan.findUnique({ where: { name: planName } });
        if (!plan) return res.status(404).json({ error: 'Plan not found' });

        if (amount < plan.minInvestment) {
            return res.status(400).json({ error: `Minimum investment for this plan is $${plan.minInvestment}` });
        }

        const existingSubscription = await prisma.userPlan.findUnique({
            where: {
                userId_planId: {
                    userId: req.user.id,
                    planId: plan.id
                }
            }
        });
        if (existingSubscription) {
            return res.status(400).json({ error: `You are already subscribed to the ${plan.name} plan.` });
        }

        // 1. Create the subscription
        await prisma.userPlan.create({
            data: {
                userId: req.user.id,
                planId: plan.id,
                amount: parseFloat(amount),
                riskLevel: riskLevel
            }
        });

        // 2. Increment user balances
        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                totalInvested: { increment: parseFloat(amount) },
                currentValue: { increment: parseFloat(amount) }
            },
        });

        // 3. Log the deposit transaction
        await prisma.transaction.create({
            data: {
                userId: req.user.id,
                type: 'DEPOSIT',
                amount: parseFloat(amount),
                description: `Investment - ${plan.name} Plan (${riskLevel} Risk)`
            }
        });

        res.json({ success: true, message: `Successfully subscribed to ${plan.name} plan.` });
    } catch (err) {
        console.error('Subscribe to plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
