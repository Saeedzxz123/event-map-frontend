import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../api/config'
import { useNavigate } from 'react-router'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import './AddEvent.css'

const AddEvent = () => {
  const navigate = useNavigate()
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
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      if (picture) data.append('picture', picture)

      await axios.post(`${API_URL}/events`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })

      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
    }
  }

  return (
    <Container className="addevent-page">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="add-event-card">
            <Card.Body>
              <h2 className="addevent-title">Create an event</h2>
              <p className="addevent-subtitle">
                Share your event with the community and let people join.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Event Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="eventName"
                        placeholder="Enter event name"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Event Information</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="eventInformation"
                        placeholder="Describe your event..."
                        value={formData.eventInformation}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

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
                    <Form.Group className="addevent-checkbox">
                      <Form.Check
                        type="checkbox"
                        name="isPaid"
                        checked={formData.isPaid}
                        onChange={handleChange}
                        label="Paid Event"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Registration Link (optional)</Form.Label>
                      <Form.Control
                        type="url"
                        name="registrationLink"
                        placeholder="https://..."
                        value={formData.registrationLink}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Event Picture</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={e => setPicture(e.target.files[0])}
                      />
                      <small className="addevent-help">
                        Upload a cover image for your event (optional).
                      </small>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mt-2">
                    <Button type="submit" className="addevent-btn">
                      Create Event
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AddEvent
