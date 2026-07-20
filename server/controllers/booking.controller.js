const Booking = require('../models/Booking.model')
const Listing = require('../models/Listing.model')

async function createBooking(req, res) {
  const { listingId, checkIn, checkOut, guests } = req.body
  const listing = await Listing.findById(listingId)
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  if (guests > listing.maxGuests) return res.status(400).json({ message: `This listing allows max ${listing.maxGuests} guests` })
  
  const conflict = await Booking.findOne({
    listing: listingId,
    status:  { $in: ['pending', 'confirmed'] },
    $or: [
      { checkIn:  { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $gt: new Date(checkIn),  $lte: new Date(checkOut) } },
      { checkIn:  { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
    ],
  })
  if (conflict) return res.status(409).json({ message: 'These dates are already booked' })
  
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  const totalPrice = listing.price * nights
  const booking = await Booking.create({ listing: listingId, guest: req.user.id, checkIn, checkOut, guests, totalPrice, status: 'pending' })
  const populated = await booking.populate([
    { path: 'listing', select: 'title images location price' },
    { path: 'guest',   select: 'name email' },
  ])
  res.status(201).json(populated)
}

async function getMyBookings(req, res) {
  const bookings = await Booking.find({ guest: req.user.id }).populate('listing', 'title images location price host').sort({ createdAt: -1 }).lean()
  res.json(bookings)
}

async function getBooking(req, res) {
  const booking = await Booking.findById(req.params.id).populate('listing', 'title images location price host').populate('guest', 'name email')
  if (!booking) return res.status(404).json({ message: 'Booking not found' })
  const isGuest = booking.guest._id.toString() === req.user.id
  const isHost  = booking.listing.host?.toString() === req.user.id
  if (!isGuest && !isHost) return res.status(403).json({ message: 'Not authorised' })
  res.json(booking)
}

async function cancelBooking(req, res) {
  const booking = await Booking.findById(req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found' })
  if (booking.guest.toString() !== req.user.id) return res.status(403).json({ message: 'Only the guest can cancel this booking' })
  if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled' })
  booking.status = 'cancelled'
  await booking.save()
  res.json(booking)
}

async function getHostBookings(req, res) {
  const listings = await Listing.find({ host: req.user.id }).select('_id').lean()
  const listingIds = listings.map(l => l._id)
  const bookings = await Booking.find({ listing: { $in: listingIds } }).populate('listing', 'title images price').populate('guest', 'name email avatar').sort({ createdAt: -1 }).lean()
  res.json(bookings)
}

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking, getHostBookings }