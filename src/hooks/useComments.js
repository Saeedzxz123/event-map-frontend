import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'

export const useComments = (eventId, token) => {
  const [comments, setComments] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadComments = async () => {
      try {
        const res = await axios.get(`${API_URL}/comments/${eventId}`)
        if (isMounted) setComments(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    loadComments()

    return () => {
      isMounted = false
    }
  }, [eventId])

  const addComment = async (content) => {
    await axios.post(
      `${API_URL}/comments/${eventId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const res = await axios.get(`${API_URL}/comments/${eventId}`)
    setComments(res.data)
  }

  const updateComment = async (commentId, content) => {
    await axios.put(
      `${API_URL}/comments/${commentId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const res = await axios.get(`${API_URL}/comments/${eventId}`)
    setComments(res.data)
  }

  const deleteComment = async (commentId) => {
    await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setComments(prev => prev.filter(c => c._id !== commentId))
  }

  return { comments, addComment, updateComment, deleteComment }
}
