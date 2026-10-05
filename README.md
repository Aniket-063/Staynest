# 🏡 StayNest

An Airbnb-style property booking platform built with the MERN stack. Browse stays around the world, check availability, pay securely with Razorpay, and get travel help from an AI assistant.

**Live demo:** https://staynest-sable.vercel.app

---

## ✨ Features

- **Browse & search** listings with category filters (Beach, Mountain, City, Countryside, Luxury), city search and price range filter
- **Listing details** with image gallery, amenities, host info and an interactive map
- **Interactive maps** (Leaflet + OpenStreetMap) with price markers, including a map of all listings on the home page
- **Real-time availability check** for selected check-in / check-out dates
- **Booking & payments** with Razorpay (Card, UPI, Netbanking, Wallets) and server-side signature verification
- **My Bookings** page with the option to cancel a booking
- **Reviews & ratings**, allowed only after a confirmed stay (one review per booking)
- **Authentication** with JWT (register, login, protected routes)
- **AI travel assistant** chat widget powered by Groq
- **Dark / light mode** with saved preference
- **Responsive UI** built with Tailwind CSS, plus a success animation with confetti after booking

---

## 🛠️ Tech Stack

| Layer     | Technologies                                                        |
| --------- | ------------------------------------------------------------------- |
| Frontend  | React 18, Vite, React Router v6, Tailwind CSS, Axios, React-Leaflet |
| Backend   | Node.js, Express, Mongoose, JWT, bcryptjs                           |
| Database  | MongoDB (Atlas)                                                     |
| Payments  | Razorpay                                                            |
| AI        | Groq API                                                            |
| Hosting   | Vercel (frontend)                                                   |

---

## 📁 Project Structure

```
staynest/
├── client/                     # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Header, Footer, MainLayout, ChatWidget, Modal, LoadingSpinner, HeroSection
│   │   │   ├── listing/        # ListingCard, ListingGrid, BookingCard, ReviewSection, filters
│   │   │   ├── map/            # ListingMap, MultiListingMap
│   │   │   └── payment/        # PaymentForm, BookingSummary, PaymentSuccess, Confetti ...
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # useListings, useListing, useBookings, useReviews
│   │   ├── pages/              # Home, ListingDetail, Checkout, Login, Register, MyBookings, NotFound
│   │   ├── services/api.js     # Axios instance with JWT interceptor
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json             # SPA rewrite rule for Vercel
│   └── package.json
├── server/                     # Express backend
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # auth, listing, booking, payment
│   ├── middleware/             # auth (JWT), validation, error handler
│   ├── models/                 # User, Listing, Booking, Review
│   ├── routes/
│   ├── seed.js                 # Sample listings seeder
│   └── index.js
└── package.json                # Root scripts (runs client + server together)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Razorpay](https://razorpay.com) account (test mode keys are fine)
- A [Groq](https://console.groq.com) API key (for the AI chat widget)

### 1. Clone the repository

```bash
git clone https://github.com/Aniket-063/Staynest.git
cd Staynest
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Set up environment variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GROQ_API_KEY=your_groq_api_key
```

> ⚠️ Never commit `.env` files. They are already listed in `.gitignore`.

### 4. (Optional) Seed the database with sample listings

```bash
cd server
node seed.js
```

### 5. Run the app

From the root folder, start both client and server together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## 🔌 API Overview

| Method | Endpoint                         | Auth | Description                       |
| ------ | -------------------------------- | ---- | --------------------------------- |
| POST   | `/api/auth/register`             | No   | Create an account                 |
| POST   | `/api/auth/login`                | No   | Login and receive a JWT           |
| GET    | `/api/auth/me`                   | Yes  | Get the current user              |
| GET    | `/api/listings`                  | No   | List / filter listings            |
| GET    | `/api/listings/:id`              | No   | Get a single listing              |
| GET    | `/api/listings/:id/availability` | No   | Check date availability           |
| GET    | `/api/listings/:id/reviews`      | No   | Get reviews for a listing         |
| POST   | `/api/listings/:id/reviews`      | Yes  | Add a review (after confirmed stay) |
| GET    | `/api/bookings/my`               | Yes  | Get the logged-in user's bookings |
| PATCH  | `/api/bookings/:id/cancel`       | Yes  | Cancel a booking                  |
| POST   | `/api/payments/create-order`     | Yes  | Create a Razorpay order           |
| POST   | `/api/payments/verify`           | Yes  | Verify payment and confirm booking |

---

## 💳 Testing Payments

The app uses Razorpay in **test mode**:

- **Card:** `4111 1111 1111 1111`, any future expiry, any CVV
- **UPI:** `success@razorpay`

---

## ☁️ Deployment

**Frontend (Vercel)**

1. Import the repo on Vercel and set **Root Directory** to `client`
2. Add environment variables: `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_GROQ_API_KEY`
3. Make sure `client/vercel.json` exists so that React Router routes like `/login` work on refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Backend (Render / Railway / similar)**

1. Deploy the `server` folder as a Node web service (start command: `npm start`)
2. Add all variables from `server/.env`, with `CLIENT_URL` set to your Vercel URL so CORS allows requests
3. Use the deployed URL + `/api` as `VITE_API_URL` on Vercel, then redeploy the frontend

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt and sessions use JWT
- Razorpay payments are verified on the server using HMAC signature checks
- The Groq key in the chat widget is bundled into the frontend. For production, move the AI call to a backend route so the key stays private

---

## 🗺️ Roadmap

- [ ] Host dashboard to create and manage listings
- [ ] Wishlist saved to the database
- [ ] Email confirmation after booking
- [ ] Move the AI chat request to the backend
- [ ] Image upload for listings

---

## 👤 Author

**Aniket**
GitHub: [@Aniket-063](https://github.com/Aniket-063)

---

## 📄 License

This project is for learning and portfolio purposes.