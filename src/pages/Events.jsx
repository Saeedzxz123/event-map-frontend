import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { Link } from 'react-router-dom'

const Events = () => {
const [events, setEvents] = useState([])
const [search, setSearch] = useState('')
const [country, setCountry] = useState('')
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

useEffect(() => {
  axios.get(`${API_URL}/events`, {
    params: { search, country, page }
  }).then(res => {
    setEvents(res.data.events)
    setTotalPages(res.data.totalPages)
  })
}, [search, country, page])


  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Events</h2>

      <input
  type="text"
    placeholder="Search events..."
    value={search}
    onChange={e => {
    setSearch(e.target.value)
    setPage(1)
  }}
/>

    <select
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

        </select>

      {events.map(e => (
        <div key={e._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{e.eventName}</h3>
          <p>{e.eventInformation}</p>
          <Link to={`/events/${e._id}`}>View Details</Link>
        </div>
      ))}

      <div>
  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
    Previous
  </button>

  <span> Page {page} of {totalPages} </span>

  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
    Next
  </button>
</div>

    </div>
    
  )
}

export default Events
