function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error ${status}]:`, err.stack)
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

module.exports = { errorHandler }