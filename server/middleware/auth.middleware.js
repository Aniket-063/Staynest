const jwt = require('jsonwebtoken')

function protect(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    const err = new Error('Not authorized — no token')
    err.statusCode = 401
    return next(err)
  }

  const token = authHeader.split(' ')[1]

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    const err = new Error('Not authorized — token invalid')
    err.statusCode = 401
    next(err)
  }
}

module.exports = { protect }