import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all plans (public)
router.get('/', async (req, res) => {
    try {
        const plans = await prisma.plan.findMany({
            where: { active: true },
            orderBy: { minInvestment: 'asc' },
        });
        res.json(plans);
    } catch (err) {
        console.error('Get plans error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single plan
router.get('/:id', async (req, res) => {
    try {
        const plan = await prisma.plan.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!plan) return res.status(404).json({ error: 'Plan not found' });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create plan (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const plan = await prisma.plan.create({ data: req.body });
        res.status(201).json(plan);
    } catch (err) {
        console.error('Create plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update plan (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const plan = await prisma.plan.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json(plan);
    } catch (err) {
        console.error('Update plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete plan (admin - soft delete)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await prisma.plan.update({
            where: { id: parseInt(req.params.id) },
            data: { active: false },
        });
        res.json({ message: 'Plan deactivated' });
    } catch (err) {
        console.error('Delete plan error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
