import { useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login

