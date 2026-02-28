import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import plansRoutes from './routes/plans.js';
import transactionsRoutes from './routes/transactions.js';
import portfolioRoutes from './routes/portfolio.js';
import usersRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import paymentMethodsRoutes from './routes/payment-methods.js';
import uploadRoutes from './routes/upload.js';
import ticketsRoutes from './routes/tickets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting — Auth routes only (20 attempts per 15 min per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS
app.use(cors(isProd && process.env.APP_URL
    ? { origin: process.env.APP_URL }
    : {}
));
app.use(express.json({ limit: '5mb' }));

// Serve uploaded local images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes (auth with rate limiter)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/payment-methods', paymentMethodsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tickets', ticketsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend in production only
if (isProd) {
    const distPath = path.join(__dirname, '../../dist');
    app.use(express.static(distPath));
    app.get('{*path}', (req, res) => {
        if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Steady Gains API running on port ${PORT} ${isProd ? '(production)' : '(development)'}`);
});
