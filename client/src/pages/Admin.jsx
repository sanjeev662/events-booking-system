import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import { API } from '../api';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchList = async () => {
    if (!password) return;
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
        setList([]);
        toast.error('Invalid password');
      } else {
        toast.error(err.response?.data?.error || 'Failed to fetch');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const pwd = password.trim();
    if (!pwd) {
      toast.error('Enter password');
      return;
    }
    setLoggingIn(true);
    try {
      const { data } = await axios.get(`${API}/registrations`, {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      setList(data);
      setAuthenticated(true);
      toast.success('Logged in');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Invalid password');
      } else {
        toast.error(err.response?.data?.error || 'Login failed');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
    setList([]);
    toast.success('Logged out');
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
      if (err.response?.status === 401) {
        setAuthenticated(false);
        setPassword('');
        setList([]);
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(err.response?.data?.error || 'Export failed');
      }
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadTicket = async (ticketId, name) => {
    if (!ticketId) {
      toast.error('No ticket available');
      return;
    }
    setDownloadingId(ticketId);
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
      toast.success(`Ticket for ${name} downloaded`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ticket not found or download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen splash-bg">
        <PageHeader />
        <div className="pt-24 sm:pt-28 flex items-center justify-center px-4 py-12 min-h-screen">
        <form
          onSubmit={handleLogin}
          className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur shadow-2xl card-border-holi max-w-sm w-full animate-scale-in"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta to-holi-green mb-4 sm:mb-6">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-holi w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-holi-magenta outline-none mb-4 min-h-[48px]"
          />
          <button
            type="submit"
            disabled={loggingIn}
            className="btn-holi w-full py-3 rounded-xl font-bold bg-gradient-to-r from-holi-magenta to-holi-green text-white min-h-[48px] neon-border disabled:opacity-70"
          >
            {loggingIn ? 'Verifying…' : 'Login'}
          </button>
        </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen splash-bg">
      <PageHeader />
      <div className="pt-14 sm:pt-16 py-6 sm:py-8 md:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mt-16">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-holi-magenta to-holi-green">Registrations</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="btn-holi px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-semibold min-h-[44px]"
            >
              Logout
            </button>
            <button
              onClick={fetchList}
              disabled={loading}
              className="btn-holi flex-1 sm:flex-none px-4 py-3 rounded-xl bg-holi-blue text-white font-semibold disabled:opacity-70 min-h-[44px]"
            >
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-holi flex-1 sm:flex-none px-4 py-3 rounded-xl bg-holi-green text-white font-semibold disabled:opacity-70 min-h-[44px]"
            >
              {exporting ? 'Exporting…' : 'Download Excel'}
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white/95 backdrop-blur shadow-xl card-border-holi overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="p-8 sm:p-12 text-center text-gray-600">Loading…</div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm min-w-[720px]">
              <thead>
                <tr className="bg-holi-magenta/10 border-b-2 border-holi-magenta/30">
                  <th className="p-2 sm:p-3 font-bold">Name</th>
                  <th className="p-2 sm:p-3 font-bold">Email</th>
                  <th className="p-2 sm:p-3 font-bold">Mobile</th>
                  <th className="p-2 sm:p-3 font-bold">Gender</th>
                  <th className="p-2 sm:p-3 font-bold hidden md:table-cell">Payment ID</th>
                  <th className="p-2 sm:p-3 font-bold">Ticket ID</th>
                  <th className="p-2 sm:p-3 font-bold">Date</th>
                  <th className="p-2 sm:p-3 font-bold text-center">Ticket</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 sm:p-8 text-center text-gray-500">No registrations yet</td></tr>
                ) : (
                  list.map((r) => (
                    <tr key={r._id} className="border-b border-gray-200 hover:bg-holi-magenta/5 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{r.name}</td>
                      <td className="p-2 sm:p-3 truncate max-w-[140px] sm:max-w-[200px]">{r.email}</td>
                      <td className="p-2 sm:p-3">{r.mobile}</td>
                      <td className="p-2 sm:p-3">{r.gender}</td>
                      <td className="p-2 sm:p-3 font-mono text-xs truncate max-w-[100px] md:max-w-[140px] hidden md:table-cell">{r.paymentId || '–'}</td>
                      <td className="p-2 sm:p-3 font-mono">{r.ticketId || '–'}</td>
                      <td className="p-2 sm:p-3 text-gray-600 whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '–'}</td>
                      <td className="p-2 sm:p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadTicket(r.ticketId, r.name)}
                          disabled={!r.ticketId || downloadingId === r.ticketId}
                          className="btn-holi px-3 py-1.5 rounded-lg text-xs font-semibold bg-holi-magenta/90 hover:bg-holi-magenta text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          title={r.ticketId ? 'Download PDF ticket' : 'Ticket PDF not available'}
                        >
                          {downloadingId === r.ticketId ? '…' : r.ticketId ? 'Download' : '–'}
                        </button>
                      </td>
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
