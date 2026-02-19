# Neon Holi Event 2026 – Ballia

Event registration and ticketing web app for **Neon Holi Event 2026** at JMB Resort, Ballia. Users can view event details, register, pay ₹99 via Razorpay, and download a PDF ticket. Admin can view all registrations and export to Excel.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, Razorpay Checkout, React Router, React Hot Toast
- **Backend:** Node.js, Express, Mongoose, Razorpay SDK, pdfkit, exceljs, qrcode
- **Database:** MongoDB (Atlas-ready)

## Project Structure

```
HoliEvent/
├── client/          # React frontend
│   └── src/
│       ├── components/  (Hero, Highlights, RegistrationForm)
│       └── pages/       (Home, Success, Admin)
├── server/          # Node backend
│   ├── config/      (db.js)
│   ├── models/      (Registration.js)
│   ├── routes/      (paymentRoutes, adminRoutes)
│   └── utils/       (generateTicket, generateQR)
├── .env.example
└── README.md
```

## Setup

### 1. MongoDB

- Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Get the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/neonholi`).

### 2. Razorpay

- Sign up at [Razorpay](https://razorpay.com/).
- Dashboard → API Keys → Generate Key (use Test mode for development).
- Note **Key ID** and **Key Secret**.

### 3. Backend

```bash
cd server
cp .env.example .env
# Edit .env and set:
#   MONGODB_URI, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, ADMIN_PASSWORD
npm install
npm run dev
```

Server runs at **http://localhost:5000**.

### 4. Frontend

```bash
cd client
cp .env.example .env
# Set VITE_RAZORPAY_KEY to your Razorpay Key ID (same as backend)
npm install
npm run dev
```

App runs at **http://localhost:5173** and proxies `/api` to the backend.

## Environment Variables

**Server (`.env` in `server/`):**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `ADMIN_PASSWORD` | Password for `/admin` |

**Client (`.env` in `client/`):**

| Variable | Description |
|----------|-------------|
| `VITE_RAZORPAY_KEY` | Razorpay Key ID (for Checkout) |

## Features

- **Hero:** Event title, date (28 Feb 2026), time (02:00 PM), venue (JMB Resort, Ballia), entry ₹99, CTA.
- **Highlights:** Live DJ, Food Stalls, Neon Bands, Selfie Zone, Welcome Drink, VIP & Public Zones.
- **Registration:** Name, Mobile (10 digits), Email, Gender, Address; validation and error messages.
- **Payment:** Create order → Razorpay Checkout → Verify signature → Save registration, generate ticket ID `NH2026-XXXX`, QR code, and PDF.
- **Success:** Download ticket PDF; Razorpay receipt is sent by Razorpay to customer email.
- **Admin:** `/admin` – password-protected; table of registrations; **Download Excel** → `neon-holi-registrations.xlsx`.

## API (Backend)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/create-order` | Create Razorpay order (₹99) |
| POST | `/api/verify-payment` | Verify signature, save registration, generate PDF |
| GET | `/api/download-ticket/:ticketId` | Download ticket PDF |
| GET | `/api/registrations` | List all (Admin: `Authorization: Bearer <ADMIN_PASSWORD>`) |
| GET | `/api/export-excel` | Excel export (Admin: same auth) |

## Production

- Set `MONGODB_URI` to your production cluster.
- Use Razorpay **Live** keys and ensure webhook/signature verification is in place.
- Set a strong `ADMIN_PASSWORD`.
- Build frontend: `cd client && npm run build`; serve `dist/` with your preferred server or host.
- Run backend with `npm start` (or a process manager) and ensure CORS/origin is configured for your frontend URL.

---

**Neon Holi Event 2026 – Ballia’s Biggest Neon Celebration.**
