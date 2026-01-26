import { useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { useNavigate } from 'react-router'

const OTP = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const sendOtp = async () => {
    try {
      await axios.post(`${API_URL}/auth/send-otp`, { email })
      setMessage('OTP sent to your email')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP')
    }
  }

  const verifyOtp = async () => {
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp })
      setMessage('OTP verified! Please login.')
      navigate('/login')
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>OTP Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>
      <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
      <button onClick={verifyOtp}>Verify OTP</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default OTP
