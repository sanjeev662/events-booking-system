import { Link } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-md border-b border-pink-200/40 shadow-sm">
      <Link
        to="/"
        className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-cyan-600 hover:opacity-90 transition-opacity"
      >
        Neon Holi 2026
      </Link>
      <nav className="flex items-center gap-2">
        <a
          href="#highlights"
          className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors px-2 py-1 rounded"
        >
          Highlights
        </a>
        <a
          href="#register"
          className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors px-2 py-1 rounded"
        >
          Register
        </a>
        <Link
          to="/admin"
          className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-1.5 rounded-lg border border-gray-300/80 hover:border-pink-300 hover:bg-pink-50/50 transition-colors"
          aria-label="Admin login"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
