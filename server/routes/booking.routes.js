const router = require('express').Router()
const ctrl   = require('../controllers/booking.controller')
const { protect }         = require('../middleware/auth.middleware')
const { validateBooking } = require('../middleware/validate.middleware')

router.use(protect) // All booking routes require auth

router.post('/',              validateBooking, ctrl.createBooking)
router.get ('/my',                             ctrl.getMyBookings)
router.get ('/host',                           ctrl.getHostBookings)
router.get ('/:id',                            ctrl.getBooking)
router.patch('/:id/cancel',                    ctrl.cancelBooking)

module.exports = router