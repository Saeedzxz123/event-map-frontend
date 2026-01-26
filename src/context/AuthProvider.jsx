import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
