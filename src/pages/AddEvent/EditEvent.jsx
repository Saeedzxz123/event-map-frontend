import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../api/config'
import { AuthContext } from '../../context/AuthContext'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import './AddEvent.css'

const EditEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const token = localStorage.getItem('token')

  const [formData, setFormData] = useState({
    eventName: '',
    eventInformation: '',
    country: '',
    isPaid: false,
    registrationLink: ''
  })

  const [picture, setPicture] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await axios.get(`${API_URL}/events/${id}`)
      const event = res.data

      if (!user || (!user.isAdmin && user._id !== event.userId._id)) {
        navigate('/events')
        return
      }

      setFormData({
        eventName: event.eventName,
        eventInformation: event.eventInformation,
        country: event.country,
        isPaid: event.isPaid,
        registrationLink: event.registrationLink || ''
      })

      setLoading(false)
    }

    fetchEvent()
  }, [id, user, navigate])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      )
      if (picture) data.append('picture', picture)

      await axios.put(`${API_URL}/events/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      navigate(`/events/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event')
    }
  }

  if (loading) {
    return (
      <Container className="add-event-page">
        <p className="text-center">Loading...</p>
      </Container>
    )
  }

  return (
    <Container className="add-event-page">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="add-event-card">
            <Card.Body>
              <h2 className="add-event-title">Edit event</h2>
              <p className="add-event-subtitle">
                Update your event details below.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Event Information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="eventInformation"
                    value={formData.eventInformation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a country</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Oman">Oman</option>
                        <option value="Qatar">Qatar</option>
                        <option value="UAE">UAE</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="d-flex align-items-end">
                    <Form.Check
                      type="checkbox"
                      name="isPaid"
                      checked={formData.isPaid}
                      onChange={handleChange}
                      label="Paid Event"
                      className="paid-checkbox"
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Registration Link (optional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Update Event Picture (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={e => setPicture(e.target.files[0])}
                  />
                </Form.Group>

                <div className="add-event-actions">
                  <Button type="submit" className="add-event-btn">
                    Update Event
                  </Button>

                  <Button
                    variant="outline-light"
                    onClick={() => navigate(`/events/${id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default EditEvent
