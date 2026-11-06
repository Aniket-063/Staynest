const Booking = require('../models/Booking.model')

const PENDING_HOLD_MS = 15 * 60 * 1000 // pending booking 15 min tak dates hold karegi

function findConflict(listingId, checkIn, checkOut) {
  const cutoff = new Date(Date.now() - PENDING_HOLD_MS)
  return Booking.findOne({
    listing: listingId,
    // confirmed hamesha block karti hai; pending sirf 15 min tak
    $or: [
      { status: 'confirmed' },
      { status: 'pending', createdAt: { $gte: cutoff } },
    ],
    // overlap ki simple condition
    checkIn:  { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  })
}

module.exports = { findConflict, PENDING_HOLD_MS }