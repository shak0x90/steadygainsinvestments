import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all content (public)
router.get('/', async (req, res) => {
    try {
        const content = await prisma.siteContent.findMany();
        // Convert to key-value map grouped by section
        const grouped = {};
        content.forEach((item) => {
            if (!grouped[item.section]) grouped[item.section] = {};
            grouped[item.section][item.key] = item.value;
        });
        res.json(grouped);
    } catch (err) {
        console.error('Get content error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get content by section
router.get('/:section', async (req, res) => {
    try {
        const content = await prisma.siteContent.findMany({
            where: { section: req.params.section },
        });
        const result = {};
        content.forEach((item) => { result[item.key] = item.value; });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update content (admin)
router.put('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { items } = req.body; // [{ key, value, section }]
        const results = await Promise.all(
            items.map((item) =>
                prisma.siteContent.upsert({
                    where: { key: item.key },
                    update: { value: item.value, section: item.section },
                    create: { key: item.key, value: item.value, section: item.section },
                })
            )
        );
        res.json(results);
    } catch (err) {
        console.error('Update content error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
