import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { API_URL } from '../api/config'

const Register = () => {
  const { setUser } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      if (profilePhoto) formData.append('profilePhoto', profilePhoto)

      const res = await axios.post(`${API_URL}/auth/register`, formData)
      localStorage.setItem('token', res.data.token)
      setUser(res.data)
      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="file" onChange={e => setProfilePhoto(e.target.files[0])} accept="image/*" />
      <button type="submit">Register</button>
    </form>
  )
}

export default Register
