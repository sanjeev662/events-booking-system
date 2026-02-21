import mongoose from 'mongoose';

const pendingOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 } // TTL 30 min
});

export default mongoose.model('PendingOrder', pendingOrderSchema);
