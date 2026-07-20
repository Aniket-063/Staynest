const Listing = require('../models/Listing.model')
const Review  = require('../models/Review.model')
const Booking = require('../models/Booking.model')

// GET /api/listings
async function getListings(req, res) {
  const { category, city, country, minPrice, maxPrice, bedrooms, maxGuests, search, sortBy = 'createdAt', order  = 'desc', page   = 1, limit  = 50 } = req.query
  const filter = {}
  if (category)  filter.category = category
  if (city)      filter['location.city']    = new RegExp(city, 'i')
  if (country)   filter['location.country'] = new RegExp(country, 'i')
  if (bedrooms)  filter.bedrooms  = { $gte: Number(bedrooms) }
  if (maxGuests) filter.maxGuests = { $gte: Number(maxGuests) }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (search) filter.$text = { $search: search }

  const sortOrder = order === 'asc' ? 1 : -1
  const allowedSorts = ['price', 'rating', 'createdAt']
  const sortField = allowedSorts.includes(sortBy) ? sortBy : 'createdAt'
  const skip = (Number(page) - 1) * Number(limit)

  const [listings, total] = await Promise.all([
    Listing.find(filter).populate('host', 'name avatar').sort({ [sortField]: sortOrder }).skip(skip).limit(Number(limit)).lean(),
    Listing.countDocuments(filter),
  ])
  res.json({ listings, total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) })
}

// GET /api/listings/:id
async function getListing(req, res) {
  const listing = await Listing.findById(req.params.id).populate('host', 'name avatar createdAt').lean()
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  res.json(listing)
}

// POST /api/listings
async function createListing(req, res) {
  const listing = await Listing.create({ ...req.body, host: req.user.id })
  res.status(201).json(listing)
}

// PUT /api/listings/:id
async function updateListing(req, res) {
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  if (listing.host.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorised to edit this listing' })
  const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  res.json(updated)
}

// DELETE /api/listings/:id
async function deleteListing(req, res) {
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  if (listing.host.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorised to delete this listing' })
  await listing.deleteOne()
  res.json({ message: 'Listing deleted' })
}

// GET /api/listings/:id/reviews
async function getReviews(req, res) {
  const reviews = await Review.find({ listing: req.params.id }).populate('author', 'name avatar').sort({ createdAt: -1 }).lean()
  res.json(reviews)
}

// POST /api/listings/:id/reviews
async function createReview(req, res) {
  const { rating, comment, bookingId } = req.body
  const booking = await Booking.findOne({ _id: bookingId, guest: req.user.id, listing: req.params.id, status: 'confirmed' })
  if (!booking) return res.status(400).json({ message: 'You can only review listings after a confirmed stay' })
  const review = await Review.create({ listing: req.params.id, author: req.user.id, booking: bookingId, rating, comment })
  const populated = await review.populate('author', 'name avatar')
  res.status(201).json(populated)
}

// GET /api/listings/:id/availability
async function getAvailability(req, res) {
  const { checkIn, checkOut } = req.query
  if (!checkIn || !checkOut) return res.status(400).json({ message: 'checkIn and checkOut are required' })
  const conflict = await Booking.findOne({
    listing: req.params.id,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { checkIn:  { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $gt: new Date(checkIn),  $lte: new Date(checkOut) } },
      { checkIn:  { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
    ],
  })
  res.json({ available: !conflict })
}

module.exports = { getListings, getListing, createListing, updateListing, deleteListing, getReviews, createReview, getAvailability }