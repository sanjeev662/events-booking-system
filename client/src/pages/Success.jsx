import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = '/api';

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketId = state?.ticketId;
  const [downloading, setDownloading] = useState(false);

  if (!ticketId) {
    return (
      <div className="min-h-screen splash-bg flex flex-col">
        <header className="header-holi flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta to-holi-green">Neon Holi 2026</Link>
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-holi-magenta transition-colors">Home</Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="text-center animate-scale-in max-w-sm w-full p-8 rounded-2xl bg-white/95 shadow-2xl card-border-holi card-holi">
          <p className="text-base sm:text-lg text-gray-800">No ticket found.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-holi mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-holi-magenta to-holi-green text-white font-semibold neon-border"
          >
            Go Home
          </button>
        </div>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await axios.get(`${API}/download-ticket/${ticketId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `neon-holi-ticket-${ticketId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Ticket downloaded!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen splash-bg">
      <header className="header-holi flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta to-holi-green">Neon Holi 2026</Link>
        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-holi-magenta transition-colors">Home</Link>
      </header>
      <div className="flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur shadow-2xl card-border-holi card-holi animate-scale-in">
        <div className="text-5xl sm:text-6xl mb-4">🎟️</div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta to-holi-green">Booking Successful!</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Your ticket ID: <strong className="text-holi-magenta">{ticketId}</strong>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          Razorpay receipt will be sent to your email. Download your ticket below.
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-holi mt-6 w-full py-3.5 sm:py-4 rounded-xl font-bold bg-gradient-to-r from-holi-magenta to-holi-green text-white disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px] neon-border"
        >
          {downloading ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Downloading…
            </>
          ) : (
            'Download Ticket (PDF)'
          )}
        </button>
        <Link
          to="/"
          className="link-holi inline-block mt-4 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-holi-magenta/40 rounded-lg px-2 py-1"
        >
          Back to Home
        </Link>
      </div>
      </div>
    </div>
  );
}
