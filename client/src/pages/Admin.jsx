import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = '/api';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/registrations`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      setList(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthenticated(false);
        setPassword('');
      }
      toast.error(err.response?.data?.error || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated || !password) return;
    fetchList();
  }, [authenticated, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error('Enter password');
      return;
    }
    setAuthenticated(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(`${API}/export-excel`, {
        headers: { Authorization: `Bearer ${password}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neon-holi-registrations.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Excel downloaded');
    } catch (err) {
      if (err.response?.status === 401) setAuthenticated(false);
      toast.error(err.response?.data?.error || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen splash-bg">
        <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur border-b border-pink-200/40">
          <Link to="/" className="text-lg font-bold text-pink-600">Neon Holi 2026</Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-pink-600">Home</Link>
        </header>
        <div className="flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur shadow-2xl border-2 border-pink-200/50 max-w-sm w-full animate-scale-in"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-holi w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none mb-4 min-h-[48px]"
          />
          <button
            type="submit"
            className="btn-holi w-full py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 text-white min-h-[48px]"
          >
            Login
          </button>
        </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen splash-bg">
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur border-b border-pink-200/40">
        <Link to="/" className="text-lg font-bold text-pink-600">Neon Holi 2026</Link>
        <Link to="/" className="text-sm text-gray-600 hover:text-pink-600">Home</Link>
      </header>
      <div className="py-6 sm:py-8 md:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Registrations</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={fetchList}
              disabled={loading}
              className="btn-holi flex-1 sm:flex-none px-4 py-3 rounded-xl bg-cyan-500 text-white font-semibold disabled:opacity-70 min-h-[44px]"
            >
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-holi flex-1 sm:flex-none px-4 py-3 rounded-xl bg-green-500 text-white font-semibold disabled:opacity-70 min-h-[44px]"
            >
              {exporting ? 'Exporting…' : 'Download Excel'}
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white/90 backdrop-blur shadow-xl border-2 border-pink-200/50 overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="p-8 sm:p-12 text-center text-gray-600">Loading…</div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm min-w-[640px]">
              <thead>
                <tr className="bg-pink-100 border-b border-pink-200">
                  <th className="p-2 sm:p-3 font-bold">Name</th>
                  <th className="p-2 sm:p-3 font-bold">Email</th>
                  <th className="p-2 sm:p-3 font-bold">Mobile</th>
                  <th className="p-2 sm:p-3 font-bold">Gender</th>
                  <th className="p-2 sm:p-3 font-bold hidden md:table-cell">Payment ID</th>
                  <th className="p-2 sm:p-3 font-bold">Ticket ID</th>
                  <th className="p-2 sm:p-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={7} className="p-6 sm:p-8 text-center text-gray-500">No registrations yet</td></tr>
                ) : (
                  list.map((r) => (
                    <tr key={r._id} className="border-b border-gray-200 hover:bg-pink-50/50 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{r.name}</td>
                      <td className="p-2 sm:p-3 truncate max-w-[140px] sm:max-w-[200px]">{r.email}</td>
                      <td className="p-2 sm:p-3">{r.mobile}</td>
                      <td className="p-2 sm:p-3">{r.gender}</td>
                      <td className="p-2 sm:p-3 font-mono text-xs truncate max-w-[100px] md:max-w-[140px] hidden md:table-cell">{r.paymentId || '–'}</td>
                      <td className="p-2 sm:p-3 font-mono">{r.ticketId || '–'}</td>
                      <td className="p-2 sm:p-3 text-gray-600 whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '–'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
