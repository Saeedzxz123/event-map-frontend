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
      <h2>Event name: {event.eventName}</h2>

      {event.picture && (
        <img src={event.picture} alt="event" style={{ maxWidth: 300 }} />
      )}


      {event.country && (
        <p>
          <strong>Country:</strong> {event.country}
        </p>
      )}


      {event.eventInformation && (
        <p>
          <strong>Information:</strong> {event.eventInformation}
        </p>
      )}


      {event.registrationLink && (
        <p>
          <strong>Registration:</strong>{' '}
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
          >
            Register here
          </a>
        </p>
      )}


      {event.isPaid !== undefined && (
        <p>
          <strong>Entry:</strong>{' '}
          {event.isPaid ? '💳 Paid entry' : '🆓 Free entry'}
        </p>
      )}


      <div style={{ margin: '1rem 0' }}>
<button
  onClick={toggleLike}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }}
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={liked ? 'red' : 'none'}
    stroke="black"
    strokeWidth="2"
  >
<path
  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
     2 5.42 4.42 3 7.5 3
     9.24 3 10.91 3.81 12 5.08
     13.09 3.81 14.76 3 16.5 3
     19.58 3 22 5.42 22 8.5
     22 12.28 18.6 15.36 13.45 20.04
     L12 21.35z"/>
  </svg>
  {likes}
</button>




        {liked &&  <span style={{ marginLeft: 8 }}></span>}
      </div>


      {isOwnerOrAdmin && (
        <>
          <button onClick={() => navigate(`/events/${id}/edit`)}>
            Edit Event
          </button>

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
        </>
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

              {user &&
                (user.isAdmin || user._id === c.userId._id) && (
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
