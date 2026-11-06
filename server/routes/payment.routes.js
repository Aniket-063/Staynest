const express = require('express')
const router  = express.Router()
const { createOrder, verifyPayment } = require('../controllers/payment.controller')
const { protect } = require('../middleware/auth.middleware')
const { validateBooking } = require('../middleware/validate.middleware')   // ← yeh line add karo

router.post('/create-order', protect, validateBooking, createOrder)        // ← validateBooking yahan add kiya
router.post('/verify',       protect, verifyPayment)

module.exports = router