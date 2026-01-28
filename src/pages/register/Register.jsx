import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../api/config'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import './Register.css'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()


    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      if (profilePhoto) formData.append('profilePhoto', profilePhoto)

      await axios.post(`${API_URL}/auth/register`, formData)
      navigate('/otp', { state: { email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="register-page">
      <Card className="register-card">
        <Card.Body>
          <h2 className="register-title">Create account</h2>
          <p className="register-subtitle">Join the community</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Profile Photo (optional)</Form.Label>
              <Form.Control
                type="file"
                onChange={e => setProfilePhoto(e.target.files[0])}
              />
            </Form.Group>

            <Button type="submit" className="register-btn">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Register
