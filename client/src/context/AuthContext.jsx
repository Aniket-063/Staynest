import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('staynest-user')
    return stored ? JSON.parse(stored) : null
  })
  
  const [token, setToken] = useState(() =>
    localStorage.getItem('staynest-token')
  )

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('staynest-user', JSON.stringify(data.user))
    localStorage.setItem('staynest-token', data.token)
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('staynest-user')
    localStorage.removeItem('staynest-token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}