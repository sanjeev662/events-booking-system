import { Link } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="header-holi fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 min-h-[56px] sm:min-h-[60px]">
      <Link
        to="/"
        className="header-logo text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta via-holi-yellow to-holi-green hover:opacity-90 transition-opacity"
      >
        Neon Holi 2026
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
        <a
          href="#highlights"
          className="hidden sm:inline text-sm font-semibold text-gray-700 hover:text-holi-magenta transition-colors px-3 py-2 rounded-lg hover:bg-holi-magenta/5"
        >
          Highlights
        </a>
        <a
          href="#register"
          className="hidden sm:inline text-sm font-semibold text-gray-700 hover:text-holi-magenta transition-colors px-3 py-2 rounded-lg hover:bg-holi-magenta/5"
        >
          Register
        </a>
        <Link
          to="/admin"
          className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-holi-green px-3 py-2 rounded-lg border-2 border-holi-magenta/40 hover:border-holi-magenta hover:bg-holi-magenta/5 transition-colors min-h-[44px] flex items-center justify-center"
          aria-label="Admin login"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
