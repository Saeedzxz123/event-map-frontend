import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import { API_URL } from '../api/config'
import { AuthContext } from '../context/AuthContext'

const EventShow = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [event, setEvent] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    const eRes = await axios.get(`${API_URL}/events/${id}`)
    setEvent(eRes.data)
    const cRes = await axios.get(`${API_URL}/comments/${id}`)
    setComments(cRes.data)
    const lRes = await axios.get(`${API_URL}/likes/${id}`)
    setLikes(lRes.data.count)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLike = async () => {
    if (!token) return alert('Login first')
    const res = await axios.post(`${API_URL}/likes/${id}`, {}, { headers: { Authorization: token } })
    setLiked(res.data.liked)
    const lRes = await axios.get(`${API_URL}/likes/${id}`)
    setLikes(lRes.data.count)
  }

  const handleComment = async () => {
    if (!token || !newComment) return
    await axios.post(`${API_URL}/comments/${id}`, { text: newComment }, { headers: { Authorization: token } })
    setNewComment('')
    fetchData()
  }

  const deleteComment = async (commentId) => {
    if (!token) return
    await axios.delete(`${API_URL}/comments/${commentId}`, { headers: { Authorization: token } })
    fetchData()
  }

  const deleteEvent = async () => {
    if (!token) return
    await axios.delete(`${API_URL}/events/${id}`, { headers: { Authorization: token } })
    window.location.href = '/events'
  }

  if (!event) return <p>Loading...</p>

  const isOwnerOrAdmin = user && (user.isAdmin || user._id === event.userId._id)

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{event.eventName}</h2>
      <p>{event.eventInformation}</p>
      {event.picture && <img src={event.picture} alt={event.eventName} style={{ maxWidth: '300px' }} />}
      <p>Likes: {likes}</p>
      <button onClick={handleLike}>{liked ? 'Unlike' : 'Like'}</button>
      {isOwnerOrAdmin && <button onClick={deleteEvent} style={{ marginLeft: '1rem' }}>Delete Event</button>}

      <h3>Comments</h3>
      {comments.map(c => (
        <div key={c._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '0.5rem' }}>
          <p><strong>{c.user.username}:</strong> {c.text}</p>
          {(user && (user.isAdmin || user._id === c.user._id)) && (
            <button onClick={() => deleteComment(c._id)}>Delete</button>
          )}
        </div>
      ))}
      <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." />
      <button onClick={handleComment}>Post Comment</button>
    </div>
  )
}

export default EventShow
