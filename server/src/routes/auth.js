import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
            select: { id: true, name: true, email: true, role: true, createdAt: true, totalInvested: true, currentValue: true, userPlans: { include: { plan: true } } },
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { userPlans: { include: { plan: true } } }
        });
        if (!user || !user.active) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userData } = user;
        res.json({ user: userData, token });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, name: true, email: true, role: true,
                totalInvested: true, currentValue: true, active: true,
                createdAt: true, userPlans: { include: { plan: true } },
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Get me error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
