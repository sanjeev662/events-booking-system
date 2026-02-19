import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  paymentId: { type: String, default: '' },
  orderId: { type: String, default: '' },
  ticketId: { type: String, default: '' },
  paymentStatus: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Registration', registrationSchema);
