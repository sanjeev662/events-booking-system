import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API } from '../api';
const GENDERS = ['Male', 'Female', 'Other'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;

const PAYMENT_UNAVAILABLE_MESSAGE = 'Registration is temporarily unavailable. Please try again later or contact the event organizer.';

export default function RegistrationForm({ onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [paymentUnavailable, setPaymentUnavailable] = useState(null);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    gender: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile is required';
    else if (!mobileRegex.test(form.mobile)) e.mobile = 'Enter 10 digit mobile number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(form.email)) e.email = 'Enter a valid email';
    if (!form.gender) e.gender = 'Select gender';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => {
        toast.error('Failed to load payment');
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPaymentUnavailable(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/create-order`);
      await loadRazorpay();
      if (!window.Razorpay) {
        setLoading(false);
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Neon Holi Event 2026',
        description: 'Entry Ticket ₹99',
        handler: async (response) => {
          try {
            const verify = await axios.post(`${API}/verify-payment`, {
              ...form,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verify.data.success) {
              toast.success('Payment successful!');
              onPaymentSuccess(verify.data.ticketId);
            } else toast.error('Verification failed');
          } catch (err) {
            toast.error(err.response?.data?.error || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: '#e91e8c' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      const code = err.response?.data?.code;
      const isConfigError = code === 'RAZORPAY_CONFIG' || code === 'RAZORPAY_AUTH';
      if (isConfigError) {
        setPaymentUnavailable(PAYMENT_UNAVAILABLE_MESSAGE);
      } else {
        toast.error(err.response?.data?.error || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <section id="register" className="section-holi relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green mb-2 sm:mb-3 animate-fade-in-up">
          Register for Neon Holi
        </h2>
        <p className="text-center text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 animate-fade-in-up">
          Fill in your details and pay ₹99 to get your e-ticket. You&apos;ll receive the ticket by email and can download the PDF after payment.
        </p>
        {paymentUnavailable && (
          <div
            role="alert"
            className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 animate-fade-in-up"
          >
            <div className="flex gap-3">
              <span className="flex-shrink-0 text-2xl" aria-hidden>⚠️</span>
              <div className="min-w-0">
                <p className="font-semibold text-amber-800">Registration temporarily unavailable</p>
                <p className="mt-1 text-sm text-amber-800/90">{paymentUnavailable}</p>
                <button
                  type="button"
                  onClick={() => setPaymentUnavailable(null)}
                  className="mt-3 text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur shadow-2xl card-border-holi card-holi animate-scale-in"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-holi w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:border-holi-magenta focus:ring-0 outline-none transition-all touch-target"
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile *</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.mobile}
              onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, ''))}
              className="input-holi w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:border-holi-magenta focus:ring-0 outline-none transition-all touch-target"
              placeholder="10 digit number"
            />
            {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="input-holi w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:border-holi-magenta focus:ring-0 outline-none transition-all touch-target"
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender *</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="input-holi w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:border-holi-magenta focus:ring-0 outline-none transition-all bg-white touch-target"
            >
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="input-holi w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:border-holi-magenta focus:ring-0 outline-none resize-none transition-all touch-target"
              placeholder="Full address"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-holi w-full py-3.5 sm:py-4 rounded-xl font-bold bg-gradient-to-r from-holi-magenta to-holi-green text-white disabled:opacity-70 flex items-center justify-center gap-2 touch-target min-h-[48px] text-base sm:text-lg neon-border"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Processing…
              </>
            ) : (
              <>Pay ₹99 & Book Ticket</>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
