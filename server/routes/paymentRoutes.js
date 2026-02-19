import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Registration from '../models/Registration.js';
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

// POST /api/create-order
router.post('/create-order', async (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      error: 'Payment gateway not configured',
      code: 'RAZORPAY_CONFIG',
      hint: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env from Razorpay Dashboard → API Keys'
    });
  }
  try {
    const options = {
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      receipt: `neon_holi_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
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

// POST /api/verify-payment
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

    const ticketId = generateTicketId();
    const registration = new Registration({
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      gender: userData.gender,
      address: userData.address,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      ticketId,
      paymentStatus: 'SUCCESS',
      createdAt: new Date()
    });
    await registration.save();

    await generateTicketPDF(registration);

    res.json({
      success: true,
      ticketId,
      message: 'Payment verified. You can download your ticket.'
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// GET /api/download-ticket/:ticketId
router.get('/download-ticket/:ticketId', (req, res) => {
  const filePath = getTicketPath(req.params.ticketId);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.download(filePath, `neon-holi-ticket-${req.params.ticketId}.pdf`);
});

export default router;
