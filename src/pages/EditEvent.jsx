import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../api/config'
import { AuthContext } from '../context/AuthContext'

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

  if (loading) return <p>Loading...</p>

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Edit Event</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    <label> Event name:
      <input
        type="text"
        name="eventName"
        value={formData.eventName}
        onChange={handleChange}
        required
      />
    </label>

    <lable>
        Event information:
      <textarea
        name="eventInformation"
        value={formData.eventInformation}
        onChange={handleChange}
        required
      />  
      </lable>

    <label>
    country:
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
      >
        <option value="">Countries</option>
        <option value="Bahrain">Bahrain</option>
        <option value="Saudi Arabia">Saudi Arabia</option>
        <option value="Kuwait">Kuwait</option>
        <option value="Oman">Oman</option>
        <option value="Qatar">Qatar</option>
        <option value="UAE">UAE</option>
      </select>
    </label>

      <label>
    Paid Event:

        <input
          type="checkbox"
          name="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
        />
      </label>

    <lable>
        registration Link:
      <input
        type="url"
        name="registrationLink"
        value={formData.registrationLink}
        onChange={handleChange}
      />
    </lable>

    <lable>
        photo:
      <input
        type="file"
        accept="image/*"
        onChange={e => setPicture(e.target.files[0])}
      />
    </lable>   
      <button type="submit">Update Event</button>
    </form>
  )
}

export default EditEvent
