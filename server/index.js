require('dotenv').config()
require('express-async-errors')
const express   = require('express')
const cors      = require('cors')
const connectDB = require('./config/db')
const wishlistRoutes = require('./routes/wishlist.routes')

const chatRoutes = require('./routes/chat.routes')
const authRoutes    = require('./routes/auth.routes')
const listingRoutes = require('./routes/listing.routes')
const bookingRoutes = require('./routes/booking.routes')
const paymentRoutes = require('./routes/payment.routes') // We will use this in Phase 5
const { errorHandler } = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))

// ── Stripe webhook needs raw body ────────────────────────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, _res, next) => { req.rawBody = req.body; next() })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/chat', chatRoutes)

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`)
    next()
  })
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'StayNest', time: new Date().toISOString() }))

app.use('/api/auth',     authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes) // Phase 5
app.use('/api/wishlist', wishlistRoutes)

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))
app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 StayNest API → http://localhost:${PORT}`))
})