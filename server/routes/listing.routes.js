const router  = require('express').Router()
const ctrl    = require('../controllers/listing.controller')
const { protect }          = require('../middleware/auth.middleware')
const { validateListing, validateReview } = require('../middleware/validate.middleware')

// Public
router.get ('/',                      ctrl.getListings)
router.get ('/:id',                   ctrl.getListing)
router.get ('/:id/reviews',           ctrl.getReviews)
router.get ('/:id/availability',      ctrl.getAvailability)

// Protected
router.post('/',                      protect, validateListing, ctrl.createListing)
router.put ('/:id',                   protect, validateListing, ctrl.updateListing)
router.delete('/:id',                 protect,                  ctrl.deleteListing)
router.post('/:id/reviews',           protect, validateReview,  ctrl.createReview)

module.exports = router