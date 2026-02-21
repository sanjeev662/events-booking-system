import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import paymentRoutes, { paymentWebhookHandler } from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: true, credentials: true }));

// Webhook must receive raw body for signature verification - register before express.json()
app.post('/api/payment-webhook', express.raw({ type: 'application/json' }), paymentWebhookHandler);

app.use(express.json());

app.use('/api', paymentRoutes);
app.use('/api', adminRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
