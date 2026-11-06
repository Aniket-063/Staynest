const router = require('express').Router()
const { chat } = require('../controllers/chat.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/', protect, chat)

module.exports = router