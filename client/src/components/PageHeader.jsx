import { Link } from 'react-router-dom';

/**
 * Shared header for non-landing pages (Success, Admin).
 * Matches SiteHeader styling but with only logo + Home link.
 */
export default function PageHeader() {
  return (
    <header className="header-holi fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 min-h-[56px] sm:min-h-[60px]">
      <Link
        to="/"
        className="header-logo text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green hover:opacity-90 transition-opacity"
      >
        Neon Holi 2026
      </Link>
      <Link
        to="/"
        className="text-sm font-semibold text-gray-700 hover:text-holi-magenta transition-colors px-3 py-2 rounded-lg hover:bg-holi-magenta/5 min-h-[44px] flex items-center"
      >
        Home
      </Link>
    </header>
  );
}
