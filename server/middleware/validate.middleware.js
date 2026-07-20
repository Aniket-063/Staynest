// Lightweight validation middleware — no extra packages needed
function validateRegister(req, res, next) {
  const { name, email, password } = req.body
  const errors = []
  if (!name?.trim() || name.trim().length < 2)
    errors.push('Name must be at least 2 characters')
  if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    errors.push('Valid email is required')
  if (!password || password.length < 6)
    errors.push('Password must be at least 6 characters')
  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}
function validateLogin(req, res, next) {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' })
  next()
}
function validateListing(req, res, next) {
  const { title, description, price, location, category } = req.body
  const errors = []
  if (!title?.trim() || title.trim().length < 5)
    errors.push('Title must be at least 5 characters')
  if (!description?.trim() || description.trim().length < 20)
    errors.push('Description must be at least 20 characters')
  if (!price || isNaN(price) || Number(price) < 1)
    errors.push('Price must be a positive number')
  if (!location?.city || !location?.country)
    errors.push('Location city and country are required')
  if (location?.lat == null || location?.lng == null)
    errors.push('Location coordinates (lat/lng) are required')
  const validCategories = ['beach', 'mountain', 'city', 'countryside', 'luxury']
  if (category && !validCategories.includes(category))
    errors.push(`Category must be one of: ${validCategories.join(', ')}`)
  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}
function validateBooking(req, res, next) {
  const { listingId, checkIn, checkOut, guests } = req.body
  const errors = []
  if (!listingId) errors.push('listingId is required')
  const inDate  = new Date(checkIn)
  const outDate = new Date(checkOut)
  const now     = new Date()
  now.setHours(0, 0, 0, 0)
  if (!checkIn || isNaN(inDate)) errors.push('Valid checkIn date is required')
  if (!checkOut || isNaN(outDate)) errors.push('Valid checkOut date is required')
  if (inDate < now) errors.push('checkIn cannot be in the past')
  if (outDate <= inDate) errors.push('checkOut must be after checkIn')
  if (!guests || isNaN(guests) || Number(guests) < 1)
    errors.push('guests must be at least 1')
  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}
function validateReview(req, res, next) {
  const { rating, comment, bookingId } = req.body
  const errors = []
  if (!bookingId) errors.push('bookingId is required')
  if (!rating || isNaN(rating) || rating < 1 || rating > 5)
    errors.push('Rating must be between 1 and 5')
  if (!comment?.trim() || comment.trim().length < 10)
    errors.push('Comment must be at least 10 characters')
  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}
module.exports = { validateRegister, validateLogin, validateListing, validateBooking, validateReview }