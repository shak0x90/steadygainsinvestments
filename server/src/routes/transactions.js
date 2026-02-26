import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Get user's transactions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };

        if (req.query.type) {
            where.type = req.query.type.toUpperCase();
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
            include: req.user.role === 'ADMIN' ? { user: { select: { id: true, name: true, email: true } } } : undefined,
        });
        res.json(transactions);
    } catch (err) {
        console.error('Get transactions error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's invoices
router.get('/invoices', authMiddleware, async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            where: { userId: req.user.id },
            orderBy: { issuedAt: 'desc' },
        });
        res.json(invoices);
    } catch (err) {
        console.error('Get invoices error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create transaction (legacy - kept for backward compat / admin use)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, amount, description } = req.body;

        if (type.toUpperCase() === 'WITHDRAWAL') {
            return res.status(400).json({ error: 'Use /withdraw endpoint for withdrawals' });
        }

        const tx = await prisma.transaction.create({
            data: {
                userId: req.user.id,
                type: type.toUpperCase(),
                amount: parseFloat(amount),
                description: description || `${type} of $${amount}`,
                status: 'COMPLETED',
            },
        });

        if (type.toUpperCase() === 'DEPOSIT') {
            await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    totalInvested: { increment: parseFloat(amount) },
                    currentValue: { increment: parseFloat(amount) },
                }
            });
        }

        res.status(201).json(tx);
    } catch (err) {
        console.error('Create transaction error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// User Deposit Request (creates PENDING deposit that admin approves)
router.post('/deposit', authMiddleware, async (req, res) => {
    try {
        const { amount, method, details } = req.body;
        const depositAmount = parseFloat(amount);

        if (!depositAmount || depositAmount <= 0) {
            return res.status(400).json({ error: 'Invalid deposit amount' });
        }

        const tx = await prisma.transaction.create({
            data: {
                userId: req.user.id,
                type: 'DEPOSIT',
                amount: depositAmount,
                description: `Deposit via ${method || 'Bank Transfer'}${details ? ` | ${details}` : ''}`,
                status: 'PENDING',
            },
        });

        res.status(201).json(tx);
    } catch (err) {
        console.error('Deposit request error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Secure Withdrawal Request
router.post('/withdraw', authMiddleware, async (req, res) => {
    try {
        const { amount, method, details } = req.body;
        const withdrawAmount = parseFloat(amount);

        if (!withdrawAmount || withdrawAmount <= 0) {
            return res.status(400).json({ error: 'Invalid withdrawal amount' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { userPlans: true }
        });

        // Calculate usable funds (not locked in active plans)
        const lockedInPlans = user.userPlans.reduce((sum, up) => sum + up.amount, 0);
        const usableFunds = Math.max(0, user.currentValue - lockedInPlans);

        // Ensure user has enough usable (uninvested) balance
        if (usableFunds < withdrawAmount) {
            return res.status(400).json({ error: `Insufficient usable funds. You have $${usableFunds.toFixed(2)} available (not locked in plans). You cannot withdraw capital that is actively invested.` });
        }

        // Transaction block to securely deduct funds (escrow) and create the pending request
        const tx = await prisma.$transaction(async (prismaTx) => {
            // Deduct from current value so they can't double-spend it
            await prismaTx.user.update({
                where: { id: req.user.id },
                data: { currentValue: { decrement: withdrawAmount } }
            });

            // Create pending withdrawal
            const detailsString = details ? ` | Details: ${details}` : '';
            return await prismaTx.transaction.create({
                data: {
                    userId: req.user.id,
                    type: 'WITHDRAWAL',
                    amount: withdrawAmount,
                    description: `Payout via ${method || 'Bank Transfer'}${detailsString}`,
                    status: 'PENDING',
                },
            });
        });

        res.status(201).json(tx);
    } catch (err) {
        console.error('Withdrawal error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update transaction status (admin - approve/reject withdrawals)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const newStatus = status.toUpperCase();
        const txId = parseInt(req.params.id);

        const tx = await prisma.transaction.findUnique({ where: { id: txId } });

        if (!tx) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Prevent re-processing already completed/rejected transactions
        if (tx.status !== 'PENDING') {
            return res.status(400).json({ error: `Transaction is already ${tx.status}` });
        }

        const updatedTx = await prisma.$transaction(async (prismaTx) => {
            // WITHDRAWAL: If rejected, refund escrowed money back to currentValue
            if (newStatus === 'REJECTED' && tx.type === 'WITHDRAWAL') {
                await prismaTx.user.update({
                    where: { id: tx.userId },
                    data: { currentValue: { increment: tx.amount } }
                });
            }

            // DEPOSIT: If approved, credit the user's balances
            if (newStatus === 'COMPLETED' && tx.type === 'DEPOSIT') {
                await prismaTx.user.update({
                    where: { id: tx.userId },
                    data: {
                        totalInvested: { increment: tx.amount },
                        currentValue: { increment: tx.amount },
                    }
                });
            }

            // Update the transaction status
            return await prismaTx.transaction.update({
                where: { id: txId },
                data: { status: newStatus },
            });
        });

        res.json(updatedTx);
    } catch (err) {
        console.error('Update tx status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
