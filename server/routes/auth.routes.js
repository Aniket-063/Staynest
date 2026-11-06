const router = require('express').Router()
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  updateMe,
} = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { validateRegister, validateLogin } = require('../middleware/validate.middleware')

router.post('/register', validateRegister, register)
router.post('/login',    validateLogin,    login)
router.get ('/verify-email', verifyEmail)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)
router.get ('/me',       protect,          getMe)
router.put ('/me',       protect,          updateMe)

module.exports = router