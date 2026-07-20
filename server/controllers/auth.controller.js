const jwt  = require('jsonwebtoken')
const User = require('../models/User.model')

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already in use' })
  const user  = await User.create({ name, email, password })
  const token = signToken(user._id)
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, isHost: user.isHost },
  })
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' })
  const token = signToken(user._id)
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, isHost: user.isHost },
  })
}

// GET /api/auth/me  (protected)
async function getMe(req, res) {
  const user = await User.findById(req.user.id).select('-__v')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

// PUT /api/auth/me  (protected)
async function updateMe(req, res) {
  const allowed = ['name', 'avatar']
  const updates = {}
  allowed.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  })
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
  res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar })
}

module.exports = { register, login, getMe, updateMe }