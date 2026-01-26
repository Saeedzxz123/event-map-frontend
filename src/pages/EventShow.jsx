import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import { API_URL } from '../api/config'
import { AuthContext } from '../context/AuthContext'

const EventShow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [event, setEvent] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      const [eRes, cRes, lRes] = await Promise.all([
        axios.get(`${API_URL}/events/${id}`),
        axios.get(`${API_URL}/comments/${id}`),
        axios.get(`${API_URL}/likes/${id}`)
      ])
      setEvent(eRes.data)
      setComments(cRes.data)
      setLikes(lRes.data.count)

      if (user) {
        setLiked(cRes.data.some(c => c.user._id === user._id)) // optional for initial like state
      }
    } catch (err) {
      console.error(err)
    }
  }

useEffect(() => {
  const loadData = async () => {
    await fetchData()
  }

  loadData()
}, )


  const handleLike = async () => {
    if (!token) return alert('Login first')
    try {
      const res = await axios.post(
        `${API_URL}/likes`,
        {},
        { headers: { Authorization: token } }
      )
      setLiked(res.data.liked)

      const lRes = await axios.get(`${API_URL}/likes/${id}`)
      setLikes(lRes.data.count)
    } catch (err) {
      console.error(err)
      alert('Failed to like/unlike')
    }
  }

  const handleComment = async () => {
    if (!token || !newComment) return
    try {
     await axios.post(
  `${API_URL}/likes/${id}`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
)

      )
      setNewComment('')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Failed to post comment')
    }
  }

  const deleteComment = async (commentId) => {
    if (!token) return
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: { Authorization: token }
      })
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Failed to delete comment')
    }
  }

  const deleteEvent = async () => {
    if (!token) return
    try {
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: token }
      })
      navigate('/events') 
    } catch (err) {
      console.error(err)
      alert('Failed to delete event')
    }
  }

  if (!event) return <p>Loading...</p>

  const isOwnerOrAdmin = user && (user.isAdmin || user._id === event.userId._id)

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{event.eventName}</h2>
      <p>{event.eventInformation}</p>
      {event.picture && (
        <img
        src={event.picture}
        alt={event.eventName}
        style={{ maxWidth: '300px', margin: '1rem 0' }}
        />
      )}

      <p>Likes: {likes}</p>
      <button onClick={handleLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>

      {isOwnerOrAdmin && (
        <button
        onClick={deleteEvent}
        style={{ marginLeft: '1rem', background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          Delete Event
        </button>
      )}

      <h3 style={{ marginTop: '2rem' }}>Comments</h3>
      {comments.map(c => (
        <div
        key={c._id}
        style={{
            borderBottom: '1px solid #ccc',
            marginBottom: '0.5rem',
            paddingBottom: '0.5rem'
        }}
        >
        <p>
            <strong>{c.userid.username}:</strong> {c.text}
        </p>
        {(user && (user.isAdmin || user._id === c.user._id)) && (
            <button
            onClick={() => deleteComment(c._id)}
            style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {token && (
        <div style={{ marginTop: '1rem' }}>
          <input
        type="text"
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        style={{ padding: '0.5rem', width: '60%', marginRight: '0.5rem' }}
        />
        <button
        onClick={handleComment}
        style={{
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer'
    }}
          >
            Post Comment
          </button>
        </div>
      )}
    </div>
  )
}

export default EventShow
