import { useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import './Login.css'

const Login = () => {
  const { login } = useContext(AuthContext)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await login(identifier, password)
      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Card.Body>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Log in to your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username or Email</Form.Label>
              <Form.Control
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter your username or email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button type="submit" className="login-btn">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login
