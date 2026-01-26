import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { useNavigate } from 'react-router'

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
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      )
      if (picture) data.append('picture', picture)

      await axios.post(`${API_URL}/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Add New Event</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        name="eventName"
        placeholder="Event name"
        value={formData.eventName}
        onChange={handleChange}
        required
      />

      <textarea
        name="eventInformation"
        placeholder="Event information"
        value={formData.eventInformation}
        onChange={handleChange}
        required
      />

      {/* ✅ COUNTRY */}
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
      >
        <option value="">Select country</option>
        <option value="Bahrain">Bahrain</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
        />
        Paid Event
      </label>

      <input
        type="url"
        name="registrationLink"
        placeholder="Registration link (optional)"
        value={formData.registrationLink}
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={e => setPicture(e.target.files[0])}
      />

      <button type="submit">Create Event</button>
    </form>
  )
}

export default AddEvent
