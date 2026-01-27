import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../api/config'
import { AuthContext } from '../context/AuthContext'
import { useLikes } from '../hooks/useLikes'
import { useComments } from '../hooks/useComments'

const EventShow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const token = localStorage.getItem('token')

  const [event, setEvent] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const { likes, liked, toggleLike } = useLikes(id, token)
  const { comments, addComment, updateComment, deleteComment } =
    useComments(id, token)

  useEffect(() => {
    axios.get(`${API_URL}/events/${id}`).then(res => setEvent(res.data))
  }, [id])

  if (!event) return <p>Loading...</p>

  const isOwnerOrAdmin =
    user && (user.isAdmin || user._id === event.userId._id)

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{event.eventName}</h2>
      <p>{event.eventInformation}</p>

      {event.picture && (
        <img src={event.picture} alt="" style={{ maxWidth: 300 }} />
      )}

      <div style={{ margin: '1rem 0' }}>
        <button
          onClick={toggleLike}
          style={{
            fontSize: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: liked ? 'red' : '#999'
          }}
        >
          ❤️ {likes}
        </button>
        {liked && <span style={{ marginLeft: 8 }}>You liked this</span>}
      </div>

      {isOwnerOrAdmin && (
        <button
          onClick={async () => {
            await axios.delete(`${API_URL}/events/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            navigate('/events')
          }}
        >
          Delete Event
        </button>
      )}

      <h3>Comments</h3>

      {comments.map(c => (
        <div key={c._id} style={{ borderBottom: '1px solid #ddd' }}>
          {editingId === c._id ? (
            <>
              <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
              <button
                onClick={() => {
                  updateComment(c._id, editText)
                  setEditingId(null)
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>{c.userId.username}</strong>: {c.content}
              </p>
              {(user &&
                (user.isAdmin || user._id === c.userId._id)) && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(c._id)
                      setEditText(c.content)
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteComment(c._id)}>
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}

      {token && (
        <div style={{ marginTop: '1rem' }}>
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            onClick={() => {
              addComment(newComment)
              setNewComment('')
            }}
          >
            Post
          </button>
        </div>
      )}
    </div>
  )
}

export default EventShow
