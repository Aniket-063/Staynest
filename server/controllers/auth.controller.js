const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const { sendVerificationEmail } = require('../utils/sendEmail')

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body
  const existingUser = await User.findOne({ email: email.toLowerCase() })

  if (existingUser) {
    if (!existingUser.isVerified) {
      return res.status(400).json({
        message: 'An account with this email exists but is not verified. Check your email or click resend.',
        needsVerification: true,
        email: existingUser.email,
      })
    }
    return res.status(400).json({ message: 'Email already in use' })
  }

  // Create user with unverified status
  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    isVerified: false,
  })

  // Generate verification token
  const rawToken = user.generateVerificationToken()
  await user.save()

  // Generate verification URL
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const verificationUrl = `${clientUrl}/verify-email?token=${rawToken}`

  // Send verification email
  try {
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
    })
  } catch (err) {
    console.error('Error sending verification email:', err)
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    email: user.email,
  })
}

// GET or POST /api/auth/verify-email
async function verifyEmail(req, res) {
  const token = req.query.token || req.body.token

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' })
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  })

  if (!user) {
    return res.status(400).json({
      message: 'Invalid or expired verification link. Please request a new one.',
    })
  }

  user.isVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpires = undefined
  await user.save()

  const jwtToken = signToken(user._id)

  res.json({
    success: true,
    message: 'Email verified successfully! Welcome to StayNest.',
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isHost: user.isHost,
    },
  })
}

// POST /api/auth/resend-verification
async function resendVerification(req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email address is required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user) {
    return res.status(404).json({ message: 'No account found with this email address.' })
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'This email is already verified. You can sign in.' })
  }

  const rawToken = user.generateVerificationToken()
  await user.save()

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const verificationUrl = `${clientUrl}/verify-email?token=${rawToken}`

  try {
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
    })
  } catch (err) {
    console.error('Error resending verification email:', err)
    return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' })
  }

  res.json({
    success: true,
    message: 'A fresh verification link has been sent to your email.',
    email: user.email,
  })
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: 'Please verify your email address to sign in. We sent a verification link to your email.',
      needsVerification: true,
      email: user.email,
    })
  }

  const token = signToken(user._id)
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isHost: user.isHost,
    },
  })
}

// GET /api/auth/me (protected)
async function getMe(req, res) {
  const user = await User.findById(req.user.id).select('-__v')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

// PUT /api/auth/me (protected)
async function updateMe(req, res) {
  const allowed = ['name', 'avatar']
  const updates = {}
  allowed.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  })
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
  res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar })
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  updateMe,
}