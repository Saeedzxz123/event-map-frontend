import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const OTP = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)


  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!email) {
      setMessage('Email not found. Please register first.')
      navigate('/register')
    }
  }, [email, navigate])

  const sendOtp = async () => {
    setSending(true)
    try {
      await axios.post(`${API_URL}/auth/send-otp`, { email })
      setMessage('OTP sent to your email')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP')
    } 
  }

  const verifyOtp = async () => {
    if (!otp) return setMessage('Please enter the OTP')

    try {
     const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp })
console.log('OTP verify response:', res.data)


      localStorage.setItem('token', res.data.token)
      const { token, ...userData } =  res.data
      console.log(userData)
      setUser( userData)

    setMessage('OTP verified! Logging in...')
    setTimeout(() => navigate('/events'), 1000)

    } catch (err) {
        console.log(err)
      setMessage(err.response?.data?.message || 'OTP verification failed')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>OTP Verification</h2>

      <input
        type="email"
        value={email}
        readOnly
        style={{
          width: '100%',
          marginBottom: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#f0f0f0'
        }}
      />
      <button
        onClick={sendOtp}
        disabled={sending}
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          cursor: 'pointer'
        }}
      >
        {sending ? 'Sending...' : 'Send OTP'}
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <button
        onClick={verifyOtp}
        style={{
          width: '100%',
          padding: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Verify OTP
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  )
}

export default OTP
