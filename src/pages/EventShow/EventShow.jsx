import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../api/config'
import { AuthContext } from '../../context/AuthContext'
import { useLikes } from '../../hooks/useLikes'
import { useComments } from '../../hooks/useComments'
import {Container,Row,Col,Card,Button,Form} from 'react-bootstrap'
import './EventShow.css'
import imagePlaceHolder from '../../assets/imagePlaceHolder.png'

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

  if (!event) return <p className="loading-text">Loading...</p>

  const isOwnerOrAdmin =
    user && (user.isAdmin || user._id === event.userId._id)

  return (
    <Container className="event-show-page">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="event-show-card">
            <img
  src={event?.picture ? event.picture : imagePlaceHolder}
  alt={event?.eventName ? event.eventName : 'event'}
  className="event-images"
  onError={(e) => {
    e.currentTarget.src = imagePlaceHolder
  }}
/>


            <Card.Body>
              <h2 className="event-title">{event.eventName}</h2>

              <div className="event-meta">
                {event.country && <h3>Country: {event.country}</h3>}
              </div>

              <div className="event-meta">
                {event.isPaid !== undefined && (
                  <h5>entry fees:
                    {event.isPaid ? '💳 Paid entry' : ' 🆓Free entry'}
                  </h5>
                )}
              </div>

              {event.eventInformation && (
                <p className="event-description"> more information: {event.eventInformation}
                </p>
              )}

              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="event-register-link"
                >
                  Register here →
                </a>
              )}

              <div>Publisher: {event.userId?.username}</div>


              <div className="event-like">
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
  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5
   3 9.24 3 10.91 3.81 12 5.08 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 22 12.28 18.6 15.36 13.45 20.04 L12 21.35z"
/>
  </svg>
  {likes}
</button>

              </div>


              {isOwnerOrAdmin && (
                <div className="event-actions">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(`/events/${id}/edit`)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={async () => {
                      await axios.delete(`${API_URL}/events/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      })
                      navigate('/events')
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>


          <Card className="comments-card">
            <Card.Body>
              <h4 className="comments-title">Comments</h4>

              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  {editingId === c._id ? (
                    <>
                      <Form.Control
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="mb-2"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          updateComment(c._id, editText)
                          setEditingId(null)
                        }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>{c.userId.username}</strong> {c.content}
                      </p>

                      {user &&
                        (user.isAdmin ||
                          user._id === c.userId._id) && (
                          <div className="comment-actions">
                            <Button 
                            variant="outline-secondary"

                              onClick={() => {
                                setEditingId(c._id)
                                setEditText(c.content)
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                            variant="outline-danger"

                              onClick={() => deleteComment(c._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                    </>
                  )}
                </div>
              ))}

              {token && (
                <div className="add-comment">
                  <Form.Control
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      addComment(newComment)
                      setNewComment('')
                    }}
                  > Post
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}


export default EventShow
