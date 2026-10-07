const mongoose = require('mongoose')
const User     = require('../models/User.model')
const Listing  = require('../models/Listing.model')

// GET /api/wishlist  -> saari saved listings (poore details ke saath)
async function getWishlist(req, res) {
  const user = await User.findById(req.user.id).populate('wishlist').lean()
  res.json(user?.wishlist || [])
}

// GET /api/wishlist/ids  -> sirf ids (heart red karne ke liye)
async function getWishlistIds(req, res) {
  const user = await User.findById(req.user.id).select('wishlist').lean()
  res.json((user?.wishlist || []).map(id => id.toString()))
}

// POST /api/wishlist/:listingId  -> add
async function addToWishlist(req, res) {
  const { listingId } = req.params
  if (!mongoose.isValidObjectId(listingId))
    return res.status(400).json({ message: 'Invalid listing id' })
  if (!(await Listing.exists({ _id: listingId })))
    return res.status(404).json({ message: 'Listing not found' })

  await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: listingId } })
  res.json({ wishlisted: true })
}

// DELETE /api/wishlist/:listingId  -> remove
async function removeFromWishlist(req, res) {
  const { listingId } = req.params
  if (!mongoose.isValidObjectId(listingId))
    return res.status(400).json({ message: 'Invalid listing id' })

  await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: listingId } })
  res.json({ wishlisted: false })
}

module.exports = { getWishlist, getWishlistIds, addToWishlist, removeFromWishlist }