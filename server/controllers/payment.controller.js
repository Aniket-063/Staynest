const Razorpay = require('razorpay')
const crypto   = require('crypto')
const mongoose = require('mongoose')
const Booking  = require('../models/Booking.model')
const Listing  = require('../models/Listing.model')
const { findConflict } = require('../utils/availability')   // ← top pe le aaye

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

function calcNights(checkIn, checkOut) {
  return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
}

// POST /api/payments/create-order
async function createOrder(req, res) {
  const { listingId, checkIn, checkOut, guests } = req.body

  if (!listingId || !checkIn || !checkOut || !guests)
    return res.status(400).json({ message: 'listingId, checkIn, checkOut and guests are required' })

  const listing = await Listing.findById(listingId)
  if (!listing) return res.status(404).json({ message: 'Listing not found' })

  if (Number(guests) > listing.maxGuests)
    return res.status(400).json({ message: `Max ${listing.maxGuests} guests allowed` })

  // Is user ki purani adhuri (pending) booking isi listing ki cancel kar do
  await Booking.updateMany(
    { listing: listingId, guest: req.user.id, status: 'pending' },
    { status: 'cancelled' }
  )

  const conflict = await findConflict(listingId, checkIn, checkOut)
  if (conflict) return res.status(409).json({ message: 'These dates are already booked' })

  const USD_TO_INR  = Number(process.env.USD_TO_INR) || 90
  const nights      = calcNights(checkIn, checkOut)
  if (nights < 1) return res.status(400).json({ message: 'Minimum 1 night required' })

  const subtotal    = listing.price * nights
  const cleaningFee = 45
  const serviceFee  = Math.round(subtotal * 0.12)
  const totalPrice  = subtotal + cleaningFee + serviceFee
  const totalInr    = Math.round(totalPrice * USD_TO_INR)
  const amountPaise = totalInr * 100

  const order = await razorpay.orders.create({
    amount:   amountPaise,
    currency: 'INR',
    receipt:  `staynest_${Date.now()}`,
  })

  const booking = await Booking.create({
    listing:               listingId,
    guest:                 req.user.id,
    checkIn,
    checkOut,
    guests:                Number(guests),
    totalPrice,
    razorpayOrderId:       order.id,
    status:                'pending',
  })

  res.json({
    orderId:   order.id,
    amount:    order.amount,
    currency:  order.currency,
    keyId:     process.env.RAZORPAY_KEY_ID,
    bookingId: booking._id,
    breakdown: { nights, pricePerNight: listing.price, subtotal, cleaningFee, serviceFee, total: totalPrice, totalInr, rate: USD_TO_INR },
  })
}

// POST /api/payments/verify — frontend se payment complete hone ke baad call hoga
async function verifyPayment(req, res) {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return res.status(400).json({ message: 'Missing payment verification fields' })

  if (!mongoose.isValidObjectId(bookingId))
    return res.status(400).json({ message: 'Invalid booking id' })

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const a = Buffer.from(expected)
  const b = Buffer.from(String(razorpay_signature))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    return res.status(400).json({ message: 'Payment verification failed — signature mismatch' })

  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      guest: req.user.id,
      razorpayOrderId: razorpay_order_id,
      status: { $ne: 'cancelled' },
    },
    { status: 'confirmed', razorpayPaymentId: razorpay_payment_id },
    { new: true }
  ).populate('listing', 'title images location price')

  if (!booking) return res.status(404).json({ message: 'Booking not found for this payment' })
  res.json(booking)
}

module.exports = { createOrder, verifyPayment }