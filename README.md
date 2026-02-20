# Neon Holi Event 2026 – Ballia

Event registration and ticketing web app for **Neon Holi Event 2026** at JMB Resort, Ballia. Users can view event details, register, pay ₹99 via Razorpay, and download a PDF ticket. Admins can view all registrations and export to Excel.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| **Event page** | Hero with event title, date (28 Feb 2026), time (02:00 PM), venue (JMB Resort, Ballia), entry ₹99, and highlights (Live DJ, Food Stalls, Neon Bands, Selfie Zone, Welcome Drink, VIP & Public Zones) |
| **Registration** | Name, mobile (10 digits), email, gender, address with validation and error messages |
| **Payment** | Razorpay Checkout (₹99) → order creation, signature verification, ticket ID `NH2026-XXXX`, QR code, and PDF ticket |
| **Success** | Download ticket PDF; Razorpay sends payment receipt to customer email |
| **Admin** | Password-protected `/admin`: view all registrations, **Download Excel** → `neon-holi-registrations.xlsx` |

---

## 🛠 Tech Stack

| Layer | Stack |
|-------|--------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Axios, React Router 7, React Hot Toast |
| **Backend** | Node.js, Express, Mongoose |
| **Payments** | Razorpay (Checkout + SDK) |
| **Docs & export** | pdfkit, exceljs, qrcode |
| **Database** | MongoDB (Atlas-ready) |

---

## 📁 Project Structure

```
events-booking-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Hero, SiteHeader, PageHeader, Highlights, AboutEvent, CountdownTicker, RegistrationForm
│   │   ├── pages/          # Home, Success, Admin
│   │   ├── api.js          # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── server/                 # Node backend
│   ├── config/             # db.js (MongoDB connection)
│   ├── models/             # Registration.js
│   ├── routes/             # paymentRoutes.js, adminRoutes.js
│   ├── utils/              # generateTicket.js, generateQR.js
│   ├── server.js
│   └── package.json
├── .env.example            # (optional; see client & server .env.example)
├── README.md               # This file
└── client/README.md        # Frontend-specific docs
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **MongoDB** – [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or local)
- **Razorpay** account – [Razorpay](https://razorpay.com/) (use **Test mode** for development)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd events-booking-system
```

### 2. MongoDB

- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/neonholi`)

### 3. Razorpay

- Sign in at [Razorpay Dashboard](https://dashboard.razorpay.com/)
- **Settings → API Keys** → Generate Key (Test mode for dev)
- Copy **Key ID** and **Key Secret**

### 4. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:

| Variable | What to set |
|----------|----------------|
| `MONGODB_URI` | Your MongoDB connection string |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `ADMIN_PASSWORD` | Strong password for `/admin` |

Then:

```bash
npm install
npm run dev
```

Backend runs at **http://localhost:5000**.

### 5. Frontend setup

Open a **new terminal**:

```bash
cd client
cp .env.example .env
```

Edit `client/.env` and set:

| Variable | What to set |
|----------|----------------|
| `VITE_RAZORPAY_KEY` | Same Razorpay Key ID as backend |
| `VITE_BACKEND_URL` | `http://localhost:5000` (or leave empty to use Vite proxy) |

Then:

```bash
npm install
npm run dev
```

Frontend runs at **http://localhost:6001** (default; see `VITE_DEV_PORT` in `client/.env.example`).

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `RAZORPAY_KEY_ID` | Yes | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay Key Secret |
| `ADMIN_PASSWORD` | Yes | Password for `/admin` (Bearer token) |

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_RAZORPAY_KEY` | Yes | Razorpay Key ID (for Checkout) |
| `VITE_BACKEND_URL` | No | Backend URL (e.g. `http://localhost:5000`). Empty = use Vite proxy `/api` |
| `VITE_DEV_PORT` | No | Dev server port (default: `6001`) |

---

## 📡 API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/create-order` | Create Razorpay order (₹99) |
| POST | `/api/verify-payment` | Verify signature, save registration, generate PDF |
| GET | `/api/download-ticket/:ticketId` | Download ticket PDF |
| GET | `/api/registrations` | List all registrations (Admin: `Authorization: Bearer <ADMIN_PASSWORD>`) |
| GET | `/api/export-excel` | Excel export (Admin: same header) |

---

## 🌐 Production

1. Set `MONGODB_URI` to your production MongoDB cluster.
2. Use Razorpay **Live** keys and keep signature verification enabled.
3. Set a strong `ADMIN_PASSWORD`.
4. Build frontend: `cd client && npm run build`; serve the `dist/` folder (e.g. Nginx, Vercel, Netlify).
5. Run backend with `npm start` (or PM2/systemd) and set CORS/origin for your frontend URL.

---

## 📄 License

Use and modify as per your project license.

---

**Neon Holi Event 2026 – Ballia’s biggest neon celebration.**

<img width="1470" height="956" alt="Screenshot 2026-02-20 at 11 41 46 AM" src="https://github.com/user-attachments/assets/9dd3ac5e-7b39-4172-8381-616c2ee56710" />

