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

// Create transaction (deposit/withdrawal)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const tx = await prisma.transaction.create({
            data: {
                userId: req.user.id,
                type: type.toUpperCase(),
                amount: parseFloat(amount),
                description: description || `${type} of $${amount}`,
                status: type.toUpperCase() === 'WITHDRAWAL' ? 'PENDING' : 'COMPLETED',
            },
        });
        res.status(201).json(tx);
    } catch (err) {
        console.error('Create transaction error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update transaction status (admin - approve/reject)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const tx = await prisma.transaction.update({
            where: { id: parseInt(req.params.id) },
            data: { status: status.toUpperCase() },
        });
        res.json(tx);
    } catch (err) {
        console.error('Update tx status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
