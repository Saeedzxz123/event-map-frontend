import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../api/config'
import { Link } from 'react-router-dom'
import {Container,Row,Col,Card,Form,Button} 
from 'react-bootstrap'
import './Events.css'
import imagePlaceHolder from '../../assets/imagePlaceHolder.png'

const Events = () => {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    axios
      .get(`${API_URL}/events`, {
        params: { search, country, page }
      })
      .then(res => {
        setEvents(res.data.events)
        setTotalPages(res.data.totalPages)
      })
  }, [search, country, page])

  return (
    <Container className="events-page">
      <h2 className="events-title">All Events</h2>


      <Row className="events-filters">
        <Col md={8}>
          <Form.Control
            placeholder="Search events..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            value={country}
            onChange={e => {
              setCountry(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Countries</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Oman">Oman</option>
            <option value="Qatar">Qatar</option>
            <option value="UAE">UAE</option>
          </Form.Select>
        </Col>
      </Row>



      <Row>
        {events.map(event => (
          <Col md={6} lg={4} key={event._id} className="mb-4">
            <Card className="event-card">
              <Card.Body>
                <div className="event-image">
                  <img src={event.picture|| imagePlaceHolder}/>                
                </div> 
                <h5 className="event-title">Event name: {event.eventName}</h5>
                <p className="event-country">Country: {event.country}
                </p>
                
                <div>Publisher: {event.userId?.username}</div>

                <Link to={`/events/${event._id}`}>
                  <Button className="event-btn">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      <div className="events-pagination">
        <Button
          variant="outline-light"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}>
          Previous
        </Button>

        <span>Page {page} of {totalPages}</span>

        <Button
          variant="outline-light"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  )
}

export default Events
