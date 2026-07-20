import axios from 'axios'

const api = axios.create({
  // Ye line automatically live link ya local link utha legi
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('staynest-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('staynest-token')
      localStorage.removeItem('staynest-user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api