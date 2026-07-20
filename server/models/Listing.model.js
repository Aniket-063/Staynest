const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 1 },
    images:      [{ type: String }],
    location: {
      city:    { type: String, required: true },
      country: { type: String, required: true },
      lat:     { type: Number, required: true },
      lng:     { type: Number, required: true },
    },
    amenities:   [{ type: String }],
    bedrooms:    { type: Number, default: 1 },
    bathrooms:   { type: Number, default: 1 },
    maxGuests:   { type: Number, default: 2 },
    category:    { type: String, enum: ['beach', 'mountain', 'city', 'countryside', 'luxury'], default: 'city' },
    host:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Text index for search
listingSchema.index({ title: 'text', description: 'text', 'location.city': 'text' })

module.exports = mongoose.model('Listing', listingSchema)