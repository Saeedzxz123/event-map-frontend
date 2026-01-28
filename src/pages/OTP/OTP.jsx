import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../api/config'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import './OTP.css'

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
    } finally {
      setSending(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp) return setMessage('Please enter the OTP')

    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp })
      console.log('OTP verify response:', res.data)

      localStorage.setItem('token', res.data.token)
      const { token, ...userData } = res.data
      console.log(userData)
      setUser(userData)

      setMessage('OTP verified! Logging in...')
      setTimeout(() => navigate('/events'), 1000)
    } catch (err) {
      console.log(err)
      setMessage(err.response?.data?.message || 'OTP verification failed')
    }
  }

  return (
    <Container className="otp-page">
      <Row className="justify-content-center align-items-center">
        <Col md={6} lg={5}>
          <Card className="otp-card">
            <Card.Body>
              <h2 className="otp-title">OTP Verification</h2>
              <p className="otp-subtitle">
                We’ll send a code to your email, then verify it to log you in.
              </p>

              {message && (
                <Alert
                  variant={message.toLowerCase().includes('failed') || message.toLowerCase().includes('not found') || message.toLowerCase().includes('please')
                    ? 'danger'
                    : 'success'}
                >
                  {message}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  readOnly
                  className="otp-email"
                />
              </Form.Group>

              <Button
                onClick={sendOtp}
                disabled={sending}
                className="otp-btn otp-btn-secondary"
              >
                {sending ? 'Sending...' : 'Send OTP'}
              </Button>

              <Form.Group className="mb-4 mt-3">
                <Form.Label>OTP Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  className="otp-input"
                />
              </Form.Group>

              <Button onClick={verifyOtp} className="otp-btn otp-btn-primary">
                Verify OTP
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OTP
