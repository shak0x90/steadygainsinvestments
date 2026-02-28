import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// ── User Routes ──

// Get my tickets
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tickets);
    } catch (err) {
        console.error('Get my tickets error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new ticket
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { subject, message, attachment } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ error: 'Subject and message are required' });
        }

        const ticket = await prisma.ticket.create({
            data: {
                userId: req.user.id,
                subject,
                message,
                attachment: attachment || null,
                status: 'OPEN',
            },
        });

        res.status(201).json(ticket);
    } catch (err) {
        console.error('Create ticket error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Admin Routes ──

// Get all tickets (Admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.query;

        const filters = {};
        if (status && status !== 'ALL') {
            filters.status = status;
        }

        const tickets = await prisma.ticket.findMany({
            where: filters,
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tickets);
    } catch (err) {
        console.error('Get all tickets error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin reply to and update status of a ticket
router.put('/:id/reply', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { adminReply, status } = req.body;
        const ticketId = parseInt(req.params.id);

        let updateData = {};
        if (adminReply !== undefined) updateData.adminReply = adminReply;
        if (status) updateData.status = status;

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: updateData,
            include: { user: { select: { name: true, email: true } } },
        });

        res.json(updatedTicket);
    } catch (err) {
        console.error('Update ticket error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
