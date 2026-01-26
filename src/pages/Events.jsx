import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { Link } from 'react-router-dom'

const Events = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/events`).then(res => setEvents(res.data))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Events</h2>
      {events.map(e => (
        <div key={e._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{e.eventName}</h3>
          <p>{e.eventInformation}</p>
          <Link to={`/events/${e._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  )
}

export default Events
