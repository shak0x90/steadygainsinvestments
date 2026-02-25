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
            select: { totalInvested: true, currentValue: true, plans: true },
        });

        const holdings = await prisma.holding.findMany({
            where: { userId: req.user.id },
        });

        const totalHoldings = holdings.reduce((sum, h) => sum + h.amount, 0);
        const roi = user.totalInvested > 0
            ? ((user.currentValue - user.totalInvested) / user.totalInvested * 100).toFixed(1)
            : 0;

        res.json({
            totalInvested: user.totalInvested,
            currentValue: user.currentValue,
            totalROI: parseFloat(roi),
            activeInvestments: holdings.length,
            lifetimeEarnings: user.currentValue - user.totalInvested,
            holdings,
            plans: user.plans,
        });
    } catch (err) {
        console.error('Get portfolio summary error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Subscribe to a new plan
router.post('/subscribe', authMiddleware, async (req, res) => {
    try {
        const { planName } = req.body;
        const plan = await prisma.plan.findUnique({ where: { name: planName } });
        if (!plan) return res.status(404).json({ error: 'Plan not found' });

        await prisma.user.update({
            where: { id: req.user.id },
            data: { plans: { connect: { id: plan.id } } },
        });

        res.json({ success: true, message: `Successfully subscribed to ${plan.name} plan.` });
    } catch (err) {
        console.error('Subscribe to plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
