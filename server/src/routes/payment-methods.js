import { Router } from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all saved payment methods for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(methods);
    } catch (err) {
        console.error('Get payment methods error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new payment method
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, provider, accountName, accountNumber, branchName, routingNumber, swiftCode } = req.body;

        if (!type || !provider || !accountName || !accountNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate type
        const validTypes = ['BANK', 'MOBILE', 'CRYPTO'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid payment method type' });
        }

        // Fetch user to verify names (Optional strict enforcement depending on business logic)
        // Here we just save it, but we could enforce req.user.name === accountName 
        // We'll leave it flexible for now but log a warning if they don't explicitly match (case-insensitive)
        if (req.user.name.trim().toLowerCase() !== accountName.trim().toLowerCase()) {
            console.warn(`[Verification Alert] User ID ${req.user.id} added a payment method with a different name: ${accountName}`);
        }

        const method = await prisma.paymentMethod.create({
            data: {
                userId: req.user.id,
                type,
                provider,
                accountName,
                accountNumber,
                branchName: type === 'BANK' ? branchName : null,
                routingNumber: type === 'BANK' ? routingNumber : null,
                swiftCode: type === 'BANK' ? swiftCode : null,
            },
        });

        res.status(201).json(method);
    } catch (err) {
        console.error('Add payment method error:', err);
        res.status(500).json({ error: 'Server error while saving payment method' });
    }
});

// Delete a saved payment method
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const methodId = parseInt(req.params.id);

        const method = await prisma.paymentMethod.findUnique({
            where: { id: methodId },
        });

        if (!method) {
            return res.status(404).json({ error: 'Payment method not found' });
        }

        // Ensure user owns this method
        if (method.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this payment method' });
        }

        await prisma.paymentMethod.delete({
            where: { id: methodId },
        });

        res.json({ success: true, message: 'Payment method deleted' });
    } catch (err) {
        console.error('Delete payment method error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
