# Neon Holi Event – Frontend

React frontend for **Neon Holi Event 2026** registration and ticketing. Built with Vite, Tailwind CSS, and React Router. Talks to the backend API for orders, payment verification, and ticket download.

---

## 🛠 Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **React Router 7** – `/`, `/success`, `/admin`
- **Axios** – API calls
- **React Hot Toast** – notifications

---

## 📁 Structure

```
client/
├── src/
│   ├── components/     # Reusable UI
│   │   ├── Hero.jsx
│   │   ├── SiteHeader.jsx
│   │   ├── PageHeader.jsx
│   │   ├── Highlights.jsx
│   │   ├── AboutEvent.jsx
│   │   ├── CountdownTicker.jsx
│   │   └── RegistrationForm.jsx
│   ├── pages/
│   │   ├── Home.jsx    # Landing + registration
│   │   ├── Success.jsx # Post-payment + ticket download
│   │   └── Admin.jsx   # Registrations list + Excel export
│   ├── api.js          # Backend API client
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.example
├── vite.config.js
└── package.json
```

---

## 🚀 Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server (default port from `VITE_DEV_PORT`, e.g. 6001) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🔐 Environment Variables

Create `client/.env` from `client/.env.example`:

| Variable | Description |
|----------|-------------|
| `VITE_RAZORPAY_KEY` | Razorpay Key ID (same as backend; used for Checkout) |
| `VITE_BACKEND_URL` | Backend base URL (e.g. `http://localhost:5000`). Leave empty to use Vite proxy for `/api` |
| `VITE_DEV_PORT` | Dev server port (default: `6001`; avoid ports like 6000, 6666 if needed) |

---

## 🔌 API Proxy

In development, `vite.config.js` proxies `/api` to `VITE_BACKEND_URL` (default `http://localhost:5000`). So the frontend can call `/api/create-order`, `/api/verify-payment`, etc. without full URLs.

---

## 📦 Build & Deploy

```bash
npm run build
```

Serve the `dist/` folder with any static host (e.g. Vercel, Netlify, Nginx). Set `VITE_BACKEND_URL` to your production API URL before building, or configure your host to proxy `/api` to the backend.

---

For full setup (MongoDB, Razorpay, backend), see the [root README](../README.md).
