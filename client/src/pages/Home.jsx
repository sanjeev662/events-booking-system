import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Highlights from '../components/Highlights';
import AboutEvent from '../components/AboutEvent';
import RegistrationForm from '../components/RegistrationForm';
import SiteHeader from '../components/SiteHeader';

export default function Home() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePaymentSuccess = (ticketId) => {
    navigate('/success', { state: { ticketId } });
  };

  return (
    <div className="min-h-screen splash-bg">
      <SiteHeader />
      <main className="pt-14 sm:pt-16">
        <Hero onBookClick={scrollToForm} />
        <AboutEvent />
        <Highlights />
        <div ref={formRef}>
          <RegistrationForm onPaymentSuccess={handlePaymentSuccess} />
        </div>
      </main>
      <footer className="footer-holi py-8 sm:py-10 px-4 sm:px-6 text-gray-300 text-sm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green text-base sm:text-lg">
            Neon Holi Event 2026
          </p>
          <p className="mt-1 text-gray-400">
            JMB Resort, Ballia • 28th February 2026 • 02:00 PM
          </p>
          <p className="mt-4 text-gray-400 max-w-md mx-auto">
            For sponsorship and stall booking enquiries, contact us at{' '}
            <a href="tel:9111001103" className="link-holi font-medium hover:underline">9111001103</a>,{' '}
            <a href="tel:8115170451" className="link-holi font-medium hover:underline">8115170451</a>,{' '}
            <a href="tel:7525018241" className="link-holi font-medium hover:underline">7525018241</a>.
          </p>
          <p className="mt-3 text-gray-500 text-xs">
            Branding &amp; Marketing by Dizilight India Private Limited
          </p>
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap justify-center gap-4">
            <Link
              to="/admin"
              className="text-holi-yellow/90 hover:text-holi-yellow text-xs font-medium transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
