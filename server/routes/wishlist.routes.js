const router = require('express').Router()
const ctrl   = require('../controllers/wishlist.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)   // wishlist ke liye login zaroori

router.get   ('/',           ctrl.getWishlist)
router.get   ('/ids',        ctrl.getWishlistIds)
router.post  ('/:listingId', ctrl.addToWishlist)
router.delete('/:listingId', ctrl.removeFromWishlist)

module.exports = router