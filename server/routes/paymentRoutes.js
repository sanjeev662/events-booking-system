import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Registration from '../models/Registration.js';
import PendingOrder from '../models/PendingOrder.js';
import { generateTicketPDF, getTicketPath } from '../utils/generateTicket.js';
import fs from 'fs';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const isRazorpayConfigured = () => {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return id && secret && id !== 'rzp_test_xxxx' && secret !== 'your_secret';
};

function generateTicketId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `NH2026-${num}`;
}

/** Creates registration from user data. Returns { registration } or null if duplicate. */
async function createRegistrationIfNew(userData, paymentId, orderId) {
  const existing = await Registration.findOne({ orderId });
  if (existing) return { registration: existing, isDuplicate: true };

  const ticketId = generateTicketId();
  const registration = new Registration({
    name: userData.name,
    email: userData.email,
    mobile: userData.mobile,
    gender: userData.gender,
    address: userData.address,
    paymentId,
    orderId,
    ticketId,
    paymentStatus: 'SUCCESS',
    createdAt: new Date()
  });
  await registration.save();
  return { registration, isDuplicate: false };
}

/** Generate PDF without failing the response. Logs errors. */
async function tryGeneratePDF(registration) {
  try {
    await generateTicketPDF(registration);
  } catch (pdfErr) {
    console.error('PDF generation failed for', registration.ticketId, pdfErr.message);
  }
}

// POST /api/create-order (accepts user data to store for webhook fallback)
router.post('/create-order', async (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      error: 'Payment gateway not configured',
      code: 'RAZORPAY_CONFIG',
      hint: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env from Razorpay Dashboard → API Keys'
    });
  }
  const { name, email, mobile, gender, address } = req.body || {};
  if (!name || !email || !mobile || !gender || !address) {
    return res.status(400).json({ error: 'Missing required fields: name, email, mobile, gender, address' });
  }
  try {
    const options = {
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      receipt: `neon_holi_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    await PendingOrder.create({
      orderId: order.id,
      name,
      email,
      mobile,
      gender,
      address
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Create order error:', err);
    if (err.statusCode === 401) {
      return res.status(503).json({
        error: 'Payment gateway authentication failed',
        code: 'RAZORPAY_AUTH',
        hint: 'Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env (use test keys from Razorpay Dashboard)'
      });
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/verify-payment (client handler - has user data)
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, ...userData } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const { registration } = await createRegistrationIfNew(userData, razorpay_payment_id, razorpay_order_id);
    if (!registration) return res.status(500).json({ error: 'Registration failed' });

    await PendingOrder.deleteOne({ orderId: razorpay_order_id }).catch(() => {});
    await tryGeneratePDF(registration);

    res.json({
      success: true,
      ticketId: registration.ticketId,
      message: 'Payment verified. You can download your ticket.'
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Webhook handler - must receive raw body. Mount in server.js with express.raw()
export async function paymentWebhookHandler(req, res) {
  const rawBody = req.body;
  if (!rawBody || !Buffer.isBuffer(rawBody)) {
    return res.status(400).send('Invalid body');
  }
  const sig = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !sig) {
    console.warn('Webhook: RAZORPAY_WEBHOOK_SECRET not set or missing signature');
    return res.status(400).send('Webhook not configured');
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (expected !== sig) {
    return res.status(400).send('Invalid signature');
  }
  let payload;
  try {
    payload = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).send('Invalid JSON');
  }
  if (payload.event !== 'payment.captured') {
    return res.status(200).send('OK');
  }
  const payment = payload.payload?.payment?.entity;
  if (!payment?.id || !payment?.order_id) {
    return res.status(200).send('OK');
  }
  const orderId = payment.order_id;
  const paymentId = payment.id;
  try {
    const existing = await Registration.findOne({ orderId });
    if (existing) {
      return res.status(200).send('OK');
    }
    const pending = await PendingOrder.findOne({ orderId });
    if (!pending) {
      console.warn('Webhook: No pending order for', orderId, '- user may have closed before create-order completed');
      return res.status(200).send('OK');
    }
    const userData = {
      name: pending.name,
      email: pending.email,
      mobile: pending.mobile,
      gender: pending.gender,
      address: pending.address
    };
    const { registration } = await createRegistrationIfNew(userData, paymentId, orderId);
    await PendingOrder.deleteOne({ orderId }).catch(() => {});
    await tryGeneratePDF(registration);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook payment.captured error:', err);
    res.status(500).send('Error');
  }
}

// GET /api/download-ticket/:ticketId
router.get('/download-ticket/:ticketId', (req, res) => {
  const filePath = getTicketPath(req.params.ticketId);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.download(filePath, `neon-holi-ticket-${req.params.ticketId}.pdf`);
});

export default router;
