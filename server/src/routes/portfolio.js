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

        // Calculate usable funds = currentValue - capital locked in active plans
        const lockedInPlans = user.userPlans.reduce((sum, up) => sum + up.amount, 0);
        const usableFunds = Math.max(0, user.currentValue - lockedInPlans);

        // Fetch the user's latest ROI percentage to calculate projected year-end returns
        const latestInvoice = await prisma.invoice.findFirst({
            where: { userId: req.user.id, status: 'PAID' },
            orderBy: { issuedAt: 'desc' },
        });

        res.json({
            totalInvested: user.totalInvested,
            currentValue: user.currentValue,
            usableFunds,
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
        const investAmount = parseFloat(amount);

        if (!investAmount || isNaN(investAmount) || investAmount <= 0) return res.status(400).json({ error: 'Valid investment amount is required' });
        if (!['Low', 'Medium', 'High'].includes(riskLevel)) return res.status(400).json({ error: 'Valid risk level (Low, Medium, High) is required' });

        const plan = await prisma.plan.findUnique({ where: { name: planName } });
        if (!plan) return res.status(404).json({ error: 'Plan not found' });

        if (investAmount < plan.minInvestment) {
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

        // Check usable funds
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { userPlans: true }
        });
        const lockedInPlans = user.userPlans.reduce((sum, up) => sum + up.amount, 0);
        const usableFunds = Math.max(0, user.currentValue - lockedInPlans);

        if (usableFunds < investAmount) {
            return res.status(400).json({
                error: `Insufficient usable funds. You have $${usableFunds.toFixed(2)} available but need $${investAmount.toFixed(2)}. Please deposit funds first.`
            });
        }

        // 1. Create the subscription (locks funds from usable into the plan)
        await prisma.userPlan.create({
            data: {
                userId: req.user.id,
                planId: plan.id,
                amount: investAmount,
                riskLevel: riskLevel
            }
        });

        // 2. Log the investment transaction (no balance change — money was already in currentValue)
        await prisma.transaction.create({
            data: {
                userId: req.user.id,
                type: 'DEPOSIT',
                amount: investAmount,
                description: `Investment - ${plan.name} Plan (${riskLevel} Risk)`
            }
        });

        res.json({ success: true, message: `Successfully subscribed to ${plan.name} plan.` });
    } catch (err) {
        console.error('Subscribe to plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Modify an existing plan (Delayed Effectiveness)
router.put('/plan/:planId', authMiddleware, async (req, res) => {
    try {
        const planId = parseInt(req.params.planId);
        const { amount, riskLevel } = req.body;
        const newAmount = parseFloat(amount);

        if (!newAmount || isNaN(newAmount) || newAmount <= 0) return res.status(400).json({ error: 'Valid investment amount is required' });
        if (!['Low', 'Medium', 'High'].includes(riskLevel)) return res.status(400).json({ error: 'Valid risk level is required' });

        const userPlan = await prisma.userPlan.findUnique({
            where: {
                userId_planId: { userId: req.user.id, planId: planId }
            },
            include: { plan: true }
        });

        if (!userPlan) return res.status(404).json({ error: 'Active subscription not found' });

        // Prevent decreasing investment amount during modification
        const currentAmount = userPlan.amount;
        if (newAmount < currentAmount) {
            return res.status(400).json({ error: `You cannot decrease your actual investment amount below $${currentAmount}` });
        }

        const difference = newAmount - currentAmount;

        // Check usable funds for the increase
        if (difference > 0) {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                include: { userPlans: true }
            });
            const lockedInPlans = user.userPlans.reduce((sum, up) => sum + up.amount, 0);
            const usableFunds = Math.max(0, user.currentValue - lockedInPlans);

            if (usableFunds < difference) {
                return res.status(400).json({
                    error: `Insufficient usable funds. You have $${usableFunds.toFixed(2)} available but need $${difference.toFixed(2)} more. Please deposit funds first.`
                });
            }
        }

        // Start transaction for atomic updates
        await prisma.$transaction(async (tx) => {
            // 1. Update UserPlan with pending modifications
            await tx.userPlan.update({
                where: { id: userPlan.id },
                data: {
                    pendingAmount: newAmount,
                    pendingRiskLevel: riskLevel
                }
            });

            // If they increased their investment, lock the extra funds immediately
            if (difference > 0) {
                // Log the investment transaction (funds come from usable balance, no currentValue change)
                await tx.transaction.create({
                    data: {
                        userId: req.user.id,
                        type: 'DEPOSIT',
                        amount: difference,
                        description: `Investment Increase - ${userPlan.plan.name} Plan`
                    }
                });
            }
        });

        res.json({ success: true, message: `Successfully requested modification. Changes will take effect after your next ROI payout.` });
    } catch (err) {
        console.error('Modify plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Cancel a pending plan modification
router.delete('/plan/:planId/modification', authMiddleware, async (req, res) => {
    try {
        const planId = parseInt(req.params.planId);

        const userPlan = await prisma.userPlan.findUnique({
            where: {
                userId_planId: { userId: req.user.id, planId: planId }
            },
            include: { plan: true }
        });

        if (!userPlan || (!userPlan.pendingAmount && !userPlan.pendingRiskLevel)) {
            return res.status(404).json({ error: 'No pending modifications found for this plan.' });
        }

        const currentAmount = userPlan.amount;
        const pendingAmount = userPlan.pendingAmount;
        const difference = pendingAmount && pendingAmount > currentAmount ? pendingAmount - currentAmount : 0;

        await prisma.$transaction(async (tx) => {
            // 1. Clear pending modifications
            await tx.userPlan.update({
                where: { id: userPlan.id },
                data: {
                    pendingAmount: null,
                    pendingRiskLevel: null
                }
            });

            // 2. Refund any increased investment amount
            if (difference > 0) {
                await tx.user.update({
                    where: { id: req.user.id },
                    data: {
                        totalInvested: { decrement: difference },
                        currentValue: { decrement: difference }
                    }
                });

                await tx.transaction.create({
                    data: {
                        userId: req.user.id,
                        type: 'REFUND',
                        amount: difference,
                        description: `Mod Request Cancelled - Refunded ${userPlan.plan.name} Plan Increase`
                    }
                });
            }
        });

        res.json({ success: true, message: 'Successfully canceled your pending modification request.' });
    } catch (err) {
        console.error('Cancel modification error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
