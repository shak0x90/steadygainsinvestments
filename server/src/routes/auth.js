import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';

const router = Router();

// ─────────────────────────────────────────────
// SIGN UP (generates email verification token)
// ─────────────────────────────────────────────
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
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                emailVerificationToken: verificationToken,
                isEmailVerified: false,
            },
            select: {
                id: true, name: true, email: true, role: true,
                createdAt: true, totalInvested: true, currentValue: true,
                isEmailVerified: true,
                userPlans: { include: { plan: true } },
            },
        });

        // Send verification email (logs to console in dev)
        await sendVerificationEmail(user, verificationToken);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// SIGN IN
// ─────────────────────────────────────────────
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

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, emailVerificationToken: __, resetPasswordToken: ___, ...userData } = user;
        res.json({ user: userData, token });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// GET CURRENT USER (/me)
// ─────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, name: true, email: true, role: true,
                totalInvested: true, currentValue: true, active: true,
                isEmailVerified: true, createdAt: true,
                userPlans: { include: { plan: true } },
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Get me error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// VERIFY EMAIL
// ─────────────────────────────────────────────
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Verification token is required' });

        const user = await prisma.user.findUnique({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
            }
        });

        res.json({ success: true, message: 'Email verified successfully. You can now sign in.' });
    } catch (err) {
        console.error('Verify email error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// RESEND VERIFICATION EMAIL
// ─────────────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await prisma.user.findUnique({ where: { email } });

        // Always respond with success to prevent email enumeration
        if (!user || user.isEmailVerified) {
            return res.json({ success: true, message: 'If your email exists and is unverified, a new link has been sent.' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken: verificationToken }
        });

        await sendVerificationEmail(user, verificationToken);

        res.json({ success: true, message: 'Verification email resent. Check your inbox.' });
    } catch (err) {
        console.error('Resend verification error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// FORGOT PASSWORD (request reset link)
// ─────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await prisma.user.findUnique({ where: { email } });

        // Always send success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: expires,
            }
        });

        await sendPasswordResetEmail(user, resetToken);

        res.json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// RESET PASSWORD (use the token from the email)
// ─────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: token }
        });

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired reset token. Please request a new one.' });
        }

        const hashed = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            }
        });

        res.json({ success: true, message: 'Password reset successfully. You can now sign in.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// UPDATE PROFILE (authenticated — name only)
// ─────────────────────────────────────────────
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name: name.trim() },
            select: {
                id: true, name: true, email: true, role: true,
                totalInvested: true, currentValue: true,
                isEmailVerified: true,
                userPlans: { include: { plan: true } },
            }
        });

        res.json(user);
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// UPDATE PASSWORD (authenticated)
// ─────────────────────────────────────────────
router.put('/me/password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashed }
        });

        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Update password error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
