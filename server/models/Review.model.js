const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema(
  {
    listing:  { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    booking:  { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  },
  { timestamps: true }
)

// One review per booking
reviewSchema.index({ booking: 1 }, { unique: true })
// One review per user per listing
reviewSchema.index({ listing: 1, author: 1 }, { unique: true })

// After save: recalculate listing's average rating
reviewSchema.post('save', async function () {
  const Listing = mongoose.model('Listing')
  const stats = await mongoose.model('Review').aggregate([
    { $match: { listing: this.listing } },
    { $group: { _id: '$listing', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  if (stats.length) {
    await Listing.findByIdAndUpdate(this.listing, {
      rating:      Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    })
  }
})
module.exports = mongoose.model('Review', reviewSchema)